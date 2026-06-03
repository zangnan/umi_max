/**
 * title: 智能配单明细-数据详情
 * author: yxy
 */
const config: any = {};

// 配置项
// config.grid_api_grid_query = `${API_URL_BASE}/yw/mts/znpd/qrpd/queryRightFpPage`;
config.unit_key = 'MTS_ZNPDMX_CKBGDMX';
config.grid_show_serial_number = false;                                           // 是否显示序号，可选
config.grid_show_data_num = false;
config.show_toolbar = false;                                                       // 是否开启工具栏，默认true开启
config.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
config.layout_type = 'modal';                                                     // 页面类型，默认default 可选 default modal tabs
config.grid_selection_type = false;                                               // 列表首选项类别，默认 checkbox，可选 false radio checkbox

// 配置项：列表列
config.grid_columns = [
  { title: '进货凭证号', dataIndex: 'jhpzh', width: 180, fixed: 'left', ellipsis: true, sorter: true,},
  { title: '发票行号', dataIndex: 'hh', width: 80,},
  { title: '开票日期', dataIndex: 'kprq', width: 140, render: { type: 'date', format: 'yyyy-MM-DD' }},
  { title: '销方纳税人识别号', dataIndex: 'xhfnsrsbh', width: 200},
  { title: '进货数量', dataIndex: 'bcsl', width: 140,align: 'right', render: { type: 'number', format: '0,0.00000' }},
  { title: '进货金额', dataIndex: 'bcje', width: 140,align: 'right', render: { type: 'number', format: '0,0.00' }},
];


// 配置项：工具栏
config.toolbar_default = {
  setting: false,
  download: false,
  reload:false,
};

// 配置项：列表操作列
config.grid_handle_columns_default = {
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
};

// 配置项：自定义工具栏
config.costomer_toobar= [
];

export default config;