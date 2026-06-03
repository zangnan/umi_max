/**
 * title: 其他单证
 */
const unitConfig: any = {};

// 配置项
unitConfig.unit_key = 'qtdz';
unitConfig.grid_title = '其他单证';
unitConfig.grid_api_grid_query = `${API_URL_BASE}/yw/badze/qtdz/queryWppOrYppQtdzPageJc`;   // api 列表查询
unitConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
unitConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
unitConfig.grid_scroll_x = '1450px';
unitConfig.grid_selection_type = 'checkbox';                                               //复选框隐藏
unitConfig.grid_show_data_num = false;                                                 // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.layout_type = 'modal';
unitConfig.gridParams = {
  initSearchModal: [
    { property: 'dzlx', value: "08", op: 'al' },
  ],
}


// 配置列表列
unitConfig.grid_columns = [
  { title: '业务编号', dataIndex: 'ywbh', width: 160, ellipsis: true },
  { title: '单证类型', dataIndex: 'qtdzlx', width: 120, codeTable: ['url_badz_qtdz_dzlx',  '01'] , ellipsis: true,filter: {
    type: 'Select',
    codeTable: ['url_badz_qtdz_dzlx', '01']
  } },
  { title: '单证编号', dataIndex: 'dzbh', width: 120 },
  { title: '数据来源', dataIndex: 'sjlyDm', width: 120, codeTable: ['code_static_badz_sjly_dm',  '01'] , ellipsis: true,filter: {
    type: 'Select',
    codeTable: ['code_static_badz_sjly_dm', '01']
  }},
  { title: '文件名称', dataIndex: 'wjmc', width: 120, ellipsis: true },
  { title: '上传时间', dataIndex: 'scsj', width: 115, render: { type: 'date', format: 'yyyy-MM-DD' }, ellipsis: true },
  { title: '匹配方式', dataIndex: 'ppfsDm', width: 120, codeTable: ['code_static_badz_ppfs_dm',  '01'] , ellipsis: true,filter: {
    type: 'Select',
    codeTable: ['code_static_badz_ppfs_dm', '01']
  }},
];

// 配置项：列表筛选项
unitConfig.filter_items = [
  // { name: 'sjlyDm', label: '数据来源', type: 'Select', showSearch: true, codeTable: ['code_static_badz_sjly_dm',  '01'] },
  { name: 'ywbh', label: '业务编号', type: 'Input' },
  { name: 'sfscfj', label: '是否上传附件', type: 'Select', showSearch: true, codeTable: ['code_static_badz_sfscfj_dm',  '01'] },
  { name: 'wjmc', label: '文件名称', type: 'Input' },
  { name: 'scsj', label: '上传时间', type: 'DatePicker', range: true, format: 'YYYY-MM-DD' },
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
