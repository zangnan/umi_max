import CONSTANTS from '@/components/DDAssist/constants';
const bgdConfig: any = {};

// 配置项
bgdConfig.grid_show_serial_number = true; // 是否显示序号，可选
bgdConfig.api_grid_query = `/yw/bszx/wbsj/bgd/queryBgd21Page`; // api 列表查询
bgdConfig.grid_row_key = 'uuid'; // 列表主键，默认uuid
bgdConfig.form_save_check = false; // 表单编辑是否执行后端校验

// 配置项：列表列21位报关单
bgdConfig.grid_columns = [
  { title: '报关单号', dataIndex: 'ckbgdh', width: 200, sorter: true, fixed: 'left' },
  // { title: '项号', dataIndex: 'xh4', width: 80, fixed: 'left', }, -- bug 23476
  { title: '出口日期', dataIndex: 'ckrq1', width: 120, sorter: true, fixed: 'left', render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: '商品代码', dataIndex: 'ckspDm', sorter: true, width: 100, },
  { title: '商品名称', dataIndex: 'hgspmc', width: 120, ellipsis: true },
  { title: '合同号', dataIndex: 'ckhth', sorter: true, width: 200, ellipsis: true },
  { title: '规格型号', dataIndex: 'ggxh', width: 200, ellipsis: true },
  { title: '成交方式', dataIndex: 'hgcjfsmc', width: 100, },
  { title: '成交单位', dataIndex: 'sbjldwmc', width: 80, ellipsis: true },
  { title: '成交数量', dataIndex: 'cjsl1', width: 150, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '可用成交数量', dataIndex: 'kycjsl1', width: 150, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '成交币制', dataIndex: 'cjhghbzmDm', width: 70, },
  { title: '成交金额', dataIndex: 'cjzj', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '可用成交金额', dataIndex: 'kycjzj', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '法定单位', dataIndex: 'hgjldwmc', width: 80, ellipsis: true },
  { title: '法定数量', dataIndex: 'cksl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '可用法定数量', dataIndex: 'kycksl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '第二单位', dataIndex: 'dejldwDm', width: 80, ellipsis: true, codeTable: 'CODE_DM_CKTS_HGJLDW:01'  },
  { title: '第二单位数量', dataIndex: 'decksl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '可用第二单位数量', dataIndex: 'kydecksl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' } }
];

// 配置项：列表操作列
bgdConfig.grid_handle_columns_default = {
  edit: false,    // 是否显示编辑链接，默认开启
  delete: false,  // 是否显示删除链接，默认开启
};

// 配置项：列表筛选项
bgdConfig.filter_items = [
  { name: 'ckrq1', label: '出口日期', type: 'DatePicker', range: true, format: 'YYYY-MM-DD' },
  { name: 'ckhth', label: '合同号', type: 'Input' },
  { name: 'ckbgdh', label: '报关单号', type: 'Input' },
];

// 配置项：工具栏
bgdConfig.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
};

// 配置项：自定义操作列
bgdConfig.handle_columns = [
  { name: '配单', func: 'handPdColumns' }
];

// bgdConfig.customer_toolbar=[
//   { name: '自动配单', key: 'abgdZdpd', func: 'abgdZdpd' },
// ]

export default bgdConfig;
