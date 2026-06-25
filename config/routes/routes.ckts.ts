export default [
  { name: '慧退税', path: '/hts', icon: 'HomeOutlined', routes: [
    { name: '免抵退税', path: '/hts/saasMdt', icon: 'HomeOutlined', routes: [
      { name: '首页', path: '/hts/saasMdt/home', component: './hts/saasMdt/homePage' },
      { name: '退税计划', path: '/hts/saasMdt/tuiShuiJiHua', routes: [
        { name: '退税计划登记', path: '/hts/saasMdt/tuiShuiJiHua/1', component: './hts/saasMdt/tuiShuiJiHua' },
        { name: '退税计划登记日志', path: '/hts/saasMdt/tuiShuiJiHua/2', component: './hts/saasMdt/tuiShuiJiHua/rz' },
      ] },
      { name: '外部数据管理', path: 'hts/saasMdt/25/2502', routes: [
        { name: '出口报关单管理', path: 'hts/saasMdt/25/2502/250201', routes: [
          { name: '待处理数据', path: 'hts/saasMdt/25/2502/250201/25020101', component: './hts/saasMdt/wbsjgl/ckbgdgl/dclsj' },
          { name: '无信息数据', path: 'hts/saasMdt/25/2502/250201/25020102', component: './hts/saasMdt/wbsjgl/ckbgdgl/wxxsj' },
          { name: '可使用数据', path: 'hts/saasMdt/25/2502/250201/25020103', component: './hts/saasMdt/wbsjgl/ckbgdgl/ksysj' },
          { name: '已使用数据', path: 'hts/saasMdt/25/2502/250201/25020104', component: './hts/saasMdt/wbsjgl/ckbgdgl/ysysj' },
          { name: '不退税数据', path: 'hts/saasMdt/25/2502/250201/25020105', component: './hts/saasMdt/wbsjgl/ckbgdgl/btssj' },
        ] },
        { name: '代理出口货物证明管理', path: 'hts/saasMdt/25/2502/250202', routes: [
          { name: '待处理数据', path: 'hts/saasMdt/25/2502/250202/25020201', component: './hts/saasMdt/wbsjgl/dlckhwzmgl/dclsj' },
          { name: '可使用数据', path: 'hts/saasMdt/25/2502/250202/25020202', component: './hts/saasMdt/wbsjgl/dlckhwzmgl/ksysj' },
          { name: '已使用数据', path: 'hts/saasMdt/25/2502/250202/25020203', component: './hts/saasMdt/wbsjgl/dlckhwzmgl/ysysj' },
          { name: '不可退税数据', path: 'hts/saasMdt/25/2502/250202/25020204', component: './hts/saasMdt/wbsjgl/dlckhwzmgl/bktssj' },
        ] },
      ] },
      { name: '明细采集', path: '/hts/saasMdt/mxcj', routes: [
        { name: '生产企业出口货物及修理修配服务免抵退税申报明细表', path: '/hts/saasMdt/mxcj/1', routes: [
          { name: '外贸企业出口退税进货明细申报', path: '/hts/saasMdt/mxcj/1/MDT___ZXSB_SB_MDT_TSJH_GCB/index', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSJH_GCB/index' },
          { name: '视同自产清单', path: '/hts/saasMdt/mxcj/1/MDT___ZXSB_SB_MDT_STZC_GCB/index', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_STZC_GCB/index' },
          { name: '出口货物离岸价差异原因说明', path: '/hts/saasMdt/mxcj/1/MDT___ZXSB_SB_MDT_CYSM_GCB/index', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_CYSM_GCB/index' },
          { name: '出口业务收汇', path: '/hts/saasMdt/mxcj/1/MDT_TSZL___ZXSB_SB_CKSH_GCB/index', component: './hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_CKSH_GCB/index' },
          { name: '商品码调整', path: '/hts/saasMdt/mxcj/1/MDT_TSZL___ZXSB_SB_HGSPTZ_GCB/index', component: './hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_HGSPTZ_GCB/index' },
          { name: '生产企业出口货物劳务免抵退税申报明细', path: '/hts/saasMdt/mxcj/1/MDT___ZXSB_SB_MDT_TSSB_GCB/index', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB/index' },
        ] },
        { name: '国际运输（港澳台运输）、航天运输免抵退税申报明细表', path: '/hts/saasMdt/mxcj/2', routes: [
          { name: '铁路国际货物运输明细表', path: '/hts/saasMdt/mxcj/2/MDT___ZXSB_SB_MDT_TLHY_GCB/index', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TLHY_GCB/index' },
          { name: '国际客运（含香港直通车）旅客、行李包裹运输清算函件明细表', path: '/hts/saasMdt/mxcj/2/MDT___ZXSB_SB_MDT_KYHJ_GCB/index', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_KYHJ_GCB/index' },
          { name: '航空运输收入清算账单', path: '/hts/saasMdt/mxcj/2/MDT___ZXSB_SB_MDT_HKYS_QS_GCB/index', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_HKYS_QS_GCB/index' },
          { name: '国际运输（港澳台运输）、航天运输免抵退税申报明细表', path: '/hts/saasMdt/mxcj/2/MDT___ZXSB_SB_MDT_GJYS_GCB/index', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_GJYS_GCB/index' },
        ] },
        { name: '跨境销售服务及无形资产免抵退税申报明细表', path: '/hts/saasMdt/mxcj/3', routes: [
          { name: '跨境销售服务及无形资产收讫营业款明细清单', path: '/hts/saasMdt/mxcj/3/MDT___ZXSB_SB_MDT_SYYK_GCB/index', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_SYYK_GCB/index' },
          { name: '跨境销售服务及无形资产免抵退税申报明细', path: '/hts/saasMdt/mxcj/3/MDT___ZXSB_SB_MDT_YFSJ_GCB/index', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_YFSJ_GCB/index' },
        ] },
      ] },
      { name: '确认汇总表', path: '/hts/saasMdt/sjsb/sjhz/1', component: './hts/dditax.ckts.from/mdts/sjsb/sjhz' },
      { name: '退税申报', path: '/hts/saasMdt/ckts/scsbsj/MDT', component: './hts/ckts/scsbsj/scsbsj' },
      { name: '申报结果查询', path: '/hts/saasMdt/ckts/sbsjcx/MDT', component: './hts/ckts/sbsjcx/sbsjcx' },
    ] },
    { name: '收汇管理', path: '/hts/shgl', icon: 'CoffeeOutlined', routes: [
      { name: '收汇水单数据', path: '/hts/shgl/shsdsj', component: './hts/shgl/shsdsj' },
      { name: '报关单收汇情况查询',  component: './hts/shgl/bgdshqkcx', path: '/hts/shgl/bgdshqkcx' },
      { name: '合同收汇情况查询',  component: './hts/shgl/htshqkcx', path: '/hts/shgl/htshqkcx' },
      // { name: '任务管理',  component: './hts/shgl/rwgl', path: '/hts/shgl/rwgl' },
    ] },
    { name: '数据报表（生产）', id: '24', icon: 'AuditOutlined', path: '/hts/sjbb/sc', routes: [
      { name: '数据更新', id: '2401', pid: '24', icon: 'ProfileOutlined', path: '/hts/sjbb/sc/sjgx', component: './hts/sjbb/sc/sjgx' },
      { name: '统计报表', id: '2402', pid: '24', icon: 'OneToOneOutlined', path: '/hts/sjbb/sc/tjbb', routes: [
        {
          name: '出口情况', id: '240201', pid: '2402', path: '/hts/sjbb/sc/tjbb/ckqk', routes: [
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
            { name: '出口报关单明细', id: '24020201', pid: '240202', path: '/hts/sjbb/sc/tjbb/bgdtsqk/ckbgdmx', component: './hts/sjbb/sc/tjbb/bgdtsqk/ckbgdmx', },
            { name: '未申报出口报关单明细', id: '24020202', pid: '240202', path: '/hts/sjbb/sc/tjbb/bgdtsqk/wsbbgdmx', component: './hts/sjbb/sc/tjbb/bgdtsqk/wsbbgdmx', },
            { name: '报关单退税情况分月汇总', id: '24020203', pid: '240202', path: '/hts/sjbb/sc/tjbb/bgdtsqk/ckbgdfyhz', component: './hts/sjbb/sc/tjbb/bgdtsqk/ckbgdfyhz', },
            { name: '出口合同退税情况汇总', id: '24020204', pid: '240202', path: '/hts/sjbb/sc/tjbb/bgdtsqk/ckhttsqkhz', component: './hts/sjbb/sc/tjbb/bgdtsqk/ckhttsqkhz', },
          ]
        },
        {
          name: '退税情况', id: '240203', pid: '2402', path: '/hts/sjbb/sc/tjbb/tsqk', routes: [
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
      ] },
    ] },
  ] }
];