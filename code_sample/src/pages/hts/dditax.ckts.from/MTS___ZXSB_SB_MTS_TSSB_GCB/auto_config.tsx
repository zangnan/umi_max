/**
 * title: 外贸企业出口退税出口明细申报
 * serviceKey: MTS_ZXSB_SB_MTS_TSSB_G
 * unitId: mts_zxsb_sb_mts_tssb_gcb
*/

const unitConfig: any = {};

unitConfig.unit_key = 'MTS_ZXSB_SB_MTS_TSSB_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'mts_zxsb_sb_mts_tssb_gcb'; // 页面id
unitConfig.grid_title = '外贸企业出口退税出口明细申报'; // 列表标题，可选
unitConfig.form_title = '外贸企业出口退税出口明细申报'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量
unitConfig.export_key1 = 'SAAS_TSSB_MXCJ_CKMX_DC'; // 采集导出key
unitConfig.export_key2 = 'SAAS_SJGL_SWFKCX_MTS_WMQYCKTSCKMXSBB_DC'; // 统计导出key
unitConfig.export_key3 = 'SAAS_TSSB_MTS_SBMXCK_WMQYCKTSCKMXSBB_DC'; // 申报结果查询导出key
unitConfig.gridParams = {
  initSearchModal: [
    { property: 'cdDm', value: "26030101", op: 'zdy' },
  ]
}

// 配置列表列
unitConfig.grid_columns = [
	{ title: '申报年月', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '申报批次', dataIndex: 'sbpc', align: 'left', width: 90, fixed: 'left' },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '关联号', dataIndex: 'glh', align: 'left', width: 150},
	{ title: '出口货物报关单号', dataIndex: 'ckbgdh', align: 'left', width: 180},
	{ title: '代理出口货物证明号', dataIndex: 'dlzmh', align: 'left', width: 280},
	{ title: '出口发票号', dataIndex: 'ckfph', align: 'left', width: 150, ellipsis: true},
	{ title: '退税额', dataIndex: 'tse', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '出口日期', dataIndex: 'ckrq1', align: 'left', width: 120, render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '出口商品代码', dataIndex: 'ckspDm', align: 'left', width: 120},
	{ title: '出口商品名称', dataIndex: 'sbhgspmc', align: 'left', width: 180, ellipsis: true},
	{ title: '计量单位', dataIndex: 'hgjldwmc', align: 'left', width: 90},
	{ title: '申报商品代码', dataIndex: 'sbspDm', align: 'left', width: 150},
	{ title: '申报商品名称', dataIndex: 'sbspmc', align: 'left', width: 180, ellipsis: true},
	{ title: '出口数量', dataIndex: 'cksl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '美元离岸价', dataIndex: 'mylaj', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '退（免）税业务类型', dataIndex: 'cktmsywlxdmjh', align: 'left', width: 160},
	{ title: '退（免）税业务类型名称', dataIndex: 'cktmsywlxmcjh', align: 'left', width: 180, ellipsis: true},
	{ title: '国内启运方式', dataIndex: 'gnqyfsDm', align: 'left', width: 120},
	{ title: '国内启运方式名称', dataIndex: 'gnqyfsmc', align: 'left', width: 180, ellipsis: true},
	{ title: '海关总署认证企业类型', dataIndex: 'hgzsrzqylxDm', align: 'left', width: 160},
	{ title: '海关总署认证企业类型名称', dataIndex: 'hgzsrzqylxmc', align: 'left', width: 240, ellipsis: true},
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '申报年月', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '申报批次', dataIndex: 'sbpc', align: 'left', width: 90, fixed: 'left' },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '关联号', dataIndex: 'glh', align: 'left', width: 150},
	{ title: '出口货物报关单号', dataIndex: 'ckbgdh', align: 'left', width: 180},
	{ title: '代理出口货物证明号', dataIndex: 'dlzmh', align: 'left', width: 280},
	{ title: '出口发票号', dataIndex: 'ckfph', align: 'left', width: 150, ellipsis: true},
	{ title: '退税额', dataIndex: 'tse', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '出口日期', dataIndex: 'ckrq1', align: 'left', width: 120, render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '出口商品代码', dataIndex: 'ckspDm', align: 'left', width: 120},
	{ title: '出口商品名称', dataIndex: 'sbhgspmc', align: 'left', width: 180, ellipsis: true},
	{ title: '计量单位', dataIndex: 'hgjldwmc', align: 'left', width: 90},
	{ title: '申报商品代码', dataIndex: 'sbspDm', align: 'left', width: 150},
	{ title: '申报商品名称', dataIndex: 'sbspmc', align: 'left', width: 180, ellipsis: true},
	{ title: '出口数量', dataIndex: 'cksl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '美元离岸价', dataIndex: 'mylaj', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '退（免）税业务类型', dataIndex: 'cktmsywlxdmjh', align: 'left', width: 160},
	{ title: '退（免）税业务类型名称', dataIndex: 'cktmsywlxmcjh', align: 'left', width: 180, ellipsis: true},
	{ title: '国内启运方式', dataIndex: 'gnqyfsDm', align: 'left', width: 120},
	{ title: '国内启运方式名称', dataIndex: 'gnqyfsmc', align: 'left', width: 180, ellipsis: true},
	{ title: '海关总署认证企业类型', dataIndex: 'hgzsrzqylxDm', align: 'left', width: 160},
	{ title: '海关总署认证企业类型名称', dataIndex: 'hgzsrzqylxmc', align: 'left', width: 240, ellipsis: true},
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
	{ title: '是否不予退税', dataIndex: 'bytsbz', align: 'left', width: 150, render: { func: 'bytsbz' } },
	{ title: '是否不予办理', dataIndex: 'byblbz', align: 'left', width: 150, render: { func: 'byblbz' } },
	{ title: '是否暂不办理', dataIndex: 'zbblbz', align: 'left', width: 150, render: { func: 'zbblbz' } },
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'ssq', label: '申报年月', type: 'Input' },
	{ name: 'sbpc', label: '申报批次', type: 'Input' },
	{ name: 'cktmsywlxdmjh', label: '退（免）税业务类型', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['code_dm_ckts_cktmsywlx',  '01'] },
	{ name: 'ckspDm', label: '出口商品代码', type: 'Input' },
	{ name: 'glh', label: '关联号', type: 'Input', codeTable: ['range|in',  'ut'] },
	{ name: 'ckfph', label: '出口发票号', type: 'Input' },
	{ name: 'ckbgdh', label: '出口货物报关单号', type: 'Input' },
	{ name: 'dlzmh', label: '代理出口货物证明号', type: 'Input' },
	{ name: 'ckrq1', label: '出口日期', type: 'DatePicker', 'allowClear': true, range: true},
  { name: 'tzsxbz', label: '台账数据', type: 'Select', codeTable: ['CODE_STATIC_SJGL_TZSJ', '01'] },
];

// 表单项
unitConfig.form_items = [
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle', readOnly: true},
	{ label: 'ID', name: 'uuid', type: 'Hidden' },
	{ label: '申报年月', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}], eventOnChange: 'ssq' },
	{ label: '申报批次', name: 'sbpc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbpc01' }, { func: 'sbpc02' }], eventOnChange: 'sbpc' },
	{ label: '序号', name: 'sbxh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbxh02' }], eventOnBlur: 'sbxh' },
	{ label: '关联号', name: 'glh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { type: 'base_string', range: [0, 17]}, { func: 'glh01' }]},
	{ label: '出口信息', name: 'ckxx', type: 'GroupTitle', readOnly: true},
	{ label: '出口货物报关单号', name: 'ckbgdh', type: 'Input', rules: [{ type: 'base_string', length: '21' }, { type: 'base_type_number_english' }, { func: 'ckbgdh06' }], eventOnChange: 'ckbgdh' },
	{ label: '代理出口货物证明号', name: 'dlzmh', type: 'Input', rules: [{ type: 'base_string', range: [0, 20]}, { type: 'base_type_number_english' }, { func: 'dlzmh01' }], eventOnFocus: 'dlzmh', eventOnChange: 'dlckhwzmhm' },
	{ label: '出口发票号', name: 'ckfph', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 30]}]},
	{ label: '出口日期', name: 'ckrq1', type: 'DatePicker', 'allowClear': true, format: 'yyyy-MM-DD', rules: [{ type: 'base_required' }, { type: 'base_date', format: 'yyyyMMdd' }, { func: 'ckrq101' }, { func: 'ckrq102' }], eventOnChange: 'ckrq1' },
	{ label: '出口商品代码', name: 'ckspDm', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { type: 'base_string', range: [0, 12]}], eventOnFocus: 'ckspDm', eventOnBlur: 'ckspDm' },
	{ label: '出口商品名称', name: 'sbhgspmc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 254]}]},
	{ label: '计量单位', name: 'hgjldwmc', type: 'Input', readOnly: true, rules: [{ type: 'base_string', range: [0, 75]}]},
	{ label: '申报商品代码', name: 'sbspDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['code_dm_cs_ckts_cksp', '03'], eventOnChange: 'sbspDm2', eventOnFocus: 'sbspDm' },
	{ label: '申报商品名称', name: 'sbspmc', type: 'Input', readOnly: true, rules: [{ type: 'base_string', range: [0, 500]}]},
	{ label: '出口数量', name: 'cksl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 15, decimal: 5}, { type: 'base_number', range: '+' }]},
	{ label: '美元离岸价', name: 'mylaj', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+' }], eventOnBlur: 'mylaj' },
	{ label: '美元汇率', name: 'myhl', type: 'Hidden', format: '0,0.00000' },
	{ label: '人民币离岸价', name: 'rmblaj', type: 'Hidden', format: '0,0.00' },
	{ label: '其他信息', name: 'qtxx', type: 'GroupTitle', readOnly: true},
	{ label: '退（免）税业务类型', name: 'cktmsywlxdmjh', type: 'Select', showType: '4', 'showSearch': true, 'mode': 'multiple', eventOnChange: 'cktmsywlxdmjh', 'allowClear': true, codeTable: ['code_dm_ckts_cktmsywlx', '10'], rules: [{ type: 'base_string', range: [0, 30]}, { func: 'cktmsywlxdmjh01' }]},
	{ label: '退（免）税业务类型名称', name: 'cktmsywlxmcjh', type: 'Input', readOnly: true, rules: [{ type: 'base_string', range: [0, 75]}]},
	{ label: '国内启运方式', name: 'gnqyfsDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['code_dm_ckts_gnqyfs', '01'], rules: [{ func: 'gnqyfsDm01' }], eventOnChange: 'gnqyfsDm' },
	{ label: '海关总署认证企业类型', name: 'hgzsrzqylxDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['code_dm_ckts_hgzsrzqylx', '01'], rules: [{ func: 'hgzsrzqylxDm01' }], eventOnChange: 'hgzsrzqylxDm' },
	{ label: 'ST', name: 'st', type: 'Blank' },
	{ label: '备注', name: 'bz', type: 'TextArea', autoSize: { minRows: 2, maxRows: 2}, layout: { label: { xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3}, formItem: { xs: 16, sm: 16, md: 16, lg: 19, xl: 21, xxl: 21 } }, rules: [{ type: 'base_string', range: [0, 200]}, { func: 'bz01' }]},
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  add: true, // 是否显示增加按钮，默认关闭
  edit: true, // 是否显示修改按钮，默认关闭
  delete: true, // 是否显示删除按钮，默认关闭
  setting: true, // 是否显示设置按钮，默认关闭
  reload: true, // 是否显示刷新按钮，默认关闭
  full: true, // 是否显示全屏按钮，默认关闭
  ckts_download: false, // 是否显示导出按钮，默认关闭
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

