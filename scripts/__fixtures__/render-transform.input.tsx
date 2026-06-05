/**
 * title: render-transform 测试 - 验证 r7 render 函数形式自动转换
 */
import myUtil from '@/pages/common/myUtil';
import { someOther } from 'somewhere';
const myConfig: any = {};

myConfig.module_key = 'RENDER_TRANSFORM_TEST';
myConfig.layout_type = 'tz';

myConfig.grid_columns = [
  { title: '金额（元）', dataIndex: 'je', width: 120, align: 'right', sum: true, render: (text: any) => (myUtil.text.formatNum(text, '0,0.00')) },
  { title: '数量', dataIndex: 'sl', width: 100, align: 'right', sum: true, render: (text: any) => (myUtil.text.formatNum(text, '0,0')) },
  { title: '百分比', dataIndex: 'bfb', width: 100, align: 'right', render: (text: any) => (myUtil.text.formatNum(text, '0.00%')) },
  { title: '日期', dataIndex: 'rq', width: 150, align: 'center', render: { type: 'date', format: 'yyyy-MM-DD' } },
  { title: '备注', dataIndex: 'bz', width: 150, align: 'left' },
];
