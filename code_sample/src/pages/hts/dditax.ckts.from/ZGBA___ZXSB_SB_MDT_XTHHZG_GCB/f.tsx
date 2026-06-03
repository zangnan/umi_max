/**
 * title: 先退税后核销申请
 */
import React from 'react';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import {checkXthhzgSqrqYsb,queryCkspTzqspm,getCmCode} from '@/services/hts/api';
import moment from 'moment';
import myUtil from '@/pages/common/myUtil';
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
    tbrq104: (form: any) => {
      const validator = async (_rule: any, value: any) => {
        const uuid = form.getFieldValue('uuid');
        const tbrq1= form.getFieldValue('tbrq1');
        const obj = {"tbrq1":tbrq1,"uuid":uuid};
        await checkXthhzgSqrqYsb(obj).then((response) => {
          if (response.code === '900') {
            return Promise.reject(new Error(response.msg));
          }
          return Promise.resolve();
        }).catch((err) => {
          return Promise.reject(err);
        });
        return Promise.resolve();
      };
      return { validator };
    },
     tcrq01: (form: any) => {
      const validator =  (_rule: any, value: any) => {
        const tcrq = form.getFieldValue('tcrq');
        const wgrq= form.getFieldValue('wgrq');
        // 投产日期应小于完工日期
        if (tcrq && wgrq) {
          var tcrqtime = new Date(tcrq).getTime();
          var wgrqtime = new Date(wgrq).getTime();
          if (tcrqtime > wgrqtime) {
            return Promise.reject("投产日期应小于完工日期");
          }
        }
        return Promise.resolve();
      };
      return { validator };
    },
    wgrq01: (form: any) => {
      const validator =  (_rule: any, value: any) => {
        const tcrq = form.getFieldValue('tcrq');
        const wgrq= form.getFieldValue('wgrq');
        // 完工日期应大于投产日期
        if (tcrq && wgrq) {
          var tcrqtime = new Date(tcrq).getTime();
          var wgrqtime = new Date(wgrq).getTime();
          if (tcrqtime > wgrqtime) {
            return Promise.reject("完工日期应大于投产日期");
          }
        }
        return Promise.resolve();
      };
      return { validator };
    },  
    dycskbl01: (form: any) => {
        const validator =  (_rule: any, value: any) => {
        // 第一次收款比例
        var dycskbl = form.getFieldValue('dycskbl');
        // 第二次收款比例
        var decskbl = form.getFieldValue('decskbl');
        // 其余收款比例
        var qyskbl = form.getFieldValue('qyskbl');
        // 付款比例不应超出合理范围（0-100）
        if ((dycskbl < 0 || dycskbl > 100) || (decskbl < 0 || decskbl > 100) || (qyskbl < 0 || qyskbl > 100)) {
        return Promise.reject("付款比例不应超出合理范围（0-100）, 付款比例总和应为100%");
        }
        // 付款比例总和应为100%
        var total = dycskbl + decskbl + qyskbl;
        // if (total != 100) {
        //   return Promise.reject("付款比例不应超出合理范围（0-100）, 付款比例总和应为100%2");
        // }
          return Promise.resolve();
        };
    return { validator };
  },  
  // 值为空赋0
  setZero: (form: any) => {
    return DditCktsFormCommonFunc.validator.setZero(form);
  },

}
// 表单事件：OnBlur
Func.eventOnBlur = {
  ckspDm: (param: any) => {
    // 出口日期不能为空.........等等等校验.......
    // 根据调整后商品代码带出名称, 校验是否为无效商品代码
    const { form } = param;
    const ckspDm = form.getFieldsValue().ckspDm
    if(ckspDm) {
      const obj = {
        ckspDm: ckspDm
      }
      getCmCode(obj).then((res: any) => {
        if (res.code == '200') {
          form.setFieldsValue({
            ckspmc: res?.body?.ckspmc,
          });
        } else if(res.code == '900') {
          message.info(res.msg)
          form.setFieldsValue({
            ckspmc: '',
            ckspDm: '',
          });
        } else {
          form.setFieldsValue({
            ckspmc: '',
            ckspDm: '',
          });
          message.error(res.desc)
        }
      })
    } else {
      form.setFieldsValue({
        ckspmc: '',
        ckspDm: '',
      });
    }
  },

  decskbl: (form: any) => {
    // 第一次收款比例
    var dycskbl = form?.form?.getFieldValue('dycskbl');
    // 第二次收款比例
    var decskbl = form?.form.getFieldValue('decskbl');
    // 计算 100 - dycskbl的结果
    var result = 100 - dycskbl ;
    // 计算 上一步的结果 - decskbl的结果
    result = result - decskbl;
    form?.form?.setFieldsValue({'qyskbl' :myUtil.text.getNumVal(myUtil.text.formatNum(result, '0,0.0000')) });
  },
  dycskbl: (form: any) => {
      // 第一次收款比例
      var dycskbl = form?.form?.getFieldValue('dycskbl');
      // 第二次收款比例
      var decskbl = form?.form.getFieldValue('decskbl');
      // 计算 100 - dycskbl的结果
			var result = 100 - dycskbl ;
			// 计算 上一步的结果 - decskbl的结果
			result = result - decskbl;
			form?.form?.setFieldsValue({'qyskbl' :myUtil.text.getNumVal(myUtil.text.formatNum(result, '0,0.0000')) });
  },
}
// 表单事件：OnFocus
Func.eventOnFocus = {
}
// 表单事件：OnChange
Func.eventOnChange = {
}

export default Func;