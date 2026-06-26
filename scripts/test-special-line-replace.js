#!/usr/bin/env node
/**
 * test-special-line-replace.js
 *
 * 回归测试 applyContentReplaces 中的 line 规则（rules.special[*].line）。
 * 用临时 input / rules.json 验证：
 *   - 单行替换生效
 *   - 多行替换按数组顺序生效
 *   - 行号越界 silent fallback
 *   - fileName 不匹配时跳过
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { applyContentReplaces } = require('./copy-from-code-sample');

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'special-line-'));
let passed = 0;
let failed = 0;

function assertEqual(actual, expected, label) {
  if (actual === expected) {
    console.log(`  [PASS] ${label}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${label}`);
    console.error(`    expected: ${JSON.stringify(expected)}`);
    console.error(`    actual:   ${JSON.stringify(actual)}`);
    failed++;
  }
}

function makeRules(special) {
  const rulesPath = path.join(tmpDir, `rules-${Math.random().toString(36).slice(2)}.json`);
  fs.writeFileSync(rulesPath, JSON.stringify({ special }, null, 2));
  return rulesPath;
}

// 临时改 process.cwd 或用一个不会被 loadSpecialRules 复用的位置：
// loadSpecialRules 总是从 __dirname/convert-ddbunit-config.rules.json 读取，
// 所以"自定义规则"实际要通过修改这个文件来验证。为避免污染原 rules.json，
// 我们直接复制原文件到 tmpDir，覆盖后再恢复（fs.copyFileSync 备份/还原）。
const originalRulesPath = path.join(__dirname, 'convert-ddbunit-config.rules.json');
const originalRulesBackup = fs.readFileSync(originalRulesPath, 'utf-8');

function withRules(special, fn) {
  // 把 special 段注入到默认 rules.json
  const parsed = JSON.parse(originalRulesBackup);
  parsed.special = special;
  fs.writeFileSync(originalRulesPath, JSON.stringify(parsed, null, 2));
  // 重置缓存
  delete require.cache[require.resolve('./copy-from-code-sample')];
  try {
    fn();
  } finally {
    fs.writeFileSync(originalRulesPath, originalRulesBackup, 'utf-8');
    delete require.cache[require.resolve('./copy-from-code-sample')];
  }
}

// Test 1: 单行替换
{
  const input = ['line 1', 'line 2', 'line 3', 'line 4'].join('\n');
  withRules(
    [
      {
        fileName: 'fake/path/index.tsx',
        line: [{ '3': 'REPLACED' }],
      },
    ],
    () => {
      const { applyContentReplaces } = require('./copy-from-code-sample');
      const out = applyContentReplaces(input, 'ts', 'fake/path/index.tsx');
      assertEqual(
        out,
        ['line 1', 'line 2', 'REPLACED', 'line 4'].join('\n'),
        'single line replacement',
      );
    },
  );
}

// Test 2: 多行替换按数组顺序
{
  const input = ['A', 'B', 'C', 'D', 'E'].join('\n');
  withRules(
    [
      {
        fileName: 'fake/multi.tsx',
        line: [{ '5': 'E-new' }, { '1': 'A-new' }, { '3': 'C-new' }],
      },
    ],
    () => {
      const { applyContentReplaces } = require('./copy-from-code-sample');
      const out = applyContentReplaces(input, 'ts', 'fake/multi.tsx');
      assertEqual(
        out,
        ['A-new', 'B', 'C-new', 'D', 'E-new'].join('\n'),
        'multi-line replacement by array order',
      );
    },
  );
}

// Test 3: 行号越界 silent fallback
{
  const input = ['only', 'two', 'lines'].join('\n');
  withRules(
    [
      {
        fileName: 'fake/oob.tsx',
        line: [{ '99': 'NEVER' }],
      },
    ],
    () => {
      const { applyContentReplaces } = require('./copy-from-code-sample');
      const out = applyContentReplaces(input, 'ts', 'fake/oob.tsx');
      assertEqual(out, input, 'out-of-bounds line is silently skipped');
    },
  );
}

// Test 4: fileName 不匹配 → 跳过
{
  const input = ['x', 'y', 'z'].join('\n');
  withRules(
    [
      {
        fileName: 'some/other/file.tsx',
        line: [{ '2': 'NEVER' }],
      },
    ],
    () => {
      const { applyContentReplaces } = require('./copy-from-code-sample');
      const out = applyContentReplaces(input, 'ts', 'fake/path/index.tsx');
      assertEqual(out, input, 'non-matching fileName is skipped');
    },
  );
}

// Test 5: 同 entry 含 replace + line：line 在 replace 之后执行
{
  const input = ['replace-target', 'placeholder', 'placeholder'].join('\n');
  withRules(
    [
      {
        fileName: 'fake/combo.tsx',
        replace: [{ old: 'replace-target', new: 'REPLACED' }],
        line: [{ '3': 'LINE3' }],
      },
    ],
    () => {
      const { applyContentReplaces } = require('./copy-from-code-sample');
      const out = applyContentReplaces(input, 'ts', 'fake/combo.tsx');
      assertEqual(
        out,
        ['REPLACED', 'placeholder', 'LINE3'].join('\n'),
        'replace + line coexist; line runs after replace',
      );
    },
  );
}

// Test 6: Windows 路径分隔符归一化（srcFile 用 \ 而 fileName 用 /）
{
  const input = ['a', 'b', 'c'].join('\n');
  withRules(
    [
      {
        fileName: 'fake/win/path.tsx',
        line: [{ '2': 'B-WIN' }],
      },
    ],
    () => {
      const { applyContentReplaces } = require('./copy-from-code-sample');
      const out = applyContentReplaces(input, 'ts', 'fake\\win\\path.tsx');
      assertEqual(
        out,
        ['a', 'B-WIN', 'c'].join('\n'),
        'Windows path separator normalization',
      );
    },
  );
}

// Test 7: 空 line 数组 → silent fallback
{
  const input = ['x'].join('\n');
  withRules(
    [
      {
        fileName: 'fake/empty.tsx',
        line: [],
      },
    ],
    () => {
      const { applyContentReplaces } = require('./copy-from-code-sample');
      const out = applyContentReplaces(input, 'ts', 'fake/empty.tsx');
      assertEqual(out, input, 'empty line array is no-op');
    },
  );
}

// Test 8: srcFile 为 undefined 时 silent fallback
{
  const input = ['x', 'y'].join('\n');
  withRules(
    [
      {
        fileName: 'fake/whatever.tsx',
        line: [{ '1': 'NEVER' }],
      },
    ],
    () => {
      const { applyContentReplaces } = require('./copy-from-code-sample');
      const out = applyContentReplaces(input, 'ts', undefined);
      assertEqual(out, input, 'undefined srcFile is no-op');
    },
  );
}

// 清理
fs.rmSync(tmpDir, { recursive: true, force: true });

console.log(`\n总结: ${passed} 通过, ${failed} 失败`);
process.exit(failed > 0 ? 1 : 0);
