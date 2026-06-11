export default [
  { name: '慧退税', icon: 'CodeOutlined', path: '/hts', routes: [
    { name: 'form-api-save-delete-rename 测试 - 验证 form_api_save/delete 重命名 + ${API_URL_BASE} 剥前缀', path: '/scripts/__fixtures__/form-api-save-delete-rename.actual', component: './scripts/__fixtures__/form-api-save-delete-rename.actualIndex' },
    { name: '跨境销售服务及无形资产收讫营业款明细清单', path: '/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_SYYK_GCB/auto_config', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_SYYK_GCB/auto_configIndex' },
    { name: '跨境销售服务及无形资产免抵退税申报明细', path: '/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_YFSJ_GCB/auto_config', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_YFSJ_GCB/auto_configIndex' },
    { name: '出口业务收汇', path: '/hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_CKSH_GCB/auto_config', component: './hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_CKSH_GCB/auto_configIndex' },
    { name: '退税计划-月度', path: '/hts/saasMdt/tuiShuiJiHua/monthData', component: './hts/saasMdt/tuiShuiJiHua/monthDataIndex' },
    { name: '退税计划-年度', path: '/hts/saasMdt/tuiShuiJiHua/yearData', component: './hts/saasMdt/tuiShuiJiHua/yearDataIndex' },
    { name: '退税计划-季度', path: '/hts/saasMdt/tuiShuiJiHua/seasonData', component: './hts/saasMdt/tuiShuiJiHua/seasonDataIndex' },
    { name: '商品码调整', path: '/hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_HGSPTZ_GCB/auto_config', component: './hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_HGSPTZ_GCB/auto_configIndex' },
    { name: '生产企业出口货物劳务免抵退税申报明细', path: '/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB/auto_config', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB/auto_configIndex' },
  ]},
];