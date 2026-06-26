/**
 * title: 出口退（免）税备案变更
 * author: wx
 */
import React from 'react';
import { message } from 'antd';
import { intl as intl2 } from '@/components/DDAssist/util';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';

const Func: any = {
  unitRef: React.createRef(),
};

// 新建表单初始化
Func.initAddForm = (param: any) => {
  DditCktsFormCommonFunc.initAddForm(param);
}

// 表单校验
Func.validator = {
}
// 表单事件：OnBlur
Func.eventOnBlur = {
}
// 表单事件：OnFocus
Func.eventOnFocus = {
}
// 表单事件：OnChange
Func.eventOnChange = {
}

// 打开新建
Func.handleCostomerAdd  = (param: any) => {
  const otherRef = param.unitRef.current?.getOtherRefs();
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal(param);
  } else if (param.otherRef && param.otherRef[0]) {
    param.otherRef[0].current?.showModal(param);
  }
}
// 打开编辑
Func.handleCostomerEdit  = (param: any) => {
  const { selectionRows } = param;
  // 选择数据条数判断
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (selectionRows.length > 1) {
    message.info(intl2.formatMessage({ id: 'message_one_selected' }));
    return;
  }
  const otherRef = param.unitRef.current?.getOtherRefs();
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal({...param, ...{ record: selectionRows[0] }});
  } else if (param.otherRef && param.otherRef[0]) {
    param.otherRef[0].current?.showModal({...param, ...{ record: selectionRows[0] }});
  }
}

export default Func;