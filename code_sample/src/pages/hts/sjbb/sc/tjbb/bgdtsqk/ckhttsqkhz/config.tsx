

/**
 * title: 出口合同退税情况汇总
 */
const unitConfig: any = {};

// 配置项
unitConfig.grid_title = '（单位：万元、万美元）';
unitConfig.unit_key = 'CX_SJFX_SC_BGDTSQK_CKHTTSQKHZ';                            // 业务单元key，对应后端接口
unitConfig.page_id = 'CX_SJFX_SC_BGDTSQK_CKHTTSQKHZ';                          // 页面id
unitConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
unitConfig.grid_selection_type = false;                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.grid_show_data_num = false;                          // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.layout_type = 'tz';                                  // 页面类型，默认default 可选 default modal tabs tz台账
unitConfig.export_key = 'CX_SJFX_SC_BGDTSQK_CKHTTSQKHZ_PRINT_REPORT';
unitConfig.module_type = 'sjbb';      

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '出口合同号', dataIndex: 'ckhth', width: 150, fixed: 'left', sorter: true, ellipsis: true},
  {
    title: '出口情况', dataIndex: 'ckqk', children: [
      { title: '报关单{br}（张/条）', dataIndex: 'ckbgdzsTs', align: 'right', width: 100, sum: true, ellipsis: true },
      { title: '美元离岸价', dataIndex: 'mylaj', width: 140, sum: true, align: 'right', render: { type: 'number', format: '0,0.00' } },
      { title: '人民币离岸价', dataIndex: 'rmblaj', width: 140, sum: true, align: 'right', render: { type: 'number', format: '0,0.00' } },
    ]
  },
  {
    title: '未申报退税情况', dataIndex: 'wsbtsqk', children: [
      { title: '信息不齐{br}（条）', dataIndex: 'xxbqts', width: 100, sum: true, align: 'right', render:  { func: 'rendersjbbscBgdMylaj', format: '0,0' } },
      { title: '未申报{br}（条）', dataIndex: 'wsbts', width: 100, sum: true, align: 'right',render: { func: 'rendersjbbscBgdWsb', format: '0,0' } },
      { title: '未开具出口发票{br}（条）', dataIndex: 'wkjckfpts', width: 120, sum: true, align: 'right', render:  { func: 'rendersjbbscWkjfp', format: '0,0' } },
    ]
  },
  {
    title: '免抵退税申报情况', dataIndex: 'mdtssbqk', children: [
      { title: '已申报{br}（条）', dataIndex: 'mdtysbts', width: 100, sum: true, align: 'right', render: { type: 'number', format: '0,0' } },
      { title: '美元离岸价', dataIndex: 'mdtmylaj', width: 140, sum: true, align: 'right', render: { type: 'number', format: '0,0.00' } },
      { title: '人民币离岸价', dataIndex: 'mdtrmblaj', width: 140, sum: true, align: 'right', render: { type: 'number', format: '0,0.00' } },
      { title: '免抵退税额', dataIndex: 'mdtmdtse', width: 140, sum: true, align: 'right', render: { type: 'number', format: '0,0.00' } },
      { title: '应退税额', dataIndex: 'mdtytse', width: 140, sum: true, align: 'right', render: { type: 'number', format: '0,0.00' } },
      { title: '免抵税额', dataIndex: 'mdtmdse', width: 140, sum: true, sorter: true ,   align: 'right', render: { type: 'number', format: '0,0.00' } },
    ]
  },
  { title: '代理证明申报情况{br}（条）', dataIndex: 'dlzmysbts', width: 140, sum: true, align: 'right', render: { type: 'number', format: '0,0' } },
  {
    title: '已补税/未退税证明申报情况', dataIndex: 'ybswtszmsbqk', children: [
      { title: '退运{br}（条）', dataIndex: 'tyts', width: 100, sum: true, align: 'right', render: { type: 'number', format: '0,0' } },
      { title: '改单{br}（条）', dataIndex: 'gdts', width: 100, sum: true, align: 'right', render: { type: 'number', format: '0,0' } },
      { title: '撤单{br}（条）', dataIndex: 'cdts', width: 100, sum: true, align: 'right', render: { type: 'number', format: '0,0' } },
    ]
  },
  { title: '征税或免税{br}（条）', dataIndex: 'zshmsts', width: 100, sum: true, align: 'right',  render:  { func: 'rendersjbbscZshms', format: '0,0' } },
];

unitConfig.grid_filter_quick = [
  { name: 'ckny', label: '出口年月', type: 'DatePicker',format: 'yyyyMM', range: true, isLabel: true, allowClear: false },
  { name: 'ckhth', label: '出口合同号', type: 'Input' , searchButton: true},
];
// 配置项：工具栏
unitConfig.toolbar_default = {
  sjgxUpdateData: true,
  ckts_download: true,                   // 是否显示导出，默认关闭
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
}; 

export default unitConfig;
