const unitConfig: any = {};


// unitConfig.pagination2 = false;
unitConfig.unit_key = 'CX_SAAS_QXGL_QDGL';                                         // 业务单元key，对应后端接口
unitConfig.grid_api_grid_query = `${API_URL_BASE}/yw/dditSaas/qxqd/queryQxqd`;   // api 列表查询
// api 列表查询
unitConfig.grid_show_serial_number = false;                                           // 是否显示序号，可选
unitConfig.click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
unitConfig.grid_scroll_x = '1100px';                                                   // 默认700px
unitConfig.grid_row_key = 'qdDm';
unitConfig.layout_type = 'modal';
unitConfig.module_type = 'sjbb';

unitConfig.filter_items = [
  { name: 'qdDm', label: '渠道代码', type: 'Select', codeTable: ['CODE_QX_QD', '01']  },
  { name: 'qdmc', label: '渠道名称', type: 'Input' },
  // { name: 'sfgl', label: '是否关联', type: 'Select', codeTable: ['code_static_yes_no', '01'] },
];

unitConfig.grid_columns = [
  { title: '渠道代码', dataIndex: 'qdDm', width: 140, align: 'left', ellipsis: true },
  { title: '渠道名称', dataIndex: 'qdmc', width: 200, align: 'left', ellipsis: true, },
  { title: '授权方式', dataIndex: 'sqfsDm', width: 100, codeTable: ['CODE_DM_ZXSB_SQFS', '01'] },
  { title: '授权有效期起', dataIndex: 'tjrqqmc', width: 110  },
  { title: '授权有效期止', dataIndex: 'tjrqzmc', width: 110  },
  { title: '试用月数', dataIndex: 'syys', width: 80, align: 'right' },
  { title: '正式月数', dataIndex: 'zsys', width: 80, align: 'right' },
  { title: '用户默认权限组名称', dataIndex: 'yhmrQxzmc', width: 200, align: 'left', ellipsis: true, },
  { title: '企业默认权限组名称', dataIndex: 'qymrQxzmc', width: 200, align: 'left', ellipsis: true, },
  { title: '输出平台API标志', dataIndex: 'apijcbz', width: 130, codeTable: ['code_static_yes_no', '01'] },
  { title: '输出平台集成标志', dataIndex: 'ymjcbz', width: 130, codeTable: ['code_static_yes_no', '01'] },
  { title: '接入三方API标志', dataIndex: 'apijcdsfbz', width: 130, codeTable: ['code_static_yes_no', '01'] },
  { title: '接入三方集成标志', dataIndex: 'ymjcdsfbz', width: 130, codeTable: ['code_static_yes_no', '01'] },
  { title: '授权API服务到企业', dataIndex: 'apifwaqyjybz', width: 140, codeTable: ['code_static_yes_no', '01'] },
  { title: '三方服务自动授权标志', dataIndex: 'zdsqbz', width: 160, codeTable: ['code_static_yes_no', '01'] },
];


// 配置项：自定义工具栏
unitConfig.costomer_toobar = [
  { name: '导出字典', key: 'addqxz42', func: 'exportZd'},
  { name: '导出脚本', key: 'addqxz34', func: 'exportJb'},
  /*{ name: '授权', key: 'addqxz32', func: 'exportSq'},*/
  { name: '关联企业权限组', key: 'addqxz2', func: 'glqyqxz'},
  { name: '关联用户权限组', key: 'addqxz3', func: 'glqxz'},
  { name: '关联菜单', key: 'addqxzglqd', func: 'glcd'},
  { name: '新建', key: 'addqxzglqd', func: 'add'},
  { name: '修改', key: 'editqxzxgqd', func: 'edit'},
  { name: '删除', key: 'delqxzxgqd', func: 'del'},
];


unitConfig.gridParams = {
  initSearchModal: [
    { type: 1, property: "qxlx", value: '2', op: "zdy" },
  ],
}

export default unitConfig;
