/**
 * title: 数据封装页面
 */
const unitConfig: any = {};

// 配置项
// 如果配置unit_key 则采用预计crud方法，也可自定义crud接口链接，覆盖默认配置
unitConfig.unit_key = 'EXAMPLE_DATA_PAGE_1';                                          // 业务单元key，对应后端接口
unitConfig.page_id = 'example_list_1';                                                // 页面id
unitConfig.grid_title = '报关单';                                                     // 列表标题，可选
// unitConfig.grid_title = {type: 'function', func: 'setGridTitle'};                  // 列表标题，可选
unitConfig.form_title = '报关单';                                                     // 表单标题，可选
unitConfig.grid_api_grid_query = `${API_URL_BASE}/yw/bszx/wbsj/bgd/queryBgd18Page`;   // api 列表查询
unitConfig.form_api_show=`${API_URL_BASE}/yw/bszx/wbsj/bgd/queryBgdByKey`;            // api 表单查询
unitConfig.form_api_save=`${API_URL_BASE}/yw/bszx/wbsj/bgd/updateBgd`;                // api 表单更新
unitConfig.form_api_check=`${API_URL_BASE}/yw/bszx/wbsj/bgd/checkCkbgdh`;             // api 表单校验
unitConfig.form_api_delete=`${API_URL_BASE}/yw/bszx/wbsj/bgd/deleteBgd21`;            // api 表单删除
unitConfig.grid_show_serial_number = true;                                            // 是否显示序号，默认不显示
unitConfig.grid_selection_type = 'checkbox';                                          // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
unitConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
unitConfig.click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
unitConfig.grid_show_data_num = true;                                                 // 工具栏左侧是否显示数据条数及选中数，默认false关闭
unitConfig.show_toolbar = true;                                                       // 是否开启工具栏，默认true显示
unitConfig.layout_type = 'default';                                                   // 页面类型，默认default 可选 default modal tabs
unitConfig.grid_scroll_x = '700px';                                                   // 默认700px
// unitConfig.grid_border = true;                                                        // 默认false
// unitConfig.grid_handle_width = 500;                                                   // 自定义操作列宽度
// unitConfig.grid_scroll_y = '200px';                                                // 默认null
// unitConfig.grid_sticky_affix = 94;                                                 // 列表锁定高度，如果layout_type=default,自动设置94；tabs，134
// unitConfig.toobar_affix = 44;                                                      // 工具条锁定高度，如果layout_type=default,自动设置44；tabs，84
// unitConfig.grid_header_info = '自定义的页头信息'                                     // 页头信息
// unitConfig.batch_update_url = `${API_URL_HTS_XIAOTU}/yw/fpzs/fppz/wxspszfpggxh`;    // 批量修改保存接口

// 配置文件是否后端获取
// unitConfig.service_columns = true;                                                    // 是否通过接口获取列表配置列，默认false

// 配置项：列表列
unitConfig.grid_columns = [
  {
    title: '报关单号', titleTooltip: '报关单号说明......{br}报关单号说明......', dataIndex: 'ckbgdh', width: 220, fixed: 'left', sorter: true,
    render: { func: 'renderCkbgdh' },
    filter: {
      type: 'Select',
      codeTable: ['code_dm_ckts_hgjgfs', '01'],
      showCode: true,
      // list: [
      //   { text: '已结关', value: 'yjg' },
      //   { text: '未结关', value: 'wjg' },
      // ],
    }
  },
  { title: '项号', dataIndex: 'xh4', width: 60, render: { func: 'renderExampleXh4' }, renderfixed: 'left' },
  {
    title: '监管方式', dataIndex: 'jgfsDm', width: 135, sorter: true, codeTable: ['code_dm_ckts_hgjgfs', '01'],
    filter: {
      type: 'Tree',
      list: [
        {
          text: '数据状态', value: 'sjzt', children: [
            { text: '已结关', value: 'yjg', },
            { text: '未结关', value: 'wjg', },
          ]
        },
        {
          text: '报关单', value: 'bgd', children: [
            { text: '18位', value: '18', },
            { text: '21位', value: '21', },
          ]
        },
      ]
    }
  },
  { title: '出口日期', dataIndex: 'ckrq1', width: 120, sorter: true, render: { type: 'date', format: 'yyyy-MM-DD' } },
  {
    title: '数据检查状态', dataIndex: 'cytgbz', width: 135, sorter: true, render: { func: 'renderCytgbz' },
    filter: {
      type: 'Radio',
      codeTable: ['code_dm_ckts_hgzfjsfs', '01'],
      // list: [
      //   { text: '全部', value: 'qb' },
      //   { text: '通过', value: 'tg' },
      //   { text: '驳回', value: 'bh' },
      // ],
    }
  },
  { title: '征免{br}类型', dataIndex: 'zmlx', width: 95, render: { func: 'renderZmlx' } },
  { title: '申报{br}业务', dataIndex: 'sbyw', width: 95, render: { func: 'renderSbyw' } },
  { title: '商品代码', dataIndex: 'ckspDm', width: 95 },
  {
    title: '商品名称', dataIndex: 'ckspmc', width: 180, ellipsis: true,
    filter: {
      type: 'Input',
    }
  },
  { title: '海关商品名称', dataIndex: 'hgspmc', width: 180 },
  { title: '出口合同号', dataIndex: 'ckhth', width: 115 },
  {
    title: '成交信息', dataIndex: 'cjxxGroup', children: [
      { title: '成交方式', dataIndex: 'hgcjfsmc', width: 85 },
      { title: '成交单位', dataIndex: 'hgjldwmc', width: 90, ellipsis: true },
      { title: '成交数量', dataIndex: 'cjsl1', width: 140, align: 'right', render: { type: 'number', format: '0,0.0000' } },
      { title: '成交币制', dataIndex: 'cjhghbzmDm', width: 85 },
      { title: '成交金额', dataIndex: 'cjzj', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
    ]
  },
  { title: '美元离岸价', dataIndex: 'mylaj', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '法定单位', dataIndex: 'dyjldwDm', width: 90, codeTable: ['code_dm_ckts_hgjldw', '01'], ellipsis: true },
  { title: '法定单位数量', dataIndex: 'cksl', width: 140, align: 'right', render: { type: 'number', format: '0,0.0000' } },
  { title: '第二单位', dataIndex: 'dejldwDm', width: 90, codeTable: ['code_dm_ckts_hgjldw', '01'], ellipsis: true },
  { title: '第二单位数量', dataIndex: 'decksl', width: 140, align: 'right', render: { type: 'number', format: '0,0.0000' } },
];

// 配置项：筛选_普通筛选 页面最上方 第一层筛选
unitConfig.filter_items = [
  { name: 'sbyw', label: '申报业务', type: 'Select', mode: 'multiple', codeTable: ['code_static_bgd_sbyw_dm', '01'], tooltip: '申报业务说明...' },
  { name: 'sybz', label: '生成状态', type: 'Select', codeTable: ['code_static_bgd_zt_dm', '01'] },
  { name: 'zmlx', label: '征免类型', type: 'Select', codeTable: ['code_static_bgd_zmlx_dm', '01'] },
  { name: 'czbz1', label: '关单信息', type: 'Select', codeTable: ['code_static_bgd_gdxx_dm', '01'] },
  { name: 'ckhth', label: '出口合同号', type: 'Input', },
  { name: 'ckrq1', label: '出口日期', type: 'DatePicker' },
  {
    name: 'kprq', label: '开票日期', type: 'DatePicker', range: true, layout: {
      formItem: {
        xs: { span: 23, offset: 1, pull: 1 },
        sm: { span: 23, offset: 1, pull: 1 },
        md: { span: 23, offset: 1, pull: 1 },
        lg: { span: 23, offset: 1, pull: 1 },
        xl: { span: 15, offset: 1, pull: 1 },
        xxl: { span: 15, offset: 1, pull: 1 }
      }
    }
  }, // , placeholder: ['aaa', 'bbb'] 日期范围的placeholder属性需要传递数组
  { name: 'ckbgdh', label: '报关单号', type: 'Input' },
  { name: 'jgfsDm', label: '监管方式', type: 'Input' },
  { name: 'cytgbz', label: '数据检查状态', type: 'Select', codeTable: ['code_static_bgd_cytgbz_dm', '01'] },
  { name: 'cylv', label: '差异率', type: 'Input', range: true },
  {
    name: 'treeSelect', label: '单证', type: 'TreeSelect', isSelectLeaf: true, showSearch: true, labelInValue: false, treeTable: ['CODE_DM_BADZ_BADZ', '01']
    // , list: [
    //   { title: '退税单证', value: '1',
    //     children: [
    //       {title: '出口发票', value: '1-1', children: [{title: '出口发票1', value: '1-1-1'}]},
    //       {title: '进口发票', value: '1-2'}
    //     ]
    //   },
    //   { title: '退税单证2', value: '2'},
    //   { title: '退税单证3', value: '3', children: [
    //       { title: '退税单证3-1', value: '3-1', children: [{title: '退税单证3-1-1', value: '3-1-1'}, {title: '退税单证3-1-2', value: '3-1-2'}]},
    //       { title: '退税单证3-2', value: '3-2'}
    //   ]},
    //   ]
  },
];

// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
unitConfig.grid_filter_quick = [
  { name: 'sbyw', label: '申报业务', type: 'Select', mode: 'multiple', codeTable: ['code_static_bgd_sbyw_dm', '01'], tooltip: '申报业务说明...' },
  // isReload=false 取消字段刷新，自行处理列表刷新操作
  // defaultValue可选
  {
    label: '是否结关', name: 'sfjg', type: 'Select', tooltip: '是否结关tooltip', onChange: 'handleOnChange', defaultValue: 'yjg', isReload: false, list: [
      { label: '全部', value: 'qb' },
      { label: '已结', value: 'yjg' },
      { label: '未结', value: 'wjg' },
    ]
  },
  { label: '报关单号', isLabel: true, searchModelBz: false, searchFlag: false, name: 'bgd', type: 'Input', tooltip: '报关单号tooltip', onPressEnter: 'handleOnChange', onSearch: 'handleOnChange', validator: 'grid_filter_quick_bgd', searchButton: true },
  { label: '商品代码', name: 'ckspDm', type: 'Input', width: '2w' },
  // input range 待完善
  // { label: '差异率', name: 'cyl', type: 'Input', tooltip: '差异率tooltip', onPressEnter: 'handleOnChange', onSearch: 'handleOnChange', range: true, searchBtnStatus: true },
  // { label: '差异率', name: 'cyl', type: 'Input', tooltip: '差异率tooltip', onPressEnter: 'handleOnChange', onSearch: 'handleOnChange', range: true },
  // { name: 'jgzrhl', type: 'Checkbox', tooltip: '关注日tooltip', onChange: 'handleOnChange', list: [
  //   { label: '关注日', value: 'gzr' },
  // ]},
  // { label: '出口日期', name: 'ckrq1', type: 'DatePicker', tooltip: '出口日期tooltip', defaultValue: ['2021-10-10', '2021-10-20'], range: true, onChange: 'handleOnChange' },
  // { label: '出口日期', name: 'ckrq2', type: 'DatePicker', tooltip: '出口日期tooltip', defaultValue: '2021-11-12' },
  // { label: '报关单', name: 'bgd', type: 'Select', defaultValue: '21', list: [
  //   { label: '18位', value: '18' },
  //   { label: '21位', value: '21' },
  // ]},
];

// 配置项：列表统计字段
unitConfig.grid_sum_field = [
  { label: '成交金额', field: 'cjzj', unit: '元', format: '0,0.00' },
  // { label: '成交数量', field: 'cjsl1', format: '0,0.0000' },
];

// 配置项：列表排序字段
unitConfig.grid_setting_sort = [
  { col: '报关单号', order: 'asc', name: 'bgd' },
  { col: '出口日期', order: 'desc', name: 'ckrq' },
  { col: '数据检查状态', order: 'default', name: 'sjjczt' },
  { col: '征免类型', order: 'default', name: 'zmlx' }
];

// 配置项：列表高级筛选字段
unitConfig.grid_setting_filter_advanced = {
  range: [
    {
      name: 'ckrq', label: '出口日期', type: 'DatePicker', range: true, quickOption: {
        type: 'Radio',
        list: [
          { value: 'ckrqv1', name: '本月' },
          { value: 'ckrqv2', name: '三个月' },
          { value: 'ckrqv3', name: '本年' },
        ]
      }
    },
    {
      name: 'ckgb', label: '出口国别', mode: 'multiple', type: 'Select', list: [
        { value: 'ckgb1', name: '出口国别1' },
        { value: 'ckgb2', name: '出口国别2' },
      ], quickOption: {
        type: 'Radio',
        list: [
          { value: 'ckgbv1', name: '亚洲' },
          { value: 'ckgbv2', name: '欧洲' },
          { value: 'ckgbv3', name: '美国' },
        ]
      }
    },
    {
      name: 'myfs', label: '贸易方式', type: 'Select', list: [
        { value: 'myfs1', name: '贸易方式1' },
        { value: 'myfs2', name: '贸易方式2' },
      ]
    },
    {
      name: 'ckka', label: '出口口岸', type: 'Select', list: [
        { value: 'ckka1', name: '出口口岸1' },
        { value: 'ckka2', name: '出口口岸2' },
      ]
    },
    {
      name: 'ysfs', label: '运输方式', type: 'Select', list: [
        { value: 'ysfs1', name: '运输方式1' },
        { value: 'ysfs2', name: '运输方式2' },
      ]
    },
    {
      name: 'hwlx', label: '货物类型', type: 'Checkbox', list: [
        { value: 'bqf', name: '不区分' },
        { value: 'tshw', name: '退税货物' },
        { value: 'yzshw', name: '应征税货物' },
      ],
    },
    {
      name: 'ckfslx', label: '出口方式类型', type: 'Radio', list: [
        { value: 'bqf', name: '不区分' },
        { value: 'zyck', name: '自营出口' },
        { value: 'wtck', name: '委托出口' },
      ],
    },
    {
      name: 'spdm', label: '商品代码', type: 'Select', list: [
        { value: 'spdm1', name: '商品代码1' },
        { value: 'spdm2', name: '商品代码2' },
      ]
    },
    {
      name: 'sjzt', label: '数据状态', type: 'Select', list: [
        { value: 'sjzt1', name: '数据状态1' },
        { value: 'sjzt2', name: '数据状态2' },
      ]
    },
    { name: 'sybz', label: '生成状态', type: 'Radio', codeTable: ['code_static_bgd_zt_dm', '01'] },
    { name: 'zmlx', label: '征免类型', type: 'Checkbox', codeTable: ['code_static_bgd_zmlx_dm', '01'] },
    { name: 'czbz1', label: '关单信息', type: 'Select', codeTable: ['code_static_bgd_gdxx_dm', '01'] },
  ],
  condition: [
    {
      groupLabel: '报关单表头',
      items: [
        { value: 'bgdh', label: '报关单号' },
        { value: 'ckhth', label: '出口合同号' },
        { value: 'cke', label: '出口额' },
        { value: 'jldw', label: '计量单位' },
      ]
    },
    {
      groupLabel: '报关单表体',
      items: [
        { value: 'xh', label: '项号' },
        { value: 'fddw', label: '法定单位' },
      ]
    },
    {
      groupLabel: '商品维度',
      items: [
        { value: 'spdm', label: '商品代码' },
        { value: 'spmc', label: '商品名称' },
      ]
    },
    {
      groupLabel: '贸易方式',
      items: [
        { value: 'myfsdm', label: '贸易方式代码' },
        { value: 'myfsmc', label: '贸易方式名称' },
      ]
    }
  ]
};

// 配置项：表单项
unitConfig.form_items = [
  { label: 'ID', type: 'Hidden', name: 'uuid' },
  { label: '基本信息', type: 'GroupTitle', name: 'jbxx' },
  { label: '报关单号', type: 'Input', name: 'ckbgdh', tooltip: '报关单号说明...' },
  { label: '出口日期', type: 'DatePicker', name: 'ckrq1', format: 'YYYY-MM-DD' },
  { label: '出口合同号', type: 'Input', name: 'ckhth' },
  { label: '核销单号', type: 'Input', name: 'hxdh' },
  { label: '运输工具名称', type: 'Input', name: 'ysgjmc' },
  {
    name: 'treeSelect', label: '单证', type: 'TreeSelect', isSelectLeaf: true, showSearch: true, labelInValue: false, treeTable: ['CODE_DM_BADZ_BADZ', '01']
    //  ,list: [
    //   { title: '退税单证', value: '1',
    //     children: [
    //       {title: '出口发票', value: '1-1', children: [{title: '出口发票1', value: '1-1-1'}]},
    //       {title: '进口发票', value: '1-2'}
    //     ]
    //   },
    //   { title: '退税单证2', value: '2'},
    //   { title: '退税单证3', value: '3', children: [
    //       { title: '退税单证3-1', value: '3-1', children: [{title: '退税单证3-1-1', value: '3-1-1'}, {title: '退税单证3-1-2', value: '3-1-2'}]},
    //       { title: '退税单证3-2', value: '3-2'}
    //   ]},
    //   ]
  },
  { label: '监管方式代码', type: 'Input', name: 'jgfsDm' },
  { label: '海关成交方式', type: 'Select', name: 'hgcjfsmc', codeTable: ['code_static_hgcjfs_mc', '01'] },
  { label: '成交海关货币字母代码', type: 'Input', name: 'cjhghbzmDm' },
  { label: '成交总价', type: 'InputNumber', name: 'cjzj', format: '0,0.00' },
  { label: '运费海关货币字母代码', type: 'Input', name: 'yfhghbzmDm' },
  { label: '运费金额', type: 'InputNumber', name: 'yfje', format: '0,0.00' },
  { label: '运费计算方式代码', type: 'Select', name: 'yfjsfsDm', codeTable: ['code_dm_ckts_hgyfjsfs', '01'] },
  { label: '运费折算数量', type: 'InputNumber', name: 'yfzssl', format: '0,0.0000' },
  { label: '保费海关货币字母代码', type: 'Input', name: 'bfhghbzmDm' },
  { label: '保费金额', type: 'InputNumber', name: 'bfje', format: '0,0.00' },
  { label: '保费计算方式代码', type: 'Select', name: 'bfjsfsDm', codeTable: ['code_dm_ckts_hgbfjsfs', '01'] },
  { label: '杂费海关货币字母代码', type: 'Input', name: 'zfhghbzmDm' },
  { label: '杂费金额', type: 'InputNumber', name: 'zfje1', format: '0,0.00' },
  { label: '杂费计算方式代码', type: 'Select', name: 'zfjsfsDm', codeTable: ['code_dm_ckts_hgzfjsfs', '01'] },
  { label: '商品信息', type: 'GroupTitle', name: 'spxx' },
  { label: '出口商品代码', type: 'Input', name: 'ckspDm' },
  { label: '出口商品名称', type: 'Input', name: 'ckspmc', readOnly: true },
  { label: '海关商品名称', type: 'Input', name: 'hgspmc' },
  { label: '成交计量单位', type: 'Input', name: 'hgjldwmc' },
  { label: '成交数量', type: 'InputNumber', name: 'cjsl1', format: '0,0.0000' },
  { label: '法定计量单位', type: 'Input', name: 'dyjldwDm' },
  { label: '法定数量', type: 'InputNumber', name: 'cksl', format: '0,0.0000' },
  { label: '第二计量单位', type: 'Input', name: 'dejldwDm' },
  { label: '第二出口数量', type: 'InputNumber', name: 'decksl', format: '0,0.0000' },
  { label: '规格型号', type: 'Input', name: 'ggxh' },
  { label: '数据检查标志', type: 'Hidden', name: 'cytgbz' },
  { label: '其他信息', type: 'GroupTitle', name: 'qtxx' },
  {
    label: '备注', type: 'TextArea', name: 'bz', layout: {
      label: { xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3 },
      formItem: { xs: 16, sm: 16, md: 16, lg: 19, xl: 21, xxl: 21 },
    }
  },
];

// 配置项：批量修改表单项
unitConfig.batch_update_items = [
  { dataIndex: 'ssq', label: '所属期', type: "Input" },
  { dataIndex: 'ybhl', label: '原币汇率', type: "InputNumber" },
  { dataIndex: 'myhl', label: '美元汇率', type: "InputNumber" },
  { dataIndex: 'ckfph', label: '出口发票号', type: "Input" },
  { dataIndex: 'ckrq1', label: '出口日期', type: "Date" },
  { dataIndex: 'cktmsywlxdmjh', label: '业务类型代码', type: "tableSelect", codeTable: ['CODE_DM_CKTS_CKTMSYWLX', '01'] },
  { dataIndex: 'szch', label: '手（账）册号', type: "Input" },
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  add: true,                        // 是否显示增加按钮，默认关闭
  edit: true,                        // 是否显示修改按钮，默认关闭
  delete: true,                    // 是否显示删除按钮，默认关闭
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  download: true,                   // 是否显示导出按钮，默认关闭
  upload: true,                     // 是否显示导入按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
  sum: true,                     // 是否显示小计按钮，默认关闭
  order: true,                   // 是否显示序号重排(默认规则：选择排序)按钮，默认关闭
  orderDrpx: true,               // 是否显示序号重排(导入排序)按钮，默认关闭
  batchEdit: true,               // 是否显示批量修改按钮，默认关闭
  // tzUpdateData: true,               // 是否显示更新台账数据，默认关闭
  // tzExport: true,                   // 是否显示导出，默认关闭
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: true,                       // 是否显示编辑链接，默认关闭
  delete: true,                     // 是否显示删除链接，默认关闭
};

// 配置项：自定义工具栏
unitConfig.costomer_toobar = [
  { name: '测一', key: 'cs1', func: 'handleCostomerToobar1' },
  { name: '测二', key: 'cs2', func: 'handleCostomerToobar2', disabled: true },
  {
    name: '红冲', type: 'dropdown', list: [
      { name: '设置红冲', func: 'handleCostomerToobar1' },
      { name: '取消红冲', func: 'handleCostomerToobar2' },
    ]
  },
];

// 配置项：自定义操作列
unitConfig.handle_columns = [
  { name: '事项通知书', key: 'cs1', func: 'handleColumns1' },
  { name: '随附单据', key: 'cs2', func: 'handleColumns2', disabled: 'setCs2Disabled' },  // disabled: true false 自定义方法
];

export default unitConfig;