/**
 * title: 06外贸企业调整申报
 * author: wxl
 */
const unitConfig: any = {};

// 配置项
// unitConfig.grid_title = '金额单位：元';
unitConfig.unit_key = 'CX_SJFX_WM_TSQK_TSSBQK_XZ_WMQYTZBSBB';                            // 业务单元key，对应后端接口
unitConfig.page_id = 'CX_SJFX_WM_TSQK_TSSBQK_XZ_WMQYTZBSBB';                                        // 页面id
unitConfig.show_toolbar = true;                                                       // 是否开启工具栏，默认true开启
unitConfig.layout_type = 'modal';                                                     // 页面类型，默认default 可选 default modal tabs
unitConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
unitConfig.grid_selection_type = false;                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.export_key = 'CX_SJFX_WM_TSQK_TSSBQK_XZ_WMQYTZBSBB_PRINT_REPORT';
unitConfig.module_type = 'sjbb';

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '申报年月', dataIndex: 'ssq', width: 90, fixed: 'left', render: { type: 'date', format: 'yyyyMM' } },
  { title: '申报批次', dataIndex: 'sbpc', width: 90, fixed: 'left' },
  { title: '序号', dataIndex: 'sbxh', width: 100, sorter: true },
  { title: '原申报关联号', dataIndex: 'yglh', width: 150 },
  { title: '原申报类型', dataIndex: 'wmqytzsblxmc', width: 220, ellipsis: true },
  { title: '备注', dataIndex: 'bz', ellipsis: true },
  { title: '申报标志', dataIndex: 'sbbz1', width: 90, render: { func: 'renderTzSbbz' }, },
  {
    title: '审核标志', dataIndex: 'shbz', width: 100, render: { func: 'renderTzShbz' },
    filter: {
      type: 'Radio',
      codeTable: 'CODE_DM_TZ_SBBZ:01',
    }
  },
];

unitConfig.grid_filter_quick = [
  { label: '原申报关联号', name: 'yglh', type: 'Input', searchButton: true },
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
