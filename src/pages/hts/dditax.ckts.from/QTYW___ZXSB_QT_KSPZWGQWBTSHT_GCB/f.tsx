/**
 * title: 跨境应税行为免退税申报明细
 * author: wx
 */
import React from 'react';
import myUtil from '@/components/DDAssist/util';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { queryFpWzxx } from '@/pages/hts/services/htsApi';
import { message } from 'antd';

const Func: any = {
  refUnit: React.createRef(),
};

// 新建表单初始化
Func.initAddForm = (param: any) => {
  const { form } = param;
  DditCktsFormCommonFunc.initAddForm(param);
  const userInfo = myUtil.sessionStore.getItem('userInfo');
  const shxydm  = userInfo.qxQys[0]?.shxydm;
  if(shxydm){
    form.setFieldsValue({ gfnsrsbh: shxydm })
  }
}

// 表单提交前调用
Func.formBeforeSubmit = (param: any) => {
  const { form } = param;
  const fpDm = form?.getFieldValue('fpDm');
  const fphm = form?.getFieldValue('fphm');
  const zyjkshm = form?.getFieldValue('zyjkshm');
  const xfnsrsbh = form?.getFieldValue('xfnsrsbh');
  if (!fpDm && !fphm && !zyjkshm) {
    message.info('缴款书号码、发票号码、发票代码不能同时为空，请确认后填报！');
    return false;
  }
  // edit by yangzq 20211102 发票号码长度超过8位，按照数电票校验。（发票代码应为空）
  if (fphm && fphm.length > 8) {
    if (fpDm) {
      message.info('发票号码长度超过8位，发票代码应为空');
      return false;
    }
    // 2. 发票号码不为空时，销方纳税号不能为空
    if (!xfnsrsbh && fphm) {
      message.info('发票号码不为空时，销货方社会信用代码不能为空！');
      return false;
    }
    // 3. 发票代码和发票号码不为空时，缴款书号码应为空
    if (zyjkshm && fphm) {
      message.info('发票号码不为空时，缴款书号码应为空！');
      return false;
    }
  } else {
    // 2. 发票号码、发票代码不为空时，销方纳税号不能为空
    if (!xfnsrsbh && (fpDm || fphm)) {
      message.info('发票号码、发票代码不为空时，销方社会信用代码不能为空，请确认后填报！');
      return false;
    }
    // 3. 发票代码和发票号码不为空时，缴款书号码应为空
    if (zyjkshm && fpDm && fphm) {
      message.info('发票代码和发票号码不为空时，缴款书号码应为空');
      return false;
    }
    // 4、发票代码不为空， 发票号码和缴款书号码为空，提示“发票号码不允许为空！”禅道 12972问题修正
    if (!zyjkshm && fpDm && !fphm) {
      message.info('发票号码不允许为空！');
      return false;
    }
  }
  return true;
}

// 表单校验
Func.validator = {
  ssq01: (form: any) => {
    return DditCktsFormCommonFunc.validator.ssq01(form);
  },
  validatorJljgszch: (form: any) => {
    const validator =  (_rule: any, value: any) => {
     if (value && value.length < 15) {
        return Promise.reject(new Error('该项内容长度不能小于15位！'));
      } else if (value && value.length >20) {
        return Promise.reject(new Error('该项内容长度不能大于20位！'));
      }
      return Promise.resolve();
    };
    return { validator };
  },
}

// 表单事件：OnBlur
Func.eventOnBlur = {
  sbpc: (param: any) => {
    // 申报批次自动补零
    DditCktsFormCommonFunc.eventOnBlur.sbpc(param);
  },
  xh: (param: any) => {
    const { event, form } = param;
    const inputValue = event.target.value;
    form.setFieldsValue({
      xh: myUtil.text.leadingZeroize(inputValue, 8),  // 自动补零
    });
  },
  jhpzh: async (param: any) => {
    const { form } = param;
    const fpDm = form?.getFieldValue('fpDm');
    const fphm = form?.getFieldValue('fphm');
    if (fpDm || fphm) {
      queryFpWzxx({ fpDm: fpDm, fphm: fphm }).then(async (res: any) => {
        const {code, body, desc} = res;
        if (code == '200') {  
          // 供方纳税人识别号（销货方）
          const xfnsrsbh = body?.xfnsrsbh
          if (xfnsrsbh) {
            form.setFieldsValue({xfnsrsbh})
          } else {
            form.setFieldsValue({xfnsrsbh: ''});
          }
        } else {
          message.error(desc);
        }
      });
    }
  },
}
// 表单事件：OnFocus
Func.eventOnFocus = {
}
// 表单事件：OnChange
Func.eventOnChange = {
  jhpzh: async (param: any) => {
    const { form } = param;
    const fpDm = form?.getFieldValue('fpDm');
    const fphm = form?.getFieldValue('fphm');
    if ((fpDm && fphm && fpDm.length == 10 && fphm.length == 8) || (fphm && fphm.length == 20)) {
      queryFpWzxx({ fpDm: fpDm, fphm: fphm }).then(async (res: any) => {
        const {code, body, desc} = res;
        if (code == '200') {  
          // 供方纳税人识别号（销货方）
          const xfnsrsbh = body.xfnsrsbh
          if (xfnsrsbh) {
            form.setFieldsValue({xfnsrsbh})
          }
        } else {
          message.error(desc);
        }
      });
    }
  },
}

export default Func;