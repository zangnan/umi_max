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

async function cyfx(req: Request, res: Response) {
  const returnData = {
    code: '200',
    body: { hlts: 1 },
  };
  await waitTime(500);
  return res.json(returnData);
}

async function szhl(req: Request, res: Response) {
  const returnData = {
    code: '200',
    body: { hlts: 1 },
  };
  await waitTime(500);
  return res.json(returnData);
}

async function cxxz(req: Request, res: Response) {
  const returnData = {
    code: '200',
    body: { hlts: 1 },
  };
  await waitTime(500);
  return res.json(returnData);
}

async function getFxzSjTs(req: Request, res: Response) {
  const returnData = {
    code: '200',
    body: { fxzTs: 0 },
  };
  await waitTime(500);
  return res.json(returnData);
}

async function fkdr(req: Request, res: Response) {
  const returnData = {
    code: '200',
    body: [
      {
        xh: "01",
        sjlb: "电子手册核销信息表",
        sjts: "2324"
      },
      {
        xh: "02",
        sjlb: "电子账册核销信息表",
        sjts: "1357"
      }
    ]
  };
  await waitTime(500);
  return res.json(returnData);
}

async function sjdr18(req: Request, res: Response) {
  const returnData = {
    code: '200',
    body: {
      druuid: '123',
      hxzquuid: '123',
      rows: [{xh: "1", bah: 'C12345', hxqsrq: '2021-01-01', hxjzrq: '2021-02-02', wtms: '啊xxx啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'}],
      drycxx: [
        {
          xh: "1",
          sjlb: "电子手册核销信息表",
          sjts: "2324",
          sbyy: "电子手册核销信息表",
        },
        {
          xh: "2",
          sjlb: "电子账册核销信息表",
          sjts: "1357",
          sbyy: "电子账册核销信息表",
        }
      ]
    }
  };
  await waitTime(500);
  return res.json(returnData);
}

async function drwtdc(req: Request, res: Response) {
  const returnData = {
    code: '900',
    body: {}
  };
  await waitTime(500);
  return res.json(returnData);
}

async function sjdr(req: Request, res: Response) {
  const returnData = {
    code: '900',
    body: {
      druuid: '123', drycxx: [
        {
          xh: "1",
          sjlb: "电子手册核销信息表",
          sjts: "2324",
          sbyy: "电子手册核销信息表",
        },
        {
          xh: "2",
          sjlb: "电子账册核销信息表",
          sjts: "1357",
          sbyy: "电子账册核销信息表",
        }
      ]
    }
  };
  await waitTime(500);
  return res.json(returnData);
}

async function queryReport(req: Request, res: Response) {
  const rows: any = [];
  for (let i = 1; i < 300; i++) {
    rows.push(mockjs.mock({
      uuid: mockjs.mock('@guid'),
      xh: i,
      qdbh: mockjs.mock('@pick(["11123099888133114000", "11123099888133114001", "11123099888133114002"])'),
      sbrq1:mockjs.mock('@integer(1579072395000, 1610694795000)'),
      bgdhgbh: mockjs.mock('@pick(["11123099888133114000", "11123099888133114001", "11123099888133114002"])'),
      ckrq1:mockjs.mock('@integer(1579072395000, 1610694795000)'),
      ckbgdh: mockjs.mock('@pick(["11123099888133114000", "11123099888133114001", "11123099888133114002"])'),
      mxts:mockjs.mock('@integer(5, 10)'),
    }));
  }
  const returnData = {
    code: '200',
    body: {
      rows,
      rowCount: 299,
    }
  };
  await waitTime(500);
  return res.json(returnData);
}

async function queryReports(req: Request, res: Response) {
  const rows: any = [];
  for (let i = 1; i < 3; i++) {
    rows.push(mockjs.mock({
      uuid: mockjs.mock('@guid'),
      xh: i,
      ywbd: mockjs.mock('@pick(["ZXSB_SB_JLJG_MDTHX_J_PRINT_REPORT", "xxxx"])'),
      ywbdmc: mockjs.mock('@pick(["免抵退业务表", "核销调整表"])'),
      mxts:mockjs.mock('@integer(0, 5, 10)'),
    }));
  }
  const returnData = {
    code: '200',
    body: rows
  };
  await waitTime(500);
  return res.json(returnData);
}

async function getQrCode(req: Request, res: Response) {
  const returnData = {
    code: '200',
    body: 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQF08DwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAydUttNGtTaHVmVEQxZHo0QzF5Y3oAAgTjiR1iAwSAOgkA'
  };
  return res.json(returnData);
}

async function cxssq(req: Request, res: Response) {
  const returnData = {
    code: '200',
    body: { jljgsjfpl: 0, ssq: '202001',sbpc:"008" },
  };
  await waitTime(500);
  return res.json(returnData);
}

async function queryZnfxPager(req: Request, res: Response) {
  const rows = [];
  for (let i = 0; i < 15; i++) {
    rows.push(getRowData());
  }
  const returnData = {
    code: '200',
    body: {
      rowCount: 15,
      rows,
    },
  };
  return res.json(returnData);
}

// 内部台账核对：18位关单列表数据
async function queryNbtzhd18List(req: Request, res: Response) {
  let rows: any[] = [];
  for (let i = 0; i < 15; i += 1) {
    rows.push(getRowData());
  }
  const returnData = {
    code: '200',
    body: rows,
  };
  await waitTime(500);
  return res.json(returnData);
}


async function scsj18(req: Request, res: Response) {
  const rows: any = [];
  for (let i = 0; i< 35;i++) {
    rows.push(getRowData());
  }
  const returnData = {
    code: '200',
    body: { 
      mdtTs: 1,
      hxTs: 1,
      druuid: 'xxx',
      rows: rows
    },
  };
  await waitTime(500);
  return res.json(returnData);
}

//核销申报数据管理-进料加工业务免抵退税核销表-计划分配率左侧查询
async function jssjfpl(req: Request, res: Response) {
  let rows: any[] = [];
  for (let i = 0; i < 15; i += 1) {
    rows.push(getRowData());
  }
  const returnData = {
    code: '200',
    body: rows,
  };
  await waitTime(500);
  return res.json(returnData);
}

// 免抵退核销表重新计算分配率
function recalculateMdthxfpl(req: Request, res: Response) {
  const { body } = req;
  let returnData;
  if (body?.id === 1) {
    returnData = {
      code: '200',
      ts: '15',
      desc: '【mock】成功',
    };
  } else {
    returnData = {
      code: '500',
      ts: '0',
      desc: '【mock】失败',
    };
  }
  return res.json(returnData);
}

//进料加工核销-申报结果查询-进料加工业务统计查询-查询已核销所属期清单
async function querySsqList(req: Request, res: Response) {
  const result = [
    { ssq: '202103' },
    { ssq: '202102' },
    { ssq: '202101' },
  ];
  const returnData = {
    code: '200',
    desc: '',
    body: result,
  };
  return res.json(returnData);
}


//进料加工核销-申报结果查询-进料加工业务统计查询-查询进料加工核销汇总
async function queryYhxHz(req: Request, res: Response) {
  const result = {
    uuid: mockjs.mock('@guid'),
    ssq: mockjs.mock('@pick(["2021"])') + mockjs.mock('@date("MM")'),
    cxSsq: mockjs.mock('@pick(["202101", "202102", "202103", "202104", "202105", "202106"])'),
    fpl: mockjs.mock('@float(9, 99, 5, 5)'),
  };
  const returnData = {
    code: '200',
    desc: '',
    body: {
      mdthx: [{
        ytzmdtse: mockjs.mock('@float(9, 99, 5, 5)'),
        mdtsbdmzhdkse: mockjs.mock('@float(9, 99, 5, 5)'),
        rmblaj: mockjs.mock('@float(9, 99, 5, 5)'),
        jsjkzz: mockjs.mock('@float(9, 99, 5, 5)'),
        jsckzz: mockjs.mock('@float(9, 99, 5, 5)'),
        zhsjfpl: mockjs.mock('@float(9, 99, 5, 5)'),
        sbts: mockjs.mock('@float(9, 99, 5, 5)'),
        scts: mockjs.mock('@float(9, 99, 5, 5)'),
        zcts: mockjs.mock('@float(9, 99, 5, 5)')
      }],
      yhxtz: [{
        sbts: mockjs.mock('@float(9, 99, 5, 5)'),
        jkbgdts: mockjs.mock('@float(9, 99, 5, 5)'),
        ckbgdts: mockjs.mock('@float(9, 99, 5, 5)')
      }],
      ndjhfpl: [{
        ssq: mockjs.mock('@pick(["202101", "202102", "202103", "202104", "202105", "202106"])'),
        tzhjhfpl: mockjs.mock('@float(9, 99, 5, 5)')
      }]
    },
  };
  return res.json(returnData);
}

// 申报结果查询计划分配率数据：列表数据
async function queryJhfplsjYsbMainPage(req: Request, res: Response) {
  let rows: any[] = [];
  for (let i = 0; i < 15; i += 1) {
    rows.push(mockjs.mock({
      uuid: mockjs.mock('@guid'),
      ssq: mockjs.mock('@pick(["2021", "2020"])') + mockjs.mock('@date("MM")'),
      sndyhxszcsjfpl: mockjs.mock('@float(9, 99, 2, 2)'),
      bz: mockjs.mock('@pick(["报关单号：123456789123456789，贸易方式：一般贸易，汇率657.18", "报关单号：987654321987654321，贸易方式：进口贸易，汇率100.00"])'),
    }));
  }
  const returnData = {
    code: '200',
    body: {
      rowCount: 15,
      rows,
    },
  };
  return res.json(returnData);
}

async function deleteRw(req: Request, res: Response) {
  const returnData = {
    code: '200',
    desc: '删除成功！',
  };
  await waitTime(500);
  return res.json(returnData);
}

// 操作成功
async function doSuccess(req: Request, res: Response) {
  const returnData = {
    code: '200',
    desc: '操作成功',
  };
  await waitTime(500);
  return res.json(returnData);
}

// 列表查询
async function queryPager(req: Request, res: Response) {
  const { body } = req;
  const { key, page } = body;
  let rows: any[] = [];
  for (let i = 0; i < 50; i += 1) {
    rows.push(getRowData(key));
  }
  let returnData: any = {
    code: '200',
    body: {
      rowCount: 100,
      rows,
      page,
    },
  };
  return res.json(returnData);
}

async function exportPager(req: Request, res: Response) {
  const returnData = {
    code: '200',
    body: { filePath: 'XXXXX/XXXXX' },
  };
  await waitTime(2000);
  return res.json(returnData);
}

// 操作成功
async function doSuccess2(req: Request, res: Response) {
  const returnData = {
    code: '200',
    desc: '操作成功',
    body: {
      msgInfo: 'mock撤销提示信息mock撤销提示信息'
    }
  };
  await waitTime(500);
  return res.json(returnData);
}

// 操作成功
async function doSuccess3(req: Request, res: Response) {
  const returnData = {
    code: '200',
    desc: '操作成功',
    body: 'Y'
  };
  await waitTime(500);
  return res.json(returnData);
}

async function fkxz(req: Request, res: Response) {
  const returnData = {
    code: '200',
    msg: '反馈接收成功！',
    body:  '反馈接收成功！',
    desc: '成功',
  };
  await waitTime(500);
  return res.json(returnData);
}

// 打印报表
async function queryReportData(req: Request, res: Response) {
  const returnData = {
    body: [
      { uuid: '1', bm: "生产企业进料加工业务免抵退税核销表", nr: "JLJG_MDTHX_MDTHX", ts: 2 },
      { uuid: '2', bm: "已核销手册（账册）海关数据调整表", nr: "JLJG_MDTHX_HGSJTZ", ts: 4 },
    ],
    code: '200',
    desc: '【mock】成功',
    msg: null,
  };
  return res.json(returnData);
}
// 打印报表
async function queryFlzlJcInfo(req: Request, res: Response) {

  let rows: any[] = [];
 rows.push(  {
    "flzldlDm":"LCSXA081049001001",
    "sbdzzlfs":1,
    "flzldlmc":"代理出口货物证明申请资料",
    "bbdzzlfs":2
});
  rows.push({
    "flzldlDm":"LCSXA081049001002",
    "sbdzzlfs":0,
    "flzldlmc":"其他申报资料",
    "bbdzzlfs":0
});
  const returnData = {
    body: {
      "rows":rows
    },
    code: '200',
    desc: '【mock】成功',
    msg: null,
  };
  return res.json(returnData);
}
// 打印报表
async function queryBzmxbInfo(req: Request, res: Response) {

  const returnData = {
    body:"{\"dataRows\":[{\"qrbz\":\"1\",\"sbflzluuid\":\"d8fc65f87c4c4279b1d27bd557af8bdf\"}],\"sjzbztDm\":\" \"}",
    code: '200',
    desc: '【mock】成功',
    msg: null,
  };
  return res.json(returnData);
}
// 打印报表
async function queryFlzlInfo(req: Request, res: Response) {
  let rows: any[] = [];
  rows.push({
    "flzldlDm":"LCSXA081049001001",
    "lcswsxDm":"LCSXA081049001",
    "sbflzluuid":"d8fc65f87c4c4279b1d27bd557af8bdf",
    "flzlbslxDm":"1",
    "qrbz":"1",
    "uuid":"d5a2ba4b5cba4caea90e2526ffe90302",
    "xh":1,
    "bzmxbuuid":null,
    "zdscbz":"1",
    "bzcgbz":null,
    "sjsbuuid":" ",
    "flzlmc":"《代理出口货物证明申请表》",
    "zxsjsbuuid":" ",
    "flzlDm":"LCSXA081049001001001",
    "sbwjuuid":"1ad226b06ee341bfb0b92fd80f93fc49",
    "bzuuid":" ",
    "zxsbuuid":"1ad226b06ee341bfb0b92fd80f93fc49",
    "bzbz":"N",
    "sjsbztDm":" ",
    "flzlbslxmc":"必报"
});
  rows.push({
    "flzldlDm":"LCSXA081049001001",
    "lcswsxDm":"LCSXA081049001",
    "sbflzluuid":"d8fc65f87c4c4279b1d27bd5571f8bdf",
    "flzlbslxDm":"1",
    "qrbz":"1",
    "uuid":"1111",
    "xh":2,
    "bzmxbuuid":null,
    "zdscbz":"0",
    "bzcgbz":null,
    "sjsbuuid":" ",
    "flzlmc":"代理出口协议复印件",
    "zxsjsbuuid":" ",
    "flzlDm":"LCSXA081049001001002",
    "sbwjuuid":"1ad226b06ee341bfb0b92fd80f93fc49",
    "bzuuid":" ",
    "zxsbuuid":"1ad226b06ee341bfb0b92fd80f93fc49",
    "bzbz":"N",
    "sjsbztDm":" ",
    "flzlbslxmc":"必报"
});
  const returnData = {
    body: {
      "rows":rows
    },
    code: '200',
    desc: '【mock】成功',
    msg: null,
  };
  return res.json(returnData);
}
async function getBadzlxYzjdTree(req: Request, res: Response) {
  const returnData = {"body":[{"yzjdbz":"N","children":[{"yzjdbz":"N","children":[{"yzjdbz":"Y","title":"出口合同","value":"010101"},{"yzjdbz":"Y","title":"外贸综合服务合同","value":"010102"},{"yzjdbz":"Y","title":"外贸企业购货合同","value":"010103"}],"title":"购销合同","value":"010100"},{"yzjdbz":"N","children":[{"yzjdbz":"Y","title":"海运提单","value":"010201"},{"yzjdbz":"Y","title":"航空运单","value":"010202"},{"yzjdbz":"Y","title":"铁路运单","value":"010203"},{"yzjdbz":"Y","title":"货物承运单据","value":"010204"},{"yzjdbz":"Y","title":"邮政收据","value":"010205"},{"yzjdbz":"Y","title":"出口企业承付运费的国内运输发票","value":"010206"},{"yzjdbz":"Y","title":"出口企业承付费用的国际货物运输代理服务费发票","value":"010207"}],"title":"出口货物运输单据","value":"010200"},{"yzjdbz":"N","children":[{"yzjdbz":"Y","title":"委托报关协议","value":"010301"},{"yzjdbz":"Y","title":"代理报关服务费发票","value":"010302"}],"title":"委托报关单据","value":"010300"}],"title":"备案单证资料","value":"010000"},{"yzjdbz":"N","children":[{"yzjdbz":"N","children":[{"yzjdbz":"Y","title":"出口货物报关单","value":"020101"},{"yzjdbz":"Y","title":"代理出口货物证明","value":"020102"},{"yzjdbz":"Y","title":"无纸化放行通知书","value":"020103"},{"yzjdbz":"Y","title":"装箱单","value":"020104"}],"title":"出口单证","value":"020100"},{"yzjdbz":"N","children":[{"yzjdbz":"Y","title":"出口发票","value":"020201"},{"yzjdbz":"Y","title":"自制出口发票","value":"020202"},{"yzjdbz":"Y","title":"进项增值税专用发票","value":"020203"},{"yzjdbz":"Y","title":"代办退税专用发票","value":"020204"}],"title":"发票单证","value":"020200"}],"title":"退税单证资料","value":"020000"},{"yzjdbz":"N","children":[{"yzjdbz":"N","children":[{"yzjdbz":"Y","title":"收汇凭证","value":"030101"},{"yzjdbz":"Y","title":"载货清单（舱单）","value":"030102"},{"yzjdbz":"Y","title":"AAAAAAA","value":"031001"}],"title":"其他单证","value":"030100"}],"title":"其他单证资料","value":"030000"}],"code":"200","desc":"成功","msg":null,"type":""};
  return res.json(returnData);
}

async function checkScsbsj(req: Request, res: Response) {
  const returnData = {
    "body":{
      "bgdlist": [
        "223120200001066757057",
        "223120200001066757058",
        "223120200001066757059"
      ]
    },
    "code":"900",
    "desc":"成功",
    "msg":null,"type":""
  };
  return res.json(returnData);
}


async function jlhxpzcx(req: Request, res: Response) {
  const returnData = {
    "body":{
      "jmcyfxldDm":"1",
      "jmbgdjshlDm":"2"
      },
      "code":"200",
      "desc":"成功",
      "msg":null,
      "type":""
  };
  await waitTime(500);
  return res.json(returnData);
}

// 重新计算
async function bgdtjmyjjy(req: Request, res: Response) {
  const num = Math.floor(Math.random()*10+1);
  const returnData = {
    code: num > 6 ? "900" : "200", // 200 || 900
    desc:"业务异常-强制校验",
    msg:"存在需要补填的数据！",
    "body":{
      "bthl":[
        {
          "uuid": 'aaaaaaaaaaaa',
          "jckrqhjckny":"2023-01-01",
          "sbrq":"2023-01-15",
          "hbzmDm":"USD",
          "rmbhl":null
        },
        {
          "uuid": 'bbbbbbbbbbb',
          "jckrqhjckny":"2023-01-01",
          "sbrq":"2023-01-15",
          "hbzmDm":"USD",
          "rmbhl":null
        }
      ],
      "btzssl":[
        {
          "uuid": '111111',
          "jckrq":"2022-01-01",
          "bgdh":"123456789123456788",
          "xh":"01",
          "hgspDm":"44191900",
          "hgspmc":"龙图信息",
          "zssl":null
        },
        {
          "uuid": '222222222',
          "jckrq":"2022-01-01",
          "bgdh":"123456789123456788",
          "xh":"01",
          "hgspDm":"44191900",
          "hgspmc":"龙图信息",
          "zssl":null
        },
      ]
    }
  };
  await waitTime(500);
  return res.json(returnData);
}

async function btzssldr(req: Request, res: Response) {
  const num = Math.floor(Math.random()*10+1);
  let returnData = {};
  if(num > 5) {
    returnData = {
      code: '900',
      desc: "业务异常-强制校验",
      msg: "存在需要补填的数据！",
      body: {
        "bthl":[
          {
          "xh":1,
          "sbyy":"第（1）行，折算数量不能为空。"
          },
          {
            "xh":2,
            "sbyy":"第（2）行，折算数量不能为空。"
          }
        ]
      }
    }
  } else {
    returnData = {
      code: '200',
      desc: "成功",
      msg: null,
      body: {
        "btzssl":[
          {
            "uuid": '3333333',
            "jckrq":"2022-01-01",
            "bgdh":"123456789123456788",
            "xh":"01",
            "hgspDm":"44191900",
            "hgspmc":"雨伞",
            "zssl": 3.666
          },
          {
            "uuid": '444444',
            "jckrq":"2022-09-01",
            "bgdh":"123456789123456788",
            "xh":"02",
            "hgspDm":"44191900",
            "hgspmc":"雨伞",
            "zssl": null
          }
        ]
      }
    }
  }
  await waitTime(500);
  return res.json(returnData);
}

async function getCodeFxzt(req: Request, res: Response) {
  const returnData = {
    body: {
      rows: [
        { code: "N0", name: "待分析" },
        { code: "N1", name: "分析中" },
        { code: "N2", name: "有差异" },
        { code: "N3", name: "无差异" },
        { code: "N4", name: "分析失败" },
        { code: "10", name: "计算中" },
        { code: "00", name: "待计算" },
        { code: "20", name: "计算失败" },
        { code: "30", name: "计算成功待分析" },
      ]
    },
    code:"200",
    desc:"成功",
    msg:null,
  };
  await waitTime(500);
  return res.json(returnData);
}

async function queryFxzSjTs(req: Request, res: Response) {
  const num = Math.floor(Math.random()*10+1);
  const returnData =  {
    code: '200',
    desc: "",
    msg: "",
    body: num < 2 ? 'N' : num > 5 ? 'Y' : 'S'
  };
  await waitTime(500);
  return res.json(returnData);
}

export default {
  'POST /yw/jljg/znfx/cyfx': cyfx,
  'POST /yw/jljg/znfx/szhl': szhl,
  'POST /yw/jljg/sjxz/cxxz': cxxz,
  'POST /yw/jljg/znfx/getFxzSjTs': getFxzSjTs,
  'POST /yw/sb/jljg/sbjd/zssb/fkdr': fkdr,
  'POST /yw/sb/jljg/tzhd/tzhd/sjdr18': sjdr18,
  'POST /ty/hx/dc/drwtdc': drwtdc,
  'POST /yw/jljg/mxcj/yhxtzb/sjdr': sjdr,
  'POST /yw/jljg/sjxz/queryReport': queryReport,
  'POST /hx/ty/report/queryReports': queryReports,
  'POST /yw/jljg/sjxz/getQrCode': getQrCode,
  'POST /yw/bszx/ggfw/sbcs/ywcsxx/queryCjCsh': cxssq,
  'POST /yw/jljg/znfx/queryPager': queryZnfxPager,
  'POST /yw/sb/jljg/tzhd/tzhd/custom': queryNbtzhd18List,
  'POST /yw/sb/jljg/tzhd/schxmx/scsj18': scsj18,
  'POST /yw/jljg/mxcj/mdthx/jssjfpl': jssjfpl,
  'POST /hts/ckts/mdthx/recalculateMdthxfpl': recalculateMdthxfpl,
  'POST /yw/jljg/hxsjcx/querySsqList': querySsqList, //进料加工核销-申报结果查询-进料加工业务统计查询-查询已核销所属期清单
  'POST /yw/jljg/hxsjcx/queryYhxHz': queryYhxHz, //进料加工核销-申报结果查询-进料加工业务统计查询-查询进料加工核销汇总
  'POST /hts/ckts/mdthx/queryJhfplsjYsbMainPage': queryJhfplsjYsbMainPage,
  'POST /dditSaas/khdgj/bgd/deleteRw': deleteRw,
  'POST /yw/jljg/sjxz/hzqdtjmyj': doSuccess,
  'POST /yw/jljg/sjxz/bgdtjmyj': doSuccess,
  'POST /yw/jljg/znfx/scmx': scsj18,
  'POST /yw/sb/jljg/tzhd/queryLeftSzcInfo': jssjfpl,
  'POST /yw/sb/jljg/tzhd/tzhd': doSuccess,
  'POST /yw/sb/jljg/tzhd/deleteTz': doSuccess,
  'POST /yw/jljg/mxcj/mdthx/jssjfplyb': queryPager,
  'POST /yw/jljg/mxcj/mdthx/gxjhfpldc': exportPager,
  'POST /yw/jljg/mxcj/mdthx/gxsjfpl': doSuccess,
  'POST /yw/jljg/mxcj/mdthx/plschxb': doSuccess,
  'POST /yw/jljg/mxcj/yhxtzb/plsctzb': doSuccess,
  'POST /yw/bszx/ggfw/flzlgl/querySfxgbz': doSuccess3,
  'POST /yw/bszx/ggfw/scsbsj/sjgl/querySbsjJlCp': queryPager,
  'POST /yw/bszx/ggfw/sbcs/ywcsxx/queryScsbCsh': cxssq,
  'POST /yw/bszx/ggfw/scsbsj/sjgl/chsbCheck': doSuccess2,
  'POST /yw/bszx/ggfw/scsbsj/sjjc/checkScsbsj': checkScsbsj,
  'POST /yw/bszx/ggfw/scsbsj/sjjc/queryDsbsjLb': jssjfpl,
  'POST /yw/bszx/ggfw/scsbsj/sjgl/chsb': doSuccess,
  'POST /yw/bszx/ggfw/ycsb/sjzj/ycsbSjzjSq': doSuccess,
  'POST /yw/bszx/ggfw/flzlgl/flzlCheck': doSuccess,
  'POST /yw/bszx/ggfw/ycsb/zssb/ycsbZssb': doSuccess,
  'POST /yw/bszx/ggfw/ycsb/yzqfk/shfkdr2': fkxz,
  'POST /yw/bszx/ggfw/ycsb/yzqfk/ycsbYzfFkxzGetXzjlPage': queryPager,
  'POST /yw/bszx/ggfw/ycsb/yzqfk/ycsbYzfFkxzFksjbSc': doSuccess,
  'POST /yw/bszx/ggfw/cxtj/cxtjDyLb': queryReportData,
  'POST /yw/sb/badz/comn/getBadzlxYzjdTree': getBadzlxYzjdTree,
  'POST /yw/bszx/ggfw/flzlgl/queryFlzlJcInfo': queryFlzlJcInfo,
  'POST /yw/bszx/ggfw/flzlgl/queryBzmxbInfo': queryBzmxbInfo,
  'POST /yw/bszx/ggfw/flzlgl/queryFlzlInfo': queryFlzlInfo,
  'POST /yw/pzgl/jlhxpzgl/jlhxpzcx': jlhxpzcx,
  'POST /yw/pzgl/jlhxpzgl/jlhxpzwh': queryFlzlInfo,
  'POST /yw/bszx/ggfw/ycsb/yzqfk/shfkwjdr': fkxz,
  'POST /yw/jljg/znfx/bgdtjmyjjy': bgdtjmyjjy,
  'POST /yw/jljg/znfx/btxxbc': doSuccess,
  'POST /yw/jljg/znfx/btzssldr': btzssldr,
  'POST /yw/jljg/znfx/getCodeFxzt': getCodeFxzt,
  'POST /yw/jljg/znfx/checkRequryFxzt': queryFxzSjTs,
};
