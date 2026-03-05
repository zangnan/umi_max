import { Request, Response } from 'express';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

// 获取指定码表
function getCode(req: Request, res: Response) {
  const body = req.body;
  let returnData: any;
  let code: any;
  if (body.dictCodeId === 'code_dm_ckts_cktmsywlx_01') {
    code = [
      { mtsbz: "Y", code: "CBTS", name: "船舶退税", bz: null, mdtbz: "Y" },
      { mtsbz: "Y", code: "GCSB", name: "国产设备", bz: "研发机构采购国产设备", mdtbz: "N" },
      { mtsbz: "Y", code: "DWCB", name: "对外承包", bz: "用于对外承包工程项目的出口货物", mdtbz: "Y" },
      { mtsbz: "Y", code: "JWTZ", name: "境外投资", bz: "用于境外投资出口的货物", mdtbz: "Y" },
      { mtsbz: "Y", code: "MSD", name: "免税店", bz: "免税品经营企业销售的货物", mdtbz: "Y" },
    ];
  }
  if (body.dictCodeId === 'code_dm_ckts_hgjldw_01') {
    code = [
      { code: "01", name: "台座辆艘架套个只....", hgjldwqc: "台座辆艘架套个只头张件支枝根片条把块卷副" },
      { code: "02", name: "双.对", hgjldwqc: "双.对" },
      { code: "04", name: "米", hgjldwqc: "米" },
      { code: "05", name: "平方米", hgjldwqc: "平方米" },
      { code: "31", name: "千个.千只.千块.千...", hgjldwqc: "千个.千只.千块.千合.千枝.千升" },
      { code: "38", name: "千伏安", hgjldwqc: "千伏安" },
      { code: "39", name: "吨", hgjldwqc: "吨" },
    ];
  }
  if (body.dictCodeId === 'code_dm_ckts_hgjgfs_01' || body.dictCodeId === 'CODE_DM_CKTS_HGJGFS_01') {
    code = [
      { jgfsqc: "一般贸易", jgfstslxdm: "1", code: "0110", name: "一般贸易" },
      { jgfsqc: "易货贸易", jgfstslxdm: "1", code: "0130", name: "易货贸易" },
      { jgfsqc: "保税工厂", jgfstslxdm: "0", code: "1215", name: "保税工厂", jgfssm: null },
      { jgfsqc: "保税仓库进出境货物", jgfstslxdm: "0", code: "1233", name: "保税仓库货物" },
      { jgfsqc: "进出境修理物品", jgfstslxdm: "2", code: "1300", name: "修理物品" },
      { jgfsqc: "出料加工", jgfstslxdm: "1", code: "1427", name: "出料加工" },
      { jgfsqc: "寄售、代销贸易", jgfstslxdm: "2", code: "1616", name: "寄售代销" },
    ];
  }
  if (body.dictCodeId === 'code_dm_ckts_hgyfjsfs_01') {
    code = [
      { code: "1", name: "运费率" },
      { code: "2", name: "每吨货物的运费单价" },
      { code: "3", name: "运费总价" },
    ];
  }
  if (body.dictCodeId === 'code_static_hgcjfs_mc_01') {
    code = [
      { code: "CIF", name: "CIF" },
      { code: "C&F", name: "C&F" },
      { code: "FOB", name: "FOB" },
      { code: "C&I", name: "C&I" },
      { code: "市场价", name: "市场价" },
      { code: "垫仓", name: "垫仓" },
      { code: "EXW", name: "EXW" },
    ];
  }
  if (body.dictCodeId === 'code_dm_ckts_hgbfjsfs_01') {
    code = [
      { code: "1", name: "保险费率" },
      { code: "3", name: "保险费总价" },
    ];
  }
  if (body.dictCodeId === 'code_dm_ckts_hgzfjsfs_01') {
    code = [
      { code: "1", name: "杂费率" },
      { code: "3", name: "杂费总价" },
    ];
  }
  if (body.dictCodeId === 'code_static_bgd_gdxx_dm_01') {
    code = [
      { code: "", name: "全部" },
      { code: "Y", name: "有" },
      { code: "N", name: "无" },
    ];
  }
  if (body.dictCodeId === 'code_static_bgd_zmlx_dm_01') {
    code = [
      { code: "", name: "全部" },
      { code: "6", name: "退税" },
      { code: "5", name: "征税" },
      { code: "4", name: "免税" },
    ];
  }
  if (body.dictCodeId === 'code_static_bgd_sbyw_dm_01') {
    code = [
      { code: "", name: "全部" },
      { code: "1", name: "退税申报" },
      { code: "2", name: "代理出口" },
      { code: "6", name: "代办退税" },
    ];
  }
  if (body.dictCodeId === 'code_static_bgd_zt_dm_01') {
    code = [
      { code: "", name: "全部" },
      { code: "Y", name: "已生成" },
      { code: "N", name: "未生成" },
    ];
  }
  if (body.dictCodeId === 'code_static_bgd_cytgbz_dm_01') {
    code = [
      { code: "", name: "全部" },
      { code: "Y", name: "检查通过" },
      { code: "N", name: "检查未通过" },
      { code: " ", name: "未检查" },
    ];
  }
  if (body.dictCodeId === 'code_dm_ckts_cktmsywlx_01') {
    code = [
      { code: "HXWH", name: "航线维护" },
      { code: "CBTS", name: "船舶退税" },
      { code: "XTHH-CJ", name: "先退后核-冲减" },
      { code: "XTHH-XT", name: "先退后核-先退" },
      { code: "XTHH-HX", name: "先退后核-后核" },
      { code: "TSQY", name: "特殊区域" },
      { code: "DWYZ", name: "对外援助" },
      { code: "DWCB", name: "对外承包" },
      { code: "HZCJ", name: "对外承包" },
    ];
  }
  if (body.dictCodeId === 'code_dm_ckts_cktmsywlx_01') {
    code = [
      { code: "HXWH", name: "HXWH" },
      { code: "CBTS", name: "CBTS" },
      { code: "XTHH-CJ", name: "XTHH-CJ" },
      { code: "XTHH-XT", name: "XTHH-XT" },
      { code: "XTHH-HX", name: "XTHH-HX" },
      { code: "TSQY", name: "TSQY" },
      { code: "DWYZ", name: "DWYZ" },
      { code: "DWCB", name: "DWCB" },
      { code: "HZCJ", name: "HZCJ" },
    ];
  }
  if (body.dictCodeId === 'code_dm_cs_ckts_cksp_01') {
    code = [
      {code: "71022100", name: "工业用钻石"},
      {code: "71012290", name: "其他已加工的养殖珍珠"},
      {code: "71022100001", name: "按9％征税的工业用钻"},
      {code: "71022100002", name: "按13％征税的工业用钻"},
      {code: "71059000", name: "其他天然或合成宝石或"},
    ];
  }

  if(body.dictCodeId === 'code_dm_ckts_gnqyfs_01') {
    code = [
      {name: "水路运输", code: "1"},
      {name: "铁路运输", code: "2"},
    ]
  }
  if(body.dictCodeId === 'code_static_db_field_type_01') {
    code = [
      {name: "varchar", code: "varchar"},
      {name: "date", code: "date"},
      {name: "datetime", code: "datetime"},
      {name: "decimal", code: "decimal"},
      {name: "int", code: "int"},
      {name: "double", code: "double"},
    ]
  }

  if (!code || code.length <= 0) {
    code = [
      { code: "1", name: "测试1" },
      { code: "2", name: "测试2" },
      { code: "3", name: "测试3" },
      { code: "04", name: "测试04" },
      { code: "05", name: "测试05" },
      { code: "06", name: "测试06" },
      { code: "1-1", name: "测试1-1", pid: "1" },
      { code: "1-2", name: "测试1-3", pid: "1" },
    ];
  }

  returnData = {
    code: '200',
    body: code
  };
  return res.json(returnData);
}

async function getTreeCode(req: Request, res: Response) {
  const body = req.body;
  let returnData: any;
  let code: any;
  if (body.dictCodeId === 'code_dm_badz_02') {
    code = [
      { title: "1退税单证资料", value: "10000", children: [
        { title: "出口货物报关单", value: "10100", children: [
          { title: "出口货物报关单", value: "10101" }
        ] },
        { title: "出口发票", "disabled": true, value: "10200", children: [
          { title: "出口发票", value: "10201" }
        ] },
        { title: "进项增值税专用发票", "disabled": true, value: "10300", children: [
          { title: "进项增值税专用发票", value: "10301" }
        ] }
      ] },
      { title: "2备案单证资料", value: "20000", "disabled": true, children: [
        { title: "购货合同", value: "20100", "disabled": true, children: [
          { title: "购货合同", value: "20101" }
        ] },
        { title: "出口货物装货单", "disabled": true, value: "20200", children: [
          { title: "出口货物装货单", value: "20201" }
        ] },
        { title: "无纸化放行通知书", "disabled": true, value: "20300", children: [
          { title: "无纸化放行通知书", value: "20301" }
        ] },
        { title: "出口货物运输单据", "disabled": true, value: "20400", children: [
          { title: "海运提单", value: "20401" },
          { title: "航空运单", value: "20402" },
          { title: "铁路运单", value: "20403" }
        ] }] },
        { title: "其他关联资料", value: "30000", "disabled": true, children: [
          { title: "其他单证", "disabled": true, value: "30100", children: [
            { title: "出口合同", value: "30101" },
            { title: "自制出口发票", value: "30102" },
            { title: "出入库单", value: "30103" },
            { title: "运输合同", value: "30104" }
          ] }
        ]
      }
    ];
  }

  if (body.dictCodeId === 'code_dm_badz_01') {
    code = [
      { title: '备案单证资料', value: '010000', yzjdbz: '', children: [
        { title: '购销合同', value: '010100', yzjdbz: '' },
        { title: '出口货物运输单据', value: '010200', yzjdbz: '' },
        { title: '委托报关单据', value: '010300', yzjdbz: '' }
      ] },
      { title: '退税单证资料', value: '020000', yzjdbz: '', children: [
        { title: '出口单证', value: '020100', yzjdbz: '' },
        { title: '发票单证', value: '020200', yzjdbz: '' }
      ] },
      { title: '其他单证资料', value: '030000', yzjdbz: '', children: [
        { title: '其他单证', value: '030100', yzjdbz: '' }
      ]
    }]
  }
  returnData = {
    code: '200',
    body: code
  };
  waitTime(10000);
  return res.json(returnData);
}

export default {
  'POST /hx/ty/code/getCode': getCode,
  'POST /hx/ty/code/getTreeCode': getTreeCode,
  'POST /hx/ty/crud/getComboTree': getTreeCode,
  'POST /dict/automatic/getCodeList': getCode,
  'POST /dict/automatic/exp/bs/getCodeList': getCode,
}
