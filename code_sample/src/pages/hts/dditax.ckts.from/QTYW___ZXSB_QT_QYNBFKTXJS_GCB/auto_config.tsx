/**
 * title: 内部风险控制体系建设情况报告
 * serviceKey: QTYW_ZXSB_QT_QYNBFKTXJS_G
 * unitId: qtyw_zxsb_qt_qynbfktxjs_gcb
*/

const unitConfig: any = {};

unitConfig.unit_key = 'QTYW_ZXSB_QT_QYNBFKTXJS_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'qtyw_zxsb_qt_qynbfktxjs_gcb'; // 页面id
unitConfig.grid_title = '出口退（免）税企业内部风险控制体系建设情况报告'; // 列表标题，可选
unitConfig.form_title = '出口退（免）税企业内部风险控制体系建设情况报告'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量
unitConfig.export_key1 = ''; // 采集导出key
unitConfig.export_key2 = ''; // 统计导出key
unitConfig.export_key3 = ''; // 申报结果查询导出key

// 配置列表列
unitConfig.grid_columns = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '制度建设情况', dataIndex: 'zdjsqk', align: 'left', width: 180, ellipsis: true},
	{ title: '风险系统情况', dataIndex: 'fxglxxxtjsqk', align: 'left', width: 180, ellipsis: true},
	{ title: '风评标准及方法', dataIndex: 'fxzpbzjff', align: 'left', width: 180, ellipsis: true},
	{ title: '机构及人员情况', dataIndex: 'zzjgszjzzrypbqk', align: 'left', width: 180, ellipsis: true},
	{ title: '附送材料清单', dataIndex: 'fszmclqd', align: 'left', width: 180, ellipsis: true},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '制度建设情况', dataIndex: 'zdjsqk', align: 'left', width: 180, ellipsis: true},
	{ title: '风险系统情况', dataIndex: 'fxglxxxtjsqk', align: 'left', width: 180, ellipsis: true},
	{ title: '风评标准及方法', dataIndex: 'fxzpbzjff', align: 'left', width: 180, ellipsis: true},
	{ title: '机构及人员情况', dataIndex: 'zzjgszjzzrypbqk', align: 'left', width: 180, ellipsis: true},
	{ title: '附送材料清单', dataIndex: 'fszmclqd', align: 'left', width: 180, ellipsis: true},
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'ssq', label: '所属期', type: 'Input' },
];

// 表单项
unitConfig.form_items = [
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle' },
	{ label: 'ID', name: 'uuid', type: 'Hidden' },
	{ label: '所属期', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}, { func: 'ssq03' }, { func: 'ssq02' }]},
	{ label: '说明信息', name: 'smxx', type: 'GroupTitle' },
	{ label: '制度建设情况', name: 'zdjsqk', type: 'TextArea', autoSize: { minRows: 2, maxRows: 2}, layout: { label: { xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3}, formItem: { xs: 16, sm: 16, md: 16, lg: 19, xl: 21, xxl: 21 } }, rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 2000]}]},
	{ label: '风险系统情况', name: 'fxglxxxtjsqk', type: 'TextArea', autoSize: { minRows: 2, maxRows: 2}, layout: { label: { xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3}, formItem: { xs: 16, sm: 16, md: 16, lg: 19, xl: 21, xxl: 21 } }, rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 2000]}]},
	{ label: '风评标准及方法', name: 'fxzpbzjff', type: 'TextArea', autoSize: { minRows: 2, maxRows: 2}, layout: { label: { xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3}, formItem: { xs: 16, sm: 16, md: 16, lg: 19, xl: 21, xxl: 21 } }, rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 2000]}]},
	{ label: '机构及人员情况', name: 'zzjgszjzzrypbqk', type: 'TextArea', autoSize: { minRows: 2, maxRows: 2}, layout: { label: { xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3}, formItem: { xs: 16, sm: 16, md: 16, lg: 19, xl: 21, xxl: 21 } }, rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 2000]}]},
	{ label: '附送材料清单', name: 'fszmclqd', type: 'TextArea', autoSize: { minRows: 2, maxRows: 2}, layout: { label: { xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3}, formItem: { xs: 16, sm: 16, md: 16, lg: 19, xl: 21, xxl: 21 } }, rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 2000]}]},
	{ label: '其他信息', name: 'qtxx', type: 'GroupTitle' },
	{ label: '申报标志', name: 'sbztDm', type: 'Hidden' },
	{ label: '审核标志', name: 'shbz', type: 'Hidden' },
	{ label: '备注', name: 'bz', type: 'TextArea', autoSize: { minRows: 2, maxRows: 2}, layout: { label: { xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3}, formItem: { xs: 16, sm: 16, md: 16, lg: 19, xl: 21, xxl: 21 } }, rules: [{ type: 'base_string', range: [0, 200]}]},
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  add: true, // 是否显示增加按钮，默认关闭
  edit: true, // 是否显示修改按钮，默认关闭
  delete: true, // 是否显示删除按钮，默认关闭
  setting: true, // 是否显示设置按钮，默认关闭
  reload: true, // 是否显示刷新按钮，默认关闭
  full: true, // 是否显示全屏按钮，默认关闭
  ckts_download: true, // 是否显示导出按钮，默认关闭
  upload: false,  // 是否显示导入按钮，默认关闭
  ckts_sum: false, // 是否显示小计按钮，默认关闭
  ckts_order: false, // 是否显示序号重排(默认规则：选择排序)按钮，默认关闭
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                       	// 是否显示编辑链接，默认关闭
  delete: false,                     	// 是否显示删除链接，默认关闭
};

export default unitConfig;

