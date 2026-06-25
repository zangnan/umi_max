/**
 * title: 8.航空国际运输收入清算账单申报明细表
 */
const unitConfig: any = {};

// 配置项
unitConfig.grid_title = '（单位：元、美元）';
unitConfig.unit_key = 'CX_SJFX_SC_TSQK_TSSBQK_XZ_HKGJYSSRQSZDSBMXB';                            // 业务单元key，对应后端接口
unitConfig.page_id = 'CX_SJFX_SC_TSQK_TSSBQK_XZ_HKGJYSSRQSZDSBMXB';                          // 页面id
unitConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
unitConfig.grid_selection_type = false;                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.grid_show_data_num = false;                           // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.layout_type = 'modal';                                  // 页面类型，默认default 可选 default modal tabs tz台账
unitConfig.export_key = 'CX_SJFX_SC_TSQK_TSSBQK_XZ_HKGJYSSRQSZDSBMXB_PRINT_REPORT';
unitConfig.module_type = 'sjbb';

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '所属期', dataIndex: 'ssq', width: 90, fixed: 'left', render: { type: 'date', format: 'yyyyMM' } },
  { title: '序号', dataIndex: 'sbxh', width: 80, sorter: true, },
  { title: '清算账单编号', dataIndex: 'qszdbh', width: 180, sorter: true, ellipsis: true, },
  { title: '清算账单类别', dataIndex: 'hkgjqszdlbDm', width: 150, codeTable: 'CODE_STATIC_TZ_QSZDLB:01', filter: { type: 'Radio', codeTable: 'CODE_STATIC_TZ_QSZDLB:01', } },
  { title: '国际运输类别', dataIndex: 'hkgjyslbDm', width: 150, codeTable: 'CODE_STATIC_TZ_GJYS:01', filter: { type: 'Radio', codeTable: 'CODE_STATIC_TZ_GJYS:01', } },
  { title: '清算账单出具日期', dataIndex: 'kjrq', width: 150, sorter: true, render: { type: 'date', format: 'yyyy-MM-DD' } },
  { title: '收付款国家（地区）代码', dataIndex: 'hggjhdqszDm', width: 180, },
  { title: '收付款国家（地区）名称', dataIndex: 'gjhdqmc', width: 180, ellipsis: true, },
  { title: '清算币种代码', dataIndex: 'hbzmDm', width: 110, },
  { title: '清算币种名称', dataIndex: 'cjhbmc', width: 140, ellipsis: true, },
  { title: '客票票号/货单号码', dataIndex: 'kpphhdhm', width: 180, ellipsis: true, },
  { title: '原币金额', dataIndex: 'cjzj', width: 180, align: 'right', sum: true, sorter: true, render: { type: 'number', format: '0,0.00' } },
  { title: '原币汇率', dataIndex: 'cjhbhl', width: 110, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '人民币金额', dataIndex: 'qsqkjermb', width: 180, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '备注', dataIndex: 'bz', width: 180, ellipsis: true, },
  { title: '申报标志', dataIndex: 'sbbz1', width: 90, render: { func: 'renderTzSbbz' }, },
  { title: '审核标志', dataIndex: 'shbz', width: 100, render: { func: 'renderTzShbz' }, filter: { type: 'Radio', codeTable: 'CODE_DM_TZ_SBBZ:01', } },
];

// 配置项：筛选_普通筛选 页面最上方 第一层筛选
unitConfig.grid_filter_quick = [
  { name: 'qszdbh', label: '清算账单编号', type: 'Input', searchButton: true },
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  ckts_download: true,                   // 是否显示导出，默认关闭
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: false,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
};
export default unitConfig;
