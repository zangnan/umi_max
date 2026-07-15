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

// =================== 文件 IO 辅助 ===================

/**
 * 写入文件并归一换行符为 LF。
 *
 * 背景：项目仓库约定所有文本文件使用 LF 行尾（git show HEAD:<file>
 * 验证：HEAD blob 内只有 0a，无 0d 0a）。但 code_sample 源文件可能
 * 是 CRLF（Windows 编辑器残留），脚本构造的字符串模板字面量有时
 * 含 \r\n。用此辅助函数统一归一为 LF，让生成文件与仓库约定一致，
 * 避免 git status 出现行尾 mismatch 的"伪修改"标记。
 */
function writeFileWithEol(file, content, encoding = 'utf-8') {
  const normalized = String(content).replace(/\r\n/g, '\n');
  fs.writeFileSync(file, normalized, encoding);
}

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
    const firstImportMatch = content.match(/^[ \t]*import\s/m);
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
      writeFileWithEol(cktsFile, newContent);
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
  writeFileWithEol(cktsFile, newContent);
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
  // 同时作用于 initEditForm 和 initAddForm（ref 中 initAddForm 通常是
  // DditCktsFormCommonFunc.initAddForm(param) 委托，无 unit_key / myFormItems；
  // 若 ref 用了解构形式同样需要 rename；其它方法无此约定差异，不动）
  if (methodName !== 'initEditForm' && methodName !== 'initAddForm') return methodCode;
  let out = methodCode;
  // 顺序无关：`\b` 词边界避免误改 unitKeyXxx / formItemsXxx / setFormItemsXxx 等变体
  out = out.replace(/\bunit_key\b/g, 'unitKey');
  out = out.replace(/\bmyFormItems\b/g, 'formItems');
  out = out.replace(/\bsetMyFormItems\b/g, 'setFormItems');
  return out;
}

// 应用到整个文件（不限 type-d）—— 扫描所有 Func.initEditForm / Func.initAddForm 方法体，
// 抽取 → 应用 migrateFuncMethodVariables → 替换回 text。
// 用 replace 链：先全量匹配方法块、改写、再放回；多次 replace 互不干扰。
function migrateFuncMethodVariablesInFile(text) {
  let out = text;
  for (const methodName of ['initEditForm', 'initAddForm']) {
    const block = extractFuncMethod(out, methodName);
    if (!block) continue;
    const rewritten = migrateFuncMethodVariables(block, methodName);
    if (rewritten !== block) {
      out = out.replace(block, rewritten);
    }
  }
  return out;
}

function postProcessFuncMethod(methodCode, methodName) {
  let out = methodCode;
  // out = migrateAntdUmiImports(out);
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
    if (/^[ \t]*import\s+type\s+/.test(trimmed)) continue;
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
      /^[ \t]*import\s+cktsUtil\s+from\s*['"][^'"]+['"]\s*;?$/.test(t) ||
      /^[ \t]*import\s*\{[^}]*\bcktsUtil\b[^}]*\}\s*from\s*['"][^'"]+['"]\s*;?$/.test(t)
    );
  });
  return importLines
    .map((line) => {
      const trimmed = line.trim();
      // if (/^[ \t]*import\s+moment\s+from\s+['"]moment['"]\s*;?$/.test(trimmed)) {
      //   return `import dayjs from 'dayjs';`;
      // }
      const myUtilMatch = trimmed.match(
        /^[ \t]*import\s+(\w+)\s+from\s+['"]@\/pages\/common\/myUtil['"]\s*;?$/,
      );
      if (myUtilMatch) {
        return `import ${myUtilMatch[1]} from '@/components/DDAssist/util';`;
      }
      const ddAlertMatch = trimmed.match(
        /^[ \t]*import\s+(\w+)\s+from\s+['"]@\/components\/DDAlert['"]\s*;?$/,
      );
      if (ddAlertMatch) {
        return `import ${ddAlertMatch[1]} from '@/pages/hts/components/DDAlert';`;
      }
      const staticTableCodeMatch = trimmed.match(
        /^[ \t]*import\s+(\w+)\s+from\s+['"]@\/pages\/common\/staticTableCode['"]\s*;?$/,
      );
      if (staticTableCodeMatch) {
        return `import ${staticTableCodeMatch[1]} from '@/components/DDAssist/staticTableCode';`;
      }
      const intlMyUtilNamedMatch = trimmed.match(
        /^[ \t]*import\s*\{([\s\S]*?)\}\s*from\s+['"]@\/pages\/common\/myUtil['"]\s*;?$/,
      );
      if (intlMyUtilNamedMatch) {
        return `import { ${intlMyUtilNamedMatch[1].trim()} } from '@/components/DDAssist/util';`;
      }
      const htsApiMatch = trimmed.match(
        /^[ \t]*import\s*\{([\s\S]*?)\}\s*from\s+['"]@\/services\/hts\/api['"]\s*;?$/,
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
        /^[ \t]*import\s+(\w+)\s+from\s+['"]@\/pages\/common\/field\/baseValidator['"]\s*;?$/,
      );
      if (baseValidatorMatch) {
        return `import ${baseValidatorMatch[1]} from '@/components/DDAssist/field/baseValidator';`;
      }
      const cjpzUtilMatch = trimmed.match(
        /^[ \t]*import\s+(\w+)\s+from\s+['"]@\/pages\/common\/cjpzUtil['"]\s*;?$/,
      );
      if (cjpzUtilMatch) {
        if (hasCktsUtilImport) {
          return null;
        }
        return `import cktsUtil from '@/pages/hts/cktsUtil';`;
      }
      const umiNamedMatch = line.match(
        /^[ \t]*import\s*\{([\s\S]*?)\}\s*from\s*(['"])umi\2\s*;?\s*$/,
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

let _specialRulesCache = null;

function loadSpecialRules() {
  if (_specialRulesCache) return _specialRulesCache;
  try {
    const rulesPath = path.join(__dirname, 'convert-ddbunit-config.rules.json');
    const rules = JSON.parse(fs.readFileSync(rulesPath, 'utf-8'));
    _specialRulesCache = Array.isArray(rules.special) ? rules.special : [];
  } catch {
    _specialRulesCache = [];
  }
  return _specialRulesCache;
}

// 替换后自动补 import 映射：replaces 规则把代码中某个符号改成另一个后，
// 若新内容用到映射中的符号但缺少对应 import，则在文件顶部补齐。
// 触发条件：replace 规则的 `new` 引入了 `old` 中没有的符号（即该符号是被替换规则"新引入"的）。
// 仅作用于 ts/tsx 文件（less 不需要 import）。
// matchType: 'property'（默认，匹配 `symbol.`，如 cktsUtil.X）｜ 'call'（匹配 `symbol(`，如 dayjs(x)）
const AUTO_IMPORTS_AFTER_REPLACE = [
  { symbol: 'cktsUtil', importLine: "import cktsUtil from '@/pages/hts/cktsUtil';" },
  { symbol: 'dayjs', importLine: "import dayjs from 'dayjs';", matchType: 'call' },
];

// 提取字符串中所有形如 `identifier.`（属性访问）和 `identifier(`（函数调用）的 token，
// 返回 Set<identifier>。支持两类符号用法（属性访问 vs 函数调用），用于自动检测
// replace 规则"新引入"的符号。
function extractSymbolTokens(s) {
  if (typeof s !== 'string') return new Set();
  // 属性访问：`identifier.` 但后不能跟引号/斜杠（避免路径字符串如 cktsUtil/）
  const propAccess = s.match(/\b[a-zA-Z_$][\w$]*\.(?!['"`\/])/g) || [];
  // 函数调用：`identifier(`（lookahead 不消费 `(`）
  const funcCall = s.match(/\b[a-zA-Z_$][\w$]*(?=\()/g) || [];
  const allMatches = [...propAccess, ...funcCall];
  return new Set(allMatches.map((m) => m.replace(/\.$/, '')));
}

function ensureAutoImports(content, introducedSymbols) {
  let text = content;
  for (const { symbol, importLine, matchType = 'property' } of AUTO_IMPORTS_AFTER_REPLACE) {
    if (!introducedSymbols.has(symbol)) continue;
    const usageRe = matchType === 'call'
      ? new RegExp(`\\b${symbol}\\(`)
      : new RegExp(`\\b${symbol}\\.(?!/)`);
    if (usageRe.test(text) && !text.includes(importLine)) {
      const firstImportMatch = text.match(/^[ \t]*import\s/m);
      if (firstImportMatch) {
        text = text.slice(0, firstImportMatch.index) + importLine + '\n' + text.slice(firstImportMatch.index);
      } else {
        text = importLine + '\n' + text;
      }
    }
  }
  return text;
}

// myUtil 顶层 import 自动补齐（alwaysOn；不依赖 replace 规则是否引入）：
//   检测文本中是否有 `myUtil.`（属性访问），若已有对应 import 跳过；
//   否则在第一个 import 行之前插入 `import myUtil from '@/components/DDAssist/util';`
//   已有导入检测覆盖三种形式（不重复插入）：
//     1. `import myUtil from '...';`            （纯 default 导入）
//     2. `import myUtil, { intl } from '...';`   （default + 命名混合）
//     3. `import { myUtil } from '...';`         （命名导入，codebase 0 处）
//   旧版本用 content.includes(importLine) 精确字符串匹配，遇到形式 2 会漏检导致重复插入。
// 适用场景：原 ref 可能没有 import myUtil 但代码体内用 myUtil.X；改写后 myUtil 引用被保留
// 但 import 在原流程可能被遗漏（type-d 不跑 import 路径改写）。
function ensureMyUtilImport(content) {
  if (!/\bmyUtil\.(?!['"`\/])/.test(content)) return content;
  const importLine = "import myUtil from '@/components/DDAssist/util';";
  // 检测现有 myUtil 导入（含 default + 命名混合形式）：
  //   - import myUtil from ...      （纯 default）
  //   - import myUtil, { ... }      （default + named 混合）
  //   - import { myUtil, ... }      （named 含 myUtil —— codebase 0 处但兼容）
  //   - import myUtil,myUtil2 ...   （罕见形式）
  const hasExistingImport =
    /^[ \t]*import\s+myUtil\b[\s,]*(?:\{[^}]*\})?\s*from\s*['"]@\/components\/DDAssist\/util['"]/m.test(content) ||
    /^[ \t]*import\s+\{[^}]*\bmyUtil\b[^}]*\}\s*from\s*['"]@\/components\/DDAssist\/util['"]/m.test(content);
  if (hasExistingImport) return content;
  const firstImportMatch = content.match(/^[ \t]*import\s/m);
  if (firstImportMatch) {
    return content.slice(0, firstImportMatch.index) + importLine + '\n' + content.slice(firstImportMatch.index);
  }
  return importLine + '\n' + content;
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

// r20：antd v6 Dropdown overlay={<Menu>...</Menu>} → menu={{ items: [...] }}
//
// 背景：antd v6 的 DropdownProps 完全删除了 overlay 属性（node_modules/antd/es/dropdown/dropdown.d.ts），
// 只能走 menu={{ items: [...] }} 形式。代码 sample（v4）大量使用 overlay={<Menu>...}，
// 需要在 copy 时改写为 v6 形式。
//
// 范围（简单场景自动转换）：
//   · <Dropdown ... overlay={(<Menu>...</Menu>)}>  静态 inline Menu
//   · 每个 <Menu.Item key=... onClick=...>label</Menu.Item> → { key, label, onClick }
//   · 有 onClick → label 包成 <a onClick={handler}>...</a>（与 ydgl2:1232 手改样本一致）
//   · 无 onClick → children 原样做 label
//   · 自闭合 <Menu.Item key='x'/> 也支持
//   · Dropdown 其它 props（placement / trigger / key）原样保留
//
// 跳过（复杂场景 log warn，原样保留待人工处理）：
//   · <Dropdown.Button>（不同组件，menu prop 行为不同）
//   · overlay={variable}（非常量 inline JSX，无法静态解析）
//   · overlay 内容含 ({ domEvent }) 解构（v4 Menu.Item.onClick 特有语义，v6 不可静默迁移）
//   · Menu 子元素含 <Access> / <Fragment> / 条件表达式 {cond ? '' : <Menu.Item>}（非平坦 list）
//
// 算法：<Dropdown 起点 regex + overlay={...} 起点 regex + bracket-depth 扫描 {} 配对 +
//       <Menu>...</Menu> 边界扫描 + <Menu.Item ...>...</Menu.Item> 子节点扫描。
function transformDropdownOverlayToMenu(content) {
  let count = 0;
  const skipped = [];

  // 在字符串字面量（' " `）内时跳过 {} —— 与 extractFuncMethod 同款简化
  function isInString(s, idx) {
    let i = idx - 1;
    while (i >= 0 && (s[i] === '\\')) i -= 2;
    if (i < 0) return null;
    const c = s[i];
    if (c === "'" || c === '"' || c === '`') return c;
    return null;
  }

  function findMatchingBrace(s, openIdx) {
    // s[openIdx] 必须是 '{'，返回匹配的 '}' 索引
    let depth = 1;
    let i = openIdx + 1;
    while (i < s.length) {
      const c = s[i];
      if (!isInString(s, i)) {
        if (c === '{') depth++;
        else if (c === '}') {
          depth--;
          if (depth === 0) return i;
        }
      }
      i++;
    }
    return -1;
  }

  function findOverlayStart(s, fromIdx) {
    // 从 fromIdx 起找 overlay={<  或 overlay={(
    const re = /overlay\s*=\s*\{/g;
    re.lastIndex = fromIdx;
    const m = re.exec(s);
    return m ? m.index + m[0].length - 1 : -1; // 返回 '{' 的索引
  }

  function scanJsxOpenTagEnd(content, startIdx) {
  // 从 <Tag 起点扫描开标签结束的 '>'，处理字符串字面量 ' " ` / JSX 表达式 {}
  // 返回 '>' 之后的位置索引（即开标签结束位置）；找不到返回 -1
  const m = /^<[A-Za-z]/.exec(content.slice(startIdx));
  if (!m) return -1;
  let i = startIdx + 1;
  // 跳过 tag name
  while (i < content.length && /[A-Za-z0-9.]/.test(content[i])) i++;
  if (i >= content.length) return -1;
  let inStr = null;
  let braceDepth = 0;
  while (i < content.length) {
    const c = content[i];
    if (inStr) {
      if (c === '\\') { i += 2; continue; }
      if (c === inStr) inStr = null;
    } else {
      if (c === '"' || c === "'" || c === '`') inStr = c;
      else if (c === '{') braceDepth++;
      else if (c === '}') braceDepth--;
      else if (c === '>' && braceDepth === 0) return i + 1;
    }
    i++;
  }
  return -1;
}

function findJsxTagBlock(s, tagName, fromIdx) {
    // 从 fromIdx 起找 <tagName ...>...</tagName> 或 <tagName .../>
    // 返回 { openStart, openEnd, closeStart, closeEnd, selfClosing }
    // 注意：tagName 必须严格匹配（<Menu> 不匹配 <Menu.Item>）
    const openRe = new RegExp(`<${tagName}(?=[\\s>/])`, 'g');
    openRe.lastIndex = fromIdx;
    const openMatch = openRe.exec(s);
    if (!openMatch) return null;
    const openStart = openMatch.index;
    // 扫描开标签 attrs（处理 ' " { 内的 >）
    let i = openStart + openMatch[0].length;
    let inStr = null;
    let braceDepth = 0;
    while (i < s.length) {
      const c = s[i];
      if (inStr) {
        if (c === '\\') { i += 2; continue; }
        if (c === inStr) inStr = null;
      } else {
        if (c === '"' || c === "'" || c === '`') inStr = c;
        else if (c === '{') braceDepth++;
        else if (c === '}') braceDepth--;
        else if (c === '>' && braceDepth === 0) break;
      }
      i++;
    }
    if (i >= s.length) return null;
    const openEnd = i;
    if (s[openEnd - 1] === '/') {
      // self-closing
      return { openStart, openEnd: openEnd + 1, closeStart: -1, closeEnd: -1, selfClosing: true };
    }
    // 找 </tagName>
    const closeRe = new RegExp(`</${tagName}\\s*>`, 'g');
    closeRe.lastIndex = openEnd + 1;
    const closeMatch = closeRe.exec(s);
    if (!closeMatch) return null;
    return {
      openStart,
      openEnd: openEnd + 1,
      closeStart: closeMatch.index,
      closeEnd: closeMatch.index + closeMatch[0].length,
      selfClosing: false,
    };
  }

  function extractMenuItem(itemText) {
    // itemText = '<Menu.Item ...>children</Menu.Item>' 或 '<Menu.Item .../>'
    // 返回 { key, onClick, childrenText, selfClosing }
    // attrs 必须用 scanner 处理，因为 '=>' 等含 '>' 字符
    if (!itemText.startsWith('<Menu.Item')) return null;
    let i = '<Menu.Item'.length;
    // 跳过空白
    while (i < itemText.length && /\s/.test(itemText[i])) i++;
    // 扫描 attrs（处理 ' " { 内的 >）
    let attrsEnd = -1;
    let isSelfClosing = false;
    let inStr = null;
    let braceDepth = 0;
    while (i < itemText.length) {
      const c = itemText[i];
      if (inStr) {
        if (c === '\\') { i += 2; continue; }
        if (c === inStr) inStr = null;
      } else {
        if (c === '"' || c === "'" || c === '`') inStr = c;
        else if (c === '{') braceDepth++;
        else if (c === '}') braceDepth--;
        else if (c === '>' && braceDepth === 0) {
          isSelfClosing = itemText[i - 1] === '/';
          attrsEnd = i;
          break;
        }
      }
      i++;
    }
    if (attrsEnd < 0) return null;
    const attrsStr = itemText.slice('<Menu.Item'.length, attrsEnd);

    // 提取 key
    let key = null;
    const keyRe = /\bkey\s*=\s*(?:\{([^}]+)\}|(['"])([^'"]+)\2)/;
    const km = keyRe.exec(attrsStr);
    if (km) {
      if (km[1] !== undefined) key = `{${km[1]}}`;
      else key = `'${km[3]}'`;
    }
    // 提取 onClick（用 scanner 跳 => 等含 > 的表达式）
    let onClick = null;
    const ocRe = /\bonClick\s*=\s*\{/;
    const ocMatch = ocRe.exec(attrsStr);
    if (ocMatch) {
      const openIdx = ocMatch.index + ocMatch[0].length - 1;
      const closeIdx = findMatchingBrace(attrsStr, openIdx);
      if (closeIdx >= 0) {
        onClick = attrsStr.slice(openIdx, closeIdx + 1);
      }
    }
    let childrenText = '';
    if (!isSelfClosing) {
      const endTag = '</Menu.Item>';
      const endIdx = itemText.lastIndexOf(endTag);
      if (endIdx > 0) childrenText = itemText.slice(attrsEnd + 1, endIdx);
    }
    return { key, onClick, childrenText, selfClosing: isSelfClosing };
  }

  // 主循环：从头扫描 <Dropdown 起点
  const result = [];
  let cursor = 0;
  while (cursor < content.length) {
    const ddRe = /<Dropdown\b/g;
    ddRe.lastIndex = cursor;
    const ddMatch = ddRe.exec(content);
    if (!ddMatch) {
      result.push(content.slice(cursor));
      break;
    }
    const ddStart = ddMatch.index;
    result.push(content.slice(cursor, ddStart));

    // 扫描开标签结束的 '>'（处理字符串字面量 / JSX 表达式）
    const openEnd = scanJsxOpenTagEnd(content, ddStart);
    if (openEnd < 0) {
      result.push(content.slice(ddStart, ddStart + ddMatch[0].length));
      cursor = ddStart + ddMatch[0].length;
      continue;
    }
    const openTagText = content.slice(ddStart, openEnd);

    // 检查是不是 Dropdown.Button
    if (/\bDropdown\.Button\b/.test(openTagText)) {
      skipped.push({ reason: 'Dropdown.Button 是不同组件，不在自动转换范围', lineHint: lineOf(content, ddStart) });
      result.push(content.slice(ddStart, openEnd));
      cursor = openEnd;
      continue;
    }

    // 找 overlay={ 在开标签 attrs 内的位置
    const overlayRe = /overlay\s*=\s*\{/g;
    const openTagSlice = content.slice(ddStart, openEnd);
    overlayRe.lastIndex = 0;
    const overlayMatch = overlayRe.exec(openTagSlice);
    if (!overlayMatch) {
      cursor = openEnd;
      continue;
    }
    const overlayStart = ddStart + overlayMatch.index; // 'overlay' 起点（含 leading whitespace）
    const braceStart = ddStart + overlayMatch.index + overlayMatch[0].length - 1; // '{' 的绝对位置
    const braceEnd = findMatchingBrace(content, braceStart);
    if (braceEnd < 0) {
      result.push(content.slice(ddStart, ddStart + tagEndRe[0].length));
      cursor = ddStart + tagEndRe[0].length;
      continue;
    }
    const overlayContent = content.slice(braceStart + 1, braceEnd).trim();

    // 常见 overlay={(...)} 模式：去掉外层括号（仅当括号包裹 JSX，不是函数调用）
    let jsxContent = overlayContent;
    if (jsxContent.startsWith('(') && jsxContent.endsWith(')')) {
      jsxContent = jsxContent.slice(1, -1).trim();
    }
    jsxContent = jsxContent.trim();

    // 检查 overlay 内容是不是 inline JSX（以 < 开头）
    if (!jsxContent.startsWith('<')) {
      skipped.push({ reason: `overlay={非 inline JSX，疑似变量: ${overlayContent.slice(0, 30).replace(/\s+/g, ' ')}...`, lineHint: lineOf(content, ddStart) });
      result.push(content.slice(ddStart, braceEnd + 1));
      cursor = braceEnd + 1;
      continue;
    }

    // 检查 domEvent 解构
    if (/\(\s*\{\s*domEvent\s*\}/.test(jsxContent)) {
      skipped.push({ reason: 'onClick 解构 domEvent，v4 Menu.Item 特有语义，v6 不可静默迁移', lineHint: lineOf(content, ddStart) });
      result.push(content.slice(ddStart, braceEnd + 1));
      cursor = braceEnd + 1;
      continue;
    }

    // 检查 Menu 内非平坦子元素
    if (/<Access\b|<Fragment\b/.test(jsxContent) || /\{[^}]+\?\s*[^}]+:\s*[^}]+\}/.test(jsxContent)) {
      skipped.push({ reason: 'Menu 含非平坦子元素（<Access> / <Fragment> / 条件表达式）', lineHint: lineOf(content, ddStart) });
      result.push(content.slice(ddStart, braceEnd + 1));
      cursor = braceEnd + 1;
      continue;
    }

    // 找 <Menu>...</Menu>
    const menuBlock = findJsxTagBlock(jsxContent, 'Menu', 0);
    if (!menuBlock || menuBlock.selfClosing) {
      skipped.push({ reason: '<Menu> 块未找到或格式异常', lineHint: lineOf(content, ddStart) });
      result.push(content.slice(ddStart, braceEnd + 1));
      cursor = braceEnd + 1;
      continue;
    }
    // 限制：Menu 标签不能有属性（className 等需要手动迁移）
    const menuOpenTag = jsxContent.slice(menuBlock.openStart, menuBlock.openEnd);
    if (!/^<Menu\s*>$/.test(menuOpenTag)) {
      skipped.push({ reason: '<Menu> 含属性（如 className），需手动迁移到 menu={{ className, items }}', lineHint: lineOf(content, ddStart) });
      result.push(content.slice(ddStart, braceEnd + 1));
      cursor = braceEnd + 1;
      continue;
    }
    const menuInner = jsxContent.slice(menuBlock.openEnd, menuBlock.closeStart);

    // 解析每个 <Menu.Item ...>...</Menu.Item>
    const items = [];
    let itemCursor = 0;
    let parseOk = true;
    while (itemCursor < menuInner.length) {
      const itemRe = /<Menu\.Item\b/g;
      itemRe.lastIndex = itemCursor;
      const itemMatch = itemRe.exec(menuInner);
      if (!itemMatch) break;
      const itemStart = itemMatch.index;
      const itemBlock = findJsxTagBlock(menuInner, 'Menu.Item', itemStart);
      if (!itemBlock) {
        parseOk = false;
        break;
      }
      const itemText = menuInner.slice(itemBlock.openStart, itemBlock.selfClosing ? itemBlock.openEnd : itemBlock.closeEnd);
      const parsed = extractMenuItem(itemText);
      if (!parsed) {
        parseOk = false;
        break;
      }
      items.push(parsed);
      itemCursor = itemBlock.selfClosing ? itemBlock.openEnd : itemBlock.closeEnd;
    }

    if (!parseOk || items.length === 0) {
      skipped.push({ reason: 'Menu.Item 解析失败（可能嵌套 / 格式异常）', lineHint: lineOf(content, ddStart) });
      cursor = braceEnd + 1;
      continue;
    }

    // 构造 items 数组字符串
    const itemStrs = items.map((it) => {
      const parts = [];
      if (it.key !== null) parts.push(`key: ${it.key}`);
      if (it.onClick !== null) {
        // 有 onClick → label 包成 <a onClick={...}>...</a>
        const childTrim = it.childrenText.trim();
        parts.push(`label: <a onClick={${it.onClick.slice(1, -1)}}>${childTrim}</a>`);
      } else {
        // 无 onClick → children 原样做 label
        parts.push(`label: ${it.childrenText.trim() || "''"}`);
      }
      return `{ ${parts.join(', ')} }`;
    });
    const menuRepl = `menu={{ items: [\n        ${itemStrs.join(',\n        ')},\n      ] }}`;

    // 替换 overlay={...} 段（保留 overlay 之前的 Dropdown attrs，包括 placement 等）
    result.push(content.slice(ddStart, overlayStart), menuRepl);
    cursor = braceEnd + 1;
    count++;
  }

  return { content: result.join(''), count, skipped };
}

function lineOf(content, idx) {
  let n = 1;
  for (let i = 0; i < idx && i < content.length; i++) {
    if (content[i] === '\n') n++;
  }
  return n;
}

// 清理未被引用的 import { Menu } from 'antd';
// 仅当文件内不再含 Menu.Item / Menu.SubMenu / Menu.Divider / Menu.ItemGroup 时清理
function cleanupUnusedMenuImport(content) {
  if (/Menu\.(Item|SubMenu|Divider|ItemGroup)\b/.test(content)) {
    return { content, removed: false };
  }
  // 找 import { ... } from 'antd'（行级匹配）
  const m = /^[ \t]*import\s*\{([^}]+)\}\s*from\s*['"]antd['"]\s*;?[ \t]*\r?\n?/m.exec(content);
  if (!m || !/\bMenu\b/.test(m[1])) return { content, removed: false };
  const names = m[1].split(',').map((s) => s.trim()).filter(Boolean);
  const newNames = names.filter((n) => n !== 'Menu');
  if (newNames.length === 0) {
    // 整行删除（连同换行）
    const removed = content.replace(m[0], '');
    return { content: removed, removed: true };
  }
  const newImport = `import { ${newNames.join(', ')} } from 'antd';\n`;
  return { content: content.replace(m[0], newImport), removed: true };
}

// rules.special 专用：按 fileName 查找并应用该文件特有的替换规则。
// 触发条件：传入的 srcFile 与 rules.special[*].fileName 精确匹配（路径分隔符归一为 /）。
// 适用场景：某个具体文件需要做特殊文本替换（不适用于通用规则）。
function applySpecialReplacements(content, srcFile) {
  if (!srcFile) return content;
  const normalizedSrc = srcFile.replace(/\\/g, '/');
  const specialRules = loadSpecialRules();
  const entry = specialRules.find((s) => s && s.fileName === normalizedSrc);
  if (!entry || !Array.isArray(entry.replace) || entry.replace.length === 0) return content;

  let text = content;
  for (const { old: oldStr, new: newStr } of entry.replace) {
    if (typeof oldStr !== 'string' || oldStr.length === 0) continue;
    text = text.split(oldStr).join(newStr);
  }
  return text;
}

// rules.special[*].line 专用：按 fileName + 行号定位，替换生成文件中指定行的内容。
// 触发条件：srcFile 与 rules.special[*].fileName 精确匹配 + entry.line 是非空数组。
// 适用场景：参照文件含被注释包裹的孤儿 JSX 标签（如注释掉 {<Tabs.TabPane ...>} 后剩
//           单独一个 </Tabs.TabPane>），需要手动补一个对应开始标签来闭合 JSX 结构。
// 规则形态：line 数组每项为单 key 对象，如 [{ "31": "<Tabs>" }] → 改写生成文件 line 31。
// 注意：
//   - 行号 N 作用于生成文件（不是 ref 文件）；ref 文件 line N 内容仅用于 log 输出
//   - 行号越界（lineNo < 1 或 > lines.length）时 console.warn 跳过，原内容保留
//   - 同一文件 entry 可同时含 replace 和 line；line 在 replace 之后执行
function applySpecialLineReplacements(content, srcFile) {
  if (!srcFile) return content;
  const normalizedSrc = srcFile.replace(/\\/g, '/');
  const specialRules = loadSpecialRules();
  const entry = specialRules.find((s) => s && s.fileName === normalizedSrc);
  if (!entry || !Array.isArray(entry.line) || entry.line.length === 0) return content;

  const lines = content.split('\n');
  let touched = 0;
  for (const lineRepl of entry.line) {
    const keys = Object.keys(lineRepl);
    if (keys.length === 0) continue;
    const lineNo = parseInt(keys[0], 10);
    const newText = lineRepl[keys[0]];
    if (!Number.isFinite(lineNo) || lineNo < 1 || lineNo > lines.length) {
      console.warn(
        `  [special-line] 跳过 ${normalizedSrc} line ${lineNo}: 行号越界 (总行数 ${lines.length})`,
      );
      continue;
    }
    const oldLine = lines[lineNo - 1];
    lines[lineNo - 1] = newText;
    console.log(
      `  [special-line] ${normalizedSrc} line ${lineNo}: ${JSON.stringify(oldLine)} → ${JSON.stringify(newText)}`,
    );
    touched++;
  }
  return touched > 0 ? lines.join('\n') : content;
}

function applyContentReplaces(content, fileExt, srcFile) {
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

  // 第四点六遍：antd v6 Dropdown overlay={<Menu>...</Menu>} → menu={{ items: [...] }}（仅 ts/tsx）
  //   仅处理简单 inline Menu 场景；复杂场景（Dropdown.Button / 动态 MenuItem 构建器 /
  //   overlay={variable} / 非平坦子元素 / domEvent 解构）log warn 后原样保留，由人工处理
  if (fileExt === 'ts') {
    const ddResult = transformDropdownOverlayToMenu(text);
    if (ddResult.count > 0) {
      text = ddResult.content;
      console.log(`[convert] r20 antd v6 Dropdown overlay→menu: 命中 ${ddResult.count} 处 (${srcFile || '?'})`);
    }
    for (const s of ddResult.skipped) {
      console.warn(`[convert][skip] Dropdown overlay 未自动转换: ${s.reason} (${srcFile || '?'}:${s.lineHint || '?'})`);
    }
  }

  // 第四点七遍：清理未使用的 Menu import（仅 ts/tsx；alwaysOn）
  if (fileExt === 'ts') {
    const clResult = cleanupUnusedMenuImport(text);
    if (clResult.removed) {
      text = clResult.content;
    }
  }

  // 第四点五遍：getCodeFromServerT1 / getCodeValByKey / getCode 3 参 → 2 参合并（仅 ts/tsx）
  //   myUtil.code.getCodeFromServerT1('aaa', 'bbb') → myUtil.code.getCodeFromServerT1('aaa:bbb')
  //   原有实现面向 fun 方法体（postProcessFuncMethod 调用），现在扩展到所有 ts/tsx 文件
  if (fileExt === 'ts') {
    text = migrateGetCodeValByKey(text);
    text = migrateGetCode(text);
    text = migrateGetCodeFromServerT1(text);
  }

  // 第四点八遍：Func.initEditForm / Func.initAddForm 方法体变量改名（仅 ts/tsx）
  //   unit_key → unitKey / myFormItems → formItems / setMyFormItems → setFormItems
  //   含 params.unit_key → params.unitKey 同步（regex \b 已覆盖）
  //   复用 extractFuncMethod 定位方法块 + migrateFuncMethodVariables 改写
  if (fileExt === 'ts') {
    text = migrateFuncMethodVariablesInFile(text);
  }

  // 第四点九遍：myUtil 顶层 import 自动补齐（仅 ts/tsx；alwaysOn）
  //   检测 myUtil. 使用 → 若无对应 import 则补齐 `@/components/DDAssist/util`
  //   不依赖 replace 规则是否引入（独立 alwaysOn 路径）
  if (fileExt === 'ts') {
    text = ensureMyUtilImport(text);
  }

  // 第五遍：特殊文件替换（按 fileName 匹配）
  // 放在最后：在所有通用转换之后执行，特殊规则可"覆盖"之前的任何输出
  if (srcFile) {
    text = applySpecialReplacements(text, srcFile);
  }

  // 第六遍：特殊文件按行号替换（按 fileName 匹配；line 字段）
  // 在 replace 之后执行：行号级精确改写可"覆盖"任何前面的输出
  if (srcFile) {
    text = applySpecialLineReplacements(text, srcFile);
  }

  return text;
}

// =================== index 调整函数 ===================
function applyImportRewritesToContent(content) {
  let text = content;
  // text = text.replace(
  //   /^[ \t]*import\s+moment\s+from\s+['"]moment['"]\s*;?[ \t]*$/gm,
  //   "import dayjs from 'dayjs';",
  // );
  text = text.replace(
    /^[ \t]*import\s+(\w+)\s+from\s+['"]@\/pages\/common\/myUtil['"]\s*;?[ \t]*$/gm,
    "import $1 from '@/components/DDAssist/util';",
  );
  text = text.replace(
    /^[ \t]*import\s+(\w+)\s+from\s+['"]@\/pages\/common\/cktsUtil['"]\s*;?[ \t]*$/gm,
    "import $1 from '@/pages/hts/cktsUtil';",
  );
  text = text.replace(
    /^[ \t]*import\s+(\w+)\s+from\s+['"]@\/pages\/common\/qxUtil['"]\s*;?[ \t]*$/gm,
    "import $1 from '@/pages/hts/common/qxUtil';",
  );
  text = text.replace(
    /^[ \t]*import\s+(\w+)\s+from\s+['"]@\/components\/DDImport\/checkErrorProp['"]\s*;?[ \t]*$/gm,
    "import $1 from '@/pages/hts/components/DDImport/checkErrorProp';",
  );
  text = text.replace(
    /^[ \t]*import\s+(\w+)\s+from\s+['"]@\/components\/DDAlert['"]\s*;?[ \t]*$/gm,
    "import $1 from '@/pages/hts/components/DDAlert';",
  );
  text = text.replace(
    /^[ \t]*import\s+(\w+)\s+from\s+['"](?:@\/pages\/common\/staticTableCode|@\/components\/DDAssist\/staticTableCode)['"]\s*;?[ \t]*$/gm,
    "import $1 from '@/pages/hts/commonModule/staticTableCode';",
  );
  text = text.replace(
    /^[ \t]*import\s*\{([\s\S]*?)\}\s*from\s*['"]@\/pages\/common\/myUtil['"]\s*;?[ \t]*$/gm,
    (_m, names) => `import { ${names.trim()} } from '@/components/DDAssist/util';`,
  );
  text = text.replace(
    /^[ \t]*import\s*\{([\s\S]*?)\}\s*from\s*['"]@\/services\/hts\/api['"]\s*;?[ \t]*$/gm,
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
    /^[ \t]*import\s+(\w+)\s+from\s+['"]@\/pages\/common\/field\/baseValidator['"]\s*;?[ \t]*$/gm,
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
      /^[ \t]*import\s+(\w+)\s+from\s+['"]@\/pages\/common\/cjpzUtil['"]\s*;?[ \t]*$/gm,
      "import cktsUtil from '@/pages/hts/cktsUtil';",
    );
  }
  text = text.replace(
    /^[ \t]*import\s*\{([\s\S]*?)\}\s*from\s*(['"])umi\2\s*;?[ \t]*$/gm,
    (m, inner, quote) => {
      if (/\buseRouteMatch\b/.test(inner)) {
        const renamed = inner.replace(/\buseRouteMatch\b/g, 'useRouteData');
        return `import {${renamed}} from ${quote}umi${quote};`;
      }
      return m;
    },
  );

  // R18: useIntl 移除（umi 4 中改用顶层 intl 对象）
  // - import { useIntl } from 'umi' → 整行删除（包含 trailing \r\n）
  // - import { a, useIntl, b } from 'umi' → import { a, b } from 'umi'
  // 紧跟自动注入：import { intl } from '@/components/DDAssist/util';
  // 注意：内层用 [^{}]*? 而非 [\s\S]*? —— 避免跨 import 行匹配
  let useIntlRemoved = 0;
  text = text.replace(
    /^[ \t]*import\s*\{[^{}]*?\}\s*from\s*(['"])umi\1\s*;?[ \t]*\r?\n?/gm,
    (m, quote) => {
      // 取出 inner（去掉 { } 包裹）
      const innerMatch = m.match(/\{([^{}]*?)\}/);
      if (!innerMatch) return m;
      const inner = innerMatch[1];
      if (!/\buseIntl\b/.test(inner)) return m;
      const names = inner
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      const filtered = names.filter((s) => s !== 'useIntl');
      useIntlRemoved += names.length - filtered.length;
      if (filtered.length === 0) return ''; // 整行删除（带 trailing \r\n）
      return `import { ${filtered.join(', ')} } from ${quote}umi${quote};\n`;
    },
  );
  if (useIntlRemoved > 0) {
    const hasIntlImport =
      /^[ \t]*import\s+\{[^}]*\bintl\b[^}]*\}\s*from\s*['"]@\/components\/DDAssist\/util['"]/m.test(text) ||
      /^[ \t]*import\s+\w+\s*,\s*\{[^}]*\bintl\b[^}]*\}\s*from\s*['"]@\/components\/DDAssist\/util['"]/m.test(text);
    if (!hasIntlImport) {
      const importLine = "import { intl } from '@/components/DDAssist/util';";
      const firstImportMatch = text.match(/^[ \t]*import\s/m);
      if (firstImportMatch) {
        text =
          text.slice(0, firstImportMatch.index) +
          importLine + '\n' +
          text.slice(firstImportMatch.index);
      } else {
        text = importLine + '\n' + text;
      }
    }
  }

  // 相邻行 default + named 同模块合并（避免 ref 中 `import X from` + `import { y } from X` 两行）
  // 匹配紧邻两行：
  //   import <default> from '<module>';
  //   import { <named> } from '<module>';
  // 合并为：
  //   import <default>, { <named> } from '<module>';
  // 限制条件：仅合并相邻两行（无空行），named 名字与 default 不重名（防命名冲突）
  text = text.replace(
    /(^import\s+(\w+)\s+from\s*(['"])([^'"]+)\3\s*;\s*\n)(import\s*\{([^}]+)\}\s+from\s*(['"])([^'"]+)\7\s*;)/gm,
    (full, line1, defaultName, q1, defaultPath, line2, namedList, q2, namedPath) => {
      if (defaultPath !== namedPath) return full;
      const names = namedList
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && s !== defaultName);
      if (names.length === 0) return full; // named 全是 defaultName（异常），不合并
      return `import ${defaultName}, { ${names.join(', ')} } from ${q1}${defaultPath}${q1};`;
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
    /^[ \t]*import\s+(\w+)\s+from\s+['"]\.\/auto_config['"]\s*;?/m,
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
    /^[ \t]*import\s+DDBunit2\s+from\s+['"]@\/components\/DDBunit\/DDBunit2['"]\s*;?[ \t]*$/gm,
    "import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';",
  );
}

function applyIndexImportRewrites(content) {
  let text = content;
  text = text.replace(
    /^[ \t]*import\s+UnitUtil\s+from\s+['"]@\/components\/DDBunit\/unit_util['"]\s*;?[ \t]*$/gm,
    "import cktsUtil from '@/pages/hts/cktsUtil';",
  );
  text = text.replace(
    /^[ \t]*import\s*\{([\s\S]*?)\}\s*from\s+['"]@\/services\/hts\/apiTb['"]\s*;?[ \t]*$/gm,
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
  return text;
}

// 已移除 commentOutNonDDBunit2Components：
//   该函数会把 return 体里所有非 DDBunit2 的大写 JSX 组件
//   （如 <Tabs> / <Tabs.TabPane> 等 antd 布局组件）注释化，
//   并连带注释对应 import。
//   这对含 antd 布局组件的 ref（如 mbcx/slcx/index.tsx 的 <Tabs>）
//   会破坏 JSX 结构。用户决策：不再调用。

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

// 已移除 generateIndexFileFromRef / generateFunPage：
//   后续每份 ts/tsx 走 type-d 流程独立处理（基于自身参照 + applyCopyRewritesToFile），
//   不再由 type-a 末尾生成配对 index/fun，也不再有 ref 提取 / 方法抽取。

// =================== 复制后改写规则 ===================
function applyCopyRewrites(content, srcFile) {
  let text = content;

  // R1: '@/services/hts/api' → '@/pages/hts/services/htsApi'(多行折叠为单行)
  text = text.replace(
    /^[ \t]*import\s*\{([\s\S]*?)\}\s*from\s*['"]@\/services\/hts\/api['"]\s*;?[ \t]*$/gm,
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
    /^[ \t]*import\s+(\w+)\s+from\s+['"]@\/pages\/common\/myUtil['"]\s*;?[ \t]*$/gm,
    "import $1 from '@/components/DDAssist/util';",
  );

  // R2a: '@/pages/common/myUtil' (命名导入) → '@/components/DDAssist/util'
  text = text.replace(
    /^[ \t]*import\s*\{([^\}]+)\}\s*from\s+['"]@\/pages\/common\/myUtil['"]\s*;?[ \t]*$/gm,
    (m, names) => `import { ${names.trim()} } from '@/components/DDAssist/util';`,
  );

  // R2b: '@/pages/common/field/baseValidator' (default 导入) → '@/components/DDAssist/field/baseValidator'
  text = text.replace(
    /^[ \t]*import\s+(\w+)\s+from\s+['"]@\/pages\/common\/field\/baseValidator['"]\s*;?[ \t]*$/gm,
    "import $1 from '@/components/DDAssist/field/baseValidator';",
  );

  // R2c: '@/pages/common/field/businessValidator' (default 导入) → '@/pages/hts/common/field/businessValidator'
  text = text.replace(
    /^[ \t]*import\s+(\w+)\s+from\s+['"]@\/pages\/common\/field\/businessValidator['"]\s*;?[ \t]*$/gm,
    "import $1 from '@/pages/hts/common/field/businessValidator';",
  );

  // R3: '@/pages/common/proConfig' → '@/components/DDAssist/constants'
  text = text.replace(
    /^[ \t]*import\s+\w+\s+from\s+['"]@\/pages\/common\/proConfig['"]\s*;?[ \t]*$/gm,
    "import CONSTANTS from '@/components/DDAssist/constants';",
  );

  // R4: pro.c_modal_width_x[1-4] → CONSTANTS.C_MODAL_WIDTH_X[1-4]
  text = text.replace(/\bpro\.c_modal_width_x([1-4])\b/g, 'CONSTANTS.C_MODAL_WIDTH_X$1');

  // R5: '@/components/DDAlert' → '@/pages/hts/components/DDAlert'
  text = text.replace(
    /^[ \t]*import\s+(\w+)\s+from\s+['"]@\/components\/DDAlert['"]\s*;?[ \t]*$/gm,
    "import $1 from '@/pages/hts/components/DDAlert';",
  );

  // R13: '@/components/DDBunit/DDBunit2' → '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS'
  text = text.replace(
    /^[ \t]*import\s+DDBunit2\s+from\s+['"]@\/components\/DDBunit\/DDBunit2['"]\s*;?[ \t]*$/gm,
    "import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';",
  );

  // R13b: '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS'（已重写过的旧目标）→ '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS'
  //   处理 code_sample ref 文件已含旧目标路径的"stale ref"场景（ref 早于本轮规则改动时固化）
  text = text.replace(
    /^[ \t]*import\s+DDBunit2\s+from\s+['"]@\/pages\/hts\/commonModule\/ddbunit2_ckts\/DDBunit2_CKTS['"]\s*;?[ \t]*$/gm,
    "import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';",
  );

  // R15: '@/pages/common/cktsUtil' (default 导入) → '@/pages/hts/cktsUtil'
  text = text.replace(
    /^[ \t]*import\s+(\w+)\s+from\s+['"]@\/pages\/common\/cktsUtil['"]\s*;?[ \t]*$/gm,
    "import $1 from '@/pages/hts/cktsUtil';",
  );

  // R16: '@/pages/common/qxUtil' (default 导入) → '@/pages/hts/common/qxUtil'
  text = text.replace(
    /^[ \t]*import\s+(\w+)\s+from\s+['"]@\/pages\/common\/qxUtil['"]\s*;?[ \t]*$/gm,
    "import $1 from '@/pages/hts/common/qxUtil';",
  );

  // R17: '@/components/DDImport/checkErrorProp' (default 导入) → '@/pages/hts/components/DDImport/checkErrorProp'
  text = text.replace(
    /^[ \t]*import\s+(\w+)\s+from\s+['"]@\/components\/DDImport\/checkErrorProp['"]\s*;?[ \t]*$/gm,
    "import $1 from '@/pages/hts/components/DDImport/checkErrorProp';",
  );

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
      const firstImportMatch = text.match(/^[ \t]*import\s/m);
      if (firstImportMatch) {
        const pos = firstImportMatch.index;
        text = text.slice(0, pos) + "import formUtil from '@/components/DDForm/formUtil';\n" + text.slice(pos);
      }
    }
  }

  // R10b: formUtil 导入（仅当源文件含 UnitUtil.code.initFormItemsCodeTable 时添加）
  if (!text.includes("from '@/components/DDForm/formUtil'")) {
    let srcHasInitFormItemsCodeTable = false;
    if (srcFile) {
      try {
        const srcContent = fs.readFileSync(srcFile, 'utf-8');
        srcHasInitFormItemsCodeTable = /\bUnitUtil\.code\.initFormItemsCodeTable\b/.test(srcContent);
      } catch (e) { /* 源文件不存在则跳过 */ }
    }
    if (srcHasInitFormItemsCodeTable) {
      const firstImportMatch = text.match(/^[ \t]*import\s/m);
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

  return text;
}

// =================== 文件类型分类 ===================
/**
 * 根据文件名和内容判断文件类型
 * @returns 'a' | 'd' | 'e' | 'f'
 *
 * 后续简化（用户决策）：所有 ts/tsx 走统一"复制 + 改写"流程。
 * - type-a: config 文件（特殊字段规则 r-renames / r-special 转换）
 * - type-d: 其它 ts/tsx（含 index / modal_index / func / 任意 .tsx）
 *   每份文件独立基于自身参照处理，无 ref 提取 / 方法抽取 / 配对 index/fun 生成
 * - type-e: less 文件（含 @primary_ / @font_color 等行注释规则）
 * - type-f: 排除
 */
function classifyFile(filepath, content) {
  const basename = path.basename(filepath);
  const hasConfigName = /auto_config|config/i.test(basename);

  // a: config 文件（文件名含 config + 内容含关键属性之一）
  if (hasConfigName && /\b(grid_columns|filter_items|form_items|toolbar_default|grid_handle_columns_default)\b/.test(content)) {
    return 'a';
  }
  // d: 其它 ts/tsx 文件（含 index / modal_index / func / 任意 .tsx）—— 复制 + applyCopyRewrites + applyContentReplaces
  if (/\.tsx?$/.test(basename)) {
    return 'd';
  }
  // e: less 文件（含 @primary_ / @font_color 等行注释规则）
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
  outContent = applyContentReplaces(outContent, 'ts', srcFile);

  // 写出 config 文件
  fs.mkdirSync(path.dirname(dstFile), { recursive: true });
  writeFileWithEol(dstFile, outContent);
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
    fs.mkdirSync(path.dirname(readmePath), {recursive: true});
    writeFileWithEol(readmePath, readme);
    console.log(`  [type-a] 已生成 README`);
  }

  // 不再生成配对 index.tsx / fun.tsx：index/fun 文件作为独立 tsx 文件
  // 由目录批处理走 type-d 流程单独处理（基于自身参照 + applyCopyRewritesToFile）。
}

/**
 * 类型 e: less 文件 → 含有 "@/assets/css/config.less" 的行注释掉，
 *                       含有 "@font_color" / "@primary_" / "@base_font_"
 *                       / ".png')" 的行也注释掉（保留缩进），
 *                       并删除 "@import '~antd/lib/style/themes/default.less';"
 */
function processTypeE(srcFile, dstFile) {
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
      if (
        (/@font_color/.test(line) ||
          /@primary_/.test(line) ||
          /@base_font_/.test(line) ||
          /\.png'\)/.test(line)) &&
        !line.trim().startsWith('//')
      ) {
        modified = true;
        const indentMatch = line.match(/^[ \t]*/);
        const indent = indentMatch ? indentMatch[0] : '';
        return `${indent}// ${line.trim()}`;
      }
      return line;
    });
  let finalText = newLines.join('\n');
  // rules.replace.less (less 文本替换，作为最终步骤)
  const replacedText = applyContentReplaces(finalText, 'less', srcFile);
  if (replacedText !== finalText) {
    finalText = replacedText;
    modified = true;
  }
  if (modified) {
    writeFileWithEol(dstFile, finalText);
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
  const replacedContent = applyContentReplaces(content, 'ts', srcFile);
  if (replacedContent !== content) {
    content = replacedContent;
    modified = true;
  }

  if (modified) {
    writeFileWithEol(dstFile, content);
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
      writeFileWithEol(out, rewritten);
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
        case 'e':
          processTypeE(args.src, out);
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
    processSpecialStage();
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
            writeFileWithEol(dstFile, rewrittenA);
            console.log(`  ↪ 已应用改写规则`);
          }
          processTypeA(srcFile, dstFile, args);
          break;
        case 'e':
          processTypeE(srcFile, dstFile);
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

  // ========== 5. special 阶段：code_sample/special/src → 项目 src/ ==========
  processSpecialStage();

  // 6. 汇总
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

/**
 * special 阶段：把 code_sample/special/src/ 原样覆盖到项目 src/。
 *
 * - 默认总是执行（用户原话「在最后增加一个处理过程」）。
 * - 源目录缺失时 silent fallback，仅打 log 不抛错。
 * - 只做原始覆盖，不应用任何 rewrite 流水线（这 4 个文件本身已是新协议成品）。
 */
function processSpecialStage() {
  const specialSrc = path.join(__dirname, '..', 'code_sample', 'special', 'src');
  const specialDst = path.join(__dirname, '..', 'src');
  try {
    if (fs.existsSync(specialSrc)) {
      console.log(`\n[special] 开始覆盖: ${specialSrc} → ${specialDst}`);
      fs.cpSync(specialSrc, specialDst, { recursive: true, force: true });
      console.log(`[special] 覆盖完成`);
    } else {
      console.log(`\n[special] 跳过: ${specialSrc} 不存在`);
    }
  } catch (e) {
    console.error(`[special] 失败: ${e.message}`);
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

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

// 暴露核心函数供测试脚本引用；不影响 main() 自动执行
module.exports = {
  applyContentReplaces,
  applySpecialReplacements,
  applySpecialLineReplacements,
  loadSpecialRules,
  applyCopyRewrites,
  applyImportRewritesToContent,
  ensureMyUtilImport,
  transformDropdownOverlayToMenu,
  cleanupUnusedMenuImport,
};
