/**
 * title: 外贸企业出口退税进货明细申报表
 * author: wx
 */
import React from 'react';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { queryCkxxByGlh, queryGlhBySsqAndSbpc, queryFpWzxx, queryXfsxxByJhpzh } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';
import { message } from 'antd';
import { getCmCode } from '@/pages/hts/services/htsApi';
import moment from 'moment';
import { history } from 'umi';
import { intl as intl2 } from '@/components/DDAssist/util';
import {queryCjCsh, queryCjGlh } from '@/pages/hts/services/htsApi';

const Func: any = {
  refUnit: React.createRef(),
};

Func.tszbcs =(param: any) =>{
  const {otherRef} = param;
  otherRef[1].current?.showModal(param);
}
// 编辑表单初始化
Func.initEditForm = async (param: any) => {
  const { form, myFormItems, setMyFormItems, handleModalVisible } = param;
  const obj = {
    ssq: form?.getFieldValue('ssq'),
    sbpc: form?.getFieldValue('sbpc'),
  }
  queryGlhBySsqAndSbpcFunc(param, obj, 'edit');
  const params: any = {
    form: form,
    myItems: myFormItems,
    setMyItems: setMyFormItems,
    flag: 'edit'
  }
  handleModalVisible(true);
  if (history.location.pathname.indexOf('SBMXCX') == -1 && history.location.pathname.indexOf('/27/2705') == -1
  && history.location.pathname.indexOf('/26/2605') == -1 && history.location.pathname.indexOf('/25/2505') == -1
  ) {
    Func.eventOnChange.sz(params);
  }
};

// 新建表单初始化
Func.initAddForm = (param: any) => {
  param.doSuccess = (res: any) => {
    queryGlhBySsqAndSbpcFunc(param, res?.body, 'add');
  };
  DditCktsFormCommonFunc.initAddForm(param);
};

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
  // 关联号
  glh01: (form: any) => {
    // 请求后端验证所属期是否已申报
    const validator = async (_rule: any, value: any) => {
      return Promise.resolve();
    };
    return { validator };
  },
  // 关联号
  glh02: (form: any) => {
    const uuid = form?.getFieldValue('uuid');
    const ssq = form?.getFieldValue('ssq');
    const sbpc = form?.getFieldValue('sbpc');
    // 请求后端验证所属期是否已申报
    const validator = async (_rule: any, value: any) => {
      const params = {
        uuid: uuid,
        ssq,
        sbpc,
        glh: value,
      }
      if (history.location.pathname.indexOf('SBMXCX') == -1 && history.location.pathname.indexOf('/27/2705') == -1
      && history.location.pathname.indexOf('/26/2605') == -1 && history.location.pathname.indexOf('/25/2505') == -1) {
        await queryCkxxByGlh(params).then((res) => {
          if (res.code != '200') {
            return Promise.reject(new Error(res.msg));
          }
          return Promise.resolve();
        }).catch((err) => {
          return Promise.reject(err);
        });
      }
      return Promise.resolve();
    };
    return { validator };
  },
  // 税种
  sz01: (form: any) => {
    return DditCktsFormCommonFunc.validator.sz01(form);
  },
  // 进货凭证号
  jhpzh03: (form: any) => {
    return DditCktsFormCommonFunc.validator.jhpzh03(form);
  },
  // 供货方纳税人识别号
  ghgnsrsbh01: (form: any) => {
    const validator =  (_rule: any, value: any) => {
      const ghgnsrsbh = form?.getFieldValue('ghgnsrsbh');
			if (ghgnsrsbh && ghgnsrsbh.length <= 15) {
        return Promise.reject(new Error('该项数值必须大于或等于15位，请确认后填报！'));
			}
      return Promise.resolve();
    };
    return { validator };
  },
  // 供货方纳税人识别号
  ghgnsrsbh02: (form: any) => {
    const validator =  (_rule: any, value: any) => {
			// 凭证种类为02增值税专用发票06消费税专用缴款书07分割单时，供货方税号必录
      const cktmspzlxDm = form?.getFieldValue('cktmspzlxDm');
			// let bz = myUtil.getNameVal(item, 'bz');
			if ((cktmspzlxDm == '02' || cktmspzlxDm == '06' || cktmspzlxDm == '07') && !value) {
        return Promise.reject(new Error('凭证种类为02,06,07时，供货方纳税号必录，请确认后填报！'));
			}
      return Promise.resolve();
    };
    return { validator };
  },
  // 退税率
  tsl01: (form: any) => {
    const validator =  (_rule: any, value: any) => {
			// 进货明细，消费税时，退税率与征税率会保证相同
      const sz = form?.getFieldValue('sz');
      const zssl = form?.getFieldValue('zssl');
			if (sz == 'C' && zssl) {
        form.setFieldsValue({
          tsl: myUtil.text.getNumVal(myUtil.text.formatNum(zssl, '0,0.0000')),
        });
			}
			// 1. 退税率不能大于征税率
      const tsl = form?.getFieldValue('tsl');
			if (zssl && tsl && (tsl > zssl)) {
        return Promise.reject(new Error('退税率不能大于征税率，请确认后填报！'));
			}
      return Promise.resolve();
    };
    return { validator };
  },
  ggslqzfw01: (form: any) => {
    return DditCktsFormCommonFunc.validator.ggslqzfw01(form);
  },
}
// 表单事件：OnBlur
Func.eventOnBlur = {
  // 申报年月
  ssq: (param: any) => {
    const {form} = param;
    const obj = {
      ssq: form?.getFieldValue('ssq'),
      sbpc: form?.getFieldValue('sbpc'),
    }
    queryGlhBySsqAndSbpcFunc(param, obj, 'blur');
    if(form?.getFieldValue('glh')){
      Func.eventOnChange.glh(param);
    }
  },
  // 申报批次
  sbpc: (param: any) => {
    DditCktsFormCommonFunc.eventOnBlur.sbpc(param);
    const {form} = param;
    const obj = {
      ssq: form?.getFieldValue('ssq'),
      sbpc: form?.getFieldValue('sbpc'),
    }
    queryGlhBySsqAndSbpcFunc(param, obj, 'blur');
    if(form?.getFieldValue('glh')){
      Func.eventOnChange.glh(param);
    }
  },
  // 申报序号
  sbxh: (param: any) => {
    // 申报序号自动补零
    DditCktsFormCommonFunc.eventOnBlur.sbxh(param);
  },
  // 关联号
  glh: (param: any) => {
    // 申报序号自动补零
    const { event, form } = param;
    const inputValue = event.target.value;
    form.setFieldsValue({
      sbxh: myUtil.text.leadingZeroize(inputValue, 8),
    });
  },
  // 出口商品代码
  ckspDm: (param: any) => {
    const { form } = param;
		// 通用的商品码回显逻辑
    const ckspDm = form?.getFieldValue('ckspDm');
    if(ckspDm) {
      handleCkspxxEvent(form);
    }
  },
}
// 表单事件：OnFocus
Func.eventOnFocus = {
}

// 表单事件：OnChange
Func.eventOnChange = {
  // 关联号
  glh: (param: any) => {
    param.slgx = true;
		queryMtsTssbByGlh(param);
  },
  // 退税率
  tsl: (param: any) => {
		queryMtsTssbByGlh(param);
  },
  cktmspzlxDm01: (param: any) => {
    const { form } = param;
    const cktmspzlxDm = form?.getFieldValue('cktmspzlxDm');
    const lableSpan1: any = document.querySelector("#mts_zxsb_sb_mts_tsjh_gcb_form .dditem_label_ghfnsrsbh1 span");
    if (cktmspzlxDm == '02' || cktmspzlxDm == '06' || cktmspzlxDm == '07') {
      lableSpan1?.classList.add('required');
    } else {
      lableSpan1?.classList.remove('required');
    }
  },
  // 税种
  sz: async (param: any) => {
    const { form, myItems, setMyItems, flag } = param;
    const sz = form?.getFieldValue('sz');
    const cktmspzlxDm = form?.getFieldValue('cktmspzlxDm');
    const lableSpan1: any = document.querySelector("#mts_zxsb_sb_mts_tsjh_gcb_form .dditem_label_jhpzh span");
    const lableSpan2: any = document.querySelector("#mts_zxsb_sb_mts_tsjh_gcb_form .dditem_label_tsl span");
    const lableSpan3: any = document.querySelector("#mts_zxsb_sb_mts_tsjh_gcb_form .dditem_label_ghfnsrsbh1 span");
    if (sz && sz.toUpperCase() == 'C') {
      lableSpan1?.classList.add('required');
      myItems[18].disabled = true;
      lableSpan2?.classList.remove('required');
    } else {
      lableSpan1?.classList.add('required');
      myItems[18].disabled = false;
      lableSpan2?.classList.add('required');
    }
    // 影响凭证类型选择项
    if (sz) {
      param.slgx = true; // 税率更新
      if (param.flag != 'edit') {
        queryMtsTssbByGlh(param);
      }
      // 原系统loadCodeDmCktsCktmspzlxAutoComplete方法
		  let viewKey = '01';
      if (sz == 'V') {
        viewKey = '02';
      } else {
        viewKey = '03';
      }
      // 凭证类型重新获取码表
      const option = await myUtil.code.getCodeFromServerT1('code_dm_ckts_cktmspzlx', viewKey);
      let list :any[] = [];
      if (option && option.length > 0) {
        option.forEach((item: any) => {
          list.push({
            value: item['code'],
            name: item['name'],
          });
        })
      }
      myItems[8].list = list;
      if(flag != 'edit') {
        if (sz == 'V') {
          form.setFieldsValue({ cktmspzlxDm: '02' });
          // lableSpan3?.classList.add('required');
        } else {
          form.setFieldsValue({ cktmspzlxDm: '05' });
          // lableSpan3?.classList.remove('required');
        }
      }
      Func.setXfsxxBySzOrJhpzh(form, flag);
    }
    if (cktmspzlxDm == '02' || cktmspzlxDm == '06' || cktmspzlxDm == '07') {
      lableSpan3?.classList.add('required');
    } else {
      lableSpan3?.classList.remove('required');
    }
    setMyItems([...myItems]);
  },
  // 进货凭证号
  jhpzh: (param: any) => {
		queryFpxxByMtsTsjhJhpzh(param);
  },
  // 开票日期
  kprq: (param: any) => {
    param.slgx = true;
		queryMtsTssbByGlh(param);
  },
  // 税率
  sl: (param: any) => {
		queryMtsTssbByGlh(param);
  },
  // 计税金额
  jsje: (param: any) => {
		queryMtsTssbByGlh(param);
  },
  // 征税率（%）
  zssl: (param: any) => {
		queryMtsTssbByGlh(param);
  },

}

/**
 * @author jiangyg
 * @method handleCkspxxEvent
 * @desc 通用的商品码回显
 */
 const handleCkspxxEvent = (form: any) => {
  const ckspDm = form.getFieldValue('ckspDm');
  const ssq = form.getFieldValue('ssq');
  const ckrq1 = form.getFieldValue('ckrq1');
  // 如果商品代码为空则直接清空商品名称和计量单位
  if (!ckspDm) {
    setCkspxx(form, {});
    return;
  }
  const param = { ckspDm, ssq, ckrq1 };
  getCmCode(param).then((response) => {
    const { code, body, desc, msg } = response;
    if (code === '200') {
      if (body) {
        setCkspxx(form, {
          ckspDm: body.ckspDm,
          ckspmc: body.ckspmc,
          hgjldwmc: body.hgjldwmc,
        });
      } else {
        message.info('此商品码不存在，请确认后填报');
        setCkspxx(form, {});
      }
    } else if (code !== '200' && desc.trim()) {
      message.error(msg);
      return;
    }
  })
}
// 设置商品信息
const setCkspxx = (form: any, obj: any, eleName?: any) => {
  form.setFieldsValue({
    ckspDm: obj.ckspDm || '',
    ckspmc: obj.ckspmc || '',
    hgjldwmc: obj.hgjldwmc || '',
  });
}

// 设置商品信息
const queryGlhBySsqAndSbpcFunc = (param: any, param02: any, flag?:any) => {
  const { form, refUnit, myFormItems, myItems, setMyFormItems, setMyItems } = param;
  queryGlhBySsqAndSbpc({
    ssq: param02.ssq,
    sbpc: param02.sbpc,
  }).then((response) => {
    const { code, body } = response;
    refUnit?.current?.setMasker(false);
    if (code === '200') {
      form.setFieldsValue(body);
      let dataarr = [];
      for (let i = 0; i < body.length; i++) {
        const obj = {
          value: body[i],
          name: body[i]
        };
        dataarr.push(obj);
      }
      if (myItems && myItems.length > 0 || myFormItems && myFormItems.length > 0) {
        if(flag == 'blur') {
          myItems[5].list = dataarr;
          myItems[5].showType = '2';
          setMyItems([...myItems])
        } else {
          myFormItems[5].list = dataarr;
          myFormItems[5].showType = '2';
          if(flag === 'add') {
            const lableSpan1: any = document.querySelector("#mts_zxsb_sb_mts_tsjh_gcb_form .dditem_label_ghfnsrsbh1 span");
            lableSpan1?.classList.add('required');
          }
          setMyFormItems([...myFormItems])
        }
      }
    }
  });
}

/**
 * @author liwc
 * @method queryFpxxByMtsTsjhJhpzhm
 * @desc 计算：给根据进货明细进货凭证号查询发票信息
 * @param param
 */
 const queryFpxxByMtsTsjhJhpzh = (param: any) => {
  const { form, flag } = param;
  if (!form) {
    return;
  }
  // 进货凭证号/已使用过设备凭证号
  let jhpzh;
  jhpzh = form.getFieldValue('jhpzh');
  const sz = form.getFieldValue('sz');
  if (sz == 'C') {
    Func.setXfsxxBySzOrJhpzh(form, flag);
  } else {
    // 发票代码10位
    let fpDm;
    // 发票号码8位
    let fphm;
    if (jhpzh && jhpzh.length === 18) {
      fpDm = jhpzh.substring(0, 10);
      fphm = jhpzh.substring(10, 18);
    } else if (jhpzh && jhpzh.length == 20) {
      // edit by yangzq 20211103 数电票改造
      fpDm = '';
      fphm = jhpzh;
    }
    if (jhpzh.length === 18 || jhpzh.length === 20) {
      queryFpWzxx({ fpDm, fphm }).then((response) => {
        const { code, body } = response;
        if (code === '200' && body) {
          // 开票日期
          const kprq = body.kprq;
          // 供方纳税人识别号（销货方）
          const xfnsrsbh = body.xfnsrsbh;
          if (xfnsrsbh) {
            form.setFieldsValue({
              ghfnsrsbh1: xfnsrsbh || '',
            });
          }
          if (body.jsje) {
            form.setFieldsValue({
              jsje: body.jsje || '',  // 计税金额
            });
          }
          if (kprq) {
            form.setFieldsValue({
              kprq: kprq ? moment(new Date(kprq)) : '',
            });
            // 进货明细表需带出税率
            // 根据关联号、税种、开票日期，带出出口信息
            // param.slgx = true; // 税率更新
            queryMtsTssbByGlh({
              form,
              slgx: true, // 税率更新
            });
          }
          // 行号
          form.setFieldsValue({
            hh: '',
          });
        }
      })
    }
  }
};

/**
 * 根据关联号获取出口信息
 */
 const queryMtsTssbByGlh = (param: any) => {
  const form = param.form;
  const glh = form.getFieldValue('glh');
  if (!glh) {
    // 出口进货明细表合并时，进货明细表没有自己的关联号，取出口明细关联号
    // glh = myUtil.getFormItemVal('mts_zxsb_sb_mts_tsckjh_tssb_form', 'glh');
  }
  const sz = form.getFieldValue('sz');
  const ssq = form.getFieldValue('ssq');
  if (!ssq) {
    // 出口进货明细表合并时，进货明细表没有自己的申报年月，取出口明细申报年月
    // ssq = myUtil.getFormItemVal('mts_zxsb_sb_mts_tsckjh_tssb_form', 'ssq');
  }
  const sbpc = form.getFieldValue('sbpc');
  if (!sbpc) {
    // 出口进货明细表合并时，进货明细表没有自己的申报批次，取出口明细申报批次
    // sbpc = myUtil.getFormItemVal('mts_zxsb_sb_mts_tsckjh_tssb_form', 'sbpc');
  }
  if (glh) {
    let params = {
      ssq: ssq, // 所属期
      sbpc: sbpc, // 申报批次
      glh: glh,
      sz: sz,
      kprq: form.getFieldValue('kprq'),
    };
    queryCkxxByGlh(params).then((response) => {
      const { code, body } = response;
      if (code === '200' && body) {
        let ckxx = body;
        // 根据查出的结果带出出口信息
        // 商品代码
        const ckspDm = ckxx.ckspDm;
        if (ckspDm) {
          form.setFieldsValue({
            ckspDm,
          });
        }
        // 商品名称
        const sbhgspmc = ckxx.sbhgspmc;
        if (sbhgspmc) {
          form.setFieldsValue({
            sbhgspmc,
          });
        }
        // 计量单位
        const hgjldwmc = ckxx.hgjldwmc;
        if (hgjldwmc) {
          form.setFieldsValue({
            hgjldwmc,
          });
        }
        // 数量
        const cksl = ckxx.cksl;
        const sl = form.getFieldValue('sl');
        if (cksl && !sl) {
          form.setFieldsValue({
            sl: cksl,
          });
        }
        // 业务类型代码
        const cktmsywlxdmjh = ckxx.cktmsywlxdmjh;
        if (cktmsywlxdmjh) {
          form.setFieldsValue({
            cktmsywlxdmjh,
          });
        }
        // 业务类型名称
        const cktmsywlxmcjh = ckxx.cktmsywlxmcjh;
        if (cktmsywlxmcjh) {
          form.setFieldsValue({
            cktmsywlxmcjh,
          });
        }
        // 赋值formId
        ckxx.form = form;
        // 判断汇率是否重新带出
        ckxx.slgx = param.slgx;
        // 设置税率、退税率、征税额、退税额
        setMtsTsjhgtjs(ckxx);
      }
    });
  }
};

/**
 * @author liwc
 * @method setMtsTsjhgtjs
 * @desc 计算：免退税 进货明细表 计算
 * @param param
 */
const setMtsTsjhgtjs = (param: any) => {
  const form = param.form;
  const unitKey = form?.otherParam?.unitKey;
  // 税种
  let sz = form.getFieldValue('sz');
  // 英文自动转大写
  if (sz) {
    sz = sz.toUpperCase();
  }
  if (sz === 'V') {
    setMtsTsjhgtjs01({
      formId: unitKey,
      zsslbase: param.zssl, // 征税率基准
      tslbase: param.tsl, // 退税率基准
      jsbase: form.getFieldValue('jsje'), // 计算基数
      slbc: 1,
      slgx: param.slgx // 税率更新标志
    }, param);
  } else if (sz === 'C') {
    // 消费税情况，不考虑征税率，退税率值，分为双重征税和单重征税
    // 从量定额征税
    let cldezs = param.cldezs;
    // 从价定率征税
    let cjdlzs = param.cjdlzs;
    // 税率基数
    let zsslbase;
    // 计算基数
    let jsbase;
    // 税率补偿倍数（默认1，用来调节双重征税是否除以100的问题）
    let slbc = 100;
    // 1.双重征税计算。
    let zssl = form.getFieldValue('zssl');
    form.setFieldsValue({
      tsl: zssl,
    });
    if (cldezs != 0 && cldezs && cjdlzs != 0 && cjdlzs) {
      if (zssl === cldezs) {
        jsbase = form.getFieldValue('sl');
        zsslbase = zssl;
      } else if (zssl === cjdlzs) {
        jsbase = form.getFieldValue('jsje');
        zsslbase = zssl;
      }
    } else {
      // 2.单重征税需要赋值带出值并自动计算。
      if (cldezs != 0 && cldezs) {
        zsslbase = cldezs;
        jsbase = form.getFieldValue('sl');
      } else if (cjdlzs != 0 && cjdlzs) {
        zsslbase = cjdlzs;
        jsbase = form.getFieldValue('jsje');
      }
      // 判断征退税率是否需要赋值
      if (zssl == undefined || zssl == 0) {
        form.setFieldsValue({
          zssl: zsslbase,
          tsl: zsslbase,
        });
      }
    }
    if (zsslbase && jsbase) {
      setMtsTsjhgtjs01({
        formId: unitKey,
        zsslbase: zsslbase, // 征税率基准
        tslbase: zsslbase, // 退税率基准
        jsbase: jsbase, // 计算基数
        slbc: slbc, // 税率补偿数（消费税，代表一块钱收多少税，不需要除以100，则在此做税率补偿）
        slgx: param.slgx // 税率更新标志
      }, param);
    }
  }
};

/**
 * @author liwc
 * @method setMtsTsjhgtjs01
 * @desc 计算：免退税 进货明细表 计算 (根据指定金额amt为基数进行计算)
 * @param paras
 */
const setMtsTsjhgtjs01 = (obj: any, param: any) => {
  let form = param.form;
  // 征税税额
  let zsse = 0;
  // 应退税额
  let tse = 0;
  // 重算的征税税率
  let zssl_new = obj.zsslbase;
  // 重算的退税率
  let tsl_new = obj.tslbase;
  // 计算基数
  let jsbase = obj.jsbase;
  // 税率补偿倍数（默认1，用来调节双重征税是否除以100的问题）
  let slbc = obj.slbc == undefined ? 1 : obj.slbc;
  let zssl = 0;
  let tsl = 0;
  if (obj.slgx) { // 税率更新标志
    zssl = zssl_new;
    if ((zssl || zssl === 0) && obj.slgx) {
      form.setFieldsValue({
        zssl,
      });
    }
    tsl = tsl_new;
    if ((tsl || tsl === 0) && obj.slgx) {
      form.setFieldsValue({
        tsl,
      });
    }
  } else {
    zssl = form.getFieldValue('zssl');
    tsl = form.getFieldValue('tsl');
  }
  if (jsbase) {
    zsse = DditCktsFormCommonFunc.util.setPurchaseTax({
			ghje: jsbase, // 计算基数
			ghzssl: zssl * slbc // 征税税率 * 税率补偿倍数
		});
    if (zsse || zsse === 0) {
      form.setFieldsValue({
        zsse,
      });
    }
    tse = DditCktsFormCommonFunc.util.setPurchaseTax({
			ghje: jsbase, // 计算基数
			ghzssl: tsl * slbc // 退税率 * 税率补偿倍数
		});
    if (tse || tse === 0) {
      form.setFieldsValue({
        tse:myUtil.text.getNumVal(myUtil.text.formatNum(tse, '0,0.00'))
      });
    }
  }
};

// 配置项：自定义工具栏 关联号重排
Func.glhcp = (param: any) => {
  DditCktsFormCommonFunc.glhcp(param);
}

// 配置项：自定义工具栏 生成进货明细
Func.jhmx = (param: any) => {
  DditCktsFormCommonFunc.jhmx(param);
}


// 不予办理转证明采集
Func.byblzzmcj = (param:any) => {
  const { selectionRowKeys, selectionRows, refUnit,otherRef } = param;
  if (selectionRowKeys?.length === 0 || selectionRowKeys?.length === 0) {
    const gridData = refUnit.current?.getGridData();
    if (!gridData || gridData.length <= 0) {
      message.info(intl2.formatMessage({ id: 'message_common_nodata_export' }));
      return;
    }
    const gridParams = refUnit.current?.getGridParams();

    const model: any = [];
    gridParams.searchModel.forEach((item: any, index: number) => {
      model.push(item);
    });
    gridParams.initSearchModal.forEach((item: any, index: number) => {
      model.push(item);
    });
    Func.check(gridData,refUnit,otherRef);
  } else {
    Func.check(selectionRows,refUnit,otherRef);
  }

}

Func.check=(selectionRows:any,refUnit:any,otherRef:any)=>{
  const ckrqNd = myUtil.grid.formatDate(selectionRows[0].ckrq1 , 'YYYY-MM-DD').substr(0,4);
    let i = 0;
    let flag = false;
    selectionRows.forEach((item: any) => {
      if (!myUtil.grid.formatDate(item.ckrq1 , 'YYYY-MM-DD').startsWith(ckrqNd)) {
        i++;
      }
      if (item.byblbz != 'Y') {
        flag = true;
      }
    });
    if (i > 0) {
      // 校验对应报关单的出口日期是否在同一年度
      message.error("选择数据对应的出口日期不在同一年度，请重新选择。");
      return;
    }
    else if (flag) {
      // 校验不为不予办理
      message.error("仅对不予办理的数据支持该操作，请重新选择。");
      return;
    } else {
      queryCjCsh({tableKey: "MTS_ZXSB_SB_MTS_TSSB_G"}).then((response) => {
        const { code, body } = response;
        refUnit.current!.setMasker(false);
        if (code === '200') {
          const obj = {
            sbpc: body.sbpc,
            ssq: body.ssq,
          }
          queryCjGlh(obj).then((res: any)=>{
            if(res.code === '200') {
              const para = body;
              para.glh = res.body.glh
              otherRef[2].current!.showModal(para,selectionRows,"MDT",refUnit);
            }
          })
        }
      })
    }
}

/**
 *
 * @param form
 * @param sz
 * @param flag
 */
Func.setXfsxxBySzOrJhpzh = (form: any, flag: any) => {
  // 如果选择消费税
  const sz = form?.getFieldValue('sz');
  const jhpzh = form?.getFieldValue('jhpzh');
  if (sz == 'C' && jhpzh && jhpzh.length === 14) {
    queryXfsxxByJhpzh({jhpzh: jhpzh}).then((response) => {
      const {code, body, msg} = response;
      if (code === '200' && body) {
        if (body?.jkdwrnsrsbh) {
          form?.setFieldsValue({ghfnsrsbh1: body?.jkdwrnsrsbh});
        }
        if (body?.tfrq) {
          form?.setFieldsValue({kprq: moment(body?.tfrq)});
        }
      } else {
        message.error(msg);
      }
    });
  }
}

export default Func;
