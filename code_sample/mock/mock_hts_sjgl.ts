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

// 成功
async function doSuccess(req: Request, res: Response) {
  const returnData = {
    code: '200',
    body: null,
    desc: '成功',
    msg: '成功'
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
async function queryPagerRwjd(req: Request, res: Response) {
  const { body } = req;
  const { key, page } = body;
  let rows: any[] = [];
  const data =mockjs.mock({
    zrwuuid: mockjs.mock('@guid'),
    ywflDm: mockjs.mock('@pick(["003"])'),
    zxkpfwlxDm: mockjs.mock('@pick(["2"])'),
    xzztDm: mockjs.mock('@pick(["1"])'),
  });
  rows.push(data);
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


async function checkKakPassword(req: Request, res: Response) {
  const returnData = {
    code: '200',
    body : {
      "kakuuid": "23423423423",
      "sbqyuuid": "22324234234",
      "kaklxDm": "1",
      "kakbm": "2234324234",
      "kakmm": "242323",
      "zfbz1": "Y",
      "sdbz": "N",
    },
    desc: '成功',
    msg: '成功'
  };
  await waitTime(500);
  return res.json(returnData);
}

async function gdhjjc(req: Request, res: Response) {
  const returnData = {
    code: '200',
    body : {"code": "4"},
    desc: '成功',
    msg: '成功'
  };
  await waitTime(500);
  return res.json(returnData);
}

async function bgdgdhjjc(req: Request, res: Response) {
  const returnData = {
    code: '200',
    body : [{
      "url": "需检测网址",
      "available": "Y"
    },],
    desc: '成功',
    msg: '成功'
  };
  await waitTime(500);
  return res.json(returnData);
}


// 数据管理-台账筛选
async function bgdtzsx(req: Request, res: Response) {
  const returnData = {
    code: '200',
    desc: '操作成功',
    body: 
      {
        tzsxid: "12315646466161561651561",
        drzs: 10,
        cgzs: 8,
        sbzs: 2,
        sbmx:[
          {
            "bgdhgbh":"12345",
            "sbyy":"不足18位"
          },
          {
            "bgdhgbh":"28584778995544",
            "sbyy":"台账中报关单在系统中找不到"
          },
        ]
      },
  };
  await waitTime(500);
  return res.json(returnData);
}

async function queryCkbgdslForDy(req: Request, res: Response) {
  const returnData = {
    code: '200',
    body: {count: mockjs.mock('@integer(0, 20)')},
    desc: '成功',
    msg: '成功'
  };
  await waitTime(10000);
  return res.json(returnData);
}
async function kszx(req: Request, res: Response) {
  const returnData = {
    code: '200',
    body: {
      "jybz": "Y",
      "jyxx": "Y"
    },
    desc: '成功',
    msg: '成功'
  };
  await waitTime(500);
  return res.json(returnData);
}

async function pdfInZipExportGet(req: Request, res: Response) {
  const returnData = {file:12312312312};
  await waitTime(1500);
  return res.json(returnData);
}

export default {
  'POST /yw/saas/sjgl/hgsjcx/saasHgsjcxJkhwbgdPage': queryPager,
  'POST /yw/saas/sjgl/hgsjcx/saasHgsjcxCkhwbgdPage': queryPager,
  'POST /yw/saas/pzgl/kak/queryKakCzrz': queryPager,
  'POST /yw/saas/yzfpt/queryPagerRwjd': queryPagerRwjd,
  'POST /yw/bszx/wbsj/dlckhwzm/scdlzm': doSuccess,
  'POST /hx/ty/crud/queryPager/MBCX_DM_CKTS_CKTMSYWLX/05': queryPager,
  'POST /hx/ty/crud/queryPager/MBCX_DM_GY_HGGQKA/05': queryPager,
  'POST /hx/ty/crud/queryPager/MBCX_DM_CKTS_HGJGFS/05': queryPager,
  'POST /hx/ty/crud/queryPager/MBCX_DM_GY_HB/05': queryPager,
  'POST /khdgjservices/bgd/checkIsExistTask': doSuccess,
  'POST /dditSaas/khdgj/gt/checkKakPassword': checkKakPassword,
  'POST /khdgjservices/gt/khdgjxx': doSuccess,
  'POST /khdgjservices/gpt/gdhjjc': gdhjjc,
  'POST /khdgjservices/bgd/gdhjjc': bgdgdhjjc,
  'POST /dditSaas/khdgj/gt/insertKakRzInfo': doSuccess,
  'POST /yw/saas/yzfpt/xzrwjy':doSuccess,
  'POST /yw/saas/yzfpt/hgsjxz': doSuccess,
  'POST /dditSaas/khdgj/bgd/rwsxForGpt': doSuccess,
  'POST /yw/saas/yzfpt/rwjdsx': doSuccess,
  'POST /dditSaas/khdgj/bgd/rwscToZffwForGpt': doSuccess,
  'POST /dditSaas/khdgj/bgd/qxzxForGpt': doSuccess,
  'POST /yw/bszx/wbsj/bgd/bgdtzsx': bgdtzsx,
  'POST /yw/bszx/wbsj/bgd/delTzsx': doSuccess,
  'POST /yw/bszx/wbsj/bgd/pldy': queryCkbgdslForDy,
  'POST /saas/sjgl/fpsjxz/kszx': kszx,
  'POST /saas/sjgl/fpsjxz/zxqjy': kszx,

  
  
  'GET /hx/ty/report/pdfInZipExportGet/PDF_REPORT_SJGLSAAS_HGSJCX_HGCKHWBGD/onetimetoken': pdfInZipExportGet,
};
