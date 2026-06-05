/**
 * title: default-nodes-and-xhcp 测试 - 验证 r12 默认节点 + 序号重排
 */
import CONSTANTS from '@/components/DDAssist/constants';
const myConfig: any = {};

myConfig.module_key = 'DEFAULT_NODES_XHCP_TEST';
myConfig.layout_type = 'default';

myConfig.grid_columns = [
  { title: '名称', dataIndex: 'mc', width: 200 },
];

myConfig.toolbar_default = {
  add: true,
  edit: true,
  delete: true,
  setting: true,
  reload: true,
  full: true,
  ckts_order: 4,
};
