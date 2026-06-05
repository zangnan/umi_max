import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: combo 测试 - 综合重命名+删除+嵌套+import
 */
const monthConfig: any = {};

monthConfig.module_key = 'CX_SAAS_MDT_TUISHUIJIHUA';
monthConfig.grid_click_checked = '1';
monthConfig.toolbar_show_grid_checked_num = false;
monthConfig.customer_toolbar = [
  { name: '新增', func: 'monthAdd' },
  { name: '修改', func: 'monthModify' },
];
monthConfig.layout_type = 'tz';

monthConfig.grid_columns = [
  { title: '年月', dataIndex: 'tjqDm' },
  { title: '金额', dataIndex: 'jhtse' },
];

monthConfig.filter_items = [
  { name: 'sbny', label: '申报年月', type: 'Input' },
];

monthConfig.toolbar_default = {
  add: true,
  edit: true,
  download: true,
  delete: false,
};

monthConfig.handle_columns = [];
export default monthConfig;
