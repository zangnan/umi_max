import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 作废出口退（免）税有关证明
 * serviceKey: ZMKJ_ZXSB_ZM_CKZMZFQD_G
 * unitId: zmkj_zxsb_zm_ckzmzfqd_gcb
*/

const unitConfig: any = {};

unitConfig.module_key = 'ZMKJ_ZXSB_ZM_CKZMZFQD_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'zmkj_zxsb_zm_ckzmzfqd_gcb'; // 页面id
unitConfig.grid_title = '作废出口退（免）税有关证明'; // 列表标题，可选
unitConfig.form_title = '作废出口退（免）税有关证明'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量
unitConfig.export_key1 = ''; // 采集导出key
unitConfig.export_key2 = ''; // 统计导出key
unitConfig.export_key3 = ''; // 申报结果查询导出key

// 配置列表列
unitConfig.grid_columns = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, render: { type: 'date', format: 'YYYYMM' } },
	{ title: '批次', dataIndex: 'sbpc', align: 'left', width: 80},
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80},
	{ title: '证明种类代码', dataIndex: 'cktszmlxDm', align: 'left', width: 175, codeTable: 'code_dm_ckts_cktszmlx:01' },
	{ title: '原证明编号', dataIndex: 'cktszmbh', align: 'left', width: 150},
	{ title: '原税务机关', dataIndex: 'yzmkjswjgmc', align: 'left', width: 150},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, render: { type: 'date', format: 'YYYYMM' } },
	{ title: '批次', dataIndex: 'sbpc', align: 'left', width: 80},
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80},
	{ title: '证明种类代码', dataIndex: 'cktszmlxDm', align: 'left', width: 175, codeTable: 'code_dm_ckts_cktszmlx:01' },
	{ title: '原证明编号', dataIndex: 'cktszmbh', align: 'left', width: 150},
	{ title: '原税务机关', dataIndex: 'yzmkjswjgmc', align: 'left', width: 150},
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'sbpc', label: '批次', type: 'Input' },
	{ name: 'cktszmlxDm', label: '证明种类代码', type: 'Select', 'allowClear': true, codeTable: 'code_dm_ckts_cktszmlx:01' },
	{ name: 'ssq', label: '所属期', type: 'Input' },
];

// 表单项
unitConfig.form_items = [
	{ label: 'ID', name: 'uuid', type: 'Hidden' },
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle' },
	{ label: '所属期', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}, { func: 'ssq01' }]},
	{ label: '申报批次', name: 'sbpc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbpc01' }, { func: 'sbpc02' }]},
	{ label: '申报序号', name: 'sbxh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbxh02' }], eventOnBlur: 'sbxh' },
	{ label: '证明信息', name: 'zmxx', type: 'GroupTitle' },
	{ label: '作废证明种类', name: 'cktszmlxDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: 'code_dm_ckts_cktszmlx:01', rules: [{ type: 'base_required' }], eventOnChange: 'cktszmlxDm' },
	{ label: '作废证明编号', name: 'cktszmbh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 20]}]},
	{ label: '原证明开具税务机关', name: 'yzmkjswjgmc', type: 'Input', rules: [{ type: 'base_string', range: [0, 100]}]},
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

unitConfig.customer_toolbar = [];
unitConfig.handle_columns = [];
export default unitConfig;

