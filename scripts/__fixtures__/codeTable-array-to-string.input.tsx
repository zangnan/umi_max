/**
 * title: codeTable-array-to-string 测试 - 验证 r15 codeTable 数组 → 字符串 转换
 */
import CONSTANTS from '@/components/DDAssist/constants';
const myConfig: any = {};

myConfig.module_key = 'CODETABLE_R15_TEST';
myConfig.layout_type = 'default';

myConfig.filter_items = [
  { name: 'tzsxbz', label: '台账数据', type: 'Select', codeTable: ['CODE_STATIC_SJGL_TZSJ', '01'] },
  { name: 'ywlx', label: '业务类型', type: 'Select', codeTable: ['code_dm_ckts_cktmsywlx', '04'] },
  { name: 'plainInput', label: '普通输入', type: 'Input' },
];

myConfig.grid_columns = [
  { title: '业务类型代码', dataIndex: 'ywlxdm', codeTable: ['code_dm_ckts_cktmsywlx', '04'], width: 130 },
  { title: '红字冲减', dataIndex: 'hzcjyyDm', codeTable: ["code_dm_ckts_hzcjyy", "01"], width: 180 },
  { title: '普通列', dataIndex: 'mc', width: 180 },
];

myConfig.grid_columns_tj = [
  { title: '业务类型', dataIndex: 'ywlx', codeTable: ['code_dm_ckts_cktmsywlx', '04'], width: 130 },
];

myConfig.form_items = [
  { label: '业务类型', name: 'ywlx', type: 'Select', codeTable: ['code_dm_ckts_cktmsywlx', '04'] },
  { label: '币别', name: 'cjhbzmDm', type: 'AutoComplete', codeTable: ['url_gy_hbhl', '01'] },
  { label: '名称', name: 'mc', type: 'Input' },
];
