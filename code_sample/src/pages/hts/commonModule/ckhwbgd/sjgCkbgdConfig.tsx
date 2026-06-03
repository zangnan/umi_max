/**
 * title: 数据管理-出口报关单管理
 */
const ckbgdConfig: any = {};
// 配置列表列
ckbgdConfig.grid_columns = [
  { title: 'uuid', dataIndex: 'uuid', width: 180, sorter: true, fixed: 'left', hidden: true },
  { title: '报关单号', dataIndex: 'ckbgdh', width: 200, sorter: true, fixed: 'left', render: { func: 'renderBgdscmxbgdhSjgl' } },
  { title: '项号', dataIndex: 'xh4', width: 80},
  { title: '出口日期', dataIndex: 'ckrq1', width: 120, sorter: true, render: { type: 'date', format: 'yyyy-MM-DD' } },
  { title: '申报日期', dataIndex: 'hgckhwbgdsbrq', width: 120, sorter: true,  render: { type: 'date', format: 'yyyy-MM-DD' } },
  {
    title: '报关状态', dataIndex: 'bgsbztDm', width: 100, codeTable: ['CODE_DM_CKTS_HGBGSBZT', '01'], filter: { type: 'Select', codeTable: ['CODE_DM_CKTS_HGBGSBZT', '01'] }
  },
  {
    title: '退税类型', dataIndex: 'tsbz', width: 100, codeTable: ['code_static_ckbgd_tslx', '01'],
    filter: {
      type: 'Select',
      list: [
        { text: '征税', value: 'ZS' },
        { text: '免税', value: 'MS' },
        { text: '退税', value: 'TS' },
        { text: '仅退消费税', value: 'JTXFS' }
      ],
    }
  },
  {
    title: '开票状态', dataIndex: 'bgdkpzt', width: 100,
    render: { func: 'renderCkfpSjxzBgdKpzt' },
    filter: {
      type: 'Radio',
      list: [
        { text: '全部', value: '' },
        { text: '已开票', value: '1' },
        { text: '未开票', value: '2' }
      ],
    }
  },
  {
    title: '申报业务', dataIndex: 'sbyw', width: 100, render: { func: 'sbyw' }, codeTable: ['code_static_bgd_sbyw_dm', '04'],
    filter: {
      type: 'Select',
      codeTable: ['code_static_bgd_sbyw_dm', '04'],
    },
  },
  { title: '业务编号', dataIndex: 'ywbh', width: 150, ellipsis: true },
  { title: '出口发票号码', dataIndex: 'ckfph', width: 150, ellipsis: true },
  { title: '海关商品代码', dataIndex: 'hgckspDm', width: 120 },
  { title: '海关商品名称', dataIndex: 'hgspmc', width: 180, ellipsis: true },
  { title: '规格型号', dataIndex: 'ggxh', width: 180, ellipsis: true },
  { title: '出口商品代码', dataIndex: 'ckspDm', align: 'left', width: 120 },
  { title: '出口商品名称', dataIndex: 'ckspmc', align: 'left', width: 180, ellipsis: true },
  { title: '法定单位', dataIndex: 'hgjldwmc', width: 80, ellipsis: true },
  { title: '法定单位数量', dataIndex: 'cksl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '不退税法定数量', dataIndex: 'btssl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '退运法定数量', dataIndex: 'tysl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '第二单位', dataIndex: 'dejldwDm', width: 80, ellipsis: true, codeTable: ['code_dm_ckts_hgjldw', '01'] },
  { title: '第二单位数量', dataIndex: 'decksl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '成交单位', dataIndex: 'sbjldwmc', width: 120, ellipsis: true },
  { title: '成交数量', dataIndex: 'cjsl1', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '不退税成交数量', dataIndex: 'btsslsbsl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '退运成交数量', dataIndex: 'tyslsbsl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  {
    title: '成交方式', dataIndex: 'hgcjfsmc', width: 100, filter: {
      type: 'Select',
      codeTable: ['code_dm_ckts_hgcjfs_mc', '01'],
    },
  },
  {
    title: '成交币制', dataIndex: 'cjhghbzmDm', width: 90, filter: {
      type: 'Select',
      codeTable: ['CODE_DM_GY_HB', '01'],
      showType: '3'
    }
  },
  { title: '成交汇率', dataIndex: 'cjhbhl', width: 120, render: { type: 'number', format: '0,0.00000' } },
  { title: '成交金额', dataIndex: 'cjzj', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '原币离岸价', dataIndex: 'yblaj', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '美元离岸价', dataIndex: 'mylaj', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '美元汇率', dataIndex: 'myhl', width: 100, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '人民币离岸价', dataIndex: 'rmblaj', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '运费金额', dataIndex: 'yfszl', width: 140, align: 'right', render: { type: 'number', format: '0,0.000000' } },
  { title: '运费币制', dataIndex: 'yfhghbzmDm', width: 70, ellipsis: true },
  { title: '运费汇率', dataIndex: 'yfhl', width: 100, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '运费标志', dataIndex: 'yfjsfsDm', width: 100 },
  { title: '折算数量', dataIndex: 'yfzssl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '保费金额', dataIndex: 'bfszl', width: 140, align: 'right', render: { type: 'number', format: '0,0.000000' } },
  { title: '保费币制', dataIndex: 'bfhghbzmDm', width: 70, ellipsis: true },
  { title: '保费汇率', dataIndex: 'bfhl', width: 100, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '保费标志', dataIndex: 'bfjsfsDm', width: 100 },
  { title: '杂费金额', dataIndex: 'zfszl', width: 140, align: 'right', render: { type: 'number', format: '0,0.000000' } },
  { title: '杂费币制', dataIndex: 'zfhghbzmDm', width: 70, ellipsis: true },
  { title: '杂费汇率', dataIndex: 'zfhl', width: 100, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '杂费标志', dataIndex: 'zfjsfsDm', width: 100 },
  { title: '境外收货人名称', dataIndex: 'jwshrmc', width: 180, ellipsis: true },
  { title: '生产销售单位名称', dataIndex: 'hzdwmc', width: 180, ellipsis: true },
  { title: '监管方式代码', dataIndex: 'jgfsDm', width: 120 },
  { title: '监管方式名称', dataIndex: 'jgfsmc', width: 140, ellipsis: true},
  { title: '合同协议号', dataIndex: 'ckhth', width: 180, ellipsis: true },
  { title: '提运单号', dataIndex: 'tydh', width: 180, ellipsis: true },
  { title: '备案号', dataIndex: 'bah', width: 150, ellipsis: true },
  { title: '口岸代码', dataIndex: 'hggqkaDm', width: 140 },
  { title: '出口口岸', dataIndex: 'hggqkajc', width: 140 },
  { title: '运抵国代码', dataIndex: 'ydgdqszDm', width: 140 },
  { title: '运抵国名称', dataIndex: 'ydggjhdqjc', width: 140 },
  {
    title: '报关单类型', dataIndex: 'dyckbgdlxDm', width: 140, codeTable: ['CODE_DM_ZXSB_DYCKBGDLX', '01'], filter: {
      type: 'Select',
      codeTable: ['CODE_DM_ZXSB_DYCKBGDLX', '01'],
    },
  },
  {
    title: '数据来源', dataIndex: 'bgdsjlyDm', width: 140, codeTable: ['CODE_DM_ZXSB_BGDSJLY', '01'], filter: {
      type: 'Select',
      codeTable: ['CODE_DM_ZXSB_BGDSJLY', '01'],
    },
  },
  { title: '标签说明', dataIndex: 'bqsm', width: 140, ellipsis: true },
];

// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
ckbgdConfig.filter_items = [
  { name: 'hgckhwbgdsbrq', label: '申报日期', type: 'DatePicker', range: true, allowClear: true },
  { name: 'ckrq1', label: '出口日期', type: 'DatePicker', range: true, allowClear: false },
  { name: 'ckbgdh', label: '出口报关单号', type: 'Input' },
  { name: 'ckspDm', label: '出口商品代码', type: 'Input' },
  { name: 'jwshrmc', label: '境外收货人名称', type: 'Input' },
  { name: 'jgfsDm', label: '监管方式名称', type: 'Select', showType: '3', allowClear: true, showSearch: true, codeTable: ['CODE_DM_CKTS_HGJGFS', '01'] },
  { name: 'ckhth', label: '合同协议号', type: 'Input', },
  { name: 'bah', label: '备案号', type: 'Input' },
  { name: 'ywbh', label: '业务编号', type: 'Input' },
  { name: 'hggqkaDm', label: '出口口岸', type: 'Select', showType: '3', showSearch: true, codeTable: ['CODE_DM_GY_HGGQKA', '01'] },
  { name: 'ydgdqszDm', label: '运抵国名称', type: 'Select', showType: '3', showSearch: true, codeTable: ['CODE_T_GBCODE_INFO', '01'] },
  { name: 'tzsxbz', label: '台账数据', type: 'Select', codeTable: ['CODE_STATIC_SJGL_TZSJ', '01'] },
  { name: 'hzdwmc', label: '生产销售单位名称', type: 'Input' },
  { name: 'hgspmc', label: '海关商品名称', type: 'Input' },
  { name: 'bqsm', label: '标签', type: 'Input' },
  { name: 'ggxh', label: '规格型号', type: 'Input' },
];

// 配置项：自定义工具栏
ckbgdConfig.costomer_toobar = [
  ,
  {
    name: '缺失检查',
    key: '1',
    type: 'dropdown',
    list: [
      { name: '报关单检查', func: 'handleBgdQsjc' },
      { name: '备案单证检查', func: 'handleBgdBadzqsjc' },
    ],
  },
  {
    name: '批量修改',
    type: 'dropdown',
    list: [
      { name: '退税类型', func: 'btnSetSfts' },
      { name: '业务编号', func: 'btnSetYwbh' },
      { name: '标签', func: 'btnSetBq' },
    ],
  },
  { name: '同步结关状态', key: '1', func: 'handleBgdTbjgzt' },
  { name: '报关单导入', key: '2', func: 'importWj' },
  { name: '台账筛选', key: '3', func: 'importTzsx' },
  {
    name: '打印',
    key: '4',
    type: 'dropdown',
    list: [
      { name: '单一窗口横版样式', func: 'dyGdwFuncDy' },
      { name: '电子口岸竖版样式', func: 'dyGdwFuncDz' },
    ],
  },
  {
    name: '小计',
    key: '5',
    type: 'dropdown',
    list: [
      { name: '基础小计', func: 'xj' },
      { name: '成交币制小计', func: 'cjbzXj' },
    ],
  },
  { name: '删除', key: 'sc', func: 'btnDelete' },
];

export default ckbgdConfig;
