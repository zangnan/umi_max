/**
* title: 进货明细申报
* serviceKey: MTS_TSJH_G
* unitId: mts_mts_tsjh
*/

const unitConfig: any = {};

unitConfig.module_key = 'MTS_TSJH_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'mts_mts_tsjh'; // 页面id
unitConfig.grid_title = '进货明细申报'; // 列表标题，可选
unitConfig.grid_show_serial_number = false; // 列表：是否显示序号，默认不显示
unitConfig.grid_border = true; // 列表：边框，默认true
unitConfig.grid_pagination = false; // 列表：分页，默认true
unitConfig.form_title = '进货明细申报'; // 表单标题，可选
unitConfig.form_layout_type = 'vertical'; // 表单整体一列或多列布局: horizontal vertical 2 3 4 6 8 12
unitConfig.form_width = 960; // 表单：宽度，默认1200，可选 480 720 960 1200 max
unitConfig.grid_selection_type = 'radio'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.api_grid_query = '/hx/ty/crud/queryPager2'; // api：列表查询

// 配置列表列
unitConfig.grid_columns = [
		{ title: '申报年月', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
		{ title: '合并列头', align: 'center', 'children': [{ title: '税种', dataIndex: 'sz', align: 'left', width: 50}, { title: '开票日期', dataIndex: 'kprq', align: 'left', width: 95, render: { type: 'date', format: 'yyyy-MM-DD' } }]},
		{ title: '纳税人识别号', dataIndex: 'ghfnsrsbh', align: 'left', width: 200}
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'ssq', label: '申报年月', type: 'Input' },
	{ name: 'sz', label: '税种', type: 'Select', 'allowClear': true, codeTable: 'code_static_bgd_sbyw_dm' },
	{ name: 'kprq', label: '开票日期', type: 'DatePicker', 'allowClear': true, range: true},
	{ name: 'ghfnsrsbh', label: '纳税人识别号', type: 'Input' },
];

// 筛选项 工具栏区域
unitConfig.grid_filter_quick = [
];

// 表单项
unitConfig.form_items = [
	{ label: 'ID', name: 'uuid', type: 'Hidden' },
	{ label: '申报年月', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }]},
	{ label: '申报批次', name: 'sbpc', type: 'Input' },
	{ label: '税种', name: 'sz', type: 'Select', 'allowClear': true, codeTable: 'code_static_bgd_sbyw_dm'},
	{ label: '进货凭证号', name: 'jhpzh', type: 'Input' },
	{ label: '开票日期', name: 'kprq', type: 'DatePicker', 'allowClear': true, format: 'yyyy-MM' },
	{ label: '纳税人识别号', name: 'ghfnsrsbh1', type: 'Input' },
	{ label: '备注', name: 'bz', type: 'TextArea', autoSize: { minRows: 2, maxRows: 2}, layout: { label: { xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3}, formItem: { xs: 16, sm: 16, md: 16, lg: 19, xl: 21, xxl: 21 } }},
];

// 配置项：工具栏
unitConfig.toolbar_default = {
	add: true, // 是否显示增加按钮，默认关闭
	edit: false, // 是否显示修改按钮，默认关闭
	delete: false, // 是否显示删除按钮，默认关闭
	setting: false, // 是否显示设置按钮，默认关闭
	reload: false, // 是否显示刷新按钮，默认关闭
	full: false, // 是否显示全屏按钮，默认关闭
	download: false, // 是否显示导出按钮，默认关闭
	upload: false,  // 是否显示导入按钮，默认关闭
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
	edit: false, // 是否显示编辑链接，默认关闭
	delete: false, // 是否显示删除链接，默认关闭
};

// 配置项：自定义工具栏
unitConfig.customer_toolbar = [
];

// 配置项：自定义操作列
unitConfig.handle_columns = [
];

export default unitConfig;

