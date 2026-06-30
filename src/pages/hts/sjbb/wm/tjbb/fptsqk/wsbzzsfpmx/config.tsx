import CONSTANTS from '@/components/DDAssist/constants';


/**
 * title: 未申报增值税专用发票明细
 */
const unitConfig: any = {};

// 配置项
unitConfig.grid_title = '（单位：元）';
unitConfig.module_key = 'CX_SJFX_WM_FPTSQK_WSBZZSZYFPMX';                            // 业务单元key，对应后端接口
unitConfig.page_id = 'CX_SJFX_WM_FPTSQK_WSBZZSZYFPMX';                          // 页面id
unitConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
unitConfig.grid_selection_type = false;                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.toolbar_show_grid_checked_num = false;                          // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.layout_type = 'tz';                                  // 页面类型，默认default 可选 default modal tabs tz台账
unitConfig.export_key = 'CX_SJFX_WM_FPTSQK_WSBZZSZYFPMX_PRINT_REPORT';
unitConfig.module_type = 'sjbb';      

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '发票代码', dataIndex: 'fpDm', width: 130, align: 'left',fixed: 'left'},
  { title: '发票号码', dataIndex: 'fphm', width: 130,fixed: 'left', sorter: true },
  { title: '供货商名称', dataIndex: 'xhfnsrmc', width: 200, align: 'left',ellipsis: true,fixed: 'left' },
  { title: '开票日期', dataIndex: 'kprq', width: 90, sorter: true, render: { type: 'date', format: 'YYYY-MM-DD' } ,fixed: 'left'},
  { title: '已开票天数{br}（天）', dataIndex: 'kpts', width: 110, sorter: true, sum: true, align: 'right', render: { type: 'number', format: '0,0' } },
  {
    title: '发票状态', dataIndex: 'fpzt', align: 'center', width: 120, codeTable: 'CODE_STATIC_TZ_FPZT:01', filter: {
      type: 'Select',
      codeTable: 'CODE_STATIC_TZ_FPZT:01',
    },
  },
  { title: '金额', dataIndex: 'je', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' }, sorter: true },
  { title: '税额', dataIndex: 'se', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '价税合计', dataIndex: 'jshj', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },

  {
    title: '未申报情况', dataIndex: 'wsbqk', children: [
      { title: '剩余金额', dataIndex: 'syje', width: 140, sorter: true, sum: true, align: 'right', render: { type: 'number', format: '0,0.00' } },
      { title: '预估可退税额', dataIndex: 'ygktse', width: 140, sorter: true, sum: true, align: 'right', render: { type: 'number', format: '0,0.00' } },
    ]
  },
  // { title: '销方名称', dataIndex: 'xhfnsrmc', width: 140, ellipsis: true, },
  { title: '销方纳税人识别号', dataIndex: 'xhfnsrsbh', width: 160, ellipsis: true },
  {
    title: '转内销标志', dataIndex: 'ckznxbz', width: 110, align: 'center', codeTable: 'CODE_STATIC_JLJGHX_SFBZ:01', filter: {
      type: 'Radio',
      codeTable: 'CODE_STATIC_JLJGHX_SFBZ:01'
    },
  },
  { title: '备注', dataIndex: 'bz', width: 120, ellipsis: true },


];

// 配置项：筛选_普通筛选 页面最上方 第一层筛选
unitConfig.filter_items = [
  { name: 'fpDm', label: '发票代码', type: 'Input' },
  { name: 'fphm', label: '发票号码', type: 'Input' },
  { name: 'xhfnsrmc', label: '供货商名称', type: 'Input' },
  { name: 'xhfnsrsbh', label: '销方纳税人识别号', type: 'Input' },
];
unitConfig.grid_filter_quick = [
  { name: 'kprq', label: '开票日期', type: 'DatePicker', range: true,isLabel: true, },
];
// 配置项：工具栏
unitConfig.toolbar_default = {
  sjgxUpdateData: true,              
  ckts_download: true,                   // 是否显示导出，默认关闭
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
};

unitConfig.customer_toolbar = [];
unitConfig.handle_columns = [];
export default unitConfig;
