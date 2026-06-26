import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 出口已使用设备
 * serviceKey: ZBYW_ZXSB_SB_YS_SBMX_G
 * unitId: zbyw_zxsb_sb_ys_sbmx_gcb
*/

const unitConfig: any = {};

unitConfig.module_key = 'ZBYW_ZXSB_SB_YS_SBMX_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'zbyw_zxsb_sb_ys_sbmx_gcb'; // 页面id
unitConfig.grid_title = '出口已使用设备'; // 列表标题，可选
unitConfig.form_title = '出口已使用设备'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量
unitConfig.export_key1 = ''; // 采集导出key
unitConfig.export_key2 = ''; // 统计导出key
unitConfig.export_key3 = ''; // 申报结果查询导出key

// 配置列表列
unitConfig.grid_columns = [
	{ title: '申报年月', dataIndex: 'ssq', align: 'left', width: 75, fixed: 'left' },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '设备名称', dataIndex: 'ysygdsbmc', align: 'left', width: 180, ellipsis: true},
	{ title: '出口货物报关单号', dataIndex: 'ckbgdh', align: 'left', width: 180},
	{ title: '出口日期', dataIndex: 'ckrq1', align: 'left', width: 120, render: { type: 'date', format: 'YYYY-MM-DD' } },
	{ title: '代理出口货物证明号', dataIndex: 'dlckhwzmhm', align: 'left', width: 280},
	{ title: '出口商品代码', dataIndex: 'ckspDm', align: 'left', width: 120},
	{ title: '出口商品名称', dataIndex: 'sbhgspmc', align: 'left', width: 180, ellipsis: true},
	{ title: '退税率', dataIndex: 'tsl', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '设备凭证号码', dataIndex: 'ysygdsbpzhm', align: 'left', width: 280},
	{ title: '开票日期', dataIndex: 'kprq', align: 'left', width: 120, render: { type: 'date', format: 'YYYY-MM-DD' } },
	{ title: '金额', dataIndex: 'jsje', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '税额', dataIndex: 'se', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '征税率', dataIndex: 'zssl', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '设备原值', dataIndex: 'sbyz', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '已使用年限', dataIndex: 'ysynx', align: 'left', width: 125},
	{ title: '已提累计折旧', dataIndex: 'ytljzje', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '设备净值', dataIndex: 'sbzyjz', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '申报退税额', dataIndex: 'tse', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '申报年月', dataIndex: 'ssq', align: 'left', width: 75, fixed: 'left' },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '设备名称', dataIndex: 'ysygdsbmc', align: 'left', width: 180, ellipsis: true},
	{ title: '出口货物报关单号', dataIndex: 'ckbgdh', align: 'left', width: 180},
	{ title: '出口日期', dataIndex: 'ckrq1', align: 'left', width: 120, render: { type: 'date', format: 'YYYY-MM-DD' } },
	{ title: '代理出口货物证明号', dataIndex: 'dlckhwzmhm', align: 'left', width: 280},
	{ title: '出口商品代码', dataIndex: 'ckspDm', align: 'left', width: 120},
	{ title: '出口商品名称', dataIndex: 'sbhgspmc', align: 'left', width: 180, ellipsis: true},
	{ title: '退税率', dataIndex: 'tsl', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '设备凭证号码', dataIndex: 'ysygdsbpzhm', align: 'left', width: 280},
	{ title: '开票日期', dataIndex: 'kprq', align: 'left', width: 120, render: { type: 'date', format: 'YYYY-MM-DD' } },
	{ title: '金额', dataIndex: 'jsje', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '税额', dataIndex: 'se', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '征税率', dataIndex: 'zssl', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '设备原值', dataIndex: 'sbyz', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '已使用年限', dataIndex: 'ysynx', align: 'left', width: 125},
	{ title: '已提累计折旧', dataIndex: 'ytljzje', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '设备净值', dataIndex: 'sbzyjz', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '申报退税额', dataIndex: 'tse', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
	{ title: '申报日期', dataIndex: 'tbrq1', align: 'left', width: 120, render: { type: 'date', format: 'YYYY-MM-DD' } },
	{ title: '是否不予退税', dataIndex: 'bytsbz', align: 'left', width: 120, render: { func: 'bytsbz' } },
	{ title: '是否不予办理', dataIndex: 'byblbz', align: 'left', width: 120, render: { func: 'byblbz' } },
	{ title: '是否暂不办理', dataIndex: 'zbblbz', align: 'left', width: 120, render: { func: 'zbblbz' } },
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'ysygdsbpzhm', label: '设备凭证号码', type: 'Input' },
	{ name: 'ckspDm', label: '出口商品代码', type: 'Input' },
	{ name: 'dlckhwzmhm', label: '代理出口货物证明号', type: 'Input' },
	{ name: 'ckbgdh', label: '出口货物报关单号', type: 'Input' },
	{ name: 'ckrq1', label: '出口日期', type: 'DatePicker', 'allowClear': true, range: true},
	{ name: 'ssq', label: '申报年月', type: 'Input' },
];

// 表单项
unitConfig.form_items = [
	{ label: '主键', name: 'uuid', type: 'Hidden', disabled: true},
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle', disabled: true},
	{ label: '申报年月', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}, { func: 'ssq02' }]},
	{ label: '序号', name: 'sbxh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbxh02' }], eventOnBlur: 'sbxh' },
	{ label: '设备信息', name: 'spxx', type: 'GroupTitle', disabled: true},
	{ label: '已使用过的设备名称', name: 'ysygdsbmc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 40]}]},
	{ label: '出口货物报关单号', name: 'ckbgdh', type: 'Input', rules: [{ type: 'base_string', length: '21' }, { type: 'base_type_number_english' }], eventOnChange: 'ckbgdh' },
	{ label: '出口日期', name: 'ckrq1', type: 'DatePicker', 'allowClear': true, format: 'YYYY-MM-DD', rules: [{ type: 'base_required' }, { type: 'base_date', format: 'yyyyMMdd' }]},
	{ label: '代理出口货物证明号', name: 'dlckhwzmhm', type: 'Input', rules: [{ type: 'base_string', range: [0, 20]}, { type: 'base_type_number_english' }]},
	{ label: '出口商品代码', name: 'ckspDm', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { type: 'base_string', range: [0, 12]}], eventOnBlur: 'ckspDm' },
	{ label: '出口商品名称', name: 'sbhgspmc', type: 'Input', disabled: true, rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 254]}]},
	{ label: '退税率', name: 'tsl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 4, decimal: 2}, { type: 'base_number', range: '+-' }, { type: 'base_number', range: '+0' }, { func: 'tsl01' }], eventOnBlur: 'tsl' },
	{ label: '已使用过的设备凭证号码', name: 'ysygdsbpzhm', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 30]}], eventOnChange: 'jhpzh' },
	{ label: '开票日期', name: 'kprq', type: 'DatePicker', 'allowClear': true, format: 'YYYY-MM-DD', rules: [{ type: 'base_required' }, { type: 'base_date', format: 'yyyyMMdd' }]},
	{ label: '金额', name: 'jsje', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+' }], eventOnBlur: 'jsje' },
	{ label: '征税率', name: 'zssl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 4, decimal: 2}, { type: 'base_number', range: '+-' }, { type: 'base_number', range: '+0' }], eventOnBlur: 'zssl' },
	{ label: '税额', name: 'se', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+' }]},
	{ label: '设备原值', name: 'sbyz', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+' }], eventOnBlur: 'sbyz' },
	{ label: '已使用年限', name: 'ysynx', type: 'InputNumber', rules: [{ type: 'base_required' }, { type: 'base_number', length: 2, decimal: 0}, { type: 'base_number', range: '+' }]},
	{ label: '已提累计折旧', name: 'ytljzje', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', range: '+-' }, { type: 'base_number', length: 14, decimal: 2}, { func: 'ytljzje01' }], eventOnBlur: 'ytljzje' },
	{ label: '设备净值', name: 'sbzyjz', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+-' }], eventOnBlur: 'sbzyjz' },
	{ label: '申报退税额', name: 'tse', type: 'InputNumber', disabled: true, format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}]},
	{ label: '其他信息', name: 'qtxx', type: 'GroupTitle', disabled: true},
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

