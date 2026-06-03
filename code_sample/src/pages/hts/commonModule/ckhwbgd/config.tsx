/**
 * title: 备案单证 - 单证备案 - 单证备案
 */
 import { itemType } from '@/components/DDForm/data.d';

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
ckbgdConfig.export_key = 'EXCEL_REPORT_WBSJ_CKBGD'; // 业务单元key，对应后端接口
ckbgdConfig.form_title = '报关单数据';

// 配置列表列
ckbgdConfig.grid_columns = [
  { title: 'uuid', dataIndex: 'uuid', width: 180,  sorter: true, fixed: 'left' ,hidden:true },
  { title: '报关单号', dataIndex: 'ckbgdh', width: 180,  sorter: true, fixed: 'left' , render: { func: 'renderBgdscmx18bgdh' } },
  { title: '项号', dataIndex: 'xh4', width: 80,  fixed: 'left' },
  { title: '出口日期', dataIndex: 'ckrq1', width: 120, sorter: true , fixed: 'left' ,render: { type: 'date', format: 'yyyy-MM-DD' } },
  // { title: '数据检查状态', dataIndex: 'cytgbz', width: 130, sorter: true  , render: { func: 'cytgbzCl' } },
  { title: '征免类型', dataIndex: 'zmlx', width: 100, render: { func: 'zmlx' } },
  { title: '申报业务', dataIndex: 'sbyw', width: 100, render: { func: 'sbyw' } },
  { title: '海关商品代码', dataIndex: 'hgckspDm', width: 120 },
  { title: '海关商品名称', dataIndex: 'hgspmc', width: 180, ellipsis: true },
  { title: '商品代码', dataIndex: 'ckspDm', width: 120 },
  { title: '商品名称', dataIndex: 'ckspmc', width: 180, ellipsis: true },
  { title: '出口合同号', dataIndex: 'ckhth', width: 150, ellipsis: true },
  { title: '出口发票号', dataIndex: 'ckfph', width: 150, ellipsis: true },
  { title: '监管方式', dataIndex: 'jgfsDm', width: 120, codeTable: ['code_dm_ckts_hgjgfs', '01'] , sorter: true },
  { title: '成交方式', dataIndex: 'hgcjfsmc', width: 120 },
  { title: '成交单位', dataIndex: 'sbjldwmc', width: 80 , ellipsis: true},
  { title: '成交数量', dataIndex: 'cjsl1', width: 140, align: 'right' , render: { type: 'number', format: '0,0.00000' } },
  { title: '成交币制', dataIndex: 'cjhghbzmDm', width: 70, },
  { title: '成交金额', dataIndex: 'cjzj', width: 140, align: 'right' , render: { type: 'number', format: '0,0.00' } },
  { title: '美元离岸价', dataIndex: 'mylaj', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '法定单位', dataIndex: 'hgjldwmc', width: 80 , ellipsis: true},
  { title: '法定单位数量', dataIndex: 'cksl', width: 140,  align: 'right' , render: { type: 'number', format: '0,0.00000' } },
  { title: '第二单位', dataIndex: 'dejldwDm', width: 120, ellipsis: true, codeTable: ['code_dm_ckts_hgjldw', '01'] },
  { title: '第二单位数量', dataIndex: 'decksl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' } },
];

ckbgdConfig.grid_columns2 = [
  { title: 'uuid', dataIndex: 'uuid', width: 180, fixed: 'left' ,hidden:true},
  { title: '出口报关单号', dataIndex: 'ckbgdh', width: 200,  sorter: true, fixed: 'left' , render: { func: 'renderBgdscmx18bgdh' }},
  { title: '项号', dataIndex: 'xh4', width: 80,  fixed: 'left' },
  { title: '出口日期', dataIndex: 'ckrq1', width: 120, sorter: true , fixed: 'left' ,render: { type: 'date', format: 'yyyy-MM-DD' } },
  { title: '数据检查状态', dataIndex: 'cytgbz', width: 130, render: { func: 'cytgbzCl' },
    filter: {
      type: 'Radio',
      codeTable: ['code_static_bgd_cytgbz_dm', '02'],
    },
  },
  { title: '征免类型', dataIndex: 'zmlx', width: 100, render: { func: 'zmlx' },
    filter: {
      type: 'Radio',
      codeTable: ['code_static_bgd_zmlx_dm', '02'],
    },
  },
  { title: '申报业务', dataIndex: 'sbyw', width: 100, render: { func: 'sbyw' },
    filter: {
      type: 'Radio',
      codeTable: ['code_static_bgd_sbyw_dm', '03'],
    },
  },
  { title: '商品代码', dataIndex: 'ckspDm', width: 120 },
  { title: '海关商品名称', dataIndex: 'ckspmc', width: 180, ellipsis: true },
  { title: '规格型号', dataIndex: 'hgspmc', width: 160, ellipsis: true },
  { title: '出口合同号', dataIndex: 'ckhth', width: 150, ellipsis: true },
  { title: '备案号', dataIndex: 'bah', width: 150, ellipsis: true },
  { title: '监管方式', dataIndex: 'jgfsDm', width: 120, codeTable: ['code_dm_ckts_hgjgfs', '01'] },
  { title: '成交方式', dataIndex: 'hgcjfsmc', width: 120 },
  { title: '成交单位', dataIndex: 'sbjldwmc', width: 120, ellipsis: true},
  { title: '成交数量', dataIndex: 'cjsl1', width: 140,  align: 'right' , render: { type: 'number', format: '0,0.00000' } },
  { title: '成交币制', dataIndex: 'cjhghbzmDm', width: 70, },
  { title: '成交总价', dataIndex: 'cjzj', width: 140, align: 'right' , render: { type: 'number', format: '0,0.00' } },
  { title: '美元离岸价', dataIndex: 'mylaj', width: 100, align: 'right', render: { type: 'number', format: '0,0.00' } },
  { title: '法定单位', dataIndex: 'hgjldwmc', width: 120 },
  { title: '法定出口数量', dataIndex: 'cksl', width: 140,  align: 'right' , render: { type: 'number', format: '0,0.00000' }},
  { title: '第二计量单位', dataIndex: 'dejldwDm', width: 120, ellipsis: true, codeTable: ['code_dm_ckts_hgjldw', '01'], },
  { title: '第二单位出口数量', dataIndex: 'decksl', width: 140, align: 'right', render: { type: 'number', format: '0,0.00000' } },
  { title: '境外收发货人', dataIndex: 'jwshrmc', width: 150, ellipsis: true },
  { title: '统一编号', dataIndex: 'bgdtybh', width: 180, ellipsis: true },
  // { title: '关单信息', dataIndex: 'czbz1', width: 120, codeTable: ['code_static_bgd_czbz1_dm', '01'],
  //   filter: {
  //     type: 'Radio',
  //     codeTable: ['code_static_bgd_czbz1_dm', '01'],
  //   },
  // },
  // { title: '使用标志', dataIndex: 'sybz', width: 120, codeTable: ['code_static_bgd_sybz_dm', '01'],
  //   filter: {
  //     type: 'Radio',
  //     codeTable: ['code_static_bgd_sybz_dm', '01'],
  //   },
  // },
];


ckbgdConfig.form_items = [
  { label: 'ID', type: itemType.Hidden, name: 'uuid' },
  { label: '基本信息', type: itemType.GroupTitle, name: 'jbxx' },
  {
    label: '报关单号', type: itemType.Input, name: 'ckbgdh', rules: [
      { type: 'base_required', message: '该项内容为必填项不能为空！' },
      { type: 'base_string', length: '21' },
      { func: 'bgdhOnBlur' }
    ]
  },
  {
    label: '出口日期', type: itemType.DatePicker, name: 'ckrq1', format: 'YYYY-MM-DD', rules: [
      { type: 'base_required', message: '该项内容为必填项不能为空！' },
    ]
  },
  {
    label: '出口合同号', type: itemType.Input, name: 'ckhth', rules: [
      { type: 'base_string', range: [0, 30] },
    ]
  },
  {
    label: '核销单号', type: itemType.Input, name: 'hxdh', rules: [
      { type: 'base_string', range: [0, 30] },
    ]
  },
  {
    label: '运输工具名称', type: itemType.Input, name: 'ysgjmc', rules: [
      { type: 'base_string', range: [0, 30] },
    ]
  },
  { label: '监管方式代码', type: itemType.Select, name: 'jgfsDm', codeTable: ['CODE_DM_CKTS_HGJGFS', '01'], showType: '3', showSearch: true, rules: [{ type: 'base_required' },] },


  { label: '海关成交方式', type: itemType.Select, name: 'hgcjfsmc', showSearch: true, codeTable: ['code_static_hgcjfs_mc', '01'], rules: [{ type: 'base_required', message: '该项内容为必填项不能为空！' },] },
  { label: '成交海关货币字母代码', type: itemType.Select, name: 'cjhghbzmDm', showSearch: true, showType: '3', codeTable: ['code_dm_gy_hb', '01'], rules: [{ type: 'base_required', message: '该项内容为必填项不能为空！' },] },
  {
    label: '成交总价', type: itemType.InputNumber, name: 'cjzj', format: '0,0.00', rules: [
      { type: 'base_required', message: '该项内容为必填项不能为空！' },
      { type: 'base_number', length: 14, decimal: 2 },
      { type: 'base_number', range: '+-' },
    ]
  },

  { label: '运费海关货币字母代码', type: itemType.Select, name: 'yfhghbzmDm', showSearch: true, showType: '3', codeTable: ['code_dm_gy_hb', '01'] },
  {
    label: '运费金额', type: itemType.InputNumber, name: 'yfszl', format: '0,0.000000', rules: [
      { type: 'base_number', length: 14, decimal: 6 },
    ]
  },
  { label: '运费计算方式代码', type: itemType.Select, name: 'yfjsfsDm', allowClear: true, codeTable: ['code_dm_ckts_hgyfjsfs', '01'] },

  {
    label: '运费折算数量', type: itemType.InputNumber, name: 'yfzssl', format: '0,0.00000', rules: [
      { type: 'base_number', range: [0, 14] },
    ]
  },
  { label: '保费海关货币字母代码', type: itemType.Select, name: 'bfhghbzmDm', showSearch: true, allowClear: true, showType: '3', codeTable: ['code_dm_gy_hb', '01'] },
  {
    label: '保费金额', type: 'InputNumber', name: 'bfszl', format: '0,0.000000', rules: [
      { type: 'base_number', length: 14, decimal: 6 },
    ]
  },

  { label: '保费计算方式代码', type: itemType.Select, name: 'bfjsfsDm', allowClear: true, codeTable: ['code_dm_ckts_hgbfjsfs', '01'] },
  { label: '杂费海关货币字母代码', type: itemType.Select, name: 'zfhghbzmDm', showSearch: true, allowClear: true, showType: '3', codeTable: ['code_dm_gy_hb', '01'] },
  {
    label: '杂费金额', type: itemType.InputNumber, name: 'zfszl', format: '0,0.000000', rules: [
      { type: 'base_number', length: 14, decimal: 6 },
    ]
  },

  { label: '杂费计算方式代码', type: itemType.Select, name: 'zfjsfsDm', allowClear: true, codeTable: ['code_dm_ckts_hgzfjsfs', '01'] },

  { label: '商品信息', type: itemType.GroupTitle, name: 'spxx' },

  {
    label: '出口商品代码', type: itemType.Input, name: 'ckspDm', eventOnBlur : 'spdmOnblur' ,rules: [
      { type: 'base_required', message: '该项内容为必填项不能为空！' },
    ]
  },

  { label: '出口商品名称', type: itemType.Input, name: 'ckspmc', readOnly: true },
  {
    label: '海关商品名称', type: itemType.Input, name: 'hgspmc', rules: [
      { type: 'base_string', range: [0, 500] },
    ]
  },

  {
    label: '成交计量单位', type: itemType.Input, name: 'sbjldwmc', rules: [
      { type: 'base_required', message: '该项内容为必填项不能为空！' },
      { type: 'base_string', range: [0, 75] },
    ]
  },
  {
    label: '成交数量', type: itemType.InputNumber, name: 'cjsl1', format: '0,0.00000', rules: [
      { type: 'base_required', message: '该项内容为必填项不能为空！' },
      { type: 'base_number', length: 14, decimal: 4 },
      { type: 'base_number', range: '+-' },
    ]
  },
  {
    label: '法定计量单位', type: itemType.Select, name: 'dyjldwDm', showSearch: true, showType: '3', codeTable: ['code_dm_ckts_hgjldw', '01'], rules: [
      { type: 'base_required', message: '该项内容为必填项不能为空！' },
    ]
  },

  {
    label: '法定数量', type: itemType.InputNumber, name: 'cksl', format: '0,0.00000', rules: [
      { type: 'base_required', message: '该项内容为必填项不能为空！' },
      { type: 'base_number', length: 14, decimal: 4 },
      { type: 'base_number', range: '+-' },
    ]
  },
  { label: '第二计量单位', type: itemType.Select, name: 'dejldwDm', showSearch: true, showType: '3', codeTable: ['code_dm_ckts_hgjldw', '01'] },
  {
    label: '第二出口数量', type: itemType.InputNumber, name: 'decksl', format: '0,0.00000', rules: [
      { type: 'base_number', length: 14, decimal: 4 },
    ]
  },

  {
    label: '规格型号', type: itemType.Input, name: 'ggxh', rules: [
      { type: 'base_string', range: [0, 150] },
    ]
  },

];

// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
ckbgdConfig.filter_items = [
  { name: 'sbyw', label: '申报业务', type: 'Select', codeTable: ['code_static_bgd_sbyw_dm', '02'] },
  { name: 'sybz', label: '生成状态', type: 'Select', codeTable: ['code_static_bgd_zt_dm', '01'] },
  { name: 'zmlx', label: '征免类型', type: 'Select', codeTable: ['code_static_bgd_zmlx_dm', '01'] },
  { name: 'czbz1', label: '关单信息', type: 'Select', codeTable: ['code_static_bgd_gdxx_dm', '01'] },
  { name: 'ckhth', label: '出口合同号', type: 'Input', },
  { name: 'ckrq1', label: '出口日期', type: 'DatePicker', range: true, allowClear: true },
  { name: 'ckbgdh', label: '报关单号', type: 'Input' },
  { name: 'jgfsDm', label: '监管方式', type: 'Select', showType: '3', allowClear: true, showSearch: true, codeTable: ['CODE_DM_CKTS_HGJGFS', '01'] },
  { name: 'cytgbz', label: '数据检查状态', type: 'Select', codeTable: ['code_static_bgd_cytgbz_dm', '01'] },
];

ckbgdConfig.filter_items2 = [
  { name: 'ckbgdh', label: '出口报关单号', type: 'Input' },
  { name: 'ckrq1', label: '出口日期', type: 'DatePicker' ,range: true },
  { name: 'ckhth', label: '出口合同号', type: 'Input', },
  { name: 'jgfsDm', label: '监管方式', type: 'Select', showType: '3',showSearch: true, codeTable: ['CODE_DM_CKTS_HGJGFS', '01'] },
];

// 配置项：工具栏
ckbgdConfig.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
  delete: true,
  add: true,
  edit: true,
  upload: false,                    // 是否显示导入按钮，默认关闭
  ckts_download: true,              // 是否显示导出按钮，默认关闭
};

// 配置项：自定义工具栏
ckbgdConfig.costomer_toobar = [
  { name: '导入', key: '5B0E0D24C5540BE634F369AC77F0E230', func: 'sjdrFunc' },
  { name: '数据检查', key: '5B0E0D24C5540BE634F369AC77F0E2D4', func: 'shjcFunc' },
  { name: '报关单生成明细', key: '464E40AF9676775C598CF4B1BDE4FF3D', func: 'bgdscmx' },
];


export default ckbgdConfig;
