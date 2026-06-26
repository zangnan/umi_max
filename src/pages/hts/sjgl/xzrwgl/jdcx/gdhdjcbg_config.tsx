import CONSTANTS from '@/components/DDAssist/constants';
const unitConfig: any = {};

// 配置项
unitConfig.layout_type = 'modal';
unitConfig.module_key = 'CX_SJGL_HGSJXZ_GDHDJCBG_QUERY';
unitConfig.grid_selection_type = false;
unitConfig.grid_row_key = 'uuid';
unitConfig.toolbar_show_grid_checked_num = false;
unitConfig.show_toolbar = true;
unitConfig.module_type = 'sjbb';
unitConfig.export_key = 'CX_SJGL_HGSJXZ_GDHDJCBG_QUERY_PRINT_REPORT';

// 配置项：列表列
unitConfig.grid_columns = [
  {title: '序号', dataIndex: 'xh', width: 50, ellipsis: true},
  {title: '出口日期', dataIndex: 'ckrq1', width: 130, ellipsis: true},
  {title: '报关单号', dataIndex: 'csz', width: 150, ellipsis: true},
  {title: '检查结果', dataIndex: 'cwnr', width: 150,
    filter: {
      type: 'Radio',
      list: [
        { text: '全部', value: '' },
        { text: '缺失', value: '缺失' },
        { text: '报关状态未更新', value: '报关状态未更新' }
      ],
    }}
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: false,                    // 是否显示设置按钮，默认关闭
  download: false,
  full: false,
  reload: false,
  download: true,                   // 是否显示导出，默认关闭
};

unitConfig.customer_toolbar = [];
unitConfig.handle_columns = [];
export default unitConfig;
