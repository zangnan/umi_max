import React from 'react';
import { initUserResumeByExcel, queryForm, queryList, initUserInfoByExcel, initUserResumeListByExcel } from '@/services/hts/api';
import myUtil from '@/components/DDAssist/util';
import dayjs from "dayjs";

const Func: any = {
  refUnit: React.createRef(),
};

// 弹窗 生成合同 入职
Func.schtxx = (param: any) => {
  const { otherRef } = param;
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal({...param, isInit: true});
  }
}

// 弹窗 生成合同 续签
Func.xq = (param: any) => {
  const { otherRef } = param;
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal(param);
  }
}

// 弹窗 转正
Func.zzsq = (param: any) => {
  // const { otherRef } = param;
  const { refUnit } = param;
  const otherRef = refUnit.current?.getOtherRefs();
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal(param);
  }
}

// 弹窗 导入简历 入口：入职管理
Func.drjbxx = (param: any) => {
  const { refUnit } = param;
  const otherRef = refUnit.current?.getOtherRefs();
  if (otherRef && otherRef[1]) {
    otherRef[1].current?.showModal(param);
  }
}

// 弹窗 导入简历 入口：人员基本信息
Func.drjbxx01 = (param: any) => {
  const { refUnit } = param;
  const otherRef = refUnit.current?.getOtherRefs();
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal(param);
  }
}

// 弹窗 导入历史数据 入口：员工信息管理
Func.importHisData = (param: any) => {
  const { refUnit } = param;
  const otherRef = refUnit.current?.getOtherRefs();
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal(param);
  }
}

// 弹窗 批量初始化简历信息 入口：员工信息管理
Func.importResumeBatch = (param: any) => {
  const { refUnit } = param;
  const otherRef = refUnit.current?.getOtherRefs();
  if (otherRef && otherRef[1]) {
    otherRef[1].current?.showModal(param);
  }
}

// 导入简历
Func.importResume = (param: any, ygzt: any) => {
  let setMasker: any = param.setMasker;
  let files: any = param.form.getFieldValue('file');
  const formData: any = new FormData();
  formData.append('file', files[0].originFileObj);
  formData.append('rzglYgzt', ygzt);
  if (setMasker) {
    setMasker(true);
  }
  initUserResumeByExcel(formData).then((response: any) => {
    let { code, msg} = response;
    myUtil.modal.responseInfo({code, msg});
    param.setModalVisible(false);
    if (setMasker) {
      setMasker(false);
    }
    if (code === '200') {
      param?.parentParam?.refUnit?.current?.reload();
    }
  })
}

// 导入历史数据
Func.doImportHisData = (param: any) => {
  let setMasker: any = param.setMasker;
  let files: any = param.form.getFieldValue('file');
  const formData: any = new FormData();
  formData.append('file', files[0].originFileObj);
  if (setMasker) {
    setMasker(true);
  }
  initUserInfoByExcel(formData).then((response: any) => {
    let { code, msg} = response;
    param.setModalVisible(false);
    myUtil.modal.responseInfo({code, msg});
    if (setMasker) {
      setMasker(false);
    }
    if (code === '200') {
      param?.parentParam?.refUnit?.current?.reload();
    }
  })
}

// 批量初始化简历信息
Func.doImportResumeBatch = (param: any) => {
  let setMasker: any = param.setMasker;
  let files: any = param.form.getFieldValue('file');
  const formData: any = new FormData();
  files.forEach((itemFile: any) => {
    formData.append('fileList', itemFile.originFileObj);
  });
  if (setMasker) {
    setMasker(true);
  }
  initUserResumeListByExcel(formData).then((response: any) => {
    let { code, msg, body = {} } = response;
    param.setModalVisible(false);
    myUtil.modal.responseInfo({code, msg, body});
    if (setMasker) {
      setMasker(false);
    }
    if (code === '200') {
      param?.parentParam?.refUnit?.current?.reload();
    }
  })
}

// 弹窗 离职
Func.lzsq = (param: any) => {
  const { refUnit } = param;
  const otherRef = refUnit.current?.getOtherRefs();
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal(param);
  }
}

// 设置试用期结束日期
const setSyqjsrq = (param: any) => {
  const { form } = param;
  let rzrq2 = form.getFieldValue('rzrq2');
  let syqyf = form.getFieldValue('syqyf');
  if (rzrq2 && syqyf) {
    // debugger;
    let aaa = dayjs(new Date(rzrq2));
    let ccc = aaa.add(syqyf, 'month');
    form.setFieldsValue({
      syqjsrq: ccc,
    });
  }
}

// 设置合同结束日期
const setYxqz = (param: any) => {
  const { form } = param;
  let htqxlxDm = form.getFieldValue('htqxlxDm');
  let yxqq = form.getFieldValue('yxqq');
  if (htqxlxDm && yxqq) {
    htqxlxDm = myUtil.text.getNumVal(htqxlxDm);
    if (htqxlxDm === 0) {
      form.setFieldsValue({
        yxqz: null,
      });
    } else {
      // debugger;
      let aaa = dayjs(new Date(yxqq));
      let ccc = aaa.add(htqxlxDm, 'year');
      form.setFieldsValue({
        yxqz: ccc,
      });
    }
  }
}

// 表单事件：OnChange
Func.eventOnChange = {
  // 入职日期
  rzrq: (param: any) => {
    setSyqjsrq(param);
  },
  // 试用期月份
  syqyf: (param: any) => {
    setSyqjsrq(param);
  },
  // 合同签订年限
  htqxlxDm: (param: any) => {
    setYxqz(param);
  },
  // 合同开始日期
  yxqq: (param: any) => {
    setYxqz(param);
  },
}

// 查询当前人员信息并赋值表单
Func.searchPersonAndSetForm = async (formConfigTmp: any, currentUser: any, modelKey: any, form: any) => {
  let userId = currentUser?.body?.userId;
  // 查询人员
  let gridData: any;
  let resPersons: any = await queryList({page: 1, pageSize: 10, searchModel: [
    { op: 'eq', property: 'userId', type: 1, value: userId }]}, 'nbgl_yggl');
  if (resPersons?.code === '200' && resPersons?.body?.rowCount > 0) {
    gridData = resPersons.body.rows || [];
    if (gridData.length > 0) {
      let uuid: any = gridData[0].uuid;
      let resPerson: any = await queryForm({ key : modelKey, uuid });
      if (resPerson?.code === '200') {
        let formValue: any = resPerson.body;
        let formItems = formConfigTmp.form_items;
        myUtil.module.setFormConfigValue({ formValue, form, formItems });
      }
    }
  }
};

// 生成合同按钮是否可用
Func.setSchtxxDisabled = (param: any) => {
  if (param.rzztDm === '3' && param.lzztDm !== '3') { // 入职状态 === 3 已入职 && 离职状态 !== 3 未离职
    if (!param.htscDm) {
      return false;
    }
    return true;
  }
  return true;
}

// 续签按钮是否可用
Func.setXqDisabled = (param: any) => {
  // 现行合同 && 审批通过 按钮可用
  if (param.htztDm === '2' && param.xtglProcessRunState === '4') {
    return false;
  }
  return true;
}

// 设置默认操作列 只读属性
const setColDisabled = (param: any, module?: any) => {
  if (param.xtglProcessRunState === '1' || param.xtglProcessRunState === '2') {
    return true;
  }
  if (module === 'ldht') { // 劳动合同模块
    if (param.htztDm === '1') { // 历史合同
      return true;
    }
  }
  return false;
}

// 设置默认操作列-编辑 只读属性 模块：入职管理
Func.setBpmEditDisabled_nbgl_yggl_rzgl = (param: any) => setColDisabled(param);

// 设置默认操作列-删除 只读属性 模块：入职管理
Func.setBpmDeleteDisabled_nbgl_yggl_rzgl = (param: any) => setColDisabled(param);

// 设置默认操作列-编辑 只读属性 模块：转正管理
Func.setBpmEditDisabled_nbgl_yggl_zzgl = (param: any) => setColDisabled(param);

// 设置默认操作列-删除 只读属性 模块：转正管理
Func.setBpmDeleteDisabled_nbgl_yggl_zzgl = (param: any) => setColDisabled(param);

// 设置默认操作列-编辑 只读属性 模块：离职管理
Func.setBpmEditDisabled_nbgl_yggl_lzgl = (param: any) => setColDisabled(param);

// 设置默认操作列-删除 只读属性 模块：离职管理
Func.setBpmDeleteDisabled_nbgl_yggl_lzgl = (param: any) => setColDisabled(param);

// 设置默认操作列-编辑 只读属性 模块：合同管理
Func.setBpmEditDisabled_nbgl_yggl_ldht = (param: any) => setColDisabled(param, 'ldht');

// 设置默认操作列-删除 只读属性 模块：合同管理
Func.setBpmDeleteDisabled_nbgl_yggl_ldht = (param: any) => setColDisabled(param, 'ldht');

// 工作流 提交审批按钮是否可用 劳动合同模块
// 4-通过   3-不通过    1-待审批    2-进行中    空-未提交
Func.setSubmitFlowDisabledLdht = (record: any) => {
  if (record.htztDm === '1' || record.htztDm === '2') { // 历史合同 或 现行合同 按钮不可用
    return true;
  }
  if (record.xtglProcessRunState === '1' || record.xtglProcessRunState === '2'// 流程进行中 按钮不可用
      || record.xtglProcessRunState === '3' || record.xtglProcessRunState === '4') {
    return true
  }
  return false;
}
export default Func;