import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 出口发票开具-出口发票开具-发票作废
 * author: yxy
 */
const unitConfig: any = {};

// 配置项
unitConfig.module_key = 'CX_CKFPKJ_FPGL_ZXKP'; // 在线开票-出口发票开具-发票作废
unitConfig.page_id = 'CX_CKFPKJ_FPGL_ZXKP';
unitConfig.grid_show_serial_number = false;                                           // 是否显示序号，可选
unitConfig.grid_click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
unitConfig.form_save_check = false;
unitConfig.grid_row_key = 'fpsqduuid';
unitConfig.grid_handle_width = 120;
unitConfig.module_type = 'QZ_type';
unitConfig.export_key = 'CX_CKFPKJ_FPGL_ZXKP_FPZF_EXCEL';
unitConfig.gridParams = {
  initSearchModal: [
    { property: 'cxlx', value: '4', op: 'zdy' },
  ],
}

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '单据号', dataIndex: 'djbh', width: 180, fixed: 'left', sorter: true },
  { title: '发票号码', dataIndex: 'fphm', width: 180, sorter: true, ellipsis: true },
  { title: '发票代码', dataIndex: 'fpDm', width: 120,  sorter: true, },
  { title: '开票日期', dataIndex: 'kprq', width: 90, sorter: true, render: { type: 'date', format: 'YYYY-MM-DD' }, },
  { title: '开票金额', dataIndex: 'je', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '税额', dataIndex: 'se', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '备注', dataIndex: 'bz', width: 180, ellipsis: true },
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
  { title: '报关单号', dataIndex: 'bgdhgbhjh', width: 180, ellipsis: { showTitle: false }, render: { func: 'renderFpkjglBgdh' } },
  // { title: '申请开票时间', dataIndex: 'sqfpkjsj', width: 140, sorter: true, render: { type: 'date', format: 'YYYY-MM-DD HH:mm' }, },
  // { title: '失败原因', dataIndex: 'sbyy1', width: 180, ellipsis: true },
  // { title: '检查状态', dataIndex: 'jczt', width: 120, render: { func: 'renderFpkjglJczt' },
  //   filter: {
  //     type: 'Select',
  //     codeTable: 'CODE_DM_ZXSB_FPKJZT:09',
  //   },
  // },
  // { title: '修改标志', dataIndex: 'xgbz', width: 110,render: { func: 'renderFpkjglXgbz' }, filter: {
  //   type: 'Select',
  //   list: [
  //     { text: '已修改', value: 'Y' },
  //     { text: '未修改', value: 'N' },
  //   ],
  // } },
];

// 配置项：列表筛选项
unitConfig.filter_items = [
  { name: 'bgdhgbhjh', label: '18位或后4位报关单号/统一编号', type: 'Input' },
  { name: 'fphm', label: '发票号码', type: 'Input' },
  { name: 'kprq', label: '开票日期', type: 'DatePicker', range: true },
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
  { name: '发票作废', func: 'handleFpzf' },
  { name: '导出开票结果', func: 'exportKpjg' },
];

unitConfig.handle_columns = [];
export default unitConfig;