/**
 * title: 发票开具管理配置项-红字发票
 * author: yxy
 */
const unitConfig: any = {};

// 配置项
unitConfig.unit_key = 'QUERY_CKFPKJ_FPGL_ZXKP_HZFP';
unitConfig.page_id = 'ckfp_fpkjgl_hzfp';
unitConfig.grid_show_serial_number = false;                                           // 是否显示序号，可选
unitConfig.click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
unitConfig.form_save_check = false;
unitConfig.grid_row_key = 'fpsqduuid';
unitConfig.grid_handle_width = 120;
unitConfig.module_type = 'sjbb';
unitConfig.export_key = 'SAAS_CKFPKJ_FPGL_ZXKP_HZFP_DC';

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '单据号', dataIndex: 'djbh', width: 180, fixed: 'left', sorter: true },
  { title: '发票号码', dataIndex: 'fphm', width: 180, sorter: true, ellipsis: true },
  { title: '发票代码', dataIndex: 'fpDm', width: 140, sorter: true },
  { title: '开票日期', dataIndex: 'kprq', width: 90, sorter: true, render: { type: 'date', format: 'yyyy-MM-DD' } },
  { title: '开票金额', dataIndex: 'je', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '税额', dataIndex: 'se', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '备注', dataIndex: 'bz', width: 180, ellipsis: true },
  {
    title: '发票种类', dataIndex: 'fpzlDm1', width: 150, render: { func: 'renderFpkjglFplx' }, filter: {
      type: 'Select',
      list: [
        { text: '增值税电子普通发票', value: '4' },
        { text: '增值税普通发票', value: '3' },
        { text: '数电票（普通发票）', value: '5' },
      ],
    }
  },
  {
    title: '开具方式', dataIndex: 'fpkjfsDm', width: 110, codeTable: ['CODE_DM_ZXSB_FPKJSJLY', '01'],
    filter: {
      type: 'Select',
      codeTable: ['CODE_DM_ZXSB_FPKJSJLY', '01'],
    },
  },
  { title: '报关单号', dataIndex: 'bgdhgbhjh', width: 180, ellipsis: { showTitle: false }, render: { func: 'renderFpkjglBgdh' } },
  { title: '申请开票时间', dataIndex: 'sqfpkjsj', width: 140, sorter: true, render: { type: 'date', format: 'yyyy-MM-DD HH:mm' }, },
  { title: '红字确认单编号', dataIndex: 'hzqrdbh', width: 180, ellipsis: true },
  { title: '红冲原因', dataIndex: 'hcyy', width: 130, codeTable: ['CODE_DM_ZXSB_HCYY',  '01'], 
    filter: {
      type: 'Select',
      codeTable: ['CODE_DM_ZXSB_HCYY', '01'],
    },
  },
  { title: '发票状态', dataIndex: 'fpkjztDm', width: 150, render: { func: 'renderFpkjglSjzt' }, ellipsis: true,
    filter: {
      type: 'Select',
      codeTable: ['CODE_DM_ZXSB_FPKJZT', '02'],
    },
    
  },
];

// 配置项：列表筛选项
unitConfig.filter_items = [
  { name: 'bgdhgbhjh', label: '18位或后4位报关单号/统一编号', type: 'Input' },
  { name: 'fphm', label: '发票号码', type: 'Input' },
  { name: 'fpDm', label: '发票代码', type: 'Input' },
  { name: 'kprq', label: '开票日期', type: 'DatePicker', range: true },
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,
  reload: true,
  full: true,
  tssb_download: true,
};

// 配置项：自定义工具栏
unitConfig.costomer_toobar = [
  // { name: '重新开票', func: 'handleFpkj' },
  // { name: '发票作废', func: 'handleFpzf' },
  { name: '更新状态', func: 'handleUpdate' },
  { name: '导出开票结果', func: 'exportKpjg' },
];

// 配置项：自定义操作列
unitConfig.handle_columns = [
  { name: '下载发票PDF', func: 'downloadPDF', display: 'downloadDisplay' },
  { name: '打印发票', func: 'printInvoice', display: 'printDisplay' },
];

// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
unitConfig.grid_filter_quick = [
  {
    name: 'fplx',
    type: 'Select',
    defaultValue: '2',
    onChange: 'handleOnChangeFplx',
    op: 'zdy',
    searchFlag: false,
    searchModelBz: false,
    list: [
      { label: '蓝字发票', value: '1', },
      { label: '红字发票', value: '2' },
      { label: '作废发票', value: '3' },
    ],
  },
];
// unitConfig.gridParams = {
//   initSearchModal: [
//     { property: 'fplx', value: "1", op: 'zdy' },
//   ],
// }
export default unitConfig;