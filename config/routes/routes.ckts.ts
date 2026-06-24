export default [
  // { name: '慧退税', icon: 'CodeOutlined', path: '/hts', routes: [
  { name: '慧退税-免抵退税', path: '/hts/saasMdt', icon: 'HomeOutlined', routes: [
    { name: '首页', path: '/hts/saasMdt/home', component: './hts/saasMdt/homePage' },
    { name: '退税计划', path: '/hts/saasMdt/tuiShuiJiHua', routes: [
      { name: '退税计划登记', path: '/hts/saasMdt/tuiShuiJiHua/1', component: './hts/saasMdt/tuiShuiJiHua' },
      { name: '退税计划登记日志', path: '/hts/saasMdt/tuiShuiJiHua/2', component: './hts/saasMdt/tuiShuiJiHua/rz' },
    ]},
    {
      name: '外部数据管理', path: 'hts/saasMdt/25/2502', routes: [
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
      ]
    },
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
    ]},
    { name: '确认汇总表', path: '/hts/saasMdt/sjsb/sjhz/1', component: './hts/dditax.ckts.from/mdts/sjsb/sjhz' },
    { name: '退税申报', path: '/hts/saasMdt/ckts/scsbsj/MDT', component: './hts/ckts/scsbsj/scsbsj' },
    { name: '申报结果查询', path: '/hts/saasMdt/ckts/sbsjcx/MDT', component: './hts/ckts/sbsjcx/sbsjcx' },
  ] },
  // ]},
];