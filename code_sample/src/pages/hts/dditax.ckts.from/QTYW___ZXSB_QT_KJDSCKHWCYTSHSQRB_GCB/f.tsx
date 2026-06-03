/**
 * title: 跨境电商出口海外仓预退税核算确认表
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
  // 申报批次
  sbpc01: (form: any) => {
    return DditCktsFormCommonFunc.validator.sbpc01(form);
  },
   // 申报批次
  sbpc02: (form: any) => {
    return DditCktsFormCommonFunc.validator.sbpc02(form);
  },
  // 申报序号
  sbxh02: (form: any) => {
    return DditCktsFormCommonFunc.validator.sbxh02(form);
  },
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
  sbpc: (param: any) => {
    // 申报批次自动补零
    DditCktsFormCommonFunc.eventOnBlur.sbpc(param);
  },
  // 申报序号
  sbxh: (param: any) => {
    // 申报序号自动补零
    DditCktsFormCommonFunc.eventOnBlur.sbxh(param);
  },
  }
// 表单事件：OnFocus
Func.eventOnFocus = {
  }
// 表单事件：OnChange
Func.eventOnChange = {
  // 所属期
  ssq: (param: any) => {
    DditCktsFormCommonFunc.eventOnChange.ssq(param);
  },
 
  }

export default Func;