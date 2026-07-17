import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 申报结果查询的免抵退核销表
 * author: zxy
 */
const mdthxConfig: any = {};

// 配置项
mdthxConfig.module_key = 'ZXSB_SB_JLJG_MDTHX_J';                                         // 业务单元key，对应后端接口
mdthxConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
mdthxConfig.grid_selection_type = false;                                               // 列表首选项类别，默认 checkbox，可选 false radio checkbox
mdthxConfig.toolbar_show_grid_checked_num = false;                                                // 工具栏左侧是否显示数据条数及选中数，默认显示
mdthxConfig.layout_type = 'tabs';

// 配置项：列表列
mdthxConfig.grid_columns = [
  { title: '所属期', dataIndex: 'ssq', width: 80, fixed: 'left', sorter: {multiple: 1} },
  { title: '申报批次', dataIndex: 'sbpc', width: 80, fixed: 'left'},
  { title: '序号', dataIndex: 'sbxh', width: 105, fixed: 'left' },
  { title: '申报核销手（账）册号', dataIndex: 'jljgszch', width: 215, ellipsis: true, sorter: {multiple: 1}, fixed: 'left' },
  { title: '核销起始日期', dataIndex: 'hxqsrq', width: 140, sorter: {multiple: 1}, render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: '核销截止日期', dataIndex: 'hxjzrq', width: 140, sorter: {multiple: 1}, render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: '所属年度', dataIndex: 'nd', width: 90 },
  { title: '实际分配率', dataIndex: 'jljgsjfpl', width: 105, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '已申报出口额', dataIndex: 'rmblaj', width: 125, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '应调免抵退', dataIndex: 'ytzmdtse', width: 125, titleTooltip: '进料加工核销应调整免抵退税额', align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '应调不得免抵', dataIndex: 'mdtsbdmzhdkse', width: 125, titleTooltip: '进料加工核销应调整不得免征和抵扣税额', align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '综合实际分配率', dataIndex: 'yhxsczczhsjfpl', width: 135, titleTooltip: '已核销手册（账册）综合实际分配率', align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '分配率使用年度', dataIndex: 'fplsynd', width: 115, hidden: true },
  { title: '计算实际分配率', dataIndex: 'jssjfpl', width: 115, align: 'right', render: { type: 'number', format: '0,0.00000' }, hidden: true },
  { title: '计算应调免抵退', dataIndex: 'jsjljghxytzmdtse', width: 125, align: 'right', render: { type: 'number', format: '0,0.00' }, hidden: true },
  { title: '计算应调不得免抵', dataIndex: 'jsjljghxytzbdmzhdkse', width: 125, align: 'right', render: { type: 'number', format: '0,0.00' }, hidden: true },
  { title: '计算进口总值', dataIndex: 'jsjkzz', width: 125, align: 'right', render: { type: 'number', format: '0,0.00' }, hidden: true },
  { title: '计算出口总值', dataIndex: 'jsckzz', width: 125, align: 'right', render: { type: 'number', format: '0,0.00' }, hidden: true },
  { title: '免抵退税年月', dataIndex: 'mdtsny', width: 105 },
  { title: '是否使用', dataIndex: 'sybz', width: 95, codeTable: 'CODE_STATIC_JLJGHX_SFBZ:01' },
  { title: '复审应调免抵退', dataIndex: 'fsjljghxytzmdtse', width: 135, titleTooltip: '复审进料加工核销应调整免抵退税额', align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '复审应调不得免抵', dataIndex: 'fsjljghxytzbdmzhdkse', width: 150, titleTooltip: '复审进料加工核销应调整不得免征和抵扣税额', align: 'right', render: { type: 'number', format: '0,0.00' } }, 
  { title: '备注', dataIndex: 'bz', width: 200, ellipsis: true },
  // { title: '审核标志', dataIndex: 'shbz', width: 110, codeTable: 'CODE_STATIC_JLJGHX_SFBZ:01'},
];

// 配置项：筛选_普通筛选 页面最上方 第一层筛选
// mdthxConfig.filter_items = [
//   { name: 'ssq', label: '所属期', type: 'Input' }, // , placeholder: ['aaa', 'bbb'] 日期范围的placeholder属性需要传递数组
//   { name: 'jljgszch', label: '手（账）册号', type: 'Input' },
// ];

// 配置项：工具栏
mdthxConfig.toolbar_default = {
  add: false,                   // 是否显示增加按钮，默认开启
  delete: false,                // 是否显示删除按钮，默认开启
  ckts_download: true,               // 是否显示下载按钮，默认开启
  upload: false,                // 是否显示上传按钮，默认开启
  setting: true,
  full: true,                   // 是否显示全屏按钮，默认开启
  reload: true,                 // 是否显示刷新按钮，默认开启
  ckts_sum: true,                     // 是否显示小计按钮，默认关闭
};

// 配置项：列表操作列
mdthxConfig.grid_handle_columns_default = {
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
};

mdthxConfig.grid_filter_quick = [
  {
    label: '数据标识',
    name: 'sjbs',
    searchModelBz: false,
    searchFlag: false,
    type: 'Select',
    defaultValue: 'JLJG_ZXSB_SB_JLJG_MDTHX_J',
    eventOnChange: 'mdthxSjbsOnChange',
    list: [
      { name: '已申报数据', value: 'JLJG_ZXSB_SB_JLJG_MDTHX_J' },
      { name: '已核销数据', value: 'JLJG_ZXSB_SB_JLJG_MDTHX_F' },
    ],
  },
  { label: '所属期', name: 'ssq', type: 'Input', width: '2w' },
  { label: '申报批次', name: 'sbpc', type: 'Input', width: '2w' },
  { label: '申报核销手（账）册号', name: 'jljgszch', type: 'Input', width: '3w', searchButton: true },
];

mdthxConfig.customer_toolbar = [
  { name: '报表打印', key: 'mdthxCxBbdy', func: 'handleMdthxHgsjtzCxBbdy' },
];

mdthxConfig.handle_columns = [];
export default mdthxConfig;