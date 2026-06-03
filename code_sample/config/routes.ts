import routesCkts from './menu/menu_ckts';
import routesCktsSjgl from './menu/menu_ckts_cxtj';
import routesXtjcJSXJ from './menu/menu_xtjc_JSXJ';
import routesExample from './menu/menu_example';

// 原出口退税菜单
let routesCktsOld: any = [
  // 免退税申报
  // { name: '智能配单', id: '12', layout: false, icon: 'AuditOutlined', path: '/hts/mts/sjznpd/znpd', hideInMenu: true, menuRender: false, component: './hts/commonModule/pd/mts/sjznpd/znpd' },
  // { name: '智能配单', id: '13', layout: false, icon: 'AuditOutlined', path: '/hts/mts/sjznpd/znpdsd', hideInMenu: true, menuRender: false, component: './hts/commonModule/pd/mts/sjznpd/znpdsd', parentKeys: ['/hts/mts/sjznpd/znpd'] },
  // { name: '智能配单', id: '14', layout: false, icon: 'AuditOutlined', path: '/hts/mts/sjznpd/znpdmx', hideInMenu: true, menuRender: false, component: './hts/commonModule/pd/mts/sjznpd/znpdmx', parentKeys: ['/hts/mts/sjznpd/znpd'] },
  { name: '智能配单Iframe', id: '15', layout: false, icon: 'ProfileOutlined', path: '/hts/mts/sjznpd/iframeZnpd', menuRender: false, component: './hts/iframe/iframeZnpd', hideInMenu: true },
  { name: '项目集成', id: '14', layout: false, icon: 'ProfileOutlined', path: '/errPage', menuRender: false, component: './hts/iframe/iframeIntegration', hideInMenu: true },
  { name: '项目集成（jcfUrl）', id: '141', icon: 'ProfileOutlined', path: '/hts/iframe/iframeXtjc', component: './hts/iframe/iframeXtjc' },
  // [原申报系统-iframe移植] 退税申报（外贸）
  {
    name: '退税申报（外贸）', id: '16', icon: 'BarChartOutlined', path: '/hts/cktsIframe/ts/wm', routes: [
      { path: '/hts/cktsIframe/ts/wm', redirect: '/hts/cktsIframe/ts/wm/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_04_01', id: '1600', pid: '16' },
      { name: '免退税申报（外贸）', id: '1601', pid: '16', icon: 'LayoutOutlined', path: '/hts/cktsIframe/ts/wm/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_04_01', component: './hts/iframe/iframeCkts' },
      { name: '外综服代办退税申报（外贸）', id: '1602', pid: '16', icon: 'AuditOutlined', path: '/hts/cktsIframe/ts/wm/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_04_03', component: './hts/iframe/iframeCkts' },
      { name: '出口已使用过设备退税（外贸）', id: '1603', pid: '16', icon: 'ProfileOutlined', path: '/hts/cktsIframe/ts/wm/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_04_04', component: './hts/iframe/iframeCkts' },
      { name: '购进自用货物退税（外贸）', id: '1604', pid: '16', icon: 'AreaChartOutlined', path: '/hts/cktsIframe/ts/wm/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_04_05', component: './hts/iframe/iframeCkts' },
      { name: '航天发射业务免退税（外贸）', id: '1605', pid: '16', icon: 'FormOutlined', path: '/hts/cktsIframe/ts/wm/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_04_06', component: './hts/iframe/iframeCkts' },
      { name: '出口货物报关单管理（外贸）', id: '1606', pid: '16', icon: 'SendOutlined', path: '/hts/cktsIframe/ts/wm/ckhwbgdwm', component: './hts/commonModule/ckhwbgd' },
      { name: '增值税专用发票管理（外贸）', id: '1607', pid: '16', icon: 'SendOutlined', path: '/hts/cktsIframe/ts/wm/zzszyfpgl', component: './hts/commonModule/zzszyfp' },
      { name: '报关单逐项配单', id: '1608', pid: '16', icon: 'FormOutlined', path: '/hts/cktsIframe/ts/wm/bgdzxpd', component: './hts/commonModule/pd/mts/sjznpd/bgdzxpd' },
      { name: '发票逐项配单', id: '1609', pid: '16', icon: 'FormOutlined', path: '/hts/cktsIframe/ts/wm/fpzxpd', component: './hts/commonModule/pd/mts/sjznpd/fpzxpd' },
    ]
  },
  // [原申报系统-iframe移植] 退税申报（生产）
  {
    name: '退税申报（生产）', id: '17', icon: 'BarChartOutlined', path: '/hts/cktsIframe/ts/sc', routes: [
      { path: '/hts/cktsIframe/ts/sc', redirect: '/hts/cktsIframe/ts/sc/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_03_01', id: '1700', pid: '17' },
      { name: '免抵退税申报（生产）', id: '1701', pid: '17', icon: 'SendOutlined', path: '/hts/cktsIframe/ts/sc/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_03_01', component: './hts/iframe/iframeCkts' },
      { name: '出口已使用过设备退税（生产）', id: '1702', pid: '17', icon: 'ProfileOutlined', path: '/hts/cktsIframe/ts/sc/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_03_02', component: './hts/iframe/iframeCkts' },
      { name: '购进自用货物退税（生产）', id: '1703', pid: '17', icon: 'AreaChartOutlined', path: '/hts/cktsIframe/ts/sc/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_03_03', component: './hts/iframe/iframeCkts' },
      { name: '出口非自产消费税退税（生产）', id: '1704', pid: '17', icon: 'RadarChartOutlined', path: '/hts/cktsIframe/ts/sc/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_03_04', component: './hts/iframe/iframeCkts' },
      { name: '出口货物报关单管理（生产）', id: '1705', pid: '17', icon: 'SendOutlined', path: '/hts/cktsIframe/ts/sc/ckhwbgdsc', component: './hts/commonModule/ckhwbgd' },
    ]
  },
  // [原申报系统-iframe移植] 证明申报
  {
    name: '证明申报', id: '18', icon: 'AuditOutlined', path: '/hts/cktsIframe/zm', routes: [
      { path: '/hts/cktsIframe/zm', redirect: '/hts/cktsIframe/zm/lljg/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_05_01_01', id: '1800', pid: '18' },
      {
        name: '来料加工免税证明申请表', id: '1801', pid: '18', icon: 'SendOutlined', path: '/hts/cktsIframe/zm/lljg', routes: [
          { name: '来料加工免税证明', id: '180101', pid: '1801', path: '/hts/cktsIframe/zm/lljg/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_05_01_01', component: './hts/iframe/iframeCkts' },
          { name: '来料加工免税证明核销', id: '180102', pid: '1801', path: '/hts/cktsIframe/zm/lljg/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_05_01_02', component: './hts/iframe/iframeCkts' },
        ]
      },
      {
        name: '免税出口卷烟管理', id: '1802', pid: '18', icon: 'LayoutOutlined', path: '/hts/cktsIframe/zm/jygl', routes: [
          { name: '准予免税购进卷烟证明', id: '180201', pid: '1802', path: '/hts/cktsIframe/zm/jygl/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_05_02_01', component: './hts/iframe/iframeCkts' },
          { name: '出口烟卷已免税证明（生产）', id: '180202', pid: '1802', path: '/hts/cktsIframe/zm/jygl/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_05_02_02', component: './hts/iframe/iframeCkts' },
          { name: '出口烟卷免税核销申请', id: '180203', pid: '1802', path: '/hts/cktsIframe/zm/jygl/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_05_02_03', component: './hts/iframe/iframeCkts' },
        ]
      },
      { name: '代理出口货物证明', id: '1803', pid: '18', icon: 'AreaChartOutlined', path: '/hts/cktsIframe/zm/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_05_03', component: './hts/iframe/iframeCkts' },
      { name: '代理进口货物证明', id: '1804', pid: '18', icon: 'ProfileOutlined', path: '/hts/cktsIframe/zm/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_05_04', component: './hts/iframe/iframeCkts' },
      { name: '委托出口货物证明', id: '1805', pid: '18', icon: 'FormOutlined', path: '/hts/cktsIframe/zm/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_05_05', component: './hts/iframe/iframeCkts' },
      { name: '出口货物转内销证明（外贸）', id: '1806', pid: '18', icon: 'OneToOneOutlined', path: '/hts/cktsIframe/zm/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_05_06', component: './hts/iframe/iframeCkts' },
      { name: '出口货物退运证明（外贸）', id: '1807', pid: '18', icon: 'RadarChartOutlined', path: '/hts/cktsIframe/zm/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_05_07', component: './hts/iframe/iframeCkts' },
      { name: '出口货物退运证明（生产）', id: '1808', pid: '18', icon: 'RadarChartOutlined', path: '/hts/cktsIframe/zm/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_05_11', component: './hts/iframe/iframeCkts' },
      { name: '中标证明通知书', id: '1809', pid: '18', icon: 'VerifiedOutlined', path: '/hts/cktsIframe/zm/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_05_08', component: './hts/iframe/iframeCkts' },
      { name: '补办出口退免税证明', id: '1810', pid: '18', icon: 'CreditCardOutlined', path: '/hts/cktsIframe/zm/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_05_09', component: './hts/iframe/iframeCkts' },
      { name: '作废出口退免税证明', id: '1811', pid: '18', icon: 'ScheduleOutlined', path: '/hts/cktsIframe/zm/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_05_10', component: './hts/iframe/iframeCkts' },
    ]
  },
  // [原申报系统-iframe移植] 证明申报
  {
    name: '资格备案', id: '19', icon: 'FormOutlined', path: '/hts/cktsIframe/zg', routes: [
      { path: '/hts/cktsIframe/zg', redirect: '/hts/cktsIframe/zg/bagl/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_07_01_02', id: '1900', pid: '19' },
      {
        name: '出口退（免）税备案管理', id: '1901', pid: '19', icon: 'BarChartOutlined', path: '/hts/cktsIframe/zg/bagl', routes: [
          { name: '出口退免税备案变更', id: '190101', pid: '1901', path: '/hts/cktsIframe/zg/bagl/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_07_01_02', component: './hts/iframe/iframeCkts' },
          { name: '出口退免税备案撤回', id: '190102', pid: '1901', path: '/hts/cktsIframe/zg/bagl/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_07_01_03', component: './hts/iframe/iframeCkts' },
        ]
      },
      {
        name: '代办退税备案管理（生产）', id: '1902', pid: '19', icon: 'LayoutOutlined', path: '/hts/cktsIframe/zg/dbtsbagl', routes: [
          { name: '代办退税备案', id: '190201', pid: '1902', path: '/hts/cktsIframe/zg/dbtsbagl/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_07_02_01', component: './hts/iframe/iframeCkts' },
          { name: '代办退税备案撤回', id: '190202', pid: '1902', path: '/hts/cktsIframe/zg/dbtsbagl/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_07_02_02', component: './hts/iframe/iframeCkts' },
        ]
      },
      {
        name: '放弃退（免）税备案', id: '1903', pid: '19', icon: 'AreaChartOutlined', path: '/hts/cktsIframe/zg/fqtmsba', routes: [
          { name: '出口放弃退免税声明', id: '190301', pid: '1903', path: '/hts/cktsIframe/zg/fqtmsba/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_07_03_00', component: './hts/iframe/iframeCkts' },
          { name: '出口放弃免税权声明', id: '190302', pid: '1903', path: '/hts/cktsIframe/zg/fqtmsba/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_07_03_03', component: './hts/iframe/iframeCkts' },
          { name: '恢复出口退免税声明', id: '190303', pid: '1903', path: '/hts/cktsIframe/zg/fqtmsba/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_07_03_04', component: './hts/iframe/iframeCkts' },
        ]
      },
      { name: '集团公司成员企业备案', id: '1904', pid: '19', icon: 'OneToOneOutlined', path: '/hts/cktsIframe/zg/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_07_04', component: './hts/iframe/iframeCkts' },
      { name: '边贸代理备案', id: '1905', pid: '19', icon: 'ProfileOutlined', path: '/hts/cktsIframe/zg/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_07_05', component: './hts/iframe/iframeCkts' },
      { name: '先退税后核销资格申请（生产）', id: '1906', pid: '19', icon: 'RadarChartOutlined', path: '/hts/cktsIframe/zg/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_07_06', component: './hts/iframe/iframeCkts' },
      { name: '出口退税业务提醒信息', id: '1907', pid: '19', icon: 'SendOutlined', path: '/hts/cktsIframe/zg/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_07_07', component: './hts/iframe/iframeCkts' },
    ]
  },
  // [原申报系统-iframe移植] 其他申报
  {
    name: '其他申报', id: '20', icon: 'RadarChartOutlined', path: '/hts/cktsIframe/qt', routes: [
      { path: '/hts/cktsIframe/qt', redirect: '/hts/cktsIframe/qt/ckqy/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_08_01_01', id: '2000', pid: '20' },
      {
        name: '出口企业分类管理', id: '2001', pid: '20', icon: 'AreaChartOutlined', path: '/hts/cktsIframe/qt/ckqy', routes: [
          { name: '一类出口企业评定申请', id: '200101', pid: '2001', path: '/hts/cktsIframe/qt/ckqy/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_08_01_01', component: './hts/iframe/iframeCkts' },
          { name: '出口企业分类管理复评申请', id: '200102', pid: '2001', path: '/hts/cktsIframe/qt/ckqy/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_08_01_02', component: './hts/iframe/iframeCkts' },
        ]
      },
      { name: '出口信息查询申请', id: '2002', pid: '20', icon: 'LayoutOutlined', path: '/hts/cktsIframe/qt/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_08_03', component: './hts/iframe/iframeCkts' },
      { name: '企业撤回申报数据申请（外贸）', id: '2003', pid: '20', icon: 'FormOutlined', path: '/hts/cktsIframe/qt/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_08_05', component: './hts/iframe/iframeCkts' },
      { name: '企业撤回申报数据申请（生产）', id: '2004', pid: '20', icon: 'FormOutlined', path: '/hts/cktsIframe/qt/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_08_04', component: './hts/iframe/iframeCkts' },
      { name: '进货凭证信息回退', id: '2005', pid: '20', icon: 'BarChartOutlined', path: '/hts/cktsIframe/qt/%2Fdditax.ckts%2Fgtgn%2Ftemplate%2Ftemplate_step%2Fname%3DB_08_02', component: './hts/iframe/iframeCkts' },
    ]
  },
];

// 共通菜单
let routesCommon: any = [
  // 工作台
  { name: '工作台', id: '00', icon: 'OneToOneOutlined', path: '/hts/workplace', component: './hts/workplace', menuRender: false },
  // 权限管理
  {
    name: '权限管理', id: '21', icon: 'DeploymentUnitOutlined', path: '/hts/qxgl', routes: [
      { path: '/hts/qxgl', redirect: '/hts/qxgl/yh', id: '2100', pid: '21' },
      { name: '用户管理', id: '2101', pid: '21', icon: 'UserOutlined', path: '/hts/qxgl/yh', component: './hts/qxgl/yh' },
      { name: '企业管理', id: '2102', pid: '21', icon: 'HomeOutlined', path: '/hts/qxgl/qy', component: './hts/qxgl/qy' },
      { name: '角色管理', id: '2103', pid: '21', icon: 'SecurityScanOutlined', path: '/hts/qxgl/js', component: './hts/qxgl/js' },
      { name: '菜单管理', id: '2104', pid: '21', icon: 'ProfileOutlined', path: '/hts/qxgl/cd', component: './hts/qxgl/cd' },
      { name: '权限组管理', id: '2105', pid: '21', icon: 'HomeOutlined', path: '/hts/qxgl/qxz', component: './hts/qxgl/qxz' },
      { name: '渠道管理', id: '2106', pid: '21', icon: 'HomeOutlined', path: '/hts/qxgl/qd', component: './hts/qxgl/qd' },
      { name: '资源管理', id: '2107', pid: '21', icon: 'HomeOutlined', path: '/hts/qxgl/zy', component: './hts/qxgl/zy' },
      { name: '后端服务管理', id: '2108', pid: '21', icon: 'HomeOutlined', path: '/hts/qxgl/fw', component: './hts/qxgl/fw' },
      { name: 'API服务管理', id: '2109', pid: '21', icon: 'HomeOutlined', path: '/hts/qxgl/api', component: './hts/qxgl/api' },
      { name: '企业配置管理', id: '2109', pid: '21', icon: 'HomeOutlined', path: '/hts/qxgl/qypzgl', component: './hts/qxgl/qypzgl' },
      { name: '菜单分组管理', id: '2111', pid: '21', icon: 'ProfileOutlined', path: '/hts/qxgl/cdfz', component: './hts/qxgl/cdfz' },
    ]
  },
  // 配置管理
  {
    name: '配置管理', id: '22', icon: 'CoffeeOutlined', path: '/hts/pzgl', routes: [
      { path: '/hts/pzgl', redirect: '/hts/pzgl/dzswjpzgl' },
      { name: '电子税务局登录', id: '2208', pid: '22', icon: 'UserOutlined', path: '/hts/pzgl/dzswjpzgl', component: './hts/pzgl/dzswjpzgl' },
      { name: '退税汇率管理', id: '2201', pid: '22', icon: 'UserOutlined', path: '/hts/pzgl/tshlgl', component: './hts/pzgl/tshlgl' },
      { name: '客户信息管理', id: '2202', pid: '22', icon: 'HomeOutlined', path: '/hts/pzgl/khxxgl', routes: [
          { path: '/hts/pzgl/khxxgl', redirect: '/hts/pzgl/khxxgl/stwtqyxxgl', id: '2200', pid: '22' },
          { name: '受托/委托企业信息管理', id: '220201', pid: '2202', icon: 'UserOutlined', path: '/hts/pzgl/khxxgl/stwtqyxxgl', component: './hts/pzgl/khxxgl/stwtqyxxgl' },
          { name: '外商管理', id: '220203', pid: '2202', icon: 'BarChartOutlined', path: '/hts/pzgl/khxxgl', routes: [
            { path: '/hts/pzgl/khxxgl', redirect: '/hts/pzgl/khxxgl/wsgl',id: '22020300', pid: '220203' },
            { name: '外商开票信息管理', id: '220202', pid: '220203', icon: 'HomeOutlined', path: '/hts/pzgl/khxxgl/wsgl', component: './hts/pzgl/khxxgl/wsgl' },
            { name: '外商付汇关系管理', id: '22020301', pid: '220203', icon: 'UserOutlined', path: '/hts/pzgl/khxxgl/wsglwjj/wsfhgxgl', component: './hts/pzgl/khxxgl/wsglwjj/wsfhgxgl' },
            ]
          },
        ]
      },

      { name: '发票配置管理', id: '2203', pid: '22', icon: 'SecurityScanOutlined', path: '/hts/pzgl/fppzgl', component: './hts/pzgl/fppzgl' },
      { name: '数电配置管理', id: '2208', pid: '22', icon: 'BarChartOutlined', path: '/hts/pzgl/sdppzgl', routes: [
        { path: '/hts/pzgl/sdppzgl', redirect: '/hts/pzgl/sdppzgl/djdlpz', pid: '22' },
        { name: '电局登录配置', id: '220801', pid: '2208', icon: 'UserOutlined', path: '/hts/pzgl/sdppzgl/djdlpz', component: './hts/pzgl/sdppzgl/djdlpz' },
      ]
      },
      { name: '进料核销配置管理', id: '2208', pid: '22', icon: 'SecurityScanOutlined', path: '/hts/pzgl/jlhxgl', component: './hts/pzgl/jlhxgl' },
      // { name: '单证备案配置管理', id: '2204', pid: '22', icon: 'ProfileOutlined', path: '/hts/pzgl/dzbapzgl', component: './hts/pzgl/dzbapzgl' },
      { name: '单证备案配置管理', id: '2212', pid: '22', icon: 'ProfileOutlined', path: '/hts/pzgl/badzsz', component: './hts/badz2/badzsz' },
      { name: '监管方式码表管理', id: '2205', pid: '22', icon: 'BarChartOutlined', path: '/hts/pzgl/jgfsmbgl', component: './hts/pzgl/jgfsmbgl' },
      { name: '海关IC卡管理', id: '2206', pid: '22', icon: 'BarChartOutlined', path: '/hts/pzgl/icCard', routes: [
          { path: '/hts/pzgl/icCard', redirect: '/hts/pzgl/icCard/icCardgl', pid: '22' },
          { name: '海关IC卡管理', id: '220601', pid: '2206', icon: 'UserOutlined', path: '/hts/pzgl/icCard/icCardgl', component: './hts/pzgl/icCard/icCardgl' },
          { name: '解除禁用IC卡', id: '220602', pid: '2206', icon: 'ProfileOutlined', path: '/hts/pzgl/icCard/icCardjy', component: './hts/pzgl/icCard/icCardjy' },
          { name: '海关IC卡操作日志', id: '220603', pid: '2206', icon: 'HomeOutlined', path: '/hts/pzgl/icCard/icCardrz', component: './hts/pzgl/icCard/icCardrz' },
        ]
      },
      { name: '智能配单配置管理', id: '2207', pid: '22', icon: 'FormOutlined', path: '/hts/pzgl/znpdpzgl', routes: [
          { path: '/hts/pzgl/znpdpzgl', redirect: '/hts/pzgl/znpdpzgl/zdpppzgl', id: '2200', pid: '22' },
          { name: '自动匹配配置管理', id: '220701', pid: '2207', icon: 'UserOutlined', path: '/hts/pzgl/znpdpzgl/zdpppzgl', component: './hts/pzgl/znpdpzgl/zdpppzgl' },
        ]
      },
      { path: '/hts/pzgl/dsrw', id: '2211', pid: '22', name: '数据定时下载管理', icon: 'RobotOutlined', component: './hts/pzgl/dsrw' },
      { name: '发票下载', id: '2213', pid: '22', icon: 'SecurityScanOutlined', path: '/hts/pzgl/fpxz', component: './hts/pzgl/fpxz' },
      { name: '换汇成本管理', id: '2212', pid: '22', icon: 'SecurityScanOutlined', path: '/hts/pzgl/hhcbgl', component: './hts/pzgl/hhcbgl' },
      { name: 'AI配单配置管理', id: '2215', pid: '22', icon: 'SecurityScanOutlined', path: '/hts/pzgl/aipdgl', component: './hts/pzgl/aipdgl' },
      { name: '超级配单配置管理', id: '2216', pid: '22', icon: 'SecurityScanOutlined', path: '/hts/pzgl/cjpdgl', component: './hts/pzgl/cjpdgl' },
      { name: '收汇数据定时匹配管理', id: '2214', pid: '22', icon: 'RobotOutlined', path: '/hts/pzgl/shsjdsppgl', component: './hts/pzgl/shsjdsppgl' },


    ]
  },
];

// hts
let routesHts: any = [
  // 出口发票
  {
    name: '出口发票开具（旧）', id: '09', icon: 'SendOutlined', path: '/hts/ckfp', routes: [
      { path: '/hts/ckfp', redirect: '/hts/ckfp/ckfpgl', id: '0900', pid: '09' },
      { name: '发票概览', id: '0901', pid: '09', icon: 'BarChartOutlined', path: '/hts/ckfp/ckfpgl', component: './hts/ckfp/ckfpgl' },
      { name: '报关单管理', id: '0902', pid: '09', icon: 'LayoutOutlined', path: '/hts/ckfp/bgdgl', component: './hts/ckfp/bgdgl' },
      { name: '按报关单开具', id: '0903', pid: '09', icon: 'AuditOutlined', path: '/hts/ckfp/abgdkj', component: './hts/ckfp/abgdkj' },
      { name: '按报关单开具', id: '0904', pid: '09', icon: 'AuditOutlined', component: './hts/ckfp/abgdkj', path: '/hts/ckfp/abgdkj21', parentKeys: ['/hts/ckfp/abgdkj'], hideInMenu: true },
      { name: '导入模板开具', id: '0905', pid: '09', icon: 'AreaChartOutlined', component: './hts/ckfp/drmbkj', path: '/hts/ckfp/drmbkj' },
      { name: '发票申请单', id: '0906', pid: '09', icon: 'ProfileOutlined', path: '/hts/ckfp/fpsqd', component: './hts/ckfp/fpsqd' },
      { name: '发票管理', id: '0907', pid: '09', icon: 'FormOutlined', path: '/hts/ckfp/fpkjgl', component: './hts/ckfp/fpkjgl' },
      { name: '发票管理', id: '0908', pid: '09', icon: 'FormOutlined', path: '/hts/ckfp/hzfp', component: './hts/ckfp/fpkjgl', parentKeys: ['/hts/ckfp/fpkjgl'], hideInMenu: true },
      { name: '发票管理', id: '0909', pid: '09', icon: 'FormOutlined', path: '/hts/ckfp/zffp', component: './hts/ckfp/fpkjgl', parentKeys: ['/hts/ckfp/fpkjgl'], hideInMenu: true },
      // { name: '发票配置', id: '0908', pid: '09', icon: 'RadarChartOutlined', path: '/hts/ckfp/fpkjpz', component: './hts/ckfp/fpkjpz' },
    ]
  },
  {
    name: '出口发票开具', id: '90', icon: 'SendOutlined', path: '/hts/ckfpkj', routes: [
      { path: '/hts/ckfpkj', redirect: '/hts/ckfpkj/ckfpgl', id: '0900', pid: '09' },
      { name: '发票概览', id: '9001', pid: '90', icon: 'BarChartOutlined', path: '/hts/ckfpkj/ckfpgl', component: './hts/ckfpkj/ckfpgl' },
      { name: '报关单管理', id: '9002', pid: '90', icon: 'LayoutOutlined', path: '/hts/ckfpkj/bgdgl', component: './hts/ckfpkj/bgdgl' },
      { name: '按报关单开具', id: '9003', pid: '90', icon: 'AuditOutlined', path: '/hts/ckfpkj/abgdkj', component: './hts/ckfpkj/abgdkj' },
      { name: '按报关单开具', id: '9004', pid: '90', icon: 'AuditOutlined', component: './hts/ckfpkj/abgdkj', path: '/hts/ckfpkj/abgdkj21', parentKeys: ['/hts/ckfpkj/abgdkj'], hideInMenu: true },
      { name: '导入模板开具', id: '9005', pid: '90', icon: 'AreaChartOutlined', component: './hts/ckfpkj/drmbkj', path: '/hts/ckfpkj/drmbkj' },
      { name: '发票申请单', id: '9006', pid: '90', icon: 'ProfileOutlined', path: '/hts/ckfpkj/fpsqd', component: './hts/ckfpkj/fpsqd' },
      { name: '出口发票开具', id: '9007', pid: '90', icon: 'FundOutlined', path: '/hts/ckfpkj/ckfpkj', routes: [
        { path: '/hts/ckfpkj/ckfpkj', redirect: '/hts/ckfpkj/ckfpkj/sdpkj', id: '90070', pid: '9007' },
        { name: '数电票开具', id: '900701', pid: '9007', path: '/hts/ckfpkj/ckfpkj/sdpkj', component: './hts/ckfpkj/ckfpkj/sdpkj' },
        { name: '税控票开具', id: '900702', pid: '9007', path: '/hts/ckfpkj/ckfpkj/skpkj', component: './hts/ckfpkj/ckfpkj/skpkj' },
        { name: '发票红冲', id: '900703', pid: '9007', path: '/hts/ckfpkj/ckfpkj/fphc', component: './hts/ckfpkj/ckfpkj/fphc' },
        { name: '发票作废', id: '900704', pid: '9007', path: '/hts/ckfpkj/ckfpkj/fpzf', component: './hts/ckfpkj/ckfpkj/fpzf' },
        { name: '开票状态跟踪', id: '900705', pid: '9007', path: '/hts/ckfpkj/ckfpkj/fpztgz', component: './hts/ckfpkj/ckfpkj/fpztgz' },
        { name: '开票状态跟踪', id: '900706', pid: '9007', path: '/hts/ckfpkj/ckfpkj/hzFpztgz', component: './hts/ckfpkj/ckfpkj/fpztgz', parentKeys: ['/hts/ckfpkj/ckfpkj/fpztgz'], hideInMenu: true },
        { name: '开票状态跟踪', id: '900707', pid: '9007', path: '/hts/ckfpkj/ckfpkj/zfFpztgz', component: './hts/ckfpkj/ckfpkj/fpztgz', parentKeys: ['/hts/ckfpkj/ckfpkj/fpztgz'], hideInMenu: true },
      ] },
      { name: '发票管理', id: '9008', pid: '90', icon: 'FormOutlined', path: '/hts/ckfpkj/fpgl', component: './hts/ckfpkj/fpgl' },
      { name: '发票管理', id: '9009', pid: '90', icon: 'FormOutlined', path: '/hts/ckfpkj/hzfpgl', component: './hts/ckfpkj/fpgl', parentKeys: ['/hts/ckfpkj/fpgl'], hideInMenu: true },
      { name: '发票管理', id: '9010', pid: '90', icon: 'FormOutlined', path: '/hts/ckfpkj/zffpgl', component: './hts/ckfpkj/fpgl', parentKeys: ['/hts/ckfpkj/fpgl'], hideInMenu: true },
    ]
  },
  // 备案单证
  {
    name: '备案单证', id: '10', icon: 'VerifiedOutlined', path: '/hts/badz', routes: [
      { path: '/hts/badz', redirect: '/hts/badz/dzgl', id: '1000', pid: '10' },
      {
        name: '数据下载管理', id: '1001', pid: '10', icon: 'FundOutlined', path: '/hts/badz/sjxzgl', routes: [
          { path: '/hts/badz/sjxzgl', redirect: '/hts/badz/sjxzgl/sjxz', id: '10010', pid: '1001' },
          { name: '数据下载', id: '100101', pid: '1001', path: '/hts/badz/sjxzgl/sjxz', component: './hts/badz/sjxzgl/sjxz' },
          { name: '进度查询', id: '100102', pid: '1001', path: '/hts/badz/sjxzgl/jdcx', component: './hts/badz/sjxzgl/jdcx' },
        ]
      },
      { name: '单证管理', id: '1002', pid: '10', icon: 'AuditOutlined', path: '/hts/badz/dzgl', component: './hts/badz/dzgl' },
      {
        name: '单证备案', id: '1003', pid: '10', icon: 'AreaChartOutlined', path: '/hts/badz/dzba', routes: [
          { path: '/hts/badz/dzba', redirect: '/hts/badz/dzba/dzba', id: '100300', pid: '1003' },
          { name: '单证备案', id: '100301', pid: '1003', path: '/hts/badz/dzba/dzba', component: './hts/badz/dzba/dzba' },
          { name: '资料采集', id: '100302', pid: '1003', path: '/hts/badz/dzba/zlcj', component: './hts/badz/dzba/zlcj' },
        ]
      },
      { name: '资料归档', id: '1004', pid: '10', icon: 'BarChartOutlined', path: '/hts/badz/zlgd', component: './hts/badz/zlgd' },
      {
        name: '资料调阅', id: '1005', pid: '10', icon: 'LayoutOutlined', path: '/hts/badz/zldy', routes: [
          { path: '/hts/badz/zldy', redirect: '/hts/badz/zldy/abgddy', id: '100500', pid: '1005' },
          { name: '按报关单调阅', id: '100501', pid: '1005', path: '/hts/badz/zldy/abgddy', component: './hts/badz/zldy/abgddy' },
          { name: '按所属期调阅', id: '100502', pid: '1005', path: '/hts/badz/zldy/assqpcdy', component: './hts/badz/zldy/assqpcdy' },
        ]
      },
      {
        name: '核查调阅', id: '1006', pid: '10', icon: 'FormOutlined', path: '/hts/badz/hcdy', routes: [
          { path: '/hts/badz/hcdy', redirect: '/hts/badz/hcdy/hcjl', id: '100600', pid: '1006' },
          { name: '核查任务', id: '100601', pid: '1006', path: '/hts/badz/hcdy/hcjl', component: './hts/badz/hcdy/hcjl' },
          { name: '任务详情', id: '100602', pid: '1006', path: '/hts/badz/hcdy/dzhc', component: './hts/badz/hcdy/dzhc' },
        ]
      },
      { name: '备案设置', id: '1007', pid: '10', path: '/hts/badz/badzsz', icon: 'CreditCardOutlined', component: './hts/badz/badzsz/jcsz' },
    ]
  },
  // 进料加工
  {
    name: '进料加工核销', id: '11', icon: 'SendOutlined', path: '/hts/jljg', routes: [
      { path: '/hts/jljg', redirect: '/hts/jljg/mxcj', id: '1100', pid: '11' },
      {
        name: '数据下载管理', id: '1101', pid: '11', icon: 'FundOutlined', path: '/hts/jljg/sjxz', routes: [
          { path: '/hts/jljg/sjxz', redirect: '/hts/jljg/sjxz/sjxz', id: '110100', pid: '1101' },
          { name: '数据下载', id: '110101', pid: '1101', path: '/hts/jljg/sjxz/sjxz', component: './hts/jljg/sjxz/sjxz' },
          { name: '进度查询', id: '110102', pid: '1101', path: '/hts/jljg/sjxz/jdcx', component: './hts/jljg/sjxz/jdcx' },
          {
            name: '加贸海关数据查询', id: '110103', pid: '1101', path: '/hts/jljg/sjxz/hghxsjcx', routes: [
              { path: '/hts/jljg/sjxz/hghxsjcx', redirect: '/hts/jljg/sjxz/hghxsjcx/scxxcx', id: '11010300', pid: '110103' },
              { name: '加工贸易手册数据', id: '11010301', pid: '110103', path: '/hts/jljg/sjxz/hghxsjcx/scxxcx', component: './hts/jljg/sjxz/hghxsjcx/scxxcx' },
              { name: '加工贸易账册数据', id: '11010302', pid: '110103', path: '/hts/jljg/sjxz/hghxsjcx/zcxxcx', component: './hts/jljg/sjxz/hghxsjcx/zcxxcx' },
              { name: '保税核注清单数据', id: '11010303', pid: '110103', path: '/hts/jljg/sjxz/hghxsjcx/jckhzqdcx', component: './hts/jljg/sjxz/hghxsjcx/jckhzqdcx' },
              { name: '核销报关单数据', id: '11010304', pid: '110103', path: '/hts/jljg/sjxz/hghxsjcx/jckbgdcx', component: './hts/jljg/sjxz/hghxsjcx/jckbgdcx' },
            ]
          },
          {
            name: '加贸反馈数据查询', id: '110104', pid: '1101', path: '/hts/jljg/sjxz/jmfksjcx', icon: 'SnippetsOutlined', routes: [
              { path: '/hts/jljg/sjxz/jmfksjcx', redirect: '/hts/jljg/sjxz/jmfksjcx/scxxcx', id: '11010400', pid: '110104' },
              { name: '已核销手册数据', id: '11010401', pid: '110104', path: '/hts/jljg/sjxz/jmfksjcx/scxxcx', component: './hts/jljg/sjxz/jmfksjcx/scxxcx' },
              { name: '已核销账册数据', id: '11010402', pid: '110104', path: '/hts/jljg/sjxz/jmfksjcx/zcxxcx', component: './hts/jljg/sjxz/jmfksjcx/zcxxcx' },
              { name: '已核销报关单数据', id: '11010403', pid: '110104', path: '/hts/jljg/sjxz/jmfksjcx/jckbgdcx', component: './hts/jljg/sjxz/jmfksjcx/jckbgdcx' },
              { name: '免抵退出口明细数据', id: '11010404', pid: '110104', path: '/hts/jljg/sjxz/jmfksjcx/ckmxcx', component: './hts/jljg/sjxz/jmfksjcx/ckmxcx' },
            ]
          },
        ]
      },
      { name: '智能分析', id: '1102', pid: '11', path: '/hts/jljg/znfx', icon: 'ProfileOutlined', component: './hts/jljg/znfx' },
      { name: '内部台账', id: '1103', pid: '11', path: '/hts/jljg/nbtzhd', icon: 'SaveOutlined', component: './hts/jljg/nbtzhd' },
      { name: '核销申报数据管理', id: '1104', pid: '11', path: '/hts/jljg/mxcj', icon: 'ShopOutlined', component: './hts/jljg/mxcj' },
      {
        name: '核销数据申报', id: '1105', pid: '11', path: '/hts/jljg/ckts/scsbsj/JLJG_MDTHX', icon: 'ScheduleOutlined', component: './hts/ckts/scsbsj/scsbsj', routes: [
          { path: '/hts/jljg/ckts/scsbsj/JLJG_MDTHX', redirect: '/hts/jljg/ckts/scsbsj/JLJG_MDTHX/SBMXCX_JLJG_01', id: '110500', pid: '1105' },
          { name: '进料加工业务免抵退税核销表', id: '110501', pid: '1105', path: '/hts/jljg/ckts/scsbsj/JLJG_MDTHX/SBMXCX_JLJG_01', component: './hts/jljg/mxcj/mdthx', hideInMenu: true },
          { name: '已核销手（账）册海关数据调整表', id: '110502', pid: '1105', path: '/hts/jljg/ckts/scsbsj/JLJG_MDTHX/SBMXCX_JLJG_02', component: './hts/jljg/mxcj/yhxtz', hideInMenu: true },
        ]
      },
      { name: '申报进度查询', id: '1106', pid: '11', path: '/hts/jljg/ckts/sbsjcx/JLJG_MDTHX', icon: 'CreditCardOutlined', component: './hts/ckts/sbsjcx/sbsjcx' },
      { name: '核销数据查询', id: '1107', pid: '11', path: '/hts/jljg/sbjgcx', icon: 'GroupOutlined', component: './hts/jljg/sbjgcx' },
      { name: '核销数据查询', id: '1108', pid: '11', path: '/hts/jljg/sbjgcxHmdthxF', icon: 'GroupOutlined', component: './hts/jljg/sbjgcx', parentKeys: ['/hts/jljg/sbjgcx'], hideInMenu: true },
      { name: '核销数据查询', id: '1109', pid: '11', path: '/hts/jljg/sbjgcxHmdthxJ', icon: 'GroupOutlined', component: './hts/jljg/sbjgcx', parentKeys: ['/hts/jljg/sbjgcx'], hideInMenu: true },
      { name: '核销数据查询', id: '1110', pid: '11', path: '/hts/jljg/sbjgcxHyhxtzJ', icon: 'GroupOutlined', component: './hts/jljg/sbjgcx', parentKeys: ['/hts/jljg/sbjgcx'], hideInMenu: true },
      { name: '核销数据查询', id: '1111', pid: '11', path: '/hts/jljg/sbjgcxHyhxtzF', icon: 'GroupOutlined', component: './hts/jljg/sbjgcx', parentKeys: ['/hts/jljg/sbjgcx'], hideInMenu: true },
    ]
  },
  // 数据报表
  {
    name: '数据报表（外贸）', id: '23', icon: 'AuditOutlined', path: '/hts/sjbb/wm', routes: [
      { path: '/hts/sjbb/wm', redirect: '/hts/sjbb/wm/sjgx' },
      { name: '数据更新', id: '2301', pid: '23', path: '/hts/sjbb/wm/sjgx', icon: 'ProfileOutlined', component: './hts/sjbb/wm/sjgx' },
      {
        name: '统计报表', id: '2302', pid: '23', icon: 'OneToOneOutlined', path: '/hts/sjbb/wm/tjbb', routes: [
          { path: '/hts/sjbb/wm/tjbb', redirect: '/hts/sjbb/wm/tjbb/ckqk/fyhz', id: '230200', pid: '2302' },
          {
            name: '出口情况', id: '230201', pid: '2302', path: '/hts/sjbb/wm/tjbb/ckqk', routes: [
              { path: '/hts/sjbb/wm/tjbb/ckqk', redirect: '/hts/sjbb/wm/tjbb/ckqk/fyhz', id: '23020100', pid: '230201' },
              { name: '分月汇总', id: '23020101', pid: '230201', path: '/hts/sjbb/wm/tjbb/ckqk/fyhz', component: './hts/sjbb/wm/tjbb/ckqk/fyhz' },
              { name: '分商品出口情况', id: '23020102', pid: '230201', path: '/hts/sjbb/wm/tjbb/ckqk/fspckqk', component: './hts/sjbb/wm/tjbb/ckqk/fspckqk' },
              { name: '分国别出口情况', id: '23020103', pid: '230201', path: '/hts/sjbb/wm/tjbb/ckqk/fgbckqk', component: './hts/sjbb/wm/tjbb/ckqk/fyhz' },
              { name: '分口岸出口情况', id: '23020104', pid: '230201', path: '/hts/sjbb/wm/tjbb/ckqk/fkackqk', component: './hts/sjbb/wm/tjbb/ckqk/fyhz' },
              { name: '分监管方式出口情况', id: '23020105', pid: '230201', path: '/hts/sjbb/wm/tjbb/ckqk/fjgfsckqk', component: './hts/sjbb/wm/tjbb/ckqk/fyhz' },
              { name: '分运输方式出口情况', id: '23020106', pid: '230201', path: '/hts/sjbb/wm/tjbb/ckqk/fysfsckqk', component: './hts/sjbb/wm/tjbb/ckqk/fyhz' },
              { name: '合同出口情况', id: '23020107', pid: '230201', path: '/hts/sjbb/wm/tjbb/ckqk/htckqk', component: './hts/sjbb/wm/tjbb/ckqk/fyhz' },
              { name: '分境外收货人出口情况', id: '23020108', pid: '230201', path: '/hts/sjbb/wm/tjbb/ckqk/fjwshrckqk', component: './hts/sjbb/wm/tjbb/ckqk/fyhz' },
              { name: '出口退税率分布', id: '23020109', pid: '230201', path: '/hts/sjbb/wm/tjbb/ckqk/cktslfb', component: './hts/sjbb/wm/tjbb/ckqk/cktslfb' },
            ]
          },
          {
            name: '发票退税情况', id: '230202', pid: '2302', path: '/hts/sjbb/wm/tjbb/fptsqk', routes: [
              { path: '/hts/sjbb/wm/tjbb/fptsqk', redirect: '/hts/sjbb/wm/tjbb/fptsqk/zzszyfpmx', id: '23020200', pid: '230202' },
              { name: '增值税专用发票明细', id: '23020201', pid: '230202', path: '/hts/sjbb/wm/tjbb/fptsqk/zzszyfpmx', component: './hts/sjbb/wm/tjbb/fptsqk/zzszyfpmx', },
              { name: '未申报增值税专用发票明细', id: '23020202', pid: '230202', path: '/hts/sjbb/wm/tjbb/fptsqk/wsbzzsfpmx', component: './hts/sjbb/wm/tjbb/fptsqk/wsbzzsfpmx', },
              { name: '发票退税情况分月汇总', id: '23020203', pid: '230202', path: '/hts/sjbb/wm/tjbb/fptsqk/fptsqkfyhz', component: './hts/sjbb/wm/tjbb/fptsqk/fptsqkfyhz', },
              { name: '供应商发票退税情况', id: '23020204', pid: '230202', path: '/hts/sjbb/wm/tjbb/fptsqk/gysfptsqk', component: './hts/sjbb/wm/tjbb/fptsqk/gysfptsqk', },
            ]
          },
          {
            name: '报关单退税情况', id: '230203', pid: '2302', path: '/hts/sjbb/wm/tjbb/bgdtsqk', routes: [
              { path: '/hts/sjbb/wm/tjbb/bgdtsqk', redirect: '/hts/sjbb/wm/tjbb/bgdtsqk/ckbgdmx', id: '23020300', pid: '230203' },
              { name: '出口报关单明细', id: '23020301', pid: '230203', path: '/hts/sjbb/wm/tjbb/bgdtsqk/ckbgdmx', key: 'hts_sjbb_wm_tjbb_bgdtsqk_ckbgdmx', component: './hts/sjbb/wm/tjbb/bgdtsqk/ckbgdmx', },
              { name: '未申报出口报关单明细', id: '23020302', pid: '230203', path: '/hts/sjbb/wm/tjbb/bgdtsqk/wsbbgdmx', key: 'hts_sjbb_wm_tjbb_bgdtsqk_wsbbgdmx', component: './hts/sjbb/wm/tjbb/bgdtsqk/wsbbgdmx', },
              { name: '报关单退税情况分月汇总', id: '23020303', pid: '230203', path: '/hts/sjbb/wm/tjbb/bgdtsqk/ckbgdfyhz', key: 'hts_sjbb_wm_tjbb_bgdtsqk_ckbgdfyhz', component: './hts/sjbb/wm/tjbb/bgdtsqk/ckbgdfyhz', },
              { name: '出口合同退税情况汇总', id: '23020304', pid: '230203', path: '/hts/sjbb/wm/tjbb/bgdtsqk/ckhttsqkhz', key: 'hts_sjbb_wm_tjbb_bgdtsqk_ckhttsqkhz', component: './hts/sjbb/wm/tjbb/bgdtsqk/ckhttsqkhz', },
              { name: '出口报出口报关单退税情况', id: '23020305', pid: '230203', path: '/hts/sjbb/wm/tjbb/bgdtsqk/ckbgdtsqk', component: './hts/sjbb/wm/tjbb/bgdtsqk/ckbgdtsqk', },
            ]
          },
          {
            name: '退税情况', id: '230204', pid: '2302', path: '/hts/sjbb/wm/tjbb/tsqk', routes: [
              { path: '/hts/sjbb/wm/tjbb/tsqk', redirect: '/hts/sjbb/wm/tjbb/tsqk/tssbqk', id: '23020400', pid: '230204' },
              { name: '退税申报情况', id: '23020401', pid: '230204', path: '/hts/sjbb/wm/tjbb/tsqk/tssbqk', component: './hts/sjbb/wm/tjbb/tsqk/tssbqk', },
              { name: '分商品退税情况', id: '23020402', pid: '230204', path: '/hts/sjbb/wm/tjbb/tsqk/afsptsqk', component: './hts/sjbb/wm/tjbb/tsqk/afsptsqk', },
              { name: '供应商退税情况', id: '23020403', pid: '230204', path: '/hts/sjbb/wm/tjbb/tsqk/bgystsqk', component: './hts/sjbb/wm/tjbb/tsqk/bgystsqk', },
              { name: '暂不办理供应商情况', id: '23020410', pid: '230204', path: '/hts/sjbb/wm/tjbb/tsqk/zbblgyscx', component: './hts/sjbb/wm/tjbb/tsqk/zbblgyscx' },
              { name: '不予退税明细查询', id: '23020404', pid: '230204', path: '/hts/sjbb/wm/tjbb/tsqk/cbytsmxcx', component: './hts/sjbb/wm/tjbb/tsqk/cbytsmxcx', },
              { name: '不予退税明细查询', id: '23020405', pid: '230204', path: '/hts/sjbb/wm/tjbb/tsqk/cbytsmxcxjh', component: './hts/sjbb/wm/tjbb/tsqk/cbytsmxcx', hideInMenu: true },
              { name: '暂不办理明细查询', id: '23020406', pid: '230204', path: '/hts/sjbb/wm/tjbb/tsqk/dzbblmxcx', component: './hts/sjbb/wm/tjbb/tsqk/dzbblmxcx', },
              { name: '暂不办理明细查询', id: '23020407', pid: '230204', path: '/hts/sjbb/wm/tjbb/tsqk/dzbblmxcxjh', component: './hts/sjbb/wm/tjbb/tsqk/dzbblmxcx', hideInMenu: true },
              { name: '未反馈明细查询', id: '23020411', pid: '230204', path: '/hts/sjbb/wm/tjbb/tsqk/wfkmxcx', component: './hts/sjbb/wm/tjbb/tsqk/wfkmxcx', },
              { name: '未反馈明细查询', id: '23020412', pid: '230204', path: '/hts/sjbb/wm/tjbb/tsqk/wfkmxcxjh', component: './hts/sjbb/wm/tjbb/tsqk/wfkmxcx', hideInMenu: true },
              { name: '不予办理明细查询', id: '23020408', pid: '230204', path: '/hts/sjbb/wm/tjbb/tsqk/ebyblmxcx', component: './hts/sjbb/wm/tjbb/tsqk/ebyblmxcx', },
              { name: '不予办理明细查询', id: '23020409', pid: '230204', path: '/hts/sjbb/wm/tjbb/tsqk/ebyblmxcxjh', component: './hts/sjbb/wm/tjbb/tsqk/ebyblmxcx', hideInMenu: true },
            ]
          },
        ]
      },
    ]
  },
  {
    name: '数据报表（生产）', id: '24', icon: 'AuditOutlined', path: '/hts/sjbb/sc', routes: [
      { path: '/hts/sjbb/sc', redirect: '/hts/sjbb/sc/sjgx' },
      { name: '数据更新', id: '2401', pid: '24', icon: 'ProfileOutlined', path: '/hts/sjbb/sc/sjgx', component: './hts/sjbb/sc/sjgx' },
      {
        name: '统计报表', id: '2402', pid: '24', icon: 'OneToOneOutlined', path: '/hts/sjbb/sc/tjbb', routes: [
          { path: '/hts/sjbb/sc/tjbb', redirect: '/hts/sjbb/sc/tjbb/ckqk/fyhz', id: '240200', pid: '2402' },
          {
            name: '出口情况', id: '240201', pid: '2402', path: '/hts/sjbb/sc/tjbb/ckqk', routes: [
              { path: '/hts/sjbb/sc/tjbb/ckqk', redirect: '/hts/sjbb/sc/tjbb/ckqk/fyhz', id: '24020100', pid: '240201' },
              { name: '分月汇总', id: '24020101', pid: '240201', path: '/hts/sjbb/sc/tjbb/ckqk/fyhz', component: './hts/sjbb/sc/tjbb/ckqk/fyhz' },
              { name: '分商品出口情况', id: '24020102', pid: '240201', path: '/hts/sjbb/sc/tjbb/ckqk/fspckqk', component: './hts/sjbb/sc/tjbb/ckqk/fspckqk' },
              { name: '分国别出口情况', id: '24020103', pid: '240201', path: '/hts/sjbb/sc/tjbb/ckqk/fgbckqk', component: './hts/sjbb/sc/tjbb/ckqk/fyhz' },
              { name: '分口岸出口情况', id: '24020104', pid: '240201', path: '/hts/sjbb/sc/tjbb/ckqk/fkackqk', component: './hts/sjbb/sc/tjbb/ckqk/fyhz' },
              { name: '分监管方式出口情况', id: '24020105', pid: '240201', path: '/hts/sjbb/sc/tjbb/ckqk/fjgfsckqk', component: './hts/sjbb/sc/tjbb/ckqk/fyhz' },
              { name: '分运输方式出口情况', id: '24020106', pid: '240201', path: '/hts/sjbb/sc/tjbb/ckqk/fysfsckqk', component: './hts/sjbb/sc/tjbb/ckqk/fyhz' },
              { name: '合同出口情况', id: '24020107', pid: '240201', path: '/hts/sjbb/sc/tjbb/ckqk/htckqk', component: './hts/sjbb/sc/tjbb/ckqk/fyhz' },
              { name: '分境外收货人出口情况', id: '24020108', pid: '240201', path: '/hts/sjbb/sc/tjbb/ckqk/fjwshrckqk', component: './hts/sjbb/sc/tjbb/ckqk/fyhz' },
              { name: '出口退税率分布', id: '24020109', pid: '240201', path: '/hts/sjbb/sc/tjbb/ckqk/cktslfb', component: './hts/sjbb/sc/tjbb/ckqk/cktslfb' },
            ]
          },
          {
            name: '报关单退税情况', id: '240202', pid: '2402', path: '/hts/sjbb/sc/tjbb/bgdtsqk', routes: [
              { path: '/hts/sjbb/sc/tjbb/bgdtsqk', redirect: '/hts/sjbb/sc/tjbb/bgdtsqk/ckbgdmx', id: '24020200', pid: '240202' },
              { name: '出口报关单明细', id: '24020201', pid: '240202', path: '/hts/sjbb/sc/tjbb/bgdtsqk/ckbgdmx', component: './hts/sjbb/sc/tjbb/bgdtsqk/ckbgdmx', },
              { name: '未申报出口报关单明细', id: '24020202', pid: '240202', path: '/hts/sjbb/sc/tjbb/bgdtsqk/wsbbgdmx', component: './hts/sjbb/sc/tjbb/bgdtsqk/wsbbgdmx', },
              { name: '报关单退税情况分月汇总', id: '24020203', pid: '240202', path: '/hts/sjbb/sc/tjbb/bgdtsqk/ckbgdfyhz', component: './hts/sjbb/sc/tjbb/bgdtsqk/ckbgdfyhz', },
              { name: '出口合同退税情况汇总', id: '24020204', pid: '240202', path: '/hts/sjbb/sc/tjbb/bgdtsqk/ckhttsqkhz', component: './hts/sjbb/sc/tjbb/bgdtsqk/ckhttsqkhz', },
            ]
          },
          {
            name: '退税情况', id: '240203', pid: '2402', path: '/hts/sjbb/sc/tjbb/tsqk', routes: [
              { path: '/hts/sjbb/sc/tjbb/tsqk', redirect: '/hts/sjbb/sc/tjbb/tsqk/tssbqk', id: '24020300', pid: '240203' },
              { name: '退税申报情况', id: '24020301', pid: '240203', path: '/hts/sjbb/sc/tjbb/tsqk/tssbqk', component: './hts/sjbb/sc/tjbb/tsqk/tssbqk', },
              { name: '分商品退税情况', id: '24020302', pid: '240203', path: '/hts/sjbb/sc/tjbb/tsqk/fsptsqk', component: './hts/sjbb/sc/tjbb/tsqk/fsptsqk', },
              { name: '不予退税明细查询', id: '24020303', pid: '240203', path: '/hts/sjbb/sc/tjbb/tsqk/bytsmxcx', component: './hts/sjbb/sc/tjbb/tsqk/bytsmxcx', },
              { name: '不予退税明细查询', id: '24020304', pid: '240203', path: '/hts/sjbb/sc/tjbb/tsqk/bytsmxcxsb', component: './hts/sjbb/sc/tjbb/tsqk/bytsmxcx', hideInMenu: true },
              { name: '不予退税明细查询', id: '24020305', pid: '240203', path: '/hts/sjbb/sc/tjbb/tsqk/bytsmxckj', component: './hts/sjbb/sc/tjbb/tsqk/bytsmxcx', hideInMenu: true },
              { name: '暂不办理明细查询', id: '24020306', pid: '240203', path: '/hts/sjbb/sc/tjbb/tsqk/zbblmxcx', component: './hts/sjbb/sc/tjbb/tsqk/zbblmxcx', },
              { name: '暂不办理明细查询', id: '24020307', pid: '240203', path: '/hts/sjbb/sc/tjbb/tsqk/zbblmxcxsb', component: './hts/sjbb/sc/tjbb/tsqk/zbblmxcx', hideInMenu: true },
              { name: '暂不办理明细查询', id: '24020308', pid: '240203', path: '/hts/sjbb/sc/tjbb/tsqk/zbblmxcxkj', component: './hts/sjbb/sc/tjbb/tsqk/zbblmxcx', hideInMenu: true },
              { name: '未反馈明细查询', id: '24020312', pid: '240203', path: '/hts/sjbb/sc/tjbb/tsqk/wfkmxcx', component: './hts/sjbb/sc/tjbb/tsqk/wfkmxcx', },
              { name: '未反馈明细查询', id: '24020313', pid: '240203', path: '/hts/sjbb/sc/tjbb/tsqk/wfkmxcxsb', component: './hts/sjbb/sc/tjbb/tsqk/wfkmxcx', hideInMenu: true },
              { name: '未反馈明细查询', id: '24020314', pid: '240203', path: '/hts/sjbb/sc/tjbb/tsqk/wfkmxcxkj', component: './hts/sjbb/sc/tjbb/tsqk/wfkmxcx', hideInMenu: true },
              { name: '不予办理明细查询', id: '24020309', pid: '240203', path: '/hts/sjbb/sc/tjbb/tsqk/byblmxcx', component: './hts/sjbb/sc/tjbb/tsqk/byblmxcx', },
              { name: '不予办理明细查询', id: '24020310', pid: '240203', path: '/hts/sjbb/sc/tjbb/tsqk/byblmxcxsb', component: './hts/sjbb/sc/tjbb/tsqk/byblmxcx', hideInMenu: true },
              { name: '不予办理明细查询', id: '24020311', pid: '240203', path: '/hts/sjbb/sc/tjbb/tsqk/byblmxcxkj', component: './hts/sjbb/sc/tjbb/tsqk/byblmxcx', hideInMenu: true },
            ]
          },
        ],
      },
    ]
  },
  { name: '风险管理', id: 'YS_FXGL', pid: 'A01', path: '/hts/fxfx', component: './hts/routeHome2', },
  // 备案单证
  {
    name: '备案单证2.0', id: '102', icon: 'VerifiedOutlined', path: '/hts/badz2', routes: [
      { path: '/hts/badz2', redirect: '/hts/badz2/home', id: '10200', pid: '102' },
      { name: '工作台', id: '10201', pid: '102', icon: 'BarChartOutlined', path: '/hts/badz2/home', component: './hts/badz2/home' },
      {
        name: '备案单证基础数据登记', id: '10202', pid: '102', icon: 'FundOutlined', path: '/hts/badz2/jcsjdj', routes: [
          { path: '/hts/badz2/jcsjdj', redirect: '/hts/badz2/jcsjdj/gxht', id: '1020200', pid: '10202' },
          { name: '购销合同', id: '1020201', pid: '10202', path: '/hts/badz2/jcsjdj/gxht', component: './hts/badz2/jcsjdj/gxht' },
          { name: '运输单据', id: '1020202', pid: '10202', path: '/hts/badz2/jcsjdj/ysdj', component: './hts/badz2/jcsjdj/ysdj' },
          { name: '委托报关单据', id: '1020203', pid: '10202', path: '/hts/badz2/jcsjdj/wtbgdj', component: './hts/badz2/jcsjdj/wtbgdj' },
          { name: '其他单证', id: '1020204', pid: '10202', path: '/hts/badz2/jcsjdj/qtdz', component: './hts/badz2/jcsjdj/qtdz' },
        ]
      },
      { name: '申报业务数据匹配', id: '10203', pid: '102', icon: 'BarChartOutlined', path: '/hts/badz2/sjpp', component: './hts/badz2/sjpp' },
      { name: '备案单证装订成册', id: '10204', pid: '102', icon: 'BarChartOutlined', path: '/hts/badz2/zdcc', component: './hts/badz2/zdcc' },
      { name: '资料管理', id: '10205', pid: '102', icon: 'BarChartOutlined', path: '/hts/badz2/zlgl', component: './hts/badz2/zlgl' },
    ]
  },
  // 收汇管理
  { name: '收汇管理', id: '43', icon: 'CoffeeOutlined', path: '/hts/shgl', routes: [
    { path: '/hts/shgl', redirect: '/hts/shgl/shsdsj' },
    { name: '收汇水单数据', id: '4301', pid: '43', icon: 'BarChartOutlined', path: '/hts/shgl/shsdsj', component: './hts/shgl/shsdsj' },
    { name: '报关单收汇情况查询', id: '4302', pid: '43', icon: 'AreaChartOutlined', component: './hts/shgl/bgdshqkcx', path: '/hts/shgl/bgdshqkcx' },
    { name: '合同收汇情况查询', id: '4303', pid: '43', icon: 'AreaChartOutlined', component: './hts/shgl/htshqkcx', path: '/hts/shgl/htshqkcx' },
    { name: '任务管理', id: '4304', pid: '43', icon: 'AreaChartOutlined', component: './hts/shgl/rwgl', path: '/hts/shgl/rwgl' },

  ]
  },
  {
    name: '合规管理', id: '42', icon: 'VerifiedOutlined', path: '/hts/hggl', routes: [
      { path: '/hts/hggl', redirect: '/hts/hggl/hgjc', id: '4200', pid: '42' },
      { name: '合规检测', id: '4201', pid: '42', icon: 'UserOutlined', path: '/hts/hggl/hgjc', component: './hts/hggl/hgjc' },
      { name: '历史检测记录', id: '4202', pid: '42', icon: 'UserOutlined', path: '/hts/hggl/lsjcjl', component: './hts/hggl/lsjcjl' },
      { name: '指标配置', id: '4203', pid: '42', icon: 'UserOutlined', path: '/hts/hggl/zbpz', component: './hts/hggl/zbpz' },
    ]
  },

];




let routes: any = [
  ...routesCommon,
  ...routesCktsSjgl,
  ...routesHts,
  ...routesCkts,
  ...routesCktsOld,
  ...routesXtjcJSXJ,
  ...routesExample,
  // 系统级
  {
    path: '/user', layout: false, routes: [
      { path: '/user', routes: [{ name: 'login', path: '/user/login', component: './user/Login' },] },
      { path: '/errort', routes: [{ name: 'error', path: '/error', component: './error' },] },
      { component: './404' },
    ]
  },
  { path: '/hts/routeHome', component: './hts/routeHome', menuRender: false, layout: false },
  // { path: '/hts/routeHome2', component: './hts/routeHome2', menuRender: false, layout: false },
  // { path: '/hts/routeHome/workbench', component: './hts/routeHome/workbench', menuRender: false },
  { path: '/', redirect: '/hts/routeHome', menuRender: false },
  // { path: '/', redirect: '/hts/workplace', },
  { component: './error', },
  { component: './404', },
];

// routes = routesCkts.concat(routes);

export default routes;
