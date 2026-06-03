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
        { path: '/25/2505/SBMXCX_250613', id: '250613', pid: '2506', name: '免抵退税申报汇总表', component: './hts/dditax.ckts.from/mdts/sjsb/sjhz/swfk', hideInMenu: true },
        { path: '/25/2505/SBMXCX_250614', id: '250614', pid: '2505', name: '外贸企业出口退税进货明细申报表', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSJH_GCB', hideInMenu: true },
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
          { path: '/26/2603/260301', redirect: '/26/2603/260302/26030201' },
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

export default cktsMenu;
