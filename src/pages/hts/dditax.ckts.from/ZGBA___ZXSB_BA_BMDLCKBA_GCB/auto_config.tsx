import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 边贸代理出口备案
 * serviceKey: ZGBA_ZXSB_BA_BMDLCKBA_G
 * unitId: zgba_zxsb_ba_bmdlckba_gcb
*/

const unitConfig: any = {};

unitConfig.module_key = 'ZGBA_ZXSB_BA_BMDLCKBA_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'zgba_zxsb_ba_bmdlckba_gcb'; // 页面id
unitConfig.grid_title = '边贸代理出口备案'; // 列表标题，可选
unitConfig.form_title = '边贸代理出口备案'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量
unitConfig.export_key1 = ''; // 采集导出key
unitConfig.export_key2 = ''; // 统计导出key
unitConfig.export_key3 = ''; // 申报结果查询导出key

// 配置列表列
unitConfig.grid_columns = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '委托方名称', dataIndex: 'wtfmc', align: 'left', width: 180, ellipsis: true},
	{ title: '委托方证件号码', dataIndex: 'wtfjbrhzhmhbmzhm', align: 'left', width: 205},
	{ title: '代理出口协议号', dataIndex: 'dlckxyh', align: 'left', width: 280},
	{ title: '出口货物报关单号码', dataIndex: 'ckbgdh', align: 'left', width: 180},
	{ title: '出口日期', dataIndex: 'ckrq1', align: 'left', width: 120, render: { type: 'date', format: 'YYYY-MM-DD' } },
	{ title: '出口商品代码', dataIndex: 'ckspDm', align: 'left', width: 120},
	{ title: '出口商品名称', dataIndex: 'ckspmc', align: 'left', width: 180, ellipsis: true},
	{ title: '数量', dataIndex: 'sl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '金额', dataIndex: 'je', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '委托方名称', dataIndex: 'wtfmc', align: 'left', width: 180, ellipsis: true},
	{ title: '委托方证件号码', dataIndex: 'wtfjbrhzhmhbmzhm', align: 'left', width: 205},
	{ title: '代理出口协议号', dataIndex: 'dlckxyh', align: 'left', width: 280},
	{ title: '出口货物报关单号码', dataIndex: 'ckbgdh', align: 'left', width: 180},
	{ title: '出口日期', dataIndex: 'ckrq1', align: 'left', width: 120, render: { type: 'date', format: 'YYYY-MM-DD' } },
	{ title: '出口商品代码', dataIndex: 'ckspDm', align: 'left', width: 120},
	{ title: '出口商品名称', dataIndex: 'ckspmc', align: 'left', width: 180, ellipsis: true},
	{ title: '数量', dataIndex: 'sl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '金额', dataIndex: 'je', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'ckrq1', label: '出口日期', type: 'DatePicker', 'allowClear': true, range: true},
	{ name: 'ckspDm', label: '出口商品代码', type: 'Input' },
	{ name: 'ckbgdh', label: '出口货物报关单号码', type: 'Input' },
	{ name: 'wtfjbrhzhmhbmzhm', label: '委托方证件号码', type: 'Input' },
	{ name: 'wtfmc', label: '委托方名称', type: 'Input' },
	{ name: 'ssq', label: '所属期', type: 'Input' },
];

// 表单项
unitConfig.form_items = [
	{ label: 'ID', name: 'uuid', type: 'Hidden' },
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle' },
	{ label: '所属期', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { func: 'ssq02' }, { type: 'base_string', range: [0, 6]}]},
	{ label: '序号', name: 'sbxh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbxh02' }], eventOnBlur: 'sbxh' },
	{ label: '委托方信息', name: 'wtfxx', type: 'GroupTitle' },
	{ label: '委托单位名称或委托人名称', name: 'wtfmc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 200]}]},
	{ label: '委托方经办人护照号码或边民证号码', name: 'wtfjbrhzhmhbmzhm', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 50]}]},
	{ label: '代理出口协议号码', name: 'dlckxyh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 30]}]},
	{ label: '出口货物报关单号码', name: 'ckbgdh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', length: '21' }, { type: 'base_type_number_english' }], eventOnChange: 'ckbgdh' },
	{ label: '出口日期', name: 'ckrq1', type: 'DatePicker', 'allowClear': true, format: 'YYYY-MM-DD', rules: [{ type: 'base_required' }, { type: 'base_date', format: 'yyyyMMdd' }]},
	{ label: '出口货物商品代码', name: 'ckspDm', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { type: 'base_string', range: [0, 20]}], eventOnBlur: 'ckspDm' },
	{ label: '出口货物名称', name: 'ckspmc', type: 'Input', disabled: true, rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 75]}]},
	{ label: '数量', name: 'sl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 15, decimal: 5}, { type: 'base_number', range: '+' }]},
	{ label: '金额', name: 'je', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', range: '+-' }, { type: 'base_number', length: 14, decimal: 2}]},
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

