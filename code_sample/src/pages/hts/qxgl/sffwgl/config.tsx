const unitConfig: any = {};
unitConfig.unit_key = 'CX_SAAS_QXGL_SFFWGL';                                         // 业务单元key，对应后端接口
unitConfig.grid_show_serial_number = false;                                           // 是否显示序号，可选
unitConfig.click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
unitConfig.grid_scroll_x = '1100px';                                                   // 默认700px
unitConfig.grid_row_key = 'sffwDm';
unitConfig.layout_type = 'modal';
unitConfig.module_type = 'sjbb';

unitConfig.filter_items = [
  {name: 'sffwDm', label: '三方服务代码', type: 'Input'},
  {name: 'sffwmc', label: '三方服务名称', type: 'Input'},
];

unitConfig.grid_columns = [
  {title: '三方服务代码', dataIndex: 'sffwDm', width: 140, align: 'left', ellipsis: true},
  {title: '三方服务名称', dataIndex: 'sffwmc', width: 200, align: 'left', ellipsis: true,},
  {title: '试用月数', dataIndex: 'syys', width: 80, align: 'right'},
  {title: '正式月数', dataIndex: 'zsys', width: 80, align: 'right'},
  {title: '有效标志', dataIndex: 'yxbz', width: 80, codeTable: ['code_static_yes_no', '01']},
  {title: '选用标志', dataIndex: 'xybz', width: 80, codeTable: ['code_static_yes_no', '01']},
];


// 配置项：自定义工具栏
unitConfig.costomer_toobar = [
  {name: '新建', key: 'add', func: 'add'},
  {name: '修改', key: 'edit', func: 'edit'},
  {name: '删除', key: 'del', func: 'del'},
];

unitConfig.gridParams = {
  initSearchModal: [],
}

export default unitConfig;
