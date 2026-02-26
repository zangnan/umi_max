const menu = [
  {menuId: '0', menuPath: '/hts/workplace', menuName: '工作台', menuComponent: './hts/workplace', menuIcon: 'OneToOneOutlined', menuType: '01', menuActive: 'Y', menuFullScreen: 'Y' },
  {menuId: '1', menuPath: '/A1', menuName: '退税申报', menuIcon: 'BookOutlined', menuType: '01', menuActive: 'Y', children: [
    {menuId: '11', menuPath: '/A1/1', menuName: '申报1', menuParentId: '1', menuComponent: './hts/aa', menuType: '01', menuActive: 'Y' },
    {menuId: '12', menuPath: '/A1/2', menuName: '申报2', menuParentId: '1', menuComponent: './hts/bb', menuType: '01', menuActive: 'Y' },
    {menuId: '13', menuPath: '/A1/3', menuName: '申报3', menuParentId: '1', menuComponent: './hts/cc', menuType: '01', menuActive: 'Y' },
  ]},
  { menuId: '2', menuPath: '/B1', menuName: '资格备案', menuIcon: 'CheckSquareOutlined', menuType: '01', menuActive: 'Y', children: [
    { menuId: '21', menuPath: '/B1/1', menuName: '出口退（免）税备案变更', menuParentId: '2', menuComponent: './hts/ccc', menuType: '01', menuActive: 'Y', children: [
      { menuId: '211', menuPath: '/B1/1/1', menuName: '明细数据采集', menuParentId: '21', menuComponent: './hts/bbb', menuType: '01', menuActive: 'Y', },
      { menuId: '212', menuPath: '/B1/1/2', menuName: '申报结果查询', menuParentId: '21', menuComponent: './hts/aaa', menuType: '01', menuActive: 'Y', }
    ]}
  ]
}];

// 权限 菜单
async function getMenuTree(req: any, res: any) {
  const returnData: any = {
    body: menu,
    code: '200',
    desc: '成功',
    msg: null,
  }
  return res.json(returnData);
}

// 通用crud 列表查询
async function queryTree(req: any, res: any) {
  let returnData: any = {
    code: "200",
    body: {
      rows: [
        { menuPath: "/fronteg/media/cfgp/test_app_eg_media_video_cus", menuLevel: "2", menuComponent: "./easy_dev/example/dict_module_media", menuName: "卡片自定义", menuId: "08dcf9e6828b28a234e228b682a86cbe", menuType: "1", menuFullScreen: "N", menuHide: "N", menuParentId: "95ea791b2efce5be301d919d3c3919f8" },
        { menuPath: "/dynamicbs1/cfgp/test_app_fc_test01", menuLevel: "2", menuComponent: "./common/automatic_page", menuName: "测试分词示例", menuId: "1cdc2383ca7c5dae2495551e90299b14", menuType: "1", menuFullScreen: "N", menuHide: "N", menuParentId: "de51ea816b859729cbd1b18f0e61aeb4" },
        { menuPath: "/dynamicbs1/cfgp/test_app_mts_tsjh", menuLevel: "2", menuComponent: "./common/automatic_page", menuName: "进货明细", menuId: "1ebb26cb8a6160efd81b98f0fca5beac", menuType: "1", menuFullScreen: "N", menuHide: "N", menuParentId: "de51ea816b859729cbd1b18f0e61aeb4" },
        { menuPath: "/fronteg/test_app_eg_front", menuIcon: "ProfileOutlined", menuLevel: "1", menuComponent: "./easy_dev/example/dict_module_dev", menuName: "前端组件示例", menuId: "2086029805de323f652f2f890d93d5fa", menuType: "1", menuFullScreen: "N", menuHide: "N", menuParentId: "" },
        { menuPath: "/dynamicbs1/cfgp/test_app_mts_tsjh_tssb_sql", menuLevel: "2", menuComponent: "./common/automatic_page", menuName: "出口进货关联_SQL", menuId: "20938cadaa32b734fa6dadeeff7bfa19", menuType: "1", menuFullScreen: "N", menuHide: "N", menuParentId: "de51ea816b859729cbd1b18f0e61aeb4" },
        { menuPath: "/easy_dev/agility/excel_tuning", menuLevel: "2", menuComponent: "./easy_dev/agility/excel_tuning", menuName: "Excel采集1(测试)", menuId: "2f3c833d26542dfb451a8c460fe20ad5", menuType: "0", menuFullScreen: "N", menuHide: "N", menuParentId: "7603764bbedec30bf48dcf2cb3277c35" },
        { menuPath: "/system/admin/cfgp/m_sys_menu", menuLevel: "2", menuComponent: "./easy_dev/sys/sys_menu", menuName: "菜单管理", menuId: "3935161c32669edec27e516a5dedf0ff", menuType: "1", menuFullScreen: "N", menuHide: "N", menuParentId: "3b7167e6cdd6640380044f38fded2070" },
        { menuPath: "/system/admin/cfgp", menuIcon: "ProfileOutlined", menuLevel: "1",menuName: "系统管理", menuId: "3b7167e6cdd6640380044f38fded2070", menuType: "1", menuFullScreen: "N", menuHide: "N", menuParentId: "" },
        { menuPath: "/system/admin/cfgp/m_sys_code", menuLevel: "2", menuComponent: "./easy_dev/sys/sys_codetable", menuName: "码表管理", menuId: "510ca7b7a89b7234787b7c3d2449d50c", menuType: "1", menuFullScreen: "N", menuHide: "N", menuParentId: "3b7167e6cdd6640380044f38fded2070" },
        { menuPath: "/easy_dev/agility/cfgp", menuLevel: "2", menuComponent: "./common/automatic_page", menuName: "预览页面", menuId: "665daf22b94502abe2e350bcf0cb858d", menuType: "0", menuFullScreen: "N", menuHide: "Y", menuParentId: "7603764bbedec30bf48dcf2cb3277c35" },
        { menuPath: "/system/admin/cfgp/m_sys_user", menuLevel: "2", menuComponent: "./easy_dev/sys/sys_user", menuName: "人员管理", menuId: "67fd35dc65afd76945835b8259955368", menuType: "1", menuFullScreen: "N", menuHide: "N", menuParentId: "3b7167e6cdd6640380044f38fded2070" },
        { menuPath: "/easy_dev/agility/app_table_db", menuLevel: "2", menuComponent: "./easy_dev/agility/app_table_db", menuName: "物理表管理", menuId: "6d81aa672a28ee727accd91ec4fab5fc", menuType: "0", menuFullScreen: "N", menuHide: "N", menuParentId: "7603764bbedec30bf48dcf2cb3277c35" },
        { menuPath: "/dynamicbs1/cfgp/test_app_mts_tsjh_tssb", menuLevel: "2", menuComponent: "./common/automatic_page", menuName: "出口进货关联", menuId: "6f986dc9464a09c0a3cbd06e6925a1cf", menuType: "1", menuFullScreen: "N", menuHide: "N", menuParentId: "de51ea816b859729cbd1b18f0e61aeb4" },
        { menuPath: "/easy_dev/agility", menuIcon: "DatabaseOutlined", menuLevel: "1",menuName: "敏捷开发", menuId: "7603764bbedec30bf48dcf2cb3277c35", menuType: "0", menuFullScreen: "N", menuHide: "N", menuParentId: "" },
        { menuPath: "/easy_dev/agility/app_module", menuLevel: "2", menuComponent: "./easy_dev/agility/app_module", menuName: "模块管理", menuId: "8f07138da10ba63d050a2061be869f1f", menuType: "0", menuFullScreen: "N", menuHide: "N", menuParentId: "7603764bbedec30bf48dcf2cb3277c35" },
        { menuPath: "/dynamicbs1/cfgp/test_app_mts_tssb", menuLevel: "2", menuComponent: "./common/automatic_page", menuName: "出口明细", menuId: "9477ee24d318aff6b3ee80882e43e49f", menuType: "1", menuFullScreen: "N", menuHide: "N", menuParentId: "de51ea816b859729cbd1b18f0e61aeb4" },
        { menuPath: "/fronteg/media", menuIcon: "ProfileOutlined", menuLevel: "1",menuName: "前端媒体示例", menuId: "95ea791b2efce5be301d919d3c3919f8", menuType: "1", menuFullScreen: "N", menuHide: "N", menuParentId: "" },
        { menuPath: "/easy_dev/agility/app_table", menuLevel: "2", menuComponent: "./easy_dev/agility/app_table", menuName: "表管理", menuId: "ae190d3290b39ebe146dea8e069104fd", menuType: "0", menuFullScreen: "N", menuHide: "N", menuParentId: "7603764bbedec30bf48dcf2cb3277c35" },
        { menuPath: "/system/admin/cfgp/m_sys_sql", menuLevel: "2", menuComponent: "./common/automatic_page", menuName: "自定义SQL管理", menuId: "b197bcfd12bc168a5d5e4bd86d0ad7ac", menuType: "1", menuFullScreen: "N", menuHide: "N", menuParentId: "3b7167e6cdd6640380044f38fded2070" },
        { menuPath: "/fc/cfgp/m_sys_dict", menuIcon: "ProfileOutlined", menuLevel: "1", menuComponent: "./common/automatic_page", menuName: "分词字典管理", menuId: "cec6551fda5351008fba89e067b67576", menuType: "1", menuFullScreen: "N", menuHide: "N", menuParentId: "" },
        { menuPath: "/easy_dev/agility/app_dict", menuLevel: "2", menuComponent: "./easy_dev/agility/app_dict", menuName: "字典管理", menuId: "d1b21422abb2c72de22c23d9798f1d30", menuType: "0", menuFullScreen: "N", menuHide: "N", menuParentId: "7603764bbedec30bf48dcf2cb3277c35" },
        { menuPath: "/system/admin/cfgp/m_sys_role", menuLevel: "2", menuComponent: "./easy_dev/sys/sys_role", menuName: "角色管理", menuId: "dd3b02139e1b39cf59afdb585d8e1f1a", menuType: "1", menuFullScreen: "N", menuHide: "N", menuParentId: "3b7167e6cdd6640380044f38fded2070" },
        { menuPath: "/dynamicbs1/cfgp", menuIcon: "ProfileOutlined", menuLevel: "1",menuName: "字典模块示例", menuId: "de51ea816b859729cbd1b18f0e61aeb4", menuType: "1", menuFullScreen: "N", menuHide: "N", menuParentId: "" },
        { menuPath: "/fronteg/media/cfgp/test_app_eg_media_image", menuLevel: "2", menuComponent: "./common/automatic_page", menuName: "卡片图片", menuId: "e1f07745ac4ca20ae7f5a9ee2d017319", menuType: "1", menuFullScreen: "N", menuHide: "N", menuParentId: "95ea791b2efce5be301d919d3c3919f8" },
        { menuPath: "/media/media_library", menuIcon: "ProfileOutlined", menuLevel: "1", menuComponent: "./easy_dev/media/media_library", menuName: "媒体管理", menuId: "e6219d649be6d02358e82af36d1a1b0a", menuType: "1", menuFullScreen: "N", menuHide: "N", menuParentId: "" },
        { menuPath: "/fronteg/media/cfgp/test_app_eg_media_video", menuLevel: "2", menuComponent: "./common/automatic_page", menuName: "卡片视频", menuId: "e80ee8c7535943d430ca7487837dfeba", menuType: "1", menuFullScreen: "N", menuHide: "N", menuParentId: "95ea791b2efce5be301d919d3c3919f8" },
        { menuPath: "/system/admin/cfgp/m_sys_code_manage", menuLevel: "2", menuComponent: "./common/automatic_page", menuName: "自定义码表管理", menuId: "f511ac89b51329201522eaa0bc05c947", menuType: "1", menuFullScreen: "N", menuHide: "N", menuParentId: "3b7167e6cdd6640380044f38fded2070" },
        { menuPath: "/easy_dev/agility/app_build", menuLevel: "2", menuComponent: "./easy_dev/agility/app_build", menuName: "系统构建", menuId: "fa7b2775322ed506da868b7e1096988e", menuType: "0", menuFullScreen: "N", menuHide: "N", menuParentId: "7603764bbedec30bf48dcf2cb3277c35" },
        { menuPath: "/easy_dev/agility/excel_tuning2", menuLevel: "2", menuComponent: "./easy_dev/agility/excel_tuning2", menuName: "Excel采集2(测试)", menuId: "fb34b3f28ef2bb37bb1921bd11a054a6", menuType: "0", menuFullScreen: "N", menuHide: "N", menuParentId: "7603764bbedec30bf48dcf2cb3277c35" },
        { menuLevel: "3",menuName: "合并", menuId: "hb_001", menuType: "9", menuParentId: "9477ee24d318aff6b3ee80882e43e49f" },
        { menuLevel: "3",menuName: "开票", menuId: "kp_001", menuType: "9", menuParentId: "9477ee24d318aff6b3ee80882e43e49f" },
        { menuLevel: "3",menuName: "列表栏删除", menuId: "test_app_mts_tssb_grid_col_delete", menuType: "9", menuParentId: "9477ee24d318aff6b3ee80882e43e49f" },
        { menuLevel: "3",menuName: "列表栏编辑", menuId: "test_app_mts_tssb_grid_col_edit", menuType: "9", menuParentId: "9477ee24d318aff6b3ee80882e43e49f" },
        { menuLevel: "3",menuName: "工具栏新建", menuId: "test_app_mts_tssb_toolbar_add", menuType: "9", menuParentId: "9477ee24d318aff6b3ee80882e43e49f" },
        { menuLevel: "3",menuName: "工具栏删除", menuId: "test_app_mts_tssb_toolbar_delete", menuType: "9", menuParentId: "9477ee24d318aff6b3ee80882e43e49f" },
        { menuLevel: "3",menuName: "工具栏导出", menuId: "test_app_mts_tssb_toolbar_download", menuType: "9", menuParentId: "9477ee24d318aff6b3ee80882e43e49f" },
        { menuLevel: "3",menuName: "工具栏编辑", menuId: "test_app_mts_tssb_toolbar_edit", menuType: "9", menuParentId: "9477ee24d318aff6b3ee80882e43e49f" },
        { menuLevel: "3",menuName: "工具栏导入", menuId: "test_app_mts_tssb_toolbar_upload", menuType: "9", menuParentId: "9477ee24d318aff6b3ee80882e43e49f" },
        { menuLevel: "3",menuName: "预览", menuId: "yl_001", menuType: "9", menuParentId: "9477ee24d318aff6b3ee80882e43e49f" }
      ],
    },
};
  return res.json(returnData);
}

export default {
  'POST /yw/dditSaas/qxcd/queryCdTree': getMenuTree,    // 权限 菜单
  'POST /dict/auth/menu/queryTree': getMenuTree,  // 权限 角色
  'POST /example/queryTree': queryTree,
};
