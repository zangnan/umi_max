import CONSTANTS from '@/components/DDAssist/constants';
const unitConfig: any = {};

// 配置项
unitConfig.layout_type = 'modal';
unitConfig.page_id = 'SJGL_RWGL_BADZQSJC_MXCK_QUERY';
unitConfig.api_grid_query = `/yw/saas/yzfpt/querySjglRwglBgdbadzqsjcMxckQuery`;
unitConfig.grid_selection_type = false;
unitConfig.grid_row_key = 'zbuuid';
unitConfig.toolbar_show_grid_checked_num = false;
unitConfig.export_key = 'SJGL_RWGL_BADZQSJC_MXCK_QUERY_REPORT';
unitConfig.export_large = true; // tssb_download 配合此导出使用，同步大数据量导出
// unitConfig.show_toolbar = false;

// 配置项：列表列
unitConfig.grid_columns = [
  {title: '报关单号', dataIndex: 'bgdhgbh', width: 180},
  {title: '出口日期', dataIndex: 'ckrq1dc', width: 145},
  {title: '结关状态', dataIndex: 'jgztmc', width: 145},
  {title: '委托报关协议', dataIndex: '010301czbz1', width: 145, render: { func: 'renderCzbz' }},
  {title: '出口报关单', dataIndex: '020101czbz1', width: 145, render: { func: 'renderCzbz' }},
  {title: '无纸化放行通知书', dataIndex: '020103czbz1', width: 145, render: { func: 'renderCzbz' }},
];
// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,
  reload: true,
  full: true,
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
  ckts_download: false,
  download: true,
};

// 配置项：自定义工具栏
unitConfig.customer_toolbar = [
  { name: '数据下载', key: 'bgdbadzqsjc_mxck_sjxz', func: 'bgdbadzqsjcMxckSjxz' },
];
unitConfig.handle_columns = [];
export default unitConfig;
