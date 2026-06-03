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

// 发票申请单：明细信息
function sqdmxcx(req: Request, res: Response) {
  const rows: any[] = [];
  for (let i = 0; i < mockjs.mock('@integer(5, 10)'); i += 1) {
    rows.push(mockjs.mock({
      hwxh: i + 1,
      hwhyslwmc: mockjs.mock('@pick(["*玻璃制品*未加工的玻璃球", "*玻璃制品*其他未加工的玻璃管"])'),
      ggxh: mockjs.mock('@pick(["XXXXXXX", "YYYYYY"])'),
      jldwmc: mockjs.mock('@pick(["台", "千克"])'),
      sl: mockjs.mock('@integer(124, 934)'),
      dj: mockjs.mock('@float(10, 99, 2, 2)'),
      je: mockjs.mock('@float(10, 99, 2, 2)'),
      sl1: mockjs.mock('@pick([0.03, 0.06, 0.09, 0.13, 0])'),
      se: mockjs.mock('@float(10, 99, 2, 2)'),
      cjzj: mockjs.mock('@float(10, 99, 2, 2)'),
      sphfwssflhbbm: mockjs.mock('@float(10, 99, 2, 2)'),
      hwhlwjc: mockjs.mock('@pick(["机床", "机床1"])'),
      qyspbm: mockjs.mock('@pick(["12345678", "92345678"])'),
      qdbz1: mockjs.mock('@pick(["Y", "N"])'),
      fpssyhlxDm: mockjs.mock('@pick(["1", "2"])'),
      sbjldwDm: mockjs.mock('@pick(["11", "12"])'),
      sbjldwmc: mockjs.mock('@pick(["台", "千克"])'),
      hgjldwDm: mockjs.mock('@pick(["21", "22"])'),
      hgjldwmc: mockjs.mock('@pick(["台", "千克"])'),
      dejldwDm: mockjs.mock('@pick(["31", "32"])'),
      dejldwmc: mockjs.mock('@pick(["台", "千克"])'),
    }));
  }
  let rows1: any[] = [];
  for (let i = 0; i < mockjs.mock('@integer(2, 3)'); i += 1) {
    const children: any[] = [];
    for (let j = 0; j < mockjs.mock('@integer(2, 3)'); j += 1) {
      children.push(mockjs.mock({
        hh: j + 1,
        hwxh: '000' + (j + 1).toString(),
        key: (i + 1).toString() + (j + 1).toString(),
        hgckspDm: mockjs.mock('@integer(12345678, 92345678)'),
        hgspmc: mockjs.mock('@pick(["*玻璃制品*未加工的玻璃球", "*玻璃制品*其他未加工的玻璃管"])'),
        hwhyslwmc: mockjs.mock('@pick(["*玻璃制品*未加工的玻璃球", "*玻璃制品*其他未加工的玻璃管"])'),
        sl: mockjs.mock('@integer(124, 934)'),
        sbjldwDm: mockjs.mock('@pick(["11", "12"])'),
        sbjldwmc: mockjs.mock('@pick(["台", "千克"])'),
        hgjldwDm: mockjs.mock('@pick(["21", "22"])'),
        hgjldwmc: mockjs.mock('@pick(["台", "千克"])'),
        dejldwDm: mockjs.mock('@pick(["31", "32"])'),
        dejldwmc: mockjs.mock('@pick(["台", "千克"])'),
        ybhl: mockjs.mock('@pick(["13", "5"])'),
        ybje: mockjs.mock('@float(10, 99, 2, 2)'),
        rmbje: mockjs.mock('@float(10, 99, 2, 2)'),
      }));
    }
    rows1.push(mockjs.mock({
      key: i + 1,
      bgdhgbh: mockjs.mock('@integer(123456789123456789, 923456789123456789)'),
      children,
    }));
  }
  const returnData = {
    code: '200',
    body: {
      fpsqdxx: {
        fpsqduuid: "94189218CF264668A467DD5951C97791",
        djbh: "20220211000000000001",
        xhfnsrsbh: "823420474651183200",
        xhfnsrmc: "辉瑞制药有限公司",
        xhfdzdh: "海南省临夏回族自治州高新技术产业园区南路999号999层 021-99999999",
        xhfkhhjzh: "673225537582941",
        ghfnsrsbh: "11110200736441124Y",
        ghfnsrmc: "大连龙图信息技术股份有限公司",
        ghfdzdh: "大连中山广场动次打次街1+2号 1414141414",
        ghfkhhjzh: "中国人民银行-大连中山分行 531420210140016363001",
        qdbz1: "Y",
        je: 44970.39,
        sl1: 0.03,
        se: 21803.29,
        jshj: 44970.39,
        bz: "sb ,\n报关单:520720,\n备案号:bah-1122",
        skr: "78",
        fhrxm: "123",
        kpr: "676"
      },
      hwxxList: rows,
      bgdxxList: rows1,
    },
  };
  return res.json(returnData);
}

// 发票申请单：发票申请单调整
function xzsqdtzmxcx(req: Request, res: Response) {
  const rows = [
    {
      fpsqduuid: '1', djbh: '1234567891234567890', ghfnsrmc: '龙图1', ghfnsrsbh: '1111111111', ghfdzdh: '0411-88888888', ghfkhhjzh: '中国银行 11111111',
      children: [
        { fpsqduuid: '1', djbh: '1234567891234567890', uuid: '11', hh: '1', bgdhgbh: '371120210000335451', hwxh: '01', hgspmc: '针织衫', jldwmc: '件', sl: 88, je: 162.77, sl1: 0, se: 4.82, fpssyhlxDm: '1' },
        { fpsqduuid: '1', djbh: '1234567891234567890', uuid: '12', hh: '2', bgdhgbh: '371120210000335452', hwxh: '02', hgspmc: '针织裙', jldwmc: '件', sl: 66, je: 262.63, sl1: 0.09, se: 4.82, fpssyhlxDm: '' },
        { fpsqduuid: '1', djbh: '1234567891234567890', uuid: '13', hh: '3', bgdhgbh: '371120210000335453', hwxh: '03', hgspmc: '毛衣', jldwmc: '件', sl: 55, je: 356.75, sl1: 0.06, se: 4.82, fpssyhlxDm: '' },
      ]
    },
    {
      fpsqduuid: '2', djbh: '1234567891234567891', ghfnsrmc: '龙图2', ghfnsrsbh: '2222222222', ghfdzdh: '0411-22222222', ghfkhhjzh: '招商银行 22222222',
      children: [
        { fpsqduuid: '2', djbh: '1234567891234567891', uuid: '21', hh: '1', bgdhgbh: '371120210000335454', hwxh: '01', hgspmc: '针织裙', jldwmc: '件', sl: 123, je: 359.62, sl1: 0, se: 4.82, fpssyhlxDm: '' },
        { fpsqduuid: '2', djbh: '1234567891234567891', uuid: '22', hh: '2', bgdhgbh: '371120210000335455', hwxh: '02', hgspmc: '针织衫', jldwmc: '件', sl: 222, je: 754.31, sl1: 0.03, se: 4.82, fpssyhlxDm: '' },
      ]
    },
    {
      fpsqduuid: '3', djbh: '1234567891234567892', ghfnsrmc: '龙图3', ghfnsrsbh: '3333333333', ghfdzdh: '0411-33333333', ghfkhhjzh: '交通银行 33333333',
      children: [
        { fpsqduuid: '3', djbh: '1234567891234567892', uuid: '31', hh: '1', bgdhgbh: '371120210000335456', hwxh: '01', hgspmc: '针织衫', jldwmc: '件', sl: 4444, je: 1014.53, sl1: 0.03, se: 4.82, fpssyhlxDm: '' },
        { fpsqduuid: '3', djbh: '1234567891234567892', uuid: '32', hh: '2', bgdhgbh: '371120210000335457', hwxh: '02', hgspmc: '针织裙', jldwmc: '件', sl: 3333, je: 89.63, sl1: 0.13, se: 4.82, fpssyhlxDm: '' },
      ]
    },
  ];
  const returnData = {
    code: '200',
    body: rows,
  };
  return res.json(returnData);
}

async function queryAbgdHl(req: Request, res: Response) {
  let rows: any[] = [];
  for (let i = 0; i < 2; i += 1) {
    rows.push(mockjs.mock({
      cjhbzmDm: mockjs.mock('@pick(["USD", "HKD", "MOP", "SGD"])'),
      ckym: mockjs.mock('@pick(["202110", "202111", "202112"])'),
      ckrq1: mockjs.mock('@integer(1579072395000, 1610694795000)'),
      sbym: mockjs.mock('@pick(["202110", "202111", "202112"])'),
      sbrq: mockjs.mock('@integer(1579072395000, 1610694795000)'),
      rmbhl: mockjs.mock('@pick(["665.55","847.52"])'),
      myhl: mockjs.mock('@pick(["665.55","847.52"])'),
      ckbgdhs: mockjs.mock('@integer(123456789123456789, 923456789123456789)') + "",
    }));
  }
  const returnData = {
    code: '200',
    body: rows,
  };
  await waitTime(500);
  return res.json(returnData);
}
// 外销商品管理：表单查询
async function wxspmxcx(req: Request, res: Response) {
  const returnData = {
    code: '200',
    body: getRowData(),
  };
  await waitTime(500);
  return res.json(returnData);
}

// 其他商品管理：表单查询
async function qtspmxcx(req: Request, res: Response) {
  const returnData = {
    code: '200',
    body: getRowData(),
  };
  await waitTime(500);
  return res.json(returnData);
}

// 查询税控盘类型和发票类型
function queryDayHlPage(req: Request, res: Response) {
  const { body } = req;
  const temp: any = [];
  for (let i = 1; i <= 28; i++) {
    const sj = mockjs.mock('@float(5, 900, 5, 5)');
    temp.push({ hbzmDm: body.hlbz, hlny: body.nyHl, hlrq: mockjs.mock('@date("MMddHHmmss")'), rmbhl: sj, gzrbz: mockjs.mock('@pick(["Y","N"])'), })
  }
  let returnData = {
    code: '200',
    desc: '',
    body: {
      fphlxqgzDm: '12',
      hlglpzVo: temp,
      sbqyuuid: 'ee46ae56e3b44983a9f6e74c36504ca9',
    },
  };
  return res.json(returnData);
}

// 共通提示信息
async function gtTsxx(req: Request, res: Response) {
  const returnData = {
    code: '200',
    desc: '操作成功',
    body: {
      bgdts: mockjs.mock('@pick(["11","22","5"])'),
      spsl: mockjs.mock('@pick(["4","3","5","7"])'),
      je: mockjs.mock('@float(999, 999999, 2, 2)'),
      bts: mockjs.mock('@pick(["1","2","3"])'),
      sp: mockjs.mock('@pick(["4","3","5","7"])'),
      btsje: mockjs.mock('@float(999, 999999, 2, 2)'),
      bgdzs: mockjs.mock('@pick(["11","22","5"])'),
      ykpbgdzs: mockjs.mock('@pick(["11","22","5"])'),
      wkpbgdzs: mockjs.mock('@pick(["11","22","5"])'),
      kkpbgdzs: mockjs.mock('@pick(["11","22","5"])'),
      kkphwts: mockjs.mock('@pick(["4","3","5","7"])'),
      kkprmbje: mockjs.mock('@float(999, 999999, 2, 2)'),
      bkkpbgdzs: mockjs.mock('@pick(["11","22","5"])'),
      bkkphwts: mockjs.mock('@pick(["4","3","5","7"])'),
      bkkprmbje: mockjs.mock('@float(999, 999999, 2, 2)'),
      fpsqdzje: mockjs.mock('@float(999, 999999, 2, 2)'),
      fpsqdsl: mockjs.mock('@pick(["11","22","5"])'),
      qrkpZsms: mockjs.mock('@pick(["11","22","5"])'),
      hjjems: mockjs.mock('@float(999, 999999, 2, 2)'),
      wppbgdzs: mockjs.mock('@pick(["11","22","5"])'),
      yxsl: mockjs.mock('@float(1, 999, 0, 0)'),
      zrwuuid: mockjs.mock('@guid'),
    },
  };
  await waitTime(500);
  return res.json(returnData);
}

//客户管理
async function querykhpzform(req: Request, res: Response) {
  const returnData = {
    code: '200',
    body: getRowData(),
  };
  return res.json(returnData);
}

// 发票配置 销售方配置查询
async function xsfpzcx(req: Request, res: Response) {
  const returnData = {
    code: '200',
    desc: '操作成功',
    body: {
      xsfzhpzVoList: [
        { xh: 1, yhzhmc: "工商银行", yhzh: "21038477412039123019281", qybz: 'Y' },
        { xh: 2, yhzhmc: "大连银行", yhzh: "6882312009712387471233", qybz: 'N' }
      ],
      dhhm: "13298432414",
      dz: "大连甘井子区七贤路",
      fhr1: "王茹",
      kpr: "郭模",
      xsfNsrmc: "大连科技有限公司",
      shxydm: "9132012A312551M",
      skr: "申秦"
    },
  };
  await waitTime(500);
  return res.json(returnData);
}

// 发票配置 备注查询
async function bzglcx(req: Request, res: Response) {
  const returnData = {
    code: '200',
    desc: '操作成功',
    body: {
      ywzdxlb: [
        // {
        //   "gxxh": 1,
        //   "fpbzywzdxh": 1,
        //   "lbm": '',
        //   "fpbzywzdylsj": "350220210021522364",
        //   "xzbz2": "Y",
        //   "fpbzywzdDm": "01",
        //   "fpbzywzdzwm": "报关单号",
        //   "fpbzywzdywm": "BGDHGBH",
        //   "sbqyuuid": "b0df566829e74c48a9cb3c75b06ff740"
        // },  
        {
          "gxxh": 1,
          "fpbzywzdxh": 1,
          "lbm": '流水号',
          "fpbzywzdylsj": "350220210021522364",
          "xzbz2": "N",
          "fpbzywzdDm": "01",
          "fpbzywzdzwm": "单据号",
          "fpbzywzdywm": "DJBH",
          "sbqyuuid": "b0df566829e74c48a9cb3c75b06ff740"
        }, {
          "gxxh": 2,
          "fpbzywzdxh": 2,
          "lbm": null,
          "fpbzywzdylsj": "USD",
          "xzbz2": "N",
          "fpbzywzdDm": "02",
          "fpbzywzdzwm": "原币币制",
          "fpbzywzdywm": "CJHBMC",
          "sbqyuuid": "b0df566829e74c48a9cb3c75b06ff740"
        }, {
          "gxxh": 3,
          "fpbzywzdxh": 3,
          "lbm": null,
          "fpbzywzdylsj": "632.45",
          "xzbz2": "N",
          "fpbzywzdDm": "03",
          "fpbzywzdzwm": "原币汇率",
          "fpbzywzdywm": "CJHBHL",
          "sbqyuuid": "b0df566829e74c48a9cb3c75b06ff740"
        }, {
          "gxxh": 4,
          "fpbzywzdxh": 4,
          "lbm": null,
          "fpbzywzdylsj": "674",
          "xzbz2": "Y",
          "fpbzywzdDm": "04",
          "fpbzywzdzwm": "原币金额（总）",
          "fpbzywzdywm": "CJZJ",
          "sbqyuuid": "b0df566829e74c48a9cb3c75b06ff740"
        }, {
          "gxxh": 5,
          "fpbzywzdxh": 5,
          "lbm": null,
          "fpbzywzdylsj": "FOB",
          "xzbz2": "N",
          "fpbzywzdDm": "05",
          "fpbzywzdzwm": "成交方式",
          "fpbzywzdywm": "HGCJFSMC",
          "sbqyuuid": "b0df566829e74c48a9cb3c75b06ff740"
        }, {
          "gxxh": 6,
          "fpbzywzdxh": 6,
          "lbm": null,
          "fpbzywzdylsj": "110",
          "xzbz2": "N",
          "fpbzywzdDm": "06",
          "fpbzywzdzwm": "监管方式代码",
          "fpbzywzdywm": "JGFS_DM",
          "sbqyuuid": "b0df566829e74c48a9cb3c75b06ff740"
        }, {
          "gxxh": 7,
          "fpbzywzdxh": 7,
          "lbm": null,
          "fpbzywzdylsj": "一般贸易",
          "xzbz2": "N",
          "fpbzywzdDm": "07",
          "fpbzywzdzwm": "监管方式名称",
          "fpbzywzdywm": "JGFSMC",
          "sbqyuuid": "b0df566829e74c48a9cb3c75b06ff740"
        }, {
          "gxxh": 8,
          "fpbzywzdxh": 8,
          "lbm": null,
          "fpbzywzdylsj": "外港海关",
          "xzbz2": "N",
          "fpbzywzdDm": "08",
          "fpbzywzdzwm": "出口口岸",
          "fpbzywzdywm": "HGGQKAJC",
          "sbqyuuid": "b0df566829e74c48a9cb3c75b06ff740"
        }, {
          "gxxh": 9,
          "fpbzywzdxh": 9,
          "lbm": null,
          "fpbzywzdylsj": "746.45",
          "xzbz2": "N",
          "fpbzywzdDm": "09",
          "fpbzywzdzwm": "美元FOB价",
          "fpbzywzdywm": "MYLAJ",
          "sbqyuuid": "b0df566829e74c48a9cb3c75b06ff740"
        }, {
          "gxxh": 10,
          "fpbzywzdxh": 10,
          "lbm": null,
          "fpbzywzdylsj": "F2394533",
          "xzbz2": "N",
          "fpbzywzdDm": "10",
          "fpbzywzdzwm": "合同协议号",
          "fpbzywzdywm": "CKHTH",
          "sbqyuuid": "b0df566829e74c48a9cb3c75b06ff740"
        }, {
          "gxxh": 11,
          "fpbzywzdxh": 11,
          "lbm": null,
          "fpbzywzdylsj": "C3232132112",
          "xzbz2": "N",
          "fpbzywzdDm": "11",
          "fpbzywzdzwm": "备案号",
          "fpbzywzdywm": "BAH",
          "sbqyuuid": "b0df566829e74c48a9cb3c75b06ff740"
        }, {
          "gxxh": 12,
          "fpbzywzdxh": 12,
          "lbm": null,
          "fpbzywzdylsj": "2020/9/19",
          "xzbz2": "N",
          "fpbzywzdDm": "12",
          "fpbzywzdzwm": "出口日期",
          "fpbzywzdywm": "CKRQ_1",
          "sbqyuuid": "b0df566829e74c48a9cb3c75b06ff740"
        }, {
          "gxxh": 13,
          "fpbzywzdxh": 13,
          "lbm": null,
          "fpbzywzdylsj": "MAT1231A",
          "xzbz2": "N",
          "fpbzywzdDm": "13",
          "fpbzywzdzwm": "提运单号",
          "fpbzywzdywm": "TYDH",
          "sbqyuuid": "b0df566829e74c48a9cb3c75b06ff740"
        }, {
          "gxxh": 14,
          "fpbzywzdxh": 14,
          "lbm": null,
          "fpbzywzdylsj": "2",
          "xzbz2": "N",
          "fpbzywzdDm": "14",
          "fpbzywzdzwm": "运输方式代码",
          "fpbzywzdywm": "YSFS_DM",
          "sbqyuuid": "b0df566829e74c48a9cb3c75b06ff740"
        }, {
          "gxxh": 15,
          "fpbzywzdxh": 15,
          "lbm": null,
          "fpbzywzdylsj": "水路运输",
          "xzbz2": "N",
          "fpbzywzdDm": "15",
          "fpbzywzdzwm": "运输方式名称",
          "fpbzywzdywm": "YSFSMC",
          "sbqyuuid": "b0df566829e74c48a9cb3c75b06ff740"
        }, {
          "gxxh": 16,
          "fpbzywzdxh": 16,
          "lbm": null,
          "fpbzywzdylsj": "USA",
          "xzbz2": "N",
          "fpbzywzdDm": "16",
          "fpbzywzdzwm": "最终目的国（地区）数字代码",
          "fpbzywzdywm": "ZZMDGDQSZ_DM",
          "sbqyuuid": "b0df566829e74c48a9cb3c75b06ff740"
        }, {
          "gxxh": 17,
          "fpbzywzdxh": 17,
          "lbm": null,
          "fpbzywzdylsj": "美国",
          "xzbz2": "N",
          "fpbzywzdDm": "17",
          "fpbzywzdzwm": "最终目的国（地区）简称",
          "fpbzywzdywm": "ZZMDGDQJC",
          "sbqyuuid": "b0df566829e74c48a9cb3c75b06ff740"
        }, {
          "gxxh": 18,
          "fpbzywzdxh": 18,
          "lbm": null,
          "fpbzywzdylsj": "0114",
          "xzbz2": "N",
          "fpbzywzdDm": "18",
          "fpbzywzdzwm": "货主单位地区代码",
          "fpbzywzdywm": "HZDWDQ_DM",
          "sbqyuuid": "b0df566829e74c48a9cb3c75b06ff740"
        }, {
          "gxxh": 19,
          "fpbzywzdxh": 19,
          "lbm": null,
          "fpbzywzdylsj": "中国",
          "xzbz2": "N",
          "fpbzywzdDm": "19",
          "fpbzywzdzwm": "国内地区名称",
          "fpbzywzdywm": "GNDQMC",
          "sbqyuuid": "b0df566829e74c48a9cb3c75b06ff740"
        }, {
          "gxxh": 20,
          "fpbzywzdxh": 20,
          "lbm": null,
          "fpbzywzdylsj": "1234.36",
          "xzbz2": "N",
          "fpbzywzdDm": "20",
          "fpbzywzdzwm": "运费金额",
          "fpbzywzdywm": "YFJE",
          "sbqyuuid": "b0df566829e74c48a9cb3c75b06ff740"
        }, {
          "gxxh": 21,
          "fpbzywzdxh": 21,
          "lbm": null,
          "fpbzywzdylsj": "2315.21",
          "xzbz2": "N",
          "fpbzywzdDm": "21",
          "fpbzywzdzwm": "保费金额",
          "fpbzywzdywm": "BFJE",
          "sbqyuuid": "b0df566829e74c48a9cb3c75b06ff740"
        }, {
          "gxxh": 22,
          "fpbzywzdxh": 22,
          "lbm": null,
          "fpbzywzdylsj": "5221.1",
          "xzbz2": "N",
          "fpbzywzdDm": "22",
          "fpbzywzdzwm": "杂费金额",
          "fpbzywzdywm": "ZFJE_1",
          "sbqyuuid": "b0df566829e74c48a9cb3c75b06ff740"
        }, {
          "gxxh": 23,
          "fpbzywzdxh": 23,
          "lbm": null,
          "fpbzywzdylsj": "1/5",
          "xzbz2": "N",
          "fpbzywzdDm": "23",
          "fpbzywzdzwm": "发票序号",
          "fpbzywzdywm": "FPXH",
          "sbqyuuid": "b0df566829e74c48a9cb3c75b06ff740"
        }, {
          "gxxh": 24,
          "fpbzywzdxh": 24,
          "lbm": null,
          "fpbzywzdylsj": "456.86",
          "xzbz2": "Y",
          "fpbzywzdDm": "24",
          "fpbzywzdzwm": "人民币FOB价",
          "fpbzywzdywm": "RMBLAJ",
          "sbqyuuid": "b0df566829e74c48a9cb3c75b06ff740"
        }, {
          "gxxh": 25,
          "fpbzywzdxh": 25,
          "lbm": null,
          "fpbzywzdylsj": "XXXX有限公司",
          "xzbz2": "Y",
          "fpbzywzdDm": "25",
          "fpbzywzdzwm": "境外收货人名称",
          "fpbzywzdywm": "JWSHRMC",
          "sbqyuuid": "b0df566829e74c48a9cb3c75b06ff740"
        }, {
          "gxxh": 26,
          "fpbzywzdxh": 26,
          "lbm": null,
          "fpbzywzdylsj": "454.98",
          "xzbz2": "Y",
          "fpbzywzdDm": "26",
          "fpbzywzdzwm": "票面金额（原币）",
          "fpbzywzdywm": "PMJEYB",
          "sbqyuuid": "b0df566829e74c48a9cb3c75b06ff740"
        }, {
          "gxxh": 27,
          "fpbzywzdxh": 27,
          "lbm": null,
          "fpbzywzdylsj": "178.56",
          "xzbz2": "Y",
          "fpbzywzdDm": "27",
          "fpbzywzdzwm": "票面金额（人民币）",
          "fpbzywzdywm": "PMJERMB",
          "sbqyuuid": "b0df566829e74c48a9cb3c75b06ff740"
        }, {
          "gxxh": 28,
          "fpbzywzdxh": 28,
          "lbm": null,
          "fpbzywzdylsj": "199.43",
          "xzbz2": "Y",
          "fpbzywzdDm": "28",
          "fpbzywzdzwm": "原币金额（拆分）",
          "fpbzywzdywm": "YBJECF",
          "sbqyuuid": "b0df566829e74c48a9cb3c75b06ff740"
        }, {
          "gxxh": 29,
          "fpbzywzdxh": 29,
          "lbm": null,
          "fpbzywzdylsj": "01",
          "xzbz2": "N",
          "fpbzywzdDm": "29",
          "fpbzywzdzwm": "项号",
          "fpbzywzdywm": "XH",
          "sbqyuuid": "b0df566829e74c48a9cb3c75b06ff740"
        }],
      jcsjx: {
        fpbzzdxfgfDm: "2",
        fpbzsbwz: " ",
        fpbzzdxhhbz: "Y",
        fpbzgdjqws: 9,
        fpbzdtsjfgfDm: "4",
      }
    },
  };
  await waitTime(500);
  return res.json(returnData);
}

// 未开票报关单
async function bgdwksj(req: Request, res: Response) {
  const returnData = {
    code: '200',
    desc: '操作成功',
    body: {
      wkbgdsl: 10,
      wkbgdspsl: 20,
    },
  };
  await waitTime(500);
  return res.json(returnData);
}

// 待开发票申请单
async function fpsqdsj(req: Request, res: Response) {
  const returnData = {
    code: '200',
    desc: '操作成功',
    body: {
      fpsqddkfpsl: 10,
      fpsqddkfpje: 123456.23,
    },
  };
  await waitTime(500);
  return res.json(returnData);
}

// 出口发票开具情况统计
async function qrkpsj(req: Request, res: Response) {
  const returnData = {
    code: '200',
    desc: '操作成功',
    body: {
      yqrkpfpje: 65432.01,
      yqrkpfpsl: 14,
    },
  };
  await waitTime(500);
  return res.json(returnData);
}

// 发票开具区间统计
async function qjlskpsj(req: Request, res: Response) {
  const rows: any = [
    { kpyf: '202101', fpsl: 220, fpje: 45456.21, hwmc: '改良种用野马', khmc: 'IN ANKSIDE' },
    { kpyf: '202102', fpsl: 120, fpje: 23456.89, hwmc: '计算机网络设备', khmc: 'IE SKAHD' },
    { kpyf: '202103', fpsl: 52, fpje: 10126.74, hwmc: '喷枪*喷嘴', khmc: 'EISHSAJK' },
    { kpyf: '202104', fpsl: 66, fpje: 453456.26, hwmc: '其他钢铁结构', khmc: 'ONTNSIA' },
    { kpyf: '202105', fpsl: 170, fpje: 323456.04, hwmc: '其他螺钉及螺母', khmc: 'CENSJAOD' },
    { kpyf: '202106', fpsl: 185, fpje: 56421.74, hwmc: '其他毛皮衣服', khmc: 'TEJSKAJH' },
    { kpyf: '202107', fpsl: 10, fpje: 56214.23, hwmc: '其他非农用液体泵', khmc: 'RWOEANKS' },
    { kpyf: '202108', fpsl: 256, fpje: 110236.53, hwmc: '其他塑料制品', khmc: '大连龙图信息技术股份有限公司1' },
    { kpyf: '202109', fpsl: 187, fpje: 200123.71, hwmc: '智能卡', khmc: 'SDHNAKS' },
    { kpyf: '202110', fpsl: 33, fpje: 163214.36, hwmc: '其他木家具', khmc: '大连龙图信息技术股份有限公司' },
    { kpyf: '202111', fpsl: 8, fpje: 96542.38, hwmc: '豆制品', khmc: '慧税云服' },
    { kpyf: '202112', fpsl: 195, fpje: 185214.69, hwmc: '木制家具', khmc: '慧税云服1' },
  ];
  const returnData = {
    code: '200',
    desc: '操作成功',
    body: rows,
  };
  await waitTime(500);
  return res.json(returnData);
}

// 发票管理-发票文件回填提示信息
async function fpkjwjht(req: Request, res: Response) {
  const returnData = {
    code: '200',
    desc: '操作成功',
    body: [
      {
        "htxq": "发票回填成功，本次共成功回填0条数据",
        "htztdesc": "单据号1234567898764543-回填文件 - 副本回填成功",
        "tsxxbz": "Y",
        "tsxxlist": [
          {
            "xh": 1,
            "tsxx": "第（1）行",
            "sbyy": "备注中没有找到“流水号”，无法回填。"
          }
        ],
        "tsxxDcKey": "SDPFPWJHTXXXXXXXXX"
      }
    ],
  };
  await waitTime(500);
  return res.json(returnData);
}

// 按报关单开具  查询编辑开票信息
async function kbjkpbgdcx(req: Request, res: Response) {
  let rows: any[] = [];
  for (let i = 0; i < 5; i += 1) {
    const temp: any = [];
    for (let j = 0; j < 5; j += 1) {
      temp.push(mockjs.mock({
        bgdtybh: mockjs.mock('@integer(123456789123456789, 923456789123456789)'),
        bgdhgbh: mockjs.mock('@integer(123456789123456789, 923456789123456789)'),
        hwxh: mockjs.mock('@pick(["01","02"])'),
        ckbgdh: mockjs.mock('@integer(123456789123456789, 923456789123456789)') + '0' + mockjs.mock('@pick(["01","02"])'),
        ckrq1: '2021-03-02',
        ckhth: '99/JYSH/' + mockjs.mock('@integer(123456, 923456)') + 'HK',
        cjhbzmDm: mockjs.mock('@pick(["USD","JPY"])'),
        hgspmc: mockjs.mock('@pick(["塑料管","鸡蛋"])'),
        ckspDm: mockjs.mock('@pick(["3917320000","02011000"])'),
        hgckspDm: mockjs.mock('@pick(["3917320000","02011000"])'),
        ggxh: mockjs.mock('@pick(["0|2|密封用|非海绵橡胶|橡胶|非机器及仪器用|无品牌|","0|2|打扫清洁|PP","0|2|导电连接件|220-240V|无品牌|无型号|||"])'),
        jldwDm: mockjs.mock('@pick(["克","千克"])'),
        jldwmc: mockjs.mock('@pick(["克","千克"])'),
        sl: mockjs.mock('@float(999, 999999, 2, 2)'),
        cjzj: mockjs.mock('@float(999, 999999, 2, 2)'),
        sycjzj: mockjs.mock('@float(999, 999999, 2, 2)'),
      }));
    }
    rows.push(mockjs.mock({
      bgdtybh: mockjs.mock('@integer(123456789123456789, 923456789123456789)'),
      bgdhgbh: mockjs.mock('@integer(123456789123456789, 923456789123456789)'),
      ckrq1: '2021-03-02',
      ckhth: '99/JYSH/' + mockjs.mock('@integer(123456, 923456)') + 'HK',
      cjhbzmDm: mockjs.mock('@pick(["USD","JPY"])'),
      children: temp
    }));
  }
  const returnData = {
    code: '200',
    desc: '操作成功',
    body: rows,
  };
  await waitTime(500);
  return res.json(returnData);
}

// 操作成功
async function doSuccess(req: Request, res: Response) {
  const returnData = {
    code: '200',
    desc: '操作成功',
    body:{rtnCode:'2004'}
  };
  await waitTime(500);
  return res.json(returnData);
}

// 操作成功
async function doSuccessOrError(req: Request, res: Response) {
  const returnData = {
    code: mockjs.mock('@pick(["200", "400"])'),
    desc: '操作成功',
    msg: 'XXXXXXXXXXXXX',
  };
  await waitTime(500);
  return res.json(returnData);
}

// 导入模板开具-查询单据编号
async function queryDjbh(req: Request, res: Response) {
  const returnData = {
    code: '200',
    desc: '操作成功',
    body: '20220209000000000001'
  };
  await waitTime(500);
  return res.json(returnData);
}

// 发票申请单-确认开票统计查询
async function sqdqrkptj(req: Request, res: Response) {
  const returnData = {
    code: '200',
    desc: '操作成功',
    body: {
      fpsqdzs: 1123,
      kpje: 12345.12,
      bgdzs: 12312
    }
  };
  await waitTime(500);
  return res.json(returnData);
}

// 发票申请单
async function sqfpcx(req: Request, res: Response) {
  const rows: any = [];
  // 发票管理-发票开具查询
  rows.push({ fpzt: 'dk', fpsqduuid: '1008', djbh: "2111069999999990002", kpwjmc: "2111069999999990002.xml", fphm: "12345678", fpdm: "0123456789", kprq: "1618761600000", fpje: 183434.56, bgdhgbhjh: "123456789123456789,123456789123456780", fplx: "增值税电子发票", kjlx: "报关单开具", qrkpsj: 1618761600000, fpse: 22434.56, fpbz: '报关单号：123456789123456789，贸易方式：一般贸易，汇率657.18', xzcs: 1 },);
  rows.push({ fpzt: 'dk', fpsqduuid: '1009', djbh: "2111069999999990003", kpwjmc: "2111069999999990003.xml", fphm: "", fpdm: "", kprq: "", fpje: 183434.56, bgdhgbhjh: "123456789123456789,123456789123456780", fplx: "增值税电子发票", kjlx: "报关单开具", qrkpsj: 1618761600000, fpse: 22434.56, fpbz: '报关单号：123456789123456789，贸易方式：一般贸易，汇率657.18', xzcs: 1 },);
  rows.push({ fpzt: 'dk', fpsqduuid: '1010', djbh: "2111069999999990004", kpwjmc: "2111069999999990004.xml", fphm: "12345678", fpdm: "0123456789", kprq: "1618761600000", fpje: 183434.56, bgdhgbhjh: "123456789123456789,123456789123456780", fplx: "增值税电子发票", kjlx: "报关单开具", qrkpsj: 1618761600000, fpse: 22434.56, fpbz: '报关单号：123456789123456789，贸易方式：一般贸易，汇率657.18', xzcs: 1 },);
  rows.push({ fpzt: 'dk', fpsqduuid: '1011', djbh: "2111069999999990005", kpwjmc: "2111069999999990005.xml", fphm: "", fpdm: "", kprq: "", fpje: 183434.56, bgdhgbhjh: "123456789123456789,123456789123456780", fplx: "增值税电子发票", kjlx: "代理证明开具", qrkpsj: 1618761600000, fpse: 22434.56, fpbz: '报关单号：123456789123456789，贸易方式：一般贸易，汇率657.18', xzcs: 1 },);
  rows.push({ fpzt: 'ch', fpsqduuid: '1012', djbh: "2111069999999990006", kpwjmc: "2111069999999990006.xml", fphm: "12345678", fpdm: "0123456789", kprq: "1618761600000", fpje: 183434.56, bgdhgbhjh: "123456789123456789,123456789123456780", fplx: "增值税电子发票", kjlx: "代理证明开具", qrkpsj: 1618761600000, fpse: 22434.56, fpbz: '报关单号：123456789123456789，贸易方式：一般贸易，汇率657.18', xzcs: 1 },);
  rows.push({ fpzt: 'ch', fpsqduuid: '1013', djbh: "2111069999999990007", kpwjmc: "2111069999999990007.xml", fphm: "12345678", fpdm: "0123456789", kprq: "1618761600000", fpje: 183434.56, bgdhgbhjh: "123456789123456789,123456789123456780", fplx: "增值税电子发票", kjlx: "代理证明开具", qrkpsj: 1618761600000, fpse: 22434.56, fpbz: '报关单号：123456789123456789，贸易方式：一般贸易，汇率657.18', xzcs: 1 },);
  rows.push({ fpzt: 'yk', fpsqduuid: '1014', djbh: "2111069999999990008", kpwjmc: "2111069999999990008.xml", fphm: "12345678", fpdm: "0123456789", kprq: "1618761600000", fpje: 183434.56, bgdhgbhjh: "123456789123456789,123456789123456780", fplx: "增值税电子发票", kjlx: "代理证明开具", qrkpsj: 1618761600000, fpse: 22434.56, fpbz: '报关单号：123456789123456789，贸易方式：一般贸易，汇率657.18', xzcs: 1 },);
  rows.push({ fpzt: 'ch', fpsqduuid: '1015', djbh: "2111069999999990009", kpwjmc: "2111069999999990009.xml", fphm: "12345678", fpdm: "0123456789", kprq: "1618761600000", fpje: 183434.56, bgdhgbhjh: "123456789123456789,123456789123456780", fplx: "增值税电子发票", kjlx: "导入开具", qrkpsj: 1618761600000, fpse: 22434.56, fpbz: '报关单号：123456789123456789，贸易方式：一般贸易，汇率657.18', xzcs: 0 },);
  rows.push({ fpzt: 'ch', fpsqduuid: '1016', djbh: "2111069999999990010", kpwjmc: "2111069999999990010.xml", fphm: "12345678", fpdm: "0123456789", kprq: "1618761600000", fpje: 183434.56, bgdhgbhjh: "123456789123456789,123456789123456780", fplx: "增值税电子发票", kjlx: "导入开具", qrkpsj: 1618761600000, fpse: 22434.56, fpbz: '报关单号：123456789123456789，贸易方式：一般贸易，汇率657.18', xzcs: 0 },);
  rows.push({ fpzt: 'zf', fpsqduuid: '1017', djbh: "2111069999999990011", kpwjmc: "2111069999999990011.xml", fphm: "12345678", fpdm: "0123456789", kprq: "1618761600000", fpje: 183434.56, bgdhgbhjh: "123456789123456789,123456789123456780", fplx: "增值税电子发票", kjlx: "导入开具", qrkpsj: 1618761600000, fpse: 22434.56, fpbz: '报关单号：123456789123456789，贸易方式：一般贸易，汇率657.18', xzcs: 0 },);
  rows.push({ fpzt: 'zf', fpsqduuid: '1018', djbh: "2111069999999990012", kpwjmc: "2111069999999990012.xml", fphm: "12345678", fpdm: "0123456789", kprq: "1618761600000", fpje: 183434.56, bgdhgbhjh: "123456789123456789,123456789123456780", fplx: "增值税电子发票", kjlx: "导入开具", qrkpsj: 1618761600000, fpse: 22434.56, fpbz: '报关单号：123456789123456789，贸易方式：一般贸易，汇率657.18', xzcs: 0 },);
  rows.push({ fpzt: 'zf', fpsqduuid: '1019', djbh: "2111069999999990013", kpwjmc: "2111069999999990013.xml", fphm: "12345678", fpdm: "0123456789", kprq: "1618761600000", fpje: 183434.56, bgdhgbhjh: "123456789123456789,123456789123456780", fplx: "增值税电子发票", kjlx: "采集开具", qrkpsj: 1618761600000, fpse: 22434.56, fpbz: '报关单号：123456789123456789，贸易方式：一般贸易，汇率657.18', xzcs: 0 },);
  rows.push({ fpzt: 'zf', fpsqduuid: '1020', djbh: "2111069999999990014", kpwjmc: "2111069999999990014.xml", fphm: "12345678", fpdm: "0123456789", kprq: "1618761600000", fpje: 183434.56, bgdhgbhjh: "123456789123456789,123456789123456780", fplx: "增值税电子发票", kjlx: "采集开具", qrkpsj: 1618761600000, fpse: 22434.56, fpbz: '报关单号：123456789123456789，贸易方式：一般贸易，汇率657.18', xzcs: 0 },);
  rows.push({ fpzt: 'qt', fpsqduuid: '1031', djbh: "2111069999999990015", kpwjmc: "2111069999999990015.xml", fphm: "12345678", fpdm: "0123456789", kprq: "1618761600000", fpje: 183434.56, bgdhgbhjh: "123456789123456789,123456789123456780", fplx: "增值税电子发票", kjlx: "采集开具", qrkpsj: 1618761600000, fpse: 22434.56, fpbz: '报关单号：123456789123456789，贸易方式：一般贸易，汇率657.18', xzcs: 0 },);
  const returnData = {
    code: '200',
    desc: '操作成功',
    body: {
      rows
    }
  };
  await waitTime(500);
  return res.json(returnData);
}

async function sjxzqzjy(req: Request, res: Response) {
  const rows: any = [];
  // 发票管理-数据下载前置检查
  const returnData = {
    code: '200',
    desc: '操作成功',
    body: {
      rows
    }
  };
  await waitTime(500);
  return res.json(returnData);
}

// 列表查询
async function queryPager(req: Request, res: Response) {
  const { body } = req;
  const { key, page } = body;
  let rows: any[] = [];
  for (let i = 0; i < 100; i += 1) {
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

async function ssflbmcx(req: Request, res: Response) {
  const { body } = req;
  const { key, page } = body;
  let rows: any[] = [];
  for (let i = 0; i < 10; i += 1) {
    rows.push(getRowData(key));
  }
  let returnData: any = {
    code: '200',
    body: rows,
  };
  return res.json(returnData);
}

// 发票申请单：发票信息
function queryFormFpsqdFpxx(req: Request, res: Response) {
  let rows: any[] = [];
  for (let i = 0; i < mockjs.mock('@integer(5, 18)'); i += 1) {
    rows.push(mockjs.mock({
      hh: i + 1,
      hwhyslwmc: mockjs.mock('@pick(["*玻璃制品*未加工的玻璃球", "*玻璃制品*其他未加工的玻璃管"])'),
      ggxh: mockjs.mock('@pick(["XXXXXXX", "YYYYYY"])'),
      jldwmc: mockjs.mock('@pick(["台", "千克"])'),
      sl: mockjs.mock('@integer(124, 934)'),
      dj: mockjs.mock('@float(10, 99, 2, 2)'),
      je: mockjs.mock('@float(10, 99, 2, 2)'),
      hsdj: mockjs.mock('@float(10, 99, 2, 2)'),
      jshj: mockjs.mock('@float(10, 99, 2, 2)'),
      sl1: mockjs.mock('@pick([0.03, 0.06, 0.09, 0.13, 0])'),
      se: mockjs.mock('@float(10, 99, 2, 2)'),
      cjzj: mockjs.mock('@float(10, 99, 2, 2)'),
      sphfwssflhbbm: mockjs.mock('@float(10, 99, 2, 2)'),
      hwhlwjc: mockjs.mock('@pick(["机床", "机床1"])'),
      bbh: '39.0',
      qyspbm: mockjs.mock('@pick(["12345678", "92345678"])'),
      hsbz1: null,
      syyhzcbz: mockjs.mock('@pick(["0", "1"])'),
      lsllxDm: mockjs.mock('@pick(["1", "2"])'),
      fpssyhlxDm: mockjs.mock('@pick(["1", "2"])'),
      kce: mockjs.mock('@float(10, 99, 2, 2)'),
      sec: mockjs.mock('@float(10, 99, 2, 2)'),
      zbuuid: mockjs.mock('@guid'),
    }));
  }
  const returnData = {
    code: '200',
    body: {
      fpsqdxx: {
        zbuuid: "94189218CF264668A467DD5951C97791",
        djbh: "20220211000000000001",
        xhfnsrsbh: "823420474651183200",
        xhfnsrmc: "辉瑞制药有限公司",
        xhfdzdh: "海南省临夏回族自治州高新技术产业园区南路999号999层 021-99999999",
        xhfkhhjzh: "673225537582941",
        ghfnsrsbh: "11110200736441124Y",
        ghfnsrmc: "大连龙图信息技术股份有限公司",
        ghfdzdh: "大连中山广场动次打次街1+2号 1414141414",
        ghfkhhjzh: "中国人民银行-大连中山分行 531420210140016363001",
        qdbz1: "Y",
        je: 44970.39,
        sl1: 0.03,
        se: 21803.29,
        jshj: 44970.39,
        bz: "sb ,\n报关单:520720,\n备案号:bah-1122",
        skr: "78",
        fhrxm: "123",
        kpr: "676"
      },
      hwxxList: rows,
    },
  };
  return res.json(returnData);
}

// 下载
async function importTemplate(req: Request, res: Response) {
  const returnData = {
    code: '200',
    desc: '操作成功',
    body: {
      blob: '',
      fileName: 'Mock',
    }
  };
  await waitTime(500);
  return res.json(returnData);
}

// 删除
async function deleteData(req: Request, res: Response) {
  let returnData = {
    code: '200',
    desc: '删除成功！'
  };
  return res.json(returnData);
}

async function qrkpjy(req: Request, res: Response) {
  const num = Math.floor(Math.random() * 10 + 1);
  let returnData = {
    code: '200',
    desc: '校验通过',
    msg: {},
  }
  if (num > 6) {
    const num2 = Math.floor(Math.random() * 10 + 1);
    if (num2 > 5) {
      returnData = {
        code: '900',
        desc: '校验未通过',
        msg: {
          jyxx: {
            dm: "02",
            cwxx: "企业信息未注册"
          }
        }
      }
    } else {
      returnData = {
        code: '900',
        desc: '校验未通过',
        msg: {
          jyxx: {
            dm: "01",
            cwxx: "基础开票配置XXXXXXXXXXX"
          }
        }
      }
    }

  }
  await waitTime(500);
  return res.json(returnData);
}




async function kpddxz(req: Request, res: Response) {
  const num = Math.floor(Math.random() * 10 + 1);
  let returnData = {
    code: '200',
    desc: '操作成功',
    body: null,
    msg: {},
  }
  if (num > 5) {
    returnData = {
      code: '900',
      desc: '操作失败',
      body: null,
      msg: [
        { djbh: 20211027134642010001, msg: '必填项为空' },
        { djbh: 20211027134642010001, msg: '数据格式错误' },
        { djbh: 20211027134642010001, msg: '必填项为空' },
      ]
    }
  }
  await waitTime(500);
  return res.json(returnData);
}

async function dyjcx(req: Request, res: Response) {
  const rows: any = [];
  // 发票管理-发票开具查询
  rows.push(
    {
      id: "123123123",
      printName: "canon Re1",
      mrbz: 'Y'
    },
  );

  const returnData = {
    code: '200',
    desc: '操作成功',
    body: {
      dyjList: rows
    }
  };
  await waitTime(500);
  return res.json(returnData);
}


async function sdpPrCode(req: Request, res: Response) {
  const num = Math.floor(Math.random() * 10 + 1);
  let xs = 'N'
  if (num < 5) {
    xs = 'Y'
  }
  const returnData = {
    code: '200',
    desc: '操作成功',
    body: {
      rzid: '0011111',
      slzt: '1', // 1：未扫码；2：已扫码；3：扫码失败
      nsrsbh: "91440605MA52ELCP2C",
      ewm: '/img/wechat_06.png'
    }
  };
  await waitTime(500);
  return res.json(returnData);
}

async function getSfrzcode(req: Request, res: Response) {
  // let ewm = '/img/wechat_02.png'
  // if(req.body?.num === '1') {
  //   ewm = '/img/wechat_06.png'
  // }

  const returnData = {
    code: '200',
    desc: '操作成功',
    body: {
      ewm: '/img/wechat_06.png',
      rzid: '00111',
      nsrsbh: "91440605MA52ELCP2C",
    }
  };
  await waitTime(500);
  return res.json(returnData);
}

async function getSfrzcode2(req: Request, res: Response) {
  const returnData = {
    code: '200',
    desc: '操作成功',
    body: {
      slzt: '1',
    }
  };
  await waitTime(500);
  return res.json(returnData);
}

let tjkpCount = 0
async function sdpqrkp(req: Request, res: Response) {
  tjkpCount = 1;
  const returnData = {
    code: '200',
    desc: '操作成功',
    body: {
      rtnCode: '2004',
      data: [{
        rtnId: "1111111111",
        fpsqduuid: "1111111"
      }],
      flag: "01"
    }
  };
  await waitTime(500);
  return res.json(returnData);
}

async function sdphdtjkp(req: Request, res: Response) {
  tjkpCount = 1;
  const returnData = {
    code: '200',
    desc: '操作成功',
    body: {
      rtnCode: '2005',
      data: [{
        rtnId: "1111111111",
        fpsqduuid: "1111111"
      }],
      flag: "01"
    }
  };
  await waitTime(500);
  return res.json(returnData);
}

async function sdpfphc(req: Request, res: Response) {
  tjkpCount = 1;
  const returnData = {
    code: '200',
    desc: '操作成功',
    body: {
      rtnCode: '2004',
      data: [{
        rtnId: "11111111",
        fpsqduuid: "222222222",
        djbh: "33333333333",
        hcyy: "1",
      }],
    }
  };
  await waitTime(500);
  return res.json(returnData);
}

async function sdpddtjkp(req: Request, res: Response) {
  tjkpCount++;
  let rtnCode = "2004"
  if (tjkpCount % 3 === 1) {
    rtnCode = "2004"
  } else if (tjkpCount % 3 === 2) {
    rtnCode = "2005"
  } else if (tjkpCount % 3 === 0) {
    rtnCode = '200';
  }
  const returnData = {
    code: '200',
    desc: '操作成功',
    body: {
      rtnCode, // 二维码认证失效
      data: [{
        rtnId: "2005",
        fpsqduuid: "2001"
      }],
      flag: "01"
    }
  };
  await waitTime(500);
  return res.json(returnData);
}

async function sdpddtjkp2(req: Request, res: Response) {
  const returnData = {
    code: '200',
    desc: '操作成功',
  };
  await waitTime(500);
  return res.json(returnData);
}

async function djmndl(req: Request, res: Response) {
  let state = '2010';
  if (req.body?.czlx === '1') {
    state = '2010';
  } else if (req.body?.czlx === '2') {
    state = '2011';
  } else if (req.body?.czlx === '3') {
    state = '200';
  }
  const returnData = {
    code: '200',
    desc: '操作成功',
    body: {
      rtnCode: state,
      // zzrlx: [{ zrrlxmc: '法定代表人', zrrlx: '01', qrzt: '00' }, { zrrlxmc: '财务负责人', zrrlx: '02', qrzt: '00' }, { zrrlxmc: '财务负责人', zrrlx: '03', qrzt: '00' }]
      zzrlx: '01',

    }
  };
  await waitTime(500);
  return res.json(returnData);
}

async function cxsddlxx(req: Request, res: Response) {

  const returnData = {
    "body": {
      "xfnsrsbh": "91440605MA52ELCP2C",
      "dzsjdlzh": "a123456",
      "dzsjdlmm": "123456",
      "bsrsfzjhm": "210304199809119900",
      "bsrsjh": "13156630009",
      "bsrxm": "1",
      "zrrlxdm": "01",
      "dllx": "0",
      "dlmm": "123456",
      "ssdq1": "13200000000"
    },
    "code": "200",
    "type": ""
  }
  
  await waitTime(500);
  return res.json(returnData);
}
async function kppzwh(req: Request, res: Response) {
  const ctbs = req.body?.data.ctbs;
  const fpzlDm1 = req.body?.data.fpzlDm1;
  const fpkjfsDm = req.body?.data.fpkjfsDm;
  let body = { sdpzcbz: "N" };
  if (ctbs === 'fpzlDm1' && fpzlDm1 === '5' && fpkjfsDm === '2') {
    body = { sdpzcbz: "Y" };
  } else if (ctbs === 'fpkjfsDm' && fpzlDm1 === '5' && fpkjfsDm === '2') {
    body = { sdpzcbz: "Y" };
  }
  const returnData = {
    code: '200',
    desc: '操作成功',
    body: body
  };
  await waitTime(500);
  return res.json(returnData);
}

async function skxxcx(req: Request, res: Response) {
  const num = Math.floor(Math.random() * 10 + 1);
  let zcbz = '0'
  if (num < 2) {
    zcbz = '1'
  } else if (num > 4) {
    zcbz = '2'
  }

  const returnData = {
    code: '200',
    desc: '操作成功',
    body: {
      zcbz: '2',
    }
  };
  await waitTime(500);
  return res.json(returnData);
}

async function fpztsxZx(req: Request, res: Response) {
  tjkpCount = 1;
  const returnData = {
    code: '200',
    desc: '操作成功',
    body: {
      rtnCode: '2005',
      data: [{
        rtnId: "1111111111",
        fpsqduuid: "1111111",
        hcyy: '11111111'
      }],
      flag: "01",
      sellerid: "1",
      lrrqq: "2023-03-01",
      lrrqz: "2023-03-01",
    }
  };
  await waitTime(500);
  return res.json(returnData);
}



async function qrkptj(req: Request, res: Response) {
  let returnData = {
    "body": {
      "fpsqdzs": 4,
      "kpje": 337969.36,
      "sehj": 23796.62
    },
    "code": "200",
    "msg": "成功"
  }
  await waitTime(500);
  return res.json(returnData);
}

async function checkDlt(req: Request, res: Response) {
  let returnData = {
    "body": {
      "dlbz":"N",
      // "rzbz":mockjs.mock('@pick(["Y","U"])'),
      "rzbz":"U",
      "jhbz":"N",
      "uuid":"123",
    },
    "code": "200",
    "msg": "成功"
  }
  await waitTime(500);
  return res.json(returnData);
}
async function queryDjdlzh(req: Request, res: Response) {
  let returnData = {
    "body": {
      "yhm":"18640906124",
    },
    "code": "200",
    "msg": "成功"
  }
  await waitTime(500);
  return res.json(returnData);
}


async function sdgxrzzt(req: Request, res: Response) {
  let returnData = {
    "body": {
      "dlbz":"Y",
      "rzbz":"Y",
      "jhbz":"Y",
      "uuid":"123",
    },
    "code": "200",
    "msg": "成功"
  }
  await waitTime(500);
  return res.json(returnData);
}

async function simulationLoginBymm(req: Request, res: Response) {
  let returnData ={
    "code": "200",
    "codeDesc": "成功",
    "msg": "登录请求申请成功！",
    "body": {
      "uuid": "CF02EF74F67A9D2295A63D5222A3C850"
    }
  }
  await waitTime(500);
  return res.json(returnData);
}
async function hqJ4RpaToken(req: Request, res: Response) {
  let returnData ={
    "body": {
        "msg": "",
        "code": "200",
        "token": "JWTeyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJDS1RTLlNCWFQuT05MSU5FLkhUU1NBQVMxNTEwMDAwMDAwMDkxNTEwMDAwNzExODgzNDFYVDE4NjQwOTA2MTI0Iiwic3ViIjoiMTg2NDA5MDYxMjQiLCJpYXQiOjE3MDY3NTk0MDQsImlzcyI6ImRkaXQiLCJleHAiOjE3MDY4MTk0MDQsImF1dGhvcml0aWVzIjoiW3tcImF1dGhvcml0eVwiOlwiUk9fWVdfU0lNVV8wMDAxXCJ9LHtcImF1dGhvcml0eVwiOlwiUk9fWVdfQklMTF8wMDAxXCJ9LHtcImF1dGhvcml0eVwiOlwiUk9fWVdfSlNTQl8wMDAxXCJ9LHtcImF1dGhvcml0eVwiOlwiUk9fWVdfWkRXRl8wMDAxXCJ9LHtcImF1dGhvcml0eVwiOlwiUk9fWVdfU0lNVV8wMDAxXCJ9LHtcImF1dGhvcml0eVwiOlwiUk9fWVdfQklMTF8wMDAxXCJ9LHtcImF1dGhvcml0eVwiOlwiUk9fWVdfSlNTQl8wMDAxXCJ9LHtcImF1dGhvcml0eVwiOlwiUk9fWVdfWkRXRl8wMDAxXCJ9XSIsInVzZXJJbmZvIjoie1wiYXJlYUlkXCI6XCIxNTEwMDAwMDAwMFwiLFwiYWNjZXNzQ2xpZW50SWRcIjpcIkNLVFMuU0JYVC5PTkxJTkUuSFRTU0FBU1wiLFwicXlic1wiOlwiOTE1MTAwMDA3MTE4ODM0MVhUXCIsXCJ5aG1cIjpcIjE4NjQwOTA2MTI0XCJ9In0.v03SGE4jUDyqyDH6sjM_VZDC-qQV4MJL2LF9xXOxDBHuBuyBj3AbwgsEgj7MB5G9IOD0zi3AC0Wf66YgDNILWg"
    },
    "code": "200",
    "desc": "成功",
    "msg": null,
    "type": ""
}
  await waitTime(500);
  return res.json(returnData);
}

async function getJsxxByFjyhuuid(req: Request, res: Response) {
  let returnData = {
    "body": [
      {
        "jsDm": "111",
        "jsMc": "客户角色"
      },
      {
        "jsDm": "222",
        "jsMc": "客户角色22"
      }
    ],
    "code": "200",
    "desc": "成功",
    "msg": null,
    "type": ""
  }
  await waitTime(500);
  return res.json(returnData);
}
async function queryDmDqLoginSaas(req: Request, res: Response) {
  let returnData = {
    "body": [
    {"swcode":"110"
    ,swname:"123"}
    ],
      
    "code": "200",
    "msg": "成功"
  }
  await waitTime(500);
  return res.json(returnData);
}

async function cancelLogin(req: Request, res: Response) {
  let returnData = {
    "code": "380",
    "msg": "用户取消登录"
  }
  await waitTime(500);
  return res.json(returnData);
}


async function bcsddlxx(req: Request, res: Response) {
  let returnData = {
    "body": {
      "rtnCode":  mockjs.mock('@pick(["200"])'),
    },
    "code": "200",
    "msg": "成功"
  }
  await waitTime(500);
  return res.json(returnData);
}



export default {
  'POST /yw/fpzs/fpsqd/xzsqdtzmxcx': xzsqdtzmxcx,
  'POST /yw/fpzs/bgdkp/hlxxcx': queryAbgdHl,
  'POST /yw/fpzs/fppz/wxspmxcx': wxspmxcx,
  'POST /yw/fpzs/fppz/qtspmxcx': qtspmxcx,
  'POST /yw/fpzs/fppz/hlglcx': queryDayHlPage,
  'POST /yw/fpzs/fppz/querykhpzform': querykhpzform,
  'POST /yw/fpzs/fppz/xsfpzcx': xsfpzcx,
  'POST /yw/fpzs/fptj/bgdwksj': bgdwksj,
  'POST /yw/fpzs/fptj/fpsqdsj': fpsqdsj,
  'POST /yw/fpzs/fptj/qrkpsj': qrkpsj,
  'POST /yw/fpzs/fptj/qjlskpsj': qjlskpsj,
  'POST /yw/fpzs/fppz/bzglcx': bzglcx,
  'POST /yw/fpzs/fpsqd/sqdmxcx': sqdmxcx,
  'POST /yw/fpzs/fpgl/fpkjwjht': fpkjwjht,
  'POST /yw/fpzs/fppz/kppzwh': kppzwh,
  'POST /yw/fpzs/fpgl/qxkp': doSuccess,
  'POST /yw/fpzs/fpgl/fpch': doSuccess,
  'POST /yw/fpzs/fpgl/fpzf': doSuccess,
  'POST /yw/fpzs/bgdkp/kbjkpbgdcx': kbjkpbgdcx,
  'POST /yw/fpzs/drmbkj/queryDjbh': queryDjbh,
  'POST /yw/fpzs/fpsqd/sqdqrkptj': sqdqrkptj,
  'POST /yw/fpzs/fpgl/sqfpcx': sqfpcx,
  'POST /yw/fpzs/sjxzgl/sjxzqzjy': sjxzqzjy,
  'POST /hx/ty/code/queryCodePager': queryPager,
  'POST /yw/fpzs/bgdkp/dkpbgdfycx': queryPager,
  'POST /yw/fpzs/fppz/qtspcx': queryPager,
  'POST /yw/fpzs/fppz/wxspcx': queryPager,
  'POST /yw/fpzs/bgdkp/gmfxxcx': ssflbmcx,
  'POST /yw/fpzs/sjxzgl/bgdsjcx': queryPager,
  'POST /yw/fpzs/fppz/myxzpz/queryMyxzpz': queryPager,
  'POST /yw/fpzs/bgdkp/ssflbmcx': ssflbmcx,
  'POST /yw/fpzs/fppz/khglfycx': queryPager,
  'POST /yw/fpzs/fppz/wxspsztmsbz': gtTsxx,
  'POST /hts/ckfp/gt/gtTsxx': gtTsxx,
  'POST /yw/fpzs/fppz/wxspsc': gtTsxx,
  'POST /yw/fpzs/fppz/wxspfm': gtTsxx,
  'POST /yw/fpzs/fppz/wxspszfpggxh': gtTsxx,
  'POST /yw/fpzs/fppz/wxsptqbgdxx': gtTsxx,
  'POST /yw/fpzs/fppz/khgltqbgdxx': gtTsxx,
  'POST /yw/fpzs/fppz/checkghfnsrmc': gtTsxx,
  'POST /yw/fpzs/fppz/bzglwh': gtTsxx,
  'POST /yw/fpzs/drmbkj/scfpsqd': gtTsxx,
  'POST /yw/fpzs/fppz/qtspsc': gtTsxx,
  'POST /yw/fpzs/fppz/fphlwh': gtTsxx,
  'POST /yw/fpzs/fppz/tbtshl': gtTsxx,
  'POST /yw/fpzs/fppz/tbzgyhhl': gtTsxx,
  'POST /yw/fpzs/bgdkp/ssflbmsz': gtTsxx,
  'POST /yw/fpzs/bgdkp/gmfxxsz': gtTsxx,
  'POST /yw/fpzs/bgdkp/xbgdkhxx': gtTsxx,
  'POST /yw/fpzs/bgdkp/zbkpztsz': gtTsxx,
  'POST /yw/fpzs/bgdkp/tjkpxx': gtTsxx,
  'POST /yw/fpzs/fppz/sjdr': gtTsxx,
  'POST /yw/fpzs/fppz/qtspsjdr': gtTsxx,
  'POST /yw/fpzs/fpsqd/sqdbjbc': gtTsxx,
  'POST /yw/fpzs/bgdkp/scfpsqd': gtTsxx,
  'POST /yw/fpzs/drmbkj/fpsqdqrkp': gtTsxx,
  'POST /yw/fpzs/fpsqd/sqdqrkp': gtTsxx,
  'POST /yw/fpzs/fpsqd/sccz': gtTsxx,
  'POST /yw/fpzs/fpsqd/djxhcp': gtTsxx,
  'POST /yw/fpzs/bgdkp/hlxxsz': gtTsxx,
  'POST /yw/fpzs/drmbkj/bcfpsqd': gtTsxx,
  'POST /ckfp2/zxkp/ckfpkj/fpmxbc': gtTsxx,
  'POST /yw/fpzs/drmbkj/fpsqdsjdr': gtTsxx,
  'POST /yw/fpzs/fpsqd/xzsqdtzbc': gtTsxx,
  'POST /yw/fpzs/fppz/khglwh': gtTsxx,
  'POST /yw/fpzs/fppz/qtspwh': gtTsxx,
  'POST /yw/fpzs/fppz/wxspwh': gtTsxx,
  'POST /yw/fpzs/fppz/xsfpzwh': gtTsxx,
  'POST /yw/fpzs/vtax-fpgl/sqfpkj': gtTsxx,
  'POST /yw/fpzs/fppz/appKey': gtTsxx,
  'POST /dditSaas/khdgj/bgd/queryPagerXzrw': queryPager,
  'POST /dditSaas/khdgj/bgd/queryKakPassword': gtTsxx,
  'POST /dditSaas/khdgj/bgd/saveKakPassword': gtTsxx,
  'POST /dditSaas/khdgj/bgd/sqxz': gtTsxx,
  'POST /yw/fpzs/bgdkp/tbbgdsjtj': gtTsxx,
  'POST /yw/fpzs/bgdkp/tbbgdsjcl': gtTsxx,
  'POST /yw/fpzs/drmbkj/fpsqdmxcx': queryFormFpsqdFpxx,
  'POST /ckfp2/zxkp/ckfpkj/fpmxcx': queryFormFpsqdFpxx,
  'POST /dditSaas/khdgj/ckfp/fpljhq': queryPager,
  'POST /yw/fpzs/fpgl/xzkpwj': importTemplate,
  'POST /yw/fpzs/fppz/khglsc': deleteData,
  'POST /yw/bszx/wbsj/bgd/bgdsc': deleteData,
  'POST /yw/fpzs/fppz/khglszzt': doSuccess,
  'POST /yw/saas/hlgl/tshlglcx': queryDayHlPage,
  'POST /yw/saas/hlgl/tshlxqgzcx': querykhpzform,
  'POST /yw/saas/hlgl/tshlxqgzwh': doSuccess,
  'POST /yw/fpzs/zxkp/fpgl/qrkpjy': qrkpjy,
  'POST /yw/fpzs/zxkp/fpgl/kpddxz': kpddxz,
  'POST /yw/fpzs/zxkp/fpgl/ddtjkp': doSuccess,
  'POST /yw/fpzs/zxkp/fpgl/cxkp': doSuccess,
  'POST /yw/fpzs/zxkp/fpgl/fphc': doSuccess,
  'POST /yw/fpzs/zxkp/fpgl/fpzf': doSuccess,
  'POST /yw/fpzs/zxkp/fpgl/fpztsx': doSuccess,
  'POST /yw/fpzs/zxkp/fpgl/fpxz': importTemplate,
  'POST /yw/fpzs/zxkp/fpgl/dyjcx': dyjcx,
  'POST /yw/fpzs/zxkp/fpgl/dyfp': doSuccess,
  'POST /yw/fpzs/zxkp/sdp/ecrzjgcx': sdpPrCode,
  'POST /yw/fpzs/zxkp/sdp/cxewm': getSfrzcode,
  'POST /yw/fpzs/zxkp/fpsqd/sdpqrkp': sdpqrkp,
  'POST /yw/fpzs/zxkp/sdp/ddtjkp': sdpddtjkp,
  'POST /ckfp2/zxkp/ddtjkp': sdpddtjkp2,
  'POST /yw/fpzs/zxkp/sdp/djmndl': djmndl,
  'POST /yw/fpzs/zxkp/sdp/skxxcx': skxxcx,
  'POST /yw/fpzs/zxkp/fpgl/sdpfphc': sdpfphc,
  'POST /yw/fpzs/zxkp/drmbkj/sdpqrkp': sdpqrkp,
  'POST /yw/fpzs/zxkp/fpgl/sdphdtjkp': sdphdtjkp,
  'POST /yw/fpzs/zxkp/sdp/fpztsx': fpztsxZx,
  'POST /yw/fpzs/zxkp/sdp/sdpZtsxtb': doSuccess,
  'POST /dditSaas/khdgj/bgd/cxzxForGpt': gtTsxx,
  'POST /ckfp2/zxkp/ckfpkj/djcsjkptj': qrkptj,
  'POST /ckfp2/zxkp/checkDlt': checkDlt,
  'POST /yw/ckfpkj/zxkp/sddl/cxsddlxx':cxsddlxx,
  'POST /ckfp2/drmbkj/qrkptj': qrkptj,
  'POST /yw/ckfpkj/zxkp/sddl/bcsddlxx': bcsddlxx,
  'POST /yw/ckfpkj/zxkp/sddl/scdl': bcsddlxx,
  'POST /yw/ckfpkj/zxkp/sddl/tjdxyzm': bcsddlxx,
  'POST /yw/ckfpkj/zxkp/sddl/cxewm': getSfrzcode,
  'POST /yw/ckfpkj/zxkp/sddl/ecrzjgcx' :getSfrzcode2,
  'POST /yw/ckfpkj/zxkp/sddl/checkDlt': checkDlt,
  'POST /yw/ckfpkj/zxkp/sddl/hqsdpxe' :checkDlt,
  'POST /yw/ckfpkj/zxkp/sddl/sdgxrzzt' :sdgxrzzt,
  'POST /rpa/login/simulationLoginBymm' :simulationLoginBymm,
  'POST /yw/tssb/j4rpa/hqJ4RpaToken' :hqJ4RpaToken,
  'POST /yw/tssb/j4rpa/saveDjdlzh' :checkDlt,
  'POST /yw/tssb/j4rpa/queryDjdlzh' :queryDjdlzh,
  'POST /yw/saas/getJsxxByFjyhuuid' :getJsxxByFjyhuuid,
  'POST /yw/cancelLogin' :cancelLogin,
  'POST /yw/dditSaas/qxqy/queryDmDqLoginSaas' :queryDmDqLoginSaas,
  'POST /saas/pzgl/dsrwgl/bgd/sendTestMail' :queryDmDqLoginSaas,
  'POST /saas/sjgl/fpsjxz/cjrw' :queryDmDqLoginSaas,

  
  
  
};
