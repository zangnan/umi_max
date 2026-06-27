import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 导出开票-发票管理
 */
const unitConfig: any = {};

// 配置项
unitConfig.module_key = 'CX_CKFPKJ_FPGL_DCKP';
unitConfig.page_id = 'CX_CKFPKJ_FPGL_DCKP';
unitConfig.grid_show_serial_number = false;                                           // 是否显示序号，可选
unitConfig.grid_click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
unitConfig.form_save_check = false;
unitConfig.grid_row_key = 'fpsqduuid';
unitConfig.module_type = 'QZ_type';
unitConfig.export_key = 'CX_CKFPKJ_FPGL_DCKP_ZF_EXCEL'; // 业务单元key，对应后端接口
unitConfig.gridParams = {
  initSearchModal: [
    { property: 'cxlx', value: "4", op: 'zdy' },
  ],
}

// 配置项：列表列
unitConfig.grid_columns = [
  { title: 'fpsqduuid', dataIndex: 'fpsqduuid', hidden: true }, 
  { title: 'zfbz1', dataIndex: 'zfbz1', hidden: true },
  { title: '单据号', dataIndex: 'djbh', width: 180, fixed: 'left', sorter: true, },
  { title: '发票号码', dataIndex: 'fphm', width: 180, ellipsis: true, },
  { title: '发票代码', dataIndex: 'fpdm', width: 120,},
  { title: '开票日期', dataIndex: 'kprq', width: 90,  render: { type: 'date', format: 'YYYY-MM-DD' }, },
  { title: '开票金额', dataIndex: 'fpje', width: 145, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '税额', dataIndex: 'fpse', width: 145, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '备注', dataIndex: 'fpbz', width: 190, ellipsis: true },
  {
    title: '发票种类', dataIndex: 'fplx', width: 170, ellipsis: true, render: { func: 'renderFpkjglFpzl' }
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
  // { title: '开票文件', dataIndex: 'kpwjmc', width: 260, render: { func: 'renderKpwj' } },
  // { title: '确认开票时间', dataIndex: 'qrkpsj', width: 140, render: { type: 'date', format: 'YYYY-MM-DD HH:mm' }, sorter: true, },
  // { title: '下载次数', dataIndex: 'xzcs', width: 80, align: 'right', fixed: 'right' },
  // { title: '撤回标志', dataIndex: 'chfpkjbz', width: 110,render: { func: 'renderFpkjglChbz' }, fixed: 'right', filter: {
  //     type: 'Select',
  //     list: [
  //       { text: '已撤回', value: 'Y' },
  //       { text: '未撤回', value: 'N' },
  //     ],
  //   }
  // },
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
  download:  true,
};

// 配置项：自定义工具栏
unitConfig.customer_toolbar = [
  { name: '设置作废标志', func: 'handleSzzfbz' }, // 原来
  { name: '导出开票结果', func: 'exportKpjg' }, // 原来
];

unitConfig.handle_columns = [];
export default unitConfig;