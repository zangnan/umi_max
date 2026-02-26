import CONSTANTS from '../DDAssist/constants';
const unitConfig: any = {};

unitConfig.module_key = 'EXAMPLE_DATA_PAGE_1';                                          // 业务单元key，对应后端接口
unitConfig.page_id = 'example_list_1';                                                // 页面id
unitConfig.layout_type = 'default';                                                   // 页面类型，默认default 可选 default modal tabs
unitConfig.form_title = 'BGD';                                                        // 表单：标题，可选
unitConfig.grid_show_serial_number = true;                                            // 列表：是否显示序号，默认不显示
unitConfig.grid_title = { type: 'function', func: 'setGridTitle' };                   // 列表：标题，可选 object 或 string
unitConfig.grid_click_checked = '1';                                                  // 列表：是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
unitConfig.toolbar_show_grid_checked_num = true;                                      // 工具栏：是否显示数据条数及选中数，默认false关闭

unitConfig.grid_columns = [
  {
    title: '报关单号', titleTooltip: '报关单号说明......{br}报关单号说明......', dataIndex: 'ckbgdh', width: 220, fixed: 'left', sorter: true,
    render: { func: 'renderCkbgdh' },
    filter: {
      type: 'Select',
      codeTable: 'code_dm_ckts_hgjgfs',
      showCode: true,
    },
    dictFieldId: 'uuid_mts_tssb_ckbgdh', dictFieldName: 'ckbgdh', dictObjectTableName: 'mts_tssb'
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
  { title: '出口日期', dataIndex: 'ckrq1', width: 120, sorter: true, render: { type: 'date', format: 'YYYY-MM-DD' },
    dictFieldId: 'uuid_mts_tssb_ckrq', dictFieldName: 'ckrq', dictObjectTableName: 'mts_tssb' },
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
  { title: 'Poweroff', dataIndex: 'poweroff', width: 95, render: { poweroff: 'handleSetStatus' } },
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
      { title: '成交金额', dataIndex: 'cjzj', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' }, sum: true, sum2: true },
    ]
  },
  { title: '美元离岸价', dataIndex: 'mylaj', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' }, sum: true },
  { title: '法定单位', dataIndex: 'dyjldwDm', width: 90, codeTable: 'code_dm_ckts_hgjldw', ellipsis: true },
  { title: '法定单位数量', dataIndex: 'cksl', width: 140, align: 'right', render: { type: 'number', format: '0,0.0000' }, sum: true, sum2: true },
  { title: '第二单位', dataIndex: 'dejldwDm', width: 90, codeTable: 'code_dm_ckts_hgjldw', ellipsis: true },
  { title: '第二单位数量', dataIndex: 'decksl', width: 140, align: 'right', render: { type: 'number', format: '0,0.0000' } },
  { title: '隐藏列', dataIndex: 'hiddenCol', width: 130, hidden: true },
];

unitConfig.filter_items = [
  { name: 'sbyw', label: '申报业务', type: 'Select', codeTable: 'code_static_bgd_sbyw_dm', tooltip: '申报业务说明...' },
  { name: 'sybz', label: '生成状态', type: 'Select', showType: '3', codeTable: 'code_static_bgd_sbyw_dm' },
  { name: 'zmlx', label: '征免类型', type: 'Select', codeTable: 'code_static_bgd_zmlx_dm' },
  { name: 'czbz1', label: '关单信息', type: 'Select', codeTable: 'code_static_bgd_gdxx_dm' },
  { name: 'ckhth', label: '出口合同号', type: 'Input', },
  { name: 'ckrq1', label: '出口日期', type: 'DatePicker' },
  { name: 'kprq', label: '开票日期', type: 'DatePicker', range: true, layout: CONSTANTS.DEFAULT_FILTER_LAYOUT_66P_ROW },
  { name: 'ckbgdh', label: '报关单号', type: 'Input' },
  { name: 'jgfsDm', label: '监管方式', type: 'Input' },
  { name: 'cytgbz', label: '数据检查状态', type: 'Select', codeTable: 'code_static_bgd_cytgbz_dm' },
  { name: 'cylv', label: '差异率', type: 'Input', range: true },
  {
    name: 'treeSelect', label: '单证', type: 'TreeSelect', isSelectLeaf: true, showSearch: true, labelInValue: false, treeTable: 'code_dm_badz_01'
  },
  { name: 'bgdhgbh', label: '18位或后4位报关单号', type: 'InputTags' },
];

unitConfig.grid_filter_quick = [
  {
    label: '是否结关', name: 'sfjg', type: 'Select', tooltip: '是否结关tooltip', defaultValue: '2',
    codeTable: 'code_static_bgd_sbyw_dm'
  },
  { label: '报关单号', name: 'bgd', type: 'Input', defaultValue: '1234567890' },
];

unitConfig.grid_sum_field = [
  { label: '成交金额', field: 'cjzj', unit: '元', format: '0,0.00' },
  { label: '成交数量', field: 'cjsl1', format: '0,0.0000' },
];

unitConfig.form_items = [
  { label: 'ID', type: 'Hidden', name: 'uuid' },
  { label: '基本信息', type: 'GroupTitle', name: 'jbxx' },
  { label: '报关单号', type: 'Input', name: 'ckbgdh', tooltip: '报关单号说明...', rules: [
    { type: 'base_required', message: '必录项可选提示信息' },
  ] },
  { label: '出口日期', type: 'DatePicker', name: 'ckrq1', format: 'YYYY-MM-DD', range: true  },
  { label: '出口合同号', type: 'Input', name: 'ckhth', range: true },
  { label: '核销单号', type: 'Input', name: 'hxdh', defaultValue:'12311234' },
  { label: '运输工具名称', type: 'Input', name: 'ysgjmc' },
  { label: '单证1', name: 'dz1', type: 'TreeSelect', isSelectLeaf: true, showSearch: true, labelInValue: false, treeTable: 'code_dm_badz_01' },
  { label: '单证2', name: 'dz2', type: 'TreeSelect', isSelectLeaf: true, showSearch: true, labelInValue: false, list: [
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
  { label: '第二计量单位', type: 'Input', name: 'dejldwDm' },
  { label: '第二出口数量', type: 'InputNumber', name: 'decksl', format: '0,0.0000' },
  { label: '规格型号', type: 'Input', name: 'ggxh' },
  { label: '数据检查标志', type: 'Hidden', name: 'cytgbz' },
  { label: '其他信息', type: 'GroupTitle', name: 'qtxx' },
  { label: '备注', type: 'TextArea', name: 'bz', layout: {
    item: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 },
    labelcol: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 },
    wrappercol: { xs: 22, sm: 22, md: 22, lg: 22, xl: 22, xxl: 22 },
  } },
];

unitConfig.toolbar_default = {
  add: true,                        // 是否显示增加按钮，默认关闭
  edit: true,                        // 是否显示修改按钮，默认关闭
  delete: true,                    // 是否显示删除按钮，默认关闭
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  download: true,                   // 是否显示导出按钮，默认关闭
  upload: true,                     // 是否显示导入按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
};

unitConfig.grid_handle_columns_default = {
  edit: true,                       // 是否显示编辑链接，默认关闭
  delete: true,                     // 是否显示删除链接，默认关闭
};

unitConfig.customer_toolbar = [
  { name: '测一', key: 'cs1', func: 'handleCostomerToobar1' },
  { name: '测二', key: 'cs2', func: 'handleCostomerToobar2', disabled: true },
  {
    name: '红冲', type: 'dropdown', list: [
      { name: '设置红冲', func: 'handleCostomerToobar1' },
      { name: '取消红冲', func: 'handleCostomerToobar2' },
    ]
  },
  { name: '导入', key: 'mydr', func: 'handleCostomerImport' }
];

unitConfig.handle_columns = [
  { name: '事项通知书', key: 'cs1', func: 'handleColumns1' },
  { name: '随附单据', key: 'cs2', func: 'handleColumns2', disabled: 'setCs2Disabled' },  // disabled: true false 自定义方法
];

unitConfig.db_fields = [
  { uuid: '11', dictFieldId: 'uuid_mts_tsjh_ssq', dictObjectId: 'mts_tsjh', dictObjectTableName: 'mts_tsjh', dictObjectDesc: '进货明细申报', dictFieldName: 'ssq', dictFieldDesc: '申报年月', dictFieldType: 'varcher(32)' },
  { uuid: '12', dictFieldId: 'uuid_mts_tsjh_sbpc', dictObjectId: 'mts_tsjh', dictObjectTableName: 'mts_tsjh', dictObjectDesc: '进货明细申报', dictFieldName: 'sbpc', dictFieldDesc: '申报批次', dictFieldType: 'varcher(32)' },
  { uuid: '13', dictFieldId: 'uuid_mts_tsjh_cytgbz', dictObjectId: 'mts_tsjh', dictObjectTableName: 'mts_tsjh', dictObjectDesc: '进货明细申报', dictFieldName: 'cytgbz', dictFieldDesc: '数据检查状态', dictFieldType: 'varcher(32)' },
  { uuid: '14', dictFieldId: 'uuid_mts_tsjh_jhpzh', dictObjectId: 'mts_tsjh', dictObjectTableName: 'mts_tsjh', dictObjectDesc: '进货明细申报', dictFieldName: 'jhpzh', dictFieldDesc: '进货凭证号', dictFieldType: 'varcher(32)' },
  { uuid: '15', dictFieldId: 'uuid_mts_tsjh_kprq', dictObjectId: 'mts_tsjh', dictObjectTableName: 'mts_tsjh', dictObjectDesc: '进货明细申报', dictFieldName: 'kprq', dictFieldDesc: '开票日期', dictFieldType: 'datetime' },
  { uuid: '16', dictFieldId: 'uuid_mts_tsjh_ghfnsrsbh1', dictObjectId: 'mts_tsjh', dictObjectTableName: 'mts_tsjh', dictObjectDesc: '进货明细申报', dictFieldName: 'ghfnsrsbh1', dictFieldDesc: '纳税人识别号', dictFieldType: 'varcher(32)' },
  { uuid: '17', dictFieldId: 'uuid_mts_tsjh_tse', dictObjectId: 'mts_tsjh', dictObjectTableName: 'mts_tsjh', dictObjectDesc: '进货明细申报', dictFieldName: 'tse', dictFieldDesc: '可退税额', dictFieldType: 'decimal(18,6)' },
  { uuid: '18', dictFieldId: 'uuid_mts_tsjh_bz', dictObjectId: 'mts_tsjh', dictObjectTableName: 'mts_tsjh', dictObjectDesc: '进货明细申报', dictFieldName: 'bz', dictFieldDesc: '备注', dictFieldType: 'varcher(32)' },
  { uuid: '21', dictFieldId: 'uuid_mts_tssb_ssq', dictObjectId: 'mts_tssb', dictObjectTableName: 'mts_tssb', dictObjectDesc: '出口明细申报', dictFieldName: 'ssq', dictFieldDesc: '申报年月', dictFieldType: 'varcher(32)' },
  { uuid: '22', dictFieldId: 'uuid_mts_tssb_sbpc', dictObjectId: 'mts_tssb', dictObjectTableName: 'mts_tssb', dictObjectDesc: '出口明细申报', dictFieldName: 'sbpc', dictFieldDesc: '申报批次', dictFieldType: 'varcher(32)' },
  { uuid: '23', dictFieldId: 'uuid_mts_tssb_glh', dictObjectId: 'mts_tssb', dictObjectTableName: 'mts_tssb', dictObjectDesc: '出口明细申报', dictFieldName: 'glh', dictFieldDesc: '关联号', dictFieldType: 'varcher(32)' },
  { uuid: '24', dictFieldId: 'uuid_mts_tssb_ckbgdh', dictObjectId: 'mts_tssb', dictObjectTableName: 'mts_tssb', dictObjectDesc: '出口明细申报', dictFieldName: 'ckbgdh', dictFieldDesc: '报关单号', dictFieldType: 'varcher(32)' },
  { uuid: '25', dictFieldId: 'uuid_mts_tssb_dlzmh', dictObjectId: 'mts_tssb', dictObjectTableName: 'mts_tssb', dictObjectDesc: '出口明细申报', dictFieldName: 'dlzmh', dictFieldDesc: '代理证明号', dictFieldType: 'varcher(32)' },
  { uuid: '26', dictFieldId: 'uuid_mts_tssb_tse', dictObjectId: 'mts_tssb', dictObjectTableName: 'mts_tssb', dictObjectDesc: '出口明细申报', dictFieldName: 'tse', dictFieldDesc: '退税额', dictFieldType: 'decimal(18,6)' },
  { uuid: '27', dictFieldId: 'uuid_mts_tssb_ckrq', dictObjectId: 'mts_tssb', dictObjectTableName: 'mts_tssb', dictObjectDesc: '出口明细申报', dictFieldName: 'ckrq', dictFieldDesc: '出口日期', dictFieldType: 'datetime' },
  { uuid: '28', dictFieldId: 'uuid_mts_tssb_ckspDm', dictObjectId: 'mts_tssb', dictObjectTableName: 'mts_tssb', dictObjectDesc: '出口明细申报', dictFieldName: 'ckspDm', dictFieldDesc: '商品代码', dictFieldType: 'varcher(32)' },
  { uuid: '29', dictFieldId: 'uuid_mts_tssb_sbhgspmc', dictObjectId: 'mts_tssb', dictObjectTableName: 'mts_tssb', dictObjectDesc: '出口明细申报', dictFieldName: 'sbhgspmc', dictFieldDesc: '商品名称', dictFieldType: 'varcher(32)' },
  { uuid: '31', dictFieldId: 'uuid_zmkj_zxsb_zm_dljk_ssq', dictObjectId: 'zmkj_zxsb_zm_dljk', dictObjectTableName: 'zmkj_zxsb_zm_dljk', dictObjectDesc: '代理进口货物证明', dictFieldName: 'ssq', dictFieldDesc: '申报年月', dictFieldType: 'varcher(32)' },
  { uuid: '32', dictFieldId: 'uuid_zmkj_zxsb_zm_dljk_sbpc', dictObjectId: 'zmkj_zxsb_zm_dljk', dictObjectTableName: 'zmkj_zxsb_zm_dljk', dictObjectDesc: '代理进口货物证明', dictFieldName: 'sbpc', dictFieldDesc: '申报批次', dictFieldType: 'varcher(32)' },
  { uuid: '33', dictFieldId: 'uuid_zmkj_zxsb_zm_dljk_wtfnsrmc', dictObjectId: 'zmkj_zxsb_zm_dljk', dictObjectTableName: 'zmkj_zxsb_zm_dljk', dictObjectDesc: '代理进口货物证明', dictFieldName: 'wtfnsrmc', dictFieldDesc: '委托企业名称', dictFieldType: 'varcher(32)' },
  { uuid: '34', dictFieldId: 'uuid_zmkj_zxsb_zm_dljk_wtfnsrsbh', dictObjectId: 'zmkj_zxsb_zm_dljk', dictObjectTableName: 'zmkj_zxsb_zm_dljk', dictObjectDesc: '代理进口货物证明', dictFieldName: 'wtfnsrsbh', dictFieldDesc: '委托企业税号', dictFieldType: 'varcher(32)' },
];

export default unitConfig;