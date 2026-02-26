/**
* title: 出口明细申报
* serviceKey: MTS_TSSB_G
* unitId: mts_mts_tssb
*/

const unitConfig: any = {};

unitConfig.module_key = 'MTS_TSSB_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'mts_mts_tssb'; // 页面id
unitConfig.grid_title = '出口明细申报'; // 列表标题，可选
unitConfig.grid_show_serial_number = true; // 列表：是否显示序号，默认不显示
unitConfig.grid_border = false; // 列表：边框，默认true
unitConfig.form_title = '出口明细申报'; // 表单标题，可选
unitConfig.form_layout_type = 'horizontal'; // 表单整体一列或多列布局: horizontal vertical 2 3 4 6 8 12
unitConfig.form_width = 1200; // 表单：宽度，默认1200，可选 480 720 960 1200 max
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox

// 配置列表列
unitConfig.grid_columns = [
		{ title: '申报年月', dataIndex: 'ssq', align: 'left', width: 90, sorter: true, fixed: 'left' },
		{ title: '申报批次', dataIndex: 'sbpc', align: 'left', width: 90, sorter: true, fixed: 'left' },
		{ title: '关联号', dataIndex: 'glh', align: 'left', width: 150},
		{ title: '报关单号', dataIndex: 'ckbgdh', align: 'left', width: 180, ellipsis: true},
		{ title: '代理证明号', dataIndex: 'dlzmh', align: 'left', width: 280},
		{ title: '退税额', dataIndex: 'tse', align: 'right', width: 140, sum: true, 'sum2': true, render: { type: 'number', format: '0,0.00' } },
		{ title: '出口日期', dataIndex: 'ckrq', align: 'left', width: 95, render: { type: 'date', format: 'yyyy-MM-DD' } },
		{ title: '商品代码', dataIndex: 'ckspDm', align: 'left', width: 120},
		{ title: '商品名称', dataIndex: 'sbhgspmc', align: 'left', width: 180, ellipsis: true},
		{ title: '出口数量', dataIndex: 'cksl', align: 'right', width: 140, render: { type: 'number', format: '0,0.0000' } },
		{ title: '美元离岸价', dataIndex: 'mylaj', align: 'right', width: 140, sum: true, 'sum2': true, render: { type: 'number', format: '0,0.00' } },
		{ title: '业务类型', dataIndex: 'ywlxdmjh', align: 'left', width: 160},
		{ title: '业务类型名称', dataIndex: 'ywlxmcjh', align: 'left', width: 180, ellipsis: true},
		{ title: '是否不予退税', dataIndex: 'bytsbz', align: 'left', width: 150, render: { func: 'bytsbz' } }
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'ssq', label: '所属期', placeholder: '所属期', type: 'Input' },
	{ name: 'sbpc', label: '申报批次', type: 'Input' },
	{ name: 'ywlxdmjh', label: '业务类型', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: 'code_static_bgd_sbyw_dm' },
	{ name: 'ckspDm', label: '商品代码', type: 'Input' },
	{ name: 'glh', label: '关联号', type: 'Input', range: true},
	{ name: 'ckbgdh', label: '报关单号', type: 'Input' },
];

// 筛选项 工具栏区域
unitConfig.grid_filter_quick = [
	{ name: 'dlzmh', label: '代理证明号', type: 'Input' },
	{ name: 'ckrq', label: '出口日期', type: 'DatePicker', 'allowClear': true, range: true},
];

// 表单项
unitConfig.form_items = [
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle', readOnly: true},
	{ label: 'ID', name: 'uuid', type: 'Hidden' },
	{ label: '申报年月', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }]},
	{ label: '申报批次', name: 'sbpc', type: 'Input', rules: [{ func: 'sbpc02' }], eventOnBlur: 'sbpc', eventOnFocus: 'sbpc', eventOnChange: 'sbpc' },
	{ label: '序号', name: 'sbxh', type: 'Input' },
	{ label: '关联号', name: 'glh', type: 'Input' },
	{ label: '出口信息', name: 'ckxx', type: 'GroupTitle', readOnly: true},
	{ label: '报关单号', name: 'ckbgdh', type: 'Input', rules: [{ type: 'base_string', length: '21' }, { type: 'base_type_number_english' }]},
	{ label: '代理证明号', name: 'dlzmh', type: 'Input' },
	{ label: '出口发票号', name: 'ckfph', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 30]}]},
	{ label: '出口日期', name: 'ckrq', type: 'DatePicker', 'allowClear': true, format: 'yyyy-MM-DD', rules: [{ type: 'base_date', format: 'yyyyMMdd' }]},
	{ label: '出口商品代码', name: 'ckspDm', type: 'Input', rules: [{ type: 'base_type_number' }]},
	{ label: '出口商品名称', name: 'sbhgspmc', type: 'Input' },
	{ label: '计量单位', name: 'hgjldwmc', type: 'Input', readOnly: true},
	{ label: '申报商品代码', name: 'sbspDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: 'code_dm_cs_ckts_cksp'},
	{ label: '申报商品名称', name: 'sbspmc', type: 'Input', readOnly: true},
	{ label: '退税率', name: 'tsl', type: 'InputNumber', format: '0,0.0000', rules: [{ type: 'base_number', range: '+0' }]},
	{ label: '出口数量', name: 'cksl', type: 'InputNumber', format: '0,0.0000', rules: [{ type: 'base_number', length: 14, decimal: 4}, { type: 'base_number', range: '+' }]},
	{ label: '美元离岸价', name: 'mylaj', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_number', range: '+-' }]},
	{ label: '其他信息', name: 'qtxx', type: 'GroupTitle', readOnly: true},
	{ label: '业务类型', name: 'cktmsywlxdmjh', type: 'Select', showType: '4', 'showSearch': true, 'mode': 'multiple', eventOnChange: 'cktmsywlxdmjh', 'allowClear': true, codeTable: 'code_static_bgd_sbyw_dm'},
	{ label: '业务类型名称', name: 'cktmsywlxmcjh', type: 'Input', readOnly: true},
	{ label: '国内启运方式', name: 'gnqyfsDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: 'code_dm_ckts_gnqyfs'},
	{ label: '备注', name: 'bz', type: 'TextArea', autoSize: { minRows: 2, maxRows: 2}, layout: { label: { xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3}, formItem: { xs: 16, sm: 16, md: 16, lg: 19, xl: 21, xxl: 21 } }},
];

// 配置项：工具栏
unitConfig.toolbar_default = {
	add: true, // 是否显示增加按钮，默认关闭
	edit: true, // 是否显示修改按钮，默认关闭
	delete: true, // 是否显示删除按钮，默认关闭
	setting: true, // 是否显示设置按钮，默认关闭
	reload: true, // 是否显示刷新按钮，默认关闭
	full: true, // 是否显示全屏按钮，默认关闭
	download: true, // 是否显示导出按钮，默认关闭
	upload: true,  // 是否显示导入按钮，默认关闭
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
	edit: true, // 是否显示编辑链接，默认关闭
	delete: true, // 是否显示删除链接，默认关闭
};

// 配置项：自定义工具栏
unitConfig.customer_toolbar = [
	{ name: '开票', key: 'kp', func: 'handleKp' },
	{ name: '合并', key: 'hb', func: 'handleHb' },
];

// 配置项：自定义操作列
unitConfig.handle_columns = [
	{ name: '预览', key: 'yl', func: 'handleYl' },
	{ name: '详情', key: 'xq', func: 'handleXq' },
];

export default unitConfig;

