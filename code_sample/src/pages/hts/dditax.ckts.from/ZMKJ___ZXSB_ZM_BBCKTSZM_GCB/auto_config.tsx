/**
 * title: 补办出口退（免）税证明
 * serviceKey: ZMKJ_ZXSB_ZM_BBCKTSZM_G
 * unitId: zmkj_zxsb_zm_bbcktszm_gcb
*/

const unitConfig: any = {};

unitConfig.unit_key = 'ZMKJ_ZXSB_ZM_BBCKTSZM_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'zmkj_zxsb_zm_bbcktszm_gcb'; // 页面id
unitConfig.grid_title = '补办出口退（免）税证明'; // 列表标题，可选
unitConfig.form_title = '补办出口退（免）税证明'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量
unitConfig.export_key1 = ''; // 采集导出key
unitConfig.export_key2 = ''; // 统计导出key
unitConfig.export_key3 = ''; // 申报结果查询导出key

// 配置列表列
unitConfig.grid_columns = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, render: { type: 'date', format: 'yyyyMM' } },
	{ title: '申报批次', dataIndex: 'sbpc', align: 'left', width: 90},
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80},
	{ title: '编号', dataIndex: 'sbbh1', align: 'left', width: 100},
	{ title: '证明种类代码', dataIndex: 'ycktszmlxDm', align: 'left', width: 200, codeTable: ['code_dm_ckts_cktszmlx',  '01'] },
	{ title: '原证明编号', dataIndex: 'ycktszmbh', align: 'left', width: 200},
	{ title: '原税务机关', dataIndex: 'yzmkjswjgmc', align: 'left', width: 300},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, render: { type: 'date', format: 'yyyyMM' } },
	{ title: '申报批次', dataIndex: 'sbpc', align: 'left', width: 90},
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80},
	{ title: '编号', dataIndex: 'sbbh1', align: 'left', width: 100},
	{ title: '证明种类代码', dataIndex: 'ycktszmlxDm', align: 'left', width: 200, codeTable: ['code_dm_ckts_cktszmlx',  '01'] },
	{ title: '原证明编号', dataIndex: 'ycktszmbh', align: 'left', width: 200},
	{ title: '原税务机关', dataIndex: 'yzmkjswjgmc', align: 'left', width: 300},
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'ycktszmlxDm', label: '证明种类代码', type: 'Select', 'allowClear': true, codeTable: ['code_dm_ckts_cktszmlx',  '01'] },
	{ name: 'sbbh1', label: '编号', type: 'Input' },
	{ name: 'sbpc', label: '申报批次', type: 'Input' },
	{ name: 'ssq', label: '所属期', type: 'Input' },
];

// 表单项
unitConfig.form_items = [
	{ label: 'ID', name: 'uuid', type: 'Hidden' },
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle' },
	{ label: '所属期', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}, { func: 'ssq01' }], eventOnChange: 'ssq' },
	{ label: '申报批次', name: 'sbpc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbpc02' }], eventOnBlur: 'sbpc' },
	{ label: '序号', name: 'sbxh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbxh02' }], eventOnBlur: 'sbxh' },
	{ label: '编号', name: 'sbbh1', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { type: 'base_string', length: '10' }, { func: 'sbbh101' }, { func: 'sbbh102' }]},
	{ label: '证明信息', name: 'zmxx', type: 'GroupTitle' },
	{ label: '丢失证明种类', name: 'ycktszmlxDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['code_dm_ckts_cktszmlx', '01'], rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 2]}], eventOnChange: 'cktszmlxDm' },
	{ label: '原证明编号', name: 'ycktszmbh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 20]}, { type: 'base_type_number_english' }]},
	{ label: '原证明开具税务机关', name: 'yzmkjswjgmc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 200]}]},
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

