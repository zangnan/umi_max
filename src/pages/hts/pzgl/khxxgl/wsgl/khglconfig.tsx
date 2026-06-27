import CONSTANTS from '@/components/DDAssist/constants';

/**
 * title: 客户管理
 * author: zn
 */
const khglConfig: any = {};

// 配置项
khglConfig.api_grid_query = `/yw/fpzs/fppz/khglfycx`;   // api 列表查询
khglConfig.form_api_show = `/yw/fpzs/fppz/querykhpzform`;            // api 表单查询
khglConfig.api_form_edit = `/yw/fpzs/fppz/khglwh`;
khglConfig.form_api_save_upload = `/yw/fpzs/fppz/khglwh`;
khglConfig.grid_show_serial_number = true;                                            // 是否显示序号，可选，默认不显示
khglConfig.grid_row_key = 'khuuid';                                                     // 列表主键，默认uuid
khglConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
khglConfig.grid_click_checked = '1';
khglConfig.form_title = '客户管理';
khglConfig.grid_api_import = `/yw/fpzs/fppz/sjdr`;
khglConfig.import_key = 'ZXSB_SB_FPZS_KHPZ_EXCEL';
khglConfig.module_key = 'FPKJ_FPPZ_KHGL';
khglConfig.import_style = '2';
khglConfig.exprotMsg = '导入规则：覆盖并追加';


// 配置列表列
khglConfig.grid_columns = [
  { title: '客户uuid', dataIndex: 'khuuid', hidden: true },
  { title: '境外收货人', dataIndex: 'jwshrmc', fixed: 'left', width: 170, ellipsis: true, },
  { title: '购买方名称', dataIndex: 'ghfnsrmc', fixed: 'left', width: 170, ellipsis: true, },
  { title: '购买方简称', dataIndex: 'ghfqyjc', width: 100, ellipsis: true },
  { title: '社会信用代码', dataIndex: 'ghfshxydm', width: 160, ellipsis: true },
  { title: '开户银行', dataIndex: 'ghfkhyxmc', width: 250, ellipsis: true },
  { title: '银行账号', dataIndex: 'ghfyhzh', width: 170, ellipsis: true },
  { title: '购买方地址', dataIndex: 'ghfdz', width: 300, ellipsis: true },
  { title: '购买方电话', dataIndex: 'ghflxdh', width: 150, },
  {
    title: '客户状态', dataIndex: 'qybz', width: 100, align: 'center', fixed: 'right', render: { func: 'renderqybz' },
    filter: {
      type: 'Select',
      list: [
        { text: '启用', value: 'Y' },
        { text: '停用', value: 'N' },
      ],
    }
  },

];

// 配置项：表单项
khglConfig.form_items = [
  { label: '客户uuid', type: 'Hidden', name: 'khuuid' },
  { label: '基本信息', type: 'GroupTitle', name: 'jbxx' },
  {
    label: '境外收货人', type: 'Input', name: 'jwshrmc',  rules: [
      { type: 'base_required' },
      { func: 'checkJwshrmc' },
      { type: 'base_string', range: 150 },
    ]
  },  // eventOnBlur: 'jwshrmc',
  {
    label: '购买方名称', type: 'Input', name: 'ghfnsrmc', eventOnBlur: 'ghfnsrmc', rules: [
      { type: 'base_required' },
      //{ func: 'checkGhfnsrmc' },
      { type: 'base_string', range: 150 },
    ]
  },
  { label: '购买方简称', type: 'Input', name: 'ghfqyjc', rules: [
    { type: 'base_string', range: 150 },
  ] },
  { label: '社会信用代码', type: 'Input', name: 'ghfshxydm', rules: [
    { type: 'base_type_number_english' },
    { func: 'ghfshxydm01' },
  ] },
  { label: '开户银行', type: 'Input', name: 'ghfkhyxmc', rules: [
    { type: 'base_string', range: 120 },
  ] },
  { label: '银行账号', type: 'Input', name: 'ghfyhzh', rules: [
    { type: 'base_type_number' },
    { func: 'ghfyhzh01' },
  ] },
  { label: '购买方地址', type: 'Input', name: 'ghfdz', rules: [
    { type: 'base_string', range: 300 },
  ]  },
  { label: '购买方电话', type: 'Input', name: 'ghflxdh', rules: [
    { type: 'base_string', range: 20 },
    { type: 'base_type_phone' }
  ] },
];

// 配置项：工具栏
khglConfig.toolbar_default = {
  setting: true,
  add: true,
  full: true,
  reload: true,
  upload: true,
  download: true,
};

khglConfig.grid_handle_columns_default = {
  edit: true
}
// 配置项：自定义工具栏
khglConfig.customer_toolbar = [
  { name: '提取客户', func: 'handletqjwfhr' },
  { name: '删除', func: 'deleteKhgl' },
];

// 配置项：筛选_快捷筛选 列表上方，标题和区域 第二层筛选
khglConfig.grid_filter_quick = [
  { label: '境外收货人', name: 'jwshrmc', type: 'Input', width: '5w', op: 'zdy' },
  { label: '购买方或购买方简称', name: 'gmfmcOrJc', type: 'Input', width: '5w', op: 'zdy', searchButton: true },
];
khglConfig.handle_columns = [];
export default khglConfig;