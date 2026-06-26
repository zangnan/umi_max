import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 调整申报申请
 * serviceKey: MTS_ZXSB_SB_MTS_TZSB_G
 * unitId: mts_zxsb_sb_mts_tzsb_gcb
*/

const unitConfig: any = {};

unitConfig.module_key = 'MTS_ZXSB_SB_MTS_TZSB_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'mts_zxsb_sb_mts_tzsb_gcb'; // 页面id
unitConfig.grid_title = '免退税调整申报'; // 列表标题，可选
unitConfig.form_title = '免退税调整申报'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量
unitConfig.export_key1 = 'SAAS_TSSB_MXCJ_TZSB_DC'; // 采集导出key
unitConfig.export_key2 = 'SAAS_SJGL_SWFKCX_MTS_WMQYTZSB_DC'; // 统计导出key
unitConfig.export_key3 = 'SAAS_TSSB_MTS_SBMXCK_WMQYTZSB_DC'; // 申报结果查询导出key

// 配置列表列
unitConfig.grid_columns = [
	{ title: '申报年月', dataIndex: 'ssq', align: 'left', width: 75},
	{ title: '申报批次', dataIndex: 'sbpc', align: 'left', width: 90},
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80},
	{ title: '原申报关联号', dataIndex: 'yglh', align: 'left', width: 175},
	{ title: '原申报类型', dataIndex: 'wmqytzsblxDm', align: 'left', width: 100, codeTable: 'code_dm_ckts_wmqytzsblx:01' },
	{ title: '业务类型代码', dataIndex: 'cktmsywlxdmjh', align: 'left', width: 100, ellipsis: true },
	{ title: '业务类型名称', dataIndex: 'cktmsywlxmcjh', align: 'left', width: 100, },
	{ title: '红字冲减原因代码', dataIndex: 'hzcjyyDm', align: 'center', width: 100, },
	{ title: '红字冲减原因名称', dataIndex: 'hzcjyymc', align: 'left', width: 150, },
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '申报年月', dataIndex: 'ssq', align: 'left', width: 75},
	{ title: '申报批次', dataIndex: 'sbpc', align: 'left', width: 90},
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80},
	{ title: '原申报关联号', dataIndex: 'yglh', align: 'left', width: 175},
	{ title: '原申报类型', dataIndex: 'wmqytzsblxDm', align: 'left', width: 100, codeTable: 'code_dm_ckts_wmqytzsblx:01' },
	{ title: '业务类型代码', dataIndex: 'cktmsywlxdmjh', align: 'left', width: 100, },
	{ title: '业务类型名称', dataIndex: 'cktmsywlxmcjh', align: 'left', width: 100, },
	{ title: '红字冲减原因代码', dataIndex: 'hzcjyyDm', align: 'center', width: 100, },
	{ title: '红字冲减原因名称', dataIndex: 'hzcjyymc', align: 'left', width: 150, },
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'yglh', label: '原申报关联号', type: 'Input' },
	{ name: 'sbpc', label: '申报批次', type: 'Input' },
	{ name: 'ssq', label: '申报年月', type: 'Input' },
];

// 表单项
unitConfig.form_items = [
	{ label: '申报ID', name: 'uuid', type: 'Hidden' },
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle', disabled: true},
	{ label: '申报年月', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}]},
	{ label: '申报批次', name: 'sbpc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbpc01' }, { func: 'sbpc02' }], eventOnBlur: 'sbpc' },
	{ label: '序号', name: 'sbxh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbxh02' }], eventOnBlur: 'sbxh' },
	{ label: '业务信息', name: 'ywxx', type: 'GroupTitle', disabled: true},
	{ label: '原申报关联号', name: 'yglh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 17]}, { func: 'yglh01' }]},
	{ label: '原申报类型', name: 'wmqytzsblxDm', type: 'Select', 'allowClear': true, disabled: true, 'disabled': true, codeTable: 'code_dm_ckts_wmqytzsblx:01', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 1]}]},
	{ label: '业务类型代码', name: 'cktmsywlxdmjh', type: 'AutoComplete' ,showType: '3', 'allowClear': true, codeTable: 'code_dm_ckts_cktmsywlx:08', rules: [{ type: 'base_required' }], eventOnBlur: 'cktmsywlxdmjhOnblur' },
	{ label: '业务类型名称', name: 'cktmsywlxmcjh', type: 'Input', disabled: true, rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 500]}]},
	{ label: '红字冲减原因', name: 'hzcjyyDm', type: 'Select', 'allowClear': true, showType: '3', codeTable: 'code_dm_ckts_hzcjyy:01', rules: [{ func: 'hzcjyyDm' }]},
	{ label: '其他信息', name: 'qtxx', type: 'GroupTitle', disabled: true},
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

