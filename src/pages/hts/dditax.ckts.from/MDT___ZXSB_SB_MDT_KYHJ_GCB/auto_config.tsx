import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 国际客运（含香港直通车）旅客、行李包裹运输清算函件明细表
 * serviceKey: MDT_ZXSB_SB_MDT_KYHJ_G
 * unitId: mdt_zxsb_sb_mdt_kyhj_gcb
*/

const unitConfig: any = {};

unitConfig.module_key = 'MDT_ZXSB_SB_MDT_KYHJ_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'mdt_zxsb_sb_mdt_kyhj_gcb'; // 页面id
unitConfig.grid_title = '铁路国际客运（含广深港高铁）旅客、行李包裹运输清算函件明细'; // 列表标题，可选
unitConfig.form_title = '铁路国际客运（含广深港高铁）旅客、行李包裹运输清算函件明细'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量
unitConfig.export_key1 = ''; // 采集导出key
unitConfig.export_key2 = ''; // 统计导出key
unitConfig.export_key3 = ''; // 申报结果查询导出key

// 配置列表列
unitConfig.grid_columns = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left', render: { type: 'date', format: 'YYYYMM' } },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '清算函件类别', dataIndex: 'gjkyqshjlbDm', align: 'left', width: 120, codeTable: 'code_dm_ckts_gjkyqshjlb:01' },
	{ title: '清算函件编号', dataIndex: 'hjbh', align: 'left', width: 120},
	{ title: '清算函件出具日期', dataIndex: 'kjrq', align: 'left', width: 120, render: { type: 'date', format: 'YYYY-MM-DD' } },
	{ title: '有关国家地区', dataIndex: 'gjhdqmc', align: 'left', width: 120},
	{ title: '原币名称', dataIndex: 'cjhbzmDm', align: 'left', width: 180, ellipsis: true},
	{ title: '原币汇率', dataIndex: 'cjhbhl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '人民币金额', dataIndex: 'gsyzfndjermb', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '美元汇率', dataIndex: 'myhl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '美元金额', dataIndex: 'gsyzfndjemy', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left', render: { type: 'date', format: 'YYYYMM' } },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '清算函件类别', dataIndex: 'gjkyqshjlbDm', align: 'left', width: 120, codeTable: 'code_dm_ckts_gjkyqshjlb:01' },
	{ title: '清算函件编号', dataIndex: 'hjbh', align: 'left', width: 120},
	{ title: '清算函件出具日期', dataIndex: 'kjrq', align: 'left', width: 120, render: { type: 'date', format: 'YYYY-MM-DD' } },
	{ title: '有关国家地区', dataIndex: 'gjhdqmc', align: 'left', width: 120},
	{ title: '原币名称', dataIndex: 'cjhbzmDm', align: 'left', width: 180, ellipsis: true},
	{ title: '原币汇率', dataIndex: 'cjhbhl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '人民币金额', dataIndex: 'gsyzfndjermb', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '美元汇率', dataIndex: 'myhl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '美元金额', dataIndex: 'gsyzfndjemy', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
	{ title: '成交总价', dataIndex: 'cjzj', align: 'left', width: 140, render: { type: 'number', format: '0,0.00' } },
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'ssq', label: '所属期', type: 'Input' },
	{ name: 'gjkyqshjlbDm', label: '清算函件类别', type: 'Select', 'allowClear': true, codeTable: 'code_dm_ckts_gjkyqshjlb:01' },
	{ name: 'hjbh', label: '清算函件编号', type: 'Input' },
];

// 表单项
unitConfig.form_items = [
	{ label: 'ID', name: 'uuid', type: 'Hidden' },
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle' },
	{ label: '所属期', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}, { func: 'ssq02' }]},
	{ label: '序号', name: 'sbxh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbxh02' }], eventOnBlur: 'sbxh' },
	{ label: '函件信息', name: 'hjxx', type: 'GroupTitle' },
	{ label: '清算函件（月报）类别', name: 'gjkyqshjlbDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: 'code_dm_ckts_gjkyqshjlb:01', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 2]}], eventOnChange: 'gjkyqshjlbDm' },
	{ label: '清算函件编号（月报月份）', name: 'hjbh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 32]}]},
	{ label: '清算函件（月报）出具日期', name: 'kjrq', type: 'DatePicker', 'allowClear': true, format: 'YYYY-MM-DD', rules: [{ type: 'base_required' }, { type: 'base_date', format: 'yyyyMMdd' }], eventOnChange: 'kjrq' },
	{ label: '有关国家（外方）或地区', name: 'gjhdqmc', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: 'code_dm_gy_gjhdq:01', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 50]}], eventOnChange: 'gjhdqDm' },
	{ label: '原币代码', name: 'cjhbzmDm', type: 'AutoComplete', showType: '3', 'allowClear': true, codeTable: 'url_gy_hbhl:01', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 3]}], eventOnBlur: 'hbhlDm', eventOnFocus: 'hbhlDm' },
	{ label: '原币名称', name: 'ybbiname', type: 'Input', disabled: true},
	{ label: '归属于中方（内地）金额原币', name: 'cjzj', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+' }], eventOnBlur: 'cjzj' },
	{ label: '归属于中方（内地）金额原币汇率', name: 'cjhbhl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 10, decimal: 5}, { type: 'base_number', range: '+' }], eventOnBlur: 'cjhbhl' },
	{ label: '归属于中方（内地）金额人民币', name: 'gsyzfndjermb', type: 'InputNumber', disabled: true, format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+' }], eventOnBlur: 'gsyzfndjermb' },
	{ label: '归属于中方（内地）金额美元汇率', name: 'myhl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 10, decimal: 5}, { type: 'base_number', range: '+' }], eventOnBlur: 'myhl' },
	{ label: '归属于中方（内地）金额美元', name: 'gsyzfndjemy', type: 'InputNumber', disabled: true, format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+' }]},
	{ label: '其他信息', name: 'qtxx', type: 'GroupTitle' },
	{ label: '备注', name: 'bz', type: 'TextArea', autoSize: { minRows: 3, maxRows: 3 }, layout: CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW},
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
  ckts_sum: true, // 是否显示小计按钮，默认关闭
  ckts_order: 4, // 是否显示序号重排(默认规则：选择排序)按钮，默认关闭
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                       	// 是否显示编辑链接，默认关闭
  delete: false,                     	// 是否显示删除链接，默认关闭
};

unitConfig.customer_toolbar = [];
unitConfig.handle_columns = [];
export default unitConfig;

