/**
 * title: 出口货物离岸价差异原因说明表
 * author: wx
 */
import React from 'react';
import myUtil from '@/pages/common/myUtil';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { queryCkxxByCondition } from '@/services/hts/api';
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
  // 出口发票和出口报关单人民币离岸价差异额
  ckfphckbgdrmblajcye01: (form: any) => {
    const ckfprmblaj = myUtil.text.getNumVal(form?.getFieldValue('ckfprmblaj'));
    const rmblaj = myUtil.text.getNumVal(form?.getFieldValue('rmblaj'));
    // 差异额常规校验：差异额不等于报关单离岸价(RMB)-发票离岸价(RMB)！
    const validator =  (_rule: any, value: any) => {
      if (value) {
        // 差异额 = 关单人民币价(RMB)-发票人民币价(RMB)
        let ckfphckbgdrmblajcye;
        if (ckfprmblaj && rmblaj) {
          // 如果关单人民币价和发票人民币价有值
          ckfphckbgdrmblajcye = rmblaj - ckfprmblaj;
        }
        if (myUtil.text.getNumVal(value) != myUtil.text.getNumVal(myUtil.text.formatNum(ckfphckbgdrmblajcye, '0.00'))) {
          return Promise.reject(new Error('差异额不等于关单人民币价(RMB)-发票人民币价(RMB)！'));
        }
      }
      return Promise.resolve();
    };
    return { validator };
  },
  // 出口发票和出口报关单人民币离岸价差异率
  ckfphckbgdrmblajcyl01: (form: any) => {
    const ckfprmblaj =  myUtil.text.getNumVal(form?.getFieldValue('ckfprmblaj'));
    const ckfphckbgdrmblajcye =  myUtil.text.getNumVal(form?.getFieldValue('ckfphckbgdrmblajcye'));
    // 差异率常规校验：差异率不等于报关单离岸价(RMB)-发票离岸价(RMB)！
    const validator =  (_rule: any, value: any) => {
      if (value) {
        let ckfphckbgdrmblajcyl;
        if (ckfprmblaj && ckfphckbgdrmblajcye) {
					ckfphckbgdrmblajcyl = ckfphckbgdrmblajcye / ckfprmblaj * 100;
        }
        if (myUtil.text.getNumVal(value) != myUtil.text.getNumVal(myUtil.text.formatNum(ckfphckbgdrmblajcyl, '0.00000'))) {
          return Promise.reject(new Error('差异率不等于差异额/发票人民币价(RMB)*100！'));
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
  // 出口发票离岸价人民币
  ckfprmblaj: (param: any) => {
    const { form } = param;
    setMdtCysmgtjs(form);
  },
  // 人民币离岸价
  rmblaj: (param: any) => {
    const { form } = param;
    setMdtCysmgtjs(form);
  },
  // 出口发票和出口报关单人民币离岸价差异额
  ckfphckbgdrmblajcye: (param: any) => {
    const { form } = param;
    setMdtCysmgtjs(form);
  },
}
// 表单事件：OnFocus
Func.eventOnFocus = {
}
// 表单事件：OnChange
Func.eventOnChange = {
  // 出口报关单号
  ckbgdh: (param: any) => {
    const { form } = param;
    const ckbgdh = form?.getFieldsValue().ckbgdh
    const sbxh = form?.getFieldsValue().sbxh;
    const ssq = form?.getFieldsValue().ssq;
    const sbpc = form?.getFieldsValue().sbpc;

    queryCkxxByCondition({
      ckbgdh,
      sbxh,
      sbpc,
      qylx: 'sc',
      ssq,
    }).then((res: any) => {
      const { body } = res;
      if (res.code == '200') {
        if (body.length != 0) {
          form.setFieldsValue({
            ckfph: body[0]?.ckfph ? body[0]?.ckfph : '',
          });
        }
      } else if(res.code == '900') {
        message.info(res.msg)
      } else {
        message.error(res.desc)
      }
    })
  },
}

// 计算：免抵退 差异说明表 计算
const setMdtCysmgtjs = (form: any) => {
  // 发票人民币价
  const ckfprmblaj =  myUtil.text.getNumVal(form?.getFieldValue('ckfprmblaj'));
  // 关单人民币价
  const rmblaj =  myUtil.text.getNumVal(form?.getFieldValue('rmblaj'));
  // 差异额 = 关单人民币价(RMB)-发票人民币价(RMB)
  let ckfphckbgdrmblajcye;
  if (ckfprmblaj && rmblaj) {
    // 如果关单人民币价和发票人民币价有值
    ckfphckbgdrmblajcye = rmblaj - ckfprmblaj;
  }
  if (ckfphckbgdrmblajcye == undefined) {
    // 如果重算不了差异额，则尝试取页面当前录入的值，进行下一步计算
    ckfphckbgdrmblajcye = myUtil.text.getNumVal(form?.getFieldValue('ckfphckbgdrmblajcye'));
  }
  if (ckfphckbgdrmblajcye === 0 || ckfphckbgdrmblajcye) {
    form.setFieldsValue({
      ckfphckbgdrmblajcye: myUtil.text.getNumVal(myUtil.text.formatNum(ckfphckbgdrmblajcye, '0,0.00')),
    });
    // 差异率 = 差异额 / 发票人民币价 * 100
    let ckfphckbgdrmblajcyl = myUtil.text.getNumVal(form?.getFieldValue('ckfphckbgdrmblajcyl'));
    // by james 20210219
    if ((ckfphckbgdrmblajcye || ckfphckbgdrmblajcye == 0) && ckfprmblaj) {
      ckfphckbgdrmblajcyl = ckfphckbgdrmblajcye / ckfprmblaj * 100;
    }
    if (ckfphckbgdrmblajcyl === 0 || ckfphckbgdrmblajcyl) {
      form.setFieldsValue({
        ckfphckbgdrmblajcyl: myUtil.text.getNumVal(myUtil.text.formatNum(ckfphckbgdrmblajcyl, '0,0.00000')),
      });
    }
  }
}
export default Func;