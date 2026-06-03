/**
 * title: 进度查询
 * author: lincb
 */
const unitConfig: any = {};

// 配置项
unitConfig.unit_key = 'JLJG_ZXSB_WBSJ_XZ_DY';                                         // 业务单元key，对应后端接口
// api 列表查询
unitConfig.grid_show_serial_number = false;                                           // 是否显示序号，可选
unitConfig.click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
unitConfig.grid_scroll_x = '1100px';                                                   // 默认700px
unitConfig.grid_row_key = 'xzdyuuid';
// 列表查询
unitConfig.grid_api_grid_query = `${API_URL_BASE}/dditSaas/khdgj/bgd/queryPagerXzrw`;

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '任务名称', dataIndex: 'sjgjsjmc', width: 150, align: 'left', ellipsis: true, },
  { title: '下载周期', dataIndex: 'xztj', width: 175, align: 'left', ellipsis: true, },
  { title: '任务编号', dataIndex: 'xzdyuuid', width: 180, align: 'left', ellipsis: true, },
  { title: '任务情况', dataIndex: 'xzdyuuid', width: 180, align: 'left', ellipsis: true, },
  {
    title: '执行状态', dataIndex: 'xzztDm', width: 150, align: 'left', ellipsis: true, render: { func: 'renderJljghxSjxzJdcxZxzt' }, filter: {
      type: 'Select',
      codeTable: ['CODE_DM_ZXSB_XZZT', '01'],
    }
  },
  { title: '任务执行情况', dataIndex: 'xxnr1', align: 'left', width: 170, ellipsis: { showTitle: false }, render: { func: 'renderJdcxRwzxqk' } },
  { title: '任务开始时间', dataIndex: 'zxkssj', width: 145, render: { type: 'date', format: 'yyyy-MM-DD HH:mm:ss' }, align: 'left', },
  { title: '任务结束时间', dataIndex: 'zxjssj', width: 145, render: { type: 'date', format: 'yyyy-MM-DD HH:mm:ss' }, align: 'left', },
];

// 配置项：列表筛选项
// unitConfig.filter_items = [
//   { name: 'sjgjsjmc', label: '任务名称', type: 'Input' },
//   { name: 'zxkssj', label: '任务开始时间', type: 'DatePicker',format: 'YYYY-MM-DD',},
// ];
// 配置项：筛选_普通筛选 页面最上方 第一层筛选
unitConfig.filter_items = [
  { name: 'zxkssj', label: '任务开始时间', type: 'DatePicker', width: '3w', format: 'YYYY-MM-DD', },
  { label: '任务名称', name: 'sjgjsjmc', type: 'Input', width: '3w' },
  { label: '任务情况', type: 'Input', name: 'ywbh', },
];

// unitConfig.grid_filter_quick = [
//   { name: 'zxkssj', label: '任务开始时间', type: 'DatePicker', width: '3w', format: 'YYYY-MM-DD', },
//   { label: '任务名称', name: 'sjgjsjmc', type: 'Input', width: '3w', searchButton: true },
// ];

unitConfig.gridParams = {
  initSearchModal: [
    { property: 'sjgjsjDm', values: ["040000"], op: 'ain' },
  ],
}

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,
  reload: true,
  full: true,
};



// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
};

// 配置项：自定义工具栏
unitConfig.costomer_toobar = [
  { name: '删除', key: 'sjxzJdcxPlsc', func: 'handleBatchDelete' },
  { name: '重新下载', key: 'sjxzJdcxCxxz', func: 'handleDownLoadKpwj' },
];

export default unitConfig;