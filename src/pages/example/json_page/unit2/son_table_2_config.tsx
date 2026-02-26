const unitConfig: any = {};

// 配置项
unitConfig.layout_type = 'modal';                                                     // 页面类型，默认default 可选 default modal tabs

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '成交数量', dataIndex: 'cjsl1', width: 140, align: 'right', render: { type: 'number', format: '0,0.0000' } },
  { title: '成交币制', dataIndex: 'cjhghbzmDm', width: 85 },
  { title: '成交金额', dataIndex: 'cjzj', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '美元离岸价', dataIndex: 'mylaj', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '法定单位', dataIndex: 'dyjldwDm', width: 90, codeTable: 'code_dm_ckts_hgjldw', ellipsis: true },
  { title: '出口日期', dataIndex: 'ckrq1', width: 120, sorter: true, render: { type: 'date', format: 'yyyy-MM-DD' }},
  { title: '出口合同号', dataIndex: 'ckhth', width: 115 },
  { title: '成交方式', dataIndex: 'hgcjfsmc', width: 85 },
  { title: '成交单位', dataIndex: 'hgjldwmc', width: 90, ellipsis: true },
];

// 配置项：筛选_普通筛选 页面最上方 第一层筛选
unitConfig.filter_items = [
  { name: 'zmlx', label: '征免类型', type: 'Select', codeTable: 'code_static_bgd_zmlx_dm' },
  { name: 'ckhth', label: '出口合同号', type: 'Input', },
  { name: 'ckrq1', label: '出口日期', type: 'DatePicker' },
  { name: 'jgfsDm', label: '监管方式', type: 'Input' },
];

// 配置项：表单项
unitConfig.form_items = [
  { label: 'ID', type: 'Hidden', name: 'uuid' },
  { label: '基本信息', type: 'GroupTitle', name: 'jbxx' },
  { label: '报关单号', type: 'Input', name: 'ckbgdh', tooltip: '报关单号说明...', rules: [
    { type: 'base_required', message: '必录项可选提示信息' },
  ] },
  { label: '出口日期', type: 'DatePicker', name: 'ckrq1', format: 'YYYY-MM-DD', range: true  },
  { label: '出口合同号', type: 'InputNumber', name: 'ckhth', range: true },
  { label: '核销单号', type: 'Input', name: 'hxdh', defaultValue:'12311234' },
  { label: '运输工具名称', type: 'Input', name: 'ysgjmc' },
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
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: true,
  delete: true,
  detail: true,
};

export default unitConfig;