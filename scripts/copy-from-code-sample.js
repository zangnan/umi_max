#!/usr/bin/env node
/**
 * copy-from-code-sample.js
 *
 * 文件夹级复制 + 批量转换工具，支持自动识别文件类型并分别处理：
 *   a. 基础单元配置文件（auto_config.tsx 等）→ 完整转换管线
 *   b. 基础单元入口文件（index.tsx）→ index 生成流程
 *   c. 基础单元方法文件（f.tsx / fun.tsx）→ fun 生成流程
 *   d. 其他 ts/tsx 文件 → 仅应用改写规则
 *   f. 排除的文件 → 跳过
 *
 * 用法:
 *   # 目录模式: 复制整个目录 + 对所有 .tsx 跑完整转换
 *   node scripts/copy-from-code-sample.js --src code_sample/src/pages/hts/dditax.ckts.from/mdts
 *
 *   # 文件模式: 与原 convert-ddbunit-config.js 行为完全一致
 *   node scripts/copy-from-code-sample.js --src code_sample/src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_SYYK_GCB/auto_config.tsx
 *
 * 行为契约:
 *   1. --src 接受文件或目录
 *   2. 目标路径自动派生: 剥 code_sample/ 前缀
 *   3. 目录模式: 先递归复制整棵树,再对每个 .tsx 按类型处理
 *   4. 单个 .tsx 失败 → 继续处理其他文件,末尾汇总打印失败列表
 */
const fs = require('fs');
const path = require('path');

// =================== 从 convert-ddbunit-config.js 内联的函数 ===================

// =================== CLI 解析 ===================
function parseArgs() {
  const args = { _: [] };
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = process.argv[i + 1];
      if (next && !next.startsWith('--')) {
        args[key] = next;
        i++;
      } else {
        args[key] = true;
      }
    } else {
      args._.push(arg);
    }
  }
  return args;
}

function deriveDefaultOutPath(srcPath) {
  const normalized = srcPath.replace(/\\/g, '/');
  if (normalized.startsWith('code_sample/')) {
    return normalized.slice('code_sample/'.length);
  }
  return null;
}

function deriveDefaultReadmePath(outPath) {
  if (!outPath) return null;
  const dir = path.dirname(outPath);
  const base = path.basename(outPath, path.extname(outPath));
  return path.join(dir, `${base}.README.md`);
}

function derivePagePaths(outPath) {
  if (!outPath) return null;
  const dir = path.dirname(outPath);
  const ext = path.extname(outPath);
  const base = path.basename(outPath, ext);
  const stripped = base.endsWith('Config') ? base.slice(0, -'Config'.length) : base;
  return {
    indexFile: path.join(dir, `${stripped}Index${ext}`),
    funFile: path.join(dir, `f${ext}`),
  };
}

function deriveRouteFromOutPath(outPath, basename) {
  if (!outPath || !basename) return null;
  const parentDir = path.dirname(outPath);
  const normalized = parentDir.replace(/\\/g, '/').replace(/^\/+/, '');
  const marker = 'src/pages/';
  const idx = normalized.indexOf(marker);
  const stripped = idx >= 0 ? normalized.slice(idx + marker.length) : normalized;
  const trimmed = stripped.replace(/\/+$/, '');
  const urlPath = trimmed ? `/${trimmed}/${basename}` : `/${basename}`;
  const componentPath = trimmed ? `./${trimmed}/${basename}Index` : `./${basename}Index`;
  return { path: urlPath, component: componentPath };
}

function extractRouteName(srcContent, configVar) {
  if (!srcContent || !configVar) return null;
  const jsdocMatch = srcContent.match(/\/\*\*[\s\S]*?\*\//);
  if (jsdocMatch) {
    const titleMatch = jsdocMatch[0].match(/title:\s*([^*\n]+)/);
    if (titleMatch) {
      const t = titleMatch[1].trim();
      if (t) return t;
    }
  }
  const gridTitle = extractField(srcContent, configVar, ['grid_title']);
  if (gridTitle) return gridTitle;
  const moduleKey = extractField(srcContent, configVar, ['module_key', 'unit_key']);
  if (moduleKey) return moduleKey;
  return null;
}

function extractField(content, configVar, fieldNames) {
  for (const field of fieldNames) {
    const re = new RegExp(
      `${escapeRegExp(configVar)}\\.${field}\\s*=\\s*(['"])([^'"]+)\\1`,
    );
    const m = content.match(re);
    if (m && m[2].trim()) return m[2].trim();
  }
  return null;
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function detectConfigVar(content) {
  const m = content.match(/const\s+(\w+)\s*:\s*any\s*=\s*\{\s*\}/);
  return m ? m[1] : null;
}

function findAssignmentStart(content, varName, key) {
  const re = new RegExp(`(^|\\n)([ \\t]*)${escapeRegExp(varName)}\\.${escapeRegExp(key)}\\b`);
  const m = content.match(re);
  if (!m) return -1;
  return m.index + m[1].length;
}

function findAssignmentEnd(content, keyStartInContent) {
  const eqIdx = content.indexOf('=', keyStartInContent);
  if (eqIdx === -1) return content.length;

  let i = eqIdx + 1;
  let depth = { brace: 0, bracket: 0, paren: 0 };
  let inString = null;
  let escaped = false;

  while (i < content.length) {
    const ch = content[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === inString) {
        inString = null;
      }
    } else {
      if (ch === "'" || ch === '"' || ch === '`') {
        inString = ch;
      } else if (ch === '{') {
        depth.brace++;
      } else if (ch === '}') {
        depth.brace--;
      } else if (ch === '[') {
        depth.bracket++;
      } else if (ch === ']') {
        depth.bracket--;
      } else if (ch === '(') {
        depth.paren++;
      } else if (ch === ')') {
        depth.paren--;
      } else if (
        (ch === ';' || ch === '\n') &&
        depth.brace === 0 &&
        depth.bracket === 0 &&
        depth.paren === 0
      ) {
        return i;
      }
    }
    i++;
  }
  return content.length;
}

function skipTrailingCommentAndNewline(content, valueEndIdx) {
  let i = valueEndIdx;
  if (content[i] === ';') i++;
  while (i < content.length && content[i] !== '\n') {
    if (content[i] === '/' && content[i + 1] === '/') {
      while (i < content.length && content[i] !== '\n') i++;
      break;
    }
    i++;
  }
  while (i < content.length && content[i] === '\n') i++;
  return i;
}

function nestedRenameInBlock(content, varName, blockKey, renames) {
  const re = new RegExp(`(${escapeRegExp(varName)}\\.${escapeRegExp(blockKey)}\\s*=\\s*\\{)`);
  const m = content.match(re);
  if (!m) return { content, changed: false };

  const startIdx = m.index + m[0].length;
  let i = startIdx;
  let depth = 0;
  let inString = null;
  let escaped = false;
  while (i < content.length) {
    const ch = content[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === inString) {
        inString = null;
      }
    } else {
      if (ch === "'" || ch === '"' || ch === '`') {
        inString = ch;
      } else if (ch === '{') {
        depth++;
      } else if (ch === '}') {
        if (depth === 0) break;
        depth--;
      }
    }
    i++;
  }
  const endIdx = i;

  const blockContent = content.slice(startIdx, endIdx);
  let newBlock = blockContent;
  for (const [oldKey, newKey] of Object.entries(renames)) {
    const keyRe = new RegExp(`\\b${escapeRegExp(oldKey)}\\s*:`, 'g');
    newBlock = newBlock.replace(keyRe, `${newKey}:`);
  }

  return {
    content: content.slice(0, startIdx) + newBlock + content.slice(endIdx),
    changed: newBlock !== blockContent,
  };
}

function removeTopLevelKey(content, varName, key) {
  const startIdx = findAssignmentStart(content, varName, key);
  if (startIdx === -1) return { content, removed: false };
  const indentMatch = content.slice(startIdx).match(/^[ \t]*/);
  const keyStartInContent = startIdx + indentMatch[0].length;
  const endIdx = findAssignmentEnd(content, keyStartInContent);
  const trimEnd = skipTrailingCommentAndNewline(content, endIdx);
  return {
    content: content.slice(0, startIdx) + content.slice(trimEnd),
    removed: true,
  };
}

function renameTopLevelKey(content, varName, oldKey, newKey) {
  const re = new RegExp(`(${escapeRegExp(varName)}\\.)${escapeRegExp(oldKey)}\\b`, 'g');
  if (!re.test(content)) return { content, renamed: false };
  return { content: content.replace(re, `$1${newKey}`), renamed: true };
}

function prependImports(content, imports) {
  const added = [];
  for (const imp of imports) {
    if (content.includes(imp)) continue;
    const firstImportMatch = content.match(/^import\s/m);
    if (firstImportMatch) {
      content = content.slice(0, firstImportMatch.index) + imp + '\n' + content.slice(firstImportMatch.index);
    } else {
      content = imp + '\n' + content;
    }
    added.push(imp);
  }
  return { content, added };
}

function removeImports(content, importPatterns) {
  const removed = [];
  for (const pattern of importPatterns) {
    const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`^[ \\t]*${escaped}\\s*\\n`, 'm');
    if (re.test(content)) {
      content = content.replace(re, '');
      removed.push(pattern);
    }
  }
  return { content, removed };
}

// =================== SPECIAL_FIELD_RULES ===================
const SPECIAL_FIELD_RULES = [
  {
    name: '业务类型代码列加 ellipsis',
    apply: addEllipsisForBusinessTypeCode,
  },
  {
    name: '默认节点 + toolbar_default 规则',
    apply: ensureDefaultNodesAndToolbarRules,
  },
  {
    name: 'form_items TextArea 项标准化',
    apply: normalizeTextAreaFormItems,
  },
  {
    name: 'codeTable 数组 → 字符串 (r15)',
    apply: transformCodeTableArrays,
  },
  {
    name: 'form_api_save/delete 重命名 + 剥 ${API_URL_BASE} 前缀 (r16)',
    apply: transformFormApiSaveDelete,
  },
  {
    name: 'form_api_save_upload 剥 ${API_URL_BASE} 前缀 (r17)',
    apply: transformFormApiSaveUpload,
  },
  {
    name: 'form_items readOnly → disabled (r18)',
    apply: transformReadOnlyToDisabled,
  },
  {
    name: 'form_items base_date format YYYY/YY → yyyy/yy (r19)',
    apply: transformBaseDateFormatNormalize,
  },
];

function applySpecialFieldRules(content, configVar) {
  let out = content;
  let totalCount = 0;
  for (const rule of SPECIAL_FIELD_RULES) {
    const result = rule.apply(out, configVar);
    if (result.count > 0) {
      out = result.content;
      totalCount += result.count;
      console.log(`[convert] r11 ${rule.name}: 命中 ${result.count} 处`);
    }
  }
  return { content: out, count: totalCount };
}

function addEllipsisForBusinessTypeCode(content, configVar) {
  const startRe = new RegExp(`${escapeRegExp(configVar)}\\.grid_columns\\s*=\\s*\\[`);
  const startMatch = startRe.exec(content);
  if (!startMatch) return { content, count: 0 };

  const startIdx = startMatch.index + startMatch[0].length;
  let depth = 1;
  let i = startIdx;
  while (i < content.length && depth > 0) {
    const ch = content[i];
    if (ch === '[') depth++;
    else if (ch === ']') depth--;
    if (depth === 0) break;
    i++;
  }
  if (depth !== 0) return { content, count: 0 };
  const endIdx = i;

  const block = content.slice(startIdx, endIdx);
  const columnRe = /\{([^{}]*?title:\s*['"]业务类型代码['"][^{}]*?)(\s*)\}/g;
  let count = 0;
  const newBlock = block.replace(columnRe, (match, inner, trailingWs) => {
    if (/\bellipsis\s*:/.test(inner)) return match;
    count++;
    const updated = inner.replace(/,\s*$/, '').trimEnd() + ', ellipsis: true';
    return `{${updated}${trailingWs}}`;
  });

  return {
    content: content.slice(0, startIdx) + newBlock + content.slice(endIdx),
    count,
  };
}

const TOOLBAR_DEFAULT_RULES = [];

function extractFieldFromToolbarDefault(content, configVar, fieldName, valueMatcher) {
  const startRe = new RegExp(`${escapeRegExp(configVar)}\\.toolbar_default\\s*=\\s*\\{`);
  const startMatch = startRe.exec(content);
  if (!startMatch) return null;

  const startIdx = startMatch.index + startMatch[0].length;
  let depth = 1;
  let i = startIdx;
  while (i < content.length && depth > 0) {
    const ch = content[i];
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
    if (depth === 0) break;
    i++;
  }
  if (depth !== 0) return null;
  const endIdx = i;

  const block = content.slice(startIdx, endIdx);
  const m = block.match(valueMatcher);
  if (!m) return null;
  return m[1] !== undefined ? m[1] : m[0];
}

function insertBeforeExportDefault(content, insertion) {
  const exportRe = /export\s+default\s+/;
  const m = exportRe.exec(content);
  if (m) {
    return content.slice(0, m.index) + insertion + content.slice(m.index);
  }
  const sep = content.endsWith('\n') ? '' : '\n';
  return content + sep + insertion;
}

function appendEntryToCustomerToolbar(content, configVar, entry) {
  const startRe = new RegExp(`${escapeRegExp(configVar)}\\.customer_toolbar\\s*=\\s*\\[`);
  const startMatch = startRe.exec(content);
  if (!startMatch) return content;

  const bracketPos = startMatch.index + startMatch[0].length - 1;
  let j = bracketPos + 1;
  while (j < content.length && /\s/.test(content[j])) j++;
  if (content[j] === ']') {
    return content.slice(0, bracketPos + 1) + entry + content.slice(bracketPos + 1);
  }
  return content.slice(0, bracketPos + 1) + entry + ',' + content.slice(bracketPos + 1);
}

function ensureDefaultNodesAndToolbarRules(content, configVar) {
  let out = content;
  let count = 0;

  const entries = [];
  for (const rule of TOOLBAR_DEFAULT_RULES) {
    const value = extractFieldFromToolbarDefault(out, configVar, rule.fieldName, rule.valueMatcher);
    if (value === null) continue;
    const entry = rule.buildEntry(value);
    const nameRegex = new RegExp(`name:\\s*['"]${rule.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`);
    if (nameRegex.test(out)) continue;
    entries.push(entry);
  }

  const hasCustomerToolbarRe = new RegExp(`${escapeRegExp(configVar)}\\.customer_toolbar\\s*=\\s*\\[`);
  if (!hasCustomerToolbarRe.test(out)) {
    const initial = entries.length > 0 ? `[${entries.join(',')}]` : '[]';
    out = insertBeforeExportDefault(out, `${configVar}.customer_toolbar = ${initial};\n`);
    if (entries.length > 0) count++;
  } else {
    for (const entry of entries) {
      out = appendEntryToCustomerToolbar(out, configVar, entry);
      count++;
    }
  }

  const hasHandleColumnsRe = new RegExp(`${escapeRegExp(configVar)}\\.handle_columns\\s*=\\s*\\[`);
  if (!hasHandleColumnsRe.test(out)) {
    out = insertBeforeExportDefault(out, `${configVar}.handle_columns = [];\n`);
    count++;
  }

  return { content: out, count };
}

function stripObjectField(content, fieldName) {
  const re = new RegExp(`(,?\\s*)${fieldName}\\s*:\\s*\\{`, 'g');
  let changed = false;
  let out = content;
  let m;
  while ((m = re.exec(out)) !== null) {
    const matchStart = m.index;
    const valueStart = m.index + m[0].length;
    let depth = 1;
    let i = valueStart;
    while (i < out.length && depth > 0) {
      if (out[i] === '{') depth++;
      else if (out[i] === '}') depth--;
      if (depth === 0) break;
      i++;
    }
    if (depth !== 0) break;
    out = out.slice(0, m.index) + out.slice(i + 1);
    re.lastIndex = 0;
    changed = true;
  }
  return out;
}

function transformTextAreaFormItem(content, configVar) {
  const startRe = new RegExp(`${escapeRegExp(configVar)}\\.form_items\\s*=\\s*\\[`);
  const startMatch = startRe.exec(content);
  if (!startMatch) return content;

  const startIdx = startMatch.index + startMatch[0].length;
  let depth = 1;
  let i = startIdx;
  while (i < content.length && depth > 0) {
    if (content[i] === '[') depth++;
    else if (content[i] === ']') depth--;
    if (depth === 0) break;
    i++;
  }
  if (depth !== 0) return content;
  const endIdx = i;

  const block = content.slice(startIdx, endIdx);
  let count = 0;
  let newBlock = '';
  let pos = 0;
  while (pos < block.length) {
    while (pos < block.length && /\s/.test(block[pos])) {
      newBlock += block[pos];
      pos++;
    }
    if (pos >= block.length) break;
    if (block[pos] !== '{') {
      newBlock += block[pos];
      pos++;
      continue;
    }
    const itemStart = pos;
    let d = 1;
    let j = pos + 1;
    while (j < block.length && d > 0) {
      if (block[j] === '{') d++;
      else if (block[j] === '}') d--;
      if (d === 0) break;
      j++;
    }
    if (d !== 0) {
      newBlock += block.slice(itemStart);
      break;
    }
    const itemEnd = j;
    const itemInner = block.slice(itemStart + 1, itemEnd);

    if (/type:\s*['"]TextArea['"]/.test(itemInner)) {
      let newInner = stripObjectField(itemInner, 'autoSize');
      newInner = stripObjectField(newInner, 'layout');
      newInner = newInner.replace(/,\s*$/, '').trimEnd()
        + ', autoSize: { minRows: 3, maxRows: 3 }, layout: CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW';
      newBlock += `{${newInner}}`;
      count++;
    } else {
      newBlock += block.slice(itemStart, itemEnd + 1);
    }
    pos = itemEnd + 1;
  }

  return {
    content: content.slice(0, startIdx) + newBlock + content.slice(endIdx),
    count,
  };
}

function normalizeTextAreaFormItems(content, configVar) {
  return transformTextAreaFormItem(content, configVar);
}

// =================== r15: codeTable 数组 → 字符串 ===================
function transformCodeTableArrays(content, configVar) {
  const blockKeys = ['filter_items', 'form_items', 'grid_columns', 'grid_columns_tj'];
  let out = content;
  let count = 0;

  for (const blockKey of blockKeys) {
    const startRe = new RegExp(`${escapeRegExp(configVar)}\\.${blockKey}\\s*=\\s*\\[`);
    const startMatch = startRe.exec(out);
    if (!startMatch) continue;

    const startIdx = startMatch.index + startMatch[0].length;
    let depth = 1;
    let i = startIdx;
    while (i < out.length && depth > 0) {
      const ch = out[i];
      if (ch === '[') depth++;
      else if (ch === ']') depth--;
      if (depth === 0) break;
      i++;
    }
    if (depth !== 0) continue;
    const endIdx = i;

    const codeTableRe = /codeTable\s*:\s*\[\s*(['"])([^'"]+)\1\s*,\s*(['"])([^'"]+)\3\s*\]/g;
    const block = out.slice(startIdx, endIdx);
    let blockCount = 0;
    const newBlock = block.replace(codeTableRe, (_match, _q1, key, _q2, view) => {
      blockCount++;
      return `codeTable: '${key}:${view}'`;
    });

    if (blockCount > 0) {
      out = out.slice(0, startIdx) + newBlock + out.slice(endIdx);
      count += blockCount;
    }
  }

  return { content: out, count };
}

// =================== r16: form_api_save/delete ===================
function transformFormApiSaveDelete(content, configVar) {
  let out = content;
  let count = 0;

  const saveRe = new RegExp(
    '(' + escapeRegExp(configVar) + '\\.)\\bform_api_save\\b(\\s*=\\s*)\`\\$\\{API_URL_BASE\\}(/[^\`]*)\`',
    'g',
  );
  out = out.replace(saveRe, (_match, prefix, eq, path) => {
    count++;
    return prefix + 'api_form_edit' + eq + '`' + path + '`';
  });

  const deleteRe = new RegExp(
    '(' + escapeRegExp(configVar) + '\\.)\\bform_api_delete\\b(\\s*=\\s*)\`\\$\\{API_URL_BASE\\}(/[^\`]*)\`',
    'g',
  );
  out = out.replace(deleteRe, (_match, prefix, eq, path) => {
    count++;
    return `${prefix}api_form_delete${eq}\`${path}\``;
  });

  return { content: out, count };
}

// =================== r17: form_api_save_upload ===================
function transformFormApiSaveUpload(content, configVar) {
  const re = new RegExp(
    '(' + escapeRegExp(configVar) + '\\.)\\bform_api_save_upload\\b(\\s*=\\s*)\`\\$\\{API_URL_BASE\\}(/[^\`]*)\`',
    'g',
  );
  let count = 0;
  const out = content.replace(re, (_match, prefix, eq, path) => {
    count++;
    return prefix + 'form_api_save_upload' + eq + '`' + path + '`';
  });
  return { content: out, count };
}

// =================== r18: readOnly → disabled ===================
function transformReadOnlyToDisabled(content, configVar) {
  const startRe = new RegExp(
    `${escapeRegExp(configVar)}\\.form_items\\s*=\\s*\\[`,
  );
  const startMatch = startRe.exec(content);
  if (!startMatch) return { content, count: 0 };

  const startIdx = startMatch.index + startMatch[0].length;
  let depth = 1;
  let i = startIdx;
  while (i < content.length && depth > 0) {
    const ch = content[i];
    if (ch === '[') depth++;
    else if (ch === ']') depth--;
    if (depth === 0) break;
    i++;
  }
  if (depth !== 0) return { content, count: 0 };
  const endIdx = i;

  const block = content.slice(startIdx, endIdx);
  const matches = block.match(/\breadOnly\s*:\s*true\b/g);
  const count = matches ? matches.length : 0;
  if (count === 0) return { content, count: 0 };
  const replaced = block.replace(
    /\breadOnly\s*:\s*true\b/g,
    'disabled: true',
  );

  return {
    content: content.slice(0, startIdx) + replaced + content.slice(endIdx),
    count,
  };
}

// =================== r19: base_date format ===================
function transformBaseDateFormatNormalize(content, configVar) {
  const startRe = new RegExp(
    `${escapeRegExp(configVar)}\\.form_items\\s*=\\s*\\[`,
  );
  const startMatch = startRe.exec(content);
  if (!startMatch) return { content, count: 0 };

  const startIdx = startMatch.index + startMatch[0].length;
  let depth = 1;
  let i = startIdx;
  while (i < content.length && depth > 0) {
    const ch = content[i];
    if (ch === '[') depth++;
    else if (ch === ']') depth--;
    if (depth === 0) break;
    i++;
  }
  if (depth !== 0) return { content, count: 0 };
  const endIdx = i;

  const block = content.slice(startIdx, endIdx);
  let count = 0;
  const replaced = block.replace(
    /(\{\s*type\s*:\s*['"]base_date['"][^{}]*?format\s*:\s*['"])([^'"]+)(['"])/g,
    (match, prefix, formatValue, suffix) => {
      const newFormat = formatValue
        .replace(/YYYY/g, 'yyyy')
        .replace(/YY/g, 'yy');
      if (newFormat !== formatValue) count++;
      return prefix + newFormat + suffix;
    },
  );
  if (count === 0) return { content, count: 0 };
  return {
    content: content.slice(0, startIdx) + replaced + content.slice(endIdx),
    count,
  };
}

// =================== r7: render 函数转换 ===================
function transformRenderFunctions(content) {
  const re = /render\s*:\s*\(?\s*text(?:\s*:\s*\w+)?\s*\)?\s*=>\s*\(?\s*myUtil\.text\.formatNum\(\s*text\s*,\s*(['"])([^'"]+)\1\s*\)\s*\)?/g;
  let count = 0;
  const newContent = content.replace(re, (_match, _quote, format) => {
    count++;
    return `render: { type: 'number', format: '${format}' }`;
  });
  return { content: newContent, count };
}

// =================== r8: 日期格式归一化 ===================
function normalizeDateFormats(content) {
  const re = /(format\s*:\s*['"])([^'"]*?)(['"])/g;
  let count = 0;
  const newContent = content.replace(re, (match, prefix, format, suffix) => {
    if (!format.includes('yyyy')) return match;
    count++;
    return `${prefix}${format.replace(/yyyy/g, 'YYYY')}${suffix}`;
  });
  return { content: newContent, count };
}

// =================== 路由构建 ===================
const DEFAULT_NAME_MAPPING = {
  monthData: '月度计划',
  seasonData: '季度计划',
  yearData: '年度计划',
};

function buildRouteEntry({ configImportName, nameMapping, pathTemplate, outPath, nameOverride, indexFile, parentPath }) {
  const basename = configImportName.endsWith('Config')
    ? configImportName.slice(0, -'Config'.length)
    : configImportName;
  const name = nameOverride
    || (nameMapping && nameMapping[basename])
    || DEFAULT_NAME_MAPPING[basename]
    || basename;
  const derived = deriveRouteFromOutPath(outPath, basename);
  let routePath;
  let component;
  if (parentPath) {
    const parentDirBasename = path.basename(path.dirname(outPath));
    const indexBase = indexFile
      ? path.basename(indexFile, path.extname(indexFile))
      : basename;
    routePath = `${parentPath}/${parentDirBasename}/${indexBase}`;
    if (derived) {
      if (indexFile) {
        const indexBaseForComp = path.basename(indexFile, path.extname(indexFile));
        const dir = path.dirname(indexFile);
        const normalized = dir.replace(/\\/g, '/').replace(/^\/+/, '');
        const marker = 'src/pages/';
        const idx = normalized.indexOf(marker);
        const stripped = idx >= 0 ? normalized.slice(idx + marker.length) : normalized;
        const trimmed = stripped.replace(/\/+$/, '');
        component = trimmed ? `./${trimmed}/${indexBaseForComp}` : `./${indexBaseForComp}`;
      } else {
        component = derived.component;
      }
    } else {
      component = `./hts/saasMdt/tuiShuiJiHua/${basename}Index`;
    }
  } else if (derived) {
    routePath = derived.path;
    if (indexFile) {
      const indexBase = path.basename(indexFile, path.extname(indexFile));
      const dir = path.dirname(indexFile);
      const normalized = dir.replace(/\\/g, '/').replace(/^\/+/, '');
      const marker = 'src/pages/';
      const idx = normalized.indexOf(marker);
      const stripped = idx >= 0 ? normalized.slice(idx + marker.length) : normalized;
      const trimmed = stripped.replace(/\/+$/, '');
      component = trimmed ? `./${trimmed}/${indexBase}` : `./${indexBase}`;
    } else {
      component = derived.component;
    }
  } else {
    routePath = (pathTemplate || '/hts/saasMdt/tuiShuiJiHua/{basename}').replace('{basename}', basename);
    component = `./hts/saasMdt/tuiShuiJiHua/${basename}Index`;
  }
  return { name, path: routePath, component };
}

function addRouteToCktsFile({ cktsFile, newEntry, parentPath }) {
  const content = fs.readFileSync(cktsFile, 'utf-8');
  const pathMarker = `path: '${newEntry.path}'`;
  if (content.includes(pathMarker)) {
    const existingRe = new RegExp(
      `\\{[^{}]*${pathMarker.replace(/'/g, "\\'")}[^{}]*component:\\s*'([^']+)'[^{}]*\\}`,
    );
    const existingMatch = existingRe.exec(content);
    if (existingMatch && existingMatch[1] === newEntry.component) {
      return { added: false, content };
    }
    if (existingMatch) {
      const newLine = `{ name: '${newEntry.name}', path: '${newEntry.path}', component: '${newEntry.component}' }`;
      const newContent = content.replace(existingRe, newLine);
      fs.writeFileSync(cktsFile, newContent, 'utf-8');
      return { added: true, updated: true, content: newContent };
    }
    return { added: false, content };
  }
  let insertPos;
  if (parentPath) {
    const parentRe = new RegExp(
      `\\{[^{}]*path:\\s*'${parentPath.replace(/'/g, "\\'")}'[^{}]*routes:\\s*\\[`,
    );
    const parentMatch = content.match(parentRe);
    if (!parentMatch) {
      throw new Error(
        `未找到 parentPath 指定的父节点: ${parentPath} (在 ${cktsFile} 中)`,
      );
    }
    insertPos = parentMatch.index + parentMatch[0].length;
  } else {
    const routesArrayRe = /(routes:\s*\[)/;
    const m = content.match(routesArrayRe);
    if (!m) {
      return { added: false, content, error: '未找到 routes: [ 数组' };
    }
    insertPos = m.index + m[0].length;
  }
  const indent = detectIndentBefore(content, insertPos);
  const newLine = `\n${indent}{ name: '${newEntry.name}', path: '${newEntry.path}', component: '${newEntry.component}' },`;
  const newContent = content.slice(0, insertPos) + newLine + content.slice(insertPos);
  fs.writeFileSync(cktsFile, newContent, 'utf-8');
  return { added: true, content: newContent };
}

function detectIndentBefore(content, pos) {
  let lineStart = pos;
  while (lineStart > 0 && content[lineStart - 1] !== '\n') lineStart--;
  const linePrefix = content.slice(lineStart, pos);
  const m = linePrefix.match(/^([ \t]*)/);
  const baseIndent = m ? m[1] : '';
  return baseIndent + '  ';
}

// =================== README 生成 ===================
function generateReadme({ srcFile, outFile, configVar, actions, rules }) {
  const lines = [];
  const outFileName = path.basename(outFile || '', path.extname(outFile || ''));
  const titleBase = outFileName || configVar || 'config';
  lines.push(`# ${titleBase} 转换说明`);
  lines.push('');
  lines.push('> 本文件由 `scripts/copy-from-code-sample.js` 自动生成，描述新旧配置的字段映射关系。');
  lines.push('');
  lines.push('## 路径信息');
  lines.push('');
  lines.push(`- **源文件路径**：\`${srcFile}\``);
  lines.push(`- **目标文件路径**：\`${outFile}\``);
  if (rules.header?.referenceFile) {
    lines.push(`- **参考标准**：\`${rules.header.referenceFile}\``);
  }
  if (rules.header?.protocolFile) {
    lines.push(`- **协议基础**：\`${rules.header.protocolFile}\``);
  }
  lines.push(`- **配置变量名**：\`${configVar}\``);
  lines.push('');
  lines.push('## 顶层 key 映射表');
  lines.push('');
  lines.push('| # | 源 key | 目标 key | 处理 |');
  lines.push('| --- | --- | --- | --- |');
  let i = 1;
  for (const { from, to } of actions.renames) {
    lines.push(`| ${i++} | \`${from}\` | \`${to}\` | 重命名 |`);
  }
  for (const { from, to, in: inBlock } of actions.toolbarRenames) {
    lines.push(`| ${i++} | \`${from}\` (in \`${inBlock}\`) | \`${to}\` | 重命名（嵌套） |`);
  }
  for (const key of actions.removes) {
    lines.push(`| ${i++} | \`${key}\` | — | 删除 |`);
  }
  for (const imp of actions.imports) {
    lines.push(`| ${i++} | — | \`${imp.replace(/\|/g, '\\|')}\` | 新增 import |`);
  }
  if (actions.renderTransforms > 0) {
    lines.push(`| ${i++} | \`render: (text) => myUtil.text.formatNum(...)\` | \`render: { type: 'number', format } \` | 转换 (r7) |`);
  }
  if (actions.dateFormatNormalizes > 0) {
    lines.push(`| ${i++} | \`format: 'yyyy-...'\` | \`format: 'YYYY-...'\` | 归一化 (r8) |`);
  }
  if (actions.specialFieldRules > 0) {
    lines.push(`| ${i++} | grid_columns 特殊字段补全 | ellipsis: true 等 | 应用规则 (r11) |`);
  }
  lines.push('');
  lines.push('## 详细变化');
  lines.push('');
  lines.push('### 重命名的 key');
  if (actions.renames.length === 0) {
    lines.push('（无）');
  } else {
    for (const { from, to } of actions.renames) {
      lines.push(`- \`${configVar}.${from}\` → \`${configVar}.${to}\``);
    }
  }
  lines.push('');
  lines.push('### 嵌套重命名的 key');
  if (actions.toolbarRenames.length === 0) {
    lines.push('（无）');
  } else {
    for (const { from, to, in: inBlock } of actions.toolbarRenames) {
      lines.push(`- \`${configVar}.${inBlock}.${from}\` → \`${configVar}.${inBlock}.${to}\``);
    }
  }
  lines.push('');
  lines.push('### 删除的 key');
  if (actions.removes.length === 0) {
    lines.push('（无）');
  } else {
    for (const key of actions.removes) {
      lines.push(`- \`${configVar}.${key}\``);
    }
  }
  lines.push('');
  lines.push('### 新增的 import');
  if (actions.imports.length === 0) {
    lines.push('（无）');
  } else {
    for (const imp of actions.imports) {
      lines.push(`- \`${imp}\``);
    }
  }
  lines.push('');
  lines.push('### render 函数形式转换（r7）');
  if (!actions.renderTransforms) {
    lines.push('（无）');
  } else {
    lines.push(`- 共转换 **${actions.renderTransforms}** 处 \`render: (text) => myUtil.text.formatNum(...)\` → \`render: { type: 'number', format }\``);
  }
  lines.push('');
  lines.push('### 日期格式归一化（r8）');
  if (!actions.dateFormatNormalizes) {
    lines.push('（无）');
  } else {
    lines.push(`- 共归一化 **${actions.dateFormatNormalizes}** 处 \`format: 'yyyy-...'\` → \`format: 'YYYY-...'\``);
  }
  lines.push('');
  lines.push('### 特殊字段处理（r11）');
  if (!actions.specialFieldRules) {
    lines.push('（无）');
  } else {
    lines.push(`- 共应用 **${actions.specialFieldRules}** 处特殊字段规则`);
  }
  lines.push('');
  lines.push('## 保留未改动的部分');
  lines.push('');
  lines.push('- `filter_items` 内容（结构兼容）');
  lines.push('- `grid_columns` 内容（结构兼容）');
  lines.push('- `customer_toolbar` 数组项（仅 key 重命名，项内容不动）');
  lines.push("- `layout_type: 'tz'` 业务语义");
  lines.push('');
  lines.push('## 后续工作');
  lines.push('');
  lines.push('- [ ] 迁移 `func.tsx` 中对应表单到 `form_items`');
  lines.push('- [ ] 迁移对应消费者组件');
  lines.push('- [ ] 端到端运行 `npm run dev` 验证');
  lines.push('');
  return lines.join('\n');
}

// =================== index/fun 提取函数 ===================
function extractInitSearchModalBlock(content) {
  const startRe = /initSearchModal\s*:\s*\[/;
  const startMatch = startRe.exec(content);
  if (!startMatch) return null;
  const startIdx = startMatch.index + startMatch[0].length;
  let depth = 1;
  let i = startIdx;
  while (i < content.length && depth > 0) {
    const ch = content[i];
    if (ch === '[') depth++;
    else if (ch === ']') depth--;
    if (depth === 0) break;
    i++;
  }
  if (depth !== 0) return null;
  const endIdx = i;
  let text = content.slice(startMatch.index, endIdx + 1);
  let needsCktsUtilImport = false;
  if (/\bcktsUtil\./.test(text)) {
    needsCktsUtilImport = true;
  }
  if (/\bUnitUtil\.getLcswsxDm\b/.test(text)) {
    text = text.replace(
      /UnitUtil\.getLcswsxDm\(\s*[A-Za-z_$][\w$]*\s*\.\s*unit_constant\s*\)/g,
      'cktsUtil.getLcswsxDm(myConfig.unit_constant)',
    );
    needsCktsUtilImport = true;
  }
  return { text, needsCktsUtilImport };
}

function extractInitAddFormFromFile(content) {
  const startRe = /Func\.initAddForm\s*=\s*/;
  const startMatch = startRe.exec(content);
  if (!startMatch) return null;
  let i = startMatch.index + startMatch[0].length;
  while (i < content.length && content[i] !== '{') {
    if (content[i] === ';' || content[i] === '\n') return null;
    i++;
  }
  if (i >= content.length) return null;
  let depth = 1;
  i++;
  while (i < content.length && depth > 0) {
    const ch = content[i];
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
    if (depth === 0) break;
    i++;
  }
  if (depth !== 0) return null;
  let endIdx = i + 1;
  if (content[endIdx] === ';') endIdx++;
  return content.slice(startMatch.index, endIdx);
}

function extractFuncMethod(content, methodName) {
  const startRe = new RegExp(`Func\\.${methodName}\\s*=\\s*`);
  const startMatch = startRe.exec(content);
  if (!startMatch) return null;
  let i = startMatch.index + startMatch[0].length;
  while (i < content.length && /\s/.test(content[i])) i++;
  if (content[i] === '(') {
    let depth = 1;
    i++;
    while (i < content.length && depth > 0) {
      if (content[i] === '(') depth++;
      else if (content[i] === ')') depth--;
      i++;
    }
    while (i < content.length && /\s/.test(content[i])) i++;
    if (content[i] === '=') i++;
    if (content[i] === '>') i++;
    while (i < content.length && /\s/.test(content[i])) i++;
  }
  if (content[i] !== '{') return null;
  let depth = 1;
  i++;
  while (i < content.length && depth > 0) {
    if (content[i] === '{') depth++;
    else if (content[i] === '}') depth--;
    if (depth === 0) break;
    i++;
  }
  if (depth !== 0) return null;
  let endIdx = i + 1;
  if (content[endIdx] === ';') endIdx++;
  return content.slice(startMatch.index, endIdx);
}

function migrateAntdUmiImports(methodCode) {
  let out = methodCode;
  out = out.replace(/\bmoment\(/g, 'dayjs(');
  return out;
}

const FUNC_METHOD_COMMENTS = {
  initAddForm: '// 新建表单初始化',
  initEditForm: '// 编辑表单初始化',
  validator: '// 表单校验',
  eventOnBlur: '// 表单事件：OnBlur',
  eventOnFocus: '// 表单事件：OnFocus',
  eventOnChange: '// 表单事件：OnChange',
};

function prependFuncMethodComment(methodCode, methodName) {
  const comment = FUNC_METHOD_COMMENTS[methodName];
  if (!comment) return methodCode;
  return `${comment}\n${methodCode}`;
}

function migrateFuncMethodVariables(methodCode, methodName) {
  if (methodName !== 'initEditForm') return methodCode;
  let out = methodCode;
  out = out.replace(/\bunit_key\b/g, 'unitKey');
  out = out.replace(/\bmyFormItems\b/g, 'formItems');
  out = out.replace(/\bsetMyFormItems\b/g, 'setFormItems');
  return out;
}

function postProcessFuncMethod(methodCode, methodName) {
  let out = methodCode;
  out = migrateAntdUmiImports(out);
  out = migrateGetCodeValByKey(out);
  out = migrateFuncMethodVariables(out, methodName);
  out = prependFuncMethodComment(out, methodName);
  return out;
}

function migrateGetCodeValByKey(methodCode) {
  const re = /myUtil\.code\.getCodeValByKey\(\s*([^,]+?)\s*,\s*(['"])([^'"]+)\2\s*,\s*(['"])([^'"]+)\4\s*\)/g;
  return methodCode.replace(re, (match, arg1, quote2, arg2, _quote3, arg3) => {
    return `myUtil.code.getCodeValByKey(${arg1}, ${quote2}${arg2}:${arg3}${quote2})`;
  });
}

function migrateGetCode(methodCode) {
  const re = /myUtil\.code\.getCode\(\s*(['"])([^'"]+)\1\s*,\s*(['"])([^'"]+)\3\s*\)/g;
  return methodCode.replace(re, (match, q1, codeKey, _q3, viewKey) => {
    return `myUtil.code.getCode(${q1}${codeKey}:${viewKey}${q1})`;
  });
}

function migrateGetCodeFromServerT1(methodCode) {
  const re = /myUtil\.code\.getCodeFromServerT1\(\s*(['"])([^'"]+)\1\s*,\s*(['"])([^'"]+)\3\s*\)/g;
  return methodCode.replace(re, (match, q1, codeKey, _q3, viewKey) => {
    return `myUtil.code.getCodeFromServerT1(${q1}${codeKey}:${viewKey}${q1})`;
  });
}

function rewriteHtsApiImports(content) {
  const re = /import\s*\{([\s\S]*?)\}\s*from\s*['"]@\/services\/hts\/api['"]\s*;?/g;
  const out = [];
  let m;
  while ((m = re.exec(content)) !== null) {
    const names = m[1]
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (names.length === 0) continue;
    out.push(
      `import { ${names.join(', ')} } from '@/pages/hts/services/htsApi';`,
    );
  }
  return out;
}

function extractRefImports(content) {
  const lines = content.split('\n');
  const imports = [];
  let inBlockComment = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed === '') {
      if (imports.length > 0) break;
      continue;
    }
    if (inBlockComment) {
      if (trimmed.includes('*/')) inBlockComment = false;
      continue;
    }
    if (trimmed.startsWith('/*')) {
      if (!trimmed.includes('*/') || trimmed.indexOf('*/') < trimmed.indexOf('/*')) {
        inBlockComment = true;
      }
      continue;
    }
    if (trimmed.startsWith('//')) continue;
    if (!trimmed.startsWith('import ')) break;
    if (/^import\s+type\s+/.test(trimmed)) continue;
    if (/\.less['"]\s*;?$/.test(trimmed)) continue;
    const buffer = [line];
    if (!trimmed.endsWith(';') && !trimmed.endsWith("'") && !trimmed.endsWith('"')) {
      let joined = trimmed;
      let j = i + 1;
      while (j < lines.length) {
        const nextLine = lines[j];
        const nextTrimmed = nextLine.trim();
        buffer.push(nextLine);
        joined += ' ' + nextTrimmed;
        if (nextTrimmed.endsWith(';') || /;\s*$/.test(nextTrimmed)) {
          j++;
          break;
        }
        j++;
      }
      i = j - 1;
    }
    imports.push(buffer.join('\n'));
  }
  return imports;
}

function applyImportRewrites(importLines) {
  const hasCktsUtilImport = importLines.some((line) => {
    const t = line.trim();
    return (
      /^import\s+cktsUtil\s+from\s*['"][^'"]+['"]\s*;?$/.test(t) ||
      /^import\s*\{[^}]*\bcktsUtil\b[^}]*\}\s*from\s*['"][^'"]+['"]\s*;?$/.test(t)
    );
  });
  return importLines
    .map((line) => {
      const trimmed = line.trim();
      if (/^import\s+moment\s+from\s+['"]moment['"]\s*;?$/.test(trimmed)) {
        return `import dayjs from 'dayjs';`;
      }
      const myUtilMatch = trimmed.match(
        /^import\s+(\w+)\s+from\s+['"]@\/pages\/common\/myUtil['"]\s*;?$/,
      );
      if (myUtilMatch) {
        return `import ${myUtilMatch[1]} from '@/components/DDAssist/util';`;
      }
      const ddAlertMatch = trimmed.match(
        /^import\s+(\w+)\s+from\s+['"]@\/components\/DDAlert['"]\s*;?$/,
      );
      if (ddAlertMatch) {
        return `import ${ddAlertMatch[1]} from '@/pages/hts/commonModule/DDAlert';`;
      }
      const staticTableCodeMatch = trimmed.match(
        /^import\s+(\w+)\s+from\s+['"]@\/pages\/common\/staticTableCode['"]\s*;?$/,
      );
      if (staticTableCodeMatch) {
        return `import ${staticTableCodeMatch[1]} from '@/components/DDAssist/staticTableCode';`;
      }
      const intlMyUtilNamedMatch = trimmed.match(
        /^import\s*\{([\s\S]*?)\}\s*from\s+['"]@\/pages\/common\/myUtil['"]\s*;?$/,
      );
      if (intlMyUtilNamedMatch) {
        return `import { ${intlMyUtilNamedMatch[1].trim()} } from '@/components/DDAssist/util';`;
      }
      const htsApiMatch = trimmed.match(
        /^import\s*\{([\s\S]*?)\}\s*from\s+['"]@\/services\/hts\/api['"]\s*;?$/,
      );
      if (htsApiMatch) {
        const names = htsApiMatch[1]
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
        if (names.length > 0) {
          return `import { ${names.join(', ')} } from '@/pages/hts/services/htsApi';`;
        }
      }
      const baseValidatorMatch = trimmed.match(
        /^import\s+(\w+)\s+from\s+['"]@\/pages\/common\/field\/baseValidator['"]\s*;?$/,
      );
      if (baseValidatorMatch) {
        return `import ${baseValidatorMatch[1]} from '@/components/DDAssist/field/baseValidator';`;
      }
      const cjpzUtilMatch = trimmed.match(
        /^import\s+(\w+)\s+from\s+['"]@\/pages\/common\/cjpzUtil['"]\s*;?$/,
      );
      if (cjpzUtilMatch) {
        if (hasCktsUtilImport) {
          return null;
        }
        return `import cktsUtil from '@/pages/hts/cktsUtil';`;
      }
      const umiNamedMatch = line.match(
        /^import\s*\{([\s\S]*?)\}\s*from\s*(['"])umi\2\s*;?\s*$/,
      );
      if (umiNamedMatch) {
        const inner = umiNamedMatch[1];
        const quote = umiNamedMatch[2];
        if (/\buseRouteMatch\b/.test(inner)) {
          const renamed = inner.replace(/\buseRouteMatch\b/g, 'useRouteData');
          return `import {${renamed}} from ${quote}umi${quote};`;
        }
      }
      return line;
    })
    .filter((line) => line !== null);
}

// =================== rules.replace 内容替换 ===================
let _replaceRulesCache = null;

function loadReplaceRules() {
  if (_replaceRulesCache) return _replaceRulesCache;
  try {
    const rulesPath = path.join(__dirname, 'convert-ddbunit-config.rules.json');
    const rules = JSON.parse(fs.readFileSync(rulesPath, 'utf-8'));
    _replaceRulesCache = {
      ts: Array.isArray(rules.replace?.ts) ? rules.replace.ts : [],
      less: Array.isArray(rules.replace?.less) ? rules.replace.less : [],
    };
  } catch {
    _replaceRulesCache = { ts: [], less: [] };
  }
  return _replaceRulesCache;
}

// 替换后自动补 import 映射：replaces 规则把代码中某个符号改成另一个后，
// 若新内容用到映射中的符号但缺少对应 import，则在文件顶部补齐。
// 触发条件：replace 规则的 `new` 引入了 `old` 中没有的符号（即该符号是被替换规则"新引入"的）。
// 仅作用于 ts/tsx 文件（less 不需要 import）。
const AUTO_IMPORTS_AFTER_REPLACE = [
  { symbol: 'cktsUtil', importLine: "import cktsUtil from '@/pages/hts/cktsUtil';" },
];

// 提取字符串中所有形如 `identifier.` 的 token（属性访问），返回 Set<identifier>
function extractSymbolTokens(s) {
  if (typeof s !== 'string') return new Set();
  const matches = s.match(/\b[a-zA-Z_$][\w$]*\.(?!['"`\/])/g) || [];
  return new Set(matches.map((m) => m.slice(0, -1)));
}

function ensureAutoImports(content, introducedSymbols) {
  let text = content;
  for (const { symbol, importLine } of AUTO_IMPORTS_AFTER_REPLACE) {
    if (!introducedSymbols.has(symbol)) continue;
    const usageRe = new RegExp(`\\b${symbol}\\.(?!/)`);
    if (usageRe.test(text) && !text.includes(importLine)) {
      const firstImportMatch = text.match(/^import\s/m);
      if (firstImportMatch) {
        text = text.slice(0, firstImportMatch.index) + importLine + '\n' + text.slice(firstImportMatch.index);
      } else {
        text = importLine + '\n' + text;
      }
    }
  }
  return text;
}

// 全局 codeTable 数组 → 字符串转换（不限 configVar / 块作用域）
// 等价于 r15 规则但作用于所有 ts/tsx 文件，包括 type-d / type-b 等不走 SPECIAL_FIELD_RULES 的场景。
// 典型用例：type-d 的 scsbsj.tsx 第 240 行 `codeTable: ['CODE_STATIC_TSSB_SBZT', '03']`
// 在 type-a 路径下被 r15 处理；其他类型由本函数兜底。
function transformCodeTableArraysGlobal(content) {
  const re = /codeTable\s*:\s*\[\s*(['"])([^'"]+)\1\s*,\s*(['"])([^'"]+)\3\s*\]/g;
  let count = 0;
  const out = content.replace(re, (_match, _q1, key, _q2, view) => {
    count++;
    return `codeTable: '${key}:${view}'`;
  });
  return { content: out, count };
}

function applyContentReplaces(content, fileExt) {
  const rules = loadReplaceRules();
  const replaces = rules[fileExt] || [];

  // 第一遍：收集所有 replace 规则"新引入"的符号（new 中有但 old 中没有的属性访问）
  const introducedSymbols = new Set();
  for (const { old: oldStr, new: newStr } of replaces) {
    const oldSymbols = extractSymbolTokens(oldStr);
    const newSymbols = extractSymbolTokens(newStr);
    for (const s of newSymbols) {
      if (!oldSymbols.has(s)) introducedSymbols.add(s);
    }
  }

  // 第二遍：执行替换
  let text = content;
  for (const { old: oldStr, new: newStr } of replaces) {
    if (typeof oldStr !== 'string' || oldStr.length === 0) continue;
    text = text.split(oldStr).join(newStr);
  }

  // 第三遍：仅对被 replace 规则新引入的符号补 import（仅 ts/tsx）
  if (fileExt === 'ts' && introducedSymbols.size > 0) {
    text = ensureAutoImports(text, introducedSymbols);
  }

  // 第四遍：全局 codeTable 数组 → 字符串转换（仅 ts/tsx；less 不需要）
  // 即使没有 replace 规则也要跑（兜底 type-d / type-b 等不走 r15 的场景）
  if (fileExt === 'ts') {
    const ctResult = transformCodeTableArraysGlobal(text);
    if (ctResult.count > 0) {
      text = ctResult.content;
    }
  }

  return text;
}

// =================== index 调整函数 ===================
function applyImportRewritesToContent(content) {
  let text = content;
  text = text.replace(
    /^import\s+moment\s+from\s+['"]moment['"]\s*;?[ \t]*$/gm,
    "import dayjs from 'dayjs';",
  );
  text = text.replace(
    /^import\s+(\w+)\s+from\s+['"]@\/pages\/common\/myUtil['"]\s*;?[ \t]*$/gm,
    "import $1 from '@/components/DDAssist/util';",
  );
  text = text.replace(
    /^import\s+(\w+)\s+from\s+['"]@\/pages\/common\/cktsUtil['"]\s*;?[ \t]*$/gm,
    "import $1 from '@/pages/hts/cktsUtil';",
  );
  text = text.replace(
    /^import\s+(\w+)\s+from\s+['"]@\/pages\/common\/qxUtil['"]\s*;?[ \t]*$/gm,
    "import $1 from '@/pages/hts/common/qxUtil';",
  );
  text = text.replace(
    /^import\s+(\w+)\s+from\s+['"]@\/components\/DDImport\/checkErrorProp['"]\s*;?[ \t]*$/gm,
    "import $1 from '@/pages/hts/commonModule/DDImport/checkErrorProp';",
  );
  text = text.replace(
    /^import\s+(\w+)\s+from\s+['"]@\/components\/DDAlert['"]\s*;?[ \t]*$/gm,
    "import $1 from '@/pages/hts/commonModule/DDAlert';",
  );
  text = text.replace(
    /^import\s+(\w+)\s+from\s+['"](?:@\/pages\/common\/staticTableCode|@\/components\/DDAssist\/staticTableCode)['"]\s*;?[ \t]*$/gm,
    "import $1 from '@/pages/hts/commonModule/staticTableCode';",
  );
  text = text.replace(
    /^import\s*\{([\s\S]*?)\}\s*from\s*['"]@\/pages\/common\/myUtil['"]\s*;?[ \t]*$/gm,
    (_m, names) => `import { ${names.trim()} } from '@/components/DDAssist/util';`,
  );
  text = text.replace(
    /^import\s*\{([\s\S]*?)\}\s*from\s*['"]@\/services\/hts\/api['"]\s*;?[ \t]*$/gm,
    (m, names) => {
      const list = names
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      return list.length > 0
        ? `import { ${list.join(', ')} } from '@/pages/hts/services/htsApi';`
        : m;
    },
  );
  text = text.replace(
    /^import\s+(\w+)\s+from\s+['"]@\/pages\/common\/field\/baseValidator['"]\s*;?[ \t]*$/gm,
    "import $1 from '@/components/DDAssist/field/baseValidator';",
  );
  const hasCktsUtilImport =
    /\bimport\s+cktsUtil\s+from\s*['"][^'"]+['"]\s*;?/.test(text) ||
    /\bimport\s*\{[^}]*\bcktsUtil\b[^}]*\}\s*from\s*['"][^'"]+['"]\s*;?/.test(text);
  if (hasCktsUtilImport) {
    text = text.replace(
      /^[ \t]*import\s+\w+\s+from\s+['"]@\/pages\/common\/cjpzUtil['"]\s*;?\s*\r?\n?/gm,
      '',
    );
  } else {
    text = text.replace(
      /^import\s+(\w+)\s+from\s+['"]@\/pages\/common\/cjpzUtil['"]\s*;?[ \t]*$/gm,
      "import cktsUtil from '@/pages/hts/cktsUtil';",
    );
  }
  text = text.replace(
    /^import\s*\{([\s\S]*?)\}\s*from\s*(['"])umi\2\s*;?[ \t]*$/gm,
    (m, inner, quote) => {
      if (/\buseRouteMatch\b/.test(inner)) {
        const renamed = inner.replace(/\buseRouteMatch\b/g, 'useRouteData');
        return `import {${renamed}} from ${quote}umi${quote};`;
      }
      return m;
    },
  );

  return text;
}

function rewriteGetMenuObjByPathCalls(text) {
  const from = 'myUtil.menu.getMenuObjByPath';
  const to = 'cktsUtil.menu.getMenuObjByPath';
  let out = '';
  let i = 0;
  while (i < text.length) {
    const idx = text.indexOf(from, i);
    if (idx === -1) {
      out += text.slice(i);
      break;
    }
    out += text.slice(i, idx);
    out += to;
    let j = idx + from.length;
    while (j < text.length && /\s/.test(text[j])) j++;
    if (text[j] !== '(') {
      i = idx + from.length;
      continue;
    }
    out += text[j];
    j++;
    let depth = 1;
    while (j < text.length && depth > 0) {
      const ch = text[j];
      if (ch === '(') {
        depth++;
        out += ch;
        j++;
      } else if (ch === ')') {
        depth--;
        out += ch;
        j++;
      } else if (ch === "'" || ch === '"' || ch === '`') {
        const quote = ch;
        out += ch;
        j++;
        while (j < text.length) {
          out += text[j];
          if (text[j] === '\\' && j + 1 < text.length) {
            out += text[j + 1];
            j += 2;
            continue;
          }
          if (text[j] === quote) {
            j++;
            break;
          }
          j++;
        }
      } else {
        out += ch;
        j++;
      }
    }
    i = j;
  }
  return out;
}

function extractFuncGetOtherRefPushes(content) {
  const targets = [];
  const re = /Func\.getOtherRef\s*=\s*(?:\(\s*\)\s*=>|function\s*\(\s*\))/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    let i = m.index + m[0].length;
    while (i < content.length && /\s/.test(content[i])) i++;
    if (content[i] !== '{') continue;
    i++;
    const bodyStart = i;
    let depth = 1;
    let inString = null;
    let escaped = false;
    while (i < content.length && depth > 0) {
      const ch = content[i];
      if (inString) {
        if (escaped) escaped = false;
        else if (ch === '\\') escaped = true;
        else if (ch === inString) inString = null;
      } else {
        if (ch === "'" || ch === '"' || ch === '`') inString = ch;
        else if (ch === '/' && content[i + 1] === '/') {
          while (i < content.length && content[i] !== '\n') i++;
          continue;
        } else if (ch === '/' && content[i + 1] === '*') {
          i += 2;
          while (i < content.length - 1 && !(content[i] === '*' && content[i + 1] === '/')) i++;
          i += 1;
          continue;
        } else if (ch === '{') depth++;
        else if (ch === '}') {
          depth--;
          if (depth === 0) break;
        }
      }
      i++;
    }
    const body = content.slice(bodyStart, i);
    const pushRe = /otherRef\.push\s*\(\s*([A-Za-z_$][\w$]*)\s*\)/g;
    let pm;
    while ((pm = pushRe.exec(body)) !== null) {
      targets.push(pm[1]);
    }
  }
  return targets;
}

function collectUseRefDeclarations(content) {
  const result = new Map();
  const re = /^[ \t]*(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*(?::\s*[A-Za-z_$<>,\s\[\]\|]+)?\s*=\s*useRef\s*\([^)]*\)\s*;?/gm;
  let m;
  while ((m = re.exec(content)) !== null) {
    const name = m[1];
    if (result.has(name)) continue;
    const lineEnd = content.indexOf('\n', m.index);
    const line = lineEnd === -1
      ? content.slice(m.index)
      : content.slice(m.index, lineEnd);
    result.set(name, { line, index: m.index });
  }
  return result;
}

function buildPreRefBlock(pushes, declarations, adjStart, adjEnd) {
  if (pushes.length === 0) return '';
  const lines = [];
  for (const name of pushes) {
    const info = declarations.get(name);
    if (info) {
      if (info.index >= adjStart && info.index < adjEnd) {
        continue;
      }
      lines.push(info.line);
    } else {
      lines.push(`  const ${name}: any = useRef();`);
    }
  }
  if (lines.length === 0) return '';
  return lines.join('\n') + '\n';
}

function rewriteImportAliasToMyConfig(text, content) {
  const importAliasMatch = content.match(
    /^import\s+(\w+)\s+from\s+['"]\.\/auto_config['"]\s*;?/m,
  );
  if (!importAliasMatch) return text;
  const alias = importAliasMatch[1];
  if (alias === 'myConfig') return text;
  const re = new RegExp(`^(\\s+)\\b${alias}\\b\\.`, 'gm');
  return text.replace(re, '$1myConfig.');
}

function extractMyConfigAdjustments(content) {
  let initMatch = null;
  const initRe = /const\s+myConfig\s*=\s*/g;
  let m;
  while ((m = initRe.exec(content)) !== null) {
    let lineStart = m.index;
    while (lineStart > 0 && content[lineStart - 1] !== '\n') lineStart--;
    const linePrefix = content.slice(lineStart, m.index);
    if (!/^\s*\/\//.test(linePrefix)) {
      initMatch = m;
      break;
    }
  }
  if (!initMatch) return null;
  const initAssignStart = initMatch.index;
  const eqIdx = content.indexOf('=', initAssignStart);
  if (eqIdx === -1) return null;
  let i = eqIdx + 1;
  const depth = { brace: 0, bracket: 0, paren: 0 };
  let inString = null;
  let escaped = false;
  let initEnd = -1;
  while (i < content.length) {
    const ch = content[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === inString) {
        inString = null;
      }
    } else {
      if (ch === "'" || ch === '"' || ch === '`') {
        inString = ch;
      } else if (ch === '{') {
        depth.brace++;
      } else if (ch === '}') {
        depth.brace--;
      } else if (ch === '[') {
        depth.bracket++;
      } else if (ch === ']') {
        depth.bracket--;
      } else if (ch === '(') {
        depth.paren++;
      } else if (ch === ')') {
        depth.paren--;
      } else if (
        (ch === ';' || ch === '\n') &&
        depth.brace === 0 &&
        depth.bracket === 0 &&
        depth.paren === 0
      ) {
        initEnd = i;
        break;
      }
    }
    i++;
  }
  if (initEnd === -1) return null;
  let returnStart = -1;
  i = initEnd + 1;
  inString = null;
  escaped = false;
  const depth2 = { brace: 1, bracket: 0, paren: 0 };
  while (i < content.length - 6) {
    const ch = content[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === inString) inString = null;
    } else {
      if (ch === "'" || ch === '"' || ch === '`') {
        inString = ch;
      } else if (ch === '/') {
        if (content[i + 1] === '/') {
          while (i < content.length && content[i] !== '\n') i++;
          continue;
        }
        if (content[i + 1] === '*') {
          i += 2;
          while (i < content.length - 1 && !(content[i] === '*' && content[i + 1] === '/')) i++;
          i += 1;
          continue;
        }
      } else if (ch === '{') {
        depth2.brace++;
      } else if (ch === '}') {
        depth2.brace--;
        if (depth2.brace === 0) break;
      } else if (ch === '[') {
        depth2.bracket++;
      } else if (ch === ']') {
        depth2.bracket--;
      } else if (ch === '(') {
        depth2.paren++;
      } else if (ch === ')') {
        depth2.paren--;
      } else if (
        depth2.brace === 1 &&
        depth2.bracket === 0 &&
        depth2.paren === 0 &&
        !/[A-Za-z_$0-9]/.test(content[i - 1] ?? ' ') &&
        content.substr(i, 6) === 'return' &&
        /[\s<(]/.test(content[i + 6] ?? '')
      ) {
        returnStart = i;
        break;
      }
    }
    i++;
  }
  if (returnStart === -1) return null;
  const pushedRefs = extractFuncGetOtherRefPushes(content);
  const useRefDecls = collectUseRefDeclarations(content);
  const preRefBlock = buildPreRefBlock(
    pushedRefs,
    useRefDecls,
    initEnd + 1,
    returnStart,
  );
  let text = content.slice(initEnd + 1, returnStart);
  text = text.replace(/^\s*\n/, '');
  text = text.replace(/\s+$/, '');
  if (!text) return null;
  text = rewriteImportAliasToMyConfig(text, content);
  text = stripGridParamsBlock(text);
  text = text.replace(/^\s*\n/, '').replace(/\s+$/, '');
  if (!text) return null;
  {
    const r16 = transformFormApiSaveDelete(text, 'myConfig');
    if (r16.count > 0) {
      text = r16.content;
    }
  }
  {
    const r17 = transformFormApiSaveUpload(text, 'myConfig');
    if (r17.count > 0) {
      text = r17.content;
    }
  }
  if (text.indexOf('myUtil.menu.getMenuObjByPath') !== -1) {
    text = rewriteGetMenuObjByPathCalls(text);
  }
  const needsMyUtilImport = /\bmyUtil\./.test(text);
  const needsCktsUtilImport = /\bcktsUtil\./.test(text);
  const needsUseRefImport = /\buseRef\s*\(/.test(text) || preRefBlock.length > 0;
  return {
    text,
    needsMyUtilImport,
    needsCktsUtilImport,
    needsUseRefImport,
    preRefBlock,
  };
}

function stripGridParamsBlock(text) {
  const startRe = /myConfig\.gridParams\s*=\s*\{/;
  const startMatch = startRe.exec(text);
  if (!startMatch) return text;
  const startIdx = startMatch.index;
  let depth = 1;
  let i = startMatch.index + startMatch[0].length;
  while (i < text.length && depth > 0) {
    const ch = text[i];
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
    if (depth === 0) break;
    i++;
  }
  if (depth !== 0) return text;
  let endIdx = i + 1;
  if (text[endIdx] === ';') endIdx++;
  while (endIdx < text.length && /\s/.test(text[endIdx])) endIdx++;
  return text.slice(0, startIdx) + text.slice(endIdx);
}

function normalizeDDBunit2Import(content) {
  return content.replace(
    /^import\s+DDBunit2\s+from\s+['"]@\/components\/DDBunit\/DDBunit2['"]\s*;?[ \t]*$/gm,
    "import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';",
  );
}

function applyIndexImportRewrites(content) {
  let text = content;
  text = text.replace(
    /^import\s+UnitUtil\s+from\s+['"]@\/components\/DDBunit\/unit_util['"]\s*;?[ \t]*$/gm,
    "import cktsUtil from '@/pages/hts/cktsUtil';",
  );
  text = text.replace(
    /^import\s*\{([\s\S]*?)\}\s*from\s+['"]@\/services\/hts\/apiTb['"]\s*;?[ \t]*$/gm,
    (m, names) => {
      const list = names
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      return list.length > 0
        ? `import { ${list.join(', ')} } from '@/pages/hts/services/htsApi';`
        : m;
    },
  );
  text = text.replace(
    /^import\s+(\w+)\s+from\s+['"]\.\/func['"]\s*;?[ \t]*$/gm,
    "import $1 from './f';",
  );
  return text;
}

function commentOutNonDDBunit2Components(content) {
  const returnRe = /(\breturn\s*<>\s*\n)([\s\S]*?)(\n\s*<\/\s*\S+?>)/;
  const m = returnRe.exec(content);
  if (!m) return content;
  const returnBody = m[2];
  const componentNames = new Set();
  for (const line of returnBody.split('\n')) {
    const cm = line.match(/<([A-Z][A-Za-z0-9_]*)/);
    if (cm && cm[1] !== 'DDBunit2') {
      componentNames.add(cm[1]);
    }
  }
  if (componentNames.size === 0) return content;
  const lines = returnBody.split('\n');
  const newLines = [];
  let markerInserted = false;
  for (const line of lines) {
    const cm = line.match(/<([A-Z][A-Za-z0-9_]*)/);
    if (cm && cm[1] !== 'DDBunit2') {
      const commented = line.replace(
        /(\s*)(<\/?[A-Z][A-Za-z0-9_]*[^>]*?\/?>)\s*$/,
        '$1{/* $2 */}',
      );
      newLines.push(commented);
    } else {
      newLines.push(line);
      if (!markerInserted && /<DDBunit2/.test(line)) {
        newLines.push('    {/* 暂时仅仅保留DDBunit2 */}');
        markerInserted = true;
      }
    }
  }
  const newReturnBody = newLines.join('\n');
  let newText = content.replace(returnRe, (full, open, _body, close) =>
    open + newReturnBody + close,
  );
  for (const compName of componentNames) {
    const importRe = new RegExp(
      `^import\\s+${compName}\\s+from\\s+['"][^'"]+['"]\\s*;?[ \\t]*$`,
      'gm',
    );
    newText = newText.replace(importRe, (match) => `// ${match.trim()}`);
  }
  return newText;
}

function applyIndexAdjustments(content) {
  let text = content;
  text = text.replace(
    /UnitUtil\.getLcswsxDm\(\s*[A-Za-z_$][\w$]*\s*\.\s*unit_constant\s*\)/g,
    'cktsUtil.getLcswsxDm(myConfig.unit_constant)',
  );
  text = rewriteGetMenuObjByPathCalls(text);
  text = rewriteImportAliasToMyConfig(text, content);
  const r16 = transformFormApiSaveDelete(text, 'myConfig');
  if (r16.count > 0) text = r16.content;
  const r17 = transformFormApiSaveUpload(text, 'myConfig');
  if (r17.count > 0) text = r17.content;
  return text;
}

function generateIndexFileFromRef(refPath, configImportName, funImportName) {
  const refContent = fs.readFileSync(refPath, 'utf-8');
  let output = refContent;
  output = applyImportRewritesToContent(output);
  output = normalizeDDBunit2Import(output);
  output = applyIndexImportRewrites(output);
  output = applyIndexAdjustments(output);
  output = commentOutNonDDBunit2Components(output);
  return output;
}

// =================== fun 生成函数 ===================
function generateFunPage({ initAddForm, refImports = [], extraMethods = {} } = {}) {
  const importsBlock = refImports.length > 0
    ? refImports.join('\n') + '\n\n'
    : '';
  const extraMethodsBlock = [
    extraMethods.initEditForm,
    extraMethods.validator,
    extraMethods.eventOnBlur,
    extraMethods.eventOnFocus,
    extraMethods.eventOnChange,
  ]
    .filter(Boolean)
    .map((s) => s + '\n\n')
    .join('');

  if (!initAddForm && !extraMethodsBlock) {
    return `${importsBlock}const Func: any = {
  refUnit: React.createRef(),
};

export default Func;
`;
  }
  const initAddFormBlock = initAddForm ? `${initAddForm}\n\n` : '';
  return `${importsBlock}const Func: any = {
  refUnit: React.createRef(),
};

${initAddFormBlock}${extraMethodsBlock}export default Func;
`;
}

// =================== 复制后改写规则 ===================
function applyCopyRewrites(content, srcFile) {
  let text = content;

  // R1: '@/services/hts/api' → '@/pages/hts/services/htsApi'(多行折叠为单行)
  text = text.replace(
    /^import\s*\{([\s\S]*?)\}\s*from\s*['"]@\/services\/hts\/api['"]\s*;?[ \t]*$/gm,
    (_m, names) => {
      const list = names
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      return list.length > 0
        ? `import { ${list.join(', ')} } from '@/pages/hts/services/htsApi';`
        : _m;
    },
  );

  // R2: '@/pages/common/myUtil' (default 导入) → '@/components/DDAssist/util'
  text = text.replace(
    /^import\s+(\w+)\s+from\s+['"]@\/pages\/common\/myUtil['"]\s*;?[ \t]*$/gm,
    "import $1 from '@/components/DDAssist/util';",
  );

  // R2a: '@/pages/common/myUtil' (命名导入) → '@/components/DDAssist/util'
  text = text.replace(
    /^import\s*\{([^\}]+)\}\s*from\s+['"]@\/pages\/common\/myUtil['"]\s*;?[ \t]*$/gm,
    (m, names) => `import { ${names.trim()} } from '@/components/DDAssist/util';`,
  );

  // R2b: '@/pages/common/field/baseValidator' (default 导入) → '@/components/DDAssist/field/baseValidator'
  text = text.replace(
    /^import\s+(\w+)\s+from\s+['"]@\/pages\/common\/field\/baseValidator['"]\s*;?[ \t]*$/gm,
    "import $1 from '@/components/DDAssist/field/baseValidator';",
  );

  // R2c: '@/pages/common/field/businessValidator' (default 导入) → '@/pages/hts/common/field/businessValidator'
  text = text.replace(
    /^import\s+(\w+)\s+from\s+['"]@\/pages\/common\/field\/businessValidator['"]\s*;?[ \t]*$/gm,
    "import $1 from '@/pages/hts/common/field/businessValidator';",
  );

  // R3: '@/pages/common/proConfig' → '@/components/DDAssist/constants'
  text = text.replace(
    /^import\s+\w+\s+from\s+['"]@\/pages\/common\/proConfig['"]\s*;?[ \t]*$/gm,
    "import CONSTANTS from '@/components/DDAssist/constants';",
  );

  // R4: pro.c_modal_width_x[1-4] → CONSTANTS.C_MODAL_WIDTH_X[1-4]
  text = text.replace(/\bpro\.c_modal_width_x([1-4])\b/g, 'CONSTANTS.C_MODAL_WIDTH_X$1');

  // R5: '@/components/DDAlert' → '@/pages/hts/commonModule/DDAlert'
  text = text.replace(
    /^import\s+(\w+)\s+from\s+['"]@\/components\/DDAlert['"]\s*;?[ \t]*$/gm,
    "import $1 from '@/pages/hts/commonModule/DDAlert';",
  );

  // R13: '@/components/DDBunit/DDBunit2' → '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS'
  text = text.replace(
    /^import\s+DDBunit2\s+from\s+['"]@\/components\/DDBunit\/DDBunit2['"]\s*;?[ \t]*$/gm,
    "import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';",
  );

  // R14: costomer_toobar → customer_toolbar (拼写修正)
  text = text.replace(/\bcostomer_toobar\b/g, 'customer_toolbar');

  // R15: '@/pages/common/cktsUtil' (default 导入) → '@/pages/hts/cktsUtil'
  text = text.replace(
    /^import\s+(\w+)\s+from\s+['"]@\/pages\/common\/cktsUtil['"]\s*;?[ \t]*$/gm,
    "import $1 from '@/pages/hts/cktsUtil';",
  );

  // R16: '@/pages/common/qxUtil' (default 导入) → '@/pages/hts/common/qxUtil'
  text = text.replace(
    /^import\s+(\w+)\s+from\s+['"]@\/pages\/common\/qxUtil['"]\s*;?[ \t]*$/gm,
    "import $1 from '@/pages/hts/common/qxUtil';",
  );

  // R17: '@/components/DDImport/checkErrorProp' (default 导入) → '@/pages/hts/commonModule/DDImport/checkErrorProp'
  text = text.replace(
    /^import\s+(\w+)\s+from\s+['"]@\/components\/DDImport\/checkErrorProp['"]\s*;?[ \t]*$/gm,
    "import $1 from '@/pages/hts/commonModule/DDImport/checkErrorProp';",
  );

  // R6: destroyOnClose → destroyOnHidden (tsx 文件内容替换)
  text = text.replace(/\bdestroyOnClose\b/g, 'destroyOnHidden');

  // R7: maskClosable={false} → mask={{ closable: false }} (tsx 文件内容替换)

  // R8: useRouteMatch → useRouteData (tsx 文件内容替换)
  text = text.replace(/\buseRouteMatch\b/g, 'useRouteData');

  // R9: UnitUtil.form.init → formUtil.init (tsx 文件内容替换)
  text = text.replace(/\bUnitUtil\.form\.init\b/g, 'formUtil.init');

  // R10: formUtil 导入（仅当源文件含 UnitUtil.form.init 时添加）
  if (!text.includes("from '@/components/DDForm/formUtil'")) {
    let srcHasUnitUtil = false;
    if (srcFile) {
      try {
        const srcContent = fs.readFileSync(srcFile, 'utf-8');
        srcHasUnitUtil = /\bUnitUtil\.form\.init\b/.test(srcContent);
      } catch (e) { /* 源文件不存在则跳过 */ }
    }
    if (srcHasUnitUtil) {
      const firstImportMatch = text.match(/^import\s/m);
      if (firstImportMatch) {
        const pos = firstImportMatch.index;
        text = text.slice(0, pos) + "import formUtil from '@/components/DDForm/formUtil';\n" + text.slice(pos);
      }
    }
  }

  // R11: UnitUtil.code.getCodeTableParam → myUtil.code.getCodeTableParamFromJson
  text = text.replace(
    /\bUnitUtil\.code\.getCodeTableParam\s*\(\s*\{\s*formItems\s*:\s*\w+\s*\}\s*\)/g,
    'myUtil.code.getCodeTableParamFromJson({ items: formItems || [] })',
  );

  // R12: UnitUtil.code.getCodeTablePromise → myUtil.code.getCodeTablePromise
  text = text.replace(/\bUnitUtil\.code\.getCodeTablePromise\b/g, 'myUtil.code.getCodeTablePromise');

  text = text.replace(/\buseRouteMatch\b/g, 'useRouteData');
  text = text.replace(/maskClosable=\{false\}/g, 'mask={{ closable: false }}');

  return text;
}

// =================== 文件类型分类 ===================
/**
 * 根据文件名和内容判断文件类型
 * @returns 'a' | 'b' | 'c' | 'd' | 'f'
 */
function classifyFile(filepath, content) {
  const basename = path.basename(filepath);
  const hasConfigName = /auto_config|config/i.test(basename);
  const hasIndexName = /index/i.test(basename);
  const hasFunName = /^[ff]un(?:c)?\.tsx$/i.test(basename) || /^fun/i.test(basename);

  // a: config 文件（文件名含 config + 内容含关键属性之一）
  if (hasConfigName && /\b(grid_columns|filter_items|form_items|toolbar_default|grid_handle_columns_default)\b/.test(content)) {
    return 'a';
  }
  // b: index 入口文件（文件名含 index + 引用 DDBunit2）
  if (hasIndexName && /\bDDBunit2\b/.test(content)) {
    return 'b';
  }
  // c: fun 方法文件（文件名含 fun + 内容含关键方法之一）
  if (hasFunName && /\b(validator|eventOnChange|eventOnFocus|eventOnBlur|initAddForm|initEditForm|formBeforeSubmit)\b/.test(content)) {
    return 'c';
  }
  // d: 其他 ts/tsx 文件
  if (/\.tsx?$/.test(basename)) {
    return 'd';
  }
  // e: less 文件（首行含 @import "~@/assets/css/config.less"）
  if (/\.less$/.test(basename)) {
    return 'e';
  }
  // f: 排除
  return 'f';
}

// =================== 类型特定处理函数 ===================

/**
 * 类型 a: 基础单元配置文件 → 跑完整转换管线
 */
function processTypeA(srcFile, dstFile, args) {
  const srcContent = fs.readFileSync(srcFile, 'utf-8');
  const configVar = detectConfigVar(srcContent) || args['config-var'];
  if (!configVar) {
    console.log(`  [type-a] 跳过：无法检测 config 变量名`);
    return;
  }

  let outContent = srcContent;
  const actions = { renames: [], removes: [], toolbarRenames: [], imports: [], removedImports: [], renderTransforms: 0, dateFormatNormalizes: 0, specialFieldRules: 0 };

  // 加载规则
  const defaultRulesPath = path.join(__dirname, 'convert-ddbunit-config.rules.json');
  const rulesPath = args.rules || defaultRulesPath;
  let rules;
  try {
    rules = JSON.parse(fs.readFileSync(rulesPath, 'utf-8'));
  } catch {
    rules = { renames: {}, removes: [], toolbarRenames: {}, prependImports: [], removeImports: [], route: { enabled: false } };
  }

  // 1. 重命名顶层 key
  for (const [oldKey, newKey] of Object.entries(rules.renames || {})) {
    const result = renameTopLevelKey(outContent, configVar, oldKey, newKey);
    if (result.renamed) {
      outContent = result.content;
      actions.renames.push({ from: oldKey, to: newKey });
    }
  }

  // 2. 重命名 toolbar_default 内嵌 key
  if (rules.toolbarRenames && Object.keys(rules.toolbarRenames).length > 0) {
    const result = nestedRenameInBlock(outContent, configVar, 'toolbar_default', rules.toolbarRenames);
    if (result.changed) {
      outContent = result.content;
      for (const [oldKey, newKey] of Object.entries(rules.toolbarRenames)) {
        actions.toolbarRenames.push({ from: oldKey, to: newKey, in: 'toolbar_default' });
      }
    }
  }

  // 3. 删除顶层 key
  for (const key of rules.removes || []) {
    const result = removeTopLevelKey(outContent, configVar, key);
    if (result.removed) {
      outContent = result.content;
      actions.removes.push(key);
    }
  }

  // 4. render 函数形式转换（r7）
  {
    const result = transformRenderFunctions(outContent);
    if (result.count > 0) {
      outContent = result.content;
      actions.renderTransforms = result.count;
    }
  }

  // 5. 日期格式归一化（r8）
  {
    const result = normalizeDateFormats(outContent);
    if (result.count > 0) {
      outContent = result.content;
      actions.dateFormatNormalizes = result.count;
    }
  }

  // 6. 前置 import
  if (rules.prependImports && rules.prependImports.length > 0) {
    const result = prependImports(outContent, rules.prependImports);
    outContent = result.content;
    actions.imports.push(...result.added);
  }

  // 7. 删除 import
  if (rules.removeImports && rules.removeImports.length > 0) {
    const result = removeImports(outContent, rules.removeImports);
    outContent = result.content;
    actions.removedImports = result.removed;
  }

  // 8. 特殊字段处理（r11-r19）
  {
    const result = applySpecialFieldRules(outContent, configVar);
    if (result.count > 0) {
      outContent = result.content;
      actions.specialFieldRules = result.count;
    }
  }

  // 9. costomer_toobar → customer_toolbar (拼写修正)
  outContent = outContent.replace(/\bcostomer_toobar\b/g, 'customer_toolbar');

  // 10. rules.replace.ts (ts/tsx 文本替换，作为最终步骤)
  outContent = applyContentReplaces(outContent, 'ts');

  // 写出 config 文件
  fs.mkdirSync(path.dirname(dstFile), { recursive: true });
  fs.writeFileSync(dstFile, outContent, 'utf-8');
  console.log(`  [type-a] 已生成 auto_config.tsx`);

  // 生成 README
  if (args.readme === true) {
    const readmePath = dstFile.replace(/\.tsx$/, '.README.md');
    const readme = generateReadme({
      srcFile: path.resolve(srcFile),
      outFile: path.resolve(dstFile),
      configVar,
      actions,
      rules,
    });
    fs.mkdirSync(path.dirname(readmePath), { recursive: true });
    fs.writeFileSync(readmePath, readme, 'utf-8');
    console.log(`  [type-a] 已生成 README`);
  }

  // 生成 index.tsx
  if (args['no-index'] !== true) {
    const srcDir = path.dirname(srcFile);
    const refIndex = path.join(srcDir, 'index.tsx');
    if (fs.existsSync(refIndex)) {
      try {
        const indexContent = generateIndexFileFromRef(refIndex, path.basename(dstFile, path.extname(dstFile)), '');
        const indexContentFinal = applyContentReplaces(indexContent, 'ts');
        const outDir = path.dirname(dstFile);
        const indexFile = path.join(outDir, 'index.tsx');
        fs.writeFileSync(indexFile, indexContentFinal, 'utf-8');
        console.log(`  [type-a] 已生成 index.tsx`);
      } catch (e) {
        console.log(`  [type-a] index.tsx 生成失败: ${e.message}`);
      }
    }
  }

  // 生成 f.tsx
  if (args['no-fun'] !== true) {
    const srcDir = path.dirname(srcFile);
    const refFun = fs.existsSync(path.join(srcDir, 'f.tsx')) ? path.join(srcDir, 'f.tsx')
                 : fs.existsSync(path.join(srcDir, 'fun.tsx')) ? path.join(srcDir, 'fun.tsx')
                 : null;
    if (refFun) {
      try {
        const funRefContent = fs.readFileSync(refFun, 'utf-8');
        let funOutput = funRefContent;


        // 11 条 imports 改写
        funOutput = applyImportRewritesToContent(funOutput);

        // moment → dayjs
        funOutput = funOutput.replace(/\bmoment\(/g, 'dayjs(');

        // getCodeValByKey 3→2
        funOutput = migrateGetCodeValByKey(funOutput);
        funOutput = migrateGetCode(funOutput);
        funOutput = migrateGetCodeFromServerT1(funOutput);

        // initEditForm 变量改名
        const initEditFormBlock = extractFuncMethod(funOutput, 'initEditForm');
        if (initEditFormBlock) {
          const rewritten = migrateFuncMethodVariables(initEditFormBlock, 'initEditForm');
          funOutput = funOutput.replace(initEditFormBlock, rewritten);
        }

        funOutput = applyContentReplaces(funOutput, 'ts');

        const outDir = path.dirname(dstFile);
        const funFile = path.join(outDir, 'f.tsx');
        fs.writeFileSync(funFile, funOutput, 'utf-8');
        console.log(`  [type-a] 已生成 f.tsx`);
      } catch (e) {
        console.log(`  [type-a] f.tsx 生成失败: ${e.message}`);
      }
    }
  }
}

/**
 * 类型 b: 基础单元入口文件 → 生成 index.tsx
 */
function processTypeB(srcFile, dstFile, args) {
  // 读取 ref index.tsx（从 srcDir，即 code_sample 目录）
  const srcDir = path.dirname(srcFile);
  const refIndex = path.join(srcDir, 'index.tsx');
  if (!fs.existsSync(refIndex)) {
    console.log(`  [type-b] 跳过：未找到 ref ${refIndex}`);
    return;
  }

  let content = fs.readFileSync(refIndex, 'utf-8');

  // Step 1: 应用 index 专用 import 改写
  content = applyImportRewritesToContent(content);
  content = normalizeDDBunit2Import(content);
  content = applyIndexImportRewrites(content);

  // Step 2: 应用内联调整
  content = applyIndexAdjustments(content);

  // Step 3: return 段非 DDBunit2 组件注释化
  content = commentOutNonDDBunit2Components(content);

  // Step 4: rules.replace.ts (ts/tsx 文本替换)
  content = applyContentReplaces(content, 'ts');

  fs.writeFileSync(dstFile, content, 'utf-8');
  console.log(`  [type-b] 已生成 index.tsx`);
}

/**
 * 类型 c: 基础单元方法文件 → 生成 f.tsx
 */
function processTypeC(srcFile, dstFile, args) {
  const srcDir = path.dirname(srcFile);
  // 查找 ref: f.tsx → fun.tsx 顺序
  const refFun = fs.existsSync(path.join(srcDir, 'f.tsx')) ? path.join(srcDir, 'f.tsx')
               : fs.existsSync(path.join(srcDir, 'fun.tsx')) ? path.join(srcDir, 'fun.tsx')
               : null;
  if (!refFun) {
    console.log(`  [type-c] 跳过：未找到 ref f.tsx/fun.tsx`);
    return;
  }

  let content = fs.readFileSync(refFun, 'utf-8');


  // Step 2: 11 条 imports 路径改写
  content = applyImportRewritesToContent(content);

  // Step 3: 提取并后处理方法体
  const initAddForm = extractInitAddFormFromFile(content);
  const extraMethods = {
    initEditForm: postProcessFuncMethod(extractFuncMethod(content, 'initEditForm'), 'initEditForm'),
    validator: postProcessFuncMethod(extractFuncMethod(content, 'validator'), 'validator'),
    eventOnBlur: postProcessFuncMethod(extractFuncMethod(content, 'eventOnBlur'), 'eventOnBlur'),
    eventOnFocus: postProcessFuncMethod(extractFuncMethod(content, 'eventOnFocus'), 'eventOnFocus'),
    eventOnChange: postProcessFuncMethod(extractFuncMethod(content, 'eventOnChange'), 'eventOnChange'),
  };

  // Step 4: 生成 fun 文件
  const funOutput = generateFunPage({ initAddForm, extraMethods });
  const funOutputFinal = applyContentReplaces(funOutput, 'ts');
  fs.writeFileSync(dstFile, funOutputFinal, 'utf-8');
  console.log(`  [type-c] 已生成 f.tsx`);
}

/**
 * 类型 e: less 文件 → 含有 "@/assets/css/config.less" 的行注释掉，
 *                       含有 "@font_color" 的行也注释掉（保留缩进），
 *                       并删除 "@import '~antd/lib/style/themes/default.less';"
 */
function processTypeE(dstFile) {
  const content = fs.readFileSync(dstFile, 'utf-8');
  const lines = content.split(/\r?\n/);
  let modified = false;
  const newLines = lines
    .filter((line) => {
      if (/@import\s+['"]~antd\/lib\/style\/themes\/default\.less['"]\s*;?/.test(line)) {
        modified = true;
        return false;
      }
      return true;
    })
    .map((line) => {
      if (/@\/assets\/css\/config\.less/.test(line)) {
        modified = true;
        return '// 新系统迁移时注释\n// ' + line;
      }
      if (/@font_color/.test(line) && !line.trim().startsWith('//')) {
        modified = true;
        const indentMatch = line.match(/^[ \t]*/);
        const indent = indentMatch ? indentMatch[0] : '';
        return `${indent}// ${line.trim()}`;
      }
      return line;
    });
  let finalText = newLines.join('\n');
  // rules.replace.less (less 文本替换，作为最终步骤)
  const replacedText = applyContentReplaces(finalText, 'less');
  if (replacedText !== finalText) {
    finalText = replacedText;
    modified = true;
  }
  if (modified) {
    fs.writeFileSync(dstFile, finalText, 'utf-8');
    console.log(`  [type-e] 已处理 less 文件`);
  }
}

/**
 * 类型 d/f: 其他文件 → 仅应用改写规则
 */
function applyCopyRewritesToFile(srcFile, dstFile) {
  let content = fs.readFileSync(dstFile, 'utf-8');
  let modified = false;

  // 基础改写规则 (R1-R10)
  const rewritten = applyCopyRewrites(content, srcFile);
  if (rewritten !== content) {
    content = rewritten;
    modified = true;
  }

  // 完整 import 路径改写 (11条)
  const importRewritten = applyImportRewritesToContent(content);
  if (importRewritten !== content) {
    content = importRewritten;
    modified = true;
  }

  // rules.replace.ts (ts/tsx 文本替换，作为最终步骤)
  const replacedContent = applyContentReplaces(content, 'ts');
  if (replacedContent !== content) {
    content = replacedContent;
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(dstFile, content, 'utf-8');
    console.log(`  [type-d] 已应用改写规则`);
  }
}

// =================== 主流程 ===================
async function main() {
  const args = parseArgs();
  if (!args.src) {
    console.error(
      'Usage: node scripts/copy-from-code-sample.js --src <file-or-dir>',
    );
    process.exit(1);
  }

  if (!fs.existsSync(args.src)) {
    console.error(`[copy] 错误: 源路径不存在: ${args.src}`);
    process.exit(1);
  }

  // ========== 文件模式 ==========
  if (!isDirectory(args.src)) {
    console.log(`[copy] 文件模式: ${args.src}`);
    const out = args.out || deriveDefaultOutPath(args.src);
    if (!out) {
      console.error('[copy] 错误: --src 不以 code_sample/ 开头,无法派生目标路径');
      process.exit(1);
    }
    // 1. 复制源文件
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.cpSync(args.src, out, { force: true });
    console.log(`[copy] 已复制: ${args.src} -> ${out}`);
    // 2. 应用改写规则
    const content = fs.readFileSync(out, 'utf-8');
    const rewritten = applyCopyRewrites(content, args.src);
    if (rewritten !== content) {
      fs.writeFileSync(out, rewritten, 'utf-8');
      console.log(`[copy] 已应用改写规则`);
    }
    // 3. 识别文件类型并处理
    const fileType = classifyFile(out, fs.readFileSync(out, 'utf-8'));
    console.log(`[copy] 文件类型: type-${fileType}`);
    try {
      switch (fileType) {
        case 'a':
          processTypeA(args.src, out, args);
          break;
        case 'b':
          processTypeB(args.src, out, args);
          break;
        case 'c':
          processTypeC(args.src, out, args);
          break;
        case 'e':
          processTypeE(out);
          break;
        case 'd':
        case 'f':
          applyCopyRewritesToFile(args.src, out);
          break;
      }
    } catch (e) {
      console.error(`[copy] 处理失败: ${e.message}`);
      process.exit(1);
    }
    return;
  }

  // ========== 目录模式 ==========
  const srcDir = args.src.replace(/\\/g, '/').replace(/\/$/, '');
  // --out 优先，否则用 deriveDefaultOutPath 派生
  let dstDir = args.out ? args.out.replace(/\\/g, '/') : deriveDefaultOutPath(srcDir);
  if (!dstDir) {
    console.error('[copy] 错误: --src 不以 code_sample/ 开头,无法派生目标路径');
    process.exit(1);
  }

  console.log(`[copy] 源目录: ${srcDir}`);
  console.log(`[copy] 目标目录: ${dstDir}`);

  // 1. 整棵递归复制
  fs.mkdirSync(dstDir, { recursive: true });
  fs.cpSync(srcDir, dstDir, { recursive: true, force: true });
  console.log(`[copy] 已递归复制: ${srcDir} -> ${dstDir}`);

  // 2. 扫描所有 .tsx 和 .less(目标侧,因目录已落地)
  const files = walkFiles(dstDir);
  console.log(`[copy] 发现 ${files.length} 个文件(.tsx + .less)`);

  // 3. 逐个处理
  const failures = [];
  let successCount = 0;
  for (const dstFile of files) {
    const relPath = path.relative(dstDir, dstFile);
    const srcFile = path.join(srcDir, relPath);
    const content = fs.readFileSync(dstFile, 'utf-8');
    const fileType = classifyFile(dstFile, content);

    console.log(`\n[copy] 处理: ${relPath} (type-${fileType})`);

    try {
      switch (fileType) {
        case 'a':
          // 先应用 applyCopyRewrites
          const rewrittenA = applyCopyRewrites(content, srcFile);
          if (rewrittenA !== content) {
            fs.writeFileSync(dstFile, rewrittenA, 'utf-8');
            console.log(`  ↪ 已应用改写规则`);
          }
          processTypeA(srcFile, dstFile, args);
          break;
        case 'b':
          const rewrittenB = applyCopyRewrites(content, srcFile);
          if (rewrittenB !== content) {
            fs.writeFileSync(dstFile, rewrittenB, 'utf-8');
            console.log(`  ↪ 已应用改写规则`);
          }
          processTypeB(srcFile, dstFile, args);
          break;
        case 'c':
          const rewrittenC = applyCopyRewrites(content, srcFile);
          if (rewrittenC !== content) {
            fs.writeFileSync(dstFile, rewrittenC, 'utf-8');
            console.log(`  ↪ 已应用改写规则`);
          }
          processTypeC(srcFile, dstFile, args);
          break;
        case 'e':
          processTypeE(dstFile);
          break;
        case 'd':
        case 'f':
          applyCopyRewritesToFile(srcFile, dstFile);
          break;
      }
      successCount++;
    } catch (e) {
      failures.push({ file: relPath, error: e.message });
      console.error(`  ✗ 失败: ${e.message}`);
    }
  }

  // 4. 汇总
  console.log(`\n========== 批处理结果 ==========`);
  console.log(`成功: ${successCount} / ${files.length}`);
  console.log(`失败: ${failures.length}`);
  if (failures.length > 0) {
    console.log('失败文件:');
    for (const f of failures) console.log(`  - ${f.file}: ${f.error}`);
    process.exit(1);
  }
}

function isDirectory(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function walkFiles(dir) {
  const out = [];
  function walk(p) {
    for (const entry of fs.readdirSync(p, { withFileTypes: true })) {
      const full = path.join(p, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.less'))) out.push(full);
    }
  }
  walk(dir);
  return out;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
