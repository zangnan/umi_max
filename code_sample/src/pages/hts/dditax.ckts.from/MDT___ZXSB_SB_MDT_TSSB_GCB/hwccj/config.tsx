const unitConfig: any = {};

unitConfig.unit_key = 'MDT_ZXSB_SB_MDT_HWCCJ_QUERY';          // 业务单元key，对应后端接口
unitConfig.page_id = 'MDT_ZXSB_SB_MDT_HWCCJ'; // 页面id
unitConfig.grid_title = '海外仓冲减'; // 列表标题，可选
unitConfig.form_title = '海外仓冲减'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.export_key1 = ''; // 采集导出key
unitConfig.export_key2 = ''; // 统计导出key
unitConfig.export_key3 = ''; // 申报结果查询导出key
unitConfig.grid_row_key = 'uuid'; // 列表主键，默认uuid
unitConfig.layout_type = 'modal'

// 配置列表列
unitConfig.grid_columns = [
  {title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left', ellipsis: true},
  {title: '申报批次', dataIndex: 'sbpc', align: 'left', width: 100, fixed: 'left', ellipsis: true},
  {title: '申报序号', dataIndex: 'sbxh', align: 'left', width: 100, fixed: 'left', ellipsis: true},
  {title: '预退税申报事项', dataIndex: 'ytslcswsxdm', align: 'left', width: 200, codeTable: ['code_dm_gy_lcswsx_mc', '02'], ellipsis: true},
  {title: '预退税申报年月', dataIndex: 'ytssbny', align: 'left', width: 110, ellipsis: true},
  /*{title: '预退税关联号', dataIndex: 'ytsglh', align: 'left', width: 200, ellipsis: true},
  {title: '预退税申报批次', dataIndex: 'ytssbpc', align: 'left', width: 110, ellipsis: true},*/
  {title: '预退税申报序号', dataIndex: 'ytssbxh', align: 'left', width: 110, ellipsis: true},
  {title: '出口货物报关单号', dataIndex: 'ckbgdh', align: 'left', width: 200, ellipsis: true},
  {title: '代理出口货物证明号码', dataIndex: 'dlckhwzmhm', align: 'left', width: 200, ellipsis: true},
  {title: '出口海外仓预退税核算类型代码', dataIndex: 'ckhwcytshslxDm', align: 'left', width: 220, codeTable: ['code_dm_ckts_ckhwcytshslx_mc', '01'], ellipsis: true},
];

// 筛选项
unitConfig.filter_items = [
  {name: 'ssq', label: '所属期', type: 'Input'},
  {name: 'sbpc', label: '申报批次', type: 'Input'},
  {name: 'ckbgdh', label: '报关单号', type: 'Input'},
  {name: 'dlckhwzmhm', label: '代理证明号', type: 'Input'},
];
unitConfig.gridParams = {
  initSearchModal: [
    /*{property: 'cdDm', value: "020999", op: 'zdy'}*/
  ]
};
// 表单项
unitConfig.form_items = [];

// 配置项：自定义工具栏
unitConfig.costomer_toobar = [
  {name: '预退税冲减', key: 'hwccj', func: 'hwccj'},
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  add: false,
  edit: false,
  delete: false,
  setting: true, // 是否显示设置按钮，默认关闭
  reload: true, // 是否显示刷新按钮，默认关闭
  full: true, // 是否显示全屏按钮，默认关闭
  ckts_download: false, // 是否显示导出按钮，默认关闭
  upload: false,  // 是否显示导入按钮，默认关闭
  ckts_sum: false, // 是否显示小计按钮，默认关闭
  ckts_order: false, // 是否显示序号重排(默认规则：选择排序)按钮，默认关闭
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                       	// 是否显示编辑链接，默认关闭
  delete: false,                     	// 是否显示删除链接，默认关闭
};

export default unitConfig;

