/**
 * title: 代办退税情况备案表录入
 * serviceKey: ZXSB_BA_WMZHFWDBTS_GCB
 * unitId: zgba_zxsb_ba_wmzhfwdbts_gcb
*/

const unitConfig: any = {};

unitConfig.unit_key = 'ZXSB_BA_WMZHFWDBTS_GCB'; // 业务单元key，对应后端接口
unitConfig.page_id = 'zgba_zxsb_ba_wmzhfwdbts_gcb'; // 页面id
unitConfig.grid_title = '代办退税情况备案表录入'; // 列表标题，可选
unitConfig.form_title = '代办退税情况备案表录入'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量

// 配置列表列
unitConfig.grid_columns = [
	{ title: '申请日期', dataIndex: 'tbrq1', align: 'left', width: 120, fixed: 'left', render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '委托企业名称', dataIndex: 'wtdbtsscqynsrmc', align: 'left', width: 180, ellipsis: true},
	{ title: '委托纳税人识别号', dataIndex: 'wtdbtsscqynsrsbh', align: 'left', width: 200},
	{ title: '委托企业海关代码', dataIndex: 'wtdbtsscqyhgqydm', align: 'left', width: 145},
	{ title: '代办退税合同号', dataIndex: 'wmzhfwhtxyhm', align: 'left', width: 565},
	{ title: '代办退税开户行', dataIndex: 'tskhyhmc', align: 'left', width: 210},
	{ title: '代办退税银行账号', dataIndex: 'tskhyhzh', align: 'left', width: 205},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '申请日期', dataIndex: 'tbrq1', align: 'left', width: 120, fixed: 'left', render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '委托企业名称', dataIndex: 'wtdbtsscqynsrmc', align: 'left', width: 180, ellipsis: true},
	{ title: '委托纳税人识别号', dataIndex: 'wtdbtsscqynsrsbh', align: 'left', width: 200},
	{ title: '委托企业海关代码', dataIndex: 'wtdbtsscqyhgqydm', align: 'left', width: 145},
	{ title: '代办退税合同号', dataIndex: 'wmzhfwhtxyhm', align: 'left', width: 565},
	{ title: '代办退税开户行', dataIndex: 'tskhyhmc', align: 'left', width: 210},
	{ title: '代办退税银行账号', dataIndex: 'tskhyhzh', align: 'left', width: 205},
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'wmzhfwhtxyhm', label: '代办退税合同号', type: 'Input' },
	{ name: 'wtdbtsscqynsrmc', label: '委托企业名称', type: 'Input' },
	{ name: 'wtdbtsscqyhgqydm', label: '委托企业海关代码', type: 'Input' },
	{ name: 'wtdbtsscqynsrsbh', label: '委托纳税人识别号', type: 'Input' },
	{ name: 'tbrq1', label: '申请日期', type: 'DatePicker', range: true},
];

// 表单项
unitConfig.form_items = [
	{ label: 'ID', name: 'uuid', type: 'Hidden' },
	{ label: '代办退税报备日期', name: 'dbtsbbDate', type: 'Hidden' },
	{ label: 'SB_YM', name: 'ssq', type: 'Hidden' },
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle' },
	{ label: '申请日期', name: 'tbrq1', type: 'DatePicker', format: 'yyyy-MM-DD', rules: [{ type: 'base_required' }, { type: 'base_date', format: 'yyyyMMdd' }, { func: 'tbrq01' }]},
	{ label: '序号', name: 'sbxh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbxh02' }], eventOnBlur: 'sbxh' },
	{ label: '代办信息', name: 'dbxx', type: 'GroupTitle' },
	{ label: '委托代办退税的生产企业情况_纳税人识别号（统一社会信用代码）', name: 'wtdbtsscqynsrsbh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number_english' }, { type: 'base_string', range: ['15', '20']}, { func: 'wtdbtsscqynsrsbh01' }], eventOnBlur: 'wtdbtsscqynsrsbh' },
	{ label: '委托代办退税的生产企业情况_海关企业代码', name: 'wtdbtsscqyhgqydm', type: 'Input', rules: [{ type: 'base_string', range: [0, 18]}, { type: 'base_type_number_english' }, { func: 'wtdbtsscqyhgqydm02' }, { func: 'wtdbtsscqyhgqydm01' }]},
	{ label: '委托代办退税的生产企业情况_企业名称', name: 'wtdbtsscqynsrmc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 80]}, { func: 'wtdbtsscqynsrmc01' }]},
	{ label: '备案情况_外贸综合服务合同（协议）号码', name: 'wmzhfwhtxyhm', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 30]}, { func: 'wmzhfwhtxyhm01' }]},
	{ label: '备案情况_生产企业提供的代办退税开户银行', name: 'tskhyhmc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 80]}]},
	{ label: '备案情况_生产企业提供的代办退税银行账号', name: 'tskhyhzh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 50]}]},
	{ label: '法定代表人', name: 'fddbrxm', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 100]}]},
	{ label: '其他信息', name: 'qtxx', type: 'GroupTitle' },
	{ label: '代办退税备案流程状态代码', name: 'dbtsbalcztDm', type: 'Select', 'allowClear': true, codeTable: ['code_dm_ckts_dbtsbalczt', '02'], rules: [{ type: 'base_required' }]},
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

