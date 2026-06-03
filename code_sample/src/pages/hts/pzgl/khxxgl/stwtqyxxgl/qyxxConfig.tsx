
/**
 * title: 受托/委托企业信息管理
 * author: zn
 */
const qyxxConfig: any = {};

// 配置项
qyxxConfig.unit_key = 'MBCX_CS_ZXSB_QYWTFPZXX';
qyxxConfig.page_id = 'mbcx_cs_zxsb_qywtfpzxx'; // 页面id
qyxxConfig.grid_title = '受托/委托企业信息管理'; // 列表标题，可选
qyxxConfig.form_title = '企业委托方信息管理'; // 表单标题，可选
qyxxConfig.grid_show_serial_number = true;                                            // 是否显示序号，可选，默认不显示
qyxxConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
qyxxConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
qyxxConfig.click_checked = '1';

// 配置列表列
qyxxConfig.grid_columns = [
  { title: '委托/受托方纳税人识别号', dataIndex: 'stfnsrsbh', width: 200, ellipsis: true, },
  { title: '委托/受托方海关企业代码', dataIndex: 'stfhgqydm', width: 200, ellipsis: true },
  { title: '委托/受托方纳税人名称', dataIndex: 'stfmc', width: 200, ellipsis: true },
  { title: '代理出口/进口协议号', dataIndex: 'wtdlckhth', ellipsis: true },
];

// 配置项：表单项
qyxxConfig.form_items = [
  { label: 'uuid', type: 'Hidden', name: 'uuid' },
  {
    label: '委托/受托方纳税人识别号', type: 'Input', name: 'stfnsrsbh', rules: [
      { type: 'base_type_number_english' },
      { func: 'stfnsrsbh01' },
    ],
    eventOnBlur: 'stfnsrsbh',
  },
  { label: '委托/受托方海关企业代码', type: 'Input', name: 'stfhgqydm' , rules: [
    { func: 'stfhgqydm01' }
  ]},
  {
    label: '委托/受托方纳税人名称', type: 'Input', name: 'stfmc', rules: [
      { type: 'base_required' },
      { type: 'base_string', range: 200 },
    ]
  },
  { label: '代理出口/进口协议号', type: 'Input', name: 'wtdlckhth', rules: [
    // { type: 'base_type_number_english' },
    { type: 'base_string', range: 60 },
  ], },
];


// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
qyxxConfig.grid_filter_quick = [
  { label: '委托/受托方纳税人识别号', name: 'stfnsrsbh', type: 'Input', width: '5w' },
  { label: '委托/受托方海关企业代码', name: 'stfhgqydm', type: 'Input', width: '5w', searchButton: true  },
];

// 配置项：工具栏
qyxxConfig.toolbar_default = {
  setting: true,
  add: true,
  edit: true, // 是否显示修改按钮，默认关闭
  delete: true,
  full: true,
  reload: true,
  upload: false,
  download: false,
};

// qyxxConfig.grid_handle_columns_default = {
//   edit: true
// }
// 配置项：自定义工具栏
// qyxxConfig.costomer_toobar = [
//   { name: '删除', func: 'delete' },
// ];

export default qyxxConfig;
