import { Request, Response } from 'express';
import mockjs from 'mockjs';
import getRowData from './mock_row_data';

// 测试服务器响应时间
const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

// 审核数据列表获取
function queryPagerSblbCp(req: Request, res: Response) {
  // 申请日期tbrq1\所属期ssq\批次sbpc\申报时间sjsbsj\审核状态sjsbztDm
  // 审核流程信息sjsbxxms\自检情况cnt\税务事项通知书swsxtzs\证明文书开具zmwskj
  const result = [
    {
      btgCnt: 1, bybltzs: null, bysltzs: null, bytstzs: null, cnt: 2, djxh: 10114406000132500000, ktgCnt: 1, lcslid: "3D2DF06FF6399E13037BC16088F5926B",
      lcswsxDm: "LCSXA081039001", lrrq: 1603460806000, sbpc: "001", sbwjuuid: "38195d896757438f81b7347606335258", sjsbsj: 1606895106000,
      sjsbuuid: "B46C53E7B8270218E053560C4815DB41", sjsbxxms: "正式申报数据存在不可挑过疑点，请检查申报数据！[N2126]", sjsbztDm: "0", ssq: "202010",
      swsxtzs: null, tbrq1: null, wjm: "MTS_9144060606514374XW_202010_001.xml", zmwskj: null, zysltzs: null
    },
    {
      btgCnt: 1, bybltzs: null, bysltzs: null, bytstzs: null, cnt: 2, djxh: 10114406000132500000, ktgCnt: 1, lcslid: "3D2DF06FF6399E13037BC16088F5926B",
      lcswsxDm: "LCSXA081039001", lrrq: 1603460806000, sbpc: "001", sbwjuuid: "38195d896757438f81b7347606335258", sjsbsj: 1606895106000,
      sjsbuuid: "B46C53E7B8270218E053560C4815DB41", sjsbxxms: "正式申报数据存在不可挑过疑点，请检查申报数据！[N2126]", sjsbztDm: "1", ssq: "202010",
      swsxtzs: null, tbrq1: null, wjm: "MTS_9144060606514374XW_202010_001.xml", zmwskj: null, zysltzs: null
    },
    {
      btgCnt: 1, bybltzs: null, bysltzs: null, bytstzs: null, cnt: 2, djxh: 10114406000132500000, ktgCnt: 1, lcslid: "3D2DF06FF6399E13037BC16088F5926B",
      lcswsxDm: "LCSXA081039001", lrrq: 1603460806000, sbpc: "001", sbwjuuid: "38195d896757438f81b7347606335258", sjsbsj: 1606895106000,
      sjsbuuid: "B46C53E7B8270218E053560C4815DB41", sjsbxxms: "正式申报数据存在不可挑过疑点，请检查申报数据！[N2126]", sjsbztDm: "2", ssq: "202010",
      swsxtzs: null, tbrq1: null, wjm: "MTS_9144060606514374XW_202010_001.xml", zmwskj: null, zysltzs: null
    },
    {
      btgCnt: 1, bybltzs: null, bysltzs: null, bytstzs: null, cnt: 2, djxh: 10114406000132500000, ktgCnt: 1, lcslid: "3D2DF06FF6399E13037BC16088F5926B",
      lcswsxDm: "LCSXA081039001", lrrq: 1603460806000, sbpc: "001", sbwjuuid: "38195d896757438f81b7347606335258", sjsbsj: 1606895106000,
      sjsbuuid: "B46C53E7B8270218E053560C4815DB41", sjsbxxms: "正式申报数据存在不可挑过疑点，请检查申报数据！[N2126]", sjsbztDm: "3", ssq: "202010",
      swsxtzs: null, tbrq1: null, wjm: "MTS_9144060606514374XW_202010_001.xml", zmwskj: null, zysltzs: null
    },
    {
      btgCnt: 1, bybltzs: null, bysltzs: null, bytstzs: null, cnt: 2, djxh: 10114406000132500000, ktgCnt: 1, lcslid: "3D2DF06FF6399E13037BC16088F5926B",
      lcswsxDm: "LCSXA081039001", lrrq: 1603460806000, sbpc: "001", sbwjuuid: "38195d896757438f81b7347606335258", sjsbsj: 1606895106000,
      sjsbuuid: "B46C53E7B8270218E053560C4815DB41", sjsbxxms: "正式申报数据存在不可挑过疑点，请检查申报数据！[N2126]", sjsbztDm: "0", ssq: "202010",
      swsxtzs: 'Y', tbrq1: null, wjm: "MTS_9144060606514374XW_202010_001.xml", zmwskj: 'Y', zysltzs: 'Y'
    },
    {
      btgCnt: 1, bybltzs: null, bysltzs: 'Y', bytstzs: null, cnt: 2, djxh: 10114406000132500000, ktgCnt: 1, lcslid: "3D2DF06FF6399E13037BC16088F5926B",
      lcswsxDm: "LCSXA081039001", lrrq: 1603460806000, sbpc: "001", sbwjuuid: "38195d896757438f81b7347606335258", sjsbsj: 1606895106000,
      sjsbuuid: "B46C53E7B8270218E053560C4815DB41", sjsbxxms: "正式申报数据存在不可挑过疑点，请检查申报数据！[N2126]", sjsbztDm: "1", ssq: "202010",
      swsxtzs: 'Y', tbrq1: null, wjm: "MTS_9144060606514374XW_202010_001.xml", zmwskj: 'Y', zysltzs: null
    },
    {
      btgCnt: 1, bybltzs: 'Y', bysltzs: null, bytstzs: null, cnt: 2, djxh: 10114406000132500000, ktgCnt: 1, lcslid: "3D2DF06FF6399E13037BC16088F5926B",
      lcswsxDm: "LCSXA081039001", lrrq: 1603460806000, sbpc: "001", sbwjuuid: "38195d896757438f81b7347606335258", sjsbsj: 1606895106000,
      sjsbuuid: "B46C53E7B8270218E053560C4815DB41", sjsbxxms: "正式申报数据存在不可挑过疑点，请检查申报数据！[N2126]", sjsbztDm: "2", ssq: "202010",
      swsxtzs: 'Y', tbrq1: null, wjm: "MTS_9144060606514374XW_202010_001.xml", zmwskj: 'Y', zysltzs: null
    },
    {
      btgCnt: 1, bybltzs: null, bysltzs: null, bytstzs: 'Y', cnt: 2, djxh: 10114406000132500000, ktgCnt: 1, lcslid: "3D2DF06FF6399E13037BC16088F5926B",
      lcswsxDm: "LCSXA081039001", lrrq: 1603460806000, sbpc: "001", sbwjuuid: "38195d896757438f81b7347606335258", sjsbsj: 1606895106000,
      sjsbuuid: "B46C53E7B8270218E053560C4815DB41", sjsbxxms: "正式申报数据存在不可挑过疑点，请检查申报数据！[N2126]", sjsbztDm: "3", ssq: "202010",
      swsxtzs: 'Y', tbrq1: null, wjm: "MTS_9144060606514374XW_202010_001.xml", zmwskj: 'Y', zysltzs: null
    },

  ];
  const returnData = {
    code: '200',
    desc: '',
    body: {
      rowCount: 100,
      rows: result,
    },
  };
  return res.json(returnData);
}

// 列表查询
function queryPager(req: Request, res: Response) {
  let rows: any[] = [];
  for (let i = 0; i < 10; i += 1) {
    rows.push(getRowData());
  }
  const returnData = {
    code: '200',
    desc: '',
    body: {
      rowCount: 100,
      rows: rows,
    },
  };
  return res.json(returnData);
}

async function queryZnpdZaadpp(req: Request, res: Response) {
  let returnData: any = {
    code: '200',
    body: {
      fauuid: mockjs.mock('@guid'),
      fappsxDm: '2', hhcbhlz: 6,
      hhcbhlsx: 8, hhcbhlxx: 5,
      gdfpydyppbz: 'Y', gdfpyddppbz: 'N',
      fpygddyjldwyzcyppbz: 'Y', fpygddejldwyzcyppbz: 'N', fpygdsbjldwyzcyppbz: 'Y',
      jhxxjcbz: 'Y',
      ljDateStart: 1640966400000, ljDateEnd: 1645891200000,
      kprqStart: 1640966400000, kprqEnd: 1645891200000,
      gdts: 89, fpts: 47
    },
  };
  return res.json(returnData);
}

async function cxssq(req: Request, res: Response) {
  const returnData = {
    code: '200',
    body: {
      sbYm: '202203', sbPc: '001', ldlpNo: '20220300100000001',
      ckmxts: 15, jhmxts: 23,
      kpdBgdCount: 89, kpdFpCount: 47,
      ppcgckbgdts: 3, ppcghwmxts: 6,
      cyppckspdmgs: 1,
      wppcgckbgdzs: 2,
      wppcgckbgdts: 2,
      wppcgzzszyfpzs: 1,
      wppcghwmxts: 1,
    },
    desc: '所属期批次不正确。'
  };
  return res.json(returnData);
}

async function queryCjCsh(req: Request, res: Response) {
  const returnData = {
    "body": {
      "ssq": "202208",
      "sbpc": "006",
      "sbxh": "00000014",
      "xh": "",
      "sbbh1": "2022090001",
      "xh4": "01",
      "sqrq": "2022-09-23",
      "tbrq1": "2022-09-23"
    },
    "code": "200",
    "desc": "成功",
    "msg": null,
    "type": ""
  }
  return res.json(returnData);
}


async function queryCjGlh(req: Request, res: Response) {
  const returnData = {
    "body": {
      "glh": "20220800608123129"
    },
    "code": "200",
    "desc": "成功",
    "msg": null,
    "type": ""
  }
  return res.json(returnData);
}

async function savemtsZnpdQdpd(req: Request, res: Response) {
  let returnData: any = {
    code: '200',
    body: {
      pduuid: '123',
      ppcgckbgdts: 1
    },
  };
  return res.json(returnData);
}

async function qrpdScmxOnTj(req: Request, res: Response) {
  const returnData = {
    code: '200',
    body: '生成出口明细1条，进货明细2条',
  };
  return res.json(returnData);
}

// 报关单数据检查
async function checkBgd(req: Request, res: Response) {
  let returnData: any = {
    code: '200',
    desc: '操作成功',
    body: "{\"msgKey\":\"N\",\"msgInfo\":\"报关单数据1张，共1条数据检查通过。\"}"
  };
  return res.json(returnData);
}
// 代理证明数据检查
async function checkDlzm(req: Request, res: Response) {
  let returnData: any = {
    code: '200',
    desc: '操作成功',
    body: "{\"msgKey\":\"N\",\"msgInfo\":\"代理证明数据1张，共1条数据检查通过。\"}"
  };
  return res.json(returnData);
}

// 列表查询
async function queryBadzCsh(req: Request, res: Response) {
  let rows: any[] = [];
  let returnData: any = {
    code: '200',
    desc: '操作成功',
    body: '操作成功'
  };
  return res.json(returnData);
}
// 列表查询
async function uploadScHgCkbgdCj2(req: Request, res: Response) {
  let rows: any[] = [];
  let returnData: any = {
    code: '200',
    desc: '操作成功',
    body: {}
  };
  return res.json(returnData);
}

// 列表查询
async function queryFpSpPage(req: Request, res: Response) {
  let rows: any[] = [];
  for (let i = 0; i < 10; i += 1) {
    rows.push(getRowData());
  }
  let returnData: any = {
    code: '200',
    desc: '操作成功',
    body: { rows }
  };
  return res.json(returnData);
}
// 通用crud 表单查询
async function queryForm(req: Request, res: Response) {
  const { body } = req;
  const { key } = body;
  // 响应数据
  const returnData = {
    body: getRowData(key),
    code: '200',
    desc: '【mock】表单查询成功',
  };
  return res.json(returnData);
}

// 列表查询
async function queryFpPage(req: Request, res: Response) {
  let rows: any[] = [];
  for (let i = 0; i < 10; i += 1) {
    rows.push(getRowData());
  }
  let returnData: any = {
    code: '200',
    desc: '操作成功',
    body: rows
  };
  return res.json(returnData);
}

async function queryFpPage02(req: Request, res: Response) {
  let rows: any[] = [];
  for (let i = 0; i < 50; i += 1) {
    rows.push(getRowData());
  }
  const returnData = {
    code: '200',
    desc: '',
    body: {
      page: req.body.page,
      pageSize: 99999,
      rowCount: 50,
      rows: rows,
    },
  };
  await waitTime(200);
  return res.json(returnData);
}

// 获取疑点数据
async function ydtj(req: Request, res: Response) {
  const returnData = {
    body: {
      bktgyclydzs: mockjs.mock('@float(1, 99, 0, 0)'),
      bktgydzs: mockjs.mock('@float(1, 99, 0, 0)'),
      cwlydzs: mockjs.mock('@float(1, 99, 0, 0)'),
      jglydzs: mockjs.mock('@float(1, 99, 0, 0)'),
      yclydzs: mockjs.mock('@float(1, 99, 0, 0)'),
      yddmzs: mockjs.mock('@float(1, 99, 0, 0)'),
      ydzs: mockjs.mock('@float(1, 99, 0, 0)'),
    },
    code: '200',
    desc: '成功',
    msg: null,
  };
  await waitTime(200);
  return res.json(returnData);
}

async function queryYdxxTzff(req: Request, res: Response) {
  const returnData = {
    body: {
      djbsbydtzffStr: "尊敬的出口退税企业，该疑点可能由以下原因造成，可根据自身情况参考以下建议处理，具体情况如下：---",
      lcswsxDm: "",
      shdxmc: "生产企业出口货物劳务免抵退税申报明细表。",
      uuid: "D093931D47297A86E055000000000001",
      ydbh: "",
      ydnr: "海关数据中无此出口货物报关单号（XXX）。",
      zxsbydtzffStr: "尊敬的出口退税企业，该疑点可能由以下原因造成，可根据自身情况参考以下建议处理，具体情况如下：---",
    },
    code: '200',
    desc: '成功',
    msg: null,
  };
  await waitTime(200);
  return res.json(returnData);
}
// 退税数据申报 -- 确认疑点处理 设置已调整
async function setydzt(req: Request, res: Response) {
  const returnData = {
    body: "疑点状态已设置调整成功",
    code: '200',
    desc: '成功',
    msg: null,
  };
  await waitTime(200);
  return res.json(returnData);
}

// 退税数据申报 -- 疑点处理 -- 明细设置为下期申报
async function setzbsbForSaas(req: Request, res: Response) {
  const returnData = {
    body: "下期申报设置成功",
    code: '200',
    desc: '成功',
    msg: null,
  };
  await waitTime(200);
  return res.json(returnData);
}

// 退税数据申报 -- 疑点处理数量- 疑点批量处理
async function plxg(req: Request, res: Response) {
  const returnData = {
    body: "当前暂无可处理的疑点数据！",
    code: '200',
    desc: '成功',
    msg: null,
  };
  await waitTime(200);
  return res.json(returnData);
}

// 退税申报 -- 货物劳务及服务退税申报 -- 外贸企业出口退税出口明细申报表 -- 报关单生成明细
async function mtsBgdToTssb(req: Request, res: Response) {
  const returnData = {
    body: "1 条数据已成功转入出口货物明细申报录入表！",
    code: '200',
    desc: '成功',
    msg: null,
  };
  return res.json(returnData);
}

// 工作台用户信息
// async function getUserInfoApi(req: Request, res: Response) {
//   const returnData = {
//     body: { 
//       qyname: "大连龙图信息技术股份有限公司",
//       bq: "三类，无纸化，外综服，水电气，收汇，研发服务，内资研发机构，船舶退税，委托卷烟出口",
//       hgdm: "210120345R",
//       nsrsbh: '91123456789123456W',
//       shxydm: '91123456789123456W',
//       qylx: "外贸企业",
//       flgllb: "二类",
//       wzh: "是",
//       yxq: "2022-10-31",
//       syts: '108',
//     },
//     code: '200',
//     desc: '成功',
//     msg: null,
//   };
//   await waitTime(200);
//   return res.json(returnData);
// }

// 工作台 出口美元额
async function getCkmyeDataApi(req: Request, res: Response) {
  const returnData = {
    body: {
      nyList:
        [
          { "ckny": "201001", "mylaj": mockjs.mock('@float(999, 9999, 2, 2)') },
          { "ckny": "201002", "mylaj": mockjs.mock('@float(999, 9999, 2, 2)') },
          { "ckny": "201003", "mylaj": mockjs.mock('@float(999, 9999, 2, 2)') },
          { "ckny": "201004", "mylaj": mockjs.mock('@float(999, 9999, 2, 2)') },
          { "ckny": "201005", "mylaj": mockjs.mock('@float(999, 9999, 2, 2)') },
          { "ckny": "201006", "mylaj": mockjs.mock('@float(999, 9999, 2, 2)') },
          {
            "ckny": "201007",
            "mylaj": mockjs.mock('@float(999, 9999, 2, 2)')
          },
          {
            "ckny": "201008",
            "mylaj": mockjs.mock('@float(999, 9999, 2, 2)')
          },
          {
            "ckny": "201009",
            "mylaj": mockjs.mock('@float(999, 9999, 2, 2)')
          },
          {
            "ckny": "201010",
            "mylaj": mockjs.mock('@float(999, 9999, 2, 2)')
          },
          {
            "ckny": "201011",
            "mylaj": mockjs.mock('@float(999, 9999, 2, 2)')
          },
          {
            "ckny": "201012",
            "mylaj": mockjs.mock('@float(999, 9999, 2, 2)')
          }]
    },
    code: '200',
    desc: '成功',
    msg: null,
  };
  await waitTime(200);
  return res.json(returnData);
}

// 工作台 出口报关单申报情况
async function getCkbgdsbDataApi(req: Request, res: Response) {
  const returnData = {
    body: {
      "ysbts": mockjs.mock('@float(999, 9999, 2, 2)'),
      "btsts": mockjs.mock('@float(999, 9999, 2, 2)'),
      "dsbts": mockjs.mock('@float(999, 9999, 2, 2)'),
      "wsbts": mockjs.mock('@float(999, 9999, 2, 2)'),
    },
    code: '200',
    desc: '成功',
    msg: null,
  };
  await waitTime(200);
  return res.json(returnData);
}

// 工作台 进项发票申报情况
async function getJxfpsbApi(req: Request, res: Response) {
  const returnData = {
    body: {
      "dsbje": mockjs.mock('@float(999, 9999, 2, 2)'),
      "ysbje": mockjs.mock('@float(999, 9999, 2, 2)'),
      "wsbje": mockjs.mock('@float(999, 9999, 2, 2)')
    },
    code: '200',
    desc: '成功',
    msg: null,
  };
  await waitTime(200);
  return res.json(returnData);
}

// 快捷菜单
async function getKjcdListApi(req: Request, res: Response) {
  const returnData = {
    body: [
      { cdDm: '0101', tbys: 'FileProtectOutlined', cdmc: '下载任务管理', cdlj: '/02/0201', checked: 'Y', gjdcdDm: '1' },
      { cdDm: '0103', tbys: 'GroupOutlined', cdmc: '海关数据查询', checked: 'Y', gjdcdDm: '1' },
      { cdDm: '0801', tbys: 'AreaChartOutlined', cdmc: '加贸数据查询', checked: 'Y', gjdcdDm: '1' },
      { cdDm: '0106', tbys: 'DeploymentUnitOutlined', cdmc: '货物劳务及服务退税申报', checked: 'Y', gjdcdDm: '2' },
      { cdDm: '0111', tbys: 'CoffeeOutlined', cdmc: '外贸综合服务企业代办退税申报表', checked: 'Y', gjdcdDm: '2' },
      { cdDm: '0116', tbys: 'DeploymentUnitOutlined', cdmc: '来料加工免税证明申请表', checked: 'Y', gjdcdDm: '3' },
      { cdDm: '0110', tbys: 'GoldOutlined', cdmc: '出口货物已补税/未退税证明', checked: 'Y', gjdcdDm: '3' },
    ],
    code: '200',
    desc: '成功',
    msg: null,
  };
  await waitTime(200);
  return res.json(returnData);
}

// 退税日历
async function tsrlApi(req: Request, res: Response) {
  const returnData = {
    body: {
      "rlList": [
        {
          "ny": "202201",
          "ywsjbz": "Y",
          "mdtse": mockjs.mock('@float(99, 99999, 2, 2)'),
          "zzstse": mockjs.mock('@float(99, 99999, 2, 2)'),
          "xfstse": mockjs.mock('@float(99, 99999, 2, 2)'),
          "tse": mockjs.mock('@float(99, 99999, 2, 2)'),
          "ytse": mockjs.mock('@float(99, 99999, 2, 2)'),
          "mdse": mockjs.mock('@float(99, 99999, 2, 2)'),
        },
        { "ny": "202202", "ywsjbz": "N", "mdtse": 0, "zzstse": 0, "xfstse": 0, "tse": 0, "ytse": 0, "mdse": 0 },
        {
          "ny": "202203",
          "ywsjbz": "Y",
          "mdtse": mockjs.mock('@float(99, 99999, 2, 2)'),
          "zzstse": mockjs.mock('@float(99, 99999, 2, 2)'),
          "xfstse": mockjs.mock('@float(99, 99999, 2, 2)'),
          "tse": mockjs.mock('@float(99, 99999, 2, 2)'),
          "ytse": mockjs.mock('@float(99, 99999, 2, 2)'),
          "mdse": mockjs.mock('@float(99, 99999, 2, 2)'),
        },
        {
          "ny": "202204",
          "ywsjbz": "Y",
          "mdtse": mockjs.mock('@float(99, 99999, 2, 2)'),
          "zzstse": mockjs.mock('@float(99, 99999, 2, 2)'),
          "xfstse": mockjs.mock('@float(99, 99999, 2, 2)'),
          "tse": mockjs.mock('@float(99, 99999, 2, 2)'),
          "ytse": mockjs.mock('@float(99, 99999, 2, 2)'),
          "mdse": mockjs.mock('@float(99, 99999, 2, 2)'),
        },
        { "ny": "202205", "ywsjbz": "N", "mdtse": 0, "zzstse": 0, "xfstse": 0, "tse": 0, "ytse": 0, "mdse": 0 },
        { "ny": "202206", "ywsjbz": "N", "mdtse": 0, "zzstse": 0, "xfstse": 0, "tse": 0, "ytse": 0, "mdse": 0 },
        { "ny": "202207", "ywsjbz": "N", "mdtse": 0, "zzstse": 0, "xfstse": 0, "tse": 0, "ytse": 0, "mdse": 0 },
        { "ny": "202208", "ywsjbz": "N", "mdtse": 0, "zzstse": 0, "xfstse": 0, "tse": 0, "ytse": 0, "mdse": 0 },
        { "ny": "202209", "ywsjbz": "N", "mdtse": 0, "zzstse": 0, "xfstse": 0, "tse": 0, "ytse": 0, "mdse": 0 },
        {
          "ny": "2022010",
          "ywsjbz": "Y",
          "mdtse": mockjs.mock('@float(99, 99999, 2, 2)'),
          "zzstse": mockjs.mock('@float(99, 99999, 2, 2)'),
          "xfstse": mockjs.mock('@float(99, 99999, 2, 2)'),
          "tse": mockjs.mock('@float(99, 99999, 2, 2)'),
          "ytse": mockjs.mock('@float(99, 99999, 2, 2)'),
          "mdse": mockjs.mock('@float(99, 99999, 2, 2)'),

        },
        { "ny": "2022011", "ywsjbz": "N", "mdtse": 0, "zzstse": 0, "xfstse": 0, "tse": 0, "ytse": 0, "mdse": 0 },
        { "ny": "2022012", "ywsjbz": "N", "mdtse": 0, "zzstse": 0, "xfstse": 0, "tse": 0, "ytse": 0, "mdse": 0 },
      ]
    },
    code: '200',
    desc: '成功',
    msg: null,
  };
  await waitTime(200);
  return res.json(returnData);
}

// 工作台 快捷菜单 全列表
async function queryKpzKjcd(req: Request, res: Response) {
  const { body } = req;
  const { gjdcdDm } = body;
  let rows: any = [];
  if (gjdcdDm == '1') {
    rows = [
      { cdDm: '0101', tbys: 'FileProtectOutlined', cdmc: '下载任务管理', cdlj: '/02/0201', checked: 'Y', gjdcdDm: '1' },
      { cdDm: '0102', tbys: 'CloudServerOutlined', cdmc: '数据下载', cdlj: '/04/0401', checked: 'N', gjdcdDm: '1' },
      { cdDm: '0103', tbys: 'GroupOutlined', cdmc: '海关数据查询', checked: 'Y', gjdcdDm: '1' },
      { cdDm: '0801', tbys: 'AreaChartOutlined', cdmc: '加贸数据查询', checked: 'Y', gjdcdDm: '1' },
      { cdDm: '0405', tbys: 'CreditCardOutlined', cdmc: '税务反馈数据查询', cdlj: '', checked: 'N', gjdcdDm: '1' },
    ]
  } else if (gjdcdDm == '2') {
    rows = [
      { cdDm: '0106', tbys: 'DeploymentUnitOutlined', cdmc: '货物劳务及服务退税申报', checked: 'Y', gjdcdDm: '2' },
      { cdDm: '0107', tbys: 'QuestionOutlined', cdmc: '出口已使用过设备退税', checked: 'N', gjdcdDm: '2' },
      { cdDm: '0108', tbys: 'CoffeeOutlined', cdmc: '购进自用货物退税申报表', checked: 'N', gjdcdDm: '2' },
      { cdDm: '0109', tbys: 'GoldOutlined', cdmc: '出口非自产消费税退税', checked: 'N', gjdcdDm: '2' },
      { cdDm: '0111', tbys: 'GoldOutlined', cdmc: '外贸综合服务企业代办退税申报表', checked: 'Y', gjdcdDm: '2' },
    ]
  } else {
    rows = [
      { cdDm: '0116', tbys: 'DeploymentUnitOutlined', cdmc: '来料加工免税证明申请表', checked: 'Y', gjdcdDm: '3' },
      { cdDm: '0107', tbys: 'QuestionOutlined', cdmc: '代理出口货物证明', checked: 'N', gjdcdDm: '3' },
      { cdDm: '0108', tbys: 'CoffeeOutlined', cdmc: '代理进口货物证明', checked: 'N', gjdcdDm: '3' },
      { cdDm: '0109', tbys: 'GoldOutlined', cdmc: '委托出口货物证明', checked: 'N', gjdcdDm: '3' },
      { cdDm: '0110', tbys: 'GoldOutlined', cdmc: '出口货物已补税/未退税证明', checked: 'Y', gjdcdDm: '3' },
    ]
  }
  const returnData = {
    body: rows,
    code: '200',
    desc: '成功',
    msg: null,
  };
  await waitTime(200);
  return res.json(returnData);
}

// 通用成功反馈
async function gtTsxx(req: Request, res: Response) {
  const returnData = {
    code: '200',
    desc: '操作成功',
    msg: '操作成功',
    body: {
    },
  };
  return res.json(returnData);
}

// 退税申报-货物劳务及服务退税申报-代理出口货物证明管理-生成出口明细
async function checkMtsTssbGlh(req: Request, res: Response) {
  const returnData = {
    code: '200',
    desc: '操作成功',
    msg: '操作成功',
    body: '操作成功',
  };
  return res.json(returnData);
}

async function bgdAndDlckzmTj(req: Request, res: Response) {
  const returnData = {
    body: {
      ckbgd: {
        dclsj: mockjs.mock('@float(9999, 99999, 0, 0)'),
        ksysj: mockjs.mock('@float(9999, 99999, 0, 0)'),
      },
      dlckhwzm: {
        dclsj: mockjs.mock('@float(9999, 99999, 0, 0)'),
        ksysj: mockjs.mock('@float(9999, 99999, 0, 0)'),
      }
    },
    code: '200',
    desc: '成功',
    msg: null,
  };
  await waitTime(200);
  return res.json(returnData);
}

async function mdtseTj(req: Request, res: Response) {
  const returnData = {
    body: {
      dqmdtse: mockjs.mock('@float(9999, 99999, 2, 2)'),
      ytse: mockjs.mock('@float(9999, 99999, 2, 2)'),
      mdse: mockjs.mock('@float(9999, 99999, 2, 2)'),
      ckhwmxts: mockjs.mock('@float(9999, 99999, 0, 0)'),
      kjysxwmxts: mockjs.mock('@float(9999, 99999, 0, 0)'),
      lx: mockjs.mock('@pick(["wsb","ysb"])'),
    },
    code: '200',
    desc: '成功',
    msg: null,
  };
  await waitTime(200);
  return res.json(returnData);
}

async function getBgdInfo(req: Request, res: Response) {
  const returnData = {
    body: {
      "form": {
        "bf": "USD/100000/3", "xh4": "11", "sybz": "Y", "zfhl": 129.98, "bgdsjlyDm": "1",
        "uuid": "0c232021d80b464bbb94f8bf16b4d39b", "yf": "USD/100000/3",
        "jgfsDm": "0615", "cytgbz": "Y", "ckrq1": "2022-10-27", "yfzssl": 1,
        "mylaj": 330000, "ckhth": "202210271355",
        "ckspmc": "标志牌,铭牌,号码,字", "cjhghbzmDm": "USD",
        "bgdcllxDm": "1", "cjhbhl": 129.98,
        "cjsl1": 50000, "rmblaj": 428934, "hgcjfsmc": "CIF", "dyjldwDm": "吨",
        "jgfsmc": "进料对口", "decksl": 5000, "hbmc": "美元",
        "ggxh": "R9090", "hxdh": "202210271355",
        "bfhl": 129.98, "ckspDm": "83100000", "bgdzm": "退税", "nsrmc": "纳税人269377385",
        "yfhl": 129.98, "lljgszch": " ", "hgspmc": "标志牌,铭牌,号码,字",
        "zf": "USD/30000/3", "ysgjmc": "RTX750",
        "czbz1": "N", "cksl": 50, "ckbgdh": "202210271355111111",
        "dejldwDm": "克拉", "tzhckspDm": " ", "hgjldwmc": "千克", "cjzj": 500000, "yblaj": 330000
      },
      "rows": [{
        "bf": "USD/100000/3", "xh4": "11", "sybz": "Y", "zfhl": 129.98, "bgdsjlyDm": "1",
        "uuid": "0c232021d80b464bbb94f8bf16b4d39b", "yf": "USD/100000/3", "jgfsDm": "0615",
        "cytgbz": "Y", "ckrq1": "2022-10-27", "yfzssl": 1,
        "mylaj": 330000, "ckhth": "202210271355",
        "ckspmc": "标志牌,铭牌,号码,字", "cjhghbzmDm": "USD", "bgdcllxDm": "1",
        "cjhbhl": 129.98, "cjsl1": 50000, "rmblaj": 428934,
        "hgcjfsmc": "CIF", "dyjldwDm": "吨", "jgfsmc": "进料对口",
        "decksl": 5000, "hbmc": "美元", "ggxh": "R9090",
        "hxdh": "202210271355", "bfhl": 129.98, "ckspDm": "83100000",
        "bgdzm": "退税", "nsrmc": "纳税人269377385", "yfhl": 129.98,
        "lljgszch": " ", "hgspmc": "标志牌,铭牌,号码,字", "zf": "USD/30000/3",
        "ysgjmc": "RTX750", "czbz1": "N", "cksl": 50, "ckbgdh": "202210271355111111",
        "dejldwDm": "克拉", "tzhckspDm": " ", "hgjldwmc": "千克", "cjzj": 500000, "yblaj": 330000
      }]
    },
    code: '200',
    desc: '成功',
    msg: null,
  };
  await waitTime(200);
  return res.json(returnData);
}

async function checkCkspSheet(req: Request, res: Response) {
  const returnData = {
    body: {
      tzmts: mockjs.mock('@pick([0,2])'),
      kzmts: mockjs.mock('@pick([2,1])'),
    },
    code: '200',
    desc: '成功',
    msg: null,
  };
  await waitTime(200);
  return res.json(returnData);
}

// 出口商品代码下拉列表
async function getCmcode11(req: Request, res: Response) {
  let rows: any[] = [];
  for (let i = 0; i < 2; i += 1) {
    rows.push(mockjs.mock({
      uuid: mockjs.mock('@guid'),
      ckspDm: mockjs.mock('@integer(12345678, 92345678)'),
      ckspmc: mockjs.mock('@pick(["未加工的玻璃球", "其他未加工的玻璃管"])'),
      tsl: mockjs.mock('@pick(["13","9", "0.5", "14", "7"])'),
    }));
  }
  const returnData = {
    code: '200',
    body: rows,
  };
  await waitTime(500);
  return res.json(returnData);
}

async function queryWsxzSj(req: Request, res: Response) {
  const returnData = {
    code: '200',
    body: {
      wssl: mockjs.mock('@pick([0,5435])')
    },
  };
  await waitTime(500);
  return res.json(returnData);
}

async function wsxz(req: Request, res: Response) {
  const returnData = {
    code: '200',
    desc: '操作成功！',
    body: {
      blob: '',
      fileName: '202101',
    }
  };
  await waitTime(500);
  return res.json(returnData);
}

async function dclsjBttj(req: Request, res: Response) {
  const returnData = {
    code: '200',
    desc: '操作成功！',
    body: {
      dbtckfph: mockjs.mock('@float(1, 9999, 0, 0)'),
      dqrspm: mockjs.mock('@float(1, 9999, 0, 0)'),
      dbthl: mockjs.mock('@float(1, 9999, 0, 0)'),
      dqryf: mockjs.mock('@float(1, 9999, 0, 0)'),
    }
  };
  await waitTime(500);
  return res.json(returnData);
}

async function gztTsjdCxMx(req: Request, res: Response) {
  const returnData = {
    code: '200',
    desc: '操作成功！',
    body: [{
      "fszzstse": null, "zkzzstse": null, "tsRydm": "12102020806", "fsbyblzzstse": null, "qrbz": null, "sehzxfstse": null, "lchjDm": "01", "fsbybltmse": null, "fsxfstse": null,
      "sehzmdse": null, "clyj": "同意", "djxh": 10112102000026755194, "jssj2": "2021-09-15 14:17", "state": "已完成", "slxfstse": 0, "sehzzzstse": null, "lcslid": "6037272C9CD386E6342462960E2ABBD4", "lchjmc": "受理",
      "slmdse": 0, "tssj": "2021-09-15 14:28", "fsmdse": null, "slzzstse": null, "fsbyblxfstse": null, "tybz": "1", "lcslids": null, "zkxfstse": null, "zlcgs": null, "jsrDm": "21300zzzd00"
    },
    {
      "fszzstse": null, "zkzzstse": null, "tsRydm": "12102020806", "fsbyblzzstse": null, "qrbz": "Y", "sehzxfstse": null, "lchjDm": "02", "fsbybltmse": null, "fsxfstse": null, "sehzmdse": null,
      "clyj": "同意", "djxh": 10112102000026755194, "jssj2": "2021-09-15 14:28", "state": "已完成", "slxfstse": null, "sehzzzstse": null, "lcslid": "6037272C9CD386E6342462960E2ABBD4", "lchjmc": "审核", "slmdse": null, "tssj": "2021-09-15 14:35",
      "fsmdse": null, "slzzstse": null, "fsbyblxfstse": null, "tybz": "1", "lcslids": null, "zkxfstse": null, "zlcgs": null, "jsrDm": "12102020806"
    }, {
      "fszzstse": 0, "zkzzstse": null, "tsRydm": "12102020515", "fsbyblzzstse": 0, "qrbz": "Y",
      "sehzxfstse": null, "lchjDm": "04", "fsbybltmse": 0, "fsxfstse": 0, "sehzmdse": null, "clyj": "同意", "djxh": 10112102000026755194, "jssj2": "2021-09-15 14:35", "state": "已完成",
      "slxfstse": null, "sehzzzstse": null, "lcslid": "6037272C9CD386E6342462960E2ABBD4", "lchjmc": "复审", "slmdse": null, "tssj": "2021-09-15 14:35", "fsmdse": 0, "slzzstse": null, "fsbyblxfstse": 0,
      "tybz": "1", "lcslids": null, "zkxfstse": null, "zlcgs": null, "jsrDm": "12102020515"
    }, {
      "fszzstse": null, "zkzzstse": null, "tsRydm": "12102020515", "fsbyblzzstse": null, "qrbz": null, "sehzxfstse": null, "lchjDm": "05", "fsbybltmse": null,
      "fsxfstse": null, "sehzmdse": null, "clyj": "同意", "djxh": 10112102000026755194, "jssj2": "2021-09-15 14:35", "state": "已完成", "slxfstse": null, "sehzzzstse": null, "lcslid": "6037272C9CD386E6342462960E2ABBD4", "lchjmc": "业务核准",
      "slmdse": null, "tssj": "2021-09-15 14:36", "fsmdse": null, "slzzstse": null, "fsbyblxfstse": null, "tybz": "1", "lcslids": null, "zkxfstse": null, "zlcgs": null, "jsrDm": "12102020515"
    }, {
      "fszzstse": null, "zkzzstse": null, "tsRydm": "12102020515",
      "fsbyblzzstse": null, "qrbz": null, "sehzxfstse": null, "lchjDm": "06", "fsbybltmse": null, "fsxfstse": null, "sehzmdse": null, "clyj": "同意", "djxh": 10112102000026755194, "jssj2": "2021-09-15 14:36", "state": "已完成", "slxfstse": null, "sehzzzstse": null,
      "lcslid": "6037272C9CD386E6342462960E2ABBD4", "lchjmc": "税额核准", "slmdse": null, "tssj": "2021-09-15 14:36", "fsmdse": null, "slzzstse": null, "fsbyblxfstse": null, "tybz": "1", "lcslids": null, "zkxfstse": null, "zlcgs": null, "jsrDm": "12102020515"
    },
    {
      "fszzstse": null, "zkzzstse": null, "tsRydm": "12102020515", "fsbyblzzstse": null, "qrbz": "Y", "sehzxfstse": null, "lchjDm": "07", "fsbybltmse": null, "fsxfstse": null, "sehzmdse": null, "clyj": "同意", "djxh": 10112102000026755194, "jssj2": "2021-09-15 14:36",
      "state": "已完成", "slxfstse": null, "sehzzzstse": null, "lcslid": "6037272C9CD386E6342462960E2ABBD4", "lchjmc": "发放", "slmdse": null, "tssj": "2021-09-15 14:36", "fsmdse": null, "slzzstse": null, "fsbyblxfstse": null, "tybz": "1", "lcslids": null, "zkxfstse": null, "zlcgs": null, "jsrDm": "12102020515"
    }]
  };
  await waitTime(500);
  return res.json(returnData);
}

async function getPlqrkzmCmcode(req: Request, res: Response) {
  const returnData = {
    code: '200',
    desc: '操作成功！',
    body: [
      {
        hgspDm: '4412991090', ckrq1: '1670813598000', tzms: [
          { ckspDm: "000001", ckspmc: "铅笔", tsl: '6', },
          { ckspDm: "000002", ckspmc: "钢笔", tsl: '3', }
        ]
      },
      {
        hgspDm: '4412991090', ckrq1: '1622476800000', tzms: [
          { ckspDm: "000004", ckspmc: "橡皮", tsl: '6', },
          { ckspDm: "000002", ckspmc: "钢笔", tsl: '3', }
        ]
      },
      {
        hgspDm: '02011000', ckrq1: '1670813598000', tzms: [
          { ckspDm: "000004", ckspmc: "橡皮", tsl: '6', },
          { ckspDm: "000003", ckspmc: "圆珠笔", tsl: '6', }
        ]
      },
      {
        hgspDm: '02011000', ckrq1: '1622476800000', tzms: [
          { ckspDm: "000004", ckspmc: "橡皮", tsl: '6', },
          { ckspDm: "000005", ckspmc: "彩笔", tsl: '13', }
        ]
      },
    ]
  };
  await waitTime(500);
  return res.json(returnData);
}

async function querySpdmXx(req: Request, res: Response) {
  const returnData = {
    code: '200',
    desc: '操作成功！',
    body: {
      ckbgdh: "",
      ckrq1: "2022-10-13",
      ckspDm: "83100000",
      slType: "Y",
      ssq: "",
    }
  };
  await waitTime(500);
  return res.json(returnData);
}

async function plxgckspDm(req: Request, res: Response) {
  let rows: any[] = [];
  for (let i = 0; i < 11; i += 1) {
    rows.push(mockjs.mock({
      uuid: mockjs.mock('@guid'),
      ckspDm: mockjs.mock('@integer(12345678, 92345678)'),
      ckspmc: mockjs.mock('@pick(["未加工的玻璃球", "其他未加工的玻璃管"])'),
      ckbgdh: mockjs.mock('@integer(177254024832618980, 977254024832618980)'),
      xh4: mockjs.mock('@integer(10, 99)'),
      ckrq1: 1622476800000,
      tzhckspDm: mockjs.mock('@integer(12345678, 92345678)'),
      sbyy: "失败原因" + mockjs.mock('@integer(10, 99)'),
    }));
  }
  const returnData = {
    code: '900',
    body: rows,
  };
  await waitTime(500);
  return res.json(returnData);
}

async function getBgdCkxxcxSsqSbpc(req: Request, res: Response) {
  const returnData = {
    code: '200',
    desc: '操作成功！',
    body: {
      ssq: "202201",
      sbpc: "001"
    }
  };
  await waitTime(500);
  return res.json(returnData);
}

async function bgdToCkxxcx(req: Request, res: Response) {
  const code = mockjs.mock('@pick(["900", "200"])')
  let returnData: any = {}
  if (code === '200') {
    returnData = {
      code: '200',
      desc: '操作成功！',
      msg: "",
      body: "数据生成成功，2条数据已转入出口信息查询表",
    };
  } else {
    let rows: any[] = [];
    for (let i = 0; i < 11; i += 1) {
      rows.push(mockjs.mock({
        uuid: mockjs.mock('@guid'),
        ckbgdh: mockjs.mock('@integer(177254024832618980, 977254024832618980)'),
        xh4: mockjs.mock('@integer(10, 99)'),
        ssq: mockjs.mock('@date("yyyyMM")'),
        sbpc: '005',
        sbyy: "失败原因失败原因失败原因失败原因" + mockjs.mock('@integer(10, 99)'),
      }));
    }
    returnData = {
      code: '900',
      desc: '操作成功！',
      msg: "",
      body: rows,
    };
  }
  await waitTime(500);
  return res.json(returnData);
}

async function bgdscCkmx(req: Request, res: Response) {
  const returnData = {
    body: null,
    code: "200",
    desc: "数据生成成功，1条数据已转入出口货物明细申报录入表！",
    msg: "数据生成成功，1条数据已转入出口货物明细申报录入表！",
    type: "",
  };
  await waitTime(500);
  return res.json(returnData);
}

async function dclsjAndKsysjTj(req: Request, res: Response) {
  const returnData = {
    body: {
      dclsj: {
        ckbgd: mockjs.mock('@float(9999, 99999, 0, 0)'),
        dlckhwzm: mockjs.mock('@float(9999, 99999, 0, 0)'),
      },
      ksysj: {
        ckbgd: mockjs.mock('@float(999, 99999, 0, 0)'),
        dlckhwzm: mockjs.mock('@float(9999, 99999, 0, 0)'),
        jxfp: mockjs.mock('@float(999, 99999, 0, 0)'),
      },
      ckbgd: {
        dclsj: mockjs.mock('@float(9999, 99999, 0, 0)'),
        ksysj: mockjs.mock('@float(9999, 99999, 0, 0)'),
      },
      dlckhwzm: {
        dclsj: mockjs.mock('@float(9999, 99999, 0, 0)'),
        ksysj: mockjs.mock('@float(9999, 99999, 0, 0)'),
      },
      dkckfpbgdTjts: mockjs.mock('@float(999, 99999, 0, 0)'),
      dhtckfpTjts: mockjs.mock('@float(99, 99999, 0, 0)'),
      dsbsjTstj: mockjs.mock('@float(99, 99999, 0, 0)'),
      wgdSsqSbpcts: mockjs.mock('@float(1, 9999, 0, 0)'),
      wgdsjts: mockjs.mock('@float(99, 99999, 0, 0)'),
    },
    code: '200',
    desc: '成功',
    msg: null,
  };
  await waitTime(200);
  return res.json(returnData);
}

async function querySchzbCscs(req: Request, res: Response) {
  const returnData = {
    body: {
      mdtsbfbddkdjxsehj: mockjs.mock('@float(1, 99, 2, 2)'),
      ssq: "205601",
      zzsnssbbqmldse: mockjs.mock('@float(1, 99, 2, 2)'),
    },
    code: '200',
    desc: '成功',
    msg: null,
  };
  await waitTime(200);
  return res.json(returnData);
}

async function pldy(req: Request, res: Response) {
  const returnData = {
    body:[{
      "xh": "1",
      "jhpzh": "22222222",
      "fphm": "33333333",
      "fpDm": "44444444",
      "kprq": 1719997245303
  }],
    code: '900',
    desc: '成功',
    msg: null,
  };
  await waitTime(200);
  return res.json(returnData);
}


async function queryHzbSysj(req: Request, res: Response) {
  const returnData = {
    body: [{
      mdse: mockjs.mock('@float(1, 9999, 2, 2)'),
      ssq: "202211",
      xh: 1,
      ytse1: mockjs.mock('@float(1, 9999, 2, 2)'),
    }],
    code: '200',
    desc: '成功',
    msg: null,
  };
  await waitTime(200);
  return res.json(returnData);
}

async function queryHzsj(req: Request, res: Response) {
  const returnData = {
    body: {
      bdmzdkseynsbce: mockjs.mock('@float(999, 9999999, 2, 2)'),
      bnljckhwbdmzhdkse: 0,
      bnljckhwmdtse: mockjs.mock('@float(999, 9999999, 2, 2)'),
      bnljckhwxsemy: mockjs.mock('@float(999, 9999999, 2, 2)'),
      bnljjljghxytzbdmzhdkse: mockjs.mock('@float(999, 9999999, 2, 2)'),
      bnljjljghxytzmdtse: -31917.46,
      bnljmdse: mockjs.mock('@float(999, 9999999, 2, 2)'),
      bnljmdtckxsemy: mockjs.mock('@float(999, 9999999, 2, 2)'),
      bnljmdtckxsermb: mockjs.mock('@float(999, 9999999, 2, 2)'),
      bnljmdtsbdmzhdkse: 0,
      bnljmdtsbdmzhdksehj: mockjs.mock('@float(999, 9999999, 2, 2)'),
      bnljmdtse: mockjs.mock('@float(999, 9999999, 2, 2)'),
      bnljmdtsehj: mockjs.mock('@float(999, 9999999, 2, 2)'),
      bnljysfwbdmzhdkse: 0,
      bnljysfwmdtse: 0,
      bnljysfwxsemy: 0,
      bnljytse: 0,
      ckhwbdmzhdkse: 0,
      ckhwmdtse: mockjs.mock('@float(999, 9999999, 2, 2)'),
      ckhwxsemy: mockjs.mock('@float(999, 9999999, 2, 2)'),
      ckxsemy: mockjs.mock('@float(999, 9999999, 2, 2)'),
      ckxsermb: mockjs.mock('@float(999, 9999999, 2, 2)'),
      jljghxytzbdmzhdkse: mockjs.mock('@float(999, 9999999, 2, 2)'),
      jljghxytzmdtse: -31917.46,
      jzxqmdtse: mockjs.mock('@float(999, 9999999, 2, 2)'),
      lcid: " ",
      lrrq: 1672044004000,
      lrruuid: "ee46ae56e3b44983a9f6e74c36504ca9",
      mdse: 0,
      mdtsbdmzhdkse: 0,
      mdtsbdmzhdksehj: mockjs.mock('@float(999, 9999999, 2, 2)'),
      mdtsbfbddkdjxsehj: 11,
      mdtse: mockjs.mock('@float(999, 9999999, 2, 2)'),
      mdtsehj: 0,
      sbqyuuid: "ee46ae56e3b44983a9f6e74c36504ca9",
      sbztDm: "\u0000",
      shbz: "\u0000",
      smrxm: " ",
      sqjzmdtse: 0,
      sqrmc: " ",
      ssq: "202211",
      uuid: "7dbf8e3f6d7545d193001b1d0cfc106c",
      xgrq: 1672044004000,
      xgruuid: "ee46ae56e3b44983a9f6e74c36504ca9",
      ysfwbdmzhdkse: 0,
      ysfwmdtse: 0,
      ysfwxsemy: 0,
      ytse1: 0,
      ytzbdmzhdkseyzzsnssbbce: 0,
      zzsnssbbqmldse: 222,
    },
    code: '200',
    desc: '成功',
    msg: null,
  };
  await waitTime(200);
  return res.json(returnData);
}

async function mdtJcSjhfx(req: Request, res: Response) {
  const returnData = {
    body: [{
      bzdsmc: "生产企业出口货物劳务免抵退税申报明细表",
      sbxh: "00000002",
      sfkhlyd: "Y",
      ssq: "205601",
      ydsm: "代理证明号（20191440000018651801）逾期申报，需申报出口货物收汇情况表！",
    }],
    code: '200',
    desc: '成功',
    msg: null,
  };
  await waitTime(200);
  return res.json(returnData);
}

async function queryKpzcddm(req: Request, res: Response) {
  const returnData = {
    body: [
      {
        id: "A01", name: "出口退税管理", routes: [
          { id: '02', name: '数据管理' },
          { id: '09', name: '出口发票开具' },
          { id: '26', name: '退税申报' },
          { id: '27', name: '代办退税' },
          { id: '10', name: '备案单证' },
        ]
      },
      {
        id: "A02", name: "发票管理", routes: [
          { id: 'P00', name: '销项管理' },
          { id: 'P002', name: '原单管理' },
          { id: 'P001', name: '开票设置' },
          { id: 'P003', name: '发票开具' },
          { id: 'P004', name: '发票管理' },
        ]
      },
      { id: "A99", name: "权限管理" },
    ],
    code: '200',
    desc: '成功',
    msg: null,
  };
  await waitTime(200);
  return res.json(returnData);
}

async function getHstStatistics(req: Request, res: Response) {
  const returnData = {
    body: {
      tjxm: [
        {
          key: "wfmsp",
          value: mockjs.mock('@float(1, 999, 0, 0)')
        },
        {
          key: "whczp",
          value: mockjs.mock('@float(1, 999, 0, 0)')
        }
      ]
    },
    code: '200',
    desc: '成功',
    msg: null,
  };
  await waitTime(200);
  return res.json(returnData);
}

async function cxQycspzxx(req: Request, res: Response) {
  const returnData = {
    body: {
      uuid: "21323213",
      ssdq1: "",
      pddwdzbz: "Y",
      pddwdzhlkgbz: "Y"
    },
    code: '200',
    desc: '成功',
    msg: null,
  };
  await waitTime(200);
  return res.json(returnData);
}

async function doSuccess(req: Request, res: Response) {
  const returnData = {
    code: '200',
    desc: '操作成功',
  };
  await waitTime(500);
  return res.json(returnData);
}

async function btssjZts(req: Request, res: Response) {
  const returnData = {
    code: '900',
    desc: '操作成功',
    body: {
      wfztsList: [
        {
          "bgdhgbh": "123456789012345678001",
          "xh4": "01",
          "hgckspDm": "1651651",
          "hgckspmc": "三顿饭",
          "jgfsmc": "旅游购物商品旅游购物商品旅游购物商品旅游购物商品11111111",
          "jgfsDm": "0139"
        },
        {
          "bgdhgbh": "223456789012345678001",
          "xh4": "02",
          "hgckspDm": "1651651",
          "hgckspmc": "三顿饭",
          "jgfsmc": "旅游购物商品",
          "jgfsDm": "0139"
        },
        {
          "bgdhgbh": "323456789012345678001",
          "xh4": "03",
          "hgckspDm": "1651651",
          "hgckspmc": "三顿饭",
          "jgfsmc": "旅游购物商品",
          "jgfsDm": "0139"
        }
      ]
    }
  };
  await waitTime(500);
  return res.json(returnData);
}

async function btssjSsjy(req: Request, res: Response) {
  const num = Math.floor(Math.random() * 10 + 1);
  const returnData = {
    code: "900", // 200 || 900
    desc: "业务异常-强制校验",
    msg: "存在需要补填的数据！",
    "body": {
      uuids: ["12323", "12123123"],
      "bzhlList": [
        {
          uuid: 'aaaaaaaaaaaa',
          jckrqhjckny: "2023-01-01",
          fphlxqgzDm: '',
          hbzmDm: 'USD',
          sbrq: "2023-01-15",
          rmbhl: null
        },
        {
          uuid: 'bbbbbbbbbbb',
          jckrqhjckny: "2023-01-01",
          sbrq: "2023-01-15",
          hbzmDm: "JPY",
          rmbhl: null
        }
      ],
      "yfzsslList": [
        {
          uuid: '111111',
          ckrq1: "2022-01-01",
          bgdhgbh: "12345678",
          xh4: "01",
          hgckspDm: "44191900",
          hgspmc: "雨伞",
          yfzssl: null
        },
        {
          uuid: '222222222',
          ckrq1: "2022-01-01",
          bgdhgbh: "123456789",
          xh4: "01",
          hgckspDm: "55191900",
          hgspmc: "靴子",
          yfzssl: null
        },
      ]
    }
  };
  await waitTime(500);
  return res.json(returnData);
}

async function btssjJsJxsezce(req: Request, res: Response) {
  const num = Math.floor(Math.random() * 10 + 1);
  const returnData = {
    code: "200", // 200 || 900
    desc: "业务异常-强制校验",
    msg: "存在需要补填的数据！",
    body: {
      bgdts: 122,
      rmblajHj: 22323,
      myblajHj: 37665,
      dcKey: 'KEY'
    }
  };
  await waitTime(500);
  return res.json(returnData);
}

export default {
  'POST /yw/bszx/ggfw/shjgcx/queryPagerSblbCp': queryPagerSblbCp,
  'POST /yw/bszx/ggfw/shjgcx/lssbsjcx': queryPager,
  'POST /yw/bszx/ggfw/ydgl/queryAllYdxxPage': queryPager,
  'POST /yw/mts/znpd/bgd/queryBgdPager': queryPager,
  'POST /yw/mts/znpd/fp/dzfpQueryPage': queryPager,
  'POST /yw/mts/znpd/tjpd/pdgzcx': queryZnpdZaadpp,
  'POST /yw/mts/znpd/bgd/getKpdBgdCount': cxssq,
  'POST /yw/mts/znpd/fp/dzfpGetCount': cxssq,
  'POST /yw/mts/znpd/tjpd/kspd': savemtsZnpdQdpd,
  'POST /yw/mts/znpd/qrpd/queryLeftBgdPage': queryPager,
  'POST /yw/mts/znpd/qrpd/tsxxcx': cxssq,
  'POST /yw/mts/znpd/qrpd/queryRightFpPage': queryPager,
  'POST /yw/mts/znpd/qrpd/fqpd': savemtsZnpdQdpd,
  'POST /yw/mts/znpd/qrpd/qrpdScmxSbxxCsh': cxssq,
  'POST /yw/mts/znpd/qrpd/qrpdScmxOnTj': qrpdScmxOnTj,
  'POST /yw/bszx/wbsj/bgd/checkBgd': checkBgd,
  'POST /yw/bszx/wbsj/dlckhwzm/checkDlzm': checkDlzm,
  'POST /yw/bszx/wbsj/bgd/uploadScHgCkbgdCj2': uploadScHgCkbgdCj2,
  'POST /yw/bszx/wbsj/dzdzfp/queryFpSpPage': queryFpSpPage,
  'POST /yw/sb/badz/comn/cshsj': queryBadzCsh,
  'POST /yw/saas/ydgl/ydtj': ydtj,
  'POST /yw/saas/ydgl/pageLeft': queryFpPage,
  'POST /yw/saas/ydgl/pageRight': queryPager,
  'POST /yw/bszx/ggfw/ydgl/queryYdxxTzff': queryYdxxTzff,
  'POST /yw/saas/ydgl/setydzt': setydzt,
  'POST /yw/saas/ydgl/setzbsbForSaas': setzbsbForSaas,
  'POST /yw/saas/ydgl/plxg': plxg,
  'POST /yw/bszx/wbsj/dlckhwzm/mtsDlzmToTssb': queryBadzCsh,
  'POST /yw/bszx/wbsj/dlckhwzm/mdtDlzmToTssb': queryBadzCsh,
  'POST /yw/bszx/wbsj/dlckhwzm/queryDlckhwzmPage': queryFpSpPage,
  'POST /yw/saas/yzfpt/yzfptRwcxPage': queryFpSpPage,
  'POST /yw/saas/yzfpt/yzfPtDlzmSq': cxssq,
  'POST /yw/saas/yzfpt/yzfPtDzfpCx': cxssq,
  'POST /yw/bszx/ggfw/sbcs/ywcsxx/queryCjCsh': queryCjCsh,
  'POST /yw/bszx/mts/hwlw/tssb/queryCjGlh': queryCjGlh,
  'POST /yw/bszx/wbsj/dzdzfp/queryPdFpPage': queryFpSpPage,
  'POST /yw/saas/gzt/gztTsjdCx': queryFpPage02,
  'POST /yw/saas/gzt/tjndckmye': getCkmyeDataApi,
  'POST /yw/saas/gzt/bgdndsbtj': getCkbgdsbDataApi,
  'POST /yw/saas/gzt/jxfpndsbtj': getJxfpsbApi,
  'POST /yw/saas/gzt/queryKjcd': getKjcdListApi,
  'POST /yw/saas/gzt/tsrl': tsrlApi,
  'POST /yw/saas/gzt/queryKpzKjcd': queryKpzKjcd,
  'POST /yw/saas/gzt/saveKjcd': uploadScHgCkbgdCj2,
  'POST /yw/bszx/ggfw/ggjy/bdgljy/checkSsqPcYsb': gtTsxx,
  'POST /yw/bszx/wbsj/bgd/queryBgd18Page': queryPager,
  'POST /yw/bszx/wbsj/bgd/queryBgd21Page': queryPager,
  'POST /yw/bszx/mts/hwlw/tssb/checkMtsTssbGlh': checkMtsTssbGlh,
  'POST /yw/bszx/mdt/hwlw/tssb/deleteHwlwTssb': gtTsxx,
  'POST /yw/bszx/mdt/hwlw/tssb/updateHwlwTssb': gtTsxx,
  'POST /yw/bszx/ggfw/ycsb/zssb/ycsbZssbztCx': gtTsxx,
  'POST /yw/bszx/wbsj/bgd/queryBgdByKey': queryForm,
  'POST /yw/bszx/wbsj/bgd/mtsBgdToTssb': mtsBgdToTssb,
  'POST /yw/bszx/mts/hwlw/tssb/mtsPlgxSbmxsj': gtTsxx,
  'POST /yw/bszx/ggfw/ggjy/bdgljy/checkYwlxSpdm': gtTsxx,
  'POST /hx/ty/check/callServiceCheck': gtTsxx,
  'POST /yw/bszx/ggfw/ycsb/sjzj/ycsbSjzjztCx': gtTsxx,
  'POST /yw/bszx/wbsj/dzdzfp/queryFpMainPage': queryPager,
  'POST /yw/saas/yzfpt/yzfPtFpxxCx': gtTsxx,
  'POST /yw/bszx/mts/hwlw/tsjh/getTsjhByFpxx': gtTsxx,
  'POST /yw/bszx/ggfw/ggjy/sjyjy/checkZmkjJyBhYsb': gtTsxx,
  'POST /yw/bszx/mdt/hwlw/tssb/bgdAndDlckzmTj': bgdAndDlckzmTj,
  'POST /yw/bszx/mdt/hwlw/tssb/mdtseTj': mdtseTj,
  'POST /yw/bszx/wbsj/bgd/plxgckfph': gtTsxx,
  'POST /yw/bszx/wbsj/bgd/ckhthTockfph': gtTsxx,
  'POST /yw/bszx/wbsj/bgd/getBgdInfo': getBgdInfo,
  'POST /yw/bszx/wbsj/bgd/checkCkspSheet': checkCkspSheet,
  'POST /yw/bszx/wbsj/bgd/confirmTzckspDm': gtTsxx,
  'POST /yw/bszx/wbsj/bgd/getCmcode11': getCmcode11,
  'POST /yw/bszx/wbsj/bgd/bgdhlwh': gtTsxx,
  'POST /ty/hx/dr/importData': gtTsxx,
  'POST /yw/bszx/mdt/hwlw/tssb/queryWsxzSj': queryWsxzSj,
  'POST /yw/bszx/mdt/hwlw/tssb/wsxz': wsxz,
  'POST /yw/bszx/wbsj/bgd/dclsjBttj': dclsjBttj,
  'POST /yw/saas/gzt/gztTsjdCxMx': gztTsjdCxMx,
  'POST /yw/bszx/wbsj/bgd/getPlqrkzmCmcode': getPlqrkzmCmcode,
  'POST /yw/bszx/ggfw/sbcs/ywcsxx/querySpdmXx': querySpdmXx,
  'POST /yw/bszx/wbsj/bgd/plxgckspDm': plxgckspDm,
  'POST /yw/bszx/wbsj/bgd/getBgdCkxxcxSsqSbpc': getBgdCkxxcxSsqSbpc,
  'POST /yw/bszx/wbsj/bgd/bgdToCkxxcx': bgdToCkxxcx,
  'POST /yw/bszx/ggfw/ggjy/sjyjy/checkSsqYsb': gtTsxx,
  'POST /yw/bszx/mdt/hwlw/tssb/bgdscCkmx': bgdscCkmx,
  'POST /yw/bszx/wbsj/bgd/plxgYfzssl': gtTsxx,
  'POST /yw/bszx/mts/hwlw/tssb/dclsjAndKsysjTj': dclsjAndKsysjTj,
  'POST /yw/bszx/dbts/hwlw/tssb/dclsjAndKsysjTj': dclsjAndKsysjTj,
  'POST /yw/bszx/mdt/mdthz/querySchzbCscs': querySchzbCscs,
  'POST /yw/bszx/mdt/mdthz/queryHzbSysj': queryHzbSysj,
  'POST /yw/bszx/mdt/mdthz/queryHzsj': queryHzsj,
  'POST /yw/bszx/mdt/mdtsjjc/mdtJcSjhfx': mdtJcSjhfx,
  'POST /yw/bszx/mdt/mdthz/mdtSchzb': uploadScHgCkbgdCj2,
  'POST /yw/saas/gzt/queryBacklog': queryFpPage02,
  'POST /yw/saas/gzt/queryDkckfpbgdCount': dclsjAndKsysjTj,
  'POST /yw/saas/gzt/queryDhtckfpCount': dclsjAndKsysjTj,
  'POST /yw/saas/gzt/queryDsbsjCount': dclsjAndKsysjTj,
  'POST /yw/saas/gzt/queryDwcdzbaCount': dclsjAndKsysjTj,
  'POST /yw/saas/gzt/queryKpzcddm': queryKpzcddm,
  'POST /yw/saas/gzt/getHstStatisticsForDomesticSalesInvoice': getHstStatistics,
  'POST /saas/pzgl/znpdpzgl/jcpzcx': cxQycspzxx,
  'POST /saas/pzgl/znpdpzgl/jcpzcxSave': doSuccess,
  'POST /saas/pzgl/znpdpzgl/dwglSave': doSuccess,
  'POST /saas/pzgl/znpdpzgl/dwglUpdate': doSuccess,
  'POST /saas/pzgl/znpdpzgl/dwglDelete': doSuccess,
  'POST /yw/fpzs/fppz/plfmdr': doSuccess,
  'POST /tssb/wbsjgl/bgdzbts': doSuccess,
  'POST /tssb/wbsjgl/bgdzts': btssjZts,
  'POST /tssb/wbsjgl/btssjSsjy': btssjSsjy,
  'POST /tssb/wbsjgl/btssjSsjgdc': doSuccess,
  'POST /tssb/wbsjgl/btssjSsqd': doSuccess,
  'POST /tssb/wbsjgl/btssjJsJxsezce': btssjJsJxsezce,
  'POST /yw/bszx/wbsj/bgd/bgdhlwhAbz': doSuccess,
  'POST /yw/bszx/wbsj/bgd/cxxj': queryPager,
  'POST /yw/saas/sjgl/jxfpcx/cxxj': queryPager,
  'POST /yw/bszx/sjgl/jxfpcx/pldy': pldy,

  'POST /saas/tssb/aipd/scmx': qrpdScmxOnTj,
}
