const unitConfig: any = {};

unitConfig.module_key = 'EXAMPLE_DATA_PAGE_4';
unitConfig.page_id = 'example_list_4';
unitConfig.api_grid_query = `/dict/automatic/queryPagerStatistics`;

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '年度', dataIndex: 'year', width: 80 },
  { title: '季度', dataIndex: 'quarter', width: 80 },
  { title: '商品名称', dataIndex: 'ckspmc', width: 160, ellipsis: true },
  { title: '成交币制', dataIndex: 'cjhghbzmDm', width: 85 },
  { title: '美元离岸价', dataIndex: 'mylaj', width: 120, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '成交金额', dataIndex: 'cjzj', width: 130, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '退税额', dataIndex: 'tse', width: 130, align: 'right', render: { type: 'number', format: '0,0.00' } },
];

// 配置项：筛选_普通筛选 页面最上方 第一层筛选
unitConfig.filter_items = [
  { name: 'ckhth', label: '出口合同号', type: 'Input', },
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
  statistics: true,                 // 是否显示统计按钮，默认关闭
};

export default unitConfig;