import { Request, Response } from 'express';
import mockjs from 'mockjs';

// 测试服务器响应时间
const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};


async function queryQyQxzyList(req: Request, res: Response) {
  const returnData = {
    "body": [
      {
        "fjdzyDm": "",
        "children": [
          {
            "xh": "",
            "zyDm2": "",
            "zymc2": ""
          }
        ]
      }
    ],
    "code": "200",
    "desc": "成功",
    "msg": null,
    "type": ""
  };
  await waitTime(500);
  return res.json(returnData);
}
async function qddy(req: Request, res: Response) {
  const returnData = {
    "code": "380",
    "desc": "登录失败",
    "msg": "登录失败",
    "type": ""
  };
  await waitTime(500);
  return res.json(returnData);
}

async function cjxxcx(req: Request, res: Response) {
  const returnData = {
    code: '200',
    body: [{ bgdhfph: '11221111111111', spmc: '11122' ,ysbglh:'M4A1'},{ bgdhfph: '2222222222222222', spmc: '22222' ,ysbglh:'ak47'}],
  };
  await waitTime(500);
  return res.json(returnData);
}
async function cjxxc2x(req: Request, res: Response) {
  const returnData = {
    code: '200',
    body: {
      rows: [
        { aipdsxzdxh: '1', aipdsxzdDm: '00001' ,aipdsxzdzwm:'M4A111',aipdsxzdywm:"Oa",lbm:"asojdoijoijdwojsadoij",xzbz2:"Y"},
        { aipdsxzdxh: '2', aipdsxzdDm: '00002' ,aipdsxzdzwm:'M4A122',aipdsxzdywm:"Ob",lbm:"saddwq pdfvokdo   ac1",xzbz2:"N"},
      ],
    }
  };
  await waitTime(500);
  return res.json(returnData);
}

async function cxssq(req: Request, res: Response) {
  const returnData = {
    code: '200',
    body: { jljgsjfpl: 0, ssq: '202001' ,sbpc:'001'},
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
// 序号重排
async function queryKak(req: Request, res: Response) {
  const returnData = {
    code: '200',
    desc: '',
    body: [
      {
        "kakuuid": "1234567890",
        "kaklxDm": "1",
        "kakbm": "口岸卡1",
        "kakmm": "123456",
        "sdbz": 'Y',
        "lrsj": ""
      },
      {
        "kakuuid": "23445677889",
        "kaklxDm": "2",
        "kakbm": "口岸卡2",
        "kakmm": "123456789",
        "sdbz": 'N',
        "lrsj": ""
      },
      {
        "kakuuid": "23445677823",
        "kaklxDm": "3",
        "kakbm": "口岸卡3",
        "kakmm": "123456789",
        "sdbz": 'N',
        "lrsj": ""
      },
      {
        "kakuuid": "23445677814",
        "kaklxDm": "4",
        "kakbm": "口岸卡4",
        "kakmm": "123456789",
        "sdbz": 'N',
        "lrsj": ""
      },
      {
        "kakuuid": "2344555889",
        "kaklxDm": "5",
        "kakbm": "口岸卡5",
        "kakmm": "123456789",
        "sdbz": 'N',
        "lrsj": ""
      },
    ],


  };
  await waitTime(500);
  return res.json(returnData);
}

async function xhcp(req: Request, res: Response) {
  const returnData = {
    code: '200',
    desc: '',
  };
  await waitTime(500);
  return res.json(returnData);
}

// 一次性token
function getOneTimeToken(req: Request, res: Response) {
  const returnData = {
    code: '200',
    body: 'onetimetoken',
  };
  return res.json(returnData);
}

// 获取token
function oauth(req: Request, res: Response) {
  let code = '200';
  let body: any = {
    ACCESS_TOKEN: 'local_access_token_01234567890',
  };
  if (req.body.loginUserName === 'admin') { // 如果admin用户，则模拟多企业
    if (req?.body?.qyid) {
      code = '200';
    } else {
      code = '201';
      body = {
        qxQysSaas: [
          { qyid: '1001', qy: '中国平安保险（集团）股份有限公司' },
          { qyid: '1002', qy: '中国石油天然气股份有限公司' },
          { qyid: '1003', qy: '中国建筑股份有限公司' },
          { qyid: '1004', qy: '中国铁建股份有限公司' },
          { qyid: '1005', qy: '京东集团股份有限公司' },
          { qyid: '1006', qy: '中国工商银行股份有限公司' },
          { qyid: '1007', qy: '物产中大集团股份有限公司' },
          { qyid: '1008', qy: '绿地控股集团股份有限公司' },
          { qyid: '1009', qy: '中国冶金科工股份有限公司' },
          { qyid: '1010', qy: '中国电力建设股份有限公司' },
          { qyid: '1011', qy: '广州农村商业银行股份有限公司' },
          { qyid: '1012', qy: '宁夏宝丰能源集团股份有限公司' },
          { qyid: '1013', qy: '深圳市天健(集团)股份有限公司' },
        ],
      };
    }
  }
  let returnData = {
    code,
    body,
  };
  return res.json(returnData);
}

// 获取登录人信息
function getLoginUserInfo(req: Request, res: Response) {
  const returnData = {
    "body": {
      "xtCs":{"fpxzfwlxDm":"2"},
      "qxQys": [
        {
          cktsqylxDm: 'WM',
          nsrmc: '本地测试用户',
          hgqyDm: '210120345R',
          nsrsbh: '91123456789123456W',
          shxydm: '91123456789123456W',
          kzxxDms: ["WZHQY", "FQMSSXZS", "KJMY", "FLGLCD", "TSGMS"],
          tgshzlBz: mockjs.mock('@pick(["Y", "N"])'),
          qxzDms:[
            // "010001", // 网报
            "010002", // 单一窗口
            // "010004", // 附列资料
            "020003", // 在线开票
            "020004", // 在线开票 和 数电票不共存
            "040001", // 乐企
            "A20001", // 固德威
          ],
          "lrruuid": "d1de40d94a0149498a8610946041992c",
          "qylb": "A",
          "qyuuid": " ",
          "sbqyuuid": "cd8f4be95dd54c38b42e0febea3416d7",
          "ssdq1": "12102000000",
          "ssswname": "",
          "wzhqyBz": "Y",
          "ycsbswcode": "",
          "yhuuid1": "",
          "yxbz": "Y"
        }
      ],
      "qxjs": [],
      "qxyh": {
        "dlmm": "",
        "lrrq": "2022-11-02 00:00:00.0",
        "lrruuid": "d1de40d94a0149498a8610946041992c",
        "sfzjhm": "test_sc",
        "sfzjlxDm": "",
        "xgrq": "2022-11-02 15:20:54.0",
        "xgruuid": "5a75afba1a38ab646d1616a449dc3822",
        "xm": "生产测试企业",
        "yddh": "test_sc",
        "yddhdxzytgbz": "",
        "yhlxDm": "12",
        "yhuuid1": "82b618eb937e42938da949455ab01c37",
        "yhztDm": "  ",
        "yxbz": "Y"
      },
      "qxzDms": [
        "020003",
        "010001"
      ],
      "qxzZyList": [
        {
          "children": [
            {
              "xh": 4,
              "zymc2": "下载申报文件",
              "qxzDm": "010001",
              "zyDm2": "03_004",
              "fjdzyDm": "03",
              "zylxDm": null
            },
            {
              "xh": 5,
              "zymc2": "反馈读入",
              "qxzDm": "010001",
              "zyDm2": "03_005",
              "fjdzyDm": "03",
              "zylxDm": null
            },
            {
              "xh": 4,
              "zymc2": "下载申报文件",
              "qxzDm": "010001",
              "zyDm2": "04_004",
              "fjdzyDm": "04",
              "zylxDm": null
            },
            {
              "xh": 5,
              "zymc2": "反馈读入",
              "qxzDm": "010001",
              "zyDm2": "04_005",
              "fjdzyDm": "04",
              "zylxDm": null
            },
            {
              "xh": 4,
              "zymc2": "下载申报文件",
              "qxzDm": "010001",
              "zyDm2": "05_004",
              "fjdzyDm": "05",
              "zylxDm": null
            },
            {
              "xh": 5,
              "zymc2": "反馈读入",
              "qxzDm": "010001",
              "zyDm2": "05_005",
              "fjdzyDm": "05",
              "zylxDm": null
            },
            {
              "xh": 3,
              "zymc2": "下载申报文件",
              "qxzDm": "010001",
              "zyDm2": "07_003",
              "fjdzyDm": "07",
              "zylxDm": null
            },
            {
              "xh": 4,
              "zymc2": "反馈读入",
              "qxzDm": "010001",
              "zyDm2": "07_004",
              "fjdzyDm": "07",
              "zylxDm": null
            },
            {
              "xh": 3,
              "zymc2": "下载申报文件",
              "qxzDm": "010001",
              "zyDm2": "08_003",
              "fjdzyDm": "08",
              "zylxDm": null
            },
            {
              "xh": 4,
              "zymc2": "反馈读入",
              "qxzDm": "010001",
              "zyDm2": "08_004",
              "fjdzyDm": "08",
              "zylxDm": null
            },
            {
              "xh": 3,
              "zymc2": "下载申报文件",
              "qxzDm": "010001",
              "zyDm2": "1105_003",
              "fjdzyDm": "1105",
              "zylxDm": null
            },
            {
              "xh": 4,
              "zymc2": "反馈读入",
              "qxzDm": "010001",
              "zyDm2": "1105_004",
              "fjdzyDm": "1105",
              "zylxDm": null
            },
            {
              "xh": 1,
              "zymc2": "导入",
              "qxzDm": "010001",
              "zyDm2": "0204_001",
              "fjdzyDm": "204",
              "zylxDm": null
            },
            {
              "xh": 1,
              "zymc2": "导入",
              "qxzDm": "010001",
              "zyDm2": "020601_001",
              "fjdzyDm": "20601",
              "zylxDm": null
            }
          ],
          "qxzDm": "010001"
        }
      ],
      "qySwjg": {
        "swjgmc": "国家税务总局大连市中山区税务局",
        "tskhyhmc": "",
        "tskhyhzh": "",
        "tsswjgDm1": "12102020000"
      }
    },
    "code": "200",
    "desc": "成功",
    "msg": null,
    "type": ""
  };
  return res.json(returnData);
}

// 查询企业信息
function getQyxx(req: Request, res: Response) {
  const returnData = {
    code: '200',
    body: {
      hgqydm: "hgqydm",
      nsrsbh: "nsrsbh",
      shxydm: "shxydm",
      nsrmc: "nsrmc",
      qylx: "qylx"
    }
  };
  return res.json(returnData);
}

const getNotices = (req: Request, res: Response) => {
  res.json({
    data: [
      { id: '000000001', avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png', title: '你收到了 14 份新周报', datetime: '2017-08-09', type: 'notification', },
      { id: '000000002', avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png', title: '你推荐的 曲妮妮 已通过第三轮面试', datetime: '2017-08-08', type: 'notification', },
      { id: '000000003', avatar: 'https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png', title: '这种模板可以区分多种通知类型', datetime: '2017-08-07', read: true, type: 'notification', },
      { id: '000000004', avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png', title: '左侧图标用于区分不同的类型', datetime: '2017-08-07', type: 'notification', },
      { id: '000000005', avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png', title: '内容不要超过两行字，超出时自动截断', datetime: '2017-08-07', type: 'notification', },
      { id: '000000006', avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg', title: '曲丽丽 评论了你', description: '描述信息描述信息描述信息', datetime: '2017-08-07', type: 'message', clickClose: true, },
      { id: '000000007', avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg', title: '朱偏右 回复了你', description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像', datetime: '2017-08-07', type: 'message', clickClose: true, },
      { id: '000000008', avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg', title: '标题', description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像', datetime: '2017-08-07', type: 'message', clickClose: true, },
      { id: '000000009', title: '任务名称', description: '任务需要在 2017-01-12 20:00 前启动', extra: '未开始', status: 'todo', type: 'event', },
      { id: '000000010', title: '第三方紧急代码变更', description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务', extra: '马上到期', status: 'urgent', type: 'event', },
      { id: '000000011', title: '信息安全考试', description: '指派竹尔于 2017-01-09 前完成更新并发布', extra: '已耗时 8 天', status: 'doing', type: 'event', },
      { id: '000000012', title: 'ABCD 版本发布', description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务', extra: '进行中', status: 'processing', type: 'event', },
    ],
  });
};

export default {
  'POST /hx/qx/token/oauth': oauth,
  'POST /hx/qx/token/getLoginUserInfo': getLoginUserInfo,
  'POST /hx/qx/token/getOneTimeToken': getOneTimeToken,
  'POST /yw/bszx/ggfw/sbcs/ywcsxx/queryCjCsh': cxssq,
  'POST /hx/ty/commonqxkz/qyxx': getQyxx,
  'POST /hx/ty/commonextbtn/xhcp': xhcp,
  'POST /ty/hx/dc/drwtdc': drwtdc,
  'GET /api/notices': getNotices,
  'POST /yw/saas/pzgl/kak/queryKak': queryKak,
  'POST /yw/saas/pzgl/kak/saveOrUpdateKak': cxssq,
  'POST /yw/saas/pzgl/kak/deleteKak': cxssq,
  'POST /yw/dditSaas/qxqy/queryQyQxzyList': queryQyQxzyList,
  'POST /yw/tssb/j4rpa/qddy': qddy,
  'POST /yw/bszx/mts/hwlw/tssb/cjxxcx': cjxxcx,
  'POST /saas/pzgl/aipdgl/cxsxpz': cjxxc2x,

  

};