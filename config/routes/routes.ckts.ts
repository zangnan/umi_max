const cktsMenu_cxtj = [
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

const cktsMenu = [
  // AntD退税申报（生产）
  {
    path: '/03', id: '03', name: 'AntD退税申报（生产）', icon: 'BookOutlined', routes: [
      { path: '/03', redirect: '/03/0301/030101', id: '0300', pid: '03' },
      {
        path: '/03/0301', id: '0301', pid: '03', name: '货物劳务及服务退税申报', icon: 'BarChartOutlined', component: './hts/template/template_step2', routes: [
          { path: '/03/0301', redirect: '/03/0301/030101' },
          {
            path: '/03/0301/030101', id: '030101', pid: '0301', name: '明细数据采集', component: './hts/template/template_tab2_sjcj', hideInMenu: true, routes: [
              { path: '/03/0301/030101/03010100', id: '03010100', pid: '030101', name: '采集首页', component: './hts/template/template_icon_nav2', navtype: 'MDT_CJSY' },
              { path: '/03/0301/030101/03010101', id: '03010101', pid: '030101', name: '汇率管理', component: './404', nav: 'MDT_CJSY#基础数据管理#iconBZ_HQPTTSSB' }, // todo
              { path: '/03/0301/030101/03010102', id: '03010102', pid: '030101', name: '出口货物报关单管理', component: './hts/commonModule/ckhwbgd', nav: 'MDT_CJSY#基础数据管理#iconBZ_HQPTTSSB' },
              { path: '/03/0301/030101/03010103', id: '03010103', pid: '030101', name: '代理出口货物证明管理', component: './hts/commonModule/dlhwzmgl', nav: 'MDT_CJSY#基础数据管理#iconBZ_HQPTTSSB' },
              { path: '/03/0301/030101/03010104', id: '03010104', pid: '030101', name: '技术出口与服务外包数据管理', component: './404', nav: 'MDT_CJSY#基础数据管理#iconBZ_HQPTTSSB' }, // todo
              { path: '/03/0301/030101/03010105', id: '03010105', pid: '030101', name: '生产企业出口货物劳务免抵退税申报明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB', nav: 'MDT_CJSY#出口货物劳务免抵退税申报#iconTSMDT_CKHWSBMXB' },
              { path: '/03/0301/030101/03010106', id: '03010106', pid: '030101', name: '海关商品编码、名称、退税率调整对应表', component: './hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_HGSPTZ_GCB', nav: 'MDT_CJSY#出口货物劳务免抵退税申报#iconTSMDT_SPDMTZDYB' },
              { path: '/03/0301/030101/03010107', id: '03010107', pid: '030101', name: '出口业务收汇情况表', component: './hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_CKSH_GCB', nav: 'MDT_CJSY#出口货物劳务免抵退税申报#iconTSMDT_CKHWSHSBB' },
              { path: '/03/0301/030101/03010108', id: '03010108', pid: '030101', name: '出口货物离岸价差异原因说明表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_CYSM_GCB', nav: 'MDT_CJSY#出口货物劳务免抵退税申报#iconTSMDT_LAJCYYYSMB' },
              { path: '/03/0301/030101/03010109', id: '03010109', pid: '030101', name: '视同自产进货明细清单', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_STZC_GCB', nav: 'MDT_CJSY#出口货物劳务免抵退税申报#iconTSMDT_STZCJHMXQD' },
              // { path: '/03/0301/030101/03010110', id: '03010110', pid: '030101', name: '先退税后核销企业免抵退税申报附表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_XTHH_GCB', nav: 'MDT_CJSY#出口货物劳务免抵退税申报#iconTSMDT_XTSHHXSBFB' },
              { path: '/03/0301/030101/03010111', id: '03010111', pid: '030101', name: '国际运输（港澳台运输）免抵退税申报明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_GJYS_GCB', nav: 'MDT_CJSY#增值税跨境运输应税行为免抵退税申报#iconTSMDT_YSFWGJYSSB' },
              { path: '/03/0301/030101/03010112', id: '03010112', pid: '030101', name: '航空国际运输收入清算账单申报明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_HKYS_QS_GCB', nav: 'MDT_CJSY#增值税跨境运输应税行为免抵退税申报#iconTSMDT_HKYSSRQSZD' },
              { path: '/03/0301/030101/03010113', id: '03010113', pid: '030101', name: '铁路国际客运（含广深港高铁）旅客、行李包裹运输清算函件明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_KYHJ_GCB', nav: 'MDT_CJSY#增值税跨境运输应税行为免抵退税申报#iconTSMDT_GJKYQSJ' },
              { path: '/03/0301/030101/03010114', id: '03010114', pid: '030101', name: '中国铁路总公司国际货物运输明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TLHY_GCB', nav: 'MDT_CJSY#增值税跨境运输应税行为免抵退税申报#iconTSMDT_GTZGSGJHYMX' },
              { path: '/03/0301/030101/03010115', id: '03010115', pid: '030101', name: '跨境应税行为免抵退税申报明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_YFSJ_GCB', nav: 'MDT_CJSY#增值税跨境其他应税行为免抵退税申报#iconTSMDT_YSFWSBMXB' },
              { path: '/03/0301/030101/03010116', id: '03010116', pid: '030101', name: '跨境应税行为收讫营业款明细清单', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_SYYK_GCB', nav: 'MDT_CJSY#增值税跨境其他应税行为免抵退税申报#iconTSMDT_YSFWSKQD' }
            ]
          },
          { path: '/03/0301/030102', id: '030102', pid: '0301', name: '确认汇总表', component: './hts/dditax.ckts.from/mdts/sjsb/sjhz', hideInMenu: true },
          {
            path: '/03/0301/030103', id: '030103', pid: '0301', name: '退税申报', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'MDT', routes: [
              { path: '/03/0301/030103/SBMXCX_03010301', id: '03010301', pid: '030103', name: '生产企业出口货物劳务免抵退税申报明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB', hideInMenu: true },
              { path: '/03/0301/030103/SBMXCX_03010302', id: '03010302', pid: '030103', name: '海关商品编码、名称、退税率调整对应表', component: './hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_HGSPTZ_GCB', hideInMenu: true },
              { path: '/03/0301/030103/SBMXCX_03010303', id: '03010303', pid: '030103', name: '出口业务收汇情况表', component: './hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_CKSH_GCB', hideInMenu: true },
              { path: '/03/0301/030103/SBMXCX_03010304', id: '03010304', pid: '030103', name: '出口货物离岸价差异原因说明表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_CYSM_GCB', hideInMenu: true },
              { path: '/03/0301/030103/SBMXCX_03010305', id: '03010305', pid: '030103', name: '视同自产进货明细清单', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_STZC_GCB', hideInMenu: true },
              // { path: '/03/0301/030103/SBMXCX_03010306', id: '03010306', pid: '030103', name: '先退税后核销企业免抵退税申报附表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_XTHH_GCB', hideInMenu: true },
              { path: '/03/0301/030103/SBMXCX_03010307', id: '03010307', pid: '030103', name: '国际运输（港澳台运输）免抵退税申报明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_GJYS_GCB', hideInMenu: true },
              { path: '/03/0301/030103/SBMXCX_03010308', id: '03010308', pid: '030103', name: '航空国际运输收入清算账单申报明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_HKYS_QS_GCB', hideInMenu: true },
              { path: '/03/0301/030103/SBMXCX_03010309', id: '03010309', pid: '030103', name: '铁路国际客运（含广深港高铁）旅客、行李包裹运输清算函件明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_KYHJ_GCB', hideInMenu: true },
              { path: '/03/0301/030103/SBMXCX_03010310', id: '03010310', pid: '030103', name: '中国铁路总公司国际货物运输明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TLHY_GCB', hideInMenu: true },
              { path: '/03/0301/030103/SBMXCX_03010311', id: '03010311', pid: '030103', name: '跨境应税行为免抵退税申报明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_YFSJ_GCB', hideInMenu: true },
              { path: '/03/0301/030103/SBMXCX_03010312', id: '03010312', pid: '030103', name: '跨境应税行为收讫营业款明细清单', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_SYYK_GCB', hideInMenu: true },
            ]
          },
          { path: '/03/0301/030104', id: '030104', pid: '0301', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'MDT' }
        ]
      },
      {
        path: '/03/0302', id: '0302', pid: '03', name: '出口已使用过设备退税', component: './hts/template/template_step2', icon: 'OneToOneOutlined', routes: [
          { path: '/03/0302', redirect: '/03/0302/030201', id: '030200', pid: '0302' },
          {
            path: '/03/0302/030201', id: '030201', pid: '0302', name: '明细数据采集', component: './hts/template/template_tab2_sjcj', hideInMenu: true, routes: [
              { path: '/03/0302/030201/03020101', id: '03020101', pid: '030201', name: '采集首页', component: './hts/template/template_icon_nav2', navtype: 'ZBYW_CJSY' },
              { path: '/03/0302/030201/03020102', id: '03020102', pid: '030201', name: '出口已使用过的设备退税申报表', component: './hts/dditax.ckts.from/ZBYW___ZXSB_SB_YS_SBMX_GCB', nav: 'ZBYW_CJSY#出口已使用过的设备退税申报表#iconQT_CKYSYSBTSSB' },
              { path: '/03/0302/030201/03020103', id: '03020103', pid: '030201', name: '海关商品编码、名称、退税率调整对应表', component: './hts/dditax.ckts.from/YS_TSZL___ZXSB_SB_HGSPTZ_GCB', nav: 'ZBYW_CJSY#出口已使用过的设备退税申报表#iconTSMDT_SPDMTZDYB' },
              { path: '/03/0302/030201/03020104', id: '03020104', pid: '030201', name: '出口业务收汇情况表', component: './hts/dditax.ckts.from/YS_TSZL___ZXSB_SB_CKSH_GCB', nav: 'ZBYW_CJSY#出口已使用过的设备退税申报表#iconTSMDT_CKHWSHSBB' }
            ]
          },
          {
            path: '/03/0302/030202', id: '030202', pid: '0302', name: '退税申报', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'ZBYW_YSSB', routes: [
              { path: '/03/0302/030202/SBMXCX_03020201', id: '03020201', pid: '030202', name: '出口已使用过的设备退税申报表', component: './hts/dditax.ckts.from/ZBYW___ZXSB_SB_YS_SBMX_GCB', hideInMenu: true },
              { path: '/03/0302/030202/SBMXCX_03020202', id: '03020202', pid: '030202', name: '海关商品编码、名称、退税率调整对应表', component: './hts/dditax.ckts.from/YS_TSZL___ZXSB_SB_HGSPTZ_GCB', hideInMenu: true },
              { path: '/03/0302/030202/SBMXCX_03020203', id: '03020203', pid: '030202', name: '出口业务收汇情况表', component: './hts/dditax.ckts.from/YS_TSZL___ZXSB_SB_CKSH_GCB', hideInMenu: true },
            ]
          },
          { path: '/03/0302/030203', id: '030203', pid: '0302', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'ZBYW_YSSB' }
        ]
      },
      {
        path: '/03/0304', id: '0304', pid: '03', name: '出口非自产消费税退税', component: './hts/template/template_step2', icon: 'ProfileOutlined', routes: [
          { path: '/03/0304', redirect: '/03/0304/030401', id: '030400', pid: '0304' },
          {
            path: '/03/0304/030401', id: '030401', pid: '0304', name: '明细数据采集', component: './hts/template/template_tab2_sjcj', hideInMenu: true, routes: [
              { path: '/03/0304/030401/03040101', id: '03040101', pid: '030401', name: '采集首页', component: './hts/template/template_icon_nav2', navtype: 'ZBYW_CJSY' },
              { path: '/03/0304/030401/03040102', id: '03040102', pid: '030401', name: '生产企业出口非自产货物消费税退税申报表', component: './hts/dditax.ckts.from/ZBYW___ZXSB_SB_FZC_SBMX_GCB', nav: 'ZBYW_CJSY#出口非自产货物消费税退税申报#iconQT_CKFZCHWTSSB' },
              { path: '/03/0304/030401/03040103', id: '03040103', pid: '030401', name: '海关商品编码、名称、退税率调整对应表', component: './hts/dditax.ckts.from/FZC_TSZL___ZXSB_SB_HGSPTZ_GCB', nav: 'ZBYW_CJSY#出口非自产货物消费税退税申报#iconTSMDT_SPDMTZDYB' },
              { path: '/03/0304/030401/03040104', id: '03040104', pid: '030401', name: '出口业务收汇情况表', component: './hts/dditax.ckts.from/FZC_TSZL___ZXSB_SB_CKSH_GCB', nav: 'ZBYW_CJSY#出口非自产货物消费税退税申报#iconTSMDT_SPDMTZDYB' }
            ]
          },
          {
            path: '/03/0304/030402', id: '030402', pid: '0304', name: '退税申报', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'ZBYW_FZCSB', routes: [
              { path: '/03/0304/030402/SBMXCX_03040201', id: '03040201', pid: '030402', name: '生产企业出口非自产货物消费税退税申报表', component: './hts/dditax.ckts.from/ZBYW___ZXSB_SB_FZC_SBMX_GCB', hideInMenu: true },
              { path: '/03/0304/030402/SBMXCX_03040202', id: '03040202', pid: '030402', name: '海关商品编码、名称、退税率调整对应表', component: './hts/dditax.ckts.from/FZC_TSZL___ZXSB_SB_HGSPTZ_GCB', hideInMenu: true },
              { path: '/03/0304/030402/SBMXCX_03040203', id: '03040203', pid: '030402', name: '出口业务收汇情况表', component: './hts/dditax.ckts.from/FZC_TSZL___ZXSB_SB_CKSH_GCB', hideInMenu: true },
            ]
          },
          { path: '/03/0304/030403', id: '030403', pid: '0304', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'ZBYW_FZCSB' }
        ]
      },
    ]
  },
  // AntD退税申报（外贸）
  {
    path: '/04', id: '04', name: 'AntD退税申报（外贸）', icon: 'BuildOutlined', routes: [
      { path: '/04', redirect: '/04/0401/040101/04010101', id: '0400', pid: '04' },
      {
        path: '/04/0401', id: '0401', pid: '04', name: '货物劳务及服务退税申报', component: './hts/template/template_step2', icon: 'CloudServerOutlined', routes: [
          { path: '/04/0401', redirect: '/04/0401/040101', id: '040100', pid: '0401' },
          {
            path: '/04/0401/040101', id: '040101', pid: '0401', name: '智能配单', component: './hts/template/template_tab2_sjcj', hideInMenu: true, routes: [
              { path: '/04/0401/040101/04010101', id: '04010101', pid: '040101', name: '智能配单首页', component: './hts/template/template_icon_nav2', navtype: 'MTS_JCSJGL' },
              { path: '/04/0401/040101/04010102', id: '04010102', pid: '040101', name: '汇率管理', component: './404', nav: 'MTS_JCSJGL#基础数据管理#iconBZ_HQPTTSSB' }, // todo
              { path: '/04/0401/040101/04010103', id: '04010103', pid: '040101', name: '出口货物报关单管理', component: './hts/commonModule/ckhwbgd', nav: 'MTS_JCSJGL#基础数据管理#iconBZ_HQPTTSSB' },
              { path: '/04/0401/040101/04010104', id: '04010104', pid: '040101', name: '增值税专用发票管理', component: './hts/commonModule/zzszyfp', nav: 'MTS_JCSJGL#基础数据管理#iconTSMDT_SPDMTZDYB' },
              { path: '/04/0401/040101/04010105', id: '04010105', pid: '040101', name: '代理货物证明管理', component: './hts/commonModule/dlhwzmgl', nav: 'MTS_JCSJGL#基础数据管理#iconZM_DLCKHWZM' },
              { path: '/04/0401/040101/04010106', id: '04010106', pid: '040101', name: '报关单逐项配单', component: './hts/commonModule/pd/mts/sjznpd/bgdzxpd', nav: 'MTS_JCSJGL#基础数据智能配单#iconZM_ZBZMTZS' },
              { path: '/04/0401/040101/04010107', id: '04010107', pid: '040101', name: '发票逐项配单', component: './hts/commonModule/pd/mts/sjznpd/fpzxpd', nav: 'MTS_JCSJGL#基础数据智能配单#iconZM_ZBZMTZS' },
              { path: '/04/0401/040101/04010108', id: '04010108', pid: '040101', name: '智能配单', component: './hts/commonModule/pd/mts/sjznpd/znpd', nav: 'MTS_JCSJGL#基础数据智能配单#iconZM_ZBZMTZS' },
              { path: '/04/0401/040101/04010109', id: '04010109', pid: '040101', name: '代理证明数据配单', component: './hts/commonModule/pd/mts/sjznpd/dlzmznpd', nav: 'MTS_JCSJGL#基础数据智能配单#iconZM_ZBZMTZS' },
              { path: '/04/0401/040101/04010110', id: '04010110', pid: '040101', name: '商品品名分类配单', component: './404', nav: 'MTS_JCSJGL#基础数据智能配单#iconZM_ZBZMTZS' }, // todo
            ]
          },
          {
            path: '/04/0401/040102', id: '040102', pid: '0401', name: '明细数据采集', component: './hts/template/template_tab2_sjcj', hideInMenu: true, routes: [
              { path: '/04/0401/040102/04010201', id: '04010201', pid: '040102', name: '采集首页', component: './hts/template/template_icon_nav2', navtype: 'MTS_CJSY' },
              { path: '/04/0401/040102/04010202', id: '04010202', pid: '040102', name: '外贸企业出口退税出口明细申报表', component: './hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_TSSB_GCB', nav: 'MTS_CJSY#出口货物劳务免退税申报#iconTSMTS_CKMXSQB' },
              { path: '/04/0401/040102/04010203', id: '04010203', pid: '040102', name: '外贸企业出口退税进货明细申报表', component: './hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_TSJH_GCB', nav: 'MTS_CJSY#出口货物劳务免退税申报#iconTSMTS_JHMXSBB' },
              { path: '/04/0401/040102/04010204', id: '04010204', pid: '040102', name: '海关商品编码、名称、退税率调整对应表', component: './hts/dditax.ckts.from/MTS_TSZL___ZXSB_SB_HGSPTZ_GCB', nav: 'MTS_CJSY#出口货物劳务免退税申报#iconTSMDT_SPDMTZDYB' },
              { path: '/04/0401/040102/04010205', id: '04010205', pid: '040102', name: '出口业务收汇情况表', component: './hts/dditax.ckts.from/MTS_TSZL___ZXSB_SB_CKSH_GCB', nav: 'MTS_CJSY#出口货物劳务免退税申报#iconTSMDT_CKHWSHSBB' },
              { path: '/04/0401/040102/04010206', id: '04010206', pid: '040102', name: '外贸企业调整申报', component: './hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_TZSB_GCB', nav: 'MTS_CJSY#外贸企业调整申报#iconTSMTS_WMQYTZSBB' },
              { path: '/04/0401/040102/04010207', id: '04010207', pid: '040102', name: '跨境应税行为免退税申报明细表', component: './hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_YSFWCK_GCB', nav: 'MTS_CJSY#外贸企业外购服务免退税申报#iconTSMTS_YSWWCKMXB' }
            ]
          },
          {
            path: '/04/0401/040104', id: '040104', pid: '0401', name: '退税申报', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'MTS', routes: [
              { path: '/04/0401/040104/SBMXCX_04010401', id: '04010401', pid: '040104', name: '外贸企业出口退税出口明细申报表', component: './hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_TSSB_GCB', hideInMenu: true },
              { path: '/04/0401/040104/SBMXCX_04010402', id: '04010402', pid: '040104', name: '外贸企业出口退税进货明细申报表', component: './hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_TSJH_GCB', hideInMenu: true },
              { path: '/04/0401/040104/SBMXCX_04010403', id: '04010403', pid: '040104', name: '海关商品编码、名称、退税率调整对应表', component: './hts/dditax.ckts.from/MTS_TSZL___ZXSB_SB_HGSPTZ_GCB', hideInMenu: true },
              { path: '/04/0401/040104/SBMXCX_04010404', id: '04010404', pid: '040104', name: '出口业务收汇情况表', component: './hts/dditax.ckts.from/MTS_TSZL___ZXSB_SB_CKSH_GCB', hideInMenu: true },
              { path: '/04/0401/040104/SBMXCX_04010405', id: '04010405', pid: '040104', name: '外贸企业调整申报', component: './hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_TZSB_GCB', hideInMenu: true },
              { path: '/04/0401/040104/SBMXCX_04010406', id: '04010406', pid: '040104', name: '跨境应税行为免退税申报明细表', component: './hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_YSFWCK_GCB', hideInMenu: true },
            ]
          },
          { path: '/04/0401/040105', id: '040105', pid: '0401', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'MTS' }
        ]
      },
      {
        path: '/04/0403', id: '0403', pid: '04', name: '外贸综合服务企业代办退税申报表', component: './hts/template/template_step2', icon: 'ContainerOutlined', routes: [
          { path: '/04/0403', redirect: '/04/0403/040301', id: '040300', pid: '0403' },
          {
            path: '/04/0403/040301', id: '040301', pid: '0403', name: '智能配单', component: './hts/template/template_tab2_sjcj', hideInMenu: true, routes: [
              { path: '/04/0403/040301/04030101', id: '04030101', pid: '040301', name: '智能配单首页', component: './hts/template/template_icon_nav2', navtype: 'WZFDBTS_JCSJGL' },
              { path: '/04/0403/040301/04030102', id: '04030102', pid: '040301', name: '汇率管理', component: './404', nav: 'WZFDBTS_JCSJGL#基础数据管理#iconTSMDT_SPDMTZDYB' }, // todo
              { path: '/04/0403/040301/04030103', id: '04030103', pid: '040301', name: '出口货物报关单管理', component: './hts/commonModule/ckhwbgd', nav: 'WZFDBTS_JCSJGL#基础数据管理#iconBZ_HQPTTSSB' },
              { path: '/04/0403/040301/04030104', id: '04030104', pid: '040301', name: '增值税专用发票管理', component: './hts/commonModule/zzszyfp', nav: 'WZFDBTS_JCSJGL#基础数据管理#iconTSMDT_SPDMTZDYB' },
              { path: '/04/0403/040301/04030105', id: '04030105', pid: '040301', name: '报关单逐项配单', component: './hts/commonModule/pd/mts/sjznpd/bgdzxpd', nav: 'WZFDBTS_JCSJGL#基础数据智能配单#iconZM_ZBZMTZS' },
              { path: '/04/0403/040301/04030106', id: '04030106', pid: '040301', name: '商品品名分类配单', component: './404', nav: 'WZFDBTS_JCSJGL#基础数据智能配单#iconZM_ZBZMTZS' }, // todo
            ]
          },
          {
            path: '/04/0403/040302', id: '040302', pid: '0403', name: '明细数据采集', component: './hts/template/template_tab2_sjcj', hideInMenu: true, routes: [
              { path: '/04/0403/040302/04030201', id: '04030201', pid: '040302', name: '采集首页', component: './hts/template/template_icon_nav2', navtype: 'MTS_WZFDBTS' },
              { path: '/04/0403/040302/04030202', id: '04030202', pid: '040302', name: '外贸综合服务企业代办退税申报表', component: './hts/dditax.ckts.from/DBTS___ZXSB_SB_DB_TSSB_GCB', nav: 'MTS_WZFDBTS#外贸综合服务企业代办退税申报#iconBA_WZMDBTSQKBA' },
              { path: '/04/0403/040302/04030203', id: '04030203', pid: '040302', name: '海关商品编码、名称、退税率调整对应表', component: './hts/dditax.ckts.from/DBTS_TSZL___ZXSB_SB_HGSPTZ_GCB', nav: 'MTS_WZFDBTS#外贸综合服务企业代办退税申报#iconTSMDT_SPDMTZDYB' },
              { path: '/04/0403/040302/04030204', id: '04030204', pid: '040302', name: '出口业务收汇情况表', component: './hts/dditax.ckts.from/DBTS_TSZL___ZXSB_SB_CKSH_GCB', nav: 'MTS_WZFDBTS#外贸综合服务企业代办退税申报#iconTSMDT_CKHWSHSBB' }
            ]
          },
          {
            path: '/04/0403/040303', id: '040303', pid: '0403', name: '退税申报', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'DBTS', routes: [
              { path: '/04/0403/040303/SBMXCX_04030301', id: '04030301', pid: '040303', name: '外贸综合服务企业代办退税申报表', component: './hts/dditax.ckts.from/DBTS___ZXSB_SB_DB_TSSB_GCB', hideInMenu: true },
              { path: '/04/0403/040303/SBMXCX_04030302', id: '04030302', pid: '040303', name: '海关商品编码、名称、退税率调整对应表', component: './hts/dditax.ckts.from/DBTS_TSZL___ZXSB_SB_HGSPTZ_GCB', hideInMenu: true },
              { path: '/04/0403/040303/SBMXCX_04030303', id: '04030303', pid: '040303', name: '出口业务收汇情况表', component: './hts/dditax.ckts.from/DBTS_TSZL___ZXSB_SB_CKSH_GCB', hideInMenu: true },
            ]
          },
          { path: '/04/0403/040304', id: '040304', pid: '0403', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'DBTS' }
        ]
      },
      {
        path: '/04/0404', id: '0404', pid: '04', name: '出口已使用过设备退税', component: './hts/template/template_step2', icon: 'QuestionOutlined', routes: [
          { path: '/04/0404', redirect: '/04/0404/040401', id: '040400', pid: '0404' },
          {
            path: '/04/0404/040401', id: '040401', pid: '0404', name: '明细数据采集', component: './hts/template/template_tab2_sjcj', hideInMenu: true, routes: [
              { path: '/04/0404/040401/04040101', id: '04040101', pid: '040401', name: '采集首页', component: './hts/template/template_icon_nav2', navtype: 'ZBYW_CJSY' },
              { path: '/04/0404/040401/04040102', id: '04040102', pid: '040401', name: '出口已使用过的设备退税申报表', component: './hts/dditax.ckts.from/ZBYW___ZXSB_SB_YS_SBMX_GCB', nav: 'ZBYW_CJSY#出口已使用过的设备退税申报表#iconQT_CKYSYSBTSSB' },
              { path: '/04/0404/040401/04040103', id: '04040103', pid: '040401', name: '海关商品编码、名称、退税率调整对应表', component: './hts/dditax.ckts.from/YS_TSZL___ZXSB_SB_HGSPTZ_GCB', nav: 'ZBYW_CJSY#出口已使用过的设备退税申报表#iconTSMDT_SPDMTZDYB' },
              { path: '/04/0404/040401/04040104', id: '04040104', pid: '040401', name: '出口业务收汇情况表', component: './hts/dditax.ckts.from/YS_TSZL___ZXSB_SB_CKSH_GCB', nav: 'ZBYW_CJSY#出口已使用过的设备退税申报表#iconTSMDT_CKHWSHSBB' }
            ]
          },
          {
            path: '/04/0404/040402', id: '040402', pid: '0404', name: '退税申报', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'ZBYW_YSSB', routes: [
              { path: '/04/0404/040402/SBMXCX_04040201', id: '04040201', pid: '040402', name: '出口已使用过的设备退税申报表', component: './hts/dditax.ckts.from/ZBYW___ZXSB_SB_YS_SBMX_GCB', hideInMenu: true },
              { path: '/04/0404/040402/SBMXCX_04040202', id: '04040202', pid: '040402', name: '海关商品编码、名称、退税率调整对应表', component: './hts/dditax.ckts.from/YS_TSZL___ZXSB_SB_HGSPTZ_GCB', hideInMenu: true },
              { path: '/04/0404/040402/SBMXCX_04040203', id: '04040203', pid: '040402', name: '出口业务收汇情况表', component: './hts/dditax.ckts.from/YS_TSZL___ZXSB_SB_CKSH_GCB', hideInMenu: true },
            ]
          },
          { path: '/04/0404/040403', id: '040403', pid: '0404', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'ZBYW_YSSB' }
        ]
      },
      {
        path: '/04/0406', id: '0406', pid: '04', name: '航天发射业务免退税', component: './hts/template/template_step2', icon: 'QuestionOutlined', nav: 'QT_MDTYW_SK#免退税业务#iconQT_GJZYHWTSSB', routes: [
          { path: '/04/0406', redirect: '/04/0406/040601', id: '040600', pid: '0406' },
          { path: '/04/0406/040601', id: '040601', pid: '0406', name: '明细数据采集', component: './404', hideInMenu: true }, // todo
          {
            path: '/04/0406/040602', id: '040602', pid: '0406', name: '退税申报', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'ZBYW_HTSB', routes: [
              { path: '/04/0406/040602/SBMXCX_04060201', id: '04060201', pid: '040602', name: '航天发射业务免退税', component: './404', hideInMenu: true }, // todo
            ]
          },
          { path: '/04/0406/040603', id: '040603', pid: '0406', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'ZBYW_HTSB' }
        ]
      },
    ]
  },
  { path: '/qt', id: 'qt', name: '其他（退）免税', icon: 'BuildOutlined', routes: [
    { path: '/qt', redirect: '/qt/05/0501/050101/05010101', id: '0500', pid: 'qt' },
      // AntD证明申报
      {
        path: '/qt/05', id: '05', name: 'AntD证明申报', icon: 'CalendarOutlined', routes: [
        { path: '/qt/05/0501/050101', redirect: '/qt/05/0501/050101/05010101', id: '050100', pid: '05' },
        {
          path: '/qt/05/0501/050101', id: '050101', pid: '05', name: '来料加工免税证明', component: './hts/template/template_step2', nav: 'ZM_ZMLYW_SK#来料加工免税证明管理#iconZM_LLJGMSZM', routes: [
            { path: '/qt/05/0501/050101', redirect: '/qt/05/0501/050101/05010101', id: '05010100', pid: '050101' },
            { path: '/qt/05/0501/050101/05010101', id: '05010101', pid: '050101', name: '明细数据采集', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_LLJG_GCB', hideInMenu: true },
            {
              path: '/qt/05/0501/050101/05010102', id: '05010102', pid: '050101', name: '证明申请', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'ZMKJ_LLJG', routes: [
                { path: '/qt/05/0501/050101/05010102/SBMXCX_0501010201', id: '0501010201', pid: '05010102', name: '来料加工免税证明', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_LLJG_GCB', hideInMenu: true },
              ]
            },
            { path: '/qt/05/0501/050101/05010103', id: '05010103', pid: '050101', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'ZMKJ_LLJG' }
          ]
        },
        {
          path: '/qt/05/0501/050102', id: '050102', pid: '05', name: '来料加工免税核销申请表', component: './hts/template/template_step2', nav: 'ZM_ZMLYW_SK#来料加工免税证明管理#iconZM_LLJGMSZMHX', routes: [
            { path: '/qt/05/0501/050102', redirect: '/qt/05/0501/050102/05010201', id: '05010200', pid: '050102' },
            { path: '/qt/05/0501/050102/05010201', id: '05010201', pid: '050102', name: '明细数据采集', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_LLJGHX_GCB', hideInMenu: true },
            {
              path: '/qt/05/0501/050102/05010202', id: '05010202', pid: '050102', name: '证明申请', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'ZMKJ_LLJGHX', routes: [
                { path: '/qt/05/0501/050102/05010202/SBMXCX_0501020201', id: '0501020201', pid: '05010202', name: '来料加工免税核销申请表', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_LLJGHX_GCB', hideInMenu: true },
              ]
            },
            { path: '/qt/05/0501/050102/05010203', id: '05010203', pid: '050102', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'ZMKJ_LLJGHX' }
          ]
        },
      {
        path: '/qt/05/0503', id: '0503', pid: '05', name: '代理出口货物证明', component: './hts/template/template_step2', icon: 'InteractionOutlined', nav: 'ZM_ZMLYW_SK#其他出口退（免）税证明#iconZM_DLCKHWZM', routes: [
          { path: '/qt/05/0503', redirect: '/qt/05/0503/050301', id: '050300', pid: '0503' },
          { path: '/qt/05/0503/050301', id: '050301', pid: '0503', name: '明细数据采集', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_DLCK_GCB', hideInMenu: true },
          {
            path: '/qt/05/0503/050302', id: '050302', pid: '0503', name: '证明申请', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'ZMKJ_DLCK', routes: [
              { path: '/qt/05/0503/050302/SBMXCX_05030201', id: '05030201', pid: '050302', name: '代理出口货物证明申请表', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_DLCK_GCB', hideInMenu: true },
            ]
          },
          { path: '/qt/05/0503/050303', id: '050303', pid: '0503', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'ZMKJ_DLCK' }
        ]
      },
      {
        path: '/qt/05/0504', id: '0504', pid: '05', name: '代理进口货物证明', component: './hts/template/template_step2', icon: 'ProjectOutlined', nav: 'ZM_ZMLYW_SK#其他出口退（免）税证明#iconZM_DLJKHWZM', routes: [
          { path: '/qt/05/0504', redirect: '/qt/05/0504/050401', id: '050400', pid: '0504' },
          { path: '/qt/05/0504/050401', id: '050401', pid: '0504', name: '明细数据采集', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_DLJK_GCB', hideInMenu: true },
          {
            path: '/qt/05/0504/050402', id: '050402', pid: '0504', name: '证明申请', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'ZMKJ_DLJK', routes: [
              { path: '/qt/05/0504/050402/SBMXCX_05040201', id: '05040201', pid: '050402', name: '代理进口货物证明申请表', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_DLJK_GCB', hideInMenu: true },
            ]
          },
          { path: '/qt/05/0504/050403', id: '050403', pid: '0504', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'ZMKJ_DLJK' }
        ]
      },
      {
        path: '/qt/05/0505', id: '0505', pid: '05', name: '委托出口货物证明', component: './hts/template/template_step2', icon: 'RobotOutlined', nav: 'ZM_ZMLYW_SK#其他出口退（免）税证明#iconZM_WTCKHWZM', routes: [
          { path: '/qt/05/0505', redirect: '/qt/05/0505/050501', id: '050500', pid: '0505' },
          { path: '/qt/05/0505/050501', id: '050501', pid: '0505', name: '明细数据采集', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_WTCK_GCB', hideInMenu: true },
          {
            path: '/qt/05/0505/050502', id: '050502', pid: '0505', name: '证明申请', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'ZMKJ_WTCK', routes: [
              { path: '/qt/05/0505/050502/SBMXCX_05050201', id: '05050201', pid: '050502', name: '委托出口货物证明', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_WTCK_GCB', hideInMenu: true },
            ]
          },
          { path: '/qt/05/0505/050503', id: '050503', pid: '0505', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'ZMKJ_WTCK' }
        ]
      },
      {
        path: '/qt/05/0506', id: '0506', pid: '05', name: '出口业务转内销证明（外贸）', component: './hts/template/template_step2', icon: 'OneToOneOutlined', nav: 'ZM_ZMLYW_SK#其他出口退（免）税证明#iconZM_CKHWZNXZM', routes: [
          { path: '/qt/05/0506', redirect: '/qt/05/0506/050601', id: '050600', pid: '0506' },
          { path: '/qt/05/0506/050601', id: '050601', pid: '0506', name: '明细数据采集', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_CKHWZNX_GCB', hideInMenu: true },
          {
            path: '/qt/05/0506/050602', id: '050602', pid: '0506', name: '证明申请', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'ZMKJ_CKHWZNX', routes: [
              { path: '/qt/05/0506/050602/SBMXCX_05060201', id: '05060201', pid: '050602', name: '出口业务转内销证明申报表（外贸）', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_CKHWZNX_GCB', hideInMenu: true },
            ]
          },
          { path: '/qt/05/0506/050603', id: '050603', pid: '0506', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'ZMKJ_CKHWZNX' }
        ]
      },
      {
        path: '/qt/05/0507', id: '0507', pid: '05', name: '出口货物已补税/未退税证明（外贸）', component: './hts/template/template_step2', icon: 'LayoutOutlined', nav: 'ZM_ZMLYW_SK#其他出口退（免）税证明#iconZM_HWTYYBSZM', routes: [
          { path: '/qt/05/0507', redirect: '/qt/05/0507/050701', id: '050700', pid: '0507' },
          { path: '/qt/05/0507/050701', id: '050701', pid: '0507', name: '明细数据采集', component: './hts/dditax.ckts.from/ZMKJ_WM___ZXSB_ZM_TYYBSWTS_GCB', hideInMenu: true },
          {
            path: '/qt/05/0507/050702', id: '050702', pid: '0507', name: '证明申请', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'ZMKJ_TYYBS', routes: [
              { path: '/qt/05/0507/050702/SBMXCX_05070201', id: '05070201', pid: '050702', name: '未退税证明（外贸）', component: './hts/dditax.ckts.from/ZMKJ_WM___ZXSB_ZM_TYYBSWTS_GCB', hideInMenu: true },
            ]
          },
          { path: '/qt/05/0507/050703', id: '050703', pid: '0507', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'ZMKJ_TYYBS' }
        ]
      },
      {
        path: '/qt/05/0508', id: '0508', pid: '05', name: '出口货物已补税/未退税证明（生产）', component: './hts/template/template_step2', icon: 'FundOutlined', nav: 'ZM_ZMLYW_SK#其他出口退（免）税证明#iconZM_HWTYYBSZM', routes: [
          { path: '/qt/05/0508', redirect: '/qt/05/0508/050801', id: '050800', pid: '0508' },
          { path: '/qt/05/0508/050801', id: '050801', pid: '0508', name: '明细数据采集', component: './hts/dditax.ckts.from/ZMKJ_SC___ZXSB_ZM_TYYBSWTS_GCB', hideInMenu: true },
          {
            path: '/qt/05/0508/050802', id: '050802', pid: '0508', name: '证明申请', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'ZMKJ_TYYBS', routes: [
              { path: '/qt/05/0508/050802/SBMXCX_05080201', id: '05080201', pid: '050802', name: '未退税证明（生产）', component: './hts/dditax.ckts.from/ZMKJ_SC___ZXSB_ZM_TYYBSWTS_GCB', hideInMenu: true },
            ]
          },
          { path: '/qt/05/0508/050803', id: '050803', pid: '0508', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'ZMKJ_TYYBS' }
        ]
      },
      {
        path: '/qt/05/0509', id: '0509', pid: '05', name: '关于补办出口退税有关证明的申请', component: './hts/template/template_step2', icon: 'ProfileOutlined', nav: 'ZM_ZMLYW_SK#其他出口退（免）税证明#iconZM_BBTMSXGZM', routes: [
          { path: '/qt/05/0509', redirect: '/qt/05/0509/050901', id: '050900', pid: '0509' },
          { path: '/qt/05/0509/050901', id: '050901', pid: '0509', name: '明细数据采集', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_BBCKTSZM_GCB', hideInMenu: true },
          {
            path: '/qt/05/0509/050902', id: '050902', pid: '0509', name: '证明申请', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'ZMKJ_BBCKTSZM', routes: [
              { path: '/qt/05/0509/050902/SBMXCX_05090201', id: '05090201', pid: '050902', name: '关于补办出口退税有关证明的申请', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_BBCKTSZM_GCB', hideInMenu: true },
            ]
          },
          { path: '/qt/05/0509/050903', id: '050903', pid: '0509', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'ZMKJ_BBCKTSZM' }
        ]
      },
      {
        path: '/qt/05/0510', id: '0510', pid: '05', name: '免税出口卷烟管理', icon: 'FileProtectOutlined', navtype: 'ZM_ZMLYW_SK', routes: [
          { path: '/qt/05/0510', redirect: '/qt/05/0510/051001/05100101' },
          {
            path: '/qt/05/0510/051001', id: '051001', pid: '0510', name: '准予免税购进卷烟证明', component: './hts/template/template_step2', nav: 'ZM_ZMLYW_SK#来料加工免税证明管理#iconZM_LLJGMSZM', routes: [
              { path: '/qt/05/0510/051001', redirect: '/qt/05/0510/051001/05100101', id: '05100100', pid: '051001' },
              { path: '/qt/05/0510/051001/05100101', id: '05100101', pid: '051001', name: '明细数据采集', component: './404', hideInMenu: true },
              {
                path: '/qt/05/0510/051001/05100102', id: '05100102', pid: '051001', name: '证明申请', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'ZMKJ_ZYMSGJJY', routes: [
                  { path: '/qt/05/0510/051001/05100102/SBMXCX_0510010201', id: '0510010201', pid: '05100102', name: '准予免税购进卷烟证明', component: './404', hideInMenu: true },
                ]
              },
              { path: '/qt/05/0510/051001/05100103', id: '05100103', pid: '051001', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'ZMKJ_ZYMSGJJY' }
            ]
          },
          {
            path: '/qt/05/0510/051002', id: '051002', pid: '0510', name: '出口烟卷已免税证明（生产）', component: './hts/template/template_step2', nav: 'ZM_ZMLYW_SK#来料加工免税证明管理#iconZM_LLJGMSZM', routes: [
              { path: '/qt/05/0510/051002', redirect: '/qt/05/0510/051002/05100201', id: '05100200', pid: '051002' },
              { path: '/qt/05/0510/051002/05100201', id: '05100201', pid: '051002', name: '明细数据采集', component: './404', hideInMenu: true },
              {
                path: '/qt/05/0510/051002/05100202', id: '05100202', pid: '051002', name: '证明申请', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'ZMKJ_CKJYYMS', routes: [
                  { path: '/qt/05/0510/051002/05100202/SBMXCX_0510020201', id: '0510020201', pid: '05100202', name: '出口烟卷已免税证明（生产）', component: './404', hideInMenu: true },
                ]
              },
              { path: '/qt/05/0510/051002/05100203', id: '05100203', pid: '051002', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'ZMKJ_CKJYYMS' }
            ]
          },
          {
            path: '/qt/05/0510/051003', id: '051003', pid: '0510', name: '出口烟卷免税核销申请', component: './hts/template/template_step2', nav: 'ZM_ZMLYW_SK#来料加工免税证明管理#iconZM_LLJGMSZM', routes: [
              { path: '/qt/05/0510/051003', redirect: '/qt/05/0510/051003/05100301', id: '05100300', pid: '051003' },
              { path: '/qt/05/0510/051003/05100301', id: '05100301', pid: '051003', name: '明细数据采集', component: './404', hideInMenu: true },
              {
                path: '/qt/05/0510/051003/05100302', id: '05100302', pid: '051003', name: '证明申请', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'ZMKJ_CKJYMSHX', routes: [
                  { path: '/qt/05/0510/051003/05100302/SBMXCX_0510030201', id: '0510030201', pid: '05100302', name: '出口烟卷免税核销申请', component: './404', hideInMenu: true },
                ]
              },
              { path: '/qt/05/0510/051003/05100303', id: '05100303', pid: '051003', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'ZMKJ_CKJYMSHX' }
            ]
          },
        ]
      },
      {
        path: '/qt/05/0511', id: '0511', pid: '05', name: '中标证明通知书', component: './hts/template/template_step2', icon: 'CheckSquareOutlined', nav: 'ZM_ZMLYW_SK#其他出口退（免）税证明#iconZM_CKZMZFQD', routes: [
          { path: '/qt/05/0511', redirect: '/qt/05/0511/051101', id: '051100', pid: '0511' },
          { path: '/qt/05/0511/051101', id: '051101', pid: '0511', name: '明细数据采集', component: './404', hideInMenu: true },
          {
            path: '/qt/05/0511/051102', id: '051102', pid: '0511', name: '证明申请', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'ZMKJ_ZBZM', routes: [
              { path: '/qt/05/0511/051102/SBMXCX_05110201', id: '05110201', pid: '051102', name: '中标证明通知书', component: './404', hideInMenu: true },
            ]
          },
          { path: '/qt/05/0511/051103', id: '051103', pid: '0511', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'ZMKJ_ZBZM' }
        ]
      },
      {
        path: '/qt/05/0512', id: '0512', pid: '05', name: '出口退（免）税相关证明作废', component: './hts/template/template_step2', icon: 'CheckSquareOutlined', nav: 'ZM_ZMLYW_SK#其他出口退（免）税证明#iconZM_CKZMZFQD', routes: [
          { path: '/qt/05/0512', redirect: '/qt/05/0512/051201', id: '051200', pid: '0512' },
          { path: '/qt/05/0512/051201', id: '051201', pid: '0512', name: '明细数据采集', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_CKZMZFQD_GCB', hideInMenu: true },
          {
            path: '/qt/05/0512/051202', id: '051202', pid: '0512', name: '证明申请', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'ZMKJ_CKZMZFQD', routes: [
              { path: '/qt/05/0512/051202/SBMXCX_05120201', id: '05120201', pid: '051202', name: '出口退（免）税相关证明作废', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_CKZMZFQD_GCB', hideInMenu: true },
            ]
          },
          { path: '/qt/05/0512/051203', id: '051203', pid: '0512', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'ZMKJ_CKZMZFQD' }
        ]
      },
    ]
      },
      // AntD资格备案
      {
        path: '/qt/07', id: '07', name: 'AntD资格备案', icon: 'CheckSquareOutlined', routes: [
          { path: '/qt/07', redirect: '/qt/07/0701/070101/07010101', id: '0700', pid: '07' },
          {
            path: '/qt/07/0701/070101', id: '070101', pid: '07', name: '出口退（免）税备案变更', icon: 'FormOutlined', component: './hts/template/template_step2', nav: 'BA_BALYW_SK#出口退（免）税备案管理#iconBA_CKTMSBABG', routes: [
              { path: '/qt/07/0701/070101', redirect: '/qt/07/0701/070101/07010101', id: '07010100', pid: '070101' },
              { path: '/qt/07/0701/070101/07010101', id: '07010101', pid: '070101', name: '明细数据采集', component: './hts/dditax.ckts.from/ZGBA___ZXSB_BA_BABG_GCB', hideInMenu: true },
              {
                path: '/qt/07/0701/070101/07010102', id: '07010102', pid: '070101', name: '数据申报', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'ZGBA_BABG', routes: [
                  { path: '/qt/07/0701/070101/07010102/SBMXCX_0701010201', id: '0701010201', pid: '07010102', name: '出口退（免）税备案变更', component: './hts/dditax.ckts.from/ZGBA___ZXSB_BA_BABG_GCB', hideInMenu: true },
                ]
              },
              { path: '/qt/07/0701/070101/07010103', id: '07010103', pid: '070101', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'ZGBA_BABG' }
            ]
          },
          {
            path: '/qt/07/0701/070102', id: '070102', pid: '07', name: '出口退（免）税备案撤回', icon: 'FormOutlined', component: './hts/template/template_step2', nav: 'BA_BALYW_SK#出口退（免）税备案管理#iconBA_CKTMSBABG', routes: [
              { path: '/qt/07/0701/070102', redirect: '/qt/07/0701/070102/07010201', id: '07010200', pid: '070102' },
              { path: '/qt/07/0701/070102/07010201', id: '07010201', pid: '070102', name: '明细数据采集', component: './404', hideInMenu: true },
              {
                path: '/qt/07/0701/070102/07010202', id: '07010202', pid: '070102', name: '数据申报', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'ZGBA_BACH', routes: [
                  { path: '/qt/07/0701/070102/07010202/SBMXCX_0701020201', id: '0701020201', pid: '07010202', name: '出口退（免）税备案撤回', component: './404', hideInMenu: true },
                ]
              },
              { path: '/qt/07/0701/070102/07010203', id: '07010203', pid: '070102', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'ZGBA_BACH' }
            ]
          },
          {
            path: '/qt/07/0702', id: '0702', pid: '07', name: '代办退税备案管理', icon: 'RobotOutlined', routes: [
              { path: '/qt/07/0702', redirect: '/qt/07/0702/070201/07020101' },
              {
                path: '/qt/07/0702/070201', id: '070201', pid: '0702', name: '代办退税备案', component: './hts/template/template_step2', routes: [
                  { path: '/qt/07/0702/070201', redirect: '/qt/07/0702/070201/07020101', id: '07020100', pid: '070201' },
                  { path: '/qt/07/0702/070201/07020101', id: '07020101', pid: '070201', name: '明细数据采集', component: './hts/dditax.ckts.from/ZGBA___ZXSB_BA_SCQYWTDBTS_G', hideInMenu: true },
                  {
                    path: '/qt/07/0702/070201/07020102', id: '07020102', pid: '070201', name: '数据申报', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'ZGBA_SCQYWTDBTS_BA', routes: [
                      { path: '/qt/07/0702/070201/07020102/SBMXCX_0702010201', id: '0702010201', pid: '07020102', name: '代办退税情况备案表', component: './hts/dditax.ckts.from/ZGBA___ZXSB_BA_SCQYWTDBTS_G', hideInMenu: true },
                    ]
                  },
                  { path: '/qt/07/0702/070201/07020103', id: '07020103', pid: '070201', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'ZGBA_SCQYWTDBTS_BA' }
                ]
              },
              {
                path: '/qt/07/0702/070202', id: '070202', pid: '0702', name: '代办退税备案撤回', component: './hts/template/template_step2', routes: [
                  { path: '/qt/07/0702/070202', redirect: '/qt/07/0702/070202/07020201', id: '07020200', pid: '070202' },
                  { path: '/qt/07/0702/070202/07020201', id: '07020201', pid: '070202', name: '明细数据采集', component: './hts/dditax.ckts.from/ZGBA___ZXSB_BA_SCQYWTDBTS_G_CH', hideInMenu: true },
                  {
                    path: '/qt/07/0702/070202/07020202', id: '07020202', pid: '070202', name: '数据申报', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'ZGBA_SCQYWTDBTS_CH', routes: [
                      { path: '/qt/07/0702/070202/07020202/SBMXCX_0702010201', id: '0702020201', pid: '07020202', name: '代办退税备案撤回', component: './hts/dditax.ckts.from/ZGBA___ZXSB_BA_SCQYWTDBTS_G_CH', hideInMenu: true },
                    ]
                  },
                  { path: '/qt/07/0702/070202/07020203', id: '07020203', pid: '070202', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'ZGBA_SCQYWTDBTS_CH' }
                ]
              },
            ]
          },
          {
            path: '/qt/07/0703', id: '0703', pid: '07', name: '放弃退（免）税备案', icon: 'QuestionOutlined', routes: [
              { path: '/qt/07/0703', redirect: '/qt/07/0703/070301/07030101' },
              {
                path: '/qt/07/0703/070301', id: '070301', pid: '0703', name: '出口放弃退免税声明', component: './hts/template/template_step2', routes: [
                  { path: '/qt/07/0703/070301', redirect: '/qt/07/0703/070301/07030101', id: '07030100', pid: '070301' },
                  {
                    path: '/qt/07/0703/070301/07030101', id: '07030101', pid: '070301', name: '明细数据采集', component: './hts/template/template_tab2_sjcj', hideInMenu: true, routes: [
                      { name: '出口货物劳务放弃退（免）税声明', id: '0703010101', pid: '07030101', path: '/qt/07/0703/070301/07030101/0703010101', component: './404', hideInMenu: true },
                      { name: '放弃适用增值税零税率声明', id: '0703010102', pid: '07030101', path: '/qt/07/0703/070301/07030101/0703010102', component: './404', hideInMenu: true },
                    ]
                  },
                  {
                    path: '/qt/07/0703/070301/07030102', id: '07030102', pid: '070301', name: '数据申报', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'ZGBA_FQTMSSM', routes: [
                      { path: '/qt/07/0703/070301/07030102/SBMXCX_0703010201', id: '0703010201', pid: '07030102', name: '出口货物劳务放弃退（免）税声明', component: './404', hideInMenu: true },
                      { path: '/qt/07/0703/070301/07030102/SBMXCX_0703010202', id: '0703010202', pid: '07030102', name: '放弃适用增值税零税率声明', component: './404', hideInMenu: true },
                    ]
                  },
                  { path: '/qt/07/0703/070301/07030103', id: '07030103', pid: '070301', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'ZGBA_FQTMSSM' }
                ]
              },
              {
                path: '/qt/07/0703/070302', id: '070302', pid: '0703', name: '出口放弃免税权声明', component: './hts/template/template_step2', routes: [
                  { path: '/qt/07/0703/070302', redirect: '/qt/07/0703/070302/07030201', id: '07030200', pid: '070302' },
                  { path: '/qt/07/0703/070302/07030201', id: '07030201', pid: '070302', name: '明细数据采集', component: './404', hideInMenu: true },
                  {
                    path: '/qt/07/0703/070302/07030202', id: '07030202', pid: '070302', name: '数据申报', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'ZGBA_FQMSQSM', routes: [
                      { path: '/qt/07/0703/070302/07030202/SBMXCX_0703020201', id: '0703020201', pid: '07030202', name: '出口放弃免税权声明', component: './404', hideInMenu: true },
                    ]
                  },
                  { path: '/qt/07/0703/070302/07030203', id: '07030203', pid: '070302', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'ZGBA_FQMSQSM' }
                ]
              },
              {
                path: '/qt/07/0703/070303', id: '070303', pid: '0703', name: '恢复出口退免税声明', component: './hts/template/template_step2', routes: [
                  { path: '/qt/07/0703/070303', redirect: '/qt/07/0703/070303/07030301', id: '07030300', pid: '070303' },
                  { path: '/qt/07/0703/070303/07030301', id: '07030301', pid: '070303', name: '明细数据采集', component: './404', hideInMenu: true },
                  {
                    path: '/qt/07/0703/070303/07030302', id: '07030302', pid: '070303', name: '数据申报', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'ZGBA_HFTMSZC', routes: [
                      { path: '/qt/07/0703/070303/07030302/SBMXCX_0703030201', id: '0703030201', pid: '07030302', name: '恢复出口退免税声明', component: './404', hideInMenu: true },
                    ]
                  },
                  { path: '/qt/07/0703/070303/07030303', id: '07030303', pid: '070303', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'ZGBA_HFTMSZC' }
                ]
              },
            ]
          },
          {
            path: '/qt/07/0704', id: '0704', pid: '07', name: '集团公司成员企业备案', component: './hts/template/template_step2', icon: 'RadarChartOutlined', nav: 'ZM_ZMLYW_SK#其他出口退（免）税证明#iconZM_CKZMZFQD', routes: [
              { path: '/qt/07/0704', redirect: '/qt/07/0704/070401', id: '070400', pid: '0704' },
              { path: '/qt/07/0704/070401', id: '070401', pid: '0704', name: '明细数据采集', component: './hts/dditax.ckts.from/ZGBA___ZXSB_BA_JTCYBA_GCB', hideInMenu: true },
              {
                path: '/qt/07/0704/070402', id: '070402', pid: '0704', name: '数据申报', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'ZGBA_JTGSBA', routes: [
                  { path: '/qt/07/0704/070402/SBMXCX_07040201', id: '07040201', pid: '070402', name: '集团公司成员企业备案', component: './hts/dditax.ckts.from/ZGBA___ZXSB_BA_JTCYBA_GCB', hideInMenu: true },
                ]
              },
              { path: '/qt/07/0704/070403', id: '070403', pid: '0704', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'ZGBA_JTGSBA' }
            ]
          },
          {
            path: '/qt/07/0705', id: '0705', pid: '07', name: '边贸代理备案', icon: 'AuditOutlined', component: './hts/template/template_step2', nav: 'BA_BALYW_SK#其他退（免）税备案#iconBA_BMDLCKBA', routes: [
              { path: '/qt/07/0705', redirect: '/qt/07/0705/070501', id: '070500', pid: '0705' },
              {
                path: '/qt/07/0705/070501', id: '070501', pid: '0705', name: '明细数据采集', component: './hts/template/template_tab2_sjcj', hideInMenu: true, routes: [
                  { path: '/qt/07/0705/070501/07050101', id: '07050101', pid: '070501', name: '采集首页', component: './hts/template/template_icon_nav2', navtype: 'BMDL_CJSY' },
                  { path: '/qt/07/0705/070501/07050102', id: '07050102', pid: '070501', name: '出口货物报关单管理', component: './hts/commonModule/ckhwbgd', nav: 'BMDL_CJSY#基础数据管理#iconBZ_HQPTTSSB' },
                  { path: '/qt/07/0705/070501/07050103', id: '07050103', pid: '070501', name: '以边境小额贸易方式代理外国企业、外国自然人报关出口货物备案表', component: './hts/dditax.ckts.from/ZGBA___ZXSB_BA_BMDLCKBA_GCB', nav: 'BMDL_CJSY#以边境小额贸易方式代理外国企业、外国自然人报关出口货物备案申报#iconBZ_HQPTTSSB' }
                ]
              },
              {
                path: '/qt/07/0705/070502', id: '070502', pid: '0705', name: '数据申报', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'ZGBA_BMDLCKBA', routes: [
                  { path: '/qt/07/0705/070502/SBMXCX_07050201', id: '07050201', pid: '070502', name: '以边境小额贸易方式代理外国企业、外国自然人报关出口货物备案表', component: './hts/dditax.ckts.from/ZGBA___ZXSB_BA_BMDLCKBA_GCB', hideInMenu: true },
                ]
              },
              { path: '/qt/07/0705/070503', id: '070503', pid: '0705', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'ZGBA_BMDLCKBA' }
            ]
          },
          {
            path: '/qt/07/0706', id: '0706', pid: '07', name: '先退税后核销资格申请', component: './hts/template/template_step2', icon: 'CreditCardOutlined', nav: 'ZM_ZMLYW_SK#其他出口退（免）税证明#iconZM_CKZMZFQD', routes: [
              { path: '/qt/07/0706', redirect: '/qt/07/0706/070601', id: '070600', pid: '0706' },
              { path: '/qt/07/0706/070601', id: '070601', pid: '0706', name: '明细数据采集', component: './hts/dditax.ckts.from/ZGBA___ZXSB_SB_MDT_XTHHZG_GCB', hideInMenu: true },
              {
                path: '/qt/07/0706/070602', id: '070602', pid: '0706', name: '数据申报', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'ZGBA_XTHHSQ', routes: [
                  { path: '/qt/07/0706/070602/SBMXCX_07060201', id: '07060201', pid: '070602', name: '先退税后核销资格申请', component: './hts/dditax.ckts.from/ZGBA___ZXSB_SB_MDT_XTHHZG_GCB', hideInMenu: true },
                ]
              },
              { path: '/qt/07/0706/070603', id: '070603', pid: '0706', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'ZGBA_XTHHSQ' }
            ]
          },
          {
            path: '/qt/07/0707', id: '0707', pid: '07', name: '出口退税业务提醒信息', component: './hts/template/template_step2', icon: 'SendOutlined', nav: 'ZM_ZMLYW_SK#其他出口退（免）税证明#iconZM_CKZMZFQD', routes: [
              { path: '/qt/07/0707', redirect: '/qt/07/0707/070701', id: '070700', pid: '0707' },
              { path: '/qt/07/0707/070701', id: '070701', pid: '0707', name: '明细数据采集', component: './hts/dditax.ckts.from/ZGBA___ZXSB_TX_CKTSYWTX_GCB', hideInMenu: true },
              {
                path: '/qt/07/0707/070702', id: '070702', pid: '0707', name: '数据申报', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'ZGBA_CKTSYWTX', routes: [
                  { path: '/qt/07/0707/070702/SBMXCX_07070201', id: '07070201', pid: '070702', name: '出口退税业务提醒信息', component: './hts/dditax.ckts.from/ZGBA___ZXSB_TX_CKTSYWTX_GCB', hideInMenu: true },
                ]
              },
              { path: '/qt/07/0707/070703', id: '070703', pid: '0707', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'ZGBA_CKTSYWTX' }
            ]
          },
        ]
      },
      // AntD其他业务
      {
        path: '/qt/08', id: '08', name: 'AntD其他业务', icon: 'RadarChartOutlined', routes: [
          { path: '/qt/08', redirect: '/qt/08/0801/080101/08010101/0801010101', id: '0800', pid: '08' },
          {
            path: '/qt/08/0801/080101', id: '080101', pid: '08', name: '一类出口企业评定申请', component: './hts/template/template_step2', nav: 'QT_QTLYW_SK#出口企业分类管理#iconQT_YLCKQYPDSQ', routes: [
              { path: '/qt/08/0801/080101', redirect: '/qt/08/0801/080101/08010101/0801010101', id: '08010100', pid: '080101' },
              {
                path: '/qt/08/0801/080101/08010101', id: '08010101', pid: '080101', name: '明细数据采集', component: './hts/template/template_tab2', hideInMenu: true, routes: [
                  { path: '/qt/08/0801/080101/08010101/0801010101', id: '0801010101', pid: '08010101', name: '出口退（免）税企业内部风险控制体系建设情况报告', component: './hts/dditax.ckts.from/QTYW___ZXSB_QT_QYNBFKTXJS_GCB' },
                  { path: '/qt/08/0801/080101/08010101/0801010102', id: '0801010102', pid: '08010101', name: '生产型出口企业生产能力情况报告（生产）', component: './hts/dditax.ckts.from/QTYW___ZXSB_QT_SCXQYSCNLQK_GCB' }
                ]
              },
              {
                path: '/qt/08/0801/080101/08010102', id: '08010102', pid: '080101', name: '数据申报（生产）', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'QTYW_SCYLQYPD', routes: [
                  { path: '/qt/08/0801/080101/08010102/SBMXCX_0801010201', id: '0801010201', pid: '08010102', name: '出口退（免）税企业内部风险控制体系建设情况报告', component: './hts/dditax.ckts.from/QTYW___ZXSB_QT_QYNBFKTXJS_GCB', hideInMenu: true },
                  { path: '/qt/08/0801/080101/08010102/SBMXCX_0801010202', id: '0801010202', pid: '08010102', name: '生产型出口企业生产能力情况报告（生产）', component: './hts/dditax.ckts.from/QTYW___ZXSB_QT_SCXQYSCNLQK_GCB', hideInMenu: true },
                ]
              },
              {
                path: '/qt/08/0801/080101/08010103', id: '08010103', pid: '080101', name: '数据申报（外贸）', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'QTYW_WMYLQYPD', routes: [
                  { path: '/qt/08/0801/080101/08010103/SBMXCX_0801010301', id: '0801010301', pid: '08010103', name: '出口退（免）税企业内部风险控制体系建设情况报告', component: './hts/dditax.ckts.from/QTYW___ZXSB_QT_QYNBFKTXJS_GCB', hideInMenu: true },
                ]
              },
              { path: '/qt/08/0801/080101/08010104', id: '08010104', pid: '080101', name: '申报结果查询（生产）', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'QTYW_SCYLQYPD' },
              { path: '/qt/08/0801/080101/08010105', id: '08010105', pid: '080101', name: '申报结果查询（外贸）', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'QTYW_WMYLQYPD' },
            ]
          },
          {
            path: '/qt/08/0801/080102', id: '080102', pid: '08', name: '出口企业分类管理复评', component: './hts/template/template_step2', nav: 'QT_QTLYW_SK#出口企业分类管理#iconQT_FLGLFPSQ', routes: [
              { path: '/qt/08/0801/080102', redirect: '/qt/08/0801/080102/08010201', id: '08010200', pid: '080102' },
              { path: '/qt/08/0801/080102/08010201', id: '08010201', pid: '080102', name: '明细数据采集', component: './hts/dditax.ckts.from/QTYW___ZXSB_QT_QYGLLBFPPD_GCB', hideInMenu: true },
              {
                path: '/qt/08/0801/080102/08010202', id: '08010202', pid: '080102', name: '数据申报', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'QTYW_FLGLFP', routes: [
                  { path: '/qt/08/0801/080102/08010202/SBMXCX_0801020201', id: '0801020201', pid: '08010202', name: '出口企业分类管理复评申请表', component: './hts/dditax.ckts.from/QTYW___ZXSB_QT_QYGLLBFPPD_GCB', hideInMenu: true },
                ]
              },
              { path: '/qt/08/0801/080102/08010203', id: '08010203', pid: '080102', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'QTYW_FLGLFP' }
            ]
          },
          {
            path: '/qt/08/0802', id: '0802', pid: '08', name: '进货凭证信息回退', component: './hts/template/template_step2', icon: 'CreditCardOutlined', nav: 'QT_QTLYW_SK#其他业务管理#iconQT_JHPZXXHTSQ', routes: [
              { path: '/qt/08/0802', redirect: '/qt/08/0802/080201', id: '080200', pid: '0802' },
              { path: '/qt/08/0802/080201', id: '080201', pid: '0802', name: '明细数据采集', component: './hts/dditax.ckts.from/QTYW___ZXSB_QT_KSPZWGQWBTSHT_GCB', hideInMenu: true },
              {
                path: '/qt/08/0802/080202', id: '080202', pid: '0802', name: '数据申报', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'QTYW_JHPZXXHT', routes: [
                  { path: '/qt/08/0802/080202/SBMXCX_08020201', id: '08020201', pid: '080202', name: '进货凭证信息回退', component: './hts/dditax.ckts.from/QTYW___ZXSB_QT_KSPZWGQWBTSHT_GCB', hideInMenu: true },
                ]
              },
              { path: '/qt/08/0802/080203', id: '080203', pid: '0802', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'QTYW_JHPZXXHT' }
            ]
          },
          {
            path: '/qt/08/0803', id: '0803', pid: '08', name: '出口信息查询', component: './hts/template/template_step2', icon: 'AreaChartOutlined', nav: 'QT_QTLYW_SK#其他业务管理#iconQT_CKTMSXXCX', routes: [
              { path: '/qt/08/0803', redirect: '/qt/08/0803/080301', id: '080300', pid: '0803' },
              { path: '/qt/08/0803/080301', id: '080301', pid: '0803', name: '明细数据采集', component: './hts/dditax.ckts.from/QTYW___ZXSB_SB_CKXXCX_GCB', hideInMenu: true },
              {
                path: '/qt/08/0803/080302', id: '080302', pid: '0803', name: '数据申报', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'QTYW_CKXXCX', routes: [
                  { path: '/qt/08/0803/080302/SBMXCX_08030201', id: '08030201', pid: '080302', name: '出口信息查询', component: './hts/dditax.ckts.from/QTYW___ZXSB_SB_CKXXCX_GCB', hideInMenu: true },
                ]
              },
              { path: '/qt/08/0803/080303', id: '080303', pid: '0803', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'QTYW_CKXXCX' }
            ]
          },
          {
            path: '/qt/08/0804', id: '0804', pid: '08', name: '撤回出口退（免）税申报申请表（生产）', component: './hts/template/template_step2', icon: 'SendOutlined', nav: 'QT_QTLYW_SK#其他业务管理#iconQT_QYCHSBSJ', routes: [
              { path: '/qt/08/0804', redirect: '/qt/08/0804/080401', id: '080400', pid: '0804' },
              { path: '/qt/08/0804/080401', id: '080401', pid: '0804', name: '明细数据采集', component: './hts/dditax.ckts.from/QTYW_SC___ZXSB_SB_QYCHSBSJ_GCB', hideInMenu: true },
              {
                path: '/qt/08/0804/080402', id: '080402', pid: '0804', name: '数据申报', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'QTYW_QYCHSB', routes: [
                  { path: '/qt/08/0804/080402/SBMXCX_08040201', id: '08040201', pid: '080402', name: '撤回出口退（免）税申报申请表（生产）', component: './hts/dditax.ckts.from/QTYW_SC___ZXSB_SB_QYCHSBSJ_GCB', hideInMenu: true },
                ]
              },
              { path: '/qt/08/0804/080403', id: '080403', pid: '0804', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'QTYW_QYCHSB' }
            ]
          },
          {
            path: '/qt/08/0805', id: '0805', pid: '08', name: '撤回出口退（免）税申报申请表（外贸）', component: './hts/template/template_step2', icon: 'SendOutlined', nav: 'QT_QTLYW_SK#其他业务管理#iconQT_QYCHSBSJ', routes: [
              { path: '/qt/08/0805', redirect: '/qt/08/0805/080501', id: '080500', pid: '0805' },
              { path: '/qt/08/0805/080501', id: '080501', pid: '0805', name: '明细数据采集', component: './hts/dditax.ckts.from/QTYW_WM___ZXSB_SB_QYCHSBSJ_GCB', hideInMenu: true },
              {
                path: '/qt/08/0805/080502', id: '080502', pid: '0805', name: '数据申报', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'QTYW_QYCHSB', routes: [
                  { path: '/qt/08/0805/080502/SBMXCX_08050201', id: '08050201', pid: '080502', name: '撤回出口退（免）税申报申请表（外贸）', component: './hts/dditax.ckts.from/QTYW_WM___ZXSB_SB_QYCHSBSJ_GCB', hideInMenu: true },
                ]
              },
              { path: '/qt/08/0805/080503', id: '080503', pid: '0805', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'QTYW_QYCHSB' }],
          },{
            path: '/qt/08/0806', id: '0806', pid: '08', name: '跨境电商出口海外仓预退税核算', component: './hts/template/template_step2', nav: 'QT_QTLYW_SK#出口企业分类管理#iconQT_YLCKQYPDSQ', routes: [
              { path: '/qt/08/0806', redirect: '/qt/08/0806/080601/08060101', id: '080600', pid: '0806' },
              {
                path: '/qt/08/0806/080601', id: '080601', pid: '0806', name: '明细数据采集', component: './hts/template/template_tab2', hideInMenu: true, routes: [
                  { path: '/qt/08/0806/080601/08060101', id: '08060101', pid: '080601', name: '跨境电商出口海外仓预退税核算管理台账', component: './hts/dditax.ckts.from/QTYW___ZXSB_QT_KJDSCKHWCYTSHSGLTZ_GCB' },
                  { path: '/qt/08/0806/080601/08060102', id: '08060102', pid: '080601', name: '跨境电商出口海外仓预退税核算确认表', component: './hts/dditax.ckts.from/QTYW___ZXSB_QT_KJDSCKHWCYTSHSQRB_GCB' }
                ]
              },
              {
                path: '/qt/08/0806/080602', id: '080602', pid: '0806', name: '数据申报', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'QTYW_HWCHS', routes: [
                  { path: '/qt/08/0806/080602/SBMXCX_08060201', id: '08060201', pid: '080602', name: '跨境电商出口海外仓预退税核算', component: './hts/dditax.ckts.from/QTYW___ZXSB_QT_KJDSCKHWCYTSHSQRB_GCB', hideInMenu: true },
                ]
              },
              { path: '/qt/08/0806/080603', id: '080603', pid: '0806', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'QTYW_HWCHS' }
            
            ]
          }
        ]
      },
      // 购进自用（外贸）
      {
        path: '/qt/04/0405', id: '0405', pid: 'qt', name: '购进自用货物退税申报表', component: './hts/template/template_step2', icon: 'CreditCardOutlined', nav: 'QT_MDTYW_SK#免退税业务#iconQT_GJZYHWTSSB', routes: [
          { path: '/qt/04/0405', redirect: '/qt/04/0405/040501', id: '040500', pid: '0405' },
          { path: '/qt/04/0405/040501', id: '040501', pid: '0405', name: '明细数据采集', component: './hts/dditax.ckts.from/ZBYW___ZXSB_SB_GJ_SBMX_GCB', hideInMenu: true },
          {
            path: '/qt/04/0405/040502', id: '040502', pid: '0405', name: '退税申报', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'ZBYW_GJSB', routes: [
              { path: '/qt/04/0405/040502/SBMXCX_04050201', id: '04050201', pid: '040502', name: '购进自用货物退税申报表', component: './hts/dditax.ckts.from/ZBYW___ZXSB_SB_GJ_SBMX_GCB', hideInMenu: true },
            ]
          },
          { path: '/qt/04/0405/040503', id: '040503', pid: '0405', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'ZBYW_GJSB' }
        ]
      },
      // 购进自用（生产）
      {
        path: '/qt/03/0303', id: '0303', pid: 'qt', name: '购进自用货物退税申报表', component: './hts/template/template_step2', icon: 'CreditCardOutlined', nav: 'QT_MDTYW_SK#免退税业务#iconQT_GJZYHWTSSB', routes: [
          { path: '/qt/03/0303', redirect: '/qt/03/0303/030301', id: '030300', pid: '0303' },
          { path: '/qt/03/0303/030301', id: '030301', pid: '0303', name: '明细数据采集', component: './hts/dditax.ckts.from/ZBYW___ZXSB_SB_GJ_SBMX_GCB', hideInMenu: true }, // todo
          {
            path: '/qt/03/0303/030302', id: '030302', pid: '0303', name: '退税申报', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'ZBYW_GJSB', routes: [
              { path: '/qt/03/0303/030302/SBMXCX_03030201', id: '03030201', pid: '030302', name: '购进自用货物退税申报表', component: './hts/dditax.ckts.from/ZBYW___ZXSB_SB_GJ_SBMX_GCB', hideInMenu: true }, // todo
            ]
          },
          { path: '/qt/03/0303/030303', id: '030303', pid: '0303', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'ZBYW_GJSB' }
        ]
      },
  ]
  },
  // SaaS免抵退
  {
    name: 'SaaS免抵退', id: '25', icon: 'CoffeeOutlined', path: '/25', routes: [
    { path: '/25', redirect: '/25/2501' },
      { name: '首页', id: '2501', pid: '25', icon: 'UserOutlined', path: '/25/2501', component: './hts/saasMdt/homePage' },
      { name: '退税计划', id: '2599', pid: '25', path: '/25/2599', icon: 'CreditCardOutlined', routes: [
        { path: '/25/2599', redirect: '/25/2599/259901' },
        { path: '/25/2599/259901', id: '259901', pid: '2599', name: '退税计划登记', component: './hts/saasMdt/tuiShuiJiHua' },
        { path: '/25/2599/259902', id: '259902', pid: '2599', name: '退税计划登记日志', component: './hts/saasMdt/tuiShuiJiHua/rz'},
      ] },
      {
        name: '外部数据管理', id: '2502', pid: '25', icon: 'HomeOutlined', path: '/25/2502', routes: [
          { name: '出口报关单管理', id: '250201', pid: '2502', icon: 'UserOutlined', path: '/25/2502/250201', routes: [
            { path: '/25/2502/250201', redirect: '/25/2502/250201/25020101' },
            { name: '待处理数据', id: '25020101', pid: '250201', path: '/25/2502/250201/25020101', component: './hts/saasMdt/wbsjgl/ckbgdgl/dclsj' },
            { name: '无信息数据', id: '25020102', pid: '250201', path: '/25/2502/250201/25020102', component: './hts/saasMdt/wbsjgl/ckbgdgl/wxxsj' },
            { name: '可使用数据', id: '25020103', pid: '250201', path: '/25/2502/250201/25020103', component: './hts/saasMdt/wbsjgl/ckbgdgl/ksysj' },
            { name: '已使用数据', id: '25020104', pid: '250201', path: '/25/2502/250201/25020104', component: './hts/saasMdt/wbsjgl/ckbgdgl/ysysj' },
            { name: '不退税数据', id: '25020105', pid: '250201', path: '/25/2502/250201/25020105', component: './hts/saasMdt/wbsjgl/ckbgdgl/btssj' },
          ] },
          { name: '代理出口货物证明管理', id: '250202', pid: '2502', icon: 'HomeOutlined', path: '/25/2502/250202', routes: [
            { path: '/25/2502/250202', redirect: '/25/2502/250202/25020201' },
            { name: '待处理数据', id: '25020201', pid: '250202', path: '/25/2502/250202/25020201', component: './hts/saasMdt/wbsjgl/dlckhwzmgl/dclsj' },
            { name: '可使用数据', id: '25020202', pid: '250202', path: '/25/2502/250202/25020202', component: './hts/saasMdt/wbsjgl/dlckhwzmgl/ksysj' },
            { name: '已使用数据', id: '25020203', pid: '250202', path: '/25/2502/250202/25020203', component: './hts/saasMdt/wbsjgl/dlckhwzmgl/ysysj' },
            { name: '不可退税数据', id: '25020204', pid: '250202', path: '/25/2502/250202/25020204', component: './hts/saasMdt/wbsjgl/dlckhwzmgl/bktssj' },
          ] },
        ]
      },
      { name: '明细采集', id: '2503', pid: '25', icon: 'SecurityScanOutlined', path: '/25/2503', routes: [
        { path: '/25/2503', redirect: '/25/2503/250301/25030101' },
        { name: '生产企业出口货物及修理修配服务免抵退税申报明细表', id: '250301', pid: '2503', path: '/25/2503/250301', routes: [
          { path: '/25/2503/250301', redirect: '/25/2503/250301/25030101' },
          { path: '/25/2503/250301/25030101', id: '25030101', pid: '250301', name: '生产企业出口货物及修理修配服务免抵退税申报明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB' },
          { path: '/25/2503/250301/25030102', id: '25030102', pid: '250301', name: '海关商品编码、名称、退税率调整对应表', component: './hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_HGSPTZ_GCB'   },
          { path: '/25/2503/250301/25030103', id: '25030103', pid: '250301', name: '出口业务收汇情况表', component: './hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_CKSH_GCB', nav: 'MDT_CJSY#出口货物劳务免抵退税申报#iconTSMDT_CKHWSHSBB' },
          { path: '/25/2503/250301/25030104', id: '25030104', pid: '250301', name: '出口货物离岸价差异原因说明表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_CYSM_GCB', nav: 'MDT_CJSY#出口货物劳务免抵退税申报#iconTSMDT_LAJCYYYSMB' },
          { path: '/25/2503/250301/25030105', id: '25030105', pid: '250301', name: '视同自产进货明细清单', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_STZC_GCB', nav: 'MDT_CJSY#出口货物劳务免抵退税申报#iconTSMDT_STZCJHMXQD' },
          { path: '/25/2503/250301/25030106', id: '25030106', pid: '250301', name: '外贸企业出口退税进货明细申报表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSJH_GCB', nav: 'MDT_TSJH#出口货物劳务免抵退税申报#iconTSMDT_JHMXSBB'},
        ] },
        { name: '国际运输（港澳台运输）、航天运输免抵退税申报明细表', id: '250302', pid: '2503', path: '/25/2503/250302', routes: [
          { path: '/25/2503/250302', redirect: '/25/2503/250302/25030201' },
          { path: '/25/2503/250302/25030201', id: '25030201', pid: '250302', name: '国际运输（港澳台运输）、航天运输免抵退税申报明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_GJYS_GCB', nav: 'MDT_CJSY#增值税跨境运输应税行为免抵退税申报#iconTSMDT_YSFWGJYSSB' },
          { path: '/25/2503/250302/25030202', id: '25030202', pid: '250302', name: '航空国际运输收入清算账单申报明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_HKYS_QS_GCB', nav: 'MDT_CJSY#增值税跨境运输应税行为免抵退税申报#iconTSMDT_HKYSSRQSZD' },
          { path: '/25/2503/250302/25030203', id: '25030203', pid: '250302', name: '铁路国际客运（含广深港高铁）旅客、行李包裹运输清算函件明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_KYHJ_GCB', nav: 'MDT_CJSY#增值税跨境运输应税行为免抵退税申报#iconTSMDT_GJKYQSJ' },
          { path: '/25/2503/250302/25030204', id: '25030204', pid: '250302', name: '铁路国际货物运输明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TLHY_GCB', nav: 'MDT_CJSY#增值税跨境运输应税行为免抵退税申报#iconTSMDT_GTZGSGJHYMX' },
        ] },
        { name: '跨境销售服务及无形资产免抵退税申报明细表', id: '250303', pid: '2503', path: '/25/2503/250303', routes: [
          { path: '/25/2503/250303', redirect: '/25/2503/250303/25030301' },
          { path: '/25/2503/250303/25030301', id: '25030301', pid: '250303', name: '跨境销售服务及无形资产免抵退税申报明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_YFSJ_GCB', nav: 'MDT_CJSY#增值税跨境其他应税行为免抵退税申报#iconTSMDT_YSFWSBMXB' },
          { path: '/25/2503/250303/25030302', id: '25030302', pid: '250303', name: '跨境销售服务及无形资产收讫营业款明细清单', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_SYYK_GCB', nav: 'MDT_CJSY#增值税跨境其他应税行为免抵退税申报#iconTSMDT_YSFWSKQD' }
        ] },
      ] },
      { name: '确认汇总表', id: '2504', pid: '25', path: '/25/2504', icon: 'ContainerOutlined', component: './hts/dditax.ckts.from/mdts/sjsb/sjhz',},
      { name: '退税申报', id: '2505', pid: '25', path: '/25/2505', icon: 'CreditCardOutlined', component: './hts/ckts/scsbsj/scsbsj', ywKey: 'MDT', routes: [
        { path: '/25/2505', redirect: '/25/2505/SBMXCX_250501' },
        { path: '/25/2505/SBMXCX_250501', id: '250501', pid: '2505', name: '生产企业出口货物及修理修配服务免抵退税申报明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB', hideInMenu: true },
        { path: '/25/2505/SBMXCX_250502', id: '250502', pid: '2505', name: '海关商品编码、名称、退税率调整对应表', component: './hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_HGSPTZ_GCB', hideInMenu: true },
        { path: '/25/2505/SBMXCX_250503', id: '250503', pid: '2505', name: '出口业务收汇情况表', component: './hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_CKSH_GCB', hideInMenu: true },
        { path: '/25/2505/SBMXCX_250504', id: '250504', pid: '2505', name: '出口货物离岸价差异原因说明表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_CYSM_GCB', hideInMenu: true },
        { path: '/25/2505/SBMXCX_250505', id: '250505', pid: '2505', name: '视同自产进货明细清单', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_STZC_GCB', hideInMenu: true },
        { path: '/25/2505/SBMXCX_250514', id: '250514', pid: '2505', name: '外贸企业出口退税进货明细申报表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSJH_GCB', hideInMenu: true },
        // { path: '/25/2505/SBMXCX_250506', id: '250506', pid: '2505', name: '先退税后核销企业免抵退税申报附表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_XTHH_GCB', hideInMenu: true },
        { path: '/25/2505/SBMXCX_250507', id: '250507', pid: '2505', name: '国际运输（港澳台运输）、航天运输免抵退税申报明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_GJYS_GCB', hideInMenu: true },
        { path: '/25/2505/SBMXCX_250508', id: '250508', pid: '2505', name: '航空国际运输收入清算账单申报明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_HKYS_QS_GCB', hideInMenu: true },
        { path: '/25/2505/SBMXCX_250509', id: '250509', pid: '2505', name: '铁路国际客运（含广深港高铁）旅客、行李包裹运输清算函件明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_KYHJ_GCB', hideInMenu: true },
        { path: '/25/2505/SBMXCX_250510', id: '250510', pid: '2505', name: '铁路国际货物运输明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TLHY_GCB', hideInMenu: true },
        { path: '/25/2505/SBMXCX_250511', id: '250511', pid: '2505', name: '跨境销售服务及无形资产免抵退税申报明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_YFSJ_GCB', hideInMenu: true },
        { path: '/25/2505/SBMXCX_250512', id: '250512', pid: '2505', name: '跨境销售服务及无形资产收讫营业款明细清单', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_SYYK_GCB', hideInMenu: true },
        { path: '/25/2505/SBMXCX_250513', id: '250513', pid: '2505', name: '免抵退税申报汇总表', component: './hts/dditax.ckts.from/mdts/sjsb/sjhz/swfk', hideInMenu: true },
      ] },
      { name: '申报结果查询',  id: '2506', pid: '25',  path: '/25/2506', icon: 'ScheduleOutlined', component: './hts/ckts/sbsjcx/sbsjcx', ywKey: 'MDT', routes: [
        { path: '/25/2506', redirect: '/25/2506/SBMXCX_250601' },
        { path: '/25/2506/SBMXCX_250601', id: '250601', pid: '2506', name: '生产企业出口货物及修理修配服务免抵退税申报明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB', hideInMenu: true },
        { path: '/25/2506/SBMXCX_250602', id: '250602', pid: '2506', name: '海关商品编码、名称、退税率调整对应表', component: './hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_HGSPTZ_GCB', hideInMenu: true },
        { path: '/25/2506/SBMXCX_250603', id: '250603', pid: '2506', name: '出口业务收汇情况表', component: './hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_CKSH_GCB', hideInMenu: true },
        { path: '/25/2506/SBMXCX_250604', id: '250604', pid: '2506', name: '出口货物离岸价差异原因说明表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_CYSM_GCB', hideInMenu: true },
        { path: '/25/2506/SBMXCX_250605', id: '250605', pid: '2506', name: '视同自产进货明细清单', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_STZC_GCB', hideInMenu: true },
        // { path: '/25/2506/SBMXCX_250606', id: '250606', pid: '2506', name: '先退税后核销企业免抵退税申报附表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_XTHH_GCB', hideInMenu: true },
        { path: '/25/2506/SBMXCX_250607', id: '250607', pid: '2506', name: '国际运输（港澳台运输）、航天运输免抵退税申报明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_GJYS_GCB', hideInMenu: true },
        { path: '/25/2506/SBMXCX_250608', id: '250608', pid: '2506', name: '航空国际运输收入清算账单申报明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_HKYS_QS_GCB', hideInMenu: true },
        { path: '/25/2506/SBMXCX_250609', id: '250609', pid: '2506', name: '铁路国际客运（含广深港高铁）旅客、行李包裹运输清算函件明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_KYHJ_GCB', hideInMenu: true },
        { path: '/25/2506/SBMXCX_250610', id: '250610', pid: '2506', name: '铁路国际货物运输明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TLHY_GCB', hideInMenu: true },
        { path: '/25/2506/SBMXCX_250611', id: '250611', pid: '2506', name: '跨境销售服务及无形资产免抵退税申报明细表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_YFSJ_GCB', hideInMenu: true },
        { path: '/25/2506/SBMXCX_250612', id: '250612', pid: '2506', name: '跨境销售服务及无形资产收讫营业款明细清单', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_SYYK_GCB', hideInMenu: true },
        { path: '/25/2506/SBMXCX_250613', id: '250613', pid: '2506', name: '免抵退税申报汇总表', component: './hts/dditax.ckts.from/mdts/sjsb/sjhz/swfk', hideInMenu: true },
        { path: '/25/2506/SBMXCX_250614', id: '250614', pid: '2506', name: '外贸企业出口退税进货明细申报表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSJH_GCB', hideInMenu: true },
      ] }
    ]
  },
  // SaaS免退税
  {
    name: 'SaaS免退税', id: '26', icon: 'CoffeeOutlined', path: '/26', routes: [
    { path: '/26', redirect: '/26/2601' },
      { name: '首页', id: '2601', pid: '26', icon: 'UserOutlined', path: '/26/2601', component: './hts/saasMts/homePage' },
      { name: '退税计划', id: '2699', pid: '26', path: '/26/2699', icon: 'CreditCardOutlined', routes: [
        { path: '/26/2699', redirect: '/26/2699/269901' },
        { path: '/26/2699/269901', id: '269901', pid: '2699', name: '退税计划登记', component: './hts/saasMdt/tuiShuiJiHua'},
        { path: '/26/2699/269902', id: '269902', pid: '2699', name: '退税计划登记日志', component: './hts/saasMdt/tuiShuiJiHua/rz'},
      ] },
      {
        name: '外部数据管理', id: '2602', pid: '26', icon: 'HomeOutlined', path: '/26/2602', routes: [
          { name: '出口报关单管理', id: '260201', pid: '2602', icon: 'UserOutlined', path: '/26/2602/260201', routes: [
            { path: '/26/2602/260201', redirect: '/26/2602/260201/26020101' },
            { name: '待处理数据', id: '26020101', pid: '260201', path: '/26/2602/260201/26020101', component: './hts/saasMdt/wbsjgl/ckbgdgl/dclsj' },
            { name: '无信息数据', id: '26020102', pid: '260201', path: '/26/2602/260201/26020102', component: './hts/saasMdt/wbsjgl/ckbgdgl/wxxsj' },
            { name: '可使用数据', id: '26020103', pid: '260201', path: '/26/2602/260201/26020103', component: './hts/saasMdt/wbsjgl/ckbgdgl/ksysj' },
            { name: '已使用数据', id: '26020104', pid: '260201', path: '/26/2602/260201/26020104', component: './hts/saasMdt/wbsjgl/ckbgdgl/ysysj' },
            { name: '不退税数据', id: '26020105', pid: '260201', path: '/26/2602/260201/26020105', component: './hts/saasMdt/wbsjgl/ckbgdgl/btssj' },
          ] },
          { name: '代理出口货物证明管理', id: '260202', pid: '2602', icon: 'HomeOutlined', path: '/26/2602/260202', routes: [
            { path: '/26/2602/260202', redirect: '/26/2602/260202/26020201' },
            { name: '待处理数据', id: '26020201', pid: '260202', path: '/26/2602/260202/26020201', component: './hts/saasMdt/wbsjgl/dlckhwzmgl/dclsj' },
            { name: '可使用数据', id: '26020202', pid: '260202', path: '/26/2602/260202/26020202', component: './hts/saasMdt/wbsjgl/dlckhwzmgl/ksysj' },
            { name: '已使用数据', id: '26020203', pid: '260202', path: '/26/2602/260202/26020203', component: './hts/saasMdt/wbsjgl/dlckhwzmgl/ysysj' },
            { name: '不退税数据', id: '26020204', pid: '260202', path: '/26/2602/260202/26020204', component: './hts/saasMdt/wbsjgl/dlckhwzmgl/bktssj' },
          ] },
          { name: '进项发票管理', id: '260203', pid: '2602', icon: 'RadarChartOutlined', path: '/26/2602/260203', routes: [
            { path: '/26/2602/260203', redirect: '/26/2602/260203/26020301' },
            { name: '可使用数据', id: '26020301', pid: '260203', path: '/26/2602/260203/26020301', component: './hts/saasMts/jxfpsj/mtsksy' },
            { name: '已使用数据', id: '26020302', pid: '260203', path: '/26/2602/260203/26020302', component: './hts/saasMts/jxfpsj/mtsysy' },
            { name: '不退税数据', id: '26020303', pid: '260203', path: '/26/2602/260203/26020303', component: './hts/saasMts/jxfpsj/btssj' },
          ] },
          { name: '消费税票管理', id: '260205', pid: '2602', icon: 'SecurityScanOutlined', path: '/26/2602/260205', routes: [
            { path: '/26/2602/260205', redirect: '/26/2602/260205/26020501' },
            { name: '可使用数据', id: '26020501', pid: '260205', path: '/26/2602/260205/26020501', component: './hts/saasMts/xfsfp/ksysj' },
            { name: '已使用数据', id: '26020502', pid: '260205', path: '/26/2602/260205/26020502', component: './hts/saasMts/xfsfp/ysysj' },
          ] },
        ]
      },
      {
        name: '数据匹配', id: '2604', pid: '26', icon: 'HomeOutlined', path: '/26/2604', routes: [
          { path: '/26/2604', redirect: '/26/2604/260401' },
          { name: '报关单逐项配单', id: '260401', pid: '2604', path: '/26/2604/260401', component: './hts/commonModule/pd/mts/sjznpd/bgdzxpd', nav: 'MTS_JCSJGL#基础数据智能配单#iconZM_ZBZMTZS'},
          { name: '发票逐项配单', id: '260402', pid: '2604', path: '/26/2604/260402', component: './hts/commonModule/pd/mts/sjznpd/fpzxpd', nav: 'MTS_JCSJGL#基础数据智能配单#iconZM_ZBZMTZS' },
          { name: '智能配单', id: '260403', pid: '2604', path: '/26/2604/260403', component: './hts/commonModule/pd/mts/sjznpd/znpd', nav: 'MTS_JCSJGL#基础数据智能配单#iconZM_ZBZMTZS' },
          { name: '代理出口货物证明配单', id: '260404', pid: '2604', path: '/26/2604/260404', component: './hts/commonModule/pd/mts/sjznpd/dlzmznpd', nav: 'MTS_JCSJGL#基础数据智能配单#iconZM_ZBZMTZS' },
          { name: '台账配单', id: '260405', pid: '2604', icon: 'UserOutlined', path: '/26/2604/260405', routes: [
            { path: '/26/2604/260405', redirect: '/26/2604/260405/26040501' },
            { name: '台账配单明细', id: '26040501', pid: '260405', path: '/26/2604/260405/26040501', component: './hts/commonModule/pd/mts/sjznpd/tzpd/tzpdmx' },
            { name: '配单任务管理', id: '26040502', pid: '260405', path: '/26/2604/260405/26040502', component: './hts/commonModule/pd/mts/sjznpd/tzpd/pdrwqk' },

          ] },

          { name: '智能配单', id: '260406', pid: '2604', path: '/26/2604/260406',  routes: [
            { name: 'AI配单', id: '26040601', pid: '2604', path: '/26/2604/260406/26040601', component: './hts/ckts/Aipd',  },
            { name: '超级配单', id: '26040601', pid: '2604', path: '/26/2604/260406/26040602', component: './hts/ckts/Cjpd/pd',  },

          ]},

        ]
      },
      { name: '明细采集', id: '2603', pid: '26', icon: 'SecurityScanOutlined', path: '/26/2603', routes: [
        { path: '/26/2603', redirect: '/26/2603/260301/26030101' },
        { name: '外贸企业出口退税出口明细申报表', id: '260301', pid: '2603', path: '/26/2603/260301', routes: [
          { path: '/26/2603/260301', redirect: '/26/2603/260301/26030101' },
          { path: '/26/2603/260301/26030101', id: '26030101', pid: '260301', name: '外贸企业出口退税出口明细申报表', component: './hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_TSSB_GCB', nav: 'MTS_CJSY#出口货物劳务免退税申报#iconTSMTS_CKMXSQB' },
          { path: '/26/2603/260301/26030102', id: '26030102', pid: '260301', name: '外贸企业出口退税进货明细申报表', component: './hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_TSJH_GCB', nav: 'MTS_CJSY#出口货物劳务免退税申报#iconTSMTS_JHMXSBB'},
          { path: '/26/2603/260301/26030103', id: '26030103', pid: '260301', name: '海关商品编码、名称、退税率调整对应表', component: './hts/dditax.ckts.from/MTS_TSZL___ZXSB_SB_HGSPTZ_GCB', nav: 'MTS_CJSY#出口货物劳务免退税申报#iconTSMDT_SPDMTZDYB' },
          { path: '/26/2603/260301/26030104', id: '26030104', pid: '260301', name: '出口业务收汇情况表', component: './hts/dditax.ckts.from/MTS_TSZL___ZXSB_SB_CKSH_GCB', nav: 'MTS_CJSY#出口货物劳务免退税申报#iconTSMDT_CKHWSHSBB' },
        ] },
        { name: '外贸企业调整申报', id: '260302', pid: '2603', path: '/26/2603/260302', routes: [
          { path: '/26/2603/260302', redirect: '/26/2603/260302/26030201' },
          { path: '/26/2603/260302/26030201', id: '26030201', pid: '260302', name: '外贸企业调整申报', component: './hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_TZSB_GCB', nav: 'MTS_CJSY#外贸企业调整申报#iconTSMTS_WMQYTZSBB' },
        ] },
        { name: '跨境应税行为免退税申报明细表', id: '260303', pid: '2603', path: '/26/2603/260303', routes: [
          { path: '/26/2603/260303', redirect: '/26/2603/260303/26030301' },
          { path: '/26/2603/260303/26030301', id: '26030301', pid: '260303', name: '跨境应税行为免退税申报明细表', component: './hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_YSFWCK_GCB', nav: 'MTS_CJSY#外贸企业外购服务免退税申报#iconTSMTS_YSWWCKMXB' },
        ] },
      ] },
      { name: '退税申报', id: '2605', pid: '26', path: '/26/2605', icon: 'CreditCardOutlined', component: './hts/ckts/scsbsj/scsbsj', ywKey: 'MTS', routes: [
        { path: '/26/2605', redirect: '/26/2605/SBMXCX_260501' },
        { path: '/26/2605/SBMXCX_260501', id: '260501', pid: '2605', name: '外贸企业出口退税出口明细申报表', component: './hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_TSSB_GCB', hideInMenu: true },
        { path: '/26/2605/SBMXCX_260502', id: '260502', pid: '2605', name: '外贸企业出口退税进货明细申报表', component: './hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_TSJH_GCB', hideInMenu: true },
        { path: '/26/2605/SBMXCX_260503', id: '260503', pid: '2605', name: '海关商品编码、名称、退税率调整对应表', component: './hts/dditax.ckts.from/MTS_TSZL___ZXSB_SB_HGSPTZ_GCB', hideInMenu: true },
        { path: '/26/2605/SBMXCX_260504', id: '260504', pid: '2605', name: '出口业务收汇情况表', component: './hts/dditax.ckts.from/MTS_TSZL___ZXSB_SB_CKSH_GCB', hideInMenu: true },
        { path: '/26/2605/SBMXCX_260505', id: '260505', pid: '2605', name: '外贸企业调整申报', component: './hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_TZSB_GCB', hideInMenu: true },
        { path: '/26/2605/SBMXCX_260506', id: '260506', pid: '2605', name: '跨境应税行为免退税申报明细表', component: './hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_YSFWCK_GCB', hideInMenu: true },
      ] },
      { name: '申报结果查询',  id: '2606', pid: '26',  path: '/26/2606', icon: 'ScheduleOutlined', component: './hts/ckts/sbsjcx/sbsjcx', ywKey: 'MTS', routes: [
        { path: '/26/2606', redirect: '/26/2606/SBMXCX_260601' },
        { path: '/26/2606/SBMXCX_260601', id: '260601', pid: '2606', name: '外贸企业出口退税出口明细申报表', component: './hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_TSSB_GCB', hideInMenu: true },
        { path: '/26/2606/SBMXCX_260602', id: '260602', pid: '2606', name: '外贸企业出口退税进货明细申报表', component: './hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_TSJH_GCB', hideInMenu: true },
        { path: '/26/2606/SBMXCX_260603', id: '260603', pid: '2606', name: '海关商品编码、名称、退税率调整对应表', component: './hts/dditax.ckts.from/MTS_TSZL___ZXSB_SB_HGSPTZ_GCB', hideInMenu: true },
        { path: '/26/2606/SBMXCX_260604', id: '260604', pid: '2606', name: '出口业务收汇情况表', component: './hts/dditax.ckts.from/MTS_TSZL___ZXSB_SB_CKSH_GCB', hideInMenu: true },
        { path: '/26/2606/SBMXCX_260605', id: '260605', pid: '2606', name: '外贸企业调整申报', component: './hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_TZSB_GCB', hideInMenu: true },
        { path: '/26/2606/SBMXCX_260606', id: '260606', pid: '2606', name: '跨境应税行为免退税申报明细表', component: './hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_YSFWCK_GCB', hideInMenu: true },
      ] }
    ]
  },
  // SaaS代办退税
  {
    name: 'SaaS代办退税', id: '27', icon: 'CoffeeOutlined', path: '/27', routes: [
    { path: '/27', redirect: '/27/2701' },
      { name: '首页', id: '2701', pid: '27', icon: 'UserOutlined', path: '/27/2701', component: './hts/saasDbts/homePage' },
      {
        name: '外部数据管理', id: '2702', pid: '27', icon: 'HomeOutlined', path: '/27/2702', routes: [
          { name: '出口报关单管理', id: '270201', pid: '2702', icon: 'UserOutlined', path: '/27/2702/270201', routes: [
            { path: '/27/2702/270201', redirect: '/27/2702/270201/27020101' },
            { name: '待处理数据', id: '27020101', pid: '270201', path: '/27/2702/270201/27020101', component: './hts/saasMdt/wbsjgl/ckbgdgl/dclsj' },
            { name: '无信息数据', id: '27020102', pid: '270201', path: '/27/2702/270201/27020102', component: './hts/saasMdt/wbsjgl/ckbgdgl/wxxsj' },
            { name: '可使用数据', id: '27020103', pid: '270201', path: '/27/2702/270201/27020103', component: './hts/saasMdt/wbsjgl/ckbgdgl/ksysj' },
            { name: '已使用数据', id: '27020104', pid: '270201', path: '/27/2702/270201/27020104', component: './hts/saasMdt/wbsjgl/ckbgdgl/ysysj' },
            { name: '不退税数据', id: '27020105', pid: '270201', path: '/27/2702/270201/27020105', component: './hts/saasMdt/wbsjgl/ckbgdgl/btssj' },
          ] },
          { name: '进项发票管理', id: '270202', pid: '2702', icon: 'RadarChartOutlined', path: '/27/2702/270202', routes: [
            { path: '/27/2702/270202', redirect: '/27/2702/270202/27020201' },
            { name: '可使用数据', id: '27020201', pid: '270202', path: '/27/2702/270202/27020201', component: './hts/saasMts/jxfpsj/dbtsksy' },
            { name: '已使用数据', id: '27020202', pid: '270202', path: '/27/2702/270202/27020202', component: './hts/saasMts/jxfpsj/dbtsysy' },
            { name: '不退税数据', id: '27020203', pid: '270202', path: '/27/2702/270202/27020203', component: './hts/saasMts/jxfpsj/btssj' },
          ] },
        ]
      },
      {
        name: '数据匹配', id: '2704', pid: '27', icon: 'HomeOutlined', path: '/27/2704', routes: [
          { path: '/27/2704', redirect: '/27/2704/270401' },
          { name: '报关单逐项配单', id: '270401', pid: '2704', path: '/27/2704/270401', component: './hts/commonModule/pd/mts/sjznpd/bgdzxpd', nav: 'WZFDBTS_JCSJGL#基础数据智能配单#iconZM_ZBZMTZS'},
        ]
      },
      { name: '明细采集', id: '2703', pid: '27', icon: 'SecurityScanOutlined', path: '/27/2703', routes: [
        { path: '/27/2703', redirect: '/27/2703/270301/27030101' },
        { name: '外贸综合服务企业代办退税申报表', id: '270301', pid: '2703', path: '/27/2703/270301', routes: [
          { path: '/27/2703/270301', redirect: '/27/2703/270301/27030101' },
          { path: '/27/2703/270301/27030101', id: '27030101', pid: '270301', name: '外贸综合服务企业代办退税申报表', component: './hts/dditax.ckts.from/DBTS___ZXSB_SB_DB_TSSB_GCB', nav: 'MTS_WZFDBTS#外贸综合服务企业代办退税申报#iconBA_WZMDBTSQKBA' },
          { path: '/27/2703/270301/27030102', id: '27030102', pid: '270301', name: '海关商品编码、名称、退税率调整对应表', component: './hts/dditax.ckts.from/DBTS_TSZL___ZXSB_SB_HGSPTZ_GCB', nav: 'MTS_WZFDBTS#外贸综合服务企业代办退税申报#iconTSMDT_SPDMTZDYB' },
          { path: '/27/2703/270301/27030103', id: '27030103', pid: '270301', name: '出口业务收汇情况表', component: './hts/dditax.ckts.from/DBTS_TSZL___ZXSB_SB_CKSH_GCB', nav: 'MTS_WZFDBTS#外贸综合服务企业代办退税申报#iconTSMDT_CKHWSHSBB' }
        ] },
      ] },
      { name: '退税申报', id: '2705', pid: '27', path: '/27/2705', icon: 'CreditCardOutlined', component: './hts/ckts/scsbsj/scsbsj', ywKey: 'DBTS', routes: [
        { path: '/27/2705', redirect: '/27/2705/SBMXCX_270501' },
        { path: '/27/2705/SBMXCX_270501', id: '270501', pid: '2705', name: '外贸综合服务企业代办退税申报表', component: './hts/dditax.ckts.from/DBTS___ZXSB_SB_DB_TSSB_GCB', hideInMenu: true },
        { path: '/27/2705/SBMXCX_270502', id: '270502', pid: '2705', name: '海关商品编码、名称、退税率调整对应表', component: './hts/dditax.ckts.from/DBTS_TSZL___ZXSB_SB_HGSPTZ_GCB', hideInMenu: true },
        { path: '/27/2705/SBMXCX_270503', id: '270503', pid: '2705', name: '出口业务收汇情况表', component: './hts/dditax.ckts.from/DBTS_TSZL___ZXSB_SB_CKSH_GCB', hideInMenu: true },

      ] },
      { name: '申报结果查询',  id: '2706', pid: '27',  path: '/27/2706', icon: 'ScheduleOutlined', component: './hts/ckts/sbsjcx/sbsjcx', ywKey: 'DBTS', routes: [
        { path: '/27/2706', redirect: '/27/2706/SBMXCX_270601' },
        { path: '/27/2706/SBMXCX_270601', id: '270601', pid: '2706', name: '外贸综合服务企业代办退税申报表', component: './hts/dditax.ckts.from/DBTS___ZXSB_SB_DB_TSSB_GCB', hideInMenu: true },
        { path: '/27/2706/SBMXCX_270602', id: '270602', pid: '2706', name: '海关商品编码、名称、退税率调整对应表', component: './hts/dditax.ckts.from/DBTS_TSZL___ZXSB_SB_HGSPTZ_GCB', hideInMenu: true },
        { path: '/27/2706/SBMXCX_270603', id: '270603', pid: '2706', name: '出口业务收汇情况表', component: './hts/dditax.ckts.from/DBTS_TSZL___ZXSB_SB_CKSH_GCB', hideInMenu: true },
      ] },
    ]
  },
  //订单中心
   //订单中心
   { name: '订单中心', id: '40', icon: 'CoffeeOutlined', path: '/40', routes: [
    { path: '/40', redirect: '/40/4001' },
    {name: '客户档案管理', id: '4001', pid: '40', icon: 'HomeOutlined', path: '/40/4001', routes: [
      { path: '/40/4001', redirect: '/40/4001/400101' },
      { name: '准入客户', id: '400101', pid: '4001', path: '/40/4001/400101', component: './hts/ddzx/khdagl' },
      { name: '签约客户', id: '400102', pid: '4001', path: '/40/4001/400102', component: './hts/ddzx/khdagl' },
      { name: '黑名单客户', id: '400103', pid: '4001', path: '/40/4001/400103', component: './hts/ddzx/khdagl' },
      ]
    },
    {name: '订单中心管理', id: '4002', pid: '40', icon: 'HomeOutlined', path: '/40/4002', routes: [
      { name: '提取订单', id: '400202', pid: '4002', path: '/40/4002/400202', component: './hts/ddzx/ddzxgl/tqtq' },
      { name: '代办退税订单', id: '400201', pid: '4002', path: '/40/4002/400201', routes: [
        { name: '待开票', id: '40020101', pid: '400201', path: '/40/4002/400201/40020101', component: './hts/ddzx/ddzxgl/ddcx/dkp' },
        { name: '待退税', id: '40020102', pid: '400201', path: '/40/4002/400201/40020102', component: './hts/ddzx/ddzxgl/ddcx/dts' },
        { name: '待结算', id: '40020103', pid: '400201', path: '/40/4002/400201/40020103', component: './hts/ddzx/ddzxgl/ddcx/djs' },
        { name: '已完成', id: '40020104', pid: '400201', path: '/40/4002/400201/40020104', component: './hts/ddzx/ddzxgl/ddcx/ywc' },
        { name: '全部订单', id: '40020105', pid: '400201', path: '/40/4002/400201/40020105', component: './hts/ddzx/ddzxgl/ddcx/qb' },
      ]},
      { name: '代理出口订单', id: '400203', pid: '4002', path: '/40/4002/400203', routes: [
        { name: '待结算', id: '40020303', pid: '400203', path: '/40/4002/400203/40020303', component: './hts/ddzx/ddzxgl/ddcx/djs' },
        { name: '已完成', id: '40020304', pid: '400203', path: '/40/4002/400203/40020304', component: './hts/ddzx/ddzxgl/ddcx/ywc' },
        { name: '全部订单', id: '40020305', pid: '400203', path: '/40/4002/400203/40020305', component: './hts/ddzx/ddzxgl/ddcx/qb' },
      ]},
      { name: '自营出口订单', id: '400204', pid: '4002', path: '/40/4002/400204', routes: [
        { name: '待开票', id: '40020401', pid: '400204', path: '/40/4002/400204/40020401', component: './hts/ddzx/ddzxgl/ddcx/dkp' },
        { name: '待退税', id: '40020402', pid: '400204', path: '/40/4002/400204/40020402', component: './hts/ddzx/ddzxgl/ddcx/dts' },
        { name: '待结算', id: '40020403', pid: '400204', path: '/40/4002/400204/40020403', component: './hts/ddzx/ddzxgl/ddcx/djs' },
        { name: '已完成', id: '40020404', pid: '400204', path: '/40/4002/400204/40020404', component: './hts/ddzx/ddzxgl/ddcx/ywc' },
        { name: '全部订单', id: '40020405', pid: '400204', path: '/40/4002/400204/40020405', component: './hts/ddzx/ddzxgl/ddcx/qb' },
      ]},
      ]
    },
  ]
},
// 订单查询
{ name: '订单查询', id: '41', icon: 'CoffeeOutlined', path: '/41', routes: [
  { path: '/41', redirect: '/41/4101' },
  {name: '代办退税订单', id: '4101', pid: '41', icon: 'HomeOutlined', path: '/41/4101', component: './hts/ddzx/ddcx/dbts'},
  {name: '代理出口订单', id: '4102', pid: '41', icon: 'HomeOutlined', path: '/41/4102', component: './hts/ddzx/ddcx/dbts'},
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

export default [
  ...cktsMenu_cxtj,
  ...cktsMenu,
  ...routesHts,
  // 测试用
  { name: '慧退税', path: '/hts', icon: 'HomeOutlined', routes: [
    // 权限管理
    { name: '权限管理', id: '21', icon: 'DeploymentUnitOutlined', path: '/hts/qxgl', routes: [
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
    ] },
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
    // 进料加工
    { name: '进料加工核销', id: '11', icon: 'SendOutlined', path: '/hts/jljg', routes: [
      // { name: '数据下载管理', id: '1101', pid: '11', icon: 'FundOutlined', path: '/hts/jljg/sjxz', routes: [
      //   { name: '数据下载', id: '110101', pid: '1101', path: '/hts/jljg/sjxz/sjxz', component: './hts/jljg/sjxz/sjxz' },
      //   { name: '进度查询', id: '110102', pid: '1101', path: '/hts/jljg/sjxz/jdcx', component: './hts/jljg/sjxz/jdcx' },
      //   { name: '加贸海关数据查询', id: '110103', pid: '1101', path: '/hts/jljg/sjxz/hghxsjcx', routes: [
      //       { name: '加工贸易手册数据', id: '11010301', pid: '110103', path: '/hts/jljg/sjxz/hghxsjcx/scxxcx', component: './hts/jljg/sjxz/hghxsjcx/scxxcx' },
      //       { name: '加工贸易账册数据', id: '11010302', pid: '110103', path: '/hts/jljg/sjxz/hghxsjcx/zcxxcx', component: './hts/jljg/sjxz/hghxsjcx/zcxxcx' },
      //       { name: '保税核注清单数据', id: '11010303', pid: '110103', path: '/hts/jljg/sjxz/hghxsjcx/jckhzqdcx', component: './hts/jljg/sjxz/hghxsjcx/jckhzqdcx' },
      //       { name: '核销报关单数据', id: '11010304', pid: '110103', path: '/hts/jljg/sjxz/hghxsjcx/jckbgdcx', component: './hts/jljg/sjxz/hghxsjcx/jckbgdcx' },
      //     ] },
      //   { name: '加贸反馈数据查询', id: '110104', pid: '1101', path: '/hts/jljg/sjxz/jmfksjcx', icon: 'SnippetsOutlined', routes: [
      //     { name: '已核销手册数据', id: '11010401', pid: '110104', path: '/hts/jljg/sjxz/jmfksjcx/scxxcx', component: './hts/jljg/sjxz/jmfksjcx/scxxcx' },
      //     { name: '已核销账册数据', id: '11010402', pid: '110104', path: '/hts/jljg/sjxz/jmfksjcx/zcxxcx', component: './hts/jljg/sjxz/jmfksjcx/zcxxcx' },
      //     { name: '已核销报关单数据', id: '11010403', pid: '110104', path: '/hts/jljg/sjxz/jmfksjcx/jckbgdcx', component: './hts/jljg/sjxz/jmfksjcx/jckbgdcx' },
      //     { name: '免抵退出口明细数据', id: '11010404', pid: '110104', path: '/hts/jljg/sjxz/jmfksjcx/ckmxcx', component: './hts/jljg/sjxz/jmfksjcx/ckmxcx' },
      //   ] },
      // ] },
      { name: '智能分析', id: '1102', pid: '11', path: '/hts/jljg/znfx', icon: 'ProfileOutlined', component: './hts/jljg/znfx' },
      { name: '内部台账', id: '1103', pid: '11', path: '/hts/jljg/nbtzhd', icon: 'SaveOutlined', component: './hts/jljg/nbtzhd' },
      { name: '核销申报数据管理', id: '1104', pid: '11', path: '/hts/jljg/mxcj', icon: 'ShopOutlined', component: './hts/jljg/mxcj' },
      { name: '核销数据申报', id: '1105', pid: '11', path: '/hts/jljg/ckts/scsbsj/JLJG_MDTHX', icon: 'ScheduleOutlined', component: './hts/ckts/scsbsj/scsbsj', routes: [
        { name: '进料加工业务免抵退税核销表', id: '110501', pid: '1105', path: '/hts/jljg/ckts/scsbsj/JLJG_MDTHX/SBMXCX_JLJG_01', component: './hts/jljg/mxcj/mdthx', hideInMenu: true },
        { name: '已核销手（账）册海关数据调整表', id: '110502', pid: '1105', path: '/hts/jljg/ckts/scsbsj/JLJG_MDTHX/SBMXCX_JLJG_02', component: './hts/jljg/mxcj/yhxtz', hideInMenu: true },
      ] },
      { name: '申报进度查询', id: '1106', pid: '11', path: '/hts/jljg/ckts/sbsjcx/JLJG_MDTHX', icon: 'CreditCardOutlined', component: './hts/ckts/sbsjcx/sbsjcx' },
      { name: '核销数据查询', id: '1107', pid: '11', path: '/hts/jljg/sbjgcx', icon: 'GroupOutlined', component: './hts/jljg/sbjgcx' },
      { name: '核销数据查询', id: '1108', pid: '11', path: '/hts/jljg/sbjgcxHmdthxF', icon: 'GroupOutlined', component: './hts/jljg/sbjgcx', parentKeys: ['/hts/jljg/sbjgcx'], hideInMenu: true },
      { name: '核销数据查询', id: '1109', pid: '11', path: '/hts/jljg/sbjgcxHmdthxJ', icon: 'GroupOutlined', component: './hts/jljg/sbjgcx', parentKeys: ['/hts/jljg/sbjgcx'], hideInMenu: true },
      { name: '核销数据查询', id: '1110', pid: '11', path: '/hts/jljg/sbjgcxHyhxtzJ', icon: 'GroupOutlined', component: './hts/jljg/sbjgcx', parentKeys: ['/hts/jljg/sbjgcx'], hideInMenu: true },
      { name: '核销数据查询', id: '1111', pid: '11', path: '/hts/jljg/sbjgcxHyhxtzF', icon: 'GroupOutlined', component: './hts/jljg/sbjgcx', parentKeys: ['/hts/jljg/sbjgcx'], hideInMenu: true },
    ]
    },
    // AntD其他业务
    { path: '/hts/qt/08', id: '08', name: 'AntD其他业务', icon: 'RadarChartOutlined', routes: [
      // { path: '/hts/qt/08/0801/080101', id: '080101', pid: '08', name: '一类出口企业评定申请', component: './hts/template/template_step2', nav: 'QT_QTLYW_SK#出口企业分类管理#iconQT_YLCKQYPDSQ', routes: [
      //   { path: '/hts/qt/08/0801/080101', redirect: '/qt/08/0801/080101/08010101/0801010101', id: '08010100', pid: '080101' },
      //   { path: '/hts/qt/08/0801/080101/08010101', id: '08010101', pid: '080101', name: '明细数据采集', component: './hts/template/template_tab2', hideInMenu: true, routes: [
      //     { path: '/hts/qt/08/0801/080101/08010101/0801010101', id: '0801010101', pid: '08010101', name: '出口退（免）税企业内部风险控制体系建设情况报告', component: './hts/dditax.ckts.from/QTYW___ZXSB_QT_QYNBFKTXJS_GCB' },
      //     { path: '/hts/qt/08/0801/080101/08010101/0801010102', id: '0801010102', pid: '08010101', name: '生产型出口企业生产能力情况报告（生产）', component: './hts/dditax.ckts.from/QTYW___ZXSB_QT_SCXQYSCNLQK_GCB' }
      //   ] },
      //   { path: '/hts/qt/08/0801/080101/08010102', id: '08010102', pid: '080101', name: '数据申报（生产）', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'QTYW_SCYLQYPD', routes: [
      //     { path: '/hts/qt/08/0801/080101/08010102/SBMXCX_0801010201', id: '0801010201', pid: '08010102', name: '出口退（免）税企业内部风险控制体系建设情况报告', component: './hts/dditax.ckts.from/QTYW___ZXSB_QT_QYNBFKTXJS_GCB', hideInMenu: true },
      //     { path: '/hts/qt/08/0801/080101/08010102/SBMXCX_0801010202', id: '0801010202', pid: '08010102', name: '生产型出口企业生产能力情况报告（生产）', component: './hts/dditax.ckts.from/QTYW___ZXSB_QT_SCXQYSCNLQK_GCB', hideInMenu: true },
      //   ] },
      //   { path: '/hts/qt/08/0801/080101/08010103', id: '08010103', pid: '080101', name: '数据申报（外贸）', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'QTYW_WMYLQYPD', routes: [
      //     { path: '/hts/qt/08/0801/080101/08010103/SBMXCX_0801010301', id: '0801010301', pid: '08010103', name: '出口退（免）税企业内部风险控制体系建设情况报告', component: './hts/dditax.ckts.from/QTYW___ZXSB_QT_QYNBFKTXJS_GCB', hideInMenu: true },
      //   ] },
      //   { path: '/hts/qt/08/0801/080101/08010104', id: '08010104', pid: '080101', name: '申报结果查询（生产）', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'QTYW_SCYLQYPD' },
      //   { path: '/hts/qt/08/0801/080101/08010105', id: '08010105', pid: '080101', name: '申报结果查询（外贸）', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'QTYW_WMYLQYPD' },
      // ] },
      { path: '/hts/qt/08/0801/080102', id: '080102', pid: '08', name: '出口企业分类管理复评', component: './hts/template/template_step2', nav: 'QT_QTLYW_SK#出口企业分类管理#iconQT_FLGLFPSQ', routes: [
        { path: '/hts/qt/08/0801/080102/08010201', id: '08010201', pid: '080102', name: '明细数据采集', component: './hts/dditax.ckts.from/QTYW___ZXSB_QT_QYGLLBFPPD_GCB', hideInMenu: true },
        { path: '/hts/qt/08/0801/080102/08010202', id: '08010202', pid: '080102', name: '数据申报', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'QTYW_FLGLFP', routes: [
          { path: '/hts/qt/08/0801/080102/08010202/SBMXCX_0801020201', id: '0801020201', pid: '08010202', name: '出口企业分类管理复评申请表', component: './hts/dditax.ckts.from/QTYW___ZXSB_QT_QYGLLBFPPD_GCB', hideInMenu: true },
        ] },
        { path: '/hts/qt/08/0801/080102/08010203', id: '08010203', pid: '080102', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'QTYW_FLGLFP' }
      ] },
      // { path: '/hts/qt/08/0802', id: '0802', pid: '08', name: '进货凭证信息回退', component: './hts/template/template_step2', icon: 'CreditCardOutlined', nav: 'QT_QTLYW_SK#其他业务管理#iconQT_JHPZXXHTSQ', routes: [
      //   { path: '/hts/qt/08/0802', redirect: '/qt/08/0802/080201', id: '080200', pid: '0802' },
      //   { path: '/hts/qt/08/0802/080201', id: '080201', pid: '0802', name: '明细数据采集', component: './hts/dditax.ckts.from/QTYW___ZXSB_QT_KSPZWGQWBTSHT_GCB', hideInMenu: true },
      //   { path: '/hts/qt/08/0802/080202', id: '080202', pid: '0802', name: '数据申报', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'QTYW_JHPZXXHT', routes: [
      //     { path: '/hts/qt/08/0802/080202/SBMXCX_08020201', id: '08020201', pid: '080202', name: '进货凭证信息回退', component: './hts/dditax.ckts.from/QTYW___ZXSB_QT_KSPZWGQWBTSHT_GCB', hideInMenu: true },
      //   ] },
      //   { path: '/hts/qt/08/0802/080203', id: '080203', pid: '0802', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'QTYW_JHPZXXHT' }
      // ] },
      // { path: '/hts/qt/08/0803', id: '0803', pid: '08', name: '出口信息查询', component: './hts/template/template_step2', icon: 'AreaChartOutlined', nav: 'QT_QTLYW_SK#其他业务管理#iconQT_CKTMSXXCX', routes: [
      //   { path: '/hts/qt/08/0803', redirect: '/qt/08/0803/080301', id: '080300', pid: '0803' },
      //   { path: '/hts/qt/08/0803/080301', id: '080301', pid: '0803', name: '明细数据采集', component: './hts/dditax.ckts.from/QTYW___ZXSB_SB_CKXXCX_GCB', hideInMenu: true },
      //   { path: '/hts/qt/08/0803/080302', id: '080302', pid: '0803', name: '数据申报', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'QTYW_CKXXCX', routes: [
      //       { path: '/hts/qt/08/0803/080302/SBMXCX_08030201', id: '08030201', pid: '080302', name: '出口信息查询', component: './hts/dditax.ckts.from/QTYW___ZXSB_SB_CKXXCX_GCB', hideInMenu: true },
      //     ] },
      //   { path: '/hts/qt/08/0803/080303', id: '080303', pid: '0803', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'QTYW_CKXXCX' }
      // ] },
      // { path: '/hts/qt/08/0804', id: '0804', pid: '08', name: '企业撤回退（免）税申报（生产）', component: './hts/template/template_step2', icon: 'SendOutlined', nav: 'QT_QTLYW_SK#其他业务管理#iconQT_QYCHSBSJ', routes: [
      //   { path: '/hts/qt/08/0804', redirect: '/qt/08/0804/080401', id: '080400', pid: '0804' },
      //   { path: '/hts/qt/08/0804/080401', id: '080401', pid: '0804', name: '明细数据采集', component: './hts/dditax.ckts.from/QTYW_SC___ZXSB_SB_QYCHSBSJ_GCB', hideInMenu: true },
      //   { path: '/hts/qt/08/0804/080402', id: '080402', pid: '0804', name: '数据申报', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'QTYW_QYCHSB', routes: [
      //     { path: '/hts/qt/08/0804/080402/SBMXCX_08040201', id: '08040201', pid: '080402', name: '企业撤回退（免）税申报申请表（生产）', component: './hts/dditax.ckts.from/QTYW_SC___ZXSB_SB_QYCHSBSJ_GCB', hideInMenu: true },
      //   ] },
      //   { path: '/hts/qt/08/0804/080403', id: '080403', pid: '0804', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'QTYW_QYCHSB' }
      // ] },
      // { path: '/hts/qt/08/0805', id: '0805', pid: '08', name: '企业撤回退（免）税申报（外贸）', component: './hts/template/template_step2', icon: 'SendOutlined', nav: 'QT_QTLYW_SK#其他业务管理#iconQT_QYCHSBSJ', routes: [
      //   { path: '/hts/qt/08/0805', redirect: '/qt/08/0805/080501', id: '080500', pid: '0805' },
      //   { path: '/hts/qt/08/0805/080501', id: '080501', pid: '0805', name: '明细数据采集', component: './hts/dditax.ckts.from/QTYW_WM___ZXSB_SB_QYCHSBSJ_GCB', hideInMenu: true },
      //   { path: '/hts/qt/08/0805/080502', id: '080502', pid: '0805', name: '数据申报', component: './hts/ckts/scsbsj/scsbsj', hideInMenu: true, ywKey: 'QTYW_QYCHSB', routes: [
      //       { path: '/hts/qt/08/0805/080502/SBMXCX_08050201', id: '08050201', pid: '080502', name: '企业撤回退（免）税申报申请表（外贸）', component: './hts/dditax.ckts.from/QTYW_WM___ZXSB_SB_QYCHSBSJ_GCB', hideInMenu: true },
      //     ] },
      //   { path: '/hts/qt/08/0805/080503', id: '080503', pid: '0805', name: '申报结果查询', component: './hts/ckts/sbsjcx/sbsjcx', hideInMenu: true, ywKey: 'QTYW_QYCHSB' }],
      // } 
    ] },
  ] }
];