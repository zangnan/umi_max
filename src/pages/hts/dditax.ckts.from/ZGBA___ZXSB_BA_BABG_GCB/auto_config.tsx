import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 出口退（免）税备案变更
 * serviceKey: ZGBA_ZXSB_BA_BABG_G
 * unitId: zgba_zxsb_ba_babg_gcb
*/

const unitConfig: any = {};

unitConfig.module_key = 'ZGBA_ZXSB_BA_BABG_G'; // 业务单元key，对应后端接口
unitConfig.page_id = 'zgba_zxsb_ba_babg_gcb'; // 页面id
unitConfig.grid_title = '出口退（免）税备案变更'; // 列表标题，可选
unitConfig.form_title = '出口退（免）税备案变更'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = '原系统未配置？'; // 配置常量
unitConfig.export_key1 = ''; // 采集导出key
unitConfig.export_key2 = ''; // 统计导出key
unitConfig.export_key3 = ''; // 申报结果查询导出key

// 配置列表列
unitConfig.grid_columns = [
	{ title: '申请日期', dataIndex: 'tbrq1', align: 'left', width: 120, fixed: 'left', render: { type: 'date', format: 'YYYY-MM-DD' } },
	{ title: '变更事项', dataIndex: 'bgzdmc', align: 'left', width: 200, codeTable: 'code_dm_ckts_bgx:01' },
	{ title: '原备案内容', dataIndex: 'bgq', align: 'left', width: 200},
	{ title: '变更后内容', dataIndex: 'bgh', align: 'left', width: 200},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '申请日期', dataIndex: 'tbrq1', align: 'left', width: 120, fixed: 'left', render: { type: 'date', format: 'YYYY-MM-DD' } },
	{ title: '原备案内容', dataIndex: 'bgq', align: 'left', width: 200},
	{ title: '变更后内容', dataIndex: 'bgh', align: 'left', width: 200},
	{ title: '变更事项', dataIndex: 'babgzdmc', align: 'left', width: 200},
	{ title: '退税税务机关代码', dataIndex: 'tsswjgDm1', align: 'left', width: 120},
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'bgzdmc', label: '变更事项', type: 'Select', 'allowClear': true, codeTable: 'code_dm_ckts_bgx:01' },
	{ name: 'tbrq1', label: '申请日期', type: 'DatePicker', 'allowClear': true, range: true},
];

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

