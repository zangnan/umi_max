const fpConfig: any = {};

// 配置项
fpConfig.grid_show_serial_number = false; // 是否显示序号，可选
fpConfig.grid_api_grid_query = `${API_URL_BASE}/yw/bszx/wbsj/dzdzfp/queryPdFpPage`; // api 列表查询
fpConfig.grid_row_key = 'uuid'; // 列表主键，默认uuid
fpConfig.form_save_check = false; // 表单编辑是否执行后端校验
fpConfig.grid_scroll_x = '1100px';

// 配置项
fpConfig.grid_columns = [
  { title: '发票号码', dataIndex: 'fphm', width: 180, ellipsis: true },
  { title: '发票代码', dataIndex: 'fpDm', width: 120 },
  { title: '发票状态', dataIndex: 'fpzt', width: 120, render: { func: 'fpzt' } },
  { title: '发票行号', dataIndex: 'hh', width: 80 },
  { title: '商品名称', dataIndex: 'hwhyslwmc', width: 180, ellipsis: true },
  { title: '数量', dataIndex: 'fpsl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '剩余数量', dataIndex: 'sl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '单价', dataIndex: 'dj', align: 'right', width: 140, ellipsis: true },
  { title: '计税金额', dataIndex: 'je', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '剩余计税金额', dataIndex: 'pdje', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '开票日期', dataIndex: 'kprq', width: 110 },
  { title: '发票单位', dataIndex: 'jldwmc', width: 80, ellipsis: true },
  { title: '标签说明', dataIndex: 'bqsm', width: 150, ellipsis: true },
];

// 配置项：列表操作列
fpConfig.grid_handle_columns_default = {
  edit: false,    // 是否显示编辑链接，默认开启
  delete: false,  // 是否显示删除链接，默认开启
};

// 配置项：列表筛选项
fpConfig.grid_filter_quick = [
  { name: 'fphm', label: '发票号码', type: 'Input' },
  { name: 'fpDm', label: '发票代码', type: 'Input',searchButton: true },
];

// 配置项：工具栏
fpConfig.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
};

// 配置项：自定义操作列
fpConfig.handle_columns = [
  { name: '配单', func: 'handPdColumns' }
];

export default fpConfig;
