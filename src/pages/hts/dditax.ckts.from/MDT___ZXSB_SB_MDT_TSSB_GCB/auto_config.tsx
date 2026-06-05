import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 生产企业出口货物劳务免抵退税申报明细
 * serviceKey: MDT_ZXSB_SB_MDT_TSSB_G
 * unitId: mdt_zxsb_sb_mdt_tssb_gcb
*/

const unitConfig: any = {};

unitConfig.module_key = 'MDT_ZXSB_SB_MDT_TSSB_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'mdt_zxsb_sb_mdt_tssb_gcb'; // 页面id
unitConfig.grid_title = '生产企业出口货物及修理修配服务免抵退税申报明细'; // 列表标题，可选
unitConfig.form_title = '生产企业出口货物及修理修配服务免抵退税申报明细'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量
unitConfig.export_key1 = 'SAAS_TSSB_MXCJ_CKHWLW_DC'; // 采集导出key
unitConfig.export_key2 = 'SAAS_SJGL_SWFKCX_MDT_SCQYCKHWLWMDTSSBMXB_DC'; // 统计导出key
unitConfig.export_key3 = 'SAAS_TSSB_MDT_SBMXCK_SCQYCKHWLWMDTSSBMXB_DC'; // 申报结果查询导出key
unitConfig.gridParams = {
  initSearchModal: [
    { property: 'cdDm', value: "25030101", op: 'zdy' },
  ]
}

// 配置列表列
unitConfig.grid_columns = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '出口报关单号', dataIndex: 'ckbgdh', align: 'left', width: 180},
	{ title: '代理出口证明号', dataIndex: 'dlckhwzmhm', align: 'left', width: 280},
	{ title: '出口发票号', dataIndex: 'ckfph', align: 'left', width: 150, ellipsis: true},
	{ title: '出口日期', dataIndex: 'ckrq1', align: 'left', width: 120, render: { type: 'date', format: 'YYYY-MM-DD' } },
	{ title: '进料加工手（账）册号', dataIndex: 'jljgszch', align: 'left', width: 200},
	{ title: '先退税后核销出口合同号', dataIndex: 'ckhth', align: 'left', width: 200, ellipsis: true},
	{ title: '出口商品代码', dataIndex: 'ckspDm', align: 'left', width: 120},
	{ title: '出口商品名称', dataIndex: 'sbhgspmc', align: 'left', width: 180, ellipsis: true},
	{ title: '申报商品代码', dataIndex: 'sbspDm', align: 'left', width: 120},
	{ title: '申报商品名称', dataIndex: 'sbspmc', align: 'left', width: 180, ellipsis: true},
	{ title: '计量单位', dataIndex: 'hgjldwmc', align: 'left', width: 90},
	{ title: '出口数量', dataIndex: 'cksl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '原币币别', dataIndex: 'ybbb', align: 'left', width: 120},
	{ title: '原币币别名称', dataIndex: 'ybbbmc', align: 'left', width: 180, ellipsis: true},
	{ title: '原币离岸价', dataIndex: 'yblaj', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '原币汇率', dataIndex: 'ybhl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '人民币出口销售额', dataIndex: 'rmblaj', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '美元汇率', dataIndex: 'myhl', align: 'right', width: 145, sum: true, render: { type: 'number', format: '0,0.00000' } },
	{ title: '美元出口销售额', dataIndex: 'mylaj', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '征税率', dataIndex: 'zssl', align: 'right', width: 100, render: { type: 'number', format: '0,0.0000' } },
	{ title: '退税率', dataIndex: 'tsl', align: 'right', width: 100, render: { type: 'number', format: '0,0.0000' } },
	{ title: '计划分配率', dataIndex: 'tzhjhfpl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '进料加工保税进口料件组成计税价格', dataIndex: 'jljgbsjkljzcjsjg', align: 'right', width: 240, render: { type: 'number', format: '0,0.00' } },
	{ title: '国内购进免税原材料价格', dataIndex: 'gngjmsycljg', align: 'right', width: 240, render: { type: 'number', format: '0,0.00' } },
	{ title: '不得免征和抵扣税额', dataIndex: 'mdtsbdmzhdkse', align: 'right', width: 180, render: { type: 'number', format: '0,0.00' } },
	{ title: '免抵退税额', dataIndex: 'mdtse', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '业务类型代码', dataIndex: 'cktmsywlxdmjh', align: 'left', width: 130, ellipsis: true},
	{ title: '业务类型名称', dataIndex: 'cktmsywlxmcjh', align: 'left', width: 180, ellipsis: true},
  { title: '红字冲减原因代码', dataIndex: 'hzcjyyDm', align: 'left', width: 180 },
  { title: '红字冲减原因名称', dataIndex: 'hzcjyymc', align: 'left', width: 180 },
	{ title: '国内启运方式', dataIndex: 'gnqyfsDm', align: 'left', width: 200},
	{ title: '国内启运方式名称', dataIndex: 'gnqyfsmc', align: 'left', width: 180, ellipsis: true},
	{ title: '海关总署认证企业类型', dataIndex: 'hgzsrzqylxDm', align: 'left', width: 220},
	{ title: '海关总署认证企业类型名称', dataIndex: 'hgzsrzqylxmc', align: 'left', width: 240, ellipsis: true},
	{ title: '免抵退税年月', dataIndex: 'mdtsny', align: 'left', width: 120},
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '出口报关单号', dataIndex: 'ckbgdh', align: 'left', width: 180},
	{ title: '代理出口证明号', dataIndex: 'dlckhwzmhm', align: 'left', width: 280},
	{ title: '出口发票号', dataIndex: 'ckfph', align: 'left', width: 150, ellipsis: true},
	{ title: '出口日期', dataIndex: 'ckrq1', align: 'left', width: 120, render: { type: 'date', format: 'YYYY-MM-DD' } },
	{ title: '进料加工手（账）册号', dataIndex: 'jljgszch', align: 'left', width: 200},
	{ title: '先退税后核销出口合同号', dataIndex: 'ckhth', align: 'left', width: 200, ellipsis: true},
	{ title: '出口商品代码', dataIndex: 'ckspDm', align: 'left', width: 120},
	{ title: '出口商品名称', dataIndex: 'sbhgspmc', align: 'left', width: 180, ellipsis: true},
	{ title: '申报商品代码', dataIndex: 'sbspDm', align: 'left', width: 120},
	{ title: '申报商品名称', dataIndex: 'sbspmc', align: 'left', width: 180, ellipsis: true},
	{ title: '计量单位', dataIndex: 'hgjldwmc', align: 'left', width: 90},
	{ title: '出口数量', dataIndex: 'cksl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '原币币别', dataIndex: 'ybbb', align: 'left', width: 120},
	{ title: '原币币别名称', dataIndex: 'ybbbmc', align: 'left', width: 180, ellipsis: true},
	{ title: '原币离岸价', dataIndex: 'yblaj', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '原币汇率', dataIndex: 'ybhl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '人民币出口销售额', dataIndex: 'rmblaj', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '美元汇率', dataIndex: 'myhl', align: 'right', width: 145, sum: true, render: { type: 'number', format: '0,0.00000' } },
	{ title: '美元出口销售额', dataIndex: 'mylaj', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '征税率', dataIndex: 'zssl', align: 'right', width: 100, render: { type: 'number', format: '0,0.0000' } },
	{ title: '退税率', dataIndex: 'tsl', align: 'right', width: 100, render: { type: 'number', format: '0,0.0000' } },
	{ title: '计划分配率', dataIndex: 'tzhjhfpl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '进料加工保税进口料件组成计税价格', dataIndex: 'jljgbsjkljzcjsjg', align: 'right', width: 240, render: { type: 'number', format: '0,0.00' } },
	{ title: '国内购进免税原材料价格', dataIndex: 'gngjmsycljg', align: 'right', width: 240, render: { type: 'number', format: '0,0.00' } },
	{ title: '不得免征和抵扣税额', dataIndex: 'mdtsbdmzhdkse', align: 'right', width: 180, render: { type: 'number', format: '0,0.00' } },
	{ title: '免抵退税额', dataIndex: 'mdtse', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '业务类型代码', dataIndex: 'cktmsywlxdmjh', align: 'left', width: 130},
	{ title: '业务类型名称', dataIndex: 'cktmsywlxmcjh', align: 'left', width: 180, ellipsis: true},
  { title: '红字冲减原因代码', dataIndex: 'hzcjyyDm', align: 'left', width: 180 },
  { title: '红字冲减原因名称', dataIndex: 'hzcjyymc', align: 'left', width: 180 },
	{ title: '国内启运方式', dataIndex: 'gnqyfsDm', align: 'left', width: 200},
	{ title: '国内启运方式名称', dataIndex: 'gnqyfsmc', align: 'left', width: 180, ellipsis: true},
	{ title: '海关总署认证企业类型', dataIndex: 'hgzsrzqylxDm', align: 'left', width: 220},
	{ title: '海关总署认证企业类型名称', dataIndex: 'hgzsrzqylxmc', align: 'left', width: 240, ellipsis: true},
	{ title: '免抵退税年月', dataIndex: 'mdtsny', align: 'left', width: 120},
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
	{ title: '是否不予退税', dataIndex: 'bytsbz', align: 'left', width: 120, render: { func: 'bytsbz' } },
	{ title: '是否不予办理', dataIndex: 'byblbz', align: 'left', width: 120, render: { func: 'byblbz' } },
	{ title: '不予退税年月', dataIndex: 'bytsny', align: 'left', width: 120},
	{ title: '是否暂不办理', dataIndex: 'zbblbz', align: 'left', width: 120, render: { func: 'zbblbz' } },
	{ title: '计算分配率', dataIndex: 'jsfpl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
];

// 筛选项
unitConfig.filter_items = [
  { name: 'ssq', label: '所属期', type: 'Input' },
  { name: 'ckbgdh', label: '出口报关单号', type: 'Input' },
  { name: 'ckrq1', label: '出口日期', type: 'DatePicker', 'allowClear': true, range: true},
  { name: 'ckfph', label: '出口发票号', type: 'Input' },
  { name: 'ckspDm', label: '出口商品代码', type: 'Input' },
  { name: 'jljgszch', label: '进料加工手（账）册号', type: 'Input' },
  { name: 'dlckhwzmhm', label: '代理出口证明号', type: 'Input' },
  { name: 'cktmsywlxdmjh', label: '业务类型代码', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['code_dm_ckts_cktmsywlx',  '04'] },
  { name: 'tzsxbz', label: '台账数据', type: 'Select', codeTable: ['CODE_STATIC_SJGL_TZSJ', '01'] },
];

// 表单项
unitConfig.form_items = [
	{ label: 'ID', name: 'uuid', type: 'Hidden' , codeTable: ['code_dm_ckts_cktmsywlx', '09']},
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle' },
	{ label: '所属期', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'YYYYMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}, { func: 'ssq02' }]},
	{ label: '序号', name: 'sbxh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbxh02' }], eventOnBlur: 'sbxh' },
	{ label: '出口信息', name: 'ckxx', type: 'GroupTitle' },
	{ label: '出口货物报关单号', name: 'ckbgdh', type: 'Input', rules: [{ type: 'base_string', length: '21' }, { type: 'base_type_number_english' }], eventOnChange: 'ckbgdh' },
	{ label: '代理出口货物证明号', name: 'dlckhwzmhm', type: 'Input', rules: [{ type: 'base_string', range: [0, 20]}, { type: 'base_type_number_english' }], eventOnChange: 'dlckhwzmhm' },
	{ label: '出口发票号', name: 'ckfph', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 30]}]},
	{ label: '出口日期', name: 'ckrq1', type: 'DatePicker', 'allowClear': true, format: 'YYYY-MM-DD', rules: [{ type: 'base_required' }, { type: 'base_date', format: 'YYYYMMdd' }], eventOnChange: 'ckrq1' },
	{ label: '进料加工手（账）册号', name: 'jljgszch', type: 'Input', rules: [{ type: 'base_string', range: [0, 20]}], eventOnBlur: 'jljgszch', eventOnFocus: 'jljgszch' },
	{ label: '先退税后核销出口合同号', name: 'ckhth', type: 'Input', rules: [{ type: 'base_string', range: [0, 32]}, { func: 'ckhth01' }]},
	{ label: '出口商品代码', name: 'ckspDm', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { type: 'base_string', range: [0, 12]}], eventOnFocus: 'ckspDm', eventOnBlur: 'ckspDm' },
	{ label: '出口商品名称', name: 'sbhgspmc', type: 'Input', readOnly: true, rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 254]}]},
	{ label: '计量单位', name: 'hgjldwmc', type: 'Input', readOnly: true, rules: [{ type: 'base_string', range: [0, 50]}]},
	{ label: '申报商品代码', name: 'sbspDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['code_dm_cs_ckts_cksp', '03'], eventOnChange: 'sbspDm2' },
	{ label: '申报商品名称', name: 'sbspmc', type: 'Input', readOnly: true},
	{ label: '出口数量', name: 'cksl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 15, decimal: 5}, { func: 'ywlxHzcjSzjy01' }]},
	{ label: '原币币别代码', name: 'cjhbzmDm', type: 'AutoComplete', showType: '3', 'allowClear': true, codeTable: ['url_gy_hbhl', '01'], rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 3]}], eventOnBlur: 'hbhlDm', eventOnFocus: 'hbhlDm' },
	{ label: '原币币别名称', name: 'biname', type: 'Input', readOnly: true},
	{ label: '原币离岸价', name: 'cjzj', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+-' }], eventOnBlur: 'cjzj' },
	{ label: '原币汇率', name: 'cjhbhl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 10, decimal: 5}, { type: 'base_number', range: '+' }], eventOnBlur: 'cjhbhl' },
	{ label: '人民币出口销售额', name: 'rmblaj', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+-' }], eventOnBlur: 'rmblaj' },
	{ label: '美元汇率', name: 'myhl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 10, decimal: 5}, { type: 'base_number', range: '+' }], eventOnBlur: 'myhl' },
	{ label: '美元出口销售额', name: 'mylaj', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { func: 'ywlxHzcjSzjy01' }]},
	{ label: '退税信息', name: 'tsxx', type: 'GroupTitle' },
	{ label: '征税率', name: 'zssl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 5, decimal: 2}, { type: 'base_number', range: '+-' }, { type: 'base_number', range: '+0' }, { func: 'ggslqzfw01' }], eventOnBlur: 'zssl' },
	{ label: '退税率', name: 'tsl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 5, decimal: 2}, { type: 'base_number', range: '+0' }, { func: 'tsl01' }, { func: 'ggslqzfw01' }], eventOnBlur: 'tsl' },
	{ label: '计划分配率', name: 'tzhjhfpl', type: 'InputNumber', readOnly: true, format: '0,0.00000', rules: [{ type: 'base_number', length: 9, decimal: 5}], eventOnBlur: 'tzhjhfpl' },
	{ label: '进料加工保税进口料件组成计税价格', name: 'jljgbsjkljzcjsjg', type: 'InputNumber', readOnly: true, format: '0,0.00', rules: [{ type: 'base_number', length: 14, decimal: 2}], eventOnBlur: 'jljgbsjkljzcjsjg' },
	{ label: '国内购进免税原材料价格', name: 'gngjmsycljg', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_number', length: 14, decimal: 2}], eventOnBlur: 'gngjmsycljg' },
	{ label: '不得免征和抵扣税额', name: 'mdtsbdmzhdkse', type: 'InputNumber', readOnly: true, format: '0,0.00', rules: [{ type: 'base_number', length: 14, decimal: 2}]},
	{ label: '免抵退税额', name: 'mdtse', type: 'InputNumber', readOnly: true, format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', range: '+-' }, { type: 'base_number', length: 14, decimal: 2}]},
	{ label: '其他信息', name: 'qtxx', type: 'GroupTitle' },
	{ label: '业务类型代码', name: 'cktmsywlxdmjh', type: 'Select', showType: '4', 'showSearch': true, 'mode': 'multiple', eventOnChange: 'cktmsywlxDm02', 'allowClear': true, codeTable: ['code_dm_ckts_cktmsywlx', '04'], rules: [{ type: 'base_string', range: [0, 30]}]},
	{ label: '业务类型名称', name: 'cktmsywlxmcjh', type: 'Input', readOnly: true, rules: [{ type: 'base_string', range: [0, 300]}]},
  { label: '红字冲减原因', name: 'hzcjyyDm', type: 'Select', disabled: true, showType: '3', 'allowClear': true, codeTable: ['code_dm_ckts_hzcjyy', '01'], rules: [{ type: 'base_string'}, { func: 'hzcjyyDm' }]},
	{ label: '国内启运方式', name: 'gnqyfsDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['code_dm_ckts_gnqyfs', '01'], rules: [{ func: 'gnqyfsDm01' }], eventOnChange: 'gnqyfsDm' },
	{ label: '海关总署认证企业类型', name: 'hgzsrzqylxDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: ['code_dm_ckts_hgzsrzqylx', '01'], rules: [{ func: 'hgzsrzqylxDm01' }], eventOnChange: 'hgzsrzqylxDm' },
	{ label: '免抵退税年月', name: 'mdtsny', type: 'Input', readOnly: true, rules: [{ type: 'base_string', range: [0, 6]}]},
	{ label: 'ST', name: 'st', type: 'Blank' },
	{ label: '备注', name: 'bz', type: 'TextArea', rules: [{ type: 'base_string', range: [0, 200]}, { func: 'bz01' }], autoSize: { minRows: 3, maxRows: 3 }, layout: CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW},
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  add: true, // 是否显示增加按钮，默认关闭
  edit: true, // 是否显示修改按钮，默认关闭
  delete: true, // 是否显示删除按钮，默认关闭
  setting: true, // 是否显示设置按钮，默认关闭
  reload: true, // 是否显示刷新按钮，默认关闭
  full: true, // 是否显示全屏按钮，默认关闭
  ckts_download: false, // 是否显示导出按钮，默认关闭
  upload: true,  // 是否显示导入按钮，默认关闭
  ckts_sum: true, // 是否显示小计按钮，默认关闭
  ckts_order: 4, // 是否显示序号重排(默认规则：选择排序)按钮，默认关闭
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                       	// 是否显示编辑链接，默认关闭
  delete: false,                     	// 是否显示删除链接，默认关闭
};

unitConfig.customer_toolbar = [{ name: '序号重排', key: 'xhcp_4', func: 'handleXhcp', param: 4 },{ name: '小计', key: 'xj', func: 'handleXj' }];
unitConfig.handle_columns = [];
export default unitConfig;

