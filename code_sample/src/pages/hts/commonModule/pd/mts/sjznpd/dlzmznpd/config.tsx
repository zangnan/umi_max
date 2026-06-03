
const config: any = {};

config.grid_api_grid_query = `${API_URL_BASE}/yw/bszx/wbsj/dlckhwzm/queryDlckhwzmPage`; // api 列表查询
config.grid_row_key = 'uuid';
config.grid_show_serial_number = true;                      // 是否显示序号，默认不显示
config.grid_selection_type = false;                                               // 列表首选项类别，默认 checkbox，可选 false radio checkbox


config.grid_columns = [
  { title: '代理出口货物证明号码', dataIndex: 'dlckhwzmhm', width: 180, fixed: 'left', },
  { title: '委托（代理）出口合同号', dataIndex: 'wtdlckhth', width: 180, fixed: 'left', },
  { title: '出口报关单号', dataIndex: 'ckbgdh', width: 180, },
  { title: '出口商品代码', dataIndex: 'ckspDm', width: 120, },
  { title: '出口商品名称', dataIndex: 'ckspmc', width: 180,  ellipsis: true},
  { title: '出口日期', dataIndex: 'ckrq1', width: 120, render: { type: 'date', format: 'yyyy-MM-DD' } },
  { title: '监管方式代码', dataIndex: 'jgfsDm', width: 100, codeTable: ['code_dm_ckts_hgjgfs', '01'] },
  { title: '申报计量单位名称', dataIndex: 'sbjldwmc', width: 140, ellipsis: true},
  { title: '申报数量', dataIndex: 'sbsl1', width: 115, render: { type: 'number', format: '0,0.00000' },align: 'right',  },
	{ title: '海关计量单位名称', dataIndex: 'hgjldwmc', align: 'left', width: 160, ellipsis: true},
  { title: '出口数量', dataIndex: 'cksl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '第二计量单位名称', dataIndex: 'dejldwmc', width: 140, ellipsis: true },
  { title: '第二出口数量', dataIndex: 'decksl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '美元离岸价', dataIndex: 'mylaj', width: 100, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '人民币离岸价', dataIndex: 'rmblaj', width: 125, align: 'right', render: { type: 'number', format: '0,0.00' } },
	{ title: '货币字母代码', dataIndex: 'hbzmDm', align: 'left', width: 115, },
  { title: '原币金额', dataIndex: 'ybje', align: 'right', width: 140,  render: { type: 'number', format: '0,0.00' } },
  { title: '成交海关货币数字代码', dataIndex: 'cjhghbszDm', width: 160, ellipsis: true},
	{ title: '成交总价', dataIndex: 'cjzj', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
];
config.filter_items = [
  { name: 'ckrq1', label: '出口日期', isLabel: true, range: true,type: 'DatePicker' },
  { name: 'ckspDm', label: '出口商品代码',type: 'Input'},
  { name: 'ckbgdh', label: '出口报关单号', type: 'Input' },
  { name: 'dlckhwzmhm', label: '代理出口货物证明号码', type: 'Input' },

];
// 配置项：自定义工具栏
config.costomer_toobar = [
];
// 配置项：自定义操作列
config.handle_columns = [
  { name: '配单', func: 'handPdColumns' }
];
// 配置项：工具栏
config.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
};
export default config;