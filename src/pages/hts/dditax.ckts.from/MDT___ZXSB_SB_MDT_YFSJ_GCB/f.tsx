/**
 * title: 跨境应税行为免抵退税申报明细表
 * author: wx
 */
import React from 'react';
import myUtil from '@/components/DDAssist/util';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { querySjByHth, queryHlxx } from '@/pages/hts/services/htsApi';
import { getCmCode } from '@/pages/hts/services/htsApi';
import { message } from 'antd';
import getStaticTableCode from '@/pages/hts/commonModule/staticTableCode';
import moment from 'moment';
import DDAlert from '@/pages/hts/commonModule/DDAlert';

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
  DDAlert.open({
    title: '系统提示',
    info: '注意：如果修改【所属期】相同关联号对应的出口明细和进货明细将会一并修改！',
    infoType: 'question',
    modalType: 'confirm',
    okCallbackFn: function () {
      DDAlert.close();
      handleModalVisible(true);
      Func.eventOnChange.ysfwDm(params, 'edit');
      Func.eventOnChange.gjhdqDm(params);
      params.unitKey = unitKey;

      const srybzmDm = form?.getFieldValue('srybzmDm'); // 收入原币代码
      params.value = srybzmDm;
      params.item = { name: 'srybzmDm' };
      Func.eventOnBlur.hbhlDm(params);
      const skybzmDm = form?.getFieldValue('skybzmDm'); // 收款原币代码
      params.value = skybzmDm;
      params.item = { name: 'skybzmDm' };
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
  // 有关证明编号
  cktszmbh01: (form: any) => {
    const validator = async (_rule: any, value: any) => {
      const cktmsywlxdmjh = form?.getFieldValue('cktmsywlxdmjh');
      if (cktmsywlxdmjh != 'HTNYGLFW') {

        if (!value) {
          return Promise.reject(new Error('除选择HTNYGLFW之外，选择其他业务类型必填！'));
        }
        return Promise.resolve();
      }
      return Promise.resolve();
    }
    return { validator };
  },
  // 值为空赋0
  setZero: (form: any) => {
    return DditCktsFormCommonFunc.validator.setZero(form);
  },
  // 退税率
  tsl01: (form: any) => {
    const validator =  (_rule: any, value: any) => {
			// 退税率不能大于征税率
      const tsl = form?.getFieldValue('tsl');
      const zssl = form?.getFieldValue('zssl');
			if (zssl && tsl && myUtil.text.getNumVal(tsl) > myUtil.text.getNumVal(zssl)) {
        return Promise.reject(new Error('退税率不能大于征税率，请确认后填报！'));
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
  // 合同号
  hth: (param: any) => {
    const { form }= param;
    // 根据合同号带出数据
    const hth = form?.getFieldValue('hth');
    const ssq = myUtil.text.getNumVal(form?.getFieldValue('ssq'));
    if (hth && ssq) {
      querySjByHth({ hth: hth, ssq: ssq }).then((res) => {
        const { body, code, msg } = res;
        if (code == '200') {
          if (body) {
            const data = res.body;
            // JWDWMC境外单位名称
            const jwdwmc = data.jwdwmc;
            if (jwdwmc) {
              form.setFieldsValue({ jwdwmc: jwdwmc });
            }
            // HTZJERMB人民币总金额
            const htzjermb = data.htzjermb;
            if (htzjermb) {
              form.setFieldsValue({ htzjermb: myUtil.text.getNumVal(myUtil.text.formatNum(htzjermb, '0,0.00')) });
            }
            // HTZJEMY美元总金额
            const htzjemy = data.htzjemy;
            if (htzjemy) {
              form.setFieldsValue({ htzjemy: myUtil.text.getNumVal(myUtil.text.formatNum(htzjemy, '0,0.00')) });
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
            // edit by yangzq 2021/04/07 禅道 9379
            // 跨境应税行为业务类型
            const cktmsywlxdmjh = data.cktmsywlxdmjh;
            if (cktmsywlxdmjh) {
              form.setFieldsValue({ cktmsywlxdmjh: cktmsywlxdmjh });
            }
            // 跨境应税行为业务类型名称
            const cktmsywlxmcjh = data.cktmsywlxmcjh;
            if (cktmsywlxmcjh) {
              form.setFieldsValue({ cktmsywlxmcjh: cktmsywlxmcjh });
            }
            // edit  end
            // 出口发票日期
            let kprq = data.kprq;
            if (kprq) {
              if (kprq?.constructor === String) {
                kprq = moment(new Date(Number(kprq)));
              } else {
                kprq = moment(new Date(kprq));
              }
              form.setFieldsValue({ kprq: kprq });
            }
            // YSFW_DM跨境销售服务及无形资产代码
            const ysfwDm = data.ysfwDm;
            if (ysfwDm) {
              form.setFieldsValue({ ysfwDm: ysfwDm });
            }
            // YSFWMC应税服务名称
            const ysfwmc = data.ysfwmc;
            if (ysfwmc) {
              form.setFieldsValue({ ysfwmc: ysfwmc });
            }
            // SRYBZM_DM收入原币代码
            const srybzmDm = data.srybzmDm;
            if (srybzmDm) {
              form.setFieldsValue({ srybzmDm: srybzmDm });
              // 原币币别 SRBINAME 根据币种带出名称
              const option = myUtil.code.getCode('url_gy_hbhl:01');
              let newVal: any = '';
              const tempRows = option.filter((row: any) => {
                return (row.hbzmDm === srybzmDm);
              })
              newVal = tempRows[0].hbmc;
              if (newVal) {
                form.setFieldsValue({ srbiname: newVal });
              }
              // 带出汇率信息
              const hlresult: any = getCodeDmGyHbhl01({
                hbzmDm: srybzmDm,
                ssq: ssq
              });
              if (hlresult) {
                if (hlresult.rmbhl) {
                  form.setFieldsValue({ srybhl: hlresult.rmbhl });
                } else {
                  form.setFieldsValue({ srybhl: '0.00000' });
                }
                if (hlresult.myhl) {
                  form.setFieldsValue({ srmyhl: hlresult.myhl });
                } else {
                  form.setFieldsValue({ srmyhl: '0.00000' });
                }
              }
            }
            // zssl 征税税率
            const zssl = data.zssl;
            if (zssl || zssl === 0) {
              form.setFieldsValue({ zssl: myUtil.text.getNumVal(myUtil.text.formatNum(zssl, '0,0.00')) });
            }

            // tsl 退税率
            const tsl = data.tsl;
            if (tsl || tsl === 0) {
              form.setFieldsValue({ tsl: myUtil.text.getNumVal(myUtil.text.formatNum(tsl, '0,0.00')) });
            }
            DditCktsFormCommonFunc.util.setMdtYfsjgtjs(param, 'sr');
            DditCktsFormCommonFunc.util.setMdtYfsjgtjs(param, 'sr-rmb');
            DditCktsFormCommonFunc.util.setMdtYfsjgtjs(param, 'sk');
            DditCktsFormCommonFunc.util.setMdtYfsjgtjs(param, 'sk-rmb');
          }
        } else {
          message.info(msg);
        }
      });
    }
  },
  // 收入原币金额
  srybje: (param: any) => {
    DditCktsFormCommonFunc.util.setMdtYfsjgtjs(param, 'sr');
    DditCktsFormCommonFunc.util.setMdtYfsjgtjs(param, 'sr-rmb');
  },
  // 收入原币汇率
  srybhl: (param: any) => {
    DditCktsFormCommonFunc.util.setMdtYfsjgtjs(param, 'sr');
    DditCktsFormCommonFunc.util.setMdtYfsjgtjs(param, 'sr-rmb');
  },
  // 本期确认跨境应税行为营业收入人民币金额
  bqqrysfwyysrrmbje: (param: any) => {
    DditCktsFormCommonFunc.util.setMdtYfsjgtjs(param, 'sr-rmb');
  },
  // 收入美元汇率
  srmyhl: (param: any) => {
    DditCktsFormCommonFunc.util.setMdtYfsjgtjs(param, 'sr-rmb');
  },
  // 收款原币金额
  skybje: (param: any) => {
    DditCktsFormCommonFunc.util.setMdtYfsjgtjs(param, 'sk');
    DditCktsFormCommonFunc.util.setMdtYfsjgtjs(param, 'sk-rmb');
  },
  // 收款原币汇率
  cjhbhl: (param: any) => {
    DditCktsFormCommonFunc.util.setMdtYfsjgtjs(param, 'sk');
    DditCktsFormCommonFunc.util.setMdtYfsjgtjs(param, 'sk-rmb');
  },
  // 跨境应税行为营业额（折人民币）
  ysfwyyermb: (param: any) => {
    DditCktsFormCommonFunc.util.setMdtYfsjgtjs(param, 'sk-rmb');
  },
  // 收款美元汇率
  myhl: (param: any) => {
    DditCktsFormCommonFunc.util.setMdtYfsjgtjs(param, 'sk-rmb');
  },
  // 跨境应税行为营业额免抵退税计税金额
  ysfwyyemdtsjsje: (param: any) => {
    DditCktsFormCommonFunc.util.setMdtYfsjgtjs(param, 'js');
  },
  // 征税率
  zssl: (param: any) => {
    // 原系统无对应代码
  },
  // 退税率
  tsl: (param: any) => {
    const { form }= param;
    // 计税金额
    const ysfwyyemdtsjsje = myUtil.text.getNumVal(form?.getFieldValue('ysfwyyemdtsjsje'));
    // 退税率
    const tsl = myUtil.text.getNumVal(form?.getFieldValue('tsl'));
    // 退税额
    const resultTemp = DditCktsFormCommonFunc.util.getMultiplyResult({
      param1: ysfwyyemdtsjsje,
      param2: tsl
    });
    if (resultTemp) {
      const zzstse = DditCktsFormCommonFunc.util.getDivideResult({
        param1: resultTemp,
        param2: 100
      });
      if (zzstse) {
        form.setFieldsValue({ ytse1: myUtil.text.getNumVal(myUtil.text.formatNum(zzstse, '0,0.00')) });
      }
    }
  },
  // 收入原币代码srybzmDm  收款原币代码skybzmDm
  hbhlDm: (param: any) => {
    DditCktsFormCommonFunc.eventOnBlur.hbhlDm(param);
  },
}
// 表单事件：OnFocus
Func.eventOnFocus = {
  // 清算币种
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
      ckrq: kprq ? moment(form?.getFieldValue('kprq')).format('YYYY-MM-DD') : ''
    })
  },
  // 跨境应税行为代码
  ysfwDm: async (param: any, eleName: any) => {
    const { form } = param;
		// 输入商品代码回显应税服务名称、征税率、退税率
    const ysfwDm = form?.getFieldsValue().ysfwDm;
    const ssq = form?.getFieldsValue().ssq;
    const kprq = form?.getFieldsValue().kprq;

    let cktmsywlxdmjh = '';
    const ysfwDmJh = getStaticTableCode('code_static_mts_ysfwck_ysfw_dm_cktmsywlxdmjh', '01').body;
    for (let a = 0; a < ysfwDmJh.length; a++) {
      let tempObj = ysfwDmJh[a];
      if (ysfwDm == tempObj.code) {
        cktmsywlxdmjh = tempObj.name;
        break;
      }
    }
    // 设置业务类型代码和名称 联动操作
    if (cktmsywlxdmjh != '') {
      // 设置必录标识
      const lableSpan: any = document.querySelector("#mdt_zxsb_sb_mdt_yfsj_gcb_form .dditem_label_cktszmbh span");
      if(cktmsywlxdmjh != 'HTNYGLFW') {
        lableSpan.classList.add('required');
      } else {
        lableSpan.classList.remove('required');
      }

      let codes;
      let names;
      let codeData = await myUtil.code.getCodeFromServerT1('code_dm_ckts_cktmsywlx:05');
      for (let b = 0; b < codeData.length; b++) {
        let tempObj = codeData[b];
        if (cktmsywlxdmjh == tempObj.code) {
          codes = tempObj.code;
          names = tempObj.name;
          form.setFieldsValue({
            cktmsywlxdmjh: codes,
            cktmsywlxmcjh: names,
          });
          break;
        }
      }
    } else {
      if(eleName != 'edit') {
        form.setFieldsValue({
          cktmsywlxdmjh: '',
          cktmsywlxmcjh: '',
        });
      }
    }

		// 回调事件处理
		// 输入商品代码回显应税服务名称、征税率、退税率
		const ckspDm = ysfwDm;
    let ckrq1 = form?.getFieldsValue().ckrq1;
		if (!ckrq1) {
			ckrq1 = form?.getFieldsValue().kprq;
		}
		if (!ckspDm) {
			return;
    }
    if(eleName != 'edit') {
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
    }
  },
  // 境外单位所在国家或地区
  gjhdqDm: (param: any) => {
    const { form }= param;
    const gjhdqszDm = form?.getFieldsValue().gjhdqszDm;
    const gbname = myUtil.code.getCodeValByKey(gjhdqszDm, 'code_dm_gy_gjhdq:01')
    form.setFieldsValue({ gbname: gbname });
  },
  // 收款原币金额
  skybje: (param: any) => {
    DditCktsFormCommonFunc.util.setMdtYfsjgtjs(param, 'sk');
    DditCktsFormCommonFunc.util.setMdtYfsjgtjs(param, 'sk-rmb');
  },
  // 跨境应税行为营业额（折人民币）
  ysfwyyermb: (param: any) => {
    DditCktsFormCommonFunc.util.setMdtYfsjgtjs(param, 'sk-rmb');
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
// 设置商品信息
const setCkspxx = (form: any, obj: any, eleName?: any) => {
  form.setFieldsValue({
    ysfwDm: obj.ckspDm ? obj.ckspDm : '',
    ysfwmc: obj.sbhgspmc ? obj.sbhgspmc : '',
    zssl: obj.zssl ? myUtil.text.getNumVal(myUtil.text.formatNum(obj.zssl, '0,0.00')) : '',
    tsl:  obj.tsl ? myUtil.text.getNumVal(myUtil.text.formatNum(obj.tsl, '0,0.00')) : '',
  });
}

Func.columnsRender = {
  // 跨境应税行为业务类型
  formaterDmCktsYfsjfw01: (param: any) => {
    const html2 = <span>{param.record.cktmsywlxmcjh}</span>;
    return html2;
  },
}
export default Func;
