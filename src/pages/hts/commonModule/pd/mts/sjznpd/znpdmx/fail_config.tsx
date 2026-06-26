import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 智能配单明细-失败详情
 * author: wxl
 */
const config: any = {};

// 配置项
// config.api_grid_query = `/yw/mts/znpd/qrpd/queryRightFpPage`;
config.module_key = 'CKTS_MTS_ZNPD_ZDPD_SBMX_CX';
config.grid_show_serial_number = true;                                           // 是否显示序号，可选
config.toolbar_show_grid_checked_num = false;
config.show_toolbar = true;                                                       // 是否开启工具栏，默认true开启
config.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
config.layout_type = 'modal';                                                     // 页面类型，默认default 可选 default modal tabs
config.grid_selection_type = false;                                               // 列表首选项类别，默认 checkbox，可选 false radio checkbox
config.export_key = 'CKTS_MTS_ZNPD_ZDPD_SBMX_DC';                                 // 业务单元key，对应后端接口

// 配置项：列表列
config.grid_columns = [
  { title: '错误代码', dataIndex: 'bgdpdsblxDm', width: 100, fixed: 'left' },
  { title: '错误原因', dataIndex: 'bgdpdsblxDm', width: 260, fixed: 'left', ellipsis: true, codeTable: 'CODE_DM_ZXSB_BGDPDSBLX:01',
    filter: {
      type: 'Select',
      codeTable: 'CODE_DM_ZXSB_BGDPDSBLX:01',
    }
  },
  { title: '出口报关单号', dataIndex: 'bgdNo', width: 180, sorter: true, fixed: 'left' },
  { title: '出口日期', dataIndex: 'ckrq1', width: 120, render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: '海关商品代码', dataIndex: 'hgcmcode', width: 110, },
  { title: '海关商品名称', dataIndex: 'hgcmname', width: 180, ellipsis: true, },
  { title: '规格型号', dataIndex: 'ggxh', width: 150, ellipsis: true, },
  { title: '法定数量/单位', dataIndex: 'fdUnit', width: 170, render: { func: 'renderZnpdSdFd' }, },
  { title: '成交数量/单位', dataIndex: 'cjsljdwmc', width: 170 },
  { title: '第二数量/单位', dataIndex: 'fd2Unit', width: 170, render: { func: 'renderZnpdSdDe' }, },
  //bug 23549
  { title: '出口发票号', dataIndex: 'ckfph', width: 150, ellipsis: true, },
  { title: '出口合同号', dataIndex: 'htNo', width: 160, },
  { title: '美元离岸价', dataIndex: 'usdAmt', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
];

config.grid_filter_quick = [
  { name: 'bgdNo', type: 'Input', label: '出口报关单号', searchButton: true  },
];

// 配置项：工具栏
config.toolbar_default = {
  setting: true,
  download: true,
  reload: true,
};

// 配置项：列表操作列
config.grid_handle_columns_default = {
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
};

// 配置项：自定义工具栏
config.customer_toolbar= [
];

config.handle_columns = [];
export default config;