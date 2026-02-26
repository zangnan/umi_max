import leaf1Config from './son_table_1_config';
import leaf2Config from './son_table_2_config';
import leaf1Func from './son_table_1_fun';
import leaf2Func from './son_table_2_fun';

const unitConfig: any = {};

// 配置项
unitConfig.form_title = '报关单';                                                     // 表单标题，可选
unitConfig.api_grid_query = `${API_URL_EXAMPLE}/hx/ty/crud/queryPager2`;                 // api：列表查询 不分页
unitConfig.grid_pagination = false;                                                  // 列表：是否含有分页，默认 true
unitConfig.grid_row_key = 'ckbgdh';                                                  // 列表：主键，默认uuid

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '报关单号', dataIndex: 'ckbgdh', width: 180, sorter: { multiple: 1 } },
  { title: '商品代码', dataIndex: 'ckspDm', width: 95, sorter: { multiple: 1 } },
  { title: '成交币制', dataIndex: 'cjhghbzmDm', width: 85, sorter: { multiple: 1 } },
  { title: '子表1', dataIndex: 'leaf1', width: 85, render: {
    type: 'leaf',
    titleDataIndex: 'ckspDm',
    config: leaf1Config,
    func: leaf1Func,
  } },
  { title: '子表2', dataIndex: 'leaf2', width: 85, render: {
    type: 'leaf',
    titleDataIndex: 'ckbgdh',
    config: leaf2Config,
    func: leaf2Func,
  } },
];

// 配置项：筛选_普通筛选 页面最上方 第一层筛选
unitConfig.filter_items = [
  { name: 'ckhth', label: '出口合同号', type: 'Input', },
  { name: 'ckrq1', label: '出口日期', type: 'DatePicker' },
  { name: 'ckbgdh', label: '报关单号', type: 'Input' },
  { name: 'jgfsDm', label: '监管方式', type: 'Input' },
  { name: 'sbyw', label: '申报业务', type: 'Input' },
];

// 配置项：表单项
unitConfig.form_items = [
  { label: 'Select', type: 'GroupTitle', name: 'zdsj' },
  { label: 'Select1', type: 'Select', name: 'test81', codeTable: 'code_dm_ckts_cktmsywlx', showSearch: true, layout: {
    label: { xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3 },
    formItem: { xs: 16, sm: 16, md: 16, lg: 19, xl: 13, xxl: 13 },
  } },
  { label: 'Select3', type: 'Select', name: 'test82', showType: '2', codeTable: 'code_dm_ckts_cktmsywlx' },
  { label: 'Select2', type: 'Select', name: 'test83', showType: '3', codeTable: 'code_dm_ckts_cktmsywlx', eventOnChange: 'test83', mode: 'multiple', layout: {
    label: { xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3 },
    formItem: { xs: 16, sm: 16, md: 16, lg: 19, xl: 21, xxl: 21 },
  } },
  { label: 'Select2Name', type: 'Input', name: 'test84', readOnly: true, layout: {
    label: { xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3 },
    formItem: { xs: 16, sm: 16, md: 16, lg: 19, xl: 21, xxl: 21 },
  } },
  { label: '字段事件', type: 'GroupTitle', name: 'zdsj' },
  { label: 'OnChange1', type: 'Input', name: 'test91', eventOnChange: 'test91' },
  { label: 'OnBlur', type: 'Input', name: 'test92', eventOnBlur: 'test92' },
  { label: 'OnFocus', type: 'Input', name: 'test93', eventOnFocus: 'test93' },
  { label: 'OnChange2', type: 'Select', name: 'test94', eventOnChange: 'test94', list: [
    { value: 'a', name: 'A' },
    { value: 'b', name: 'B' },
  ]},
  { label: 'OnChange3', type: 'DatePicker', name: 'test95', eventOnChange: 'test95' },
  { label: '必录信息', type: 'GroupTitle', name: 'blxx' },
  { label: '必填字段', type: 'Input', name: 'test01', rules: [
    { type: 'base_required', message: '必录项可选提示信息' },
  ]},
  { label: '按需必填字段', type: 'Input', name: 'test02', tooltip: 'OnChange1字段非空，则必录', rules: [
    { func: 'myValidator02' },
  ]},
  { label: '按需只读字段', type: 'Input', name: 'test03', tooltip: 'OnChange1字段非空，则只读' },
  { label: '按需只读字段', type: 'Select', name: 'test04', tooltip: 'OnChange1字段非空，则只读', list: [
    { value: 'a', name: 'A' },
    { value: 'b', name: 'B' },
  ]},
  { label: '字符校验', type: 'GroupTitle', name: 'zfjy' },
  { label: '字符长度3', type: 'Input', name: 'test11', rules: [
    { type: 'base_string', length: 3},
  ]},
  { label: '字符范围0-5', type: 'Input', name: 'test12', rules: [
    { type: 'base_string', range: 5 },
  ]},
  { label: '字符范围3-10', type: 'Input', name: 'test13', rules: [
    { type: 'base_string', range: [3, 10]},
  ]},
  { label: '日期校验', type: 'GroupTitle', name: 'rqjy' },
  { label: '日期yyyyMMdd', type: 'Input', name: 'test21', rules: [
    { type: 'base_date', format: 'yyyyMMdd'},
  ]},
  { label: '日期yyyyMM', type: 'Input', name: 'test22', rules: [
    { type: 'base_date', format: 'yyyyMM'},
  ]},
  { label: '日期yyyy', type: 'Input', name: 'test23', rules: [
    { type: 'base_date', format: 'yyyy'},
  ]},
  { label: '日期MM', type: 'Input', name: 'test24', rules: [
    { type: 'base_date', format: 'MM'},
  ]},
  { label: '数值校验', type: 'GroupTitle', name: 'szjy' },
  { label: '数值NUMBER(10, 2)', type: 'InputNumber', name: 'test31', format: '0,0.00', rules: [
    { type: 'base_number', length: 10, decimal: 2 },
  ]},
  { label: '数值NUMBER(5)', type: 'InputNumber', name: 'test32', format: '0,0', rules: [
    { type: 'base_number', length: 5 },
  ]},
  { label: '数值+', type: 'InputNumber', name: 'test33', format: '0,0', rules: [
    { type: 'base_number', range: '+'},
  ]},
  { label: '数值-', type: 'InputNumber', name: 'test34', format: '0,0', rules: [
    { type: 'base_number', range: '-'},
  ]},
  { label: '数值0', type: 'InputNumber', name: 'test35', format: '0,0', rules: [
    { type: 'base_number', range: '0'},
  ]},
  { label: '数值+-', type: 'InputNumber', name: 'test36', format: '0,0', rules: [
    { type: 'base_number', range: '+-'},
  ]},
  { label: '数值+0', type: 'InputNumber', name: 'test37', rules: [
    { type: 'base_number', range: '+0'},
  ]},
  { label: '数值-0', type: 'InputNumber', name: 'test38', format: '0,0', rules: [
    { type: 'base_number', range: '-0'},
  ]},
  { label: '类型校验', type: 'GroupTitle', name: 'szjy' },
  { label: '数字', type: 'Input', name: 'test41', rules: [
    { type: 'base_type_number' },
  ]},
  { label: '数字及字母', type: 'Input', name: 'test42', rules: [
    { type: 'base_type_number_english' },
  ]},
  { label: '邮件', type: 'Input', name: 'test43', rules: [
    { type: 'base_type_mail' },
  ]},
  { label: '电话', type: 'Input', name: 'test44', enterFocus: false, tooltip: '取消默认回车焦点后移', rules: [
    { type: 'base_type_phone' },
  ]},
  { label: '身份证', type: 'Input', name: 'test45', rules: [
    { type: 'base_type_idcard' },
  ]},
  { label: '汉字', type: 'Input', name: 'test46', rules: [
    { type: 'base_type_chinese' },
  ]},
  { label: '自定义校验', type: 'GroupTitle', name: 'zdyjy' },
  { label: '后端校验', type: 'Input', name: 'test52', rules: [
    { func: 'myValidator52' },
  ]},
  { label: '自定义', type: 'Input', name: 'test51', rules: [
    { func: 'myValidator51' },
  ]},
  { label: '测试回车焦点', type: 'GroupTitle', name: 'szjy' },
  { label: 'TextArea', type: 'TextArea', name: 'test61', rules: [
    { type: 'base_type_number' },
  ]},
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  add: true,
  edit: true,
  delete: true,
  setting: true,
  full: true,
  download: true,
  upload: true,
  reload: true,
  statistics: true,
  advanced_filter: true,
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: true,
  delete: true,
  detail: true,
};

// 配置项：自定义工具栏
unitConfig.customer_toolbar = [
  { name: '测一', key: 'cs1' },
  { name: '测二', key: 'cs2' },
];

// 配置项：自定义操作列
unitConfig.handle_columns = [
  { name: '测试1', key: 'cs11' },
  { name: '测试2', key: 'cs12' },
];

export default unitConfig;