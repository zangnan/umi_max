import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 免抵退税申报汇总
 * serviceKey: MDT_ZXSB_SB_MDT_SBHZ_G
 * unitId: mdt_zxsb_sb_mdt_sbhz
*/

const unitConfig: any = {};

unitConfig.module_key = 'MDT_ZXSB_SB_MDT_SBHZ_S'; // 业务单元key，对应后端接口
unitConfig.grid_title = '免抵退税申报汇总表'; // 列表标题，可选
// unitConfig.form_title = '免抵退税申报汇总表'; // 表单标题，可选
// 配置列表列
unitConfig.grid_columns = [
	{ title: '所属期', dataIndex: 'ssq', align: 'left', width: 60, fixed: 'left' },
	{ title: '出口销售额（美元）', dataIndex: 'ckxsemy', width: 160, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '出口货物及修理修配服务销售额(美元)', dataIndex: 'ckhwxsemy', width: 260, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '跨境销售服务及无形资产销售额(美元)', dataIndex: 'ysfwxsemy', width: 260, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '出口销售额（人民币）', dataIndex: 'ckxsermb', width: 160, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '免抵退税不得免征和抵扣税额', dataIndex: 'mdtsbdmzhdkse', width: 210, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '出口货物及修理修配服务不得免征和抵扣税额', dataIndex: 'ckhwbdmzhdkse', width: 300, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '跨境销售服务及无形资产不得免征和抵扣税额', dataIndex: 'ysfwbdmzhdkse', width: 300, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '进料加工核销应调整不得免征和抵扣税额', dataIndex: 'jljghxytzbdmzhdkse', width: 290, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '免抵退税不得免征和抵扣税额合计', dataIndex: 'mdtsbdmzhdksehj', width: 240, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '免抵退税额', dataIndex: 'mdtse', width: 180, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '出口货物及修理修配服务免抵退税额', dataIndex: 'ckhwmdtse', width: 260, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '跨境销售服务及无形资产免抵退税额', dataIndex: 'ysfwmdtse', width: 260, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '上期结转免抵退税额', dataIndex: 'sqjzmdtse', width: 180, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '进料加工核销应调整免抵退税额', dataIndex: 'jljghxytzmdtse', width: 240, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '免抵退税额合计', dataIndex: 'mdtsehj', width: 180, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '结转下期免抵退税额', dataIndex: 'jzxqmdtse', width: 180, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '增值税纳税申报表期末留抵税额', dataIndex: 'zzsnssbbqmldse', width: 240, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '应退税额', dataIndex: 'ytse1', width: 180, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '免抵税额', dataIndex: 'mdse', width: 180, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '本年累计免抵退出口销售额（美元）', dataIndex: 'bnljmdtckxsemy', width: 260, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '本年累计出口货物及修理修配服务销售额(美元)', dataIndex: 'bnljckhwxsemy', width: 320, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '本年累计跨境销售服务及无形资产销售额(美元)', dataIndex: 'bnljysfwxsemy', width: 320, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '本年累计免抵退出口销售额（人民币）', dataIndex: 'bnljmdtckxsermb', width: 260, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '本年累计免抵退税不得免征和抵扣税额', dataIndex: 'bnljmdtsbdmzhdkse', width: 260, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '本年累计出口货物及修理修配服务不得免征和抵扣税额', dataIndex: 'bnljckhwbdmzhdkse', width: 360, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '本年累计跨境销售服务及无形资产不得免征和抵扣税额', dataIndex: 'bnljysfwbdmzhdkse', width: 360, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '本年累计进料加工核销应调整不得免征和抵扣税额', dataIndex: 'bnljjljghxytzbdmzhdkse', width: 330, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '本年累计免抵退税不得免征和抵扣税额合计', dataIndex: 'bnljmdtsbdmzhdksehj', width: 290, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '本年累计免抵退税额', dataIndex: 'bnljmdtse', width: 180, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '本年累计出口货物及修理修配服务免抵退税额', dataIndex: 'bnljckhwmdtse', width: 300, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '本年累计跨境销售服务及无形资产免抵退税额', dataIndex: 'bnljysfwmdtse', width: 300, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '本年累计进料加工核销应调整免抵退税额', dataIndex: 'bnljjljghxytzmdtse', width: 290, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '本年累计免抵退税额合计', dataIndex: 'bnljmdtsehj', width: 180, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '本年累计应退税额', dataIndex: 'bnljytse', width: 180, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '本年累计免抵税额', dataIndex: 'bnljmdse', width: 180, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '不得免征抵扣税额与纳税表差额', dataIndex: 'bdmzdkseynsbce', width: 240, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	// { title: '免抵退税办法不得抵扣的进项税额合计', dataIndex: 'mdtsbfbddkdjxsehj', width: 260, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	{ title: '应调不得免抵税额与纳税表差额', dataIndex: 'ytzbdmzhdkseyzzsnssbbce', width: 240, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
	// { title: '当期不得免征和抵扣抵减额', dataIndex: 'jzbmzdkdje', width: 180, align: 'right', render: { type: 'number', format: '0,0.00' }, ellipsis: true },
];



// unitConfig.grid_filter_quick = [
	// { name: 'ssq', label: '所属期', type: 'Input', width: '3w', searchButton: true, rules: [
	// 		{ type: 'base_required', message: '该项内容为必填项不能为空！' },
	//   ]
// 	},
// ];

unitConfig.filter_items = [
	{ name: 'ssq', label: '所属期', type: 'Input' ,rules: [
		{ type: 'base_required', message: '该项内容为必填项不能为空！' },
  ]},
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

