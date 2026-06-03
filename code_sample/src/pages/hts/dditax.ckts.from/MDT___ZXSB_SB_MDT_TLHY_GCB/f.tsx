/**
 * title: 跨境应税行为免退税申报明细
 * author: wx
 */
import React from 'react';
import myUtil from '@/pages/common/myUtil';
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
  // 所属期
  ssq02: (form: any) => {
    return DditCktsFormCommonFunc.validator.ssq02(form);
  },
  // 申报序号
  sbxh02: (form: any) => {
    return DditCktsFormCommonFunc.validator.sbxh02(form);
  },
}
// 表单事件：OnBlur
Func.eventOnBlur = {
  // 申报序号
  sbxh: (param: any) => {
    // 申报序号自动补零
    DditCktsFormCommonFunc.eventOnBlur.sbxh(param);
  },
  // 月份
  yf: (param: any) => {
    const { form } = param;
    let yf = form?.getFieldValue('yf');
    if (yf.length == 1) {
      yf = '0' + yf;
      form.setFieldsValue({ yf: yf });
    }
  },
  // 货票汇总金额
  hphzje: (param: any) => {
    const { form } = param;
    // 中国铁路总公司国际货物运输明细
    // 货票汇总金额
    const hphzje = myUtil.text.getNumVal(form?.getFieldValue('hphzje'));
    // 归属其他铁路运输企业金额
    const gsqttlysqyje = myUtil.text.getNumVal(form?.getFieldValue('gsqttlysqyje'));
    // 反算归属汇缴成员国铁金额字段项，规则为“货票汇总金额-归属其他铁路运输企业金额”
    const result = DditCktsFormCommonFunc.util.getSubtractResult({
      param1: hphzje,
      param2: gsqttlysqyje
    });
    if (result || result === 0) {
      // 归属汇缴成员国铁金额
      form.setFieldsValue({ gshjcygtje: myUtil.text.getNumVal(myUtil.text.formatNum(result, '0,0.00')) });
    }
    Func.eventOnBlur.gshjcygtje(param);
  },
  // 归属其他铁路运输企业金额
  gsqttlysqyje: (param: any) => {
    Func.eventOnBlur.hphzje(param);
  },
  // 归属汇缴成员国铁金额
  gshjcygtje: (param: any) => {
    const { form } = param;
    // 中国铁路总公司国际货物运输明细
    // 汇缴成员国铁金额
    const gshjcygtje = myUtil.text.getNumVal(form?.getFieldValue('gshjcygtje'));
    // 应扣除税额
    const ykcje1 = myUtil.text.getNumVal(form?.getFieldValue('ykcje1'));
    // 反算清算后应税服务计税金额字段项，规则为“归属汇缴成员国铁金额-应扣除金额”
    const result = DditCktsFormCommonFunc.util.getSubtractResult({
      param1: gshjcygtje,
      param2: ykcje1
    });
    if (result || result === 0) {
      // 清算后应税服务计税金额
      form.setFieldsValue({ qshysfwjsje: myUtil.text.getNumVal(myUtil.text.formatNum(result, '0,0.00')) });
    }
  },
  // 应扣除金额
  ykcje1: (param: any) => {
    Func.eventOnBlur.gshjcygtje(param);
  },
}
// 表单事件：OnFocus
Func.eventOnFocus = {
}
// 表单事件：OnChange
Func.eventOnChange = {
  // 运输类型
  tlyslxDm: (param: any) => {
    const { form, value }= param;
    const tlyslxmc = myUtil.code.getCodeValByKey(value, 'code_dm_ckts_tlyslx', '01')
    form.setFieldsValue({ tlyslxmc: tlyslxmc });
  },
}

export default Func;