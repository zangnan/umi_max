// 退税申报
const config: any = {};

config.unit_key = 'MTS_SJPP_PDRW_CKMX_QUERY_PAGE';                  // 业务单元key，对应后端接口
config.grid_row_key = 'uuid';
config.grid_show_serial_number = false;                      // 工具栏左侧是否显示数据条数及选中数，默认true显示
config.click_checked = '1';                                 // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
config.grid_selection_type = false;
config.grid_show_data_num = false;
config.layout_type = 'modal';
config.export_key = 'SAAS_TSSB_TZPD_PDRWQK_CKMX_DC'; // 采集导出key

config.grid_columns = [
  { title: '配单结果', dataIndex: 'pdbz', width: 90, fixed:'left',
    filter: {
    type: 'Select',
    codeTable: ['CODE_STATIC_TZPD_PDJG_DM', '01'],
  }, render: { func: 'renderCkpdrwmxPdjg' } },
  { title: '换汇成本', dataIndex: 'hhcb', width: 90,  render: { func: 'renderHhcb' },
    filter: {
    type: 'Select',
    codeTable: ['CODE_STATIC_TZPD_HHCB_DM', '01'],
  }},
  { title: '生成状态', dataIndex: 'scbz1', width: 90, codeTable: ['CODE_STATIC_TZPD_SCZT_DM', '01'],
    filter: {
    type: 'Select',
    codeTable: ['CODE_STATIC_TZPD_SCZT_DM', '01'],
  }},
  { title: '报关单号', dataIndex: 'bgdhgbh', width: 180, ellipsis: true},
  { title: '项号', dataIndex: 'hwxh', width: 50, ellipsis: true},
  { title: '出口发票号', dataIndex: 'ckfph', width: 260, ellipsis: true },
  { title: '发票代码', dataIndex: 'fpDm', width: 100, ellipsis: true },
  { title: '发票号码', dataIndex: 'fphm', width: 120, ellipsis: true },
  { title: '数电票号码', dataIndex: 'sdfphm', width: 180, ellipsis: true},
  { title: '行号', dataIndex: 'hh', width: 50, ellipsis: true},
  { title: '占用发票数量', dataIndex: 'bcsl', width: 100, ellipsis: true,render: { type: 'number', format: '0,0.00000' },align: 'right'},
  { title: '占用发票计税金额', dataIndex: 'bcje', width: 140, ellipsis: true, render: { type: 'number', format: '0,0.00' }},
  { title: '合同协议号', dataIndex: 'ckhth', width: 160, ellipsis: true},
  { title: '出口日期', dataIndex: 'ckrq1', width: 100,ellipsis: true, sorter: true, render: { type: 'date', format: 'yyyy-MM-DD' } },
  { title: '海关商品代码', dataIndex: 'hgckspDm', width: 120, ellipsis: true},
  { title: '海关商品名称', dataIndex: 'hgspmc', width: 160, ellipsis: true},
  { title: '法定单位', dataIndex: 'hgjldwmc', width: 80, ellipsis: true},
  { title: '可用法定数量', dataIndex: 'tssbsl', width: 110, ellipsis: true,render: { type: 'number', format: '0,0.00000' },align: 'right'},
  { title: '成交单位', dataIndex: 'sbjldwmc', width: 80, ellipsis: true},
  { title: '可用成交数量', dataIndex: 'bctssbsl', width: 110, ellipsis: true,render: { type: 'number', format: '0,0.00000' },align: 'right'},
  { title: '可用美元离岸价', dataIndex: 'tssbmylaj', width: 140, ellipsis: true, render: { type: 'number', format: '0,0.00' }},
  { title: '异常分类', dataIndex: 'pdsblxDm', width: 90, ellipsis: true, codeTable: ['code_dm_zxsb_tzpdsblx_mc', '01'],
    filter: {
    type: 'Select',
    codeTable: ['code_dm_zxsb_tzpdsblx_mc', '01'],
  }},
  { title: '异常说明', dataIndex: 'pdsblxsm', width: 160, ellipsis: true},
];

config.filter_items = [
  { name: 'bgdhgbh', label: '出口报关单号', type: 'Input' },
  { name: 'ckfph', label: '出口发票号', type: 'Input' },
  { name: 'fphm', label: '发票号码',type: 'Input'},
  { name: 'sdfphm', label: '数电票号码',type: 'Input'},
  { name: 'ckrq1', label: '出口日期', isLabel: true, range: true,type: 'DatePicker' },
];


// 配置项：工具栏
config.toolbar_default = {
  add: false,
  delete: false,
  tssb_download: true, // 是否显示导出按钮，默认关闭
  upload: false,
};

export default config;
