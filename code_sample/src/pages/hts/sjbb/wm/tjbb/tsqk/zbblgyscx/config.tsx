

/**
 * title: 供应商退税情况
 */
const unitConfig: any = {};

// 配置项
unitConfig.grid_title = '（单位：万元）';
unitConfig.unit_key = 'CX_SJFX_WM_TSQK_ZBBLGYSQK';                            // 业务单元key，对应后端接口
unitConfig.page_id = 'CX_SJFX_WM_TSQK_ZBBLGYSQK';                          // 页面id
unitConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
unitConfig.grid_selection_type = false;                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.grid_show_data_num = false;                          // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.layout_type = 'tz';                                  // 页面类型，默认default 可选 default modal tabs tz台账
unitConfig.export_key = 'CX_SJFX_WM_TSQK_ZBBLGYSQK_PRINT_REPORT';
unitConfig.module_type = 'sjbb';


// 配置项：列表列
unitConfig.grid_columns = [
  { title: '申报年月', dataIndex: 'ssq', width: 90, fixed: 'left' },
  { title: '申报批次', dataIndex: 'sbpc', width: 90, fixed: 'left' },
  { title: '申报日期 ', dataIndex: 'sbrq1', width: 120, fixed: 'left', render: { type: 'date', format: 'yyyy-MM-DD' } },
  { title: '供应商税号', dataIndex: 'ghfnsrsbh1', width: 180, fixed: 'left' },
  { title: '供货商名称', dataIndex: 'ghfnsrmc', width: 200, align: 'left',ellipsis: true },
  { title: '申报计税金额', dataIndex: 'jsje', width: 180,sum:true, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '申报退税额', dataIndex: 'tse', width: 180,sum:true, align: 'right', render: { type: 'number', format: '0,0.00' } },
  {
    title: '暂不办理', dataIndex: 'zbbl', children: [
      { title: '退税额', dataIndex: 'zbbltse', width: 140,sum:true, align: 'right', render: { type: 'number', format: '0,0.00' } },
      { title: '发票张数', dataIndex: 'zbblfpzs', width: 145, sum:true,align: 'right', render: { type: 'number', format: '0,0' } },
      { title: '出口明细条数', dataIndex: 'zbblckmxts', width: 145, sum:true,align: 'right', render: { func: 'renderCkmxzs' }, },
      { title: '进货明细条数', dataIndex: 'zbbljhmxts', width: 145, sum:true, align: 'right', render: { func: 'renderJhmxzs' }, },
    ]
  },
  {
    title: '未反馈', dataIndex: 'wfk', children: [
      { title: '退税额', dataIndex: 'wsbtse', width: 140, sum:true,align: 'right', render: { type: 'number', format: '0,0.00' } },
      { title: '发票张数', dataIndex: 'wsbfpzs', width: 145, sum:true,align: 'right', render: { type: 'number', format: '0,0' } },
      { title: '出口明细条数', dataIndex: 'wsbckmxts', width: 145, sum:true,align: 'right', render: { func: 'renderWfkCkmxzs' }, },
      { title: '进货明细条数', dataIndex: 'wsbjhmxts', width: 145, sum:true,align: 'right', render: { func: 'renderWfkJhmxzs' }, },
    ]
  },
];

// 配置项：列表筛选项
unitConfig.filter_items = [
  { name: 'ssq', label: '申报年月', type: 'Input' },
  { name: 'sbpc', label: '申报批次', type: 'Input' },
  { name: 'ghfnsrsbh1', label: '供应商税号', type: 'Input' },
  { name: 'ghfnsrmc', label: '供货商名称',type: 'Input' },
];

unitConfig.grid_filter_quick = [
  { label: '申报日期', name: 'sbrq', type: 'DatePicker', range: true, isLabel: true, },
];
// 配置项：工具栏
unitConfig.toolbar_default = {
  sjgxUpdateData: true,               // 是否显示更新台账数据，默认关闭
  ckts_download: true,                   // 是否显示导出，默认关闭
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
};

export default unitConfig;
