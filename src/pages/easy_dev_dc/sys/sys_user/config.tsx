const unitConfig: any = {};

// 配置项
unitConfig.api_grid_query = '/ns/base/list/m_sys_user';
unitConfig.api_form_edit='/ns/base/edit/m_sys_user';
unitConfig.api_form_delete='/ns/base/delete/m_sys_user';
unitConfig.api_form_query=`/ns/base/show/m_sys_user`;
unitConfig.form_title = '用户';
unitConfig.grid_row_key = 'user_id';

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '姓名', dataIndex: 'user_name', width: 140 },
  { title: '登录账号', dataIndex: 'login_name', width: 140 },
  { title: '移动电话', dataIndex: 'phone', width: 120 },
  { title: '角色id', dataIndex: 'role_id', ellipsis: true }, // render: { func: 'renderRoleId' }
  { title: '角色名称', dataIndex: 'role_name', ellipsis: true },
  { title: '有效标志', dataIndex: 'used_flag', width: 100 },
  { title: '更新时间', dataIndex: 'update_time', width: 120, render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: 'UUID', dataIndex: 'user_id', hidden: true },
];

// 配置项：表单项
unitConfig.form_items = [
  { label: 'ID', type: 'Hidden', name: 'user_id' },
  { label: '姓名', type: 'Input', name: 'user_name', rules: [ { type: 'base_required' } ] },
  { label: '登录账号', type: 'Input', name: 'login_name', rules: [ { type: 'base_required' } ] },
  { label: '登录密码', type: 'Password', name: 'password', rules: [ { type: 'base_required' } ] },
  { label: '移动电话', type: 'Input', name: 'phone', rules: [ { type: 'base_type_phone' } ] },
  { label: '有效标志', type: 'Select', name: 'used_flag', list: [
    { name: '有效', value: 'Y' },
    { name: '无效', value: 'N' },
  ], },
];

// 配置项：列表筛选项
unitConfig.filter_items = [
  { name: 'user_name', label: '姓名', type: 'Input' },
  { name: 'login_name', label: '登录账号', type: 'Input' },
  { name: 'update_time', label: '更新时间', type: 'DatePicker', allowClear: true, range: true},

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
