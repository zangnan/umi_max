const unitConfig: any = {};

// 配置项
unitConfig.api_grid_query = '/dict/auth/sys_parameter/queryPager';
unitConfig.api_form_edit='/dict/auth/sys_parameter/add';
unitConfig.api_form_delete='/dict/auth/sys_parameter/delete';
unitConfig.api_form_query=`/dict/auth/sys_parameter/show`;
unitConfig.form_title = '系统参数';
unitConfig.grid_row_key = 'uuid';

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '参数代码', dataIndex: 'parameter_code', width: 180 },
  { title: '参数值', dataIndex: 'parameter_value', width: 280, ellipsis: true },
  { title: '备注', dataIndex: 'parameter_remark', ellipsis: true },
  { title: '有效标志', dataIndex: 'used_flag', width: 120 },
  { title: '更新时间', dataIndex: 'update_time', width: 120, render: { type: 'date', format: 'YYYY-MM-DD' } },
  // { title: '更新时间', dataIndex: 'update_time_timestamp', width: 120, render: { type: 'date', format: 'YYYY-MM-DD' } },
  { title: 'UUID', dataIndex: 'uuid', hidden: true },
];

// 配置项：表单项
unitConfig.form_items = [
  { label: 'ID', type: 'Hidden', name: 'uuid' },
  { label: '参数代码', type: 'Input', name: 'parameter_code', rules: [ { type: 'base_required' } ] },
  { label: '参数值', type: 'Input', name: 'parameter_value', rules: [ { type: 'base_required' } ] },
  { label: '备注', type: 'Input', name: 'parameter_remark' },
  { label: '有效标志', type: 'Select', name: 'used_flag', list: [
    { text: '有效', value: 'Y' },
    { text: '无效', value: 'N' },
  ], },
];

// 配置项：列表筛选项
unitConfig.filter_items = [
  { name: 'parameter_code', label: '参数代码', type: 'Input' },
  { name: 'parameter_value', label: '参数值', type: 'Input' },
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


export default unitConfig;
