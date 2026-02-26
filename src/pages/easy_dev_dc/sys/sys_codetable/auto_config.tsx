const unitConfig: any = {};

unitConfig.grid_row_key = ['code_type', 'code'];
unitConfig.api_grid_query = '/ns/base/list/m_sys_codetable';
unitConfig.api_form_edit='/ns/base/edit/m_sys_codetable';
unitConfig.api_form_delete='/ns/base/delete/m_sys_codetable';
unitConfig.api_form_query=`/ns/base/show/m_sys_codetable`;
unitConfig.form_title = '码表';

// 配置列表列
unitConfig.grid_columns = [
	{ title: '码表类别', dataIndex: 'code_type', width: 120 },
	{ title: '码表类别描述', dataIndex: 'code_type_desc', width: 120, ellipsis: true },
	{ title: '码表字母代码', dataIndex: 'code', width: 120 },
	{ title: '码表数字代码', dataIndex: 'code_number', width: 120 },
	{ title: '码表简称', dataIndex: 'name', width: 150, ellipsis: true },
	{ title: '码表全称', dataIndex: 'name_full', ellipsis: true },
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'code_type', label: '码表类别', type: 'Input' },
	{ name: 'code', label: '码表字母代码', type: 'Input' },
];

// 表单项
unitConfig.form_items = [
	{ name: 'uuid', label: '主键', type: 'Hidden' },
	{ name: 'code_type', label: '码表类别', type: 'Input', rules: [
    { type: 'base_required' },
    { type: 'base_string', range: 200 },
  ]},
	{ name: 'code_type_desc', label: '码表类别描述', type: 'Input', rules: [
    { type: 'base_required' },
    { type: 'base_string', range: 200 },
  ]},
	{ name: 'code', label: '码表字母代码', type: 'Input', rules: [
    { type: 'base_required' },
    { type: 'base_string', range: 200 },
  ]},
	{ name: 'code_number', label: '码表数字代码', type: 'Input', rules: [
    { type: 'base_string', range: 200 },
  ]},
	{ name: 'name', label: '码表简称', type: 'Input', rules: [
    { type: 'base_required' },
    { type: 'base_string', range: 200 },
  ]},
	{ name: 'name_full', label: '码表全称', type: 'Input', rules: [
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
