/**
 * title: 03海关出口商品代码、名称、退税率调整对应表
 * author: wxl
 */
const unitConfig: any = {};

// 配置项
// unitConfig.grid_title = '金额单位：元';
unitConfig.unit_key = 'CX_SJFX_WM_TSQK_TSSBQK_XZ_HGCKSPDMMCTSLTZDYB';                            // 业务单元key，对应后端接口
unitConfig.page_id = 'CX_SJFX_WM_TSQK_TSSBQK_XZ_HGCKSPDMMCTSLTZDYB';                                        // 页面id
unitConfig.show_toolbar = true;                                                       // 是否开启工具栏，默认true开启
unitConfig.grid_selection_type = false;                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
unitConfig.grid_show_data_num = false;                          // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.layout_type = 'modal';                                  // 页面类型，默认default 可选 default modal tabs tz台账
unitConfig.export_key = 'CX_SJFX_WM_TSQK_TSSBQK_XZ_HGCKSPDMMCTSLTZDYB_PRINT_REPORT';
unitConfig.module_type = 'sjbb';

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '所属期', dataIndex: 'ssq', width: 90, fixed: 'left', render: { type: 'date', format: 'yyyyMM' } },
  { title: '申报批次', dataIndex: 'sbpc', width: 90, fixed: 'left'},
  { title: '序号', dataIndex: 'sbxh', width: 100, sorter: true },
  { title: '出口报关单号', dataIndex: 'ckbgdh', width: 180, sorter: true },
  { title: '报关单上的申报日期', dataIndex: 'hgckhwbgdsbrq', width: 170, sorter: true, render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: '出口日期', dataIndex: 'ckrq1', width: 110, sorter: true, render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: '调整前（报关单上的）商品代码', dataIndex: 'ckspDm', width: 220 },
  { title: '调整前（报关单上的）商品名称', dataIndex: 'sbhgspmc', width: 220, ellipsis: true },
  { title: '调整前（报关单上的）退税率', dataIndex: 'tsl', width: 200, align: 'right', render: { func: 'renderTslIsNumber2' } },
  { title: '调整后商品代码', dataIndex: 'tzhckspDm', width: 130 },
  { title: '调整后商品名称', dataIndex: 'tzhhgspmc', width: 130, ellipsis: true },
  { title: '调整后退税率', dataIndex: 'tzhtsl', width: 120, align: 'right', render: { func: 'renderTslIsNumber2' } },
  { title: '备注', dataIndex: 'bz', width: 120, ellipsis: true },
  { title: '申报标志', dataIndex: 'sbbz1', width: 80, render: { func: 'renderTzSbbz' }, },
  {
    title: '审核标志', dataIndex: 'shbz', width: 120, render: { func: 'renderTzShbz' },
    filter: {
      type: 'Radio',
      codeTable: ['CODE_DM_TZ_SBBZ', '01'],
    }
  },
];

unitConfig.grid_filter_quick = [
  { label: '出口日期', name: 'ckrq1', isLabel: true, type: 'DatePicker' },
  { label: '出口报关单号', name: 'ckbgdh', type: 'Input', searchButton: true, width: "5w" },
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
