/**
 * title: 05出口货物离岸价差异原因说明表
 * author: wxl
 */
const unitConfig: any = {};

// 配置项
unitConfig.grid_title = '（单位：元、美元）';
unitConfig.module_key = 'CX_SJFX_SC_TSQK_TSSBQK_XZ_CKHWLAJCYYYSMB';                            // 业务单元key，对应后端接口
unitConfig.page_id = 'CX_SJFX_SC_TSQK_TSSBQK_XZ_CKHWLAJCYYYSMB';                                        // 页面id
unitConfig.show_toolbar = true;                                                       // 是否开启工具栏，默认true开启
unitConfig.grid_selection_type = false;                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.layout_type = 'modal';                                                     // 页面类型，默认default 可选 default modal tabs
unitConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
unitConfig.export_key = 'CX_SJFX_SC_TSQK_TSSBQK_XZ_CKHWLAJCYYYSMB_PRINT_REPORT';
unitConfig.module_type = 'sjbb';

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '所属期', dataIndex: 'ssq', width: 90, fixed: 'left', render: { type: 'date', format: 'yyyyMM' } },
  { title: '序号', dataIndex: 'sbxh', width: 90, sorter: true },
  { title: '出口发票号', dataIndex: 'ckfph', width: 140 },
  { title: '出口发票美元离岸价', dataIndex: 'ckfpmylaj', width: 180, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '出口发票人民币离岸价', dataIndex: 'ckfprmblaj', width: 180, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '出口报关单号码', dataIndex: 'ckbgdh', width: 190, sorter: true },
  { title: '出口报关单美元离岸价', dataIndex: 'mylaj', width: 180, render: { type: 'number', format: '0,0.00' }, align: 'right', sum: true },
  { title: '出口报关单人民币离岸价', dataIndex: 'rmblaj', width: 180, render: { type: 'number', format: '0,0.00' }, align: 'right', sum: true },
  { title: '人民币离岸价差异额', dataIndex: 'ckfphckbgdrmblajcye', width: 180, sorter: true, render: { type: 'number', format: '0,0.00' }, align: 'right', sum: true },
  { title: '人民币离岸价差异率', dataIndex: 'ckfphckbgdrmblajcyl', width: 160, sorter: true, render: { type: 'number', format: '0,0.00000' }, align: 'right' },
  { title: '差异原因说明', dataIndex: 'yysm', width: 120, ellipsis: true },
  { title: '申报标志', dataIndex: 'sbbz1', width: 90, render: { func: 'renderTzSbbz' }, },
  {
    title: '审核标志', dataIndex: 'shbz', width: 110, render: { func: 'renderTzShbz' },
    filter: {
      type: 'Radio',
      codeTable: 'CODE_DM_TZ_SBBZ:01',
    }
  },
];

// 配置项：筛选_普通筛选 页面最上方 第一层筛选
unitConfig.grid_filter_quick = [
  { label: '出口报关单号码', name: 'ckbgdh', type: 'Input', searchButton: true },
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
