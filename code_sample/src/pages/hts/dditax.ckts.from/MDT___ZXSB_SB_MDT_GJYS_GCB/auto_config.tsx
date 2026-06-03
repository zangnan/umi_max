/**
 * title: 国际运输（港澳台运输）、航天运输免抵退税申报明细表
 * serviceKey: MDT_ZXSB_SB_MDT_GJYS_G
 * unitId: mdt_zxsb_sb_mdt_gjys_gcb
*/

const unitConfig: any = {};

unitConfig.unit_key = 'MDT_ZXSB_SB_MDT_GJYS_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'mdt_zxsb_sb_mdt_gjys_gcb'; // 页面id
unitConfig.grid_title = '国际运输（港澳台运输）、航天运输免抵退税申报明细'; // 列表标题，可选
unitConfig.form_title = '国际运输（港澳台运输）、航天运输免抵退税申报明细'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量
unitConfig.export_key1 = ''; // 采集导出key
unitConfig.export_key2 = ''; // 统计导出key
unitConfig.export_key3 = ''; // 申报结果查询导出key
unitConfig.form_api_save_upload = `${API_URL_BASE}/yw/bszx/mdt/gjys/tssb/updateGjysTssb`; // api 表单更新
unitConfig.form_api_delete = `${API_URL_BASE}/yw/bszx/mdt/gjys/tssb/deleteGjysTssb`; // api 表单删除

// 配置列表列
unitConfig.grid_columns = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left', render: { type: 'date', format: 'yyyyMM' } },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '跨境销售服务及无形资产代码', dataIndex: 'ysfwDm', align: 'left', width: 200},
	{ title: '跨境销售服务及无形资产名称', dataIndex: 'ysfwmc', align: 'left', width: 200, ellipsis: true},
	{ title: '本期运输次数', dataIndex: 'bcyscs', align: 'right', width: 120},
	{ title: '自运舱单份数', dataIndex: 'zycdfs', align: 'right', width: 120},
	{ title: '自运提单份数', dataIndex: 'zytdydfshzkrs', align: 'right', width: 120},
	{ title: '人民币营业额', dataIndex: 'ysfwyyermb', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '美元营业额', dataIndex: 'ysfwyyemy', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '计税金额', dataIndex: 'ysfwyyemdtsjsje', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '征税率', dataIndex: 'zssl', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '退税率', dataIndex: 'tsl', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '免抵退税计税金额乘征退税率之差', dataIndex: 'ztsce', align: 'right', width: 230, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '免抵退税计税金额乘退税率', dataIndex: 'ytse1', align: 'right', width: 200, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '出口发票开具日期', dataIndex: 'kprq', align: 'left', width: 150, render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '合同协议号', dataIndex: 'hth', align: 'left', width: 180, ellipsis: true},
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left', render: { type: 'date', format: 'yyyyMM' } },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '跨境销售服务及无形资产代码', dataIndex: 'ysfwDm', align: 'left', width: 200},
	{ title: '跨境销售服务及无形资产名称', dataIndex: 'ysfwmc', align: 'left', width: 200, ellipsis: true},
	{ title: '本期运输次数', dataIndex: 'bcyscs', align: 'right', width: 120},
	{ title: '自运舱单份数', dataIndex: 'zycdfs', align: 'right', width: 120},
	{ title: '自运提单份数', dataIndex: 'zytdydfshzkrs', align: 'right', width: 120},
	{ title: '人民币营业额', dataIndex: 'ysfwyyermb', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '美元营业额', dataIndex: 'ysfwyyemy', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '计税金额', dataIndex: 'ysfwyyemdtsjsje', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '征税率', dataIndex: 'zssl', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '退税率', dataIndex: 'tsl', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '免抵退税计税金额乘征退税率之差', dataIndex: 'ztsce', align: 'right', width: 230, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '免抵退税计税金额乘退税率', dataIndex: 'ytse1', align: 'right', width: 200, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '出口发票开具日期', dataIndex: 'kprq', align: 'left', width: 150, render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '合同协议号', dataIndex: 'hth', align: 'left', width: 180, ellipsis: true},
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
	{ title: '美元汇率', dataIndex: 'myhl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '成交货币字母代码', dataIndex: 'cjhbzmDm', align: 'left', width: 170},
	{ title: '成交总价', dataIndex: 'cjzj', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '免抵退税年月', dataIndex: 'mdtsny', align: 'left', width: 120},
	{ title: '是否不予退税', dataIndex: 'bytsbz', align: 'left', width: 120, render: { func: 'bytsbz' } },
	{ title: '是否不予办理', dataIndex: 'byblbz', align: 'left', width: 120, render: { func: 'byblbz' } },
	{ title: '是否暂不办理', dataIndex: 'zbblbz', align: 'left', width: 120, render: { func: 'zbblbz' } },
	{ title: '不予办理年月', dataIndex: 'byblny', align: 'left', width: 120},
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'ssq', label: '所属期', type: 'Input' },
	{ name: 'ysfwDm', label: '跨境销售服务及无形资产代码', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['code_dm_ckts_ysfwdm',  '01'] },
];

// 表单项
unitConfig.form_items = [
	{ label: 'ID', name: 'uuid', type: 'Hidden', readOnly: true},
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle' },
	{ label: '所属期', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}, { func: 'ssq02' }]},
	{ label: '序号', name: 'sbxh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbxh02' }], eventOnBlur: 'sbxh' },
	{ label: '运输信息', name: 'ysxx', type: 'GroupTitle' },
	{ label: '出口发票号码', name: 'ckfph', type: 'Input', rules: [{ type: 'base_string', range: [0, 30]}]},
	{ label: '出口发票开具日期', name: 'kprq', type: 'DatePicker', 'allowClear': true, format: 'yyyy-MM-DD', rules: [{ type: 'base_required' }, { type: 'base_date', format: 'yyyyMMdd' }], eventOnChange: 'kprq' },
	{ label: '跨境销售服务及无形资产代码', name: 'ysfwDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['url_ckts_ysfwdm', '01'], rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 12]}, { func: 'ysfwDm01' }], eventOnChange: 'ysfwDm' },
	{ label: '跨境销售服务及无形资产名称', name: 'ysfwmc', type: 'Input', readOnly: true, rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 30]}]},
	{ label: '本次运输次数', name: 'bcyscs', type: 'InputNumber', rules: [{ type: 'base_number', length: 10, decimal: 0}]},
	{ label: '自运舱单份数', name: 'zycdfs', type: 'InputNumber', rules: [{ type: 'base_number', length: 10, decimal: 0}]},
	{ label: '自运提单（运单）份数或载客人数', name: 'zytdydfshzkrs', type: 'InputNumber', rules: [{ type: 'base_number', length: 10, decimal: 0}]},
	{ label: '原币代码', name: 'cjhbzmDm', type: 'AutoComplete', showType: '3', 'allowClear': true, codeTable: ['url_gy_hbhl', '01'], rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 3]}], eventOnBlur: 'hbhlDm', eventOnFocus: 'hbhlDm' },
	{ label: '原币币别', name: 'ybbiname', type: 'Input', readOnly: true},
	{ label: '原币营业额', name: 'cjzj', type: 'InputNumber', format: '0,0.00', eventOnBlur: 'cjzj' },
	{ label: '原币汇率', name: 'ybhl', type: 'InputNumber', format: '0,0.00000', eventOnBlur: 'ybhl' },
	{ label: '跨境应税行为营业额（折人民币）', name: 'ysfwyyermb', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+-' }], eventOnBlur: 'ysfwyyermb' },
	{ label: '美元汇率', name: 'myhl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 10, decimal: 5}, { type: 'base_number', range: '+' }], eventOnBlur: 'myhl' },
	{ label: '跨境应税行为营业额（折美元）', name: 'ysfwyyemy', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', range: '+-' }, { type: 'base_number', length: 14, decimal: 2}]},
	{ label: '跨境应税行为营业额免抵退税计税金额', name: 'ysfwyyemdtsjsje', type: 'InputNumber', readOnly: true, format: '0,0.00', rules: [{ type: 'base_required' }], eventOnBlur: 'ysfwyyemdtsjsje' },
	{ label: '退税信息', name: 'tsxx', type: 'GroupTitle' },
	{ label: '征税率', name: 'zssl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 5, decimal: 2}, { type: 'base_number', range: '+-' }, { type: 'base_number', range: '+0' }], eventOnBlur: 'zssl' },
	{ label: '退税率', name: 'tsl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 5, decimal: 2}, { type: 'base_number', range: '+-' }, { type: 'base_number', range: '+0' }], eventOnBlur: 'tsl' },
	{ label: '免抵退税计税金额乘征退税率之差', name: 'ztsce', type: 'InputNumber', readOnly: true, format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}]},
	{ label: '免抵退税计税金额乘退税率', name: 'ytse1', type: 'InputNumber', readOnly: true, format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}]},
	{ label: '期租、程租、湿租合同或协议号', name: 'hth', type: 'Input', rules: [{ type: 'base_string', range: [0, 30]}]},
	{ label: '其他信息', name: 'qtxx', type: 'GroupTitle' },
	{ label: '备注', name: 'bz', type: 'TextArea', autoSize: { minRows: 2, maxRows: 2}, layout: { label: { xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3}, formItem: { xs: 16, sm: 16, md: 16, lg: 19, xl: 21, xxl: 21 } }},
	{ label: '免抵退税年月', name: 'mdtsny', type: 'Input', readOnly: true, format: 'yyyyMM' },
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

