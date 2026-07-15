#!/usr/bin/env node
/**
 * test-dropdown-overlay-to-menu.js
 *
 * 回归测试 r20 transformDropdownOverlayToMenu + cleanupUnusedMenuImport。
 * 通过 inline input 验证（不写 .input.tsx/.expected.tsx fixture，避免被 test-convert-ddbunit-config.js 误拾取）：
 *   - 简单 inline Menu 自动转换为 menu={{ items: [...] }}
 *   - onClick 包裹成 <a onClick={...}>
 *   - 无 onClick 项的 label 形式
 *   - 自闭合 <Menu.Item .../> 支持
 *   - 复杂场景（Dropdown.Button / overlay={variable} / domEvent / 条件表达式 / <Access> / Menu className）skip 不动
 *   - cleanupUnusedMenuImport 在 Menu.Item 仍被引用时不动 import
 *
 * 用法：npm run test:dropdown-overlay
 */
const { transformDropdownOverlayToMenu, cleanupUnusedMenuImport } = require('./copy-from-code-sample');

let passed = 0;
let failed = 0;

function assertEqual(actual, expected, label) {
  if (actual === expected) {
    console.log(`  [PASS] ${label}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${label}`);
    const expLines = expected.split('\n');
    const actLines = actual.split('\n');
    const max = Math.max(expLines.length, actLines.length);
    for (let i = 0; i < max; i++) {
      if (expLines[i] !== actLines[i]) {
        console.error(`    L${i + 1}:`);
        console.error(`      - expected: ${JSON.stringify(expLines[i])}`);
        console.error(`      + actual:   ${JSON.stringify(actLines[i])}`);
      }
    }
    failed++;
  }
}

// 单元测试 1: 极简单
{
  const input = `<Dropdown overlay={(<Menu><Menu.Item key='a' onClick={fn}>x</Menu.Item></Menu>)}><Button>y</Button></Dropdown>`;
  const r = transformDropdownOverlayToMenu(input);
  assertEqual(r.count, 1, 'unit 1: count is 1');
  assertEqual(r.skipped.length, 0, 'unit 1: no skipped');
  assertEqual(
    r.content,
    `<Dropdown menu={{ items: [\n        { key: 'a', label: <a onClick={fn}>x</a> },\n      ] }}><Button>y</Button></Dropdown>`,
    'unit 1: simple 1-item transform',
  );
}

// 单元测试 2: no onClick
{
  const input = `<Dropdown overlay={(<Menu><Menu.Item key='a'>plain text</Menu.Item></Menu>)}><Button>y</Button></Dropdown>`;
  const r = transformDropdownOverlayToMenu(input);
  assertEqual(r.count, 1, 'unit 2: count is 1');
  assertEqual(
    r.content,
    `<Dropdown menu={{ items: [\n        { key: 'a', label: plain text },\n      ] }}><Button>y</Button></Dropdown>`,
    'unit 2: no onClick → label = raw children',
  );
}

// 单元测试 3: self-closing Menu.Item
{
  const input = `<Dropdown overlay={(<Menu><Menu.Item key='only' /></Menu>)}><Button>y</Button></Dropdown>`;
  const r = transformDropdownOverlayToMenu(input);
  assertEqual(r.count, 1, 'unit 3: count is 1');
  assertEqual(
    r.content,
    `<Dropdown menu={{ items: [\n        { key: 'only', label: '' },\n      ] }}><Button>y</Button></Dropdown>`,
    'unit 3: self-closing Menu.Item → label: ""',
  );
}

// 单元测试 4: Dropdown.Button skipped
{
  const input = `<Dropdown.Button overlay={(<Menu><Menu.Item key='a'>x</Menu.Item></Menu>)}>btn</Dropdown.Button>`;
  const r = transformDropdownOverlayToMenu(input);
  assertEqual(r.count, 0, 'unit 4: Dropdown.Button not transformed');
  assertEqual(r.skipped.length, 1, 'unit 4: 1 skip recorded');
  assertEqual(r.content, input, 'unit 4: content unchanged');
}

// 单元测试 5: overlay={variable} skipped
{
  const input = `<Dropdown overlay={overlayMenu}><Button>y</Button></Dropdown>`;
  const r = transformDropdownOverlayToMenu(input);
  assertEqual(r.count, 0, 'unit 5: overlay={var} not transformed');
  assertEqual(r.skipped.length, 1, 'unit 5: 1 skip recorded');
}

// 单元测试 6: domEvent skipped
{
  const input = `<Dropdown overlay={(<Menu><Menu.Item key='a' onClick={({ domEvent }) => x}>y</Menu.Item></Menu>)}><Button>z</Button></Dropdown>`;
  const r = transformDropdownOverlayToMenu(input);
  assertEqual(r.count, 0, 'unit 6: domEvent not transformed');
  assertEqual(r.skipped.length, 1, 'unit 6: 1 skip recorded');
}

// 单元测试 7: Menu className skipped
{
  const input = `<Dropdown overlay={(<Menu className="x"><Menu.Item key='a'>y</Menu.Item></Menu>)}><Button>z</Button></Dropdown>`;
  const r = transformDropdownOverlayToMenu(input);
  assertEqual(r.count, 0, 'unit 7: Menu with className not transformed');
  assertEqual(r.skipped.length, 1, 'unit 7: 1 skip recorded');
}

// 单元测试 8: <Access> in Menu skipped
{
  const input = `<Dropdown overlay={(<Menu><Menu.Item key='a'><Access>x</Access></Menu.Item></Menu>)}><Button>z</Button></Dropdown>`;
  const r = transformDropdownOverlayToMenu(input);
  assertEqual(r.count, 0, 'unit 8: Menu with <Access> not transformed');
  assertEqual(r.skipped.length, 1, 'unit 8: 1 skip recorded');
}

// 单元测试 9: 条件表达式 in Menu skipped
{
  const input = `<Dropdown overlay={(<Menu>{cond ? '' : <Menu.Item key='a'>x</Menu.Item>}</Menu>)}><Button>y</Button></Dropdown>`;
  const r = transformDropdownOverlayToMenu(input);
  assertEqual(r.count, 0, 'unit 9: Menu with conditional not transformed');
  assertEqual(r.skipped.length, 1, 'unit 9: 1 skip recorded');
}

// 单元测试 10: 保留 placement 等其它 Dropdown props
{
  const input = `<Dropdown placement="bottomRight" trigger={['click']} overlay={(<Menu><Menu.Item key='a' onClick={fn}>x</Menu.Item></Menu>)}><Button>y</Button></Dropdown>`;
  const r = transformDropdownOverlayToMenu(input);
  assertEqual(
    r.content,
    `<Dropdown placement="bottomRight" trigger={['click']} menu={{ items: [\n        { key: 'a', label: <a onClick={fn}>x</a> },\n      ] }}><Button>y</Button></Dropdown>`,
    'unit 10: placement/trigger preserved',
  );
}

// 单元测试 11: cleanupUnusedMenuImport - no Menu usage → keep other imports
{
  const input = `import { Button, Dropdown, Menu } from 'antd';\nconst x = <Button>y</Button>;\n`;
  const r = cleanupUnusedMenuImport(input);
  assertEqual(r.removed, true, 'unit 11: removed flag true');
  assertEqual(r.content, `import { Button, Dropdown } from 'antd';\nconst x = <Button>y</Button>;\n`, 'unit 11: Menu removed from import list');
}

// 单元测试 12: cleanupUnusedMenuImport - only Menu import → remove entire line
{
  const input = `import { Menu } from 'antd';\nconst x = 1;\n`;
  const r = cleanupUnusedMenuImport(input);
  assertEqual(r.removed, true, 'unit 12: removed flag true');
  assertEqual(r.content, `const x = 1;\n`, 'unit 12: Menu import line removed');
}

// 单元测试 13: cleanupUnusedMenuImport - Menu.Item still used → keep import
{
  const input = `import { Button, Menu } from 'antd';\nconst x = <Menu.Item>y</Menu.Item>;\n`;
  const r = cleanupUnusedMenuImport(input);
  assertEqual(r.removed, false, 'unit 13: removed flag false');
  assertEqual(r.content, input, 'unit 13: content unchanged');
}

// 单元测试 14: cleanupUnusedMenuImport - no Menu import → no-op
{
  const input = `import { Button } from 'antd';\nconst x = <Button>y</Button>;\n`;
  const r = cleanupUnusedMenuImport(input);
  assertEqual(r.removed, false, 'unit 14: removed flag false (no Menu in import)');
  assertEqual(r.content, input, 'unit 14: content unchanged');
}

// 单元测试 15: end-to-end via applyContentReplaces
{
  const { applyContentReplaces } = require('./copy-from-code-sample');
  const origLog = console.log;
  console.log = () => {}; // 抑制 [convert] log
  const input = `import { Button, Dropdown, Menu } from 'antd';\nconst x = <Dropdown overlay={(<Menu><Menu.Item key='a' onClick={fn}>y</Menu.Item></Menu>)}><Button>z</Button></Dropdown>;\n`;
  const r = applyContentReplaces(input, 'ts', 'test.tsx');
  console.log = origLog;
  const expected = `import { Button, Dropdown } from 'antd';\nconst x = <Dropdown menu={{ items: [\n        { key: 'a', label: <a onClick={fn}>y</a> },\n      ] }}><Button>z</Button></Dropdown>;\n`;
  assertEqual(r, expected, 'unit 15: end-to-end via applyContentReplaces cleans up Menu import');
}

console.log(`\n总结: ${passed} 通过, ${failed} 失败`);
process.exit(failed > 0 ? 1 : 0);