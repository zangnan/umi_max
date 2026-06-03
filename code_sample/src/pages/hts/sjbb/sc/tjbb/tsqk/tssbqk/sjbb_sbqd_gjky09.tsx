/**
 * title: 9.国际客运(含香港直通车)运输清算函件明细表
 */
const unitConfig: any = {};

// 配置项
unitConfig.grid_title = '（单位：元）';
unitConfig.unit_key = 'CX_SJFX_SC_TSQK_TSSBQK_XZ_GJKYHXGZTCYSQSHJMXB';                            // 业务单元key，对应后端接口
unitConfig.page_id = 'CX_SJFX_SC_TSQK_TSSBQK_XZ_GJKYHXGZTCYSQSHJMXB';                          // 页面id
unitConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
unitConfig.grid_selection_type = false;                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.grid_show_data_num = false;                           // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.layout_type = 'modal';                                  // 页面类型，默认default 可选 default modal tabs tz台账
unitConfig.grid_scroll_x = '700px';                             // 默认700px
unitConfig.export_key = 'CX_SJFX_SC_TSQK_TSSBQK_XZ_GJKYHXGZTCYSQSHJMXB_PRINT_REPORT';
unitConfig.module_type = 'sjbb';

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '所属期', dataIndex: 'ssq', width: 90, fixed: 'left', render: { type: 'date', format: 'yyyyMM' } },
  { title: '序号', dataIndex: 'sbxh', width: 80, sorter: true, },
  { title: '清算函件（月报）类别', dataIndex: 'gjkyqshjlbDm', width: 180, codeTable: ['CODE_STATIC_TZ_QSHJLB', '01'], filter: { type: 'Select', codeTable: ['CODE_STATIC_TZ_QSHJLB', '01'], } },
  { title: '清算函件编号（月报月份）', dataIndex: 'hjbh', width: 200, sorter: true, },
  { title: '清算函件（月报）出具日期', dataIndex: 'kjrq', width: 200, render: { type: 'date', format: 'yyyy-MM-DD' } },
  // { title: '有关国家（外方）或地区代码', dataIndex: 'hggjhdqszDm', width: 200, },
  { title: '有关国家（外方）或地区', dataIndex: 'gjhdqmc', width: 180, ellipsis: true, },
  { title: '原币代码', dataIndex: 'cjhbzmDm', width: 110, },
  { title: '原币名称', dataIndex: 'cjhbmc', width: 140, ellipsis: true, },
  { title: '归属于中方（内地）原币金额', dataIndex: 'cjzj', sorter: true, width: 220, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '原币汇率', dataIndex: 'cjhbhl', width: 110, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '归属于中方（内地）人民币金额', dataIndex: 'gsyzfndjermb', sorter: true, width: 230, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '美元汇率', dataIndex: 'myhl', width: 110, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '归属于中方（内地）美元金额', dataIndex: 'gsyzfndjemy', sorter: true, width: 220, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '备注', dataIndex: 'bz', width: 150, ellipsis: true, },
  { title: '申报标志', dataIndex: 'sbbz1', width: 90, render: { func: 'renderTzSbbz' }, },
  { title: '审核标志', dataIndex: 'shbz', width: 100, render: { func: 'renderTzShbz' }, filter: { type: 'Radio', codeTable: ['CODE_DM_TZ_SBBZ', '01'], } },
];

// 配置项：筛选_普通筛选 页面最上方 第一层筛选
unitConfig.grid_filter_quick = [
  { name: 'hjbh', label: '清算函件编号（月报月份）', type: 'Input', width: '5w', searchButton: true },
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  ckts_download: true,                   // 是否显示导出，默认关闭
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: false,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
};
export default unitConfig;
