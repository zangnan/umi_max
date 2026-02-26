const unitConfig: any = {};

unitConfig.grid_row_key = 'dict_name';
unitConfig.api_grid_query = '/ns/base/list/dict';
unitConfig.api_form_edit = '/ns/base/edit/dict';
unitConfig.api_form_delete = '/ns/base/delete/dict';
unitConfig.api_form_query = '/ns/base/show/dict';
unitConfig.form_title = '物理表';

// 配置列表列
unitConfig.grid_columns = [
	{ title: '物理表名称', dataIndex: 'dict_name', width: 180, ellipsis: true, sorter: { multiple: 1 } },
	{ title: '物理表含义', dataIndex: 'dict_desc', ellipsis: true, sorter: { multiple: 1 } },
	{ title: '逻辑表类型', dataIndex: 'dict_type', width: 130, sorter: { multiple: 1 } },
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'dict_name', label: '物理表名称', type: 'Input' },
	{ name: 'dict_desc', label: '物理表含义', type: 'Input' },
];

// 表单项
unitConfig.form_items = [
	{ label: '物理表名称', name: 'dict_name', type: 'Input' },
	{ label: '物理表含义', name: 'dict_desc', type: 'Input' },
	{ label: '逻辑表类型', name: 'dict_type', type: 'Input' },
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,
  full: true,
  reload: true,
};

// 配置项：自定义工具栏
unitConfig.customer_toolbar = [
  { name: '导出物理表', key: 'myExport', func: 'objectExport' },
  { name: '导出数据视图模板', key: 'myExport', func: 'viewTemplateExportModal' },
];

// 配置项：自定义操作列
unitConfig.handle_columns = [
  { name: '导出物理表', func: 'objectExport' },
  { name: '导出数据视图模板', func: 'viewTemplateExportModal' },
];

export default unitConfig;
