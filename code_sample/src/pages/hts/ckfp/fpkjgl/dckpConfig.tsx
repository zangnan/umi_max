/**
 * title: 发票开具管理配置项
 * author: yxy
 */
const unitConfig: any = {};

// 配置项
// unitConfig.grid_title = '发票开具管理';
unitConfig.unit_key = 'FPZS_FPGL_PAGER';
unitConfig.page_id = 'ckfp_fpkjgl';
unitConfig.grid_show_serial_number = false;                                           // 是否显示序号，可选
unitConfig.click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
unitConfig.form_save_check = false;
unitConfig.grid_row_key = 'fpsqduuid';
// unitConfig.export_key = 'FPZS_FPGL_PAGER'; // 业务单元key，对应后端接口

// 配置项：列表列
unitConfig.grid_columns = [
  { title: 'fpsqduuid', dataIndex: 'fpsqduuid', hidden: true }, 
  { title: 'zfbz1', dataIndex: 'zfbz1', hidden: true },
  { title: '单据号', dataIndex: 'djbh', width: 180, fixed: 'left', sorter: true, },
  { title: '数电票号码/发票号码', dataIndex: 'fphm', width: 180, fixed: 'left', sorter: true, ellipsis: true, },
  { title: '发票代码', dataIndex: 'fpdm', width: 120, fixed: 'left', sorter: true, },
  { title: '开票日期', dataIndex: 'kprq', width: 90, sorter: true, render: { type: 'date', format: 'yyyy-MM-DD' }, },
  { title: '开票金额', dataIndex: 'fpje', width: 145, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '税额', dataIndex: 'fpse', width: 145, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '备注', dataIndex: 'fpbz', width: 190, ellipsis: true },
  {
    title: '发票种类', dataIndex: 'fplx', width: 170, ellipsis: true, render: { func: 'renderFpkjglFpzl' }, filter: {
      type: 'Select',
      list: [
        { text: '增值税普通发票', value: '3' },
        { text: '增值税电子普通发票', value: '4' },
        { text: '数电票（普通发票）', value: '5' },
      ],
    }
  },
  {
    title: '开具方式', dataIndex: 'kjlx', width: 120, render: { func: 'renderFpkjglKjlx' }, filter: {
      type: 'Select',
      list: [
        { text: '按报关单开具', value: '1' },
        { text: '导入模板开具', value: '3' },
      ],
    }
  },
  { title: '报关单号', dataIndex: 'bgdhgbhjh', width: 165, ellipsis: { showTitle: false }, render: { func: 'renderFpkjglBgdh' } },
  { title: '开票文件', dataIndex: 'kpwjmc', width: 260, render: { func: 'renderKpwj' } },
  { title: '确认开票时间', dataIndex: 'qrkpsj', width: 140, render: { type: 'date', format: 'yyyy-MM-DD HH:mm' }, sorter: true, },
  { title: '下载次数', dataIndex: 'xzcs', width: 80, align: 'right', fixed: 'right' },
  { title: '数据状态', dataIndex: 'fpzt', width: 120, render: { func: 'renderFpkjglSjzt', }, fixed: 'right', filter: {
    type: 'Select',
    list: [
      { text: '待开票', value: 'DKP' },
      { text: '已下载', value: 'YDC' },
      { text: '已开票', value: 'YKP' },
      { text: '作废', value: 'ZF' },
      { text: '红冲', value: 'HC' },
    ],} 
  },
];

// 配置项：列表筛选项
unitConfig.filter_items = [
  { name: 'bgdhgbhjh', label: '18位或后4位报关单号/统一编号', type: 'Input' },
  { name: 'fphm', label: '数电票号码/发票号码', type: 'Input' },
  // { name: 'rqsz', label: '日期始止', type: itemType.DatePicker,picker: 'month', range: true },
  { name: 'kprq', label: '开票日期', type: 'DatePicker', range: true },
  // { name: 'sjzt', label: '数据状态', type: 'Select',
  //   list: [
  //     { name: '未开票', value: 'WKP' },
  //     { name: '已导出', value: 'YDC' },
  //     { name: '已开票', value: 'YKP' },
  //   ]
  // },
  { name: 'xzbz', label: '下载状态', type: 'Select',
    list: [
      { name: '已下载', value: 'Y' },
      { name: '未下载', value: 'N' },
    ]
  },
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,
  reload: true,
  full: true,
  download:  true,
  // ckts_download: true,                   // 是否显示导出，默认关闭
};

// 配置项：自定义工具栏
unitConfig.costomer_toobar = [
  { name: '自动开票', func: 'handleDownLoadKpwjToExportPath' },
  { name: '下载开票文件', func: 'handleDownLoadKpwj' },
  { name: '发票开具文件回填', func: 'handleFpkjht' },
  { name: '取消开票', func: 'handleThzwkpzt' },
  {
    name: '发票红冲', type: 'dropdown', list: [
      { name: '设置红冲标志', func: 'handleSzhcbz' },
      { name: '取消红冲标志', func: 'handleQxhcbz' },
    ]
  },
  {
    name: '发票作废', type: 'dropdown', list: [
      { name: '设置作废标志', func: 'handleSzzfbz' },
      { name: '取消作废标志', func: 'handleQxzfbz' },
    ]
  },
  { name: '导出开票结果', func: 'exportKpjg' },
];

export default unitConfig;