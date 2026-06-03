/**
 * title: 内部风险控制体系建设情况报告
 * author: wx
 */
import React from 'react';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { checkFkbgYcj } from '@/services/hts/api';

const Func: any = {
  unitRef: React.createRef(),
};

// 新建表单初始化
Func.initAddForm = (param: any) => {
  DditCktsFormCommonFunc.initAddForm(param);
}

// 表单校验
Func.validator = {
  // 所属期
  ssq02: (form: any) => {
    return DditCktsFormCommonFunc.validator.ssq02(form);
  },
  ssq03: (form?: any) => {
    // 国内启运方式
    const ssq = form?.getFieldValue('ssq');
    const uuid = form?.getFieldValue('uuid') == undefined?'':form?.getFieldValue('uuid');
    const params = { uuid: uuid, ssq: ssq }
    // 添加业务类型选择GHQYTS时，报关单号与代理证明号都不能为空。
    const validator = async (_rule: any, value: any) => {
      await checkFkbgYcj(params).then((response) => {
        const { code, msg } = response;
        if (code !== '200') {
          return Promise.reject(new Error(msg));
        }
        return Promise.resolve();
      }).catch((err) => {
        return Promise.reject(err);
      });
    }
    return { validator };
  }
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

export default Func;