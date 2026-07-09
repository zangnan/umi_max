/**
 * title: 跨境应税行为免退税申报明细
 * author: wx
 */
import React from 'react';
import myUtil from '@/components/DDAssist/util';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { message } from 'antd';
import { queryFpWzxx } from '@/pages/hts/services/htsApi';
import { getCmCode } from '@/pages/hts/services/htsApi';
import getStaticTableCode from '@/pages/hts/commonModule/staticTableCode';
import moment from 'moment';

const Func: any = {
  refUnit: React.createRef(),
};

// 新建表单初始化
Func.initAddForm = (param: any) => {
  DditCktsFormCommonFunc.initAddForm(param);
  const {formItems, setFormItems} = param;
  const lableSpan1: any = document.querySelector("#mts_zxsb_sb_mts_ysfwck_gcb_form .dditem_label_hzcjyyDm span");
  if (lableSpan1) {
    debugger;
    lableSpan1.classList.remove('required');
  }
  const tmpMyItems: any = [];
  formItems.map((item: any) => {
    if (item.name === 'hzcjyyDm') {
      item.disabled = true;
    }
    tmpMyItems.push(item);
  });
  setFormItems([...tmpMyItems]);
}

Func.initEditForm = (param: any) => {
  const {form, formItems, setFormItems, handleModalVisible} = param;
  handleModalVisible(true);
  const cktmsywlxdmjh = form?.getFieldValue('cktmsywlxdmjh');
  const isCjyyBz = cktmsywlxdmjh && cktmsywlxdmjh.indexOf('HZCJ') > -1 ? true : false;
  const lableSpan1: any = document.querySelector("#mts_zxsb_sb_mts_ysfwck_gcb_form .dditem_label_hzcjyyDm span");
  if (isCjyyBz) {
    lableSpan1.classList.add('required');
  } else {
    lableSpan1.classList.remove('required');
  }
  const tmpMyItems: any = [];
  formItems.map((item: any) => {
    if (item.name === 'hzcjyyDm') {
      if (isCjyyBz) {
        item.disabled = false;
      } else {
        item.disabled = true;
      }
    }
    tmpMyItems.push(item);
  });
  setFormItems([...tmpMyItems]);
}

// 表单校验
Func.validator = {
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
  cktszmbh02: (form: any) => {
    const validator = async (_rule: any, value: any) => {
      const ysfwDm = form?.getFieldValue('ysfwDm');
			if (ysfwDm != '9903010400') {
        if (!value) {
          return Promise.reject(new Error('该项内容为必填项，不能为空！'));
        }
			}
      return Promise.resolve();
    };
    return { validator };
  },
  // 退税率
  tsl01: (form: any) => {
    const validator =  (_rule: any, value: any) => {
			// 退税率不能大于征税率
      const tsl = form?.getFieldValue('tsl');
      const zssl = form?.getFieldValue('zssl');
			// 免退税零税率，退税率与征税率会保证相同
			if (zssl) {
        form.setFieldsValue({
          tsl: myUtil.text.getNumVal(myUtil.text.formatNum(zssl, 0)),
        });
			}
			if (zssl && tsl && myUtil.text.getNumVal(tsl) > myUtil.text.getNumVal(zssl)) {
        return Promise.reject(new Error('退税率不能大于征税率，请确认后填报！'));
			}
      return Promise.resolve();
    };
    return { validator };
  },
  hzcjyyDm: (form: any) => {
    const cktmsywlxdmjh = form?.getFieldValue('cktmsywlxdmjh');
    const validator = async (_rule: any, value: any) => {
      if (cktmsywlxdmjh && cktmsywlxdmjh.length > 0) {
        if (cktmsywlxdmjh.indexOf('HZCJ') > -1 ) {
          if (!value) {
            return Promise.reject(new Error('业务类型包含“HZCJ”时，红字冲减原因不能为空'));
          }
          return Promise.resolve();
        } else {
          if (value) {
            return Promise.reject(new Error('业务类型不包括“HZCJ”时，红字冲减原因须为空'));
          }
          return Promise.resolve();
        }
      }
      return Promise.resolve();
    };
    return { validator };
  }
}
// 表单事件：OnBlur
Func.eventOnBlur = {
  // 申报批次
  sbpc: (param: any) => {
    // 申报批次自动补零
    DditCktsFormCommonFunc.eventOnBlur.sbpc(param);
  },
  // 申报序号
  sbxh: (param: any) => {
    // 申报序号自动补零
    DditCktsFormCommonFunc.eventOnBlur.sbxh(param);
  },
  // 美元汇率
  myhl: (param: any) => {
    const { form } = param;
		const htzjermb = setHtzjeRmbAmt(param);
    form.setFieldsValue({ htzjermb:  myUtil.text.getNumVal(myUtil.text.formatNum(htzjermb, '0,0.00')) });
  },
  // 进货凭证号
  jhpzh: (param: any) => {
    const { form } = param;
    // 进货凭证号/已使用过设备凭证号
    let jhpzh;
    jhpzh = form?.getFieldsValue().jhpzh; // 美元离岸价
    // 发票代码10位
    let fpDm;
    // 发票号码8位
    let fphm;
    if (jhpzh && jhpzh.length == 18) {
      fpDm = jhpzh.substring(0, 10);
      fphm = jhpzh.substring(10, 18);
    } else if (jhpzh && jhpzh.length == 20) {
      // edit by yangzq 20211103 数电票改造
      fpDm = '';
      fphm = jhpzh;
    }
    // edit by yangzq 20211103 数电票改造
    if ((fpDm && fphm && fpDm.length == 10 && fphm.length == 8) || (fphm && fphm.length == 20)) {
      queryFpWzxx({
        fpDm: fpDm,
        fphm: fphm
      }).then((res: any) => {
        const { body } = res;
        if (res.code == '200') {
          // 开票日期
          const kprq = body.kprq;
          // 供方纳税人识别号（销货方）
          const xfnsrsbh = body.xfnsrsbh;
          if (xfnsrsbh) {
            form.setFieldsValue({ ghfnsrsbh1: xfnsrsbh });
          }
          if (body.jsje != null) {
            form.setFieldsValue({ jsje: myUtil.text.getNumVal(myUtil.text.formatNum(body.jsje, '0,0.00')) }); // 计税金额
          }
          if (kprq) {
            form.setFieldsValue({ kprq: kprq ? moment(new Date(kprq)) : ''  });
          }
        } else if(res.code == '900') {
          message.info(res.msg)
        } else {
          message.error(res.desc)
        }
      })
    }
    Func.eventOnBlur.tsl(param);
  },
  // 计税金额
  jsje: async (param: any) => {
    const { form, myItems, setMyItems } = param;
    // 应税服务出口明细
    const jsje = form?.getFieldsValue().jsje; // 计税金额
    const tsl = form?.getFieldsValue().tsl; // 退税率
    // 退税额
    const resultTemp = DditCktsFormCommonFunc.util.getMultiplyResult({
      param1: jsje,
      param2: tsl
    });
    if (resultTemp) {
      const zzstse = DditCktsFormCommonFunc.util.getDivideResult({
        param1: resultTemp,
        param2: 100
      });
      if (zzstse) {
        form.setFieldsValue({ zzstse: myUtil.text.getNumVal(myUtil.text.formatNum(zzstse, '0,0.00')) });
      }
    }
    const tmpCktmsywlxdmjh = form?.getFieldsValue().cktmsywlxdmjh;
    const cktmsywlxdmjh = tmpCktmsywlxdmjh?.length > 0 ? tmpCktmsywlxdmjh.filter(item => item != 'HZCJ')  : [];
    if (jsje && jsje < 0) {
      cktmsywlxdmjh.push('HZCJ');
    }
    let codeData = await myUtil.code.getCodeFromServerT1('code_dm_ckts_cktmsywlx:05');
    const cktmsywlxmcjhVal = [];
    cktmsywlxdmjh.map(item => {
      codeData.map(item1 => {
        if (item === item1.code) {
          cktmsywlxmcjhVal.push(item1.name);
        }
      })
    });
    const cktmsywlxmcjh = cktmsywlxmcjhVal.length > 0 ? cktmsywlxmcjhVal.join(','): '';
    const lableSpan1: any = document.querySelector("#mts_zxsb_sb_mts_ysfwck_gcb_form .dditem_label_hzcjyyDm span");
    const tmpMyItems: any = [];
    if (cktmsywlxdmjh.indexOf('HZCJ') > -1) {
      lableSpan1.classList.add('required');
      myItems.map((item: any) => {
        if (item.name === 'hzcjyyDm') {
          item.disabled = false;
        }
        tmpMyItems.push(item);
      });
    } else {
      lableSpan1.classList.remove('required');
      myItems.map((item: any) => {
        if (item.name === 'hzcjyyDm') {
          item.disabled = true;
        }
        tmpMyItems.push(item);
      });
      form.setFieldsValue({
        hzcjyyDm: null,
      });
    }
    setMyItems([...tmpMyItems]);
    // const 
    form.setFieldsValue({
      cktmsywlxdmjh: cktmsywlxdmjh,
      cktmsywlxmcjh: cktmsywlxmcjh,
    });
  },
  // 退税率
  tsl: (param: any) => {
    const { form } = param;
    // 应税服务出口明细
    const jsje = form?.getFieldsValue().jsje; // 计税金额
    const tsl = form?.getFieldsValue().tsl; // 退税率
    // 退税额
    const resultTemp = DditCktsFormCommonFunc.util.getMultiplyResult({
      param1: jsje,
      param2: tsl
    });
    if (resultTemp) {
      const zzstse = DditCktsFormCommonFunc.util.getDivideResult({
        param1: resultTemp,
        param2: 100
      });
      if (zzstse) {
        form.setFieldsValue({ zzstse: myUtil.text.getNumVal(myUtil.text.formatNum(zzstse, '0,0.00')) });
      }
    }
  },
  // 征税率
  zssl: (param: any) => {
    const { form } = param;
    // 失去焦点时，如果发现征税率比退税率小，那么让退税率随征税率变化
    const zssl = form?.getFieldsValue().zssl;
    form.setFieldsValue({ tsl: myUtil.text.getNumVal(myUtil.text.formatNum(zssl, '0,0.0000')) });
    // 在退税率变化的同时计算申报增值税退税额
    const jsje = form?.getFieldsValue().jsje;
    // 退税率
    const tsl = form?.getFieldsValue().tsl;
    // 退税额
    const resultTemp = DditCktsFormCommonFunc.util.getMultiplyResult({
      param1: jsje,
      param2: tsl
    });
    if (resultTemp) {
      const zzstse = DditCktsFormCommonFunc.util.getDivideResult({
        param1: resultTemp,
        param2: 100
      });
      if (zzstse) {
        form.setFieldsValue({ zzstse: myUtil.text.getNumVal(myUtil.text.formatNum(zzstse, '0,0.00')) });
      }
    }
  },
}
// 表单事件：OnFocus
Func.eventOnFocus = {
}
// 表单事件：OnChange
Func.eventOnChange = {
  // 原币币别代码
  ysfwDm: async (param: any) => {
    const { form,myItems, setMyItems } = param;
		// 输入商品代码回显应税服务名称、征税率、退税率
    const ysfwDm = form?.getFieldsValue().ysfwDm;
    const ssq = form?.getFieldsValue().ssq;
    const kprq = form?.getFieldsValue().kprq;

    let cktmsywlxdmjhVal = '';
    const ysfwDmJh = getStaticTableCode('code_static_mts_ysfwck_ysfw_dm_cktmsywlxdmjh', '01').body;
    for (let a = 0; a < ysfwDmJh.length; a++) {
      let tempObj = ysfwDmJh[a];
      if (ysfwDm == tempObj.code) {
        cktmsywlxdmjhVal = tempObj.name;
        break;
      }
    }
    let codeData = await myUtil.code.getCodeFromServerT1('code_dm_ckts_cktmsywlx:05');
    const cktmsywlxdmjh = [];
    const cktmsywlxmcjh = [];
    let ysfwmc = '';
    if (cktmsywlxdmjhVal != '') {
      cktmsywlxdmjh.push(cktmsywlxdmjhVal);
      ysfwmc = codeData.find(item => item.code === cktmsywlxdmjhVal)?.name;
      cktmsywlxmcjh.push(ysfwmc);
    }
    const tmpCktmsywlxdmjh = form?.getFieldsValue().cktmsywlxdmjh;
    if (tmpCktmsywlxdmjh && tmpCktmsywlxdmjh.includes('HZCJ')) {
      cktmsywlxdmjh.push('HZCJ');
      cktmsywlxmcjh.push('红字冲减');
    }
    const cktmsywlxmcjhVal = cktmsywlxmcjh?.length > 0 ?cktmsywlxmcjh.join(',') : '';
    const lableSpan1: any = document.querySelector("#mts_zxsb_sb_mts_ysfwck_gcb_form .dditem_label_hzcjyyDm span");
    const tmpMyItems: any = [];
    if (cktmsywlxdmjh.indexOf('HZCJ') > -1) {
      lableSpan1.classList.add('required');
      myItems.map((item: any) => {
        if (item.name === 'hzcjyyDm') {
          item.disabled = false;
        }
        tmpMyItems.push(item);
      });
    } else {
      lableSpan1.classList.remove('required');
      myItems.map((item: any) => {
        if (item.name === 'hzcjyyDm') {
          item.disabled = true;
        }
        tmpMyItems.push(item);
      });
      form.setFieldsValue({
        hzcjyyDm: null,
      });
    }
    setMyItems([...tmpMyItems]);
    form.setFieldsValue({
      cktmsywlxdmjh: cktmsywlxdmjh,
      cktmsywlxmcjh: cktmsywlxmcjhVal,
      ysfwmc: ysfwmc,
    });
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
  // 同总金额（折美元）
  htzjemy: (param: any) => {
    const { form } = param;
		const htzjermb = setHtzjeRmbAmt(param);
    form.setFieldsValue({ htzjermb:  myUtil.text.getNumVal(myUtil.text.formatNum(htzjermb, '0,0.00')) });
  },

  // 境外单位所在国家或地区
  gjhdqDm: (param: any) => {
    // 原系统无内容
  },
  // 跨境应税行为类型代码
  cktmsywlxdmjh: (param: any) => {
    // 原系统无内容
  },
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

/**
 * @author tianjx
 * @method setHtzjeRmbAmt
 * @desc 计算：外贸跨境应税行为申报明细的合同总金额（人民币）
 * @param params { htzjemy 合同总金额（美元）, myhl 美元汇率, format: format }
 * @returns 返回精确两位小数的千分位
 */
const setHtzjeRmbAmt = (params: any) => {
  const { form } = params;
  const myhl = myUtil.text.getNumVal(form?.getFieldValue('myhl')); // 税率
  const htzjemy = myUtil.text.getNumVal(form?.getFieldValue('htzjemy')); // 金额
  let htzjermb;
  if (myhl && htzjemy) {
    htzjermb = myUtil.text.formatNum((Number(myhl) * Number(htzjemy) / 100), '0,0.00');
  }
  return htzjermb;
}
export default Func;
