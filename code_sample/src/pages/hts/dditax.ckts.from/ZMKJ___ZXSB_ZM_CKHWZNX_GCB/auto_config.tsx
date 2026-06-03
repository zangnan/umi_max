/**
 * title: 出口业务转内销证明
 * serviceKey: ZMKJ_ZXSB_ZM_CKHWZNX_G
 * unitId: zmkj_zxsb_zm_ckhwznx_gcb
*/

const unitConfig: any = {};

unitConfig.unit_key = 'ZMKJ_ZXSB_ZM_CKHWZNX_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'zmkj_zxsb_zm_ckhwznx_gcb'; // 页面id
unitConfig.grid_title = '出口业务转内销证明'; // 列表标题，可选
unitConfig.form_title = '出口业务转内销证明'; // 表单标题，可选
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
	{ title: '原购进凭证号', dataIndex: 'yghpzh', align: 'left', width: 200},
	{ title: '购进开票日期', dataIndex: 'ghkprq', align: 'left', width: 120, render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '商品代码', dataIndex: 'ckspDm', align: 'left', width: 120},
	{ title: '购进项目名称', dataIndex: 'ckspmc', align: 'left', width: 180, ellipsis: true},
	{ title: '购进数量', dataIndex: 'ghsl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '购进金额', dataIndex: 'ghje', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '购进征税率', dataIndex: 'ghzssl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '购进税额', dataIndex: 'ghzsse', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '内销情况_销货发票号', dataIndex: 'xhpzh', align: 'left', width: 200},
	{ title: '内销情况_内销开票日期', dataIndex: 'nxkprq', align: 'left', width: 120, render: { type: 'date', format: 'yyyy-MM-DD' } },
  	{ title: '内销情况_计量单位', dataIndex: 'hgjldwmc', align: 'left', width: 200},
	{ title: '内销情况_转内销数量', dataIndex: 'nxsl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '可抵扣税额', dataIndex: 'kdkse', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '申报批次', dataIndex: 'sbpc', align: 'left', width: 90, fixed: 'left' },
	/*{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },*/
	{ title: '编号', dataIndex: 'sbbh1', align: 'left', width: 100},
	{ title: '序号', dataIndex: 'xh4', align: 'left', width: 60},
	{ title: '原购进凭证号', dataIndex: 'yghpzh', align: 'left', width: 200},
	{ title: '购进开票日期', dataIndex: 'ghkprq', align: 'left', width: 120, render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '商品代码', dataIndex: 'ckspDm', align: 'left', width: 120},
	{ title: '购进项目名称', dataIndex: 'ckspmc', align: 'left', width: 180, ellipsis: true},
	{ title: '购进数量', dataIndex: 'ghsl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '购进金额', dataIndex: 'ghje', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '购进征税率', dataIndex: 'ghzssl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '购进税额', dataIndex: 'ghzsse', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '内销情况_销货发票号', dataIndex: 'xhpzh', align: 'left', width: 200},
	{ title: '内销情况_内销开票日期', dataIndex: 'nxkprq', align: 'left', width: 120, render: { type: 'date', format: 'yyyy-MM-DD' } },
  	{ title: '内销情况_计量单位', dataIndex: 'hgjldwmc', align: 'left', width: 200},
	{ title: '内销情况_转内销数量', dataIndex: 'nxsl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '可抵扣税额', dataIndex: 'kdkse', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '出口退税证明编号', dataIndex: 'cktszmbh', align: 'left', width: 200},

];

// 筛选项
unitConfig.filter_items = [
	{ name: 'xhpzh', label: '内销情况_销货发票号', type: 'Input' },
	{ name: 'yghpzh', label: '原购进凭证号', type: 'Input' },
	{ name: 'sbbh1', label: '编号', type: 'Input' },
	{ name: 'sbpc', label: '申报批次', type: 'Input' },
	{ name: 'ssq', label: '所属期', type: 'Input' },
];

// 表单项
unitConfig.form_items = [
	{ label: 'ID', name: 'uuid', type: 'Hidden', readOnly: true},
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle', readOnly: true},
	{ label: '所属期', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}, { func: 'ssq01' }], eventOnChange: 'ssq' },
	{ label: '申报批次', name: 'sbpc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbpc02' }], eventOnBlur: 'sbpc' },
	/*{ label: '序号', name: 'sbxh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbxh02' }], eventOnBlur: 'sbxh' },*/
	{ label: '编号', name: 'sbbh1', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { type: 'base_string', length: '10' }, { func: 'sbbh101' }, { func: 'sbbh102' }]},
	{ label: '序号', name: 'xh4', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { type: 'base_string', range: [0, 2]}, { func: 'xh401' }], eventOnBlur: 'xh4' },
	{ label: '发票信息', name: 'fpxx', type: 'GroupTitle', readOnly: true},
	{ label: '原购进凭证号', name: 'yghpzh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 22]}] ,eventOnBlur: 'yghpzh'  }, // 31216 bug号取消 , eventOnChange: 'yghpzh'
	{ label: '购进开票日期', name: 'ghkprq', type: 'DatePicker', 'allowClear': true, format: 'yyyy-MM-DD', rules: [{ type: 'base_required' }, { type: 'base_date', format: 'yyyyMMdd' }]},
	{ label: '商品代码', name: 'ckspDm', type: 'Input', rules: [{ type: 'base_type_number' }, { type: 'base_string', range: [0, 12]}], eventOnBlur: 'ckspDm' },
	{ label: '购进项目名称', name: 'ckspmc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 75]}]},
	/*{ label: '单位', name: 'hgjldwmc', type: 'Hidden', readOnly: true},*/
	{ label: '购进数量', name: 'ghsl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 15, decimal: 5}, { type: 'base_number', range: '+' }], eventOnBlur: 'ghsl' },
	{ label: '购进金额', name: 'ghje', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', range: '+-' }, { type: 'base_number', length: 14, decimal: 2}], eventOnBlur: 'ghje' },
	{ label: '购进征税率', name: 'ghzssl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 5, decimal: 2}, { type: 'base_number', range: '+-' }, { type: 'base_number', range: '+0' }], eventOnBlur: 'ghzssl' },
	{ label: '购进税额', name: 'ghzsse', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', range: '+-' }, { type: 'base_number', length: 14, decimal: 2}], eventOnBlur: 'ghzsse' },
	{ label: '销货信息', name: 'xhxx', type: 'GroupTitle', readOnly: true},
	{ label: '转内销原因', name: 'znxyy', type: 'Hidden' },
	{ label: '内销情况_销货发票号', name: 'xhpzh', type: 'Input', rules: [{ type: 'base_string', range: [0, 20]}]},
	{ label: '内销情况_内销开票日期', name: 'nxkprq', type: 'DatePicker', 'allowClear': true, format: 'yyyy-MM-DD', rules: [{ type: 'base_date', format: 'yyyyMMdd' }]},
  { label: '内销情况_计量单位', name: 'hgjldwmc', type: 'Input', rules: [{ type: 'base_string', range: [0, 75]}]},
  { label: '内销情况_转内销数量', name: 'nxsl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 15, decimal: 5}, { type: 'base_number', range: '+' }, { func: 'nxsl01' }], eventOnBlur: 'nxsl' },
	{ label: '可抵扣税额', name: 'kdkse', type: 'InputNumber', readOnly: true, format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}]},
	{ label: '其他信息', name: 'qtxx', type: 'Hidden', readOnly: true},
	{ label: '备注', name: 'bz', type: 'Hidden', layout: { label: { xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3}, formItem: { xs: 16, sm: 16, md: 16, lg: 19, xl: 21, xxl: 21 } }},
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

