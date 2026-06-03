/**
 * title: 购进自用货物
 * serviceKey: ZBYW_ZXSB_SB_GJ_SBMX_G
 * unitId: zbyw_zxsb_sb_gj_sbmx_gcb
*/

const unitConfig: any = {};

unitConfig.unit_key = 'ZBYW_ZXSB_SB_GJ_SBMX_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'zbyw_zxsb_sb_gj_sbmx_gcb'; // 页面id
unitConfig.grid_title = '购进自用货物'; // 列表标题，可选
unitConfig.form_title = '购进自用货物'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量
unitConfig.export_key1 = ''; // 采集导出key
unitConfig.export_key2 = ''; // 统计导出key
unitConfig.export_key3 = ''; // 申报结果查询导出key

// 配置列表列
unitConfig.grid_columns = [
	{ title: '申报年月', dataIndex: 'ssq', align: 'left', width: 75, fixed: 'left' },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '自用货物名称', dataIndex: 'gjzyhwmc', align: 'left', width: 180, ellipsis: true},
	{ title: '进货凭证号码', dataIndex: 'jhpzh', align: 'left', width: 150, ellipsis: true},
	{ title: '数量', dataIndex: 'sl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '单价', dataIndex: 'dj', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '计税金额', dataIndex: 'jsje', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '税额', dataIndex: 'se', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '征税率', dataIndex: 'zssl', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '申报退税额', dataIndex: 'tse', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '付款凭证号', dataIndex: 'fkpzhm', align: 'left', width: 200},
	{ title: '业务类型', dataIndex: 'cktmsywlxdmjh', align: 'left', width: 210, codeTable: ['code_dm_ckts_cktmsywlx',  '03'] },
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '申报年月', dataIndex: 'ssq', align: 'left', width: 75, fixed: 'left' },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '自用货物名称', dataIndex: 'gjzyhwmc', align: 'left', width: 180, ellipsis: true},
	{ title: '数量', dataIndex: 'sl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '单价', dataIndex: 'dj', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '计税金额', dataIndex: 'jsje', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '税额', dataIndex: 'se', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '征税率', dataIndex: 'zssl', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '申报退税额', dataIndex: 'tse', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '付款凭证号', dataIndex: 'fkpzhm', align: 'left', width: 200},
	{ title: '业务类型', dataIndex: 'cktmsywlxdmjh', align: 'left', width: 210, codeTable: ['code_dm_ckts_cktmsywlx',  '03'] },
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
	{ title: '海关计量单位名称', dataIndex: 'hgjldwmc', align: 'left', width: 180, ellipsis: true},
	{ title: '增值税专用发票号码', dataIndex: 'zzszyfphm', align: 'left', width: 150, ellipsis: true},
	{ title: '开票日期', dataIndex: 'kprq', align: 'left', width: 120, render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '是否普通发票', dataIndex: 'ptfpbz', align: 'left', width: 120, render: { func: 'ptfpbz' } },
	{ title: '供货方纳税人识别号', dataIndex: 'ghfnsrsbh1', align: 'left', width: 200},
	{ title: '是否不予退税', dataIndex: 'bytsbz', align: 'left', width: 120, render: { func: 'bytsbz' } },
	{ title: '是否不予办理', dataIndex: 'byblbz', align: 'left', width: 120, render: { func: 'byblbz' } },
	{ title: '是否暂不办理', dataIndex: 'zbblbz', align: 'left', width: 120, render: { func: 'zbblbz' } },
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'cktmsywlxdmjh', label: '业务类型', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['code_dm_ckts_cktmsywlx',  '03'] },
	{ name: 'jhpzh', label: '进货凭证号码', type: 'Input' },
	{ name: 'ssq', label: '申报年月', type: 'Input' },
];

// 表单项
unitConfig.form_items = [
	{ label: '主键', name: 'uuid', type: 'Hidden', readOnly: true},
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle', readOnly: true},
	{ label: '申报年月', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}, { func: 'ssq02' }]},
	{ label: '序号', name: 'sbxh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbxh02' }], eventOnBlur: 'sbxh' },
	{ label: '购货信息', name: 'ghxx', type: 'GroupTitle', readOnly: true},
	{ label: '购进自用货物名称', name: 'gjzyhwmc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 40]}]},
	{ label: '进货凭证种类', name: 'jhpzzlDm', type: 'Select', 'allowClear': true, codeTable: ['code_dm_ckts_jhpzzl', '01'], rules: [{ type: 'base_required' }]},
	{ label: '进货凭证号码', name: 'jhpzh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 40]}], eventOnBlur: 'jhpzh' },
	{ label: '供货方纳税人识别号', name: 'ghfnsrsbh1', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number_english' }, { type: 'base_string', range: ['15', '20']}]},
	{ label: '开票日期', name: 'kprq', type: 'DatePicker', 'allowClear': true, format: 'yyyy-MM-DD', rules: [{ type: 'base_required' }, { type: 'base_date', format: 'yyyyMMdd' }]},
	{ label: '单位', name: 'hgjldwmc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 12]}]},
	{ label: '数量', name: 'sl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 15, decimal: 5}, { type: 'base_number', range: '+-' }], eventOnBlur: 'sl' },
	{ label: '单价', name: 'dj', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+-' }], eventOnBlur: 'dj' },
	{ label: '计税金额', name: 'jsje', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+-' }], eventOnBlur: 'jsje' },
	{ label: '征税率', name: 'zssl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 4, decimal: 2}, { type: 'base_number', range: '+-' }, { type: 'base_number', range: '+0' }, { func: 'ggslqzfw01' }], eventOnBlur: 'zssl' },
	{ label: '税额', name: 'se', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+-' }], eventOnChange: 'se' },
	{ label: '申报退税额', name: 'tse', type: 'InputNumber', readOnly: true, format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}]},
	{ label: '付款凭证号码', name: 'fkpzhm', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 20]}]},
	{ label: '业务类型', name: 'cktmsywlxdmjh', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['code_dm_ckts_cktmsywlx', '03'], rules: [{ type: 'base_required' }], eventOnChange: 'cktmsywlxDm03' },
	{ label: '业务类型名称', name: 'cktmsywlxmcjh', type: 'Input', readOnly: true, rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 75]}]},
	{ label: '其他信息', name: 'qtxx', type: 'GroupTitle', readOnly: true},
	{ label: '备注', name: 'bz', type: 'TextArea', autoSize: { minRows: 2, maxRows: 2}, layout: { label: { xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3}, formItem: { xs: 16, sm: 16, md: 16, lg: 19, xl: 21, xxl: 21 } }, rules: [{ type: 'base_string', range: [0, 200]}, { func: 'bz01' }]},
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

