import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 代理出口货物证明申请
 * serviceKey: ZMKJ_ZXSB_ZM_DLCK_G
 * unitId: zmkj_zxsb_zm_dlck_gcb
*/

const unitConfig: any = {};

unitConfig.module_key = 'ZMKJ_ZXSB_ZM_DLCK_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'zmkj_zxsb_zm_dlck_gcb'; // 页面id
unitConfig.grid_title = '代理出口货物证明'; // 列表标题，可选
unitConfig.form_title = '代理出口货物证明'; // 表单标题，可选
unitConfig.form_save_add_flag = true;	// 表单保存并添加开关
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = '原系统未配置？'; // 配置常量
unitConfig.export_key1 = 'SAAS_QTTMS_ZMSB_DLCK_DC'; // 采集导出key
unitConfig.export_key2 = 'SAAS_SJGL_SWFKCX_ZMYW_DLCKHWZMSQ_DC'; // 统计导出key
unitConfig.export_key3 = 'SAAS_QTTMS_ZMSB_SBMXCK_DLCKHWZM_DC'; // 申报结果查询导出key
unitConfig.batch_update_url = `/yw/bszx/zmkj/dlck/dlckPlgxSbmxsj`;
unitConfig.form_api_check = `/yw/bszx/zmkj/dlck/dlckGxqCheck`;
unitConfig.form_save_check = true;
unitConfig.batch_update_items = [
    { dataIndex: 'ckspmc', label: '出口商品名称', type: "Input" ,rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 75]}]},
    { dataIndex: 'bz', label: '备注', type: "Input", rules: [{ type: 'base_string', range: [0, 200]}], unRequired: true },
  ];

// 配置列表列
unitConfig.grid_columns = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left', render: { type: 'date', format: 'YYYYMM' } },
	{ title: '申报批次', dataIndex: 'sbpc', align: 'left', width: 90, fixed: 'left' },
	// { title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '编号', dataIndex: 'sbbh1', align: 'left', width: 100},
	{ title: '序号', dataIndex: 'xh4', align: 'left', width: 60},
	{ title: '委托方纳税人识别号（统一社会信用代码）', dataIndex: 'wtfnsrsbh', align: 'left', width: 320},
	{ title: '委托方纳税人名称', dataIndex: 'wtfnsrmc', align: 'left', width: 180, ellipsis: true},
	{ title: '代理出口协议号', dataIndex: 'wtdlckhth', align: 'left', width: 140, ellipsis: true},
	{ title: '委托出口货物证明号码', dataIndex: 'wtckhwzmbh', align: 'left', width: 200},
	{ title: '出口货物报关单号', dataIndex: 'ckbgdh', align: 'left', width: 180},
	{ title: '出口日期', dataIndex: 'ckrq1', align: 'center', width: 120},
	{ title: '监管方式', dataIndex: 'myfsDm', align: 'left', width: 105},
	{ title: '监管方式名称', dataIndex: 'myfsmc', align: 'left', width: 180, ellipsis: true},
	{ title: '出口商品代码', dataIndex: 'ckspDm', align: 'left', width: 120},
	{ title: '出口商品名称', dataIndex: 'ckspmc', align: 'left', width: 180, ellipsis: true},
	{ title: '计量单位', dataIndex: 'hgjldwmc', align: 'left', width: 90},
	{ title: '出口数量', dataIndex: 'cksl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '成交币制', dataIndex: 'hbzmDm', align: 'left', width: 70},
	{ title: '成交币制名称', dataIndex: 'cjbzmc', align: 'left', width: 180, ellipsis: true},
	{ title: '成交总价', dataIndex: 'cjzj', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '美元离岸价', dataIndex: 'mylaj', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '美元汇率', dataIndex: 'myhl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '人民币离岸价', dataIndex: 'rmblaj', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left', render: { type: 'date', format: 'YYYYMM' } },
	{ title: '申报批次', dataIndex: 'sbpc', align: 'left', width: 90, fixed: 'left' },
	// { title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '编号', dataIndex: 'sbbh1', align: 'left', width: 100},
	{ title: '序号', dataIndex: 'xh4', align: 'left', width: 60},
	{ title: '委托方纳税人识别号（统一社会信用代码）', dataIndex: 'wtfnsrsbh', align: 'left', width: 200},
	{ title: '委托方纳税人名称', dataIndex: 'wtfnsrmc', align: 'left', width: 180, ellipsis: true},
	{ title: '代理出口协议号', dataIndex: 'wtdlckhth', align: 'left', width: 140, ellipsis: true},
	{ title: '委托出口货物证明号码', dataIndex: 'wtckhwzmbh', align: 'left', width: 200},
	{ title: '出口货物报关单号', dataIndex: 'ckbgdh', align: 'left', width: 180},
	{ title: '出口日期', dataIndex: 'ckrq1', align: 'center', width: 120},
	{ title: '监管方式', dataIndex: 'myfsDm', align: 'left', width: 105},
	{ title: '监管方式名称', dataIndex: 'myfsmc', align: 'left', width: 180, ellipsis: true},
	{ title: '出口商品代码', dataIndex: 'ckspDm', align: 'left', width: 120},
	{ title: '出口商品名称', dataIndex: 'ckspmc', align: 'left', width: 180, ellipsis: true},
	{ title: '计量单位', dataIndex: 'hgjldwmc', align: 'left', width: 90},
	{ title: '出口数量', dataIndex: 'cksl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '成交币制', dataIndex: 'hbzmDm', align: 'left', width: 70},
	{ title: '成交币制名称', dataIndex: 'cjbzmc', align: 'left', width: 180, ellipsis: true},
	{ title: '成交总价', dataIndex: 'cjzj', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '美元离岸价', dataIndex: 'mylaj', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '美元汇率', dataIndex: 'myhl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '人民币离岸价', dataIndex: 'rmblaj', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
	{ title: '出口退税证明编号', dataIndex: 'cktszmbh', align: 'left', width: 200},
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'wtdlckhth', label: '代理出口协议号', type: 'Input' },
	{ name: 'ckbgdh', label: '出口货物报关单号', type: 'Input' },
	{ name: 'ckrq1', label: '出口日期', type: 'DatePicker', 'allowClear': true, range: true},
	{ name: 'wtfnsrsbh', label: '委托方纳税人识别号（统一社会信用代码）', type: 'Input' },
	{ name: 'sbbh1', label: '编号', type: 'Input' },
	{ name: 'sbpc', label: '申报批次', type: 'Input' },
	{ name: 'ssq', label: '所属期', type: 'Input' },
];

// 表单项
unitConfig.form_items = [
	{ label: 'ID', name: 'uuid', type: 'Hidden', disabled: true},
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle', disabled: true},
	{ label: '所属期', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}, { func: 'ssq01' }], eventOnChange: 'ssq' },
	{ label: '申报批次', name: 'sbpc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbpc02' }], eventOnBlur: 'sbpc' },
	// { label: '序号', name: 'sbxh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbxh02' }], eventOnBlur: 'sbxh' },
	{ label: '编号', name: 'sbbh1', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { type: 'base_string', length: '10' }, { func: 'sbbh101' }, { func: 'sbbh102' }]},
	{ label: '序号', name: 'xh4', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { type: 'base_string', range: [0, 2]}, { func: 'xh401' }], eventOnBlur: 'xh4' },
	{ label: '委托方信息', name: 'wtfxx', type: 'GroupTitle', disabled: true},
	{ label: '委托方纳税人识别号（统一社会信用代码）', name: 'wtfnsrsbh', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: 'url_gy_qywtf:01', rules: [{ type: 'base_required' }, { type: 'base_type_number_english' }, { type: 'base_string', range: ['15', '20']}, { func: 'wtfnsrsbh01' }], eventOnChange: 'wtfnsrsbh' },
	{ label: '委托方纳税人名称', name: 'wtfnsrmc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 80]}, { func: 'wtfnsrmc01' }]},
	{ label: '代理出口协议号', name: 'wtdlckhth', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 60]}, { type: 'base_required' }, { type: 'base_string', range: [0, 60]}]},
	{ label: '委托出口货物证明号码', name: 'wtckhwzmbh', type: 'Input', rules: [{ type: 'base_string', range: [0, 20]}], eventOnChange: 'wtckhwzmbh' },
	{ label: '出口信息', name: 'ckxx', type: 'GroupTitle', disabled: true},
	{ label: '出口货物报关单号', name: 'ckbgdh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', length: '21' }, { type: 'base_string', range: [0, 21]}, { type: 'base_type_number_english' }], eventOnChange: 'ckbgdh' },
	{ label: '出口日期', name: 'ckrq1', type: 'DatePicker', 'allowClear': true, format: 'YYYY-MM-DD', rules: [{type: 'base_required'}, {type: 'base_date', format: 'yyyyMMdd'}]},
	{ label: '出口收汇核销单号', name: 'ckshhxdh', type: 'Hidden' },
	{ label: '监管方式', name: 'myfsDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: 'code_dm_ckts_hgjgfs:01', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 4]}], eventOnChange: 'hgjgfsDm' },
	{ label: '监管方式名称', name: 'myfsName', type: 'Input', disabled: true},
	{ label: '出口商品代码', name: 'ckspDm', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'dlckCksp' }, { type: 'base_string', range: [0, 10]}]},
	{ label: '出口商品名称', name: 'ckspmc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 75]}]},
	{ label: '计量单位', name: 'hgjldwmc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 12]}]},
	{ label: '出口数量', name: 'cksl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 15, decimal: 5}, { type: 'base_number', range: '+' }]},
	{ label: '成交币制', name: 'hbzmDm', type: 'AutoComplete', showType: '3', 'allowClear': true, codeTable: 'url_gy_hbhl:01', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 3]}], eventOnBlur: 'hbhlDm', eventOnFocus: 'hbhlDm' },
	{ label: '成交币制名称', name: 'cjbz', type: 'Input', disabled: true},
	{ label: '成交总价', name: 'cjzj', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+-' }]},
	{ label: '美元离岸价', name: 'mylaj', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+-' }], eventOnBlur: 'mylaj' },
	{ label: '美元汇率', name: 'myhl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 10, decimal: 5}, { type: 'base_number', range: '+' }], eventOnBlur: 'myhl' },
	{ label: '人民币离岸价', name: 'rmblaj', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+-' }]},
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
  upload: true,  // 是否显示导入按钮，默认关闭
  ckts_sum: false, // 是否显示小计按钮，默认关闭
  ckts_order: 5, // 是否显示序号重排(默认规则：选择排序)按钮，默认关闭
  batchEdit: true,
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                       	// 是否显示编辑链接，默认关闭
  delete: false,                     	// 是否显示删除链接，默认关闭
};

unitConfig.customer_toolbar = [];
unitConfig.handle_columns = [];
export default unitConfig;

