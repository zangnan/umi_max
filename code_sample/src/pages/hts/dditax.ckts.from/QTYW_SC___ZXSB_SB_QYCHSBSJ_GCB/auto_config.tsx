/**
 * title: 撤回出口退（免）税申报申请
 * serviceKey: QTYW_ZXSB_SB_QYCHSBSJ_G
 * unitId: qtyw_sc_zxsb_sb_qychsbsj_gcb
*/

const unitConfig: any = {};

unitConfig.unit_key = 'QTYW_ZXSB_SB_QYCHSBSJ_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'qtyw_sc_zxsb_sb_qychsbsj_gcb'; // 页面id
unitConfig.grid_title = '撤回出口退（免）税申报申请'; // 列表标题，可选
unitConfig.form_title = '撤回出口退（免）税申报申请'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量
unitConfig.export_key1 = ''; // 采集导出key
unitConfig.export_key2 = ''; // 统计导出key
unitConfig.export_key3 = ''; // 申报结果查询导出key

// 配置列表列
unitConfig.grid_columns = [
	{ title: '申报年月', dataIndex: 'ssq', align: 'left', width: 75, fixed: 'left', render: { type: 'date', format: 'yyyyMM' } },
	{ title: '批次', dataIndex: 'sbpc', align: 'left', width: 80, fixed: 'left' },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '撤回原因代码', dataIndex: 'chyyDm', align: 'left', width: 180, codeTable: ['code_dm_ckts_chyy',  '01'], ellipsis: true},
	{ title: '撤回业务类型', dataIndex: 'chywlxDm', align: 'left', width: 150, codeTable: ['code_dm_ckts_chywlx',  '01'] },
	{ title: '原申报年月', dataIndex: 'sbchyssq', align: 'left', width: 90, render: { type: 'date', format: 'yyyyMM' } },
	{ title: '原申报批次', dataIndex: 'sbchysbpc', align: 'left', width: 90},
	{ title: '原因说明', dataIndex: 'yysm', align: 'left', width: 180, ellipsis: true},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '申报年月', dataIndex: 'ssq', align: 'left', width: 75, fixed: 'left', render: { type: 'date', format: 'yyyyMM' } },
	{ title: '批次', dataIndex: 'sbpc', align: 'left', width: 80, fixed: 'left' },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '撤回原因代码', dataIndex: 'chyyDm', align: 'left', width: 180, codeTable: ['code_dm_ckts_chyy',  '01'], ellipsis: true},
	{ title: '撤回业务类型', dataIndex: 'chywlxDm', align: 'left', width: 150, codeTable: ['code_dm_ckts_chywlx',  '01'] },
	{ title: '原申报年月', dataIndex: 'sbchyssq', align: 'left', width: 90, render: { type: 'date', format: 'yyyyMM' } },
	{ title: '原申报批次', dataIndex: 'sbchysbpc', align: 'left', width: 90},
	{ title: '原因说明', dataIndex: 'yysm', align: 'left', width: 180, ellipsis: true},
	{ title: '撤回标志', dataIndex: 'chbz', align: 'left', width: 90, codeTable: ['code_static_ty_bty_dm',  '01'] },
	{ title: '撤回意见', dataIndex: 'chjg', align: 'left', width: 90},
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'sbchyssq', label: '原申报年月', type: 'Input' },
	{ name: 'chywlxDm', label: '撤回业务类型', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['code_dm_ckts_chywlx',  '01'] },
	{ name: 'chyyDm', label: '撤回原因代码', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['code_dm_ckts_chyy',  '01'] },
	{ name: 'ssq', label: '申报年月', type: 'Input' },
];

// 表单项
unitConfig.form_items = [
	{ label: 'ID', name: 'uuid', type: 'Hidden' },
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle' },
	{ label: '申报年月', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}, { func: 'ssq01' }]},
	{ label: '申报批次', name: 'sbpc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbpc02' }], eventOnBlur: 'sbpc' },
	{ label: '申报序号', name: 'sbxh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbxh02' }], eventOnBlur: 'sbxh' },
	{ label: '撤回信息', name: 'chxx', type: 'GroupTitle' },
	{ label: '撤回原因', name: 'chyyDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['code_dm_ckts_chyy', '01'], rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 3]}], eventOnChange: 'chyyDm' },
	{ label: '申请撤回的原申报业务类型', name: 'chywlxDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['code_dm_ckts_chywlx', '01'], rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 20]}], eventOnChange: 'chywlxDm01' },
	{ label: '申请撤回的原申报年月', name: 'sbchyssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}]},
	{ label: '申请撤回的原申报批次', name: 'sbchysbpc', type: 'Input', readOnly: true, rules: [{ type: 'base_type_number' }, { func: 'sbpc02' }, { func: 'sbchysbpc01' }], eventOnBlur: 'sbchysbpc' },
	{ label: '原申报关联号', name: 'yglh', type: 'Input', readOnly: true, rules: [{ type: 'base_string', range: [0, 30]}, { func: 'yglh02' }]},
	{ label: '原申报序号', name: 'ysbxh', type: 'Input', rules: [{ type: 'base_string', range: [0, 50]}, { func: 'sbxh02' }, { type: 'base_string', length: '8' }, { func: 'ysbxh01' }]},
	{ label: '凭证种类', name: 'cktmspzlxDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['code_dm_ckts_cktmspzlx', '04'], rules: [{ func: 'cktmspzlxDm01' }, { type: 'base_string', range: [0, 2]}, { func: 'cktmspzlxDm01' }], eventOnChange: 'cktmspzlxDm04' },
	{ label: '凭证号码', name: 'jhpzh', type: 'Input', rules: [{ type: 'base_string', range: [0, 75]}, { func: 'jhpzh03' }]},
	{ label: 'ST', name: 'st', type: 'Blank' },
	{ label: '具体原因说明', name: 'yysm', type: 'TextArea', autoSize: { minRows: 2, maxRows: 2}, layout: { label: { xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3}, formItem: { xs: 16, sm: 16, md: 16, lg: 19, xl: 21, xxl: 21 } }, rules: [{ type: 'base_string', range: [0, 2000]}, { func: 'yysm01' }]},
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
  ckts_order: 3, // 是否显示序号重排(默认规则：选择排序)按钮，默认关闭
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                       	// 是否显示编辑链接，默认关闭
  delete: false,                     	// 是否显示删除链接，默认关闭
};

export default unitConfig;

