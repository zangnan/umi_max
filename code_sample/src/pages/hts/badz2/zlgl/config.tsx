/**
 * title: 资料管理
 */
const unitConfig: any = {};

// 配置项
unitConfig.grid_title = '';
unitConfig.grid_api_grid_query = `${API_URL_BASE}/yw/badze/zdcc/queryZdccPage`;   // api 列表查询
unitConfig.unit_key = 'BADZ_SJPP_ZLHL';                                               // 业务单元key，对应后端接口
unitConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
unitConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
unitConfig.grid_selection_type = false;                                               //复选框隐藏
unitConfig.grid_show_data_num = false;                                                 // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.grid_scroll_x = '400px';

unitConfig.gridParams = {
  initSearchModal: [
    { property: 'sfzdcc', value: 'Y', op: 'al' },
    { property: 'gdzlkBz', value: 'Y', op: 'al' }
  ],
}


// 配置列表列
unitConfig.grid_columns = [
  { title: '所属期', dataIndex: 'ssq', width: 90 },
  { title: '批次', dataIndex: 'sbpc', width: 90 },
  { title: '流程税务事项名称', dataIndex: 'lcswsxmc', ellipsis: true },
];

// 配置项：列表筛选项
unitConfig.filter_items = [
  { name: 'ssq', label: '所属期', type: 'Input' },
  { name: 'sbpc', label: '批次', type: 'Input' }
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  add: false,
  edit: false,
  delete: false,
  upload: false,
  setting: true,
  full: true,
  reload: true,
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
};

// 配置项：自定义工具栏
unitConfig.costomer_toobar = [
  { name: '资料下载', key: 'zlxz', func: 'zlglZlxz' },
];
export default unitConfig;
