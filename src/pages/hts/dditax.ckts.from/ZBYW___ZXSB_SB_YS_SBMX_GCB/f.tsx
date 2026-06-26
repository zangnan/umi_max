/**
 * title: 出口已使用设备
 * author: wx
 */
 import React from 'react';
import myUtil from '@/components/DDAssist/util';
 import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { queryBgdByBgdNo21, queryFpWzxx, querySpdmXxCj } from '@/pages/hts/services/htsApi';
 import { message } from 'antd';
 import moment from 'moment';
 
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
  // 已提累计折旧
  ytljzje01: (form: any) => {
    const validator =  (_rule: any, value: any) => {
			// 已提累计折旧应小于等于设备原值
      let sbyz = form?.getFieldValue('sbyz');
      let ytljzje = form?.getFieldValue('ytljzje');
			if (sbyz && ytljzje) {
				sbyz = myUtil.text.getNumVal(sbyz);
				ytljzje = myUtil.text.getNumVal(ytljzje);
				if (ytljzje > sbyz) {
          return Promise.reject(new Error('已提累计折旧应小于等于设备原值，请确认后填报！'));
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
  // 出口货物商品代码
  ckspDm: (param: any) => {
    const { form } = param;
    const ckspDm = form?.getFieldsValue().ckspDm;
    if(ckspDm) {
      const ckbgdh = form?.getFieldsValue().ckbgdh;
      const ckrq1 = form?.getFieldsValue().ckrq1;
      const ssq = form?.getFieldsValue().ssq;
      const dlckhwzmhm = form?.getFieldsValue().dlckhwzmhm;
      // 如果商品代码为空则直接清空商品名称
      if (!ckspDm) {
        setCkspxx(form, {});
        return;
      }
      const obj = {
        ckrq1: ckrq1?moment(ckrq1).format('YYYY-MM-DD'):'',
        ckspDm: ckspDm,
        ckbgdh: ckbgdh,
        slType: 'Y',
        ssq: ssq,
        dlckhwzmhm: dlckhwzmhm,
      }
      querySpdmXxCjFun(obj, form);
    }
  },
  // 退税率
  tsl: (param: any) => {
    const {form} = param;
    // 计算 申报退税额 (tse = jsje * sbzyjz / sbyz * tsl /100)
    getSbtseNum(form)
  },

  // 金额
  jsje: (param: any) => {
    const {form} = param;
    // 计算 征税税额=计税金额*征税率(se = jsje * zssl)
    getZsseNum(form);
    // 计算 申报退税额 (tse = jsje * sbzyjz / sbyz * tsl /100)
    getSbtseNum(form)
  },

  // 征税率
  zssl: (param: any) => {
    const {form} = param;
    // 计算征税税额
    getZsseNum(form);
  },

  // 设备原值
  sbyz: (param: any) => {
    const {form} = param;
    // 反算设备净值，公式：设备净值=已使用过的设备原值-已使用过的设备已提累计折旧 (sbzyjz = sbyz - ytljzje)
    getSbzyjzNum(form);
    // 计算 申报退税额 (tse = jsje * sbzyjz / sbyz * tsl /100)
    getSbtseNum(form)
  },

  // 设备净值
  sbzyjz: (param: any) => {
    const {form} = param;
    // 计算 申报退税额 (tse = jsje * sbzyjz / sbyz * tsl /100)
    getSbtseNum(form)
  }, 

}
 // 表单事件：OnFocus
 Func.eventOnFocus = {
 }
 // 表单事件：OnChange
 Func.eventOnChange = {
  // 出口报关单号
  ckbgdh: (param: any) => {
    // 该报关单号当期出口明细中不存在
    const { form } = param;
    const ckbgdh = form?.getFieldsValue().ckbgdh
    if(ckbgdh && ckbgdh.length === 21){
      // 走后台接口
      queryBgdByBgdNo21({ckbgdh}).then((res: any) => {
        const {body, code} = res;
        const ssq = form?.getFieldsValue().ssq;
        const dlckhwzmhm = form?.getFieldsValue().dlckhwzmhm;
        if(body && code === '200'){
          if (body?.ckrq1) {
            form.setFieldsValue({ ckrq1: body.ckrq1?moment(new Date(body.ckrq1)):'' });
          }
          if (body?.ckspDm) {
            form.setFieldsValue({ ckspDm: body.ckspDm });
            const obj = {
              ckrq1: body?.ckrq1 ? moment(new Date(body.ckrq1)) : '',
              ckspDm: body.ckspDm ? body.ckspDm : '',
              ckbgdh: ckbgdh,
              slType: 'Y',
              ssq: ssq,
              dlckhwzmhm: dlckhwzmhm ? dlckhwzmhm : '',
            }
            querySpdmXxCjFun(obj, form)
          }
        }
      })
    }
  },
  // 进货凭证号
  jhpzh: (param: any) => {
		queryFpxxByMtsTsjhJhpzh(param);
  },
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
     if (code == '200') {
       form.setFieldsValue({
         ckspDm: body?.ckspDm,
         sbhgspmc: body?.sbhgspmc,
         tsl: body.tsl ? myUtil.text.getNumVal(body.tsl) : '',
         zssl: body.zssl ? myUtil.text.getNumVal(body.zssl) : '',
       });
     } else {
      form.setFieldsValue({
        ckspDm: '',
        sbhgspmc: '',
        tsl: '',
        zssl: '',
      });
       message.info(msg || desc)
     }
   })
 }

/**
* @author liwc
* @method queryFpxxByMtsTsjhJhpzhm
* @desc 计算：给根据进货明细进货凭证号查询发票信息
* @param param
*/
const queryFpxxByMtsTsjhJhpzh = (param: any) => {
  const { form } = param;
  if (!form) {
    return;
  }
  // 进货凭证号/已使用过设备凭证号
  let jhpzh;
  jhpzh = form.getFieldValue('ysygdsbpzhm');
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
  if ((fpDm && fphm && fpDm.length == 10 && fphm.length == 8) || (fphm && fphm.length == 20)) {
    queryFpWzxx({ fpDm, fphm }).then((response) => {
      const { code, body } = response;
      if (code === '200' && body) {
        // 开票日期
        const kprq = body.kprq;
        if (body.jsje) {
          form.setFieldsValue({
            jsje: Number(body.jsje) || '',  // 计税金额
          });
        }
        if (kprq) {
          form.setFieldsValue({
            kprq: kprq ? moment(new Date(kprq)) : '',
          });
        }
      }
    })
  }
};

// 计算： 征税税额=计税金额*征税率(se = jsje * zssl)
const getZsseNum = (form: any) => {
  const jsje = form?.getFieldsValue().jsje; // 金额
  const zssl = form?.getFieldsValue().zssl; // 征税率
  const resultTemp01 = DditCktsFormCommonFunc.util.getMultiplyResult({
    param1: jsje,
    param2: zssl
  });

  if (resultTemp01) {
    const zsse = DditCktsFormCommonFunc.util.getDivideResult({
      param1: resultTemp01,
      param2: 100
    });
    if (zsse) {
      form.setFieldsValue({ se: myUtil.text.getNumVal(myUtil.text.formatNum(zsse, '0,0.00')) });
    }
  }
};

// 申报退税额=金额（增值税专用发票上的金额或海关进口增值税专用缴款书的完税价格）×已使用过的设备设备净值/已使用过的设备原值×退税率
//  jsje * sbzyjz / sbyz * tsl /100
const getSbtseNum = (form: any) => {
  const jsje = form?.getFieldsValue().jsje; // 金额
  const sbzyjz = form?.getFieldsValue().sbzyjz; // 设备净值
  const sbyz = form?.getFieldsValue().sbyz; // 设备原值
  const tsl = form?.getFieldsValue().tsl; // 退税率
  const resultTemp02 = DditCktsFormCommonFunc.util.getMultiplyResult({
    param1: jsje,
    param2: sbzyjz
  });
  if (resultTemp02) {
    const resultTemp03 = DditCktsFormCommonFunc.util.getDivideResult({
      param1: resultTemp02,
      param2: sbyz
    });
    if (resultTemp03) {
      const resultTemp04 = DditCktsFormCommonFunc.util.getMultiplyResult({
        param1: resultTemp03,
        param2: tsl
      });
      if(resultTemp04) {
        const resultTemp05 = DditCktsFormCommonFunc.util.getDivideResult({
          param1: resultTemp04,
          param2: 100
        });
        if(resultTemp05) {
          // 申报退税额
          form.setFieldsValue({ tse: myUtil.text.getNumVal(myUtil.text.formatNum(resultTemp05, '0,0.00')) });
        }
      }
    }
  }
};

// 反算设备净值，公式：设备净值=已使用过的设备原值-已使用过的设备已提累计折旧 (sbzyjz = sbyz - ytljzje)
const getSbzyjzNum = (form: any) => {
  const sbyz = form?.getFieldsValue().sbyz; // 设备原值
  const ytljzje = form?.getFieldsValue().ytljzje; // 已提累计折旧
  const resultTemp01 = DditCktsFormCommonFunc.util.getSubtractResult({
    param1: sbyz,
    param2: ytljzje
  });

  if (resultTemp01) {
    form.setFieldsValue({ sbzyjz: myUtil.text.getNumVal(myUtil.text.formatNum(resultTemp01, '0,0.00')) });
  }
}



export default Func;