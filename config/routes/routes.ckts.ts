export default [
  { name: '慧退税', path: '/hts', icon: 'HomeOutlined', routes: [
    // 数据管理
    { name: '数据管理', path: '/hts/02', icon: 'BookOutlined', routes: [
      // { path: '/hts/02/0201', name: '任务管理', icon: 'FileProtectOutlined', component: './hts/sjgl/xzrwgl/jdcx' },
      { path: '/hts/02/0202', name: '数据下载', icon: 'InteractionOutlined', routes: [
        { path: '/hts/02/0202/020201', name: '海关数据下载', component: './hts/sjgl/xzrwgl/sjxz' },
        { path: '/hts/02/0202/020202', name: '受托方已开具代理证明下载', component: './hts/sjgl/xzrwgl/stfykjdlzm' },
        { path: '/hts/02/0202/020203', name: '发票数据下载', component: './hts/sjgl/xzrwgl/stfykjdlzm' },
        { path: '/hts/02/0202/020204', name: '税务反馈下载', component: './hts/sjgl/xzrwgl/swsjxz' },
      ] },
      { path: '/hts/02/0203', name: '海关数据查询', icon: 'ProjectOutlined', routes: [
        { path: '/hts/02/0203/020301', name: '出口货物报关单', component: './hts/commonModule/ckhwbgd' },
        { path: '/hts/02/0203/020302', name: '进口货物报关单', component: './hts/commonModule/jkhwbgd' },
        { path: '/hts/02/0203/020303', name: '增值税专用缴款书', component: './hts/sjgl/hgsjcx' },
      ] },
      { path: '/hts/02/DLCKZMCX_0204', id: '0204', pid: '02', name: '受托方已开具代理出口证明查询', icon: 'RobotOutlined', component: './hts/commonModule/dlhwzmgl' },
      { path: '/hts/02/0205', id: '0205', pid: '02', name: '加贸数据查询', icon: 'OneToOneOutlined', routes: [
        {
          path: '/hts/02/0205/020501', id: '020501', pid: '0205', name: '加贸海关数据查询', routes: [
            { path: '/hts/02/0205/020501/02050101', id: '02050101', pid: '020501', name: '海关加工贸易手册数据', component: './hts/jljg/sjxz/hghxsjcx/scxxcx' },
            { path: '/hts/02/0205/020501/02050102', id: '02050102', pid: '020501', name: '海关加工贸易账册数据', component: './hts/jljg/sjxz/hghxsjcx/zcxxcx' },
            { path: '/hts/02/0205/020501/02050103', id: '02050103', pid: '020501', name: '海关保税核注清单数据', component: './hts/jljg/sjxz/hghxsjcx/jckhzqdcx' },
            { path: '/hts/02/0205/020501/02050104', id: '02050104', pid: '020501', name: '海关核销报关单数据', component: './hts/jljg/sjxz/hghxsjcx/jckbgdcx' },
          ]
        },
        {
          path: '/hts/02/0205/020502', id: '020502', pid: '0205', name: '加贸反馈数据查询', routes: [
            { path: '/hts/02/0205/020502/02050201', id: '02050201', pid: '020502', name: '税务已核销手册数据', component: './hts/jljg/sjxz/jmfksjcx/scxxcx' },
            { path: '/hts/02/0205/020502/02050202', id: '02050202', pid: '020502', name: '税务已核销账册数据', component: './hts/jljg/sjxz/jmfksjcx/zcxxcx' },
            { path: '/hts/02/0205/020502/02050203', id: '02050203', pid: '020502', name: '税务已核销报关单数据', component: './hts/jljg/sjxz/jmfksjcx/jckbgdcx' },
            { path: '/hts/02/0205/020502/02050204', id: '02050204', pid: '020502', name: '税务免抵退出口明细数据', component: './hts/jljg/sjxz/jmfksjcx/ckmxcx' },
          ]
        },
      ] },
      { path: '/hts/02/0206', id: '0206', pid: '02', name: '进项发票数据查询', icon: 'LayoutOutlined', routes: [
          { path: '/hts/02/0206/JXFP_020601', id: '020601', pid: '0206', name: '增值税专用发票数据', component: './hts/commonModule/zzszyfp' },
        ]
      },
      { path: '/hts/02/0207', name: '税务反馈数据查询', icon: 'FundOutlined', routes: [
          { path: '/hts/02/0207/020701', name: '免抵退税', routes: [
            { path: '/hts/02/0207/020701/CXTJ_02070101', name: '生产企业出口货物劳务免抵退税申报明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB', ywKey: 'MDT_TSSB' },
            { path: '/hts/02/0207/020701/CXTJ_02070102', name: '海关出口商品代码、名称、退税率调整对应表', component: './hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_HGSPTZ_GCB', ywKey: 'MDT_HGSPTZ' },
            { path: '/hts/02/0207/020701/CXTJ_02070103', name: '出口货物收汇情况表', component: './hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_CKSH_GCB', ywKey: 'MDT_CKSH' },
            { path: '/hts/02/0207/020701/CXTJ_02070104', name: '出口货物离岸价差异原因说明表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_CYSM_GCB', ywKey: 'MDT_CYSM' },
            { path: '/hts/02/0207/020701/CXTJ_02070105', name: '视同自产进货明细清单', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_STZC_GCB', ywKey: 'MDT_STZC' },
            { path: '/hts/02/0207/020701/CXTJ_02070114', name: '外贸企业出口退税进货明细申报表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSJH_GCB', ywKey: 'MDT_TSJH' },
            { path: '/hts/02/0207/020701/CXTJ_02070106', name: '先退税后核销企业免抵退税申报附表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_XTHH_GCB', ywKey: 'MDT_XTHHSB' },
            { path: '/hts/02/0207/020701/CXTJ_02070107', name: '国际运输（港澳台运输）免抵退税申报明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_GJYS_GCB', ywKey: 'MDT_GJYS' },
            { path: '/hts/02/0207/020701/CXTJ_02070108', name: '航空国际运输收入清算账单申报明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_HKYS_QS_GCB', ywKey: 'MDT_HKYS' },
            { path: '/hts/02/0207/020701/CXTJ_02070109', name: '国际客运（含香港直通车）旅客、行李包裹运输清算函件明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_KYHJ_GCB', ywKey: 'MDT_KYHJ' },
            { path: '/hts/02/0207/020701/CXTJ_02070110', name: '中国铁路总公司国际货物运输明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TLHY_GCB', ywKey: 'MDT_TLHY' },
            { path: '/hts/02/0207/020701/CXTJ_02070111', name: '跨境应税行为免抵退税申报明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_YFSJ_GCB', ywKey: 'MDT_YFSJ' },
            { path: '/hts/02/0207/020701/CXTJ_02070112', name: '跨境应税行为收讫营业款明细清单', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_SYYK_GCB', ywKey: 'MDT_SYYK' },
            { path: '/hts/02/0207/020701/CXTJ_02070113', name: '免抵退税申报汇总表', component: './hts/dditax.ckts.from/mdts/sjsb/sjhz/swfk', ywKey: 'MDT_MDTHZ' },
          ] },
          { path: '/hts/02/0207/020702', id: '020702', pid: '0207', name: '免退税', routes: [
            { path: '/hts/02/0207/020702/CXTJ_02070201', id: '02070201', pid: '020702', name: '外贸企业出口退税出口明细申报表', component: './hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_TSSB_GCB', ywKey: 'MTS_TSSB' },
            { path: '/hts/02/0207/020702/CXTJ_02070202', id: '02070202', pid: '020702', name: '外贸企业出口退税进货明细申报表', component: './hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_TSJH_GCB', ywKey: 'MTS_TSJH' },
            { path: '/hts/02/0207/020702/CXTJ_02070203', id: '02070203', pid: '020702', name: '海关出口商品代码、名称、退税率调整对应表', component: './hts/dditax.ckts.from/MTS_TSZL___ZXSB_SB_HGSPTZ_GCB', ywKey: 'MTS_HGSPTZ' },
            { path: '/hts/02/0207/020702/CXTJ_02070204', id: '02070204', pid: '020702', name: '出口货物收汇情况表', component: './hts/dditax.ckts.from/MTS_TSZL___ZXSB_SB_CKSH_GCB', ywKey: 'MTS_CKSH' },
            { path: '/hts/02/0207/020702/CXTJ_02070205', id: '02070205', pid: '020702', name: '外贸企业调整申报', component: './hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_TZSB_GCB', ywKey: 'MTS_TZSB' },
            { path: '/hts/02/0207/020702/CXTJ_02070206', id: '02070206', pid: '020702', name: '跨境应税行为免退税申报明细表', component: './hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_YSFWCK_GCB', ywKey: 'MTS_YSFWCK' },
          ] },
          { path: '/hts/02/0207/020703', id: '020703', pid: '0207', name: '代办退税', routes: [
            { path: '/hts/02/0207/020703/CXTJ_02070301', id: '02070301', pid: '020703', name: '外贸综合服务企业代办退税申报表', component: './hts/dditax.ckts.from/DBTS___ZXSB_SB_DB_TSSB_GCB', ywKey: 'DBTS_DBTSMX' },
            { path: '/hts/02/0207/020703/CXTJ_02070302', id: '02070302', pid: '020703', name: '海关出口商品代码、名称、退税率调整对应表', component: './hts/dditax.ckts.from/DBTS_TSZL___ZXSB_SB_HGSPTZ_GCB', ywKey: 'DBTS_HGSPTZ' },
            { path: '/hts/02/0207/020703/CXTJ_02070303', id: '02070303', pid: '020703', name: '出口货物收汇情况表', component: './hts/dditax.ckts.from/DBTS_TSZL___ZXSB_SB_CKSH_GCB', ywKey: 'DBTS_CKSH' },
            { path: '/hts/02/0207/020703/CXTJ_02070304', id: '02070304', pid: '020703', name: '代办退税应退税款明细', component: './hts/dditax.ckts.from/CXTJ___CKTS_BL_DB_DBTSYTSKMX', ywKey: 'DBTS' },
          ] },
          { path: '/hts/02/0207/020704', id: '020704', pid: '0207', name: '已使用过设备退税', routes: [
            { path: '/hts/02/0207/020704/CXTJ_02070401', id: '02070401', pid: '020704', name: '出口已使用过的设备退税申报表', component: './hts/dditax.ckts.from/ZBYW___ZXSB_SB_YS_SBMX_GCB', ywKey: 'ZBYW_YSSB_YSSB' },
            { path: '/hts/02/0207/020704/CXTJ_02070402', id: '02070402', pid: '020704', name: '海关出口商品代码、名称、退税率调整对应表', component: './hts/dditax.ckts.from/YS_TSZL___ZXSB_SB_HGSPTZ_GCB', ywKey: 'ZBYW_YSSB_HGSPTZ' },
            { path: '/hts/02/0207/020704/CXTJ_02070403', id: '02070403', pid: '020704', name: '出口货物收汇情况表', component: './hts/dditax.ckts.from/YS_TSZL___ZXSB_SB_CKSH_GCB', ywKey: 'ZBYW_YSSB_CKSH' },
          ] },
          { path: '/hts/02/0207/CXTJ_020705', id: '020705', pid: '0207', name: '购进自用货物退税', component: './hts/dditax.ckts.from/ZBYW___ZXSB_SB_GJ_SBMX_GCB', ywKey: 'ZBYW_GJSB' },
      //     { path: '/hts/02/0207/CXTJ_020706', id: '020706', pid: '0207', name: '航天发射', component: './404' },
          { path: '/hts/02/0207/020707', id: '020707', pid: '0207', name: '出口非自产退消费税', routes: [
            { path: '/hts/02/0207/020707/CXTJ_02070701', id: '02070701', pid: '020707', name: '生产企业出口非自产货物消费税退税申报表', component: './hts/dditax.ckts.from/ZBYW___ZXSB_SB_FZC_SBMX_GCB', ywKey: 'ZBYW_FZCSB_FZCSB' },
            { path: '/hts/02/0207/020707/CXTJ_02070702', id: '02070702', pid: '020707', name: '海关出口商品代码、名称、退税率调整对应表', component: './hts/dditax.ckts.from/FZC_TSZL___ZXSB_SB_HGSPTZ_GCB', ywKey: 'ZBYW_FZCSB_HGSPTZ' },
            { path: '/hts/02/0207/020707/CXTJ_02070703', id: '02070703', pid: '020707', name: '出口货物收汇情况表', component: './hts/dditax.ckts.from/FZC_TSZL___ZXSB_SB_CKSH_GCB', ywKey: 'ZBYW_FZCSB_CKSH' },
          ] },
          { path: '/hts/02/0207/020708', id: '020708', pid: '0207', name: '进料加工核销', routes: [
            { path: '/hts/02/0207/020708/CXTJ_02070801', id: '02070801', pid: '020708', name: '进料加工业务统计查询', component: './hts/jljg/sbjgcx/jljgtjcx' },
            { path: '/hts/02/0207/020708/CXTJ_02070802', id: '02070802', pid: '020708', name: '进料加工业务免抵退税核销表', component: './hts/jljg/sbjgcx/mdthx', ywKey: 'JLJG_MDTHX_MDTHX' },
            { path: '/hts/02/0207/020708/CXTJ_02070803', id: '02070803', pid: '020708', name: '进料加工业务免抵退税核销表', component: './hts/jljg/sbjgcx/mdthx', ywKey: 'JLJG_MDTHX_MDTHX', parentKeys: ['/02/0207/020708/CXTJ_02070802'], hideInMenu: true },
            { path: '/hts/02/0207/020708/CXTJ_02070804', id: '02070804', pid: '020708', name: '已核销手（账）册海关数据调整表', component: './hts/jljg/sbjgcx/yhxtz', ywKey: 'JLJG_MDTHX_HGSJTZ' },
            { path: '/hts/02/0207/020708/CXTJ_02070805', id: '02070805', pid: '020708', name: '已核销手（账）册海关数据调整表', component: './hts/jljg/sbjgcx/yhxtz', ywKey: 'JLJG_MDTHX_HGSJTZ', parentKeys: ['/02/0207/020708/CXTJ_02070804'], hideInMenu: true },
          ] },
          { path: '/hts/02/0207/020709', id: '020709', pid: '0207', name: '证明业务', routes: [
            { path: '/hts/02/0207/020709/CXTJ_02070901', id: '02070901', pid: '020709', name: '来料加工免税证明', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_LLJG_GCB', ywKey: 'ZMKJ_LLJG' },
            { path: '/hts/02/0207/020709/CXTJ_02070902', id: '02070902', pid: '020709', name: '来料加工免税核销', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_LLJGHX_GCB', ywKey: 'ZMKJ_LLJGHX' },
            { path: '/hts/02/0207/020709/CXTJ_02070903', id: '02070903', pid: '020709', name: '准予免税购进卷烟证明', component: './404' },
            { path: '/hts/02/0207/020709/CXTJ_02070904', id: '02070904', pid: '020709', name: '出口卷烟已免税证明', component: './404' },
            { path: '/hts/02/0207/020709/CXTJ_02070905', id: '02070905', pid: '020709', name: '出口卷烟免税核销', component: './404' },
            { path: '/hts/02/0207/020709/CXTJ_02070906', id: '02070906', pid: '020709', name: '免税出口卷烟计划', component: './404' },
            { path: '/hts/02/0207/020709/CXTJ_02070907', id: '02070907', pid: '020709', name: '代理出口货物证明', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_DLCK_GCB', ywKey: 'ZMKJ_DLCK' },
            { path: '/hts/02/0207/020709/CXTJ_02070908', id: '02070908', pid: '020709', name: '代理进口货物证明', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_DLJK_GCB', ywKey: 'ZMKJ_DLJK' },
            { path: '/hts/02/0207/020709/CXTJ_02070909', id: '02070909', pid: '020709', name: '委托出口货物证明', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_WTCK_GCB', ywKey: 'ZMKJ_WTCK' },
            { path: '/hts/02/0207/020709/CXTJ_02070910', id: '02070910', pid: '020709', name: '出口已补税/未退税证明（外贸）', component: './hts/dditax.ckts.from/ZMKJ_WM___ZXSB_ZM_TYYBSWTS_GCB', ywKey: 'ZMKJ_TYYBS' },
            { path: '/hts/02/0207/020709/CXTJ_02070911', id: '02070911', pid: '020709', name: '出口已补税/未退税证明（生产）', component: './hts/dditax.ckts.from/ZMKJ_SC___ZXSB_ZM_TYYBSWTS_GCB', ywKey: 'ZMKJ_TYYBS' },
            { path: '/hts/02/0207/020709/CXTJ_02070912', id: '02070912', pid: '020709', name: '出口转内销证明', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_CKHWZNX_GCB', ywKey: 'ZMKJ_CKHWZNX' },
            { path: '/hts/02/0207/020709/CXTJ_02070913', id: '02070913', pid: '020709', name: '中标证明通知书', component: './404' },
          ] },
          { path: '/hts/02/0207/020710', id: '020710', pid: '0207', name: '其他申报业务', routes: [
            { path: '/hts/02/0207/020710/CXTJ_02071001', id: '02071001', pid: '020710', name: '出口信息查询', component: './hts/dditax.ckts.from/QTYW___ZXSB_SB_CKXXCX_GCB', ywKey: 'QTYW_CKXXCX' },
            { path: '/hts/02/0207/020710/CXTJ_02071002', id: '02071002', pid: '020710', name: '进货凭证信息回退', component: './hts/dditax.ckts.from/QTYW___ZXSB_QT_KSPZWGQWBTSHT_GCB', ywKey: 'QTYW_JHPZXXHT' },
          ] },
      //     { path: '/hts/02/0207/020711', id: '020711', pid: '0207', name: '税务事项通知书', component: './404' },
      //     { path: '/hts/02/0207/020712', id: '020712', pid: '0207', name: '税务事项文书', component: './404' },
      ] },
      { path: '/hts/02/0208', id: '0208', pid: '02', name: '码表查询', icon: 'SendOutlined', routes: [
          { path: '/hts/02/0208', redirect: '/02/0208/3001' },
          { path: '/hts/02/0208/3001', id: '3001', pid: '0208', name: '税率查询', icon: 'BarChartOutlined', component: './hts/mbcx/slcx' },
          { path: '/hts/02/0208/3002', id: '3002', pid: '0208', name: '业务类型码表查询', icon: 'LayoutOutlined', component: './hts/mbcx/ywlxcx' },
          { path: '/hts/02/0208/3003', id: '3003', pid: '0208', name: '关区码表查询', icon: 'AuditOutlined', component: './hts/mbcx/gqmbcx' },
          { path: '/hts/02/0208/3004', id: '3004', pid: '0208', name: '贸易性质码表查询', icon: 'AuditOutlined', component: './hts/mbcx/myxzcx' },
          { path: '/hts/02/0208/3005', id: '3005', pid: '0208', name: '货币码表查询', icon: 'AreaChartOutlined', component: './hts/mbcx/hbmbcx' },
        ]
      },
    ] },
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
    { name: '数据报表（生产）', icon: 'AuditOutlined', path: '/hts/sjbb/sc', routes: [
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
    { name: '合规管理', icon: 'VerifiedOutlined', path: '/hts/hggl', routes: [
      { name: '合规检测', path: '/hts/hggl/hgjc', component: './hts/hggl/hgjc' },
      { name: '历史检测记录', path: '/hts/hggl/lsjcjl', component: './hts/hggl/lsjcjl' },
      { name: '指标配置', path: '/hts/hggl/zbpz', component: './hts/hggl/zbpz' },
    ] },
    { name: '出口发票开具', icon: 'SendOutlined', path: '/hts/ckfpkj', routes: [
      { name: '发票概览', path: '/hts/ckfpkj/ckfpgl', component: './hts/ckfpkj/ckfpgl' },
      { name: '报关单管理', path: '/hts/ckfpkj/bgdgl', component: './hts/ckfpkj/bgdgl' },
      { name: '按报关单开具', path: '/hts/ckfpkj/abgdkj', component: './hts/ckfpkj/abgdkj' },
      { name: '按报关单开具', path: '/hts/ckfpkj/abgdkj21', component: './hts/ckfpkj/abgdkj', parentKeys: ['/hts/ckfpkj/abgdkj'], hideInMenu: true },
      { name: '导入模板开具', path: '/hts/ckfpkj/drmbkj', component: './hts/ckfpkj/drmbkj' },
      { name: '发票申请单',  path: '/hts/ckfpkj/fpsqd', component: './hts/ckfpkj/fpsqd' },
      { name: '出口发票开具', path: '/hts/ckfpkj/ckfpkj', routes: [
        { name: '数电票开具', path: '/hts/ckfpkj/ckfpkj/sdpkj', component: './hts/ckfpkj/ckfpkj/sdpkj' },
        { name: '税控票开具', path: '/hts/ckfpkj/ckfpkj/skpkj', component: './hts/ckfpkj/ckfpkj/skpkj' },
        { name: '发票红冲', path: '/hts/ckfpkj/ckfpkj/fphc', component: './hts/ckfpkj/ckfpkj/fphc' },
        { name: '发票作废', path: '/hts/ckfpkj/ckfpkj/fpzf', component: './hts/ckfpkj/ckfpkj/fpzf' },
        { name: '开票状态跟踪', path: '/hts/ckfpkj/ckfpkj/fpztgz', component: './hts/ckfpkj/ckfpkj/fpztgz' },
        { name: '开票状态跟踪', path: '/hts/ckfpkj/ckfpkj/hzFpztgz', component: './hts/ckfpkj/ckfpkj/fpztgz', parentKeys: ['/hts/ckfpkj/ckfpkj/fpztgz'], hideInMenu: true },
        { name: '开票状态跟踪', path: '/hts/ckfpkj/ckfpkj/zfFpztgz', component: './hts/ckfpkj/ckfpkj/fpztgz', parentKeys: ['/hts/ckfpkj/ckfpkj/fpztgz'], hideInMenu: true },
      ] },
      { name: '发票管理', id: '9008', pid: '90', icon: 'FormOutlined', path: '/hts/ckfpkj/fpgl', component: './hts/ckfpkj/fpgl' },
      { name: '发票管理', id: '9009', pid: '90', icon: 'FormOutlined', path: '/hts/ckfpkj/hzfpgl', component: './hts/ckfpkj/fpgl', parentKeys: ['/hts/ckfpkj/fpgl'], hideInMenu: true },
      { name: '发票管理', id: '9010', pid: '90', icon: 'FormOutlined', path: '/hts/ckfpkj/zffpgl', component: './hts/ckfpkj/fpgl', parentKeys: ['/hts/ckfpkj/fpgl'], hideInMenu: true },
    ] },
    { name: '备案单证2.0', icon: 'VerifiedOutlined', path: '/hts/badz2', routes: [
      { name: '工作台', path: '/hts/badz2/home', component: './hts/badz2/home' },
      { name: '备案单证基础数据登记', path: '/hts/badz2/jcsjdj', routes: [
        { name: '购销合同', path: '/hts/badz2/jcsjdj/gxht', component: './hts/badz2/jcsjdj/gxht' },
        { name: '运输单据', path: '/hts/badz2/jcsjdj/ysdj', component: './hts/badz2/jcsjdj/ysdj' },
        { name: '委托报关单据', path: '/hts/badz2/jcsjdj/wtbgdj', component: './hts/badz2/jcsjdj/wtbgdj' },
        { name: '其他单证', path: '/hts/badz2/jcsjdj/qtdz', component: './hts/badz2/jcsjdj/qtdz' },
      ] },
      { name: '申报业务数据匹配', path: '/hts/badz2/sjpp', component: './hts/badz2/sjpp' },
      { name: '备案单证装订成册', path: '/hts/badz2/zdcc', component: './hts/badz2/zdcc' },
      { name: '资料管理', path: '/hts/badz2/zlgl', component: './hts/badz2/zlgl' },
    ] },
  // 配置管理
  {
    name: '配置管理', id: '22', icon: 'CoffeeOutlined', path: '/hts/pzgl', routes: [
      // { name: '电子税务局登录', path: '/hts/pzgl/dzswjpzgl', component: './hts/pzgl/dzswjpzgl' },
      { name: '退税汇率管理', path: '/hts/pzgl/tshlgl', component: './hts/pzgl/tshlgl' },
      { name: '客户信息管理', path: '/hts/pzgl/khxxgl', routes: [
        { name: '受托/委托企业信息管理', path: '/hts/pzgl/khxxgl/stwtqyxxgl', component: './hts/pzgl/khxxgl/stwtqyxxgl' },
        { name: '外商管理', path: '/hts/pzgl/khxxgl', routes: [
          { name: '外商开票信息管理', path: '/hts/pzgl/khxxgl/wsgl', component: './hts/pzgl/khxxgl/wsgl' },
          { name: '外商付汇关系管理', path: '/hts/pzgl/khxxgl/wsglwjj/wsfhgxgl', component: './hts/pzgl/khxxgl/wsglwjj/wsfhgxgl' },
        ] },
      ] },
      { name: '发票配置管理', id: '2203', pid: '22', icon: 'SecurityScanOutlined', path: '/hts/pzgl/fppzgl', component: './hts/pzgl/fppzgl' },
      // { name: '数电配置管理', id: '2208', pid: '22', icon: 'BarChartOutlined', path: '/hts/pzgl/sdppzgl', routes: [
      //   { name: '电局登录配置', id: '220801', pid: '2208', icon: 'UserOutlined', path: '/hts/pzgl/sdppzgl/djdlpz', component: './hts/pzgl/sdppzgl/djdlpz' },
      // ] },
      // { name: '进料核销配置管理', id: '2208', pid: '22', icon: 'SecurityScanOutlined', path: '/hts/pzgl/jlhxgl', component: './hts/pzgl/jlhxgl' },
      { name: '单证备案配置管理', id: '2212', pid: '22', icon: 'ProfileOutlined', path: '/hts/pzgl/badzsz', component: './hts/badz2/badzsz' },
      { name: '监管方式码表管理', id: '2205', pid: '22', icon: 'BarChartOutlined', path: '/hts/pzgl/jgfsmbgl', component: './hts/pzgl/jgfsmbgl' },
      { name: '海关IC卡管理', id: '2206', pid: '22', icon: 'BarChartOutlined', path: '/hts/pzgl/icCard', routes: [
          { name: '海关IC卡管理', id: '220601', pid: '2206', icon: 'UserOutlined', path: '/hts/pzgl/icCard/icCardgl', component: './hts/pzgl/icCard/icCardgl' },
          { name: '解除禁用IC卡', id: '220602', pid: '2206', icon: 'ProfileOutlined', path: '/hts/pzgl/icCard/icCardjy', component: './hts/pzgl/icCard/icCardjy' },
          { name: '海关IC卡操作日志', id: '220603', pid: '2206', icon: 'HomeOutlined', path: '/hts/pzgl/icCard/icCardrz', component: './hts/pzgl/icCard/icCardrz' },
        ]
      },
      // { name: '智能配单配置管理', id: '2207', pid: '22', icon: 'FormOutlined', path: '/hts/pzgl/znpdpzgl', routes: [
      //     { path: '/hts/pzgl/znpdpzgl', redirect: '/hts/pzgl/znpdpzgl/zdpppzgl', id: '2200', pid: '22' },
      //     { name: '自动匹配配置管理', id: '220701', pid: '2207', icon: 'UserOutlined', path: '/hts/pzgl/znpdpzgl/zdpppzgl', component: './hts/pzgl/znpdpzgl/zdpppzgl' },
      //   ]
      // },
      // { path: '/hts/pzgl/dsrw', id: '2211', pid: '22', name: '数据定时下载管理', icon: 'RobotOutlined', component: './hts/pzgl/dsrw' },
      // { name: '发票下载', id: '2213', pid: '22', icon: 'SecurityScanOutlined', path: '/hts/pzgl/fpxz', component: './hts/pzgl/fpxz' },
      // { name: '换汇成本管理', id: '2212', pid: '22', icon: 'SecurityScanOutlined', path: '/hts/pzgl/hhcbgl', component: './hts/pzgl/hhcbgl' },
      // { name: 'AI配单配置管理', id: '2215', pid: '22', icon: 'SecurityScanOutlined', path: '/hts/pzgl/aipdgl', component: './hts/pzgl/aipdgl' },
      // { name: '超级配单配置管理', id: '2216', pid: '22', icon: 'SecurityScanOutlined', path: '/hts/pzgl/cjpdgl', component: './hts/pzgl/cjpdgl' },
      // { name: '收汇数据定时匹配管理', id: '2214', pid: '22', icon: 'RobotOutlined', path: '/hts/pzgl/shsjdsppgl', component: './hts/pzgl/shsjdsppgl' },
    ]
  },
  ] }
];