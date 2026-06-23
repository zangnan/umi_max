import getStaticTableCodeHts from '@/pages/hts/commonModule/staticTableCode';
// 获取指定码表
const getStaticTableCode = (codeStoreKey: any) => {
  let returnData: any;
  let code: any;
  if (codeStoreKey === 'code_static_yxbz') {
    code = [
      { code: "Y", name: "有效" },
      { code: "N", name: "无效" },
    ];
  }
  // if (codeStoreKey === 'code_dm_ckts_cktmsywlx') {
  //   code = [
  //     { code: "HTYSFW", name: "航天运输服务" },
  //     { code: "ZGJF", name: "在轨交付" },
  //   ];
  // }
  if (codeStoreKey === 'code_dm_ckts_hgjldw') {
    code = [
      { code: "01", name: "台座辆艘架套个只....", hgjldwqc: "台座辆艘架套个只头张件支枝根片条把块卷副" },
      { code: "02", name: "双.对", hgjldwqc: "双.对" },
      { code: "04", name: "米", hgjldwqc: "米" },
      { code: "05", name: "平方米", hgjldwqc: "平方米" },
      { code: "06", name: "立方米", hgjldwqc: "立方米" },
      { code: "07", name: "升", hgjldwqc: "升" },
      { code: "09", name: "千克", hgjldwqc: "千克" },
      { code: "21", name: "百个.百枝.百把.百...", hgjldwqc: "百个.百枝.百把.百副.百片.百支" },
    ];
  }
  if (codeStoreKey === 'code_dm_ckts_hgjgfs') {
    code = [
      { jgfsqc: "一般贸易", jgfstslxdm: "1", code: "0110", name: "一般贸易" },
      { jgfsqc: "易货贸易", jgfstslxdm: "1", code: "0130", name: "易货贸易" },
      { jgfsqc: "用于旅游者五万美元以下的出口小批量订货", jgfstslxdm: "0", code: "0139", name: "旅游购物商品" },
      { jgfsqc: "加工区内仓储企业从境外进口的货物", jgfstslxdm: "0", code: "5033", name: "区内仓储货物", jgfssm: null },
      { jgfsqc: "海关特殊监管区域与境外之间进出的物流货物", jgfstslxdm: "0", code: "5034", name: "区内物流货物" },
      { jgfsqc: "用于区内外非实际进出境货物", jgfstslxdm: "0", code: "5200", name: "区内边角调出", jgfssm: null },
    ];
  }
  if (codeStoreKey === 'code_dm_ckts_hgyfjsfs') {
    code = [
      { code: "1", name: "运费率" },
      { code: "2", name: "每吨货物的运费单价" },
      { code: "3", name: "运费总价" },
    ];
  }
  if (codeStoreKey === 'code_static_hgcjfs_mc') {
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
  if (codeStoreKey === 'code_dm_ckts_hgbfjsfs') {
    code = [
      { code: "1", name: "保险费率" },
      { code: "3", name: "保险费总价" },
    ];
  }
  if (codeStoreKey === 'code_dm_ckts_hgzfjsfs') {
    code = [
      { code: "1", name: "杂费率" },
      { code: "3", name: "杂费总价" },
    ];
  }
  if (codeStoreKey === 'code_static_bgd_gdxx_dm') {
    code = [
      { code: "", name: "全部" },
      { code: "Y", name: "有" },
      { code: "N", name: "无" },
    ];
  }
  if (codeStoreKey === 'code_static_bgd_zmlx_dm') {
    code = [
      { code: "", name: "全部" },
      { code: "6", name: "退税" },
      { code: "5", name: "征税" },
      { code: "4", name: "免税" },
    ];
  }
  if (codeStoreKey === 'code_static_bgd_sbyw_dm') {
    code = [
      { code: "", name: "全部" },
      { code: "1", name: "退税申报" },
      { code: "2", name: "代理出口" },
      { code: "6", name: "代办退税" },
    ];
  }
  if (codeStoreKey === 'code_static_bgd_zt_dm') {
    code = [
      { code: "", name: "全部" },
      { code: "Y", name: "已生成" },
      { code: "N", name: "未生成" },
    ];
  }
  if (codeStoreKey === 'code_static_bgd_cytgbz_dm') {
    code = [
      { code: "", name: "全部" },
      { code: "Y", name: "检查通过" },
      { code: "N", name: "检查未通过" },
      { code: " ", name: "未检查" },
    ];
  }
  if (code && code.length > 0) {
    returnData = {
      code: '200',
      body: code
    };
    return returnData;
  }
  if (codeStoreKey.indexOf(':') > -1) {
    return getStaticTableCodeHts(codeStoreKey.split(':')[0], codeStoreKey.split(':')[1]);
  }
  return null;
}

export default getStaticTableCode;
