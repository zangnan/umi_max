import CONSTANTS from '@/components/DDAssist/constants';


/**
 * title: 发票退税情况分月汇总
 */
const unitConfig: any = {};

// 配置项
unitConfig.grid_title = '（单位：万元）';
unitConfig.module_key = 'CX_SJFX_WM_FPTSQK_FPTSQKFYHZ';                            // 业务单元key，对应后端接口
unitConfig.page_id = 'CX_SJFX_WM_FPTSQK_FPTSQKFYHZ';                          // 页面id
unitConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
unitConfig.grid_selection_type = false;                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.toolbar_show_grid_checked_num = false;                          // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.layout_type = 'tz';                                  // 页面类型，默认default 可选 default modal tabs tz台账
unitConfig.export_key = 'CX_SJFX_WM_FPTSQK_FPTSQKFYHZ_PRINT_REPORT';
unitConfig.module_type = 'sjbb';      

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '开票年月', dataIndex: 'kpyf', width: 90, fixed: 'left', sorter: true, render: { type: 'date', format: 'YYYYMM' } },
  { title: '发票{br}（张）', dataIndex: 'zzszyfpzs', width: 100, align: 'right', sum: true, render: { func: 'rendersjbbscBgdFp', format: '0,0' } },//TODO 外贸企业增值税专用发票明细表
  { title: '总金额', dataIndex: 'je', width: 130, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' }, ellipsis: true },
  { title: '总税额', dataIndex: 'se', width: 130, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' }, ellipsis: true },
  { title: '价税合计', dataIndex: 'jshj', width: 130, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' }, ellipsis: true },
  {
    title: '未申报退税情况', dataIndex: 'wsbtsqk', children: [
      { title: '发票{br}（张）', dataIndex: 'wsbzzszyfpzs', width: 100, align: 'right', sum: true, render: { func: 'rendersjbbscBgdWsb', format: '0,0' } },//TODO 外贸企业增值税专用发票明细表
      { title: '剩余金额', dataIndex: 'syje', width: 130, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' }, ellipsis: true },
      { title: '预估可退税额', dataIndex: 'ygktse', width: 130, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' }, ellipsis: true },
    ]
  },
  {
    title: '免退税申报情况', dataIndex: 'mtssbqk', children: [
      { title: '发票{br}（张）', dataIndex: 'mtszzszyfpzs', width: 100, align: 'right', sum: true, render: { type: 'number', format: '0,0' } },// TODO 一期不做 外贸企业出口退税进货明细申报表（查询表）
      { title: '计税金额', dataIndex: 'mtsjsje', width: 130, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' }, ellipsis: true },
      { title: '可退税额', dataIndex: 'mtstse', width: 130, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' }, ellipsis: true },
      { title: '实收退税款', dataIndex: 'mtssstse', width: 130, align: 'right', sum: true, sorter: true, render: { type: 'number', format: '0,0.00' }, ellipsis: true },
    ]
  },
  {
    title: '代办退税申报情况', dataIndex: 'dbtssbqk', children: [
      { title: '发票{br}（张）', dataIndex: 'dbtszzszyfpzs', width: 100, sum: true, align: 'right', render: { type: 'number', format: '0,0' } },// TODO 一期不做 外贸综合服务企业代办退税申报表（查询表）
      { title: '计税金额', dataIndex: 'dbtsjsje', width: 130, sum: true, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
      { title: '代办退税税额', dataIndex: 'dbtstse', width: 130, sum: true, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
      { title: '实收退税款', dataIndex: 'dbtssstse', width: 130, sum: true, align: 'right', sorter: true, render: { type: 'number', format: '0,0.00' }, ellipsis: true },
    ]
  },
  { title: '转内销发票{br}（张）', dataIndex: 'ckznxzzszyfpzs', width: 100, sum: true, align: 'right', render: { func: 'rendersjbbscZnx', format: '0,0' } },//TODO 外贸企业增值税专用发票明细表
];

// 配置项：筛选_普通筛选 页面最上方 第一层筛选
unitConfig.grid_filter_quick = [
  { name: 'kpyf', label: '开票年月', type: 'DatePicker', range: true, format: 'YYYYMM', picker: 'month', searchButton: true ,isLabel: true,  allowClear: false },
  // { label: '供应商', name: 'gys', type: 'Input', searchButton: true },
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
