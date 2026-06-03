// 受托方已开具代理出口证明查询（网报）
const unitConfig: any = {};

// 配置项
unitConfig.page_id = 'stfykjdlckzm_wb';
// unitConfig.grid_api_grid_query = `${API_URL_BASE}/yw/bszx/wbsj/dlckhwzm/queryDlckhwzmPage`;
unitConfig.grid_row_key = 'uuid';
unitConfig.layout_type = 'default';
unitConfig.click_checked = '1';
unitConfig.unit_key = 'CX_SAAS_SJGL_STFYKJDLZMCX_WB';
unitConfig.export_key = 'SAAS_SJGL_STFYKJDLCKHWZM_WB_DC';
unitConfig.module_type = 'QZ_type';

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
  upload: false,                     // 是否显示导入按钮，默认关闭
  tssb_download: true,                   // 是否显示导出按钮，默认关闭
};

// 配置列表列
unitConfig.grid_columns = [
  { title: '代理出口货物证明号码', dataIndex: 'dlckhwzmhm', width: 200, fixed: 'left', sorter: true },
  { title: '所属期', dataIndex: 'ssq', width: 90, sorter: true, hidden: true },
  { title: '申报批次', dataIndex: 'sbpc', width: 90, sorter: true, hidden: true },
  { title: '序号', dataIndex: 'sbxh', width: 80, sorter: true, hidden: true },
  { title: '编号', dataIndex: 'sbbh1', width: 100, sorter: true, hidden: true },
  { title: '项号', dataIndex: 'xh4', width: 60, sorter: true, hidden: true },
  { title: '受托方统一社会信用代码', dataIndex: 'stfnsrsbh', width: 200, ellipsis: true },
  { title: '受托方纳税人名称', dataIndex: 'stfmc', width: 160, ellipsis: true },
  { title: '委托（代理）协议合同号', dataIndex: 'wtdlckhth', width: 180, ellipsis: true },
  { title: '出口货物报关单号', dataIndex: 'ckbgdh', width: 180, sorter: true, ellipsis: true },
	{ title: '贸易方式', dataIndex: 'jgfsDm', width: 105 },
	{ title: '贸易方式名称', dataIndex: 'jgfsmc', width: 120, ellipsis: true },
  { title: '出口日期', dataIndex: 'ckrq1', width: 130, sorter: true, render: { type: 'date', format: 'yyyy-MM-DD' }},
  { title: '出口商品代码', dataIndex: 'ckspDm', width: 120 },
	{ title: '出口商品名称', dataIndex: 'ckspmc', align: 'left', width: 180, ellipsis: true},
  { title: '计量单位', dataIndex: 'hgjldwmc', width: 80, ellipsis: true },
  { title: '出口数量', dataIndex: 'cksl', width: 150, align: 'right', render: { type: 'number', format: '0,0.00000' } },
	{ title: '成交币制', dataIndex: 'hbzmDm', width: 70 },
	{ title: '成交币制名称', dataIndex: 'hbzmmc', width: 120, ellipsis: true },
  { title: '成交总价', dataIndex: 'cjzj', width: 145, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '原币金额', dataIndex: 'ybje', width: 145, align: 'right', render: { type: 'number', format: '0,0.00' }, hidden: false },
  { title: '美元离岸价', dataIndex: 'mylaj', width: 145, align: 'right', render: { type: 'number', format: '0,0.00' }},
  { title: '人民币离岸价', dataIndex: 'rmblaj', width: 145, align: 'right',render: { type: 'number', format: '0,0.00' } },
  { title: '备注', dataIndex: 'bz', width: 160, ellipsis: true },
];

// 配置项：筛选_普通筛选 页面最上方 第一层筛选
unitConfig.filter_items = [
  { name: 'dlckhwzmhm', label: '代理出口货物证明号码', type: 'Input'},
  { name: 'ckbgdh', label: '出口货物报关单号', type: 'Input'},
  { name: 'stfmc', label: '委托方纳税人名称', type: 'Input'},
  { name: 'wtdlckhth', label: '委托（代理）协议合同号', type: 'Input'},
  { name: 'stfnsrsbh', label: '委托方统一社会信用代码', type: 'Input'}
];

// 配置项：自定义工具栏
unitConfig.costomer_toobar= [
  { name: '打印', key: '5B0E0D24C5540BE634F369AC77F43211', func: 'dyFunc' },
  { name: '删除', key: 'sc', func: 'btnDelete'},
];

export default unitConfig;