/**
 * title: 提运单
 */
const unitConfig: any = {};

// 配置项
unitConfig.unit_key = 'tyd';
unitConfig.grid_title = '提运单';
unitConfig.grid_api_grid_query = `${API_URL_BASE}/yw/badze/tyd/queryWppOrYppTydPageJc`;   // api 列表查询
unitConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
unitConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
unitConfig.grid_scroll_x = '1450px';
unitConfig.grid_selection_type = 'checkbox';                                               //复选框隐藏
unitConfig.grid_show_data_num = false;                                                 // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.layout_type = 'modal';
unitConfig.gridParams = {
  initSearchModal: [
    { property: 'dzlx', value: "04", op: 'al' },
  ],
}


// 配置列表列
unitConfig.grid_columns = [
  { title: '业务编号', dataIndex: 'ywbh', width: 160, ellipsis: true },
  { title: '提运单类型', dataIndex: 'tydlxDm', width: 120, codeTable: ['code_static_badz_tydlx_dm',  '01'], ellipsis: true },
  { title: '提运单号码', dataIndex: 'tydhm', width: 120, ellipsis: true },
  { title: '箱号', dataIndex: 'xh', width: 120, ellipsis: true },
  { title: '数据来源', dataIndex: 'sjlyDm', width: 120, codeTable: ['code_static_badz_sjly_dm',  '01'] , ellipsis: true},
  { title: '目的地', dataIndex: 'mdd', width: 140 , ellipsis: true},
  { title: '毛重量', dataIndex: 'mzl', width: 150 , ellipsis: true},
  { title: '签发日期', dataIndex: 'qfrqhdd', width: 115, render: { type: 'date', format: 'yyyy-MM-DD' }, ellipsis: true },
  { title: '匹配方式', dataIndex: 'ppfsDm', width: 120, codeTable: ['code_static_badz_ppfs_dm',  '01'] , ellipsis: true,filter: {
    type: 'Select',
    codeTable: ['code_static_badz_ppfs_dm', '01']
  }},
  { title: '商品信息', dataIndex: 'hwpmdwjsl', width: 160, fixed: 'right', render: { func: 'renderSpmcjsl' }, ellipsis: true },
];

// 配置项：列表筛选项
unitConfig.filter_items = [
  { name: 'ywbh', label: '业务编号', type: 'Input' },
  { name: 'tydlxDm', label: '提运单类型', type: 'Select', showSearch: true, codeTable: ['code_static_badz_tydlx_dm',  '01'] },
  { name: 'tydhm', label: '提运单号码', type: 'Input' },
  { name: 'sjlyDm', label: '数据来源', type: 'Select', showSearch: true, codeTable: ['code_static_badz_sjly_dm',  '01'] },
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
// 配置项：自定义工具栏
unitConfig.costomer_toobar = [
];

// 配置项：自定义操作列
unitConfig.handle_columns = [
  { name: '预览', key: 'yl', func: 'handleColumnsYl', display: 'ylDisplay' },
];
export default unitConfig;
