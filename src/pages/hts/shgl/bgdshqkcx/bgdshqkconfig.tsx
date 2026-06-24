import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 报关单收回情况查询
 */
const bgdshqkConfig: any = {};

// 配置项
bgdshqkConfig.grid_show_serial_number = false;                                            // 是否显示序号，可选，默认不显示
bgdshqkConfig.grid_row_key =  { type: '1', key: ['sbqyuuid', 'bgdhgbh'] };                                              // 列表主键，默认uuid
bgdshqkConfig.grid_click_checked = '1';
bgdshqkConfig.export_key = 'SHGL_BGDSHQK_LBCX_DC';
bgdshqkConfig.module_key = 'SHGL_BGDSHQK_LBCX';
bgdshqkConfig.export_large = true; // tssb_download 配合此导出使用，同步大数据量导出
bgdshqkConfig.layout_type = 'tz';                                  // 页面类型，默认default 可选 default modal tabs tz台账


// 配置列表列
bgdshqkConfig.grid_columns = [
  { title: 'sbqyuuid', dataIndex: 'sbqyuuid', hidden: true },
  { title: '收汇状态', dataIndex: 'ppztDm', width: 140,  align: 'left',codeTable: 'CODE_STATIC_DM_ZXSB_PPZT:01',
    filter: {
    type: 'Select',
    codeTable: 'CODE_STATIC_DM_ZXSB_PPZT:01'
  }},
  { title: '出口报关单号', dataIndex: 'bgdhgbh',  align: 'left', width: 200, ellipsis: true, },
  { title: '出口日期', dataIndex: 'ckrq1',  align: 'left', width: 150, ellipsis: true, render: { type: 'date', format: 'YYYY-MM-DD' }, },
  { title: '合同协议号', dataIndex: 'htxyh',  align: 'left', width: 150, ellipsis: true, },
  { title: '境外收货人', dataIndex: 'jwshrmc',  align: 'left', width: 150, ellipsis: true, },
  { title: '成交币制', dataIndex: 'cjhghbzmDm',  align: 'left', width: 100, ellipsis: true, },
  { title: '成交金额', dataIndex: 'cjzj',  align: 'right', width: 150, ellipsis: true,render: { type: 'number', format: '0,0.00' } },
  { title: '原币汇率', dataIndex: 'cjhbhl',  align: 'right', width: 150, ellipsis: true,render: { type: 'number', format: '0,0.00000' } },
  { title: '人民币成交金额', dataIndex: 'rmbcjzj',  align: 'right', width: 150, ellipsis: true,render: { type: 'number', format: '0,0.00' } },
  { title: '不收汇成交金额', dataIndex: 'bshcjje',  align: 'right', width: 150, ellipsis: true,render: { type: 'number', format: '0,0.00' } },
  { title: '不收汇人民币金额', dataIndex: 'bshrmbcjje',  align: 'right', width: 150, ellipsis: true,render: { type: 'number', format: '0,0.00' } },
  { title: '退运成交金额', dataIndex: 'tycjje',  align: 'right', width: 150, ellipsis: true,render: { type: 'number', format: '0,0.00' } },
  { title: '退运人民币金额', dataIndex: 'tyrmbcjje',  align: 'right', width: 150, ellipsis: true,render: { type: 'number', format: '0,0.00' } },
  { title: '收汇凭证份数', dataIndex: 'shpzts',  align: 'right', width: 100, ellipsis: true, render: { func: 'renderShpzfs' } },
  {
    title: '已收汇', children: [
      { title: '成交金额', dataIndex: 'yzje1',  align: 'right', width: 150, ellipsis: true,render: { type: 'number', format: '0,0.00' } },
      { title: '人民币金额', dataIndex: 'yzrmbje',  align: 'right', width: 150, ellipsis: true,render: { type: 'number', format: '0,0.00' } },    ]
  },
  {
    title: '未收汇', children: [
      { title: '成交金额', dataIndex: 'wshje',  align: 'right', width: 150, ellipsis: true, render: { type: 'number', format: '0,0.00' }},
      { title: '人民币金额', dataIndex: 'wshrmbje',  align: 'right', width: 150, ellipsis: true,render: { type: 'number', format: '0,0.00' } },    ]
  },
  { title: '标签', dataIndex: 'bqsm', width: 140, ellipsis: true },
  { title: '是否提取收汇申报', dataIndex: 'fpsbztDm', width: 180,  align: 'left',codeTable: 'code_static_yes_no:01',
    filter: {
    type: 'Select',
    codeTable: 'code_static_yes_no:01'
  }},
];


// 配置项：工具栏
bgdshqkConfig.toolbar_default = {
  setting: true,
  add: false,
  full: true,
  reload: true,
  upload: false,
  download: true,
  delete:false,
};

// 筛选
bgdshqkConfig.filter_items = [
  { name: 'bgdhgbh', label: '出口报关单号', type: 'Input' },
  { name: 'ckrq1', label: '出口日期', type: 'DatePicker' ,range: true },
  { name: 'htxyh', label: '合同协议号', type: 'Input' },
  { name: 'jwshrmc', label: '境外收货人', type: 'Input' },
];

// 配置项：自定义工具栏
bgdshqkConfig.customer_toolbar = [
  { name: '数据更新', key: 'sjgx', func: 'sjgx' },
  { name: '不收汇金额设置', key: 'rgsz', func: 'rgsz' },
  {
    name: '批量修改',
    type: 'dropdown',
    list: [
      { name: '标签', func: 'btnSetBq' },
    ],
  }
];

bgdshqkConfig.handle_columns = [];
export default bgdshqkConfig;
