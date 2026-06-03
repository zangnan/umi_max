/**
 * title: 备案单证装订成册
 */
const unitConfig: any = {};

// 配置项
unitConfig.grid_title = '备案单证装订成册';
unitConfig.grid_api_grid_query = `${API_URL_BASE}/yw/badze/zdcc/queryZdccPage`;   // api 列表查询
unitConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
unitConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
unitConfig.grid_scroll_x = '1450px';
unitConfig.grid_selection_type = 'checkbox';                                               //复选框隐藏
unitConfig.grid_show_data_num = false;                                                 // 工具栏左侧是否显示数据条数及选中数，默认true显示


// 配置列表列
unitConfig.grid_columns = [
  { title: '所属期', dataIndex: 'ssq', width: 120 },
  { title: '批次', dataIndex: 'sbpc', width: 120 },
  { title: '流程税务事项名称', dataIndex: 'lcswsxmc', width: 140, ellipsis: true },
  { title: '是否装订成册', dataIndex: 'sfzdcc', width: 100, align: 'center',render: { 
      icon: [
        { value: 'Y', icon: 'CheckOutlined', color: 'success', isShowText: false },
        { value: 'N', icon: 'CloseOutlined', color: 'error', isShowText: false },
        { value: '', icon: 'CloseOutlined', color: 'error', isShowText: false },
      ]
    }
  },
  { title: '装订时间', dataIndex: 'bawcsj', width: 140, render: { type: 'date', format: 'yyyy-MM-DD HH:mm:ss' } },
  { title: '备案撤销时间', dataIndex: 'bachsj', width: 140, render: { type: 'date', format: 'yyyy-MM-DD HH:mm:ss' } },
  { title: '备案撤销次数', dataIndex: 'bachcs', width: 80, align: 'right' },
];

// 配置项：列表筛选项
unitConfig.filter_items = [
  { name: 'ssq', label: '所属期', type: 'Input' },
  { name: 'sbpc', label: '批次', type: 'Input' },
  { name: 'sfzdcc', label: '是否装订成册', type: 'Select', showSearch: true, codeTable: ['code_static_badz_sfzdcc_dm',  '01'] },
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
  { name: '装订成册备案', key: 'zdccba', func: 'costomerToobarZdccba' },
  { name: '撤销备案', key: 'cxba', func: 'costomerToobarCxba' },
];

// 配置项：自定义操作列
unitConfig.handle_columns = [
  { name: '查看详情', key: 'ckxq', func: 'handleColumnsCkxq' },
];
export default unitConfig;
