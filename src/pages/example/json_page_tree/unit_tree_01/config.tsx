const unitConfig: any = {};

// 配置项
unitConfig.unit_title = '菜单';
// unitConfig.api_grid_query = `${API_URL_BASE}/dict/automatic/exp/bs/queryPager/m_sys_menu`;
// unitConfig.api_form_edit = `${API_URL_BASE}/dict/automatic/exp/bs/saveOrUpdate/m_sys_menu`;
// unitConfig.api_form_delete = `${API_URL_BASE}/dict/automatic/exp/bs/delete/m_sys_menu`;
unitConfig.api_grid_query = `${API_URL_EXAMPLE}/example/queryTree`;
unitConfig.api_form_edit = `${API_URL_EXAMPLE}/test/returnCode200`;
unitConfig.api_form_delete = `${API_URL_EXAMPLE}/test/returnCode200`;

// 配置项：右侧表单
unitConfig.form = {
  form_layout_type: 'vertical',
  form_label_input_layout: 'horizontal',
  form_items: [
    { label: '菜单/资源代码', type: 'Input', name: 'menuId', readOnly: true, tooltip: '新建菜单时会自动生成菜单代码', rules: [
      { type: 'base_string', range: 200 },
    ]},
    { label: '菜单名称', type: 'Input', name: 'menuName', rules: [ { type: 'base_required' }, { type: 'base_string', range: 60 } ]},
    { label: '父节点菜单代码', type: 'Hidden', name: 'menuParentId', rules: [ { type: 'base_required' }, { type: 'base_string', range: 200 } ]},
    { label: '路径', type: 'Input', name: 'menuPath', rules: [ { type: 'base_string', range: 200 } ]},
    { label: '组件', type: 'Input', name: 'menuComponent', rules: [ { type: 'base_string', range: 200 } ]},
    { label: '高亮节点路径', type: 'Input', name: 'menuLightPath', rules: [ { type: 'base_string', range: 1000 } ]},
    { label: '图标', type: 'Input', name: 'menuIcon', rules: [ { type: 'base_string', range: 100 } ]},
    { label: '路径重定向', type: 'Input', name: 'menuRedirect', rules: [ { type: 'base_string', range: 300 } ]},
    { label: '有效标志', type: 'Switch', name: 'menuActive', default_value: true, rules: [ { type: 'base_required' } ] },
    { label: '隐藏', type: 'Switch', name: 'menuHide' },
    { label: '默认全屏', type: 'Switch', name: 'menuFullScreen' },
    { label: '分类', type: 'Select', name: 'menuType', eventOnChange: 'changeMenuType', list: [
      { name: '菜单', value: '1' },
      { name: '预制菜单', value: '0' },
      { name: '按钮', value: '9' },
    ] },
  ]
}

// 配置项：工具栏
unitConfig.toolbar_default = {
  add: true,
  edit: true,
  delete: true,
};

// 配置项：左侧树
unitConfig.tree = {
  checkable: false,
  field_names: {
    key: 'menuId',
    parent_key: 'menuParentId',
    title: 'menuName',
    children: 'children'
  }
}

export default unitConfig;