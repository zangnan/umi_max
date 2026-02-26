const unitConfig: any = {};

// 配置项
unitConfig.module_key = 'EXAMPLE_DATA_PAGE_1';
unitConfig.grid_row_key = 'ckbgdh';

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '报关单号', dataIndex: 'ckbgdh', width: 170, dictFieldType: 'varchar(32)', dictObjectTableName: 'nbgl_qx_rygl' },
  { title: '监管方式代码', dataIndex: 'jgfsDm2', width: 105, dictFieldType: 'varchar(32)', dictObjectTableName: 'nbgl_qx_rygl' },
  { title: '监管方式', dataIndex: 'jgfsDm', width: 125, codeTable: 'code_dm_ckts_hgjgfs', dictFieldType: 'varchar(32)', dictObjectTableName: 'nbgl_qx_rygl' },
  { title: '出口日期', dataIndex: 'ckrq1', width: 100, render: { type: 'date', format: 'YYYY-MM-DD' }, dictFieldType: 'date', dictObjectTableName: 'nbgl_qx_rygl' },
  { title: '出口合同号', dataIndex: 'ckhth', width: 115, dictFieldType: 'varchar(32)', dictObjectTableName: 'nbgl_qx_rygl'  },
  { title: '美元离岸价', dataIndex: 'mylaj', width: 95, align: 'right', render: { type: 'number', format: '0,0.00' }, dictFieldType: 'decimal(15,2)', dictObjectTableName: 'nbgl_qx_rygl' },
  // { title: '审批状态', dataIndex: 'spzt', width: 125 },
  // { title: '隐藏列', dataIndex: 'hiddenCol', width: 130, hidden: true },
];

// 配置项：筛选_普通筛选 页面最上方 第一层筛选
unitConfig.filter_items = [
  { name: 'ckhth', label: '出口合同号', type: 'Input' },
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
  advanced_filter: true,                 // 是否显示统计按钮，默认关闭
};

export default unitConfig;