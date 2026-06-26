import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 代理进口货物证明
 * serviceKey: ZMKJ_ZXSB_ZM_DLJK_G
 * unitId: zmkj_zxsb_zm_dljk_gcb
*/

const unitConfig: any = {};

unitConfig.module_key = 'ZMKJ_ZXSB_ZM_DLJK_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'zmkj_zxsb_zm_dljk_gcb'; // 页面id
unitConfig.grid_title = '代理进口货物证明'; // 列表标题，可选
unitConfig.form_title = '代理进口货物证明'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量
unitConfig.export_key1 = ''; // 采集导出key
unitConfig.export_key2 = ''; // 统计导出key
unitConfig.export_key3 = ''; // 申报结果查询导出key
unitConfig.form_api_check = `/yw/bszx/zmkj/dljk/dljkGxqCheck`;
unitConfig.form_save_check = true;

// 配置列表列
unitConfig.grid_columns = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '申报批次', dataIndex: 'sbpc', align: 'left', width: 90, fixed: 'left' },
	/*{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },*/
	{ title: '编号', dataIndex: 'sbbh1', align: 'left', width: 100},
	{ title: '序号', dataIndex: 'xh4', align: 'left', width: 60},
	{ title: '委托方纳税人名称', dataIndex: 'wtfnsrmc', align: 'left', width: 180, ellipsis: true},
	{ title: '委托方纳税人识别号（统一社会信用代码）', dataIndex: 'wtfnsrsbh', align: 'left', width: 320},
	{ title: '进口货物报关单号', dataIndex: 'jkbgdh', align: 'left', width: 180},
	{ title: '手（账）册号', dataIndex: 'jljgszch', align: 'left', width: 215, ellipsis: true},
	{ title: '加工单位名称', dataIndex: 'jgqynsrmc', align: 'left', width: 180, ellipsis: true},
  { title: '计量单位', dataIndex: 'hgjldwmc', align: 'left', width: 90 },
  { title: '进口数量', dataIndex: 'jksl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '代理进口协议号', dataIndex: 'wtdljkhth', align: 'left', width: 200, ellipsis: true},
	{ title: '海关实征税', dataIndex: 'msjkljhgszgshxfs', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '申报批次', dataIndex: 'sbpc', align: 'left', width: 90, fixed: 'left' },
	/*{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },*/
	{ title: '编号', dataIndex: 'sbbh1', align: 'left', width: 100},
	{ title: '序号', dataIndex: 'xh4', align: 'left', width: 60},
	{ title: '委托方纳税人名称', dataIndex: 'wtfnsrmc', align: 'left', width: 180, ellipsis: true},
	{ title: '委托方纳税人识别号（统一社会信用代码）', dataIndex: 'wtfnsrsbh', align: 'left', width: 320},
	{ title: '进口货物报关单号', dataIndex: 'jkbgdh', align: 'left', width: 180},
	{ title: '手（账）册号', dataIndex: 'jljgszch', align: 'left', width: 215, ellipsis: true},
	{ title: '加工单位名称', dataIndex: 'jgqynsrmc', align: 'left', width: 180, ellipsis: true},
  { title: '计量单位', dataIndex: 'hgjldwmc', align: 'left', width: 90 },
  { title: '进口数量', dataIndex: 'jksl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '代理进口协议号', dataIndex: 'wtdljkhth', align: 'left', width: 200, ellipsis: true},
	{ title: '海关实征税', dataIndex: 'msjkljhgszgshxfs', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
	{ title: '出口退税证明编号', dataIndex: 'cktszmbh', align: 'left', width: 200},
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'wtdljkhth', label: '代理进口协议号', type: 'Input' },
	{ name: 'jkbgdh', label: '进口货物报关单号', type: 'Input' },
	{ name: 'wtfnsrsbh', label: '委托方纳税人识别号（统一社会信用代码）', type: 'Input' },
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
	{ label: '委托方信息', name: 'wtfxx', type: 'GroupTitle' },
  { label: '委托方纳税人识别号（统一社会信用代码）', name: 'wtfnsrsbh', type: 'AutoComplete', showType: '2', codeTable: 'url_gy_qywtf:01', rules: [{ type: 'base_required' }, { type: 'base_type_number_english' }, { type: 'base_string', range: ['15', '20']}, { func: 'wtfnsrsbh01' }], eventOnBlur: 'wtfnsrsbh' },
	{ label: '委托方纳税人名称', name: 'wtfnsrmc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 80]}, { func: 'wtfnsrmc01' }]},
	{ label: '代理进口协议号', name: 'wtdljkhth', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 60]}]},
  { label: '进口信息', name: 'jkxx', type: 'GroupTitle' },
	{ label: '进口货物报关单号', name: 'jkbgdh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', length: '21' }, { type: 'base_type_number_english' }]},
	{ label: '进料加工手册_手（账）册号', name: 'jljgszch', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 20]}]},
	{ label: '进料加工手册_加工单位名称', name: 'jgqynsrmc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 80]}]},
  { label: '计量单位', name: 'hgjldwmc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 75]}]},
  { label: '进口数量', name: 'jksl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 15, decimal: 5}, { type: 'base_number', range: '+' }] },
  { label: '海关实征关税和消费税', name: 'msjkljhgszgshxfs', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_number', length: 14, decimal: 2}, { func: 'setZero' }]},
	{ label: '其他信息', name: 'qtxx', type: 'GroupTitle' },
	{ label: '备注', name: 'bz', type: 'TextArea', rules: [{ type: 'base_string', range: [0, 200]}], autoSize: { minRows: 3, maxRows: 3 }, layout: CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW},
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

unitConfig.customer_toolbar = [];
unitConfig.handle_columns = [];
export default unitConfig;

