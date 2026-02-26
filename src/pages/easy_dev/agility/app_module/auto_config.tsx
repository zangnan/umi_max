import myUtil from '@/components/DDAssist/util';
import DDIT_TOOL_CONSTANTS from '@/components/DDBunit/excelConfig.v2.constants';

const toCamel = myUtil.text.underscoreToCamel;
const CKEY = DDIT_TOOL_CONSTANTS.CONFIG_KEY;

const unitConfig: any = {};

unitConfig.grid_row_key = 'moduleKey';
unitConfig.api_grid_query = '/dict/automatic/exp/retrieveModulePager';
unitConfig.api_form_edit = '/dict/automatic/exp/updateModule';
unitConfig.get_edit_value_by_grid = true;
unitConfig.form_title = '应用模块';

// 配置列表列
unitConfig.grid_columns = [
	{ title: '模块key', dataIndex: toCamel(CKEY.MODULE_KEY), width: 170, fixed: 'left', ellipsis: true },
	{ title: '模块名称', dataIndex: toCamel(CKEY.MODULE_NAME), width: 150, ellipsis: true },
	{ title: '数据字典名', dataIndex: toCamel(CKEY.DICT_NAME), width: 180, ellipsis: true },
	{ title: '扩展信息', dataIndex: toCamel(CKEY.MODULE_EXT_INFO), width: 120, ellipsis: true },
	{ title: '列表', children: [
		{ title: '序号', dataIndex: toCamel(CKEY.GRID_SHOW_SERIAL_NUMBER), width: 50 },
		{ title: '边框', dataIndex: toCamel(CKEY.GRID_BORDER), width: 50 },
		{ title: '首选项', dataIndex: toCamel(CKEY.GRID_SELECTION_TYPE), width: 75 },
		{ title: '扩展', dataIndex: toCamel(CKEY.GRID_EXT), width: 75 },
	]},
	{ title: '列表列按钮', children: [
		{ title: '编辑', dataIndex: toCamel(CKEY.GRID_COL_EDIT), width: 50 },
		{ title: '删除', dataIndex: toCamel(CKEY.GRID_COL_DEL), width: 50 },
		{ title: '详情', dataIndex: toCamel(CKEY.GRID_COL_DETAIL), width: 50 },
	]},
	{ title: '工具栏按钮', children: [
		{ title: '增加', dataIndex: toCamel(CKEY.TOOLBAR_DEFAULT_ADD), width: 50 },
		{ title: '删除', dataIndex: toCamel(CKEY.TOOLBAR_DEFAULT_DELETE), width: 50 },
		{ title: '编辑', dataIndex: toCamel(CKEY.TOOLBAR_DEFAULT_EDIT), width: 50 },
		{ title: '导入', dataIndex: toCamel(CKEY.TOOLBAR_DEFAULT_UPLOAD), width: 50 },
		{ title: '导出', dataIndex: toCamel(CKEY.TOOLBAR_DEFAULT_DOWNLOAD), width: 50 },
		{ title: '设置', dataIndex: toCamel(CKEY.TOOLBAR_DEFAULT_SETTING), width: 50 },
		{ title: '全屏', dataIndex: toCamel(CKEY.TOOLBAR_DEFAULT_FULL), width: 50 },
		{ title: '刷新', dataIndex: toCamel(CKEY.TOOLBAR_DEFAULT_RELOAD), width: 50 },
		{ title: '筛选', dataIndex: toCamel(CKEY.TOOLBAR_DEFAULT_ADVANCED_FILTER), width: 50 },
	]},
	{ title: '表单', children: [
		{ title: '布局', dataIndex: toCamel(CKEY.FORM_LAYOUT_TYPE), width: 90 },
		{ title: '宽度', dataIndex: toCamel(CKEY.FORM_WIDTH), width: 90 },
		{ title: '提交类型', dataIndex: toCamel(CKEY.FORM_SUBMIT_TYPE), width: 90 },
	]},
	{ title: 'Api', children: [
		{ title: '保存', dataIndex: toCamel(CKEY.API_FORM_EDIT), width: 130, ellipsis: true },
		{ title: '查询表单', dataIndex: toCamel(CKEY.API_FORM_QUERY), width: 130, ellipsis: true },
		{ title: '删除', dataIndex: toCamel(CKEY.API_FORM_DELETE), width: 130, ellipsis: true },
		{ title: '查询列表', dataIndex: toCamel(CKEY.API_GRID_QUERY), width: 130, ellipsis: true },
		{ title: '导出', dataIndex: toCamel(CKEY.API_EXCEL_EXPORT), width: 130, ellipsis: true },
		{ title: '导入', dataIndex: toCamel(CKEY.API_EXCEL_IMPORT), width: 130, ellipsis: true },
		{ title: '模板下载', dataIndex: toCamel(CKEY.API_EXCEL_TEMPLATE), width: 130, ellipsis: true },
	]},
	{ title: '自定义按钮', children: [
		{ title: '工具栏', dataIndex: toCamel(CKEY.CUSTOMER_BTN_TOOLBAR), width: 150, ellipsis: true },
		{ title: '列表列', dataIndex: toCamel(CKEY.CUSTOMER_BTN_GRID_COL), width: 150, ellipsis: true },
	]},
];

// 筛选项
unitConfig.filter_items = [
	{ name: toCamel(CKEY.MODULE_KEY), label: '模块key', type: 'Input' },
	{ name: toCamel(CKEY.MODULE_NAME), label: '模块名称', type: 'Input' },
];

// 表单项
unitConfig.form_items = [
	{ label: '模块key', name: toCamel(CKEY.MODULE_KEY), type: 'Input' },
	{ label: '模块名称', name: toCamel(CKEY.MODULE_NAME), type: 'Input' },
	{ label: '数据字典名', name: toCamel(CKEY.DICT_NAME), type: 'Input' },
	{ label: '扩展信息', name: toCamel(CKEY.MODULE_EXT_INFO), type: 'Input' },
	{ label: '列表', type: 'GroupTitle', name: 'lb' },
	{ label: '序号', name: toCamel(CKEY.GRID_SHOW_SERIAL_NUMBER), type: 'Input' },
	{ label: '边框', name: toCamel(CKEY.GRID_BORDER), type: 'Input' },
	{ label: '首选项', name: toCamel(CKEY.GRID_SELECTION_TYPE), type: 'Input' },
	{ label: '扩展', name: toCamel(CKEY.GRID_EXT), type: 'Input' },
	{ label: '列表列按钮', type: 'GroupTitle', name: 'lblan' },
	{ label: '编辑', name: toCamel(CKEY.GRID_COL_EDIT), type: 'Input' },
	{ label: '删除', name: toCamel(CKEY.GRID_COL_DEL), type: 'Input' },
	{ label: '详情', name: toCamel(CKEY.GRID_COL_DETAIL), type: 'Input' },
	{ label: '工具栏按钮', type: 'GroupTitle', name: 'gjlan' },
	{ label: '增加', name: toCamel(CKEY.TOOLBAR_DEFAULT_ADD), type: 'Input' },
	{ label: '删除', name: toCamel(CKEY.TOOLBAR_DEFAULT_DELETE), type: 'Input' },
	{ label: '编辑', name: toCamel(CKEY.TOOLBAR_DEFAULT_EDIT), type: 'Input' },
	{ label: '导入', name: toCamel(CKEY.TOOLBAR_DEFAULT_UPLOAD), type: 'Input' },
	{ label: '导出', name: toCamel(CKEY.TOOLBAR_DEFAULT_DOWNLOAD), type: 'Input' },
	{ label: '设置', name: toCamel(CKEY.TOOLBAR_DEFAULT_SETTING), type: 'Input' },
	{ label: '全屏', name: toCamel(CKEY.TOOLBAR_DEFAULT_RELOAD), type: 'Input' },
	{ label: '刷新', name: toCamel(CKEY.TOOLBAR_DEFAULT_RELOAD), type: 'Input' },
	{ label: '筛选', name: toCamel(CKEY.TOOLBAR_DEFAULT_ADVANCED_FILTER), type: 'Input' },
	{ label: '表单', type: 'GroupTitle', name: 'bd' },
	{ label: '布局', name: toCamel(CKEY.FORM_LAYOUT_TYPE), type: 'Input' },
	{ label: '宽度', name: toCamel(CKEY.FORM_WIDTH), type: 'Input' },
	{ label: '提交类型', name: toCamel(CKEY.FORM_SUBMIT_TYPE), type: 'Input' },
	{ label: '自定义按钮', type: 'GroupTitle', name: 'zdygj' },
	{ label: '工具栏', name: toCamel(CKEY.CUSTOMER_BTN_TOOLBAR), type: 'Input' },
	{ label: '列表列', name: toCamel(CKEY.CUSTOMER_BTN_GRID_COL), type: 'Input' },
	{ label: 'Api', type: 'GroupTitle', name: 'api' },
	{ label: '保存', name: toCamel(CKEY.API_FORM_EDIT), type: 'Input' },
	{ label: '查询表单', name: toCamel(CKEY.API_FORM_QUERY), type: 'Input' },
	{ label: '删除', name: toCamel(CKEY.API_FORM_DELETE), type: 'Input' },
	{ label: '查询列表', name: toCamel(CKEY.API_GRID_QUERY), type: 'Input' },
	{ label: '导出', name: toCamel(CKEY.API_EXCEL_EXPORT), type: 'Input' },
	{ label: '导入', name: toCamel(CKEY.API_EXCEL_IMPORT), type: 'Input' },
	{ label: '模板下载', name: toCamel(CKEY.API_EXCEL_TEMPLATE), type: 'Input' },
];

// 配置项：工具栏
unitConfig.toolbar_default = {
	// add: true,
  // edit: true,
  // delete: true,
  setting: true,
  full: true,
  // download: true,
  // upload: true,
  reload: true,
  // advanced_filter: true,
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
	edit: true,
  // delete: true,
  detail: true,
};

// 配置项：自定义操作列
unitConfig.handle_columns = [
  { name: '预览', key: 'preview', func: 'preview' },
  { name: '导出模块数据视图', key: 'importModuleDict', func: 'importModuleDict' },
  { name: '增加模拟数据', key: 'addMockData', func: 'addMockData' },
];

unitConfig.customer_toolbar = [
  { name: '导出', key: 'dc', func: 'exportModule' },
  { name: '导出模块数据视图', key: 'importModuleDict', func: 'importModuleDict' },
];

// dataIndex name 转驼峰格式
// unitConfig.grid_columns = myUtil.text.underscoreToCamelArrayValue(unitConfig.grid_columns, ['dataIndex']);
// unitConfig.filter_items = myUtil.text.underscoreToCamelArrayValue(unitConfig.filter_items, ['name']);
// unitConfig.form_items = myUtil.text.underscoreToCamelArrayValue(unitConfig.form_items, ['name']);

export default unitConfig;
