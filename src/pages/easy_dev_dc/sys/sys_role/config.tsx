const unitConfig: any = {};

// 配置项
unitConfig.api_grid_query = '/ns/base/list/m_sys_role';
unitConfig.api_form_edit='/ns/base/edit/m_sys_role';
unitConfig.api_form_delete='/ns/base/delete/m_sys_role';
unitConfig.api_form_query=`/ns/base/show/m_sys_role`;
unitConfig.form_title = '角色';
unitConfig.grid_row_key = 'role_id';

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '角色ID', dataIndex: 'role_id', width: 180 },
  { title: '角色名称', dataIndex: 'role_name', ellipsis: true },
];

// 配置项：表单项
unitConfig.form_items = [
  { label: '角色ID', type: 'Input', name: 'role_id' },
  { label: '角色名称', type: 'Input', name: 'role_name', rules: [
      { type: 'base_required' },
  ] },
];

// 配置项：列表筛选项
unitConfig.grid_filter_quick = [
  { name: 'role_name', label: '角色名称', type: 'Input', searchButton: true },
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
  { name: '绑定菜单', key: 'bindMenu', func: 'bindMenu' },
];

export default unitConfig;
