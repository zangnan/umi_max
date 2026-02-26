import React from 'react';
import { importGzgl, importLsxx } from '@/services/hts/api';
import myUtil from '@/components/DDAssist/util';

const Func: any = {
  refUnit: React.createRef(),
};

// 弹窗 1.生成计薪人员
Func.createSalaryPerson = (param: any) => {
  const { otherRef } = param;
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal({...param, type: '11'});
  }
}

// 弹窗 2.导入提成
Func.importTc = (param: any) => {
  const { refUnit } = param;
  const otherRef = refUnit.current?.getOtherRefs();
  if (otherRef && otherRef[1]) {
    otherRef[1].current?.showModal({...param, importType: '1'});
  }
}

// 弹窗 3.导入专项扣除
Func.importZxkc = (param: any) => {
  const { refUnit } = param;
  const otherRef = refUnit.current?.getOtherRefs();
  if (otherRef && otherRef[1]) {
    otherRef[1].current?.showModal({...param, importType: '4'});
  }
}

// 弹窗 4.导入社保
Func.importSb = (param: any) => {
  const { refUnit } = param;
  const otherRef = refUnit.current?.getOtherRefs();
  if (otherRef && otherRef[1]) {
    otherRef[1].current?.showModal({...param, importType: '3'});
  }
}

// 弹窗 4.1导入历史社保公积金
Func.importHisSbgjj = (param: any) => {
  const { refUnit } = param;
  const otherRef = refUnit.current?.getOtherRefs();
  if (otherRef && otherRef[1]) {
    otherRef[1].current?.showModal({...param, importType: '7'});
  }
}

// 弹窗 4.2导入历史工资
Func.importHisSalary = (param: any) => {
  const { refUnit } = param;
  const otherRef = refUnit.current?.getOtherRefs();
  if (otherRef && otherRef[1]) {
    otherRef[1].current?.showModal({...param, importType: '8'});
  }
}

// 弹窗 2、3、4、4.1、4.2 导入提交
Func.importXzscglb = (param: any) => {
  let importType = param?.parentParam?.importType;
  let setMasker: any = param.setMasker;
  let files: any = param.form.getFieldValue('file');
  const formData: any = new FormData();
  formData.append('file', files[0].originFileObj);
  if (setMasker) {
    setMasker(true);
  }
  if (importType === '7' || importType === '8') { // 导入历史社保公积金7 导入历史工资8
    importLsxx(formData, importType === '7' ? '2' : '1').then((response: any) => {
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
  } else {
    importGzgl(formData, importType).then((response: any) => {
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
}

// 弹窗 5.生成工资
Func.createSalary = (param: any) => {
  const { otherRef } = param;
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal({...param, type: '12'});
  }
}

// 弹窗 导出工资
Func.importSalary = (param: any) => {
  const { otherRef } = param;
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal({...param, type: '13'});
  }
}

// 弹窗 生成社保公积金
Func.createSbgjj = (param: any) => {
  const { otherRef } = param;
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal({...param, type: '21'});
  }
}

// 弹窗 导出社保公积金
Func.importSbgjj = (param: any) => {
  const { otherRef } = param;
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal({...param, type: '22'});
  }
}

export default Func;