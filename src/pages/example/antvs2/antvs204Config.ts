export default {
  api_grid_query: '/dict/automatic/queryPagerStatistics',
  // grid_show_serial_number: true,
  // grid_pagination: false,
  sheet_type: '', // table or ''
  grid_columns: [
    { title: '年度', dataIndex: 'year', width: 90 },
    { title: '季度', dataIndex: 'quarter', width: 90 },
    { title: '商品名称', dataIndex: 'ckspmc', width: 180, ellipsis: true, },
    { title: '监管方式代码', dataIndex: 'jgfsDm2', width: 100 },
    { title: '监管方式', dataIndex: 'jgfsDm', width: 155, sorter: true, codeTable: 'code_dm_ckts_hgjgfs', },
    { title: '美元离岸价', dataIndex: 'mylaj', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
    { title: '成交币制', dataIndex: 'cjhghbzmDm', width: 85 },
    { title: '退税额', dataIndex: 'tse' },
  ],
  sheet_type_table: {
    rows: [
      'year',
      'quarter',
    ],
    columns: [
      'ckspmc',
      'cjhghbzmDm',
    ],
    values: [
      'mylaj',
      'tse',
    ]
  },
};