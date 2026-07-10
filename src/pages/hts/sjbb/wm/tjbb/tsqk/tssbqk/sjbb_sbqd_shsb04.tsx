/**
 * title: 04出口货物收汇情况表
 * author: wxl
 */
const unitConfig: any = {};

// 配置项
unitConfig.grid_title = '（单位：元）';
unitConfig.module_key = 'CX_SJFX_WM_TSQK_TSSBQK_XZ_CKHWSHSBB';                            // 业务单元key，对应后端接口
unitConfig.page_id = 'CX_SJFX_WM_TSQK_TSSBQK_XZ_CKHWSHSBB';                                        // 页面id
unitConfig.show_toolbar = true;                                                       // 是否开启工具栏，默认true开启
unitConfig.grid_selection_type = false;                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.grid_show_data_num = false;                          // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.layout_type = 'modal';                                  // 页面类型，默认default 可选 default modal tabs tz台账
unitConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
unitConfig.export_key = 'CX_SJFX_WM_TSQK_TSSBQK_XZ_CKHWSHSBB_PRINT_REPORT';
unitConfig.module_type = 'sjbb';

unitConfig.grid_columns = [
  { title: '所属期', dataIndex: 'ssq', width: 80, fixed: 'left', render: { type: 'date', format: 'yyyyMM' } },
  { title: '申报批次', dataIndex: 'sbpc', width: 90, fixed: 'left' },
  { title: '序号', dataIndex: 'sbxh', width: 90 },
  { title: '出口货物报关单号', dataIndex: 'ckbgdh', width: 180, sorter: true },
  { title: '代理出口货物证明号', dataIndex: 'dlckhwzmhm', width: 180, sorter: true },
  { title: '出口发票号', dataIndex: 'ckfph', width: 140, ellipsis: true },
  { title: '出口销售币种代码', dataIndex: 'cjhbzmDm', width: 130 },
  { title: '出口销售币种名称', dataIndex: 'cjhbmc', width: 130, ellipsis: true },
  { title: '出口销售金额', dataIndex: 'cjzj', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '出口销售币种汇率', dataIndex: 'cjhbhl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '出口销售人民币金额', dataIndex: 'ckxsermb', width: 160, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '收汇日期', dataIndex: 'ckshrq', width: 100, render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: '收汇凭证号', dataIndex: 'pzhm2', width: 180, ellipsis: true },
  { title: '出口收汇币种代码', dataIndex: 'ckshhbzmDm', width: 150 },
  { title: '出口收汇币种名称', dataIndex: 'ckshhbmc', width: 150, ellipsis: true },
	{ title: '凭证总金额', dataIndex: 'pzzje', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '出口收汇金额', dataIndex: 'ckshje', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '出口收汇币种汇率', dataIndex: 'ckshhbhl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '出口收汇人民币金额', dataIndex: 'ckshje', width: 150, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '付汇人', dataIndex: 'fhr', width: 120, ellipsis: true },
	{ title: '非进口商付汇原因', dataIndex: 'fjksfhyy', width: 180, ellipsis: true },
	{ title: '视同收汇原因代码', dataIndex: 'stshyyDm', width: 160, ellipsis: true},
	{ title: '视同收汇原因说明', dataIndex: 'stshyysm', width: 180, ellipsis: true},
  { title: '视同收汇举证材料种类代码', dataIndex: 'stshjzclzlDm', width: 200, ellipsis: true},
	// { title: '视同收汇举证材料种类名称', dataIndex: 'stshjzclzlmc', width: 200, ellipsis: true},
  { title: '视同收汇人民币金额', dataIndex: 'stshrmbje', width: 150, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '合同约定全部收汇最终日期', dataIndex: 'htydqbshzzrq', width: 200, render: { func: 'renderSjbbZzrq' } },
	{ title: '出口合同号', dataIndex: 'ckhth', width: 150, ellipsis: true },
	{ title: '备注', dataIndex: 'bz', width: 140, ellipsis: true },
  {
    title: '申报标志', dataIndex: 'sbbz1', width: 100, render: { func: 'renderTzSbbz' },
  },
  {
    title: '审核标志', dataIndex: 'shbz', width: 100, render: { func: 'renderTzShbz' },
    filter: {
      type: 'Radio',
      codeTable: 'CODE_DM_TZ_SBBZ:01',
    }
  },
];

unitConfig.filter_items = [
  { label: '出口货物报关单号', name: 'ckbgdh', type: 'Input' },
  { label: '代理出口货物证明号', name: 'dlckhwzmhm', type: 'Input' },
  { label: '收汇凭证号', name: 'pzhm2', type: 'Input' },
  { label: '付汇人', name: 'fhr', type: 'Input' },
];

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                       // 是否显示编辑链接，默认关闭
  delete: false,                     // 是否显示删除链接，默认关闭
};

// 配置项：工具栏
unitConfig.toolbar_default = {
  ckts_download: true,                   // 是否显示导出，默认关闭
  setting: true,                    // 是否显示设置按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
};

export default unitConfig;
