import mockjs from 'mockjs';

const getRowData = () => {
  const data =mockjs.mock({
    uuid: mockjs.mock('@guid'),
    uuid1: mockjs.mock('@guid'),
    uuid2: mockjs.mock('@guid'),
    roleId: mockjs.mock('@guid'),
    userId: mockjs.mock('@guid'),
    cktmsywlxmcjh: mockjs.mock('@pick(["边境贸易", "修理修配", "启运港退税", "在轨交付"])'),
    cksl: mockjs.mock('@float(99, 9999, 4, 4)'),
    ckrq1: mockjs.mock('@integer(1579072395000, 1622476800000)'),
    ckrq: mockjs.mock('@date("yyyy-MM-dd")'),
    ckhth: 'JYSH/' + mockjs.mock('@integer(1234, 9234)') + 'HK',
    ssq: mockjs.mock('@date("yyyyMM")'),
    sbpc: mockjs.mock('@integer(1000, 9999)'),
    kssj: mockjs.mock('@date("yyyy-MM-dd HH:mm:ss")'),
    kprq: mockjs.mock('@integer(1579072395000, 1622476800000)'),
    yhzh: mockjs.mock('@integer(1234567891234567, 9234567891234567)'),
    bgdsjlyDm: mockjs.mock('@pick(["1"])'),
    cjhghbzmDm: mockjs.mock('@pick(["CNY","USD","HKD"])'),
    cjsl1: mockjs.mock('@pick([12])'),
    cjzj: mockjs.mock('@integer(100, 999)'),
    ckbgdh: mockjs.mock('@integer(123456789123456789, 923456789123456789)'),
    zmlx: mockjs.mock('@pick(["1", "4", "5"])'),
    sbyw: mockjs.mock('@pick(["1", "2", "6"])'),
    cytgbz: mockjs.mock('@pick(["Y", "N", ""])'),
    spzt: mockjs.mock('@pick(["Y", "N", ""])'),
    spzt2: mockjs.mock('@pick(["Y", "N", ""])'),
    ckspDm: '2933490090',
    ckspmc: mockjs.mock('@pick(["含喹琳或异喹啉环", "柔性线路板/手提电脑用", "手机液晶显示屏"])'),
    cytssbjl: ' ',
    czbz1: 'N',
    dejldwDm: "04",
    dyjldwDm: "01",
    hgcjfsmc: "CIF",
    hgjldwmc: "千克",
    hgspmc: "含喹琳或异喹啉环",
    jgfsDm: mockjs.mock('@pick(["0110", "0130", "0139", "5033", "5034", "5200"])'),
    jgfsDm2: mockjs.mock('@pick(["0110", "0130", "0139", "5033", "5034", "5200"])'),
    sybz: "Y",
    xh4: "55",
    mylaj: mockjs.mock('@integer(1000, 9999)'),
    tse: mockjs.mock('@integer(1000, 9999)'),
    decksl: mockjs.mock('@integer(123456789, 923456789)'),
    usedTime: mockjs.mock('@pick([5, 3200, 32000, 540000])'),
    year: mockjs.mock('@pick(["2021年", "2022年", "2023年"])'),
    quarter: mockjs.mock('@pick(["1季度", "2季度", "3季度", "4季度"])'),
    month: mockjs.mock('@pick(["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"])'),
    gnqyfs: mockjs.mock('@pick(["水路运输", "铁路运输"])'),
    ghfnsrsbh1: mockjs.mock('@integer(123456789012345, 923456789012345)'),
    dlzmh: mockjs.mock('@integer(123456789012345, 923456789012345)'),
    jhpzh: mockjs.mock('@integer(1234567890, 9234567890)'),
    roleName: mockjs.mock('@string(10)'),// 角色名称
    jsms: mockjs.mock('@string(10)'),// 就是描述
    jsfl: mockjs.mock('@string(10)'),// 角色分类
    userName: mockjs.mock('@string(10)'),// 姓名
    loginName: mockjs.mock('@string(10)'),// 登录账号
    password: mockjs.mock('@string(10)'),// 登录密码
    phone: mockjs.mock('@integer(13300000000, 13399999999)'),
    yxbz: mockjs.mock('@string(10)'),// 有效标志
    usedFlag: mockjs.mock('@pick(["Y", "N"])'),
    fj1: [{name: '123.png'}, {name: '456.png'}],// 附件1
    fj2: [{name: '789.png'}],// 附件2
    hiddenCol: mockjs.mock('@integer(1000, 9999)'),
    hasRoleList: [
      { roleId: 111, roleName: '@string(10)'},
      { roleId: 222, roleName: '@string(10)'},
    ],
    mediaType: mockjs.mock('@pick(["pic", "audio", "video"])'),
    mediaUrl: mockjs.Random.image('200x100', mockjs.Random.color()),
    mediaVideoUrl: mockjs.mock('@pick(["http://192.168.21.5:7777/testmedia/test01.mp4", "http://192.168.21.5:7777/testmedia/test11.mp4", "http://192.168.21.5:7777/testmedia/test12.mp4"])'),
    mediaTitle: mockjs.mock('@title'),
    mediaDescription: mockjs.mock('@title'),
    // ysbq: mockjs.mock('@pick(["#0f7185", "#00c1de", "#4ce700", "#06c06c", "#d0d0d0", "#d1e8ff"])'),
    ysbq: mockjs.mock('@hex'),// @rgb @rgba
  })
  return data;
}

export default getRowData;
