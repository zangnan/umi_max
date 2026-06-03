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
  if (body.codeStoreKey === 'code_dm_ckts_cktmsywlx' && body.codeViewKey === '05' || body.codeStoreKey === 'code_dm_ckts_cktmsywlx' && body.codeViewKey === '04') {
    code = [
      { mtsbz: "Y", code: "CBTS", name: "船舶退税", bz: null, mdtbz: "Y" },
      { mtsbz: "Y", code: "GCSB", name: "国产设备", bz: "研发机构采购国产设备", mdtbz: "N" },
      { mtsbz: "Y", code: "DWCB", name: "对外承包", bz: "用于对外承包工程项目的出口货物", mdtbz: "Y" },
      { mtsbz: "Y", code: "JWTZ", name: "境外投资", bz: "用于境外投资出口的货物", mdtbz: "Y" },
      { mtsbz: "Y", code: "MSD", name: "免税店", bz: "免税品经营企业销售的货物", mdtbz: "Y" },
      { mtsbz: "Y", code: "ZB", name: "中标机电", bz: "销售的中标机电产品", mdtbz: "Y" },
      { mtsbz: "Y", code: "HCWX", name: "航次维修", bz: null, mdtbz: "N" },
      { mtsbz: "Y", code: "KPO", name: "提供技术性知识流程外包服务", bz: null, mdtbz: "Y" },
    ];
  }
  if (body.codeStoreKey === 'CODE_DM_ZXSB_JSYWSSZRRLX' && body.codeViewKey === '01') {
    code = [
      { code: "01", name: "法定责任人" },
      { code: "02", name: "财务负责人" },
      { code: "03", name: "办税员" },
      { code: "04", name: "开票员" },
    ];
  }
  if (body.codeStoreKey === 'code_dm_ckts_cktmspzlx' && body.codeViewKey === '06') {
    code = [
      { code: "02", name: "增值税专用发票" },
      { code: "04", name: "海关进口增值税专用缴款书" },
    ];
  }
  if (body.codeStoreKey === 'code_dm_ckts_cktmsywlx' && body.codeViewKey === '02') {
    code = [
      { code: "HTYSFW", name: "航天运输服务" },
      { code: "ZGJF", name: "在轨交付" },
    ];
  }
  if (body.codeStoreKey === 'CODE_DM_CKTS_HGJLDW' && body.codeViewKey === '01') {
    code = [
      { code: "01", name: "台座辆艘架套个只....", hgjldwqc: "台座辆艘架套个只头张件支枝根片条把块卷副" },
      { code: "02", name: "双.对", hgjldwqc: "双.对" },
      { code: "04", name: "米", hgjldwqc: "米" },
      { code: "05", name: "平方米", hgjldwqc: "平方米" },
      { code: "31", name: "千个.千只.千块.千...", hgjldwqc: "千个.千只.千块.千合.千枝.千升" },
      { code: "38", name: "千伏安", hgjldwqc: "千伏安" },
      { code: "39", name: "吨", hgjldwqc: "吨" },
      { code: "48", name: "千瓦", hgjldwqc: "千瓦" },
      { code: "49", name: "克拉", hgjldwqc: "克拉" },
      { code: "58", name: "千瓦时", hgjldwqc: "千瓦时" },
      { code: "59", name: "克", hgjldwqc: "克" },
      { code: "007", name: "个", hgjldwqc: "个" },
      { code: "008", name: "只", hgjldwqc: "只" },
    ];
  }
  if ((body.codeStoreKey === 'code_dm_ckts_hgjgfs' && body.codeViewKey === '01') || (body.codeStoreKey === 'CODE_DM_CKTS_HGJGFS' && body.codeViewKey === '01')) {
    code = [
      { jgfsqc: "一般贸易", jgfstslxdm: "1", code: "0110", name: "一般贸易" },
      { jgfsqc: "易货贸易", jgfstslxdm: "1", code: "0130", name: "易货贸易" },
      { jgfsqc: "保税工厂", jgfstslxdm: "0", code: "1215", name: "保税工厂", jgfssm: null },
      { jgfsqc: "保税仓库进出境货物", jgfstslxdm: "0", code: "1233", name: "保税仓库货物" },
      { jgfsqc: "保税区进出境仓储转口货物", jgfstslxdm: "2", code: "1234", name: "保税区仓储转口" },
      { jgfsqc: "进出境修理物品", jgfstslxdm: "2", code: "1300", name: "修理物品" },
      { jgfsqc: "待维修货物从境外运入区域内进行检测、维修（包括经检测维修不能修复的）后应当复运出境", jgfstslxdm: "0", code: "1371", name: "保税维修" },
      { jgfsqc: "出料加工", jgfstslxdm: "1", code: "1427", name: "出料加工" },
      { jgfsqc: "寄售、代销贸易", jgfstslxdm: "2", code: "1616", name: "寄售代销" },
    ];
  }
  if (body.codeStoreKey === 'code_dm_ckts_hgyfjsfs' && body.codeViewKey === '01') {
    code = [
      { code: "1", name: "运费率" },
      { code: "2", name: "每吨货物的运费单价" },
      { code: "3", name: "运费总价" },
    ];
  }
  if (body.codeStoreKey === 'code_static_hgcjfs_mc' && body.codeViewKey === '01') {
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
  if (body.codeStoreKey === 'code_dm_ckts_hgbfjsfs' && body.codeViewKey === '01') {
    code = [
      { code: "1", name: "保险费率" },
      { code: "3", name: "保险费总价" },
    ];
  }
  if (body.codeStoreKey === 'code_dm_ckts_hgzfjsfs' && body.codeViewKey === '01') {
    code = [
      { code: "1", name: "杂费率" },
      { code: "3", name: "杂费总价" },
    ];
  }
  if (body.codeStoreKey === 'code_static_bgd_gdxx_dm' && body.codeViewKey === '01') {
    code = [
      { code: "", name: "全部" },
      { code: "Y", name: "有" },
      { code: "N", name: "无" },
    ];
  }
  if (body.codeStoreKey === 'code_static_bgd_zmlx_dm' && body.codeViewKey === '01') {
    code = [
      { code: "", name: "全部" },
      { code: "6", name: "退税" },
      { code: "5", name: "征税" },
      { code: "4", name: "免税" },
    ];
  }
  if (body.codeStoreKey === 'code_static_bgd_sbyw_dm' && body.codeViewKey === '01') {
    code = [
      { code: "", name: "全部" },
      { code: "1", name: "退税申报" },
      { code: "2", name: "代理出口" },
      { code: "6", name: "代办退税" },
    ];
  }
  if (body.codeStoreKey === 'code_static_bgd_sbyw_dm' && body.codeViewKey === '02') {
    code = [
      { code: "", name: "全部" },
      { code: "1", name: "退税申报" },
      { code: "2", name: "代理出口" },
      { code: "6", name: "代办退税" },
      { code: "7", name: "边贸代理" },
    ];
  }
  if (body.codeStoreKey === 'code_static_bgd_sbyw_dm' && body.codeViewKey === '03') {
    code = [
      { code: "1", name: "退税申报" },
      { code: "2", name: "代理出口" },
      { code: "6", name: "代办退税" },
    ];
  }
  if (body.codeStoreKey === 'code_static_bgd_sbyw_dm' && body.codeViewKey === '04') {
    code = [
      // { code: "", name: "全部" },
      { code: "0", name: "未申报" },
      { code: "1", name: "退税申报" },
      { code: "2", name: "代理出口" },
      { code: "6", name: "代办退税" },
    ];
  }
  if (body.codeStoreKey === 'code_static_bgd_zt_dm' && body.codeViewKey === '01') {
    code = [
      { code: "", name: "全部" },
      { code: "Y", name: "已生成" },
      { code: "N", name: "未生成" },
    ];
  }
  if (body.codeStoreKey === 'code_static_bgd_cytgbz_dm' && body.codeViewKey === '01') {
    code = [
      { code: "", name: "全部" },
      { code: "Y", name: "检查通过" },
      { code: "N", name: "检查未通过" },
      { code: " ", name: "未检查" },
    ];
  }
  if (body.codeStoreKey === 'code_static_dzdzfp_fpsbzt_dm' && body.codeViewKey === '01') {
    code = [
      { code: "", name: "全部" },
      { code: "0", name: "未生成" },
      { code: "1", name: "已生成" },
      { code: "2", name: "部分生成" },
    ];
  }
  if (body.codeStoreKey === 'code_static_dzdzfp_fpcllx_dm' && body.codeViewKey === '01') {
    code = [
      { code: "", name: "全部" },
      { code: "1", name: "退税" },
      { code: "2", name: "抵扣" },
      { code: "3", name: "转内销" },
      { code: "4", name: "代办退税" },
    ];
  }
  if (body.codeStoreKey === 'code_static_dzdzfp_fpzt_dm' && body.codeViewKey === '02') {
    code = [
      { code: "", name: "全部" },
      { code: "1", name: "认证" },
      { code: "2", name: "稽核" },
      { code: "3", name: "认证/稽核" },
    ];
  }
  if (body.codeStoreKey === 'code_static_dzdzfp_fpzt_dm' && body.codeViewKey === '01') {
    code = [
      { code: "", name: "全部" },
      { code: "0", name: "已认证/已稽核" },
      { code: "1", name: "已认证/未稽核" }
    ];
  }
  // hts 新增
  if (body.codeStoreKey === 'CODE_DM_CKTS_HGCJFS' && body.codeViewKey === '01') {
    code = [
      { code: "1", name: "CIF" },
      { code: "2", name: "C&F" },
      { code: "3", name: "FOB" },
      { code: "4", name: "C&I" },
    ];
  }

  if (body.codeStoreKey === 'CODE_DM_CKTS_HGBGSBZT' && body.codeViewKey === '01') {
    code = [
      { code: "1", name: "保存" },
      { code: "2", name: "已申报" },
      { code: "3", name: "预录入接收失败" },
      { code: "4", name: "海关入库成功" },
    ];
  }

  if (body.codeStoreKey === 'CODE_DM_CKTS_HGBZZL' && body.codeViewKey === '01') {
    code = [
      { code: "00", name: "散装" },
      { code: "01", name: "裸装" },
      { code: "04", name: "球状罐类" },
      { code: "06", name: "包/袋" },
    ];
  }

  if (body.codeStoreKey === 'CODE_DM_CKTS_HGGJHDQ' && body.codeViewKey === '01') {
    code = [
      { code: "101", name: "阿富汗", cbdsypbz: "H", gjhdqszdm: "004", gjhdqszmdm: "AFG", gjhdqywjc: "Afghanistan", yhptslbz: "L" },
      { code: "102", name: "巴林", cbdsypbz: "H", gjhdqszdm: "048", gjhdqszmdm: "BHR", gjhdqywjc: "Bahrian", yhptslbz: "L" },
      { code: "103", name: "孟加拉国", cbdsypbz: "H", gjhdqszdm: "050", gjhdqszmdm: "BGD", gjhdqywjc: "Bangladesh", yhptslbz: "L" },
    ];
  }

  if (body.codeStoreKey === 'CODE_DM_CKTS_HGGK' && body.codeViewKey === '01') {
    code = [
      { code: "AUS111", name: "格鲁特岛（澳大利亚）", gjhdqszdm: "036", hggkywmc: "Groote Eylandt, Australia" },
      { code: "AUS114", name: "海波因特（澳大利亚）", gjhdqszdm: "036", hggkywmc: "Hay Point, Australia" },
      { code: "BFA000", name: "布基纳法索", gjhdqszdm: "854", hggkywmc: "Burkina Faso" },
      { code: "BGD001", name: "达卡（孟加拉）", gjhdqszdm: "050", hggkywmc: "Dacca, Bangladesh" },
    ];
  }

  if (body.codeStoreKey === 'CODE_DM_CKTS_HGGK' && body.codeViewKey === '01') {
    code = [
      { code: "34016", name: "合肥综合保税区", dqxzdm: "" },
      { code: "34019", name: "合肥其他", dqxzdm: "2" },
      { code: "34023", name: "芜湖高新技术产业开发区", dqxzdm: "" },
      { code: "34025", name: "安徽芜湖出口加工区", dqxzdm: "" },
    ];
  }

  if (body.codeStoreKey === 'CODE_DM_CKTS_HGGNKA' && body.codeViewKey === '01') {
    code = [
      { code: "211000", name: "辽宁省辽阳市" },
      { code: "211200", name: "辽宁省铁岭市" },
      { code: "211903", name: "大连港大连湾港区" },
      { code: "211907", name: "庄河港" },
    ];
  }

  if (body.codeStoreKey === 'CODE_DM_CKTS_HGHBSZ' && body.codeViewKey === '01' || body.codeStoreKey === 'code_dm_gy_hb' && body.codeViewKey === '01') {
    code = [
      {name: "港币", hbszdm: "110", code: "HKD"},
      {name: "印度尼西亚卢比", hbszdm: "112", code: "IDR"},
      {name: "日本元", hbszdm: "116", code: "JPY"},
      {name: "澳门元", hbszdm: "121", code: "MOP"},
      {name: "马来西亚林吉特", hbszdm: "122", code: "MYR"},
      {name: "菲律宾比索", hbszdm: "129", code: "PHP"},
      {name: "新加坡元", hbszdm: "132", code: "SGD"},
      {name: "韩国圆", hbszdm: "133", code: "KRW"},
      {name: "泰国铢", hbszdm: "136", code: "THB"},
      {name: "人民币", hbszdm: "142", code: "CNY"},
      {name: "荷兰盾", hbszdm: "528", code: "NLG"},
      {name: "巴基斯坦卢比", hbszdm: "586", code: "PKR"},
      {name: "利昂", hbszdm: "694", code: "SLL"},
      {name: "坦桑尼亚先令", hbszdm: "834", code: "TZS"},
      {name: "阿尔及利亚第纳尔", hbszdm: "012", code: "DZD"},
      {name: "比利时法郎", hbszdm: "056", code: "BEF"},
      {name: "塞地", hbszdm: "288", code: "GHC"},
    ];
  }

  if (body.codeStoreKey === 'CODE_DM_CKTS_HGJHFS' && body.codeViewKey === '01') {
    code = [
      { code: "1", name: "信汇" },
      { code: "2", name: "电汇" },
      { code: "3", name: "票汇" },
      { code: "4", name: "付款交单" },
      { code: "5", name: "承兑交单" },
      { code: "6", name: "信用证" },
      { code: "7", name: "先出后结" },
      { code: "8", name: "先结后出" },
      { code: "9", name: "其他" },
    ];
  }

  if (body.codeStoreKey === 'CODE_DM_CKTS_HGJZXGGXH' && body.codeViewKey === '01') {
    code = [
      { code: "11", name: "普通2*标准箱（L）" },
      { code: "12", name: "冷藏2*标准箱（L）" },
      { code: "21", name: "普通标准箱（S）" },
      { code: "32", name: "其他2*标准箱（L）" },
    ];
  }

  if (body.codeStoreKey === 'CODE_DM_CKTS_HGQYXZ' && body.codeViewKey === '01') {
    code = [
      { code: "1", name: "国有" },
      { code: "2", name: "合作" },
      { code: "3", name: "合资" },
      { code: "4", name: "独资" },
    ];
  }

  if (body.codeStoreKey === 'CODE_DM_CKTS_HGYSFS' && body.codeViewKey === '01') {
    code = [
      { code: "1", name: "监管仓库" },
      { code: "2", name: "水路运输" },
      { code: "3", name: "铁路运输" },
      { code: "0", name: "非保税区" },
    ];
  }

  if (body.codeStoreKey === 'CODE_DM_CKTS_HGYT' && body.codeViewKey === '01') {
    code = [
      { code: "01", name: "外贸自营内销" },
      { code: "02", name: "特区内销" },
      { code: "03", name: "其它内销" },
      { code: "04", name: "企业自用" },
    ];
  }

  if (body.codeStoreKey === 'CODE_DM_CKTS_HGZJMSFS' && body.codeViewKey === '01') {
    code = [
      { code: "1", name: "照章征税" },
      { code: "2", name: "折半征税" },
      { code: "3", name: "全免" },
    ];
  }

  if (body.codeStoreKey === 'CODE_DM_CKTS_HGZMXZ' && body.codeViewKey === '01') {
    code = [
      { code: "101", name: "一般征税进出口货物", zmxzjc: "一般征税" },
      { code: "118", name: "构成整车特征的汽车零部件纳税", zmxzjc: "整车征税" },
      { code: "119", name: "不构成整车特征的汽车零部件纳税", zmxzjc: "零部件征税" },
    ];
  }

  if (body.codeStoreKey === 'CODE_DM_CKTS_JSFS' && body.codeViewKey === '01') {
    code = [
      { code: "DA", name: "托收（D/A）" },
      { code: "DD", name: "票汇" },
      { code: "DP", name: "托收（D/P）" },
    ];
  }

  if (body.codeStoreKey === 'CODE_DM_CKTS_YDJB' && body.codeViewKey === '01') {
    code = [];
  }

  if (body.codeStoreKey === 'CODE_DM_GY_GJHDQ' && body.codeViewKey === '01' || body.codeStoreKey === 'code_dm_gy_gjhdq' && body.codeViewKey === '01') {
    code = [
      { code: "101", name: "阿富汗" },
      { code: "102", name: "巴林" },
      { code: "103", name: "孟加拉国" },
      { code: "104", name: "不丹" },
      { code: "105", name: "文莱" },
      { code: "818", name: "阿拉伯埃及共和国" },
      { code: "222", name: "萨尔瓦多共和国" },
      { code: "226", name: "赤道几内亚共和国" },
    ];
  }

  if (body.codeStoreKey === 'CODE_DM_GY_HGGQKA' && body.codeViewKey === '01') {
    code = [
      { code: "0126", name: "丰台海关", sjhggqkadm: "0100" },
      { code: "0207", name: "津机场办", sjhggqkadm: "0200" },
      { code: "0208", name: "津保税区", sjhggqkadm: "0200" },
      { code: "0610", name: "满市区", sjhggqkadm: "0600" },
    ];
  }

  if (body.codeStoreKey === 'CODE_DM_ZXSB_CZF' && body.codeViewKey === '01') {
    code = [
      { code: "1", name: "等于" },
      { code: "2", name: "大于等于" },
      { code: "3", name: "小于等于" },
      { code: "4", name: "包含" },
      { code: "5", name: "大于" },
      { code: "6", name: "小于" },
      { code: "7", name: "不等于" },
      { code: "8", name: "范围" },
    ];
  }

  if (body.codeStoreKey === 'CODE_DM_ZXSB_JLJGHXSJLY' && body.codeViewKey === '01') {
    code = [
      { code: "1", name: "人工采集" },
      { code: "2", name: "数据导入" },
      { code: "3", name: "智能分析" },
      { code: "4", name: "内部台账核对" },
    ];
  }

  // 备案单证-备案状态
  if (body.codeStoreKey === 'CODE_DM_ZXSB_DZBAZT' && body.codeViewKey === '01') {
    code = [
      { code: "1", name: "待备案" },
      { code: "2", name: "备案中" },
      { code: "3", name: "已备案" },
      { code: "4", name: "已归档" },
      { code: "5", name: "不存在" },
    ];
  }

  if (body.codeStoreKey === 'CODE_DM_ZXSB_JMFXJGWT' && body.codeViewKey === '01') {
    code = [
      { code: "H1001", name: "加贸反馈数据不存在" },
      { code: "H1002", name: "海关加贸数据不存在" },
      { code: "H1003", name: "海关加贸数据美元额（XXX）与加贸反馈美元额（YYY）不一致" },
    ];
  }

  // if (body.codeStoreKey === 'CODE_DM_ZXSB_JMFXZT' && body.codeViewKey === '01') {
  //   code = [
  //     { code: "0", name: "待分析" },
  //     { code: "1", name: "分析中" },
  //     { code: "2", name: "有差异" },
  //     { code: "3", name: "无差异" },
  //     { code: "4", name: "分析失败" },
  //     { code: "5", name: "计算中" },
  //     { code: "6", name: "待计算" },
  //     { code: "7", name: "计算失败" },
  //     { code: "8", name: "计算成功待分析" },
  //   ];
  // }

  if (body.codeStoreKey === 'CODE_DM_ZXSB_SBZT' && body.codeViewKey === '01') {
    code = [
      { code: "0", name: "未申报" },
      { code: "1", name: "待申报" },
      { code: "2", name: "已申报" },
    ];
  }

  if (body.codeStoreKey === 'CODE_DM_ZXSB_SJGJSJ' && body.codeViewKey === '01') {
    code = [
      { code: "010000", name: "海关数据" },
      { code: "010100", name: "出口报关单" },
      { code: "010302", name: "结案通知书" },
      { code: "010303", name: "保税核注清单" },
      { code: "010304", name: "保税核注清单表头" },
    ];
  }

  if (body.codeStoreKey === 'CODE_DM_ZXSB_XZZT' && body.codeViewKey === '01') {
    code = [
      { code: "4", name: "待执行" },
      { code: "0", name: "执行中" },
      { code: "1", name: "已完成" },
      { code: "2", name: "执行失败" },
      { code: "5", name: "执行中断" },
      { code: "3", name: "执行成功无数据" },
      { code: "6", name: "暂停执行" },
      { code: "7", name: "接收中" },
      { code: "8", name: "已取消" },
    ];
  }

  if (body.codeStoreKey === 'CODE_DM_ZXSB_XZZT_ZDGL' && body.codeViewKey === '02') {
    code = [
      { code: "-1", name: "待下载" },
      { code: "0", name: "下载中" },
      { code: "1", name: "已完成" },
      { code: "2", name: "下载失败" },
      { code: "3", name: "下载成功无数据" },
      { code: "4", name: "自动关联单证执行中" },
      { code: "5", name: "自动关联单证成功" },
    ];
  }

  if (body.codeStoreKey === 'code_dm_ckts_cktmsywlx' && (body.codeViewKey === '01' || body.codeViewKey === '06')) {
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
  if (body.codeStoreKey === 'CODE_DM_CKTS_CKSPDM' && body.codeViewKey === '01') {
    code = [
      { code: "000001", name: "铅笔" },
      { code: "000002", name: "钢笔" },
      { code: "000003", name: "圆珠笔" },
      { code: "000004", name: "橡皮" },
      { code: "000005", name: "彩笔" },
    ];
  }
  if (body.codeStoreKey === 'code_dm_mts_sz' && body.codeViewKey === '01') {
    code = [
      { code: "v", name: "增值税" },
      { code: "c", name: "消费税" },
    ];
  }

  if (body.codeStoreKey === 'code_dm_mts_sjjcjg' && body.codeViewKey === '01') {
    code = [
      { code: "01", name: "未检查" },
      { code: "02", name: "检查通过" },
      { code: "03", name: "未匹配到关单" },
      { code: "04", name: "关单数据未检查" },
      { code: "05", name: "未匹配到发票" },
      { code: "06", name: "关单数量未准确匹配" },
      { code: "07", name: "发票剩余金额不足" },

    ];
  }

  if (body.codeStoreKey === 'code_mts_sjznpd_fpzx_sczt' && body.codeViewKey === '01') {
    code = [
      { code: "", name: "全部" },
      { code: "Y", name: "已生成" },
      { code: "N", name: "未生成" },
      { code: "T", name: "部分生成" },
    ];
  }

  if (body.codeStoreKey === 'CODE_DM_CKTS_LCZT' && body.codeViewKey === '01') {
    code = [
      { code: "0", name: "审核中" },
      { code: "1", name: "已发放" },
      { code: "2", name: "已作废" },
    ];
  }

  if (body.codeStoreKey === 'code_static_tz_fpzt_dm' && body.codeViewKey === '01') {
    code = [
      { code: "YY", name: "认证/稽核" },// 第一个代表rzxfzzszyfpbz 第二个代表jhxfzzszyfpbz
      { code: "YN", name: "认证" },
      { code: "NY", name: "稽核" },
    ];
  }
  if (body.codeStoreKey === 'code_static_tz_sbqk' && body.codeViewKey === '01') {
    code = [
      { code: "1", name: "已退税" },
      { code: "2", name: "已申报" },
      { code: "3", name: "未申报" },
      { code: "4", name: "暂不办理" },
      { code: "5", name: "不予退税" },
      { code: "6", name: "部分退税" },
    ];
  }
  if (body.codeStoreKey === 'code_static_tz_sblx' && body.codeViewKey === '01') {
    code = [
      { code: "1", name: "免退税" },
      { code: "2", name: "代办退税" },
      { code: "3", name: "代理出口" },
    ];
  }
  if (body.codeStoreKey === 'code_static_tz_ywlx' && body.codeViewKey === '01') {
    code = [
      { code: "1", name: "退运" },
      { code: "2", name: "改单" },
      { code: "3", name: "撤单" },
    ];
  }
  if (body.codeStoreKey === 'CODE_DM_ZXSB_JCKBZ' && body.codeViewKey === '01') {
    code = [
      { code: "I", name: "进口" },
      { code: "E", name: "出口" },
    ];
  }
  if (body.codeStoreKey === 'code_hts_tz_znxBz' && body.codeViewKey === '01') {
    code = [
      { code: "Y", name: "是" },
      { code: "N", name: "否" },
    ];
  }
  if (body.codeStoreKey === 'CODE_DM_CKTS_CKTSBALX' && body.codeViewKey === '01') {
    code = [
      { code: "TSDZZL", name: "退税单证资料" },
      { code: "BADZZL", name: "备案单证资料" },
      { code: "QTGLZL", name: "其他关联资料" },
    ];
  }
  if (body.codeStoreKey === 'CODE_DM_CKTS_CKTSDZLX' && body.codeViewKey === '01') {
    code = [
      { code: "HKYD", name: "出口报关单" },
      { code: "HKYD", name: "航空运单" },
      { code: "HYTD", name: "海运提单" },
    ];
  }
  if (body.codeStoreKey === 'CODE_DM_CKTS_CKTSDZLX' && body.codeViewKey === '02') {
    code = [
      { code: "HKYD", name: "出口报关单" },
      { code: "GHHT", name: "购货合同" },
      { code: "CKHT", name: "出口合同" },
      { code: "GWHT", name: "购物合同" },
    ];
  }
  if (body.codeStoreKey === 'CODE_DM_CKTS_CKTSDZLX' && body.codeViewKey === '03') {
    code = [
      { code: "HKYD", name: "出口报关单" },
      { code: "QTHT", name: "其他合同" },
    ];
  }
  if (body.codeStoreKey === 'code_dm_ckts_cktmsywlx' && body.codeViewKey === '03') {
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
  if (body.codeStoreKey === 'code_hts_tz_sbbz' && body.codeViewKey === '01') {
    code = [
      { code: "Y", name: "R" },
      { code: "N", name: "空" },
    ];
  }
  if (body.codeStoreKey === 'code_hts_tz_sbbz' && body.codeViewKey === '02') {
    code = [
      { code: "Y", name: "R" },
      { code: "N", name: "" },
    ];
  }
  if (body.codeStoreKey === 'code_hts_tz_txlx' && body.codeViewKey === '01') {
    code = [
      { code: "0", name: "退税" },
      { code: "1", name: "免税" },
      { code: "2", name: "不退税" },
    ];
  }
  if (body.codeStoreKey === 'code_dm_tz_cktmspzlxDm' && body.codeViewKey === '01') {
    code = [
      { code: "02", name: "增值税专用发票" },
      { code: "04", name: "海关进口增值税专用缴款书" },
      { code: "05", name: "海关进口消费税专用缴款书" },
      { code: "06", name: "出口货物消费税专用缴款书" },
      { code: "07", name: "出口货物消费税专用缴款书分割单" },
      { code: "08", name: "税收专用缴款书" },
    ];
  }
  if (body.codeStoreKey === 'code_dm_tz_ysfwDm' && body.codeViewKey === '01') {
    code = [
      { code: "9901100011", name: "海路载货入境" },
      { code: "9901100012", name: "海路载货出境" },
      { code: "9901500021", name: "航空载客入境" },
      { code: "9901500022", name: "航空载客出境" },
    ];
  }
  if (body.codeStoreKey === 'code_dm_ckts_tlyslxDm' && body.codeViewKey === '01') {
    code = [
      { code: "01", name: "铁路" },
      { code: "02", name: "陆运" },
      { code: "03", name: "航空" },
    ];
  }
  if (body.codeStoreKey === 'code_dm_tz_bnshyndm' && body.codeViewKey === '01' || body.codeStoreKey === 'CODE_WM_T_BNSHCODE_INFO' && body.codeViewKey === '01') {
    code = [
      { code: "01", name: "国外商品市场行情变动" },
      { code: "02", name: "出口商品质量原因" },
      { code: "03", name: "动物及鲜活产品变质、腐烂、非正常死亡或损耗" },
      { code: "04", name: "自然灾害、战争等不可抗力因素" },
      { code: "05", name: "进口商破产、关闭、解散" },
      { code: "06", name: "进口国货币汇率变动" },
      { code: "07", name: "溢短装" },
      { code: "08", name: "出口合同约定全部收汇最终日期在申报退（免）税截止期限以后" },
      { code: "09", name: "其他原因" },
    ];
  }
  if (body.codeStoreKey === 'code_dm_tz_hkgjqszdlbDm' && body.codeViewKey === '01') {
    code = [
      { code: "01", name: "付款账单" },
      { code: "02", name: "收款账单" },
    ];
  }
  if (body.codeStoreKey === 'code_dm_tz_hkgjyslbDm' && body.codeViewKey === '01') {
    code = [
      { code: "01", name: "客运" },
      { code: "02", name: "货运" },
    ];
  }
  if (body.codeStoreKey === 'code_dm_tz_gjkyqshjlbDm' && body.codeViewKey === '01') {
    code = [
      { code: "01", name: "旅客出境" },
      { code: "02", name: "旅客入境" },
      { code: "03", name: "行李包裹出境" },
      { code: "04", name: "行李包裹入境" },
      { code: "05", name: "旅客出关" },
      { code: "06", name: "旅客入关" },
      { code: "07", name: "行李包裹出关" },
      { code: "08", name: "行李包裹入关" },
    ];
  }
  // 核查任务-生成状态
  if (body.codeStoreKey === 'CODE_DM_ZXSB_BSWJSCZT' && body.codeViewKey === '01') {
    code = [
      { code: "1", name: "未生成" },
      { code: "2", name: "生成中" },
      { code: "3", name: "生成成功" },
      { code: "4", name: "生成失败" },
    ];
  }

  // 生产 申报类型
  if (body.codeStoreKey === 'CODE_DM_ZXSB_BGDCLLX_SC' && body.codeViewKey === '01') {
    code = [
      { code: "00", name: "未处理" },
      { code: "20", name: "代理出口" },
      { code: "30", name: "退运补税" },
      { code: "11", name: "免抵退" }
    ];
  }
  // 外贸 申报类型
  if (body.codeStoreKey === 'CODE_DM_ZXSB_BGDCLLX_WM' && body.codeViewKey === '01') {
    code = [
      { code: "00", name: "未处理" },
      { code: "20", name: "代理出口" },
      { code: "30", name: "退运补税" },
      { code: "12", name: "免退税" },
      { code: "13", name: "代办退税" }
    ];
  }

  // 运抵国（地区）
  if (body.codeStoreKey === 'CODE_T_GBCODE_INFO' && body.codeViewKey === '01') {
    code = [
      { code: "102", name: "日本" },
      { code: "103", name: "韩国" },
      { code: "104", name: "美国" },
      { code: "105", name: "中国香港" },
      { code: "106", name: "马来西亚" },
      { code: "818", name: "阿拉伯埃及共和国" },
      { code: "222", name: "萨尔瓦多共和国" },
      { code: "226", name: "赤道几内亚共和国" },
    ];
  }

  // 赋码
  if (body.codeStoreKey === 'CODE_DM_FP_SPHFWSSFLYBM' && body.codeViewKey === '01') {
    code = [
      { code: "1000000000000000000", name: "无形资产", sphfwssflhbbm: "1000000000000000000", hwhlwmc: "无形资产", hwhlwjc: "无形资产", sjsphwwflbm: "", sm2: "无形资产", gjz2: "", zzstsgl: "" },
      { code: "2000000000000000000", name: "无形资产", sphfwssflhbbm: "2000000000000000000", hwhlwmc: "无形资产", hwhlwjc: "无形资产", sjsphwwflbm: "", sm2: "无形资产", gjz2: "", zzstsgl: "" },
      { code: "3000000000000000000", name: "不动产", sphfwssflhbbm: "3000000000000000000", hwhlwmc: "不动产", hwhlwjc: "不动产", sjsphwwflbm: "", sm2: "不动产", gjz2: "是指不能移动或者移动后会引起性质、形状改变的财产，包括建筑物、构筑物等。", zzstsgl: "" },
      { code: "4000000000000000000", name: "不动产", sphfwssflhbbm: "4000000000000000000", hwhlwmc: "不动产", hwhlwjc: "不动产", sjsphwwflbm: "", sm2: "不动产", gjz2: "是指不能移动或者移动后会引起性质、形状改变的财产，包括建筑物、构筑物等。", zzstsgl: "" },
      { code: "5000000000000000000", name: "不动产", sphfwssflhbbm: "5000000000000000000", hwhlwmc: "不动产", hwhlwjc: "不动产", sjsphwwflbm: "", sm2: "不动产", gjz2: "是指不能移动或者移动后会引起性质、形状改变的财产，包括建筑物、构筑物等。", zzstsgl: "" },
      { code: "6000000000000000000", name: "无形资产", sphfwssflhbbm: "6000000000000000000", hwhlwmc: "无形资产", hwhlwjc: "无形资产", sjsphwwflbm: "", sm2: "无形资产", gjz2: "", zzstsgl: "" },
      { code: "7000000000000000000", name: "机械、设备类产品", sphfwssflhbbm: "7000000000000000000", hwhlwmc: "机械、设备类产品", hwhlwjc: "机械设备", sjsphwwflbm: "7000000000000000000", sm2: "机械设备", gjz2: "", zzstsgl: "" },
      { code: "8000000000000000000", name: "无形资产", sphfwssflhbbm: "8000000000000000000", hwhlwmc: "无形资产", hwhlwjc: "无形资产", sjsphwwflbm: "", sm2: "无形资产", gjz2: "", zzstsgl: "" },
    ];
  }

  // 发票配置
  if (body.codeStoreKey === 'CODE_CS_ZXSB_FPKJ_CSPZ' && body.codeViewKey === '01') {
    code = [{
      bbh: "78.7",
      fpbtsspxqgzDm: "1",
      fpcfgzDm: "1",
      fphlxqgzDm: '11',
      wckrqfphlxqgzDm: '21',
      fpsplxDm: "1",
      fpzlDm1: "5",
      fpggxhxqgzDm: "1",
      fpgmfsfwjwshrbz: "Y",
      fphwxxxqgzDm: "1",
      fpjelxxqgzDm: "1",
      fpmxkjmsDm: "1",
      fpsldwxqgzDm: "1",
      fpttlxDm: "2",
      fpwctzbz: "Y",
      fpzgkpxeDm: "1",
      fpkjfsDm: "2",
      fjh1: null,
      sph: null,
      dcwjcclj: "C:\\user\\t",
      bfwjcclj: "C:\\user\\t",
      cclj: "C:\\user\\t",
      dyjmc: null,
    }]
  }

  if (body.codeStoreKey === 'CODE_DM_ZXSB_FPBZZDXFGF' && body.codeViewKey === '01') {
    code = [
      { fpbzzdxfgfDm: "1", fpbzzdxfgfmc: "空格", fpbzzdxfgffh: " " },
      { fpbzzdxfgfDm: "2", fpbzzdxfgfmc: "逗号", fpbzzdxfgffh: "," },
      { fpbzzdxfgfDm: "3", fpbzzdxfgfmc: "分号", fpbzzdxfgffh: "；" }
    ]
  }
  if (body.codeStoreKey === 'CODE_DM_ZXSB_FPBZDTSJFGF' && body.codeViewKey === '01') {
    code = [
      { fpbzdtsjfgfDm: "1", fpbzdtsjfgfmc: "反斜线", fpbzdtsjfgffh: "/" },
      { fpbzdtsjfgfDm: "2", fpbzdtsjfgfmc: "直线", fpbzdtsjfgffh: "-" },
      { fpbzdtsjfgfDm: "3", fpbzdtsjfgfmc: "逗号", fpbzdtsjfgffh: "," },
      { fpbzdtsjfgfDm: "4", fpbzdtsjfgfmc: "分号", fpbzdtsjfgffh: "；" }
    ]
  }
  if (body.codeStoreKey === 'CODE_T_YWLXCODE_INFO_MTS_ZNPD' && body.codeViewKey === '01' || body.codeStoreKey === 'CODE_T_YWLXCODE_INFO' && body.codeViewKey === '01') {
    code = [
      { code: "TSQY", name: "特殊区域" },
      { code: "DWYZ", name: "对外援助" },
      { code: "DWCB", name: "对外承包" },
      { code: "JWTZ", name: "境外投资" },
      { code: "MSD", name: "免税店" },
      { code: "ZB", name: "中标机电" },
      { code: "WL", name: "外轮货物" },
      { code: "HKSP", name: "航空食品" },
      { code: "XLXP", name: "修理修配" },
      { code: "BSQ", name: "保税区" },
    ]
  }

  // 通用 申报类型
  if (body.codeStoreKey === 'code_dm_cs_zxsb_lcswsx' && body.codeViewKey === '01') {
    code = [
      { code: "LCSXA081039001", name: "免退税申报" },
      { code: "LCSXA081040001", name: "代办退税申报" },
      { code: "LCSXA081038001", name: "免抵退税申报" },
    ];
  }

  // 外贸 申报类型
  if (body.codeStoreKey === 'CODE_WM_CS_ZXSB_LCSWSX' && body.codeViewKey === '01') {
    code = [
      { code: "LCSXA081039001", name: "免退税申报" },
      { code: "LCSXA081040001", name: "代办退税申报" },
    ];
  }

  // 生产 申报类型CODE_SC_CS_ZXSB_LCSWSX
  if (body.codeStoreKey === 'CODE_SC_CS_ZXSB_LCSWSX' && body.codeViewKey === '01') {
    code = [
      { code: "LCSXA081038001", name: "免抵退税申报" },
    ];
  }

  // 结汇方式
  if (body.codeStoreKey === 'code_dm_ckts_jhfs' && body.codeViewKey === '01') {
    code = [
      { code: "1", name: "信汇" },
      { code: "2", name: "电汇" },
      { code: "3", name: "票汇" },
      { code: "4", name: "付款交单" },
    ];
  }


  if (body.codeStoreKey === 'code_static_tmsjhmxsz_dm' && body.codeViewKey === '01') {
    code = [
      { code: "V", name: "增值税" },
      { code: "C", name: "消费税" },
    ];
  }

  if (body.codeStoreKey === 'CODE_DM_ZXSB_BGDSBQK_DYY' && body.codeViewKey === '01') {
    code = [
      { code: "2", name: "待申报" },
      { code: "3", name: "已申报" },
      { code: "4", name: "已审核" },
    ];
  }

  // 数据报表 外贸 申报情况
  if (body.codeStoreKey === 'CODE_DM_ZXSB_BGDSBQK' && body.codeViewKey === '01') {
    code = [
      { code: "1", name: "未申报" },
      { code: "2", name: "待申报" },
      { code: "3", name: "已申报" },
      { code: "4", name: "已审核" },
      { code: "5", name: "部分退税"},
      { code: "6", name: "不予退税"},
      { code: "8", name: "暂不办理"},
    ];
  }

  // 退运申报情况 - 业务类型
  if (body.codeStoreKey === 'CODE_DM_CKTS_TYYBSWTSTYLX' && body.codeViewKey === '01') {
    code = [
      {code: "1", name: "退运"},
      {code: "2", name: "改单"},
      {code: "3", name: "撤单"},
    ];
  }

  // 跨境应税行为代码
  if (body.codeStoreKey === 'CODE_WM_T_CMCODE_INFO' && body.codeViewKey === '01') {
    code = [
      {code: "9903000000", name: "对外设计服务"},
      {code: "9903010400", name: "合同能源管理服务（合"},
      {code: "9903020100", name: "软件服务"},
      {code: "9903020200", name: "电路设计及测试服务"},
      {code: "9903020300", name: "信息系统服务"},
    ];
  }

  if (body.codeStoreKey === 'code_dm_cs_ckts_cksp' && body.codeViewKey === '03') {
    code = [
      {code: "71022100", name: "工业用钻石"},
      {code: "71012290", name: "其他已加工的养殖珍珠"},
      {code: "71022100001", name: "按9％征税的工业用钻"},
      {code: "71022100002", name: "按13％征税的工业用钻"},
      {code: "71059000", name: "其他天然或合成宝石或"},
    ];
  }

  // 企业类型
  if (body.codeStoreKey === 'code_dm_rd_cktsqylx' && body.codeViewKey === '01') {
    code = [
      {code: "1", name: "内资生产企业"},
      {code: "2", name: "外商投资生产企业"},
      {code: "3", name: "外贸企业"},
      {code: "9", name: "其他企业"},
    ];
  }

  // 企业类型
  if (body.codeStoreKey === 'code_dm_gy_yhzxqygxlx' && body.codeViewKey === '01') {
    code = [
      {name: "隶属", code: "01"},
      {name: "代理", code: "02"},
      {name: "代理出口货物（2+n）", code: "03"},
      {name: "代办退税（3+N）", code: "04"},
    ];
  }

  // 用户类型
  if (body.codeStoreKey === 'code_dm_gy_yhlx' && body.codeViewKey === '01') {
    code = [
      // {code: "09", name: "系统管理员"},
      {code: "11", name: "管理员"},
      {code: "12", name: "一般用户"},
    ];
  }

  //汇率规则
  if (body.codeStoreKey === 'DM_ZXSB_FPHLXQGZ' && body.codeViewKey === '01') {
    code = [
      // {name: "使用出口退税汇率", code: "00"},
      // {name: "自行维护开票汇率", code: "10"},
      // {name: "按申报日期当天汇率", code: "21"},
      // {name: "按申报日期当月第一个工作日", code: "22"},
      // {name: "按申报日期当月第一天", code: "23"},
      // {name: "按申报日期当月最后一天", code: "24"},
      {name: "按出口日期当天汇率", code: "11"},
      {name: "按出口日期当月第一个工作日", code: "12"},
      {name: "按出口日期当月第一天", code: "13"},
      {name: "按出口日期当月最后一天", code: "14"},
    ];
  }

  // 企业标签
  if(body.codeStoreKey === 'code_dm_ckts_cktmsbakzlx' &&  body.codeViewKey === '01') {
    code = [
      {name: "保税区外开展对外维修业务", bz: null, code: "BSQWDWWX", sfkbjbz: "N"},
      {name: "出口货物退（免）税需提供收汇资料", bz: null, code: "CKSH9", sfkbjbz: "N"},
      {name: "法定代表人曾担任过增值税违法企业法定代表人", bz: null, code: "DRWFQY", sfkbjbz: "Y"},
      {name: "取消单证无纸化", bz: null, code: "DZWZH", sfkbjbz: "N"},
      {name: "分类管理代码", bz: null, code: "FLGLCD", sfkbjbz: "N"},
      {name: "放弃零税率声明", bz: null, code: "FQLSL", sfkbjbz: "N"},
      {name: "放弃免税权", bz: null, code: "FQMSQ", sfkbjbz: "N"},
      {name: "放弃出口免税政策实行征税政策的出口企业", bz: null, code: "FQMSSXZS", sfkbjbz: "N"},
      {name: "放弃退免税声明", bz: null, code: "FQTMS", sfkbjbz: "N"},
      {name: "放弃出口退（免）税政策实行免税政策的出口企业", bz: null, code: "FQTSSXMS", sfkbjbz: "N"},
      {name: "放弃出口退（免）税政策实行征税政策的出口企业", bz: null, code: "FQTSSXZS", sfkbjbz: "N"},
      {name: "航天发射业务", bz: null, code: "HTFSYW", sfkbjbz: "N"},
      {name: "是否跨境贸易", bz: null, code: "KJMY", sfkbjbz: "N"},
      {name: "列名生产企业", bz: null, code: "LMQY", sfkbjbz: "N"},
      {name: "从事航空国际运输（含港澳台）的出口企业", bz: null, code: "LSL_HKYS", sfkbjbz: "N"},
      {name: "从事陆路国际运输（含港澳台）的出口企业", bz: null, code: "LSL_LLYS", sfkbjbz: "N"},
      {name: "从事对外提供设计服务的出口企业", bz: null, code: "LSL_SJFW", sfkbjbz: "N"},
      {name: "从事水路国际运输（含港澳台）的出口企业", bz: null, code: "LSL_SLYS", sfkbjbz: "N"},
      {name: "从事对外提供研发服务的出口企业", bz: null, code: "LSL_YFFW", sfkbjbz: "N"},
      {name: "国家批准的免税品经营企业", bz: null, code: "MSD", sfkbjbz: "Y"},
      {name: "内资研发机构", bz: null, code: "NZYFJG", sfkbjbz: "N"},
      {name: "启运港退税", bz: null, code: "QYGTS", sfkbjbz: "N"},
      {name: "融资租赁", bz: null, code: "RZZL", sfkbjbz: "N"},
      {name: "特殊区域内申报水电气退税业务的生产企业", bz: null, code: "SDQ", sfkbjbz: "N"},
      {name: "申报时需提供专用缴款书的出口企业", bz: null, code: "TGCKZYSP", sfkbjbz: "Y"},
      {name: "申报时需提供收汇凭证的出口企业", bz: null, code: "TGSHZL", sfkbjbz: "Y"},
      {name: "停止出口退税权的出口企业", bz: null, code: "TQQY", sfkbjbz: "Y"},
      {name: "出口退（免）税货物由于符合相关文件规定适用免税政策的出口企业", bz: null, code: "TSGMS", sfkbjbz: "Y"},
      {name: "停止从事代办退税业务", bz: null, code: "TZCSDBTS", sfkbjbz: "Y"},
      {name: "具有出口外购卷烟资格的卷烟出口企业", bz: null, code: "WGJYCK", sfkbjbz: "Y"},
      {name: "外轮、远洋运输供应公司", bz: null, code: "WL", sfkbjbz: "N"},
      {name: "受卷烟生产企业委托出口自产卷烟的卷烟出口企业", bz: null, code: "WTJYCK", sfkbjbz: "N"},
      {name: "无纸化企业", bz: null, code: "WZHQY", sfkbjbz: "N"},
      {name: "外资研发机构", bz: null, code: "WZYFJG", sfkbjbz: "N"},
      {name: "国家批准的免税出口卷烟计划内自营出口自产卷烟的卷烟生产企业", bz: null, code: "ZCJYCK", sfkbjbz: "Y"},
      {name: "横琴、平潭企业", bz: null, code: "HQPTQY", sfkbjbz: "Y"},
    ]
  }

  // 证明申报 作废 证明种类 code_dm_ckts_cktszmlx
  if(body.codeStoreKey === 'code_dm_ckts_cktszmlx' &&  body.codeViewKey === '01') {
    code = [
      {code: "01", name: "代理出口货物证明"},
      {code: "02", name: "代理进口货物证明"},
      {code: "03", name: "委托出口货物证明"},
      {code: "04", name: "出口货物转内销证明"},
      {code: "05", name: "出口货物退运已补税（未退税）证明"},
      {code: "07", name: "中标证明通知书"},
      {code: "08", name: "补办出口退、免税相关证明"},
      {code: "10", name: "来料加工免税证明"},
      {code: "12", name: "准予免税购进出口卷烟证明"},
      {code: "13", name: "出口卷烟已免税证明"},
    ]
  }

  // 资格备案 代办退税备案 流程状态 code_dm_ckts_dbtsbalczt
  if(body.codeStoreKey === 'code_dm_ckts_dbtsbalczt' &&  body.codeViewKey === '02') {
    code = [
      {code: "1", name: "备案"},
      {code: "2", name: "变更"},
    ]
  }

  // 免退税 进项发票管理 发票种类
  if(body.codeStoreKey === 'CODE_DM_ZXSB_FPZLXQGZ' &&  body.codeViewKey === '01') {
    code = [
      {code: "1", name: "增值税专用发票"},
      {code: "2", name: "增值税电子专用发票"},
      {code: "3", name: "增值税普通发票"},
      {code: "4", name: "增值税电子普通发票"},
      {code: "5", name: "数电票（普通发票）"},
    ]
  }

  if(body.codeStoreKey === 'code_dm_ckts_gnqyfs' &&  body.codeViewKey === '01') {
    code = [
      {name: "水路运输", code: "1"},
      {name: "铁路运输", code: "2"},
    ]
  }

  if(body.codeStoreKey === 'code_dm_ckts_hgzsrzqylx' &&  body.codeViewKey === '01') {
    code = [
      {name: "高级认证企业", code: "1"},
      {name: "其他企业", code: "2"},
      {name: "失信企业", code: "3"},
    ]
  }

  if(body.codeStoreKey === 'code_cs_ckts_stshqkyy' &&  body.codeViewKey === '01') {
    code = [
      {name: "国外商品市场行情变动", code: "01"},
      {name: "出口商品质量原因", code: "02"},
      {name: "动物及鲜活产品变质、腐烂、非正常死亡或损耗", code: "03"},
      {name: "自然灾害、战争等不可抗力因素", code: "04"},
      {name: "进口商破产、关闭、解散（材料提供任意一个即可）", code: "05"},
      {name: "进口国货币汇率变动", code: "06"},
      {name: "溢短装", code: "07"},
      {name: "出口合同约定全部收汇最终日期在申报退（免）税截止期限以后", code: "08"},
      {name: "无法收汇而取得出口信用保险赔款", code: "09"},
      {name: "其他原因", code: "10"},
    ]
  }

  if(body.codeStoreKey === 'code_cs_ckts_stshqkjzclzl' &&  body.codeViewKey === '01') {
    code = [
      {name: "有关商会出具的证明", code: "01"},
      {name: "有关交易所行情报价资料", code: "02"},
      {name: "进口商相关证明材料（由于客观原因无法提供）", code: "03"},
      {name: "进口商的有关函件、进口国商检机构的证明", code: "04"},
      {name: "进口商的检验报告等证明材料（由于客观原因无法提供进口国商检机构证明）", code: "05"},
      {name: "货物、原材料生产商等第三方证明材料（由于客观原因无法提供进口国商检机构证明）", code: "06"},
      {name: "进口商的有关函件", code: "07"},
      {name: "进口国商检机构的证明", code: "08"},
      {name: "进口商相关证明材料（由于客观原因无法提供进口国商检机构证明）", code: "09"},
      {name: "货物运输等第三方证明材料（由于客观原因无法提供进口国商检机构证明）", code: "10"},
      {name: "报刊等新闻媒体的报道材料", code: "11"},
      {name: "中国驻进口国使领馆商务处出具的证明", code: "12"},
      {name: "报刊等新闻媒体的报道材料债权申报证明", code: "13"},
      {name: "进口商所在地破产清算机构出具的证明", code: "14"},
      {name: "债权申报证明", code: "15"},
      {name: "报刊等新闻媒体刊登", code: "16"},
      {name: "外汇局公布的汇率资料", code: "17"},
      {name: "提单", code: "18"},
      {name: "其他正式货运单证等商业单证", code: "19"},
      {name: "出口合同", code: "20"},
      {name: "出口信用保险合同", code: "21"},
      {name: "保险理赔单据", code: "22"},
      {name: "赔款入账流水", code: "23"},
      {name: "主管税务机关认可的有效凭证", code: "24"},
    ]
  }

  if(body.codeStoreKey === 'code_dm_ckts_hkgjqszdlb' &&  body.codeViewKey === '01') {
    code = [
      {name: "付款账单", code: "01"},
      {name: "收款账单", code: "02"},
    ]
  }

  if(body.codeStoreKey === 'code_dm_ckts_hkgjyslb' &&  body.codeViewKey === '01') {
    code = [
      {name: "客运", code: "01"},
      {name: "货运", code: "02"},
    ]
  }

  if(body.codeStoreKey === 'code_dm_ckts_gjkyqshjlb' &&  body.codeViewKey === '01') {
    code = [
      {name: "旅客出境", code: "01"},
      {name: "旅客入境", code: "02"},
      {name: "行李包裹出境", code: "03"},
      {name: "行李包裹入境", code: "04"},
      {name: "旅客出关", code: "05"},
      {name: "旅客入关", code: "06"},
      {name: "行李包裹出关", code: "07"},
      {name: "行李包裹入关", code: "08"},
    ]
  }

  if(body.codeStoreKey === 'code_dm_ckts_tlyslx' &&  body.codeViewKey === '02' || body.codeStoreKey === 'code_dm_ckts_tlyslx' &&  body.codeViewKey === '01') {
    code = [
      {name: "汇总成员企业核收", code: "01"},
      {name: "其他铁路运输企业核收", code: "02"},
    ]
  }

  if(body.codeStoreKey === 'code_dm_ckts_yfsjfw' &&  body.codeViewKey === '02') {
    code = [
      {name: "研发服务", code: "YFFW"},
      {name: "合同能源管理服务", code: "HTNYGLFW"},
      {name: "设计服务", code: "SJFW"},
      {name: "广播影视制作服务", code: "GBYSZZFW"},
      {name: "广播影视发行服务", code: "GBYSFXFW"},
      {name: "软件服务", code: "RJFW"},
      {name: "电路设计测试服务", code: "DLSJCSFW"},
      {name: "信息系统服务", code: "XXXTFW"},
      {name: "业务流程管理服务", code: "YWLCGL"},
      {name: "信息技术外包服务", code: "ITO"},
      {name: "业务流程外包服务", code: "BPO"},
      {name: "知识流程外包服务", code: "KPO"},
      {name: "转让技术服务", code: "ZRJS"},
    ]
  }

  if(body.codeStoreKey === 'code_dm_ckts_wmqytzsblx' &&  body.codeViewKey === '02') {
    code = [
      {name: "出口货物劳务免退税申报调整", code: "1"},
    ]
  }

  if(body.codeStoreKey === 'CODE_DM_ZXSB_FPKJZT' && body.codeViewKey === '01') {
    code = [
      { name: '开票中', code: '1' },
      { name: '开票成功', code: '3' },
      { name: '开票失败', code: '2' },
      { name: '作废中', code: '4' },
      { name: '作废失败', code: '5' },
      { name: '作废成功', code: '6' },
      { name: '红冲', code: '7' },
      { name: '登录失败', code: 'F' },
    ]
  }

  if(body.codeStoreKey === 'CODE_DM_ZXSB_FPKJZT' && body.codeViewKey === '02') {
    code = [
      { name: '开票中', code: '1' },
      { name: '开票成功', code: '3' },
      { name: '开票失败', code: '2' },
      { name: '作废中', code: '4' },
      { name: '作废失败', code: '5' },
      { name: '作废成功', code: '6' },
      { name: '红冲', code: '7' },
    ]
  }

  // 在线开票-发票状态追踪-蓝票 发票状态
  if(body.codeStoreKey === 'CODE_DM_ZXSB_FPKJZT' && body.codeViewKey === '03') {
    code = [
      { name: '开票中', code: '1' },
      { name: '开票失败', code: '2' },
      { name: '登录失败', code: 'F' },
    ]
  }

  // 在线开票-发票状态追踪-红票 发票状态
  if(body.codeStoreKey === 'CODE_DM_ZXSB_FPKJZT' && body.codeViewKey === '04') {
    code = [
      { name: '确认中', code: '9' },
      { name: '开票中', code: '1' },
      { name: '已拒绝', code: '10' },
      { name: '已失效', code: '11' },
      { name: '开票失败', code: '2' },
    ]
  }

  // 在线开票-发票状态追踪-红票 发票状态
  if(body.codeStoreKey === 'CODE_DM_ZXSB_FPKJZT' && body.codeViewKey === '05') {
    code = [
      { name: '作废中', code: '4' },
      { name: '作废失败', code: '5' },
    ]
  }

  // 在线开票-发票管理-蓝票 发票状态
  if(body.codeStoreKey === 'CODE_DM_ZXSB_FPKJZT' && body.codeViewKey === '06') {
    code = [
      { name: '开票成功', code: '3' },
      { name: '红冲', code: '7' },
    ]
  }

  // 在线开票-发票管理-红票 发票状态
  if(body.codeStoreKey === 'CODE_DM_ZXSB_FPKJZT' && body.codeViewKey === '07') {
    code = [
      { name: '开票成功', code: '3' },
    ]
  }


// 在线开票-发票管理-作废 发票状态
if(body.codeStoreKey === 'CODE_DM_ZXSB_FPKJZT' && body.codeViewKey === '08') {
  code = [
    { name: '作废成功', code: '6' },
  ]
}

// 在线开票-检查状态
if(body.codeStoreKey === 'CODE_DM_ZXSB_FPKJZT' && body.codeViewKey === '09') {
  code = [
    { name: '检查中', code: 'C' },
    { name: '检查通过', code: 'D' },
    { name: '检查未通过', code: 'E' },
  ]
}


  if(body.codeStoreKey === 'code_dm_zxsb_hcyy' && body.codeViewKey === '01') {
    code = [
      { name: '销货退回', code: '1' },
      { name: '开票有误', code: '2' },
      { name: '应税服务中止', code: '3' },
      { name: '发生销售折让', code: '4' },
    ]
  }

  if(body.codeStoreKey === 'CODE_DM_ZXSB_FPKJSJLY' && body.codeViewKey === '01') {
    code = [
      { name: '报关单开具', code: '1' },
      { name: '代理证明开具', code: '2' },
      { name: '导入模板开具', code: '3' },
    ]
  }

  if(body.codeStoreKey === 'CODE_DM_ZXSB_BGDPDSBLX' && body.codeViewKey === '01') {
    code = [
      { name: '未找到符合换汇成本范围内发票数据', code: 'E101' },
      { name: '未找到出口数量相符的发票数据', code: 'E102' },
      { name: '未找到商品名称相符的发票数据', code: 'E103' },
      { name: '未找到单位相符的发票数据', code: 'E104' },
    ]
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
  if (body.codeStoreKey === 'CODE_DM_BADZ_BADZ' && body.codeViewKey === '01') {
    code = [{
      "title": "退税单证资料",
      "value": "10000",
      "disabled": true,
      "children": [{
        "title": "出口货物报关单",
        "value": "10100",
        "disabled": true,
        "children": [{
          "title": "出口货物报关单",
          "value": "10101"
        }]
      }, {
        "title": "出口发票",
        "disabled": true,
        "value": "10200",
        "children": [{
          "title": "出口发票",
          "value": "10201"
        }]
      }, {
        "title": "进项增值税专用发票",
        "disabled": true,
        "value": "10300",
        "children": [{
          "title": "进项增值税专用发票",
          "value": "10301"
        }]
      }]
    }, {
      "title": "备案单证资料",
      "value": "20000",
      "disabled": true,
      "children": [{
        "title": "购货合同",
        "value": "20100",
        "disabled": true,
        "children": [{
          "title": "购货合同",
          "value": "20101"
        }]
      }, {
        "title": "出口货物装货单",
        "disabled": true,
        "value": "20200",
        "children": [{
          "title": "出口货物装货单",
          "value": "20201"
        }]
      }, {
        "title": "无纸化放行通知书",
        "disabled": true,
        "value": "20300",
        "children": [{
          "title": "无纸化放行通知书",
          "value": "20301"
        }]
      }, {
        "title": "出口货物运输单据",
        "disabled": true,
        "value": "20400",
        "children": [{
          "title": "海运提单",
          "value": "20401"
        }, {
          "title": "航空运单",
          "value": "20402"
        }, {
          "title": "铁路运单",
          "value": "20403"
        }]
      }]
    }, {
      "title": "其他关联资料",
      "value": "30000",
      "disabled": true,
      "children": [{
        "title": "其他单证",
        "disabled": true,
        "value": "30100",
        "children": [{
          "title": "出口合同",
          "value": "30101"
        }, {
          "title": "自制出口发票",
          "value": "30102"
        }, {
          "title": "出入库单",
          "value": "30103"
        }, {
          "title": "运输合同",
          "value": "30104"
        }]
      }]
    }];
  } else if (body.codeStoreKey === 'CODE_DM_BADZ_BADZ' && body.codeViewKey === '02') {
    code = [{
      "title": "退税单证资料",
      "value": "10000",
      "children": [{
        "title": "出口货物报关单",
        "value": "10100"
      }, {
        "title": "出口发票",
        "value": "10200"
      }, {
        "title": "进项增值税专用发票",
        "value": "10300"
      }]
    }, {
      "title": "备案单证资料",
      "value": "20000",
      "children": [{
        "title": "购货合同",
        "value": "20100"
      }, {
        "title": "出口货物装货单",
        "value": "20200"
      }, {
        "title": "无纸化放行通知书",
        "value": "20300"
      }, {
        "title": "出口货物运输单据",
        "value": "20400"
      }]
    }, {
      "title": "其他关联资料",
      "value": "30000",
      "children": [{
        "title": "其他单证",
        "value": "30100"
      }]
    }];
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
}
