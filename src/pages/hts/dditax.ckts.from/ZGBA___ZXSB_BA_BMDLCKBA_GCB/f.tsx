/**
 * title: 边贸代理出口备案
 * author: wx
 */
import React from 'react';
import myUtil from '@/components/DDAssist/util';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { queryBgd201ByBgdNo21, querySpdmXxCj } from '@/pages/hts/services/htsApi';
import { message } from 'antd'

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
      // 如果商品代码为空则直接清空商品名称和计量单位
      if (!ckspDm) {
        setCkspxx(form, {});
        return;
      }
      const obj = {
        ckrq1: ckrq1,
        ckspDm: ckspDm,
        ckbgdh: ckbgdh,
        slType: 'Y',
        ssq: ssq,
      }
      querySpdmXxCjData(obj, form);
    }
  },
}
// 表单事件：OnFocus
Func.eventOnFocus = {
}
// 表单事件：OnChange
Func.eventOnChange = {
  ckbgdh: (param: any) => {
    // 原系统已取消change事件

    // const { form, otherParam } = param;
    // const ckbgdh = form?.getFieldsValue().ckbgdh
    // if(ckbgdh.length === 21){
    //   // 走后台接口
    //   queryBgd201ByBgdNo21({ckbgdh}).then((res: any) => {
    //     const { code, body, msg } = res;
    //     if(code == '200') {
    //       if(body) {
    //         const ckrq1 = body.ckrq1;
    //         const ckspDm = body.ckspDm;
    //         const sbsl1 = body.sbsl1;
    //         const mylaj = body.mylaj;
    //         form.setFieldsValue({
    //           ckrq1: ckrq1,
    //           ckspDm: ckspDm,
    //           sl: sbsl1,
    //           je: mylaj,
    //         });
    //         const obj = {
    //           formId: otherParam.unit_key,
    //           ckrq1: ckrq1,
    //           ckspDm: ckspDm,
    //           ckbgdh: ckbgdh
    //         }
    //         querySpdmXxCjData(obj, form);
    //       }
    //     } else {
    //       message.info(msg);
    //     }
    //   });
    // }
  },

}

const querySpdmXxCjData = (param: any, form: any) => {
  querySpdmXxCj(param).then((res: any) => {
    const { code, body, msg, desc } = res;
    if (code == '200') {
      form.setFieldsValue({
        ckspmc: body?.sbhgspmc ? body?.sbhgspmc: ''
      });
      setCkspxx(form, { ckspDm: body?.ckspDm, sbhgspmc: body?.sbspmc, sbspDm: body?.sbspDm, sbspmc: body?.sbspmc, hgjldwmc: body?.hgjldwmc, tsl: body?.tsl, zssl: body?.zssl, cldezs: body?.cldezs, cjdlzs: body?.cjdlzs });
    } else {
      message.info(msg || desc)
      setCkspxx(form, {});
    }
    return name;
  })
}

// 设置商品信息
const setCkspxx = (form: any, obj: any, eleName?: any) => {
  form.setFieldsValue({
    ckspDm: obj.sbspDm || '',
    ckspmc: obj.sbspmc || '',
  });
}

export default Func;