const menu_xtjc_JSXJ: any = [
      // 销项管理
      {
        path: '/jsxj2/xxgl', id: 'P0301', pid: 'A03', name: '销项管理', icon: 'ProfileOutlined', routes: [
          { path: '/jsxj2/xxgl', redirect: '/jsxj2/xxgl/ydgl', id: 'P030100', pid: 'P0301' },
          { path: '/jsxj2/xxgl/ydgl', id: 'P030101', pid: 'P0301', name: '原单管理', routes: [
              { path: '/jsxj2/xxgl/ydgl', redirect: '/jsxj2/xxgl/ydgl/ysdd', id: 'P03010100', pid: 'P030101' },
              { path: '/jsxj2/xxgl/ydgl/ysdd', id: 'P03010101', pid: 'P030101', name: '原始订单', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1003001' },
              { path: '/jsxj2/xxgl/ydgl/ddsh', id: 'P03010102', pid: '320101', name: '订单审核', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1003002' },
              { path: '/jsxj2/xxgl/ydgl/ddcx', id: 'P03010103', pid: '320101', name: '订单查询', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1003003' },
              { path: '/jsxj2/xxgl/ydgl/ycdd', id: 'P03010104', pid: '320101', name: '异常订单', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1003004' },
              ]
          },
          { path: '/jsxj2/xxgl/fpkj', id: 'P030102', pid: 'P0301', name: '发票开具', routes: [
              { path: '/jsxj2/xxgl/fpkj', redirect: '/jsxj2/xxgl/fpkj/dkfplb', id: 'P03010200', pid: 'P030102' },
              { path: '/jsxj2/xxgl/fpkj/dkfplb', id: 'P03010201', pid: 'P030102', name: '待开发票列表', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1004001' },
              {
                path: '/jsxj2/xxgl/fpkj/sgkp', id: 'P03010202', pid: 'P030102', name: '手工开票', routes: [
                  { path: '/jsxj2/xxgl/fpkj/sgkp', redirect: '/jsxj2/xxgl/fpkj/sgkp/sdpkj', id: 'P0301020200', pid: 'P03010202' },
                  { path: '/jsxj2/xxgl/fpkj/sgkp/sdpkj', id: 'P0301020201', pid: 'P03010202', name: '数电票开具', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1005002' },
                  { path: '/jsxj2/xxgl/fpkj/sgkp/jdcxskp', id: 'P0301020202', pid: 'P03010202', name: '机动车销售开票', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1005005' },
                  { path: '/jsxj2/xxgl/fpkj/sgkp/escxsfp', id: 'P0301020203', pid: 'P03010202', name: '二手车销售发票', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1005006' },
                 ]
              },
              {
                path: '/jsxj2/xxgl/fpkj/smkp', id: 'P03010203', pid: 'P030102', name: '扫码开票', routes: [
                  { path: '/jsxj2/xxgl/fpkj/smkp', redirect: '/jsxj2/xxgl/fpkj/smkp/kpkj', id: 'P0301020300', pid: 'P03010203' },
                  { path: '/jsxj2/xxgl/fpkj/smkp/kpkj', id: 'P0301020301', pid: 'P03010203', name: '发票开具', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1006003' },
                  { path: '/jsxj2/xxgl/fpkj/smkp/smkplb', id: 'P0301020302', pid: 'P03010203', name: '扫码开票列表', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1006004' },
                  { path: '/jsxj2/xxgl/fpkj/smkp/dkfpsh', id: 'P0301020303', pid: 'P03010203', name: '待开发票审核', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1006001' },
                  { path: '/jsxj2/xxgl/fpkj/smkp/mpgl', id: 'P0301020304', pid: 'P03010203', name: '码牌管理', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1006005' },
                ]
              },
              {
                path: '/jsxj2/xxgl/fpkj/sdphc', id: 'P03010204', pid: 'P030102', name: '数电票红冲', routes: [
                  { path: '/jsxj2/xxgl/fpkj/sdphc', redirect: '/jsxj2/xxgl/fpkj/sdphc/hzqrdlr', id: 'P0301020400', pid: 'P03010204' },
                  { path: '/jsxj2/xxgl/fpkj/sdphc/hzqrdlr', id: 'P0301020401', pid: 'P03010204', name: '红字确认单录入', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1009003' },
                  { path: '/jsxj2/xxgl/fpkj/sdphc/hzqrdcx', id: 'P0301020402', pid: 'P03010204', name: '红字确认单查询', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1009001' },
                  { path: '/jsxj2/xxgl/fpkj/sdphc/hzqrdcl', id: 'P0301020403', pid: 'P03010204', name: '红字确认单处理', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1009004' },
                  { path: '/jsxj2/xxgl/fpkj/sdphc/dkhzfp', id: 'P0301020404', pid: 'P03010204', name: '待开红字发票', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1009005' },
                ]
              },
              { path: '/jsxj2/xxgl/fpkj/cxkp', id: 'P03010205', pid: 'P030102', name: '查询开票', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1010001' },
              { path: '/jsxj2/xxgl/fpkj/yckp', id: 'P03010206', pid: 'P030102', name: '异常开票', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1010002' },
            ]
          },
          { path: '/jsxj2/xxgl/fpgl', id: 'P030103', pid: 'P0301', name: '发票管理', routes: [
              { path: '/jsxj2/xxgl/fpgl', redirect: '/jsxj2/xxgl/fpgl/fpcx', id: 'P03010300', pid: 'P030103' },
              { path: '/jsxj2/xxgl/fpgl/fpcx', id: 'P03010301', pid: 'P030103', name: '发票查询', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1011001' },
              { path: '/jsxj2/xxgl/fpgl/fpdy', id: 'P03010302', pid: 'P030103', name: '纸票打印', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1011002' },
              { path: '/jsxj2/xxgl/fpgl/dpxz', id: 'P03010303', pid: 'P030103', name: '电票下载', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1011003' },
            ]
          },
          { path: '/jsxj2/xxgl/tjcx', id: 'P030104', pid: 'P0301', name: '发票管理', routes: [
              { path: '/jsxj2/xxgl/tjcx', redirect: '/jsxj2/xxgl/tjcx/fphztj', id: 'P03010400', pid: 'P030104' },
              { path: '/jsxj2/xxgl/tjcx/fphztj', id: 'P03010401', pid: 'P030104', name: '发票汇总统计', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1013001' },
              { path: '/jsxj2/xxgl/tjcx/xxfpkjb', id: 'P03010402', pid: 'P030104', name: '销项发票开具表', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1013002' },
              { path: '/jsxj2/xxgl/tjcx/xmfpcx', id: 'P03010403', pid: 'P030104', name: '项目发票查询', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1013003' },
              { path: '/jsxj2/xxgl/tjcx/fpzlcxtj', id: 'P03010404', pid: 'P030104', name: '发票资料查询统计', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1013004' },
            ]
          },
        ]
      },
      // 进项管理
      { path: '/jsxj2/jxgl', id: 'P0302', pid: 'A03', name: '进项管理', icon: 'CreditCardOutlined',routes: [
          { path: '/jsxj2/jxgl', redirect: '/jsxj2/jxgl/pjcj', id: 'P030200', pid: 'P0302' },
          { path: '/jsxj2/jxgl/pjcj', id: 'P030201', pid: 'P0302', name: '票据采集', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '2002001' },
          {
            path: '/jsxj2/jxgl/pjgx', id: 'P030202', pid: 'P0302', name: '票据勾选', routes: [
              { path: '/jsxj2/jxgl/pjgx', redirect: '/jsxj2/jxgl/pjgx/dklgx', id: 'P03020200', pid: 'P030202' },
              { path: '/jsxj2/jxgl/pjgx/dklgx', id: 'P03020201', pid: 'P030202', name: '抵扣类勾选', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '2004001' },
              { path: '/jsxj2/jxgl/pjgx/bdkgx', id: 'P03020202', pid: 'P030202', name: '不抵扣勾选', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '2004002' },
              { path: '/jsxj2/jxgl/pjgx/cktslgx', id: 'P03020203', pid: 'P030202', name: '出口退税类勾选', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '2004003' },
            ]
          },
          { path: '/jsxj2/jxgl/fprzbs', id: 'P030203', pid: 'P0302', name: '发票入账标识', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '2005001' },
          { path: '/jsxj2/jxgl/qrtj', id: 'P030204', pid: 'P0302', name: '确认统计', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '2005003' },
        ]
      },
      // 发票集市
      {
        path: '/jsxj2/fpjs', id: 'P0303', pid: 'A03', name: '发票集市', icon: 'AuditOutlined', routes: [
          { path: '/jsxj2/fpjs', redirect: '/jsxj2/fpjs/qlcj', id: 'P030300', pid: 'P0303' },
          { path: '/jsxj2/fpjs/qlcj', id: 'P030301', pid: 'P0303', name: '全量采集', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '8002001' },
          { path: '/jsxj2/fpjs/jxpc', id: 'P030302', pid: 'P0303', name: '进项票池', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '8003001' },
          { path: '/jsxj2/fpjs/xxpc', id: 'P030303', pid: 'P0303', name: '销项票池', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '8004001' },
          { path: '/jsxj2/fpjs/grpj', id: 'P030304', pid: 'P0303', name: '个人票夹', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '8005001' },
          { path: '/jsxj2/fpjs/qypj', id: 'P030305', pid: 'P0303', name: '企业票夹', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '8006001' },
          { path: '/jsxj2/fpjs/ycpj', id: 'P030306', pid: 'P0303', name: '异常票夹', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '8007001' },
        ]
      },
      // 配置管理
      {
        path: '/jsxj2/pzgl', id: 'P0304', pid: 'A03', name: '配置管理', icon: 'CheckSquareOutlined', routes: [
          { path: '/jsxj2/pzgl', redirect: '/jsxj2/pzgl/sddlsz', id: 'P030400', pid: 'P0304' },
          { path: '/jsxj2/pzgl/sddlsz', id: 'P030401', pid: 'P0304', name: '数电登录设置', routes: [
              { path: '/jsxj2/pzgl/sddlsz', redirect: '/jsxj2/pzgl/sddlsz/sdzhpz', id: 'P03040100', pid: 'P030401' },
              { path: '/jsxj2/pzgl/sddlsz/sdzhpz', id: 'P03040101', pid: 'P030401', name: '数电账号配置', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1002001' },
              { path: '/jsxj2/pzgl/sddlsz/sjdl', id: 'P03040102', pid: 'P030401', name: '税局登录', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1002002' },
            ]
          },
          { path: '/jsxj2/pzgl/xxglsz', id: 'P030402', pid: 'P0304', name: '销项管理设置', routes: [
              { path: '/jsxj2/pzgl/xxglsz', redirect: '/jsxj2/xxgl/fpkj/dkfplb', id: 'P03040200', pid: 'P030402' },
              {
                path: '/jsxj2/pzgl/xxglsz/kpsz', id: 'P03040201', pid: 'P030402', name: '开票设置', routes: [
                  { path: '/jsxj2/pzgl/xxglsz/kpsz', redirect: '/jsxj2/pzgl/xxglsz/kpsz/spda', id: 'P0304020100', pid: 'P03040201' },
                  { path: '/jsxj2/pzgl/xxglsz/kpsz/spda', id: 'P0304020101', pid: 'P03040201', name: '商品档案', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1001001' },
                  { path: '/jsxj2/pzgl/xxglsz/kpsz/khda', id: 'P0304020102', pid: 'P03040201', name: '客户档案', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1001002' },
                  { path: '/jsxj2/pzgl/xxglsz/kpsz/skxxcx', id: 'P0304020103', pid: 'P03040201', name: '税控信息查询', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1001003' },
                  { path: '/jsxj2/pzgl/xxglsz/kpsz/kpdgl', id: 'P0304020104', pid: 'P03040201', name: '开票点管理', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1001004' },
                  { path: '/jsxj2/pzgl/xxglsz/kpsz/xmgl', id: 'P0304020105', pid: 'P03040201', name: '项目管理', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1001005' },
                  { path: '/jsxj2/pzgl/xxglsz/kpsz/edgl', id: 'P0304020106', pid: 'P03040201', name: '额度管理', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1001009' },
                  { path: '/jsxj2/pzgl/xxglsz/kpsz/jdsbb', id: 'P0304020107', pid: 'P03040201', name: '局端税编表', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1001007' },
                  { path: '/jsxj2/pzgl/xxglsz/kpsz/sjtb', id: 'P0304020108', pid: 'P03040201', name: '数据同步', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1001010' },
                  { path: '/jsxj2/pzgl/xxglsz/kpsz/kkjfpdjdccx', id: 'P0304020109', pid: 'P03040201', name: '可开具发票的机动车查询', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1001011' },
                ]
              },
              {
                path: '/jsxj2/pzgl/xxglsz/sdsz', id: 'P03040202', pid: 'P030402', name: '数电设置', routes: [
                  { path: '/jsxj2/pzgl/xxglsz/sdsz', redirect: '/jsxj2/pzgl/xxglsz/sdsz/sxedgl', id: 'P0304020200', pid: 'P03040202' },
                  { path: '/jsxj2/pzgl/xxglsz/sdsz/sxedgl', id: 'P0304020201', pid: 'P03040202', name: '授信额度管理', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1002003' },
                  { path: '/jsxj2/pzgl/xxglsz/sdsz/fjxxwh', id: 'P0304020202', pid: 'P03040202', name: '附加信息维护', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '1002004' },
                 ]
              },
              ]
          },
          { path: '/jsxj2/pzgl/jxglsz', id: 'P030403', pid: 'P0304', name: '进项管理设置', routes: [
              { path: '/jsxj2/pzgl/jxglsz', redirect: '/jsxj2/pzgl/jxglsz/cssz', id: 'P03040300', pid: 'P030403' },
              { path: '/jsxj2/pzgl/jxglsz/cssz', id: 'P03040301', pid: 'P030403', name: '参数设置', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '2001004' },
            ]
          },
          { path: '/jsxj2/pzgl/fpjssz', id: 'P030404', pid: 'P0304', name: '发票集市设置', routes: [
              { path: '/jsxj2/pzgl/fpjssz', redirect: '/jsxj2/pzgl/fpjssz/cssz', id: 'P03040400', pid: '             ' },
              { path: '/jsxj2/pzgl/fpjssz/cssz', id: 'P03040401', pid: 'P030404', name: '参数设置', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '8001001' },
              { path: '/jsxj2/pzgl/fpjssz/pjgz', id: 'P03040402', pid: 'P030404', name: '票据规则', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '8001002' },
              { path: '/jsxj2/pzgl/fpjssz/hgxgz', id: 'P03040403', pid: 'P030404', name: '合规性规则', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '8001003' },
              { path: '/jsxj2/pzgl/fpjssz/qtgz', id: 'P03040404', pid: 'P030404', name: '其他规则', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '8001004' },
            ]
          },
          { path: '/jsxj2/pzgl/rwgl', id: 'P030405', pid: 'P0304', name: '任务管理', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ2', jcfJumpUrl: '8008001' },
        ]
      },




// 集成江苏菜单1.0，暂时只有深圳企业使用
      {
        path: '/jsxj/kpsz', id: '30', pid: 'P00', name: '开票设置', icon: 'BarChartOutlined', routes: [
          { path: '/jsxj/kpsz', redirect: '/jsxj/kpsz/spda', id: '3000', pid: '30' },
          { path: '/jsxj/kpsz/spda', id: '3001', pid: '30', name: '商品档案', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ', jcfJumpUrl: '0010001' },
          { path: '/jsxj/kpsz/khda', id: '3002', pid: '30', name: '客户档案', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ', jcfJumpUrl: '0010002' },
          { path: '/jsxj/kpsz/skgl', id: '3003', pid: '30', name: '税控信息查询', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ', jcfJumpUrl: '0010003' },
          { path: '/jsxj/kpsz/kpdgl', id: '3004', pid: '30', name: '开票点管理', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ', jcfJumpUrl: '0010004' },
          { path: '/jsxj/kpsz/xmgl', id: '3005', pid: '30', name: '项目管理', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ', jcfJumpUrl: '0010005' },
          { path: '/jsxj/kpsz/dyjgl', id: '3006', pid: '30', name: '打印机管理', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ', jcfJumpUrl: '0010006' },
        ]
      },
      {
        path: '/jsxj/ydgl', id: '31', pid: 'P00', name: '原单管理', icon: 'BarChartOutlined', routes: [
          { path: '/jsxj/ydgl', redirect: '/jsxj/ydgl/ysdd', id: '3100', pid: '31' },
          { path: '/jsxj/ydgl/ysdd', id: '3101', pid: '31', name: '原始订单', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ', jcfJumpUrl: '0020001' },
          { path: '/jsxj/ydgl/kpsh', id: '3102', pid: '31', name: '开票审核', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ', jcfJumpUrl: '0020002' },
          { path: '/jsxj/ydgl/ddcx', id: '3103', pid: '31', name: '订单查询', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ', jcfJumpUrl: '0020003' },
          { path: '/jsxj/ydgl/ycdd', id: '3104', pid: '31', name: '异常订单', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ', jcfJumpUrl: '0020004' },
        ]
      },
      {
        path: '/jsxj/fpkj', id: '32', pid: 'P00', name: '发票开具', icon: 'BarChartOutlined', routes: [
          { path: '/jsxj/fpkj', redirect: '/jsxj/fpkj/zpdkp', id: '3200', pid: '32' },
          { path: '/jsxj/fpkj/zpdkp', id: '3201', pid: '32', name: '增普电开票', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ', jcfJumpUrl: '0030001' },
          { path: '/jsxj/fpkj/cpykp', id: '3202', pid: '32', name: '成品油开票', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ', jcfJumpUrl: '0030002' },
          { path: '/jsxj/fpkj/ncpkp', id: '3203', pid: '32', name: '农产品开票', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ', jcfJumpUrl: '0030003' },
          {
            path: '/jsxj/fpkj/smkp', id: '3204', pid: '32', name: '扫码开票', routes: [
              { path: '/jsxj/fpkj/smkp', redirect: '/jsxj/fpkj/smkp/mpkppz', id: '320400', pid: '3204' },
              { path: '/jsxj/fpkj/smkp/mpkppz', id: '320401', pid: '3204', name: '码牌开票配置', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ', jcfJumpUrl: '0030004' },
              { path: '/jsxj/fpkj/smkp/dkfpsh', id: '320402', pid: '3204', name: '待开发票审核', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ', jcfJumpUrl: '0030005' },
            ]
          },
          { path: '/jsxj/fpkj/ykfpzf', id: '3205', pid: '32', name: '已开发票作废', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ', jcfJumpUrl: '0030006' },
          { path: '/jsxj/fpkj/kbfpzf', id: '3206', pid: '32', name: '空白发票作废', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ', jcfJumpUrl: '0030006' },
          {
            path: '/jsxj/fpkj/fpch', id: '3207', pid: '32', name: '发票冲红', routes: [
              { path: '/jsxj/fpkj/fpch', redirect: '/jsxj/fpkj/fpch/zpch', id: '320700', pid: '3207' },
              { path: '/jsxj/fpkj/fpch/zpch', id: '320701', pid: '3207', name: '专票冲红', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ', jcfJumpUrl: '0030008' },
              { path: '/jsxj/fpkj/fpch/lpch', id: '320702', pid: '3207', name: '蓝票冲红', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ', jcfJumpUrl: '0030009' },
            ]
          },
        ]
      },
      {
        path: '/jsxj/fpgl', id: '33', pid: 'P00', name: '发票管理', icon: 'BarChartOutlined', routes: [
          { path: '/jsxj/fpgl', redirect: '/jsxj/fpgl/fpcx', id: '3300', pid: '33' },
          { path: '/jsxj/fpgl/fpcx', id: '3301', pid: '33', name: '发票查询', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ', jcfJumpUrl: '0040001' },
          { path: '/jsxj/fpgl/zpdy', id: '3302', pid: '33', name: '纸票打印', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ', jcfJumpUrl: '0040002' },
          { path: '/jsxj/fpgl/dpdy', id: '3303', pid: '33', name: '电票打印', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ', jcfJumpUrl: '0040003' },
        ]
      },
      {
        path: '/jsxj/tjcx', id: '34', pid: 'P00', name: '统计查询', icon: 'BarChartOutlined', routes: [
          { path: '/jsxj/tjcx', redirect: '/jsxj/tjcx/fphztj', id: '3400', pid: '34' },
          { path: '/jsxj/tjcx/fphztj', id: '3401', pid: '34', name: '发票汇总统计', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ', jcfJumpUrl: '0050001' },
          { path: '/jsxj/tjcx/xxfpkjb', id: '3402', pid: '34', name: '销项发票开具表', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ', jcfJumpUrl: '0050002' },
          { path: '/jsxj/tjcx/xmfpcx', id: '3403', pid: '34', name: '项目发票查询', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ', jcfJumpUrl: '0050003' },
          { path: '/jsxj/tjcx/fpzlcxtj', id: '3404', pid: '34', name: '发票资料查询统计', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ', jcfJumpUrl: '0050005' },
        ]
      },
      {
        path: '/jsxj/jcsz', id: '35', pid: 'P00', name: '基础设置', icon: 'BarChartOutlined', routes: [
          { path: '/jsxj/jcsz', redirect: '/jsxj/jcsz/qyxxgl', id: '3500', pid: '35' },
          { path: '/jsxj/jcsz/qyxxgl', id: '3501', pid: '35', name: '企业信息管理', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ', jcfJumpUrl: '0060001' },
          { path: '/jsxj/jcsz/yhgl', id: '3502', pid: '35', name: '用户管理', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ', jcfJumpUrl: '0060002' },
          { path: '/jsxj/jcsz/jsgl', id: '3503', pid: '35', name: '角色管理', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ', jcfJumpUrl: '0060003' },
          { path: '/jsxj/jcsz/jdsbb', id: '3504', pid: '35', name: '局端税编表', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ', jcfJumpUrl: '0060004' },
        ]
      },
      { path: '/jsxj/spbd', id: '36', pid: 'A02', name: '税盘绑定', icon: 'BarChartOutlined', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ', jcfJumpUrl: '0070001' },
      {
        path: '/jsxj/xtkp', id: '35', pid: 'P00', name: '协同开票', icon: 'BarChartOutlined', routes: [
          { path: '/jsxj/xtkp', redirect: '/jsxj/xtkp/xtkpsz', id: '3500', pid: '35' },
          { path: '/jsxj/xtkp/xtkpsz', id: '3501', pid: '35', name: '协同开票设置', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ', jcfJumpUrl: '0090001' },
          { path: '/jsxj/xtkp/spda', id: '3502', pid: '35', name: '商品档案', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ', jcfJumpUrl: '0090002' },
          { path: '/jsxj/xtkp/xtdd', id: '3503', pid: '35', name: '协同订单', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ', jcfJumpUrl: '0090003' },
          { path: '/jsxj/xtkp/kptzs', id: '3504', pid: '35', name: '开票通知书', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ', jcfJumpUrl: '0090004' },
          { path: '/jsxj/xtkp/fpht', id: '3505', pid: '35', name: '发票回填', component: './hts/iframe/iframeXtjc', jcfQdDm: 'SAAS_API_JSXJ', jcfJumpUrl: '0090005' },
        ]
      },
]
export default menu_xtjc_JSXJ;
