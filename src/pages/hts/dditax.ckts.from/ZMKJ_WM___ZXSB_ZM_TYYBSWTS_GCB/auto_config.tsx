import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 出口货物已补税/未退税证明
 * serviceKey: ZMKJ_ZXSB_ZM_TYYBSWTS_G
 * unitId: zmkj_wm_zxsb_zm_tyybswts_gcb
*/

const unitConfig: any = {};

unitConfig.module_key = 'ZMKJ_ZXSB_ZM_TYYBSWTS_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'zmkj_wm_zxsb_zm_tyybswts_gcb'; // 页面id
unitConfig.grid_title = '出口货物已补税/未退税证明'; // 列表标题，可选
unitConfig.form_title = '出口货物已补税/未退税证明'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量
unitConfig.export_key1 = 'SAAS_QTTMS_ZMSB_TYYBSWTS_DC'; // 采集导出key
unitConfig.export_key2 = 'SAAS_SJGL_SWFKCX_ZMYW_CKHWYBSWTSZM_WM_DC'; // 统计导出key
unitConfig.export_key3 = 'SAAS_QTTMS_ZMSB_SBMXCK_CKHWYBSWTSZM_WM_DC'; // 申报结果查询导出key

// 配置列表列
unitConfig.grid_columns = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '申报批次', dataIndex: 'sbpc', align: 'left', width: 90, fixed: 'left' },
	{ title: '编号', dataIndex: 'sbbh1', align: 'left', width: 100},
	{ title: '序号', dataIndex: 'xh4', align: 'left', width: 60},
	{ title: '口岸代码', dataIndex: 'hggqkaDm', align: 'left', width: 150},
	{ title: '口岸名称', dataIndex: 'hggqkajc', align: 'left', width: 180, ellipsis: true},
	{ title: '出口货物报关单号/代理出口货物证明号', dataIndex: 'ckbgdh', align: 'left', width: 300},
	{ title: '购进凭证号码', dataIndex: 'jhpzh', align: 'left', width: 150, ellipsis: true},
	{ title: '税种', dataIndex: 'sz', align: 'left', width: 160},
	{ title: '业务类型', dataIndex: 'tyybswtstylxDm', align: 'left', width: 120},
	{ title: '业务类型名称', dataIndex: 'ywlxmc', align: 'left', width: 180, ellipsis: true},
	{ title: '退（免）税状态', dataIndex: 'tmsztbz', align: 'left', width: 150},
	{ title: '原退（免）税额', dataIndex: 'ysbmdtse', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '退运数量', dataIndex: 'tysl', align: 'right', width: 145, sum: true, render: { type: 'number', format: '0,0.00000' } },
  { title: '出口商品代码', dataIndex: 'ckspDm', align: 'left', width: 120},
	{ title: '计量单位', dataIndex: 'jldw', align: 'left', width: 90},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '申报批次', dataIndex: 'sbpc', align: 'left', width: 90, fixed: 'left' },
	{ title: '编号', dataIndex: 'sbbh1', align: 'left', width: 100},
	{ title: '序号', dataIndex: 'xh4', align: 'left', width: 60},
	{ title: '口岸代码', dataIndex: 'hggqkaDm', align: 'left', width: 150},
	{ title: '口岸名称', dataIndex: 'hggqkajc', align: 'left', width: 180, ellipsis: true},
	{ title: '出口货物报关单号/代理出口货物证明号', dataIndex: 'ckbgdh', align: 'left', width: 180},
	{ title: '购进凭证号码', dataIndex: 'jhpzh', align: 'left', width: 300, ellipsis: true},
	{ title: '税种', dataIndex: 'sz', align: 'left', width: 160},
	{ title: '业务类型', dataIndex: 'tyybswtstylxDm', align: 'left', width: 120},
	{ title: '业务类型名称', dataIndex: 'ywlxmc', align: 'left', width: 180, ellipsis: true},
	{ title: '退（免）税状态', dataIndex: 'tmsztbz', align: 'left', width: 150},
	{ title: '原退（免）税额', dataIndex: 'ysbmdtse', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
	{ title: '退运数量', dataIndex: 'tysl', align: 'right', width: 145, sum: true, render: { type: 'number', format: '0,0.00000' } },
  { title: '出口商品代码', dataIndex: 'ckspDm', align: 'left', width: 120},
	{ title: '计量单位', dataIndex: 'jldw', align: 'left', width: 90},
	{ title: '出口退税证明编号', dataIndex: 'cktszmbh', align: 'left', width: 200},
	{ title: '核实结果', dataIndex: 'hsjg', align: 'left', width: 120},
	{ title: '开具日期', dataIndex: 'kjrq', align: 'left', width: 120, render: { type: 'date', format: 'YYYY-MM-DD' } },
];

// 筛选项
unitConfig.filter_items = [
  { name: 'ssq', label: '所属期', type: 'Input' },
  { name: 'sbpc', label: '申报批次', type: 'Input' },
  { name: 'ckbgdh', label: '出口货物报关单号/代理出口货物证明号', type: 'Input' },
  { name: 'jhpzh', label: '购进凭证号码', type: 'Input' },
  { name: 'tyybswtstylxDm', label: '业务类型', type: 'Select', 'allowClear': true, codeTable: 'code_dm_ckts_tyybswtstylx:01' },
  { name: 'cktszmbh', label: '出口退税证明编号', type: 'Input' },
  { name: 'hggqkaDm', label: '口岸代码', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: 'code_dm_gy_hggqka:01' },
];

// 表单项
unitConfig.form_items = [
	{ label: 'UUID', name: 'uuid', type: 'Hidden' },
	{ label: '基本信息', name: 'jbxx', type: 'GroupTitle' },
	{ label: '所属期', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}, { func: 'ssq01' }], eventOnChange: 'ssq' },
	{ label: '申报批次', name: 'sbpc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbpc02' }], eventOnBlur: 'sbpc' },
	{ label: '编号', name: 'sbbh1', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { type: 'base_string', length: '10' }, { func: 'sbbh101' }, { func: 'sbbh102' }]},
  { label: '序号', name: 'xh4', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { type: 'base_string', range: [0, 2]}, { func: 'xh401' }], eventOnBlur: 'xh4' },
	{ label: '出口信息', name: 'ckxx', type: 'GroupTitle' },
	{ label: '口岸代码', name: 'hggqkaDm', type: 'Select', showType: '3', 'showSearch': true, 'allowClear': true, codeTable: 'code_dm_gy_hggqka:01', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 4]}], eventOnChange: 'hggqkaDm' },
	{ label: '口岸名称', name: 'hggqkamc', type: 'Input', disabled: true},
	{ label: '出口货物报关单号/代理出口货物证明号', name: 'ckbgdh', type: 'Input', rules: [{ type: 'base_type_number_english' }, { type: 'base_required' }, { type: 'base_string', range: [0, 21]}, { func: 'ckbgdh04' }], eventOnChange: 'ckbgdh' },
  { label: '出口日期', name: 'ckrq1', type: 'Hidden' },
  { label: '税种', name: 'sz', type: 'Select', 'allowClear': true, codeTable: 'code_static_tmsjhmxsz_dm:01', rules: [{ type: 'base_required' }, { type: 'base_string', length: '1' }, { type: 'base_string', range: [0, 1]}, { func: 'sz01' }]},
	{ label: '业务类型', name: 'tyybswtstylxDm', type: 'Select', 'allowClear': true, codeTable: 'code_dm_ckts_tyybswtstylx:01', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 1]}], eventOnChange: 'tyybswtstylxDm' },
	{ label: '退（免）税状态', name: 'tmsztbz', type: 'Select', 'allowClear': true, codeTable: 'code_static_tmsztbz_dm:02', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 50]}], eventOnChange: 'tmsztbz' },
	{ label: '原退（免）税额', name: 'ysbmdtse', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+-' }, { func: 'ysbmdtse' }]},
	{ label: '购进凭证号码', name: 'jhpzh', type: 'Input', rules: [{ type: 'base_string', range: [0, 30]}, { func: 'jhpzh' }, { func: 'jhpzh03' }]},
	{ label: '退运信息', name: 'tyxx', type: 'GroupTitle' },
	{ label: '退运数量', name: 'tysl', type: 'InputNumber', format: '0,0.00000', rules: [{ func: 'tysl01' }, { type: 'base_number', length: 15, decimal: 5}]},
  { label: '出口商品代码', name: 'ckspDm', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { type: 'base_string', range: [0, 12]}], eventOnBlur: 'ckspDm' },
	{ label: '计量单位', name: 'jldw', type: 'Input', rules: [{ type: 'base_string', range: [0, 150]}, { type: 'base_required' }]},
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
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                       	// 是否显示编辑链接，默认关闭
  delete: false,                     	// 是否显示删除链接，默认关闭
};

unitConfig.customer_toolbar = [];
unitConfig.handle_columns = [];
export default unitConfig;

