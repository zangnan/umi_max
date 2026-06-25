import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 生产企业退税情况汇总表
 * author: wxl
 */
const unitConfig: any = {};

// 配置项
unitConfig.grid_title = '（单位：万元、万美元）';
unitConfig.module_key = 'CX_SJFX_SC_TSQK_TSSBQK';                            // 业务单元key，对应后端接口
unitConfig.page_id = 'CX_SJFX_SC_TSQK_TSSBQK';                                        // 页面id
unitConfig.show_toolbar = true;                                                       // 是否开启工具栏，默认true开启
unitConfig.grid_selection_type = false;                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.layout_type = 'tz';                                                     // 页面类型，默认default 可选 default modal tabs
unitConfig.grid_show_serial_number = true;                      // 是否显示序号，默认不显示
unitConfig.export_key = 'CX_SJFX_SC_TSQK_TSSBQK_PRINT_REPORT'
unitConfig.module_type = 'sjbb'; 

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '所属期', dataIndex: 'ssq', width: 90, fixed: 'left', sorter: true, render: { type: 'date', format: 'YYYYMM' } },
  { title: '申报日期', dataIndex: 'sbrq', width: 110, fixed: 'left', render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: '退税状态', dataIndex: 'bgdsbqkDm', width: 100, fixed: 'left', render: { func: 'renderSjbbTsqk' },
    filter: {
      type: 'Radio',
      codeTable: 'CODE_DM_ZXSB_BGDSBQK_DYY:01',
    }
  },
  {
    title: '退税情况统计', dataIndex: 'tsqktj', children: [
      { title: '免抵退税额合计', dataIndex: 'mdtsehj', width: 145, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
      {
        title: '应退税额', dataIndex: 'ytse', children: [
          { title: '合计', dataIndex: 'ytsehj', width: 145, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
          { title: '出口货物劳务', dataIndex: 'hwytse', width: 145, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
          { title: '跨境应税行为', dataIndex: 'lwytse', width: 145, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
        ]
      },
      {
        title: '免抵税额', dataIndex: 'mdse', children: [
          { title: '合计', dataIndex: 'mdsehj', width: 145, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
          { title: '出口货物劳务', dataIndex: 'hwmdse', width: 145, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
          { title: '跨境应税行为', dataIndex: 'lwmdse', width: 145, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
        ]
      },
      { title: '不予办理免抵退税额', dataIndex: 'byblmdtse', width: 145, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
      { title: '暂不办理免抵退税额', dataIndex: 'zbblmdtse', width: 145, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
      { title: '未反馈免抵退税额', dataIndex: 'wfkmdtse', width: 145, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
      { title: '不予退税免抵退税额', dataIndex: 'bytsmdtse', width: 145, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
    ]
  },
  {
    title: '出口货物劳务申报情况', dataIndex: 'y', children: [
      { title: '申报明细（条）', dataIndex: 'hwsbmxts', width: 120, align: 'right', sum: true, render: { type: 'number', format: '0,0' } },
      { title: '报关单（条）', dataIndex: 'bgdts', width: 120, align: 'right', sum: true, render: { type: 'number', format: '0,0' } },
      { title: '代理证明（条）', dataIndex: 'dlzmts', width: 120, align: 'right', sum: true, render: { type: 'number', format: '0,0' } },
      { title: '美元离岸价', dataIndex: 'mylaj', width: 145, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
      { title: '人民币离岸价', dataIndex: 'rmblaj', width: 145, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
      { title: '不得免征和抵扣税额', dataIndex: 'mdtsbdmzhdkse', width: 170, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' }, sorter: true },
      { title: '免抵退税额', dataIndex: 'mdtseHw', width: 145, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' }, sorter: true },
    ]
  },
  {
    title: '跨境应税行为申报情况', dataIndex: 'kjysxwsbqk', children: [
      { title: '申报明细（条）', dataIndex: 'lwsbmxts', width: 120, align: 'right', sum: true, render: { type: 'number', format: '0,0' } },
      { title: '美元销售额', dataIndex: 'lwmyxse', width: 145, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
      { title: '人民币销售额', dataIndex: 'lwrmbxse', width: 145, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' }, sorter: true },
      { title: '免抵退税额', dataIndex: 'mdtseLw', width: 145, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' }, sorter: true },
    ]
  },
  { title: '申报表清单{br}（条）', dataIndex: 'sbbqdts', width: 100, align: 'right', sum: true, render: { func: 'renderSjbbTsqkSbqd' } },
];

unitConfig.grid_filter_quick = [
  { label: '申报日期', name: 'sbrq', isLabel: true, type: 'DatePicker', range: true, format: 'YYYY-MM-DD' },
  { label: '所属期', name: 'ssq', type: 'Input', searchButton: true },
];

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                       // 是否显示编辑链接，默认关闭
  delete: false,                     // 是否显示删除链接，默认关闭
};

// 配置项：工具栏
unitConfig.toolbar_default = {
  sjgxUpdateData: true,               // 是否显示更新台账数据，默认关闭
  ckts_download: true,                   // 是否显示导出，默认关闭
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
};

unitConfig.customer_toolbar = [];
unitConfig.handle_columns = [];
export default unitConfig;
