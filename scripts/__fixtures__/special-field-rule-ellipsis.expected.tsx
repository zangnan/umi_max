import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: special-field-rule-ellipsis 测试 - 验证 r11 规则 1
 */
const myConfig: any = {};
myConfig.module_key = 'SPECIAL_FIELD_RULE_TEST';
myConfig.layout_type = 'default';
myConfig.grid_columns = [
  { title: '业务类型代码', dataIndex: 'ywlxdm1', width: 130, ellipsis: true },
  { title: '业务类型代码', dataIndex: 'ywlxdm2', width: 130, ellipsis: true },
  { title: '业务类型名称', dataIndex: 'ywlxmc', width: 180 },
  { title: '业务类型代码', dataIndex: 'ywlxdm3', width: 130, align: 'left', ellipsis: true },
];
myConfig.grid_columns_tj = [
  { title: '业务类型代码', dataIndex: 'tj_ywlxdm', width: 130 },
];
myConfig.customer_toolbar = [];
myConfig.handle_columns = [];
