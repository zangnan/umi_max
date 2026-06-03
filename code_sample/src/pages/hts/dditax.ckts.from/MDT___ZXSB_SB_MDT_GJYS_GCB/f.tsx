/**
 * title: 跨境应税行为免退税申报明细
 * author: wx
 */
import React from 'react';
import myUtil from '@/pages/common/myUtil';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { message } from 'antd';
import { getCmCode } from '@/services/hts/api';
import moment from 'moment';
import DDAlert from "@/components/DDAlert";

const Func: any = {
  unitRef: React.createRef(),
};

// 新建表单初始化
Func.initAddForm = (param: any) => {
  DditCktsFormCommonFunc.initAddForm(param);
}
// 编辑表单初始化
Func.initEditForm = (param: any) => {
  const { form, myFormItems, setMyFormItems, handleModalVisible, unit_key } = param;
  const params: any = {
    form: form,
    myItems: myFormItems,
    setMyItems: setMyFormItems,
  }
  DDAlert.open({
    title: '系统提示',
    info: '注意：如果修改【所属期】相同关联号对应的出口明细和进货明细将会一并修改！',
    infoType: 'question',
    modalType: 'confirm',
    okCallbackFn: function () {
      DDAlert.close();
      handleModalVisible(true);
      params.unit_key = unit_key;
      const cjhbzmDm = form?.getFieldValue('cjhbzmDm'); // 原币代码
      params.value = cjhbzmDm;
      params.item = { name: 'cjhbzmDm' };
      Func.eventOnBlur.hbhlDm(params);
    },
  });
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
  // 跨境应税行为代码
  ysfwDm01: (form: any) => {
    const validator = async (_rule: any, value: any) => {
			// 该跨境销售服务及无形资产代码应为货物类商品代码！
      const ysfwDm = form?.getFieldValue('ysfwDm');
			if (ysfwDm) {
				const codeFlag = ysfwDm.substring(0, 2);
				if (codeFlag != '99' && !ysfwDm.startsWith('88026000')) {
          return Promise.reject(new Error('跨境销售服务及无形资产代码应为货物类商品代码，请确认后填报！'));
				}
			}
      return Promise.resolve();
    };
    return { validator };
  },
}
// 表单事件：OnBlur
Func.eventOnBlur = {
  // 申报序号
  sbxh: (param: any) => {
    // 申报序号自动补零
    DditCktsFormCommonFunc.eventOnBlur.sbxh(param);
  },
  // 原币营业额
  cjzj: (param: any) => {
    const { form } = param;
    // 国际运输明细
    // 反算应税服务营业额（人民币）字段项，规则为“成交总价*原币汇率/100”
    let ybhl = myUtil.text.getNumVal(form?.getFieldValue('ybhl'));
    let cjzj = myUtil.text.getNumVal(form?.getFieldValue('cjzj'));
    if (!ybhl) {
      form.setFieldsValue({ ybhl: '0' });
      ybhl = '0';
    }
    if (!cjzj) {
      form.setFieldsValue({ cjzj: '0' });
      cjzj = '0';
    }
    if (ybhl && cjzj) {
      const ysfwyyermb = DditCktsFormCommonFunc.util.setCkxsermb({
        cjhbhl: ybhl,
        cjzj: cjzj
      });
      if (ysfwyyermb || ysfwyyermb === 0) {
        // 应税服务营业额（人民币）
        form.setFieldsValue({ ysfwyyermb: myUtil.text.getNumVal(myUtil.text.formatNum(ysfwyyermb, '0,0.00')) });
        Func.eventOnBlur.ysfwyyermb(param);
      }
    }
  },
  // 原币汇率
  ybhl: (param: any) => {
    const { form } = param;
    // 反算应税服务营业额（人民币）字段项，规则为“成交总价*原币汇率/100”；
    Func.eventOnBlur.cjzj(param);
    // 反算美元汇率字段项，规则为“币别为USD原币汇率不为0则美元汇率设置为原币汇率的值”。
    const cjhbzmDm = form?.getFieldValue('cjhbzmDm')
    const myhl = myUtil.text.getNumVal(form?.getFieldValue('myhl'));
    const ybhl = myUtil.text.getNumVal(form?.getFieldValue('ybhl'));
    if (cjhbzmDm == 'USD' && myhl != 0 && ybhl) {
      form.setFieldsValue({ myhl: myUtil.text.getNumVal(myUtil.text.formatNum(myhl, '0,0.00000')) });
      Func.eventOnBlur.myhl(param);
    }
  },
  // 跨境应税行为营业额（折人民币）
  ysfwyyermb: (param: any) => {
    const { form } = param;
    // 国际运输明细
    // 反算应税服务营业额（美元）字段项，规则为“应税服务营业额（人民币）/美元汇率*100”；
    Func.eventOnBlur.myhl(param);
    // 应税服务营业额（人民币）
    const ysfwyyermb = myUtil.text.getNumVal(form?.getFieldValue('ysfwyyermb'));
    // 征退税差额
    const ztsce = myUtil.text.getNumVal(form?.getFieldValue('ztsce'));
    // 反算征退税差额字段项，规则为“应税服务营业额（人民币）*征退税差额<=0则征退税差额设置为0”；
    const result = DditCktsFormCommonFunc.util.getMultiplyResult({
      param1: ysfwyyermb,
      param2: ztsce
    });
    if (result && result <= 0) {
      form.setFieldsValue({ ztsce: myUtil.text.getNumVal(myUtil.text.formatNum(ztsce, '0,0.00')) });
    }
    // 支付价款
    let ysfwyyezfgfsdnsrjk = myUtil.text.getNumVal(form?.getFieldValue('ysfwyyezfgfsdnsrjk'));
    if (!ysfwyyezfgfsdnsrjk) {
      ysfwyyezfgfsdnsrjk = 0;
    }
    // 反算计税金额，规则为“人民币营业额-支付价款”
    const result1 = DditCktsFormCommonFunc.util.getSubtractResult({
      param1: ysfwyyermb,
      param2: ysfwyyezfgfsdnsrjk
    });
    form.setFieldsValue({ ysfwyyemdtsjsje: myUtil.text.getNumVal(myUtil.text.formatNum(result1, '0,0.00')) });
    Func.eventOnBlur.ysfwyyemdtsjsje(param);
  },
  // 美元汇率
  myhl: (param: any) => {
    const { form } = param;
    // 国际运输明细
    // 应税服务营业额（人民币）
    const ysfwyyermb = myUtil.text.getNumVal(form?.getFieldValue('ysfwyyermb'));
    // 美元汇率
    const myhl = myUtil.text.getNumVal(form?.getFieldValue('myhl'));
    // 反算应税服务营业额（美元）字段项，规则为“应税服务营业额（人民币）/美元汇率*100”；
    const result = DditCktsFormCommonFunc.util.getComboResult2({
      param1: ysfwyyermb,
      param2: myhl
    });
    if (result || result === 0) {
      // 应税服务营业额（美元）
      form.setFieldsValue({ ysfwyyemy: myUtil.text.getNumVal(myUtil.text.formatNum(result, '0,0.00')) });
    }
  },
  // 跨境应税行为营业额免抵退税计税金额
  ysfwyyemdtsjsje: (param: any) => {
    const { form } = param;
    // 国际运输明细
    // 应税服务营业额（免抵退税计税金额）
    const ysfwyyemdtsjsje = myUtil.text.getNumVal(form?.getFieldValue('ysfwyyemdtsjsje'));
    // 退税率
    const tsl = myUtil.text.getNumVal(form?.getFieldValue('tsl'));
    // 反算应退税额字段项，规则为“应税服务营业额（免抵退税计税金额）*退税率/100”;
    let result = DditCktsFormCommonFunc.util.getComboResult1({
      param1: ysfwyyemdtsjsje,
      param2: tsl
    });
    if (result || result === 0) {
      // 应退税额
      form.setFieldsValue({ ytse1: myUtil.text.getNumVal(myUtil.text.formatNum(result, '0,0.00')) });
    }
    // 反算征退税差额字段项，规则为“计税金额*(征税率-退税率)/100”；
    let zssl = myUtil.text.getNumVal(form?.getFieldValue('zssl'));
    if (ysfwyyemdtsjsje && zssl && tsl) {
      // edit by yangzq start 禅道16598，退税率大于征税率时，征退税差额给0 即 zssl = tsl
      if (tsl > zssl) {
        zssl = tsl;
      }
      // end
      setZtsce({
        rmbAmt: ysfwyyemdtsjsje,
        zssl: zssl,
        tsl: tsl
      }, form);
    }
  },
  // 征税率
  zssl: (param: any) => {
    const { form } = param;
    // 国际运输明细
    // 反算征退税差额字段项，规则为“计税金额*(征税率-退税率)/100”；
    const gsyzfndjermb = myUtil.text.getNumVal(form?.getFieldValue('gsyzfndjermb'));
    const zssl = myUtil.text.getNumVal(form?.getFieldValue('zssl'));
    const tsl = myUtil.text.getNumVal(form?.getFieldValue('zssl'));
    setZtsce({
      rmbAmt: gsyzfndjermb,
      zssl: zssl,
      tsl: tsl,
    }, form);
  },
  // 退税率
  tsl: (param: any) => {
    Func.eventOnBlur.ysfwyyemdtsjsje(param);
  },
  // 原币代码
  hbhlDm: (param: any) => {
    DditCktsFormCommonFunc.eventOnBlur.hbhlDm(param);
  },
}

// 表单事件：OnFocus
Func.eventOnFocus = {
  // 原币代码
  hbhlDm: (param: any) => {
    Func.eventOnChange.kprq(param);
  },
}
// 表单事件：OnChange
Func.eventOnChange = {
  // 出口发票开具日期
  kprq: (param: any) => {
    const { form } = param;
    const url = '/yw/bszx/ggfw/sbcs/ywcsxx/queryHlxx';
    const kprq = form?.getFieldValue('kprq');
    DditCktsFormCommonFunc.util.loadCodeDmHbhlAutoComplete({
      form,
      url,
      key: 'url_gy_hbhl',
      codeViewKey: '01',
      ckrq: kprq ? moment(kprq).format('YYYY-MM-DD') : ''
    })
  },
  // 跨境应税行为代码
  ysfwDm: (param: any) => {
    const { form } = param;
		// 回调事件处理
		// 输入商品代码回显应税服务名称、征税率、退税率
    const ssq = form?.getFieldsValue().ssq;
    const kprq = form?.getFieldsValue().kprq;
    const ysfwDm = form?.getFieldsValue().ysfwDm;
		const ckspDm = ysfwDm;
    let ckrq1 = form?.getFieldsValue().ckrq1;
		if (!ckrq1) {
			ckrq1 = form?.getFieldsValue().kprq;
		}
		if (!ckspDm) {
			return;
		}
    getCmCode({ ckspDm: ysfwDm, ssq: ssq, ckrq1: kprq }).then((res: any) => {
      const { body } = res;
      if (res.code == '200') {
        if (!body) {
          message.error('此商品码不存在，请确认后填报！')
          setCkspxx(form, {});
          return;
        }
        // 免抵退 国际/港澳台运输明细、应税服务出口明细、应税服务进货明细
        setCkspxx(form, { ckspDm: body.ckspDm, sbhgspmc: body.ckspmc, tsl: body.tsl, zssl: body.zssljh });
      } else if(res.code == '900') {
        message.info(res.msg)
      } else {
        message.error(res.desc)
      }
    })
  },
  // 原币代码
  hbhlDm: (param: any) => {
    const {form} = param;
    const cjhbzmDm = form?.getFieldsValue().cjhbzmDm;
    if(!cjhbzmDm) {
      form.setFieldsValue({ybbiname: ''})
    }
  }
}

/**
 * @method setZtsce
 * @desc 计算：征退税差额，赋值表单
 * 征退税差额 = 人民币离岸价 * (征税率 - 退税率) / 100
 * @param paras { rmbAmt 人民币离岸价, zssl 征税率, tsl 退税率, isJbs 简并稅标识, ybAmt 原币离岸价, formId 目标表单 }
 */
const setZtsce = (paras: any, form: any) => {
  let rmbAmt = paras.rmbAmt;
  let zssl = paras.zssl;
  let tsl = paras.tsl;
  let isJbs = paras.isJbs;
  let ybAmt = paras.ybAmt;
  let ztsce: any = '';
  if (rmbAmt && zssl && tsl) {
    rmbAmt = myUtil.text.getNumVal(myUtil.text.formatNum(myUtil.text.getNumVal(rmbAmt), '0.00'));
    zssl = (myUtil.text.getNumVal(zssl));
    tsl = (myUtil.text.getNumVal(tsl));
    ztsce = myUtil.text.getNumVal(myUtil.text.formatNum(rmbAmt * 10000 * (zssl - tsl) / 100 / 10000, '0.00'));
    if (isJbs && ybAmt) { // 简并稅判断
      ybAmt = myUtil.text.getNumVal(ybAmt);
      if (ybAmt * ztsce <= 0) { // 若 原币离岸价 * 征退税差额 <= 0; 则 征退税差额 = 0
        ztsce = 0.00;
      }
    }
  }
  form.setFieldsValue({ ztsce: myUtil.text.getNumVal(myUtil.text.formatNum(ztsce, '0,0.00')) }); // 征退税差额
}

// 设置商品信息
const setCkspxx = (form: any, obj: any, eleName?: any) => {
  form.setFieldsValue({
    ysfwDm: obj.ckspDm || '',
    ysfwmc: obj.sbhgspmc || '',
    zssl: obj.zssl ? myUtil.text.getNumVal(myUtil.text.formatNum(obj.zssl, '0,0.00')) : '',
    tsl:  obj.tsl ? myUtil.text.getNumVal(myUtil.text.formatNum(obj.tsl, '0,0.00')) : ''
  });
}
export default Func;
