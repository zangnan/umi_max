/**
 * title: 先退税后核销申请
 * serviceKey: ZGBA_ZXSB_SB_MDT_XTHHZG_G
 * unitId: zgba_zxsb_sb_mdt_xthhzg_gcb
*/

const unitConfig: any = {};

unitConfig.unit_key = 'ZGBA_ZXSB_SB_MDT_XTHHZG_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'zgba_zxsb_sb_mdt_xthhzg_gcb'; // 页面id
unitConfig.grid_title = '先退税后核销申请'; // 列表标题，可选
unitConfig.form_title = '先退税后核销申请'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量
unitConfig.export_key1 = ''; // 采集导出key
unitConfig.export_key2 = ''; // 统计导出key
unitConfig.export_key3 = ''; // 申报结果查询导出key

// 配置列表列
unitConfig.grid_columns = [
	{ title: '申请日期', dataIndex: 'tbrq1', align: 'left', width: 120, fixed: 'left', render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '出口合同号', dataIndex: 'ckhth', align: 'left', width: 105, ellipsis: true},
	{ title: '外商名称', dataIndex: 'wsdwmc', align: 'left', width: 180, ellipsis: true},
	{ title: '出口商品代码', dataIndex: 'ckspDm', align: 'left', width: 120},
	{ title: '出口商品名称', dataIndex: 'ckspmc', align: 'left', width: 180, ellipsis: true},
	{ title: '投产日期', dataIndex: 'tcrq', align: 'left', width: 120, render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '完工日期', dataIndex: 'wgrq', align: 'left', width: 120, render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '出口额（美元）', dataIndex: 'mylaj', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '预计收款次数', dataIndex: 'yjskcs', align: 'right', width: 120},
	{ title: '第一次比例', dataIndex: 'dycskbl', align: 'right', width: 140, render: { type: 'number', format: '0,0.0000' } },
	{ title: '第二次比例', dataIndex: 'decskbl', align: 'right', width: 140, render: { type: 'number', format: '0,0.0000' } },
	{ title: '剩余比例', dataIndex: 'qyskbl', align: 'right', width: 140, render: { type: 'number', format: '0,0.0000' } },
	{ title: '业务类型', dataIndex: 'cktmsywlxdmjh', align: 'left', width: 115, codeTable: ['code_dm_ckts_cktmsywlx',  '01'] },
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '申请日期', dataIndex: 'tbrq1', align: 'left', width: 120, fixed: 'left', render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '出口合同号', dataIndex: 'ckhth', align: 'left', width: 105, ellipsis: true},
	{ title: '外商名称', dataIndex: 'wsdwmc', align: 'left', width: 180, ellipsis: true},
	{ title: '出口商品代码', dataIndex: 'ckspDm', align: 'left', width: 120},
	{ title: '出口商品名称', dataIndex: 'ckspmc', align: 'left', width: 180, ellipsis: true},
	{ title: '投产日期', dataIndex: 'tcrq', align: 'left', width: 120, render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '完工日期', dataIndex: 'wgrq', align: 'left', width: 120, render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '出口额（美元）', dataIndex: 'ckemy', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '出口额（美元）', dataIndex: 'mylaj', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '预计收款次数', dataIndex: 'yjskcs', align: 'right', width: 120},
	{ title: '第一次比例', dataIndex: 'dycskbl', align: 'right', width: 140, render: { type: 'number', format: '0,0.0000' } },
	{ title: '第二次比例', dataIndex: 'decskbl', align: 'right', width: 140, render: { type: 'number', format: '0,0.0000' } },
	{ title: '剩余比例', dataIndex: 'qyskbl', align: 'right', width: 140, render: { type: 'number', format: '0,0.0000' } },
	{ title: '业务类型', dataIndex: 'cktmsywlxdmjh', align: 'left', width: 115, codeTable: ['code_dm_ckts_cktmsywlx',  '01'] },
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'tbrq1', label: '申请日期', type: 'DatePicker', 'allowClear': true, range: true},
	{ name: 'ckhth', label: '出口合同号', type: 'Input' },
	{ name: 'ckspDm', label: '出口商品代码', type: 'Input' },
];

// 表单项
unitConfig.form_items = [
	{ label: 'UUID', name: 'uuid', type: 'Hidden' },
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle' },
	{ label: '申请日期', name: 'tbrq1', type: 'DatePicker', 'allowClear': true, format: 'yyyy-MM-DD', rules: [{ type: 'base_required' }, { type: 'base_date', format: 'yyyyMMdd' }, { func: 'tbrq104' }]},
	{ label: '序号', name: 'sbxh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbxh02' }], eventOnBlur: 'sbxh' },
	{ label: '企业信息', name: 'qyxx', type: 'GroupTitle' },
	{ label: '出口合同号', name: 'ckhth', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 32]}]},
	{ label: '外商名称', name: 'wsdwmc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 200]}]},
	{ label: '出口商品代码', name: 'ckspDm', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 12]}], eventOnBlur: 'ckspDm' },
	{ label: '出口商品名称', name: 'ckspmc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 75]}]},
	{ label: '出口合同规定的内容_投产日期', name: 'tcrq', type: 'DatePicker', 'allowClear': true, format: 'yyyy-MM-DD', rules: [{ type: 'base_required' }, { type: 'base_date', format: 'yyyyMMdd' }, { func: 'tcrq01' }]},
	{ label: '出口合同规定的内容_完工日期', name: 'wgrq', type: 'DatePicker', 'allowClear': true, format: 'yyyy-MM-DD', rules: [{ type: 'base_required' }, { type: 'base_date', format: 'yyyyMMdd' }, { func: 'wgrq01' }]},
	{ label: '出口合同规定的内容_出口额（美元）', name: 'mylaj', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}]},
	{ label: '出口合同规定的内容_预计收款次数', name: 'yjskcs', type: 'InputNumber', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { type: 'base_number', range: '+-' }, { type: 'base_number', length: 10, decimal: 0}]},
	{ label: '出口合同规定的每期付款金额占合同出口总额的比例_第一次', name: 'dycskbl', type: 'InputNumber', format: '0,0.0000', rules: [{ type: 'base_required' }, { type: 'base_number', range: '+-' }, { type: 'base_number', length: 3, decimal: 0}], eventOnBlur: 'dycskbl' },
	{ label: '出口合同规定的每期付款金额占合同出口总额的比例_第二次', name: 'decskbl', type: 'InputNumber', format: '0,0.0000', rules: [{ type: 'base_number', length: 3, decimal: 0}, { type: 'base_required' }], eventOnBlur: 'decskbl' },
	{ label: '剩余比例', name: 'qyskbl', type: 'InputNumber', format: '0,0.0000', rules: [{ type: 'base_number', length: 3, decimal: 0}, { func: 'setZero' }]},
	{ label: '业务类型', name: 'cktmsywlxdmjh', type: 'Select', showType: '4', 'showSearch': true, 'mode': 'multiple', eventOnChange: 'cktmsywlxdmjh', 'allowClear': true, readOnly: true, 'disabled': true, codeTable: ['code_dm_ckts_cktmsywlx', '01'], rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 30]}]},
	{ label: '业务类型名称', name: 'cktmsywlxmcjh', type: 'Input', readOnly: true},
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
  ckts_sum: false, // 是否显示小计按钮，默认关闭
  ckts_order: 2, // 是否显示序号重排(默认规则：选择排序)按钮，默认关闭
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                       	// 是否显示编辑链接，默认关闭
  delete: false,                     	// 是否显示删除链接，默认关闭
};

export default unitConfig;

