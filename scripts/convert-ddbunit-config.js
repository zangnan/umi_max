#!/usr/bin/env node
/**
 * convert-ddbunit-config.js
 *
 * 将使用旧版 DDBunit2 协议的 config.tsx 转换为当前项目标准 DDBunit2 协议。
 *
 * 用法（推荐最简形式）：
 *   node scripts/convert-ddbunit-config.js --src <input.tsx>
 *
 *   - --out 不传时自动派生：src 以 code_sample/ 开头则去掉该前缀
 *   - --readme 不传时自动派生：与 --out 同文件夹、同基名（后缀 .README.md）
 *   - --no-readme 显式禁用 README 生成
 *   - --page / --fun 不传时自动派生：与 --out 同文件夹，文件名后缀分别加 _index / _fun
 *   - --no-page 同时禁用 index + fun 页面
 *   - --no-fun 仅禁用 fun 页面（仍生成 index）
 *   - --index <name>            index 页面参照文件 basename（无扩展名），
 *                               同目录下 <name>.tsx；缺省 = 同目录下 index.tsx
 *                               命中后把参照里的 `initSearchModal: [...]` 段
 *                               原样注入到生成的 auto_configIndex.tsx
 *   - --no-route 禁用 routes.ckts.ts 自动追加（默认追加到慧退税父路由下）
 *
 * 完整参数：
 *   --src <input.tsx>            源文件（必需）
 *   [--out <output.tsx>]         输出 config 路径（默认从 src 自动派生）
 *   [--readme <output.README.md>]  字段对比 README 路径（默认与 out 同目录）
 *   [--no-readme]                禁用 README 生成
 *   [--no-page]                  禁用 index + fun 页面
 *   [--no-fun]                   仅禁用 fun 页面（仍生成 index）
 *   [--index <name>]             index 参照文件 basename（无扩展名），同目录下 <name>.tsx
 *   [--no-route]                 禁用 routes.ckts.ts 自动追加
 *   [--config-var <name>]        显式指定配置变量名（默认自动检测）
 *   [--rules <rules.json>]       自定义规则文件（默认内置）
 *
 * 转换规则默认从 scripts/convert-ddbunit-config.rules.json 读取，可用 --rules 覆盖。
 *
 * 处理流程：
 *   1. 检测配置变量名（默认从 `const <name>: any = {};` 提取，可 --config-var 覆盖）
 *   2. 顶层 key 重命名（rules.renames）
 *   3. toolbar_default 内嵌 key 重命名（rules.toolbarRenames），作用域限定
 *   4. 顶层 key 删除（rules.removes），整段赋值连同尾随换行一并移除
 *   4.6 render 函数形式 → 标准 { type, format } 对象（r7 增强）
 *   4.7 日期格式字符串里 yyyy 归一化为 YYYY（r8 增强）
 *   5. 前置 import 语句（rules.prependImports），已存在则跳过
 *   5.5 删除指定 import（rules.removeImports），常用于清理旧 myUtil 引用
 *   5.7 特殊字段处理（r11 增强，可扩展），如 grid_columns 列补 ellipsis: true
 *   6. 写出新文件
 *   7. （默认）生成字段对比 README
 *   8. （默认）生成 index / fun 页面
 *   9. （默认）追加 routes.ckts.ts 子路由
 *
 * r7 增强：自动转换 render 函数形式
 *   旧：`render: (text: any) => (myUtil.text.formatNum(text, '0,0.00'))`
 *   新：`render: { type: 'number', format: '0,0.00' }`
 *   仅匹配上述精确模式；其它 render 形式（如 render: (text) => <JSX>）原样保留。
 *
 * r8 增强：自动归一化日期格式字符串
 *   旧：`format: 'yyyy-MM-DD HH:mm:ss'`（小写 yyyy = ISO week year，跨年周附近会偏差 1 年）
 *   新：`format: 'YYYY-MM-DD HH:mm:ss'`（大写 YYYY = 日历年）
 *   仅匹配 `format: '<...>'` 字符串字面量；不触及 `baseValidator.yyyy` 等标识符。
 *
 * r9 增强：路由 path/component 从 outPath 自动派生
 *   旧：硬编码 `hts/saasMdt/tuiShuiJiHua`，源文件换目录就生成错路由
 *   新：`deriveRouteFromOutPath(outPath, basename)` 从输出 config 路径反向推 path/component
 *   回退：outPath 不可用时仍走 pathTemplate + 硬编码 component（向后兼容）
 *
 * r10 增强：路由 name 从源文件抽取
 *   旧：name 仅来自 `nameMapping[basename] ?? DEFAULT ?? basename`，
 *       多个 auto_config.tsx 在不同父目录下会全部同名（冲突）
 *   新：`extractRouteName(srcContent, configVar)` 从源文件按优先级抽取：
 *       1) JSDoc `title: XXX`
 *       2) `<configVar>.grid_title = 'XXX'`
 *       3) `<configVar>.module_key = 'XXX'` 或 `unit_key = 'XXX'`
 *       4) 返 null，由 buildRouteEntry 回退到原 nameMapping 链
 *   优先级：source 抽取 > nameMapping > DEFAULT > basename
 *
 * r11 增强：特殊字段处理框架 + 规则 1
 *   旧：业务类型代码列漏加 ellipsis: true，需手动补全
 *   新：主流程在写出 config 前调 `applySpecialFieldRules(content, configVar)`，
 *       按 SPECIAL_FIELD_RULES 数组顺序应用所有规则；规则 1 把
 *       `<configVar>.grid_columns` 块内 `title: '业务类型代码'` 的列补 `ellipsis: true`。
 *   添加新规则：写一个 (content, configVar) => { content, count } 函数并 push 到
 *       SPECIAL_FIELD_RULES 即可。框架可扩展。
 *
 * r12 增强：默认节点 + 规则 2（toolbar_default.ckts_order → 序号重排 entry）
 *   旧：
 *     - 源文件没显式声明 customer_toolbar / handle_columns（旧协议靠 toolbar_default.ckts_order）
 *     - 序号重排按钮是 toolbar_default.ckts_order 这个私有字段控制的，新协议不识别
 *   新：
 *     - 缺 customer_toolbar → 插入 [可能的序号重排项]
 *     - 缺 handle_columns → 插入 []
 *     - 若 toolbar_default.ckts_order = N → 在 customer_toolbar 加
 *       { name: '序号重排', key: 'xhcp_<N>', func: 'handleXhcp', param: <N> }
 *   复用 r11 框架：仅 push 到 SPECIAL_FIELD_RULES，无主流程改动。
 *
 * r13 增强：toolbar_default 多规则注册表
 *   旧：r12 的"序号重排"是硬编码单规则
 *   新：抽象为 TOOLBAR_DEFAULT_RULES 注册表，遍历应用：
 *     - ckts_order: <N> → { name: '序号重排', key: 'xhcp_<N>', func: 'handleXhcp', param: <N> }
 *     - ckts_sum: true   → { name: '小计', key: 'xj', func: 'handleXj' }
 *   加新规则只需 push 一项到 TOOLBAR_DEFAULT_RULES，逻辑无需改。
 *
 * r14 增强：form_items TextArea 项标准化
 *   旧：form_items 里 type: 'TextArea' 项的 autoSize 经常是 { minRows:2, maxRows:2 }，
 *       layout 是嵌套对象 { label: {...}, formItem: {...} }，不统一
 *   新：所有 TextArea 项统一为
 *       autoSize: { minRows: 3, maxRows: 3 }
 *       layout: CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW
 *   bracket-depth 扫描处理 layout 的嵌套 {}。
 *
 * r15 增强：codeTable 数组 → 字符串 转换
 *   旧：源文件 filter_items / form_items / grid_columns / grid_columns_tj 节点里
 *       `codeTable: ['<key>', '<view>']` 形式的码表配置（DDBunit2 旧协议）
 *   新：`codeTable: '<key>:<view>'`（DDBunit2_CKTS 新协议，与 getCode(key, viewKey) 配合）
 *   复用 r11 框架：仅 push 一项到 SPECIAL_FIELD_RULES，主流程不变。
 *   仅匹配两元素字符串字面量数组；3+ 元素 / 含表达式 / 已是字符串形式 全部原样保留。
 */
const fs = require('fs');
const path = require('path');

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

/**
 * 从源路径派生目标路径
 * 规则：去掉开头的 code_sample/ 前缀
 * 例：code_sample/src/pages/hts/.../X.tsx -> src/pages/hts/.../X.tsx
 * 不符合派生规则时返回 null
 */
function deriveDefaultOutPath(srcPath) {
  const normalized = srcPath.replace(/\\/g, '/');
  if (normalized.startsWith('code_sample/')) {
    return normalized.slice('code_sample/'.length);
  }
  return null;
}

/**
 * 从输出 config 路径派生 README 路径
 * 规则：与 out 同文件夹、同基名（后缀 .README.md）
 * 例：src/.../X.tsx -> src/.../X.README.md
 * outPath 为空时返回 null
 */
function deriveDefaultReadmePath(outPath) {
  if (!outPath) return null;
  const dir = path.dirname(outPath);
  const base = path.basename(outPath, path.extname(outPath));
  return path.join(dir, `${base}.README.md`);
}

/**
 * 从输出 config 路径派生 index/fun 页面路径
 * 规则：basename 去掉 'Config' 后缀，加 Index / Fun 后缀，再加 .tsx
 * 例：src/.../monthDataConfig.tsx -> src/.../monthDataIndex.tsx + monthDataFun.tsx
 * outPath 为空时返回 null
 */
function derivePagePaths(outPath) {
  if (!outPath) return null;
  const dir = path.dirname(outPath);
  const ext = path.extname(outPath); // '.tsx'
  const base = path.basename(outPath, ext); // 'monthDataConfig'
  // 去掉 'Config' 后缀（若存在），否则用原 base
  const stripped = base.endsWith('Config') ? base.slice(0, -'Config'.length) : base;
  return {
    indexFile: path.join(dir, `${stripped}Index${ext}`),
    funFile: path.join(dir, `${stripped}Fun${ext}`),
  };
}

/**
 * r9 增强：从已派生的输出 config 路径反向推出 URL path 和 component 路径
 *
 * 背景：之前 `buildRouteEntry` 把 `path` 和 `component` 硬编码为 `hts/saasMdt/tuiShuiJiHua`，
 *       当源文件位于其它父目录时（如 `hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB/`）
 *       路由会被生成到错误位置。
 *
 * 算法：
 *   1. 取 outPath 的父目录（去掉文件名）
 *   2. 从父目录中**剥离** `src/pages/` 前缀（容错：无前缀时保留原样）
 *   3. 转为正斜杠、去掉前导 `/`
 *   4. path = '/<剥离后父目录>/<basename>'
 *   5. component = './<剥离后父目录>/<basename>Index'（无 .tsx 后缀，与现有 routes.ckts.ts 风格一致）
 *
 * 例：
 *   - outPath = 'src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB/auto_config.tsx'
 *     basename = 'auto_config'
 *     → { path: '/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB/auto_config',
 *         component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB/auto_configIndex' }
 *
 *   - outPath = 'src/pages/hts/saasMdt/tuiShuiJiHua/monthDataConfig.tsx'
 *     basename = 'monthData'
 *     → { path: '/hts/saasMdt/tuiShuiJiHua/monthData',
 *         component: './hts/saasMdt/tuiShuiJiHua/monthDataIndex' }
 *
 * @param {string} outPath - 工具派生后的输出 config 路径（已剥 'code_sample/' 前缀）
 * @param {string} basename - 已去 'Config' 后缀的 basename
 * @returns {{path: string, component: string} | null}
 */
function deriveRouteFromOutPath(outPath, basename) {
  if (!outPath || !basename) return null;
  // 1. 父目录
  const parentDir = path.dirname(outPath);
  // 2. 统一为正斜杠
  const normalized = parentDir.replace(/\\/g, '/').replace(/^\/+/, '');
  // 3. 找到 'src/pages/' 第一次出现的位置，剥掉它及其之前的所有内容
  //    容错：无 'src/pages/' 时保留原样（适用于 e2e 测试用临时布局）
  const marker = 'src/pages/';
  const idx = normalized.indexOf(marker);
  const stripped = idx >= 0 ? normalized.slice(idx + marker.length) : normalized;
  const trimmed = stripped.replace(/\/+$/, ''); // 去掉尾随 /
  // 4. 拼装
  const urlPath = trimmed ? `/${trimmed}/${basename}` : `/${basename}`;
  const componentPath = trimmed ? `./${trimmed}/${basename}Index` : `./${basename}Index`;
  return { path: urlPath, component: componentPath };
}

/**
 * r10 增强：从源文件抽取路由显示名（解决同 basename 冲突）
 *
 * 优先级链：
 *   1. JSDoc `title: XXX`（最贴近业务语义）
 *   2. `<configVar>.grid_title = 'XXX'`
 *   3. `<configVar>.module_key = 'XXX'` 或 `<configVar>.unit_key = 'XXX'`（旧协议）
 *   4. 返回 null（让 buildRouteEntry 走原 nameMapping → DEFAULT → basename 链）
 *
 * @param {string} srcContent - 源文件原始内容
 * @param {string} configVar - 已 detectConfigVar 的变量名
 * @returns {string|null} 抽取出的显示名；未抽取到返回 null
 */
function extractRouteName(srcContent, configVar) {
  if (!srcContent || !configVar) return null;

  // 1. JSDoc title
  const jsdocMatch = srcContent.match(/\/\*\*[\s\S]*?\*\//);
  if (jsdocMatch) {
    // 容错：单行 /** title: X */、多行 /** * title: X * ... */、行末星号风格都行
    // 关键：[^*\n]+ 不会跨过 * 或换行，所以会自动停在 title 行的尾部
    const titleMatch = jsdocMatch[0].match(/title:\s*([^*\n]+)/);
    if (titleMatch) {
      const t = titleMatch[1].trim();
      if (t) return t;
    }
  }

  // 2. grid_title
  const gridTitle = extractField(srcContent, configVar, ['grid_title']);
  if (gridTitle) return gridTitle;

  // 3. module_key / unit_key（先 module_key，新协议优先）
  const moduleKey = extractField(srcContent, configVar, ['module_key', 'unit_key']);
  if (moduleKey) return moduleKey;

  return null;
}

/**
 * 从源文件抽取指定字段的字面量字符串值
 * @param {string} content - 源文件内容
 * @param {string} configVar - config 变量名
 * @param {string[]} fieldNames - 候选字段名（按优先级顺序）
 * @returns {string|null}
 */
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

// =================== 工具函数 ===================
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 检测配置变量名：从 "const <name>: any = {};" 中提取
 */
function detectConfigVar(content) {
  const m = content.match(/const\s+(\w+)\s*:\s*any\s*=\s*\{\s*\}/);
  return m ? m[1] : null;
}

/**
 * 找到 varName.keyAssignment 的起始 index（含前导空白）
 * 若不存在则返回 -1
 */
function findAssignmentStart(content, varName, key) {
  const re = new RegExp(`(^|\\n)([ \\t]*)${escapeRegExp(varName)}\\.${escapeRegExp(key)}\\b`);
  const m = content.match(re);
  if (!m) return -1;
  return m.index + m[1].length;
}

/**
 * 从 keyStartInContent 开始，找到赋值块结束位置
 * 跟踪 {} [] () 嵌套和字符串字面量，找到顶层 ; 或顶层换行
 * 返回 `;` 所在位置（顶层无 `;` 时返回 `]`/`}` 之后的位置）
 */
function findAssignmentEnd(content, keyStartInContent) {
  // 找 = 位置
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
        // 返回 ; 或 \n 位置（不含 ; 本身，由 caller 决定是否包含）
        return i;
      }
    }
    i++;
  }
  return content.length;
}

/**
 * 从 valueEndIdx 开始（指向 ; 位置或 \n 位置），跳过同行的尾随 `// xxx` 注释和换行
 * 用于删除整个赋值块时清理尾部内联注释
 */
function skipTrailingCommentAndNewline(content, valueEndIdx) {
  let i = valueEndIdx;
  // 如果当前位置是 ;，跳过
  if (content[i] === ';') i++;
  // 在同一行内寻找 // 注释起点
  while (i < content.length && content[i] !== '\n') {
    if (content[i] === '/' && content[i + 1] === '/') {
      // 找到注释起点，跳到行尾
      while (i < content.length && content[i] !== '\n') i++;
      break;
    }
    i++;
  }
  // 跳过末尾换行
  while (i < content.length && content[i] === '\n') i++;
  return i;
}

/**
 * 在指定块（varName.blockKey = { ... }）内做嵌套重命名
 * 返回替换后的 content
 */
function nestedRenameInBlock(content, varName, blockKey, renames) {
  const re = new RegExp(`(${escapeRegExp(varName)}\\.${escapeRegExp(blockKey)}\\s*=\\s*\\{)`);
  const m = content.match(re);
  if (!m) return { content, changed: false };

  const startIdx = m.index + m[0].length; // 从 { 之后开始
  // 找匹配的 }（depth 从 0 开始遇到的第一个 }）
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
  const endIdx = i; // 指向 }

  const blockContent = content.slice(startIdx, endIdx);
  let newBlock = blockContent;
  for (const [oldKey, newKey] of Object.entries(renames)) {
    // 只匹配形如 `oldKey:` 或 `oldKey :` 的键名（后面跟冒号）
    const keyRe = new RegExp(`\\b${escapeRegExp(oldKey)}\\s*:`, 'g');
    newBlock = newBlock.replace(keyRe, `${newKey}:`);
  }

  return {
    content: content.slice(0, startIdx) + newBlock + content.slice(endIdx),
    changed: newBlock !== blockContent,
  };
}

/**
 * 删除顶层 key 整个赋值块
 * 同时清理尾随的内联 `// xxx` 注释
 */
function removeTopLevelKey(content, varName, key) {
  const startIdx = findAssignmentStart(content, varName, key);
  if (startIdx === -1) return { content, removed: false };
  // 找到 varName.key 的实际起始（不含前导空白）
  const indentMatch = content.slice(startIdx).match(/^[ \t]*/);
  const keyStartInContent = startIdx + indentMatch[0].length;
  const endIdx = findAssignmentEnd(content, keyStartInContent);

  // 跳过同一行的尾随注释和换行
  const trimEnd = skipTrailingCommentAndNewline(content, endIdx);

  return {
    content: content.slice(0, startIdx) + content.slice(trimEnd),
    removed: true,
  };
}

/**
 * 重命名顶层 key
 * 例：varName.oldKey = ... → varName.newKey = ...
 * 保留缩进和尾随注释
 */
function renameTopLevelKey(content, varName, oldKey, newKey) {
  const re = new RegExp(`(${escapeRegExp(varName)}\\.)${escapeRegExp(oldKey)}\\b`, 'g');
  if (!re.test(content)) return { content, renamed: false };
  return { content: content.replace(re, `$1${newKey}`), renamed: true };
}

/**
 * 前置 import 语句（不存在才添加）
 */
function prependImports(content, imports) {
  const added = [];
  for (const imp of imports) {
    if (content.includes(imp)) continue;
    // 找到第一个 import 语句之前的位置
    const firstImportMatch = content.match(/^import\s/m);
    if (firstImportMatch) {
      content = content.slice(0, firstImportMatch.index) + imp + '\n' + content.slice(firstImportMatch.index);
    } else {
      // 没有 import，插到顶部
      content = imp + '\n' + content;
    }
    added.push(imp);
  }
  return { content, added };
}

/**
 * 删除指定 import 语句
 * - 匹配整行（从前导空白到行尾 \n）
 * - 容忍轻微格式差异（多余空白、引号差异）
 * - 若不存在则跳过
 * 返回：{ content, removed: string[] }
 */
function removeImports(content, importPatterns) {
  const removed = [];
  for (const pattern of importPatterns) {
    // 转义正则元字符（注意 pattern 中可能有引号、特殊字符）
    const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // 匹配：行首（可选空白）+ 完整 import 语句 + 换行
    const re = new RegExp(`^[ \\t]*${escaped}\\s*\\n`, 'm');
    if (re.test(content)) {
      content = content.replace(re, '');
      removed.push(pattern);
    }
  }
  return { content, removed };
}

// =================== 特殊字段处理 ===================
/**
 * r11 增强：可扩展的"特殊字段处理"框架 + 规则 1
 *
 * 框架设计：
 *   - 每个规则是一个函数 (content, configVar) => { content, count }
 *   - 主流程在写出 config 文件前按数组顺序调用所有规则
 *   - 添加新规则只需：
 *     1) 写一个 (content, configVar) => { content, count } 函数
 *     2) push 到 SPECIAL_FIELD_RULES 数组
 *
 * 规则 1：grid_columns 中 title='业务类型代码' 的列自动加 ellipsis: true
 *   - 仅作用于 <configVar>.grid_columns = [ ... ] 块（不波及 grid_columns_tj 等）
 *   - 若列已含 ellipsis 属性，幂等跳过
 *   - 容错：单/双引号
 */
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
    // r16: form_api_save → api_form_edit，form_api_delete → api_form_delete
    //   同步剥离值里的 ${API_URL_BASE} 前缀；\b 词边界保护 form_api_save_upload
    name: 'form_api_save/delete 重命名 + 剥 ${API_URL_BASE} 前缀 (r16)',
    apply: transformFormApiSaveDelete,
  },
  {
    // r17: 剥离 form_api_save_upload 值里的 ${API_URL_BASE} 前缀（key 不变）
    //   \b 词边界精确匹配；与 r16 互不干扰
    name: 'form_api_save_upload 剥 ${API_URL_BASE} 前缀 (r17)',
    apply: transformFormApiSaveUpload,
  },
  // 未来加新规则示例：
  // { name: 'xxx', apply: function xxx(content, configVar) { ... } },
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

/**
 * 规则 1：grid_columns 里 title='业务类型代码' 的列补 ellipsis: true
 *   - 用 bracket-depth 定位 <configVar>.grid_columns = [ ... ] 块边界
 *   - 在块内用 regex 匹配该列对象
 *   - 列对象内不含嵌套 {}（业务类型代码列无 render 子对象，与现有源文件一致）
 *
 * @param {string} content
 * @param {string} configVar
 * @returns {{ content: string, count: number }}
 */
function addEllipsisForBusinessTypeCode(content, configVar) {
  // 1) 找 <configVar>.grid_columns = [ 起点
  const startRe = new RegExp(`${escapeRegExp(configVar)}\\.grid_columns\\s*=\\s*\\[`);
  const startMatch = startRe.exec(content);
  if (!startMatch) return { content, count: 0 };

  // 2) 从 [ 之后开始扫描，找匹配的 ]（bracket-depth 跟踪）
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
  const endIdx = i; // 指向 ]

  // 3) 在该块内找 title='业务类型代码' 的列对象
  //    列对象用 [^{}] 限定（业务类型代码列无嵌套 {，与现有源文件一致）
  //    末尾捕获 \s* 以保留 `}` 前的空白（避免 `width: 130 }` → `width: 130, ellipsis: true}`）
  const block = content.slice(startIdx, endIdx);
  const columnRe = /\{([^{}]*?title:\s*['"]业务类型代码['"][^{}]*?)(\s*)\}/g;
  let count = 0;
  const newBlock = block.replace(columnRe, (match, inner, trailingWs) => {
    // 已含 ellipsis 属性 → 幂等跳过
    if (/\bellipsis\s*:/.test(inner)) return match;
    count++;
    // 在 inner 末尾加 ', ellipsis: true'，用 trailingWs 恢复 `}` 前的空格
    const updated = inner.replace(/,\s*$/, '').trimEnd() + ', ellipsis: true';
    return `{${updated}${trailingWs}}`;
  });

  return {
    content: content.slice(0, startIdx) + newBlock + content.slice(endIdx),
    count,
  };
}

// =================== r12/r13：默认节点 + toolbar_default 规则 ===================

/**
 * r12/r13 增强：默认节点（customer_toolbar / handle_columns）+ toolbar_default 多规则
 *   1) 缺啥补啥：若源文件无 customer_toolbar / handle_columns，在 export default 之前插入空数组
 *   2) toolbar_default 规则（按 TOOLBAR_DEFAULT_RULES 数组顺序）：
 *      - ckts_order: <N> → { name: '序号重排', key: 'xhcp_<N>', func: 'handleXhcp', param: <N> }
 *      - ckts_sum: true   → { name: '小计', key: 'xj', func: 'handleXj' }
 *   幂等：customer_toolbar 已含 name: '<entry.name>' entry → 跳过；空数组已存在 → 跳过
 *   加新规则只需 push 一项到 TOOLBAR_DEFAULT_RULES。
 */

const TOOLBAR_DEFAULT_RULES = [
  // 注意："序号重排"和"小计"不再自动添加到 customer_toolbar；
  // 业务能力分别由 DDBunit2_CKTS 内部 ckts_order / ckts_sum 配置统一接管。
  // 未来加：ckts_download / ckts_upload / ...
];

/**
 * 从 toolbar_default = { ... } 块内按 valueMatcher 抽值
 * @param {string} content
 * @param {string} configVar
 * @param {string} fieldName - 字段名（仅用于日志/调试）
 * @param {RegExp} valueMatcher - 用于在该块内匹配值
 * @returns {string|null} 抽到的值字符串（无捕获组时返 'true' 等匹配文本）；未找到返 null
 */
function extractFieldFromToolbarDefault(content, configVar, fieldName, valueMatcher) {
  const startRe = new RegExp(`${escapeRegExp(configVar)}\\.toolbar_default\\s*=\\s*\\{`);
  const startMatch = startRe.exec(content);
  if (!startMatch) return null;

  // bracket-depth 扫描找匹配 }
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
  // 优先返回第一个捕获组（r12 的数值形式）；无捕获组时返整个匹配（r13 的 `true` 形式）
  return m[1] !== undefined ? m[1] : m[0];
}

/**
 * 在 export default 之前插入一段内容（无 export default 时追加到文件末尾）
 *   - content 已有 \n + 插入自身也带 \n 时不会产生空行
 */
function insertBeforeExportDefault(content, insertion) {
  const exportRe = /export\s+default\s+/;
  const m = exportRe.exec(content);
  if (m) {
    return content.slice(0, m.index) + insertion + content.slice(m.index);
  }
  // 无 export default：仅在 content 不以 \n 结尾时补一个分隔符
  const sep = content.endsWith('\n') ? '' : '\n';
  return content + sep + insertion;
}

/**
 * 在 customer_toolbar 数组开头追加一条 entry
 *   - 若数组为空 [] → 替换为 [<entry>]
 *   - 若数组非空 → 在 [ 后紧跟 entry,
 * @returns {string} 替换后的 content；找不到 customer_toolbar 时原样返回
 */
function appendEntryToCustomerToolbar(content, configVar, entry) {
  const startRe = new RegExp(`${escapeRegExp(configVar)}\\.customer_toolbar\\s*=\\s*\\[`);
  const startMatch = startRe.exec(content);
  if (!startMatch) return content;

  const bracketPos = startMatch.index + startMatch[0].length - 1; // '[' 位置
  // 检查是否为空数组
  let j = bracketPos + 1;
  while (j < content.length && /\s/.test(content[j])) j++;
  if (content[j] === ']') {
    // 空数组 → 直接替换
    return content.slice(0, bracketPos + 1) + entry + content.slice(bracketPos + 1);
  }
  // 非空数组 → 在 [ 后插入 entry,
  return content.slice(0, bracketPos + 1) + entry + ',' + content.slice(bracketPos + 1);
}

/**
 * r12/r13 规则：默认节点 + toolbar_default 多规则
 *   遍历 TOOLBAR_DEFAULT_RULES 数组，每个规则：
 *     - 抽取 toolbar_default 中对应字段值
 *     - buildEntry 生成 entry 字符串
 *     - 检查 customer_toolbar 是否已有同 name 项（幂等）
 *     - 不存在 → 插入；存在但无此项 → 追加
 *   最后处理 handle_columns = []
 */
function ensureDefaultNodesAndToolbarRules(content, configVar) {
  let out = content;
  let count = 0;

  // 1) 收集所有规则命中的 entries
  const entries = [];
  for (const rule of TOOLBAR_DEFAULT_RULES) {
    const value = extractFieldFromToolbarDefault(out, configVar, rule.fieldName, rule.valueMatcher);
    if (value === null) continue;
    const entry = rule.buildEntry(value);
    // 幂等检查：customer_toolbar 中是否已有 name: '<rule.name>' 项
    const nameRegex = new RegExp(`name:\\s*['"]${rule.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`);
    if (nameRegex.test(out)) continue;
    entries.push(entry);
  }

  // 2) 处理 customer_toolbar
  const hasCustomerToolbarRe = new RegExp(`${escapeRegExp(configVar)}\\.customer_toolbar\\s*=\\s*\\[`);
  if (!hasCustomerToolbarRe.test(out)) {
    // 不存在 → 插入（含所有命中的 entries）
    const initial = entries.length > 0 ? `[${entries.join(',')}]` : '[]';
    out = insertBeforeExportDefault(out, `${configVar}.customer_toolbar = ${initial};\n`);
    if (entries.length > 0) count++;
  } else {
    // 存在 → 逐个追加
    for (const entry of entries) {
      out = appendEntryToCustomerToolbar(out, configVar, entry);
      count++;
    }
  }

  // 3) 处理 handle_columns
  const hasHandleColumnsRe = new RegExp(`${escapeRegExp(configVar)}\\.handle_columns\\s*=\\s*\\[`);
  if (!hasHandleColumnsRe.test(out)) {
    out = insertBeforeExportDefault(out, `${configVar}.handle_columns = [];\n`);
    count++;
  }

  return { content: out, count };
}

// =================== r14：form_items TextArea 项标准化 ===================

/**
 * r14 增强：form_items 里 type: 'TextArea' 的项标准化
 *   1) autoSize → 统一为 { minRows: 3, maxRows: 3 }（覆盖旧值）
 *   2) layout   → 删除原 object 值，替换为 CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW
 *
 * 例：
 *   旧：{ label: '备注', name: 'bz', type: 'TextArea', autoSize: { minRows: 2, maxRows: 2 },
 *        layout: { label: {xs:8,...}, formItem: {xs:16,...} }, rules: [...]}
 *   新：{ label: '备注', name: 'bz', type: 'TextArea', rules: [...],
 *        autoSize: { minRows: 3, maxRows: 3 }, layout: CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW }
 *
 * 嵌套 {} 处理：layout 字段的值通常是嵌套对象（{label: {...}, formItem: {...}}），
 *   用 bracket-depth 扫描定位匹配 `}`，对简单正则做升级。
 */

/**
 * 从 content 中删除指定字段（值是 {...} 对象形式）
 *   - 处理前导逗号 + 空白
 *   - bracket-depth 扫描找匹配 `}`，容忍嵌套
 * @returns {string} 替换后的 content
 */
function stripObjectField(content, fieldName) {
  // 匹配：可选的 , 空白 + fieldName + 冒号 + {  (开始扫描位置)
  const re = new RegExp(`(,?\\s*)${fieldName}\\s*:\\s*\\{`, 'g');
  let changed = false;
  let out = content;
  // 循环处理（可能有多个同名字段）
  let m;
  while ((m = re.exec(out)) !== null) {
    const matchStart = m.index;
    const valueStart = m.index + m[0].length;
    // bracket-depth 扫描
    let depth = 1;
    let i = valueStart;
    while (i < out.length && depth > 0) {
      if (out[i] === '{') depth++;
      else if (out[i] === '}') depth--;
      if (depth === 0) break;
      i++;
    }
    if (depth !== 0) break; // 不闭合，放弃
    // m[1] 包含前导 ", "，slice 到 m.index 之前 + 跳过 i+1
    out = out.slice(0, m.index) + out.slice(i + 1);
    // 注意：不需要 re.lastIndex 重置，因为 out 长度变了，next m 会自然从新位置开始
    re.lastIndex = 0;
    changed = true;
  }
  return out;
}

/**
 * 在 form_items 块内，对每个 type: 'TextArea' 的项做标准化转换
 */
function transformTextAreaFormItem(content, configVar) {
  // 1) 找 <configVar>.form_items = [ 起点
  const startRe = new RegExp(`${escapeRegExp(configVar)}\\.form_items\\s*=\\s*\\[`);
  const startMatch = startRe.exec(content);
  if (!startMatch) return content;

  // 2) bracket-depth 扫描找匹配 ]
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

  // 3) 在块内找含 type: 'TextArea' 的项对象
  //    容忍嵌套 {}（layout 字段是嵌套对象）
  //    用 bracket-depth 手动解析项边界
  let count = 0;
  let newBlock = '';
  let pos = 0;
  while (pos < block.length) {
    // 跳过空白
    while (pos < block.length && /\s/.test(block[pos])) {
      newBlock += block[pos];
      pos++;
    }
    if (pos >= block.length) break;
    if (block[pos] !== '{') {
      // 遇到非对象字符（如 ', '），原样保留
      newBlock += block[pos];
      pos++;
      continue;
    }
    // 找到 { 开始 → bracket-depth 扫描找匹配 }
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
      // 不闭合，放弃
      newBlock += block.slice(itemStart);
      break;
    }
    const itemEnd = j; // 指向 }
    const itemInner = block.slice(itemStart + 1, itemEnd);

    // 检查是否含 type: 'TextArea'
    if (/type:\s*['"]TextArea['"]/.test(itemInner)) {
      // 转换：strip autoSize + strip layout + append new
      let newInner = stripObjectField(itemInner, 'autoSize');
      newInner = stripObjectField(newInner, 'layout');
      // 在末尾加新 autoSize 和 layout
      newInner = newInner.replace(/,\s*$/, '').trimEnd()
        + ', autoSize: { minRows: 3, maxRows: 3 }, layout: CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW';
      newBlock += `{${newInner}}`;
      count++;
    } else {
      // 非 TextArea 项原样保留
      newBlock += block.slice(itemStart, itemEnd + 1);
    }
    pos = itemEnd + 1;
  }

  return {
    content: content.slice(0, startIdx) + newBlock + content.slice(endIdx),
    count,
  };
}

/**
 * r14 规则：form_items 里 TextArea 项的 autoSize + layout 标准化
 */
function normalizeTextAreaFormItems(content, configVar) {
  return transformTextAreaFormItem(content, configVar);
}

// =================== r15：codeTable 数组 → 字符串 转换 ===================

/**
 * r15 规则：filter_items / form_items / grid_columns / grid_columns_tj 块内
 *   `codeTable: ['<key>', '<view>']` → `codeTable: '<key>:<view>'`
 *
 * 行为细节：
 *   - 作用域严格限定在 4 个目标块；其它位置（如 grid_handle_columns 等）的 codeTable 不动
 *   - 仅匹配两元素字符串字面量数组（单/双引号均可；元素间空白容忍）
 *   - 不匹配 3+ 元素数组、含变量/表达式的数组、已是字符串形式 —— 全部原样保留
 *   - 输出统一单引号 `codeTable: 'X:Y'`，与项目源码风格一致
 *   - 幂等：已转换的字符串形式不会再次匹配
 *
 * @param {string} content
 * @param {string} configVar
 * @returns {{ content: string, count: number }}
 */
function transformCodeTableArrays(content, configVar) {
  const blockKeys = ['filter_items', 'form_items', 'grid_columns', 'grid_columns_tj'];
  let out = content;
  let count = 0;

  for (const blockKey of blockKeys) {
    // 1) 找 <configVar>.<blockKey> = [ 起点
    const startRe = new RegExp(`${escapeRegExp(configVar)}\\.${blockKey}\\s*=\\s*\\[`);
    const startMatch = startRe.exec(out);
    if (!startMatch) continue;

    // 2) bracket-depth 扫描找匹配 ]
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
    if (depth !== 0) continue; // 不闭合，放弃该块
    const endIdx = i;

    // 3) 块内匹配两元素字符串字面量数组
    //    捕获：q1, key, q2, view
    //    q1/q2 容忍单/双引号；元素间空白容忍
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

// =================== r16: form_api_save / form_api_delete 转换 ===================
/**
 * r16: 把
 *   `<configVar>.form_api_save = \`${API_URL_BASE}/X\`;`
 *     → `<configVar>.api_form_edit = \`/X\`;`
 *   `<configVar>.form_api_delete = \`${API_URL_BASE}/X\`;`
 *     → `<configVar>.api_form_delete = \`/X\`;`
 *
 *   - 一次性重命名 key + 剥离 value 里的 `${API_URL_BASE}` 前缀
 *   - 用 `\b` 词边界保护 `form_api_save_upload` 变体（用户决策：保持原样）
 *   - 只匹配有 `${API_URL_BASE}` 前缀的值（裸路径/函数调用等不匹配，保持原样）
 *   - 复用两次：注册为 SPECIAL_FIELD_RULE（处理顶层 unitConfig）+
 *     在 extractMyConfigAdjustments 内调用（处理 myConfig 调整块）
 *
 * @param {string} content
 * @param {string} configVar  'unitConfig' / 'myConfig' / 其它
 * @returns {{ content: string, count: number }}
 */
function transformFormApiSaveDelete(content, configVar) {
  let out = content;
  let count = 0;

  // form_api_save → api_form_edit
  // 关键：\b 词边界保护 form_api_save_upload（_ 属 \w，无 word boundary）
  const saveRe = new RegExp(
    `(${escapeRegExp(configVar)}\\.)\\bform_api_save\\b(\\s*=\\s*)\`\\$\\{API_URL_BASE\\}(/[^\\\`]*)\``,
    'g',
  );
  out = out.replace(saveRe, (_match, prefix, eq, path) => {
    count++;
    return `${prefix}api_form_edit${eq}\`${path}\``;
  });

  // form_api_delete → api_form_delete（词序 swap，但严格按用户指令）
  const deleteRe = new RegExp(
    `(${escapeRegExp(configVar)}\\.)\\bform_api_delete\\b(\\s*=\\s*)\`\\$\\{API_URL_BASE\\}(/[^\\\`]*)\``,
    'g',
  );
  out = out.replace(deleteRe, (_match, prefix, eq, path) => {
    count++;
    return `${prefix}api_form_delete${eq}\`${path}\``;
  });

  return { content: out, count };
}

// =================== r17: form_api_save_upload 剥前缀 ===================
/**
 * r17: 把
 *   `<configVar>.form_api_save_upload = \`${API_URL_BASE}/X\`;`
 *     → `<configVar>.form_api_save_upload = \`/X\`;` （key 不变）
 *
 *   - 仅剥离 value 里的 `${API_URL_BASE}` 前缀，key 保持 `form_api_save_upload`
 *     （与 form 组件约定的字段名一致，不应重命名）
 *   - \b 词边界精确匹配 `form_api_save_upload`（保护 `form_api_save_upload_x` 等变体）
 *   - 只匹配有 `${API_URL_BASE}` 前缀的值（裸路径/函数调用等不匹配，保持原样）
 *   - 复用两次：注册为 SPECIAL_FIELD_RULE（处理顶层 unitConfig）+
 *     在 extractMyConfigAdjustments 内调用（处理 myConfig 调整块）
 *   - 与 r16 互不干扰：r16 用 `\bform_api_save\b`（无 upload 词边界），
 *     r17 用 `\bform_api_save_upload\b`，两者正则互不干扰
 *
 * @param {string} content
 * @param {string} configVar  'unitConfig' / 'myConfig' / 其它
 * @returns {{ content: string, count: number }}
 */
function transformFormApiSaveUpload(content, configVar) {
  const re = new RegExp(
    `(${escapeRegExp(configVar)}\\.)\\bform_api_save_upload\\b(\\s*=\\s*)\`\\$\\{API_URL_BASE\\}(/[^\\\`]*)\``,
    'g',
  );
  let count = 0;
  const out = content.replace(re, (_match, prefix, eq, path) => {
    count++;
    return `${prefix}form_api_save_upload${eq}\`${path}\``;
  });
  return { content: out, count };
}

// =================== render 函数形式转换 ===================
/**
 * r7 增强：把旧版 myUtil.text.formatNum 形式的 render 转换为标准 { type, format } 对象
 *
 * 旧：`render: (text: any) => (myUtil.text.formatNum(text, '0,0.00'))`
 * 新：`render: { type: 'number', format: '0,0.00' }`
 *
 * 仅匹配上述精确模式（函数体只调用 myUtil.text.formatNum，无其它副作用）；
 * 其它 render 形式（JSX、antd 组件等）原样保留。
 *
 * 容忍差异：
 *   - render 与 : 之间的空格
 *   - 参数类型注解（any / string / number / 缺省）
 *   - 外层括号可有可无
 *   - 引号（单/双）
 *
 * @returns {{ content: string, count: number }}
 */
function transformRenderFunctions(content) {
  // 形如 render: (text: any) => (myUtil.text.formatNum(text, '<format>'))
  // 捕获引号字符和 format 字符串本身
  const re = /render\s*:\s*\(?\s*text(?:\s*:\s*\w+)?\s*\)?\s*=>\s*\(?\s*myUtil\.text\.formatNum\(\s*text\s*,\s*(['"])([^'"]+)\1\s*\)\s*\)?/g;
  let count = 0;
  const newContent = content.replace(re, (_match, _quote, format) => {
    count++;
    return `render: { type: 'number', format: '${format}' }`;
  });
  return { content: newContent, count };
}

// =================== 日期格式归一化 ===================
/**
 * r8 增强：把日期格式字符串里的 `yyyy` 统一替换为 `YYYY`
 *
 * 背景：dayjs / moment 中小写 `yyyy` 表示"ISO week year"（按周计算的年份），
 *       在跨年周附近会偏差 1 年。CLAUDE.md 已明确项目统一使用 `dayjs('YYYY-MM-DD')`。
 *       源文件里残留的 `format: 'yyyy-MM-DD HH:mm:ss'` 必须归一为大写 `YYYY`。
 *
 * 仅匹配 `format: '<...>'` 字符串字面量（render 对象 / form 字段的 format 属性）。
 * 不触及：
 *   - 标识符（如 `baseValidator.yyyy` / `baseValidator.yyyyMM`）
 *   - JSX 注释 / 字符串以外的场景
 *
 * 容忍差异：
 *   - 引号：单/双
 *   - format 与 : 之间的空格
 *
 * @returns {{ content: string, count: number }}
 */
function normalizeDateFormats(content) {
  // 匹配 format: '...' 或 format: "..." 字符串字面量
  // 捕获：前缀(format: ')、格式体、后缀(右单/双引号)
  const re = /(format\s*:\s*['"])([^'"]*?)(['"])/g;
  let count = 0;
  const newContent = content.replace(re, (match, prefix, format, suffix) => {
    if (!format.includes('yyyy')) return match;
    count++;
    return `${prefix}${format.replace(/yyyy/g, 'YYYY')}${suffix}`;
  });
  return { content: newContent, count };
}

// =================== 路由生成 ===================
const DEFAULT_NAME_MAPPING = {
  monthData: '月度计划',
  seasonData: '季度计划',
  yearData: '年度计划',
};

/**
 * 根据 config 文件名 + 输出路径构造一条路由条目（r9/r10 增强）
 *
 * @param {string} configImportName - config 文件 basename（不含扩展名），如 'monthDataConfig'
 * @param {object} [nameMapping] - 用户自定义 basename → 中文显示名映射
 * @param {string} [pathTemplate] - path 模板（含 {basename} 占位），仅当 outPath 不可派生时回退
 * @param {string} [outPath] - 工具派生后的输出 config 路径，用于 r9 反向推 path/component
 * @param {string} [nameOverride] - r10：从源文件抽取的显示名（JSDoc title / grid_title / module_key）
 * @returns {{name, path, component}}
 */
function buildRouteEntry({ configImportName, nameMapping, pathTemplate, outPath, nameOverride }) {
  // 派生 basename：去掉 'Config' 后缀
  const basename = configImportName.endsWith('Config')
    ? configImportName.slice(0, -'Config'.length)
    : configImportName;

  // r10 优先级链：source 抽取 > nameMapping > DEFAULT > basename
  //   nameOverride 通常来自 extractRouteName（JSDoc title / grid_title / module_key）
  //   解决两个 auto_config.tsx 在不同父目录导致的同名冲突
  const name = nameOverride
    || (nameMapping && nameMapping[basename])
    || DEFAULT_NAME_MAPPING[basename]
    || basename;

  // r9: 优先从 outPath 派生 path/component（主路径）
  const derived = deriveRouteFromOutPath(outPath, basename);
  let path;
  let component;
  if (derived) {
    path = derived.path;
    component = derived.component;
  } else {
    // 回退：用户模板 > 默认模板（保留向后兼容；理论上 main 必传 outPath）
    path = (pathTemplate || '/hts/saasMdt/tuiShuiJiHua/{basename}').replace('{basename}', basename);
    component = `./hts/saasMdt/tuiShuiJiHua/${basename}Index`;
  }

  return { name, path, component };
}

/**
 * 在 routes.ckts.ts 的第一个 `routes: [` 数组中追加子路由
 * 幂等：按 path 查重，已存在则跳过
 * @returns {{added: boolean, content: string, error?: string}}
 */
function addRouteToCktsFile({ cktsFile, newEntry }) {
  const content = fs.readFileSync(cktsFile, 'utf-8');

  // 幂等性检查：若 newEntry.path 已存在，跳过
  if (content.includes(`path: '${newEntry.path}'`)) {
    return { added: false, content };
  }

  // 找到第一个 `routes: [` 起始位置
  const routesArrayRe = /(routes:\s*\[)/;
  const m = content.match(routesArrayRe);
  if (!m) {
    return { added: false, content, error: '未找到 routes: [ 数组' };
  }
  const insertPos = m.index + m[0].length; // 紧跟 [ 之后

  // 构造新条目字符串（4 空格缩进 + 单引号 + 逗号结尾，与 routes.ckts.ts 现有格式对齐）
  const indent = '    ';
  const newLine = `\n${indent}{ name: '${newEntry.name}', path: '${newEntry.path}', component: '${newEntry.component}' },`;

  // 插入并写回
  const newContent = content.slice(0, insertPos) + newLine + content.slice(insertPos);
  fs.writeFileSync(cktsFile, newContent, 'utf-8');
  return { added: true, content: newContent };
}

// =================== README 生成 ===================
function generateReadme({ srcFile, outFile, configVar, actions, rules }) {
  const lines = [];
  // 标题：从 outFile 路径中提取文件名（去掉 .tsx 后缀），或回退到 configVar
  const outFileName = path.basename(outFile || '', path.extname(outFile || ''));
  const titleBase = outFileName || configVar || 'config';
  lines.push(`# ${titleBase} 转换说明`);
  lines.push('');
  lines.push('> 本文件由 `scripts/convert-ddbunit-config.js` 自动生成，描述新旧配置的字段映射关系。');
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
    lines.push(`- 共归一化 **${actions.dateFormatNormalizes}** 处 \`format: 'yyyy-...'\` → \`format: 'YYYY-...'\`（小写 yyyy = ISO week year，跨年周附近会偏差 1 年；项目统一使用大写 YYYY = 日历年）`);
  }
  lines.push('');
  lines.push('### 特殊字段处理（r11）');
  if (!actions.specialFieldRules) {
    lines.push('（无）');
  } else {
    lines.push(`- 共应用 **${actions.specialFieldRules}** 处特殊字段规则（如 \`grid_columns\` 里 \`title: '业务类型代码'\` 自动补 \`ellipsis: true\`）`);
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

// =================== index/fun 页面模板 ===================
/**
 * 从参照文件（如源 auto_config.tsx 同目录的 index.tsx）抽取 index 页面的 customization
 *   - initSearchModal: [...] 段（含 UnitUtil → cktsUtil 重写）
 *   - myConfig 调整块：const myConfig = ...; 与 return <>; 之间的整段代码
 *
 * 行为：
 *   - 文件不存在 / 读失败 / 两类 customization 都不存在 → 返 null（**不抛错**，
 *     由调用方走 silent fallback 到标准模板）
 *   - 两类 customization 互相独立：可能只有其一、可能都有
 *   - initSearchModal 段含 `UnitUtil.getLcswsxDm(...)` → **自动重写**为
 *     `cktsUtil.getLcswsxDm(myConfig.unit_constant)`，并把
 *     `needsCktsUtilImport` 标 true
 *   - myConfig 调整块 **原样保留**（不做合法性检查；含函数调用 / 外部引用时
 *     编译期错误由用户手动修）
 *
 * 算法：
 *   - initSearchModal：正则定位 `initSearchModal: [` 起点，bracket-depth 扫描
 *     找匹配 `]`，与脚本内 transformTextAreaFormItem 同款手法
 *   - myConfig 调整块：见 extractMyConfigAdjustments 文档
 *
 * @param {string} refPath - 参照文件绝对路径
 * @returns {{
 *   initSearchModal?: { text: string, needsCktsUtilImport: boolean },
 *   myConfigAdjustments?: { text: string },
 * }|null}
 *          - 字段缺失 = 参照里没有这类 customization
 *          - 或 null（不命中 / 文件缺失）
 */
function extractIndexCustomizationsFromFile(refPath) {
  if (!refPath || !fs.existsSync(refPath)) return null;
  let content;
  try {
    content = fs.readFileSync(refPath, 'utf-8');
  } catch (_err) {
    return null;
  }

  // 1) 抽取 initSearchModal: [...] 段
  const initSearchModal = extractInitSearchModalBlock(content);

  // 2) 抽取 myConfig 调整块（const myConfig = ...; 与 return <>; 之间）
  const myConfigAdjustments = extractMyConfigAdjustments(content);

  if (!initSearchModal && !myConfigAdjustments) return null;
  const result = {};
  if (initSearchModal) result.initSearchModal = initSearchModal;
  if (myConfigAdjustments) result.myConfigAdjustments = myConfigAdjustments;
  return result;
}

/**
 * 从参照文件内容中抽取 `initSearchModal: [...]` 段的原始文本
 *   - 含 `UnitUtil.getLcswsxDm(...)` → 自动重写为 `cktsUtil.getLcswsxDm(myConfig.unit_constant)`
 *   - 含 cktsUtil.X 直接调用 → 标记 needsCktsUtilImport = true（虽然此处已重写完，
 *     仍需要在生成文件顶部加 import）
 *   - 其它原样保留
 *
 * @param {string} content
 * @returns {{ text: string, needsCktsUtilImport: boolean }|null}
 */
function extractInitSearchModalBlock(content) {
  // 找首次出现位置
  const startRe = /initSearchModal\s*:\s*\[/;
  const startMatch = startRe.exec(content);
  if (!startMatch) return null;

  // bracket-depth 扫描 [] 配对
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
  const endIdx = i; // 指向 ]

  let text = content.slice(startMatch.index, endIdx + 1);

  // 重写 UnitUtil.getLcswsxDm(<any-var>.unit_constant) → cktsUtil.getLcswsxDm(myConfig.unit_constant)
  //   兼容 config.unit_constant / myConfig.unit_constant 等任意 var 前缀（统一改为 myConfig）
  //   兼容函数调用前后的任意空白
  let needsCktsUtilImport = false;
  if (/\bcktsUtil\./.test(text)) {
    // 段里已经直接引用 cktsUtil.X —— 也需要加 import
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

// ============================================================================
// Change 1: myUtil.menu.getMenuObjByPath → cktsUtil.menu.getMenuObjByPath 重写
// ============================================================================

/**
 * 把 text 中所有 `myUtil.menu.getMenuObjByPath(<args>)` 重写为
 *   `cktsUtil.menu.getMenuObjByPath(<args>)`。
 *   - 用字符级括号配对定位 <args> 范围（不被外层 if/while 的括号误吞）
 *   - 跳过字符串字面量（`'` `"` `` ` ``，含 `\` 转义），避免误把字符串里的
 *     ')' 当成参数结束
 *   - 不匹配字符串/注释里的 `myUtil.menu.getMenuObjByPath`（实际数据无此场景）
 *
 * @param {string} text
 * @returns {string}
 */
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
    // 跳过空白 + 找 '('
    while (j < text.length && /\s/.test(text[j])) j++;
    if (text[j] !== '(') {
      // 非函数调用形式，理论不应发生；保守：跳过这段 from 继续
      i = idx + from.length;
      continue;
    }
    out += text[j]; // '('
    j++;
    // paren-depth 扫描拷贝到匹配的 ')'，含字符串字面量保护
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

// ============================================================================
// Change 2: Func.getOtherRef 中 push 的 ref 自动补 useRef 定义（preRefBlock）
// ============================================================================

/**
 * 扫描 content 中所有 `Func.getOtherRef = () => { ... }` 块，
 * 提取 `otherRef.push(<name>)` 中的 ref 名字（出现顺序）。
 *   - 支持 `() =>` 和 `function ()` 两种形式
 *   - 用字符级 brace-depth + 字符串/注释跳过定位方法体
 *   - 返回 string[]
 *
 * @param {string} content
 * @returns {string[]}
 */
function extractFuncGetOtherRefPushes(content) {
  const targets = [];
  const re = /Func\.getOtherRef\s*=\s*(?:\(\s*\)\s*=>|function\s*\(\s*\))/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    // 找匹配的 '{'
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
          // 行注释
          while (i < content.length && content[i] !== '\n') i++;
          continue;
        } else if (ch === '/' && content[i + 1] === '*') {
          // 块注释
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
    // 提取 otherRef.push(<name>)
    const pushRe = /otherRef\.push\s*\(\s*([A-Za-z_$][\w$]*)\s*\)/g;
    let pm;
    while ((pm = pushRe.exec(body)) !== null) {
      targets.push(pm[1]);
    }
  }
  return targets;
}

/**
 * 扫描 content 中所有 useRef 声明，收集 (name → {line, index}) 对。
 *   - 匹配 `const <name>: any = useRef(...);` / `const <name> = useRef(...);`
 *          / `let <name> = useRef(...);` / `var <name> = useRef(...);`
 *   - 容忍可选类型注解（`any` / `<any>` / `<HTMLDivElement>`）
 *   - line 取整行（含紧邻 `// 注释`）直到下一个 `\n`
 *   - index 是声明在 content 中的字符位置（用于过滤 adjustments 范围）
 *   - 同名重复声明时保留第一个
 *
 * @param {string} content
 * @returns {Map<string, { line: string, index: number }>}
 */
function collectUseRefDeclarations(content) {
  const result = new Map();
  const re = /^[ \t]*(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*(?::\s*[A-Za-z_$<>,\s\[\]\|]+)?\s*=\s*useRef\s*\([^)]*\)\s*;?/gm;
  let m;
  while ((m = re.exec(content)) !== null) {
    const name = m[1];
    if (result.has(name)) continue;
    // 取整行（从匹配起点到下一个换行符）
    const lineEnd = content.indexOf('\n', m.index);
    const line = lineEnd === -1
      ? content.slice(m.index)
      : content.slice(m.index, lineEnd);
    result.set(name, { line, index: m.index });
  }
  return result;
}

/**
 * 给定 (pushes, declarations, adjStart, adjEnd)，输出 preRefBlock 字符串。
 *   - 对每个 push 的 ref：
 *     - declarations 找不到 → 生成默认 `  const <name>: any = useRef();`
 *     - declarations 找到但声明在 adjustments 范围 [adjStart, adjEnd) 内
 *       → 跳过（声明已随 adjustments text 注入到 myConfig 之后，重复注入会
 *         触发 "Cannot redeclare block-scoped variable"）
 *     - declarations 找到且声明在 adjustments 范围外（典型：参照文件把
 *       useRef 放在 myConfig 之前）→ 复用原 declaration（含紧邻 `// 注释`）
 *   - 顺序：参照文件中的 push 出现顺序
 *   - 多行：每条声明独占一行，末尾统一加 `\n`
 *   - 全部跳过 / pushes 为空 → 返回 ''
 *
 * @param {string[]} pushes
 * @param {Map<string, { line: string, index: number }>} declarations
 * @param {number} adjStart  adjustments 范围起点（initEnd + 1）
 * @param {number} adjEnd    adjustments 范围终点（returnStart，不含）
 * @returns {string}
 */
function buildPreRefBlock(pushes, declarations, adjStart, adjEnd) {
  if (pushes.length === 0) return '';
  const lines = [];
  for (const name of pushes) {
    const info = declarations.get(name);
    if (info) {
      // 声明在 adjustments 范围内 → 已在 text 中，跳过注入
      if (info.index >= adjStart && info.index < adjEnd) {
        continue;
      }
      // 声明在 adjustments 范围外 → 注入到 preRefBlock
      lines.push(info.line);
    } else {
      // 没有声明 → 生成默认
      lines.push(`  const ${name}: any = useRef();`);
    }
  }
  if (lines.length === 0) return '';
  return lines.join('\n') + '\n';
}

/**
 * 从参照文件内容中抽取 myConfig 调整块：即 `const myConfig = ...;` 之后、
 * 同一 brace depth（函数体顶层）的 `return <` 关键字之前的整段代码
 *
 * 涵盖（不限）：
 *   - myConfig.grid_columns.forEach(...)  / myConfig.grid_columns_tj.forEach(...)
 *   - myConfig.form_items.forEach(...)
 *   - myConfig.X = Y / myConfig.X[Y] = Z 直接赋值
 *   - if/else 块里对 myConfig 的多种 mutation
 *
 * 用户决策：**原样保留**（不做 `config` → `myConfig` 重写），依赖参照文件
 * 使用 `myConfig.X` 写法。若某参照使用 `config.X`（直接 mutate 导入模块），
 * 用户需手动调整参照。
 *
 * 算法：
 *   1. 正则 /const myConfig = / 找初始化起点
 *   2. 复用 findAssignmentEnd 模式（见脚本 308-356 行附近）的深度跟踪
 *      找初始化表达式结束（顶层 ; 或 \n）
 *   3. 从初始化结束位置起，继续深度扫描，在 brace depth = 1 时找
 *      return 关键字（容忍字符串 / 注释 / 正则字面量内的 return 误匹配）
 *   4. 抽取起点到 return 前的整段文本，trim 首尾空白
 *   5. 无 const myConfig 或无顶层 return → 返 null
 *
 * 变更：
 *   - Change 1: 抽取后用 `rewriteGetMenuObjByPathCalls` 把
 *     `myUtil.menu.getMenuObjByPath` → `cktsUtil.menu.getMenuObjByPath`
 *   - Change 2: 抽取前用 `extractFuncGetOtherRefPushes` 找 push 的 ref，
 *     与 `collectUseRefDeclarations` 全 content 中的 useRef 声明交叉，
 *     拼成 `preRefBlock`（注入到生成的 myConfig 之前）
 *   - 返回值新增 `needsCktsUtilImport`（重写后含 cktsUtil. 时为 true）
 *   - 返回值新增 `preRefBlock`（Change 2 输出，无 ref 时为空串）
 *   - `needsUseRefImport` 改为：text 含 useRef( 或 preRefBlock 非空
 *
 * @param {string} content
 * @returns {{ text: string, needsMyUtilImport: boolean, needsCktsUtilImport: boolean, needsUseRefImport: boolean, preRefBlock: string }|null}
 */
function extractMyConfigAdjustments(content) {
  // 1) 找 const myConfig = 起点（跳过 // 注释里的匹配 —— 参照文件里
  //    经常留有 `// const myConfig = {...unitConfig};` 之类的旧实现痕迹，
  //    不能让它被错误识别为 initializer 起点）
  let initMatch = null;
  const initRe = /const\s+myConfig\s*=\s*/g;
  let m;
  while ((m = initRe.exec(content)) !== null) {
    // 检查匹配位置是否在 // 注释行内（行首到此位置是空白 + //）
    let lineStart = m.index;
    while (lineStart > 0 && content[lineStart - 1] !== '\n') lineStart--;
    const linePrefix = content.slice(lineStart, m.index);
    if (!/^\s*\/\//.test(linePrefix)) {
      initMatch = m;
      break;
    }
    // regex.lastIndex 已自动推进到 m.index + 1，继续循环找下一个
  }
  if (!initMatch) return null;

  // 2) 找初始化表达式的结束（顶层 ; 或 \n）
  //    复用 findAssignmentEnd 的深度扫描循环（复制其骨架，不抽公共函数以避免大改）
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

  // 3) 从 initEnd 之后继续深度扫描，找函数体顶层（brace depth = 1）的 `return`
  //    depth 含义：进入 `=> {` 后 brace=1；嵌套 if/for 块内 brace=2
  //    目标：在 brace=1 时（即函数体顶层）找 `return`
  //    假设：函数体在模块顶层（Index = () => { ... } 形式）；对于 IIFE 等包装情况
  //    留作后续增强（用户决策：本期只覆盖常见 case）
  let returnStart = -1;
  i = initEnd + 1;
  inString = null;
  escaped = false;
  // 关键：初始化表达式的终止符 (; 或 \n) 是在函数体顶层，所以进入第二步扫描时
  // 我们已经在函数体内部（brace=1），不是模块顶层（brace=0）
  const depth2 = { brace: 1, bracket: 0, paren: 0 };
  while (i < content.length - 6) { // 'return' 6 字符
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
      } else if (ch === '/') {
        // 跳过单行注释：避免误把注释里的 'return' 当真
        if (content[i + 1] === '/') {
          while (i < content.length && content[i] !== '\n') i++;
          continue;
        }
        // 跳过块注释
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
        // 退出函数体：brace 回到 0（模块顶层），说明已经过本函数体，提前结束
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
        depth2.brace === 1 &&  // 函数体顶层
        depth2.bracket === 0 &&
        depth2.paren === 0 &&
        // 前一个字符不是字母/数字/下划线/$（避免把 'myreturn'/'xreturn' 误判为 return）
        !/[A-Za-z_$0-9]/.test(content[i - 1] ?? ' ') &&
        content.substr(i, 6) === 'return' &&
        // 后一个字符是空白 / < / ( 之一
        /[\s<(]/.test(content[i + 6] ?? '')
      ) {
        returnStart = i;
        break;
      }
    }
    i++;
  }
  if (returnStart === -1) return null;

  // 4.5) Change 2: 扫描 Func.getOtherRef 中 push 的 ref，
  //      与全 content 中已有的 useRef 声明交叉（adjustments 范围
  //      [initEnd + 1, returnStart) 内的声明会被原样抽到 text，
  //      跳过避免 "Cannot redeclare block-scoped variable"），
  //      拼成 preRefBlock 字符串（注入到 myConfig 之前）
  const pushedRefs = extractFuncGetOtherRefPushes(content);
  const useRefDecls = collectUseRefDeclarations(content);
  const preRefBlock = buildPreRefBlock(
    pushedRefs,
    useRefDecls,
    initEnd + 1,
    returnStart,
  );

  // 5) 抽取并 trim
  let text = content.slice(initEnd + 1, returnStart);
  // 去掉前导空白行
  text = text.replace(/^\s*\n/, '');
  // 去掉尾部空白
  text = text.replace(/\s+$/, '');
  if (!text) return null;

  // 6) 剥除 myConfig.gridParams = { ... }; 块 —— 该块由 extractInitSearchModalBlock
  //    单独处理（含 UnitUtil → cktsUtil 重写），这里包含会重复。
  //    若剥除后为空，说明参照里只有 initSearchModal 这种 customization，返 null。
  text = stripGridParamsBlock(text);
  text = text.replace(/^\s*\n/, '').replace(/\s+$/, '');
  if (!text) return null;

  // 6.5) r16: form_api_save → api_form_edit，form_api_delete → api_form_delete
  //      同步剥离值里的 ${API_URL_BASE} 前缀（与 SPECIAL_FIELD_RULES 注册同一函数）
  {
    const r16 = transformFormApiSaveDelete(text, 'myConfig');
    if (r16.count > 0) {
      text = r16.content;
    }
  }

  // 6.6) r17: 剥离 form_api_save_upload 值里的 ${API_URL_BASE} 前缀（key 不变）
  //      与 SPECIAL_FIELD_RULES 注册同一函数
  {
    const r17 = transformFormApiSaveUpload(text, 'myConfig');
    if (r17.count > 0) {
      text = r17.content;
    }
  }

  // 7) Change 1: myUtil.menu.getMenuObjByPath → cktsUtil.menu.getMenuObjByPath
  //    替换后调整块里不再有 myUtil.menu 子模块引用，生成的 auto_configIndex.tsx
  //    不需要 myUtil import；needsCktsUtilImport 会在下面 (8) 由 cktsUtil. 触发
  if (text.indexOf('myUtil.menu.getMenuObjByPath') !== -1) {
    text = rewriteGetMenuObjByPathCalls(text);
  }

  // 8) 检测按需注入的 import 标志（与 extractInitSearchModalBlock 同款 regex.test 模式）
  //    - myUtil. → 顶部加 `import myUtil from '@/components/DDAssist/util';`
  //    - cktsUtil. → 顶部加 `import cktsUtil from '@/pages/hts/cktsUtil';`
  //    - useRef( → 把 `import React from 'react';` 合并为 `import React, {useRef} from 'react';`
  //      （text 里出现 useRef( 或 preRefBlock 非空都触发；后者覆盖 Change 2 自动补的 useRef 行）
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

/**
 * 从 myConfig 调整文本中剥除 `myConfig.gridParams = { ... };` 整段
 * 使用 brace-depth 扫描定位匹配的 `}`，避免误删嵌套 `{}`
 */
function stripGridParamsBlock(text) {
  const startRe = /myConfig\.gridParams\s*=\s*\{/;
  const startMatch = startRe.exec(text);
  if (!startMatch) return text;

  const startIdx = startMatch.index;
  // brace-depth 扫描找匹配 }
  let depth = 1;
  let i = startMatch.index + startMatch[0].length;
  while (i < text.length && depth > 0) {
    const ch = text[i];
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
    if (depth === 0) break;
    i++;
  }
  if (depth !== 0) return text; // 不闭合，原样返回

  // 跳过可选的 ; 和随后的空白
  let endIdx = i + 1;
  if (text[endIdx] === ';') endIdx++;
  while (endIdx < text.length && /\s/.test(text[endIdx])) endIdx++;

  return text.slice(0, startIdx) + text.slice(endIdx);
}

/**
 * 生成 index 页面（auto_configIndex.tsx）
 *
 * 模板分支：
 *   - Branch A（标准模板）：initSearchModal 与 myConfigAdjustments 都缺。
 *     行为与改造前完全一致（无 myConfig 包装）。
 *   - Branch B（注入模板）：至少有一项 customization。
 *     顶部按需加 import cktsUtil；myConfig 调整块（可选）+ gridParams 块（可选）
 *     按参照文件中出现的顺序注入到 const myConfig = {...unitConfig}; 与 return <> 之间。
 *
 * @param {object} options
 * @param {string} options.configImportName - config 文件 basename（无扩展名），如 'auto_config'
 * @param {string} options.funImportName    - fun 文件 basename（无扩展名），如 'auto_configFun'
 * @param {string|null} [options.initSearchModal]
 *        - 来自参照文件的 `initSearchModal: [...]` 段（已重写 UnitUtil）
 * @param {string|null} [options.myConfigAdjustments]
 *        - 来自参照文件 `const myConfig = ...;` 与顶层 `return <...>` 之间的整段代码
 * @param {boolean} [options.needsCktsUtilImport]
 *        - true：注入模板顶部加 `import cktsUtil from '@/pages/hts/cktsUtil';`
 *        - 由 extractIndexCustomizationsFromFile 检测
 *          （段含 cktsUtil.X 调用 或 原 UnitUtil.getLcswsxDm 调用时为 true）
 * @param {boolean} [options.needsMyUtilImport]
 *        - true：注入模板顶部加 `import myUtil from '@/components/DDAssist/util';`
 *        - 由 extractMyConfigAdjustments 检测（myConfig 调整块含 myUtil. 时为 true）
 * @param {boolean} [options.needsUseRefImport]
 *        - true：把 `import React from 'react';` 合并为 `import React, {useRef} from 'react';`
 *        - 由 extractMyConfigAdjustments 检测（myConfig 调整块含 useRef( 时为 true）
 * @param {string} [options.preRefBlock]
 *        - Change 2：Func.getOtherRef 内 push 的 ref 自动补的 useRef 声明块
 *        - 注入到 `const myConfig = {...}` 之前（符合 React hooks 规则）
 *        - 默认 ''
 */
function generateIndexPage({
  configImportName,
  funImportName,
  initSearchModal,
  myConfigAdjustments,
  needsCktsUtilImport,
  needsMyUtilImport,
  needsUseRefImport,
  preRefBlock = '',
}) {
  // Branch A：完全无 customization —— 标准模板
  if (!initSearchModal && !myConfigAdjustments) {
    return `import React from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import unitConfig from './${configImportName}';
import Func from './${funImportName}';

const Unit: React.FC<unknown> = () => {
  return <>
    <DDBunit2 config={unitConfig} func={Func} />
  </>;
};
export default Unit;
`;
  }

  // Branch B：至少有一项 customization —— 注入模板
  const cktsUtilImportLine = needsCktsUtilImport
    ? "import cktsUtil from '@/pages/hts/cktsUtil';\n"
    : '';
  const myUtilImportLine = needsMyUtilImport
    ? "import myUtil from '@/components/DDAssist/util';\n"
    : '';
  // useRef 合并到 React 行（项目主流风格，与 DDBunit2.tsx line 1 一致）
  const useRefInReactImport = needsUseRefImport ? ', {useRef}' : '';
  const myConfigBlock = myConfigAdjustments
    ? `${myConfigAdjustments}\n`
    : '';
  const gridParamsBlock = initSearchModal
    ? `  myConfig.gridParams = {
    ${initSearchModal},
  };
`
    : '';
  // Change 2: preRefBlock 紧贴 `const myConfig` 之前（hook 必须在最前）
  return `import React${useRefInReactImport} from 'react';
${cktsUtilImportLine}${myUtilImportLine}import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import unitConfig from './${configImportName}';
import Func from './${funImportName}';

const Unit: React.FC<unknown> = () => {
${preRefBlock}  // 改变默认配置项
  const myConfig = { ...unitConfig };
${myConfigBlock}${gridParamsBlock}
  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>;
};
export default Unit;
`;
}

function generateFunPage() {
  return `import { message, Tooltip, Badge, Space, Segmented } from 'antd';
import React from 'react';

const Func: any = {
  refUnit: React.createRef(),
};

export default Func;
`;
}

// =================== 主流程 ===================
function main() {
  const args = parseArgs();
  if (!args.src) {
    console.error('Usage: node scripts/convert-ddbunit-config.js --src <input> [--out <output>] [--readme <path>] [--config-var <name>] [--rules <rules.json>]');
    process.exit(1);
  }

  // 自动派生 --out：若未传且 src 以 code_sample/ 开头
  if (!args.out) {
    const derived = deriveDefaultOutPath(args.src);
    if (derived) {
      args.out = derived;
      console.log(`[convert] 自动派生目标路径: ${derived}`);
    } else {
      console.error('未传 --out，且无法从 --src 派生（不以 code_sample/ 开头），请显式传 --out');
      process.exit(1);
    }
  }

  // 处理 --no-readme：显式禁用 README
  if (args['no-readme']) {
    args.readme = false;
  }

  // 自动派生 --readme：若未禁用且未显式传，则与 out 同目录
  if (args.readme !== false && !args.readme) {
    const derived = deriveDefaultReadmePath(args.out);
    if (derived) {
      args.readme = derived;
      console.log(`[convert] 自动派生 README 路径: ${derived}`);
    }
  }

  // 处理 --no-page：显式禁用 index + fun 页面
  if (args['no-page']) {
    args.page = false;
    args.fun = false;
  }
  // 处理 --no-fun：仅禁用 fun 页面（仍生成 index）
  if (args['no-fun']) {
    args.fun = false;
  }
  // 处理 --no-route：显式禁用路由追加
  if (args['no-route']) {
    args.route = false;
  }

  // 自动派生 --page：若未禁用且未显式传
  if (args.page !== false && !args.page) {
    const derived = derivePagePaths(args.out);
    if (derived) {
      args.page = derived;
      console.log(`[convert] 自动派生 page 路径: index=${derived.indexFile}, fun=${derived.funFile}`);
    }
  }

  // 加载规则
  const defaultRulesPath = path.join(__dirname, 'convert-ddbunit-config.rules.json');
  const rulesPath = args.rules || defaultRulesPath;
  const rules = JSON.parse(fs.readFileSync(rulesPath, 'utf-8'));

  // 读取源文件
  const srcContent = fs.readFileSync(args.src, 'utf-8');

  // 检测 config 变量名
  const configVar = args['config-var'] || detectConfigVar(srcContent);
  if (!configVar) {
    console.error('无法自动检测 config 变量名，请用 --config-var 指定');
    process.exit(1);
  }
  console.log(`[convert] config 变量名: ${configVar}`);

  let outContent = srcContent;
  const actions = { renames: [], removes: [], toolbarRenames: [], imports: [], removedImports: [], renderTransforms: 0, dateFormatNormalizes: 0, specialFieldRules: 0 };

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

  // 4. 转换 render 函数形式（r7 增强）
  //   仅在内容非空时执行；计数用于 README + 控制台摘要
  {
    const result = transformRenderFunctions(outContent);
    if (result.count > 0) {
      outContent = result.content;
      actions.renderTransforms = result.count;
      console.log(`[convert] r7: 转换 ${result.count} 处 render 函数形式`);
    }
  }

  // 4.7 归一化日期格式字符串（r8 增强）
  //   format: 'yyyy-MM-DD HH:mm:ss' → format: 'YYYY-MM-DD HH:mm:ss'
  {
    const result = normalizeDateFormats(outContent);
    if (result.count > 0) {
      outContent = result.content;
      actions.dateFormatNormalizes = result.count;
      console.log(`[convert] r8: 归一化 ${result.count} 处日期格式 (yyyy → YYYY)`);
    }
  }

  // 5. 前置 import
  if (rules.prependImports && rules.prependImports.length > 0) {
    const result = prependImports(outContent, rules.prependImports);
    outContent = result.content;
    actions.imports.push(...result.added);
  }

  // 5.5 删除指定 import（旧版本残留 import）
  if (rules.removeImports && rules.removeImports.length > 0) {
    const result = removeImports(outContent, rules.removeImports);
    outContent = result.content;
    actions.removedImports = result.removed;
  }

  // 5.7 特殊字段处理（r11 新增，scope: <configVar>.grid_columns 等）
  //   规则 1：业务类型代码列自动加 ellipsis: true
  {
    const result = applySpecialFieldRules(outContent, configVar);
    if (result.count > 0) {
      outContent = result.content;
      actions.specialFieldRules = result.count;
    }
  }

  // 6. 写出
  fs.mkdirSync(path.dirname(args.out), { recursive: true });
  fs.writeFileSync(args.out, outContent, 'utf-8');
  console.log(`[convert] 已写出: ${args.out}`);

  // 7. 生成 README
  if (args.readme) {
    const readme = generateReadme({
      srcFile: path.resolve(args.src),
      outFile: path.resolve(args.out),
      configVar,
      actions,
      rules,
    });
    fs.mkdirSync(path.dirname(args.readme), { recursive: true });
    fs.writeFileSync(args.readme, readme, 'utf-8');
    console.log(`[convert] 已生成 README: ${args.readme}`);
  }

  // 8. 生成 index / fun 页面（参照 unit3 模板）
  if (args.page) {
    const configImportName = path.basename(args.out, path.extname(args.out)); // 'monthDataConfig'
    // fun 文件 basename：去掉 configImportName 的 'Config' 后缀，加 'Fun'
    const funImportName = configImportName.endsWith('Config')
      ? configImportName.slice(0, -'Config'.length) + 'Fun'
      : configImportName + 'Fun';

    // 解析参照文件 → 抽取 customization（initSearchModal + myConfig 调整块）
    //   - 默认：<srcDir>/index.tsx（与源 auto_config.tsx 同目录）
    //   - --index <name>：<srcDir>/<name>.tsx
    //   - 文件不存在 / 无任何 customization → silent fallback
    let initSearchModal = null;
    let myConfigAdjustments = null;
    let preRefBlock = '';
    let needsCktsUtilImport = false;
    let needsMyUtilImport = false;
    let needsUseRefImport = false;
    if (args['no-index'] !== true) {
      const srcDir = path.dirname(args.src);
      const refBase = typeof args.index === 'string' && args.index.length > 0
        ? args.index
        : 'index';
      const refPath = path.join(srcDir, `${refBase}.tsx`);
      const customizations = extractIndexCustomizationsFromFile(refPath);
      if (customizations) {
        if (customizations.initSearchModal) {
          initSearchModal = customizations.initSearchModal.text;
          needsCktsUtilImport = customizations.initSearchModal.needsCktsUtilImport;
        }
        if (customizations.myConfigAdjustments) {
          myConfigAdjustments = customizations.myConfigAdjustments.text;
          preRefBlock = customizations.myConfigAdjustments.preRefBlock || '';
          needsMyUtilImport = customizations.myConfigAdjustments.needsMyUtilImport;
          if (customizations.myConfigAdjustments.needsCktsUtilImport) {
            needsCktsUtilImport = true;
          }
          needsUseRefImport = customizations.myConfigAdjustments.needsUseRefImport;
        }
        console.log(`[convert] 参照文件已抽取 customization: ${refPath}`);
      }
    }

    fs.mkdirSync(path.dirname(args.page.indexFile), { recursive: true });
    fs.writeFileSync(
      args.page.indexFile,
      generateIndexPage({
        configImportName,
        funImportName,
        initSearchModal,
        myConfigAdjustments,
        needsCktsUtilImport,
        needsMyUtilImport,
        needsUseRefImport,
        preRefBlock,
      }),
      'utf-8',
    );
    console.log(`[convert] 已生成 index 页面: ${args.page.indexFile}`);

    if (args.fun !== false) {
      fs.writeFileSync(args.page.funFile, generateFunPage(), 'utf-8');
      console.log(`[convert] 已生成 fun 页面: ${args.page.funFile}`);
    }
  }

  // 9. 追加到 routes.ckts.ts（默认 routes.ckts.ts；按 path 幂等）
  if (args.route !== false) {
    const routeConfig = rules.route || {};
    if (routeConfig.enabled !== false) {
      const configImportName = path.basename(args.out, path.extname(args.out));
      // r10: 从源文件抽取 name（JSDoc title > grid_title > module_key），
      //      解决不同父目录下同名 basename 的路由 name 冲突
      const nameOverride = extractRouteName(srcContent, configVar);
      const newEntry = buildRouteEntry({
        configImportName,
        nameMapping: routeConfig.nameMapping,
        pathTemplate: routeConfig.pathTemplate,
        outPath: args.out, // r9: 让 path/component 从输出路径反向派生
        nameOverride, // r10: 从源文件抽取的显示名
      });
      const cktsFile = path.resolve(
        __dirname,
        '..',
        routeConfig.cktsFile || 'config/routes/routes.ckts.ts',
      );
      const result = addRouteToCktsFile({ cktsFile, newEntry });
      if (result.added) {
        console.log(`[convert] 已追加路由: name=${newEntry.name}, path=${newEntry.path}`);
      } else {
        console.log(`[convert] 路由已存在，跳过: name=${newEntry.name}`);
      }
    }
  }

  // 摘要
  const summary = [
    `重命名 ${actions.renames.length} 个顶层 key`,
    `重命名 ${actions.toolbarRenames.length} 个嵌套 key`,
    `删除 ${actions.removes.length} 个 key`,
    `转换 ${actions.renderTransforms} 处 render 函数`,
    `归一化 ${actions.dateFormatNormalizes} 处日期格式`,
    `应用 ${actions.specialFieldRules} 处特殊字段规则`,
    `新增 ${actions.imports.length} 个 import`,
  ];
  console.log(`[convert] 摘要: ${summary.join(', ')}`);
}

main();
