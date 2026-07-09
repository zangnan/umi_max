/**
 * title: 集团公司成员企业备案
 */
import React from 'react';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { checkJtgszbSh } from '@/pages/hts/services/htsApi';

const Func: any = {
  refUnit: React.createRef(),
};

// 新建表单初始化
Func.initAddForm = (param: any) => {
  DditCktsFormCommonFunc.initAddForm(param);
}

// 表单校验
Func.validator = {
    // 所属期
    tbrq02: (form: any) => {
      return DditCktsFormCommonFunc.validator.tbrq02(form);
    },
      // 申报序号
    sbxh02: (form: any) => {
      return DditCktsFormCommonFunc.validator.sbxh02(form);
    },
    // 企业海关代码
    cyhgqydm02:(form: any) => {
      return DditCktsFormCommonFunc.validator.cyhgqydm02(form);
    },
    cynsrsbh01: (form: any) => {
      const qyzjtgsdwDm = form?.getFieldValue('qyzjtgsdwDm');
      const validator =  (_rule: any, value: any) => {
        if (qyzjtgsdwDm) {
          var params = {
            qyzjtgsdwDm: qyzjtgsdwDm, // 企业在集团公司地位代码
            cynsrsbh: value // 纳税人识别号
          };
          checkJtgszbSh(params).then((res: any)=>{
            const {code, msg} = res;
            if(code === '200') {
              return Promise.resolve();
            } else  {
              return Promise.reject(new Error(msg));
            }
          })
          
        }
      };
      return { validator };
    },
    cgbl01: (form: any) => {
      // 1.地位为“2控股企业”时，必录，必录校验
      const dw = form?.getFieldValue('qyzjtgsdwDm');
      const validator =  (_rule: any, value: any) => {
        if (dw == '2' && value<=0 ) {
          const lableSpan1: any = document.querySelector("#zgba_zxsb_ba_jtcyba_gcb_form .dditem_label_cgbl span");
          lableSpan1.classList.add('required');
          return Promise.reject(new Error('控股企业持股比例应大于0，请确认后填报！'));
        }
        return Promise.resolve();
      }
      return { validator };


    },
    cgbl02: (form: any) => {
      // 1.地位为“2控股企业”时，必录，必录校验
      const dw = form?.getFieldValue('qyzjtgsdwDm');
      const validator =  (_rule: any, value: any) => {
        if (dw == '2' && value<=0) {
          return Promise.reject(new Error('控股企业持股比例应大于0，请确认后填报！'));
        }
        return Promise.resolve();
      }
      return { validator };
    }
}
// 表单事件：OnBlur
Func.eventOnBlur = {
    // 申报序号
    sbxh: (param: any) => {
      // 申报序号自动补零
      DditCktsFormCommonFunc.eventOnBlur.sbxh(param);
    },

}
// 表单事件：OnFocus
Func.eventOnFocus = {
}
// 表单事件：OnChange
Func.eventOnChange = {
  qyzjtgsdwDm: (param: any) => {
    const { form } = param;
    const qyzjtgsdwDm = form?.getFieldValue('qyzjtgsdwDm');
    // 地位为总部，申报序号为00000001
    const sbxh = form?.getFieldValue('sbxh');
		if (qyzjtgsdwDm == '1') {
      form?.setFieldsValue({sbxh:'00000001'});
		} else {
      form?.setFieldsValue({sbxh:sbxh});
		}
  },
}

export default Func;