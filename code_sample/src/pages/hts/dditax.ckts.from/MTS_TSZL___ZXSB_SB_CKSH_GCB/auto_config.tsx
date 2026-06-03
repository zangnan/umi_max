/**
 * title: 出口收汇
 * serviceKey: TSZL_ZXSB_SB_CKSH_G
 * unitId: mts_tszl_zxsb_sb_cksh_gcb
*/

const unitConfig: any = {};

unitConfig.unit_key = 'TSZL_ZXSB_SB_CKSH_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'mts_tszl_zxsb_sb_cksh_gcb'; // 页面id
unitConfig.grid_title = '出口业务收汇表'; // 列表标题，可选
unitConfig.form_title = '出口业务收汇表'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = 'lcswsxDm=LCSXA081039001'; // 配置常量
unitConfig.export_key1 = 'SAAS_TSSB_MXCJ_CKSH_WM_DC'; // 采集导出key
unitConfig.export_key2 = 'SAAS_SJGL_SWFKCX_MTS_CKSH_DC'; // 统计导出key
unitConfig.export_key3 = 'SAAS_TSSB_MTS_SBMXCK_CKSH_DC'; // 申报结果查询导出key
unitConfig.form_api_delete=`${API_URL_BASE}/yw/tssb/cksh/deleteCksh`;
unitConfig.form_api_save=`${API_URL_BASE}/yw/tssb/cksh/saveCksh`;
unitConfig.form_api_save_upload = `${API_URL_BASE}/yw/tssb/cksh/saveCksh`;
unitConfig.form_save_add_flag = true;	// 表单保存并添加开关

// 配置列表列
unitConfig.grid_columns = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '申报批次', dataIndex: 'sbpc', align: 'left', width: 90, fixed: 'left' },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '出口货物报关单号', dataIndex: 'ckbgdh', align: 'left', width: 180},
	{ title: '代理出口货物证明号', dataIndex: 'dlckhwzmhm', align: 'left', width: 220},
	{ title: '出口发票号', dataIndex: 'ckfph', align: 'left', width: 150, ellipsis: true},
	{ title: '出口销售币种代码', dataIndex: 'cjhbzmDm', align: 'left', width: 150},
	{ title: '出口销售币种名称', dataIndex: 'cjhbmc', align: 'left', width: 180, ellipsis: true},
	{ title: '出口销售金额', dataIndex: 'cjzj', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '出口销售币种汇率', dataIndex: 'cjhbhl', align: 'right', width: 240, render: { type: 'number', format: '0,0.00000' } },
	{ title: '出口销售人民币金额', dataIndex: 'ckxsermb', align: 'right', width: 160, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '收汇日期', dataIndex: 'ckshrq', align: 'left', width: 120, render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '收汇凭证号', dataIndex: 'pzhm2', align: 'left', width: 180},
	{ title: '出口收汇币种代码', dataIndex: 'ckshhbzmDm', align: 'left', width: 130},
	{ title: '出口收汇币种名称', dataIndex: 'ckshbzmc', align: 'left', width: 180, ellipsis: true},
	{ title: '凭证总金额', dataIndex: 'yshqkpzzje', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '出口货物收汇金额', dataIndex: 'ckshje', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '出口收汇人民币金额', dataIndex: 'ckshjermb', align: 'right', width: 160, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '付汇人', dataIndex: 'fhr', align: 'left', width: 150},
	{ title: '非进口商付汇原因', dataIndex: 'fjksfhyy', align: 'left', width: 180, ellipsis: true},
	{ title: '视同收汇原因代码', dataIndex: 'stshqkyy', align: 'left', width: 180, ellipsis: true},
	{ title: '视同收汇原因说明', dataIndex: 'stshqkyyjtsm', align: 'left', width: 180, ellipsis: true},
	{ title: '视同收汇举证材料种类代码', dataIndex: 'stshqkjzclzl', align: 'left', width: 305, ellipsis: true},
	{ title: '视同收汇人民币金额', dataIndex: 'stshqkzrmbje', align: 'right', width: 160, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '合同约定全部收汇最终日期', dataIndex: 'stshqkhtydqbshzzrq', align: 'left', width: 220, render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '出口合同号', dataIndex: 'stshqkckhth', align: 'left', width: 150, ellipsis: true},
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '申报批次', dataIndex: 'sbpc', align: 'left', width: 90, fixed: 'left' },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '出口货物报关单号', dataIndex: 'ckbgdh', align: 'left', width: 180},
	{ title: '代理出口货物证明号', dataIndex: 'dlckhwzmhm', align: 'left', width: 220},
	{ title: '出口发票号', dataIndex: 'ckfph', align: 'left', width: 150, ellipsis: true},
	{ title: '出口销售币种代码', dataIndex: 'cjhbzmDm', align: 'left', width: 150},
	{ title: '出口销售币种名称', dataIndex: 'cjhbmc', align: 'left', width: 180, ellipsis: true},
	{ title: '出口销售金额', dataIndex: 'cjzj', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '出口销售币种汇率', dataIndex: 'cjhbhl', align: 'right', width: 240, render: { type: 'number', format: '0,0.00000' } },
	{ title: '出口销售人民币金额', dataIndex: 'ckxsermb', align: 'right', width: 160, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '收汇日期', dataIndex: 'ckshrq', align: 'left', width: 120, render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '收汇凭证号', dataIndex: 'pzhm2', align: 'left', width: 180},
	{ title: '出口收汇币种代码', dataIndex: 'ckshhbzmDm', align: 'left', width: 130},
	{ title: '出口收汇币种名称', dataIndex: 'ckshbzmc', align: 'left', width: 180, ellipsis: true},
	{ title: '凭证总金额', dataIndex: 'yshqkpzzje', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '出口货物收汇金额', dataIndex: 'ckshje', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '出口收汇人民币金额', dataIndex: 'ckshjermb', align: 'right', width: 160, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '付汇人', dataIndex: 'fhr', align: 'left', width: 150},
	{ title: '非进口商付汇原因', dataIndex: 'fjksfhyy', align: 'left', width: 180, ellipsis: true},
	{ title: '视同收汇原因代码', dataIndex: 'stshqkyy', align: 'left', width: 180, ellipsis: true},
	{ title: '视同收汇原因说明', dataIndex: 'stshqkyyjtsm', align: 'left', width: 180, ellipsis: true},
	{ title: '视同收汇举证材料种类代码', dataIndex: 'stshqkjzclzl', align: 'left', width: 305, ellipsis: true},
	{ title: '视同收汇人民币金额', dataIndex: 'stshqkzrmbje', align: 'right', width: 160, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '合同约定全部收汇最终日期', dataIndex: 'stshqkhtydqbshzzrq', align: 'left', width: 220, render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '出口合同号', dataIndex: 'stshqkckhth', align: 'left', width: 150, ellipsis: true},
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'pzhm2', label: '收汇凭证号', type: 'Input' },
	{ name: 'ckfph', label: '出口发票号', type: 'Input' },
	{ name: 'dlckhwzmhm', label: '代理出口货物证明号', type: 'Input' },
	{ name: 'ckbgdh', label: '出口货物报关单号', type: 'Input' },
	{ name: 'ssq', label: '所属期', type: 'Input' },
];

// 表单项
unitConfig.form_items = [
	{ label: 'ID', name: 'uuid', type: 'Hidden' },
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle' },
	{ label: '所属期', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}, { func: 'ssq02' }, { func: 'ssq01' }]},
	{ label: '批次', name: 'sbpc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbpc02' }], eventOnBlur: 'sbpc' },
	{ label: '序号', name: 'sbxh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbxh02' }], eventOnBlur: 'sbxh' },
	{ label: '出口信息', name: 'ckxx', type: 'GroupTitle' },
	{ label: '出口货物报关单号', name: 'ckbgdh', type: 'Input', rules: [{ type: 'base_string', range: [0, 21]}, { type: 'base_type_number_english' }, { func: 'ckbgdh03' }], eventOnBlur: 'ckbgdh' }, // eventOnChange: 'ckbgdh'
	{ label: '代理出口货物证明号', name: 'dlckhwzmhm', type: 'Input', rules: [{ type: 'base_string', range: [0, 20]}, { type: 'base_type_number_english' }]},
	{ label: '出口发票号码', name: 'ckfph', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 30]}]},
	{ label: '出口销售币种代码', name: 'cjhbzmDm', type: 'AutoComplete', showType: '3', 'allowClear': true, codeTable: ['url_gy_hbhl', '01'], rules: [{ type: 'base_required' }], eventOnBlur: 'hbhlDm', eventOnFocus: 'hbhlDm' },
	{ label: '出口销售币种名称', name: 'cjhbzmmc', type: 'Input', readOnly: true},
	{ label: '出口销售金额', name: 'cjzj', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+' }], eventOnBlur: 'cjzj' },
	{ label: '出口销售币种汇率', name: 'cjhbhl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', length: 10, decimal: 5}, { type: 'base_number', range: '+' }], eventOnBlur: 'cjhbhl' },
	{ label: '出口销售人民币金额', name: 'ckxsermb', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+' }]},
	{ label: '收汇信息', name: 'shxx', type: 'GroupTitle' },
	{ label: '收汇日期', name: 'ckshrq', type: 'DatePicker', 'allowClear': true, format: 'yyyy-MM-DD', rules: [{ type: 'base_date', format: 'yyyyMMdd' }], eventOnChange: 'ckshrq' },
	{ label: '收汇凭证号', name: 'pzhm2', type: 'Input', rules: [{ type: 'base_string', range: [0, 40]}]},
	{ label: '出口收汇币种代码', name: 'ckshhbzmDm', type: 'AutoComplete', showType: '3', 'allowClear': true, codeTable: ['url_gy_hbhl', '01'], eventOnBlur: 'hbhlDm', eventOnFocus: 'hbhlDm' },
	{ label: '出口收汇币种名称', name: 'ckshhbzmmc', type: 'Input', readOnly: true},
	{ label: '凭证总金额', name: 'yshqkpzzje', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_number', length: 14, decimal: 2}]},
	{ label: '出口货物收汇金额', name: 'ckshje', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_number', length: 14, decimal: 2}], eventOnBlur: 'ckshje' },
	{ label: '出口货物收汇币种汇率', name: 'ckshhbhl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_number', length: 10, decimal: 5}], eventOnBlur: 'ckshhbhl' },
	{ label: '出口收汇人民币金额', name: 'ckshjermb', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_number', length: 14, decimal: 2}]},
	{ label: '付汇人', name: 'fhr', type: 'Input', rules: [{ type: 'base_string', range: [0, 200]}]},
	{ label: '非进口商付汇原因', name: 'fjksfhyy', type: 'Input', rules: [{ type: 'base_string', range: [0, 50]}]},
	{ label: '视同收汇', name: 'stsh', type: 'GroupTitle' },
	{ label: '视同收汇原因代码', name: 'stshqkyy', type: 'Select', showType: '4', 'showSearch': true, 'mode': 'multiple', eventOnChange: 'stshqkyy', 'allowClear': true, codeTable: ['code_cs_ckts_stshqkyy', '01'], eventOnBlur: 'stshqkyy' },
	{ label: '视同收汇原因说明', name: 'stshqkyyjtsm', type: 'Input', readOnly: true},
	{ label: '视同收汇举证材料种类代码', name: 'stshqkjzclzl', type: 'Select', showType: '4', 'showSearch': true, 'mode': 'multiple', eventOnChange: 'stshqkjzclzl', 'allowClear': true, codeTable: ['code_cs_ckts_stshqkjzclzl', '01']},
	{ label: '视同收汇人民币金额', name: 'stshqkzrmbje', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_number', length: 14, decimal: 2}]},
	{ label: '合同约定全部收汇最终日期', name: 'stshqkhtydqbshzzrq', type: 'DatePicker', 'allowClear': true, format: 'yyyy-MM-DD', rules: [{ type: 'base_date', format: 'yyyyMMdd' }]},
	{ label: '出口合同号', name: 'stshqkckhth', type: 'Input', rules: [{ type: 'base_string', range: [0, 60]}]},
	{ label: '其他信息', name: 'qtxx', type: 'GroupTitle' },
	{ label: '备注', name: 'bz', type: 'TextArea', autoSize: { minRows: 2, maxRows: 2}, layout: { label: { xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3}, formItem: { xs: 16, sm: 16, md: 16, lg: 19, xl: 21, xxl: 21 } }, rules: [{ type: 'base_string', range: [0, 200]}, { func: 'bz02' }]},
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
  ckts_order: 3, // 是否显示序号重排(默认规则：选择排序)按钮，默认关闭
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                       	// 是否显示编辑链接，默认关闭
  delete: false,                     	// 是否显示删除链接，默认关闭
};

unitConfig.costomer_toobar = [
	{ name: '收汇提取', key: 'mtsShTq', func: 'mtsShTq' },
	{ name: '模板下载', key: 'mtsShMbxz', func: 'mtsShMbxz' },
	{ name: '导入', key: 'mtsShDr', func: 'mtsShDr' },
  ];

export default unitConfig;

