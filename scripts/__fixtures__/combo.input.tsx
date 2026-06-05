/**
 * title: combo 测试 - 综合重命名+删除+嵌套+import
 */
const monthConfig: any = {};

monthConfig.unit_key = 'CX_SAAS_MDT_TUISHUIJIHUA';
monthConfig.click_checked = '1';
monthConfig.grid_show_data_num = false;
monthConfig.costomer_toobar = [
  { name: '新增', func: 'monthAdd' },
  { name: '修改', func: 'monthModify' },
];
monthConfig.layout_type = 'tz';

monthConfig.grid_columns = [
  { title: '年月', dataIndex: 'tjqDm' },
  { title: '金额', dataIndex: 'jhtse' },
];

monthConfig.wm_grid_columns = [
  { title: 'WM', dataIndex: 'wm' },
];

monthConfig.filter_items = [
  { name: 'sbny', label: '申报年月', type: 'Input' },
];

monthConfig.toolbar_default = {
  add: true,
  edit: true,
  tssb_download: true,
  delete: false,
};

export default monthConfig;
