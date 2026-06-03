/**
 * title: 报关单数据
 */
const unitConfig: any = {};

// 配置项
unitConfig.grid_api_grid_query = `${API_URL_BASE}/hx/ty/crud/queryPager/MBCX_DM_CKTS_CKTMSYWLX/05`;        // api 列表查询
unitConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
unitConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
unitConfig.grid_scroll_x = '1450px';
unitConfig.grid_selection_type = false;                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.grid_show_serial_number = true;                      // 是否显示序号，默认不显示


// 配置列表列
unitConfig.grid_columns = [
  { title: '业务类型代码', dataIndex: 'cktmsywlxDm', fixed: 'left', width: 180},
  { title: '业务类型名称', dataIndex: 'cktmsywlxmc', width: 300, ellipsis: true  },
  { title: '是否免抵退', dataIndex: 'mdtbz', width: 180, codeTable: ['code_static_yes_no',  '01'] },
  { title: '是否免退税', dataIndex: 'mtsbz', width: 180, codeTable: ['code_static_yes_no',  '01'] },
  { title: '备注', dataIndex: 'bz', ellipsis: true },

];

// 配置项：列表筛选项
unitConfig.filter_items = [
  { name: 'cktmsywlxDm', label: '业务类型代码', type: 'Input' },
  { name: 'cktmsywlxmc', label: '业务类型名称', type: 'Input' },
  { name: 'mdtbz', label: '是否免抵退', type: 'Select' , codeTable: ['code_static_yes_no', '01'] },
  { name: 'mtsbz', label: '是否免退税', type: 'Select' , codeTable: ['code_static_yes_no', '01'] },
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
  download: false,
  full: true,
  reload: true,
  ckts_download: false,                   // 是否显示导出，默认关闭
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
};

export default unitConfig;
