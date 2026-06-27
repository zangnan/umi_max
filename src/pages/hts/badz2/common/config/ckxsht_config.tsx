import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 出口销售合同
 */
const unitConfig: any = {};

// 配置项
unitConfig.module_key = 'ckxsht';
unitConfig.grid_title = '出口销售合同';
unitConfig.api_grid_query = `/yw/badze/ckxsht/queryWppOrYppCkxshtPageJc`;   // api 列表查询
unitConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
unitConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
unitConfig.grid_scroll_x = '1450px';
unitConfig.grid_selection_type = 'checkbox';                                               //复选框隐藏
unitConfig.toolbar_show_grid_checked_num = false;                                                 // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.gridParams = {
  initSearchModal: [
    { property: 'dzlx', value: "01", op: 'al' },
  ],
}


// 配置列表列
unitConfig.grid_columns = [
  { title: '业务编号', dataIndex: 'ywbh', width: 160, ellipsis: true },
  { title: '合同编号', dataIndex: 'htbh', width: 120, ellipsis: true },
  { title: '外商名称', dataIndex: 'jfmc', width: 140, ellipsis: true },
  { title: '销售方名称', dataIndex: 'yfmc', width: 150, ellipsis: true },
  { title: '签订日期', dataIndex: 'qdrq', width: 115, render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: '币种', dataIndex: 'hbzmDm', align: 'left', width: 150, codeTable: 'code_dm_gy_hb:01' },
  { title: '合同金额', dataIndex: 'htje', width: 115, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '涉及不得申报出口退税条款', dataIndex: 'sjbdsbcktstk', width: 180, ellipsis: true },
  { title: '数据来源', dataIndex: 'sjlyDm', width: 120, codeTable: 'code_static_badz_sjly_dm:01' , ellipsis: true,filter: {
    type: 'Select',
    codeTable: 'code_static_badz_sjly_dm:01'
  }},
  { title: '匹配方式', dataIndex: 'ppfsDm', width: 120, codeTable: 'code_static_badz_ppfs_dm:01' , ellipsis: true,filter: {
    type: 'Select',
    codeTable: 'code_static_badz_ppfs_dm:01'
  }},
  { title: '商品信息', dataIndex: 'spmcjsl', width: 120, fixed: 'right', render: { func: 'renderSpmcjsl' } },
];

// 配置项：列表筛选项
unitConfig.filter_items = [
  { name: 'ywbh', label: '业务编号', type: 'Input' },
  { name: 'htbh', label: '合同编号', type: 'Input' },
  { name: 'jfmc', label: '外商名称', type: 'Input' },
  { name: 'qdrq', label: '签订日期', type: 'DatePicker', range: true, format: 'YYYY-MM-DD' },
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
unitConfig.customer_toolbar = [
];

// 配置项：自定义操作列
unitConfig.handle_columns = [
  { name: '预览', key: 'yl', func: 'handleColumnsYl', display: 'ylDisplay' },
];
export default unitConfig;
