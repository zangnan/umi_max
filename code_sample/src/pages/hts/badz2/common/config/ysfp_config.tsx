/**
 * title: 运输发票
 */
const unitConfig: any = {};

// 配置项
unitConfig.unit_key = 'ysfp';
unitConfig.grid_title = '运输发票';
unitConfig.grid_api_grid_query = `${API_URL_BASE}/yw/badze/ysfp/queryWppOrYppYsfpPageJc`;   // api 列表查询
unitConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
unitConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
unitConfig.grid_scroll_x = '1450px';
unitConfig.grid_selection_type = 'checkbox';                                               //复选框隐藏
unitConfig.grid_show_data_num = false;                                                 // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.layout_type = 'modal';
unitConfig.gridParams = {
  initSearchModal: [
    { property: 'dzlx', value: "05", op: 'al' },
  ],
}


// 配置列表列
unitConfig.grid_columns = [
  { title: '业务编号', dataIndex: 'ywbh', width: 160, ellipsis: true },
  { title: '业务类型', dataIndex: 'fplxDm', width: 120, codeTable: ['code_static_badz_fplx_dm',  '01'] , ellipsis: true,},
  { title: '发票号码', dataIndex: 'fphm', width: 120 , ellipsis: true},
  { title: '发票代码', dataIndex: 'fpDm', width: 120 , ellipsis: true},
  { title: '开票日期', dataIndex: 'kprq', width: 120, render: { type: 'date', format: 'yyyy-MM-DD' }, ellipsis: true},
  { title: '购买方名称', dataIndex: 'ghfmc', width: 150, ellipsis: true },
  { title: '购买方税号', dataIndex: 'gfnsrsbh', width: 150 , ellipsis: true},
  { title: '销货方名称', dataIndex: 'xhfmc', width: 150, ellipsis: true },
  { title: '销货方税号', dataIndex: 'xfnsrsbh', width: 150 , ellipsis: true},
  { title: '价税合计（金额）', dataIndex: 'jshj', width: 130, align: 'right', render: { type: 'number', format: '0,0.00' } , ellipsis: true},
  { title: '数据来源', dataIndex: 'sjlyDm', width: 120, codeTable: ['code_static_badz_sjly_dm',  '01'] , ellipsis: true,filter: {
    type: 'Select',
    codeTable: ['code_static_badz_sjly_dm', '01']
  }},
  { title: '匹配方式', dataIndex: 'ppfsDm', width: 120, codeTable: ['code_static_badz_ppfs_dm',  '01'] , ellipsis: true,filter: {
    type: 'Select',
    codeTable: ['code_static_badz_ppfs_dm', '01']
  }},
  { title: '货物或应税劳务、服务名称', dataIndex: 'hwhyslwfwmc', width: 200, fixed: 'right', render: { func: 'renderSpmcjsl' } },
];

// 配置项：列表筛选项
unitConfig.filter_items = [
  { name: 'ywbh', label: '业务编号', type: 'Input' },
  { name: 'fplxDm', label: '业务类型', type: 'Select', showSearch: true, codeTable: ['code_static_badz_fplx_dm',  '01'] },
  { name: 'fphm', label: '发票号码', type: 'Input' },
  { name: 'fpDm', label: '发票代码', type: 'Input' },
  { name: 'kprq', label: '开票日期', type: 'DatePicker', range: true, format: 'YYYY-MM-DD' },
  { name: 'xhfmc', label: '销货方名称', type: 'Input' },
  { name: 'xfnsrsbh', label: '销货方税号', type: 'Input' },
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
