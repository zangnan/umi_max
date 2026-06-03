/**
 * title: 其他商品管理
 * author: zxy
 */
const unitConfig: any = {};

// 配置项
unitConfig.page_id = 'qtspgl';
unitConfig.form_title = '其他商品管理';                                                // 新建标题，可选
unitConfig.grid_api_grid_query = `${API_URL_BASE}/yw/fpzs/fppz/qtspcx`;        // api 列表查询
unitConfig.form_api_show = `${API_URL_BASE}/yw/fpzs/fppz/qtspmxcx`;
unitConfig.form_api_save = `${API_URL_BASE}/yw/fpzs/fppz/qtspwh`;
unitConfig.grid_row_key = 'uuid';                                                    // 列表主键，默认uuid
unitConfig.grid_show_serial_number = false;                                           // 是否显示序号，可选，默认不显示
unitConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
unitConfig.layout_type = 'tabs';                                                      // 页面类型，默认default 可选 default modal tabs
unitConfig.click_checked = '1';
unitConfig.grid_api_import = `${API_URL_BASE}/yw/fpzs/fppz/qtspsjdr`;
unitConfig.import_key = 'ZXSB_SB_FPZS_QTSP_EXCEL';
// 配置项：列表筛选项
// unitConfig.filter_items = [
//   { name: 'hwhyslwmc', label: '商品名称', type: 'Input' },
//   { name: 'jm1', label: '简码', type: 'Input' },
// ];

// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
unitConfig.grid_filter_quick = [
  { label: '商品名称或简码', name: 'hwhyslwmc', type: 'Input', searchButton: true, op: 'zdy' },
];

// 配置列表列
unitConfig.grid_columns = [
  { title: '商品名称', dataIndex: 'hwhyslwmc', width: 150, ellipsis: true, fixed: 'left' },
  { title: '规格型号', dataIndex: 'ggxh', width: 150, ellipsis: true },
  { title: '计量单位', dataIndex: 'jldwmc', width: 90 , ellipsis: true},
  { title: '税率', dataIndex: 'sl1', align: 'right', width: 80, render: { func: 'qtsprenderSl1' } },
  { title: '税收分类编码', dataIndex: 'sphfwssflhbbm', width: 170 },
  { title: '税收分类名称', dataIndex: 'hwhlwmc', width: 150, ellipsis: true },
  { title: '企业编码', dataIndex: 'qyspbm', width: 130 },
  { title: '简码', dataIndex: 'jm1', width: 90, ellipsis: true },
  { title: '商品税目', dataIndex: 'spsm', width: 120 },
  { title: '单价', dataIndex: 'dj', align: 'right', width: 150, render: { type: 'number', format: '0,0.000000' } },
  {
    title: '含税标志', dataIndex: 'hsbz1', width: 100, render: { func: 'renderBz1And0' },
    filter: {
      type: 'Select',
      list: [
        { text: '是', value: '1' },
        { text: '否', value: '0' }
      ],
    }
  },
  { title: '隐藏标志', dataIndex: 'ycbz', width: 100, render: { func: 'renderYAndN' }, },
  {
    title: '享受优惠政策', dataIndex: 'syyhzcbz', width: 120, render: { func: 'renderBz1And0' },
    filter: {
      type: 'Select',
      list: [
        { text: '是', value: '1' },
        { text: '否', value: '0' }
      ],
    }
  },
  {
    title: '优惠政策类型', dataIndex: 'fpssyhlxDm', width: 120, render: { func: 'renderFpssyhlxDm' },
    filter: {
      type: 'Select',
      list: [
        { text: '免税', value: '1' },
        { text: '不征税', value: '2' }
      ],
    }
  }
];

// 税率列表
const sl1vList = [
  { value: 0, name: '0%' },
  { value: 0.03, name: '3%' },
  { value: 0.06, name: '6%' },
  { value: 0.09, name: '9%' },
  { value: 0.13, name: '13%' },
];
// 含税标志
const hsbz1List = [
  { value: '0', name: '否' },
  { value: '1', name: '是' },
];
// 隐藏标志
const ycbzList = [
  { value: 'Y', name: '是' },
  { value: 'N', name: '否' },
];
// 享受优惠政策
const syyhzcbzList = [
  { value: '1', name: '是' },
  { value: '0', name: '否' },
];
// 优惠政策类型
const fpssyhlxDmList = [
  { value: '1', name: '免税' },
  { value: '2', name: '不征税' },
];
// 配置项：表单项
unitConfig.form_items = [
  { label: 'ID', type: 'Hidden', name: 'uuid' },
  {
    label: '商品名称', type: 'Input', name: 'hwhyslwmc', rules: [
      { type: 'base_required' },
    ]
  },
  {
    label: '规格型号', type: 'Input', name: 'ggxh', rules: [
      { type: 'base_required' },
      { func: 'qtspwhcheck' },
    ]
  },
  { label: '计量单位', type: 'Input', name: 'jldwmc' },
  {
    label: '税率', type: 'Select', name: 'sl1', list: sl1vList, rules: [
      { type: 'base_required' },
    ]
  },
  {
    label: '税收分类编码', type: 'Input', name: 'sphfwssflhbbm', eventOnFocus: 'qtspHbbmFocus', rules: [
      { type: 'base_required' },
    ]
  },
  { label: '税收分类名称', type: 'Input', name: 'hwhlwmc', readOnly: true },
  {
    label: '企业编码', type: 'Input', name: 'qyspbm', rules: [
      { type: 'base_required' },
      { func: 'qtspwhcheck' },
    ]
  },
  { label: '简码', type: 'Input', name: 'jm1' },
  { label: '商品税目', type: 'Input', name: 'spsm' },
  { label: '单价', type: 'InputNumber', name: 'dj', format: '0,0.00', rules: [{ type: 'base_number', length: 14, decimal: 2}, { type: 'base_number', range: '+' }] },
  {
    label: '含税标志', type: 'Select', name: 'hsbz1', list: hsbz1List, rules: [
      { type: 'base_required' },
    ]
  },
  { label: '隐藏标志', type: 'Select', name: 'ycbz', list: ycbzList },
  {
    label: '享优惠政策', type: 'Select', name: 'syyhzcbz', list: syyhzcbzList, eventOnChange: 'syyhzcbzOnChange', enterFocus: false, rules: [
      { type: 'base_required' },
    ]
  },
  {
    label: '优惠政策类型', type: 'Select', name: 'fpssyhlxDm', disabled: true, list: fpssyhlxDmList, rules: [
      { func: 'fpssyhlxDmCheck' }
    ]
  }
];

// 配置项：列表排序字段
unitConfig.grid_setting_sort = [
  { col: '税收分类编码', order: 'asc', name: 'sphfwssflhbbm' }
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,
  add: true,
  full: true,
  reload: true,
  upload: true,
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: true,                   // 是否显示编辑链接，默认开启
};

// 配置项：自定义工具栏
unitConfig.costomer_toobar = [
  { name: '删除', func: 'deleteQtspgl' },
];

export default unitConfig;