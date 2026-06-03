/**
 * title: 跨境应税行为免退税申报明细
 * serviceKey: MTS_ZXSB_SB_MTS_YSFWCK_G
 * unitId: mts_zxsb_sb_mts_ysfwck_gcb
*/

const unitConfig: any = {};

unitConfig.unit_key = 'MTS_ZXSB_SB_MTS_YSFWCK_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'mts_zxsb_sb_mts_ysfwck_gcb'; // 页面id
unitConfig.grid_title = '跨境销售服务及无形资产免退税申报明细'; // 列表标题，可选
unitConfig.form_title = '跨境销售服务及无形资产免退税申报明细'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量
unitConfig.export_key1 = 'SAAS_TSSB_MXCJ_YSFWCK_DC'; // 采集导出key
unitConfig.export_key2 = 'SAAS_SJGL_SWFKCX_MTS_WMQYYSFWCK_DC'; // 统计导出key
unitConfig.export_key3 = 'SAAS_TSSB_MTS_SBMXCK_WMQYYSFWCK_DC'; // 申报结果查询导出key

// 配置列表列
unitConfig.grid_columns = [
	{ title: '申报年月', dataIndex: 'ssq', align: 'left', width: 75, fixed: 'left' },
	{ title: '申报批次', dataIndex: 'sbpc', align: 'left', width: 90, fixed: 'left' },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '跨境销售服务及{br}无形资产代码', dataIndex: 'ysfwDm', align: 'left', width: 120, ellipsis: true},
	{ title: '跨境销售服务及{br}无形资产名称', dataIndex: 'ysfwmc', align: 'left', width: 180, ellipsis: true},
	{ title: '合同号', dataIndex: 'hth', align: 'left', width: 140, ellipsis: true},
	{ title: '有关证明编号', dataIndex: 'cktszmbh', align: 'left', width: 140},
	{ title: '出口发票号码', dataIndex: 'ckfph', align: 'left', width: 150, ellipsis: true},
	{ title: '出口发票开具日期', dataIndex: 'ckrq1', align: 'left', width: 150, render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '境外单位名称', dataIndex: 'jwdwmc', align: 'left', width: 180, ellipsis: true},
	{ title: '单位所在国家', dataIndex: 'jwzcgjhdqszDm', align: 'left', width: 120, codeTable: ['code_dm_gy_gjhdq',  '01'] },
	{ title: '合同美元总额', dataIndex: 'htzjemy', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '人民币总额', dataIndex: 'htzjermb', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '已确认营业收入{br}人民币金额', dataIndex: 'bqqrysfwyysrrmbje', align: 'right', width: 140, sum: true, ellipsis: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '收款美元金额', dataIndex: 'skjemy', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '进货凭证号', dataIndex: 'jhpzh', align: 'left', width: 150, ellipsis: true},
	{ title: '供货方纳税人识别号', dataIndex: 'ghfnsrsbh1', align: 'left', width: 200},
	{ title: '开票日期', dataIndex: 'kprq', align: 'left', width: 120, render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '计税金额', dataIndex: 'jsje', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '征税率', dataIndex: 'zssl', align: 'right', width: 100, render: { type: 'number', format: '0,0.0000' } },
	{ title: '退税率', dataIndex: 'tsl', align: 'right', width: 100, render: { type: 'number', format: '0,0.0000' } },
	{ title: '增值税退税额', dataIndex: 'zzstse', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '跨境销售服务及{br}无形资产类型名称', dataIndex: 'cktmsywlxmcjh', align: 'left', width: 150, ellipsis: true},
	{ title: '红字冲减原因代码', dataIndex: 'hzcjyyDm', align: 'center', width: 130, },
	{ title: '红字冲减原因名称', dataIndex: 'hzcjyymc', align: 'left', width: 170, },
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '申报年月', dataIndex: 'ssq', align: 'left', width: 75, fixed: 'left' },
	{ title: '申报批次', dataIndex: 'sbpc', align: 'left', width: 90, fixed: 'left' },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '跨境销售服务及无形资产代码', dataIndex: 'ysfwDm', align: 'left', width: 120},
	{ title: '跨境销售服务及无形资产名称', dataIndex: 'ysfwmc', align: 'left', width: 180, ellipsis: true},
	{ title: '合同号', dataIndex: 'hth', align: 'left', width: 140, ellipsis: true},
	{ title: '出口发票号码', dataIndex: 'ckfph', align: 'left', width: 150, ellipsis: true},
	{ title: '出口发票开具日期', dataIndex: 'ckrq1', align: 'left', width: 150, render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '境外单位名称', dataIndex: 'jwdwmc', align: 'left', width: 180, ellipsis: true},
	{ title: '单位所在国家', dataIndex: 'jwzcgjhdqszDm', align: 'left', width: 90, codeTable: ['code_dm_gy_gjhdq',  '01'] },
	{ title: '合同美元总额', dataIndex: 'htzjemy', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '人民币总额', dataIndex: 'htzjermb', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '已确认营业收入人民币金额', dataIndex: 'bqqrysfwyysrrmbje', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '收款美元金额', dataIndex: 'skjemy', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '进货凭证号', dataIndex: 'jhpzh', align: 'left', width: 150, ellipsis: true},
	{ title: '供货方纳税人识别号', dataIndex: 'ghfnsrsbh1', align: 'left', width: 200},
	{ title: '开票日期', dataIndex: 'kprq', align: 'left', width: 120, render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '计税金额', dataIndex: 'jsje', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '征税率', dataIndex: 'zssl', align: 'right', width: 100, render: { type: 'number', format: '0,0.0000' } },
	{ title: '退税率', dataIndex: 'tsl', align: 'right', width: 100, render: { type: 'number', format: '0,0.0000' } },
	{ title: '增值税退税额', dataIndex: 'zzstse', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '跨境销售服务及无形资产类型名称', dataIndex: 'cktmsywlxmcjh', align: 'left', width: 150},
	{ title: '红字冲减原因代码', dataIndex: 'hzcjyyDm', align: 'center', width: 130, },
	{ title: '红字冲减原因名称', dataIndex: 'hzcjyymc', align: 'left', width: 170, },
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
	{ title: '跨境销售服务及无形资产类型代码', dataIndex: 'cktmsywlxdmjh', align: 'left', width: 150},
	{ title: '是否不予退税', dataIndex: 'bytsbz', align: 'left', width: 120, render: { func: 'bytsbz' } },
	{ title: '是否不予办理', dataIndex: 'byblbz', align: 'left', width: 120, render: { func: 'byblbz' } },
	{ title: '美元汇率', dataIndex: 'myhl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '有关证明编号', dataIndex: 'ygzmbh', align: 'left', width: 160},
	{ title: '是否暂不办理', dataIndex: 'zbblbz', align: 'left', width: 120, render: { func: 'zbblbz' } },
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'hth', label: '合同号', type: 'Input' },
	{ name: 'ysfwDm', label: '跨境销售服务及无形资产代码', type: 'AutoComplete', showType: '3', 'allowClear': true, codeTable: ['url_ckts_ysfwdm',  '01'] },
	{ name: 'sbpc', label: '申报批次', type: 'Input' },
	{ name: 'ssq', label: '申报年月', type: 'Input' },
];

// 表单项
unitConfig.form_items = [
	{ label: 'UUID', name: 'uuid', type: 'Hidden' },
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle' },
	{ label: '申报年月', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}]},
	{ label: '申报批次', name: 'sbpc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbpc01' }, { func: 'sbpc02' }], eventOnBlur: 'sbpc' },
	{ label: '序号', name: 'sbxh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbxh02' }], eventOnBlur: 'sbxh' },
	{ label: '出口信息', name: 'ckxx', type: 'GroupTitle' },
	{ label: '出口发票开具日期', name: 'ckrq1', type: 'DatePicker', 'allowClear': true, format: 'yyyy-MM-DD', rules: [{ type: 'base_required' }, { type: 'base_date', format: 'yyyyMMdd' }]},
	{ label: '跨境销售服务及无形资产代码', name: 'ysfwDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['url_ckts_ysfwdm', '01'], rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 30]}, { func: 'ysfwDm01' }], eventOnChange: 'ysfwDm' },
	{ label: '跨境销售服务及无形资产名称', name: 'ysfwmc', type: 'Input', readOnly: true, rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 50]}]},
	{ label: '合同号', name: 'hth', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 30]}]},
	{ label: '有关证明编号', name: 'cktszmbh', type: 'Input', rules: [{ type: 'base_string', range: [0, 20]}, { func: 'cktszmbh02' }]},
	{ label: '出口发票号码', name: 'ckfph', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 30]}]},
	{ label: '境外单位名称', name: 'jwdwmc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 40]}]},
	{ label: '境外单位所在国家或地区', name: 'jwzcgjhdqszDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['code_dm_gy_gjhdq', '01'], rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 3]}], eventOnChange: 'gjhdqDm' },
	{ label: '合同总金额（折美元）', name: 'htzjemy', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+-' }], eventOnChange: 'htzjemy' },
	{ label: '美元汇率', name: 'myhl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_number', length: 9, decimal: 5}], eventOnBlur: 'myhl' },
	{ label: '合同总金额（折人民币）', name: 'htzjermb', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+-' }]},
	{ label: '已确认营业收入人民币金额', name: 'bqqrysfwyysrrmbje', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+-' }]},
	{ label: '实际收款金额（美元）', name: 'skjemy', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+-' }]},
	{ label: '进货信息', name: 'jhxx', type: 'GroupTitle' },
	{ label: '进货凭证号', name: 'jhpzh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 30]}], eventOnBlur: 'jhpzh' },
	{ label: '供货方纳税人识别号', name: 'ghfnsrsbh1', type: 'Input', rules: [{ type: 'base_string', range: ['15', '20']}, { type: 'base_required' }, { type: 'base_string', range: [0, 20]}]},
	{ label: '开票日期', name: 'kprq', type: 'DatePicker', 'allowClear': true, format: 'yyyy-MM-DD', rules: [{ type: 'base_required' }, { type: 'base_date', format: 'yyyyMMdd' }]},
	{ label: '计税金额', name: 'jsje', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+-' }], eventOnBlur: 'jsje' },
	{ label: '征税率', name: 'zssl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 9, decimal: 4}, { type: 'base_number', range: '+-' }, { type: 'base_number', range: '+0' }, { func: 'tsl01' }], eventOnBlur: 'zssl' },
	{ label: '退税信息', name: 'tsxx', type: 'GroupTitle' },
	{ label: '退税率', name: 'tsl', type: 'InputNumber', readOnly: true, format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 4, decimal: 2}, { type: 'base_number', range: '+-' }, { type: 'base_number', range: '+0' }], eventOnBlur: 'tsl' },
	{ label: '申报增值税退税额', name: 'zzstse', type: 'InputNumber', readOnly: true, format: '0,0.00', rules: [{ type: 'base_number', length: 14, decimal: 2}]},
	{ label: '其他信息', name: 'qtxx', type: 'GroupTitle' },
	{ label: '跨境销售服务及无形资产类型代码', name: 'cktmsywlxdmjh', type: 'Select','allowClear': false, disabled: true, rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 30]}], mode: 'multiple',  eventOnChange: 'cktmsywlxdmjh' },
	{ label: '跨境销售服务及无形资产类型名称', name: 'cktmsywlxmcjh', type: 'Input', readOnly: true, rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 75]}]},
	{ label: '红字冲减原因', name: 'hzcjyyDm', type: 'Select', 'allowClear': true, showType: '3',disabled: true, codeTable: ['code_dm_ckts_hzcjyy', '01'], rules: [{ func: 'hzcjyyDm' }]},
	{ label: 'ST', name: 'st', type: 'Blank' },
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
  ckts_order: 3, // 是否显示序号重排(默认规则：选择排序)按钮，默认关闭
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                       	// 是否显示编辑链接，默认关闭
  delete: false,                     	// 是否显示删除链接，默认关闭
};

export default unitConfig;

