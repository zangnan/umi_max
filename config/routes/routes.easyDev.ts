export default [
  { path: '/easy_dev/init', layout: false, component: './easy_dev/agility/init'},
  { name: '敏捷开发', icon: 'AppstoreOutlined', path: '/easy_dev/agility', routes: [
    { name: '系统构建', path: '/easy_dev/agility/app_build', component: './easy_dev/agility/app_build' },
    { name: '菜单构建', path: '/easy_dev/agility/menu_build', component: './easy_dev/agility/app_build/menu_build' },
    { name: '字典管理', path: '/easy_dev/agility/app_dict', component: './easy_dev/agility/app_dict' },
    { name: '表管理', path: '/easy_dev/agility/app_table', component: './easy_dev/agility/app_table' },
    { name: '模块管理', path: '/easy_dev/agility/app_module', component: './easy_dev/agility/app_module' },
    { name: '物理表管理', path: '/easy_dev/agility/app_table_db', component: './easy_dev/agility/app_table_db' },
    { name: '预览页面', path: '/easy_dev/agility/cfgp', component: './common/automatic_page', hideInMenu: true, menuRender: false },
    { name: 'Excel采集1(测试)', path: '/easy_dev/agility/excel_tuning', component: './easy_dev/agility/excel_tuning' },
    { name: 'Excel采集2(测试)', path: '/easy_dev/agility/excel_tuning2', component: './easy_dev/agility/excel_tuning2' },
  ] },
  { name: '系统管理', icon: 'DeploymentUnitOutlined', path: '/system/admin/cfgp', routes: [
    { name: '人员管理', path: '/system/admin/cfgp/m_sys_user', component: './easy_dev/sys/sys_user' },
    { name: '角色管理', path: '/system/admin/cfgp/m_sys_role', component: './easy_dev/sys/sys_role' },
    { name: '菜单管理', path: '/system/admin/cfgp/m_sys_menu', component: './easy_dev/sys/sys_menu' },
    { name: '码表管理', path: '/system/admin/cfgp/m_sys_code', component: './easy_dev/sys/sys_codetable' },
    { name: '自定义SQL管理', path: '/system/admin/cfgp/m_sys_sql', component: './common/automatic_page' },
    { name: '自定义码表管理', path: '/system/admin/cfgp/m_sys_code_manage', component: './common/automatic_page' },
    { name: '参数管理', path: '/system/admin/cfgp/sys_parameter', component: './easy_dev/sys/sys_parameter' },
  ] },
];