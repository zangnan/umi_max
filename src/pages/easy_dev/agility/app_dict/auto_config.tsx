import myUtil from '@/components/DDAssist/util';
import DDIT_TOOL_CONSTANTS from '@/components/DDBunit/excelConfig.v2.constants';

const toCamel = myUtil.text.underscoreToCamel;
const CKEY = DDIT_TOOL_CONSTANTS.CONFIG_KEY;

const unitConfig: any = {};

unitConfig.grid_row_key = toCamel(CKEY.DICT_FIELD_ID);//'dict_field_id';
unitConfig.api_grid_query = '/dict/automatic/exp/retrieveDictPager';
unitConfig.api_form_edit = '/dict/automatic/exp/updateDict';
unitConfig.get_edit_value_by_grid = true;
unitConfig.form_title = '应用字典';

// 配置列表列
unitConfig.grid_columns = [
	{ title: '数据字典', dataIndex: 'sjzd', children: [
		{ title: '名称', dataIndex: toCamel(CKEY.DICT_NAME), width: 120, fixed: 'left', ellipsis: true },
		{ title: '说明', dataIndex: toCamel(CKEY.DICT_NAME_DESC), width: 140, fixed: 'left', ellipsis: true },
	] },
	{ title: '字段描述', dataIndex: 'zdms', children: [
		{ title: '主表字段', dataIndex: toCamel(CKEY.DICT_FIELD_NAME), width: 120, render: { func: 'renderDictField1' }, fixed: 'left', ellipsis: true },
		{ title: '关联表字段', dataIndex: toCamel(CKEY.DICT_FIELD_NAME_REL), render: { func: 'renderDictField2' }, width: 150, fixed: 'left', ellipsis: true },
		{ title: '字段中文名', dataIndex: toCamel(CKEY.DICT_FIELD_DESC), width: 120, fixed: 'left', ellipsis: true },
		{ title: '扩展信息', dataIndex: toCamel(CKEY.EXT_INFO), width: 120, fixed: 'left', ellipsis: true },
	] },
	{ title: '数据库属性', dataIndex: 'sjksx', children: [
		{ title: '数据类型', dataIndex: toCamel(CKEY.DICT_FIELD_TYPE), width: 100 },
		{ title: '键', dataIndex: toCamel(CKEY.DICT_FIELD_KEY), width: 80 },
		{ title: '默认值', dataIndex: toCamel(CKEY.DICT_FIELD_DEFAULT_VALUE), width: 80 },
		{ title: '非空', dataIndex: toCamel(CKEY.DICT_FIELD_NOT_NULL), width: 80 },
	] },
	{ title: 'SQL参数', dataIndex: 'sqlcs', children: [
		{ title: '关联字段表达式', dataIndex: toCamel(CKEY.DICT_FIELD_EXPR), width: 120, ellipsis: true },
		{ title: '字段过滤器', dataIndex: toCamel(CKEY.DICT_FIELD_FILTER), width: 120, ellipsis: true },
	] },
	{ title: '列表项', dataIndex: 'dbConfig', children: [
		{ title: '开启', dataIndex: toCamel(CKEY.GRID_USED), width: 65 },
		{ title: '主键标识', dataIndex: toCamel(CKEY.GRID_KEY), width: 75 },
		{ title: '对齐方式', dataIndex: toCamel(CKEY.GRID_ALIGN), width: 75 },
		{ title: '列宽', dataIndex: toCamel(CKEY.GRID_WIDTH), width: 65 },
		{ title: '固定列', dataIndex: toCamel(CKEY.GRID_FIXED), width: 70 },
		{ title: '隐藏标识', dataIndex: toCamel(CKEY.GRID_HIDDEN), width: 75 },
		{ title: '超出隐藏', dataIndex: toCamel(CKEY.GRID_ELLIPSIS), width: 75 },
		{ title: '格式化列', dataIndex: toCamel(CKEY.GRID_RENDER), width: 120, ellipsis: true },
		{ title: '排序开关', dataIndex: toCamel(CKEY.GRID_SORT), width: 75 },
		{ title: '序列', dataIndex: toCamel(CKEY.GRID_INDEX), width: 65 },
		{ title: '统计', dataIndex: toCamel(CKEY.GRID_STATISTICS), width: 80, ellipsis: true },
		{ title: '合并列头', dataIndex: toCamel(CKEY.GRID_CHILDREN), width: 75 },
	] },
	{ title: '筛选项', dataIndex: 'dbConfig', children: [
		{ title: '类型', dataIndex: toCamel(CKEY.FILTER_ITEM_TYPE), width: 120 },
		{ title: '类型扩展参数', dataIndex: toCamel(CKEY.FILTER_ITEM_EXTEND), width: 150, ellipsis: true },
		{ title: '序列', dataIndex: toCamel(CKEY.FILTER_ITEM_INDEX), width: 75 },
		{ title: '名称', dataIndex: toCamel(CKEY.FILTER_ITEM_LABEL), width: 75 },
		{ title: '位置', dataIndex: toCamel(CKEY.FILTER_ITEM_POSITION), width: 75 },
		{ title: '占位符', dataIndex: toCamel(CKEY.FILTER_ITEM_PLACEHOLDER), width: 75 },
		{ title: '布局', dataIndex: toCamel(CKEY.FILTER_ITEM_LAYOUT), width: 75 },
	] },
	{ title: '表单项', dataIndex: 'dbConfig', children: [
		{ title: '开启', dataIndex: toCamel(CKEY.FORM_ITEM_USED), width: 65 },
		{ title: '类型', dataIndex: toCamel(CKEY.FORM_ITEM_TYPE), width: 120 },
		{ title: '格式化', dataIndex: toCamel(CKEY.FORM_ITEM_READONLY), width: 75 },
		{ title: '只读', dataIndex: toCamel(CKEY.FORM_ITEM_READONLY), width: 75 },
		{ title: '类型扩展参数', dataIndex: toCamel(CKEY.FORM_ITEM_EXTEND), width: 150, ellipsis: true  },
		{ title: '布局', dataIndex: toCamel(CKEY.FILTER_ITEM_LAYOUT), width: 75 },
		{ title: '事件失去焦点', dataIndex: toCamel(CKEY.FORM_ITEM_EVENT_ONFOCUS), width: 110, ellipsis: true },
		{ title: '事件得到焦点', dataIndex: toCamel(CKEY.FORM_ITEM_EVENT_ONFOCUS), width: 110, ellipsis: true },
		{ title: '事件值改变', dataIndex: toCamel(CKEY.FORM_ITEM_EVENT_ONCHANGE), width: 110, ellipsis: true },
		{ title: '事件查询', dataIndex: toCamel(CKEY.FORM_ITEM_EVENT_ONSEARCH), width: 110, ellipsis: true },
		{ title: '验证', dataIndex: toCamel(CKEY.FORM_ITEM_RULE), width: 150, ellipsis: true  },
		{ title: '序列', dataIndex: toCamel(CKEY.FORM_ITEM_INDEX), width: 65 },
	] },
];

// 筛选项
unitConfig.filter_items = [
	{ name: toCamel(CKEY.DICT_NAME), label: '数据字典名', type: 'Input' },
	{ name: toCamel(CKEY.DICT_FIELD_NAME), label: '字段名称', type: 'Input' },
	{ name: toCamel(CKEY.DICT_FIELD_DESC), label: '字段含义', type: 'Input' },
];

// 表单项
unitConfig.form_items = [
	{ label: '主键', name: toCamel(CKEY.DICT_FIELD_ID), type: 'Hidden' },
  { label: '数据字典', type: 'GroupTitle', name: 'sjzd' },
	{ label: '名称', name: toCamel(CKEY.DICT_NAME), width: 120, type: 'Input' },
	{ label: '说明', name: toCamel(CKEY.DICT_NAME_DESC), width: 140, type: 'Input' },
  { label: '字段描述', type: 'GroupTitle', name: 'zdms' },
	{ label: '字段', name: toCamel(CKEY.DICT_FIELD_NAME), type: 'Input' },
	{ label: '扩展信息', name: toCamel(CKEY.EXT_INFO), type: 'Input' },
	// { label: '主表字段', name: toCamel(CKEY.DICT_FIELD_NAME), type: 'Input' },
	// { label: '关联表字段', name: toCamel(CKEY.DICT_FIELD_NAME_REL), type: 'Input' },
	{ label: '字段中文名', name: toCamel(CKEY.DICT_FIELD_DESC), type: 'Input' },
  { label: '数据库属性', type: 'GroupTitle', name: 'sjksx' },
	{ label: '数据类型', name: toCamel(CKEY.DICT_FIELD_TYPE), type: 'Input' },
	{ label: '键', name: toCamel(CKEY.DICT_FIELD_KEY), type: 'Input' },
	{ label: '默认值', name: toCamel(CKEY.DICT_FIELD_DEFAULT_VALUE), type: 'Input' },
	{ label: '非空', name: toCamel(CKEY.DICT_FIELD_NOT_NULL), type: 'Input' },
  { label: 'SQL参数', type: 'GroupTitle', name: 'sqlcs' },
	{ label: '关联字段表达式', name: toCamel(CKEY.DICT_FIELD_EXPR), type: 'Input' },
	{ label: '字段过滤器', name: toCamel(CKEY.DICT_FIELD_FILTER), type: 'Input' },
  { label: '列表项', type: 'GroupTitle', name: 'lbx' },
	{ label: '开启', name: toCamel(CKEY.GRID_USED), type: 'Input' },
	{ label: '主键标识', name: toCamel(CKEY.GRID_KEY), type: 'Input' },
	{ label: '对齐方式', name: toCamel(CKEY.GRID_ALIGN), type: 'Input' },
	{ label: '列宽', name: toCamel(CKEY.GRID_WIDTH), type: 'Input' },
	{ label: '固定列', name: toCamel(CKEY.GRID_FIXED), type: 'Input' },
	{ label: '隐藏标识', name: toCamel(CKEY.GRID_HIDDEN), type: 'Input' },
	{ label: '超出隐藏', name: toCamel(CKEY.GRID_ELLIPSIS), type: 'Input' },
	{ label: '格式化列', name: toCamel(CKEY.GRID_RENDER), type: 'Input' },
	{ label: '排序开关', name: toCamel(CKEY.GRID_SORT), type: 'Input' },
	{ label: '序列', name: toCamel(CKEY.GRID_INDEX), type: 'Input' },
	{ label: '统计', name: toCamel(CKEY.GRID_STATISTICS), type: 'Input' },
	{ label: '合并列头', name: toCamel(CKEY.GRID_CHILDREN), type: 'Input' },
  { label: '筛选项', type: 'GroupTitle', name: 'sxx' },
	{ label: '类型', name: toCamel(CKEY.FILTER_ITEM_TYPE), type: 'Input' },
	{ label: '类型扩展参数', name: toCamel(CKEY.FILTER_ITEM_EXTEND), type: 'Input' },
	{ label: '序列', name: toCamel(CKEY.FILTER_ITEM_INDEX), type: 'Input' },
	{ label: '名称', name: toCamel(CKEY.FILTER_ITEM_LABEL), type: 'Input' },
	{ label: '位置', name: toCamel(CKEY.FILTER_ITEM_POSITION), type: 'Input' },
	{ label: '占位符', name: toCamel(CKEY.FILTER_ITEM_PLACEHOLDER), type: 'Input' },
	{ label: '布局', name: toCamel(CKEY.FILTER_ITEM_LAYOUT), type: 'Input' },
  { label: '表单项', type: 'GroupTitle', name: 'bdx' },
	{ label: '开启', name: toCamel(CKEY.FORM_ITEM_USED), type: 'Input' },
	{ label: '类型', name: toCamel(CKEY.FORM_ITEM_TYPE), type: 'Input' },
	{ label: '格式化', name: toCamel(CKEY.FORM_ITEM_READONLY), type: 'Input' },
	{ label: '只读', name: toCamel(CKEY.FORM_ITEM_READONLY), type: 'Input' },
	{ label: '类型扩展参数', name: toCamel(CKEY.FORM_ITEM_EXTEND) , type: 'Input' },
	{ label: '布局', name: toCamel(CKEY.FILTER_ITEM_LAYOUT), type: 'Input' },
	{ label: '事件失去焦点', name: toCamel(CKEY.FORM_ITEM_EVENT_ONFOCUS), type: 'Input' },
	{ label: '事件得到焦点', name: toCamel(CKEY.FORM_ITEM_EVENT_ONFOCUS), type: 'Input' },
	{ label: '事件值改变', name: toCamel(CKEY.FORM_ITEM_EVENT_ONCHANGE), type: 'Input' },
	{ label: '事件查询', name: toCamel(CKEY.FORM_ITEM_EVENT_ONSEARCH), type: 'Input' },
	{ label: '验证', name: toCamel(CKEY.FORM_ITEM_RULE) , type: 'Input' },
	{ label: '序列', name: toCamel(CKEY.FORM_ITEM_INDEX), type: 'Input' },
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

unitConfig.customer_toolbar = [
  { name: '导出', key: 'dc', func: 'exportDict' },
];

export default unitConfig;
