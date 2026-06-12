/**
 * title: form-item-readonly 测试 - 验证 r18 form_items 块内 readOnly: true → disabled: true
 */
import CONSTANTS from '@/components/DDAssist/constants';
const myConfig: any = {};

myConfig.module_key = 'FORM_ITEM_READONLY_TEST';
myConfig.layout_type = 'tz';
myConfig.form_items = [
  { label: '名称', name: 'mc', type: 'Input', readOnly: true },
  { label: '编码', name: 'bm', type: 'Input', readOnly: true, rules: [{ type: 'base_required' }] },
  { label: '金额', name: 'je', type: 'InputNumber', readOnly: true, format: '0,0.00' },
  { label: '备注', name: 'bz', type: 'TextArea' },
];
