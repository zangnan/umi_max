/**
 * title: grid-filter-quick-transform 测试 - 验证 r21 grid_filter_quick 块内 list.label → name + onChange → eventOnChange
 */
const myConfig: any = {};

myConfig.module_key = 'GRID_FILTER_QUICK_TRANSFORM_TEST';

// CASE 1: Select with onChange + list of {label, value} — main user scenario
myConfig.grid_filter_quick = [
  {
    name: 'bgdlx',
    type: 'Select',
    defaultValue: '1',
    onChange: 'handleOnChangeBgd',
    op: 'zdy',
    list: [
      { label: '按18位报关单开票', value: '1', },
      { label: '按21位报关单开票', value: '2' },
    ],
  },
  // CASE 2: DatePicker with onChange (whitespace before colon), no list, item-level label must be preserved
  {
    label: '核销周期',
    name: 'hxzq',
    type: 'DatePicker',
    range: true,
    onChange : 'handleOnChangeHxzq',
  },
  // CASE 3: Plain Input — no list, no onChange
  { label: '手（账）册号', name: 'bah', type: 'Input', width: '3w', searchButton: true },
  // CASE 4: Select with multi-item list, no onChange — list labels must change, item has no onChange
  {
    name: 'fplx',
    type: 'Select',
    list: [
      { label: '全部', value: '0' },
      { label: '已开票', value: '1' },
      { label: '未开票', value: '2' },
    ],
  },
];

// CASE 5: Fully commented-out block — rule must skip
// myConfig.grid_filter_quick_dead = [
//   {
//     name: 'x',
//     type: 'Select',
//     onChange: 'shouldStayUntouched',
//     list: [
//       { label: '不转换', value: '1' },
//     ],
//   },
// ];