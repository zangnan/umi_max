/**
 * title: 出口发票开具-出口发票开具-数电票开具
 */ 
const unitConfig: any = {};

// 配置项
unitConfig.unit_key = 'CX_CKFPKJ_FPGL_ZXKP';
unitConfig.page_id = 'CX_CKFPKJ_FPGL_ZXKP';
unitConfig.grid_show_serial_number = false;                                           // 是否显示序号，可选
unitConfig.click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
unitConfig.form_save_check = false;
unitConfig.grid_row_key = 'fpsqduuid';
unitConfig.grid_handle_width = 120;
unitConfig.module_type = 'QZ_type';
unitConfig.export_key = '';
unitConfig.layout_type = 'tabs';

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '单据号', dataIndex: 'djbh', width: 180, fixed: 'left', sorter: true },
  // { title: '发票号码', dataIndex: 'fphm', width: 180, sorter: true, ellipsis: true },
  { title: '开票金额', dataIndex: 'je', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '税额', dataIndex: 'se', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '备注', dataIndex: 'bz', width: 220, ellipsis: true },
  {
    title: '发票种类', dataIndex: 'fpzlDm1', width: 170, ellipsis: true, render: { func: 'renderFpkjglFplx' } ,filter: {
      type: 'Select',
      list: [
        { text: '增值税普通发票', value: '3' },
        { text: '增值税电子普通发票', value: '4' },
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
  // { title: '失败原因', dataIndex: 'sbyy1', width: 180, ellipsis: true },
  // { title: '检查状态', dataIndex: 'jczt', width: 120, render: { func: 'renderFpkjglJczt' },
  //   filter: {
  //     type: 'Select',
  //     codeTable: ['CODE_DM_ZXSB_FPKJZT', '09'],
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
  { name: 'sqfpkjsj', label: '申请开票时间', type: 'DatePicker', range: true },
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,
  reload: true,
  full: true,
  download: true,
};

// 配置项：自定义工具栏
unitConfig.costomer_toobar = [
  // { name: '重新开票', func: 'handleFpkj' },
  // { name: '发票撤回', func: 'handleFpch' },
  // { name: '发票红冲', func: 'handleFphc' },
  // { name: '发票作废', func: 'handleFpzf' },
  // { name: '更新状态', func: 'handleUpdateLz' },
  // { name: '导出开票结果', func: 'exportKpjg' },
];

export default unitConfig;