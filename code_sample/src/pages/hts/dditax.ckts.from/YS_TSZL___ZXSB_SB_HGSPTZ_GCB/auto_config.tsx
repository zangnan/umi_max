/**
 * title: 商品码调整
 * serviceKey: TSZL_ZXSB_SB_HGSPTZ_G
 * unitId: ys_tszl_zxsb_sb_hgsptz_gcb
*/

const unitConfig: any = {};

unitConfig.unit_key = 'TSZL_ZXSB_SB_HGSPTZ_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'ys_tszl_zxsb_sb_hgsptz_gcb'; // 页面id
unitConfig.grid_title = '商品码调整'; // 列表标题，可选
unitConfig.form_title = '商品码调整'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = 'lcswsxDm=LCSXA081042001'; // 配置常量
unitConfig.export_key1 = ''; // 采集导出key
unitConfig.export_key2 = ''; // 统计导出key
unitConfig.export_key3 = ''; // 申报结果查询导出key

// 配置列表列
unitConfig.grid_columns = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '出口报关单号', dataIndex: 'ckbgdh', align: 'left', width: 180},
	{ title: '申报日期', dataIndex: 'hgckhwbgdsbrq', align: 'left', width: 120, render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '出口日期', dataIndex: 'ckrq1', align: 'left', width: 120, render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '调整前（报关单上的）商品代码', dataIndex: 'ckspDm', align: 'left', width: 120},
	{ title: '调整前（报关单上的）商品名称', dataIndex: 'sbhgspmc', align: 'left', width: 240, ellipsis: true},
	{ title: '调整前（报关单上的）退税率', dataIndex: 'tsl', align: 'right', width: 240, render: { type: 'number', format: '0,0.0000' } },
	{ title: '调整后商品代码', dataIndex: 'tzhckspDm', align: 'left', width: 160},
	{ title: '调整后商品名称', dataIndex: 'tzhhgspmc', align: 'left', width: 180, ellipsis: true},
	{ title: '调整后退税率', dataIndex: 'tzhtsl', align: 'right', width: 140, render: { type: 'number', format: '0,0.0000' } },
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '出口报关单号', dataIndex: 'ckbgdh', align: 'left', width: 180},
	{ title: '申报日期', dataIndex: 'hgckhwbgdsbrq', align: 'left', width: 120, render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '出口日期', dataIndex: 'ckrq1', align: 'left', width: 120, render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '调整前（报关单上的）商品代码', dataIndex: 'ckspDm', align: 'left', width: 120},
	{ title: '调整前（报关单上的）商品名称', dataIndex: 'sbhgspmc', align: 'left', width: 240, ellipsis: true},
	{ title: '调整前（报关单上的）退税率', dataIndex: 'tsl', align: 'right', width: 240, render: { type: 'number', format: '0,0.0000' } },
	{ title: '调整后商品代码', dataIndex: 'tzhckspDm', align: 'left', width: 160},
	{ title: '调整后商品名称', dataIndex: 'tzhhgspmc', align: 'left', width: 180, ellipsis: true},
	{ title: '调整后退税率', dataIndex: 'tzhtsl', align: 'right', width: 140, render: { type: 'number', format: '0,0.0000' } },
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'tzhckspDm', label: '调整后商品代码', type: 'Input' },
	{ name: 'ckspDm', label: '调整前（报关单上的）商品代码', type: 'Input' },
	{ name: 'ssq', label: '所属期', type: 'Input' },
	{ name: 'ckrq1', label: '出口日期', type: 'DatePicker', 'allowClear': true, range: true},
	{ name: 'ckbgdh', label: '出口报关单号', type: 'Input' },
];

// 表单项
unitConfig.form_items = [
	{ label: '主键', name: 'uuid', type: 'Hidden', readOnly: true},
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle' },
	{ label: '所属期', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}, { func: 'ssq02' }, { func: 'ssq01' }]},
	{ label: '序号', name: 'sbxh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbxh02' }], eventOnBlur: 'sbxh' },
	{ label: '退税信息', name: 'tsxx', type: 'GroupTitle' },
	{ label: '出口报关单号', name: 'ckbgdh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 21]}, { type: 'base_type_number_english' }], eventOnChange: 'ckbgdh' },
	{ label: '代理证明号', name: 'dlckhwzmhm', type: 'Hidden' },
	{ label: '报关单上的申报日期', name: 'hgckhwbgdsbrq', type: 'DatePicker', 'allowClear': true, format: 'yyyy-MM-DD', rules: [{ type: 'base_required' }, { type: 'base_date', format: 'yyyyMMdd' }]},
	{ label: '出口日期', name: 'ckrq1', type: 'DatePicker', 'allowClear': true, format: 'yyyy-MM-DD', rules: [{ type: 'base_required' }, { type: 'base_date', format: 'yyyyMMdd' }]},
	{ label: '调整前（报关单上的）商品代码', name: 'ckspDm', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 12]}], eventOnBlur: 'ckspDm' },
	{ label: '调整前（报关单上的）商品名称', name: 'sbhgspmc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 75]}]},
	{ label: '调整前（报关单上的）退税率', name: 'tsl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_number', length: 5, decimal: 2}, { func: 'setZero' }]},
	{ label: '调整后商品代码', name: 'tzhckspDm', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 12]}, { func: 'tzhckspDm01' }], eventOnBlur: 'tzhckspDm' },
	{ label: '调整后商品名称', name: 'tzhhgspmc', type: 'Input', readOnly: true, rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 500]}]},
	{ label: '调整后退税率', name: 'tzhtsl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 5, decimal: 2}, { type: 'base_number', range: '+-' }, { type: 'base_number', range: '+0' }, { func: 'ggslqzfw01' }]},
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
  ckts_order: 4, // 是否显示序号重排(默认规则：选择排序)按钮，默认关闭
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                       	// 是否显示编辑链接，默认关闭
  delete: false,                     	// 是否显示删除链接，默认关闭
};

export default unitConfig;

