import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 智能分析-进出口总额
 * author: yxy
 */
const jckzeConfig: any = {};

// 配置项
jckzeConfig.api_grid_query = `/hts/ckts/znfx/queryHtsZnfxJckzePage`;   // api 列表查询
jckzeConfig.grid_show_serial_number = true;                                           // 是否显示序号，可选
jckzeConfig.grid_click_checked = false;                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
jckzeConfig.toolbar_show_grid_checked_num = false;
jckzeConfig.show_toolbar = true;                                                       // 是否开启工具栏，默认true开启
jckzeConfig.layout_type = 'modal';                                                     // 页面类型，默认default 可选 default modal tabs
jckzeConfig.grid_selection_type = false;                                          // 列表首选项类别，默认 checkbox，可选 false radio checkbox

// 配置项：列表列
jckzeConfig.grid_columns = [
  { title: '进（出）口标识', dataIndex: 'jckbzDm', width: 100,fixed: 'left',codeTable: 'CODE_STATIC_JLJGHX_JCKBZ:01'},
  { title: '监管方式代码', dataIndex: 'jgfsDm', width: 130 },
  { title: '监管方式名称', dataIndex: 'jgfsmc', width: 160 },
  { title: '美元金额', dataIndex: 'myje', width: 110, align: 'right', render: { type: 'number', format: '0,0.00' }},
];

// 配置项：工具栏
jckzeConfig.toolbar_default = {
  setting: true,
  download: true,
  reload: true,
};

// 配置项：列表操作列
jckzeConfig.grid_handle_columns_default = {
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
};

jckzeConfig.customer_toolbar = [];
jckzeConfig.handle_columns = [];
export default jckzeConfig;