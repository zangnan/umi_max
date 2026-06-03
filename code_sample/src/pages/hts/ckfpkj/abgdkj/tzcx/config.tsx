/**
 * title: 进度查询
 * author: lincb
 */
const unitConfig: any = {};

// 配置项
unitConfig.unit_key = 'DZKABGD_ABGDKJ_TZCX_QUERY';                                         // 业务单元key，对应后端接口
unitConfig.export_key = 'DZKABGD_ABGDKJ_TZCX_DC';
unitConfig.grid_show_serial_number = false;                                           // 是否显示序号，可选
unitConfig.click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
unitConfig.grid_row_key = 'bgdhgbh';
unitConfig.batch_delete_key = 'bgdhgbhs';
unitConfig.module_type = 'QZ_type';
unitConfig.grid_api_import = `${API_URL_BASE}/yw/fpzs/bgdkp/tz/kptzdr`;
unitConfig.form_api_delete = `${API_URL_BASE}/yw/fpzs/bgdkp/tz/delete`;
unitConfig.gridParams = {
  initSearchModal: [
    { property: 'cdDm', value: "1203", op: 'zdy' }
  ]
};

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '报关单号', dataIndex: 'bgdhgbh', width: 180, ellipsis: true, },
  { title: '操作人', dataIndex: 'lrrxm', width: 180, ellipsis: true, },
  { title: '操作时间', dataIndex: 'lrrq', width: 145, render: { type: 'date', format: 'yyyy-MM-DD HH:mm:ss' } },
];

// 配置项：筛选_普通筛选 页面最上方 第一层筛选
unitConfig.filter_items = [
  { label: '报关单号', name: 'bgdhgbh', type: 'Input' },
  { label: '操作人', name: 'lrrxm', type: 'Input' },
  { label: '操作时间', name: 'lrrq', type: 'DatePicker', format: 'YYYY-MM-DD', range: true },
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  tssb_download: true,
	delete: true,
  setting: true,
  reload: true,
  full: true,
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