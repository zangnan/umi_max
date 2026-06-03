const menu: any = [
  {
    type: 'title1', key: 'tssbbd', name: '退税申报表单', path: '/hts/dditax.ckts.from', routes: [
      // {
      //   name: '退税流程',
      //   icon: 'RadarChartOutlined',
      //   path: '/hts/dditax.ckts.from/tslc',
      //   // component: './hts/dditax.ckts.from',
      //   key: 'hts_tssbbd_tslc',
      //   routes: [
      //     { name: '退税申报', path: '/hts/dditax.ckts.from/tslc/tssb', key: 'hts_tssbbd_tslc_tssb', component: './hts/ckts/scsbsj/scsbsj' },
      //     { name: '申报结果查询', path: '/hts/dditax.ckts.from/tslc/sbjgcx', key: 'hts_tssbbd_tslc_sbjgcx', component: './hts/ckts/sbsjcx/sbsjcx' },
      //     { name: '退税向导', path: '/hts/dditax.ckts.from/tslc/tsxd', key: 'hts_tssbbd_tslc_tsxd', component: './hts/template/template_step3.tsx' },
      //   ]
      // },
      {
        name: '外贸',
        icon: 'LayoutOutlined',
        path: '/hts/dditax.ckts.from/wm',
        // component: './hts/dditax.ckts.from',
        routes: [
          {
            name: '退税申报', path: '/hts/dditax.ckts.from/wm/ts', key: 'hts_tssbbd_wm_MTS', routes: [
              { name: '外贸企业出口退税出口明细申报表', path: '/hts/dditax.ckts.from/wm/ts/MTS___ZXSB_SB_MTS_TSSB_GCB', key: 'hts_tssbbd_wm_MTS___ZXSB_SB_MTS_TSSB_GCB', component: './hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_TSSB_GCB', },
              { name: '外贸企业出口退税进货明细申报表', path: '/hts/dditax.ckts.from/wm/ts/MTS___ZXSB_SB_MTS_TSJH_GCB', key: 'hts_tssbbd_wm_MTS___ZXSB_SB_MTS_TSJH_GCB', component: './hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_TSJH_GCB', },
              { name: '海关出口商品代码、名称、退税率调整对应表', path: '/hts/dditax.ckts.from/wm/ts/MTS_TSZL___ZXSB_SB_HGSPTZ_GCB', key: 'hts_tssbbd_wm_MTS_TSZL___ZXSB_SB_HGSPTZ_GCB', component: './hts/dditax.ckts.from/MTS_TSZL___ZXSB_SB_HGSPTZ_GCB', },
              { name: '出口货物收汇申报', path: '/hts/dditax.ckts.from/wm/ts/MTS_TSZL___ZXSB_SB_CKSH_GCB', key: 'hts_tssbbd_wm_MTS_TSZL___ZXSB_SB_CKSH_GCB', component: './hts/dditax.ckts.from/MTS_TSZL___ZXSB_SB_CKSH_GCB', },
              { name: '外贸企业调整申报', path: '/hts/dditax.ckts.from/wm/ts/MTS___ZXSB_SB_MTS_TZSB_GCB', key: 'hts_tssbbd_wm_MTS___ZXSB_SB_MTS_TZSB_GCB', component: './hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_TZSB_GCB', },
              { name: '外贸综合服务企业代办退税申报表', path: '/hts/dditax.ckts.from/wm/ts/DBTS___ZXSB_SB_DB_TSSB_GCB', key: 'hts_tssbbd_wm_DBTS___ZXSB_SB_DB_TSSB_GCB', component: './hts/dditax.ckts.from/DBTS___ZXSB_SB_DB_TSSB_GCB', },
              { name: '海关出口商品代码、名称、退税率调整对应表', path: '/hts/dditax.ckts.from/wm/ts/DBTS_TSZL___ZXSB_SB_HGSPTZ_GCB', key: 'hts_tssbbd_wm_DBTS_TSZL___ZXSB_SB_HGSPTZ_GCB', component: './hts/dditax.ckts.from/DBTS_TSZL___ZXSB_SB_HGSPTZ_GCB', },
              { name: '货物劳务及服务退税申报', path: '/hts/dditax.ckts.from/wm/ts/MTS___ZXSB_SB_MTS_YSFWCK_GCB', key: 'hts_tssbbd_wm_MTS___ZXSB_SB_MTS_YSFWCK_GCB', component: './hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_YSFWCK_GCB', },
              { name: '跨境应税行为免退税申报明细表', path: '/hts/dditax.ckts.from/wm/ts/ZBYW___ZXSB_SB_GJ_SBMX_GCB', key: 'hts_tssbbd_wm_ZBYW___ZXSB_SB_GJ_SBMX_GCB', component: './hts/dditax.ckts.from/ZBYW___ZXSB_SB_GJ_SBMX_GCB', },
            ]
          },
          {
            name: '证明申报', path: '/hts/dditax.ckts.from/wm/zm', key: 'hts_tssbbd_wm_ZMKJ', routes: [
              { name: '关于补办出口退税有关证明的申请', path: '/hts/dditax.ckts.from/wm/zm/ZMKJ_WM___ZXSB_ZM_BBCKTSZM_GCB', key: 'hts_tssbbd_wm_ZMKJ_WM___ZXSB_ZM_BBCKTSZM_GCB', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_BBCKTSZM_GCB', },
              { name: '来料加工免税证明申请表', path: '/hts/dditax.ckts.from/wm/zm/ZMKJ_WM___ZXSB_ZM_LLJG_GCB', key: 'hts_tssbbd_wm_ZMKJ_WM___ZXSB_ZM_LLJG_GCB', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_LLJG_GCB', },
              { name: '来料加工出口货物免税证明核销申请表', path: '/hts/dditax.ckts.from/wm/zm/ZMKJ_WM___ZXSB_ZM_LLJGHX_GCB', key: 'hts_tssbbd_wm_ZMKJ_WM___ZXSB_ZM_LLJGHX_GCB', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_LLJGHX_GCB', },
              { name: '代理出口货物证明申请表', path: '/hts/dditax.ckts.from/wm/zm/ZMKJ_WM___ZXSB_ZM_DLCK_GCB', key: 'hts_tssbbd_wm_ZMKJ_WM___ZXSB_ZM_DLCK_GCB', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_DLCK_GCB', },
              { name: '代理进口货物证明申请表', path: '/hts/dditax.ckts.from/wm/zm/ZMKJ_WM___ZXSB_ZM_DLJK_GCB', key: 'hts_tssbbd_wm_ZMKJ_WM___ZXSB_ZM_DLJK_GCB', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_DLJK_GCB', },
              { name: '委托出口货物证明', path: '/hts/dditax.ckts.from/wm/zm/ZMKJ_WM___ZXSB_ZM_WTCK_GCB', key: 'hts_tssbbd_wm_ZMKJ_WM___ZXSB_ZM_WTCK_GCB', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_WTCK_GCB', },
              { name: '出口货物转内销证明申报表', path: '/hts/dditax.ckts.from/wm/zm/ZMKJ___ZXSB_ZM_CKHWZNX_GCB', key: 'hts_tssbbd_wm_ZMKJ___ZXSB_ZM_CKHWZNX_GCB', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_CKHWZNX_GCB', },
              { name: '出口货物已补税/未退税证明', path: '/hts/dditax.ckts.from/wm/zm/ZMKJ_WM___ZXSB_ZM_TYYBSWTS_GCB', key: 'hts_tssbbd_wm_ZMKJ_WM___ZXSB_ZM_TYYBSWTS_GCB', component: './hts/dditax.ckts.from/ZMKJ_WM___ZXSB_ZM_TYYBSWTS_GCB', },
            ]
          },
          {
            name: '资格备案', path: '/hts/dditax.ckts.from/wm/zg', key: 'hts_tssbbd_wm_ZGBA', routes: [
              { name: '出口退（免）税备案管理', path: '/hts/dditax.ckts.from/wm/zg/ZGBA_WM___ZXSB_BA_BABG_GCB', key: 'hts_tssbbd_wm_ZGBA_WM___ZXSB_BA_BABG_GCB', component: './hts/dditax.ckts.from/ZGBA___ZXSB_BA_BABG_GCB', },
              { name: '以边境小额贸易方式代理外国企业、外国自然人报关出口货物备案表', path: '/hts/dditax.ckts.from/wm/zg/ZGBA_WM___ZXSB_BA_BMDLCKBA_GCB', key: 'hts_tssbbd_wm_ZGBA_WM___ZXSB_BA_BMDLCKBA_GCB', component: './hts/dditax.ckts.from/ZGBA___ZXSB_BA_BMDLCKBA_GCB', },
            ]
          },
          {
            name: '其他业务', path: '/hts/dditax.ckts.from/wm/qt', key: 'hts_tssbbd_wm_QTYW', routes: [
              { name: '企业撤回退（免）税申报申请表', path: '/hts/dditax.ckts.from/wm/qt/QTYW_WM___ZXSB_SB_QYCHSBSJ_GCB', key: 'hts_tssbbd_wm_QTYW_WM___ZXSB_SB_QYCHSBSJ_GCB', component: './hts/dditax.ckts.from/QTYW_WM___ZXSB_SB_QYCHSBSJ_GCB', },
              { name: '一类出口企业评定申请', path: '/hts/dditax.ckts.from/wm/qt/QTYW_WM___ZXSB_QT_QYNBFKTXJS_GCB', key: 'hts_tssbbd_wm_QTYW_WM___ZXSB_QT_QYNBFKTXJS_GCB', component: './hts/dditax.ckts.from/QTYW___ZXSB_QT_QYNBFKTXJS_GCB', },
              { name: '出口企业分类管理复评申请表', path: '/hts/dditax.ckts.from/wm/qt/QTYW_WM___ZXSB_QT_QYGLLBFPPD_GCB', key: 'hts_tssbbd_wm_QTYW_WM___ZXSB_QT_QYGLLBFPPD_GCB', component: './hts/dditax.ckts.from/QTYW___ZXSB_QT_QYGLLBFPPD_GCB', },
              { name: '进货凭证信息回退', path: '/hts/dditax.ckts.from/wm/qt/QTYW_WM___ZXSB_QT_KSPZWGQWBTSHT_GCB', key: 'hts_tssbbd_wm_QTYW_WM___ZXSB_QT_KSPZWGQWBTSHT_GCB', component: './hts/dditax.ckts.from/QTYW___ZXSB_QT_KSPZWGQWBTSHT_GCB', },
              { name: '出口信息查询', path: '/hts/dditax.ckts.from/wm/qt/QTYW_WM___ZXSB_SB_CKXXCX_GCB', key: 'hts_tssbbd_wm_QTYW_WM___ZXSB_SB_CKXXCX_GCB', component: './hts/dditax.ckts.from/QTYW___ZXSB_SB_CKXXCX_GCB', },
            ]
          },
        ],
      },
      {
        name: '生产',
        icon: 'RadarChartOutlined',
        path: '/hts/dditax.ckts.from',
        // component: './hts/dditax.ckts.from',
        key: 'hts_tssbbd_sc',
        routes: [
          {
            name: '退税申报', path: '/hts/dditax.ckts.from/sc/ts', key: 'hts_tssbbd_sc_ts', routes: [
              { name: '生产企业出口货物劳务免抵退税申报明细表', path: '/hts/dditax.ckts.from/sc/ts/MDT___ZXSB_SB_MDT_TSSB_GCB', key: 'hts_tssbbd_MDT___ZXSB_SB_MDT_TSSB_GCB', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB', },
              { name: '海关出口商品代码、名称、退税率调整对应表', path: '/hts/dditax.ckts.from/sc/ts/MDT_TSZL___ZXSB_SB_HGSPTZ_GCB', key: 'hts_tssbbd_MDT_TSZL___ZXSB_SB_HGSPTZ_GCB', component: './hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_HGSPTZ_GCB', },
              { name: '出口货物收汇情况表', path: '/hts/dditax.ckts.from/sc/ts/MDT_TSZL___ZXSB_SB_CKSH_GCB', key: 'hts_tssbbd_MDT_TSZL___ZXSB_SB_CKSH_GCB', component: './hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_CKSH_GCB', },
              { name: '出口货物离岸价差异原因说明表', path: '/hts/dditax.ckts.from/sc/ts/MDT___ZXSB_SB_MDT_CYSM_GCB', key: 'hts_tssbbd_MDT___ZXSB_SB_MDT_CYSM_GCB', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_CYSM_GCB', },
              { name: '视同自产进货明细清单', path: '/hts/dditax.ckts.from/sc/ts/MDT___ZXSB_SB_MDT_STZC_GCB', key: 'hts_tssbbd_MDT___ZXSB_SB_MDT_STZC_GCB', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_STZC_GCB', },
              { name: '确认汇总表', path: '/hts/dditax.ckts.from/sc/ts/MDT___QRHZB', key: 'hts_tssbbd_MDT___QRHZB', component: './hts/dditax.ckts.from/mdts/sjsb/sjhz', },
              { name: '货物冲减', path: '/hts/dditax.ckts.from/sc/ts/MDT___ZXSB_SB_MDT_TSSB_JGB_HWCJ', key: 'hts_tssbbd_MDT___ZXSB_SB_MDT_TSSB_JGB_HWCJ', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_JGB_HWCJ', },
              { name: '国际运输（港澳台运输）免抵退税申报明细表', path: '/hts/dditax.ckts.from/sc/ts/MDT___ZXSB_SB_MDT_GJYS_GCB', key: 'hts_tssbbd_MDT___ZXSB_SB_MDT_GJYS_GCB', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_GJYS_GCB', },
              { name: '航空国际运输收入清算账单申报明细表', path: '/hts/dditax.ckts.from/sc/ts/MDT___ZXSB_SB_MDT_HKYS_QS_GCB', key: 'hts_tssbbd_MDT___ZXSB_SB_MDT_HKYS_QS_GCB', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_HKYS_QS_GCB', },
              { name: '国际客运（含香港直通车）旅客、行李包裹运输清算函件明细表', path: '/hts/dditax.ckts.from/sc/ts/MDT___ZXSB_SB_MDT_KYHJ_GCB', key: 'hts_tssbbd_MDT___ZXSB_SB_MDT_KYHJ_GCB', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_KYHJ_GCB', },
              { name: '中国铁路总公司国际货物运输明细表', path: '/hts/dditax.ckts.from/sc/ts/MDT___ZXSB_SB_MDT_TLHY_GCB', key: 'hts_tssbbd_MDT___ZXSB_SB_MDT_TLHY_GCB', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TLHY_GCB', },
              { name: '增值税跨境其他应税行为免抵退税申报', path: '/hts/dditax.ckts.from/sc/ts/MDT___ZXSB_SB_MDT_YFSJ_GCB', key: 'hts_tssbbd_MDT___ZXSB_SB_MDT_YFSJ_GCB', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_YFSJ_GCB', },
              { name: '跨境应税行为免抵退税申报明细表', path: '/hts/dditax.ckts.from/sc/ts/MDT___ZXSB_SB_MDT_SYYK_GCB', key: 'hts_tssbbd_MDT___ZXSB_SB_MDT_SYYK_GCB', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_SYYK_GCB', },
            ]
          },
          {
            name: '证明申报', path: '/hts/dditax.ckts.from/sc/zm', key: 'hts_tssbbd_sc_zm', routes: [
              { name: '代理出口货物证明申请表', path: '/hts/dditax.ckts.from/sc/zm/ZMKJ___ZXSB_ZM_DLCK_GCB', key: 'hts_tssbbd_ZMKJ___ZXSB_ZM_DLCK_GCB', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_DLCK_GCB', },
              { name: '出口货物已补税/未退税证明', path: '/hts/dditax.ckts.from/sc/zm/ZMKJ_SC___ZXSB_ZM_TYYBSWTS_GCB', key: 'hts_tssbbd_ZMKJ_SC___ZXSB_ZM_TYYBSWTS_GCB', component: './hts/dditax.ckts.from/ZMKJ_SC___ZXSB_ZM_TYYBSWTS_GCB', },
              { name: '来料加工免税证明申请表', path: '/hts/dditax.ckts.from/sc/zm/ZMKJ_SC___ZXSB_ZM_LLJG_GCB', key: 'hts_tssbbd_ZMKJ_SC___ZXSB_ZM_LLJG_GCB', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_LLJG_GCB', },
              { name: '来料加工出口货物免税证明核销申请表', path: '/hts/dditax.ckts.from/sc/zm/ZMKJ_SC___ZXSB_ZM_LLJGHX_GCB', key: 'hts_tssbbd_ZMKJ_SC___ZXSB_ZM_LLJGHX_GCB', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_LLJGHX_GCB', },
              { name: '代理出口货物证明申请表', path: '/hts/dditax.ckts.from/sc/zm/ZMKJ_SC___ZXSB_ZM_DLCK_GCB', key: 'hts_tssbbd_ZMKJ_SC___ZXSB_ZM_DLCK_GCB', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_DLCK_GCB', },
              { name: '代理进口货物证明申请表', path: '/hts/dditax.ckts.from/sc/zm/ZMKJ_SC___ZXSB_ZM_DLJK_GCB', key: 'hts_tssbbd_ZMKJ_SC___ZXSB_ZM_DLJK_GCB', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_DLJK_GCB', },
              { name: '委托出口货物证明', path: '/hts/dditax.ckts.from/sc/zm/ZMKJ_SC___ZXSB_ZM_WTCK_GCB', key: 'hts_tssbbd_ZMKJ_SC___ZXSB_ZM_WTCK_GCB', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_WTCK_GCB', },
              { name: '关于补办出口退税有关证明的申请', path: '/hts/dditax.ckts.from/sc/zm/ZMKJ_SC___ZXSB_ZM_BBCKTSZM_GCB', key: 'hts_tssbbd_ZMKJ_SC___ZXSB_ZM_BBCKTSZM_GCB', component: './hts/dditax.ckts.from/ZMKJ___ZXSB_ZM_BBCKTSZM_GCB', },
            ]
          },
          {
            name: '资格备案', path: '/hts/dditax.ckts.from/sc/zg', key: 'hts_tssbbd_sc_ZGBA', routes: [
              { name: '出口退（免）税备案管理', path: '/hts/dditax.ckts.from/sc/zg/ZGBA_SC___ZXSB_BA_BABG_GCB', key: 'hts_tssbbd_sc_ZGBA_SC___ZXSB_BA_BABG_GCB', component: './hts/dditax.ckts.from/ZGBA___ZXSB_BA_BABG_GCB', },
              { name: '以边境小额贸易方式代理外国企业、外国自然人报关出口货物备案表', path: '/hts/dditax.ckts.from/sc/zg/ZGBA_SC___ZXSB_BA_BMDLCKBA_GCB', key: 'hts_tssbbd_sc_ZGBA_SC___ZXSB_BA_BMDLCKBA_GCB', component: './hts/dditax.ckts.from/ZGBA___ZXSB_BA_BMDLCKBA_GCB', },
            ]
          },
          {
            name: '其他业务', path: '/hts/dditax.ckts.from/sc/qt', key: 'hts_tssbbd_sc_qt', routes: [
              { name: '企业撤回退（免）税申报申请表', path: '/hts/dditax.ckts.from/sc/qt/QTYW_SC___ZXSB_SB_QYCHSBSJ_GCB', key: 'hts_tssbbd_QTYW_SC___ZXSB_SB_QYCHSBSJ_GCB', component: './hts/dditax.ckts.from/QTYW_SC___ZXSB_SB_QYCHSBSJ_GCB', },
              { name: '一类出口企业评定申请', path: '/hts/dditax.ckts.from/sc/qt/QTYW_SC___ZXSB_QT_QYNBFKTXJS_GCB', key: 'hts_tssbbd_sc_QTYW_SC___ZXSB_QT_QYNBFKTXJS_GCB', component: './hts/dditax.ckts.from/QTYW___ZXSB_QT_QYNBFKTXJS_GCB', },
              { name: '生产型出口企业生产能力情况报告', path: '/hts/dditax.ckts.from/sc/qt/QTYW___ZXSB_QT_SCXQYSCNLQK_GCB', key: 'hts_tssbbd_sc_QTYW___ZXSB_QT_SCXQYSCNLQK_GCB', component: './hts/dditax.ckts.from/QTYW___ZXSB_QT_SCXQYSCNLQK_GCB', },
              { name: '出口企业分类管理复评申请表', path: '/hts/dditax.ckts.from/sc/qt/QTYW_SC___ZXSB_QT_QYGLLBFPPD_GCB', key: 'hts_tssbbd_sc_QTYW_SC___ZXSB_QT_QYGLLBFPPD_GCB', component: './hts/dditax.ckts.from/QTYW___ZXSB_QT_QYGLLBFPPD_GCB', },
              { name: '进货凭证信息回退', path: '/hts/dditax.ckts.from/sc/qt/QTYW_SC___ZXSB_QT_KSPZWGQWBTSHT_GCB', key: 'hts_tssbbd_sc_QTYW_SC___ZXSB_QT_KSPZWGQWBTSHT_GCB', component: './hts/dditax.ckts.from/QTYW___ZXSB_QT_KSPZWGQWBTSHT_GCB', },
              { name: '出口信息查询', path: '/hts/dditax.ckts.from/sc/qt/QTYW_SC___ZXSB_SB_CKXXCX_GCB', key: 'hts_tssbbd_sc_QTYW_SC___ZXSB_SB_CKXXCX_GCB', component: './hts/dditax.ckts.from/QTYW___ZXSB_SB_CKXXCX_GCB', },
            ]
          },
        ],
      },
    ]
  },
]
export default menu;
