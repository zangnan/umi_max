/**
 * title: 跨境应税行为免退税申报明细
 * author: wx
 */
import React from 'react';
import myUtil from '@/pages/common/myUtil';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { checkStqysh, checkStqymc, queryQywtf } from '@/services/hts/api';

const Func: any = {
  unitRef: React.createRef(),
};

// 新建表单初始化
Func.initAddForm = (param: any) => {
  getstfnsrsbh(param);
  DditCktsFormCommonFunc.initAddForm(param);
}

Func.initEditForm = (param: any) => {
  const {handleModalVisible} = param;
  handleModalVisible(true);
  getstfnsrsbh(param);
}

// 受托方统一社会信用代码/纳税人识别号
const getstfnsrsbh = (param: any) => {
  const {myFormItems, setMyFormItems} = param
  const obj = {
    page: 1,
    pageSize: 999999,
    searchModel: [{ property: "stfnsrsbh", value: "", op: "al" }],
  }
  queryQywtf(obj).then((res: any) => {
    const { code, body} = res;
    if(code === '200') {
      let list :any[] = [];
      if (body.rows && body.rows.length > 0) {
        myUtil.code.saveCodeToLocalTable('url_gy_qywtf', body.rows, '01');
        const rows = body.rows;
        rows.forEach((item: any) => {
          list.push({
            value: item['stfnsrsbh'],
            name: item['stfnsrsbh'],
          });
        })
      }
      myFormItems[14].list = list;
      setMyFormItems([...myFormItems]);
    } 
  });
}

// 表单校验
Func.validator = {
  // 所属期
  ssq01: (form: any) => {
    return DditCktsFormCommonFunc.validator.ssq01(form);
  },
  // 申报批次
  sbpc02: (form: any) => {
    return DditCktsFormCommonFunc.validator.sbpc02(form);
  },
  // 申报序号
  sbxh02: (form: any) => {
    return DditCktsFormCommonFunc.validator.sbxh02(form);
  },
  // 编号
  sbbh101: (form: any) => {
    return DditCktsFormCommonFunc.validator.sbbh101(form);
  },
  // 编号
  sbbh102: (form: any) => {
    return DditCktsFormCommonFunc.validator.sbbh102(form);
  },
  // 项号
  xh401: (form: any) => {
    return DditCktsFormCommonFunc.validator.xh401(form);
  },
  // 受托方统一社会信用代码/纳税人识别号
  stfnsrsbh01: (form: any) => {
    const validator =  async (_rule: any, value: any) => {
      // 1.校验指定“所属期”、“编号”的代理证明申请记录是否与当前的委托企业税号是否一致
      const sbbh1 = form?.getFieldValue('sbbh1');
      const uuid = form?.getFieldValue('uuid');
      const ssq = form?.getFieldValue('ssq');
      const stfnsrsbh = form?.getFieldValue('stfnsrsbh');
      if (sbbh1 && ssq && stfnsrsbh) {
        const params = {
          sbbh1: sbbh1,
          stfnsrsbh: stfnsrsbh,
          ssq: ssq,
          uuid: uuid
        };
        await checkStqysh(params).then((response) => {
          const { code, msg } = response;
          if(code !== '200') {
            return Promise.reject(new Error(msg));
          }
          return Promise.resolve();
        })
        return Promise.resolve();
      }
    };
    return { validator };
  },
  // 受托方纳税人名称
  stfmc01: (form: any) => {
    const validator =  async (_rule: any, value: any) => {
      // 1.校验指定“所属期”、“编号”的代理证明申请记录是否与当前的委托企业税号是否一致
      const sbbh1 = form?.getFieldValue('sbbh1');
      const uuid = form?.getFieldValue('uuid');
      const ssq = form?.getFieldValue('ssq');
      const stfmc = form?.getFieldValue('stfmc');
      if (sbbh1 && ssq && stfmc) {
        const params = {
          sbbh1: sbbh1,
          stfmc: stfmc,
          ssq: ssq,
          uuid: uuid
        };
        await checkStqymc(params).then((response) => {
          const { code, msg } = response;
          if(code !== '200') {
            return Promise.reject(new Error(msg));
          }
          return Promise.resolve();
        })
        return Promise.resolve();
      }
    };
    return { validator };
  },
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
  // 项号
  xh4: (param: any) => {
    DditCktsFormCommonFunc.eventOnBlur.xh4(param);
  },
  // 受托方统一社会信用代码/纳税人识别号
  stfnsrsbh: (param: any) => {
    const { form } = param;
    const stfnsrsbh = form?.getFieldValue('stfnsrsbh');
    const option = myUtil.code.getCode('url_gy_qywtf', '01');
		let stfmcs: any = '';
		let wtdlckhths: any = '';
    const tempRows = option.filter((row: any) => {
      return (row.stfnsrsbh === stfnsrsbh);
    })
    if (tempRows && tempRows.length > 0) {
      stfmcs = tempRows[0].stfmc;
      wtdlckhths = tempRows[0].wtdlckhth;
    }
    form.setFieldsValue({
      stfmc: stfmcs,
      wtdlckhth: wtdlckhths,
    });
  },
}
// 表单事件：OnFocus
Func.eventOnFocus = {
}
// 表单事件：OnChange
Func.eventOnChange = {
  ssq: (param: any) => {
    DditCktsFormCommonFunc.eventOnChange.ssq(param);
  },
  // 申报批次
  sbpc: (param: any) => {
    // 申报批次自动补零
    DditCktsFormCommonFunc.eventOnBlur.sbpc(param);
  },
}

export default Func;