/**
 * title: 进货凭证信息回退申请
 * serviceKey: QTYW_ZXSB_QT_KSPZWGQWBTSHT_G
 * unitId: qtyw_zxsb_qt_kspzwgqwbtsht_gcb
*/

const unitConfig: any = {};

unitConfig.unit_key = 'QTYW_ZXSB_QT_KSPZWGQWBTSHT_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'qtyw_zxsb_qt_kspzwgqwbtsht_gcb'; // 页面id
unitConfig.grid_title = '进货凭证信息回退申请'; // 列表标题，可选
unitConfig.form_title = '进货凭证信息回退申请'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量
unitConfig.export_key1 = ''; // 采集导出key
unitConfig.export_key2 = ''; // 统计导出key
unitConfig.export_key3 = ''; // 申报结果查询导出key

// 配置列表列
unitConfig.grid_columns = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '申报批次', dataIndex: 'sbpc', align: 'left', width: 90, fixed: 'left' },
	{ title: '序号', dataIndex: 'xh', align: 'left', width: 80, fixed: 'left' },
	{ title: '发票代码', dataIndex: 'fpDm', align: 'left', width: 130},
	{ title: '发票号码', dataIndex: 'fphm', align: 'left', width: 150, ellipsis: true},
	{ title: '购方纳税号', dataIndex: 'gfnsrsbh', align: 'left', width: 200},
	{ title: '销方纳税号', dataIndex: 'xfnsrsbh', align: 'left', width: 200},
	{ title: '缴款书号码', dataIndex: 'zyjkshm', align: 'left', width: 180, ellipsis: true},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '申报批次', dataIndex: 'sbpc', align: 'left', width: 90, fixed: 'left' },
	{ title: '序号', dataIndex: 'xh', align: 'left', width: 80, fixed: 'left' },
	{ title: '发票代码', dataIndex: 'fpDm', align: 'left', width: 130},
	{ title: '发票号码', dataIndex: 'fphm', align: 'left', width: 150, ellipsis: true},
	{ title: '购方纳税号', dataIndex: 'ghfshxydm', align: 'left', width: 200},
	{ title: '销方纳税号', dataIndex: 'xhfshxydm', align: 'left', width: 200},
	{ title: '缴款书号码', dataIndex: 'hgzyjkshm', align: 'left', width: 180, ellipsis: true},
	{ title: '审核结果', dataIndex: 'shbz', align: 'left', width: 180, codeTable: ['code_static_shbz_dm',  '01'] },
	{ title: '审核意见', dataIndex: 'yysm', align: 'left', width: 180},
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'fphm', label: '发票号码', type: 'Input' },
	{ name: 'ssq', label: '所属期', type: 'Input' },
];

// 表单项
unitConfig.form_items = [
	{ label: 'ID', name: 'uuid', type: 'Hidden' },
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle' },
	{ label: '申报年月', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}, { func: 'ssq01' }]},
	{ label: '申报批次', name: 'sbpc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }], eventOnBlur: 'sbpc' },
	{ label: '申报序号', name: 'xh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }], eventOnBlur: 'xh' },
	{ label: '单证信息', name: 'dzxx', type: 'GroupTitle' },
	{ label: '发票代码', name: 'fpDm', type: 'Input', rules: [{ type: 'base_string', range: [0, 12]}, { type: 'base_type_number' }], eventOnBlur: 'jhpzh' },	//eventOnChange: 'jhpzh' 
	{ label: '发票号码', name: 'fphm', type: 'Input', rules: [{ type: 'base_string', range: [0, 20]}, { type: 'base_type_number' }], eventOnBlur: 'jhpzh' },	//eventOnChange: 'jhpzh' 
	{ label: '缴款书号码', name: 'zyjkshm', type: 'Input', rules: [{ type: 'base_string', range: [0, 22]}]},
	{ label: '购货方社会信用代码', name: 'gfnsrsbh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number_english' }, { type: 'base_string', range: ['15', '20']}]},
	{ label: '销货方社会信用代码', name: 'xfnsrsbh', type: 'Input', rules: [{ type: 'base_type_number_english' }, { type: 'base_string', range: ['15', '20']}]},
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
  ckts_order: 3, // 是否显示序号重排(默认规则：选择排序)按钮，默认关闭
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                       	// 是否显示编辑链接，默认关闭
  delete: false,                     	// 是否显示删除链接，默认关闭
};

export default unitConfig;

