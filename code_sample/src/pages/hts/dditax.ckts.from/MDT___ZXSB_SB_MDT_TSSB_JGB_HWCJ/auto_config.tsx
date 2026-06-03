/**
 * title: 货物冲减
 * serviceKey: MDT_ZXSB_SB_MDT_TSSB_J
 * unitId: mdt_zxsb_sb_mdt_tssb_jgb_hwcj
*/

const unitConfig: any = {};

unitConfig.unit_key = 'MDT_ZXSB_SB_MDT_TSSB_J'; // 业务单元key，对应后端接口
unitConfig.page_id = 'mdt_zxsb_sb_mdt_tssb_jgb_hwcj'; // 页面id
unitConfig.grid_title = '货物冲减'; // 列表标题，可选
unitConfig.form_title = '货物冲减'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = '按钮功能，货物冲减'; // 配置常量
unitConfig.export_key1 = ''; // 采集导出key
unitConfig.export_key2 = ''; // 统计导出key
unitConfig.export_key3 = ''; // 申报结果查询导出key

// 配置列表列
unitConfig.grid_columns = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '出口发票号', dataIndex: 'ckfph', align: 'left', width: 150, ellipsis: true},
	{ title: '报关单号', dataIndex: 'ckbgdh', align: 'left', width: 180},
	{ title: '出口日期', dataIndex: 'ckrq1', align: 'left', width: 120, render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '代理证明号', dataIndex: 'dlckhwzmhm', align: 'left', width: 280},
	{ title: '商品代码', dataIndex: 'ckspDm', align: 'left', width: 120},
	{ title: '商品名称', dataIndex: 'sbhgspmc', align: 'left', width: 180, ellipsis: true},
	{ title: '计量单位', dataIndex: 'hgjldwmc', align: 'left', width: 90},
	{ title: '出口数量', dataIndex: 'cksl', align: 'left', width: 115},
	{ title: '人民币离岸价', dataIndex: 'rmblaj', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '美元离岸价', dataIndex: 'mylaj', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '征税率', dataIndex: 'zssl', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '退税率', dataIndex: 'tsl', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '计划分配率', dataIndex: 'tzhjhfpl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '保税料件计税价格', dataIndex: 'jljgbsjkljzcjsjg', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '免税原材料价格', dataIndex: 'gngjmsycljg', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '不免抵扣税额', dataIndex: 'mdtsbdmzhdkse', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '免抵退税额', dataIndex: 'mdtse', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '进料登记册号', dataIndex: 'jljgszch', align: 'left', width: 200},
	{ title: '先退后核合同号', dataIndex: 'ckhth', align: 'left', width: 140, ellipsis: true},
	{ title: '业务类型', dataIndex: 'cktmsywlxdmjh', align: 'left', width: 115, codeTable: ['code_dm_ckts_cktmsywlx',  '01'] },
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, fixed: 'left' },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80, fixed: 'left' },
	{ title: '出口发票号', dataIndex: 'ckfph', align: 'left', width: 150, ellipsis: true},
	{ title: '报关单号', dataIndex: 'ckbgdh', align: 'left', width: 180},
	{ title: '出口日期', dataIndex: 'ckrq1', align: 'left', width: 120, render: { type: 'date', format: 'yyyy-MM-DD' } },
	{ title: '代理证明号', dataIndex: 'dlckhwzmhm', align: 'left', width: 280},
	{ title: '商品代码', dataIndex: 'ckspDm', align: 'left', width: 120},
	{ title: '商品名称', dataIndex: 'sbhgspmc', align: 'left', width: 180, ellipsis: true},
	{ title: '计量单位', dataIndex: 'hgjldwmc', align: 'left', width: 90},
	{ title: '出口数量', dataIndex: 'cksl', align: 'left', width: 115},
	{ title: '人民币离岸价', dataIndex: 'rmblaj', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '美元离岸价', dataIndex: 'mylaj', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '征税率', dataIndex: 'zssl', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '退税率', dataIndex: 'tsl', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '计划分配率', dataIndex: 'tzhjhfpl', align: 'right', width: 145, render: { type: 'number', format: '0,0.00000' } },
	{ title: '保税料件计税价格', dataIndex: 'jljgbsjkljzcjsjg', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '免税原材料价格', dataIndex: 'gngjmsycljg', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '不免抵扣税额', dataIndex: 'mdtsbdmzhdkse', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '免抵退税额', dataIndex: 'mdtse', align: 'right', width: 140, render: { type: 'number', format: '0,0.00' } },
	{ title: '进料登记册号', dataIndex: 'jljgszch', align: 'left', width: 200},
	{ title: '先退后核合同号', dataIndex: 'ckhth', align: 'left', width: 140, ellipsis: true},
	{ title: '业务类型', dataIndex: 'cktmsywlxdmjh', align: 'left', width: 115, codeTable: ['code_dm_ckts_cktmsywlx',  '01'] },
	{ title: '备注', dataIndex: 'bz', align: 'left', width: 180, ellipsis: true},
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'ckspDm', label: '商品代码', type: 'Input' },
	{ name: 'ckfph', label: '出口发票号', type: 'Input' },
	{ name: 'dlckhwzmhm', label: '代理证明号', type: 'Input' },
	{ name: 'ckbgdh', label: '报关单号', type: 'Input' },
  { name: 'tzsxbz', label: '台账数据', type: 'Select', codeTable: ['CODE_STATIC_SJGL_TZSJ', '01'],op:'zdy' }
];
unitConfig.gridParams = {
  initSearchModal: [
    { property: 'cdDm', value: "020999", op: 'zdy' }
  ]
};
// 表单项
unitConfig.form_items = [
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  add: true, // 是否显示增加按钮，默认关闭
  edit: true, // 是否显示修改按钮，默认关闭
  delete: true, // 是否显示删除按钮，默认关闭
  setting: true, // 是否显示设置按钮，默认关闭
  reload: true, // 是否显示刷新按钮，默认关闭
  full: true, // 是否显示全屏按钮，默认关闭
  ckts_download: false, // 是否显示导出按钮，默认关闭
  upload: false,  // 是否显示导入按钮，默认关闭
  ckts_sum: false, // 是否显示小计按钮，默认关闭
  ckts_order: false, // 是否显示序号重排(默认规则：选择排序)按钮，默认关闭
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                       	// 是否显示编辑链接，默认关闭
  delete: false,                     	// 是否显示删除链接，默认关闭
};

export default unitConfig;

