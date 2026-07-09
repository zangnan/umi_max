/**
 * title: 出口企业申请提醒服务
 */
import React from 'react';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { checkCktsywtxYcj } from '@/pages/hts/services/htsApi';

const Func: any = {
  refUnit: React.createRef(),
};

// 新建表单初始化
Func.initAddForm = (param: any) => {
  DditCktsFormCommonFunc.initAddForm(param);
}

// 表单校验
Func.validator = {
  // 申请日期
  tbrq01: (form: any) => {
    const unitKey = form?.otherParam?.unit_key;
    const uuid = form?.getFieldValue('uuid');
    const validator = async (_rule: any, value: any) => {
      const tbrq1= form.getFieldValue('tbrq1');
      const obj ={"uuid":uuid,"tableKey":unitKey,"tbrq1":tbrq1};
      await checkCktsywtxYcj(obj).then((response) => {
        if (response.code === '900') {
          return Promise.reject(new Error(response.msg));
        }
        return Promise.resolve();
      }).catch((err) => {
        return Promise.reject(err);
      });
      return Promise.resolve();
    };
    return { validator };
  },
  djryxm01: (form: any) => {  
    // 1. 申请服务时,登记人姓名1必录
		var sqtstxfwbz = form?.getFieldValue('sqtstxfwbz');
      const validator = async (_rule: any, value: any) => {
        if(sqtstxfwbz == 'Y' && !value){
          return Promise.reject("登记人姓名不应为空，请确认后填报！");
        }
      return Promise.resolve();
    };
    return { validator };
  },
  zw01: (form: any) => {  
    // 1. 申请服务时,登记人姓名1必录
		var sqtstxfwbz = form?.getFieldValue('sqtstxfwbz');
      const validator = async (_rule: any, value: any) => {
        if(sqtstxfwbz == 'Y' && !value){
          return Promise.reject("申请服务时, 职务必录！");
        }
      return Promise.resolve();
    };
    return { validator };
  },
  lxdh01:(form: any) => {  
    // 1. 申请服务时,登记人姓名1必录
		var sqtstxfwbz = form?.getFieldValue('sqtstxfwbz');
      const validator = async (_rule: any, value: any) => {
        if(sqtstxfwbz == 'Y' && !value){
          return Promise.reject("申请服务时, 联系电话必录！");
        }
      return Promise.resolve();
    };
    return { validator };
  },
  yx01:(form: any) => {  
    // 1. 申请服务时,登记人姓名1必录
		var sqtstxfwbz = form?.getFieldValue('sqtstxfwbz');
      const validator = async (_rule: any, value: any) => {
        if(sqtstxfwbz == 'Y' && !value){
          return Promise.reject("申请服务时, 邮箱必录！");
        }
      return Promise.resolve();
    };
    return { validator };
  },
  sqtxnr01:(form: any) => {  
    // 1. 申请服务时,登记人姓名1必录
		var sqtstxfwbz = form?.getFieldValue('sqtstxfwbz');
      const validator = async (_rule: any, value: any) => {
        if(sqtstxfwbz == 'Y' && !value){
          return Promise.reject("申请服务时,申请提醒必录！");
        }
      return Promise.resolve();
    };
    return { validator };
  },
}
// 表单事件：OnBlur
Func.eventOnBlur = {
}
// 表单事件：OnFocus
Func.eventOnFocus = {
}
  // 表单事件：OnChange
Func.eventOnChange = {
    sqtstxfwbz:(param: any) => { 
      const { form, myItems, setMyItems } = param;
      // 1. 申请服务时,登记人姓名1必录
      var sqtstxfwbz = form.getFieldsValue().sqtstxfwbz;
      if(sqtstxfwbz == 'N'){
        myItems[13].disabled =true,
        setMyItems([...myItems]);
      }
    },
  }

export default Func;