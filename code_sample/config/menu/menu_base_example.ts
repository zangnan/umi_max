const menu: any = [
  { path: '/M3', id: 'M3', pid: 'M', name: '退税申报', busiType: 'SC/WM/QT', pageType: 'TOP', isMenu: 1, routes: [
    // { path: '/M3', redirect: '/M3/M31/M311/M3111', },
    { path: '/M3/M31', id: 'M31', pid: 'M3', name: '货物劳务及服务退税申报', component: './hts/template/template_step2', temp: '出口退（免）税申报#iconBZ_SJFPLFK', busiType: 'SC/WM/QT', pageType: 'STEP', isMenu: 1, routes: [
      { path: '/M3/M31', redirect: '/M3/M31/M311/M3111', },
      { path: '/M3/M31/M311', id: 'M311', pid: 'M31', name: '数据采集', component: './hts/template/template_tab2', hideInMenu: 'true', busiType: 'SC/WM/QT', pageType: 'TAB', isMenu: 0, routes: [
        { path: '/M3/M31/M311/M3111', id: 'M3111', pid: 'M311', name: '采集首页', component: './hts/template/template_icon_nav2', busiType: 'SC/WM/QT', pageType: 'URL', isMenu: 0, navtype: 'MDT_CJSY' },
        { path: '/M3/M31/M311/M3112', id: 'M3112', pid: 'M311', name: '出口明细', component: './hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_TSSB_GCB', nav: 'MDT_CJSY#基础数据管理#iconBZ_HQPTTSSB', busiType: 'SC/WM/QT', pageType: 'URL', isMenu: 0 },
        { path: '/M3/M31/M311/M3113', id: 'M3113', pid: 'M311', name: '进货明细', component: './hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_TSJH_GCB', nav: 'MDT_CJSY#基础数据管理#iconBZ_HQPTTSSB', busiType: 'SC/WM/QT', pageType: 'URL', isMenu: 0 },
      ]},
      { path: '/M3/M31/M313', id: 'M313', pid: 'M31', name: '退税申报', component: './hts/template/template_tab2', hideInMenu: 'true', busiType: 'SC/WM/QT', pageType: 'TAB', isMenu: 0, routes: [
        { path: '/M3/M31/M313/M3131', id: 'M3131', pid: 'M313', name: '货物劳务', component: './hts/ckts/scsbsj/scsbsj', busiType: 'SC/WM/QT', pageType: 'URL', isMenu: 0 },
      ]},
      { path: '/M3/M31/M314', id: 'M314', pid: 'M31', name: '申报结果', component: './hts/template/template_tab2', hideInMenu: 'true', busiType: 'SC/WM/QT', pageType: 'TAB', isMenu: 0, routes: [
        { path: '/M3/M31/M314/M3141', id: 'M3141', pid: 'M314', name: '货物劳务', component: './hts/ckts/sbsjcx/sbsjcx', busiType: 'SC/WM/QT', pageType: 'URL', isMenu: 0 }
      ]},
    ]},
  ]},
];
export default menu;
