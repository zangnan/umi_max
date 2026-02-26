const unitConfig: any = {};

// 配置项
unitConfig.module_key = 'EXAMPLE_DATA_PAGE_1';
unitConfig.layout_type = 'default';
unitConfig.form_title = 'BGD';
unitConfig.grid_row_key = ['ckbgdh', 'xh4'];
unitConfig.grid_title = 'BGD'
unitConfig.delete_key='uuids';

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '监管方式代码', dataIndex: 'jgfsDm2', width: 155 },
  { title: '出口日期', dataIndex: 'ckrq1', width: 120, sorter: true, render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: '商品代码', dataIndex: 'ckspDm', width: 95, render: { type: 'mask' } },
  { title: '状态', dataIndex: 'spzt2', width: 95, render: { poweroff: 'handleSetStatus' } },
  { title: '调用耗时', dataIndex: 'usedTime', width: 70, align: 'right', render: { timeEasyRead: true } },
  { title: '海关商品名称', dataIndex: 'hgspmc', width: 180, render: { copy: true } },
  { title: '出口合同号', dataIndex: 'ckhth', width: 115 },
  { title: '美元离岸价', dataIndex: 'mylaj', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '法定单位', dataIndex: 'dyjldwDm', width: 110, codeTable: 'code_dm_ckts_hgjldw', ellipsis: true },
  { title: '法定单位数量', dataIndex: 'cksl', width: 140, align: 'right', render: { type: 'number', format: '0,0.0000' } },
  { title: '第二单位', dataIndex: 'dejldwDm', width: 110, codeTable: 'code_dm_ckts_hgjldw', ellipsis: true },
  { title: '第二单位数量', dataIndex: 'decksl', width: 140, align: 'right', render: { type: 'number', format: '0,0.0000' } },
  { title: '隐藏列', dataIndex: 'hiddenCol', width: 130, hidden: true },
];

// 配置项：筛选_普通筛选 页面最上方 第一层筛选
unitConfig.filter_items = [
  { name: 'sbyw', label: '申报业务', type: 'Select', codeTable: 'code_static_bgd_sbyw_dm', tooltip: '申报业务说明...' },
  { name: 'sybz', label: '生成状态', type: 'Select', showType: '3', codeTable: 'code_static_bgd_sbyw_dm' },
  { name: 'zmlx', label: '征免类型', type: 'Select', codeTable: 'code_static_bgd_zmlx_dm' },
  { name: 'czbz1', label: '关单信息', type: 'Select', codeTable: 'code_static_bgd_gdxx_dm' },
  { name: 'ckhth', label: '出口合同号', type: 'Input', },
  { name: 'ckrq1', label: '出口日期', type: 'DatePicker' },
];

// 配置项：表单项
unitConfig.form_items = [
  { label: 'ID', type: 'Hidden', name: 'uuid' },
  { label: '基本信息', type: 'GroupTitle', name: 'jbxx' },
  { label: '出口日期', type: 'DatePicker', name: 'ckrq1', format: 'YYYY-MM-DD', range: true  },
  { label: '出口合同号', type: 'InputNumber', name: 'ckhth', range: true },
  { label: '核销单号', type: 'Input', name: 'hxdh', defaultValue:'12311234' },
  { label: '保费计算方式代码', type: 'Select', name: 'bfjsfsDm', codeTable: 'code_dm_ckts_hgbfjsfs' },
  { label: '杂费海关货币字母代码', type: 'Input', name: 'zfhghbzmDm' },
  { label: '杂费金额', type: 'InputNumber', name: 'zfje1', format: '0,0.00' },
  { label: '杂费计算方式代码', type: 'Select', name: 'zfjsfsDm', codeTable: 'code_dm_ckts_hgzfjsfs' },
  { label: '商品信息', type: 'GroupTitle', name: 'spxx' },
  { label: '出口商品代码', type: 'Input', name: 'ckspDm' },
  { label: '出口商品名称', type: 'Input', name: 'ckspmc', readOnly: true },
  { label: '海关商品名称', type: 'Input', name: 'hgspmc' },
  { label: '成交计量单位', type: 'Input', name: 'hgjldwmc' },
  { label: '成交数量', type: 'InputNumber', name: 'cjsl1', format: '0,0.0000' },
  { label: '法定计量单位', type: 'Input', name: 'dyjldwDm' },
  { label: '法定数量', type: 'InputNumber', name: 'cksl', format: '0,0.0000' },
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  add: true,
  edit: true,
  delete: true,
  setting: true,
  full: true,
  download: true,
  upload: true,
  reload: true,
  statistics: true,
  advanced_filter: true,
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: true,
  delete: true,
  detail: true,
};

// 配置项：自定义工具栏
unitConfig.customer_toolbar = [
  { name: '测一', key: 'cs1', func: 'handleCostomerToobar1' },
  { name: '导入', key: 'mydr', func: 'handleCostomerImport' },
];

// 配置项：自定义操作列
unitConfig.handle_columns = [
  { name: '测试1', key: 'cs11', func: 'handleColumns1' },
  { name: '测试2', key: 'cs12', func: 'handleColumns2' },
];

export default unitConfig;