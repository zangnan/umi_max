/**
 * title: 跨境销售服务及无形资产免抵退税申报明细
 * serviceKey: MDT_ZXSB_SB_MDT_YFSJ_G
 * unitId: mdt_zxsb_sb_mdt_yfsj_gcb
*/

const unitConfig: any = {};

unitConfig.unit_key = 'MDT_ZXSB_SB_MDT_YFSJ_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'mdt_zxsb_sb_mdt_yfsj_gcb'; // 页面id
unitConfig.grid_title = '跨境销售服务及无形资产免抵退税申报明细'; // 列表标题，可选
unitConfig.form_title = '跨境销售服务及无形资产免抵退税申报明细'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量
unitConfig.export_key1 = 'SAAS_TSSB_MXCJ_YFSJ_DC'; // 采集导出key
unitConfig.export_key2 = 'SAAS_SJGL_SWFKCX_MDT_KJYSXWMDTSSBMXB_DC'; // 统计导出key
unitConfig.export_key3 = 'SAAS_TSSB_MDT_SBMXCK_KJYSXWMDTSSBMXB_DC'; // 申报结果查询导出key
unitConfig.form_api_save_upload = `${API_URL_BASE}/yw/bszx/mdt/ysfw/yfsj/updateYsfwYfsjTssb`; // api 表单更新
unitConfig.form_api_delete = `${API_URL_BASE}/yw/bszx/mdt/ysfw/yfsj/deleteYsfwYfsjTssb`; // api 表单删除

// 配置列表列
unitConfig.grid_columns = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '出口发票号', dataIndex: 'ckfph', align: 'left', width: 150, ellipsis: true},
	{ title: '出口发票开具日期', dataIndex: 'kjrq', align: 'left', width: 150, render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '跨境销售服务及无形资产代码', dataIndex: 'ysfwDm', align: 'left', width: 200},
	{ title: '跨境销售服务及无形资产名称', dataIndex: 'ysfwmc', align: 'left', width: 200, ellipsis: true},
	{ title: '合同号', dataIndex: 'hth', align: 'left', width: 220, ellipsis: true},
	{ title: '有关证明编号', dataIndex: 'cktszmbh', align: 'left', width: 160},
	{ title: '境外单位名称', dataIndex: 'jwdwmc', align: 'left', width: 180, ellipsis: true},
	{ title: '境外单位所在国家或地区代码', dataIndex: 'gjhdqszDm', align: 'left', width: 200, ellipsis: true},
	{ title: '境外单位所在国家或地区名称', dataIndex: 'jwdwszgdhdqmc', align: 'left', width: 200, ellipsis: true},
	{ title: '合同人民币总金额', dataIndex: 'htzjermb', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '合同美元总金额', dataIndex: 'htzjemy', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '收入原币代码', dataIndex: 'srybzmDm', align: 'left', width: 165},
	{ title: '原币币别', dataIndex: 'ybbb', align: 'left', width: 165},
	{ title: '营业收入原币金额', dataIndex: 'srybje', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '收入原币汇率', dataIndex: 'srybhl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '营业收入人民币金额', dataIndex: 'bqqrysfwyysrrmbje', align: 'right', width: 180, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '收入美元汇率', dataIndex: 'srmyhl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '营业收入美元金额', dataIndex: 'skjemy', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '收款原币代码', dataIndex: 'skybDm', align: 'left', width: 135},
	{ title: '收款原币币别', dataIndex: 'skybbb', align: 'left', width: 135},
	{ title: '本期原币收款额', dataIndex: 'bqybske', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '收款原币汇率', dataIndex: 'cjhbhl', align: 'right', width: 145, sum: true, render: { type: 'number', format: '0,0.00000' } },
	{ title: '本期人民币收款额', dataIndex: 'ysfwyyermb', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '收款美元汇率', dataIndex: 'skmyhl', align: 'right', width: 145, sum: true, render: { type: 'number', format: '0,0.00000' } },
	{ title: '本期美元收款额', dataIndex: 'bqskjemy', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '免抵退税计税金额', dataIndex: 'ysfwyyemdtsjsje', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '征税率', dataIndex: 'zssl', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '退税率', dataIndex: 'tsl', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '免抵退税计税金额乘征退税率之差', dataIndex: 'ztsce', align: 'right', width: 240, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '免抵退税计税金额乘退税率', dataIndex: 'ytse1', align: 'right', width: 180, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '跨境销售服务及无形资产类型代码', dataIndex: 'cktmsywlxdmjh', align: 'left', width: 240},
  { title: '跨境销售服务及无形资产类型名称', dataIndex: 'cktmsywlxmcjh', align: 'left', width: 260},
  { title: '备注', dataIndex: 'bz', align: 'left', width: 200, ellipsis: true},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '出口发票号', dataIndex: 'ckfph', align: 'left', width: 150, ellipsis: true},
	{ title: '出口发票开具日期', dataIndex: 'kjrq', align: 'left', width: 150, render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '跨境销售服务及无形资产代码', dataIndex: 'ysfwDm', align: 'left', width: 150},
	{ title: '跨境销售服务及无形资产名称', dataIndex: 'ysfwmc', align: 'left', width: 180, ellipsis: true},
	{ title: '合同号', dataIndex: 'hth', align: 'left', width: 220, ellipsis: true},
	{ title: '有关证明编号', dataIndex: 'cktszmbh', align: 'left', width: 160},
	{ title: '境外单位名称', dataIndex: 'jwdwmc', align: 'left', width: 180, ellipsis: true},
	{ title: '境外单位所在国家或地区代码', dataIndex: 'gjhdqszDm', align: 'left', width: 180, ellipsis: true},
	{ title: '境外单位所在国家或地区名称', dataIndex: 'jwdwszgdhdqmc', align: 'left', width: 180, ellipsis: true},
	{ title: '合同人民币总金额', dataIndex: 'htzjermb', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '合同美元总金额', dataIndex: 'htzjemy', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '收入原币代码', dataIndex: 'srybzmDm', align: 'left', width: 165},
	{ title: '原币币别', dataIndex: 'ybbb', align: 'left', width: 165},
	{ title: '营业收入原币金额', dataIndex: 'srybje', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '收入原币汇率', dataIndex: 'srybhl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '营业收入人民币金额', dataIndex: 'bqqrysfwyysrrmbje', align: 'right', width: 180, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '收入美元汇率', dataIndex: 'srmyhl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '营业收入美元金额', dataIndex: 'skjemy', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '收款原币代码', dataIndex: 'skybDm', align: 'left', width: 135},
	{ title: '收款原币币别', dataIndex: 'skybbb', align: 'left', width: 135},
	{ title: '本期原币收款额', dataIndex: 'bqybske', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '收款原币汇率', dataIndex: 'cjhbhl', align: 'right', width: 145, sum: true, render: { type: 'number', format: '0,0.00000' } },
	{ title: '本期人民币收款额', dataIndex: 'ysfwyyermb', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '收款美元汇率', dataIndex: 'skmyhl', align: 'right', width: 145, sum: true, render: { type: 'number', format: '0,0.00000' } },
	{ title: '本期美元收款额', dataIndex: 'bqskjemy', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '免抵退税计税金额', dataIndex: 'ysfwyyemdtsjsje', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '征税率', dataIndex: 'zssl', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '退税率', dataIndex: 'tsl', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '免抵退税计税金额乘征退税率之差', dataIndex: 'ztsce', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '免抵退税计税金额乘退税率', dataIndex: 'ytse1', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '跨境销售服务及无形资产类型代码', dataIndex: 'cktmsywlxdmjh', align: 'left', width: 200},
	{ title: '跨境销售服务及无形资产类型名称', dataIndex: 'cktmsywlxmcjh', align: 'left', width: 180, ellipsis: true},
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
	{ title: '免抵退税年月', dataIndex: 'mdtsny', align: 'left', width: 120},
	{ title: '是否不予退税', dataIndex: 'bytsbz', align: 'left', width: 120, render: { func: 'bytsbz' } },
	{ title: '是否不予办理', dataIndex: 'byblbz', align: 'left', width: 120, render: { func: 'byblbz' } },
	{ title: '不予办理年月', dataIndex: 'byblny', align: 'left', width: 120},
	{ title: '是否暂不办理', dataIndex: 'zbblbz', align: 'left', width: 120, render: { func: 'zbblbz' } },
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'ysfwDm', label: '跨境销售服务及无形资产代码', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['code_dm_ckts_ysfwdm',  '02'] },
	{ name: 'cktmsywlxdmjh', label: '跨境销售服务及无形资产类型代码', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['code_dm_ckts_yfsjfw',  '02'] },
	{ name: 'hth', label: '合同号', type: 'Input' },
	{ name: 'ssq', label: '所属期', type: 'Input' },
];

// 表单项
unitConfig.form_items = [
	{ label: '申报ID', name: 'uuid', type: 'Hidden' },
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle' },
	{ label: '所属期', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}, { func: 'ssq02' }]},
	{ label: '序号', name: 'sbxh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbxh02' }], eventOnBlur: 'sbxh' },
	{ label: '跨境应税行为信息', name: 'ysfwxx', type: 'GroupTitle' },
	{ label: '合同号', name: 'hth', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 30]}], eventOnBlur: 'hth' },
	{ label: '出口发票号码', name: 'ckfph', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 30]}]},
	{ label: '出口发票开具日期', name: 'kprq', type: 'DatePicker', 'allowClear': true, format: 'yyyy-MM-DD', rules: [{ type: 'base_required' }, { type: 'base_date', format: 'yyyyMMdd' }], eventOnChange: 'kprq' },
	{ label: '跨境销售服务及无形资产代码', name: 'ysfwDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['url_ckts_ysfwdm', '02'], rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { type: 'base_string', range: [0, 12]}, { func: 'ysfwDm01' }], eventOnChange: 'ysfwDm' },
	{ label: '跨境销售服务及无形资产名称', name: 'ysfwmc', type: 'Input', readOnly: true, rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 30]}]},
	{ label: '有关证明编号', name: 'cktszmbh', type: 'Input', rules: [{ type: 'base_string', range: [0, 20]}, { func: 'cktszmbh01' }]},
	{ label: '境外单位名称', name: 'jwdwmc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 80]}]},
	{ label: '境外单位所在国家或地区代码', name: 'gjhdqszDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['code_dm_gy_gjhdq', '01'], rules: [{ type: 'base_required' }], eventOnChange: 'gjhdqDm' },
	{ label: '单位所在国家', name: 'gbname', type: 'Input', readOnly: true},
	{ label: '合同人民币总金额', name: 'htzjermb', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', range: '+-' }, { type: 'base_number', length: 14, decimal: 2}]},
	{ label: '合同美元总金额', name: 'htzjemy', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', range: '+-' }, { type: 'base_number', length: 14, decimal: 2}]},
	{ label: '收入原币代码', name: 'srybzmDm', type: 'AutoComplete', showType: '3', 'allowClear': true, codeTable: ['url_gy_hbhl', '01'], rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 3]}], eventOnBlur: 'hbhlDm', eventOnFocus: 'hbhlDm' },
	{ label: '原币币别', name: 'srbiname', type: 'Input', readOnly: true},
	{ label: '营业收入原币金额', name: 'srybje', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', range: '+-' }, { type: 'base_number', length: 16, decimal: 2}], eventOnBlur: 'srybje' },
	{ label: '收入原币汇率', name: 'srybhl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', range: '+' }, { type: 'base_number', length: 10, decimal: 5}], eventOnBlur: 'srybhl' },
	{ label: '营业收入人民币金额', name: 'bqqrysfwyysrrmbje', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}], eventOnBlur: 'bqqrysfwyysrrmbje' },
	{ label: '收入美元汇率', name: 'srmyhl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', range: '+' }, { type: 'base_number', length: 10, decimal: 5}], eventOnBlur: 'srmyhl' },
	{ label: '营业收入美元金额', name: 'skjemy', type: 'InputNumber', format: '0,0.00', rules: [{ func: 'setZero' }, { type: 'base_number', length: 16, decimal: 2}]},
	{ label: '本期收款凭证份数', name: 'bqskpzfs', type: 'Hidden' },
	{ label: '收款原币代码', name: 'skybzmDm', type: 'AutoComplete', showType: '3', 'allowClear': true, codeTable: ['url_gy_hbhl', '01'], rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 3]}], eventOnBlur: 'hbhlDm', eventOnFocus: 'hbhlDm' },
	{ label: '收款原币币别', name: 'skbiname', type: 'Input', readOnly: true},
	{ label: '收款原币金额', name: 'skybje', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_number', length: 16, decimal: 2}, { func: 'setZero' }], eventOnBlur: 'skybje', eventOnChange: 'skybje' },
	{ label: '收款原币汇率', name: 'cjhbhl', type: 'InputNumber', format: '0,0.00000', rules: [{ func: 'setZero' }], eventOnBlur: 'cjhbhl' },
	{ label: '本期人民币收款额', name: 'ysfwyyermb', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', range: '+-' }, { type: 'base_number', length: 14, decimal: 2}], eventOnBlur: 'ysfwyyermb', eventOnChange: 'ysfwyyermb' },
	{ label: '收款美元汇率', name: 'myhl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 10, decimal: 5}, { type: 'base_number', range: '+' }], eventOnBlur: 'myhl' },
	{ label: '本期收款金额（美元）', name: 'bqskjemy', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 16, decimal: 2}, { type: 'base_number', range: '+-' }]},
	{ label: '免抵退税计税金额', name: 'ysfwyyemdtsjsje', type: 'InputNumber', readOnly: true, format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 16, decimal: 2}], eventOnBlur: 'ysfwyyemdtsjsje' },
	{ label: '退税信息', name: 'tsxx', type: 'GroupTitle' },
	{ label: '征税率', name: 'zssl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 5, decimal: 2}, { type: 'base_number', range: '+-' }, { type: 'base_number', range: '+0' }], eventOnBlur: 'zssl' },
	{ label: '退税率', name: 'tsl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 5, decimal: 2}, { type: 'base_number', range: '+-' }, { type: 'base_number', range: '+0' }, { func: 'tsl01' }], eventOnBlur: 'tsl' },
	{ label: '免抵退税计税金额乘征退税率之差', name: 'ztsce', type: 'InputNumber', readOnly: true, format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 16, decimal: 2}]},
	{ label: '免抵退税计税金额乘退税率', name: 'ytse1', type: 'InputNumber', readOnly: true, format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 16, decimal: 2}]},
	{ label: '其他信息', name: 'qtxx', type: 'GroupTitle' },
	{ label: '跨境销售服务及无形资产类型代码', name: 'cktmsywlxdmjh', type: 'Input', readOnly: true},
	{ label: '跨境销售服务及无形资产类型名称', name: 'cktmsywlxmcjh', type: 'Input', readOnly: true, rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 75]}]},
	{ label: 'ST', name: 'st', type: 'Blank' },
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
  upload: true,  // 是否显示导入按钮，默认关闭
  ckts_sum: true, // 是否显示小计按钮，默认关闭
  ckts_order: 4, // 是否显示序号重排(默认规则：选择排序)按钮，默认关闭
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                       	// 是否显示编辑链接，默认关闭
  delete: false,                     	// 是否显示删除链接，默认关闭
};

export default unitConfig;

