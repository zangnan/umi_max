import React from 'react';
import { message } from 'antd';
import myUtil from '@/components/DDAssist/util';
import { Message } from '@icon-park/react';

const Func: any = {
  refUnit: React.createRef(),
};

// 列表自定义渲染
Func.columnsRender = {
  // sbxh
  sbxh: (param: any) => {
    const sbxh = param?.record?.sbxh;
    const nbglRqRender = sbxh + ' 格式化 ~';
    return nbglRqRender;
  },
}

// 按钮是否可用
Func.setDoTestDisabled = (record: any) => {
  if (record.sbpc === '2') {
    return true;
  }
  return false;
}

// 表单事件：OnBlur
Func.eventOnBlur = {
  sbpc: (param: any) => {
    message.info('onblur event');
    console.info(param);
  }
}

// 表单事件：OnFocus
Func.eventOnFocus = {
  sbpc: (e: any, form: any) => {
    message.info('onfocus event');
    console.info(e, form);
  }
}
// 表单事件：OnChange
Func.eventOnChange = {
  cktmspzlxDm: (param: any) => {
    message.info('onchange event');
    console.info(param);
  }
}

// 表单事件：OnClick
Func.eventOnSearch = {
  sbpc: (param: any) => {
    console.info(param);
  },
}

// 列表合计自定义渲染
Func.statistics = {
  sum2: {
    je: ({sum2}: any) => '自行格式化： ' + sum2?.je || 0
  },
  min2: {
    je: ({min2}: any) => '自行格式化： ' + min2?.je || 0
  },
  max2: {
    je: ({max2}: any) => '自行格式化： ' + max2?.je || 0
  },
  avg2: {
    je: ({avg2}: any) => '自行格式化： ' + avg2?.je || 0
  }
}

// 表单保存成功后回调
// Func.afterFormSaveSuccess = () => {
//   myUtil.code.updateCodeTableByKeys(['code_dm_def_contract']);
// }

// 表单删除成功后回调
// Func.afterFormDeleteSuccess = () => {
//   myUtil.code.updateCodeTableByKeys(['code_dm_def_contract']);
// }

export default Func;