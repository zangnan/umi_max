import CONSTANTS from '@/components/DDAssist/constants';

const unitConfig: any = {};

// 配置项
// api 列表查询
unitConfig.grid_show_serial_number = false;                                           // 是否显示序号，可选
unitConfig.grid_click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
unitConfig.grid_scroll_x = '1100px';                                                   // 默认700px
unitConfig.grid_row_key = 'uuid';
unitConfig.layout_type = 'tz';                                  // 页面类型，默认default 可选 default modal tabs tz台账
unitConfig.module_type = 'sjbb';      

// 列表查询
unitConfig.module_key = 'CX_SJGL_HGSJCX_ZZSJYJKSCX'; // 业务单元key，对应后端接口

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '税费单号', dataIndex: 'hgzyjkshm', align: 'left', width: 200,ellipsis: true,},
  { title: '报关单号', dataIndex: 'bgdhgbh', width: 160, align: 'left',ellipsis: true,},
  { title: '税单序号', dataIndex: 'xh4', width: 100, align: 'left', ellipsis: true, },
  { title: '税费种类', dataIndex: 'szzfDm', width: 100, align: 'left', codeTable: 'CODE_DM_ZXSB_SZZF:01',filter: {
    type: 'Select',
    codeTable: 'CODE_DM_ZXSB_SZZF:01'
  },},
  { title: '税单生成日期', dataIndex: 'scrq', width: 145, render: { type: 'date', format: 'YYYY-MM-DD HH:mm' }, align: 'left', },
  { title: '支付金额', dataIndex: 'zfje', width: 150, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '进出口岸', dataIndex: 'hggqkajc', align: 'left', width: 170, ellipsis: true,},
  { title: '申报口岸', dataIndex: 'sbhggqkajc', align: 'left', width: 170, ellipsis: true,},
  { title: '申报单位', dataIndex: 'sbdwmc', align: 'left', width: 170, ellipsis: true,},
  { title: '收发货单位', dataIndex: 'hzdwmc', align: 'left', width: 170, ellipsis: true,},
  { title: '经营单位', dataIndex: 'narmc', align: 'left', width: 170, ellipsis: true,},
  { title: '提单号', dataIndex: 'tydh',  width: 150, ellipsis: true,},
  { title: '合同号', dataIndex: 'ckhth', width: 150, ellipsis: true,},
  { title: '运输工具号', dataIndex: 'ysgjmc',width: 100, ellipsis: true,},
  { title: '征免性质', dataIndex: 'zmxzmc',  width: 100, ellipsis: true,},
  { title: '监管方式', dataIndex: 'jgfsDm', width: 120, codeTable: 'code_dm_ckts_hgjgfs:01'  },
  { title: '税种', dataIndex: 'szzfDmMc', width: 100, ellipsis: true},
  { title: '进/出口日期', dataIndex: 'ckrq1', width: 170, render: { type: 'date', format: 'YYYY-MM-DD' }},
  { title: '进出口标志', dataIndex: 'jckbzDm',  width: 200, codeTable: 'CODE_DM_ZXSB_JCKBZ:01'  ,filter: {
    type: 'Select',
    codeTable: 'CODE_DM_ZXSB_JCKBZ:01'
  }, },
  { title: '退补税标志', dataIndex: 'tbsbzmc',  width: 100,},
  { title: '滞报滞纳标志', dataIndex: 'zbznDm', width: 130,},
  { title: '税款金额', dataIndex: 'skje',align: 'right',  width: 150, render: { type: 'number', format: '0,0.00' }},
  { title: '税款金额大写', dataIndex: 'dxje',  width: 200, ellipsis: true,},
  { title: '现场税单序号', dataIndex: 'xcsdxh',  width: 120, ellipsis: true},
  { title: '征税操作员', dataIndex: 'zsczy', width: 100, ellipsis: true,},
  { title: '税单开征日期', dataIndex: 'tfrq',  width: 170, render: { type: 'date', format: 'YYYY-MM-DD' }},
  { title: '缴款期限', dataIndex: 'jkqx',  width: 170, ellipsis: true, render: { type: 'date', format: 'YYYY-MM-DD' }},
  { title: '收入机关', dataIndex: 'srjg',  width: 100, ellipsis: true,},
  { title: '收入系统', dataIndex: 'xtmc',  width: 100, ellipsis: true,},
  { title: '预算级次', dataIndex: 'ysjcmc',  width: 100, ellipsis: true,},
  { title: '预算科目名称', dataIndex: 'yskmmc',  width: 100, ellipsis: true,},
  { title: '收款国库', dataIndex: 'skgkmc',  width: 200, ellipsis: true,},
  { title: '税款明细', children: [
    { title: '税号', dataIndex: 'ckspDm',  width: 150, ellipsis: true,},
    { title: '货物名称', dataIndex: 'hgspmc',  width: 150, ellipsis: true,},
    { title: '数量', dataIndex: 'sl', width: 150, align: 'right', ellipsis: true, render: { type: 'number', format: '0,0.00000' }},
    { title: '单位', dataIndex: 'hgjldwmc',  width: 150, ellipsis: true,},
    { title: '成交币制', dataIndex: 'cjhbzmDm',  width: 70, ellipsis: true,},
    { title: '外汇折算率', dataIndex: 'zsl1',  width: 150, render: { type: 'number', format: '0,0.00' } ,align: 'right',},
    { title: '完税价格', dataIndex: 'wsjg',  width: 150, render: { type: 'number', format: '0,0.00' },align: 'right',},
    { title: '从价税率', dataIndex: 'cjdlzs',  width: 100, render: { type: 'number', format: '0,0.00' },align: 'right',},
    { title: '从量税率', dataIndex: 'cldezs',  width: 100,render: { type: 'number', format: '0,0.00' },align: 'right',},
    { title: '税款金额', dataIndex: 'se',  width: 150, ellipsis: true, render: { type: 'number', format: '0,0.00' },align: 'right', },
  ]
},
 


];

unitConfig.filter_items = [
  { name: 'hgzyjkshm', label: '税费单号', type: 'Input' },
  { name: 'scrq', label: '税单生成日期', type: 'DatePicker', range: true,isLabel: true},
  { name: 'ckhth', label: '合同号', type: 'Input',},
  { name: 'jgfsDm', label: '监管方式', type: 'Select', showType: '3', showSearch: true, codeTable: 'CODE_DM_CKTS_HGJGFS:01' }
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,
  reload: true,
  full: true,
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false,                   // 是否显示编辑链接，默认开启
  delete: false,                 // 是否显示删除链接，默认开启
};


// 配置项：自定义工具栏
unitConfig.customer_toolbar = [
  { name: '导出', key: 'sjxzJdcxPlsc08021', func: 'handleMdthxFplSjdc' },
];

unitConfig.handle_columns = [];
export default unitConfig;