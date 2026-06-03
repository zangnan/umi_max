/**
 * title: 备案单证_工作台_出口货物退（免）税单证备案概况
 */
const unitConfig: any = {};

// 配置项
unitConfig.grid_title = '出口货物退（免）税单证备案概况';
unitConfig.grid_api_grid_query = `${API_URL_BASE}/yw/badze/baqk/queryBadzHomePageSj`;   // api 列表查询
unitConfig.unit_key = 'CKFP_SJXZ_QUERY_BGD_DATA';                                               // 业务单元key，对应后端接口
unitConfig.grid_row_key = ['ssq', 'sbpc', 'lcswsxmc'];                                                     // 列表主键，默认uuid
unitConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
unitConfig.grid_scroll_x = '1450px';
unitConfig.grid_selection_type = false;                                               //复选框隐藏
unitConfig.grid_show_data_num = false;                                                 // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.grid_show_serial_number = true;                                           // 是否显示序号，可选，默认不显示


// 配置列表列
unitConfig.grid_columns = [
  { title: '所属期', dataIndex: 'ssq', width: 80 },
  { title: '批次', dataIndex: 'sbpc', width: 80 },
  { title: '业务类型', dataIndex: 'lcswsxmc', width: 150, ellipsis: true },
  { title: '纸质备案进度', dataIndex: 'zzbaBz', align: 'center', width: 60, render: { 
      icon: [
        { value: 'Y', icon: 'CheckOutlined', color: 'success', isShowText: false },
        { value: 'N', icon: 'CloseOutlined', color: 'error', isShowText: false },
        { value: '', icon: 'CloseOutlined', color: 'error', isShowText: false },
      ]
    }
  },
  { title: '电子备案进度', dataIndex: 'dzbawcbz', align: 'center', width: 60, render: { 
      icon: [
        { value: 'Y', icon: 'CheckOutlined', color: 'success', isShowText: false },
        { value: 'N', icon: 'CloseOutlined', color: 'error', isShowText: false },
        { value: '', icon: 'CloseOutlined', color: 'error', isShowText: false },
      ]
    }
  },
  { title: '电子备案单证份数', dataIndex: 'badzfs', width: 80, align: 'right' },
  { title: '备案单证目录', dataIndex: 'badzml', width: 100, render: { func: 'renderBadzml' } },
  { title: '确认备案方式', dataIndex: 'qrbafs', width: 150, render: { func: 'renderQrbafs' } }
];

// 配置项：列表筛选项
unitConfig.filter_items = [
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
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
];

export default unitConfig;
