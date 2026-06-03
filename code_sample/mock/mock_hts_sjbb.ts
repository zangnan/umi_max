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

// updateDataTz
async function updateDataTz(req: Request, res: Response) {
  const returnData = {
    code: '200',
  };
  return res.json(returnData);
}

// 数据报表 申报表清单
async function querySbbqdData(req: Request, res: Response) {
  let rows: any[] = [];
  const { body } = req;
  if (body.checkId) {
    rows = [
      {
        uuid: mockjs.mock('@guid'),
        bdmc: '外贸企业出口退税出口明细申报表',
        sbts: mockjs.mock('@float(1, 99, 0, 0)'),
      },
      {
        uuid: mockjs.mock('@guid'),
        bdmc: '外贸企业出口退税进货明细申报表',
        sbts: mockjs.mock('@float(1, 99, 0, 0)'),
      },
      {
        uuid: mockjs.mock('@guid'),
        bdmc: '海关出口商品代码、名称、退税率调整对应表',
        sbts: mockjs.mock('@float(1, 99, 0, 0)'),
      },
      {
        uuid: mockjs.mock('@guid'),
        bdmc: '出口货物收汇申报表',
        sbts: mockjs.mock('@float(1, 99, 0, 0)'),
      },
      {
        uuid: mockjs.mock('@guid'),
        bdmc: '出口货物不能收汇申报表',
        sbts: mockjs.mock('@float(1, 99, 0, 0)'),
      },
      {
        uuid: mockjs.mock('@guid'),
        bdmc: '外贸企业调整申报',
        sbts: mockjs.mock('@float(1, 99, 0, 0)'),
      },
      {
        uuid: mockjs.mock('@guid'),
        bdmc: '跨境应税行为免退税申报明细表',
        sbts: mockjs.mock('@float(1, 99, 0, 0)'),
      },
    ]
  }

  const returnData = {
    code: '200',
    body: rows
  };
  await waitTime(500);
  return res.json(returnData);
}

// 数据报表 申报表清单2 免抵退税
async function querySbbqd2Data(req: Request, res: Response) {
  const result = [
    { bdmc: '出口货物劳务免抵退税申报明细表', sbts: 10 },
    { bdmc: '海关出口商品代码、名称、退税率调整对应表', sbts: 6 },
    { bdmc: '出口货物收汇申报表', sbts: 22 },
    { bdmc: '出口货物不能收汇申报表', sbts: 32 },
    { bdmc: '出口货物离岸价差异原因说明表', sbts: 41 },
    { bdmc: '视同自产进货明细清单', sbts: 45 },
    { bdmc: '国际运输（港澳台运输）免抵退税申报明细表', sbts: 16 },
    { bdmc: '航空国际运输收入清算账单申报明细表', sbts: 21 },
    { bdmc: '国际客运(含香港直通车)运输清算函件明细表', sbts: 5 },
    { bdmc: '中国铁路总公司国际货物运输明细表', sbts: 7 },
    { bdmc: '跨境应税行为免抵退税申报明细表', sbts: 90 },
    { bdmc: '跨境应税行为收讫营业款明细清单', sbts: 10 },
  ];
  const returnData = {
    code: '200',
    desc: '',
    body: result,
  };
  return res.json(returnData);
}

// 数据报表更新进度删除
async function delTz(req: Request, res: Response) {
  const returnData = {
    code: '200',
  };
  return res.json(returnData);
}

// 判断生产企业筛选条件内申报数据条数是否为0
async function checkSbsjtssfwl(req: Request, res: Response) {
  const returnData = {
    code: '200',
    body: {
      rowCount: mockjs.mock('@pick(0, 5)'),
      rows: [],
      kjysxwsbbz:mockjs.mock('@pick("N", "Y")'),
    }
  };
  await waitTime(500);
  return res.json(returnData);
}
async function checkXfssfwl(req: Request, res: Response) {
  const returnData = {
    code: '200',
    body: {
      flag:mockjs.mock('@pick("N", "Y")')
    }
  };
  await waitTime(500);
  return res.json(returnData);
}

async function add(req: Request, res: Response) {
  const returnData = {
    code: '200',
    body: {}
  };
  await waitTime(500);
  return res.json(returnData);
}

export default {
  'POST /yw/tz/gxrw': updateDataTz,
  'POST /hts/tz/cktstz/mtssb/querySbbqdData': querySbbqdData,
  'POST /hts/tz/ckts/mdtssb/sbbqd': querySbbqd2Data,
  'POST /yw/sb/sjfx/sjgx/del': delTz,
  'POST /yw/sb/sjfx/sc/checkSbsjtssfwl': checkSbsjtssfwl,
  'POST /yw/sb/sjfx/wm/checkXfssfwl': checkXfssfwl,
  'POST /yw/sb/sjfx/sjgx/add': add,
};
