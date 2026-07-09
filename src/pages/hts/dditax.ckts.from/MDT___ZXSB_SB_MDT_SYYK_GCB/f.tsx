/**
 * title: 跨境应税行为收讫营业款明细清单
 * author: wx
 */
import React from 'react';
import myUtil from '@/components/DDAssist/util';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { querySjByHth, queryHlxx } from '@/pages/hts/services/htsApi';
import { message } from 'antd';
import moment from 'moment';

const Func: any = {
  refUnit: React.createRef(),
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
  Func.eventOnChange.gjhdqDm(params);
  params.unitKey = unitKey;

  const hbzmDm = form?.getFieldValue('hbzmDm'); // 原币代码
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
  // 收款凭证总金额（折美元）
  skpzzjemy01: (form: any) => {
    // 原系统无对应代码
    const validator =  (_rule: any, value: any) => {
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
  // 合同号
  hth: (param: any) => {
    const { form }= param;
    // 根据合同号带出数据
    const hth = form?.getFieldValue('hth');
    const ssq = form?.getFieldValue('ssq');
    if (hth && ssq) {
      querySjByHth({ hth: hth, ssq: ssq }).then((res) => {
        const { body, code, msg } = res;
        if (code == '200') {
          if (body) {
            const data = res.body;
            // JWDWMC境外单位名称
            const jwdwmc = data.jwdwmc;
            if (jwdwmc) { // jwdwmc --> fkdwmc bug 8233 跨境免抵退收营业款，合同号回车，原币汇率，美元汇率、本期收取营业款付款单位名称未自动带出
              form.setFieldsValue({ fkdwmc: jwdwmc });
            }
            // 本期收取营业款付款银行名称	FKYHMC
            const fkyhmc = data.fkyhmc;
            if (fkyhmc) {
              form.setFieldsValue({ fkyhmc: fkyhmc });
            }
            // 本期收取营业款收款银行名称	SKYHMC
            const skyhmc = data.skyhmc;
            if (skyhmc) {
              form.setFieldsValue({ skyhmc: skyhmc });
            }
            // 本期收取营业款付款单位名称	FKDWMC
            const fkdwmc = data.fkdwmc;
            if (fkdwmc) {
              form.setFieldsValue({ fkdwmc: fkdwmc });
            }
            // GJHDQSZ_DM所在国家代码
            const gjhdqszDm = data.gjhdqszDm;
            if (gjhdqszDm) {
              form.setFieldsValue({ gjhdqszDm: gjhdqszDm });
              // 单位所在国家
              const gbname = myUtil.code.getCodeValByKey(gjhdqszDm, 'code_dm_gy_gjhdq:01');
              if (gbname) {
                form.setFieldsValue({ gbname: gbname });
              }
            }
            // SRYBZM_DM收入原币代码
            const hbzmDm = data.srybzmDm;
            if (hbzmDm) {
              form.setFieldsValue({ hbzmDm: hbzmDm });
              // 原币币别 SRBINAME
              const option = myUtil.code.getCode('url_gy_hbhl:01');
              const tempRows = option.filter((row: any) => {
                return (row.hbzmDm === hbzmDm);
              });
              const biname = tempRows[0].hbmc;
              if (biname) {
                form.setFieldsValue({ biname: biname });
              }
  
              const hlresult: any = getCodeDmGyHbhl01({
                hbzmDm: hbzmDm,
                ssq: ssq
              });
              if (hlresult) {
                if (hlresult.rmbhl) {
                  form.setFieldsValue({ ybhl: hlresult.rmbhl });
                } else {
                  form.setFieldsValue({ ybhl: '0.00000' });
                }
                if (hlresult.myhl) {
                  form.setFieldsValue({ myhl: hlresult.myhl });
                } else {
                  form.setFieldsValue({ myhl: '0.00000' });
                }
              }
            }
          }
        } else {
          message.info(msg);
        }
      });
    }
  },
  // 原币收款额
  cjzj: (param: any) => {
    DditCktsFormCommonFunc.util.setMdtSyykgtjs(param, 'sk');
    DditCktsFormCommonFunc.util.setMdtSyykgtjs(param, 'sk-rmb');
  },
  // 原币汇率
  ybhl: (param: any) => {
    DditCktsFormCommonFunc.util.setMdtSyykgtjs(param, 'sk');
    DditCktsFormCommonFunc.util.setMdtSyykgtjs(param, 'sk-rmb');
  },
  // 本期收取营业款收款金额（折人民币）
  skjermb: (param: any) => {
    DditCktsFormCommonFunc.util.setMdtSyykgtjs(param, 'sk-rmb');
  },
  // 美元汇率
  myhl: (param: any) => {
    DditCktsFormCommonFunc.util.setMdtSyykgtjs(param, 'sk-rmb');
  },
  // 原币代码
  hbhlDm: (param: any) => {
    DditCktsFormCommonFunc.eventOnBlur.hbhlDm(param);
  },
}
// 表单事件：OnFocus
Func.eventOnFocus = {
  // 清算币种
  hbhlDm: (param: any) => {
    Func.eventOnChange.skrq(param);
  },
}
// 表单事件：OnChange
Func.eventOnChange = {
  // 本期收取营业款收款时间
  skrq: (param: any) => {
    const { form } = param;
    const url = '/yw/bszx/ggfw/sbcs/ywcsxx/queryHlxx';
    const skrq = form?.getFieldValue('skrq');
    DditCktsFormCommonFunc.util.loadCodeDmHbhlAutoComplete({
      form,
      url,
      key: 'url_gy_hbhl',
      codeViewKey: '01',
      ckrq: skrq ? moment(form?.getFieldValue('skrq')).format('YYYY-MM-DD') : ''
    })
  },
  // 本期收取营业款付款单位所在国家（地区）
  gjhdqDm: (param: any) => {
    const { form }= param;
    const gjhdqszDm = form?.getFieldsValue().gjhdqszDm;
    const gbname = myUtil.code.getCodeValByKey(gjhdqszDm, 'code_dm_gy_gjhdq:01')
    form.setFieldsValue({ gbname: gbname });
  },
}

/**
 * @author liwc
 * @method setVal
 * @desc 带出表单其他项（针对getCodeDmGyHbhl01反写）
 * @param {String} formId 表单ID
 * @param {Object} data 表单数据
 */
 const getCodeDmGyHbhl01 = (data: any) => {
  if (data && data.hbzmDm) {
    const params = {
      // searchModel: {
      //   hbzmDm: data.hbzmDm,
      //   ssq: data.ssq,
      //   ckrq: data.ckrq1,
      //   hlny: data.hlny
      // }
      searchModel: [
        { property: "hbzmDm", value: data.hbzmDm, op: "al" },
        { property: "ssq", value: data.ssq, op: "al" },
        { property: "ckrq", value: data.ckrq1, op: "al" },
        { property: "hlny", value: data.hlny, op: "al" },
      ],
    };
    let result;
    queryHlxx(params).then((res) => {
      const { body, code, msg } = res;
      if (code == '200' && body.rows && body.rows.length > 0) {
        result = res.body.rows[0];
      } else {
        message.info(res.msg);
      }
    })
    return result;
  } else {
    return null;
  }
}

export default Func;