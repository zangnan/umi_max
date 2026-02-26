const unitConfig: any = {};

unitConfig.api_grid_query = `${API_URL_EXAMPLE}/dict/automatic/exp/bs/queryPager`;
// unitConfig.grid_selection_type = 'checkbox';
// unitConfig.grid_show_serial_number = true;

// 列表列的设置中，columns 或 grid_columns 均可，dataIndex 或 field 均可
let grid_columns =  [
  { title: '报关单号', dataIndex: 'ckbgdh', editor: 'input-editor', aggregation: [
    { aggregationType: 'NONE', showOnTop: true, formatFun() { return '汇总合计：'; } },
    { aggregationType: 'NONE', showOnTop: false, formatFun() { return '汇总最低：'; } },
    { aggregationType: 'NONE', showOnTop: false, formatFun() { return '汇总最高：'; } },
    { aggregationType: 'NONE', showOnTop: false, formatFun() { return '汇总平均：'; } },
  ] },
  { title: '项号', dataIndex: 'xh4', sorter: true },
  { title: '银行账号', dataIndex: 'yhzh', sorter: true },
  { title: '监管方式\n\n代码', dataIndex: 'jgfsDm2', sorter: true, editor: 'input-editor'},
  { title: '监管方式', dataIndex: 'jgfsDm', sorter: true },
  { title: '出口日期', dataIndex: 'ckrq1', sorter: true, render: { type: 'date', format: 'YYYY-MM-DD' }, editor: 'date-input-editor' },
  { title: '数据检查状态', dataIndex: 'cytgbz', sorter: true },
  { title: '审批状态', dataIndex: 'spzt', sorter: true },
  { title: '成交信息', dataIndex: 'cjxxGroup', columns: [
    { title: '成交方式', dataIndex: 'hgcjfsmc' },
    { title: '成交单位', dataIndex: 'hgjldwmc' },
    { title: '成交数量', dataIndex: 'cjsl1', render: { type: 'number', format: '0,0.00000' },
      aggregation: [ // 优先级高
        { aggregationType: 'SUM', showOnTop: true, formatFun(value: any) { return '数量合计:' + Math.round(value) + '元'; } },
        { aggregationType: 'MIN', showOnTop: false, formatFun(value: any) { return '最低数量:' + Math.round(value) + '元'; } },
        { aggregationType: 'MAX', showOnTop: false, formatFun(value: any) { return '最高数量:' + Math.round(value) + '元'; } },
        { aggregationType: 'AVG', showOnTop: false, formatFun(value: any, col: any, row: any, table: any) { return '平均:' + Math.round(value) + '元 (共计' + table.recordsCount + '条数据)'; } }
      ]
    },
    { title: '成交币制', dataIndex: 'cjhghbzmDm' },
    { title: '成交金额', dataIndex: 'cjzj', render: { type: 'number', format: '0,0.00' }, sum2: true, min2: true },
  ]},
  { title: '征免类型', dataIndex: 'zmlx' },
  { title: '申报业务', dataIndex: 'sbyw' },
  { title: '商品代码', dataIndex: 'ckspDm' },
  { title: '状态', dataIndex: 'spzt2' },
  { title: '调用耗时', dataIndex: 'usedTime' },
  { title: '商品名称', dataIndex: 'ckspmc' },
  { title: '海关商品名称', dataIndex: 'hgspmc' },
  { title: '出口合同号', dataIndex: 'ckhth' },
  { title: '出口合同号', dataIndex: 'ckhth', editor: 'textArea-editor' },
  { title: '征免类型', dataIndex: 'zmlx', editor: 'list-editor' },
  { title: '美元离岸价', dataIndex: 'mylaj', render: { type: 'number', format: '0,0.00' }, sum2: true },
  { title: '法定单位', dataIndex: 'dyjldwDm', codeTable: 'code_dm_ckts_hgjldw' },
  { title: '法定单位数量', dataIndex: 'cksl', render: { type: 'number', format: '0,0.0000' }, sum2: true, min2: true, max2: true, avg2: true },
  { title: '第二单位', dataIndex: 'dejldwDm', codeTable: 'code_dm_ckts_hgjldw' },
  { title: '第二单位数量', dataIndex: 'decksl', render: { type: 'number', format: '0,0.0000' } },
  // , fieldFormat(data, col, row, table) {
  //   return 'aaass::' + data.decksl
  // },},
  // { title: '第二单位数量', dataIndex: 'decksl' },
  // { title: '隐藏列', dataIndex: 'hiddenCol', width: 130, hidden: true },
];

// 配置项：vtable
let vtableConfig = {
  columns: grid_columns,
  allowFrozenColCount: 3, // 可选做冻结的前几列 默认 0
  frozenColCount: 2, // 初始冻结列数 默认 0
  rightFrozenColCount: 1,
  frozenRowCount: 3, // 冻结行数（包含表头） 默认表头行数
  bottomFrozenRowCount: 3,
  menu:{ contextMenuItems:['向下插入数据', '向下插入空行', '修改掉整行值', '修改值', '删除该行'], },
  // height: 600,
  height: 'calc(100vh - 115px)',
  heightMode: 'autoHeight', //  standard 标准模式 默认 | adaptive 自适应容器高度模式 |  autoHeight 自动行高模式
  autoWrapText: true,
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: true,                       // 是否显示编辑链接，默认关闭
  delete: true,                     // 是否显示删除链接，默认关闭
  detail: true,                     // 是否显示详情链接，默认关闭
};

// 配置项：自定义操作列
unitConfig.handle_columns = [
  { name: '测试1', key: 'cs11', func: 'handleColumns1' },
  { name: '测试2', key: 'cs12', func: 'handleColumns2' },
  { name: '测试3', key: 'cs13', func: 'handleColumns3' },
];

export default {
  ...unitConfig,
  ...vtableConfig,
};