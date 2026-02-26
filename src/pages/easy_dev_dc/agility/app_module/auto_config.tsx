import DDIT_TOOL_CONSTANTS from '@/components/DDBunit/excelConfig.v2.constants';

const CKEY = DDIT_TOOL_CONSTANTS.CONFIG_KEY;

const unitConfig: any = {};

unitConfig.grid_row_key = CKEY.MODULE_KEY;
unitConfig.api_grid_query = '/ns/base/list/app_module';
unitConfig.api_form_edit = '/ns/base/edit/app_module';
unitConfig.api_form_delete = '/ns/base/delete/app_module';
unitConfig.api_form_query = '/ns/base/show/app_module';
unitConfig.form_title = '应用模块';

// 配置列表列
unitConfig.grid_columns = [
	{ title: '模块key', dataIndex: CKEY.MODULE_KEY, width: 170, fixed: 'left', ellipsis: true, sorter: { multiple: 1 } },
	{ title: '模块名称', dataIndex: CKEY.MODULE_NAME, width: 150, ellipsis: true, sorter: { multiple: 1 } },
	{ title: '列表', children: [
		{ title: '序号', dataIndex: CKEY.GRID_SHOW_SERIAL_NUMBER, width: 50 },
		{ title: '边框', dataIndex: CKEY.GRID_BORDER, width: 50 },
		{ title: '首选项', dataIndex: CKEY.GRID_SELECTION_TYPE, width: 75 },
	]},
	{ title: '列表列按钮', children: [
		{ title: '编辑', dataIndex: CKEY.GRID_COL_EDIT, width: 50 },
		{ title: '删除', dataIndex: CKEY.GRID_COL_DEL, width: 50 },
		{ title: '详情', dataIndex: CKEY.GRID_COL_DETAIL, width: 50 },
	]},
	{ title: '工具栏按钮', children: [
		{ title: '增加', dataIndex: CKEY.TOOLBAR_DEFAULT_ADD, width: 50 },
		{ title: '删除', dataIndex: CKEY.TOOLBAR_DEFAULT_DELETE, width: 50 },
		{ title: '编辑', dataIndex: CKEY.TOOLBAR_DEFAULT_EDIT, width: 50 },
		{ title: '导入', dataIndex: CKEY.TOOLBAR_DEFAULT_UPLOAD, width: 50 },
		{ title: '导出', dataIndex: CKEY.TOOLBAR_DEFAULT_DOWNLOAD, width: 50 },
		{ title: '设置', dataIndex: CKEY.TOOLBAR_DEFAULT_SETTING, width: 50 },
		{ title: '全屏', dataIndex: CKEY.TOOLBAR_DEFAULT_FULL, width: 50 },
		{ title: '刷新', dataIndex: CKEY.TOOLBAR_DEFAULT_RELOAD, width: 50 },
		{ title: '筛选', dataIndex: CKEY.TOOLBAR_DEFAULT_ADVANCED_FILTER, width: 50 },
	]},
	{ title: '表单', children: [
		{ title: '布局', dataIndex: CKEY.FORM_LAYOUT_TYPE, width: 90 },
		{ title: '宽度', dataIndex: CKEY.FORM_WIDTH, width: 90 },
	]},
	{ title: '自定义按钮', children: [
		{ title: '工具栏', dataIndex: CKEY.CUSTOMER_BTN_TOOLBAR, width: 150, ellipsis: true },
		{ title: '列表列', dataIndex: CKEY.CUSTOMER_BTN_GRID_COL, width: 150, ellipsis: true },
	]},
	{ title: 'Api', children: [
		{ title: '保存', dataIndex: CKEY.API_FORM_EDIT, width: 130, ellipsis: true },
		{ title: '查询表单', dataIndex: CKEY.API_FORM_QUERY, width: 130, ellipsis: true },
		{ title: '删除', dataIndex: CKEY.API_FORM_DELETE, width: 130, ellipsis: true },
		{ title: '查询列表', dataIndex: CKEY.API_GRID_QUERY, width: 130, ellipsis: true },
		{ title: '导出', dataIndex: CKEY.API_EXCEL_EXPORT, width: 130, ellipsis: true },
		{ title: '导入', dataIndex: CKEY.API_EXCEL_IMPORT, width: 130, ellipsis: true },
		{ title: '模板下载', dataIndex: CKEY.API_EXCEL_TEMPLATE, width: 130, ellipsis: true },
	]},
];

// 筛选项
unitConfig.filter_items = [
	{ name: CKEY.MODULE_KEY, label: '模块key', type: 'Input' },
	{ name: CKEY.MODULE_NAME, label: '模块名称', type: 'Input' },
];

// 表单项
unitConfig.form_items = [
	{ label: '模块key', name: CKEY.MODULE_KEY, type: 'Input' },
	{ label: '模块名称', name: CKEY.MODULE_NAME, type: 'Input' },
	{ label: '列表', type: 'GroupTitle', name: 'lb' },
	{ label: '序号', name: CKEY.GRID_SHOW_SERIAL_NUMBER, type: 'Input' },
	{ label: '边框', name: CKEY.GRID_BORDER, type: 'Input' },
	{ label: '首选项', name: CKEY.GRID_SELECTION_TYPE, type: 'Input' },
	{ label: '列表列按钮', type: 'GroupTitle', name: 'lblan' },
		{ label: '编辑', name: CKEY.GRID_COL_EDIT, type: 'Input' },
		{ label: '删除', name: CKEY.GRID_COL_DEL, type: 'Input' },
		{ label: '详情', name: CKEY.GRID_COL_DETAIL, type: 'Input' },
	{ label: '工具栏按钮', type: 'GroupTitle', name: 'gjlan' },
	{ label: '增加', name: CKEY.TOOLBAR_DEFAULT_ADD, type: 'Input' },
	{ label: '删除', name: CKEY.TOOLBAR_DEFAULT_DELETE, type: 'Input' },
	{ label: '编辑', name: CKEY.TOOLBAR_DEFAULT_EDIT, type: 'Input' },
	{ label: '导入', name: CKEY.TOOLBAR_DEFAULT_UPLOAD, type: 'Input' },
	{ label: '导出', name: CKEY.TOOLBAR_DEFAULT_DOWNLOAD, type: 'Input' },
	{ label: '设置', name: CKEY.TOOLBAR_DEFAULT_SETTING, type: 'Input' },
	{ label: '全屏', name: CKEY.TOOLBAR_DEFAULT_FULL, type: 'Input' },
	{ label: '刷新', name: CKEY.TOOLBAR_DEFAULT_RELOAD, type: 'Input' },
	{ label: '筛选', name: CKEY.TOOLBAR_DEFAULT_ADVANCED_FILTER, type: 'Input' },
	{ label: '表单', type: 'GroupTitle', name: 'bd' },
	{ label: '布局', name: CKEY.FORM_LAYOUT_TYPE, type: 'Input' },
	{ label: '宽度', name: CKEY.FORM_WIDTH, type: 'Input' },
	{ label: '自定义按钮', type: 'GroupTitle', name: 'zdygj' },
	{ label: '工具栏', name: CKEY.CUSTOMER_BTN_TOOLBAR, type: 'Input' },
	{ label: '列表列', name: CKEY.CUSTOMER_BTN_GRID_COL, type: 'Input' },
	{ label: 'Api', type: 'GroupTitle', name: 'api' },
	{ label: '保存', name: CKEY.API_FORM_EDIT, type: 'Input' },
	{ label: '查询表单', name: CKEY.API_FORM_QUERY, type: 'Input' },
	{ label: '删除', name: CKEY.API_FORM_DELETE, type: 'Input' },
	{ label: '查询列表', name: CKEY.API_GRID_QUERY, type: 'Input' },
	{ label: '导出', name: CKEY.API_EXCEL_EXPORT, type: 'Input' },
	{ label: '导入', name: CKEY.API_EXCEL_IMPORT, type: 'Input' },
	{ label: '模板下载', name: CKEY.API_EXCEL_TEMPLATE, type: 'Input' },
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,
  full: true,
  reload: true,
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  detail: true,
};

// 配置项：自定义操作列
unitConfig.handle_columns = [
  { name: '预览', key: 'preview', func: 'preview' },
  { name: '导出模块数据视图', key: 'importModuleDict', func: 'importModuleDict' },
  { name: '增加模拟数据', key: 'addMockData', func: 'addMockData' },
];

unitConfig.customer_toolbar = [
  { name: '导出模块数据视图', key: 'importModuleDict', func: 'importModuleDict' },
];

export default unitConfig;
