#!/usr/bin/env node
/**
 * test-convert-ddbunit-config.js
 *
 * 跑 scripts/__fixtures__/ 下的所有 fixtures，对比工具实际输出与期望输出。
 * 用法：npm run test:convert-config
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const TOOL = path.join(__dirname, 'convert-ddbunit-config.js');
const FIXTURES_DIR = path.join(__dirname, '__fixtures__');

// r9 起：部分 fixture 验证路由生成。临时 ckts 文件由本测试运行器自动创建和清理
const TEMP_CKTS_FILE = path.join(FIXTURES_DIR, '__tmp_routes_ckts.ts');
const TEMP_CKTS_HEADER = 'export default [\n  { name: \'parent\', icon: \'CodeOutlined\', path: \'/hts\', routes: [\n';
const TEMP_CKTS_FOOTER = '  ]},\n];\n';

// fixtures 验证路由生成时用的"模拟 src 布局"输出目录
// r9: 用相对路径（相对 cwd / 项目根），让 r9 派生得到预期的 /hts/dditax... 形式
// 同时文件名不带 .actual 后缀，让 basename 就是 fxName（避免与常规 fixture 的 .actual 命名冲突）
function mockOutPathRelative(fxName) {
  return path.join(
    'scripts',
    '__fixtures__',
    '__src_layout__',
    'src',
    'pages',
    'hts',
    'dditax.ckts.from',
    'MDT___ZXSB_SB_MDT_TSSB_GCB',
    `${fxName}.tsx`,
  );
}

function getFixtures() {
  if (!fs.existsSync(FIXTURES_DIR)) {
    console.error(`[ERROR] fixtures 目录不存在: ${FIXTURES_DIR}`);
    process.exit(1);
  }
  const files = fs.readdirSync(FIXTURES_DIR);
  const byName = new Map();
  for (const f of files.sort()) {
    let base, kind;
    if (f.endsWith('.input.tsx')) {
      base = f.replace(/\.input\.tsx$/, '');
      kind = 'input';
    } else if (f.endsWith('.expected.tsx')) {
      base = f.replace(/\.expected\.tsx$/, '');
      kind = 'expected';
    } else if (f.endsWith('.README.expected.md')) {
      base = f.replace(/\.README\.expected\.md$/, '');
      kind = 'expectedReadme';
    } else if (f.endsWith('.rules.json')) {
      base = f.replace(/\.rules.json$/, '');
      kind = 'rules';
    } else if (f.endsWith('.expected.route.txt')) {
      base = f.replace(/\.expected\.route\.txt$/, '');
      kind = 'expectedRoute';
    } else if (f.endsWith('.expected.index.tsx')) {
      base = f.replace(/\.expected\.index\.tsx$/, '');
      kind = 'expectedIndex';
    } else if (f.endsWith('.expected.fun.tsx')) {
      base = f.replace(/\.expected\.fun\.tsx$/, '');
      kind = 'expectedFun';
    } else if (f.endsWith('.ref.tsx')) {
      // 参照文件：与 .input.tsx 同目录，basename = <fxName>.ref
      // 命中后 test runner 自动传 --index <fxName>.ref
      base = f.replace(/\.ref\.tsx$/, '');
      kind = 'indexRef';
    } else if (f.endsWith('.funRef.tsx')) {
      // fun 参照文件：与 .input.tsx 同目录，basename = <fxName>.funRef
      // 命中后 test runner 自动传 --fun <fxName>.funRef
      base = f.replace(/\.funRef\.tsx$/, '');
      kind = 'funRef';
    } else {
      continue;
    }
    if (!byName.has(base)) byName.set(base, { name: base });
    byName.get(base)[kind] = path.join(FIXTURES_DIR, f);
  }
  return Array.from(byName.values());
}

function runTool(args) {
  const result = spawnSync(process.execPath, [TOOL, ...args], {
    stdio: 'pipe',
    encoding: 'utf-8',
  });
  return {
    code: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  };
}

function diff(expected, actual) {
  if (expected === actual) return null;
  // 简单的 line-by-line diff
  const expLines = expected.split('\n');
  const actLines = actual.split('\n');
  const max = Math.max(expLines.length, actLines.length);
  const diffs = [];
  for (let i = 0; i < max; i++) {
    if (expLines[i] !== actLines[i]) {
      diffs.push(`  L${i + 1}:`);
      diffs.push(`    - expected: ${JSON.stringify(expLines[i])}`);
      diffs.push(`    + actual:   ${JSON.stringify(actLines[i])}`);
    }
  }
  return diffs.join('\n');
}

// r9：把期望的路由条目格式化为工具会输出的"路由行"，
// 然后在临时 ckts 文件中查找是否出现（避免依赖全文件 diff）
function checkRouteEntry(cktsFile, expectedRouteLine) {
  if (!fs.existsSync(cktsFile)) {
    return `临时 ckts 文件不存在: ${cktsFile}`;
  }
  const content = fs.readFileSync(cktsFile, 'utf-8');
  // 期望行的右侧可能带尾随空格；归一化后比较
  const normalizedExpected = expectedRouteLine.trim();
  const lines = content.split('\n').map((l) => l.trim());
  if (lines.includes(normalizedExpected)) return null;
  return `期望路由行未在 ckts 中找到:\n  expected: ${JSON.stringify(normalizedExpected)}\n  ckts 全部行:\n${lines.map((l) => '    ' + JSON.stringify(l)).join('\n')}`;
}

let passed = 0;
let failed = 0;
const failedNames = [];

for (const fx of getFixtures()) {
  if (!fx.input || !fx.expected) {
    console.warn(`[SKIP] ${fx.name}: 缺少 input 或 expected`);
    continue;
  }

  // 默认 out 路径：fixture 目录下（同已有约定）
  // r9：若 fixture 有 expectedRoute，使用"模拟 src 布局"路径（相对 cwd）以触发 r9 路径派生
  const outPath = fx.expectedRoute
    ? mockOutPathRelative(fx.name)
    : path.join(FIXTURES_DIR, `${fx.name}.actual.tsx`);
  const readmePath = path.join(FIXTURES_DIR, `${fx.name}.actual.README.md`);

  // 跑工具
  // 默认 --no-readme --no-page --no-fun --no-route 避免污染项目目录
  // 仅当 fixture 有 expectedReadme 时才传 --readme（覆盖 --no-readme）
  // r9：若 fixture 有 expectedRoute，不传 --no-route，让工具写入临时 ckts 文件
  // 扩展：fixture 有 expectedIndex / expectedFun 时不传 --no-page，让工具生成 index/fun
  // 扩展：fixture 有 indexRef（<fxName>.ref.tsx）时自动传 --index <fxName>.ref
  // 扩展：fixture 有 funRef（<fxName>.funRef.tsx）时自动传 --fun <fxName>.funRef
  // r20+：fixture 没有 funRef 时不跑 fun 生成（避免 ref 缺失时报错）
  const wantsIndexOrFun = !!(fx.expectedIndex || fx.expectedFun);
  const wantsFun = !!fx.funRef;
  const args = ['--src', fx.input, '--out', outPath, '--no-readme'];
  if (!wantsIndexOrFun) {
    args.push('--no-page', '--no-fun');
  } else if (!wantsFun) {
    args.push('--no-fun');
  }
  if (fx.indexRef) {
    args.push('--index', `${fx.name}.ref`);
  }
  if (fx.funRef) {
    args.push('--fun', `${fx.name}.funRef`);
  }
  if (fx.expectedRoute) {
    // r9：让工具把路由写入临时 ckts 文件
    if (!fx.rules) {
      console.warn(`[SKIP] ${fx.name}: 有 expectedRoute 但缺少 .rules.json，无法路由生成`);
      continue;
    }
    // 准备临时 ckts 文件（必须先存在合法 `routes: [` 数组，工具才能追加）
    fs.mkdirSync(path.dirname(TEMP_CKTS_FILE), { recursive: true });
    fs.writeFileSync(TEMP_CKTS_FILE, TEMP_CKTS_HEADER + TEMP_CKTS_FOOTER, 'utf-8');
  } else {
    args.push('--no-route');
  }
  if (fx.expectedReadme) {
    args.push('--readme', readmePath);
  }
  if (fx.rules) {
    args.push('--rules', fx.rules);
  }

  const result = runTool(args);
  if (result.code !== 0) {
    console.error(`[FAIL] ${fx.name}: 工具执行失败 (exit=${result.code})`);
    if (result.stdout) console.error(`  stdout: ${result.stdout}`);
    if (result.stderr) console.error(`  stderr: ${result.stderr}`);
    failed++;
    failedNames.push(fx.name);
    continue;
  }

  // diff config 输出
  const actualOut = fs.readFileSync(outPath, 'utf-8');
  const expectedOut = fs.readFileSync(fx.expected, 'utf-8');
  const configDiff = diff(expectedOut, actualOut);
  if (configDiff) {
    console.error(`[FAIL] ${fx.name}: config 输出与期望不一致`);
    console.error(configDiff);
    failed++;
    failedNames.push(fx.name);
    continue;
  }

  // diff README（如有）
  if (fx.expectedReadme) {
    if (!fs.existsSync(readmePath)) {
      console.error(`[FAIL] ${fx.name}: 期望有 README 但工具未生成`);
      failed++;
      failedNames.push(fx.name);
      continue;
    }
    const actualReadme = fs.readFileSync(readmePath, 'utf-8');
    const expectedReadme = fs.readFileSync(fx.expectedReadme, 'utf-8');
    const readmeDiff = diff(expectedReadme, actualReadme);
    if (readmeDiff) {
      console.error(`[FAIL] ${fx.name}: README 输出与期望不一致`);
      console.error(readmeDiff);
      failed++;
      failedNames.push(fx.name);
      continue;
    }
  }

  // r9：校验路由条目
  if (fx.expectedRoute) {
    const expectedRoute = fs.readFileSync(fx.expectedRoute, 'utf-8');
    const routeErr = checkRouteEntry(TEMP_CKTS_FILE, expectedRoute);
    if (routeErr) {
      console.error(`[FAIL] ${fx.name}: 路由条目不匹配`);
      console.error(routeErr);
      failed++;
      failedNames.push(fx.name);
      continue;
    }
  }

  // 扩展：校验 index 页面（actualIndex.tsx 来自 convert 的 derivePagePaths）
  if (fx.expectedIndex) {
    const actualIndexPath = path.join(FIXTURES_DIR, `${fx.name}.actualIndex.tsx`);
    if (!fs.existsSync(actualIndexPath)) {
      console.error(`[FAIL] ${fx.name}: 期望有 index 页面但工具未生成`);
      failed++;
      failedNames.push(fx.name);
      continue;
    }
    const actualIndex = fs.readFileSync(actualIndexPath, 'utf-8');
    const expectedIndex = fs.readFileSync(fx.expectedIndex, 'utf-8');
    const indexDiff = diff(expectedIndex, actualIndex);
    if (indexDiff) {
      console.error(`[FAIL] ${fx.name}: index 输出与期望不一致`);
      console.error(indexDiff);
      failed++;
      failedNames.push(fx.name);
      continue;
    }
  }

  // 扩展：校验 fun 页面
  if (fx.expectedFun) {
    const actualFunPath = path.join(FIXTURES_DIR, `${fx.name}.actualFun.tsx`);
    if (!fs.existsSync(actualFunPath)) {
      console.error(`[FAIL] ${fx.name}: 期望有 fun 页面但工具未生成`);
      failed++;
      failedNames.push(fx.name);
      continue;
    }
    const actualFun = fs.readFileSync(actualFunPath, 'utf-8');
    const expectedFun = fs.readFileSync(fx.expectedFun, 'utf-8');
    const funDiff = diff(expectedFun, actualFun);
    if (funDiff) {
      console.error(`[FAIL] ${fx.name}: fun 输出与期望不一致`);
      console.error(funDiff);
      failed++;
      failedNames.push(fx.name);
      continue;
    }
  }

  console.log(`[PASS] ${fx.name}`);
  passed++;
}

// 清理临时文件
if (fs.existsSync(TEMP_CKTS_FILE)) {
  fs.unlinkSync(TEMP_CKTS_FILE);
}
// r9：清理 r9 fixture 用过的"模拟 src 布局"目录
const MOCK_SRC_LAYOUT = path.join(FIXTURES_DIR, '__src_layout__');
if (fs.existsSync(MOCK_SRC_LAYOUT)) {
  fs.rmSync(MOCK_SRC_LAYOUT, { recursive: true, force: true });
}

console.log(`\n========== 测试结果 ==========`);
console.log(`通过: ${passed}`);
console.log(`失败: ${failed}`);
if (failed > 0) {
  console.log(`失败的 fixtures: ${failedNames.join(', ')}`);
}
process.exit(failed > 0 ? 1 : 0);
