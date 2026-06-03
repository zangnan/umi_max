

/**
 * title: 出口报关单明细-生产
 */
const unitConfig: any = {};

// 配置项
unitConfig.grid_title = '（单位：元、美元）';
unitConfig.unit_key = 'CX_SJFX_SC_BGDTSQK_CKBGDMX';                            // 业务单元key，对应后端接口
unitConfig.page_id = 'CX_SJFX_SC_BGDTSQK_CKBGDMX';                          // 页面id
unitConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
unitConfig.grid_selection_type = false;                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.grid_show_data_num = false;                          // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.layout_type = 'tz';                                  // 页面类型，默认default 可选 default modal tabs tz台账
unitConfig.export_key = 'CX_SJFX_SC_BGDTSQK_CKBGDMX_PRINT_REPORT';
unitConfig.module_type = 'sjbb';

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '出口报关单号', dataIndex: 'ckbgdh', width: 180, fixed: 'left', sorter: true },
  { title: '出口日期', dataIndex: 'ckrq1', width: 120, fixed: 'left', sorter: true, render: { type: 'date', format: 'yyyy-MM-DD' } },
  { title: '出口发票号', dataIndex: 'ckfph', width: 130, ellipsis: true },
  { title: '合同协议号', dataIndex: 'ckhth', width: 180, sorter: true, ellipsis: true},
  { title: '商品代码', dataIndex: 'hgckspDm', width: 120, ellipsis: true },
  { title: '商品名称', dataIndex: 'hgspmc', width: 180, ellipsis: true },
  { title: '退税率（%）', dataIndex: 'tsl', width: 130, align: 'right', sorter: true },
  {
    title: '未申报情况', dataIndex: 'wsbqk', children: [
      { title: '剩余美元离岸价', dataIndex: 'symylaj', width: 140, sorter: true, sum: true, align: 'right', render: { type: 'number', format: '0,0.00' } },
      { title: '剩余数量', dataIndex: 'sycksl', width: 140, sorter: true, sum: true, align: 'right', render: { type: 'number', format: '0,0.00000' } },
    ]
  },
  {
    title: '申报业务情况', dataIndex: 'sbywqk', children: [
      {
        title: '申报情况', dataIndex: 'bgdsbqkDm', width: 120, render: { func: 'rendersjbbSbqk' }, filter: {
          type: 'Select',
          codeTable: ['CODE_DM_ZXSB_BGDSBQK', '01'],
        },
      },
      {
        title: '申报类型', dataIndex: 'bgdcllxDm', width: 100, ellipsis: true, render: { func: 'rendersjbbCllx' }, filter: {
          type: 'Select',
          codeTable: ['CODE_STATIC_SJBB_SBLX_SC', '01'],
        },
      },
      { title: '美元离岸价', dataIndex: 'tssbmylaj', width: 140, sum: true, align: 'right', render: { type: 'number', format: '0,0.00' } },
      { title: '人民币离岸价', dataIndex: 'tssbrmblaj', width: 140,align: 'right', sum: true,render: { type: 'number', format: '0,0.00' } },
      { title: '免抵退税额', dataIndex: 'mdtse', width: 100, sum: true, align: 'right', render: { type: 'number', format: '0,0.00' } },
      { title: '应退税额', dataIndex: 'ytse1', width: 100, sorter: true, sum: true, align: 'right', render: { type: 'number', format: '0,0.00' } },
      { title: '免抵额', dataIndex: 'mdse', width: 100, sorter: true, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },

    ]
  },
  {
    title: '退运申报情况', dataIndex: 'tysbqk', children: [
      {
        title: '退运业务类型', dataIndex: 'tyybswtstylxDm', width: 130, ellipsis: true, render: { func: 'rendersjbbTyybs' }, filter: {
          type: 'Select',
          codeTable: ['CODE_DM_CKTS_TYYBSWTSTYLX', '01'],
        },
      },
      { title: '退运数量', dataIndex: 'tysl', width: 150, align: 'right', sum: true, render: { type: 'number', format: '0,0.00000' } },
    ]
  },
  { title: '美元离岸价', dataIndex: 'mylaj', width: 120, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '美元汇率', dataIndex: 'myhl', width: 100, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '人民币离岸价', dataIndex: 'rmblaj', width: 120, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '法定单位', dataIndex: 'hgjldwmc', width: 80, ellipsis: true },
  { title: '法定数量', dataIndex: 'cksl', width: 100, align: 'right', sum: true, render: { type: 'number', format: '0,0.00000' } },
  { title: '第二单位', dataIndex: 'dejldwmc', width: 80, ellipsis: true },
  { title: '第二数量', dataIndex: 'decksl', width: 100, align: 'right', sum: true, render: { type: 'number', format: '0,0.00000' } },
  { title: '申报单位', dataIndex: 'sbjldwmc', width: 80, ellipsis: true },
  { title: '申报数量', dataIndex: 'cjsl1', width: 100, align: 'right', sum: true, render: { type: 'number', format: '0,0.00000' } },
  { title: '境外收发货人', dataIndex: 'jwshrmc', width: 120, ellipsis: true },
  { title: '监管方式代码', dataIndex: 'jgfsDm', width: 120 },
  { title: '监管方式名称', dataIndex: 'jgfsmc', width: 120, ellipsis: true, },
  { title: '出境口岸', dataIndex: 'hggqkajc', width: 110, ellipsis: true, },
  { title: '运抵国（地区）', dataIndex: 'ydggjhdqjc', width: 120, ellipsis: true },

];

// 配置项：筛选_普通筛选 页面最上方 第一层筛选
unitConfig.filter_items = [
  { name: 'ckbgdh', label: '出口报关单号', type: 'Input' },
  { name: 'ckhth', label: '合同协议号', type: 'Input' },
  { name: 'jwshrmc', label: '境外收发货人', type: 'Input' },
  { name: 'jgfsDm', label: '监管方式名称',mode: 'multiple',  type: 'Select', showSearch: true, codeTable: ['CODE_DM_CKTS_HGJGFS', '01'] },
  { name: 'hggqkaDm', label: '出境口岸',mode: 'multiple',  type: 'Select', showSearch: true, codeTable: ['CODE_DM_GY_HGGQKA', '01'] },
  { name: 'ydgdqszDm', label: '运抵国（地区）',mode: 'multiple',  type: 'Select', showSearch: true, codeTable: ['CODE_T_GBCODE_INFO', '01'] },
];
unitConfig.grid_filter_quick = [
  { name: 'ckrq', label: '出口日期', type: 'DatePicker', range: true, isLabel: true, allowClear: false },
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
