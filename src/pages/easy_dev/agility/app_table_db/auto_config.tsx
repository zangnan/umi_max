const unitConfig: any = {};
// import CONSTANTS from '../../DDAssist/constants';

unitConfig.grid_row_key = 'tableName';
unitConfig.api_grid_query = '/dict/automatic/exp/retrieveTablePager';
unitConfig.form_title = '物理表';
unitConfig.gridParams = {
  // initSearchModal: [
  //   { property: 'tableType', value: "物理表", op: CONSTANTS.FILTER_CONDITION.include.condetionCode, type: "1" },
  //   { property: 'tableManagered', value: "1", op: CONSTANTS.FILTER_CONDITION.equal.condetionCode, type: "1" },
  // ],
};

// 配置列表列
unitConfig.grid_columns = [
	{ title: '物理表名称', dataIndex: 'tableName', width: 180 },
	{ title: '物理表含义', dataIndex: 'tableDesc', ellipsis: true },
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'tableName', label: '物理表名称', type: 'Input' },
	{ name: 'tableDesc', label: '物理表含义', type: 'Input' },
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
