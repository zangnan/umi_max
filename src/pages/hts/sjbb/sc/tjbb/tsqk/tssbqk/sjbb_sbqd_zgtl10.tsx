/**
 * title: 10.中国铁路总公司国际货物运输明细表
 * author: lincb
 */
const unitConfig: any = {};

// 配置项
unitConfig.grid_title = '（单位：元）';
unitConfig.module_key = 'CX_SJFX_SC_TSQK_TSSBQK_XZ_ZGTLZGSGJHWYSMXB';                            // 业务单元key，对应后端接口
unitConfig.page_id = 'CX_SJFX_SC_TSQK_TSSBQK_XZ_ZGTLZGSGJHWYSMXB';                                        // 页面id
unitConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
unitConfig.show_toolbar = true;                                                       // 是否开启工具栏，默认true开启
unitConfig.grid_selection_type = false;                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.layout_type = 'modal';                                                     // 页面类型，默认default 可选 default modal tabs
unitConfig.export_key = 'CX_SJFX_SC_TSQK_TSSBQK_XZ_ZGTLZGSGJHWYSMXB_PRINT_REPORT';
unitConfig.module_type = 'sjbb';

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '所属期', dataIndex: 'ssq', width: 90, fixed: 'left', render: { type: 'date', format: 'yyyyMM' } },
  { title: '月份', dataIndex: 'yf', width: 90, sorter: true },
  { title: '序号', dataIndex: 'sbxh', width: 80, sorter: true },
  { title: '运输类型代码', dataIndex: 'tlyslxDm', width: 120 },
  { title: '运输类型名称', dataIndex: 'tlyslxDm', width: 180, ellipsis: true, codeTable: 'CODE_STATIC_TZ_TLYSFS:01', filter: { type: 'Radio', codeTable: 'CODE_STATIC_TZ_TLYSFS:01', } },
  { title: '货票汇总金额', dataIndex: 'hphzje', width: 180, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' }, sorter: true },
  { title: '其他铁路运输企业金额', dataIndex: 'gsqttlysqyje', width: 180, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '汇缴成员国铁金额', dataIndex: 'gshjcygtje', width: 180, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '应扣除金额', dataIndex: 'ykcje1', width: 180, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' }, sorter: true },
  { title: '清算后计税金额', dataIndex: 'qshysfwjsje', width: 180, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' }, sorter: true },
  { title: '备注', dataIndex: 'bz', width: 150, ellipsis: true },
  { title: '申报标志', dataIndex: 'sbbz1', width: 120, render: { func: 'renderTzSbbz' }, },
  {
    title: '审核标志', dataIndex: 'shbz', width: 100, render: { func: 'renderTzShbz' },
    filter: {
      type: 'Radio',
      codeTable: 'CODE_DM_TZ_SBBZ:01',
    }
  },
];

// 配置项：筛选_普通筛选 页面最上方 第一层筛选
unitConfig.grid_filter_quick = [
  { label: '月份', name: 'yf', type: 'Input', searchButton: true },
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
  full: false,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
};
export default unitConfig;
