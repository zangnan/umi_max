/**
 * title: 外贸企业出口退税进货明细申报表
 * author: wxl
 */
const unitConfig: any = {};

// 配置项
unitConfig.grid_title = '（单位：元）';
unitConfig.unit_key = 'CX_SJFX_WM_TSQK_TSSBQK_XZ_WMQYCKTSJHMXSBB';                            // 业务单元key，对应后端接口
unitConfig.page_id = 'CX_SJFX_WM_TSQK_TSSBQK_XZ_WMQYCKTSJHMXSBB';                                        // 页面id
unitConfig.show_toolbar = true;                                                       // 是否开启工具栏，默认true开启
unitConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
unitConfig.layout_type = 'modal';                                                     // 页面类型，默认default 可选 default modal tabs
unitConfig.grid_selection_type = false;                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.export_key = 'CX_SJFX_WM_TSQK_TSSBQK_XZ_WMQYCKTSJHMXSBB_PRINT_REPORT';
unitConfig.module_type = 'sjbb';

unitConfig.grid_columns = [
  { title: '关联号', dataIndex: 'glh', width: 170, fixed: 'left', sorter: true },
  {
    title: '税种', dataIndex: 'sz', width: 90, codeTable: ['CODE_STATIC_DM_SZ', '01'],
    filter: {
      type: 'Radio',
      codeTable: ['CODE_STATIC_DM_SZ', '01'],
    }
  },
  { title: '申报年月', dataIndex: 'ssq', width: 90, sorter: true, render: { type: 'date', format: 'yyyyMM' } },
  { title: '申报批次', dataIndex: 'sbpc', width: 90, sorter: true },
  { title: '序号', dataIndex: 'sbxh', width: 100, sorter: true },
  { title: '发票号码', dataIndex: 'fphm', width: 120 },
  { title: '发票代码', dataIndex: 'fpDm', width: 120, sorter: true },
  {
    title: '凭证种类', dataIndex: 'cktmspzlxDm', width: 140, ellipsis: true, codeTable: ['CODE_STATIC_TZ_CKTMSPZLX', '01'],
    filter: {
      type: 'Select',
      codeTable: ['CODE_STATIC_TZ_CKTMSPZLX', '01']
    },
  },
  { title: '进货凭证号', dataIndex: 'jhpzh', width: 180 },
  { title: '供货方税号', dataIndex: 'ghfnsrsbh1', width: 180, ellipsis: true },
  { title: '开票日期', dataIndex: 'kprq', width: 110, sorter: true, render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: '出口商品代码', dataIndex: 'ckspDm', width: 120, ellipsis: true },
  { title: '商品名称', dataIndex: 'sbhgspmc', width: 170, ellipsis: true },
  // { title: '发票品名', dataIndex: 'hwhyslwmc', width: 140, ellipsis: true },
  { title: '计量单位', dataIndex: 'hgjldwmc', width: 100, ellipsis: true },
  { title: '数量', dataIndex: 'sl', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00000' } },
  { title: '计税金额', dataIndex: 'jsje', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '征税率', dataIndex: 'zssl', width: 100, align: 'right', render: { func: 'renderTslIsNumber2' } },
  { title: '退税率', dataIndex: 'tsl', width: 100, align: 'right', render: { func: 'renderTslIsNumber2' } },
  { title: '税额', dataIndex: 'zsse', width: 130, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '可退税额', dataIndex: 'tse', width: 140, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '备注', dataIndex: 'bz', width: 140, ellipsis: true },
  {
    title: '不予办理标志', dataIndex: 'byblbz', width: 120, align: 'left', render: { func: 'renderTzBz' },
    filter: {
      type: 'Radio',
      codeTable: ['CODE_STATIC_JLJGHX_SFBZ', '01'],
    }
  },
  {
    title: '不予退税标志', dataIndex: 'bytsbz', width: 120, align: 'left', render: { func: 'renderTzBz' },
    filter: {
      type: 'Radio',
      codeTable: ['CODE_STATIC_JLJGHX_SFBZ', '01'],
    }
  },
  {
    title: '暂不办理标志', dataIndex: 'zbblbz', width: 120, align: 'left', render: { func: 'renderTzBz' },
    filter: {
      type: 'Radio',
      codeTable: ['CODE_STATIC_JLJGHX_SFBZ', '01'],
    }
  },
  {
    title: '申报标志', dataIndex: 'sbbz1', width: 100, render: { func: 'renderTzSbbz' },
  },
  {
    title: '审核标志', dataIndex: 'shbz', width: 100, render: { func: 'renderTzShbz' },
    filter: {
      type: 'Radio',
      codeTable: ['CODE_DM_TZ_SBBZ', '01'],
    }
  },
];

unitConfig.filter_items = [
  { label: '开票日期', name: 'kprq', type: 'DatePicker', range: true, allowClear: true },
  { label: '关联号', name: 'glh', type: 'Input' },
  { label: '进货凭证号', name: 'jhpzh', type: 'Input' },
  { label: '供货方税号', name: 'ghfnsrsbh1', type: 'Input' },
  { label: '出口商品代码', name: 'ckspDm', type: 'Input' },
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
