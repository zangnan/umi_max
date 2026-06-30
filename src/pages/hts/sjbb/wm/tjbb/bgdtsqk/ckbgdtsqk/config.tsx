import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 出口报关单退税情况
 */
const unitConfig: any = {};

// 配置项
unitConfig.grid_title = '（单位：元、美元）';
unitConfig.module_key = 'CX_SJFX_WM_BGDTSQK_CKBGDTSQK_QUERY';                            // 业务单元key，对应后端接口
unitConfig.page_id = 'CX_SJFX_WM_BGDTSQK_CKBGDTSQK_QUERY';                          // 页面id
unitConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
unitConfig.grid_selection_type = false;                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.toolbar_show_grid_checked_num = false;                          // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.layout_type = 'tz';                                  // 页面类型，默认default 可选 default modal tabs tz台账
unitConfig.grid_row_key = 'uuid';
unitConfig.export_key = 'CX_SJFX_WM_BGDTSQK_CKBGDTSQK_PRINT_REPORT';
unitConfig.module_type = 'sjbb';

// 配置项：列表列
unitConfig.grid_columns = [
  {
    title: '出口明细', dataIndex: 'ckmx', children: [
      {title: '出口报关单号', dataIndex: 'bgdhgbh', width: 190},
      {title: '项号', dataIndex: 'xh4', width: 70},
      {title: '是否退税', dataIndex: 'tsqkmc', width: 100},
      {title: '出口日期', dataIndex: 'ckrq1', width: 110, render: {type: 'date', format: 'YYYY-MM-DD'}},
      {title: '申报业务', dataIndex: 'bgdcllxmc', width: 100, ellipsis: true},
      {title: '商品代码', dataIndex: 'hgckspDm', width: 120, ellipsis: true},
      {title: '海关商品名称', dataIndex: 'hgspmc', width: 175, ellipsis: true},
      {title: '规格型号', dataIndex: 'ggxh', width: 200, ellipsis: true},
      {title: '出口合同号', dataIndex: 'ckhth', width: 180, ellipsis: true},
      {title: '监管方式', dataIndex: 'jgfsDm', width: 100, ellipsis: true,},
      {title: '成交方式', dataIndex: 'hgcjfsmc', width: 100},
      {title: '成交单位', dataIndex: 'sbjldwmc', width: 100, ellipsis: true},
      {title: '成交数量', dataIndex: 'cjsl1', width: 140, align: 'right', sum: true, render: {type: 'number', format: '0,0.00000'}},
      {title: '成交货币字母代码', dataIndex: 'cjhghbzmDm', align: 'left', width: 170},
      {title: '成交总价', dataIndex: 'cjzj', width: 140, align: 'right', sum: true, render: {type: 'number', format: '0,0.00'}},
      {title: '美元离岸价', dataIndex: 'mylaj', width: 140, align: 'right', sum: true, render: {type: 'number', format: '0,0.00'}},
      {title: '原币汇率', dataIndex: 'cjhbhl', width: 110, align: 'right', render: {type: 'number', format: '0,0.00000'}},
    ]
  },
  {
    title: '进项情况', dataIndex: 'jxqk', children: [
      {title: '销项发票号', dataIndex: 'ckfph', width: 180, ellipsis: true},
      {title: '进项发票号码', dataIndex: 'jhpzh', width: 180, ellipsis: true},
      {title: '进项发票单位', dataIndex: 'hgjldwmc', width: 110, ellipsis: true},
      {title: '进项发票数量', dataIndex: 'sl', width: 140, align: 'right', sum: true, render: {type: 'number', format: '0,0.00000'}},
      {title: '进项发票对应的金额', dataIndex: 'jsje', width: 140, align: 'right', sum: true, render: {type: 'number', format: '0,0.00'}},
      {title: '进项发票对应的税额', dataIndex: 'tse', width: 140, align: 'right', sum: true, render: {type: 'number', format: '0,0.00'}},
      {title: '进项发票对应的含税金额', dataIndex: 'jshj', width: 180, align: 'right', sum: true, render: {type: 'number', format: '0,0.00'}},
    ]
  },
  {
    title: '申报情况', dataIndex: 'sbqk', children: [
      {title: '是否生成明细', dataIndex: 'sfts', width: 110},
      {title: '退税金额', dataIndex: 'tsje', width: 140, align: 'right', sum: true, render: {type: 'number', format: '0,0.00'}},
      {title: '申报所属期', dataIndex: 'ssq', width: 110},
      {title: '批次', dataIndex: 'sbpc', width: 110},
      {title: '申报关联号', dataIndex: 'glh', width: 180},
    ]
  },
];

unitConfig.grid_filter_quick = [
  {name: 'ckrq1', label: '出口日期', type: 'DatePicker', range: true, isLabel: true,},
];

// 配置项：筛选_普通筛选 页面最上方 第一层筛选
unitConfig.filter_items = [
  {name: 'hgckspDm', label: '商品代码', type: 'Input'},
  {name: 'hgspmc', label: '海关商品名称', type: 'Input'},
  {name: 'jgfsDm', label: '监管方式', type: 'Select', mode: 'multiple', showSearch: true, codeTable: 'CODE_DM_CKTS_HGJGFS:01'},
  {name: 'ckhth', label: '出口合同号', type: 'Input'},
  {name: 'sbjldwmc', label: '成交单位', type: 'Input'},
  {name: 'ckfph', label: '销项发票号', type: 'Input'},
  {name: 'jhpzh', label: '进项发票号码', type: 'Input'},
  {name: 'ssq', label: '申报所属期', type: 'Input'},
  {name: 'sbpc', label: '批次', type: 'Input'},
  {name: 'bgdhgbh', label: '出口报关单号', type: 'Input'},
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  sjgxUpdateData: false,               // 是否显示更新台账数据，默认关闭
  ckts_download: true,                   // 是否显示导出，默认关闭
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
};

// 配置项：自定义工具栏
unitConfig.customer_toolbar = [
  { name: '更新数据', func: 'sjgxCkbgdtsqk' },
];

unitConfig.handle_columns = [];
export default unitConfig;
