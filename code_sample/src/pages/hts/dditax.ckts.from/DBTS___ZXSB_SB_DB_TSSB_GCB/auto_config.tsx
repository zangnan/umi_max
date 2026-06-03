/**
 * title: 代办退税明细
 * serviceKey: DBTS_ZXSB_SB_DB_TSSB_G
 * unitId: dbts_zxsb_sb_db_tssb_gcb
*/

const unitConfig: any = {};

unitConfig.unit_key = 'DBTS_ZXSB_SB_DB_TSSB_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'dbts_zxsb_sb_db_tssb_gcb'; // 页面id
unitConfig.grid_title = '外贸综合服务企业代办退税申报'; // 列表标题，可选
unitConfig.form_title = '外贸综合服务企业代办退税申报'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量
unitConfig.export_key1 = 'SAAS_DBTS_MXCJ_WZFDBTS_DC'; // 采集导出key
unitConfig.export_key2 = 'SAAS_SJGL_SWFKCX_DBTS_WZFQYDBTSBB_DC'; // 统计导出key
unitConfig.export_key3 = 'SAAS_TSSB_DBTS_SBMXCK_WZFQYDBTSBB_DC'; // 申报结果查询导出key

// 配置列表列
unitConfig.grid_columns = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '申报批次', dataIndex: 'sbpc', align: 'left', width: 90, fixed: 'left' },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '委托生产企业社会信用代码/纳税号', dataIndex: 'wtdbtsscqynsrsbh', align: 'left', width: 200},
	{ title: '出口报关单号', dataIndex: 'ckbgdh', align: 'left', width: 180},
	{ title: '出口日期', dataIndex: 'ckrq1', align: 'left', width: 120, render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '出口商品代码', dataIndex: 'ckspDm', align: 'left', width: 120},
	{ title: '出口商品名称', dataIndex: 'hgspmc', align: 'left', width: 180, ellipsis: true},
	{ title: '申报商品代码', dataIndex: 'sbspDm', align: 'left', width: 120},
	{ title: '申报商品名称', dataIndex: 'sbspmc', align: 'left', width: 180, ellipsis: true},
	{ title: '计量单位', dataIndex: 'hgjldwmc', align: 'left', width: 90},
	{ title: '出口数量', dataIndex: 'cksl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '美元离岸价', dataIndex: 'mylaj', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '代办退税专用发票号', dataIndex: 'dbtswspzhm', align: 'left', width: 200},
	{ title: '开票日期', dataIndex: 'kprq', align: 'left', width: 120, render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '计税金额', dataIndex: 'jsje', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '征税率', dataIndex: 'zssl', align: 'right', width: 100, render: { type: 'number', format: '0,0.0000' } },
	{ title: '退税率', dataIndex: 'tsl', align: 'right', width: 100, render: { type: 'number', format: '0,0.0000' } },
	{ title: '代办退税税额', dataIndex: 'dbtsse', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '货物类型代码', dataIndex: 'hwlxDm', align: 'left', width: 135},
	{ title: '货物类型名称', dataIndex: 'hwlxmc', align: 'left', width: 180, ellipsis: true},
	{ title: '业务类型代码', dataIndex: 'cktmsywlxdmjh', align: 'left', width: 135},
	{ title: '业务类型名称', dataIndex: 'cktmsywlxmcjh', align: 'left', width: 180, ellipsis: true},
	{ title: '红字冲减原因代码', dataIndex: 'hzcjyyDm', align: 'left', width: 180, ellipsis: true},
	{ title: '红字冲减原因名称', dataIndex: 'hzcjyymc', align: 'left', width: 180, ellipsis: true},
	{ title: '国内启运方式', dataIndex: 'gnqyfsDm', align: 'left', width: 120},
	{ title: '国内启运方式名称', dataIndex: 'gnqyfsmc', align: 'left', width: 180, ellipsis: true},
	{ title: '海关总署认证企业类型', dataIndex: 'hgzsrzqylxDm', align: 'left', width: 200},
	{ title: '海关总署认证企业类型名称', dataIndex: 'hgzsrzqylxmc', align: 'left', width: 240, ellipsis: true},
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '申报批次', dataIndex: 'sbpc', align: 'left', width: 90, fixed: 'left' },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '委托生产企业社会信用代码/纳税号', dataIndex: 'wtdbtsscqynsrsbh', align: 'left', width: 200},
	{ title: '出口报关单号', dataIndex: 'ckbgdh', align: 'left', width: 180},
	{ title: '出口日期', dataIndex: 'ckrq1', align: 'left', width: 120, render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '出口商品代码', dataIndex: 'ckspDm', align: 'left', width: 120},
	{ title: '出口商品名称', dataIndex: 'hgspmc', align: 'left', width: 180, ellipsis: true},
	{ title: '申报商品代码', dataIndex: 'sbspDm', align: 'left', width: 120},
	{ title: '申报商品名称', dataIndex: 'sbspmc', align: 'left', width: 180, ellipsis: true},
	{ title: '计量单位', dataIndex: 'hgjldwmc', align: 'left', width: 90},
	{ title: '出口数量', dataIndex: 'cksl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '美元离岸价', dataIndex: 'mylaj', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '代办退税专用发票号', dataIndex: 'dbtswspzhm', align: 'left', width: 200},
	{ title: '开票日期', dataIndex: 'kprq', align: 'left', width: 120, render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '计税金额', dataIndex: 'jsje', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '征税率', dataIndex: 'zssl', align: 'right', width: 100, render: { type: 'number', format: '0,0.0000' } },
	{ title: '退税率', dataIndex: 'tsl', align: 'right', width: 100, render: { type: 'number', format: '0,0.0000' } },
	{ title: '代办退税税额', dataIndex: 'dbtsse', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '货物类型代码', dataIndex: 'hwlxDm', align: 'left', width: 135},
	{ title: '货物类型名称', dataIndex: 'hwlxmc', align: 'left', width: 180, ellipsis: true},
	{ title: '业务类型代码', dataIndex: 'cktmsywlxdmjh', align: 'left', width: 135},
	{ title: '业务类型名称', dataIndex: 'cktmsywlxmcjh', align: 'left', width: 180, ellipsis: true},
	{ title: '红字冲减原因代码', dataIndex: 'hzcjyyDm', align: 'left', width: 180, ellipsis: true},
	{ title: '红字冲减原因名称', dataIndex: 'hzcjyymc', align: 'left', width: 180, ellipsis: true},
	{ title: '国内启运方式', dataIndex: 'gnqyfsDm', align: 'left', width: 120},
	{ title: '国内启运方式名称', dataIndex: 'gnqyfsmc', align: 'left', width: 180, ellipsis: true},
	{ title: '海关总署认证企业类型', dataIndex: 'hgzsrzqylxDm', align: 'left', width: 200},
	{ title: '海关总署认证企业类型名称', dataIndex: 'hgzsrzqylxmc', align: 'left', width: 240, ellipsis: true},
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'ssq', label: '所属期', type: 'Input' },
	{ name: 'sbpc', label: '申报批次', type: 'Input' },
	{ name: 'wtdbtsscqynsrsbh', label: '委托生产企业社会信用代码/纳税号', type: 'Input' },
	{ name: 'sbxh', label: '序号', type: 'Input' },
	{ name: 'ckbgdh', label: '出口报关单号', type: 'Input' },
	{ name: 'ckspDm', label: '出口商品代码', type: 'Input' },
	{ name: 'dbtswspzhm', label: '代办退税专用发票号', type: 'Input' },
	{ name: 'cktmsywlxdmjh', label: '业务类型代码', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['code_dm_ckts_cktmsywlx',  '05'] },
];

// 表单项
unitConfig.form_items = [
	{ label: 'UUID', name: 'uuid', type: 'Hidden' },
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle' },
	{ label: '所属期', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}, { func: 'ssq01' }]},
	{ label: '申报批次', name: 'sbpc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbpc02' }], eventOnBlur: 'sbpc' },
	{ label: '序号', name: 'sbxh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbxh02' }], eventOnBlur: 'sbxh' },
	{ label: '出口信息', name: 'ckxx', type: 'GroupTitle' },
	{ label: '委托生产企业社会信用代码/纳税号', name: 'wtdbtsscqynsrsbh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 20]}, { type: 'base_type_number_english' }, { func: 'wtdbtsscqynsrsbh02' }], eventOnBlur: 'wtdbtsscqynsrsbh' },
	{ label: '出口报关单号', name: 'ckbgdh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 21]}, { type: 'base_type_number_english' }], eventOnChange: 'ckbgdh' },
	{ label: '出口日期', name: 'ckrq1', type: 'DatePicker', 'allowClear': true, format: 'yyyy-MM-DD', rules: [{ type: 'base_required' }, { type: 'base_date', format: 'yyyyMMdd' }], eventOnChange: 'ckrq1' },
	{ label: '出口商品代码', name: 'ckspDm', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 20]}], eventOnBlur: 'ckspDm' },
	{ label: '出口商品名称', name: 'hgspmc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 254]}]},
	{ label: '申报商品代码', name: 'sbspDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['code_dm_cs_ckts_cksp', '03'], eventOnChange: 'sbspDm2' },
	{ label: '申报商品名称', name: 'sbspmc', type: 'Input', readOnly: true},
	{ label: '计量单位', name: 'hgjldwmc', type: 'Input', readOnly: true, rules: [{ type: 'base_string', range: [0, 12]}]},
	{ label: '出口数量', name: 'cksl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 15, decimal: 5}, { type: 'base_number', range: '+-' }]},
	{ label: '美元离岸价', name: 'mylaj', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+-' }]},
	{ label: '发票信息', name: 'fpxx', type: 'GroupTitle' },
	{ label: '代办退税专用发票号', name: 'dbtswspzhm', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 20]}], eventOnChange: 'dbtswspzhm' },
	{ label: '开票日期', name: 'kprq', type: 'DatePicker', 'allowClear': true, format: 'yyyy-MM-DD', rules: [{ type: 'base_required' }, { type: 'base_date', format: 'yyyyMMdd' }], eventOnChange: 'kprq' },
	{ label: '出口退税计税金额', name: 'jsje', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+-' }], eventOnBlur: 'jsje' },
	{ label: '征税率', name: 'zssl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 5, decimal: 2}, { type: 'base_number', range: '+-' }, { type: 'base_number', range: '+0' }], eventOnBlur: 'zssl' },
	{ label: '退税率', name: 'tsl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 5, decimal: 2}, { type: 'base_number', range: '+-' }, { type: 'base_number', range: '+0' }, { func: 'tsl01' }], eventOnBlur: 'tsl' },
	{ label: '申报代办退税税额', name: 'tse', type: 'InputNumber', readOnly: true, format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}]},
	{ label: '其他信息', name: 'qtxx', type: 'GroupTitle' },
	{ label: '货物类型代码', name: 'dbtsywlxDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['code_dm_ckts_dbtsywlx', '01'], rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 30]}], eventOnChange: 'dbtsywlxDm' },
	{ label: '货物类型名称', name: 'dbtsywlxmc', type: 'Input', readOnly: true, rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 50]}]},
	{ label: '业务类型', name: 'cktmsywlxdmjh', type: 'Select', showType: '4', 'showSearch': true, 'mode': 'multiple', eventOnChange: 'cktmsywlxdmjh', 'allowClear': true, codeTable: ['code_dm_ckts_cktmsywlx', '05']},
	{ label: '业务类型名称', name: 'cktmsywlxmcjh', type: 'Input', readOnly: true},
	{ label: '红字冲减原因', name: 'hzcjyyDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['code_dm_ckts_hzcjyy', '01'], rules: [{ func: 'hzcjyyDm01' }], disabled: true},
	{ label: '国内启运方式', name: 'gnqyfsDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['code_dm_ckts_gnqyfs', '01'], rules: [{ func: 'gnqyfsDm01' }], eventOnChange: 'gnqyfsDm' },
	{ label: '海关总署认证企业类型', name: 'hgzsrzqylxDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['code_dm_ckts_hgzsrzqylx', '01'], rules: [{ func: 'hgzsrzqylxDm01' }], eventOnChange: 'hgzsrzqylxDm' },
	{ label: 'ST', name: 'st', type: 'Blank' },
	{ label: '备注', name: 'bz', type: 'TextArea', autoSize: { minRows: 2, maxRows: 2}, layout: { label: { xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3}, formItem: { xs: 16, sm: 16, md: 16, lg: 19, xl: 21, xxl: 21 } }},
	{ label: '发票行号', name: 'hh', type: 'Hidden', readOnly: true},
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
  ckts_order: 3, // 是否显示序号重排(默认规则：选择排序)按钮，默认关闭
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                       	// 是否显示编辑链接，默认关闭
  delete: false,                     	// 是否显示删除链接，默认关闭
};

export default unitConfig;

