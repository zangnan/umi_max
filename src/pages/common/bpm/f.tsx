import React from 'react';

const Func: any = {
  unitRef: React.createRef(),
};

// 按钮 开启流程办理弹窗
Func.doFlow = (param: any, event: any) => {
  event.stopPropagation();
  const { otherRef } = param;
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal({...param, isCancelledForm: false, isReadOnlyForm: false});
  }
}

// 按钮 开启流程办理弹窗 详情-只读
Func.doFlowDetail = (param: any, event: any) => {
  event.stopPropagation();
  const { otherRef } = param;
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal({...param, isCancelledForm: false, isReadOnlyForm: true});
  }
}

// 按钮 中止
Func.zz = (param: any, event: any) => {
  event.stopPropagation();
  const { otherRef } = param;
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal({...param, isCancelledForm: true, isReadOnlyForm: false});
  }
}

// 中止按钮 disable
// 9-中止   4-通过   3-不通过    1-待审批    2-进行中    空-未提交
Func.setZzDisabled = (record: any) => {
  if (record.xtglProcessRunState === '4' || record.xtglProcessRunState === '3' || record.xtglProcessRunState === '9') {
    return true;
  }
  return false;
}

export default Func;