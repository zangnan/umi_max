import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 合同收汇情况查询
 */
const htshqkConfig: any = {};

// 配置项
htshqkConfig.grid_show_serial_number = false;      // 是否显示序号，可选，默认不显示
htshqkConfig.grid_row_key =  'uuid';                                              // 列表主键，默认uuid
htshqkConfig.grid_click_checked = '1';
htshqkConfig.export_key = 'SHGL_HTSHQK_LBCX_DC';
htshqkConfig.module_key = 'SHGL_HTSHQK_LBCX';
htshqkConfig.export_large = true; // tssb_download 配合此导出使用，同步大数据量导出


// 配置列表列
htshqkConfig.grid_columns = [
  { title: 'sbqyuuid', dataIndex: 'sbqyuuiduuid', hidden: true },
  { title: '收汇状态', dataIndex: 'ppztDm', width: 140,  align: 'left',codeTable: 'CODE_STATIC_DM_ZXSB_PPZT:01',
    filter: {
    type: 'Select',
    codeTable: 'CODE_STATIC_DM_ZXSB_PPZT:01'
  }},

  { title: '合同协议号', dataIndex: 'htxyh',  align: 'left', width: 150, ellipsis: true, },
  { title: '规范化境外收货人', dataIndex: 'gfhjwshrmc',  align: 'left', width: 200, ellipsis: true, },
  { title: '报关单份数', dataIndex: 'bgdzts',  align: 'right', width: 100, ellipsis: true, },
  { title: '成交币制', dataIndex: 'cjhghbzmDm',  align: 'left', width: 150, ellipsis: true, },
  { title: '成交金额', dataIndex: 'cjzj',  align: 'right', width: 150, ellipsis: true,render: { type: 'number', format: '0,0.00' } },
  { title: '人民币成交金额', dataIndex: 'rmbcjzj',  align: 'right', width: 150, ellipsis: true,render: { type: 'number', format: '0,0.00' } },
  { title: '不收汇成交金额', dataIndex: 'bshcjje',  align: 'right', width: 150, ellipsis: true,render: { type: 'number', format: '0,0.00' } },
  { title: '不收汇人民币金额', dataIndex: 'bshrmbcjje',  align: 'right', width: 150, ellipsis: true,render: { type: 'number', format: '0,0.00' } },
  { title: '退运成交金额', dataIndex: 'tycjje',  align: 'right', width: 150, ellipsis: true,render: { type: 'number', format: '0,0.00' } },
  { title: '退运人民币金额', dataIndex: 'tyrmbcjje',  align: 'right', width: 150, ellipsis: true,render: { type: 'number', format: '0,0.00' } },
  { title: '收汇凭证份数', dataIndex: 'shpzts',  align: 'right', width: 100, ellipsis: true, },
  {
    title: '已收汇', dataIndex: 'yshmylaj', children: [
      { title: '成交金额', dataIndex: 'yzje1',  align: 'right', width: 150, ellipsis: true,render: { type: 'number', format: '0,0.00' } },
      { title: '人民币金额', dataIndex: 'yzrmbje',  align: 'right', width: 150, ellipsis: true,render: { type: 'number', format: '0,0.00' } },    ]
  },
  {
    title: '未收汇', dataIndex: 'wshmylaj', children: [
      { title: '成交金额', dataIndex: 'wshje',  align: 'right', width: 150, ellipsis: true, render: { type: 'number', format: '0,0.00' }},
      { title: '人民币金额', dataIndex: 'wshrmbje',  align: 'right', width: 150, ellipsis: true,render: { type: 'number', format: '0,0.00' } },    ]
  },
];


// 配置项：工具栏
htshqkConfig.toolbar_default = {
  setting: true,
  add: false,
  full: true,
  reload: true,
  upload: false,
  download: true,
  delete:false,
};

// 筛选
htshqkConfig.filter_items = [
  { name: 'htxyh', label: '合同协议号', type: 'Input' },
  { name: 'gfhjwshrmc', label: '规范化境外收货人', type: 'Input' },
];



htshqkConfig.customer_toolbar = [];
htshqkConfig.handle_columns = [];
export default htshqkConfig;
