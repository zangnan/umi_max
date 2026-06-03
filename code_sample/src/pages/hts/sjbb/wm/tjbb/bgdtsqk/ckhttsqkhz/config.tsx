

/**
 * title: 出口合同退税情况
 */
const unitConfig: any = {};

// 配置项
unitConfig.grid_title = '（单位：万元、万美元）';
unitConfig.unit_key = 'CX_SJFX_WM_BGDTSQK_CKHTTSQKHZ';                            // 业务单元key，对应后端接口
unitConfig.page_id = 'CX_SJFX_WM_BGDTSQK_CKHTTSQKHZ';                          // 页面id
unitConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
unitConfig.grid_selection_type = false;                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.grid_show_data_num = false;                          // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.layout_type = 'tz';                                  // 页面类型，默认default 可选 default modal tabs tz台账
unitConfig.export_key = 'CX_SJFX_WM_BGDTSQK_CKHTTSQKHZ_PRINT_REPORT';
unitConfig.module_type = 'sjbb';      

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '出口合同号', dataIndex: 'ckhth', width: 160, fixed: 'left', sorter: true, ellipsis: true},
  { title: '报关单{br}（张/条）', dataIndex: 'ckbgdzsTs', align: 'right', width: 140, sum: true, ellipsis: true},
  { title: '美元离岸价', dataIndex: 'mylaj', width: 140, sum: true, align: 'right' , render: { type: 'number', format: '0,0.00' } },
  { title: '人民币离岸价', dataIndex: 'rmblaj', width: 140, sum: true, align: 'right' , render: { type: 'number', format: '0,0.00' } },
  {
    title: '未申报退税情况', dataIndex: 'wsbtsqk', children: [
      { title: '未申报（条）', dataIndex: 'wsbts', width: 140, sum: true, align: 'right',render: { func: 'renderFzxmBywsb', format: '0,0' } },
      { title: '信息不齐（条）', dataIndex: 'xxbqts', width: 140, sum: true, align: 'right', render:  { func: 'renderFzxmXxbq', format: '0,0' } },
      { title: '未开具出口发票（条）', dataIndex: 'wkjckfpts', width: 170, sum: true, align: 'right', render:  { func: 'renderFzxmWkj', format: '0,0' } },
    ]
  },
  {
    title: '免退税申报情况', dataIndex: 'mtssbqk', children: [
      { title: '已申报（条）', dataIndex: 'mdtysbts', width: 140, sum: true, align: 'right', render: { type: 'number', format: '0,0' } },
      { title: '美元离岸价', dataIndex: 'mtsmylaj', width: 140, sum: true, align: 'right', render: { type: 'number', format: '0,0.00' } },
      { title: '人民币离岸价', dataIndex: 'mtsrmblaj', width: 140, sum: true, align: 'right', render: { type: 'number', format: '0,0.00' } },
      { title: '计税金额', dataIndex: 'mtsjsje', width: 140, sum: true, align: 'right', render: { type: 'number', format: '0,0.00' } },
      { title: '可退税额', dataIndex: 'mtstse', width: 140, sum: true, align: 'right', render: { type: 'number', format: '0,0.00' } },
      { title: '实收退税款', dataIndex: 'mtssstse', width: 140, sum: true, sorter: true ,   align: 'right', render: { type: 'number', format: '0,0.00' } },
    ]
  },
  {
    title: '代办退税申报情况', dataIndex: 'dbtssbqk', children: [
      { title: '已申报（条）', dataIndex: 'dbtsysbts', width: 140, sum: true, align: 'right', render: { type: 'number', format: '0,0' } },
      { title: '美元离岸价', dataIndex: 'dbtsmylaj', width: 140, sum: true, align: 'right', render: { type: 'number', format: '0,0.00' } },
      { title: '人民币离岸价', dataIndex: 'dbtsrmblaj', width: 140, sum: true,  align: 'right', render: { type: 'number', format: '0,0.00' } },
      { title: '计税金额', dataIndex: 'DBTSjsje', width: 140, sum: true, align: 'right', render: { type: 'number', format: '0,0.00' } },
      { title: '代办退税税额', dataIndex: 'DBTStse', width: 140, sum: true, align: 'right', render: { type: 'number', format: '0,0.00' } },
      { title: '实收退税款', dataIndex: 'DBTSsstse', width: 140, sum: true, sorter: true , align: 'right', render: { type: 'number', format: '0,0.00' } },

    ]
  },
  { title: '代理证明申报情况{br}（条）', dataIndex: 'dlzmysbts', width: 140,align: 'right', sum: true,},
  {
    title: '已补税/未退税证明申报情况', dataIndex: 'ybswtszmsbqk', children: [
      { title: '退运（条）', dataIndex: 'tyts', width: 140, sum: true, align: 'right', render: { type: 'number', format: '0,0' } },
      { title: '改单（条）', dataIndex: 'gdts', width: 140, sum: true, align: 'right', render: { type: 'number', format: '0,0' } },
      { title: '撤单（条）', dataIndex: 'cdts', width: 140, sum: true, align: 'right', render: { type: 'number', format: '0,0' } },
    ]
  },
  { title: '征税或免税（条）', dataIndex: 'zshmsts', width: 140, sum: true, align: 'right',  render:  { func: 'renderFzxmZsms', format: '0,0' } },
];

unitConfig.grid_filter_quick = [
  { name: 'ckny', label: '出口年月', isLabel: true, type: 'DatePicker', range: true, format: 'yyyyMM', picker: 'month', allowClear: false},
  { name: 'ckhth', label: '出口合同号', type: 'Input' , searchButton: true},
  
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
