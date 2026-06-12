import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 视同自产清单
 * serviceKey: MDT_ZXSB_SB_MDT_STZC_G
 * unitId: mdt_zxsb_sb_mdt_stzc_gcb
*/

const unitConfig: any = {};

unitConfig.module_key = 'MDT_ZXSB_SB_MDT_STZC_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'mdt_zxsb_sb_mdt_stzc_gcb'; // 页面id
unitConfig.grid_title = '视同自产清单'; // 列表标题，可选
unitConfig.form_title = '视同自产清单'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量
unitConfig.export_key1 = 'SAAS_TSSB_MXCJ_STZC_DC'; // 采集导出key
unitConfig.export_key2 = 'SAAS_SJGL_SWFKCX_MDT_STZCJHMXQD_DC'; // 统计导出key
unitConfig.export_key3 = 'SAAS_TSSB_MDT_SBMXCK_STZCJHMXQD_DC'; // 申报结果查询导出key

// 配置列表列
unitConfig.grid_columns = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90},
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80},
	{ title: '免抵退税申报明细序号', dataIndex: 'mxsbxh', align: 'left', width: 160},
	{ title: '进货凭证号', dataIndex: 'jhpzh', align: 'left', width: 150, ellipsis: true},
	{ title: '销方纳税人识别号', dataIndex: 'xhfnsrsbh', align: 'left', width: 200},
	{ title: '销方纳税人名称', dataIndex: 'xhfnsrmc', align: 'left', width: 180, ellipsis: true},
	{ title: '开票日期', dataIndex: 'kprq', align: 'left', width: 120, render: { type: 'date', format: 'YYYY-MM-DD' } },
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90},
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80},
	{ title: '免抵退税申报明细序号', dataIndex: 'mxsbxh', align: 'left', width: 160},
	{ title: '进货凭证号', dataIndex: 'jhpzh', align: 'left', width: 150, ellipsis: true},
	{ title: '销方纳税人识别号', dataIndex: 'xhfnsrsbh', align: 'left', width: 200},
	{ title: '销方纳税人名称', dataIndex: 'xhfnsrmc', align: 'left', width: 180, ellipsis: true},
	{ title: '开票日期', dataIndex: 'kprq', align: 'left', width: 120, render: { type: 'date', format: 'YYYY-MM-DD' } },
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'kprq', label: '开票日期', type: 'DatePicker', 'allowClear': true, range: true},
	{ name: 'xhfnsrsbh', label: '销方纳税人识别号', type: 'Input' },
	{ name: 'ssq', label: '所属期', type: 'Input' },
];

// 表单项
unitConfig.form_items = [
	{ label: 'ID', name: 'uuid', type: 'Hidden' },
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle' },
	{ label: '所属期', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'YYYYMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}, { func: 'ssq02' }]},
	{ label: '序号', name: 'sbxh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbxh02' }], eventOnBlur: 'sbxh' },
	{ label: '免抵退税申报明细序号', name: 'mxsbxh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { type: 'base_string', range: [0, 8]}, { func: 'sbxh02' }], eventOnBlur: 'mxsbxh' },
	{ label: '发票信息', name: 'fpxx', type: 'GroupTitle' },
	{ label: '进货凭证号', name: 'jhpzh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 40]}]},
	{ label: '销方纳税人识别号', name: 'xhfnsrsbh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number_english' }, { type: 'base_string', range: ['15', '20']}]},
	{ label: '销方纳税人名称', name: 'xhfnsrmc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 80]}]},
	{ label: '开票日期', name: 'kprq', type: 'DatePicker', 'allowClear': true, format: 'YYYY-MM-DD', rules: [{ type: 'base_required' }, { type: 'base_date', format: 'YYYYMMdd' }]},
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

