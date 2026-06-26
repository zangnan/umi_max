import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 出口企业申请提醒服务
 * serviceKey: ZGBA_ZXSB_TX_CKTSYWTX_G
 * unitId: zgba_zxsb_tx_cktsywtx_gcb
*/

const unitConfig: any = {};

unitConfig.module_key = 'ZGBA_ZXSB_TX_CKTSYWTX_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'zgba_zxsb_tx_cktsywtx_gcb'; // 页面id
unitConfig.grid_title = '出口企业申请提醒服务'; // 列表标题，可选
unitConfig.form_title = '出口企业申请提醒服务'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量
unitConfig.export_key1 = ''; // 采集导出key
unitConfig.export_key2 = ''; // 统计导出key
unitConfig.export_key3 = ''; // 申报结果查询导出key

// 配置列表列
unitConfig.grid_columns = [
	{ title: '申请日期', dataIndex: 'tbrq1', align: 'left', width: 120, fixed: 'left', render: { type: 'date', format: 'YYYY-MM-DD' } },
	{ title: '登记人姓名1', dataIndex: 'djryxm', align: 'left', width: 115},
	{ title: '职务1', dataIndex: 'zw', align: 'left', width: 175},
	{ title: '手机号码1', dataIndex: 'lxdh', align: 'left', width: 165},
	{ title: '电子邮件1', dataIndex: 'yx', align: 'left', width: 175},
	{ title: '登记人姓名2', dataIndex: 'djryxm2', align: 'left', width: 115},
	{ title: '职务2', dataIndex: 'zw2', align: 'left', width: 175},
	{ title: '手机号码2', dataIndex: 'lxdh2', align: 'left', width: 165},
	{ title: '电子邮件2', dataIndex: 'yx2', align: 'left', width: 175},
	{ title: '是否申请退税提醒服务', dataIndex: 'sqtstxfwbz', align: 'left', width: 180, codeTable: 'code_static_yes_no:01' },
	{ title: '申请提醒内容', dataIndex: 'sqtxnr', align: 'left', width: 305, codeTable: 'code_cs_ckts_sqtxnr:01' },
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '申请日期', dataIndex: 'tbrq1', align: 'left', width: 120, fixed: 'left', render: { type: 'date', format: 'YYYY-MM-DD' } },
	{ title: '登记人姓名1', dataIndex: 'djryxm', align: 'left', width: 115},
	{ title: '职务1', dataIndex: 'zw', align: 'left', width: 175},
	{ title: '手机号码1', dataIndex: 'lxdh', align: 'left', width: 165},
	{ title: '电子邮件1', dataIndex: 'yx', align: 'left', width: 175},
	{ title: '登记人姓名2', dataIndex: 'djryxm2', align: 'left', width: 115},
	{ title: '职务2', dataIndex: 'zw2', align: 'left', width: 175},
	{ title: '手机号码2', dataIndex: 'lxdh2', align: 'left', width: 165},
	{ title: '电子邮件2', dataIndex: 'yx2', align: 'left', width: 175},
	{ title: '是否申请退税提醒服务', dataIndex: 'sqtstxfwbz', align: 'left', width: 180, codeTable: 'code_static_yes_no:01' },
	{ title: '申请提醒内容', dataIndex: 'sqtxnr', align: 'left', width: 305, codeTable: 'code_cs_ckts_sqtxnr:01' },
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'tbrq1', label: '申请日期', type: 'DatePicker', 'allowClear': true, range: true},
];

// 表单项
unitConfig.form_items = [
	{ label: 'ID', name: 'uuid', type: 'Hidden' },
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle' },
	{ label: '申请日期', name: 'tbrq1', type: 'DatePicker', 'allowClear': true, format: 'YYYY-MM-DD', rules: [{ type: 'base_required' }, { type: 'base_date', format: 'yyyyMMdd' }, { func: 'tbrq01' }]},
	{ label: '退税业务提醒信息', name: 'tsywtxxx', type: 'GroupTitle' },
	{ label: '登记人员姓名', name: 'djryxm', type: 'Input', rules: [{ type: 'base_string', range: [0, 30]}, { func: 'djryxm01' }]},
	{ label: '登记人员职务', name: 'zw', type: 'Input', rules: [{ type: 'base_string', range: [0, 30]}, { func: 'zw01' }]},
	{ label: '登记人员手机号码', name: 'lxdh', type: 'Input', rules: [{ type: 'base_string', range: [0, 16]}, { type: 'base_type_phone' }, { func: 'lxdh01' }]},
	{ label: '登记人员电子邮件', name: 'yx', type: 'Input', rules: [{ type: 'base_string', range: [0, 30]}, { type: 'base_type_mail' }, { func: 'yx01' }]},
	{ label: '登记人姓名2', name: 'djryxm2', type: 'Input', rules: [{ type: 'base_string', range: [0, 30]}]},
	{ label: '职务2', name: 'zw2', type: 'Input', rules: [{ type: 'base_string', range: [0, 12]}]},
	{ label: '手机号码2', name: 'lxdh2', type: 'Input', rules: [{ type: 'base_string', range: [0, 16]}, { type: 'base_type_phone' }]},
	{ label: '电子邮件2', name: 'yx2', type: 'Input', rules: [{ type: 'base_string', range: [0, 30]}, { type: 'base_type_mail' }]},
	{ label: '是否申请退税提醒服务', name: 'sqtstxfwbz', type: 'Select', 'allowClear': true, codeTable: 'code_static_yes_no:01', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 1]}], eventOnChange: 'sqtstxfwbz' },
	{ label: '申请提醒内容', name: 'sqtxnr', type: 'Select', showType: '4', 'showSearch': true, 'mode': 'multiple', eventOnChange: 'sqtxnr', 'allowClear': true, codeTable: 'code_cs_ckts_sqtxnr:01', rules: [{ func: 'sqtxnr01' }]},
	{ label: '填表人', name: 'tbrxm1', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 100]}]},
	{ label: '填表人身份证件类型', name: 'sfzjlxDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: 'code_dm_gy_sfzjlx:01', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 3]}], eventOnChange: 'sfzjlxDm' },
	{ label: '填表人证件类型名称', name: 'sfzjlxmc', type: 'Input', disabled: true},
	{ label: '填表人身份证件号码', name: 'sfzjhm', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 30]}]},
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

