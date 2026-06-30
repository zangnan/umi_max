import { BarChartOutlined, AuditOutlined, ControlOutlined, AreaChartOutlined, RadarChartOutlined, LayoutOutlined, FlagOutlined, SnippetsOutlined, PicCenterOutlined, OneToOneOutlined, GroupOutlined, MergeCellsOutlined, ProjectOutlined } from '@ant-design/icons';

export default [

  { type: 'title1', key: 'ckts', content: '进料加工核销（小图）' },
  {
    type: 'tile', content: [
      {
        titel_main: '数据下载管理',
        desc: { info: '数据下载管理', color: 1, },
        icon: <LayoutOutlined />,
        content: { number: 50, unit: '条', align: 'left', color: 3, },
        route: '/hts/ckts/sjxz/sjxz',
      },
      {
        titel_main: '加贸海关数据查询',
        desc: { info: '加贸海关数据查询', color: 2, },
        icon: <FlagOutlined />,
        content: { number: 98, unit: '条', align: 'right', color: 1, },
        route: '/hts/ckts/sjxz/hghxsjcx/scxxcx',
      },
      {
        titel_main: '加贸反馈数据查询',
        desc: { info: '加贸反馈数据查询', color: 3, },
        icon: <SnippetsOutlined />,
        content: { number: 77, unit: '条', align: 'left', color: 2, },
        route: '/hts/ckts/sjxz/jmfksjcx/scxxcx',
      },
      {
        titel_main: '智能分析',
        desc: { info: '智能分析', color: 2, },
        icon: <AuditOutlined />,
        content: { number: 12, unit: '千', align: 'right', color: 2, },
        route: '/hts/ckts/znfx',
      },
      {
        titel_main: '内部台账',
        desc: { info: '内部台账', color: 2, },
        icon: <AreaChartOutlined />,
        content: { number: 34, unit: 'K', align: 'right', color: 1, },
        route: '/hts/ckts/nbtzhd',
      },
      {
        titel_main: '核销申报数据管理',
        desc: { info: '核销申报数据管理', color: 1, },
        icon: <BarChartOutlined />,
        content: { number: 85, unit: 'K', align: 'right', color: 2, },
        route: '/hts/ckts/mxcj',
      },
      {
        titel_main: '核销数据申报',
        desc: { info: '核销数据申报', color: 3, },
        icon: <BarChartOutlined />,
        content: { number: 32, unit: 'K', align: 'right', color: 3, },
        route: '/hts/ckts/sjsb/JLJG_MDTHX',
      },
      {
        titel_main: '申报进度查询',
        desc: { info: '申报进申报进度查询度', color: 2, },
        icon: <RadarChartOutlined />,
        content: { number: 51, unit: 'K', align: 'right', color: 2, },
        route: '/hts/ckts/sbjd',
      },
      {
        titel_main: '核销数据查询',
        desc: { info: '核销数据查询', color: 1, },
        icon: <BarChartOutlined />,
        content: { number: 31, unit: 'K', align: 'right', color: 2, },
        route: '/hts/ckts/sbjgcx',
      },
    ]
  },
  { type: 'title1', key: 'sjgl', content: '外部数据管理' }, {
    type: 'tile', content: [
      {
        titel_main: '数据下载向导',
        desc: { info: '数据下载向导', color: 1, },
        icon: <OneToOneOutlined />,
        content: { number: 114, unit: 'K', align: 'right', color: 1, },
        route: '/hts/ckts/sjxz/sjxz',
      },
      {
        titel_main: '下载进度查询',
        desc: { info: '下载进度查询', color: 2, },
        icon: <LayoutOutlined />,
        content: { number: 50, unit: '条', align: 'left', color: 3, },
        route: '/hts/ckts/sjxz/sjxz',
      },
      {
        titel_main: '海关数据管理',
        desc: { info: '海关数据管理', color: 3, },
        icon: <FlagOutlined />,
        content: { number: 98, unit: '条', align: 'right', color: 1, },
        route: '/hts/ckts/sjxz/sjxz',
      },
      {
        titel_main: '发票数据管理',
        desc: { info: '发票数据管理', color: 1, },
        icon: <SnippetsOutlined />,
        content: { number: 77, unit: '条', align: 'left', color: 2, },
        route: '/hts/ckts/sjxz/sjxz',
      },
      {
        titel_main: '退税数据管理',
        desc: { info: '退税数据管理', color: 2, },
        icon: <SnippetsOutlined />,
        content: { number: 77, unit: '条', align: 'left', color: 2, },
        route: '/hts/ckts/sjxz/sjxz',
      }
    ]
  },
  { type: 'title1', key: 'ckfp', content: '出口发票开具' },
  {
    type: 'tile', content: [
      {
        titel_main: '发票概览',
        desc: { info: '发票概览', color: 1, },
        icon: <BarChartOutlined />,
        content: { number: 85, unit: '张', align: 'right', color: 1, },
        route: '/hts/ckfp/ckfpgl',
      },
      {
        titel_main: '按报关单开具',
        desc: { info: '按报关单开具', color: 2, },
        icon: <AuditOutlined />,
        content: { number: 89, unit: 'K', align: 'right', color: 2, },
        route: '/hts/ckfp/abgdkj',
      },
      {
        titel_main: '导入模板开具',
        desc: { info: '导入模板开具', color: 1, },
        icon: <AreaChartOutlined />,
        content: { number: 97, unit: 'KG', align: 'right', color: 1, },
        route: '/hts/ckfp/drmbkj',
      },
      {
        titel_main: '发票申请单',
        desc: { info: '发票申请单', color: 3, },
        icon: <BarChartOutlined />,
        content: { number: 15, unit: '台', align: 'right', color: 2, },
        route: '/hts/ckfp/fpsqd',
      },
      {
        titel_main: '发票管理',
        desc: { info: '发票管理', color: 2, },
        icon: <BarChartOutlined />,
        content: { number: 56, unit: 'K', align: 'right', color: 3, },
        route: '/hts/ckfp/fpkjgl',
      },
      {
        titel_main: '发票配置',
        desc: { info: '发票配置', color: 1, },
        icon: <RadarChartOutlined />,
        content: { number: 97, unit: 'G', align: 'right', color: 2, },
        route: '/hts/pzgl/fppzgl',
      }
    ]
  },
  { type: 'title1', key: 'jljghx', content: '进料加工核销' },
  {
    type: 'tile', content: [
      {
        titel_main: '智能分析',
        desc: { info: '智能分析', color: 2, },
        icon: <AuditOutlined />,
        content: { number: 12, unit: '千', align: 'right', color: 2, },
        route: '/hts/ckts/znfx',
      },
      {
        titel_main: '内部台账',
        desc: { info: '内部台账', color: 2, },
        icon: <AreaChartOutlined />,
        content: { number: 34, unit: 'K', align: 'right', color: 1, },
        route: '/hts/ckts/nbtzhd',
      },
      {
        titel_main: '核销申报数据管理',
        desc: { info: '核销申报数据管理', color: 1, },
        icon: <BarChartOutlined />,
        content: { number: 85, unit: 'K', align: 'right', color: 2, },
        route: '/hts/ckts/mxcj',
      },
      {
        titel_main: '核销数据申报',
        desc: { info: '核销数据申报', color: 3, },
        icon: <BarChartOutlined />,
        content: { number: 32, unit: 'K', align: 'right', color: 3, },
        route: '/hts/ckts/sjsb/JLJG_MDTHX',
      },
      {
        titel_main: '申报进度查询',
        desc: { info: '申报进申报进度查询度', color: 2, },
        icon: <RadarChartOutlined />,
        content: { number: 51, unit: 'K', align: 'right', color: 2, },
        route: '/hts/ckts/sbjd',
      },
      {
        titel_main: '核销数据查询',
        desc: { info: '核销数据查询', color: 1, },
        icon: <BarChartOutlined />,
        content: { number: 31, unit: 'K', align: 'right', color: 2, },
        route: '/hts/ckts/sbjgcx',
      },
    ]
  },
  { type: 'title1', key: 'mdts', content: '免抵退税申报' },
  {
    type: 'tile', content: [
      {
        titel_main: '申报数据概览',
        desc: { info: '申报数据概览', color: 1, },
        icon: <PicCenterOutlined />,
        content: { number: 12, unit: 'K', align: 'right', color: 2, },
        route: '/hts/mdts/sbgl/sbsjgl',
      },
      {
        titel_main: '数据智能生成',
        desc: { info: '数据智能生成', color: 2, },
        icon: <ProjectOutlined />,
        content: { number: 846, unit: '张', align: 'right', color: 1, },
        route: '/hts/mdts/sjznsc/bgdscckmx',
      },
      {
        titel_main: '明细数据采集',
        desc: { info: '明细数据采集', color: 3, },
        icon: <MergeCellsOutlined />,
        content: { number: 34, unit: '条', align: 'right', color: 3, },
        route: '/hts/mdts/mxsjcj/mdt/tssb',
      },
      {
        titel_main: '生成数据汇总',
        desc: { info: '生成数据汇总', color: 1, },
        icon: <OneToOneOutlined />,
        content: { number: 187, unit: 'K', align: 'right', color: 2, },
        route: '/hts/mdts/sjsb/sjhz',
      },
      {
        titel_main: '退税数据申报',
        desc: { info: '退税数据申报', color: 2, },
        icon: <PicCenterOutlined />,
        content: { number: 27, unit: '千', align: 'right', color: 1, },
        route: '/hts/mdts/sjsb/sjsb',
      },
      {
        titel_main: '申报进度查询',
        desc: { info: '申报进度查询', color: 3, },
        icon: <SnippetsOutlined />,
        content: { number: 12, unit: '张', align: 'right', color: 2, },
        route: '/hts/mdts/sbjdcx/MDT',
      },
      {
        titel_main: '申报数据查询',
        desc: { info: '申报数据查询', color: 1, },
        icon: <GroupOutlined />,
        content: { number: 11, unit: '条', align: 'right', color: 3, },
        route: '/hts/mdts/sbsjcx/ysbsjtj',
      },
    ]
  },
  { type: 'title1', key: 'mdts', content: '免退税申报' },
  {
    type: 'tile', content: [
      {
        titel_main: '数据智能配单',
        desc: { info: '数据智能配单', color: 2, },
        icon: <RadarChartOutlined />,
        content: { number: 846, unit: '张', align: 'right', color: 1, },
        route: '/hts/mts/sjznpd/znpd',
      },
    ]
  },
  { type: 'title1', key: 'tzgl', content: '台账管理（外贸）' },
  {
    type: 'tile', content: [
      {
        titel_main: '出口报关单台账',
        desc: { info: '出口报关单台账', color: 1, },
        icon: <OneToOneOutlined />,
        content: { number: 12, unit: '千', align: 'right', color: 2, },
        route: '/hts/tz/ckywtz/ckbgdtz',
      },
      {
        titel_main: '进货发票台账',
        desc: { info: '进货发票台账', color: 2, },
        icon: <AreaChartOutlined />,
        content: { number: 114, unit: 'K', align: 'right', color: 3, },
        route: '/hts/tz/ckywtz/jhfptz',
      },
      {
        titel_main: '出口报关单汇总',
        desc: { info: '出口报关单汇总', color: 3, },
        icon: <ControlOutlined />,
        content: { number: 231, unit: '台', align: 'left', color: 2, },
        route: '/hts/tz/ckywtz/ckbgdhz',
      },
      {
        titel_main: '出口商品汇总',
        desc: { info: '出口商品汇总', color: 2, },
        icon: <SnippetsOutlined />,
        content: { number: 49, unit: 'K', align: 'left', color: 2, },
        route: '/hts/tz/ckywtz/cksphz',
      },
      {
        titel_main: '进货发票汇总',
        desc: { info: '进货发票汇总', color: 1, },
        icon: <AuditOutlined />,
        content: { number: 70, unit: '个', align: 'left', color: 2, },
        route: '/hts/tz/ckywtz/jhfphz',
      },
      {
        titel_main: '免退税申报',
        desc: { info: '免退税申报', color: 2, },
        icon: <AreaChartOutlined />,
        content: { number: 49, unit: '台', align: 'left', color: 2, },
        route: '/hts/tz/cktstz/mtssb',
      },
      {
        titel_main: '未申报出口报关单台账',
        desc: { info: '未申报出口报关单台账', color: 3, },
        icon: <RadarChartOutlined />,
        content: { number: 75, unit: '张', align: 'left', color: 2, },
        route: '/hts/tz/wsbtz/wsbckbgdtz',
      },
      {
        titel_main: '未申报进货发票台账',
        desc: { info: '未申报进货发票台账', color: 2, },
        icon: <BarChartOutlined />,
        content: { number: 43, unit: '千', align: 'left', color: 2, },
        route: '/hts/tz/wsbtz/wsbjhfptz',
      },
    ]
  },
  { type: 'title1', key: 'sctzgl', content: '台账管理（生产）' },
  {
    type: 'tile', content: [
      {
        titel_main: '出口报关单台账',
        desc: { info: '出口报关单台账', color: 2, },
        icon: <BarChartOutlined />,
        content: { number: 12, unit: '千', align: 'right', color: 2, },
        route: '/hts/sctz/ckywtz/ckbgdtz',
      },
      {
        titel_main: '出口报关单汇总',
        desc: { info: '出口报关单汇总', color: 3, },
        icon: <AreaChartOutlined />,
        content: { number: 114, unit: 'K', align: 'right', color: 3, },
        route: '/hts/sctz/ckywtz/ckbgdhz',
      },
      {
        titel_main: '出口商品汇总',
        desc: { info: '出口商品汇总', color: 1, },
        icon: <ControlOutlined />,
        content: { number: 98, unit: '台', align: 'left', color: 1, },
        route: '/hts/sctz/ckywtz/cksphz',
      },
      {
        titel_main: '免抵退申报',
        desc: { info: '免抵退申报', color: 2, },
        icon: <AuditOutlined />,
        content: { number: 35, unit: 'K', align: 'left', color: 2, },
        route: '/hts/sctz/cktstz/mdtsb',
      },
      {
        titel_main: '未申报出口报关单台账',
        desc: { info: '未申报出口报关单台账', color: 3, },
        icon: <SnippetsOutlined />,
        content: { number: 77, unit: 'K', align: 'left', color: 3, },
        route: '/hts/sctz/wsbtz/wsbckbgdtz',
      },
    ]
  },
  { type: 'title1', key: 'badz', content: '备案单证' },
  {
    type: 'tile', content: [
      {
        titel_main: '单证管理',
        desc: { info: '单证管理', color: 2, },
        icon: <AuditOutlined />,
        content: { number: 43, unit: '台', align: 'left', color: 1, },
        route: '/hts/badz/dzgl',
      },
      {
        titel_main: '单证备案',
        desc: { info: '单证备案', color: 3, },
        icon: <AreaChartOutlined />,
        content: { number: 21, unit: '千', align: 'right', color: 3, },
        route: '/hts/badz/dzba/dzba',
      },
      {
        titel_main: '资料归档',
        desc: { info: '资料归档', color: 1, },
        icon: <ControlOutlined />,
        content: { number: 11, unit: '百', align: 'right', color: 2, },
        route: '/hts/badz/zlgd',
      },
      {
        titel_main: '资料调阅',
        desc: { info: '资料调阅', color: 2, },
        icon: <BarChartOutlined />,
        content: { number: 35, unit: 'K', align: 'left', color: 2, },
        route: '/hts/badz/zldy/abgddy',
      },
      {
        titel_main: '单证核查',
        desc: { info: '单证核查', color: 3, },
        icon: <SnippetsOutlined />,
        content: { number: 67, unit: '万', align: 'left', color: 3, },
        route: '/hts/badz/hcdy/dzhc',
      },
      {
        titel_main: '备案设置',
        desc: { info: '备案设置', color: 3, },
        icon: <BarChartOutlined />,
        content: { number: 77, unit: 'K', align: 'left', color: 3, },
        route: '/hts/badz/badzsz',
      },
    ]
  }
];
