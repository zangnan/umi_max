import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 外贸企业出口退税进货明细申报
 * serviceKey: MDT_ZXSB_SB_MDT_TSJH_G
 * unitId: mdt_zxsb_sb_MDT_tsjh_gcb
 */

const unitConfig: any = {};

unitConfig.module_key = 'MDT_ZXSB_SB_MDT_TSJH_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'mdt_zxsb_sb_mdt_tsjh_gcb'; // 页面id
unitConfig.grid_title = '外贸企业出口退税进货明细申报'; // 列表标题，可选
unitConfig.form_title = '外贸企业出口退税进货明细申报'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量
unitConfig.export_key1 = 'SAAS_TSSB_MDT_MXCJ_TSJH_DC'; // 采集导出key
unitConfig.export_key2 = 'SAAS_SJGL_SWFKCX_MDT_WMQYCKTSJHMXSBB_DC'; // 统计导出key
unitConfig.export_key3 = 'SAAS_TSSB_MDT_SBMXCK_WMQYCKTSJHMXSBB_DC'; // 申报结果查询导出key

// 配置列表列
unitConfig.grid_columns = [
  {title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left'},
  {title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left'},
  {title: '关联号', dataIndex: 'glh', align: 'left', width: 150},
  {title: '税种', dataIndex: 'sz', align: 'left', width: 50},
  {title: '凭证种类', dataIndex: 'cktmspzlxDm', align: 'left', width: 120},
  {title: '凭证种类名称', dataIndex: 'cktmspzlxmc', align: 'left', width: 180, ellipsis: true},
  {title: '进货凭证号', dataIndex: 'jhpzh', align: 'left', width: 150, ellipsis: true},
  {title: '开票日期', dataIndex: 'kprq', align: 'left', width: 120, render: {type: 'date', format: 'YYYY-MM-DD'}},
  {title: '供货方纳税人识别号', dataIndex: 'ghfnsrsbh1', align: 'left', width: 200},
  {title: '出口商品代码', dataIndex: 'ckspDm', align: 'left', width: 120},
  {title: '商品名称', dataIndex: 'sbhgspmc', align: 'left', width: 180, ellipsis: true},
  {title: '计量单位', dataIndex: 'hgjldwmc', align: 'left', width: 90},
  {title: '数量', dataIndex: 'sl', align: 'right', width: 145, render: {type: 'number', format: '0,0.00000'}},
  /*{title: '计税金额', dataIndex: 'jsje', align: 'right', width: 140, sum: true, render: {type: 'number', format: '0,0.00'}},*/
  {title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
  {title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left'},
  {title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left'},
  {title: '关联号', dataIndex: 'glh', align: 'left', width: 150},
  {title: '税种', dataIndex: 'sz', align: 'left', width: 50},
  {title: '凭证种类', dataIndex: 'cktmspzlxDm', align: 'left', width: 120},
  {title: '凭证种类名称', dataIndex: 'cktmspzlxmc', align: 'left', width: 180, ellipsis: true},
  {title: '进货凭证号', dataIndex: 'jhpzh', align: 'left', width: 150, ellipsis: true},
  {title: '开票日期', dataIndex: 'kprq', align: 'left', width: 120, render: {type: 'date', format: 'YYYY-MM-DD'}},
  {title: '供货方纳税人识别号', dataIndex: 'ghfnsrsbh1', align: 'left', width: 200},
  {title: '出口商品代码', dataIndex: 'ckspDm', align: 'left', width: 120},
  {title: '商品名称', dataIndex: 'sbhgspmc', align: 'left', width: 180, ellipsis: true},
  {title: '计量单位', dataIndex: 'hgjldwmc', align: 'left', width: 90},
  {title: '数量', dataIndex: 'sl', align: 'right', width: 145, render: {type: 'number', format: '0,0.00000'}},
  /*{title: '计税金额', dataIndex: 'jsje', align: 'right', width: 140, sum: true, render: {type: 'number', format: '0,0.00'}},*/
  {title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
];

// 筛选项
unitConfig.filter_items = [
  {name: 'ssq', label: '所属期', type: 'Input'},
  {name: 'glh', label: '关联号', type: 'Input', codeTable: 'range|in:ut'},
  {name: 'cktmspzlxDm', label: '凭证种类', type: 'Select', 'allowClear': true, codeTable: 'code_dm_ckts_cktmspzlx:02'},
  {name: 'jhpzh', label: '进货凭证号', type: 'Input'},
  {name: 'ghfnsrsbh1', label: '供货方纳税人识别号', type: 'Input'},
  {name: 'ckspDm', label: '出口商品代码', type: 'Input'},
  {name: 'kprq', label: '开票日期', type: 'DatePicker', 'allowClear': true, range: true},
];

// 表单项
unitConfig.form_items = [
  {label: '基本信息', name: 'jbxx', type: 'GroupTitle', disabled: true},
  {label: 'ID', name: 'uuid', type: 'Hidden'},
  {label: '所属期', name: 'ssq', type: 'Input', rules: [{type: 'base_date', format: 'yyyyMM'}, {type: 'base_required'}, {type: 'base_string', range: [0, 6]}], eventOnBlur: 'ssq'},
  {label: '序号', name: 'sbxh', type: 'Input', eventOnBlur: 'sbxh'},
  {
    label: '关联号',
    tooltip: '①《生产企业出口货物及修理修配服务免抵退税申报明细表》填写“序号”；②《跨境销售服务及无形资产免抵退税申报明细表》填写“FW+序号”；③《国际运输（港澳台运输）、航天运输免抵退税申报明细表》填写“YS+序号”',
    name: 'glh',
    type: 'AutoComplete',
    showType: '2',
    rules: [{type: 'base_required'}, {type: 'base_type_number_english'}, {type: 'base_string', range: [0, 17]}, {func: 'glh01'}, {func: 'glh02'}],
    eventOnChange: 'glh'
  },
  {label: '发票信息', name: 'fpxx', type: 'GroupTitle', disabled: true},
  {
    label: '税种',
    name: 'sz',
    type: 'Select',
    'allowClear': true,
    codeTable: 'code_static_tmsjhmxsz_dm:02',
    rules: [{func: 'sz01'}, {type: 'base_required'}, {type: 'base_string', range: [0, 1]}],
    eventOnBlur: 'sz',
    eventOnChange: 'sz',
    disabled: true
  },
  {
    label: '凭证种类',
    name: 'cktmspzlxDm',
    type: 'Select',
    showType: '3',
    'showSearch': true,
    'allowClear': true,
    codeTable: 'code_dm_ckts_cktmspzlx:02',
    rules: [{type: 'base_required'}],
    eventOnChange: 'cktmspzlxDm01'
  },
  {
    label: '进货凭证号',
    name: 'jhpzh',
    type: 'Input',
    rules: [{type: 'base_required'}, {type: 'base_string', range: [0, 30]}, {func: 'jhpzh01'}, {func: 'jhpzh03'}, {func: 'jhpzh02'}],
    eventOnChange: 'jhpzh'
  },
  {
    label: '开票日期',
    name: 'kprq',
    type: 'DatePicker',
    'allowClear': true,
    format: 'YYYY-MM-DD',
    rules: [{type: 'base_required'}, {type: 'base_date', format: 'yyyyMMdd'}],
    eventOnChange: 'kprq'
  },
  {
    label: '供货方纳税人识别号',
    name: 'ghfnsrsbh1',
    type: 'Input',
    rules: [{func: 'ghgnsrsbh02'}, {type: 'base_type_number_english'}, {func: 'ghgnsrsbh01'}, {type: 'base_string', range: [0, 20]}]
  },
  {
    label: '出口商品代码',
    name: 'ckspDm',
    type: 'Input',
    disabled: true,
    rules: [{type: 'base_required'}, {type: 'base_type_number'}, {type: 'base_string', range: [0, 12]}],
    eventOnBlur: 'ckspDm'
  },
  {label: '商品名称', name: 'sbhgspmc', type: 'Input', rules: [{type: 'base_required'}, {type: 'base_string', range: [0, 254]}]},
  {label: '计量单位', name: 'hgjldwmc', type: 'Input', disabled: true, rules: [{type: 'base_string', range: [0, 75]}]},
  {
    label: '数量',
    name: 'sl',
    type: 'InputNumber',
    format: '0,0.00000',
    rules: [{type: 'base_number', length: 15, decimal: 5}, {func: 'sl01'}, {type: 'base_number', range: '+-'}],
    eventOnChange: 'sl'
  },
  /*{
    label: '计税金额',
    name: 'jsje',
    type: 'InputNumber',
    format: '0,0.00',
    rules: [{type: 'base_required'}, {type: 'base_number', length: 14, decimal: 2}, {type: 'base_number', range: '+-'}],
    eventOnChange: 'jsje'
  },*/
  {label: 'ST', name: 'st', type: 'Blank'},
  {
    label: '备注',
    name: 'bz',
    type: 'TextArea',
    rules: [{type: 'base_string', range: [0, 200]}], autoSize: { minRows: 3, maxRows: 3 }, layout: CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW},
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  add: true, // 是否显示增加按钮，默认关闭
  edit: true, // 是否显示修改按钮，默认关闭
  delete: true, // 是否显示删除按钮，默认关闭
  setting: true, // 是否显示设置按钮，默认关闭
  reload: true, // 是否显示刷新按钮，默认关闭
  full: true, // 是否显示全屏按钮，默认关闭
  ckts_download: true, // 是否显示导出按钮，默认关闭
  upload: true,  // 是否显示导入按钮，默认关闭
  ckts_sum: true, // 是否显示小计按钮，默认关闭
  ckts_order: 4, // 是否显示序号重排(默认规则：选择排序)按钮，默认关闭
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                       	// 是否显示编辑链接，默认关闭
  delete: false,                     	// 是否显示删除链接，默认关闭
};

unitConfig.customer_toolbar = [];
unitConfig.handle_columns = [];
export default unitConfig;

