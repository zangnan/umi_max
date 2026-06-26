import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 来料加工免税证明
 * serviceKey: ZMKJ_ZXSB_ZM_LLJG_G
 * unitId: zmkj_zxsb_zm_lljg_gcb
*/

const unitConfig: any = {};

unitConfig.module_key = 'ZMKJ_ZXSB_ZM_LLJG_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'zmkj_zxsb_zm_lljg_gcb'; // 页面id
unitConfig.grid_title = '来料加工免税证明'; // 列表标题，可选
unitConfig.form_title = '来料加工免税证明'; // 表单标题，可选
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
  { title: '受托方纳税人识别号（统一社会信用代码）', dataIndex: 'stfnsrsbh', align: 'left', width: 280, ellipsis: true},
  { title: '受托方名称', dataIndex: 'stfmc', align: 'left', width: 180, ellipsis: true},
  { title: '来料加工手（账）册号', dataIndex: 'lljgszch', align: 'left', width: 215},
  { title: '加工费发票号码（已开具发票）', dataIndex: 'jgffphm', align: 'left', width: 240},
  { title: '开票日期', dataIndex: 'kprq', align: 'left', width: 120, render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: '加工的货物名称（已开具发票）', dataIndex: 'ykfphwmc', align: 'left', width: 240, ellipsis: true},
  { title: '单位', dataIndex: 'ykfphwdw', align: 'left', width: 90, ellipsis: true},
  { title: '数量', dataIndex: 'ykfphwsl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
  { title: '加工费金额', dataIndex: 'jgfje', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
  { title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
  { title: '申报批次', dataIndex: 'sbpc', align: 'left', width: 90, fixed: 'left' },
  /*{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },*/
  { title: '编号', dataIndex: 'sbbh1', align: 'left', width: 100},
  { title: '序号', dataIndex: 'xh4', align: 'left', width: 60},
  { title: '受托方纳税人识别号（统一社会信用代码）', dataIndex: 'stfnsrsbh', align: 'left', width: 280, ellipsis: true},
  { title: '受托方名称', dataIndex: 'stfmc', align: 'left', width: 180, ellipsis: true},
  { title: '来料加工手（账）册号', dataIndex: 'lljgszch', align: 'left', width: 215},
  { title: '加工费发票号码（已开具发票）', dataIndex: 'jgffphm', align: 'left', width: 175},
  { title: '开票日期', dataIndex: 'kprq', align: 'left', width: 120, render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: '加工的货物名称（已开具发票）', dataIndex: 'ykfphwmc', align: 'left', width: 240, ellipsis: true},
  { title: '单位', dataIndex: 'ykfphwdw', align: 'left', width: 90, ellipsis: true},
  { title: '数量', dataIndex: 'ykfphwsl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
  { title: '加工费金额', dataIndex: 'jgfje', align: 'right', width: 140, sum: true, render: { type: 'number', format: '0,0.00' } },
  { title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
  { title: '来料加工免税证明编号', dataIndex: 'lljgmszmbh', align: 'left', width: 260},
];

// 筛选项
unitConfig.filter_items = [
  { name: 'lljgszch', label: '来料加工手（账）册号', type: 'Input' },
  { name: 'sbbh1', label: '编号', type: 'Input' },
  { name: 'sbpc', label: '申报批次', type: 'Input' },
  { name: 'ssq', label: '所属期', type: 'Input' },
];

// 表单项
unitConfig.form_items = [
  { label: 'ID', name: 'uuid', type: 'Hidden' },
  { label: '进口单价', name: 'jkdj', type: 'Hidden' },
  { label: '成材率', name: 'ccl', type: 'Hidden' },
  { label: '出口数量', name: 'cksl', type: 'Hidden' },
  { label: '单价', name: 'dj', type: 'Hidden' },
  { label: '购货金额', name: 'amt', type: 'Hidden' },
  { label: '操作日期', name: 'lrrq', type: 'Hidden' },
  { label: '基本信息', name: 'jbxx', type: 'GroupTitle' },
  { label: '所属期', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }, { type: 'base_string', range: [0, 6]}, { func: 'ssq01' }], eventOnChange: 'ssq' },
  { label: '申报批次', name: 'sbpc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbpc02' }], eventOnBlur: 'sbpc' },
  /*{ label: '序号', name: 'sbxh', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { func: 'sbxh02' }], eventOnBlur: 'sbxh' },*/
  { label: '编号', name: 'sbbh1', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { type: 'base_string', length: '10' }, { func: 'sbbh101' }, { func: 'sbbh102' }]},
  { label: '序号', name: 'xh4', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_type_number' }, { type: 'base_string', range: [0, 2]}, { func: 'xh401' }], eventOnBlur: 'xh4' },
  { label: '证明信息', name: 'zmxx', type: 'GroupTitle' },
  { label: '受托方纳税人识别号（统一社会信用代码）', name: 'stfnsrsbh', type: 'AutoComplete', showType: '2', codeTable: 'url_gy_qywtf:01', rules: [{ type: 'base_required' }, { type: 'base_type_number_english' }, { type: 'base_string', range: ['15', '20']}, { func: 'stfnsrsbh01' }], eventOnBlur: 'stfnsrsbh' },
  { label: '受托方名称', name: 'stfmc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 80]}, { func: 'stfmc01' }]},
  { label: '来料加工手（账）册号', name: 'lljgszch', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 20]}]},
  { label: '加工费发票号码（已开具发票）', name: 'jgffphm', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 20]}]},
  { label: '开票日期', name: 'kprq', type: 'DatePicker', 'allowClear': true, format: 'YYYY-MM-DD', rules: [{ type: 'base_required'},{ type: 'base_date', format: 'yyyyMMdd'}]},
  { label: '加工的货物名称（已开具发票）', name: 'ykfphwmc', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 100]}]},
  { label: '单位（已开具发票）', name: 'ykfphwdw', type: 'Input', rules: [{ type: 'base_required' }, { type: 'base_string', range: [0, 75]}]},
  { label: '数量（已开具发票）', name: 'ykfphwsl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_required' }, { type: 'base_number', range: '+-' }, { type: 'base_number', length: 15, decimal: 5}]},
  { label: '加工费金额（已开具发票）', name: 'jgfje', type: 'InputNumber', format: '0,0.00', rules: [{ type: 'base_required' }, { type: 'base_number', range: '+-' }, { type: 'base_number', length: 14, decimal: 2}]},
  { label: '其他信息', name: 'qtxx', type: 'GroupTitle' },
  { label: '备注', name: 'bz', type: 'TextArea', rules: [{ type: 'base_string', range: [0, 200]}], autoSize: { minRows: 3, maxRows: 3 }, layout: CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW},
  { label: '已出具证明编号', name: 'lljgmszmbh', type: 'Hidden' },
  { label: '申报标志', name: 'sbztDm', type: 'Hidden' },
  { label: '审核标志', name: 'shbz', type: 'Hidden' },
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

unitConfig.customer_toolbar = [];
unitConfig.handle_columns = [];
export default unitConfig;

