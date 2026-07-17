import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 发票开具管理配置项-作废发票
 * author: yxy
 */
const unitConfig: any = {};

// 配置项
unitConfig.module_key = 'CX_CKFPKJ_FPGL_ZXKP';
unitConfig.page_id = 'CX_CKFPKJ_FPGL_ZXKP_16';
unitConfig.grid_show_serial_number = false;                                           // 是否显示序号，可选
unitConfig.grid_click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
unitConfig.form_save_check = false;
unitConfig.grid_row_key = 'fpsqduuid';
unitConfig.module_type = 'QZ_type';
unitConfig.export_key = 'CX_CKFPKJ_FPGL_ZXKP_ZFP_EXCEL';
unitConfig.gridParams = {
  initSearchModal: [
    { property: 'cxlx', value: "10", op: 'zdy' },
  ],
}

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '报关单号', dataIndex: 'bgdhgbhjh', width: 180, fixed: 'left', ellipsis: { showTitle: false }, render: { func: 'renderFpkjglBgdh' } },
  { title: '单据号', dataIndex: 'djbh', width: 180, fixed: 'left', sorter: true },
  { title: '发票号码', dataIndex: 'fphm', width: 180, sorter: true, ellipsis: true },
  { title: '发票代码', dataIndex: 'fpDm', width: 140},
  { title: '开票日期', dataIndex: 'kprq', width: 110, render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: '开票金额', dataIndex: 'je', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '税额', dataIndex: 'se', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '备注', dataIndex: 'bz', width: 180, ellipsis: true },
  // { title: '原发票号码', dataIndex: 'yfphm', width: 160, sorter: true },
  // { title: '原发票代码', dataIndex: 'yfpdm', width: 140, sorter: true },
  {
    title: '发票种类', dataIndex: 'fpzlDm1', width: 150, render: { func: 'renderFpkjglFplx' }
  },
  {
    title: '开具方式', dataIndex: 'fpkjfsDm', width: 110, codeTable: 'CODE_DM_ZXSB_FPKJSJLY:01',
    filter: {
      type: 'Select',
      codeTable: 'CODE_DM_ZXSB_FPKJSJLY:01',
    },
  },
  { title: '申请作废时间', dataIndex: 'fpzfsj', width: 140, sorter: true, render: { type: 'date', format: 'YYYY-MM-DD HH:mm' }, },
  { title: '发票状态', dataIndex: 'fpkjztDm', width: 150, codeTable: 'CODE_DM_ZXSB_FPKJZT:05'},
  {
    title: '撤回标志', dataIndex: 'chfpkjbz', width: 120, render: { func: 'renderFpkjglChbz' }, filter: {
      type: 'Select',
      list: [
        { text: '已撤回', value: 'Y' },
        { text: '未撤回', value: 'N' },
      ],
    }
  },
];

// 配置项：列表筛选项
unitConfig.filter_items = [
  { name: 'bgdhgbhjh', label: '18位或后4位报关单号/统一编号', type: 'Input' },
  { name: 'fphm', label: '发票号码', type: 'Input' },
  { name: 'kprq', label: '开票日期', type: 'DatePicker', range: true },
  { name: 'fpzfsj', label: '申请作废时间', type: 'DatePicker', range: true },
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,
  reload: true,
  full: true,
  download: true,
};

// 配置项：自定义工具栏
unitConfig.customer_toolbar = [
  { name: '发票撤回', func: 'handleFpch' },
  // { name: '导出开票结果', func: 'exportKpjg' },
];

// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
unitConfig.grid_filter_quick = [
  {
    name: 'fplx',
    type: 'Select',
    defaultValue: '3',
    eventOnChange: 'handleOnChangeFplx',
    op: 'zdy',
    searchFlag: false,
    searchModelBz: false,
    list: [
      { name: '蓝字发票', value: '1', },
      { name: '红字发票', value: '2' },
      { name: '作废发票', value: '3' },
    ],
  },
];

unitConfig.handle_columns = [];
export default unitConfig;