/**
 * title: 跨境应税行为免退税申报明细
 * author: wx
 */
import React from 'react';
import { checkFlglfpYcj } from '@/pages/hts/services/htsApi';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import myUtil from '@/components/DDAssist/util';

const Func: any = {
  refUnit: React.createRef(),
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
  Func.eventOnChange.sqfpyyDm(params);
};

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
      await checkFlglfpYcj(params).then((response) => {
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
  // 申请原因代码
  sqfpyyDm: (param?: any) => {
    const { form } = param;
    const sqfpyyDm = form?.getFieldValue('sqfpyyDm');
    if(sqfpyyDm){
      const sqfpyyMc = myUtil.code.getCodeValByKey(sqfpyyDm, 'code_dm_ckts_sqfpyydm:01');
      form.setFieldsValue({
        sqfpyyDm: sqfpyyDm,
        sqfpyyMc: sqfpyyMc
      });
    }
  }
}

export default Func;