const unitConfig: any = {};

// 配置项
unitConfig.api_grid_query = '/dict/auth/role/queryPager';
unitConfig.api_form_edit='/dict/auth/role/add';
unitConfig.api_form_delete='/dict/auth/role/delete';
unitConfig.api_form_query=`/dict/auth/role/show`;
// unitConfig.get_edit_value_by_grid = true;
unitConfig.form_title = '角色';
unitConfig.grid_row_key = 'roleId';

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '角色ID', dataIndex: 'roleId', width: 180 },
  { title: '角色名称', dataIndex: 'roleName', ellipsis: true },
];

// 配置项：表单项
unitConfig.form_items = [
  { label: '角色ID', type: 'Input', name: 'roleId' },
  { label: '角色名称', type: 'Input', name: 'roleName', rules: [
      { type: 'base_required' },
  ] },
];

// 配置项：列表筛选项
unitConfig.grid_filter_quick = [
  { name: 'roleName', label: '角色名称', type: 'Input', searchButton: true },
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

// unitConfig.customer_toolbar = [
//   { name: '绑定角色', key: 'bindRole', func: 'bindRole' },
// ];

// 配置项：自定义操作列
unitConfig.handle_columns = [
  { name: '绑定菜单', key: 'bindMenu', func: 'bindMenu' },
  { name: '增加角色', key: 'addRole', func: 'addRole' },
];

export default unitConfig;
