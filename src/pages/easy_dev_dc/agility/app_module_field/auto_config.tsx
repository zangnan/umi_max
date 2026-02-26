import DDIT_TOOL_CONSTANTS from '@/components/DDBunit/excelConfig.v2.constants';

const CKEY = DDIT_TOOL_CONSTANTS.CONFIG_KEY;

const unitConfig: any = {};

unitConfig.grid_row_key = CKEY.DICT_FIELD_ID;
unitConfig.api_grid_query = '/ns/base/list/app_module_field';
unitConfig.api_form_edit = '/ns/base/edit/app_module_field';
unitConfig.api_form_delete = '/ns/base/delete/app_module_field';
unitConfig.get_edit_value_by_grid = true;
unitConfig.form_title = '应用模块字段';

// 配置列表列
unitConfig.grid_columns = [
	{ title: '模块key', dataIndex: CKEY.MODULE_KEY, width: 170, fixed: 'left', ellipsis: true, sorter: { multiple: 1 } },
	{ title: '物理表名称', dataIndex: CKEY.DICT_NAME, width: 170, fixed: 'left', ellipsis: true, sorter: { multiple: 1 } },
	{ title: '字段名称', dataIndex: CKEY.DICT_FIELD_NAME, width: 120, fixed: 'left', ellipsis: true, sorter: { multiple: 1 } },
	{ title: '字段含义', dataIndex: CKEY.DICT_FIELD_DESC, width: 140, ellipsis: true, sorter: { multiple: 1 } },
	{ title: '关联字段表达式', dataIndex: CKEY.DICT_FIELD_EXPR, width: 140, ellipsis: true, sorter: { multiple: 1 } },
	{ title: '字段初始排序', dataIndex: CKEY.DICT_FIELD_DEFAULT_ORDER, width: 120, sorter: { multiple: 1 } },
	{ title: '列表项', dataIndex: 'dbConfig', children: [
		{ title: '开启', dataIndex: CKEY.GRID_USED, width: 65 },
		{ title: '主键标识', dataIndex: CKEY.GRID_KEY, width: 75 },
		{ title: '对齐方式', dataIndex: CKEY.GRID_ALIGN, width: 75 },
		{ title: '列宽', dataIndex: CKEY.GRID_WIDTH, width: 65 },
		{ title: '固定列', dataIndex: CKEY.GRID_FIXED, width: 70 },
		{ title: '隐藏标识', dataIndex: CKEY.GRID_HIDDEN, width: 75 },
		{ title: '超出隐藏', dataIndex: CKEY.GRID_ELLIPSIS, width: 75 },
		{ title: '格式化列', dataIndex: CKEY.GRID_RENDER, width: 120, ellipsis: true },
		{ title: '统计', dataIndex: CKEY.GRID_STATISTICS, width: 65 },
		{ title: '排序开关', dataIndex: CKEY.GRID_SORT, width: 75 },
		{ title: '序列', dataIndex: CKEY.GRID_INDEX, width: 65 },
		{ title: '合并列头', dataIndex: CKEY.GRID_CHILDREN, width: 75 },
	] },
	{ title: '筛选项', dataIndex: 'dbConfig', children: [
		{ title: '类型', dataIndex: CKEY.FILTER_ITEM_TYPE, width: 120 },
		{ title: '类型扩展参数', dataIndex: CKEY.FILTER_ITEM_EXTEND, width: 150, ellipsis: true },
		{ title: '序列', dataIndex: CKEY.FILTER_ITEM_INDEX, width: 75 },
		{ title: '名称', dataIndex: CKEY.FILTER_ITEM_LABEL, width: 75 },
		{ title: '位置', dataIndex: CKEY.FILTER_ITEM_POSITION, width: 75 },
		{ title: '占位符', dataIndex: CKEY.FILTER_ITEM_PLACEHOLDER, width: 75 },
		{ title: '布局', dataIndex: CKEY.FILTER_ITEM_LAYOUT, width: 75 },
	] },
	{ title: '表单项', dataIndex: 'dbConfig', children: [
		{ title: '开启', dataIndex: CKEY.FORM_ITEM_USED, width: 65 },
		{ title: '类型', dataIndex: CKEY.FORM_ITEM_TYPE, width: 120 },
		{ title: '格式化', dataIndex: CKEY.FORM_ITEM_READONLY, width: 75 },
		{ title: '只读', dataIndex: CKEY.FORM_ITEM_READONLY, width: 75 },
		{ title: '类型扩展参数', dataIndex: CKEY.FORM_ITEM_EXTEND, width: 150, ellipsis: true  },
		{ title: '布局', dataIndex: CKEY.FORM_ITEM_LAYOUT, width: 75 },
		{ title: '事件失去焦点', dataIndex: CKEY.FORM_ITEM_EVENT_ONFOCUS, width: 110, ellipsis: true },
		{ title: '事件得到焦点', dataIndex: CKEY.FORM_ITEM_EVENT_ONFOCUS, width: 110, ellipsis: true },
		{ title: '事件值改变', dataIndex: CKEY.FORM_ITEM_EVENT_ONCHANGE, width: 110, ellipsis: true },
		{ title: '事件查询', dataIndex: CKEY.FORM_ITEM_EVENT_ONSEARCH, width: 110, ellipsis: true },
		{ title: '验证', dataIndex: CKEY.FORM_ITEM_RULE, width: 150, ellipsis: true  },
		{ title: '序列', dataIndex: CKEY.FORM_ITEM_INDEX, width: 65 },
	] },
];

// 筛选项
unitConfig.filter_items = [
	{ name: CKEY.DICT_NAME, label: '数据字典名', type: 'Input' },
	{ name: CKEY.DICT_FIELD_NAME, label: '字段名称', type: 'Input' },
	{ name: CKEY.DICT_FIELD_DESC, label: '字段含义', type: 'Input' },
];

// 表单项
unitConfig.form_items = [
	{ label: '主键', name: CKEY.DICT_FIELD_ID, type: 'Hidden' },
	{ label: '模块key', name: CKEY.MODULE_KEY, type: 'Input' },
	{ label: '物理表名称', name: CKEY.DICT_NAME, type: 'Input' },
	{ label: '字段名称', name: CKEY.DICT_FIELD_NAME, type: 'Input' },
	{ label: '字段含义', name: CKEY.DICT_FIELD_DESC, type: 'Input' },
  { label: '列表项', type: 'GroupTitle', name: 'lbx' },
	{ label: '开启', name: CKEY.GRID_USED, type: 'Input' },
	{ label: '主键标识', name: CKEY.GRID_KEY, type: 'Input' },
	{ label: '对齐方式', name: CKEY.GRID_ALIGN, type: 'Input' },
	{ label: '列宽', name: CKEY.GRID_WIDTH, type: 'Input' },
	{ label: '固定列', name: CKEY.GRID_FIXED, type: 'Input' },
	{ label: '隐藏标识', name: CKEY.GRID_HIDDEN, type: 'Input' },
	{ label: '超出隐藏', name: CKEY.GRID_ELLIPSIS, type: 'Input' },
	{ label: '格式化列', name: CKEY.GRID_RENDER, type: 'Input' },
	{ label: '排序开关', name: CKEY.GRID_SORT, type: 'Input' },
	{ label: '序列', name: CKEY.GRID_INDEX, type: 'Input' },
	{ label: '合并列头', name: CKEY.GRID_CHILDREN, type: 'Input' },
  { label: '筛选项', type: 'GroupTitle', name: 'sxx' },
	{ label: '类型', name: CKEY.FILTER_ITEM_TYPE, type: 'Input' },
	{ label: '类型扩展参数', name: CKEY.FILTER_ITEM_EXTEND, type: 'Input' },
	{ label: '序列', name: CKEY.FILTER_ITEM_INDEX, type: 'Input' },
	{ label: '名称', name: CKEY.FILTER_ITEM_LABEL, type: 'Input' },
	{ label: '位置', name: CKEY.FILTER_ITEM_POSITION, type: 'Input' },
	{ label: '占位符', name: CKEY.FILTER_ITEM_PLACEHOLDER, type: 'Input' },
	{ label: '布局', name: CKEY.FILTER_ITEM_LAYOUT, type: 'Input' },
  { label: '表单项', type: 'GroupTitle', name: 'bdx' },
	{ label: '开启', name: CKEY.FORM_ITEM_USED, type: 'Input' },
	{ label: '类型', name: CKEY.FORM_ITEM_TYPE, type: 'Input' },
	{ label: '格式化', name: CKEY.FORM_ITEM_FORMAT, type: 'Input' },
	{ label: '只读', name: CKEY.FORM_ITEM_READONLY, type: 'Input' },
	{ label: '类型扩展参数', name: CKEY.FORM_ITEM_EXTEND, type: 'Input' },
	{ label: '布局', name: CKEY.FORM_ITEM_LAYOUT, type: 'Input' },
	{ label: '事件失去焦点', name: CKEY.FORM_ITEM_EVENT_ONBLUR, type: 'Input' },
	{ label: '事件得到焦点', name: CKEY.FORM_ITEM_EVENT_ONFOCUS, type: 'Input' },
	{ label: '事件值改变', name: CKEY.FORM_ITEM_EVENT_ONCHANGE, type: 'Input' },
	{ label: '事件查询', name: CKEY.FORM_ITEM_EVENT_ONSEARCH, type: 'Input' },
	{ label: '验证', name: CKEY.FORM_ITEM_RULE, type: 'Input' },
	{ label: '序列', name: CKEY.FORM_ITEM_INDEX, type: 'Input' },
],

// 配置项：工具栏
unitConfig.toolbar_default = {
	add: true,
  edit: true,
  delete: true,
  setting: true,
  full: true,
  download: true,
  upload: true,
  reload: true,
  advanced_filter: true,
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
	edit: true,
  delete: true,
  detail: true,
};

export default unitConfig;
