import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 先退后核附表
 * serviceKey: MDT_ZXSB_SB_MDT_XTHH_G
 * unitId: mdt_zxsb_sb_mdt_xthh_gcb
*/

const unitConfig: any = {};

unitConfig.module_key = 'MDT_ZXSB_SB_MDT_XTHH_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'mdt_zxsb_sb_mdt_xthh_gcb'; // 页面id
unitConfig.grid_title = '先退后核附表'; // 列表标题，可选
unitConfig.form_title = '先退后核附表'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量
unitConfig.export_key1 = ''; // 采集导出key
unitConfig.export_key2 = ''; // 统计导出key
unitConfig.export_key3 = ''; // 申报结果查询导出key

// 配置列表列
unitConfig.grid_columns = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '出口货物报关单号码', dataIndex: 'ckbgdh', align: 'left', width: 180},
	{ title: '出口合同号', dataIndex: 'ckhth', align: 'left', width: 565, ellipsis: true},
	{ title: '出口美元额', dataIndex: 'mylaj', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '免抵退税额', dataIndex: 'mdtse', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '账簿名称', dataIndex: 'zbmc', align: 'left', width: 180, ellipsis: true},
	{ title: '记账日期', dataIndex: 'jzrq', align: 'left', width: 120, render: { type: 'date', format: 'YYYY-MM-DD' } },
	{ title: '人民币销售额', dataIndex: 'rmblaj', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '凭证份数', dataIndex: 'pzfs', align: 'right', width: 100},
	{ title: '凭证号码', dataIndex: 'pzbh', align: 'right', width: 305},
	{ title: '美元收款金额', dataIndex: 'skjemy', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '业务类型', dataIndex: 'cktmsywlxdmjh', align: 'left', width: 210, codeTable: 'code_dm_ckts_cktmsywlx:01' },
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '出口货物报关单号码', dataIndex: 'ckbgdh', align: 'left', width: 180},
	{ title: '出口合同号', dataIndex: 'ckhth', align: 'left', width: 565, ellipsis: true},
	{ title: '出口美元额', dataIndex: 'mylaj', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '免抵退税额', dataIndex: 'mdtse', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '账簿名称', dataIndex: 'zbmc', align: 'left', width: 180, ellipsis: true},
	{ title: '记账日期', dataIndex: 'jzrq', align: 'left', width: 120, render: { type: 'date', format: 'YYYY-MM-DD' } },
	{ title: '人民币销售额', dataIndex: 'rmblaj', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '凭证份数', dataIndex: 'pzfs', align: 'right', width: 100},
	{ title: '凭证号码', dataIndex: 'pzbh', align: 'right', width: 305},
	{ title: '美元收款金额', dataIndex: 'skjemy', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '业务类型', dataIndex: 'cktmsywlxdmjh', align: 'left', width: 210, codeTable: 'code_dm_ckts_cktmsywlx:01' },
	{ title: '出口退（免）税业务类型名称集合', dataIndex: 'cktmsywlxmcjh', align: 'left', width: 180, ellipsis: true},
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'ckbgdh', label: '出口货物报关单号码', type: 'Input' },
	{ name: 'ckhth', label: '出口合同号', type: 'Input' },
	{ name: 'ssq', label: '所属期', type: 'Input' },
];

// 表单项
unitConfig.form_items = [
	{ label: 'ID', name: 'uuid', type: 'Hidden' },
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle' },
	{ label: '所属期', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}, { func: 'ssq02' }]},
	{ label: '申报序号', name: 'sbxh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbxh02' }], eventOnBlur: 'sbxh' },
	{ label: '出口信息', name: 'ckxx', type: 'GroupTitle' },
	{ label: '出口货物报关单号码', name: 'ckbgdh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', length: '21' }, { type: 'base_type_number_english' }, { func: 'ckbgdh03' }], eventOnBlur: 'ckbgdh' },
	{ label: '出口合同号', name: 'ckhth', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 32]}]},
	{ label: '本期申报出口额（美元）', name: 'mylaj', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_number', length: 14, decimal: 2}]},
	{ label: '本期申报免抵退税额（元）', name: 'mdtse', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', range: '+-' }, { type: 'base_number', length: 14, decimal: 2}]},
	{ label: '累计申报出口额（美元）', name: 'ljsbckemy', type: 'Hidden', disabled: true, format: '0,0.00' },
	{ label: '累计申报免抵退税额（元）', name: 'ljsbmdtse', type: 'Hidden', disabled: true, format: '0,0.00' },
	{ label: '累计申报次数', name: 'sbcs', type: 'Hidden', disabled: true},
	{ label: '账薄名称', name: 'zbmc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 50]}]},
	{ label: '记账日期', name: 'jzrq', type: 'DatePicker', 'allowClear': true, format: 'YYYY-MM-DD', rules: [{ type: 'base_required' }, { type: 'base_date', format: 'yyyyMMdd' }]},
	{ label: '销售额（元）', name: 'rmblaj', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+-' }]},
	{ label: '凭证份数', name: 'pzfs', type: 'InputNumber', rules: [{ type: 'base_required' }, { type: 'base_number', length: 10, decimal: 0}, { type: 'base_number', range: '+' }]},
	{ label: '凭证号码', name: 'pzbh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 30]}]},
	{ label: '收款金额（美元）', name: 'skjemy', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+-' }]},
	{ label: '业务类型', name: 'cktmsywlxdmjh', type: 'Select', showType: '4', 'showSearch': true, 'mode': 'multiple', eventOnChange: 'cktmsywlxdmjh', 'allowClear': true, disabled: true, 'disabled': true, codeTable: 'code_dm_ckts_cktmsywlx:01', rules: [{ type: 'base_required' }]},
	{ label: '业务类型名称', name: 'cktmsywlxmcjh', type: 'Input', disabled: true, rules: [{ type: 'base_required' }]},
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

