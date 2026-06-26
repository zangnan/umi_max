import CONSTANTS from '@/components/DDAssist/constants';
const unitConfig: any = {};

// 配置项
unitConfig.layout_type = 'modal';
unitConfig.module_key = 'CX_SJGL_HGSJXZ_ZIRW_QUERY';
unitConfig.grid_selection_type = false;
unitConfig.grid_row_key = 'uuid';
unitConfig.toolbar_show_grid_checked_num = false;
unitConfig.show_toolbar = false;

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '任务条件', dataIndex: 'xztj', width: 160, ellipsis: true },
  {
    title: '任务执行状态', dataIndex: 'xzztDm', width: 130, render: { func: 'renderJljghxSjxzJdcxZxzt' }, filter: {
      type: 'Select',
      codeTable: 'CODE_DM_ZXSB_XZZT:02',
    }
  },
  { title: '任务执行情况', dataIndex: 'xxnr1', width: 170, ellipsis: { showTitle: false }, render: { func: 'renderJdcxRwzxqk' } },
  { title: '任务开始时间', dataIndex: 'zxkssj', width: 145, render: { type: 'date', format: 'YYYY-MM-DD HH:mm:ss' } },
  { title: '任务结束时间', dataIndex: 'zxjssj', width: 145, render: { type: 'date', format: 'YYYY-MM-DD HH:mm:ss' } },
];

unitConfig.customer_toolbar = [];
unitConfig.handle_columns = [];
export default unitConfig;