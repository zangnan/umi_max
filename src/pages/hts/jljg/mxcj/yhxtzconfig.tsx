/**
 * title: 核销申报数据管理-已核销调整表
 * author: zxy
 */
import myUtil from '@/components/DDAssist/util';
import CONSTANTS from '@/components/DDAssist/constants';
const yhxtzConfig: any = {};

// 配置项
yhxtzConfig.page_id = 'mxcj_hgsjtz';                                                // 页面id
yhxtzConfig.module_key = 'JLJG_ZXSB_SB_JLJG_HGSJTZ_G';                               // 业务单元key，对应后端接口
yhxtzConfig.export_key = 'JLJGHX_HXSBSJGL_YHXSZCHGSJTZB_DC';                               // 业务单元key，对应后端接口
yhxtzConfig.export_large = true; // tssb_download 配合此导出使用，同步大数据量导出
yhxtzConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
yhxtzConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
yhxtzConfig.grid_click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
yhxtzConfig.form_title = '已核销手（账）册海关数据调整表';                                                  // 表单标题，可选
yhxtzConfig.layout_type = 'tabs';
yhxtzConfig.api_form_edit = `/hx/ty/crud/saveOrUpdate`;
// 导入
yhxtzConfig.import_key = 'JLJGHX_HXSBSJGL_YHXSZCHGSJTZB_DR';
yhxtzConfig.import_download_template = true; // 导入的模板下载 调用downloadTemplate
yhxtzConfig.import_style;

// 配置项：列表列
yhxtzConfig.grid_columns = [
  { title: '所属期', dataIndex: 'ssq', width: 80, fixed: 'left', sorter: true },
  { title: '申报批次', dataIndex: 'sbpc', width: 80, fixed: 'left' },
  { title: '序号', dataIndex: 'sbxh', width: 95, fixed: 'left' },
  { title: '申报核销手（账）册号', dataIndex: 'jljgszch', width: 215, ellipsis: true, sorter: true },
  { title: '核销起始日期', dataIndex: 'hxqsrq', width: 140, render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: '核销截止日期', dataIndex: 'hxjzrq', width: 140, render: { type: 'date', format: 'YYYY-MM-DD' } },
  {
    title: '进（出）口标识', dataIndex: 'jckbzDm', width: 145,codeTable: 'CODE_STATIC_JLJGHX_JCKBZ:01',
    filter: {
      type: 'Radio',
      codeTable: 'CODE_STATIC_JLJGHX_JCKBZ:01',
    }
  },
  { title: '报关单号', dataIndex: 'ckbgdh', width: 190,ellipsis: true },
  { title: '代理证明号', dataIndex: 'dlckhwzmhm', width: 190,ellipsis: true },
  { title: '监管方式代码', dataIndex: 'jgfsDm', width: 125 ,
    // filter: {
    //   type: 'Select',
    //   codeTable: 'CODE_DM_CKTS_HGJGFS:01',
    //   showCode: true,
    // }
  },
  { title: '监管方式名称', dataIndex: 'jgfsmc', width: 125, ellipsis: true,render: (text: any, record: any) => myUtil.code.getCodeValByKey(record.jgfsDm, 'CODE_DM_CKTS_HGJGFS:01')},
  { title: '进（出）口日期', dataIndex: 'ckrq1', width: 135, render: { type: 'date', format: 'YYYY-MM-DD' },sorter: true },
  { title: '美元到岸价', dataIndex: 'jljgmsjkljzcjsjgmy', width: 125, align: 'right', render: { type: 'number', format: '0,0.00' }, titleTooltip: '免税进口料件组成计税价格到岸价（美元）', }, // titleTooltip: '免税进口料件组成计税价格到岸价（美元）',
  { title: '人民币到岸价', dataIndex: 'jljgmsjkljzcjsjgrmb', width: 125, align: 'right', render: { type: 'number', format: '0,0.00' }, titleTooltip: '免税进口料件组成计税价格到岸价（人民币）', }, // titleTooltip: '免税进口料件组成计税价格到岸价（人民币）',
  { title: '海关实征关税和消费税', dataIndex: 'msjkljhgszgshxfs', width: 180, align: 'right', render: { type: 'number', format: '0,0.00' }, titleTooltip: '免税进口料件组成计税价格海关实征关税和消费税', }, // titleTooltip: '免税进口料件组成计税价格海关实征关税和消费税',
  { title: '进料组成计税价格合计', dataIndex: 'jljgmsjkljzcjsjg', width: 180, align: 'right', render: { type: 'number', format: '0,0.00' }, titleTooltip: '免税进口料件组成计税价格合计', }, // titleTooltip: '免税进口料件组成计税价格合计',
  { title: '美元销售额', dataIndex: 'sbckxsemy', width: 135, align: 'right', render: { type: 'number', format: '0,0.00' }, titleTooltip: '出口销售额（美元）', }, // titleTooltip: '出口销售额（美元）',
  { title: '人民币销售额', dataIndex: 'ckxse', width: 135, align: 'right', render: { type: 'number', format: '0,0.00' }, titleTooltip: '出口销售额（人民币）', }, // titleTooltip: '出口销售额（人民币）',
  { title: '所属年度', dataIndex: 'nd', width: 80, },
  { title: '备注', dataIndex: 'bz', width: 200, ellipsis: true },
];

// 配置项：筛选_普通筛选 页面最上方 第一层筛选
yhxtzConfig.filter_items = [
  { name: 'ssq', label: '所属期', type: 'Input' },
  {label: '申报批次', name: 'sbpc', type: 'Input'},
  { name: 'jljgszch', label: '申报核销手（账）册号', type: 'Input' },
  { name: 'ckbgdh', label: '报关单号', type: 'Input' },
  { name: 'dlckhwzmhm', label: '代理证明号', type: 'Input' },
  { name: 'jgfsDm', label: '监管方式代码', type: 'Select', showType: '3',showSearch: true, codeTable: 'CODE_DM_CKTS_HGJGFS:01' }
];

// 配置项：表单项
yhxtzConfig.form_items = [
  { label: 'ID', type: 'Hidden', name: 'uuid' },
  { label: '基本信息', type: 'GroupTitle', name: 'jbxx' },
  { label: '所属期', type: 'Input', name: 'ssq', rules: [
    { type: 'base_required'},
    { func: 'validatorSsq'},
    { func: 'ssq02' }
  ]  },
  { label: '申报批次', name: 'sbpc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbpc02' }] },
  { label: '序号', type: 'Input', name: 'sbxh', eventOnBlur: 'mxcjBlursbxh', rules: [{ type: 'base_required'},{ type: 'base_string', length: 8}]},
  { label: '手（账）册信息', type: 'GroupTitle', name: 'szcxx' },
  { label: '申报核销手（账）册号', type: 'Input', name: 'jljgszch',eventOnChange: 'checkYhxtzJljgszch', rules: [
    { type: 'base_required'},
    { func: 'validatorYhxtzSzch'},
    { type: 'base_string', range: 20}
  ] },
  { label: '核销起始日期', type: 'DatePicker', name: 'hxqsrq', format: 'YYYY-MM-DD',
    rules: [
      { func: 'validatorYhxtzHxqsrq' },
    ]
  },
  { label: '核销截止日期', type: 'DatePicker', name: 'hxjzrq', eventOnChange: 'yhxtzChangeHxjzrq', format: 'YYYY-MM-DD',
    rules: [
      { func: 'validatorYhxtzHxjzrq' },
    ]
  },
  { label: '所属年度', type: 'Input', name: 'nd' ,disabled: true},
  { label: '进（出）口标识', type: 'Select', name: 'jckbzDm', eventOnChange: 'checkYhxtzJckbz',
    codeTable: 'CODE_STATIC_JLJGHX_JCKBZ:01' , rules: [{ type: 'base_required'},] },
  { label: '报关单号', type: 'Input', name: 'ckbgdh', rules: [
      { func: 'validatorYhxtzBgdh'}, { type: 'base_type_number_english' }
    ], eventOnChange: 'yhxtzBgdZmToUpper'
  },
  { label: '代理证明号', type: 'Input', name: 'dlckhwzmhm',rules: [
    { type: 'base_string', range: 20},{ func: 'validatorYhxtzDlzm'},{ type: 'base_type_number_english' }
    ], eventOnChange: 'yhxtzDlzmZmToUpper'
  },
  { label: '进（出）口日期', type: 'DatePicker', name: 'ckrq1', format: 'YYYY-MM-DD',
    rules: [{ type: 'base_required'},]
  },
  { label: '美元销售额', type: 'InputNumber', name: 'sbckxsemy', format: '0,0.00',
    rules: [
      { type: 'base_number', length: 14, decimal: 2 },
      { func: 'validatorYhxtzmyxse' },
    ]
  },
  { label: '人民币销售额', type: 'InputNumber', name: 'ckxse', format: '0,0.00',
    rules: [
      { type: 'base_number', length: 14, decimal: 2 },
      { func: 'validatorYhxtzrmbxse' },
    ]
  },
  { label: '美元到岸价', type: 'InputNumber', name: 'jljgmsjkljzcjsjgmy', format: '0,0.00',
    rules: [
      { type: 'base_number', length: 14, decimal: 2 },
      { func: 'validatorYhxtzmydaj' },
    ]
  },
  { label: '人民币到岸价', type: 'InputNumber', name: 'jljgmsjkljzcjsjgrmb', format: '0,0.00',eventOnBlur: 'jsYhxtzJlzcjsjghj',
    rules: [
      { type: 'base_number', length: 14, decimal: 2 },
      { func: 'validatorYhxtzrmbdaj' },
    ]
  },
  { label: '海关实征关税和消费税', type: 'InputNumber', name: 'msjkljhgszgshxfs', format: '0,0.00',eventOnBlur: 'jsYhxtzJlzcjsjghj',
    rules: [
      { type: 'base_number', length: 14, decimal: 2 },
    ]
  },
  { label: '进料组成计税价格合计', type: 'InputNumber', name: 'jljgmsjkljzcjsjg', format: '0,0.00',
    rules: [
      { type: 'base_number', length: 14, decimal: 2 },
    ]
  },
  { label: '监管方式代码', type: 'Select', name: 'jgfsDm',eventOnChange: 'checkYhxtzJgfs', codeTable: 'CODE_DM_CKTS_HGJGFS:01' ,showType: '3',showSearch:true, rules: [{ type: 'base_required'},]},
  { label: '计算出口总值', type: 'InputNumber', name: 'jsckzz', format: '0,0.00', disabled: true, hidden: true },
  { label: '计算进口总值', type: 'InputNumber', name: 'jsjkzz', format: '0,0.00', disabled: true, hidden: true },
  { label: '其他信息', type: 'GroupTitle', name: 'qtxx' },
  {
    label: '备注', type: 'TextArea', name: 'bz',rules: [{ type: 'base_string', range: 200}], autoSize: { minRows: 3, maxRows: 3 }, layout: CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW},
];

// 配置项：工具栏
yhxtzConfig.toolbar_default = {
  add: true,                    // 是否显示增加按钮，默认开启
  delete: true,                // 是否显示删除按钮，默认开启
  setting: true,
  full: true,                   // 是否显示全屏按钮，默认开启
  ckts_download: false,               // 是否显示下载按钮，默认开启
  download: true,               // 是否显示下载按钮，默认开启
  upload: true,                 // 是否显示上传按钮，默认开启
  reload: true,                 // 是否显示刷新按钮，默认开启
  sum: true,                   // 是否显示小计按钮，默认关闭
  order: true,                 // 是否显示序号重排按钮，默认关闭
  edit: true,
  ckts_sum: true, // 是否显示小计按钮，默认关闭
  ckts_order: 3, // 是否显示序号重排(默认规则：选择排序)按钮，默认关闭
};

// 配置项：列表排序字段
yhxtzConfig.grid_setting_sort = [
  { col: '所属期', order: 'default', name: 'ssq' },
  { col: '序号', order: 'default', name: 'xh' },
  { col: '申报核销手（账）册号', order: 'default', name: 'szch' },
  { col: '核销起始日期', order: 'default', name: 'hxqssj' },
  { col: '核销截止日期', order: 'default', name: 'hxjzsj' }
];

// 配置项：自定义工具栏
yhxtzConfig.customer_toolbar= [
  // { name: '数据合并', key: 'sjhbtzb',func: 'handleSjhbTzbData'},
  { name: '批量删除', key: 'plsctzb', func: 'handlePlscTzbData'},
];

yhxtzConfig.handle_columns = [];
export default yhxtzConfig;
