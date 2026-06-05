/**
 * title: toolbar-ckts-sum 测试 - 验证 r13 规则 3（ckts_sum → 小计）
 */
import CONSTANTS from '@/components/DDAssist/constants';
const myConfig: any = {};

myConfig.module_key = 'TOOLBAR_CKTS_SUM_TEST';
myConfig.layout_type = 'default';

myConfig.grid_columns = [
  { title: '名称', dataIndex: 'mc', width: 200 },
];

myConfig.toolbar_default = {
  add: true,
  edit: true,
  delete: true,
  ckts_order: 4,
  ckts_sum: true,
};
myConfig.customer_toolbar = [{ name: '序号重排', key: 'xhcp_4', func: 'handleXhcp', param: 4 },{ name: '小计', key: 'xj', func: 'handleXj' }];
myConfig.handle_columns = [];
