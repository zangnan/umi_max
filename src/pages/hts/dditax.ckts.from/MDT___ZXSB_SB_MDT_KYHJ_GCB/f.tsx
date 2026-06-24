/**
 * title: 国际旅客/行李包裹运输清算函件
 * author: wx
 */
import React from 'react';
import myUtil from '@/components/DDAssist/util';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import moment from 'moment';

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

  const cjhbzmDm = form?.getFieldValue('cjhbzmDm'); // 原币代码
  params.value = cjhbzmDm;
  params.item = { name: 'cjhbzmDm' };
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
  // 归属于中方（内地）金额原币
  cjzj: (param: any) => {
    Func.eventOnBlur.cjhbhl(param);
  },
  // 归属于中方（内地）金额原币汇率
  cjhbhl: (param: any) => {
    const { form } = param;
    // 国际客运（含香港直通车）旅客、行李包裹运输清算函件明细
    // 反算归属于中方（内地）金额人民币字段项，规则为“ 成交总价*成交货币汇率/ 100”
    const cjhbhl = myUtil.text.getNumVal(form?.getFieldValue('cjhbhl'));
    const cjzj = myUtil.text.getNumVal(form?.getFieldValue('cjzj'));
    if (cjhbhl && cjzj) {
      const gsyzfndjermb = DditCktsFormCommonFunc.util.setCkxsermb({
        cjhbhl: cjhbhl,
        cjzj: cjzj
      });
      if (gsyzfndjermb || gsyzfndjermb === 0) {
        // 归属于中方（内地）金额人民币
        form.setFieldsValue({ gsyzfndjermb: myUtil.text.getNumVal(myUtil.text.formatNum(gsyzfndjermb, '0,0.00')) });
        Func.eventOnBlur.gsyzfndjermb(param);
      }
    }
  },
  // 归属于中方（内地）金额人民币
  gsyzfndjermb: (param: any) => {
    const { form } = param;
    // 国际客运（含香港直通车）旅客、行李包裹运输清算函件明细过程表
    // 归属于中方（内地）金额人民币
    const gsyzfndjermb = myUtil.text.getNumVal(form?.getFieldValue('gsyzfndjermb'));
    // 美元汇率
    const myhl = myUtil.text.getNumVal(form?.getFieldValue('myhl'));
    // 反算归属于中方（内地）金额美元字段项，规则为“归属于中方（内地）金额人民币 / 美元汇率”
    const result = DditCktsFormCommonFunc.util.getDivideResult({
      param1: gsyzfndjermb,
      param2: myhl
    });
    if (result || result === 0) {
      // 归属于中方（内地）金额美元
      const result1 = DditCktsFormCommonFunc.util.getMultiplyResult({
        param1: result,
        param2: 100
      });
      if (result1 || result1 === 0) {
        form.setFieldsValue({ gsyzfndjemy: myUtil.text.getNumVal(myUtil.text.formatNum(result1, '0,0.00')) });
      }
    }
  },
  // 归属于中方（内地）金额美元汇率
  myhl: (param: any) => {
    Func.eventOnBlur.gsyzfndjermb(param);
  },
  // 原币代码
  hbhlDm: (param: any) => {
    DditCktsFormCommonFunc.eventOnBlur.hbhlDm({...param, ...{ func: Func}});
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
  // 清算函件（月报）类别
  gjkyqshjlbDm: (param: any) => {
    // 原系统内无对应代码
  },
  // 有关国家（外方）或地区
  gjhdqDm: (param: any) => {
    // 原系统内无对应代码
  },
  // 清算函件（月报）出具日期
  kjrq: (param: any) => {
    const { form } = param;
    const url = '/yw/bszx/ggfw/sbcs/ywcsxx/queryHlxx';
    const kjrq = form?.getFieldValue('kjrq');
    DditCktsFormCommonFunc.util.loadCodeDmHbhlAutoComplete({
      form,
      url,
      key: 'url_gy_hbhl',
      codeViewKey: '01',
      ckrq: kjrq ? moment(kjrq).format('YYYY-MM-DD') : ''
    })
  },
  hbhlDm:(param: any) => {
    const { form } = param;
    const cjhbzmDm = form?.getFieldValue('cjhbzmDm')
    if(!cjhbzmDm) {
      form.setFieldsValue({ybbiname: ''})
    }
  },
}

export default Func;