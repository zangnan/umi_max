/**
 * title: 数据封装页面
 */
const unitConfig: any = {};

// 配置项
unitConfig.grid_title = '（单位：万元、万美元）';
unitConfig.unit_key = 'CX_SJFX_WM_TSQK_TSSBQK_WMQYTSQK';                            // 业务单元key，对应后端接口
unitConfig.page_id = 'CX_SJFX_WM_TSQK_TSSBQK_WMQYTSQK';                          // 页面id
unitConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
unitConfig.grid_selection_type = false;                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.grid_show_data_num = false;                          // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.layout_type = 'tz';
unitConfig.export_key = 'CX_SJFX_WM_TSQK_TSSBQK_WMQYTSQK_PRINT_REPORT';           // 页面类型，默认default 可选 default modal tabs tz台账
unitConfig.module_type = 'sjbb';      

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '申报年月', dataIndex: 'ssq', width: 90, fixed: 'left', sorter: true, render: { type: 'date', format: 'yyyyMM' } },
  { title: '申报批次', dataIndex: 'sbpc', width: 90, fixed: 'left', sorter: true },
  { title: '申报日期', dataIndex: 'sbrq1', width: 100, fixed: 'left', render: { type: 'date', format: 'yyyy-MM-DD' } },
  { title: '退税状态', dataIndex: 'bgdsbqkDm', width: 100, fixed: 'left', render: { func: 'renderSjbbTsqk' },
    filter: {
      type: 'Radio',
      codeTable: ['CODE_DM_ZXSB_BGDSBQK_DYY', '01'],
    } 
  },
  {
    title: '申报情况', dataIndex: 'sbqk', children: [
      { title: '合计', dataIndex: 'tse', width: 145, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
      { title: '增值税', dataIndex: 'zzstse', width: 145, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
      { title: '消费税', dataIndex: 'xfstse', width: 145, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
    ]
  },
  {
    title: '审核情况', dataIndex: 'shqk', children: [
      {
        title: '实收退税款', dataIndex: 'xxx', children: [
          { title: '合计', dataIndex: 'sstse', width: 145, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
          { title: '增值税', dataIndex: 'sszzstse', width: 145, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
          { title: '消费税', dataIndex: 'ssxfstse', width: 145, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
        ]
      },
      { 
        title: '未收退税款', dataIndex: 'wstsk', children: [
          { title: '合计', dataIndex: 'wstse', width: 145, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
          { title: '不予退税', dataIndex: 'bytse', width: 145, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
          { title: '暂不办理', dataIndex: 'zbbltse', width: 145, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
          { title: '未反馈', dataIndex: 'wfktse', width: 145, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
          { title: '不予办理', dataIndex: 'bybltse', width: 145, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
        ]
      },
    ]
  },
  {
    title: '出口明细申报情况', dataIndex: 'ckmxsbqk', children: [
      { title: '出口明细（条）', dataIndex: 'ckmxsbbjlts1', width: 120, align: 'right', sum: true, render: { type: 'number', format: '0,0' } },
      { title: '报关单（条）', dataIndex: 'ckbgdts', width: 120, align: 'right', sum: true, render: { type: 'number', format: '0,0' } },
      { title: '代理证明（条）', dataIndex: 'dlckzmts', width: 120, align: 'right', sum: true, render: { type: 'number', format: '0,0' } },
      { title: '美元离岸价', dataIndex: 'mylaj', width: 145, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
    ]
  },
  {
    title: '进货明细申报情况', dataIndex: 'jhmxsbqk', children: [
      { title: '进货明细（条）', dataIndex: 'jhmxsbbjlts1', width: 120, align: 'right', sum: true, render: { type: 'number', format: '0,0' } },
      { title: '进货发票（张）', dataIndex: 'zzszyfpzs', width: 120, align: 'right', sum: true, render: { type: 'number', format: '0,0' } },
      { title: '计税金额（元）', dataIndex: 'jsje', width: 145, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
    ]
  },
  { title: '申报表清单{br}（条）', dataIndex: 'sbts', width: 110, align: 'right', sum: true, render: { func: 'renderSjbbTsqkSbqdWm' } },
];

unitConfig.grid_filter_quick = [
  { label: '申报日期', name: 'sbrq', isLabel: true, type: 'DatePicker', range: true, format: 'YYYY-MM-DD' },
];

unitConfig.filter_items = [
  { label: '申报年月', name: 'ssq', type: 'Input' },
  { label: '申报批次', name: 'sbpc', type: 'Input' },
]

// 配置项：工具栏
unitConfig.toolbar_default = {
  sjgxUpdateData: true,               // 是否显示更新台账数据，默认关闭
  ckts_download: true,                   // 是否显示导出，默认关闭
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
};

export default unitConfig;
