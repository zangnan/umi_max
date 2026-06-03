/**
 * title: 进度查询
 * author: lincb
 */
const unitConfig: any = {};

// 配置项
// api 列表查询
unitConfig.page_id = 'jdcx';
unitConfig.grid_show_serial_number = false;                                           // 是否显示序号，可选
unitConfig.click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
unitConfig.grid_row_key = 'zrwuuid';
// 列表查询
unitConfig.grid_api_grid_query = `${API_URL_BASE}/yw/saas/yzfpt/queryPagerRwjd`;


// 配置项：列表列
unitConfig.grid_columns = [
  { title: '', dataIndex: 'sjgjsjDm', width: 150, align: 'left', hidden:true},
  { title: '', dataIndex: 'zrwuuid', width: 150, align: 'left', hidden:true},
  { title: '', dataIndex: 'xzdyuuid', width: 150, align: 'left', hidden:true},
  { title: '', dataIndex: 'csz1', width: 150, align: 'left', hidden:true},
  { title: '', dataIndex: 'csz2', width: 150, align: 'left', hidden:true},
  { title: '任务分类', dataIndex: 'ywflDm', align: 'left', width: 170,codeTable: ['CODE_DM_ZXSB_YWFL', '03'] ,  filter: {
    type: 'Select',
    codeTable: ['CODE_DM_ZXSB_YWFL', '01']
  }, },
  {
    title: '任务名称', dataIndex: 'sjgjsjmc', width: 150, align: 'left', ellipsis: true, filter: {
      type: 'ZdySelect',
      codeTable: 'CODE_SJGL_RWCX_ZDY_RWMC'
    },
  },
  { title: '任务条件',  width: 240, align: 'left', ellipsis: { showTitle: false }, render: { func: 'renderXztj' } },
  { title: '任务方式', dataIndex: 'zdscbz', width: 100,codeTable: ['code_static_xzrwgl_xzabz_dm', '01'], filter: {
      type: 'Select',
      codeTable: ['code_static_xzrwgl_xzabz_dm', '01']
    }
  },
  {
    title: '任务执行状态', dataIndex: 'xzztDm', width: 130, align: 'left', ellipsis: true, render: { func: 'renderJljghxSjxzJdcxZxzt' }, filter: {
      type: 'Select',
      codeTable: ['CODE_DM_ZXSB_XZZT', '01'],
    }
  },
  { title: '任务进度', dataIndex: 'wcbl', width: 110, align: 'right', },
  // { title: '计划剩余时间', dataIndex: 'zxsj', align: 'left', width: 170 },
  { title: '任务执行情况', dataIndex: 'xxnr1', align: 'left', width: 170, ellipsis: { showTitle: false }, render: { func: 'renderJdcxRwzxqk' } },
  { title: '海关IC卡别名', dataIndex: 'kakbm', width: 140, align: 'left', ellipsis: true, },
  { title: 'IC卡使用状态', dataIndex: 'sdbz', width: 130, align: 'left', ellipsis: true, render: { func: 'rendersyzt' } },
  { title: '任务开始时间', dataIndex: 'zxkssj', width: 170, render: { type: 'date', format: 'yyyy-MM-DD HH:mm:ss' }, align: 'left', },
  { title: '任务结束时间', dataIndex: 'zxjssj', width: 170, render: { type: 'date', format: 'yyyy-MM-DD HH:mm:ss' }, align: 'left', },
  { title: '操作', width: 195, fixed: 'right', align: 'center',  render: { func: 'renderJdczNew' } },
];

unitConfig.grid_filter_quick = [
  { name: 'zxkssj', label: '任务开始时间', type: 'DatePicker', width: '3w', format: 'YYYY-MM-DD', range: true },
  { label: '任务名称', name: 'sjgjsjmc', type: 'Input', width: '3w', searchButton: true },
];

// unitConfig.gridParams = {
//   initSearchModal: [
//     { property: 'ywflDm', value: "001", op: 'dd' },
//   ],
// }

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
// // 配置项：自定义操作列
unitConfig.handle_columns = [
  // { name: '刷新', func: 'handleFpsqdTzreload',display: 'displayReload'  },
];


// 配置项：自定义工具栏
unitConfig.costomer_toobar = [
  { name: '删除', key: 'sjxzJdcxPlsc', func: 'handleBatchDelete' },
  // { name: '重新下载', key: 'sjxzJdcxCxxz', func: 'handleDownLoadKpwj' },
];

export default unitConfig;
