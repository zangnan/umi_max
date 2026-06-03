/**
 * title: 数据管理-出口报关单管理
 */
const ckbgdConfig: any = {};

// 配置项
ckbgdConfig.grid_api_grid_query = `${API_URL_BASE}/yw/bszx/wbsj/bgd/queryBgd18Page`;
ckbgdConfig.form_api_delete = `${API_URL_BASE}/yw/bszx/wbsj/bgd/deleteBgd21`
ckbgdConfig.form_api_show=`${API_URL_BASE}/yw/bszx/wbsj/bgd/queryBgdByKey`;            // api 表单查询
ckbgdConfig.form_api_save=`${API_URL_BASE}/yw/bszx/wbsj/bgd/updateBgd`;                // api 表单更新
ckbgdConfig.form_api_check=`${API_URL_BASE}/yw/bszx/wbsj/bgd/checkCkbgdh`;             // api 表单校验
ckbgdConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
ckbgdConfig.grid_selection_type = "checkbox";                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
ckbgdConfig.grid_show_data_num = false;                          // 工具栏左侧是否显示数据条数及选中数，默认true显示
ckbgdConfig.click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
ckbgdConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
ckbgdConfig.unit_key = 'EXCEL_REPORT_WBSJ_CKBGD'; // 业务单元key，对应后端接口
ckbgdConfig.export_key = 'DC_SAAS_SJGL_HGSJCX_CKHWBGD'; // 业务单元key，对应后端接口
ckbgdConfig.export_large = true; // tssb_download 配合此导出使用，同步大数据量导出
ckbgdConfig.form_title = '报关单数据';
ckbgdConfig.gridParams = {
  initSearchModal: [
    { property: 'cdDm', value: "020301", op: 'zdy' },
  ]
}

// 配置列表列
ckbgdConfig.grid_columns = [
  { title: 'uuid', dataIndex: 'uuid', width: 180,  sorter: true, fixed: 'left' ,hidden:true },
  { title: '报关单号', dataIndex: 'ckbgdh', width: 200,  sorter: true, fixed: 'left', render: { func: 'renderBgdscmxbgdhSjgl' } },
  { title: '项号', dataIndex: 'xh4', width: 80, fixed: 'left' },
  { title: '出口日期', dataIndex: 'ckrq1', width: 120, sorter: true , fixed: 'left' ,render: { type: 'date', format: 'yyyy-MM-DD' } },
  { title: '申报日期', dataIndex: 'hgckhwbgdsbrq', width: 120, sorter: true , fixed: 'left' ,render: { type: 'date', format: 'yyyy-MM-DD' } },
  { title: '报关状态', dataIndex: 'bgsbztDm', width: 100, codeTable: ['CODE_DM_CKTS_HGBGSBZT', '01'], filter: { type: 'Select', codeTable: ['CODE_DM_CKTS_HGBGSBZT', '01'] }
  },
  { title: '开票状态', dataIndex: 'bgdkpzt', width: 100,
    render: { func: 'renderCkfpSjxzBgdKpzt' },
    filter: {
      type: 'Select',
      list: [
        { text: '已开票', value: '1' },
        { text: '未开票', value: '2' }
      ],
  }},
  { title: '申报业务', dataIndex: 'sbyw', width: 100, render: { func: 'sbyw' }, codeTable: ['code_static_bgd_sbyw_dm', '04'],
    filter: {
      type: 'Radio',
      codeTable: ['code_static_bgd_sbyw_dm', '04'],
    },
  },
  { title: '出口发票号码', dataIndex: 'ckfph', width: 150, ellipsis: true},
  { title: '海关商品代码', dataIndex: 'hgckspDm', width: 120 },
  { title: '海关商品名称', dataIndex: 'hgspmc', width: 180, ellipsis: true },
	{ title: '出口商品代码', dataIndex: 'ckspDm', align: 'left', width: 120},
	{ title: '出口商品名称', dataIndex: 'ckspmc', align: 'left', width: 180, ellipsis: true},
  { title: '法定单位', dataIndex: 'hgjldwmc', width: 80, ellipsis: true },
  { title: '法定单位数量', dataIndex: 'cksl', width: 140,  align: 'right' , render: { type: 'number', format: '0,0.00000' } },
  { title: '第二单位', dataIndex: 'dejldwDm', width: 80, ellipsis: true, codeTable: ['code_dm_ckts_hgjldw', '01'] },
  { title: '第二单位数量', dataIndex: 'decksl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '成交单位', dataIndex: 'sbjldwmc', width: 120, ellipsis: true },
  { title: '成交数量', dataIndex: 'cjsl1', width: 140, align: 'right' , render: { type: 'number', format: '0,0.00000' } },
  { title: '成交方式', dataIndex: 'hgcjfsmc', width: 100, filter: {
      type: 'Select',
      codeTable: ['code_dm_ckts_hgcjfs_mc', '01'],
    },
  },
  { title: '成交币制', dataIndex: 'cjhghbzmDm', width: 100, filter: {
      type: 'Select',
      codeTable: ['CODE_DM_GY_HB', '01'],
      showType: '3'
    }
  },
  { title: '成交汇率', dataIndex: 'cjhbhl', width: 120, render: { type: 'number', format: '0,0.00000' }  },
  { title: '成交金额', dataIndex: 'cjzj', width: 140,  align: 'right' , render: { type: 'number', format: '0,0.00' } },
  { title: '美元离岸价', dataIndex: 'mylaj', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '美元汇率', dataIndex: 'myhl', width: 100, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '运费金额', dataIndex: 'yfszl', width: 140, align: 'right', render: { type: 'number', format: '0,0.000000' } },
  { title: '运费币制', dataIndex: 'yfhghbzmDm', width: 70, ellipsis: true },
  { title: '运费汇率', dataIndex: 'yfhl', width: 100, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '运费标志', dataIndex: 'yfjsfsDm', width: 100 },
  { title: '折算数量', dataIndex: 'yfzssl', width: 140, align: 'right' , render: { type: 'number', format: '0,0.00000' } },
  { title: '保费金额', dataIndex: 'bfszl', width: 140,  align: 'right' , render: { type: 'number', format: '0,0.000000' } },
  { title: '保费币制', dataIndex: 'bfhghbzmDm', width: 70, ellipsis: true },
  { title: '保费汇率', dataIndex: 'bfhl', width: 100, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '保费标志', dataIndex: 'bfjsfsDm', width: 100 },
  { title: '杂费金额', dataIndex: 'zfszl', width: 140, align: 'right' , render: { type: 'number', format: '0,0.000000' } },
  { title: '杂费币制', dataIndex: 'zfhghbzmDm', width: 70, ellipsis: true },
  { title: '杂费汇率', dataIndex: 'zfhl', width: 100, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '杂费标志', dataIndex: 'zfjsfsDm', width: 100 },
  { title: '境外收货人名称', dataIndex: 'jwshrmc', width: 180, ellipsis: true },
  { title: '监管方式代码', dataIndex: 'jgfsDm', width: 120},
  { title: '监管方式名称', dataIndex: 'jgfsDm', width: 140, ellipsis: true, codeTable: ['code_dm_ckts_hgjgfs', '01']},
  { title: '合同协议号', dataIndex: 'ckhth', width: 180, ellipsis: true },
  { title: '提运单号', dataIndex: 'tydh', width: 180, ellipsis: true },
  { title: '备案号', dataIndex: 'bah', width: 150, ellipsis: true },
  { title: '口岸代码', dataIndex: 'hggqkaDm', width: 140 },
  { title: '出口口岸', dataIndex: 'hggqkajc', width: 140 },
  { title: '运抵国代码', dataIndex: 'ydgdqszDm', width: 140 },
  { title: '运抵国名称', dataIndex: 'ydggjhdqjc', width: 140 },
  { title: '报关单类型', dataIndex: 'dyckbgdlxDm', width: 140, codeTable: ['CODE_DM_ZXSB_DYCKBGDLX', '01'], filter: {
    type: 'Select',
    codeTable: ['CODE_DM_ZXSB_DYCKBGDLX', '01'],
  },  },
  { title: '数据来源', dataIndex: 'bgdsjlyDm', width: 140, codeTable: ['CODE_DM_ZXSB_BGDSJLY', '01'], filter: {
      type: 'Radio',
      codeTable: ['CODE_DM_ZXSB_BGDSJLY', '01'],
    },
  },
];

// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
ckbgdConfig.filter_items = [
  { name: 'ckbgdh', label: '出口报关单号', type: 'Input' },
  { name: 'ckrq1', label: '出口日期', type: 'DatePicker', range: true, allowClear: true },
  { name: 'hgckhwbgdsbrq', label: '申报日期', type: 'DatePicker', range: true, allowClear: true },
  { name: 'ckspDm', label: '出口商品代码', type: 'Input' },
  { name: 'jwshrmc', label: '境外收货人名称', type: 'Input' },
  { name: 'jgfsDm', label: '监管方式名称', type: 'Select', showType: '3', allowClear: true, showSearch: true, codeTable: ['CODE_DM_CKTS_HGJGFS', '01'] },
  { name: 'ckhth', label: '合同协议号', type: 'Input', },
  { name: 'bah', label: '备案号', type: 'Input' },
  { name: 'hggqkaDm', label: '出口口岸', type: 'Select', showType: '3', showSearch: true, codeTable: ['CODE_DM_GY_HGGQKA', '01'] },
  { name: 'ydgdqszDm', label: '运抵国名称', type: 'Select', showType: '3', showSearch: true, codeTable: ['CODE_T_GBCODE_INFO', '01'] },
  { name: 'tzsxbz', label: '台账数据', type: 'Select', codeTable: ['CODE_STATIC_SJGL_TZSJ', '01'] },
];

// 配置项：工具栏
ckbgdConfig.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
  delete: false,
  add: false,
  edit: false,
  upload: false,                    // 是否显示导入按钮，默认关闭
  // ckts_download: true,              // 是否显示导出按钮，默认关闭
  tssb_download: true,

};

// 配置项：自定义工具栏
ckbgdConfig.costomer_toobar = [
  { name: '同步结关状态', key: '1', func: 'handleBgdTbjgzt'},
  { name: '报关单导入', key: '2', func: 'importWj'},
  { name: '台账筛选', key: '3', func: 'importTzsx' },
  {
    name: '打印',
    key: '4',
    type: 'dropdown',
    list: [
      { name: '单一窗口横版样式', func: 'dyGdwFuncDy' },
      { name: '电子口岸竖版样式', func: 'dyGdwFuncDz' },
    ],
  },
  { name: '删除', key: 'sc', func: 'btnDelete'},

];

export default ckbgdConfig;
