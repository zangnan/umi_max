import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 铁路国际货物运输明细表
 * serviceKey: MDT_ZXSB_SB_MDT_TLHY_G
 * unitId: mdt_zxsb_sb_mdt_tlhy_gcb
*/

const unitConfig: any = {};

unitConfig.module_key = 'MDT_ZXSB_SB_MDT_TLHY_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'mdt_zxsb_sb_mdt_tlhy_gcb'; // 页面id
unitConfig.grid_title = '铁路国际货物运输明细'; // 列表标题，可选
unitConfig.form_title = '铁路国际货物运输明细'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量
unitConfig.export_key1 = ''; // 采集导出key
unitConfig.export_key2 = ''; // 统计导出key
unitConfig.export_key3 = ''; // 申报结果查询导出key

// 配置列表列
unitConfig.grid_columns = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left', render: { type: 'date', format: 'YYYYMM' } },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '运输类型名称', dataIndex: 'tlyslxmc', align: 'left', width: 180, ellipsis: true},
	{ title: '货票汇总金额', dataIndex: 'hphzje', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '其他铁路运输金额', dataIndex: 'gsqttlysqyje', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '汇缴成员国铁金额', dataIndex: 'gshjcygtje', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '应扣除金额', dataIndex: 'ykcje1', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '清算后计税金额', dataIndex: 'qshysfwjsje', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left', render: { type: 'date', format: 'YYYYMM' } },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '运输类型名称', dataIndex: 'tlyslxmc', align: 'left', width: 180, ellipsis: true},
	{ title: '货票汇总金额', dataIndex: 'hphzje', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '其他铁路运输金额', dataIndex: 'gsqttlysqyje', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '汇缴成员国铁金额', dataIndex: 'gshjcygtje', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '应扣除金额', dataIndex: 'ykcje1', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '清算后计税金额', dataIndex: 'qshysfwjsje', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
	{ title: '月份', dataIndex: 'yf', align: 'left', width: 120},
	{ title: '铁路运输类型代码', dataIndex: 'tlyslxDm', align: 'left', width: 170},
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'ssq', label: '所属期', type: 'Input' },
	{ name: 'tlyslxmc', label: '运输类型名称', type: 'Select', 'allowClear': true, codeTable: 'code_dm_ckts_tlyslx:02' },
];

// 表单项
unitConfig.form_items = [
	{ label: 'ID', name: 'uuid', type: 'Hidden' },
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle' },
	{ label: '所属期', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}, { func: 'ssq02' }]},
	{ label: '申报序号', name: 'sbxh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbxh02' }], eventOnBlur: 'sbxh' },
	{ label: '月份', name: 'yf', type: 'Input', rules: [{ type: 'base_date', format: 'MM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 2]}], eventOnBlur: 'yf' },
	{ label: '运输信息', name: 'ysxx', type: 'GroupTitle' },
	{ label: '运输类型', name: 'tlyslxDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: 'code_dm_ckts_tlyslx:01', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 2]}], eventOnChange: 'tlyslxDm' },
	{ label: '运输类型名称', name: 'tlyslxmc', type: 'Input', disabled: true, rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 30]}]},
	{ label: '货票汇总金额', name: 'hphzje', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', range: '+-' }, { type: 'base_number', length: 14, decimal: 2}], eventOnBlur: 'hphzje' },
	{ label: '归属其他铁路运输企业金额', name: 'gsqttlysqyje', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', range: '+-' }, { type: 'base_number', length: 14, decimal: 2}], eventOnBlur: 'gsqttlysqyje' },
	{ label: '归属汇缴成员国铁金额', name: 'gshjcygtje', type: 'InputNumber', disabled: true, format: '0,0.00', rules: [{ type: 'base_number', length: 14, decimal: 2}], eventOnBlur: 'gshjcygtje' },
	{ label: '应扣除金额', name: 'ykcje1', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}], eventOnBlur: 'ykcje1' },
	{ label: '清算后应税服务计税金额', name: 'qshysfwjsje', type: 'InputNumber', disabled: true, format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}]},
	{ label: '其他信息', name: 'qtxx', type: 'GroupTitle' },
	{ label: '备注', name: 'bz', type: 'TextArea', autoSize: { minRows: 3, maxRows: 3 }, layout: CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW},
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

