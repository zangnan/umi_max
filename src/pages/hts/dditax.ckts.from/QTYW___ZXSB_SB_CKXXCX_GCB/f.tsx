/**
 * title: 出口信息查询
 * author: wx
 */
import React from 'react';
import myUtil from '@/components/DDAssist/util';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { intl as intl2 } from '@/components/DDAssist/util';

const Func: any = {
  unitRef: React.createRef(),
};

// 新建表单初始化
Func.initAddForm = (param: any) => {
  DditCktsFormCommonFunc.initAddForm(param);
}
// 编辑表单初始化
Func.initEditForm = (param: any) => {
  const { form, formItems, setFormItems, handleModalVisible } = param;
  const params: any = {
    form: form,
    myItems: formItems,
    setMyItems: setFormItems,
  }
  handleModalVisible(true);
  Func.eventOnChange.cktmspzlxDm05(params);
};

// 表单校验
Func.validator = {
  ssq01: (form: any) => {
    return DditCktsFormCommonFunc.validator.ssq01(form);
  },
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
  // 凭证号码
  pzhm201: (form: any) => {
    const cktmspzlxDm = form?.getFieldValue('cktmspzlxDm');
    const validator = async (_rule: any, value: any) => {
      if (cktmspzlxDm && value) {
        if (cktmspzlxDm == '01' && value.length != 21) { // 报关单
          return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_pzhm2_01' })));
        } else if (cktmspzlxDm == '02' && value.length != 18 && value.length != 20) { // 增值税专用发票
          return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_pzhm2_02' })));
        } else if (cktmspzlxDm == '03' && value.length != 20) { // 代理证明号
          return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_pzhm2_03' })));
        } else if (cktmspzlxDm == '04' && value.length != 22) { // 海关进口增值税专用缴款书
          return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_pzhm2_04' })));
        } else if (cktmspzlxDm == '06' && value.length < 13) {
          return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_pzhm2_06' })));
        } else if(cktmspzlxDm == '06' && value.length > 20) {
          return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_pzhm2_07' })));
        } else {
          return Promise.resolve();
        }
      } else {
        return Promise.resolve();
      }
    };
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
  // 凭证种类带出名称
  cktmspzlxDm05: (param: any) => {
    const { form } = param;
    const cktmspzlxDm = form?.getFieldValue('cktmspzlxDm');
    if(cktmspzlxDm){
      const dzxxName = myUtil.code.getCodeValByKey(cktmspzlxDm, 'code_dm_ckts_cktmspzlx:05')
      form.setFieldsValue({ dzxxName: dzxxName })
    }
  },

  // 凭证号码
  pzhm2: (param: any) => {
    // 原系统无对应代码
  }
}

export default Func;