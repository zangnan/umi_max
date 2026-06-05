/**
 * title: date-format-normalize 测试 - 验证 r8 日期格式归一化（yyyy → YYYY）
 */
import { baseValidator } from '@/utils/validators';
import myUtil from '@/pages/common/myUtil';
const myConfig: any = {};

myConfig.module_key = 'DATE_FORMAT_NORMALIZE_TEST';
myConfig.layout_type = 'tz';

myConfig.grid_columns = [
  { title: '录入时间', dataIndex: 'lrrq', width: 150, align: 'center', render: { type: 'date', format: 'yyyy-MM-DD HH:mm:ss' } },
  { title: '修改时间', dataIndex: 'xgrq', width: 150, align: 'center', render: { type: 'date', format: 'yyyy-MM-DD' } },
  { title: '日期（已正确）', dataIndex: 'rq', width: 150, align: 'center', render: { type: 'date', format: 'YYYY-MM-DD HH:mm:ss' } },
  { title: '日期（双引号）', dataIndex: 'rq2', width: 150, align: 'center', render: { type: 'date', format: "yyyy/MM/dd" } },
  { title: '金额', dataIndex: 'je', width: 120, align: 'right', sum: true, render: (text: any) => (myUtil.text.formatNum(text, '0,0.00')) },
];

myConfig.filter_items = [
  { name: 'nd', label: '年度', type: 'Input', rules: [{ required: true, message: '请输入年度' }, baseValidator.yyyy] },
  { name: 'yf', label: '年月', type: 'Input', rules: [{ required: true, message: '请输入年月' }, baseValidator.yyyyMM] },
];
