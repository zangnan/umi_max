const unitConfig: any = {};


// unitConfig.pagination2 = false;
unitConfig.unit_key = 'CX_SAAS_QXGL_ZYGL';                                         // 业务单元key，对应后端接口
// api 列表查询
unitConfig.grid_show_serial_number = false;                                           // 是否显示序号，可选
unitConfig.click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
unitConfig.grid_scroll_x = '1100px';                                                   // 默认700px
unitConfig.grid_row_key = 'zyDm2';
unitConfig.layout_type = 'modal';
unitConfig.module_type = 'sjbb';


unitConfig.filter_items = [
  { name: 'zyDm2', label: '资源代码', type: 'Input' },
  { name: 'zylxDm', label: '资源类型', type: 'Select',codeTable: ['CODE_DM_GY_ZYLX', '01'] },
  { name: 'zymc2', label: '资源名称', type: 'Input' },
  { name: 'cdDm', label: '菜单代码', type: 'Input' },
  // { name: 'sfgl', label: '是否关联', type: 'Select',codeTable: ['code_static_yes_no', '02']  },
];

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '资源代码', dataIndex: 'zyDm2', width: 100, align: 'left', ellipsis: true, },
  { title: '资源类型', dataIndex: 'zylxDm', width: 100, align: 'left', codeTable: ['CODE_DM_GY_ZYLX', '01']  },
  { title: '资源名称', dataIndex: 'zymc2', width: 200, align: 'left', ellipsis: true, },
  { title: '序号', dataIndex: 'xh', width: 60, align: 'left', ellipsis: true, },
  { title: '菜单代码', dataIndex: 'cdDm', width: 140,align: 'left',  ellipsis: true,},
  { title: '菜单名称', dataIndex: 'cdmc', width: 100, align: 'left', ellipsis: true, },
];

// 配置项：自定义工具栏
unitConfig.costomer_toobar = [
  { name: '导出脚本', key: 'addqxz34', func: 'exportJb'},
  { name: '新建', key: 'addqxzgl', func: 'add'},
  { name: '修改', key: 'editqxzxg', func: 'edit'},
  { name: '删除', key: 'delqxzxg', func: 'del'},
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,
  reload: true,
  full: true,
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
};
unitConfig.gridParams = {
  initSearchModal: [
    { type: 1, property: "qxlx", value: '3', op: "zdy" },
  ],
}

export default unitConfig;