
const qxUtil: any = {};

qxUtil.getUserType = (param: any) =>{
  const { qxCode, accessObj, ywKey } = param;
  let funcName: any;
  if(qxCode === 'yhgl_ptgly') {
    funcName = 'isPtGly';
  } else if(qxCode === 'yhgl_ybyh') {
    funcName = 'isYbyh';
  }
  if (accessObj[funcName]()) {
    return true;
  }
  return false;
}

qxUtil.getQxz = (param: any) => {
  const { qxCode, accessObj, ywKey } = param;
  if (qxCode === 'workplace_cz') { // 工作台-操作列
    if (accessObj.is01002()) {
      return true;
    }
    return false;
  }
  if (qxCode === 'swfkxz_index') { // 税务反馈下载
    if (accessObj.is01002()) {
      return true;
    }
    return false;
  }
  if (qxCode === 'swfkxz_tmssb') { // 税务反馈下载-退免税申报-购进自用货物退税数据
    if (accessObj.is01002()) {
      return true;
    }
    return false;
  }
  if(qxCode === 'wbsj_wxx'){ // 退税申报-外部数据-无信息数据-更新信息状态
    if (accessObj.is01002()) {
      return true;
    }
    return false;
  }
  if(qxCode === 'tssb_dyck'){ // 退税申报-单一窗口
    if (accessObj.is01002()) {
      return true;
    }
    return false;
  }
  // 申报结果查询菜单 购进、其他、资格备案、证明隐藏
  // if(qxCode === 'sbjgcx_menu'){ // 申报结果查询
  //   if (accessObj.is01002()) {
  //     if(ywKey.indexOf('ZMKJ_') > -1 || ywKey.indexOf('QTYW_') > -1 || ywKey.indexOf('ZGBA_') > -1 || ywKey.indexOf('ZBYW_') > -1) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }
  // 数据管理-下载任务管理
  if(qxCode === 'sjgl_xzrwgl'){
    if (accessObj.is01002()) {
      return true;
    }
    return false;
  }
  // 数据管理-受托方已开具代理出口证明查询（单一窗口）
  if(qxCode === 'stf_dyck'){
    if (accessObj.is01002()) {
      return true;
    }
    return false;
  }
  // 数据管理-受托方已开具代理出口证明查询（单一窗口）
  if(qxCode === 'stf_dyck'){
    if (accessObj.is01002()) {
      return true;
    }
    return false;
  }
  // 数据管理-进项发票数据查询-增值税发票底账数据（单一窗口）
  if(qxCode === 'jxfp_dyck'){
    if (accessObj.is01002()) {
      return true;
    }
    return false;
  }
  // 在线开票
  if(qxCode === 'qz_zxkp') {
    if (accessObj.is020003()) {
      return true;
    }
    return false;
  }
  // 在线开票不可选
  if(qxCode === 'qz_zxkp2') {
    if (accessObj.is030003()) {
      return true;
    }
    return false;
  }
  // 深圳关票税渠道
  if(qxCode === 'qd_szgps') {
    if (accessObj.is020004()) {
      return true;
    }
    return false;
  }
  // 乐企
  if(qxCode === 'qx_szlq') {
    if (accessObj.is040001()) {
      return true;
    }
    return false;
  }

  // 附列资料
  if(qxCode === 'flzl') {
    if (accessObj.is010004()) {
      return true;
    }
    return false;
  }
  // 专业版用户-出口发票定制
  if(qxCode === 'qx_ckfpdz') {
    if (accessObj.is030006()) {
      return true;
    }
    return false;
  }
  // 专业版用户-出口发票定制
    if(qxCode === 'qx_ckfpdz2') {
      if (accessObj.is040001()) {
        return true;
      }
      return false;
    }
  // 渠道-uat标识
  if(qxCode === 'qd_uat') {
    if (accessObj.is020007()) {
      return true;
    }
    return false;
  }
  return false;
}
// 获取用户类型
qxUtil.getYhlx = (param: any) => {
  let { accessObj} = param;
  return  accessObj.getYhlx();
}

qxUtil.getYhuuid1 = (param: any) => {
  let { accessObj} = param;
  return  accessObj.getYhuuid1();
}

//企业管理员qyygbz
qxUtil.getQyygbz = (param: any) => {
  let { accessObj} = param;
  return  accessObj.getQyygbz();
}



qxUtil.getZy = (param: any) => {
  let { zycode, accessObj} = param;
  const zys = accessObj.isZy();
  if (zys?.includes(zycode)) {
    return true;
  }else{
    return false;
  }

}
qxUtil.getBtnQxz = (param: any) => {
  let { btncode, accessObj, ywKey, qylx } = param;
  const btns = accessObj.isBtnQx(); // 按钮数据
  // 证明申报ZMKJ_  购进ZBYW_   资格备案 ZGBA_  核销JLJG_  其他业务QTYW_
  // 单一窗口时 更新信息状态、数据自检、证明申请（正式申报）、刷新 隐藏
  // 单一窗口时 下载申报文件、反馈读入 导入 显示
  const BtnMap= [
    {btncode: 'common_001', ywKey: 'MDT', btnId: '25020102_001', mc:'更新信息状态'},
    {btncode: 'common_001', ywKey: 'MTS', btnId: '26020102_001', mc:'更新信息状态'},
    {btncode: 'common_001', ywKey: 'DBTS', btnId: '27020102_001', mc:'更新信息状态'},

    {btncode: 'common_002', ywKey: 'ZMKJ', btnId: '05_001', mc:'数据自检'},
    {btncode: 'common_002', ywKey: 'ZBYW', btnId: '03_001', mc:'数据自检', qylx: 'SC'}, // 生产
    {btncode: 'common_002', ywKey: 'ZBYW', btnId: '04_001', mc:'数据自检', qylx: 'WM'}, // 外贸
    {btncode: 'common_002', ywKey: 'JLJG', btnId: '1105_001', mc:'数据自检'},

    {btncode: 'common_003', ywKey: 'ZMKJ', btnId: '05_002', mc:'证明申请'},
    {btncode: 'common_003', ywKey: 'QTYW', btnId: '08_001', mc:'正式申报'},
    {btncode: 'common_003', ywKey: 'ZGBA', btnId: '07_001', mc:'正式申报'},
    {btncode: 'common_003', ywKey: 'ZBYW', btnId: '03_002', mc:'证明申请', qylx: 'SC'},
    {btncode: 'common_003', ywKey: 'ZBYW', btnId: '04_002', mc:'证明申请', qylx: 'WM'},

    {btncode: 'common_004', ywKey: 'ZMKJ', btnId: '05_003', mc:'刷新'},
    {btncode: 'common_004', ywKey: 'QTYW', btnId: '08_002', mc:'刷新'},
    {btncode: 'common_004', ywKey: 'ZGBA', btnId: '07_002', mc:'刷新'},
    {btncode: 'common_004', ywKey: 'ZBYW', btnId: '03_003', mc:'刷新', qylx: 'SC'},
    {btncode: 'common_004', ywKey: 'ZBYW', btnId: '04_003', mc:'刷新', qylx: 'WM'},
    {btncode: 'common_004', ywKey: 'JLJG', btnId: '1105_002', mc:'刷新'},

    {btncode: 'common_005', ywKey: 'ZMKJ', btnId: '05_004', mc:'下载申报文件'},
    {btncode: 'common_005', ywKey: 'QTYW', btnId: '08_003', mc:'下载申报文件'},
    {btncode: 'common_005', ywKey: 'ZGBA', btnId: '07_003', mc:'下载申报文件'},
    {btncode: 'common_005', ywKey: 'ZBYW', btnId: '03_004', mc:'下载申报文件', qylx: 'SC'},
    {btncode: 'common_005', ywKey: 'ZBYW', btnId: '04_004', mc:'下载申报文件', qylx: 'WM'},
    {btncode: 'common_005', ywKey: 'JLJG', btnId: '1105_003', mc:'下载申报文件'},

    {btncode: 'common_006', ywKey: 'ZMKJ', btnId: '05_005', mc:'反馈文件'},
    {btncode: 'common_006', ywKey: 'QTYW', btnId: '08_004', mc:'反馈文件'},
    {btncode: 'common_006', ywKey: 'ZGBA', btnId: '07_004', mc:'反馈文件'},
    {btncode: 'common_006', ywKey: 'ZBYW', btnId: '03_005', mc:'反馈文件', qylx: 'SC'},
    {btncode: 'common_006', ywKey: 'ZBYW', btnId: '04_005', mc:'反馈文件', qylx: 'WM'},
    {btncode: 'common_006', ywKey: 'JLJG', btnId: '1105_004', mc:'反馈文件'},

    {btncode: '0204_001', ywKey: '', btnId: '0204_001', mc:'受托方已开具代理出口证明查询_导入'},
    {btncode: '020601_001', ywKey: '', btnId: '020601_001', mc:'增值税发票底账数据_导入'},

  ];
  let codeItem:any;

  if(ywKey){
    // 如果是购进看生产外贸
    if(ywKey.indexOf('ZBYW_') > -1){
      codeItem = BtnMap.find((item) => btncode === item.btncode && item.ywKey === 'ZBYW' && qylx === item.qylx);
    } else {
      codeItem = BtnMap.find((item) => btncode === item.btncode && ywKey.indexOf(item.ywKey) > -1);
    }
  } else {
    codeItem = BtnMap.find((item) => btncode === item.btncode);
  }

  if (btns.length > 0 && btns.includes(codeItem?.btnId)) {
    return true;
  }
  return false;
}

export default qxUtil;
