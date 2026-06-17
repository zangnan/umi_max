/**
 * title: 航空运输收入清算账单
 * author: wx
 */
import React from 'react';
import myUtil from '@/components/DDAssist/util';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import dayjs from 'dayjs';

const Func: any = {
  unitRef: React.createRef(),
};

// 新建表单初始化
Func.initAddForm = (param: any) => {
  DditCktsFormCommonFunc.initAddForm(param);
}
// 编辑表单初始化
Func.initEditForm = (param: any) => {
  const { form, formItems, setFormItems, handleModalVisible, unitKey } = param;
  const params: any = {
    form: form,
    myItems: formItems,
    setMyItems: setFormItems,
  }
  handleModalVisible(true);
  params.unitKey = unitKey;

  const hbzmDm = form?.getFieldValue('hbzmDm'); // 清算币种
  params.value = hbzmDm;
  params.item = { name: 'hbzmDm' };
  Func.eventOnBlur.hbhlDm(params);
};

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
  // 清算情况原币金额
  cjzj: (param: any) => {
    Func.eventOnBlur.cjhbhl(param);
  },
  // 原币汇率
  cjhbhl: (param: any) => {
    const { form } = param;
    // 航空国际运输收入清算账单申报明细表
    // 反算清算情况金额（人民币）字段项，规则为“成交总价*原币汇率”
    // 成交总价
    const cjzj = myUtil.text.getNumVal(form?.getFieldValue('cjzj'));
    const cjhbhl = myUtil.text.getNumVal(form?.getFieldValue('cjhbhl'));
    const result = DditCktsFormCommonFunc.util.getMultiplyResult({
      param1: cjhbhl,
      param2: cjzj
    });
    if (result || result === 0) {
      // 清算情况金额（人民币）
      const result1 = DditCktsFormCommonFunc.util.getDivideResult({
        param1: result,
        param2: 100
      });
      if (result1 || result1 === 0) {
        form.setFieldsValue({ qsqkjermb: myUtil.text.getNumVal(myUtil.text.formatNum(result1, '0,0.00')) });
      }
    }
  },
  // 清算币种
  hbhlDm: (param: any) => {
    DditCktsFormCommonFunc.eventOnBlur.hbhlDm(param);
  },
}
// 表单事件：OnFocus
Func.eventOnFocus = {
  // 清算币种
  hbhlDm: (param: any) => {
    Func.eventOnChange.kjrq(param);
  },
}
// 表单事件：OnChange
Func.eventOnChange = {
  // 清算账单类别
  hkgjqszdlbDm: (param: any) => {
    // 原系统内无对应代码
  },
  // 国际运输类别
  hkgjyslbDm: (param: any) => {
    // 原系统内无对应代码
  },
  // 收付款国家（地区）名称
  gjhdqDm: (param: any) => {
    // 原系统内无对应代码
  },
  // 清算账单出具日期
  kjrq: (param: any) => {
    const { form } = param;
    const url = '/yw/bszx/ggfw/sbcs/ywcsxx/queryHlxx';
    const kjrq = form?.getFieldValue('kjrq');
    DditCktsFormCommonFunc.util.loadCodeDmHbhlAutoComplete({
      form,
      url,
      key: 'url_gy_hbhl',
      codeViewKey: '01',
      ckrq: kjrq ? dayjs(kjrq).format('YYYY-MM-DD') : ''
    })
  },
}

export default Func;