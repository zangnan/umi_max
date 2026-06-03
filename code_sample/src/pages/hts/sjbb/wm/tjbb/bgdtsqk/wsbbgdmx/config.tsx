

/**
 * title: 出口报关单台账
 */
const unitConfig: any = {};

// 配置项
unitConfig.grid_title = '（单位：元、美元）';
unitConfig.unit_key = 'CX_SJFX_WM_BGDTSQK_WSBCKBGDMX';                            // 业务单元key，对应后端接口
unitConfig.page_id = 'CX_SJFX_WM_BGDTSQK_WSBCKBGDMX';                          // 页面id
unitConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
unitConfig.grid_selection_type = false;                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.grid_show_data_num = false;                          // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.layout_type = 'tz';                                  // 页面类型，默认default 可选 default modal tabs tz台账
unitConfig.grid_row_key = 'ckbgdh';
unitConfig.export_key = 'CX_SJFX_WM_BGDTSQK_WSBCKBGDMX_PRINT_REPORT';
unitConfig.module_type = 'sjbb';      

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '出口报关单号', dataIndex: 'ckbgdh', width: 180, fixed: 'left', sorter: true },
  //{ title: '信息状态', dataIndex: 'xxzt', width: 120, render: { func: 'renderSjbbXxzt' }, filter: { type: 'Radio', codeTable: ['CODE_STATIC_MDTS_BGDSCCKMX_GDXX', '01'], } }, // bug:18683
  { title: '出口日期', dataIndex: 'ckrq1', width: 110,  sorter: true, render: { type: 'date', format: 'yyyy-MM-DD' } },
  { title: '已出口天数{br}（天）', dataIndex: 'yckts', width: 120, sorter: true, align: 'right', sum: true,  render: { type: 'number', format: '0,0' } },
  { title: '出口发票号', dataIndex: 'ckfph', width: 110 },
  { title: '合同协议号', dataIndex: 'ckhth', width: 180, sorter: true , ellipsis: true },
  { title: '商品代码', dataIndex: 'hgckspDm', width: 120 },
  { title: '商品名称', dataIndex: 'hgspmc', width: 175, ellipsis: true },
  { title: '退税率{br}（%）', dataIndex: 'tsl', width: 80, align: 'right', sorter: true },
  {
    title: '未申报情况', dataIndex: 'wsbqk', children: [
      { title: '剩余美元离岸价', dataIndex: 'symylaj', width: 140, sorter: true, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
      { title: '剩余数量', dataIndex: 'sycksl', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00000' } },
      { title: '预估可退税额', dataIndex: 'ygktse', width: 140, sorter: true, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
    ]
  },
  { title: '美元离岸价', dataIndex: 'mylaj', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '美元汇率', dataIndex: 'myhl', width: 110, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '人民币离岸价', dataIndex: 'rmblaj', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '法定单位', dataIndex: 'hgjldwmc', width: 80, ellipsis: true },
  { title: '法定数量', dataIndex: 'cksl', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00000' } },
  { title: '第二单位', dataIndex: 'dejldwmc', width: 80, ellipsis: true },
  { title: '第二数量', dataIndex: 'decksl', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00000' } },
  { title: '成交单位', dataIndex: 'sbjldwmc', width: 80, ellipsis: true },
  { title: '成交数量', dataIndex: 'cjsl1', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00000' } },
  { title: '境外收发货人', dataIndex: 'jwshrmc', width: 140, ellipsis: true },
  { title: '监管方式代码', dataIndex: 'jgfsDm', width: 130 }, 
  { title: '监管方式名称', dataIndex: 'jgfsmc', width: 140, ellipsis: true, },
  { title: '出境口岸', dataIndex: 'hggqkajc', width: 110, ellipsis: true, },
  { title: '运抵国（地区）', dataIndex: 'ydggjhdqjc', width: 140, ellipsis: true },
];
unitConfig.grid_filter_quick = [
  { name: 'ckrq1', label: '出口日期', type: 'DatePicker', range: true,isLabel: true, },
];
// 配置项：筛选_普通筛选 页面最上方 第一层筛选
unitConfig.filter_items = [
  { name: 'ckbgdh', label: '出口报关单号', type: 'Input' },
  { name: 'ckfph', label: '出口发票号', type: 'Input' },
  { name: 'ckhth', label: '合同协议号', type: 'Input' },
  { name: 'hgckspDm', label: '出口商品代码', type: 'Input' },
  { name: 'jwshrmc', label: '境外收发货人', type: 'Input' },
  { name: 'jgfsDm', label: '监管方式名称', type: 'Select', mode: 'multiple', showSearch: true, codeTable: ['CODE_DM_CKTS_HGJGFS', '01'] },
  { name: 'hggqkaDm', label: '出境口岸', type: 'Select',mode: 'multiple',  showSearch: true, codeTable: ['CODE_DM_GY_HGGQKA', '01'] },
  { name: 'ydgdqszDm', label: '运抵国（地区）', type: 'Select',mode: 'multiple',  showSearch: true, codeTable: ['CODE_T_GBCODE_INFO', '01'] },
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
