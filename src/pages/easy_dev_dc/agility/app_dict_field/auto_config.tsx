const unitConfig: any = {};

unitConfig.grid_row_key = ['dict_name', 'dict_field_name'];
unitConfig.api_grid_query = '/ns/base/list/dict_field';
unitConfig.api_form_edit = '/ns/base/edit/dict_field';
unitConfig.api_form_delete = '/ns/base/delete/dict_field';
unitConfig.api_form_query = '/ns/base/show/dict_field';
unitConfig.form_title = '物理表字段 ';

// 配置列表列
unitConfig.grid_columns = [
	{ title: '物理表名称', dataIndex: 'dict_name', width: 180, ellipsis: true, sorter: { multiple: 1 } },
	{ title: '字段名称', dataIndex: 'dict_field_name', width: 180, ellipsis: true, sorter: { multiple: 1 } },
	{ title: '字段含义', dataIndex: 'dict_field_desc', ellipsis: true, sorter: { multiple: 1 } },
	{ title: '字段类型', dataIndex: 'dict_field_type', width: 130, sorter: { multiple: 1 } },
	{ title: '字段键', dataIndex: 'dict_field_key', width: 100, sorter: { multiple: 1 } },
	{ title: '字段默认值', dataIndex: 'dict_field_default_value', width: 150, sorter: { multiple: 1 } },
	{ title: '字段非空', dataIndex: 'dict_field_not_null', width: 100, sorter: { multiple: 1 } },
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'dict_name', label: '物理表名称', type: 'Input' },
	{ name: 'dict_field_name', label: '字段名称', type: 'Input' },
];

// 表单项
unitConfig.form_items = [
	{ name: 'dict_name', label: '物理表名称', type: 'Input' },
	{ name: 'dict_field_name', label: '字段名称', type: 'Input'},
	{ name: 'dict_field_desc', label: '字段含义', type: 'Input'},
	{ name: 'dict_field_type', label: '字段类型', type: 'Input'},
	{ name: 'dict_field_key', label: '字段键', type: 'Input'},
	{ name: 'dict_field_default_value', label: '字段默认值', type: 'Input'},
	{ name: 'dict_field_not_null', label: '字段非空', type: 'Input'},
];

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
