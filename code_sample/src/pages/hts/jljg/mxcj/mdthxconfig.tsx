/**
 * title: 核销申报数据管理- 免抵退核销表
 * author: zxy
 */

const mdthxConfig: any = {};

// 配置项
mdthxConfig.page_id = 'mxcj_mdthx';                                                // 页面id
mdthxConfig.unit_key = 'JLJG_ZXSB_SB_JLJG_MDTHX_G';                                         // 业务单元key，对应后端接口
mdthxConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
mdthxConfig.click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
mdthxConfig.form_title = '进料加工业务免抵退税核销表';                                  // 表单标题，可选
mdthxConfig.layout_type = 'tabs';
mdthxConfig.grid_scroll_x = '1450px';
mdthxConfig.form_api_save = `${API_URL_BASE}/hx/ty/crud/saveOrUpdate`;
mdthxConfig.grid_api_import= `${API_URL_BASE}/yw/jljg/mxcj/mdthx/sjdr`;
mdthxConfig.export_key = 'JLJG_ZXSB_SB_JLJG_MDTHX_G';

// 配置项：列表列
mdthxConfig.grid_columns = [
  { title: '所属期', dataIndex: 'ssq', width: 80, fixed: 'left', sorter: true },
  { title: '申报批次', dataIndex: 'sbpc', width: 80, fixed: 'left' },
  { title: '序号', dataIndex: 'sbxh', width: 95, fixed: 'left' },
  { title: '申报核销手（账）册号', dataIndex: 'jljgszch', width: 215, ellipsis: true, sorter: true },
  { title: '核销起始日期', dataIndex: 'hxqsrq', width: 140, render: { type: 'date', format: 'yyyy-MM-DD' } },
  { title: '核销截止日期', dataIndex: 'hxjzrq', width: 140, render: { type: 'date', format: 'yyyy-MM-DD' } },
  { title: '所属年度', dataIndex: 'nd', width: 90 },
  { title: '实际分配率', dataIndex: 'jljgsjfpl', width: 105, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '已申报出口额', dataIndex: 'rmblaj', width: 125, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '应调免抵退', dataIndex: 'ytzmdtse', width: 125, align: 'right', render: { type: 'number', format: '0,0.00' },titleTooltip: '进料加工核销应调整免抵退税额', }, // titleTooltip: '进料加工核销应调整免抵退税额',
  { title: '应调不得免抵', dataIndex: 'mdtsbdmzhdkse', width: 125, align: 'right', render: { type: 'number', format: '0,0.00' }, titleTooltip: '进料加工核销应调整不得免征和抵扣税额'}, // titleTooltip: '进料加工核销应调整{br}不得免征和抵扣税额',
  { title: '数据来源', dataIndex: 'shbz', width: 100,  render: { func: 'sjlyFun'}}, // titleTooltip: '进料加工核销应调整{br}不得免征和抵扣税额',

  { title: '备注', dataIndex: 'bz', ellipsis: true },
];

// 配置项：筛选_普通筛选 页面最上方 第一层筛选
// mdthxConfig.filter_items = [
//   { name: 'ssq', label: '所属期', type: 'Input'},
//   { name: 'jljgszch', label: '申报核销手（账）册号', type: 'Input' },
// ];

// 配置项：自定义操作列
mdthxConfig.handle_columns = [
  { name: '明细统计', func: 'mdtshxMxtj', },
];


// 配置项：表单项
mdthxConfig.form_items = [
  { label: 'ID', type: 'Hidden', name: 'uuid' },
  { label: '基本信息', type: 'GroupTitle', name: 'jbxx' },
  { label: '所属期', type: 'Input', name: 'ssq',eventOnBlur: 'mdthxBlurMdthxSsq', rules: [
    { type: 'base_required'},
    { func: 'validatorSsq'},
    { func: 'ssq02'},
  ] },
  { label: '申报批次', name: 'sbpc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbpc02' }] },
  { label: '序号', type: 'Input', name: 'sbxh', eventOnBlur: 'mxcjBlursbxh', rules: [{ type: 'base_required'},{ type: 'base_string', length: 8}]  },
  { label: '手（账）册信息', type: 'GroupTitle', name: 'szcxx'},
  { label: '申报核销手（账）册号', type: 'Input', name: 'jljgszch',eventOnChange: 'checkMdthxJljgszch', eventOnBlur: 'mdthxBlurJljgszch', rules: [
    { type: 'base_required'},
    { func: 'validatorMdthxSzch'},
    { type: 'base_string', range: 20}
  ]},
  { label: '核销起始日期', type: 'DatePicker', name: 'hxqsrq',eventOnChange: 'mdthxChangeHxqsrq', format: 'YYYY-MM-DD',
    rules: [
      { func: 'validatorMdthxHxqsrq' },
    ]
  },
  { label: '核销截止日期', type: 'DatePicker', name: 'hxjzrq',eventOnChange: 'mdthxChangeHxjzrq', format: 'YYYY-MM-DD',
    rules: [
      { func: 'validatorMdthxHxjzrq' },
    ]
  },
  { label: '所属年度', type: 'Input', name: 'nd', readOnly: true },
  //根据需求删除eventOnBlur事件，等待电子税务局改完再次修改
  // { label: '实际分配率', type: 'InputNumber', name: 'jljgsjfpl', eventOnBlur: 'queryMdthxJe',format: '0,0.00000', rules: [
  //   { type: 'base_required'},
  //   { func: 'validatorMdthxFpl'},
  // ]  },
  { label: '实际分配率', type: 'InputNumber', name: 'jljgsjfpl',rules: [
    { type: 'base_required'},
    { func: 'validatorMdthxFpl'},
    { func: 'formatGsh'},
  ]  },
  { label: '应调免抵退', type: 'InputNumber', name: 'ytzmdtse', format: '0,0.00', readOnly: true , rules: [{ type: 'base_required'},] },
  { label: '应调不得免抵', type: 'InputNumber', name: 'mdtsbdmzhdkse', format: '0,0.00', readOnly: true , rules: [{ type: 'base_required'},] },
  { label: '已申报出口额', type: 'InputNumber', name: 'rmblaj', format: '0,0.00', readOnly: true, rules: [{ type: 'base_required'},]  },
  { label: '计算出口总值', type: 'InputNumber', name: 'jsckzz', format: '0,0.00', readOnly: true, hidden: true },
  { label: '计算进口总值', type: 'InputNumber', name: 'jsjkzz', format: '0,0.00', readOnly: true, hidden: true },
  { label: '其他信息', type: 'GroupTitle', name: 'qtxx' },
  {
    label: '备注', type: 'TextArea', name: 'bz', layout: {
      label: { xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3 },
      formItem: { xs: 16, sm: 16, md: 16, lg: 19, xl: 21, xxl: 21 },
    },rules: [{ type: 'base_string', range: 200}]
  },
];

// 配置项：工具栏
mdthxConfig.toolbar_default = {
  setting: true,
  add: true,                    // 是否显示增加按钮，默认开启
  delete: true,                // 是否显示删除按钮，默认开启
  full: true,                   // 是否显示全屏按钮，默认开启
  ckts_download: true,              // 是否显示下载按钮，默认开启
  // upload: true,//{name: '导入', key: 'mxcjMdthxSjdc', func: 'handleMxcjMdthxSjdc'},                // 是否显示上传按钮，默认开启
  reload: true,                 // 是否显示刷新按钮，默认开启
  sum: true,                   // 是否显示小计按钮，默认关闭
  order: true,                      // 是否显示序号重排按钮，默认关闭
  edit: true,
  ckts_sum: true, // 是否显示小计按钮，默认关闭
  ckts_order: 3, // 是否显示序号重排(默认规则：选择排序)按钮，默认关闭
};

// 配置项：自定义工具栏
mdthxConfig.costomer_toobar = [
  { name: '重新计算分配率', key: 'mdthxCxjsfpl', func: 'handleMdthxCxjsfpl' },
  { name: '批量删除', key: 'plscmxb', func: 'handlePlscMxbData'},
];

mdthxConfig.filter_items = [
  {label: '所属期', name: 'ssq', type: 'Input'},
  {label: '申报批次', name: 'sbpc', type: 'Input'},
  {label: '申报核销手（账）册号', name: 'jljgszch', type: 'Input'},
];

export default mdthxConfig;
