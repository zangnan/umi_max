/**
 * title: 跨境应税行为免退税申报明细
 * author: wx
 */
import React from 'react';
import myUtil from '@/components/DDAssist/util';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { checkWtqyshJk, checkWtqymcJk, queryQywtf } from '@/pages/hts/services/htsApi';

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
      myFormItems[8].list = list;
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
  // 委托企业名称一致性校验
  wtfnsrsbh01: (form: any) => {
		// 1.校验指定“所属期”、“编号”的代理证明申请记录是否与当前的委托纳税人名称是否一致
    const sbbh1  = form?.getFieldsValue().sbbh1;
    const uuid  = form?.getFieldsValue().uuid;
    const ssq  = form?.getFieldsValue().ssq;
    const wtfnsrsbh  = form?.getFieldsValue().wtfnsrsbh;
    const validator =  async (_rule: any, value: any) => {
      const params = {
        sbbh1: sbbh1,
				wtfnsrsbh: wtfnsrsbh,
				ssq: ssq,
        uuid: uuid
      };
      await checkWtqyshJk(params).then((response) => {
        const { code, msg } = response;
        if(code !== '200') {
          return Promise.reject(new Error(msg));
        }
        return Promise.resolve();
      })
      return Promise.resolve();
    };
    return { validator };
  },
  // 委托企业名称一致性校验
  wtfnsrmc01: (form: any) => {
		// 1.校验指定“所属期”、“编号”的代理证明申请记录是否与当前的委托纳税人名称是否一致
    const sbbh1  = form?.getFieldsValue().sbbh1;
    const uuid  = form?.getFieldsValue().uuid;
    const ssq  = form?.getFieldsValue().ssq;
    const wtfnsrmc  = form?.getFieldsValue().wtfnsrmc;
    const validator =  async (_rule: any, value: any) => {
      const params = {
        sbbh1: sbbh1,
				wtfnsrmc: wtfnsrmc,
				ssq: ssq,
      };
      await checkWtqymcJk(params).then((response) => {
        const { code, msg } = response;
        if(code !== '200') {
          return Promise.reject(new Error(msg));
        }
        return Promise.resolve();
      })
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
  // 委托纳税人识别号
  wtfnsrsbh: (param: any) => {
    const { form } = param;
    const wtfnsrsbh = form?.getFieldValue('wtfnsrsbh');
    const option = myUtil.code.getCode('url_gy_qywtf:01');
		let wtfnsrmcs: any = '';
		let wtdlckhths: any = '';
		let wtdljkhths: any = '';
    const tempRows = option.filter((row: any) => {
      return (row.stfnsrsbh === wtfnsrsbh);
    })
    if (tempRows && tempRows.length > 0) {
      wtfnsrmcs = tempRows[0].stfmc;
      wtdlckhths = tempRows[0].wtdlckhth;
      wtdljkhths = tempRows[0].wtdlckhth;
    }
    form.setFieldsValue({
      wtfnsrmc: wtfnsrmcs,
      wtdlckhth: wtdlckhths,
      wtdljkhth: wtdljkhths
    });
  },
}
// 表单事件：OnFocus
Func.eventOnFocus = {
}
// 表单事件：OnChange
Func.eventOnChange = {
  // 所属期
  ssq: (param: any) => {
    DditCktsFormCommonFunc.eventOnChange.ssq(param);
  },
}

export default Func;