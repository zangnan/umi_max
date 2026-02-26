const unitConfig: any = {};

// 配置项
unitConfig.api_grid_query = '/dict/auth/user/queryPager';
unitConfig.api_form_edit='/dict/auth/user/add';
unitConfig.api_form_delete='/dict/auth/user/delete';
unitConfig.api_form_query=`/dict/auth/user/show`;
// unitConfig.get_edit_value_by_grid = true;
unitConfig.form_title = '用户';
unitConfig.grid_row_key = 'userId';

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '姓名', dataIndex: 'userName', width: 140 },
  { title: '登录账号', dataIndex: 'loginName', width: 140 },
  { title: '移动电话', dataIndex: 'phone', width: 120 },
  { title: '角色名称', dataIndex: 'roleId', ellipsis: true }, // render: { func: 'renderRoleId' }
  { title: '角色名称', dataIndex: 'roleName', ellipsis: true },
  { title: '有效标志', dataIndex: 'usedFlag', width: 100 },
  { title: '更新时间', dataIndex: 'updateTime', width: 120, render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: 'UUID', dataIndex: 'userId', hidden: true },
];

// 配置项：表单项
unitConfig.form_items = [
  { label: 'ID', type: 'Hidden', name: 'userId' },
  { label: '姓名', type: 'Input', name: 'userName', rules: [ { type: 'base_required' } ] },
  { label: '登录账号', type: 'Input', name: 'loginName', rules: [ { type: 'base_required' } ] },
  { label: '登录密码', type: 'Password', name: 'password', rules: [ { type: 'base_required' } ] },
  { label: '移动电话', type: 'Input', name: 'phone', rules: [ { type: 'base_type_phone' } ] },
  { label: '有效标志', type: 'Select', name: 'usedFlag', list: [
    { text: '有效', value: 'Y' },
    { text: '无效', value: 'N' },
  ], },
];

// 配置项：列表筛选项
unitConfig.filter_items = [
  { name: 'userName', label: '姓名', type: 'Input' },
  { name: 'login_name', label: '登录账号', type: 'Input' },
  { name: 'updateTime', label: '更新时间', type: 'DatePicker', allowClear: true, range: true},

];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,
  full: true,
  reload: true,
  add: true,
  delete: true,
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: true,
  delete: true,
};

// 配置项：自定义操作列
unitConfig.handle_columns = [
  { name: '绑定角色', key: 'bindRole', func: 'bindRole' },
];

export default unitConfig;
