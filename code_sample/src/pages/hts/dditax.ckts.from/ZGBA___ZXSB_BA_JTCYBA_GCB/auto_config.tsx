/**
 * title: 集团公司成员企业备案
 * serviceKey: ZGBA_ZXSB_BA_JTCYBA_G
 * unitId: zgba_zxsb_ba_jtcyba_gcb
*/

const unitConfig: any = {};

unitConfig.unit_key = 'ZGBA_ZXSB_BA_JTCYBA_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'zgba_zxsb_ba_jtcyba_gcb'; // 页面id
unitConfig.grid_title = '集团公司成员企业备案'; // 列表标题，可选
unitConfig.form_title = '集团公司成员企业备案'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量
unitConfig.export_key1 = ''; // 采集导出key
unitConfig.export_key2 = ''; // 统计导出key
unitConfig.export_key3 = ''; // 申报结果查询导出key

// 配置列表列
unitConfig.grid_columns = [
	{ title: '申请日期', dataIndex: 'tbrq1', align: 'left', width: 120, fixed: 'left', render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '企业海关代码', dataIndex: 'cyhgqydm', align: 'left', width: 115},
	{ title: '纳税人名称', dataIndex: 'cynsrmc', align: 'left', width: 180, ellipsis: true},
	{ title: '纳税人识别号', dataIndex: 'cynsrsbh', align: 'left', width: 200},
	{ title: '所在地', dataIndex: 'cyzcszd', align: 'left', width: 180},
	{ title: '法定代表人', dataIndex: 'cyfddbrxm', align: 'left', width: 140},
	{ title: '地位', dataIndex: 'qyzjtgsdwDm', align: 'left', width: 80, codeTable: ['code_dm_ckts_qyzjtgsdw',  '01'] },
	{ title: '持股比例', dataIndex: 'cgbl', align: 'right', width: 125, render: { type: 'number', format: '0,0.0000 0000' } },
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '申请日期', dataIndex: 'tbrq1', align: 'left', width: 120, fixed: 'left', render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '纳税人名称', dataIndex: 'cynsrmc', align: 'left', width: 180, ellipsis: true},
	{ title: '纳税人识别号', dataIndex: 'cynsrsbh', align: 'left', width: 200},
	{ title: '所在地', dataIndex: 'cyzcszd', align: 'left', width: 180},
	{ title: '法定代表人', dataIndex: 'cyfddbrxm', align: 'left', width: 140},
	{ title: '地位', dataIndex: 'qyzjtgsdwDm', align: 'left', width: 80, codeTable: ['code_dm_ckts_qyzjtgsdw',  '01'] },
	{ title: '持股比例', dataIndex: 'cgbl', align: 'right', width: 125, render: { type: 'number', format: '0,0.0000 0000' } },
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
	{ title: '海关企业代码', dataIndex: 'hgqyDm', align: 'left', width: 120},
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'cynsrsbh', label: '纳税人识别号', type: 'Input' },
	{ name: 'cyhgqydm', label: '企业海关代码', type: 'Input' },
	{ name: 'tbrq1', label: '申请日期', type: 'DatePicker', 'allowClear': true, range: true},
];

// 表单项
unitConfig.form_items = [
	{ label: 'sbId', name: 'uuid', type: 'Hidden' },
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle' },
	{ label: '申请日期', name: 'tbrq1', type: 'DatePicker', 'allowClear': true, format: 'yyyy-MM-DD', rules: [{ type: 'base_required' }, { type: 'base_date', format: 'yyyyMMdd' }, { func: 'tbrq02' }]},
	{ label: '申报序号', name: 'sbxh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbxh02' }], eventOnBlur: 'sbxh' },
	{ label: '企业信息', name: 'qyxx', type: 'GroupTitle' },
	{ label: '企业海关代码', name: 'cyhgqydm', type: 'Input', rules: [{ type: 'base_string', range: [0, 18]}, { type: 'base_type_number_english' }, { func: 'cyhgqydm01' }, { func: 'cyhgqydm02' }]},
	{ label: '纳税人识别号', name: 'cynsrsbh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number_english' }, { type: 'base_string', range: ['15', '20']}, { func: 'cynsrsbh01' }]},
	{ label: '纳税人名称', name: 'cynsrmc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 80]}, { func: 'cynsrmc01' }]},
	{ label: '所在地', name: 'cyzcszd', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 60]}]},
	{ label: '法定代表人（负责人）', name: 'cyfddbrxm', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 80]}]},
	{ label: '在集团公司中的地位（总部或控股企业）', name: 'qyzjtgsdwDm', type: 'Select', 'allowClear': true, codeTable: ['code_dm_ckts_qyzjtgsdw', '01'], rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 1]}, { func: 'qyzjtgsdwDm02' }, { func: 'qyzjtgsdwDm01' }], eventOnChange: 'qyzjtgsdwDm' },
	{ label: '集团公司总部持股比例（%）', name: 'cgbl', type: 'InputNumber', format: '0,0.0000', rules: [{ type: 'base_number', length: 11, decimal: 8}, { func: 'cgbl01' }, { func: 'cgbl02' }]},
	{ label: '其他信息', name: 'qtxx', type: 'GroupTitle' },
	{ label: '备注', name: 'bz', type: 'TextArea', autoSize: { minRows: 2, maxRows: 2}, layout: { label: { xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3}, formItem: { xs: 16, sm: 16, md: 16, lg: 19, xl: 21, xxl: 21 } }, rules: [{ type: 'base_string', range: [0, 200]}]},
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
  ckts_order: 2, // 是否显示序号重排(默认规则：选择排序)按钮，默认关闭
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                       	// 是否显示编辑链接，默认关闭
  delete: false,                     	// 是否显示删除链接，默认关闭
};

export default unitConfig;

