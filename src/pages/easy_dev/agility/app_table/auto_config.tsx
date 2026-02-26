const unitConfig: any = {};

unitConfig.grid_row_key = 'dictName';
unitConfig.api_grid_query = '/dict/automatic/exp/retrieveTablePager';
unitConfig.get_edit_value_by_grid = true;
unitConfig.form_title = '应用表';

// 配置列表列
unitConfig.grid_columns = [
	{ title: '物理表名称', dataIndex: 'tableName', width: 120, fixed: 'left', ellipsis: true },
	{ title: '物理表含义', dataIndex: 'tableDesc', width: 180, ellipsis: true },
	{ title: '逻辑表类型', dataIndex: 'tableType', width: 100 },
	{ title: '别名', dataIndex: 'tableAlias', width: 120, ellipsis: true },
	{ title: '数据字典名', dataIndex: 'dictName', width: 120, ellipsis: true },
	{ title: '数据字典含义', dataIndex: 'dictDesc', width: 180, ellipsis: true },
	{ title: '缺省数据查询顺序', dataIndex: 'dbOrder', width: 180, ellipsis: true },
	{ title: '清空标志', dataIndex: 'dbCleanFlag', width: 70 },
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'tableName', label: '物理表名称', type: 'Input' },
	{ name: 'tableDesc', label: '物理表含义', type: 'Input' },
	{ name: 'tableType', label: '逻辑表类型', type: 'Input' },
];

// 表单项
unitConfig.form_items = [
	{ name: 'tableName', label: '物理表名称', type: 'Input' },
	{ name: 'tableDesc', label: '物理表含义', type: 'Input' },
	{ name: 'tableType', label: '逻辑表类型', type: 'Input' },
	{ name: 'tableAlias', label: '别名', type: 'Input' },
	{ name: 'dictName', label: '数据字典名', type: 'Input' },
	{ name: 'dictDesc', label: '数据字典含义', type: 'Input' },
	{ name: 'dbOrder', label: '缺省数据查询顺序', type: 'Input' },
	{ name: 'dbCleanFlag', label: '清空标志', type: 'Input' },
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
	// edit: true,
  // delete: true,
  detail: true,
};

unitConfig.customer_toolbar = [
  { name: '导出PDF', key: 'exportPDF', func: 'exportPDF' },
  { name: '导出', key: 'dc', func: 'exportDictTable' },
];

export default unitConfig;
