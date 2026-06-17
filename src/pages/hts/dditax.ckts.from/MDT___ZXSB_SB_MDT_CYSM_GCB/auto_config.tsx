import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 出口货物离岸价差异原因说明
 * serviceKey: TSZL_ZXSB_SB_MDT_CYSM_G
 * unitId: mdt_zxsb_sb_mdt_cysm_gcb
*/

const unitConfig: any = {};

unitConfig.module_key = 'TSZL_ZXSB_SB_MDT_CYSM_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'mdt_zxsb_sb_mdt_cysm_gcb'; // 页面id
unitConfig.grid_title = '出口货物离岸价差异原因说明'; // 列表标题，可选
unitConfig.form_title = '出口货物离岸价差异原因说明'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量
unitConfig.export_key1 = 'SAAS_TSSB_MXCJ_CYSM_DC'; // 采集导出key
unitConfig.export_key2 = 'SAAS_SJGL_SWFKCX_MDT_CKHWLAJCYYYSM_DC'; // 统计导出key
unitConfig.export_key3 = 'SAAS_TSSB_MDT_SBMXCK_CKHWLAJCYYYSM_DC'; // 申报结果查询导出key

// 配置列表列
unitConfig.grid_columns = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '出口发票号', dataIndex: 'ckfph', align: 'left', width: 150, ellipsis: true},
	{ title: '出口发票美元离岸价', dataIndex: 'ckfpmylaj', align: 'right', width: 160, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '出口发票人民币离岸价', dataIndex: 'ckfprmblaj', align: 'right', width: 160, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '出口报关单号码', dataIndex: 'ckbgdh', align: 'left', width: 180},
	{ title: '出口报关单美元离岸价', dataIndex: 'mylaj', align: 'right', width: 160, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '出口报关单人民币离岸价', dataIndex: 'rmblaj', align: 'right', width: 180, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '人民币离岸价差异额', dataIndex: 'ckfphckbgdrmblajcye', align: 'right', width: 150, sum: true},
	{ title: '人民币离岸价差异率', dataIndex: 'ckfphckbgdrmblajcyl', align: 'right', width: 240, render: { type: 'number', format: '0,0.00000' } },
	{ title: '差异原因说明', dataIndex: 'yysm', align: 'left', width: 180, ellipsis: true},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '出口发票号', dataIndex: 'ckfph', align: 'left', width: 150, ellipsis: true},
	{ title: '出口发票美元离岸价', dataIndex: 'ckfpmylaj', align: 'right', width: 160, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '出口发票人民币离岸价', dataIndex: 'ckfprmblaj', align: 'right', width: 160, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '出口报关单号码', dataIndex: 'ckbgdh', align: 'left', width: 180},
	{ title: '出口报关单美元离岸价', dataIndex: 'mylaj', align: 'right', width: 160, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '出口报关单人民币离岸价', dataIndex: 'rmblaj', align: 'right', width: 180, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '人民币离岸价差异额', dataIndex: 'ckfphckbgdrmblajcye', align: 'right', width: 150, sum: true},
	{ title: '人民币离岸价差异率', dataIndex: 'ckfphckbgdrmblajcyl', align: 'right', width: 240, render: { type: 'number', format: '0,0.00000' } },
	{ title: '差异原因说明', dataIndex: 'yysm', align: 'left', width: 180, ellipsis: true},
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'ckfph', label: '出口发票号', type: 'Input' },
	{ name: 'ssq', label: '所属期', type: 'Input' },
	{ name: 'ckbgdh', label: '出口报关单号码', type: 'Input' },
];

// 表单项
unitConfig.form_items = [
	{ label: '申报ID', name: 'uuid', type: 'Hidden' },
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle' },
	{ label: '所属期', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}, { func: 'ssq02' }]},
	{ label: '序号', name: 'sbxh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbxh02' }], eventOnBlur: 'sbxh' },
	{ label: '差异信息', name: 'cyxx', type: 'GroupTitle' },
	{ label: '出口发票号码', name: 'ckfph', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 30]}]},
	{ label: '出口发票美元离岸价', name: 'ckfpmylaj', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', range: '+-' }, { type: 'base_number', length: 14, decimal: 2}]},
	{ label: '出口发票人民币离岸价', name: 'ckfprmblaj', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+-' }], eventOnBlur: 'ckfprmblaj' },
	{ label: '出口报关单号码', name: 'ckbgdh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 21]}, { type: 'base_type_number_english' }], eventOnChange: 'ckbgdh' },
	{ label: '代理证明号', name: 'dlckhwzmhm', type: 'Hidden' },
	{ label: '出口报关单美元离岸价', name: 'mylaj', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+-' }]},
	{ label: '出口报关单人民币离岸价', name: 'rmblaj', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+-' }], eventOnBlur: 'rmblaj' },
	{ label: '人民币离岸价差异额', name: 'ckfphckbgdrmblajcye', type: 'InputNumber', disabled: true, format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { func: 'ckfphckbgdrmblajcye01' }], eventOnBlur: 'ckfphckbgdrmblajcye' },
	{ label: '人民币离岸价差异率', name: 'ckfphckbgdrmblajcyl', type: 'InputNumber', disabled: true, format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 19, decimal: 5}, { func: 'ckfphckbgdrmblajcyl01' }]},
	{ label: 'ST', name: 'st', type: 'Blank' },
	{ label: '差异原因说明', name: 'yysm', type: 'TextArea', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 200]}], autoSize: { minRows: 3, maxRows: 3 }, layout: CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW},
	{ label: '其他信息', name: 'qtxx', type: 'Hidden' },
	{ label: '申报类型', name: 'lajcysblxDm', type: 'Hidden', disabled: true},
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
  upload: true,  // 是否显示导入按钮，默认关闭
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

