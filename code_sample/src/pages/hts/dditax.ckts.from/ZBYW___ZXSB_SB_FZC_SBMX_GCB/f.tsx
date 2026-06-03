/**
 * title: 出口非自产货物
 * author: wx
 */
 import React from 'react';
 import myUtil from '@/pages/common/myUtil';
 import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
 import { querySpdmXxCj, queryBgdByBgdNo21 } from '@/services/hts/api';
 import moment from 'moment';
 import { message } from 'antd';

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
    // 数量 // 进项数量＜＝出口数量
    sl02: (form: any) => {
      const validator =  (_rule: any, value: any) => {
        const cksl = form?.getFieldValue('cksl');
        if (value && cksl && myUtil.text.getNumVal(value) > myUtil.text.getNumVal(cksl)) {
          return Promise.reject(new Error('进项数量应小于等于出口数量，请确认后填报！'));
        }
        return Promise.resolve();
      };
      return { validator };
    },
    // 国内启运方式
    gnqyfsDm01: (form: any) => {
      const validator =  (_rule: any, value: any) => {
        // 业务代码
        const cktmsywlxdmjh = form?.getFieldValue('cktmsywlxdmjh');
        if (!value && cktmsywlxdmjh && cktmsywlxdmjh.indexOf('QYGTS') > -1) {
          // 业务类型为QYGTS时国内启运方式不能为空，请确认后填报！
          return Promise.reject(new Error('业务类型为QYGTS时国内启运方式不能为空，请确认后填报！'));
        }
        return Promise.resolve();
      };
      return { validator };
    },
    // 海关总署认证企业类型
    hgzsrzqylxDm01: (form: any) => {
      const validator =  (_rule: any, value: any) => {
        // 业务代码
        const cktmsywlxdmjh = form?.getFieldValue('cktmsywlxdmjh');
        if (!value && cktmsywlxdmjh && cktmsywlxdmjh.indexOf('QYGTS') > -1) {
          // 业务类型为QYGTS时海关总署认证企业类型不能为空，请确认后填报！
          return Promise.reject(new Error('业务类型为QYGTS时海关总署认证企业类型不能为空，请确认后填报！'));
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
    // 出口货物商品代码
    ckspDm: (param: any) => {
      const { form } = param;
      const ckspDm = form?.getFieldsValue().ckspDm;
      const cktmsywlxdmjh = form?.getFieldValue('cktmsywlxdmjh');
      if(ckspDm) {
        const ckbgdh = form?.getFieldsValue().ckbgdh;
        const kprq = form?.getFieldsValue().kprq;
        const ssq = form?.getFieldsValue().ssq;
        const dlckhwzmhm = form?.getFieldsValue().dlckhwzmhm;
        // 如果商品代码为空则直接清空商品名称
        if (!ckspDm) {
          setCkspxx(form, {});
          return;
        }
        const obj = {
          ckrq1: kprq?moment(kprq).format('YYYY-MM-DD'):'',
          ckspDm: ckspDm,
          ckbgdh: ckbgdh,
          slType: 'Y',
          ssq: ssq,
          dlckhwzmhm: dlckhwzmhm,
          ywlx: cktmsywlxdmjh,
        }
        querySpdmXxCjFun(obj, form);
      }
    },
    // 数量
    sl: (param: any) => {
      const {form} = param;
      // 出口非自产货物
      const ckspDm = form?.getFieldsValue().ckspDm;
      const ssq = form?.getFieldsValue().ssq;
			if (!ckspDm || !ssq) {
				return;
      }
      const cldezs = form?.getFieldsValue().cldezs;
      const cjdlzs = form?.getFieldsValue().cjdlzs;
			if (!cldezs && !cjdlzs) {
				return;
			}
			aspcjclJsse(form);
    },
    // 消费税税率
    zssl: (param: any) => {
      const {form} = param;
      // 出口非自产货物
      const ckspDm = form?.getFieldsValue().ckspDm;
      const ssq = form?.getFieldsValue().ssq;
			if (!ckspDm || !ssq) {
				return;
      }
      const cldezs = form?.getFieldsValue().cldezs;
      const cjdlzs = form?.getFieldsValue().cjdlzs;
			if (!cldezs && !cjdlzs) {
				return;
			}
			aspcjclJsse(form);
    },
    // 计税金额
    jsje: (param: any) => {
      const {form} = param;
      // 出口非自产货物
      const ckspDm = form?.getFieldsValue().ckspDm;
      const ssq = form?.getFieldsValue().ssq;
			if (!ckspDm || !ssq) {
				return;
      }
      const cldezs = form?.getFieldsValue().cldezs;
      const cjdlzs = form?.getFieldsValue().cjdlzs;
			if (!cldezs && !cjdlzs) {
				return;
			}
			aspcjclJsse(form);
    },
    // 征税税额
    se: (param: any) => {
      const {form} = param;
      let se = form?.getFieldsValue().se;
			if (se) {
        form.setFieldsValue({ xfstse: myUtil.text.getNumVal(myUtil.text.formatNum(se, '0,0.00')) });
			}
    },
  }

  // 表单事件：OnFocus
  Func.eventOnFocus = {
  }
  // 表单事件：OnChange
  Func.eventOnChange = {
    ckbgdh: (param: any) => {
      // 该报关单号当期出口明细中不存在
      const { form } = param;
      const ckbgdh = form?.getFieldsValue().ckbgdh
      if(ckbgdh && ckbgdh.length === 21){
        // 走后台接口 (出口日期没有赋值 不确定是否有问题)
        queryBgdByBgdNo21({ckbgdh}).then((res: any) => {
          const {body, code} = res;
          const ssq = form?.getFieldsValue().ssq;
          const dlckhwzmhm = form?.getFieldsValue().dlckhwzmhm;
          const cktmsywlxdmjh = form?.getFieldsValue().cktmsywlxdmjh;
          if(body && code === '200'){
            const cksl = body?.cksl;
            if (cksl) {
              form.setFieldsValue({ cksl: Number(cksl) });
            }
            if (body?.ckspDm) {
              form.setFieldsValue({ ckspDm: body.ckspDm });
              const obj = {
                ckrq1: body.ckrq1?moment(body.ckrq1).format('YYYY-MM-DD'):'',
                ckspDm: body.ckspDm ? body.ckspDm : '',
                ckbgdh: ckbgdh,
                slType: 'Y',
                ssq: ssq,
                dlckhwzmhm: dlckhwzmhm,
                ywlx: cktmsywlxdmjh,
              }
              querySpdmXxCjFun(obj, form)
            }
          }
        })
      }
    },
    // 凭证种类
    cktmspzlxDm03: (param: any) => {},
    // 退（免）税业务类型
    cktmsywlxdmjh: (param: any) => {
      // 选择 QYGTS  国内启运方式 和 海关总署认证企业类型 必录
      const {form} = param;
      const lableSpan01: any = document.querySelector("#zbyw_zxsb_sb_fzc_sbmx_gcb_form .dditem_label_gnqyfsDm span");
      const lableSpan02: any = document.querySelector("#zbyw_zxsb_sb_fzc_sbmx_gcb_form .dditem_label_hgzsrzqylxDm span");
      const cktmsywlxdmjh = form?.getFieldValue('cktmsywlxdmjh');
      if(cktmsywlxdmjh && cktmsywlxdmjh.indexOf('QYGTS') > -1) {
        lableSpan01.classList.add('required');
        lableSpan02.classList.add('required');
      } else {
        lableSpan01.classList.remove('required');
        lableSpan02.classList.remove('required');
      }
    },
    // 国内启运方式
    gnqyfsDm: (param: any) => {},
    // 海关总署认证企业类型
    hgzsrzqylxDm: (param: any) => {},
  }

  // 设置商品信息
  const setCkspxx = (form: any, obj: any, eleName?: any) => {
    form.setFieldsValue({
      ckspDm: obj.sbspDm || '',
      sbhgspmc: obj.sbhgspmc || '',
    });
  }

  // 改变调整前的商品名称 代码 出口日期 退税率
  const querySpdmXxCjFun = (obj: {}, form: any) => {
    querySpdmXxCj(obj).then((res: any) => {
      const { code, body, msg, desc } = res;
      if (code == '200' && body) {
        const ckspDm = body.ckspDm ? body.ckspDm : "";
        const ssq = form.getFieldsValue().ssq;
        const cldezs = body.cldezs;
        const cjdlzs = body.cjdlzs;
        // 电局只赋值了 		ckspDm，ckspmc，hgjldwmc   cldezs 和 cjdlzs没有赋值 可能有问题
        form.setFieldsValue({
          ckspDm,
          sbhgspmc: body.sbhgspmc ? body.sbhgspmc : '',
          hgjldwmc: body.hgjldwmc ? body.hgjldwmc : '',
          // cldezs,
          // cjdlzs,
        });
        if (!ckspDm || !ssq) {
          return;
        }
        if (!cldezs && !cjdlzs) {
          return;
        }
        // 重新计算 jsje
        aspcjclJsse(form);        
      } else {
        form.setFieldsValue({
          ckspDm: '',
          sbhgspmc: '',
          hgjldwmc: '',
          cldezs: '',
          cjdlzs: '',
        });
        message.info(msg || desc)
      }
    })
  }

  	/**
	 * @method tsl
	 * @desc 按商品从价/从量计算税额
	 */
	function aspcjclJsse(form: any) {
    const cldezs = form?.getFieldsValue().cldezs; // 商品从价
    const cjdlzs = form?.getFieldsValue().cjdlzs; // 商品从量
    const sl = form?.getFieldsValue().sl; // 数量
    const jsje = form?.getFieldsValue().jsje; // 计税金额
    const zssl = form?.getFieldsValue().zssl; // 消费税税率
		if (cldezs == '0' && cjdlzs != '0' && jsje != '') {
			//	(从价)
      const xfsSe = DditCktsFormCommonFunc.util.getMultiplyResult({
        param1: zssl,
        param2: jsje
      });
      form.setFieldsValue({ se: myUtil.text.getNumVal(myUtil.text.formatNum(xfsSe, '0,0.00')) }); // 征税税额
      form.setFieldsValue({ xfstse: myUtil.text.getNumVal(myUtil.text.formatNum(xfsSe, '0,0.00')) }); // 申报消费税退税额
		} else if (cldezs != '0' && cjdlzs == '0' && zssl != '' && sl != '') {
      // (从量)
      const xfsSe = DditCktsFormCommonFunc.util.getMultiplyResult({
        param1: zssl,
        param2: sl
      });
      form.setFieldsValue({ se: myUtil.text.getNumVal(myUtil.text.formatNum(xfsSe, '0,0.00')) }); // 征税税额
      form.setFieldsValue({ xfstse: myUtil.text.getNumVal(myUtil.text.formatNum(xfsSe, '0,0.00')) }); // 申报消费税退税额
		} else if (cldezs != '0' && cjdlzs != '0' && jsje != '' && zssl != '' && myUtil.text.getNumVal(zssl) == myUtil.text.getNumVal(cjdlzs)) {
      //	(从价)
      const xfsSe = DditCktsFormCommonFunc.util.getMultiplyResult({
        param1: zssl,
        param2: jsje
      });
      form.setFieldsValue({ se: myUtil.text.getNumVal(myUtil.text.formatNum(xfsSe, '0,0.00')) }); // 征税税额
      form.setFieldsValue({ xfstse: myUtil.text.getNumVal(myUtil.text.formatNum(xfsSe, '0,0.00')) }); // 申报消费税退税额
		} else if (cldezs != '0' && cjdlzs != '0' && sl != '' && zssl != '' && myUtil.text.getNumVal(zssl) == myUtil.text.getNumVal(cldezs)) {
      //	(从量)
      const xfsSe = DditCktsFormCommonFunc.util.getMultiplyResult({
        param1: zssl,
        param2: sl
      });
      form.setFieldsValue({ se: myUtil.text.getNumVal(myUtil.text.formatNum(xfsSe, '0,0.00')) }); // 征税税额
      form.setFieldsValue({ xfstse: myUtil.text.getNumVal(myUtil.text.formatNum(xfsSe, '0,0.00')) }); // 申报消费税退税额
		}
	}
 
 export default Func;