/**
 * title: 01外贸企业出口退税出口明细申报表
 * author: wxl
 */
const unitConfig: any = {};

// 配置项
unitConfig.grid_title = '（单位：元、美元）';
unitConfig.unit_key = 'CX_SJFX_WM_TSQK_TSSBQK_XZ_WMQYCKTSCKMXSBB';                            // 业务单元key，对应后端接口
unitConfig.page_id = 'CX_SJFX_WM_TSQK_TSSBQK_XZ_WMQYCKTSCKMXSBB';                                        // 页面id
unitConfig.show_toolbar = true;                                                       // 是否开启工具栏，默认true开启
unitConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
unitConfig.grid_selection_type = false;                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.layout_type = 'modal';                                                     // 页面类型，默认default 可选 default modal tabs
unitConfig.export_key = 'CX_SJFX_WM_TSQK_TSSBQK_XZ_WMQYCKTSCKMXSBB_PRINT_REPORT';
unitConfig.module_type = 'sjbb';

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '关联号', dataIndex: 'glh', width: 170, fixed: 'left', sorter: true },
  { title: '申报年月', dataIndex: 'ssq', width: 90, render: { type: 'date', format: 'yyyyMM' } },
  { title: '申报批次', dataIndex: 'sbpc', width: 90 },
  { title: '申报序号', dataIndex: 'sbxh', width: 90, sorter: true },
  { title: '出口发票号', dataIndex: 'ckfph', width: 140, ellipsis: true },
  { title: '出口日期', dataIndex: 'ckrq1', width: 90, sorter: true, render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: '报关单号', dataIndex: 'ckbgdh', width: 190, sorter: true },
  { title: '代理证明号', dataIndex: 'dlzmh', width: 190, sorter: true, ellipsis: true },
  { title: '美元离岸价', dataIndex: 'mylaj', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '出口商品代码', dataIndex: 'ckspDm', width: 120, ellipsis: true },
  { title: '出口商品名称', dataIndex: 'sbhgspmc', width: 180, ellipsis: true },
  // { title: '下载商品名称', dataIndex: 'xzspmc', width: 180, ellipsis: true },
  { title: '计量单位', dataIndex: 'hgjldwmc', width: 80, ellipsis: true },
  { title: '申报商品代码', dataIndex: 'sbspDm', width: 120, ellipsis: true },
  { title: '申报商品名称', dataIndex: 'sbspmc', width: 180, ellipsis: true },
  { title: '出口数量', dataIndex: 'cksl', width: 150, align: 'right', sum: true, render: { type: 'number', format: '0,0.00000' } },
  { title: '业务类型代码', dataIndex: 'cktmsywlxdmjh', width: 130 },
  { title: '业务类型名称', dataIndex: 'cktmsywlxmcjh', width: 160, ellipsis: true },
  { title: '国内启运方式', dataIndex: 'gnqyfsmc', width: 110, ellipsis: true },
  { title: '海关总署认证企业类型', dataIndex: 'rzqylxmc', width: 160, ellipsis: true, },
  { title: '备注', dataIndex: 'bz', width: 120, ellipsis: true },
  {
    title: '不予办理标志', dataIndex: 'byblbz', width: 120, align: 'left', render: { func: 'renderTzBz' },
    filter: {
      type: 'Radio',
      codeTable: 'CODE_STATIC_JLJGHX_SFBZ:01',
    }
  },
  { title: '不予退税标志', dataIndex: 'bytsbz', width: 120, align: 'left', render: { func: 'renderTzBz' },
    filter: {
      type: 'Radio',
      codeTable: 'CODE_STATIC_JLJGHX_SFBZ:01',
    }
  },
  { title: '暂不办理标志', dataIndex: 'zbblbz', width: 120, align: 'left', render: { func: 'renderTzBz' },
    filter: {
      type: 'Radio',
      codeTable: 'CODE_STATIC_JLJGHX_SFBZ:01',
    }
  },
  {
    title: '申报标志', dataIndex: 'sbbz1', width: 100, render: { func: 'renderTzSbbz' }
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
  { label: '出口日期', name: 'ckrq1', type: 'DatePicker', range: true, allowClear: true },
  { label: '出口商品代码', name: 'ckspDm', type: 'Input' },
  { name: 'cktmsywlxdmjh', label: '退（免）税业务类型', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: 'code_dm_ckts_cktmsywlx:06' },
  { label: '关联号', name: 'glh', type: 'Input' },
  { label: '报关单号', name: 'ckbgdh', type: 'Input' },
  { label: '代理证明号', name: 'dlzmh', type: 'Input' },
  { label: '出口发票号', name: 'ckfph', type: 'Input' },
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
