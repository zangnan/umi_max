const unitConfig: any = {};

unitConfig.unit_key = 'CX_SAAS_QXGL_CDFZGL';                                         // 业务单元key，对应后端接口
// api 列表查询
unitConfig.grid_show_serial_number = false;                                           // 是否显示序号，可选
unitConfig.click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
unitConfig.grid_scroll_x = '1100px';                                                   // 默认700px
unitConfig.grid_row_key = 'fzuuid';
unitConfig.layout_type = 'modal';
unitConfig.module_type = 'sjbb';

unitConfig.filter_items = [
  {name: 'fzmc', label: '分组名称', type: 'Input'},
];

unitConfig.grid_columns = [
  {title: '分组UUID', dataIndex: 'fzuuid', width: 200, align: 'left', ellipsis: true},
  {title: '分组名称', dataIndex: 'fzmc', width: 200, align: 'left', ellipsis: true,},
  {title: '关联菜单', dataIndex: 'cdmcs', width: 500},
];


// 配置项：自定义工具栏
unitConfig.costomer_toobar = [
  {name: '关联菜单', key: 'glcdfzcd', func: 'glcd'},
  {name: '新建', key: 'addcdfz', func: 'add'},
  {name: '修改', key: 'editcdfz', func: 'edit'},
  {name: '删除', key: 'delcdfz', func: 'del'},
];


unitConfig.gridParams = {
  // initSearchModal: [
  //   { type: 1, property: "qxlx", value: '2', op: "zdy" },
  // ],
}

export default unitConfig;
