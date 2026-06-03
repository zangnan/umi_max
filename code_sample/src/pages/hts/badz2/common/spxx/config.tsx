/**
 * title: 商品信息
 */
const unitConfig: any = {};

// 配置项
unitConfig.grid_title = '';
unitConfig.grid_api_grid_query = `${API_URL_BASE}/yw/badze/ckxsht/queryCkxshtSpxxPage`;   // api 列表查询
unitConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
unitConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
unitConfig.grid_scroll_x = '650px';
unitConfig.grid_selection_type = false;                                               //复选框隐藏
unitConfig.grid_show_data_num = true;                                                 // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.layout_type = 'modal';


// 配置列表列
unitConfig.grid_columns = [
  { title: '商品名称', dataIndex: 'spmc', width: 120 },
  { title: '数量', dataIndex: 'sl', width: 100, align: 'right' }
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  add: false,
  edit: false,
  delete: false,
  upload: false,
  setting: true,
  full: false,
  reload: true,
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
};
export default unitConfig;
