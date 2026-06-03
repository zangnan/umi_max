/**
 * title: 关联关系
 */
const unitConfig: any = {};

// 配置项
unitConfig.grid_title = '';
unitConfig.grid_api_grid_query = `${API_URL_BASE}/yw/badze/gtgn/queryBadzGlgx`;   // api 列表查询
unitConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
unitConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
unitConfig.grid_scroll_x = '650px';
unitConfig.grid_selection_type = false;                                               //复选框隐藏
unitConfig.grid_show_data_num = true;                                                 // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.layout_type = 'modal';


// 配置列表列
unitConfig.grid_columns = [
  { title: '所属期', dataIndex: 'ssq', width: 100 },
  { title: '批次', dataIndex: 'sbpc', width: 100 },
  { title: '报关单号', dataIndex: 'bgdhgbh', width: 160, ellipsis: true },
  { title: '匹配方式', dataIndex: 'ppfsmc', width: 100 },
  { title: '是否装订成册', dataIndex: 'sfzdcc', align: 'center',  width: 100, render: { 
      icon: [
        { value: 'Y', icon: 'CheckOutlined', color: 'success', isShowText: false },
        { value: 'N', icon: 'CloseOutlined', color: 'error', isShowText: false },
        { value: '', icon: 'CloseOutlined', color: 'error', isShowText: false },
      ]
    }
  },
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
