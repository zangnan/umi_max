/**
 * title: 数据封装页面
 */
import CONSTANTS from '@/components/DDAssist/constants';

const unitConfig: any = {};

// 配置项
// 如果配置unit_key 则采用预计crud方法，也可自定义crud接口链接，覆盖默认配置
unitConfig.module_key = 'EXAMPLE_DATA_PAGE_1';                                          // 业务单元key，对应后端接口
unitConfig.page_id = 'example_list_1';                                                // 页面id
unitConfig.layout_type = 'default';                                                   // 页面类型，默认default 可选 default modal tabs
unitConfig.form_title = 'BGD';                                                        // 表单：标题，可选
unitConfig.grid_show_serial_number = false;                                           // 列表：是否显示序号，默认不显示
unitConfig.grid_title = { type: 'function', func: 'setGridTitle' };                   // 列表：标题，可选 object 或 string
unitConfig.grid_click_checked = '1';                                                  // 列表：是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
unitConfig.toolbar_show_grid_checked_num = true;                                      // 工具栏：是否显示数据条数及选中数，默认false关闭
// unitConfig.grid_pagination = false;                                                // 列表：是否含有分页，默认 true
// unitConfig.form_width = 1200;                                                      // 表单：宽度，默认1200，可选 480 720 960 1200 max
// unitConfig.form_layout_type = 'horizontal';                                        // 表单：整体一列或多列布局，默认vertical，可选 horizontal vertical 2 3 4 6 8 12
// unitConfig.toolbar_open = true;                                                    // 工具栏：是否开启，默认true显示
// unitConfig.toobar_affix = 44;                                                      // 工具栏：锁定高度，如果layout_type=default=>44；tabs=>84
// unitConfig.grid_sticky_affix = 94;                                                 // 列表：列表锁定高度，如果layout_type=default=>94；tabs=>134
// unitConfig.grid_title = 'BGD';                                                     // 列表：标题，可选 object 或 string
// unitConfig.grid_scroll_y = '200px';                                                // 列表：y轴滚动条，默认null
// unitConfig.grid_scroll_x = '700px';                                                // 列表：x轴滚动条，默认700px
// unitConfig.grid_selection_type = 'checkbox';                                       // 列表：首选项类别，默认 checkbox，可选 false radio checkbox
// unitConfig.grid_border = false;                                                    // 列表：边框，默认true
// unitConfig.grid_handle_width = 500;                                                // 列表：自定义操作列宽度
// unitConfig.grid_row_key = 'ckbgdh';                                                  // 列表：主键，默认uuid
unitConfig.grid_row_key = ['ckbgdh', 'xh4'];                                      // 列表：主键，联合主键，array格式
// unitConfig.gridIsInitSearch = true;                                                // 列表：是否开启默认查询，默认true开启
// unitConfig.form_save_check = false;                                                // 表单：编辑是否执行后端校验，默认false不执行
// unitConfig.api_grid_query = `/dict/automatic/queryPager`;     // api：列表查询
// unitConfig.api_form_query=`${API_URL_BASE}/yw/bszx/wbsj/bgd/queryBgdByKey`;        // api：表单查询
// unitConfig.api_form_edit=`${API_URL_BASE}/yw/bszx/wbsj/bgd/updateBgd`;             // api：表单更新
// unitConfig.api_form_delete=`${API_URL_BASE}/yw/bszx/wbsj/bgd/deleteBgd21`;         // api：表单删除
// unitConfig.api_form_check=`${API_URL_BASE}/yw/bszx/wbsj/bgd/checkCkbgdh`;          // api：表单校验
unitConfig.delete_key='uuids';                                                     // 删除时的参数键：主键，默认uuids
// unitConfig.get_edit_value_by_grid = true;                                        // 编辑弹窗的数据获取方式，是否从列表中直接取值
// unitConfig.form_submit_type = 'FormData';                                          // 表单：提交方式，默认null，FormData可选
// unitConfig.leaf = {};                                                   // 叶子节点属性

// 配置项：列表列
unitConfig.grid_columns = [
  // { title: 'uuid1', dataIndex: 'uuid1', width: 260, fixed: 'left' },
  // { title: 'uuid2', dataIndex: 'uuid2', width: 260, fixed: 'left' },
  {
    title: '报关单号', titleTooltip: '报关单号说明......{br}报关单号说明......', dataIndex: 'ckbgdh', width: 220, fixed: 'left', sorter: true,
    render: { func: 'renderCkbgdh' },
    filter: {
      type: 'Select',
      codeTable: 'code_dm_ckts_hgjgfs',
      showCode: true,
    }
  },
  { title: '项号', dataIndex: 'xh4', width: 60, render: { func: 'renderExampleXh4' }, fixed: 'left' },
  { title: '银行账号', dataIndex: 'yhzh', width: 160, render: { func: 'renderExampleYhzh' },
    filter: {
      type: 'Select',
      list: [
        { text: '已结关', value: 'yjg' },
        { text: '未结关', value: 'wjg' },
      ],
    }
  },
  { title: '监管方式代码', dataIndex: 'jgfsDm2', width: 155, render: { type: 'json' } },
  {
    title: '监管方式', dataIndex: 'jgfsDm', width: 155, sorter: true,
    codeTable: 'code_dm_ckts_hgjgfs',
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
    },
    render: {
      tag: [
        { value: '0139', color: 'default' },
        { value: '0130', color: 'error' },
        { value: '', color: 'processing' },
      ],
      icon: [
        { value: '0139', icon: 'CheckOutlined', color: 'default' },
        { value: '0130', icon: 'CoffeeOutlined', color: 'error' },
        { value: '', icon: 'RobotOutlined', color: 'processing' },
      ],
      circle: [
        { value: '0139', color: 'default' },
        { value: '0130', color: 'error' },
        { value: '', color: 'processing' },
      ]
    }
  },
  {
    title: '方式2', dataIndex: 'jgfsDm', width: 155, sorter: true,
    codeTable: 'code_dm_ckts_hgjgfs',
    render: {
      icon: [
        { value: '0139', icon: 'CheckOutlined', color: 'default' },
        { value: '0130', icon: 'CoffeeOutlined', color: 'error', isShowText: false },
        { value: '', icon: 'RobotOutlined', color: 'processing' },
      ],
    }
  },
  { title: '出口日期', dataIndex: 'ckrq1', width: 120, sorter: true, render: { type: 'date', format: 'YYYY-MM-DD' } },
  {
    title: '数据检查状态', dataIndex: 'cytgbz', width: 145, sorter: true,
    filter: {
      type: 'Radio',
      codeTable: 'code_dm_ckts_hgzfjsfs',
    },
    render: { map: [
      { value: 'Y', text: '检查通过' },
      { value: 'N', text: '检查未通过' },
      { value: '', text: '未检查' },
    ], circle: [
      { value: 'Y', color: 'default' },
      { value: 'N', color: 'processing' },
      { value: '', color: 'success' },
    ] }
  },
  {
    title: '审批状态', dataIndex: 'spzt', width: 125, sorter: true,
    filter: {
      type: 'Radio',
      list: [
        { text: '全部', value: 'qb' },
        { text: '通过', value: 'tg' },
        { text: '驳回', value: 'bh' },
      ],
    },
    render: { map: [
      { value: 'Y', text: '通过' },
      { value: 'N', text: '未通过' },
      { value: '', text: '未检查' },
    ]}
  },
  { title: '征免{br}类型', dataIndex: 'zmlx', width: 95, render: { map: [
      { value: '4', text: '免税' },
      { value: '5', text: '征税' },
      { value: '', text: '退税' },
    ], tag: [
      { value: '4', color: 'warning' },
      { value: '5', color: 'processing' },
      { value: '6', color: 'default' },
      { value: '7', color: 'error' },
      { value: '', color: 'success' },
    ] }
  },
  { title: '申报{br}业务', dataIndex: 'sbyw', width: 105, render: { map: [
      { value: '1', text: '退税申报' },
      { value: '2', text: '代理出口' },
      { value: '6', text: '代办退税' },
    ], icon: [
      { value: '1', icon: 'CheckOutlined', color: 'success' },
      { value: '2', icon: 'CoffeeOutlined', color: 'processing' },
      { value: '6', icon: 'RobotOutlined', color: 'default' },
    ] },
  },
  { title: '商品代码', dataIndex: 'ckspDm', width: 95, render: { type: 'mask' } },
  { title: '状态', dataIndex: 'spzt2', width: 95, render: { poweroff: 'handleSetStatus' } },
  { title: '调用耗时', dataIndex: 'usedTime', width: 70, align: 'right', render: { timeEasyRead: true } },
  {
    title: '商品名称', dataIndex: 'ckspmc', width: 180, ellipsis: true,
    filter: {
      type: 'Input',
    }
  },
  { title: '海关商品名称', dataIndex: 'hgspmc', width: 180, render: { copy: true } },
  { title: '出口合同号', dataIndex: 'ckhth', width: 115 },
  {
    title: '成交信息', dataIndex: 'cjxxGroup', children: [
      { title: '成交方式', dataIndex: 'hgcjfsmc', width: 85 },
      { title: '成交单位', dataIndex: 'hgjldwmc', width: 90, ellipsis: true },
      { title: '成交数量', dataIndex: 'cjsl1', width: 140, align: 'right', render: { type: 'number', format: '0,0.0000' } },
      { title: '成交币制', dataIndex: 'cjhghbzmDm', width: 85 },
      { title: '成交金额', dataIndex: 'cjzj', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' }, sum: true, sum2: true, min: true, min2: true, max: true, max2: true, avg: true, avg2: true },
    ]
  },
  { title: '美元离岸价', dataIndex: 'mylaj', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' }, sum: true },
  { title: '法定单位', dataIndex: 'dyjldwDm', width: 110, codeTable: 'code_dm_ckts_hgjldw', ellipsis: true },
  { title: '法定单位数量', dataIndex: 'cksl', width: 140, align: 'right', render: { type: 'number', format: '0,0.0000' }, sum: true, sum2: true, min: true, min2: true, max: true, max2: true, avg: true, avg2: true },
  { title: '第二单位', dataIndex: 'dejldwDm', width: 110, codeTable: 'code_dm_ckts_hgjldw', ellipsis: true },
  { title: '第二单位数量', dataIndex: 'decksl', width: 140, align: 'right', render: { type: 'number', format: '0,0.0000' } },
  { title: '颜色标签', dataIndex: 'ysbq', width: 140, align: 'center', render: { type: 'color' } },
  { title: '隐藏列', dataIndex: 'hiddenCol', width: 130, hidden: true },
];

// 配置项：筛选_普通筛选 页面最上方 第一层筛选
unitConfig.filter_items = [
  { name: 'sbyw', label: '申报业务', type: 'Select', codeTable: 'code_static_bgd_sbyw_dm', tooltip: '申报业务说明...' },
  { name: 'sybz', label: '生成状态', type: 'Select', showType: '3', codeTable: 'code_static_bgd_sbyw_dm' },
  { name: 'zmlx', label: '征免类型', type: 'Select', codeTable: 'code_static_bgd_zmlx_dm' },
  { name: 'czbz1', label: '关单信息', type: 'Select', codeTable: 'code_static_bgd_gdxx_dm' },
  { name: 'ckhth', label: '出口合同号', type: 'Input', },
  { name: 'ckrq1', label: '出口日期', type: 'DatePicker' },
  { name: 'kprq', label: '开票日期', type: 'DatePicker', range: true, layout: CONSTANTS.DEFAULT_FILTER_LAYOUT_66P_ROW }, // , placeholder: ['aaa', 'bbb'] 日期范围的placeholder属性需要传递数组
  { name: 'ckbgdh', label: '报关单号', type: 'Input' },
  { name: 'jgfsDm', label: '监管方式', type: 'Input' },
  { name: 'cytgbz', label: '数据检查状态', type: 'Select', codeTable: 'code_static_bgd_cytgbz_dm' },
  { name: 'cylv', label: '差异率', type: 'InputNumber', range: true },
  { name: 'cylv2', label: '差异率2', type: 'InputNumber' },
  {
    name: 'treeSelect', label: '单证', type: 'TreeSelect', isSelectLeaf: true, showSearch: true, labelInValue: false, treeTable: 'code_dm_badz_01'
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
  { name: 'bgdhgbh', label: '18位或后4位报关单号', type: 'InputTags' },
];

// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
unitConfig.grid_filter_quick = [
  {
    label: '是否结关', name: 'sfjg', type: 'Select', tooltip: '是否结关tooltip', defaultValue: '2',
    codeTable: 'code_static_bgd_sbyw_dm'
    // list: [
    //   { label: '全部', value: 'qb' },
    //   { label: '已结', value: 'yjg' },
    //   { label: '未结', value: 'wjg' },
    // ]
  },
  { label: '报关单号', name: 'bgd', type: 'Input', defaultValue: '1234567890' }, // defaultValue 可选
  // { label: '差异率', name: 'cyl', type: 'Input', tooltip: '差异率tooltip', range: true },
  // { name: 'jgzrhl', type: 'Checkbox', tooltip: '关注日tooltip', list: [
  //   { label: '关注日', value: 'gzr' },
  // ]},
  // { label: '出口日期', name: 'ckrq1', type: 'DatePicker', tooltip: '出口日期tooltip', defaultValue: ['2021-10-10', '2021-10-20'], range: true },
  // { label: '出口日期', name: 'ckrq2', type: 'DatePicker', tooltip: '出口日期tooltip', defaultValue: '2021-11-12' },
  // { label: '报关单', name: 'bgd', type: 'Select', defaultValue: '21', list: [
  //   { label: '18位', value: '18' },
  //   { label: '21位', value: '21' },
  // ]},
];

// 配置项：列表统计字段
unitConfig.grid_sum_field = [
  { label: '成交金额', field: 'cjzj', unit: '元', format: '0,0.00' },
  { label: '成交数量', field: 'cjsl1', format: '0,0.0000' },
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
    { name: 'sybz', label: '生成状态', type: 'Radio', codeTable: 'code_static_bgd_zt_dm' },
    { name: 'zmlx', label: '征免类型', type: 'Checkbox', codeTable: 'code_static_bgd_zmlx_dm' },
    { name: 'czbz1', label: '关单信息', type: 'Select', codeTable: 'code_static_bgd_gdxx_dm' },
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
  { label: '报关单号', type: 'Input', name: 'ckbgdh', tooltip: '报关单号说明...', rules: [
    { type: 'base_required', message: '必录项可选提示信息' },
  ] },
  { label: '出口日期', type: 'DatePicker', name: 'ckrq1', format: 'YYYY-MM-DD', range: true  },
  { label: '出口合同号', type: 'InputNumber', name: 'ckhth', range: true },
  { label: '核销单号', type: 'Input', name: 'hxdh', defaultValue:'12311234' },
  { label: '运输工具名称', type: 'Input', name: 'ysgjmc' },
  { label: '单证1', name: 'dz1', type: 'TreeSelect', isSelectLeaf: true, showSearch: true, labelInValue: false, treeTable: 'code_dm_badz_01' },
  { label: '单证2', name: 'dz2', type: 'TreeSelect', showSearch: true, labelInValue: false, treeTable: 'code_dm_badz_02' },
  { label: '单证3', name: 'dz3', type: 'TreeSelect', isSelectLeaf: true, showSearch: true, labelInValue: false, list: [
      { title: '退税单证', value: '1',
        children: [
          {title: '出口发票', value: '1-1', children: [{title: '出口发票1', value: '1-1-1'}]},
          {title: '进口发票', value: '1-2'}
        ]
      },
      { title: '退税单证2', value: '2'},
      { title: '退税单证3', value: '3', children: [
          { title: '退税单证3-1', value: '3-1', children: [{title: '退税单证3-1-1', value: '3-1-1'}, {title: '退税单证3-1-2', value: '3-1-2'}]},
          { title: '退税单证3-2', value: '3-2'}
      ]},
      ]
  },
  { label: '单证1Cascader', name: 'dz1c', type: 'Cascader', treeTable: 'code_dm_badz_01' },
  { label: '监管方式代码', type: 'Input', name: 'jgfsDm' },
  { label: '海关成交方式', type: 'Select', name: 'hgcjfsmc', codeTable: 'code_static_hgcjfs_mc' },
  { label: '国别', type: 'Select', name: 'gb',  list: [
      { name: '中国', value: 'china' },
      { name: '日本', value: 'japan' },
      { name: '韩国', value: 'korea' },
  ] },
  { label: '成交海关货币字母代码', type: 'Input', name: 'cjhghbzmDm' },
  { label: '成交总价', type: 'InputNumber', name: 'cjzj', format: '0,0.00' },
  { label: '运费海关货币字母代码', type: 'Input', name: 'yfhghbzmDm' },
  { label: '运费金额', type: 'InputNumber', name: 'yfje', format: '0,0.00' },
  { label: '运费计算方式代码', type: 'Select', name: 'yfjsfsDm', codeTable: 'code_dm_ckts_hgyfjsfs' },
  { label: '运费折算数量', type: 'InputNumber', name: 'yfzssl', format: '0,0.0000' },
  { label: '保费海关货币字母代码', type: 'Input', name: 'bfhghbzmDm' },
  { label: '保费金额', type: 'InputNumber', name: 'bfje', format: '0,0.00' },
  { label: '保费计算方式代码', type: 'Select', name: 'bfjsfsDm', codeTable: 'code_dm_ckts_hgbfjsfs' },
  { label: '杂费海关货币字母代码', type: 'Input', name: 'zfhghbzmDm' },
  { label: '杂费金额', type: 'InputNumber', name: 'zfje1', format: '0,0.00' },
  { label: '杂费计算方式代码', type: 'Select', name: 'zfjsfsDm', codeTable: 'code_dm_ckts_hgzfjsfs' },
  { label: '商品信息', type: 'GroupTitle', name: 'spxx' },
  { label: '出口商品代码', type: 'Input', name: 'ckspDm' },
  { label: '出口商品名称', type: 'Input', name: 'ckspmc', readOnly: true },
  { label: '海关商品名称', type: 'Input', name: 'hgspmc' },
  { label: '成交计量单位', type: 'Input', name: 'hgjldwmc' },
  { label: '成交数量', type: 'InputNumber', name: 'cjsl1', format: '0,0.0000' },
  { label: '法定计量单位', type: 'Input', name: 'dyjldwDm' },
  { label: '法定数量', type: 'InputNumber', name: 'cksl', format: '0,0.0000' },
  { label: '第二计量单位', type: 'Input', name: 'dejldwDm', disabled: true },
  { label: '第二出口数量', type: 'InputNumber', name: 'decksl', format: '0,0.0000', disabled: true },
  { label: '弹窗取值', type: 'Input', name: 'valFromModal', eventOnSearch: 'onSearch1', readOnly: true },
  { label: '规格型号', type: 'Input', name: 'ggxh', layout: CONSTANTS.DEFAULT_FORM_LAYOUT_66P_ROW },
  { label: '数据检查标志', type: 'Hidden', name: 'cytgbz' },
  { label: '子表展现', type: 'GroupTitle', name: 'qtxx' },
  { label: '商品信息列表', name: 'spxxArray', type: 'List', children: [
    { label: '货物名称', name: 'spmc', type: 'Input', rules: [ { type: 'base_required' }, { type: 'base_string', range: [0, 150] }] },
    { label: '单位', name: 'dw', type: 'Input', rules: [{ type: 'base_string', range: [0, 150] }] },
    { label: '数量', name: 'sl', type: 'InputNumber', format: '0,0.00000', rules: [{ type: 'base_number', length: 15, decimal: 5}] },
    { label: '国别', type: 'Select', name: 'gb',  list: [
      { name: '中国', value: 'china' },
      { name: '日本', value: 'japan' },
      { name: '韩国', value: 'korea' },
    ] },
    { label: '计算方式代码', type: 'Select', name: 'yfjsfsDm', codeTable: 'code_dm_ckts_hgyfjsfs' },
  ] },
  { label: '其他信息', type: 'GroupTitle', name: 'qtxx' },
  // { label: '备注', type: 'TextArea', name: 'bz', layout: {
  //   item: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 },
  //   labelcol: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 },
  //   wrappercol: { xs: 22, sm: 22, md: 22, lg: 22, xl: 22, xxl: 22 },
  // } },
  // 自定义layout autoSize
  { label: '备注', type: 'TextArea', name: 'bz', autoSize: { minRows:3, maxRows: 3}, layout: CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW },
  { label: '附件1', type: 'Upload', name: 'fj1', maxCount: 3, layout: CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW, tooltip: '支持上传PDF/JPG/PNG/JPEG格式文件且大小不应超过10M', rules: [
    { type: 'base_required' }
  ] },
  { label: '附件2', type: 'Upload', name: 'fj2', layout: CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW },
];

// 配置项：批量修改表单项
unitConfig.batch_update_items = [
  { dataIndex: 'ssq', label: '所属期', type: "Input" },
  { dataIndex: 'ybhl', label: '原币汇率', type: "InputNumber" },
  { dataIndex: 'myhl', label: '美元汇率', type: "InputNumber" },
  { dataIndex: 'ckfph', label: '出口发票号', type: "Input" },
  { dataIndex: 'ckrq1', label: '出口日期', type: "Date" },
  { dataIndex: 'cktmsywlxdmjh', label: '业务类型代码', type: "tableSelect", codeTable: 'CODE_DM_CKTS_CKTMSYWLX' },
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
  statistics: true,                 // 是否显示统计按钮，默认关闭
  advanced_filter: true,                 // 是否显示统计按钮，默认关闭
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: true,                       // 是否显示编辑链接，默认关闭
  delete: true,                     // 是否显示删除链接，默认关闭
  detail: true,                     // 是否显示详情链接，默认关闭
  editConfig: {
    disabled: 'setEditDisabled',
  },
  deleteConfig: {
    disabled: 'setDeleteDisabled',
  },
};

// 配置项：自定义工具栏
unitConfig.customer_toolbar = [
  { name: '测一', key: 'cs1', func: 'handleCostomerToobar1' },
  { name: '测二', key: 'cs2', func: 'handleCostomerToobar2', disabled: true },
  {
    name: '红冲', type: 'dropdown', list: [
      { name: '设置红冲', func: 'handleCostomerToobar1', key: 'dropdowncs1' },
      { name: '取消红冲', func: 'handleCostomerToobar2', key: 'dropdowncs2' },
    ]
  },
  { name: '导入', key: 'mydr', func: 'handleCostomerImport' },
  { name: '创建表', key: 'mydr2', func: 'importDbTable' },
  { name: '初始化表数据', key: 'mydr2', func: 'importDbTableData' },
];

// 配置项：自定义操作列
unitConfig.handle_columns = [
  { name: '测试1', key: 'cs11', func: 'handleColumns1' },
  { name: '测试2', key: 'cs12', func: 'handleColumns2' },
  { name: '测试3', key: 'cs13', func: 'handleColumns3', disabled: 'setCs3Disabled' },  // disabled: true false 自定义方法
];

export default unitConfig;