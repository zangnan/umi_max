import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 数据管理-代理出口货物证明申请
 * serviceKey: ZMKJ_ZXSB_ZM_DLCK_F
 * unitId: zmkj_zxsb_zm_dlck_gcb
*/

const unitConfig: any = {};

unitConfig.module_key = 'ZMKJ_ZXSB_ZM_DLCK_F'; // 业务单元key，对应后端接口
unitConfig.page_id = 'zmkj_zxsb_zm_dlck_gcb'; // 页面id
unitConfig.grid_title = '代理出口货物证明申请'; // 列表标题，可选
unitConfig.form_title = '代理出口货物证明申请'; // 表单标题，可选
unitConfig.grid_selection_type = 'checkbox'; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.unit_constant = '原系统未配置？'; // 配置常量
unitConfig.export_key = 'ZMKJ_ZXSB_ZM_DLCK_F';

// 配置列表列
unitConfig.grid_columns = [
	{ title: '代理出口货物证明号码', dataIndex: 'cktszmbh', width: 180, fixed: 'left', },
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 90, render: { type: 'date', format: 'YYYYMM' } },
	{ title: '申报批次', dataIndex: 'sbpc', align: 'left', width: 90 },
	{ title: '序号', dataIndex: 'sbxh', align: 'left', width: 80 },
	{ title: '编号', dataIndex: 'sbbh1', align: 'left', width: 100},
	{ title: '项号', dataIndex: 'xh4', align: 'left', width: 60},
	{ title: '委托方统一社会信用代码{br}/纳税人识别号', dataIndex: 'wtfnsrsbh', width: 200, ellipsis: true },
	{ title: '委托方纳税人名称', dataIndex: 'wtfnsrmc', width: 160, ellipsis: true },
	{ title: '委托（代理）协议合同号', dataIndex: 'wtdlckhth', width: 180, ellipsis: true },
	{ title: '出口货物报关单号', dataIndex: 'ckbgdh', width: 160, sorter: true, ellipsis: true },
	{ title: '贸易方式', dataIndex: 'myfsDm', width: 105 },
	{ title: '贸易方式名称', dataIndex: 'myfsDm', width: 120, ellipsis: true, codeTable: 'code_dm_ckts_hgjgfs:01' },
	{ title: '出口日期', dataIndex: 'ckrq1', width: 130, sorter: true, render: { type: 'date', format: 'YYYY-MM-DD' }},
	{ title: '出口商品代码', dataIndex: 'ckspDm', width: 120 },
	{ title: '出口商品名称', dataIndex: 'ckspmc', align: 'left', width: 180, ellipsis: true},
	{ title: '计量单位', dataIndex: 'hgjldwmc', width: 160, ellipsis: true },
	{ title: '出口数量', dataIndex: 'cksl', width: 150, align: 'right', render: { type: 'number', format: '0,0.00000' } },
	{ title: '成交币制', dataIndex: 'hbzmDm', width: 60 },
	{ title: '成交币制名称', dataIndex: 'hbzmDm', width: 120, ellipsis: true, codeTable: 'code_dm_gy_hb:01' },
	{ title: '成交总价', dataIndex: 'cjzj', width: 145, align: 'right', render: { type: 'number', format: '0,0.00' } },
	{ title: '美元离岸价', dataIndex: 'mylaj', width: 145, align: 'right', render: { type: 'number', format: '0,0.00' }},
	{ title: '人民币离岸价', dataIndex: 'rmblaj', width: 145, align: 'right',render: { type: 'number', format: '0,0.00' } },
	{ title: '备注', dataIndex: 'bz', width: 160, ellipsis: true },
];	

// 筛选项
unitConfig.filter_items = [
	{ name: 'ssq', label: '所属期', type: 'Input' },
	{ name: 'sbpc', label: '申报批次', type: 'Input' },
	{ name: 'dlckhwzmhm', label: '代理出口货物证明号码', type: 'Input' },
	{ name: 'wtfnsrmc', label: '委托方纳税人名称', type: 'Input' },
	{ name: 'wtdlckhth', label: '委托（代理）协议合同号', type: 'Input' },
];

// 配置项：工具栏
unitConfig.toolbar_default = {
	add: false, // 是否显示增加按钮，默认关闭
	edit: false, // 是否显示修改按钮，默认关闭
	delete: false, // 是否显示删除按钮，默认关闭
	ckts_download: true, // 是否显示导出按钮，默认关闭
	upload: false,  // 是否显示导入按钮，默认关闭
	ckts_sum: false, // 是否显示小计按钮，默认关闭
	ckts_order: false, // 是否显示序号重排(默认规则：选择排序)按钮，默认关闭
	setting: true, // 是否显示设置按钮，默认关闭
	reload: true, // 是否显示刷新按钮，默认关闭
	full: true, // 是否显示全屏按钮，默认关闭
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                       	// 是否显示编辑链接，默认关闭
  delete: false,                     	// 是否显示删除链接，默认关闭
};

unitConfig.customer_toolbar = [];
unitConfig.handle_columns = [];
export default unitConfig;

