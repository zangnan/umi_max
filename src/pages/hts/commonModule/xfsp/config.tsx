import CONSTANTS from '@/components/DDAssist/constants';

const unitConfig: any = {};

// 配置项
// api 列表查询
unitConfig.module_key = 'CX_SAAS_SJGL_XFSPCX';
unitConfig.page_id = 'CX_SAAS_SJGL_XFSPCX';
unitConfig.grid_show_serial_number = false;                                           // 是否显示序号，可选
unitConfig.grid_click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
unitConfig.form_save_check = false;
unitConfig.grid_scroll_x = '1200px';                             // 默认700px
unitConfig.grid_row_key = 'uuid';
unitConfig.form_title = '';
unitConfig.module_type = 'QZ_type';
unitConfig.export_key = 'CX_SAAS_SJGL_XFSPCX_DC';
unitConfig.export_large = true; // tssb_download 配合此导出使用，同步大数据量导出

unitConfig.gridParams = {
  initSearchModal: [
    { property: 'cdDm', value: "020902", op: 'zdy' },
  ]
}

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '缴款书号码', dataIndex: 'ssjkshm', align: 'left', width: 180, ellipsis: true, render: { func: 'renderJkshmYl' } },
  { title: '填发日期', dataIndex: 'tfrq', width: 140, align: 'center', render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: '货物劳务名称', dataIndex: 'hwhyslwmc', width: 180, align: 'left', ellipsis: true },
  { title: '课税数量', dataIndex: 'kssl', width: 110, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '计量单位', dataIndex: 'jldwmc', width: 90 },
  { title: '商品单价', dataIndex: 'spdj', width: 110, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '计税金额', dataIndex: 'jsje', width: 140, sum: true, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '法定税率', dataIndex: 'fdsl', width: 100, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '征收率', dataIndex: 'zsl', width: 100, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '实缴税额', dataIndex: 'sjje', width: 110, sum: true, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '税种', dataIndex: 'sz', align: 'left', width: 50 },
  { title: '销货发票号码', dataIndex: 'fphm', align: 'center', width: 160, ellipsis: true },
  { title: '缴款单位（人）纳税人识别号', align: 'center', dataIndex: 'jkdwrnsrsbh', width: 200, ellipsis: true },
  { title: '缴款单位（人）纳税人名称', align: 'left', dataIndex: 'jkdwrnsrmc', width: 160, ellipsis: true },
  { title: '购货方纳税人识别号', dataIndex: 'ghfnsrsbh', width: 180, ellipsis: true },
  { title: '购货方纳税人名称', align: 'left', dataIndex: 'ghfnsrmc', width: 160, ellipsis: true },
  { title: '预算科目代码', align: 'left', dataIndex: 'yskmDm', width: 160, ellipsis: true },
  { title: '预算科目名称', align: 'left', dataIndex: 'yskmmc', width: 160, ellipsis: true },
  { title: '预算科目级次', align: 'left', dataIndex: 'yskmjc', width: 160, ellipsis: true },
  { title: '备注', dataIndex: 'bz', width: 200, ellipsis: true },

];

unitConfig.filter_items = [
  { name: 'ssjkshm', label: '缴款书号码', type: 'Input' },
  { name: 'tfrq', label: '填发日期', type: 'DatePicker', range: true, isLabel: true },
  { name: 'fphm', label: '销货发票号码', type: 'Input', },
  { name: 'jkdwrxx', label: '缴款单位纳税人识别号/名称', type: 'Input', },
  { name: 'tzsxbz', label: '台账数据', type: 'Select', codeTable: 'CODE_STATIC_SJGL_TZSJ:01'},
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,
  reload: true,
  full: true,
  download: false,
  ckts_download: false,
  download: true
};


unitConfig.customer_toolbar = [
  { name: '台账筛选', key: '3', func: 'importTzsx' },
  { name: '打印', key: '1719970930', func: 'xfsfpFuncDy' },
];


unitConfig.handle_columns = [];
export default unitConfig;
