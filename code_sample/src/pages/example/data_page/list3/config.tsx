/**
 * title: 数据封装页面
 * author: zn
 */
const unitConfig: any = {};

// 配置项
unitConfig.page_id = 'example_list_3';                                                // 页面id
unitConfig.form_title = '报关单';                                                     // 表单标题，可选
unitConfig.grid_api_grid_query = `${API_URL_BASE}/yw/bszx/wbsj/bgd/queryBgd18Page`;   // api 列表查询
unitConfig.form_api_show=`${API_URL_BASE}/yw/bszx/wbsj/bgd/queryBgdByKey`;            // api 表单查询
unitConfig.form_api_save=`${API_URL_BASE}/yw/bszx/wbsj/bgd/updateBgd`;                // api 表单更新
unitConfig.form_api_delete=`${API_URL_BASE}/yw/bszx/wbsj/bgd/deleteBgd21`;            // api 表单删除

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '报关单号', dataIndex: 'ckbgdh', width: 180 },
  { title: '商品代码', dataIndex: 'ckspDm', width: 95 },
  { title: '商品名称', dataIndex: 'ckspmc', width: 180, ellipsis: true },
  { title: '成交币制', dataIndex: 'cjhghbzmDm', width: 85 },
  { title: '成交数量', dataIndex: 'cjsl1', width: 140, align: 'right', render: { type: 'number', format: '0,0.0000' } },
  { title: '成交金额', dataIndex: 'cjzj', width: 140, align: 'right', render: { type: 'number', format: '0,0.00' } },
];

// 配置项：筛选_普通筛选 页面最上方 第一层筛选
unitConfig.filter_items = [
  { name: 'sbyw', label: '申报业务', type: 'Select', codeTable: ['code_static_bgd_sbyw_dm', '01'] },
  { name: 'sybz', label: '生成状态', type: 'Select', codeTable: ['code_static_bgd_zt_dm', '01'] },
];

// 配置项：表单项
unitConfig.form_items = [
  { label: 'Select', type: 'GroupTitle', name: 'zdsj' },
  { label: 'Select1', type: 'Select', name: 'test81', codeTable: ['code_dm_ckts_cktmsywlx', '05'], showSearch: true, layout: {
    label: { xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3 },
    formItem: { xs: 16, sm: 16, md: 16, lg: 19, xl: 13, xxl: 13 },
  } },
  { label: 'Select3', type: 'Select', name: 'test82', showType: '2', codeTable: ['code_dm_ckts_cktmsywlx', '05'] },
  { label: 'Select2', type: 'Select', name: 'test83', showType: '3', codeTable: ['code_dm_ckts_cktmsywlx', '05'], eventOnChange: 'test83', mode: 'multiple', layout: {
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
  add: true,                        // 是否显示增加按钮，默认关闭
  delete:  true,                    // 是否显示删除按钮，默认关闭
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  download: true,                   // 是否显示导出按钮，默认关闭
  upload: true,                     // 是否显示导入按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: true,                       // 是否显示编辑链接，默认关闭
  delete: true,                     // 是否显示删除链接，默认关闭
};

export default unitConfig;