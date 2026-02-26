export default [
  { path: '/easy_dev_dc/init', layout: false, component: './easy_dev_dc/agility/init'},
  { name: '敏捷开发DC', icon: 'AppstoreOutlined', path: '/easy_dev_dc/agility', routes: [
    { name: '系统构建', path: '/easy_dev_dc/agility/app_build', component: './easy_dev_dc/agility/app_build' },
    { name: '物理表管理', path: '/easy_dev_dc/agility/app_dict', component: './easy_dev_dc/agility/app_dict' },
    { name: '表字段管理', path: '/easy_dev_dc/agility/app_dict_field', component: './easy_dev_dc/agility/app_dict_field' },
    { name: '模块管理', path: '/easy_dev_dc/agility/app_module', component: './easy_dev_dc/agility/app_module' },
    { name: '模块字段管理', path: '/easy_dev_dc/agility/app_module_field', component: './easy_dev_dc/agility/app_module_field' },
    { name: '预览页面', path: '/easy_dev_dc/agility/cfgp', component: './common/automatic_page', hideInMenu: true, menuRender: false },
  ] },
  { name: '权限管理DC', icon: 'DeploymentUnitOutlined', path: '/easy_dev_dc/sys', routes: [
    { name: '用户管理', path: '/easy_dev_dc/sys/sys_user', component: './easy_dev_dc/sys/sys_user' },
    { name: '角色管理', path: '/easy_dev_dc/sys/sys_role', component: './easy_dev_dc/sys/sys_role' },
    { name: '菜单管理', path: '/easy_dev_dc/sys/sys_menu', component: './easy_dev_dc/sys/sys_menu' },
    { name: '参数管理', path: '/easy_dev_dc/sys/sys_parameter', component: './easy_dev_dc/sys/sys_parameter' },
    { name: '码表管理', path: '/easy_dev_dc/sys/sys_codetable', component: './easy_dev_dc/sys/sys_codetable' },
  ] },
  // { name: '接口页面', path: '/cfgp/test_app_mts_tsjh_tssb', component: './common/automatic_page', icon: 'ProfileOutlined'},
  // { name: '出口明细', icon: 'DatabaseOutlined', path: '/M3/M31/M311/M3112', component: './easy_dev/testOldToNew/MTS___ZXSB_SB_MTS_TSSB_GCB' },
];