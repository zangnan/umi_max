/**
 * title: form-item-textarea 测试 - 验证 r14 form_items TextArea 项标准化
 */
import CONSTANTS from '@/components/DDAssist/constants';
const myConfig: any = {};

myConfig.module_key = 'FORM_ITEM_TEXTAREA_TEST';
myConfig.layout_type = 'default';
myConfig.grid_columns = [{ title: '名称', dataIndex: 'mc', width: 200 }];

myConfig.form_items = [
  { label: '备注', name: 'bz', type: 'TextArea', autoSize: { minRows: 2, maxRows: 2 }, layout: { label: { xs: 8 }, formItem: { xs: 16 } }, rules: [{ type: 'base_string', range: [0, 200] }] },
  { label: '说明', name: 'sm', type: 'Input', rules: [{ type: 'base_string', range: [0, 100] }] },
];
