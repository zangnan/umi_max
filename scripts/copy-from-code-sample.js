#!/usr/bin/env node
/**
 * copy-from-code-sample.js
 *
 * 文件夹级复制 + 批量转换工具。仿照 convert-ddbunit-config.js 的 index/config/fun
 * 三文件生成方式,支持传入参照文件或文件夹作为 --src。
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
 *   2. 目标路径自动派生: 剥 code_sample/ 前缀(与 deriveDefaultOutPath 一致)
 *   3. 目录模式: 先递归复制整棵树,再对每个 .tsx 跑完整转换管线
 *   4. 文件模式: 等价于原 convert-ddbunit-config.js 行为
 *   5. 单个 .tsx 失败 → 继续处理其他文件,末尾汇总打印失败列表
 */
const fs = require('fs');
const path = require('path');
const { processOne, detectConfigVar } = require('./convert-ddbunit-config.js');

// =================== 参数解析 ===================
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
 * 规则: 去掉开头的 code_sample/ 前缀
 * 例: code_sample/src/pages/.../X.tsx -> src/pages/.../X.tsx
 * 不符合派生规则时返回 null
 */
function deriveDefaultOutPath(srcPath) {
  const normalized = srcPath.replace(/\\/g, '/');
  if (normalized.startsWith('code_sample/')) {
    return normalized.slice('code_sample/'.length);
  }
  return null;
}

function isDirectory(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

/**
 * 递归收集目录下所有 .tsx 文件的绝对路径
 */
function walkTsx(dir) {
  const out = [];
  function walk(p) {
    for (const entry of fs.readdirSync(p, { withFileTypes: true })) {
      const full = path.join(p, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && entry.name.endsWith('.tsx')) out.push(full);
    }
  }
  walk(dir);
  return out;
}

/**
 * 透传给 processOne 的 CLI 参数列表(避免逐字段重复写)
 */
const PROCESS_ONE_PASSTHROUGH = [
  'index',
  'fun',
  'config-var',
  'rules',
  'readme',
  'no-index',
  'no-fun',
  'no-page',
  'no-readme',
  'no-route',
];

function buildProcessOneArgs(args, src, out) {
  const result = { src, out };
  for (const key of PROCESS_ONE_PASSTHROUGH) {
    if (args[key] !== undefined) result[key] = args[key];
  }
  // 复制后处理不追加 routes.ckts.ts(用户决策)
  result.route = false;
  return result;
}

// =================== 复制后改写规则(作用于被复制的每个 .tsx) ===================
// 仿照 convert-ddbunit-config.js 的 fun 路径 import 改写思路,作用于所有 .tsx
// (不仅限于 auto_config.tsx 走 processOne 的情况,index.tsx / f.tsx 也会应用)
//
// 规则清单:
//   R1: import { ... } from '@/services/hts/api'  → '@/pages/hts/services/htsApi' (多行折叠为单行)
//   R2: import <name> from '@/pages/common/myUtil' → import <name> from '@/components/DDAssist/util' (保留 default 名字)
//   R3: import <name> from '@/pages/common/proConfig' → import CONSTANTS from '@/components/DDAssist/constants' (default 名字硬编码改写)
//   R4: pro.c_modal_width_x4 → CONSTANTS.C_MODAL_WIDTH_X4 (R3 改写后引用方)
//   R5: import <name> from '@/components/DDAlert' → import <name> from '@/pages/hts/commonModule/DDAlert' (保留 default 名字)
//
// silent fallback: 文本无对应模式 → 原样保留
// 幂等: 已是新路径不匹配(反复跑不破坏)
function applyCopyRewrites(content) {
  let text = content;

  // R1: '@/services/hts/api' → '@/pages/hts/services/htsApi'(多行折叠为单行)
  //   与 convert-ddbunit-config.js 的 A.6(fun 路径)/ A.14(index 路径 apiTb 合并) 同款手法
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

  // R2: '@/pages/common/myUtil' (default 导入) → '@/components/DDAssist/util' (保留 default 名字)
  //   与 convert-ddbunit-config.js 的规则 4(fun 路径) 同款手法
  text = text.replace(
    /^import\s+(\w+)\s+from\s+['"]@\/pages\/common\/myUtil['"]\s*;?[ \t]*$/gm,
    "import $1 from '@/components/DDAssist/util';",
  );

  // R3: '@/pages/common/proConfig' (default 导入) → '@/components/DDAssist/constants' (default 名字硬编码为 CONSTANTS)
  //   用户决策: default 名字统一改为 CONSTANTS(与项目内引用 CONSTANTS.C_MODAL_WIDTH_X4 等保持一致)
  text = text.replace(
    /^import\s+\w+\s+from\s+['"]@\/pages\/common\/proConfig['"]\s*;?[ \t]*$/gm,
    "import CONSTANTS from '@/components/DDAssist/constants';",
  );

  // R4: pro.c_modal_width_x4 → CONSTANTS.C_MODAL_WIDTH_X4
  //   仅匹配小写 pro. 前缀(已 R3 改写为 CONSTANTS 后,pro. 不再出现,达到幂等)
  //   \b 词边界保护 proXxx.c_modal_width_x4 等变体
  text = text.replace(/\bpro\.c_modal_width_x4\b/g, 'CONSTANTS.C_MODAL_WIDTH_X4');

  // R5: '@/components/DDAlert' (default 导入) → '@/pages/hts/commonModule/DDAlert' (保留 default 名字)
  //   与 convert-ddbunit-config.js 的规则 5(fun 路径) 同款手法
  text = text.replace(
    /^import\s+(\w+)\s+from\s+['"]@\/components\/DDAlert['"]\s*;?[ \t]*$/gm,
    "import $1 from '@/pages/hts/commonModule/DDAlert';",
  );

  return text;
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
    // 2. 应用 4 条改写规则(imports + pro.c_modal_width_x4)
    const content = fs.readFileSync(out, 'utf-8');
    const rewritten = applyCopyRewrites(content);
    if (rewritten !== content) {
      fs.writeFileSync(out, rewritten, 'utf-8');
      console.log(`[copy] 已应用改写规则`);
    }
    // 3. 跑 processOne 完整管线(不追加 routes.ckts.ts)
    //   仅对 config 入口文件(用 detectConfigVar 试探: `const <name>: any = {};` 模式)
    //   非 config 入口(index/f.tsx 等)跳过 — 它们的 R1-R5 改写已完成;若误调 processOne 会 throw
    if (detectConfigVar(fs.readFileSync(out, 'utf-8')) !== null) {
      processOne(buildProcessOneArgs(args, args.src, out));
    } else {
      console.log(`[copy] 跳过 processOne(非 config 入口)`);
    }
    return;
  }

  // ========== 目录模式 ==========
  const srcDir = args.src.replace(/\\/g, '/').replace(/\/$/, '');
  const dstDir = deriveDefaultOutPath(srcDir);
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

  // 2. 扫描所有 .tsx(目标侧,因目录已落地)
  const tsxFiles = walkTsx(dstDir);
  console.log(`[copy] 发现 ${tsxFiles.length} 个 .tsx 文件`);

  // 3. 逐个跑转换
  const failures = [];
  let successCount = 0;
  for (const dstFile of tsxFiles) {
    const relPath = path.relative(dstDir, dstFile);
    const srcFile = path.join(srcDir, relPath);
    try {
      console.log(`\n[copy] 处理: ${relPath}`);
      // 3.1 应用 4 条改写规则(imports + pro.c_modal_width_x4)到已复制的目标文件
      //   - 先于 processOne: 这样 processOne 看到的 dstFile 已是改写后状态
      //   - 对所有 .tsx 生效(index/f.tsx 不会走 processOne,只能靠此步骤)
      //   - 幂等: 已是新路径不匹配
      const content = fs.readFileSync(dstFile, 'utf-8');
      const rewritten = applyCopyRewrites(content);
      if (rewritten !== content) {
        fs.writeFileSync(dstFile, rewritten, 'utf-8');
        console.log(`  ↪ 已应用改写规则`);
      }
      // 3.2 提前识别 config 入口(用 detectConfigVar 试探: `const <name>: any = {};` 模式)
      //   - 是入口 → 跑 processOne 完整管线(重命名/移除/index/fun/route)
      //   - 非入口(index/f.tsx/Tab/外层页)→ 跳过 processOne(R1-R5 已处理;processOne 输出由 config 入口的 processOne 派生)
      //   修复前:对所有 .tsx 无差别调 processOne,非入口 throw 进入 failures → process.exit(1) 误报
      if (detectConfigVar(content) !== null) {
        processOne(buildProcessOneArgs(args, srcFile, dstFile));
        console.log(`  ↪ 已跑 processOne(config 入口)`);
      } else {
        console.log(`  ↪ 跳过 processOne(非 config 入口)`);
      }
      successCount++;
    } catch (e) {
      failures.push({ file: relPath, error: e.message });
      console.error(`  ✗ 失败: ${e.message}`);
    }
  }

  // 4. 汇总
  console.log(`\n========== 批处理结果 ==========`);
  console.log(`成功: ${successCount} / ${tsxFiles.length}`);
  console.log(`失败: ${failures.length}`);
  if (failures.length > 0) {
    console.log('失败文件:');
    for (const f of failures) console.log(`  - ${f.file}: ${f.error}`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
