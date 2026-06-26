import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 代办退税应退税款明细
 * serviceKey: ZMKJ_ZXSB_DB_DBTSYTSKMX_F
 * unitId: cxtj_ckts_bl_db_dbtsytskmx
*/

const unitConfig: any = {};

unitConfig.module_key = 'ZMKJ_ZXSB_DB_DBTSYTSKMX_F'; // 业务单元key，对应后端接口
unitConfig.page_id = 'cxtj_ckts_bl_db_dbtsytskmx'; // 页面id
unitConfig.grid_title = '代办退税应退税款明细'; // 列表标题，可选
unitConfig.form_title = '代办退税应退税款明细'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = ''; // 配置常量
unitConfig.export_key1 = ''; // 采集导出key
unitConfig.export_key2 = ''; // 统计导出key
unitConfig.export_key3 = ''; // 申报结果查询导出key

// 配置列表列
unitConfig.grid_columns = [
	{ title: '凭证号码', dataIndex: 'pzhm2', align: 'left', width: 145},
	{ title: '序号', dataIndex: 'xh', align: 'left', width: 80},
	{ title: '委托代办退税生产企业纳税人名称', dataIndex: 'wtdbtsscqynsrmc', align: 'left', width: 180, ellipsis: true},
	{ title: '委托代办退税生产企业纳税人识别号', dataIndex: 'wtdbtsscqynsrsbh', align: 'left', width: 200},
	{ title: '退税额', dataIndex: 'tse', align: 'right', width: 95},
	{ title: '暂扣增值税退税额', dataIndex: 'zkzzstse', align: 'right', width: 145},
	{ title: '应追回代办退税退税额', dataIndex: 'yzhdbtstse', align: 'right', width: 200},
];

// 配置列表列 统计
unitConfig.grid_columns_tj = [
	{ title: '凭证号码', dataIndex: 'pzhm2', align: 'left', width: 145},
	{ title: '序号', dataIndex: 'xh', align: 'left', width: 80},
	{ title: '委托代办退税生产企业纳税人名称', dataIndex: 'wtdbtsscqynsrmc', align: 'left', width: 180, ellipsis: true},
	{ title: '委托代办退税生产企业纳税人识别号', dataIndex: 'wtdbtsscqynsrsbh', align: 'left', width: 200},
	{ title: '退税额', dataIndex: 'tse', align: 'right', width: 95},
	{ title: '暂扣增值税退税额', dataIndex: 'zkzzstse', align: 'right', width: 145},
	{ title: '应追回代办退税退税额', dataIndex: 'yzhdbtstse', align: 'right', width: 200},
];

// 筛选项
unitConfig.filter_items = [
	{ name: 'pzhm2', label: '凭证号码', type: 'Input' },
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

