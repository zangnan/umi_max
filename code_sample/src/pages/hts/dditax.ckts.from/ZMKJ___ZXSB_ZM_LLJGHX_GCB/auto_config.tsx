/**
 * title: 来料加工免税核销申请
 * serviceKey: ZMKJ_ZXSB_ZM_LLJGHX_G
 * unitId: zmkj_zxsb_zm_lljghx_gcb
*/

const unitConfig: any = {};

unitConfig.unit_key = 'ZMKJ_ZXSB_ZM_LLJGHX_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'zmkj_zxsb_zm_lljghx_gcb'; // 页面id
unitConfig.grid_title = '来料加工免税核销申请'; // 列表标题，可选
unitConfig.form_title = '来料加工免税核销申请'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量
unitConfig.export_key1 = ''; // 采集导出key
unitConfig.export_key2 = ''; // 统计导出key
unitConfig.export_key3 = ''; // 申报结果查询导出key

// 配置列表列
unitConfig.grid_columns = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '申报批次', dataIndex: 'sbpc', align: 'left', width: 90, fixed: 'left' },
	/*{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },*/
	{ title: '编号', dataIndex: 'sbbh1', align: 'left', width: 100},
	{ title: '序号', dataIndex: 'xh4', align: 'left', width: 60},
	{ title: '加工企业纳税人识别号（统一社会信用代码）', dataIndex: 'jgqynsrsbh', align: 'left', width: 320},
	{ title: '来料加工手册号', dataIndex: 'lljgszch', align: 'left', width: 215},
	{ title: '免税证明编号', dataIndex: 'lljgmszmbh', align: 'left', width: 215},
	{ title: '加工费发票号', dataIndex: 'jgffphm', align: 'left', width: 280},
	{ title: '加工费金额', dataIndex: 'jgfje', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '计量单位', dataIndex: 'jldwmc', align: 'left', width: 90},
	{ title: '数量', dataIndex: 'sl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '出口发票号', dataIndex: 'ckfph', align: 'left', width: 150, ellipsis: true},
	{ title: '出口货物报关单号', dataIndex: 'ckbgdh', align: 'left', width: 180},
	{ title: '出口商品代码', dataIndex: 'ckspDm', align: 'left', width: 120},
	{ title: '出口商品名称', dataIndex: 'ckspmc', align: 'left', width: 180, ellipsis: true},
	{ title: '出口计量单位', dataIndex: 'hgjldwmc', align: 'left', width: 100},
	{ title: '出口数量', dataIndex: 'cksl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '申报批次', dataIndex: 'sbpc', align: 'left', width: 90, fixed: 'left' },
	/*{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },*/
	{ title: '编号', dataIndex: 'sbbh1', align: 'left', width: 100},
	{ title: '序号', dataIndex: 'xh4', align: 'left', width: 60},
	{ title: '加工企业纳税人识别号（统一社会信用代码）', dataIndex: 'jgqynsrsbh', align: 'left', width: 320},
	{ title: '来料加工手册号', dataIndex: 'lljgszch', align: 'left', width: 215},
	{ title: '免税证明编号', dataIndex: 'lljgmszmbh', align: 'left', width: 215},
	{ title: '加工费发票号', dataIndex: 'jgffphm', align: 'left', width: 280},
	{ title: '加工费金额', dataIndex: 'jgfje', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '计量单位', dataIndex: 'jldwmc', align: 'left', width: 90},
	{ title: '数量', dataIndex: 'sl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '出口发票号', dataIndex: 'ckfph', align: 'left', width: 150, ellipsis: true},
	{ title: '出口货物报关单号', dataIndex: 'ckbgdh', align: 'left', width: 180},
	{ title: '出口商品代码', dataIndex: 'ckspDm', align: 'left', width: 120},
	{ title: '出口商品名称', dataIndex: 'ckspmc', align: 'left', width: 180, ellipsis: true},
	{ title: '出口计量单位', dataIndex: 'hgjldwmc', align: 'left', width: 100},
	{ title: '出口数量', dataIndex: 'cksl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
	{ title: '加工企业纳税人名称', dataIndex: 'jgqynsrmc', align: 'left', width: 180, ellipsis: true},
	{ title: '来料加工免税核销证明编号', dataIndex: 'lljgmshxzmbh', align: 'left', width: 260},
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'ckfph', label: '出口发票号', type: 'Input' },
	{ name: 'lljgszch', label: '来料加工手册号', type: 'Input' },
	{ name: 'lljgmszmbh', label: '免税证明编号', type: 'Input' },
	{ name: 'jgqynsrsbh', label: '加工企业纳税人识别号（统一社会信用代码）', type: 'Input' },
	{ name: 'sbbh1', label: '编号', type: 'Input' },
	{ name: 'sbpc', label: '申报批次', type: 'Input' },
	{ name: 'ssq', label: '所属期', type: 'Input' },
];

// 表单项
unitConfig.form_items = [
	{ label: 'ID', name: 'uuid', type: 'Hidden' },
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle' },
	{ label: '所属期', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}, { func: 'ssq01' }], eventOnChange: 'ssq' },
	{ label: '申报批次', name: 'sbpc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbpc02' }], eventOnBlur: 'sbpc' },
	/*{ label: '序号', name: 'sbxh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbxh02' }], eventOnBlur: 'sbxh' },*/
	{ label: '编号', name: 'sbbh1', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { type: 'base_string', length: '10' }, { func: 'sbbh101' }, { func: 'sbbh102' }]},
	{ label: '序号', name: 'xh4', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { type: 'base_string', range: [0, 2]}, { func: 'xh401' }], eventOnBlur: 'xh4' },
	{ label: '证明信息', name: 'zmxx', type: 'GroupTitle' },
  { label: '加工企业纳税人识别号（统一社会信用代码）', name: 'jgqynsrsbh', type: 'AutoComplete', showType: '2', codeTable: ['url_gy_qywtf', '01'], rules: [{ type: 'base_required' }, { type: 'base_type_number_english' }, { type: 'base_string', range: ['15', '20']}, { func: 'jgqynsrsbh01' }], eventOnBlur: 'jgqynsrsbh' },
	{ label: '加工企业纳税人名称', name: 'jgqynsrmc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 80]}, { func: 'jgqynsrmc01' }]},
	{ label: '来料加工免税证明编号（已开具证明）', name: 'lljgmszmbh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 20]}, { func: 'lljgmszmbh' }], eventOnChange: 'lljgmszmbh'},
	{ label: '来料加工手（账）册号', name: 'lljgszch', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 20]}]},
	{ label: '加工费发票号（已开具证明）', name: 'jgffphm', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 20]}]},
	{ label: '计量单位（已开具证明）', name: 'jldwmc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 12]}]},
	{ label: '数量（已开具证明）', name: 'sl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 15, decimal: 5}, { func: 'setZero' }]},
	{ label: '加工费金额（已开具证明）', name: 'jgfje', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { func: 'setZero' }]},
	{ label: '出口信息', name: 'ckxx', type: 'GroupTitle' },
	{ label: '出口货物报关单号', name: 'ckbgdh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', length: '21' }, { type: 'base_type_number_english' }], eventOnChange: 'ckbgdh' },
	{ label: '出口发票号', name: 'ckfph', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 30]}]},
	{ label: '出口商品代码', name: 'ckspDm', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { type: 'base_string', range: [0, 12]}], eventOnBlur: 'ckspDm' },
	{ label: '出口商品名称', name: 'ckspmc', type: 'Input', readOnly: true, rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 75]}]},
	{ label: '计量单位', name: 'hgjldwmc', type: 'Input', readOnly: true, rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 12]}]},
	{ label: '出口数量', name: 'cksl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 15, decimal: 5}, { type: 'base_number', range: '+' }]},
	{ label: '其他信息', name: 'qtxx', type: 'GroupTitle' },
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
  ckts_sum: false, // 是否显示小计按钮，默认关闭
  ckts_order: 5, // 是否显示序号重排(默认规则：选择排序)按钮，默认关闭
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                       	// 是否显示编辑链接，默认关闭
  delete: false,                     	// 是否显示删除链接，默认关闭
};

export default unitConfig;

