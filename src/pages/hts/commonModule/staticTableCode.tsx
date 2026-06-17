// 获取指定码表
const getStaticTableCode = (codeStoreKey: any, codeViewKey: any) => {
  let returnData: any;
  let code: any;
  // if (codeStoreKey === 'code_dm_ckts_cktmsywlx' && codeViewKey === '05') {
  //   code = [
  //     { mtsbz: "Y", code: "CBTS", name: "船舶退税", bz: null, mdtbz: "Y" },
  //     { mtsbz: "Y", code: "GCSB", name: "国产设备", bz: "研发机构采购国产设备", mdtbz: "N" },
  //     { mtsbz: "Y", code: "TSQY", name: "特殊区域", bz: "关进入特殊区域并销售给特殊区域内单位或境外单位、个人的货物（除销售给特殊区域内生产企业生产耗用的列名原材料外）", mdtbz: "Y" },
  //     { mtsbz: "Y", code: "LMYCL", name: "列名原材料", bz: "销售给特殊区域内生产企业生产耗用的列名原材料", mdtbz: "Y" },
  //     { mtsbz: "Y", code: "DWYZ", name: "对外援助", bz: "对外援助出口货物", mdtbz: "Y" },
  //     { mtsbz: "Y", code: "DWCB", name: "对外承包", bz: "用于对外承包工程项目的出口货物", mdtbz: "Y" },
  //     { mtsbz: "Y", code: "JWTZ", name: "境外投资", bz: "用于境外投资出口的货物", mdtbz: "Y" },
  //     { mtsbz: "Y", code: "MSD", name: "免税店", bz: "免税品经营企业销售的货物", mdtbz: "Y" },
  //     { mtsbz: "Y", code: "ZB", name: "中标机电", bz: "销售的中标机电产品", mdtbz: "Y" },
  //     { mtsbz: "Y", code: "WL", name: "外轮货物", bz: "销售给外轮、远洋国轮的货物", mdtbz: "Y" },
  //     { mtsbz: "Y", code: "XLXP", name: "修理修配", bz: "对外提供加工修理修配劳务", mdtbz: "Y" },
  //     { mtsbz: "Y", code: "SDQ", name: "水电气", bz: "输入特殊区域的水电气", mdtbz: "N" },
  //     { mtsbz: "Y", code: "BSQ", name: "保税区", bz: "企业销售给境外单位、个人，经保税区出口的货物", mdtbz: "Y" },
  //     { mtsbz: "Y", code: "BM", name: "边境贸易", bz: "边境地区一般贸易或边境小额贸易项下以人民币结算的从所在省（自治区）的边境口岸出口到接壤毗邻国家，并采取银行转账人民币结算方式的出口货物", mdtbz: "Y" },
  //     { mtsbz: "Y", code: "QYGTS", name: "启运港退税", bz: "启运港退税的出口货物", mdtbz: "Y" },
  //     { mtsbz: "Y", code: "BMDL", name: "边贸代理", bz: "边境小额贸易企业代理外国企业、外国自然人报关出口货物", mdtbz: "Y" },
  //     { mtsbz: "Y", code: "BAQDTS", name: "备案清单退税", bz: null, mdtbz: "Y" },
  //     { mtsbz: "Y", code: "HXWH", name: "航线维护", bz: null, mdtbz: "N" },
  //     { mtsbz: "Y", code: "HCWX", name: "航次维修", bz: null, mdtbz: "N" },
  //     { mtsbz: "Y", code: "XLXP_01", name: "修理修配飞机", bz: null, mdtbz: "Y" },
  //     { mtsbz: "Y", code: "XLXP_02", name: "修理修配船舶", bz: null, mdtbz: "Y" },
  //     { mtsbz: "Y", code: "WMZHFW", name: "外贸综合服务", bz: "外贸综合服务企业以自营方式出口国内生产企业与境外单位或个人签约的出口货物", mdtbz: "N" },
  //     { mtsbz: "Y", code: "WLMSP", name: "未列明商品", bz: null, mdtbz: "N" },
  //     { mtsbz: "Y", code: "HTYSFW", name: "航天运输服务", bz: "航天运输服务填写", mdtbz: "N" },
  //     { mtsbz: "Y", code: "ZGJF", name: "在轨交付", bz: "在轨交付的空间飞行器及相关货物的填写", mdtbz: "N" },
  //     { mtsbz: "Y", code: "RZZL", name: "融资租赁", bz: null, mdtbz: "N" },
  //     { mtsbz: "Y", code: "GHQYTS", name: "横琴、平潭购进货物", bz: null, mdtbz: "N" },
  //     { mtsbz: "Y", code: "YFFW", name: "对外提供研发服务", bz: null, mdtbz: "Y" },
  //     { mtsbz: "Y", code: "SJFW", name: "提供设计服务", bz: null, mdtbz: "Y" },
  //     { mtsbz: "Y", code: "GBYSZZFW", name: "提供广播影视节目（作品）的制作服务", bz: null, mdtbz: "Y" },
  //     { mtsbz: "Y", code: "GBYSFXFW", name: "对外提供广播影视节目（作品）的发行服务", bz: null, mdtbz: "Y" },
  //     { mtsbz: "Y", code: "JSZRFW", name: "提供技术转让服务", bz: null, mdtbz: "Y" },
  //     { mtsbz: "Y", code: "RJFW", name: "提供软件服务", bz: null, mdtbz: "Y" },
  //     { mtsbz: "Y", code: "DLSJCSFW", name: "提供电路设计及测试服务", bz: null, mdtbz: "Y" },
  //     { mtsbz: "Y", code: "XXXTFW", name: "提供信息系统服务", bz: null, mdtbz: "Y" },
  //     { mtsbz: "Y", code: "YWLCGL", name: "提供业务流程管理服务", bz: null, mdtbz: "Y" },
  //     { mtsbz: "Y", code: "HTNYGLFW", name: "提供合同标的物在境外的合同能源管理服务", bz: null, mdtbz: "Y" },
  //     { mtsbz: "Y", code: "ITO", name: "提供信息技术外包服务", bz: null, mdtbz: "Y" },
  //     { mtsbz: "Y", code: "BPO", name: "提供技术性业务流程外包服务", bz: null, mdtbz: "Y" },
  //     { mtsbz: "Y", code: "KPO", name: "提供技术性知识流程外包服务", bz: null, mdtbz: "Y" },
  //   ];
  // }
  if (codeStoreKey === 'code_dm_ckts_cktmspzlx' && codeViewKey === '06') {
    code = [
      { code: "02", name: "增值税专用发票" },
      { code: "04", name: "海关进口增值税专用缴款书" },
    ];
  }
  if (codeStoreKey === 'code_dm_ckts_cktmspzlx' && codeViewKey === '06') {
    code = [
      { code: "02", name: "增值税专用发票" },
      { code: "04", name: "海关进口增值税专用缴款书" },
    ];
  }
  if (codeStoreKey === 'code_static_ssjc_yes_no' && codeViewKey === '01') {
    code = [
      { code: 'Y', name: '已试算' },
      { code: 'N', name: '未试算' }
    ];
  }
  if (codeStoreKey === 'code_static_qybz_yes_no' && codeViewKey === '01') {
    code = [
      { code: '', name: '全部' },
      { code: 'Y', name: '已启用' },
      { code: 'N', name: '未启用' }
    ];
  }
  if (codeStoreKey === 'code_static_zbpz_yes_no' && codeViewKey === '01') {
    code = [
      { code: 'Y', name: '已启用' },
      { code: 'N', name: '未启用' }
    ];
  }
  if (codeStoreKey === 'code_static_Cjpd_yes_no' && codeViewKey === '01') {
    code = [
      { code: '01', name: '台账配单' },
      { code: '02', name: '超级配单' }
    ];
  }
  if (codeStoreKey === 'code_static_xqDm1' && codeViewKey === '01') {
    code = [
      { code: '1', name: '星期一' },
      { code: '2', name: '星期二' },
      { code: '3', name: '星期三' },
      { code: '4', name: '星期四' },
      { code: '5', name: '星期五' },
      { code: '6', name: '星期六' },
      { code: '7', name: '星期日' },
    ];
  }
  if (codeStoreKey === 'code_static_yes_no' && codeViewKey === '01') {
    code = [
      { code: 'Y', name: '是' },
      { code: 'N', name: '否' }
    ];
  }
  if (codeStoreKey === 'code_static_yh_sqdm' && codeViewKey === '02') {
    code = [
      { code: '02', name: '试用版' },
      { code: '01', name: '正式版' }
    ];
  }

  if (codeStoreKey === 'code_static_yes_no' && codeViewKey === '02') {
    code = [
      { code: '', name: '全部' },
      { code: 'Y', name: '是' },
      { code: 'N', name: '否' }
    ];
  }
  if (codeStoreKey === 'code_dm_ckts_cktmsywlx' && codeViewKey === '02') {
    code = [
      { code: "HTYSFW", name: "航天运输服务" },
      { code: "ZGJF", name: "在轨交付" },
    ];
  }
  if (codeStoreKey === 'code_dm_ckts_hgjldw' && codeViewKey === '01') {
    code = [
      { code: "01", name: "台座辆艘架套个只....", hgjldwqc: "台座辆艘架套个只头张件支枝根片条把块卷副" },
      { code: "02", name: "双.对", hgjldwqc: "双.对" },
      { code: "04", name: "米", hgjldwqc: "米" },
      { code: "05", name: "平方米", hgjldwqc: "平方米" },
      { code: "06", name: "立方米", hgjldwqc: "立方米" },
      { code: "07", name: "升", hgjldwqc: "升" },
      { code: "09", name: "千克", hgjldwqc: "千克" },
      { code: "21", name: "百个.百枝.百把.百...", hgjldwqc: "百个.百枝.百把.百副.百片.百支" },
      { code: "31", name: "千个.千只.千块.千...", hgjldwqc: "千个.千只.千块.千合.千枝.千升" },
      { code: "38", name: "千伏安", hgjldwqc: "千伏安" },
      { code: "39", name: "吨", hgjldwqc: "吨" },
      { code: "48", name: "千瓦", hgjldwqc: "千瓦" },
      { code: "49", name: "克拉", hgjldwqc: "克拉" },
      { code: "58", name: "千瓦时", hgjldwqc: "千瓦时" },
      { code: "59", name: "克", hgjldwqc: "克" },
      { code: "001", name: "台", hgjldwqc: "台" },
      { code: "002", name: "座", hgjldwqc: "座" },
      { code: "003", name: "辆", hgjldwqc: "辆" },
      { code: "004", name: "艘", hgjldwqc: "艘" },
      { code: "005", name: "架", hgjldwqc: "架" },
      { code: "006", name: "套", hgjldwqc: "套" },
      { code: "007", name: "个", hgjldwqc: "个" },
      { code: "008", name: "只", hgjldwqc: "只" },
      { code: "009", name: "头", hgjldwqc: "头" },
      { code: "010", name: "张", hgjldwqc: "张" },
      { code: "011", name: "件", hgjldwqc: "件" },
      { code: "012", name: "支", hgjldwqc: "支" },
      { code: "013", name: "枝", hgjldwqc: "枝" },
      { code: "014", name: "根", hgjldwqc: "根" },
      { code: "015", name: "条", hgjldwqc: "条" },
      { code: "016", name: "把", hgjldwqc: "把" },
      { code: "017", name: "块", hgjldwqc: "块" },
      { code: "018", name: "卷", hgjldwqc: "卷" },
      { code: "019", name: "副", hgjldwqc: "副" },
      { code: "020", name: "片", hgjldwqc: "片" },
      { code: "021", name: "组", hgjldwqc: "组" },
      { code: "022", name: "份", hgjldwqc: "份" },
      { code: "023", name: "幅", hgjldwqc: "幅" },
      { code: "025", name: "双", hgjldwqc: "双" },
      { code: "026", name: "对", hgjldwqc: "对" },
      { code: "027", name: "棵", hgjldwqc: "棵" },
      { code: "028", name: "株", hgjldwqc: "株" },
      { code: "029", name: "井", hgjldwqc: "井" },
      { code: "030", name: "米", hgjldwqc: "米" },
      { code: "031", name: "盘", hgjldwqc: "盘" },
      { code: "032", name: "平方米", hgjldwqc: "平方米" },
      { code: "033", name: "立方米", hgjldwqc: "立方米" },
      { code: "034", name: "筒", hgjldwqc: "筒" },
      { code: "035", name: "千克", hgjldwqc: "千克" },
      { code: "036", name: "克", hgjldwqc: "克" },
      { code: "037", name: "盆", hgjldwqc: "盆" },
      { code: "038", name: "万个", hgjldwqc: "万个" },
      { code: "039", name: "具", hgjldwqc: "具" },
      { code: "040", name: "百副", hgjldwqc: "百副" },
      { code: "041", name: "百支", hgjldwqc: "百支" },
      { code: "042", name: "百把", hgjldwqc: "百把" },
      { code: "043", name: "百个", hgjldwqc: "百个" },
      { code: "044", name: "百片", hgjldwqc: "百片" },
      { code: "045", name: "刀", hgjldwqc: "刀" },
      { code: "046", name: "疋", hgjldwqc: "疋" },
      { code: "047", name: "公担", hgjldwqc: "公担" },
      { code: "048", name: "扇", hgjldwqc: "扇" },
      { code: "049", name: "百枝", hgjldwqc: "百枝" },
      { code: "050", name: "千只", hgjldwqc: "千只" },
      { code: "051", name: "千块", hgjldwqc: "千块" },
      { code: "052", name: "千盒", hgjldwqc: "千盒" },
      { code: "053", name: "千枝", hgjldwqc: "千枝" },
      { code: "054", name: "千个", hgjldwqc: "千个" },
      { code: "055", name: "亿支", hgjldwqc: "亿支" },
      { code: "056", name: "亿个", hgjldwqc: "亿个" },
      { code: "057", name: "万套", hgjldwqc: "万套" },
      { code: "058", name: "千张", hgjldwqc: "千张" },
      { code: "059", name: "万张", hgjldwqc: "万张" },
      { code: "060", name: "千伏安", hgjldwqc: "千伏安" },
      { code: "061", name: "千瓦", hgjldwqc: "千瓦" },
      { code: "062", name: "千瓦时", hgjldwqc: "千瓦时" },
      { code: "063", name: "千升", hgjldwqc: "千升" },
      { code: "067", name: "英尺", hgjldwqc: "英尺" },
      { code: "070", name: "吨", hgjldwqc: "吨" },
      { code: "071", name: "长吨", hgjldwqc: "长吨" },
      { code: "072", name: "短吨", hgjldwqc: "短吨" },
      { code: "073", name: "司马担", hgjldwqc: "司马担" },
      { code: "074", name: "司马斤", hgjldwqc: "司马斤" },
      { code: "075", name: "斤", hgjldwqc: "斤" },
      { code: "076", name: "磅", hgjldwqc: "磅" },
      { code: "077", name: "担", hgjldwqc: "担" },
      { code: "078", name: "英担", hgjldwqc: "英担" },
      { code: "079", name: "短担", hgjldwqc: "短担" },
      { code: "080", name: "两", hgjldwqc: "两" },
      { code: "081", name: "市担", hgjldwqc: "市担" },
      { code: "083", name: "盎司", hgjldwqc: "盎司" },
      { code: "084", name: "克拉", hgjldwqc: "克拉" },
      { code: "085", name: "市尺", hgjldwqc: "市尺" },
      { code: "086", name: "码", hgjldwqc: "码" },
      { code: "088", name: "英寸", hgjldwqc: "英寸" },
      { code: "089", name: "寸", hgjldwqc: "寸" },
      { code: "095", name: "升", hgjldwqc: "升" },
      { code: "096", name: "毫升", hgjldwqc: "毫升" },
      { code: "097", name: "英加仑", hgjldwqc: "英加仑" },
      { code: "098", name: "美加仑", hgjldwqc: "美加仑" },
      { code: "099", name: "立方英尺", hgjldwqc: "立方英尺" },
      { code: "101", name: "立方尺", hgjldwqc: "立方尺" },
      { code: "110", name: "平方码", hgjldwqc: "平方码" },
      { code: "111", name: "平方英尺", hgjldwqc: "平方英尺" },
      { code: "112", name: "平方尺", hgjldwqc: "平方尺" },
      { code: "115", name: "英制马力", hgjldwqc: "英制马力" },
      { code: "116", name: "公制马力", hgjldwqc: "公制马力" },
      { code: "118", name: "令", hgjldwqc: "令" },
      { code: "120", name: "箱", hgjldwqc: "箱" },
      { code: "121", name: "批", hgjldwqc: "批" },
      { code: "122", name: "罐", hgjldwqc: "罐" },
      { code: "123", name: "桶", hgjldwqc: "桶" },
      { code: "124", name: "扎", hgjldwqc: "扎" },
      { code: "125", name: "包", hgjldwqc: "包" },
      { code: "126", name: "箩", hgjldwqc: "箩" },
      { code: "127", name: "打", hgjldwqc: "打" },
      { code: "128", name: "筐", hgjldwqc: "筐" },
      { code: "129", name: "罗", hgjldwqc: "罗" },
      { code: "130", name: "匹", hgjldwqc: "匹" },
      { code: "131", name: "册", hgjldwqc: "册" },
      { code: "132", name: "本", hgjldwqc: "本" },
      { code: "133", name: "发", hgjldwqc: "发" },
      { code: "134", name: "枚", hgjldwqc: "枚" },
      { code: "135", name: "捆", hgjldwqc: "捆" },
      { code: "136", name: "袋", hgjldwqc: "袋" },
      { code: "139", name: "粒", hgjldwqc: "粒" },
      { code: "140", name: "盒", hgjldwqc: "盒" },
      { code: "141", name: "合", hgjldwqc: "合" },
      { code: "142", name: "瓶", hgjldwqc: "瓶" },
      { code: "143", name: "千支", hgjldwqc: "千支" },
      { code: "144", name: "万双", hgjldwqc: "万双" },
      { code: "145", name: "万粒", hgjldwqc: "万粒" },
      { code: "146", name: "千粒", hgjldwqc: "千粒" },
      { code: "147", name: "千米", hgjldwqc: "千米" },
      { code: "148", name: "千英尺", hgjldwqc: "千英尺" },
      { code: "149", name: "百万贝可", hgjldwqc: "百万贝可" },
      { code: "163", name: "部", hgjldwqc: "部" },
      { code: "164", name: "亿株", hgjldwqc: "亿株" },
    ];
  }
  if (codeStoreKey === 'code_dm_ckts_hgjgfs' && codeViewKey === '01') {
    code = [
      { jgfsqc: "一般贸易", jgfstslxdm: "1", code: "0110", name: "一般贸易" },
      { jgfsqc: "易货贸易", jgfstslxdm: "1", code: "0130", name: "易货贸易" },
      { jgfsqc: "用于旅游者五万美元以下的出口小批量订货", jgfstslxdm: "0", code: "0139", name: "旅游购物商品" },
      { jgfsqc: "主动放弃交由海关处理的来料或进料加工料件", jgfstslxdm: "0", code: "0200", name: "料件放弃" },
      { jgfsqc: "来料加工装配贸易进口料件及加工出口货物", jgfstslxdm: "0", code: "0214", name: "来料加工" },
      { jgfsqc: "来料加工料件退换", jgfstslxdm: "0", code: "0300", name: "来料料件退换" },
      { jgfsqc: "国营贸易企业代理来料加工企业进口柴油", jgfstslxdm: "0", code: "0314", name: "加工专用油" },
      { jgfsqc: "加工贸易外商提供的不作价进口设备", jgfstslxdm: "0", code: "0320", name: "不作价设备" },
      { jgfsqc: "来料加工成品凭征免税证明转减免税", jgfstslxdm: "0", code: "0345", name: "来料成品减免" },
      { jgfsqc: "主动放弃交由海关处理的来料及进料加工成品", jgfstslxdm: "0", code: "0400", name: "成品放弃" },
      { jgfsqc: "加工贸易项下外商提供的进口设备", jgfstslxdm: "0", code: "0420", name: "加工贸易设备" },
      { jgfsqc: "按成品征税的保税区进料加工成品转内销货物", jgfstslxdm: "0", code: "0444", name: "保区进料成品" },
      { jgfsqc: "按成品征税的保税区来料加工成品转内销货物", jgfstslxdm: "0", code: "0445", name: "保区来料成品" },
      { jgfsqc: "加工贸易免税进口设备转内销", jgfstslxdm: "0", code: "0446", name: "加工设备内销" },
      { jgfsqc: "加工贸易免税进口设备结转", jgfstslxdm: "0", code: "0456", name: "加工设备结转" },
      { jgfsqc: "加工贸易免税进口设备退运出境", jgfstslxdm: "0", code: "0466", name: "加工设备退运" },
      { jgfsqc: "来料加工料件转内销", jgfstslxdm: "0", code: "0245", name: "来料料件内销" },
      { jgfsqc: "来料深加工结转货物", jgfstslxdm: "0", code: "0255", name: "来料深加工" },
      { jgfsqc: "来料加工余料结转", jgfstslxdm: "0", code: "0258", name: "来料余料结转" },
      { jgfsqc: "来料加工复运出境的原进口料件", jgfstslxdm: "0", code: "0265", name: "来料料件复出" },
      { jgfsqc: "海关保税场所及保税区域之间往来的货物", jgfstslxdm: "2", code: "1200", name: "保税间货物" },
      { jgfsqc: "保税工厂", jgfstslxdm: "0", code: "1215", name: "保税工厂", jgfssm: null },
      { jgfsqc: "保税仓库进出境货物", jgfstslxdm: "0", code: "1233", name: "保税仓库货物" },
      { jgfsqc: "保税区进出境仓储转口货物", jgfstslxdm: "2", code: "1234", name: "保税区仓储转口" },
      { jgfsqc: "进出境修理物品", jgfstslxdm: "2", code: "1300", name: "修理物品" },
      { jgfsqc: "待维修货物从境外运入区域内进行检测、维修（包括经检测维修不能修复的）后应当复运出境", jgfstslxdm: "0", code: "1371", name: "保税维修" },
      { jgfsqc: "出料加工", jgfstslxdm: "1", code: "1427", name: "出料加工" },
      { jgfsqc: "租期不满一年的租赁贸易货物", jgfstslxdm: "0", code: "1500", name: "租赁不满一年" },
      { jgfsqc: "租期在一年及以上的租赁贸易货物", jgfstslxdm: "0", code: "1523", name: "租赁贸易" },
      { jgfsqc: "寄售、代销贸易", jgfstslxdm: "2", code: "1616", name: "寄售代销" },
      { jgfsqc: "免税品", jgfstslxdm: "0", code: "1741", name: "免税品" },
      { jgfsqc: "免税外汇商品", jgfstslxdm: "0", code: "1831", name: "外汇商品" },
      { jgfsqc: "合资合作企业作为投资进口设备物品", jgfstslxdm: "0", code: "2025", name: "合资合作设备" },
      { jgfsqc: "境内企业在境外投资,以实物投资出口的设备、物资。", jgfstslxdm: "1", code: "2210", name: "对外投资" },
      { jgfsqc: "外资企业作为投资进口的设备物品", jgfstslxdm: "0", code: "2225", name: "外资设备物品" },
      { jgfsqc: "外国航空公司进口公务货", jgfstslxdm: "0", code: "2400", name: "外航公务货", jgfssm: null },
      { jgfsqc: "外国常驻机构进口办公用品", jgfstslxdm: "0", code: "2439", name: "常驻机构公用" },
      { jgfsqc: "用于监管年限内减免税设备的结转", jgfstslxdm: "0", code: "0500", name: "减免设备结转" },
      { jgfsqc: "补偿贸易", jgfstslxdm: "1", code: "0513", name: "补偿贸易" },
      { jgfsqc: "按料件征税的保税区进料加工成品转内销货物", jgfstslxdm: "0", code: "0544", name: "保区进料料件" },
      { jgfsqc: "按料件征税的保税区来料加工成品转内销货物", jgfstslxdm: "0", code: "0545", name: "保区来料料件" },
      { jgfsqc: "进料加工(对口合同)", jgfstslxdm: "1", code: "0615", name: "进料对口" },
      { jgfsqc: "进料加工成品以产顶进", jgfstslxdm: "0", code: "0642", name: "进料以产顶进" },
      { jgfsqc: "进料加工料件转内销", jgfstslxdm: "0", code: "0644", name: "进料料件内销" },
      { jgfsqc: "进料深加工结转货物", jgfstslxdm: "0", code: "0654", name: "进料深加工" },
      { jgfsqc: "进料加工余料结转", jgfstslxdm: "0", code: "0657", name: "进料余料结转" },
      { jgfsqc: "进料加工复运出境的原进口料件", jgfstslxdm: "0", code: "0664", name: "进料料件复出" },
      { jgfsqc: "进料加工料件退换", jgfstslxdm: "0", code: "0700", name: "进料料件退换" },
      { jgfsqc: "进料加工(非对口合同)", jgfstslxdm: "1", code: "0715", name: "进料非对口" },
      { jgfsqc: "进料加工成品凭征免税证明转减免税", jgfstslxdm: "0", code: "0744", name: "进料成品减免" },
      { jgfsqc: "低值辅料", jgfstslxdm: "0", code: "0815", name: "低值辅料" },
      { jgfsqc: "进料加工项下边角料转内销", jgfstslxdm: "0", code: "0844", name: "进料边角料内销" },
      { jgfsqc: "来料加工项下边角料内销", jgfstslxdm: "0", code: "0845", name: "来料边角料内销" },
      { jgfsqc: "进料加工项下边角料复出口", jgfstslxdm: "0", code: "0864", name: "进料边角料复出" },
      { jgfsqc: "来料加工项下边角料复出口", jgfstslxdm: "0", code: "0865", name: "来料边角料复出" },
      { jgfsqc: "中国籍运输工具境内添加的保税油料、物料", jgfstslxdm: "0", code: "1139", name: "国轮油物料" },
      { jgfsqc: "暂时进出口货物", jgfstslxdm: "0", code: "2600", name: "暂时进出货物" },
      { jgfsqc: "进出境展览品", jgfstslxdm: "2", code: "2700", name: "展览品" },
      { jgfsqc: "驻华商业机构不复运出口的进口陈列样品", jgfstslxdm: "0", code: "2939", name: "陈列样品", jgfssm: null },
      { jgfsqc: "有经营权单位进出口的货样广告品", jgfstslxdm: "2", code: "3010", name: "货样广告品Ａ" },
      { jgfsqc: "无经营权单位进出口的货样广告品", jgfstslxdm: "0", code: "3039", name: "货样广告品Ｂ", jgfssm: null },
      { jgfsqc: "无代价抵偿进出口货物", jgfstslxdm: "0", code: "3100", name: "无代价抵偿" },
      { jgfsqc: "其他进出口免费提供货物", jgfstslxdm: "0", code: "3339", name: "其他进出口免费" },
      { jgfsqc: "边境小额贸易(边民互市贸易除外)", jgfstslxdm: "1", code: "4019", name: "边境小额" },
      { jgfsqc: "对台小额贸易", jgfstslxdm: "1", code: "4039", name: "对台小额" },
      { jgfsqc: "进入对台小额商品交易专用市场的货物", jgfstslxdm: "1", code: "4139", name: "对台小额商品交易" },
      { jgfsqc: "我驻外机构运回旧公用物品", jgfstslxdm: "0", code: "4200", name: "驻外机构运回" },
      { jgfsqc: "我驻外机构境外购买运回国的公务用品", jgfstslxdm: "0", code: "4239", name: "驻外机构购进", jgfssm: null },
      { jgfsqc: "来料加工成品退换", jgfstslxdm: "0", code: "4400", name: "来料成品退换" },
      { jgfsqc: "直接退运", jgfstslxdm: "0", code: "4500", name: "直接退运" },
      { jgfsqc: "进口溢卸、误卸货物", jgfstslxdm: "0", code: "4539", name: "进口溢误卸", jgfssm: null },
      { jgfsqc: "因质量不符、延误交货等原因退运进出境货物", jgfstslxdm: "0", code: "4561", name: "退运货物" },
      { jgfsqc: "进料成品退运", jgfstslxdm: "2", code: "4600", name: "进料成品退运" },
      { jgfsqc: "用于区内外非实际进出境货物", jgfstslxdm: "2", code: "5000", name: "料件进出区" },
      { jgfsqc: "出口加工区与境外之间进出的研发货物", jgfstslxdm: "0", code: "5010", name: "出口加工区研发货" },
      { jgfsqc: "海关特殊监管区域与境外之间进出的来料加工货物", jgfstslxdm: "0", code: "5014", name: "区内来料加工" },
      { jgfsqc: "加工区内企业从境外进口料件及加工出口成品", jgfstslxdm: "0", code: "5015", name: "区内加工货物" },
      { jgfsqc: "加工区内仓储企业从境外进口的货物", jgfstslxdm: "0", code: "5033", name: "区内仓储货物", jgfssm: null },
      { jgfsqc: "海关特殊监管区域与境外之间进出的物流货物", jgfstslxdm: "0", code: "5034", name: "区内物流货物" },
      { jgfsqc: "用于区内外非实际进出境货物", jgfstslxdm: "0", code: "5100", name: "成品进出区" },
      { jgfsqc: "用于区内外非实际进出境货物", jgfstslxdm: "0", code: "5200", name: "区内边角调出", jgfssm: null },
      { jgfsqc: "用于区内外非实际进出境货物", jgfstslxdm: "0", code: "5300", name: "设备进出区" },
      { jgfsqc: "加工区内企业从境外进口的设备物资", jgfstslxdm: "0", code: "5335", name: "境外设备进区" },
      { jgfsqc: "加工区内设备退运境外", jgfstslxdm: "0", code: "5361", name: "区内设备退运" },
      { jgfsqc: "保税物流中心与境外之间进出仓储货物", jgfstslxdm: "0", code: "6033", name: "物流中心进出境货" },
      { jgfsqc: "内贸货物跨境运输", jgfstslxdm: "0", code: "9600", name: "内贸货物跨境运输" },
      { jgfsqc: "跨境贸易电子商务", jgfstslxdm: "1", code: "9610", name: "电子商务" },
      { jgfsqc: "海关变卖处理的超期未报货物 ,走私违规货物", jgfstslxdm: "0", code: "9639", name: "海关处理货物" },
      { jgfsqc: "无原始报关单的后续补税", jgfstslxdm: "0", code: "9700", name: "后续补税" },
      { jgfsqc: "其他贸易", jgfstslxdm: "0", code: "9739", name: "其他贸易" },
      { jgfsqc: "租赁期一年及以上的租赁贸易货物的租金", jgfstslxdm: "0", code: "9800", name: "租赁征税" },
      { jgfsqc: "外交机构转售境内或国际活动留赠放弃特批货", jgfstslxdm: "0", code: "9839", name: "留赠转卖物品" },
      { jgfsqc: "其他", jgfstslxdm: "2", code: "9900", name: "其他" },
      { jgfsqc: "对外承包工程进口物资", jgfstslxdm: "0", code: "3410", name: "承包工程进口" },
      { jgfsqc: "对外承包工程出口物资", jgfstslxdm: "1", code: "3422", name: "对外承包出口" },
      { jgfsqc: "国家和国际组织无偿援助物资", jgfstslxdm: "1", code: "3511", name: "援助物资" },
      { jgfsqc: "无偿军援", jgfstslxdm: "0", code: "3611", name: "无偿军援", jgfssm: null },
      { jgfsqc: "进出口捐赠物资", jgfstslxdm: "0", code: "3612", name: "捐赠物资" },
      { jgfsqc: "军事装备", jgfstslxdm: "0", code: "3910", name: "军事装备", jgfssm: null },
      { jgfsqc: "跨境电子商务企业对企业直接出口", jgfstslxdm: "1", code: "9710", name: "跨境电商B2B直接出口", jgfssm: null },
    ];
  }
  if (codeStoreKey === 'code_dm_ckts_hgyfjsfs' && codeViewKey === '01') {
    code = [
      { code: "1", name: "运费率" },
      { code: "2", name: "每吨货物的运费单价" },
      { code: "3", name: "运费总价" },
    ];
  }
  if (codeStoreKey === 'code_static_hgcjfs_mc' && codeViewKey === '01') {
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
  if (codeStoreKey === 'code_static_syqylx_mc' && codeViewKey === '01') {
    code = [
      { code: "LCSXA081038001", name: "生产企业" },
      { code: "LCSXA081039001", name: "外贸企业" },
      { code: "LCSXA081040001", name: "综服企业" },
    ];
  }
  if (codeStoreKey === 'code_static_syqylxydjb_mc' && codeViewKey === '01') {
    code = [
      { code: "E", name: "错误类" },
      { code: "W", name: "警告类" },
    ];
  }
  if (codeStoreKey === 'code_dm_ckts_hgbfjsfs' && codeViewKey === '01') {
    code = [
      { code: "1", name: "保险费率" },
      { code: "3", name: "保险费总价" },
    ];
  }
  if (codeStoreKey === 'code_dm_ckts_hgzfjsfs' && codeViewKey === '01') {
    code = [
      { code: "1", name: "杂费率" },
      { code: "3", name: "杂费总价" },
    ];
  }
  if (codeStoreKey === 'code_static_bgd_gdxx_dm' && codeViewKey === '01') {
    code = [
      { code: "", name: "全部" },
      { code: "Y", name: "有" },
      { code: "N", name: "无" },
    ];
  }
  // 下载任务管理-分类代码
  // if (codeStoreKey === 'code_static_xzrwgl_fldm_dm' && codeViewKey === '01') {
  //   code = [
  //     { code: '001', name: '海关数据' },
  //     { code: '002', name: '受托方已开具代理证明' },
  //     // { code: '003', name: '发票数据下载' },
  //     { code: '004', name: '税务反馈数据' },
  //     { code: '005', name: '数据导出' },
  //   ];
  // }
  if (codeStoreKey === 'code_static_xzrwgl_xzabz_dm' && codeViewKey === '01') {
    code = [
      { code: 'Y', name: '自动' },
      { code: 'N', name: '手动' },
    ];
  }
  // if (codeStoreKey === 'code_static_xzrwgl_fldm_dm' && codeViewKey === '03') {
  //   code = [
  //     { code: '001', name: '海关数据' },
  //     { code: '002', name: '受托方已开具代理证明' },
  //     { code: '003', name: '进项发票下载' },
  //     { code: '004', name: '税务反馈数据' },
  //     { code: '005', name: '数据导出' },
  //     { code: '006', name: '销项发票数据' },
  //   ];
  // }

  // 下载任务管理-分类代码-单一窗口
  // if (codeStoreKey === 'code_static_xzrwgl_fldm_dm' && codeViewKey === '02') {
  //   code = [
  //     { code: '001', name: '海关数据' },
  //     { code: '004', name: '税务反馈数据' },
  //   ];
  // }
  // 下载任务管理-分类代码-业务类型 申报-sc
  if (codeStoreKey === 'code_static_fldm_ywlx_sb' && codeViewKey === '01') {
    code = [
      { value: '030101', label: '免抵退税审核结果' },
      // { value: '030105', label: '购进自用货物退税数据' },
     // { value: '030106', label: '出口非自产货物数据' },
     // { value: '030104', label: '已使用过设备退税数据' },
    ];
  }
  // 下载任务管理-分类代码-业务类型 申报-sc 单一窗口
  if (codeStoreKey === 'code_static_fldm_ywlx_sb' && codeViewKey === '03') {
    code = [
      { value: '030101', label: '免抵退税审核结果' },
    ];
  }
  // 下载任务管理-分类代码-业务类型 申报-wm
  if (codeStoreKey === 'code_static_fldm_ywlx_sb' && codeViewKey === '02') {
    code = [
      { value: '030102', label: '免退税审核结果' },
      { value: '030103', label: '代办退税审核结果' },
      // { value: '030105', label: '购进自用货物退税数据' },
      // { value: '030104', label: '已使用过设备退税数据' },
      // { value: '030107', label: '航天发射业务退税数据' },
    ];
  }
    // 下载任务管理-分类代码-业务类型 申报-wm 单一窗口
    if (codeStoreKey === 'code_static_fldm_ywlx_sb' && codeViewKey === '04') {
      code = [
        { value: '030102', label: '免退税审核结果' },
        { value: '030103', label: '代办退税审核结果' },
      ];
    }
  if (codeStoreKey === 'code_static_fldm_ywlx_sb' && codeViewKey === '05') {
    code = [
      { value: '030403', label: '海外仓预退税台账' },
      { value: '030404', label: '跨境电商预退税核算确认' },
    ];
  }
  // 下载任务管理-分类代码-业务类型 证明-sc
  if (codeStoreKey === 'code_static_fldm_ywlx_zm' && codeViewKey === '01') {
    code = [
      { value: '030204', label: '出口货物已补税/未退税证明' },
      { value: '030201', label: '代理出口货物证明' },
      { value: '030202', label: '代理进口货物证明' },
      { value: '030206', label: '委托出口货物证明' },
      { value: '030207', label: '来料加工免税证明' },
      { value: '030208', label: '来料加工免税证明核销' },
      //{ value: '030211', label: '出口卷烟已免税证明开具' },
      //{ value: '030210', label: '出口卷烟免税核销申请' },
      //{ value: '030209', label: '准予免税购进出口卷烟证明开具' },
      //{ value: '030203', label: '中标证明通知书' },
    ];
  }
  // 下载任务管理-分类代码-业务类型 证明-wm
  if (codeStoreKey === 'code_static_fldm_ywlx_zm' && codeViewKey === '02') {
    code = [
      { value: '030204', label: '出口货物已补税/未退税证明' },
      { value: '030201', label: '代理出口货物证明' },
      { value: '030205', label: '出口货物转内销证明' },
      { value: '030202', label: '代理进口货物证明' },
      { value: '030206', label: '委托出口货物证明' },
      { value: '030207', label: '来料加工免税证明' },
      { value: '030208', label: '来料加工免税证明核销' },
      // { value: '030209', label: '准予免税购进出口卷烟证明开具' },
      // { value: '030203', label: '中标证明通知书' },
    ];
  }
    // 下载任务管理-分类代码-业务类型 其他申报
    if (codeStoreKey === 'code_static_fldm_ywlx_qtsb' && codeViewKey === '01') {
      code = [
        { value: '030401', label: '出口信息查询数据' },
      ];
    }
    if (codeStoreKey === 'code_static_fldm_ywlx_qtsb' && codeViewKey === '02') {
      code = [
        { value: '030402', label: '进货凭证信息回退数据' },
      ];
    }
  if (codeStoreKey === 'code_static_bgd_zmlx_dm' && codeViewKey === '01') {
    code = [
      { code: "", name: "全部" },
      { code: "6", name: "退税" },
      { code: "5", name: "征税" },
      { code: "4", name: "免税" },
    ];
  }
  if (codeStoreKey === 'code_static_bgd_zmlx_dm' && codeViewKey === '02') {
    code = [
      { code: "6", name: "退税" },
      { code: "5", name: "征税" },
      { code: "4", name: "免税" },
    ];
  }
  if (codeStoreKey === 'code_static_bgd_sbyw_dm' && codeViewKey === '01') {
    code = [
      { code: "", name: "全部" },
      { code: "1", name: "退税申报" },
      { code: "2", name: "代理出口" },
      { code: "6", name: "代办退税" },
    ];
  }
  if (codeStoreKey === 'code_static_bgd_sbyw_dm' && codeViewKey === '02') {
    code = [
      { code: "", name: "全部" },
      { code: "1", name: "退税申报" },
      { code: "2", name: "代理出口" },
      { code: "6", name: "代办退税" },
      { code: "7", name: "边贸代理" },
    ];
  }
  if (codeStoreKey === 'code_static_bgd_sbyw_dm' && codeViewKey === '03') {
    code = [
      { code: "1", name: "退税申报" },
      { code: "2", name: "代理出口" },
      { code: "6", name: "代办退税" },
    ];
  }
  if (codeStoreKey === 'code_static_bgd_sbyw_dm' && codeViewKey === '04') {
    code = [
      // { code: "", name: "全部" },
      { code: "0", name: "未申报" },
      { code: "1", name: "退税申报" },
      { code: "2", name: "代理出口" },
      { code: "6", name: "代办退税" },
    ];
  }
  if (codeStoreKey === 'code_static_fp_fpglsczt_dm' && codeViewKey === '01') {
    code = [
      { code: "", name: "全部" },
      { code: "0", name: "未生成" },
      { code: "1", name: "已生成" },
      { code: "2", name: "部分生成" },
    ];
  }
  if (codeStoreKey === 'code_static_fp_fpglsclx_dm' && codeViewKey === '01') {
    code = [
      { code: "", name: "全部" },
      { code: "1", name: "出口退税" },
      { code: "2", name: "应抵扣数据" },
      { code: "3", name: "出口转内销" },
      { code: "4", name: "代办退税" },
    ];
  }
  if (codeStoreKey === 'code_static_fp_fpztdm_dm' && codeViewKey === '01') {
    code = [
      { code: "", name: "全部" },
      { code: "0", name: "已认证" },
      { code: "1", name: "已稽核" },
    ];
  }
  if (codeStoreKey === 'code_static_bgd_zt_dm' && codeViewKey === '01') {
    code = [
      { code: "", name: "全部" },
      { code: "Y", name: "已生成" },
      { code: "N", name: "未生成" },
    ];
  }
  if (codeStoreKey === 'code_static_dzdzfp_fpzt_dm' && codeViewKey === '01') {
    code = [
      { code: "", name: "全部" },
      { code: "0", name: "已认证/已稽核" },
      { code: "1", name: "已认证/未稽核" }
    ];
  }
  if (codeStoreKey === 'code_static_bgd_cytgbz_dm' && codeViewKey === '01') {
    code = [
      { code: "", name: "全部" },
      { code: "Y", name: "检查通过" },
      { code: "N", name: "检查未通过" },
      { code: " ", name: "未检查" },
    ];
  }
  if (codeStoreKey === 'code_static_bgd_cytgbz_dm' && codeViewKey === '02') {
    code = [
      { code: "Y", name: "检查通过" },
      { code: "N", name: "检查未通过" },
      { code: " ", name: "未检查" },
    ];
  }
  if (codeStoreKey === 'code_static_dzdzfp_fpsbzt_dm' && codeViewKey === '01') {
    code = [
      { code: "", name: "全部" },
      { code: "0", name: "未生成" },
      { code: "1", name: "已生成" },
      { code: "2", name: "部分生成" },
    ];
  }
  if(codeStoreKey === 'code_static_bgd_czbz1_dm' && codeViewKey === '01') {
    code = [
      { code: "Y", name: "存在" },
      { code: "N", name: "不存在" },
    ];
  }
  if(codeStoreKey === 'code_static_bgd_sybz_dm' && codeViewKey === '01') {
    code = [
      { code: "Y", name: "使用" },
      { code: "N", name: "未使用" },
    ];
  }
  if (codeStoreKey === 'code_static_dzdzfp_fpcllx_dm' && codeViewKey === '01') {
    code = [
      { code: "", name: "全部" },
      { code: "1", name: "退税" },
      { code: "2", name: "抵扣" },
      { code: "3", name: "转内销" },
      { code: "4", name: "代办退税" },
    ];
  }
  if (codeStoreKey === 'CODE_CKFP_ABGDKJ_GMFMC' && codeViewKey === '01') {
    code = [
      { code: "企业名称A", name: "企业名称A" },
      { code: "企业名称B", name: "企业名称B" },
      { code: "企业名称C", name: "企业名称C" },
      { code: "企业名称D", name: "企业名称D" },
      { code: "企业名称E", name: "企业名称E" },
      { code: "企业名称F", name: "企业名称F" },
    ];
  }
  if (codeStoreKey === 'code_static_abgdkj_ssflbm' && codeViewKey === '01') {
    code = [
      { code: '107060103000000001', name: '塑料管1', slv: '9' },
      { code: '107060103000000002', name: '塑料管2', slv: '13' },
      { code: '107060103000000003', name: '塑料管3', slv: '3' },
      { code: '107060103000000004', name: '塑料管4', slv: '5' },
      { code: '107060103000000005', name: '塑料管5', slv: '0' },
    ];
  }
  if (codeStoreKey === 'CODE_STATIC_JLJGHX_JCKBZ' && codeViewKey === '01') {
    code = [
      { code: 'I', name: '进口' },
      { code: 'E', name: '出口' },
    ];
  }
  if (codeStoreKey === 'CODE_STATIC_JLJGHX_SFBZ' && codeViewKey === '01') {
    code = [
      { code: 'Y', name: '是' },
      { code: 'N', name: '否' },
    ];
  }
  if (codeStoreKey === 'CODE_STATIC_XGBZ_SFBZ' && codeViewKey === '01') {
    code = [
      { code: 'Y', name: '已修改' },
      { code: 'N', name: '未修改' },
    ];
  }
  if (codeStoreKey === 'CODE_STATIC_JLJGHX_SFBZ' && codeViewKey === '02') {
    code = [
      { code: 'Y', name: '是' },
      { code: '', name: '否' },
      { code: 'N', name: '否' },
    ];
  }
  if (codeStoreKey === 'CODE_STATIC_JLJGHX_HDJG' && codeViewKey === '01') {
    code = [
      { code: 'Y', name: '存在' },
      { code: 'N', name: '缺失' },
    ];
  }
  if (codeStoreKey === 'CODE_STATIC_JLJGHX_ZSSB_DM' && codeViewKey === '01') {
    code = [
      { code: '0', name: '待审核' },
      { code: '1', name: '审核中' },
      { code: '2', name: '审核失败' },
      { code: '3', name: '审核成功' },
    ];
  }
  if (codeStoreKey === 'CODE_STATIC_JLJGHX_SJZJ_DM' && codeViewKey === '01') {
    code = [
      { code: '0', name: '待自检' },
      { code: '1', name: '自检中' },
      { code: '2', name: '自检失败' },
      { code: '3', name: '自检成功' },
    ];
  }
  if (codeStoreKey === 'CODE_DM_ZXSB_SBZT' && codeViewKey === '01') {
    code = [
      { code: "0", name: "未申报" },
      { code: "1", name: "待申报" },
      { code: "2", name: "已申报" },
    ];
  }
  if (codeStoreKey === 'CODE_DM_ZXSB_SJZJ_SBZT' && codeViewKey === '01') {
    code = [
      { code: "NN", name: "未申报" },
      { code: "YN", name: "待申报" },
      { code: "YY", name: "已申报" }
    ];
  }
  if (codeStoreKey === 'CODE_STATIC_CKTS_XHCP' && codeViewKey === '01') {
    code = [
      { code: 'cjrq', name: '采集时间' },
      { code: 'ckbgdh', name: '报关单号' },
      { code: 'ckrq', name: '出口日期' },
      { code: 'ckhth', name: '出口合同号' },
      { code: 'ckfph', name: '出口发票号' },
      { code: 'szch', name: '手（账）册号' },
      { code: 'yxh', name: '原序号' },
      { code: 'spdm', name: '商品代码' },
    ];
  }
  if (codeStoreKey === 'CODE_STATIC_MDTS_BGDSCCKMX_GDXX' && codeViewKey === '01') {
    code = [
      { code: 'Y', name: '无信息' },
      { code: 'N', name: '有信息' },
    ];
  }
  if (codeStoreKey === 'CODE_STATIC_MDTS_BGDSCCKMX_SCZT' && codeViewKey === '01') {
    code = [
      { code: '', name: '全部' },
      { code: '2', name: '未生成' },
      { code: '3', name: '已生成' },
      { code: '4', name: '部分生成' },
    ];
  }
  if (codeStoreKey === 'CODE_STATIC_MDTS_BGDSCTSSB' && codeViewKey === '01') {
    code = [
      { code: 'ckbgdh', name: '报关单号' },
      { code: 'ckrq', name: '出口日期' },
      { code: 'ckhth', name: '出口合同号' },
      { code: 'ckfph', name: '出口发票号' },
      { code: 'szch', name: '手（账）册号' },
    ];
  }
  if (codeStoreKey === 'CODE_DM_ZXSB_JLJGHXSJLY_MDTHX' && codeViewKey === '01') {
    code = [
      { code: "1", name: "人工采集" },
      { code: "3", name: "智能分析" },
      { code: "4", name: "内部台账核对" },
    ];
  }

  if (codeStoreKey === 'CODE_DM_ZXSB_JLJGHXSJLY_YHXTZ' && codeViewKey === '01') {
    code = [
      { code: "1", name: "人工采集" },
      { code: "2", name: "数据导入" },
      { code: "3", name: "智能分析" },
      { code: "4", name: "内部台账核对" },
    ];
  }
  // 备案单证-核查类型代码 生产
  if (codeStoreKey === 'CODE_DM_BADZ_HCLX' && codeViewKey === '01') {
    code = [
      { code: "N", name: "按核查清单核查" },
      { code: "Y", name: "按所属期核查" },
    ];
  }
  // 备案单证-核查类型代码 外贸
  if (codeStoreKey === 'CODE_DM_BADZ_HCLX' && codeViewKey === '02') {
    code = [
      { code: "N", name: "按核查清单核查" },
      { code: "Y", name: "按所属期批次核查" },
    ];
  }
  if (codeStoreKey === 'CODE_DM_BADZ_BAZT' && codeViewKey === '01') {
    code = [
      { code: "1", name: "待备案" },
      { code: "2", name: "备案中" },
    ];
  }

  if (codeStoreKey === 'CODE_DM_TZ_SBBZ' && codeViewKey === '01') {
    code = [
      { code: "Y", name: "已审核" },
      { code: "N", name: "未审核" },
    ];
  }
  if (codeStoreKey === 'CODE_DM_TZ_SBBZ' && codeViewKey === '02') {
    code = [
      { code: "Y", name: "R" },
      { code: "N", name: "" },
      { code: "", name: "" },
    ];
  }
  if (codeStoreKey === 'CODE_DM_TZ_SZ' && codeViewKey === '01') {
    code = [
      { code: "V", name: "增值税" },
      { code: "C", name: "消费税" },
    ];
  }

  if (codeStoreKey === 'CODE_STATIC_DM_SZ' && codeViewKey === '01') {
    code = [
      { code: "V", name: "增值税" },
      { code: "C", name: "消费税" },
    ];
  }

  if (codeStoreKey === 'CODE_STATIC_TZ_TSLX' && codeViewKey === '01') {
    code = [
      { name: '不退税', code: '1' },
      { name: '免税', code: '2' },
      { name: '退税', code: '' },
    ];
  }

  if (codeStoreKey === 'CODE_STATIC_TZ_QSHJLB' && codeViewKey === '01') {
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

  if (codeStoreKey === 'CODE_STATIC_TZ_QSZDLB' && codeViewKey === '01') {
    code = [
      { code: "01", name: "付款账单" },
      { code: "02", name: "收款账单" },
    ];
  }

  if (codeStoreKey === 'CODE_STATIC_TZ_GJYS' && codeViewKey === '01') {
    code = [
      { code: "01", name: "客运" },
      { code: "02", name: "货运" },
    ];
  }

  if (codeStoreKey === 'CODE_STATIC_TZ_CKTMSPZLX' && codeViewKey === '01') {
    code = [
      { code: "02", name: "增值税专用发票" },
      { code: "04", name: "海关进口增值税专用缴款书" },
      { code: "05", name: "海关进口消费税专用缴款书" },
      { code: "06", name: "出口货物消费税专用缴款书" },
      { code: "07", name: "出口货物消费税专用缴款书分割单" },
      { code: "08", name: "税收专用缴款书" },
    ];
  }

  if (codeStoreKey === 'CODE_STATIC_TZ_TLYSFS' && codeViewKey === '01') {
    code = [
      { code: "01", name: "汇总成员企业核收" },
      { code: "02", name: "其他铁路运输企业核收" },
    ];
  }

  if (codeStoreKey === 'CODE_STATIC_TZ_FPZT' && codeViewKey === '01') {
    code = [
      { code: "YY", name: "已认证/已稽核" },
      { code: "YN", name: "已认证/未稽核" },
      { code: "NN", name: "未认证/未稽核" },
      { code: "NY", name: "未认证/已稽核" },
    ];
  }

  if(codeStoreKey === 'CODE_STATIC_FPYT' && codeViewKey === '01') {
    code = [
      { name: '出口退税', code: '1' },
      { name: '抵扣', code: '2' },
      { name: '出口转内销', code: '3' },
      { name: '代办退税', code: '4' },
      { name: '其他非抵扣项目', code: '5' },
      { name: '空', code: '99' },
    ]
  }
  // 文书下载
  if (codeStoreKey === 'CODE_STATIC_DM_CKTS_WSXZ' && codeViewKey === '01') {
    code = [
      { code: "01", name: "代理出口货物证明" },
      // { code: "02", name: "代理进口货物证明" },
      { code: "03", name: "委托出口货物证明" },
      { code: "04", name: "出口货物转内销证明" },
      { code: "05", name: "出口货物已补税/未退税证明" },
      // { code: "07", name: "中标证明通知书" },
      { code: "10", name: "来料加工免税证明" },
      { code: "12", name: "准予免税购进出口卷烟证明" },
      // { code: "13", name: "出口卷烟已免税证明" },
    ];
  }
  //外貿
  if (codeStoreKey === 'CODE_STATIC_DM_CKTS_WSXZ' && codeViewKey === '02') {
    code = [
      { code: "01", name: "代理出口货物证明" },
      // { code: "02", name: "代理进口货物证明" },
      { code: "03", name: "委托出口货物证明" },
      { code: "04", name: "出口货物转内销证明" },
      { code: "05", name: "出口货物已补税/未退税证明" },
      // { code: "07", name: "中标证明通知书" },
      { code: "10", name: "来料加工免税证明" },
      { code: "12", name: "准予免税购进出口卷烟证明" },
    ];
  }
  //生產
  if (codeStoreKey === 'CODE_STATIC_DM_CKTS_WSXZ' && codeViewKey === '03') {
    code = [
      { code: "01", name: "代理出口货物证明" },
      // { code: "02", name: "代理进口货物证明" },
      { code: "03", name: "委托出口货物证明" },
      { code: "05", name: "出口货物已补税/未退税证明" },
      // { code: "07", name: "中标证明通知书" },
      { code: "10", name: "来料加工免税证明" },
      { code: "12", name: "准予免税购进出口卷烟证明" },
      // { code: "13", name: "出口卷烟已免税证明" },
    ];
  }
  // 退税进货明细 税种
  if (codeStoreKey === 'code_static_tmsjhmxsz_dm' && codeViewKey === '01') {
    code = [
      { code: 'V', name: '增值税' },
      { code: 'C', name: '消费税' }
    ];
  }
  // 退税进货明细 税种
  if (codeStoreKey === 'code_static_tmsjhmxsz_dm' && codeViewKey === '02') {
    code = [
      { code: 'V', name: '增值税' },
    ];
  }
  // 退税进货明细 税种
  if (codeStoreKey === 'code_static_tmsjhmxsz_dm' && codeViewKey === '03') {
    code = [
      { code: 'V', name: 'V' },
      { code: 'C', name: 'C' },
      { code: 'X', name: 'X' }
    ];
  }
  // 退运-业务处理方式
  if (codeStoreKey === 'code_static_tyywclfs_dm' && codeViewKey === '01') {
    code = [
      { code: '冲减', name: '冲减' },
      { code: '补税', name: '补税' },
    ];
  }
  // 退（免）税状态
  if (codeStoreKey === 'code_static_tmsztbz_dm' && codeViewKey === '01') {
    code = [
      { code: '尚未申报退（免）税', name: '尚未申报退（免）税' },
      { code: '已办理退（免）税', name: '已办理退（免）税' },
      { code: '已冲减退（免）税', name: '已冲减退（免）税' },
      { code: '已缴回退（免）税', name: '已缴回退（免）税' },
    ];
  }
  // 退（免）税状态 外贸 不显示 已办理退（免）税
  if (codeStoreKey === 'code_static_tmsztbz_dm' && codeViewKey === '02') {
    code = [
      {code: '尚未申报退（免）税', name: '尚未申报退（免）税'},
      {code: '已冲减退（免）税', name: '已冲减退（免）税'},
      {code: '已缴回退（免）税', name: '已缴回退（免）税'},
    ];
  }
  // 出入库-匹配标志ppFlags
  if (codeStoreKey === 'CODE_STATIC_CRKSJGL_PPBZ' && codeViewKey === '01') {
    code = [
      { code: 'Y', name: '已匹配' },
      { code: 'N', name: '未匹配' }
    ];
  }

  // 出入库-开票状态
  if (codeStoreKey === 'CODE_STATIC_CRKSJGL_KPZT' && codeViewKey === '01') {
    code = [
      { code: '1', name: '未提取' },
      { code: '2', name: '已提取' },
      { code: '3', name: '已开票' }
    ];
  }

  // 出入库-匹配方式
  if (codeStoreKey === 'CODE_STATIC_CRKSJGL_PPFS' && codeViewKey === '01') {
    code = [
      { code: '1', name: '自动匹配' },
      { code: '2', name: '手动匹配' }
    ];
  }

  // zxsb_sb_mts_ysfwck_gcb  ysfw_dm  --> cktmsywlxdmjh 外贸 跨境应税行为免退税申报明细表
  if (codeStoreKey === 'code_static_mts_ysfwck_ysfw_dm_cktmsywlxdmjh' && codeViewKey === '01') {
    code = [
      { code: '9902000000', name: 'YFFW' },
      { code: '9903010400', name: 'HTNYGLFW' },
      { code: '9903000000', name: 'SJFW' },
      { code: '9903070100', name: 'GBYSZZFW' },
      { code: '9903070200', name: 'GBYSFXFW' },
      { code: '9903020100', name: 'RJFW' },
      { code: '9903020200', name: 'DLSJCSFW' },
      { code: '9903020300', name: 'XXXTFW' },
      { code: '9903020400', name: 'YWLCGLFW' },
      { code: '9904010000', name: 'ITO' },
      { code: '9904020000', name: 'BPO' },
      { code: '9904030000', name: 'KPO' },
      { code: '9920000010', name: 'ZRJS' }
    ];
  }

  // 数据报表 生产
  if (codeStoreKey === 'CODE_STATIC_SJBB_SBLX_SC' && codeViewKey === '01') {
    code = [
      { code: "20", name: "代理出口" },
      { code: "11", name: "免抵退" }
    ];
  }

  // 权限管理 - 运营管理员
  if (codeStoreKey === 'code_static_dm_gy_yhlx' && codeViewKey === '01') {
    code = [
      { code: '11', name: '管理员' },
      { code: '12', name: '一般用户' }

    ];
  }
  // 权限管理 - 平台管理员
  if (codeStoreKey === 'code_static_dm_gy_yhlx' && codeViewKey === '02') {
    code = [
      { code: '14', name: '前端用户' },
      { code: '13', name: '运营管理员' },
      { code: '15', name: '智能综合管理工具运营' },
    ];
  }


  // 权限管理-管理员和一般用户
  if (codeStoreKey === 'code_dm_gy_glyhlx' && codeViewKey === '01') {
    code = [
      { code: '12', name: '一般用户' }
    ];
  }
  // 权限管理-菜单类型代码
  if (codeStoreKey === 'code_dm_gy_cdlx' && codeViewKey === '01') {
    code = [
      { code: 'TOP', name: '系统头菜单' },
      { code: 'MENU', name: '正常菜单' },
      { code: 'STEP', name: '菜单为步骤向导' },
      { code: 'TAB', name: '页面切换菜单' },
      { code: 'URL', name: '业务功能模块' }
    ];
  }

  // 执行状态
  if (codeStoreKey === 'CODE_STATIC_SJBB_ZXZT' && codeViewKey === '01') {
    code = [
      { code: "Y", name: "已执行" },
      { code: "E", name: "执行失败" },
      { code: "S", name: "执行中" },
      { code: "N", name: "待执行" },
    ];
  }

  // 企业电子信息查询 审核结果
  if (codeStoreKey === 'code_static_jgbz_dm' && codeViewKey === '01') {
    code = [
      { code: '1', name: '有电子信息' },
      { code: '2', name: '凭证号码位数错误' },
      { code: '3', name: '信息申请补发中' },
      { code: '4', name: '无电子信息' }
    ];
  }

  // 进货凭证信息回退申请 审核结果
  if (codeStoreKey === 'code_static_shbz_dm' && codeViewKey === '01') {
    code = [
      { code: 'Y', name: '通过' },
      { code: 'N', name: '不通过' }
    ];
  }

  // 免退税-进项发票管理-发票状态
  if (codeStoreKey === 'CODE_STATIC_FPZT_DM' && codeViewKey === '01') {
    code = [
      { code: "YY", name: "已认证/已稽核" },
      { code: "YN", name: "已认证/未稽核" }
    ];
  }

    // 免退税-进项发票管理-发票状态
    if (codeStoreKey === 'CODE_STATIC_SJZT_DM' && codeViewKey === '01') {
      code = [
        { code: "1", name: "未审核" },
        { code: "2", name: "审核通过" },
        { code: "3", name: "开票失败" }
      ];
    }

  // 发票管理-在线开票-撤回标志
  if(codeStoreKey === 'code_static_fpgl_zxkp_chbz' &&  codeViewKey === '01') {
    code = [
      { name: '已撤回', code: 'Y' },
      { name: '未撤回', code: 'N' },
    ]
  }
  // 数据来源
  if(codeStoreKey === 'code_static_fpgl_zxkp_sjly' &&  codeViewKey === '01') {
    code = [
      { name: '税务反馈', code: '1' },
      { name: '调整表', code: '2' },
    ]
  }
  // 数据管理-台账数据-台账筛选
  if(codeStoreKey === 'CODE_STATIC_SJGL_TZSJ' &&  codeViewKey === '01') {
    code = [
      { name: '全部', code: 'N' },
      { name: '台账数据', code: 'Y' },
    ]
  }

  if (codeStoreKey === 'code_static_qy_nsxydj' && codeViewKey === '01') {
    code = [
      { code: 'A', name: 'A' },
      { code: 'B', name: 'B' },
      { code: 'C', name: 'C' },
      { code: 'D', name: 'D' },
    ];
  }
  // 备案单证-提运单类型
  if (codeStoreKey === 'code_static_badz_tydlx_dm' && codeViewKey === '01') {
    code = [
      { code: '01', name: '航空运单' },
      { code: '02', name: '铁路运单' },
      { code: '03', name: '海运提单' },
      { code: '04', name: '公路运输载货清单' },
      { code: '05', name: '邮政运输单' },
      { code: '06', name: '其他运输方式单据' }
    ];
  }

  // 备案单证-发票类型
  if (codeStoreKey === 'code_static_badz_fplx_dm' && codeViewKey === '01') {
    code = [
      { code: '01', name: '出口企业承付运费的国内运输发票' },
      { code: '02', name: '出口企业承付国际货物运输代理服务费发票' }
    ];
  }
  // 备案单证-合同类型
  if (codeStoreKey === 'code_static_badz_htlx_dm' && codeViewKey === '01') {
    code = [
      { code: '01', name: '外贸企业购货合同' },
      { code: '02', name: '生产企业收购非自产货物出口的购货合同' }
    ];
  }
  // 备案单证-协议类型
  if (codeStoreKey === 'code_static_badz_wtbgxy_xylx_dm' && codeViewKey === '01') {
    code = [
      { code: '01', name: '电子协议' },
      { code: '02', name: '纸质协议' }
    ];
  }
  // 备案单证-匹配规则
  if (codeStoreKey === 'code_static_badz_ppgz_dm' && codeViewKey === '01') {
    code = [
      { code: '01', name: '按报关单匹配' },
      { code: '02', name: '按所属期批次匹配' }
    ];
  }
// 备案单证-数据来源
  if (codeStoreKey === 'code_static_badz_sjly_dm' && codeViewKey === '01') {
    code = [
      { code: '01', name: '手工采集' },
      { code: '02', name: '外部数据' },
      { code: '03', name: '接口' }
    ];
  }
  // 备案单证-数据来源
  if (codeStoreKey === 'code_static_badz_ppfs_dm' && codeViewKey === '01') {
    code = [
      { code: '01', name: '手动匹配' },
      { code: '02', name: '自动匹配' }
    ];
  }
  // 备案单证-是否上传附件
  if (codeStoreKey === 'code_static_badz_sfscfj_dm' && codeViewKey === '01') {
    code = [
      { code: 'Y', name: '已上传' },
      { code: 'N', name: '未上传' }
    ];
  }
  // 备案单证-备案完成情况
  if (codeStoreKey === 'code_static_badz_sfzdcc_dm' && codeViewKey === '01') {
    code = [
      { code: '', name: '全部' },
      { code: 'Y', name: '已完成' },
      { code: 'N', name: '未完成' }
    ];
  }
  // 数据管理-台账数据-台账筛选
  if(codeStoreKey === 'CODE_STATIC_SJPP_TZPD' &&  codeViewKey === '01') {
    code = [
      { name: '未使用', code: 'N' },
      { name: '已使用', code: 'Y' },
    ]
  }
  if (codeStoreKey === 'CODE_STATIC_TZPD_PDJG_DM' && codeViewKey === '01') {
    code = [
      { code: "Y", name: "√" },
      { code: "N", name: "×" },
    ];
  }
  if (codeStoreKey === 'CODE_STATIC_TZPD_YCJB_DM' && codeViewKey === '01') {
    code = [
      { code: "E", name: "√" },
      { code: "W", name: "×" },
    ];
  }
  if (codeStoreKey === 'CODE_STATIC_TZPD_SCZT_DM' && codeViewKey === '01') {
    code = [
      { code: "Y", name: "已生成" },
      { code: "N", name: "未生成" },
    ];
  }
  if (codeStoreKey === 'CODE_STATIC_TZPD_SCZT_DM' && codeViewKey === '02') {
    code = [
      { code: "已生成", name: "已生成" },
      { code: "待生成", name: "待生成" },
      { code: "生成失败", name: "生成失败" },
    ];
  }
  if (codeStoreKey === 'CODE_STATIC_CJPD_YCJBLX_DM' && codeViewKey === '01') {
    code = [
      { code: "E", name: "阻断" },
      { code: "W", name: "提示" },
    ];
  }
  if (codeStoreKey === 'CODE_STATIC_TZPD_HHCB_DM' && codeViewKey === '01') {
    code = [
      { code: "01", name: "合理范围" },
      { code: "02", name: "低于合理范围" },
      { code: "03", name: "高于合理范围" },
      { code: "99", name: "空" },
    ];
  }
  if (codeStoreKey === 'CODE_STATIC_TZPD_HHCB_DM' && codeViewKey === '02') {
    code = [
      { code: "01", name: "合理范围" },
      { code: "02", name: "低于合理范围" },
      { code: "03", name: "高于合理范围" },
      { code: "99", name: "" },
    ];
  }
  if (codeStoreKey === 'CODE_STATIC_TSSB_SBZT' && codeViewKey === '03') {
    code = [
      { code: "01", name: "未申报" },
      { code: "02", name: "已自检" },
      { code: "03", name: "申报中" },
      { code: "04", name: "已申报" },
    ];
  }

  if (codeStoreKey === 'CODE_STATIC_TSSB_SHZT' && codeViewKey === '03') {
    code = [
      { code: "0", name: "申报中" },
      { code: "1", name: "审核中" },
      { code: "2", name: "审核失败" },
      { code: "3", name: "审核成功" },
    ];
  }

  if (codeStoreKey === 'CODE_STATIC_DM_FP_FPLX' && codeViewKey === '01') {
    code = [
      { code: "81", name: "数电票（增值税专用发票）" },
      { code: "82", name: "数电票（普通发票）" },
      { code: "85", name: "数电纸质发票（增值税专用发票）" },
      { code: "86", name: "数电纸质发票（普通发票）" },
      { code: "01", name: "增值税专用发票" },
      { code: "04", name: "增值税普通发票" },
      { code: "08", name: "增值税电子专用发票" },
      { code: "10", name: "增值税电子普通发票" },
    ];
  }

  if (codeStoreKey === 'CODE_STATIC_DM_SHGL_PPFS' && codeViewKey === '01') {
    code = [
      { code: "1", name: "手动匹配" },
      { code: "2", name: "自动匹配" },
      { code: "3", name: "空" },
    ];
  }

  if (codeStoreKey === 'CODE_STATIC_DM_ZXSB_PPZT' && codeViewKey === '01') {
    code = [
      { code: '0', name: '未收汇' },
      { code: '2', name: '部分收汇' },
      { code: '1', name: '已收汇' },
    ];
  }

  if (codeStoreKey === 'CODE_STATIC_DM_JD' && codeViewKey === '01') {
    code = [
      { code: '1', name: '一季度' },
      { code: '2', name: '二季度' },
      { code: '3', name: '三季度' },
      { code: '4', name: '四季度' },
    ];
  }

  if (codeStoreKey === 'CODE_STATIC_DQRZT_DM' && codeViewKey === '01') {
      code = [
        { code: '', name: '全部' },
        { code: "0", name: "待确认" },
        { code: "1", name: "已确认" },
        { code: "2", name: "已逾期" },
      ];
    }
if (codeStoreKey === 'code_dm_gy_lcswsx_mc' && codeViewKey === '02') {
      code = [
        { code: 'MDT', name: '免抵退税' },
        { code: "MTS", name: "免退税" },
        { code: "DB", name: "代办退税" },
        { code: "FZC", name: "非自产退消费税" },
      ];
    }
  if (codeStoreKey === 'code_static_ckbgd_tslx' && codeViewKey === '01') {
    code = [
      { name: '征税', code: 'ZS' },
      { name: '免税', code: 'MS' },
      { name: '退税', code: 'TS' },
      { name: '仅退消费税', code: 'JTXFS' },
    ];
  }
  if (codeStoreKey === 'code_static_ckbgd_tslx' && codeViewKey === '02') {
    code = [
      { name: '征税', code: 'ZS' },
      { name: '免税', code: 'MS' },
      { name: '仅退消费税', code: 'JTXFS' },
    ];
  }
  if (code && code.length > 0) {
    returnData = {
      code: '200',
      body: code
    };
    return returnData;
  }
  return null;
  // return res.json(returnData);
}

export default getStaticTableCode;
