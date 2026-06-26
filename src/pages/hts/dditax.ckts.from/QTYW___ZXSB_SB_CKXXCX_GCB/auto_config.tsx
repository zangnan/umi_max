import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 出口信息查询
 * serviceKey: QTYW_ZXSB_SB_CKXXCX_G
 * unitId: qtyw_zxsb_sb_ckxxcx_gcb
*/

const unitConfig: any = {};

unitConfig.module_key = 'QTYW_ZXSB_SB_CKXXCX_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'qtyw_zxsb_sb_ckxxcx_gcb'; // 页面id
unitConfig.grid_title = '出口信息查询'; // 列表标题，可选
unitConfig.form_title = '出口信息查询'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量
unitConfig.export_key1 = 'SAAS_QTTMS_QTYW_CKXXCX_DC'; // 采集导出key
unitConfig.export_key2 = 'SAAS_SJGL_SWFKCX_QTSBYW_CKXXCX_DC'; // 统计导出key
unitConfig.export_key3 = 'SAAS_QTTMS_QTYW_SJSB_SBMXCK_CKXXCX_DC'; // 申报结果查询导出key

// 配置列表列
unitConfig.grid_columns = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '申报批次', dataIndex: 'sbpc', align: 'left', width: 90, fixed: 'left' },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '凭证种类', dataIndex: 'cktmspzlxDm', align: 'left', width: 180},
	{ title: '凭证种类名称', dataIndex: 'cktmspzlxmc', align: 'left', width: 180, ellipsis: true},
	{ title: '凭证号码', dataIndex: 'pzhm2', align: 'left', width: 180},
	{ title: '出口（开具）日期', dataIndex: 'ckkjrq', align: 'left', width: 140, render: { type: 'date', format: 'YYYY-MM-DD' } },
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '申报批次', dataIndex: 'sbpc', align: 'left', width: 90, fixed: 'left' },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '凭证种类', dataIndex: 'cktmspzlxDm', align: 'left', width: 180},
	{ title: '凭证种类名称', dataIndex: 'cktmspzlxmc', align: 'left', width: 180, ellipsis: true},
	{ title: '凭证号码', dataIndex: 'pzhm2', align: 'left', width: 180},
	{ title: '出口（开具）日期', dataIndex: 'ckkjrq', align: 'left', width: 140, render: { type: 'date', format: 'YYYY-MM-DD' } },
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
	{ title: '信息查询结果标志', dataIndex: 'xxcxjgbz', align: 'left', width: 200, codeTable: 'code_static_jgbz_dm:01' },
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'ckkjrq', label: '出口（开具）日期', type: 'DatePicker', 'allowClear': true, range: true},
	{ name: 'pzhm2', label: '凭证号码', type: 'Input' },
	{ name: 'cktmspzlxDm', label: '凭证种类', type: 'Select', 'allowClear': true, codeTable: 'code_dm_ckts_cktmspzlx:09' },
	{ name: 'sbpc', label: '申报批次', type: 'Input' },
	{ name: 'ssq', label: '所属期', type: 'Input' },
];

// 表单项
unitConfig.form_items = [
	{ label: 'ID', name: 'uuid', type: 'Hidden' },
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle' },
	{ label: '所属期', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}, { func: 'ssq01' }]},
	{ label: '申报批次', name: 'sbpc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbpc01' }, { func: 'sbpc02' }], eventOnBlur: 'sbpc' },
	{ label: '序号', name: 'sbxh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbxh02' }], eventOnBlur: 'sbxh' },
	{ label: '单证信息', name: 'dzxx', type: 'GroupTitle' },
	{ label: '凭证种类', name: 'cktmspzlxDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: 'code_dm_ckts_cktmspzlx:09', rules: [{ type: 'base_required' }], eventOnChange: 'cktmspzlxDm05' },
	{ label: '凭证种类名称', name: 'dzxxName', type: 'Input', disabled: true},
	{ label: '凭证号码', name: 'pzhm2', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 40]}, { func: 'pzhm201' }], eventOnChange: 'pzhm2' },
	{ label: '出口（开具）日期', name: 'ckkjrq', type: 'DatePicker', 'allowClear': true, format: 'YYYY-MM-DD', rules: [{ type: 'base_required' }, { type: 'base_date', format: 'yyyyMMdd' }]},
	{ label: '其他信息', name: 'qtxx', type: 'GroupTitle' },
	{ label: '备注', name: 'xxcxjgbz', type: 'Hidden' },
	{ label: '申报标志', name: 'sbztDm', type: 'Hidden' },
	{ label: '审核标志', name: 'shbz', type: 'Hidden' },
	{ label: '备注', name: 'bz', type: 'TextArea', rules: [{ type: 'base_string', range: [0, 200]}], autoSize: { minRows: 3, maxRows: 3 }, layout: CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW},
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
  upload: true,  // 是否显示导入按钮，默认关闭
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

