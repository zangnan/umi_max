const unitConfig: any = {};

unitConfig.grid_row_key = 'uuid';
unitConfig.api_grid_query = '/dict/app/mgr/retrieveApp';
unitConfig.api_form_edit = '/dict/app/mgr/createApp';
unitConfig.get_edit_value_by_grid = true;
unitConfig.form_title = '码表';

// 配置列表列
unitConfig.grid_columns = [
	{ title: '码表类别', dataIndex: 'codetable_type', width: 150 },
	{ title: '码表字母代码', dataIndex: 'codetable_code', width: 150 },
	{ title: '码表数字代码', dataIndex: 'codetable_code_number', width: 150 },
	{ title: '码表简称', dataIndex: 'codetable_name' },
	{ title: '码表全称', dataIndex: 'codetable_name_full' },
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'codetable_type', label: '码表类别', type: 'Input' },
	{ name: 'codetable_code', label: '码表字母代码', type: 'Input' },
];

// 表单项
unitConfig.form_items = [
	{ name: 'uuid', label: '主键', type: 'Hidden' },
	{ name: 'codetable_type', label: '码表类别', type: 'Input', rules: [
    { type: 'base_required' },
    { type: 'base_string', range: 200 },
  ]},
	{ name: 'codetable_code', label: '码表字母代码', type: 'Input', rules: [
    { type: 'base_required' },
    { type: 'base_string', range: 200 },
  ]},
	{ name: 'codetable_code_number', label: '码表数字代码', type: 'Input', rules: [
    { type: 'base_string', range: 200 },
  ]},
	{ name: 'codetable_name_shoter', label: '码表简称', type: 'Input', rules: [
    { type: 'base_required' },
    { type: 'base_string', range: 200 },
  ]},
	{ name: 'codetable_name_full', label: '码表全称', type: 'Input', rules: [
    { type: 'base_string', range: 200 },
  ]},
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
