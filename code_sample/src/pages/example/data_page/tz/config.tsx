/**
 * title: 数据封装页面
 */
const unitConfig: any = {};

// 配置项
unitConfig.unit_key = 'EXAMPLE_DATA_PAGE_1';                    // 业务单元key，对应后端接口
unitConfig.page_id = 'example_list_1';                          // 页面id
unitConfig.grid_show_serial_number = true;                      // 是否显示序号，默认不显示
unitConfig.grid_selection_type = false;                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
unitConfig.grid_show_data_num = false;                          // 工具栏左侧是否显示数据条数及选中数，默认true显示
unitConfig.show_toolbar = true;                                 // 是否开启工具栏，默认true开启
unitConfig.layout_type = 'tz';                                  // 页面类型，默认default 可选 default modal tabs tz台账
unitConfig.grid_scroll_x = '700px';                             // 默认700px
// unitConfig.grid_sticky_affix = 94;                           // 列表锁定高度，如果layout_type=default,自动设置94；tabs，134
// unitConfig.toobar_affix = 44;                                // 工具条锁定高度，如果layout_type=default,自动设置44；tabs，84

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '报关单号', titleTooltip: '报关单号说明......{br}报关单号说明......', dataIndex: 'ckbgdh', width: 180, fixed: 'left', sorter: true,
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
  { title: '项号', dataIndex: 'xh4', width: 60, render: { func: 'renderExampleXh4' }, fixed: 'left' },
  { title: '监管方式', dataIndex: 'jgfsDm', width: 135, sorter: true, codeTable: ['code_dm_ckts_hgjgfs', '01'],
    filter: {
      type: 'Tree',
      list: [
        { text: '数据状态', value: 'sjzt', children: [
          { text: '已结关', value: 'yjg', },
          { text: '未结关', value: 'wjg', },
        ]},
        { text: '报关单', value: 'bgd', children: [
          { text: '18位', value: '18', },
          { text: '21位', value: '21', },
        ]},
      ]
    }
  },
  { title: '出口日期', dataIndex: 'ckrq1', width: 120, sorter: true, render: { type: 'date', format: 'yyyy-MM-DD' }},
  { title: '数据检查状态', dataIndex: 'cytgbz', width: 135, sorter: true, render: { func: 'renderCytgbz' },
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
  { title: '商品名称', dataIndex: 'ckspmc', width: 180, ellipsis: true,
    filter: {
      type: 'Input',
    }},
  { title: '海关商品名称', dataIndex: 'hgspmc', width: 180 },
  { title: '出口合同号', dataIndex: 'ckhth', width: 115 },
  { title: '成交信息', dataIndex: 'cjxxGroup', children: [
    { title: '成交方式', dataIndex: 'hgcjfsmc', width: 85 },
    { title: '成交单位', dataIndex: 'hgjldwmc', width: 90, ellipsis: true },
    { title: '成交数量', dataIndex: 'cjsl1', width: 140, align: 'right', render: { type: 'number', format: '0,0.0000' } },
    { title: '成交币制', dataIndex: 'cjhghbzmDm', width: 85 },
    { title: '成交金额', dataIndex: 'cjzj', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
  ]},
  { title: '美元离岸价', dataIndex: 'mylaj', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '法定单位', dataIndex: 'dyjldwDm', width: 90, codeTable: ['code_dm_ckts_hgjldw', '01'], ellipsis: true },
  { title: '法定单位数量', dataIndex: 'cksl', width: 140, align: 'right', render: { type: 'number', format: '0,0.0000' } },
  { title: '第二单位', dataIndex: 'dejldwDm', width: 90, codeTable: ['code_dm_ckts_hgjldw', '01'], ellipsis: true },
  { title: '第二单位数量', dataIndex: 'decksl', width: 140, align: 'right', render: { type: 'number', format: '0,0.0000' } },
];

// 配置项：筛选_普通筛选 页面最上方 第一层筛选
unitConfig.filter_items = [
  { name: 'sbyw', label: '申报业务', type: 'Select', codeTable: ['code_static_bgd_sbyw_dm', '01'], tooltip: '申报业务说明...' },
  { name: 'sybz', label: '生成状态', type: 'Select', codeTable: ['code_static_bgd_zt_dm', '01'] },
  { name: 'zmlx', label: '征免类型', type: 'Select', codeTable: ['code_static_bgd_zmlx_dm', '01'] },
  { name: 'czbz1', label: '关单信息', type: 'Select', codeTable: ['code_static_bgd_gdxx_dm', '01'] },
  { name: 'ckhth', label: '出口合同号', type: 'Input', },
  { name: 'jgfsDm', label: '监管方式', type: 'Input' },
];

// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
unitConfig.grid_filter_quick = [
  { label: '是否结关', name: 'sfjg', type: 'Select', tooltip: '是否结关tooltip', onChange: 'handleOnChange', defaultValue: 'yjg', isReload: false, list: [
    { label: '全部', value: 'qb' },
    { label: '已结', value: 'yjg' },
    { label: '未结', value: 'wjg' },
  ]},
  { label: '报关单号', name: 'bgd', type: 'Input', tooltip: '报关单号tooltip', onPressEnter: 'handleOnChange', onSearch: 'handleOnChange', validator: 'grid_filter_quick_bgd' },
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  tzUpdateData: true,               // 是否显示更新台账数据，默认关闭
  tzExport: true,                   // 是否显示导出，默认关闭
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
};

export default unitConfig;