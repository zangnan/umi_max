const cktsMenu = [
  {
    path: '/02', id: '02', name: '数据管理', icon: 'BookOutlined', routes: [
      { path: '/02', redirect: '/02/0201' },
      {
        path: '/02/0201', id: '0201', pid: '02', name: '下载任务管理', icon: 'FileProtectOutlined', component: './hts/sjgl/xzrwgl/jdcx'
      },
      {
        path: '/02/0202', id: '0202', pid: '02', name: '数据下载', icon: 'InteractionOutlined', routes: [
          { path: '/02/0202', redirect: '/02/0202/020201' },
          { path: '/02/0202/020201', id: '020201', pid: '0202', name: '海关数据下载', component: './hts/sjgl/xzrwgl/sjxz' },
          { path: '/02/0202/020202', id: '020202', pid: '0202', name: '受托方已开具代理证明下载', component: './hts/sjgl/xzrwgl/stfykjdlzm' },
          { path: '/02/0202/020203', id: '020203', pid: '0202', name: '进项发票下载', component: './hts/sjgl/xzrwgl/stfykjdlzm' },
          { path: '/02/0202/020207', id: '020207', pid: '0202', name: '消费税发票下载', component: './hts/sjgl/xzrwgl/stfykjdlzm' },
          { path: '/02/0202/020208', id: '020208', pid: '0202', name: '销项发票下载', component: './hts/sjgl/xzrwgl/xxfpxz' },
          { path: '/02/0202/020204', id: '020204', pid: '0202', name: '税务反馈下载', component: './hts/sjgl/xzrwgl/swsjxz' },
          { path: '/02/0202/020205', id: '020205', pid: '0202', name: '税务事项文书下载', component: './404' },
          { path: '/02/0202/020206', id: '020206', pid: '0202', name: '查询台账', component: './404' },
        ]
      },
      {
        path: '/02/0203', id: '0203', pid: '02', name: '海关数据查询', icon: 'ProjectOutlined', routes: [
          { path: '/02/0203', redirect: '/02/0203/020301' },
          { path: '/02/0203/020301', id: '020301', pid: '0203', name: '出口货物报关单', component: './hts/commonModule/ckhwbgd' },
          { path: '/02/0203/020302', id: '020302', pid: '0203', name: '进口货物报关单', component: './hts/commonModule/jkhwbgd' },
          { path: '/02/0203/020303', id: '020303', pid: '0203', name: '增值税专用缴款书', component: './hts/sjgl/hgsjcx' },
        ]
      },
      { path: '/02/DLCKZMCX_0204', id: '0204', pid: '02', name: '受托方已开具代理出口证明查询', icon: 'RobotOutlined', component: './hts/commonModule/dlhwzmgl' },
      {
        path: '/02/0205', id: '0205', pid: '02', name: '加贸数据查询', icon: 'OneToOneOutlined', routes: [
          { path: '/02/0205', redirect: '/02/0205/020501' },
          {
            path: '/02/0205/020501', id: '020501', pid: '0205', name: '加贸海关数据查询', routes: [
              { path: '/02/0205/020501', redirect: '/02/0205/020501/02050101' },
              { path: '/02/0205/020501/02050101', id: '02050101', pid: '020501', name: '海关加工贸易手册数据', component: './hts/jljg/sjxz/hghxsjcx/scxxcx' },
              { path: '/02/0205/020501/02050102', id: '02050102', pid: '020501', name: '海关加工贸易账册数据', component: './hts/jljg/sjxz/hghxsjcx/zcxxcx' },
              { path: '/02/0205/020501/02050103', id: '02050103', pid: '020501', name: '海关保税核注清单数据', component: './hts/jljg/sjxz/hghxsjcx/jckhzqdcx' },
              { path: '/02/0205/020501/02050104', id: '02050104', pid: '020501', name: '海关核销报关单数据', component: './hts/jljg/sjxz/hghxsjcx/jckbgdcx' },
            ]
          },
          {
            path: '/02/0205/020502', id: '020502', pid: '0205', name: '加贸反馈数据查询', routes: [
              { path: '/02/0205/020502', redirect: '/02/0205/020502/02050201' },
              { path: '/02/0205/020502/02050201', id: '02050201', pid: '020502', name: '税务已核销手册数据', component: './hts/jljg/sjxz/jmfksjcx/scxxcx' },
              { path: '/02/0205/020502/02050202', id: '02050202', pid: '020502', name: '税务已核销账册数据', component: './hts/jljg/sjxz/jmfksjcx/zcxxcx' },
              { path: '/02/0205/020502/02050203', id: '02050203', pid: '020502', name: '税务已核销报关单数据', component: './hts/jljg/sjxz/jmfksjcx/jckbgdcx' },
              { path: '/02/0205/020502/02050204', id: '02050204', pid: '020502', name: '税务免抵退出口明细数据', component: './hts/jljg/sjxz/jmfksjcx/ckmxcx' },
            ]
          },
        ]
      },
      // {
      //   path: '/02/0206', id: '0206', pid: '02', name: '进项发票数据查询', icon: 'LayoutOutlined', routes: [
      //     { path: '/02/0206', redirect: '/02/0206/JXFP_020601' },
      //     { path: '/02/0206/JXFP_020601', id: '020601', pid: '0206', name: '增值税专用发票数据', component: './hts/commonModule/zzszyfp' },
      //   ]
      // },
      { path: '/02/0206/JXFP_020601', id: '0206', pid: '02', name: '进项发票数据查询', icon: 'LayoutOutlined', component: './hts/commonModule/zzszyfp' },
      { path: '/02/0206/JXFP_020602', id: '020602', pid: '02', name: '进项发票数据查询', icon: 'LayoutOutlined', component: './hts/commonModule/zzszyfp', parentKeys: ['/02/0206/JXFP_020601'], hideInMenu: true  },
      { path: '/02/0210', id: '0210', pid: '02', name: '进项发票池查询', icon: 'LayoutOutlined', component: './hts/sjgl/jxfpccx' },
      { path: '/02/0211', id: '0211', pid: '02', name: '进项发票池查询', icon: 'LayoutOutlined', component: './hts/sjgl/jxfpccx', parentKeys: ['/02/0210'], hideInMenu: true },
      { path: '/02/0209', id: '0209', pid: '02', name: '消费税票查询', icon: 'AuditOutlined', component: './hts/commonModule/xfsp' },
      { path: '/02/0212', id: '0212', pid: '02', name: '销项发票池查询', icon: 'AuditOutlined', component: './hts/sjgl/xxfpccx' },
      { path: '/02/0213', id: '0213', pid: '02', name: '销项发票池查询', icon: 'AuditOutlined', component: './hts/sjgl/xxfpccx', parentKeys: ['/02/0212'], hideInMenu: true },
      {
        path: '/02/0207', id: '0207', pid: '02', name: '税务反馈数据查询', icon: 'FundOutlined', routes: [
          { path: '/02/0207', redirect: '/02/0207/CXTJ_020705' },
          {
            path: '/02/0207/020701', id: '020701', pid: '0207', name: '免抵退税申报', routes: [
              { path: '/02/0207/020701', redirect: '/02/0207/020701/CXTJ_02070101' },
              { path: '/02/0207/020701/CXTJ_02070101', id: '02070101', pid: '020701', name: '生产企业出口货物劳务免抵退税申报明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB', ywKey: 'MDT_TSSB' },
              { path: '/02/0207/020701/CXTJ_02070102', id: '02070102', pid: '020701', name: '海关商品编码、名称、退税率调整对应表', component: './hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_HGSPTZ_GCB', ywKey: 'MDT_HGSPTZ' },
              { path: '/02/0207/020701/CXTJ_02070103', id: '02070103', pid: '020701', name: '出口货物收汇情况表', component: './hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_CKSH_GCB', ywKey: 'MDT_CKSH' },
              { path: '/02/0207/020701/CXTJ_02070104', id: '02070104', pid: '020701', name: '出口货物离岸价差异原因说明表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_CYSM_GCB', ywKey: 'MDT_CYSM' },
              { path: '/02/0207/020701/CXTJ_02070105', id: '02070105', pid: '020701', name: '视同自产进货明细清单', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_STZC_GCB', ywKey: 'MDT_STZC' },
              { path: '/02/0207/020701/CXTJ_02070114', id: '02070114', pid: '020701', name: '外贸企业出口退税进货明细申报表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSJH_GCB', ywKey: 'MDT_TSJH' },
              // { path: '/02/0207/020701/CXTJ_02070106', id: '02070106', pid: '020701', name: '先退税后核销企业免抵退税申报附表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_XTHH_GCB', ywKey: 'MDT_XTHHSB' },
              { path: '/02/0207/020701/CXTJ_02070107', id: '02070107', pid: '020701', name: '国际运输（港澳台运输）免抵退税申报明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_GJYS_GCB', ywKey: 'MDT_GJYS' },
              { path: '/02/0207/020701/CXTJ_02070108', id: '02070108', pid: '020701', name: '航空国际运输收入清算账单申报明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_HKYS_QS_GCB', ywKey: 'MDT_HKYS' },
              { path: '/02/0207/020701/CXTJ_02070109', id: '02070109', pid: '020701', name: '国际客运（含香港直通车）旅客、行李包裹运输清算函件明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_KYHJ_GCB', ywKey: 'MDT_KYHJ' },
              { path: '/02/0207/020701/CXTJ_02070110', id: '02070110', pid: '020701', name: '中国铁路总公司国际货物运输明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TLHY_GCB', ywKey: 'MDT_TLHY' },
              { path: '/02/0207/020701/CXTJ_02070111', id: '02070111', pid: '020701', name: '跨境应税行为免抵退税申报明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_YFSJ_GCB', ywKey: 'MDT_YFSJ' },
              { path: '/02/0207/020701/CXTJ_02070112', id: '02070112', pid: '020701', name: '跨境应税行为收讫营业款明细清单', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_SYYK_GCB', ywKey: 'MDT_SYYK' },
              { path: '/02/0207/020701/CXTJ_02070113', id: '02070113', pid: '020701', name: '免抵退税申报汇总表', component: './hts/dditax.ckts.from/mdts/sjsb/sjhz/swfk', ywKey: 'MDT_MDTHZ' },
            ]
          },
          {
            path: '/02/0207/020702', id: '020702', pid: '0207', name: '免退税申报', routes: [
              { path: '/02/0207/020702', redirect: '/02/0207/020702/CXTJ_02070201' },
              { path: '/02/0207/020702/CXTJ_02070201', id: '02070201', pid: '020702', name: '外贸企业出口退税出口明细申报表', component: './hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_TSSB_GCB', ywKey: 'MTS_TSSB' },
              { path: '/02/0207/020702/CXTJ_02070202', id: '02070202', pid: '020702', name: '外贸企业出口退税进货明细申报表', component: './hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_TSJH_GCB', ywKey: 'MTS_TSJH' },
              { path: '/02/0207/020702/CXTJ_02070203', id: '02070203', pid: '020702', name: '海关商品编码、名称、退税率调整对应表', component: './hts/dditax.ckts.from/MTS_TSZL___ZXSB_SB_HGSPTZ_GCB', ywKey: 'MTS_HGSPTZ' },
              { path: '/02/0207/020702/CXTJ_02070204', id: '02070204', pid: '020702', name: '出口货物收汇情况表', component: './hts/dditax.ckts.from/MTS_TSZL___ZXSB_SB_CKSH_GCB', ywKey: 'MTS_CKSH' },
              { path: '/02/0207/020702/CXTJ_02070205', id: '02070205', pid: '020702', name: '外贸企业调整申报', component: './hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_TZSB_GCB', ywKey: 'MTS_TZSB' },
              { path: '/02/0207/020702/CXTJ_02070206', id: '02070206', pid: '020702', name: '跨境应税行为免退税申报明细表', component: './hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_YSFWCK_GCB', ywKey: 'MTS_YSFWCK' },
            ]
          },
          {
            path: '/02/0207/020703', id: '020703', pid: '0207', name: '代办退税', routes: [
              { path: '/02/0207/020703', redirect: '/02/0207/020703/CXTJ_02070301' },
              { path: '/02/0207/020703/CXTJ_02070301', id: '02070301', pid: '020703', name: '外贸综合服务企业代办退税申报表', component: './hts/dditax.ckts.from/DBTS___ZXSB_SB_DB_TSSB_GCB', ywKey: 'DBTS_DBTSMX' },
              { path: '/02/0207/020703/CXTJ_02070302', id: '02070302', pid: '020703', name: '海关商品编码、名称、退税率调整对应表', component: './hts/dditax.ckts.from/DBTS_TSZL___ZXSB_SB_HGSPTZ_GCB', ywKey: 'DBTS_HGSPTZ' },
              { path: '/02/0207/020703/CXTJ_02070303', id: '02070303', pid: '020703', name: '出口货物收汇情况表', component: './hts/dditax.ckts.from/DBTS_TSZL___ZXSB_SB_CKSH_GCB', ywKey: 'DBTS_CKSH' },
              { path: '/02/0207/020703/CXTJ_02070304', id: '02070304', pid: '020703', name: '代办退税应退税款明细', component: './hts/dditax.ckts.from/CXTJ___CKTS_BL_DB_DBTSYTSKMX', ywKey: 'DBTS' },
            ]
          },
          {
            path: '/02/0207/020704', id: '020704', pid: '0207', name: '已使用过设备退税', routes: [
              { path: '/02/0207/020704', redirect: '/02/0207/020704/CXTJ_02070401' },
              { path: '/02/0207/020704/CXTJ_02070401', id: '02070401', pid: '020704', name: '出口已使用过的设备退税申报表', component: './hts/dditax.ckts.from/ZBYW___ZXSB_SB_YS_SBMX_GCB', ywKey: 'ZBYW_YSSB_YSSB' },
              { path: '/02/0207/020704/CXTJ_02070402', id: '02070402', pid: '020704', name: '海关商品编码、名称、退税率调整对应表', component: './hts/dditax.ckts.from/YS_TSZL___ZXSB_SB_HGSPTZ_GCB', ywKey: 'ZBYW_YSSB_HGSPTZ' },
              { path: '/02/0207/020704/CXTJ_02070403', id: '02070403', pid: '020704', name: '出口货物收汇情况表', component: './hts/dditax.ckts.from/YS_TSZL___ZXSB_SB_CKSH_GCB', ywKey: 'ZBYW_YSSB_CKSH' },
            ]
          },
          // { path: '/02/0207/CXTJ_020705', id: '020705', pid: '0207', name: '购进自用货物退税', component: './hts/dditax.ckts.from/ZBYW___ZXSB_SB_GJ_SBMX_GCB', ywKey: 'ZBYW_GJSB' },
          { path: '/02/0207/CXTJ_020706', id: '020706', pid: '0207', name: '航天发射', component: './404' },
          {
            path: '/02/0207/020707', id: '020707', pid: '0207', name: '出口非自产退消费税', routes: [
              { path: '/02/0207/020707', redirect: '/02/0207/020707/CXTJ_02070701' },
              { path: '/02/0207/020707/CXTJ_02070701', id: '02070701', pid: '020707', name: '生产企业出口非自产货物消费税退税申报表', component: './hts/dditax.ckts.from/ZBYW___ZXSB_SB_FZC_SBMX_GCB', ywKey: 'ZBYW_FZCSB_FZCSB' },
              { path: '/02/0207/020707/CXTJ_02070702', id: '02070702', pid: '020707', name: '海关商品编码、名称、退税率调整对应表', component: './hts/dditax.ckts.from/FZC_TSZL___ZXSB_SB_HGSPTZ_GCB', ywKey: 'ZBYW_FZCSB_HGSPTZ' },
              { path: '/02/0207/020707/CXTJ_02070703', id: '02070703', pid: '020707', name: '出口货物收汇情况表', component: './hts/dditax.ckts.from/FZC_TSZL___ZXSB_SB_CKSH_GCB', ywKey: 'ZBYW_FZCSB_CKSH' },
            ]
          },
          {
            path: '/02/0207/020708', id: '020708', pid: '0207', name: '进料加工核销', routes: [
              { path: '/02/0207/020708', redirect: '/02/0207/020708/CXTJ_02070801' },
              { path: '/02/0207/020708/CXTJ_02070801', id: '02070801', pid: '020708', name: '进料加工业务统计查询', component: './hts/jljg/sbjgcx/jljgtjcx' },
              { path: '/02/0207/020708/CXTJ_02070802', id: '02070802', pid: '020708', name: '进料加工业务免抵退税核销表', component: './hts/jljg/sbjgcx/mdthx', ywKey: 'JLJG_MDTHX_MDTHX' },
              { path: '/02/0207/020708/CXTJ_02070803', id: '02070803', pid: '020708', name: '进料加工业务免抵退税核销表', component: './hts/jljg/sbjgcx/mdthx', ywKey: 'JLJG_MDTHX_MDTHX', parentKeys: ['/02/0207/020708/CXTJ_02070802'], hideInMenu: true },
              { path: '/02/0207/020708/CXTJ_02070804', id: '02070804', pid: '020708', name: '已核销手（账）册海关数据调整表', component: './hts/jljg/sbjgcx/yhxtz', ywKey: 'JLJG_MDTHX_HGSJTZ' },
              { path: '/02/0207/020708/CXTJ_02070805', id: '02070805', pid: '020708', name: '已核销手（账）册海关数据调整表', component: './hts/jljg/sbjgcx/yhxtz', ywKey: 'JLJG_MDTHX_HGSJTZ', parentKeys: ['/02/0207/020708/CXTJ_02070804'], hideInMenu: true },
            ]
          },
          {
            path: '/02/0207/020709', id: '020709', pid: '0207', name: '证明业务', routes: [
              { path: '/02/0207/020709', redirect: '/02/0207/020709/CXTJ_02070901' },
              { path: '/02/0207/020709/CXTJ_02070901', id: '02070901', pid: '020709', name: '来料加工免税证明', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_LLJG_GCB', ywKey: 'ZMKJ_LLJG' },
              { path: '/02/0207/020709/CXTJ_02070902', id: '02070902', pid: '020709', name: '来料加工免税核销申请表', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_LLJGHX_GCB', ywKey: 'ZMKJ_LLJGHX' },
              { path: '/02/0207/020709/CXTJ_02070903', id: '02070903', pid: '020709', name: '准予免税购进卷烟证明', component: './404' },
              { path: '/02/0207/020709/CXTJ_02070904', id: '02070904', pid: '020709', name: '出口卷烟已免税证明', component: './404' },
              { path: '/02/0207/020709/CXTJ_02070905', id: '02070905', pid: '020709', name: '出口卷烟免税核销', component: './404' },
              { path: '/02/0207/020709/CXTJ_02070906', id: '02070906', pid: '020709', name: '免税出口卷烟计划', component: './404' },
              { path: '/02/0207/020709/CXTJ_02070907', id: '02070907', pid: '020709', name: '代理出口货物证明', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_DLCK_GCB', ywKey: 'ZMKJ_DLCK' },
              { path: '/02/0207/020709/CXTJ_02070908', id: '02070908', pid: '020709', name: '代理进口货物证明', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_DLJK_GCB', ywKey: 'ZMKJ_DLJK' },
              { path: '/02/0207/020709/CXTJ_02070909', id: '02070909', pid: '020709', name: '委托出口货物证明', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_WTCK_GCB', ywKey: 'ZMKJ_WTCK' },
              { path: '/02/0207/020709/CXTJ_02070910', id: '02070910', pid: '020709', name: '出口已补税/未退税证明（外贸）', component: './hts/dditax.ckts.from/ZMKJ_WM___ZXSB_ZM_TYYBSWTS_GCB', ywKey: 'ZMKJ_TYYBS' },
              { path: '/02/0207/020709/CXTJ_02070911', id: '02070911', pid: '020709', name: '出口已补税/未退税证明（生产）', component: './hts/dditax.ckts.from/ZMKJ_SC___ZXSB_ZM_TYYBSWTS_GCB', ywKey: 'ZMKJ_TYYBS' },
              { path: '/02/0207/020709/CXTJ_02070912', id: '02070912', pid: '020709', name: '出口转内销证明', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_CKHWZNX_GCB', ywKey: 'ZMKJ_CKHWZNX' },
              { path: '/02/0207/020709/CXTJ_02070913', id: '02070913', pid: '020709', name: '中标证明通知书', component: './404' },
            ]
          },
          {
            path: '/02/0207/020710', id: '020710', pid: '0207', name: '其他申报业务', routes: [
              { path: '/02/0207/020710', redirect: '/02/0207/020710/CXTJ_02071001' },
              { path: '/02/0207/020710/CXTJ_02071001', id: '02071001', pid: '020710', name: '出口信息查询', component: './hts/dditax.ckts.from/QTYW___ZXSB_SB_CKXXCX_GCB', ywKey: 'QTYW_CKXXCX' },
              { path: '/02/0207/020710/CXTJ_02071002', id: '02071002', pid: '020710', name: '进货凭证信息回退', component: './hts/dditax.ckts.from/QTYW___ZXSB_QT_KSPZWGQWBTSHT_GCB', ywKey: 'QTYW_JHPZXXHT' },
              { path: '/02/0207/020710/CXTJ_02071003', id: '02071003', pid: '020710', name: '跨境电商出口海外仓预退税核算管理台账', component: './hts/dditax.ckts.from/QTYW___ZXSB_QT_KJDSCKHWCYTSHSGLTZ_GCB', ywKey: 'QTYW_HWCHSTZ' },
              { path: '/02/0207/020710/CXTJ_02071004', id: '02071004', pid: '020710', name: '跨境电商出口海外仓预退税核算确认表', component: './hts/dditax.ckts.from/QTYW___ZXSB_QT_KJDSCKHWCYTSHSQRB_GCB', ywKey: 'QTYW_HWCHS' },
            ]
          },
          { path: '/02/0207/020711', id: '020711', pid: '0207', name: '税务事项通知书', component: './404' },
          { path: '/02/0207/020712', id: '020712', pid: '0207', name: '税务事项文书', component: './404' },
        ]
      },
      {
        path: '/02/0208', id: '0208', pid: '02', name: '码表查询', icon: 'SendOutlined', routes: [
          { path: '/02/0208', redirect: '/02/0208/3001' },
          { path: '/02/0208/3001', id: '3001', pid: '0208', name: '税率查询', icon: 'BarChartOutlined', component: './hts/mbcx/slcx' },
          { path: '/02/0208/3002', id: '3002', pid: '0208', name: '业务类型码表查询', icon: 'LayoutOutlined', component: './hts/mbcx/ywlxcx' },
          { path: '/02/0208/3003', id: '3003', pid: '0208', name: '关区码表查询', icon: 'AuditOutlined', component: './hts/mbcx/gqmbcx' },
          { path: '/02/0208/3004', id: '3004', pid: '0208', name: '贸易性质码表查询', icon: 'AuditOutlined', component: './hts/mbcx/myxzcx' },
          { path: '/02/0208/3005', id: '3005', pid: '0208', name: '货币码表查询', icon: 'AreaChartOutlined', component: './hts/mbcx/hbmbcx' },
        ]
      },
      {
        path: '/02/0220', id: '0220', pid: '02', name: '新户数据准入', icon: 'BarChartOutlined', component: './hts/sjgl/xhsjzr'
      },
    ]
  },

  // {
  //   name: '码表查询', id: '40', icon: 'SendOutlined', path: '/40', routes: [
  //     { path: '/40', redirect: '/40/4001' },
  //     { name: '税率查询', id: '4001', pid: '40', icon: 'BarChartOutlined', path: '/40/4001', component: './hts/mbcx/slcx' },
  //     { name: '业务类型码表查询', id: '4002', pid: '40', icon: 'LayoutOutlined', path: '/40/4002', component: './hts/mbcx/ywlxcx' },
  //     { name: '关区码表查询', id: '4003', pid: '40', icon: 'AuditOutlined', path: '/40/4003', component: './hts/mbcx/gqmbcx' },
  //     { name: '贸易性质码表查询', id: '4004', pid: '40', icon: 'AuditOutlined', path: '/40/4004', component: './hts/mbcx/myxzcx', },
  //     { name: '货币码表查询', id: '4005', pid: '40', icon: 'AreaChartOutlined', path: '/40/4005', component: './hts/mbcx/hbmbcx' },
  //   ]
  // },
];

export default cktsMenu;
