import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 跨境销售服务及无形资产收讫营业款明细清单
 * serviceKey: MDT_ZXSB_SB_MDT_SYYK_G
 * unitId: mdt_zxsb_sb_mdt_syyk_gcb
*/

const unitConfig: any = {};

unitConfig.module_key = 'MDT_ZXSB_SB_MDT_SYYK_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'mdt_zxsb_sb_mdt_syyk_gcb'; // 页面id
unitConfig.grid_title = '跨境销售服务及无形资产收讫营业款明细清单'; // 列表标题，可选
unitConfig.form_title = '跨境销售服务及无形资产收讫营业款明细清单'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量
unitConfig.export_key1 = 'SAAS_TSSB_MXCJ_SYYK_DC'; // 采集导出key
unitConfig.export_key2 = 'SAAS_SJGL_SWFKCX_MDT_KJYSXWSQYKMXQD_DC'; // 统计导出key
unitConfig.export_key3 = 'SAAS_TSSB_MDT_SBMXCK_KJYSXWSQYKMXQD_DC'; // 申报结果查询导出key

// 配置列表列
unitConfig.grid_columns = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '合同号', dataIndex: 'hth', align: 'left', width: 140, ellipsis: true},
	{ title: '本期收款时间', dataIndex: 'skrq', align: 'left', width: 120, render: { type: 'date', format: 'YYYY-MM-DD' } },
	{ title: '本期收款凭证号', dataIndex: 'skpzh', align: 'left', width: 200},
	{ title: '收款凭证美元总金额', dataIndex: 'skpzzjemy', align: 'right', width: 180, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '原币代码', dataIndex: 'ybDm', align: 'left', width: 200},
	{ title: '原币币别', dataIndex: 'ybbb', align: 'right', width: 200},
	{ title: '原币收款额', dataIndex: 'ybske', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '原币汇率', dataIndex: 'ybhl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '本期收款人民币额', dataIndex: 'bqskrmbe', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '美元汇率', dataIndex: 'myhl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '本期收款美元额', dataIndex: 'bqskmye', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '本期收款银行名称', dataIndex: 'skyhmc', align: 'left', width: 180, ellipsis: true},
	{ title: '本期付款单位名称', dataIndex: 'fkdwmc', align: 'left', width: 180, ellipsis: true},
	{ title: '付款单位所在国家（地区）代码', dataIndex: 'gjhdqszDm', align: 'left', width: 220},
	{ title: '付款单位所在国家（地区）名称', dataIndex: 'fkdwszgjdqmc', align: 'left', width: 240, ellipsis: true},
	{ title: '本期付款银行名称', dataIndex: 'fkyhmc', align: 'left', width: 180, ellipsis: true},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '合同号', dataIndex: 'hth', align: 'left', width: 140, ellipsis: true},
	{ title: '本期收款时间', dataIndex: 'skrq', align: 'left', width: 120, render: { type: 'date', format: 'YYYY-MM-DD' } },
	{ title: '本期收款凭证号', dataIndex: 'skpzh', align: 'left', width: 200},
	{ title: '收款凭证美元总金额', dataIndex: 'skpzzjemy', align: 'right', width: 180, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '原币代码', dataIndex: 'ybDm', align: 'left', width: 200},
	{ title: '原币币别', dataIndex: 'ybbb', align: 'right', width: 200},
	{ title: '原币收款额', dataIndex: 'ybske', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '原币汇率', dataIndex: 'ybhl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '本期收款人民币额', dataIndex: 'bqskrmbe', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '美元汇率', dataIndex: 'myhl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '本期收款美元额', dataIndex: 'bqskmye', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '本期收款银行名称', dataIndex: 'skyhmc', align: 'left', width: 180, ellipsis: true},
	{ title: '本期付款单位名称', dataIndex: 'fkdwmc', align: 'left', width: 180, ellipsis: true},
	{ title: '付款单位所在国家（地区）代码', dataIndex: 'gjhdqszDm', align: 'left', width: 220},
	{ title: '付款单位所在国家（地区）名称', dataIndex: 'fkdwszgjdqmc', align: 'left', width: 240, ellipsis: true},
	{ title: '本期付款银行名称', dataIndex: 'fkyhmc', align: 'left', width: 180, ellipsis: true},
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'hth', label: '合同号', type: 'Input' },
	{ name: 'ssq', label: '所属期', type: 'Input' },
];

// 表单项
unitConfig.form_items = [
	{ label: '申报ID', name: 'uuid', type: 'Hidden' },
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle' },
	{ label: '所属期', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'YYYYMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}, { func: 'ssq02' }]},
	{ label: '序号', name: 'sbxh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbxh02' }], eventOnBlur: 'sbxh' },
	{ label: '收款信息 ', name: 'skxx', type: 'GroupTitle' },
	{ label: '合同号', name: 'hth', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 30]}], eventOnBlur: 'hth' },
	{ label: '本期收款时间', name: 'skrq', type: 'DatePicker', 'allowClear': true, format: 'YYYY-MM-DD', rules: [{ type: 'base_required' }, { type: 'base_date', format: 'YYYYMMdd' }], eventOnChange: 'skrq' },
	{ label: '本期收款凭证号', name: 'skpzh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 22]}]},
	{ label: '收款凭证美元总金额', name: 'skpzzjemy', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+-' }, { func: 'skpzzjemy01' }]},
	{ label: '原币代码', name: 'hbzmDm', type: 'AutoComplete', showType: '3', 'allowClear': true, codeTable: 'url_gy_hbhl:01', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 3]}], eventOnBlur: 'hbhlDm', eventOnFocus: 'hbhlDm' },
	{ label: '原币币别', name: 'biname', type: 'Input', readOnly: true},
	{ label: '原币收款额', name: 'cjzj', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+-' }], eventOnBlur: 'cjzj' },
	{ label: '原币汇率', name: 'ybhl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', range: '+-' }], eventOnBlur: 'ybhl' },
	{ label: '本期收款人民币额', name: 'skjermb', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', range: '+-' }, { type: 'base_number', length: 14, decimal: 2}], eventOnBlur: 'skjermb' },
	{ label: '美元汇率', name: 'myhl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 10, decimal: 5}, { type: 'base_number', range: '+' }], eventOnBlur: 'myhl' },
	{ label: '本期收款美元额', name: 'skjemy', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+-' }]},
	{ label: '本期收款银行名称', name: 'skyhmc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 60]}]},
	{ label: '本期付款单位名称', name: 'fkdwmc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 80]}]},
	{ label: '付款单位所在国家（地区）代码', name: 'gjhdqszDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: 'code_dm_gy_gjhdq:01', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 3]}], eventOnChange: 'gjhdqDm' },
	{ label: '付款单位所在国家（地区）名称', name: 'gbname', type: 'Input', readOnly: true},
	{ label: '本期付款银行名称', name: 'fkyhmc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 60]}]},
	{ label: '累计已收营业款（折美元）', name: 'ljysyykmy', type: 'Hidden', readOnly: true, format: '0,0.00' },
	{ label: '累计已收营业款（折人民币）', name: 'ljysyykrmb', type: 'Hidden', readOnly: true, format: '0,0.00' },
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

unitConfig.customer_toolbar = [];
unitConfig.handle_columns = [];
export default unitConfig;

