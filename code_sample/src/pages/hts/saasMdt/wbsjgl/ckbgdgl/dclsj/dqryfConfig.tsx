/**
 * title: 出口报关单管理-待处理-待确认运费
 */

const ckfpConfig: any = {};

// 配置项
ckfpConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
ckfpConfig.grid_selection_type = "checkbox";                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
ckfpConfig.grid_show_data_num = false;                          // 工具栏左侧是否显示数据条数及选中数，默认true显示
ckfpConfig.click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
ckfpConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
ckfpConfig.unit_key = 'WBSJ_CKBGD_QUERY_PAGE'; // 业务单元key，对应后端接口
ckfpConfig.export_key = 'WBSJ_CKBGD_DQRYF_DC'; // 业务单元key，对应后端接口
ckfpConfig.export_large = true; // tssb_download 配合此导出使用，同步大数据量导出
ckfpConfig.module_type = 'QZ_type';
ckfpConfig.page_id = 'WBSJ_CKBGD_QUERY_PAGE_DQRYF';

// 配置列表列
ckfpConfig.grid_columns = [
  { title: '出口货物报关单号', dataIndex: 'ckbgdh', width: 180,  sorter: true, fixed: 'left' , render: { func: 'renderBgdscmx18bgdh' } },
  { title: '出口合同号', dataIndex: 'ckhth', width: 180, ellipsis: true },
  { title: '出口日期', dataIndex: 'ckrq1', width: 120, sorter: true, render: { type: 'date', format: 'yyyy-MM-DD' } },
  { title: '海关商品代码', dataIndex: 'hgspDm', width: 160,},
  { title: '海关商品名称', dataIndex: 'hgspmc', width: 180, ellipsis: true },
  { title: '成交币制', dataIndex: 'cjhghbzmDm', width: 70,  },
  { title: '监管方式', dataIndex: 'jgfsDm', width: 120, codeTable: ['code_dm_ckts_hgjgfs', '01']  },
  { title: '运费币制', dataIndex: 'yfhghbzmDm', width: 70 },
  { title: '运费单价', dataIndex: 'yfszl', width: 140, align: 'right', render: { type: 'number', format: '0,0.000000' },  },
  { title: '折算数量', dataIndex: 'yfzssl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' },  },
  { title: '成交单位', dataIndex: 'sbjldwmc', width: 80, ellipsis: true },
  { title: '成交数量', dataIndex: 'cjsl1', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' },  },
  { title: '法定单位', dataIndex: 'hgjldwmc', width: 80, ellipsis: true },
  { title: '法定单位数量', dataIndex: 'cksl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' },  },
  { title: '第二单位', dataIndex: 'dejldwDm', width: 80, ellipsis: true, codeTable: ['CODE_DM_CKTS_HGJLDW', '01'] },
  { title: '第二单位数量', dataIndex: 'decksl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' },  },
];

// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
ckfpConfig.filter_items = [
  { name: 'ckbgdh', label: '出口货物报关单号', type: 'Input' },
  { name: 'ckhth', label: '出口合同号', type: 'Input' },
  { name: 'ckrq1', label: '出口日期', type: 'DatePicker', range: true, allowClear: true },
  { name: 'jgfsDm', label: '监管方式', type: 'Select', showType: '3', allowClear: true, showSearch: true, codeTable: ['CODE_DM_CKTS_HGJGFS', '01'] },
  { name: 'hgspDm', label: '海关商品代码', type: 'Input' },
  { name: 'hgspmc', label: '海关商品名称', type: 'Input' },
];


// 配置项：工具栏
ckfpConfig.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
  delete: false,
  add: false,
  edit: false,
  upload: false,                    // 是否显示导入按钮，默认关闭
  tssb_download: true,                   // 是否显示导出按钮，默认关闭
};

// 配置项：自定义工具栏
ckfpConfig.costomer_toobar = [
  { name: '批量确认', func: 'btnPlbt' },
  { name: '转不退税', func: 'btnZbts' },
];

export default ckfpConfig;
