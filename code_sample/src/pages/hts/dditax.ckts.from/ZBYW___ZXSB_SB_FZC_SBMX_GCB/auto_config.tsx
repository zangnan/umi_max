/**
 * title: 出口非自产货物
 * serviceKey: ZBYW_ZXSB_SB_FZC_SBMX_G
 * unitId: zbyw_zxsb_sb_fzc_sbmx_gcb
*/

const unitConfig: any = {};

unitConfig.unit_key = 'ZBYW_ZXSB_SB_FZC_SBMX_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'zbyw_zxsb_sb_fzc_sbmx_gcb'; // 页面id
unitConfig.grid_title = '出口非自产货物'; // 列表标题，可选
unitConfig.form_title = '出口非自产货物'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量
unitConfig.export_key1 = ''; // 采集导出key
unitConfig.export_key2 = ''; // 统计导出key
unitConfig.export_key3 = ''; // 申报结果查询导出key

// 配置列表列
unitConfig.grid_columns = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '凭证种类', dataIndex: 'cktmspzlxDm', align: 'left', width: 180, codeTable: ['code_dm_ckts_cktmspzlx',  '03'] },
	{ title: '消费税凭证号', dataIndex: 'xfspzh', align: 'left', width: 280},
	{ title: '出口日期', dataIndex: 'kprq', align: 'left', width: 120, render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '出口商品代码', dataIndex: 'ckspDm', align: 'left', width: 120},
	{ title: '商品名称', dataIndex: 'sbhgspmc', align: 'left', width: 180, ellipsis: true},
	{ title: '计量单位', dataIndex: 'hgjldwmc', align: 'left', width: 90},
	{ title: '数量', dataIndex: 'sl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '消费税税率', dataIndex: 'zssl', align: 'right', width: 140, render: { type: 'number', format: '0,0.0000' } },
	{ title: '计税金额', dataIndex: 'jsje', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '征税税额', dataIndex: 'se', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '消费税退税额', dataIndex: 'xfstse', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '出口货物报关单号', dataIndex: 'ckbgdh', align: 'left', width: 180},
	{ title: '代理出口货物证明号', dataIndex: 'dlckhwzmhm', align: 'left', width: 305},
	{ title: '出口数量', dataIndex: 'cksl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '业务类型', dataIndex: 'cktmsywlxdmjh', align: 'left', width: 210, codeTable: ['code_dm_ckts_cktmsywlx',  '01'] },
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '消费税凭证号', dataIndex: 'xfspzh', align: 'left', width: 280},
	{ title: '出口日期', dataIndex: 'kprq', align: 'left', width: 120, render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '出口商品代码', dataIndex: 'ckspDm', align: 'left', width: 120},
	{ title: '商品名称', dataIndex: 'sbhgspmc', align: 'left', width: 180, ellipsis: true},
	{ title: '计量单位', dataIndex: 'hgjldwmc', align: 'left', width: 90},
	{ title: '数量', dataIndex: 'sl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '消费税税率', dataIndex: 'zssl', align: 'right', width: 140, render: { type: 'number', format: '0,0.0000' } },
	{ title: '计税金额', dataIndex: 'jsje', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '征税税额', dataIndex: 'se', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '消费税退税额', dataIndex: 'xfstse', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '出口货物报关单号', dataIndex: 'ckbgdh', align: 'left', width: 180},
	{ title: '代理出口货物证明号', dataIndex: 'dlckhwzmhm', align: 'left', width: 305},
	{ title: '出口数量', dataIndex: 'cksl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
	{ title: '出口退（免）税业务类型名称集合', dataIndex: 'cktmsywlxmcjh', align: 'left', width: 180, ellipsis: true},
	{ title: '国内启运方式', dataIndex: 'gnqyfsDm', align: 'left', width: 120, codeTable: ['code_dm_ckts_gnqyfs',  '01'] },
	{ title: '海关总署认证企业类型', dataIndex: 'hgzsrzqylxDm', align: 'left', width: 130, codeTable: ['code_dm_ckts_hgzsrzqylx',  '01'] },
	{ title: '是否不予办理', dataIndex: 'byblbz', align: 'left', width: 120, render: { func: 'byblbz' } },
	{ title: '是否不予退税', dataIndex: 'bytsbz', align: 'left', width: 120, render: { func: 'bytsbz' } },
	{ title: '是否暂不办理', dataIndex: 'zbblbz', align: 'left', width: 120, render: { func: 'zbblbz' } },
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'cktmsywlxdmjh', label: '业务类型', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['code_dm_ckts_cktmsywlx',  '01'] },
	{ name: 'ckspDm', label: '出口商品代码', type: 'Input' },
	{ name: 'dlckhwzmhm', label: '代理出口货物证明号', type: 'Input' },
	{ name: 'ckbgdh', label: '出口货物报关单号', type: 'Input' },
	{ name: 'xfspzh', label: '消费税凭证号', type: 'Input' },
	{ name: 'ssq', label: '所属期', type: 'Input' },
];

// 表单项
unitConfig.form_items = [
	{ label: '主键', name: 'uuid', type: 'Hidden', readOnly: true},
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle', readOnly: true},
	{ label: '申报年月', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}, { func: 'ssq02' }]},
	{ label: '序号', name: 'sbxh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbxh02' }], eventOnBlur: 'sbxh' },
	{ label: '出口信息', name: 'ckxx', type: 'GroupTitle', readOnly: true},
	{ label: '出口货物报关单号', name: 'ckbgdh', type: 'Input', rules: [{ type: 'base_string', length: '21' }, { type: 'base_type_number_english' }], eventOnChange: 'ckbgdh' },
	{ label: '代理出口货物证明号', name: 'dlckhwzmhm', type: 'Input', rules: [{ type: 'base_string', range: [0, 20]}, { type: 'base_type_number_english' }]},
	{ label: '出口数量', name: 'cksl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 15, decimal: 5}]},
	{ label: '购货信息', name: 'ghxx', type: 'GroupTitle', readOnly: true},
	{ label: '凭证种类', name: 'cktmspzlxDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['code_dm_ckts_cktmspzlx', '03'], rules: [{ type: 'base_required' }], eventOnChange: 'cktmspzlxDm03' },
	{ label: '消费税凭证号', name: 'xfspzh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 30]}]},
	{ label: '出口日期', name: 'kprq', type: 'DatePicker', 'allowClear': true, format: 'yyyy-MM-DD', rules: [{ type: 'base_required' }, { type: 'base_date', format: 'yyyyMMdd' }]},
	{ label: '出口商品代码', name: 'ckspDm', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { type: 'base_string', range: [0, 12]}], eventOnBlur: 'ckspDm' },
	{ label: '出口商品名称', name: 'sbhgspmc', type: 'Input', readOnly: true, rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 75]}]},
	{ label: '计量单位', name: 'hgjldwmc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 12]}]},
	{ label: '商品从价', name: 'cldezs', type: 'Hidden', readOnly: true},
	{ label: '商品从量', name: 'cjdlzs', type: 'Hidden', readOnly: true},
	{ label: '数量', name: 'sl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 15, decimal: 5}, { type: 'base_number', range: '+' }, { func: 'sl02' }], eventOnBlur: 'sl' },
	{ label: '消费税税率', name: 'zssl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 9, decimal: 4}, { type: 'base_number', range: '+-' }, { type: 'base_number', range: '+0' }], eventOnBlur: 'zssl' },
	{ label: '计税金额', name: 'jsje', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+' }], eventOnBlur: 'jsje' },
	{ label: '征税税额', name: 'se', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_number', range: '+-' }, { type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}], eventOnBlur: 'se' },
	{ label: '申报消费税退税额', name: 'xfstse', type: 'InputNumber', readOnly: true, format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}]},
	{ label: '其他信息', name: 'qtxx', type: 'GroupTitle', readOnly: true},
	{ label: '退（免）税业务类型', name: 'cktmsywlxdmjh', type: 'Select', showType: '4', 'showSearch': true, 'mode': 'multiple', eventOnChange: 'cktmsywlxdmjh', 'allowClear': true, codeTable: ['code_dm_ckts_cktmsywlx', '01'], rules: [{ type: 'base_string', range: [0, 30]}]},
	{ label: '退（免）税业务类型名称', name: 'cktmsywlxmcjh', type: 'Input', readOnly: true, rules: [{ type: 'base_string', range: [0, 75]}]},
	{ label: '国内启运方式', name: 'gnqyfsDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['code_dm_ckts_gnqyfs', '01'], rules: [{ func: 'gnqyfsDm01' }], eventOnChange: 'gnqyfsDm' },
	{ label: '海关总署认证企业类型', name: 'hgzsrzqylxDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['code_dm_ckts_hgzsrzqylx', '01'], rules: [{ func: 'hgzsrzqylxDm01' }], eventOnChange: 'hgzsrzqylxDm' },
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

