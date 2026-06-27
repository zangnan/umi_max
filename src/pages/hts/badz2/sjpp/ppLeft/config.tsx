import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 
 */
const unitConfig: any = {};

// 配置项
unitConfig.grid_title = '';
unitConfig.api_grid_query = `/yw/badze/sjpp/queryYwppMainData`;   // api 列表查询
unitConfig.module_key = 'BADZ_SJPP_LEFT';                                               // 业务单元key，对应后端接口
unitConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
unitConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
// unitConfig.grid_scroll_x = '1450px';
unitConfig.grid_selection_type = false;                                               //复选框隐藏
unitConfig.toolbar_show_grid_checked_num = false;                                                 // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.grid_show_serial_number = false;                                            // 是否显示序号，可选，默认不显示


// 配置列表列
unitConfig.grid_columns = [
  { title: '所属期', dataIndex: 'ssq', width: 80 },
  { title: '批次', dataIndex: 'sbpc', width: 50 },
  { title: '业务类型', dataIndex: 'lcswsxmc', width: 130, ellipsis: true },
  { title: '备案方式', dataIndex: 'ppgzDm', width: 130, codeTable: 'code_static_badz_ppgz_dm:01' , ellipsis: true,filter: {
    type: 'Select',
    codeTable: 'code_static_badz_ppgz_dm:01'
  }},
  { title: '报关单/代理证明（张）', dataIndex: 'bgdfs', width: 180 , ellipsis: true},
  { title: '单证合计（份）', dataIndex: 'badzfs', width: 120, ellipsis: true }
];

// 配置项：列表筛选项
unitConfig.grid_filter_quick = [
  { name: 'ssq', label: '所属期', type: 'Input' },
  { name: 'sbpc', label: '批次', type: 'Input', searchButton: true }
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
  { name: '自动匹配', key: 'badzzdpp', func: 'badzZdpp' },
  { name: '解除匹配', key: 'badzjcpp', func: 'badzJcpp' },
  
];
export default unitConfig;
