import CONSTANTS from '@/components/DDAssist/constants';
/**
 * title: 外销商品管理
 * author: zxy
 */
const unitConfig: any = {};

// 配置项
unitConfig.page_id = 'wxspgl';
unitConfig.form_title = '外销商品管理';                                                // 新建标题，可选
unitConfig.api_grid_query = `/yw/fpzs/fppz/wxspcx`;        // api 列表查询
unitConfig.form_api_show = `/yw/fpzs/fppz/wxspmxcx`;            // api 表单查询
unitConfig.api_form_edit = `/yw/fpzs/fppz/wxspwh`;
unitConfig.form_api_save_upload = `/yw/fpzs/fppz/wxspwh`;
unitConfig.grid_row_key = { type: '1', key: ['hgckspDm', 'hgspmc', 'ggxhhgsh'] };                                                     // 列表主键，默认uuid
unitConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
unitConfig.layout_type = 'tabs';                                                      // 页面类型，默认default 可选 default modal tabs
unitConfig.grid_click_checked = '1';
unitConfig.batch_update_url = `/yw/fpzs/fppz/wxspglplxg`; // 批量修改保存接口
unitConfig.module_key = 'FPKJ_FPPZ_WXSPGL';
unitConfig.grid_api_import = `/yw/fpzs/fppz/wxspsjdr`;


// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
unitConfig.grid_filter_quick = [
  { label: '商品代码、商品名称或简码', name: 'spdmOrSpmcOrJm', type: 'Input', width: '5w', searchButton: true, op: 'zdy' },
];

// 配置列表列
unitConfig.grid_columns = [
  { title: '海关商品代码', dataIndex: 'hgckspDm', width: 130 },
  { title: '海关商品名称', dataIndex: 'hgspmc', width: 140, ellipsis: true },
  { title: '海关规格型号', dataIndex: 'ggxhhgsh', width: 150, ellipsis: true }, // 需要增加判断给予隐藏
  { title: '税收分类编码', dataIndex: 'sphfwssflhbbm', width: 170 },
  { title: '税收分类名称', dataIndex: 'hwhlwmc', width: 150, ellipsis: true },
  { title: '简称', dataIndex: 'hwhlwjc', width: 150, ellipsis: true },
  { title: '简码', dataIndex: 'jm1', width: 110, ellipsis: true },
  { title: '发票规格型号', dataIndex: 'ggxh', width: 150, ellipsis: true },
  { title: '税率', dataIndex: 'sl1', align: 'right', width: 80, render: { func: 'qtsprenderSl1' } },
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
  },
  {
    title: '退免（税）类型', dataIndex: 'cksptssplxDm', width: 140, render: { func: 'renderCksptssplxDm' },
    filter: {
      type: 'Select',
      list: [
        { text: '退税', value: '1' },
        { text: '免税', value: '2' },
        { text: '征税', value: '3' }
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
// 退免税类型
const cksptssplxDmList = [
  { value: '1', name: '退税' },
  { value: '2', name: '免税' },
  { value: '3', name: '征税' },
];
// 配置项：表单项
unitConfig.form_items = [
  { label: 'ID', type: 'Hidden', name: 'uuid' },
  {
    label: '海关商品代码', type: 'Input', name: 'hgckspDm', rules: [
      { type: 'base_required' },
      { type: 'base_type_number' },
      { type: 'base_string', range: 12 },
    ]
  },
  {
    label: '海关商品名称', type: 'Input', name: 'hgspmc', rules: [
      { type: 'base_required' },
      { type: 'base_string', range: 80 },
    ]
  },
  {
    label: '税收分类编码', type: 'Input', name: 'sphfwssflhbbm', eventOnFocus: 'wspgSphfwssflhbbmFocus', rules: [
      { type: 'base_required' },
    ]
  },
  {
    label: '税收分类名称', type: 'Input', name: 'hwhlwmc', disabled: true, rules: [
      { type: 'base_required' },
    ]
  },
  {
    label: '简称', type: 'Input', name: 'hwhlwjc', disabled: true, rules: [
      { type: 'base_required' },
    ]
  },
  { label: '简码', type: 'Input', name: 'jm1' },
  { label: '发票规格型号', type: 'Input', name: 'ggxh', rules: [
      { type: 'base_string', range: [0, 40] }
    ]
  },
  {
    label: '享受优惠政策', type: 'Select', name: 'syyhzcbz', list: syyhzcbzList, eventOnChange: 'syyhzcbzOnChange', rules: [
      { type: 'base_required' },
    ]
  },
  {
    label: '优惠政策类型', type: 'Select', name: 'fpssyhlxDm', disabled: true, list: fpssyhlxDmList, eventOnChange: 'fpssyhlxDmOnChange', rules: [
      { func: 'fpssyhlxDmCheck' }
    ]
  },
  {
    label: '税率', type: 'Select', name: 'sl1', list: sl1vList, rules: [
      { type: 'base_required' },
    ]
  },
  {
    label: '退免（税）类型', type: 'Select', name: 'cksptssplxDm', list: cksptssplxDmList, rules: [
      { type: 'base_required' },
    ]
  },
  {
    label: '海关规格型号', type: 'Input', name: 'ggxhhgsh',  rules: [
      { func: 'cksptssplxDmCheck' },
    ]
  }
];

// 配置项：列表排序字段
unitConfig.grid_setting_sort = [
  { col: '商品代码', order: 'asc', name: 'hgckspDm' },
  { col: '税收分类编码', order: 'asc', name: 'sphfwssflhbbm' }
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,
  add: true,
  full: true,
  reload: true,
  batchEdit: true,
  upload: false, // todo 禅道18721 近期新增的功能，在开发启动时还没有此功能，待下阶段补充开发
  //download: true,
  //ckts_download: true,   
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: true,                   // 是否显示编辑链接，默认开启
};

// 配置项：自定义操作列
unitConfig.handle_columns = [
  { name: '赋码', func: 'handleWxspglFmColumns' }
];

// 批量修改支持不勾选时修改全部数据，默认关闭
unitConfig.is_all_batch_edit = true;
// 配置项：批量修改表单项
unitConfig.batch_update_items = [
  { dataIndex: 'ggxh', label: '发票规格型号', type: "Input", maxLength: 40 },
  { dataIndex: 'sl1', label: '税率', type: "customSelect", data: sl1vList },
  { dataIndex: 'syyhzcbz', label: '享受优惠政策', type: "customSelect", data: syyhzcbzList },
  { dataIndex: 'fpssyhlxDm', label: '优惠政策类型', type: "customSelect", data: fpssyhlxDmList },
  { dataIndex: 'sphfwssflhbbm', label: '税收分类编码', type: "ssflbmModel", eventOnFocus: 'wspgSphfwssflhbbmFocus' }
];

// 配置项：自定义工具栏
unitConfig.customer_toolbar = [
  { name: '赋码', func: 'handleWxspglFm' },
  { name: '提取商品信息', func: 'getSpxx' },
  { name: '删除', func: 'deleteWxspgl' },
  {
    name: '设置退（免）税类型', type: 'dropdown', list: [
      { name: '退税', func: 'handleWxspglTsBz' },
      { name: '免税', func: 'handleWxspglMsBz' },
      { name: '征税', func: 'handleWxspglZsBz' }
    ]
  },
  {name: '导入', func: 'btnPldr'},
  {name: '导出', func: 'reportExcel'}
];

export default unitConfig;