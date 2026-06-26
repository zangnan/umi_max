import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 分类管理复评申请
 * serviceKey: QTYW_ZXSB_QT_QYGLLBFPPD_G
 * unitId: qtyw_zxsb_qt_qygllbfppd_gcb
*/

const unitConfig: any = {};

unitConfig.module_key = 'QTYW_ZXSB_QT_QYGLLBFPPD_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'qtyw_zxsb_qt_qygllbfppd_gcb'; // 页面id
unitConfig.grid_title = '分类管理复评申请'; // 列表标题，可选
unitConfig.form_title = '分类管理复评申请'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量
unitConfig.export_key1 = ''; // 采集导出key
unitConfig.export_key2 = ''; // 统计导出key
unitConfig.export_key3 = ''; // 申报结果查询导出key

// 配置列表列
unitConfig.grid_columns = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '申请复评类别', dataIndex: 'sqfpgllbDm', align: 'left', width: 150, codeTable: 'code_dm_ckts_ckqygllb:01' },
	{ title: '申请复评原因', dataIndex: 'sqfpyy', align: 'left', width: 180, ellipsis: true},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '申请复评类别', dataIndex: 'sqfpgllbDm', align: 'left', width: 150, codeTable: 'code_dm_ckts_ckqygllb:01' },
	{ title: '申请复评原因', dataIndex: 'sqfpyy', align: 'left', width: 180, ellipsis: true},
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'sqfpgllbDm', label: '申请复评类别', type: 'Select', 'allowClear': true, codeTable: 'code_dm_ckts_ckqygllb:01' },
	{ name: 'ssq', label: '所属期', type: 'Input' },
];

// 表单项
unitConfig.form_items = [
	{ label: 'ID', name: 'uuid', type: 'Hidden' },
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle' },
	{ label: '所属期', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}, { func: 'ssq03' }, { func: 'ssq02' }]},
	{ label: '说明信息', name: 'smxx', type: 'GroupTitle' },
	{ label: '申请复评类别', name: 'sqfpgllbDm', type: 'Select', 'allowClear': true, codeTable: 'code_dm_ckts_ckqygllb:01', rules: [{ type: 'base_required' }]},
	{ label: '申请原因代码', name: 'sqfpyyDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: 'code_dm_ckts_sqfpyydm:01', rules: [{ type: 'base_required' }], eventOnChange: 'sqfpyyDm' },
	{ label: '申请原因名称', name: 'sqfpyyMc', type: 'Input', disabled: true},
	{ label: 'ST', name: 'st', type: 'Blank' },
	{ label: '申请复评原因', name: 'sqfpyy', type: 'TextArea', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 2000]}], autoSize: { minRows: 3, maxRows: 3 }, layout: CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW},
	{ label: '其他信息', name: 'qtxx', type: 'Hidden' },
	{ label: '填表日期', name: 'sbztDm', type: 'Hidden' },
	{ label: '社会信用代码/纳税人识别号', name: 'shbz', type: 'Hidden' },
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
  ckts_order: false, // 是否显示序号重排(默认规则：选择排序)按钮，默认关闭
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                       	// 是否显示编辑链接，默认关闭
  delete: false,                     	// 是否显示删除链接，默认关闭
};

unitConfig.customer_toolbar = [];
unitConfig.handle_columns = [];
export default unitConfig;

