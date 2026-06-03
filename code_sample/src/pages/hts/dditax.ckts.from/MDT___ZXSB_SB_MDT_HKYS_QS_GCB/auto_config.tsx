/**
 * title: 航空运输收入清算账单
 * serviceKey: MDT_ZXSB_SB_MDT_HKYS_QS_G
 * unitId: mdt_zxsb_sb_mdt_hkys_qs_gcb
*/

const unitConfig: any = {};

unitConfig.unit_key = 'MDT_ZXSB_SB_MDT_HKYS_QS_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'mdt_zxsb_sb_mdt_hkys_qs_gcb'; // 页面id
unitConfig.grid_title = '航空国际运输收入清算账单申报明细'; // 列表标题，可选
unitConfig.form_title = '航空国际运输收入清算账单申报明细'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量
unitConfig.export_key1 = ''; // 采集导出key
unitConfig.export_key2 = ''; // 统计导出key
unitConfig.export_key3 = ''; // 申报结果查询导出key

// 配置列表列
unitConfig.grid_columns = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left', render: { type: 'date', format: 'yyyyMM' } },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '清算账单类别', dataIndex: 'hkgjqszdlbDm', align: 'left', width: 120, codeTable: ['code_dm_ckts_hkgjqszdlb',  '01'] },
	{ title: '国际运输类别', dataIndex: 'hkgjyslbDm', align: 'left', width: 120, codeTable: ['code_dm_ckts_hkgjyslb',  '01'] },
	{ title: '清算账单编号', dataIndex: 'qszdbh', align: 'left', width: 120},
	{ title: '清算账单出具日期', dataIndex: 'kjrq', align: 'left', width: 150, render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '收付款国家（地区）名称', dataIndex: 'gjhdqmc', align: 'left', width: 180, ellipsis: true},
	{ title: '清算币种名称', dataIndex: 'hbzmDm', align: 'left', width: 180, ellipsis: true},
	{ title: '客票票号/货单号码', dataIndex: 'kpphhdhm', align: 'left', width: 170},
	{ title: '原币金额', dataIndex: 'cjzj', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '折合人民币金额', dataIndex: 'qsqkjermb', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left', render: { type: 'date', format: 'yyyyMM' } },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '清算账单类别', dataIndex: 'hkgjqszdlbDm', align: 'left', width: 120, codeTable: ['code_dm_ckts_hkgjqszdlb',  '01'] },
	{ title: '国际运输类别', dataIndex: 'hkgjyslbDm', align: 'left', width: 120, codeTable: ['code_dm_ckts_hkgjyslb',  '01'] },
	{ title: '清算账单编号', dataIndex: 'qszdbh', align: 'left', width: 120},
	{ title: '清算账单出具日期', dataIndex: 'kjrq', align: 'left', width: 150, render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '收付款国家（地区）名称', dataIndex: 'gjhdqmc', align: 'left', width: 180, ellipsis: true},
	{ title: '清算币种名称', dataIndex: 'hbzmDm', align: 'left', width: 180, ellipsis: true},
	{ title: '客票票号/货单号码', dataIndex: 'kpphhdhm', align: 'left', width: 170},
	{ title: '原币金额', dataIndex: 'cjzj', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '折合人民币金额', dataIndex: 'qsqkjermb', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
	{ title: '成交货币汇率', dataIndex: 'cjhbhl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'ssq', label: '所属期', type: 'Input' },
	{ name: 'hkgjqszdlbDm', label: '清算账单类别', type: 'Select', 'allowClear': true, codeTable: ['code_dm_ckts_hkgjqszdlb',  '01'] },
	{ name: 'hkgjyslbDm', label: '国际运输类别', type: 'Select', 'allowClear': true, codeTable: ['code_dm_ckts_hkgjyslb',  '01'] },
];

// 表单项
unitConfig.form_items = [
	{ label: 'ID', name: 'uuid', type: 'Hidden' },
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle' },
	{ label: '所属期', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}, { func: 'ssq02' }]},
	{ label: '序号', name: 'sbxh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbxh02' }], eventOnBlur: 'sbxh' },
	{ label: '账单信息', name: 'zdxx', type: 'GroupTitle' },
	{ label: '清算账单编号（INVOICE NO.）', name: 'qszdbh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 32]}]},
	{ label: '清算账单类别', name: 'hkgjqszdlbDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['code_dm_ckts_hkgjqszdlb', '01'], rules: [{ type: 'base_required' }], eventOnChange: 'hkgjqszdlbDm' },
	{ label: '国际运输类别', name: 'hkgjyslbDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['code_dm_ckts_hkgjyslb', '01'], rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 2]}], eventOnChange: 'hkgjyslbDm' },
	{ label: '清算账单出具日期', name: 'kjrq', type: 'DatePicker', 'allowClear': true, format: 'yyyy-MM-DD', rules: [{ type: 'base_required' }, { type: 'base_date', format: 'yyyyMMdd' }], eventOnChange: 'kjrq' },
	{ label: '收付款国家（地区）名称', name: 'gjhdqmc', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['code_dm_gy_gjhdq', '01'], rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 50]}], eventOnChange: 'gjhdqDm' },
	{ label: '清算币种', name: 'hbzmDm', type: 'AutoComplete', showType: '3', 'allowClear': true, codeTable: ['url_gy_hbhl', '01'], rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 3]}], eventOnBlur: 'hbhlDm', eventOnFocus: 'hbhlDm' },
	{ label: '清算币种名称', name: 'qsbzmc', type: 'Input', readOnly: true},
	{ label: '清算情况客票票号/货单号码', name: 'kpphhdhm', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 32]}]},
	{ label: '清算情况原币金额', name: 'cjzj', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+-' }], eventOnBlur: 'cjzj' },
	{ label: '原币汇率', name: 'cjhbhl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 10, decimal: 5}, { type: 'base_number', range: '+' }], eventOnBlur: 'cjhbhl' },
	{ label: '清算情况折合人民币金额', name: 'qsqkjermb', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', range: '+-' }, { type: 'base_number', length: 14, decimal: 2}]},
	{ label: '其他信息', name: 'qtxx', type: 'GroupTitle' },
	{ label: '备注', name: 'bz', type: 'TextArea', autoSize: { minRows: 2, maxRows: 2}, layout: { label: { xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3}, formItem: { xs: 16, sm: 16, md: 16, lg: 19, xl: 21, xxl: 21 } }},
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

export default unitConfig;

