/**
 * title: 跨境应税行为免退税申报明细
 * author: wx
 */
import React from 'react';
import myUtil from '@/pages/common/myUtil';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import {checkJgqynsrsbh, checkJgqynsrmc, queryBgdByBgdNo21, querySpdmXxCj, queryQywtf, getLljgmszmxxByBhxh} from '@/services/hts/api';
import { getCmCode } from '@/services/hts/api';
import { message } from 'antd';
import moment from 'moment';

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
  sbxh02: (form: any) => {
    return DditCktsFormCommonFunc.validator.sbxh02(form);
  },
  // 申报序号
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
  // 加工企业统一社会信用代码/纳税人识别号
  jgqynsrsbh01: (form: any) => {
    const validator =  async (_rule: any, value: any) => {
      // 校验同一编号下，加工企业社会信用代码/纳税号是否一致
      const sbbh1 = form?.getFieldValue('sbbh1');
      const uuid = form?.getFieldValue('uuid');
      const ssq = form?.getFieldValue('ssq');
      const jgqynsrsbh = form?.getFieldValue('jgqynsrsbh');
      if (sbbh1 && ssq && jgqynsrsbh) {
        const params = {
          sbbh1: sbbh1,
          jgqynsrsbh: jgqynsrsbh,
          ssq: ssq,
          uuid: uuid
        };
        await checkJgqynsrsbh(params).then((response) => {
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
  // 加工企业名称
  jgqynsrmc01: (form: any) => {
    const validator =  async (_rule: any, value: any) => {
      // 校验同一编号下，加工企业社会信用代码/纳税号是否一致
      const sbbh1 = form?.getFieldValue('sbbh1');
      const uuid = form?.getFieldValue('uuid');
      const ssq = form?.getFieldValue('ssq');
      const jgqynsrmc = form?.getFieldValue('jgqynsrmc');
      if (sbbh1 && ssq && jgqynsrmc) {
        const params = {
          sbbh1: sbbh1,
          jgqynsrmc: jgqynsrmc,
          ssq: ssq,
          uuid: uuid
        };
        await checkJgqynsrmc(params).then((response) => {
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
  // 值为空赋0
  setZero: (form: any) => {
    return DditCktsFormCommonFunc.validator.setZero(form);
  },
  // 来料加工免税证明编号（已开具证明）
  lljgmszmbh: (form: any) => {
    const validator =  async (_rule: any, value: any) => {
      if (value && value.length != 20) {
        return Promise.reject('该项内容长度必须为20！');
      }
      return Promise.resolve();
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
  // 出口商品代码
  ckspDm: (param: any) => {
    const { form } = param;
		// 通用的商品码回显逻辑
    const ckspDm = form?.getFieldValue('ckspDm');
    if(ckspDm) {
      handleCkspxxEvent(form);
    }
  },
  // 加工企业统一社会信用代码/纳税人识别号
  jgqynsrsbh: (param: any) => {
    const { form } = param;
    const jgqynsrsbh = form?.getFieldValue('jgqynsrsbh');
    const option = myUtil.code.getCode('url_gy_qywtf', '01');
		let jgqynsrmc: any = '';
    const tempRows = option.filter((row: any) => {
      return (row.stfnsrsbh === jgqynsrsbh);
    })
    if (tempRows && tempRows.length > 0) {
      jgqynsrmc = tempRows[0].stfmc;
    }
    form.setFieldsValue({
      jgqynsrmc: jgqynsrmc,
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
  // 出口货物报关单号
  ckbgdh: (param: any) => {
    const { form } = param;
    const ckbgdh = form?.getFieldsValue().ckbgdh
    const dlckhwzmhm = form?.getFieldsValue().dlzmh;
    const ssq = form?.getFieldsValue().ssq;
    const sbpc = form?.getFieldsValue().sbpc;
			if (ckbgdh && ckbgdh.length == 21) { // 报关单不为空时
        queryBgdByBgdNo21({ckbgdh}).then((res: any) => {
          const { body, code, msg } = res;
          if(code === '200') {
            if(body){
              // ckbgdh 出口报关单号
              const ckbgdh = body.ckbgdh;
              // cksp_dm	出口商品代码
              const ckspDm = body.ckspDm;
              if (body.cksl) {
                form.setFieldsValue({ cksl: myUtil.text.getNumVal(myUtil.text.formatNum(body.cksl, '0,0.00000')) });
              }
              if (ckspDm) {
                const obj = {
                  ckbgdh,
                  ckrq1: body.ckrq1 ? moment(new Date(body.ckrq1)):'',
                  ckspDm:  body.ckspDm ? body.ckspDm : '',
                  dlckhwzmhm: dlckhwzmhm ? dlckhwzmhm : '',
                  sbpc,
                  slType: "Y",
                  ssq,
                  ywlx: form?.getFieldValue('cktmsywlxdmjh')
                }
                querySpdmXxCjFun(obj, form)
              }
            }
          } else {
            message.info(msg)
          }
        })
			}
  },
  // 来料加工免税证明编号（已开具证明）
  lljgmszmbh: (param: any) => {
    const {form} = param;
    const lljgmszmbh = form?.getFieldsValue().lljgmszmbh
    if (lljgmszmbh && lljgmszmbh.length == 20) { // 来料加工免税证明编号不为空时且长度20时
      getLljgmszmxxByBhxh({lljgmszmbh: lljgmszmbh}).then((res: any) => {
        const {body, code, msg} = res;
        if (code == '200') {
          form.setFieldsValue({
            jgqynsrsbh: body.stfnsrsbh ? body.stfnsrsbh : '',
            jgqynsrmc: body.stfmc ? body.stfmc : '',
            lljgszch: body.lljgszch ? body.lljgszch : '',
            jgffphm: body.jgffphm ? body.jgffphm : '',
            jldwmc: body.ykfphwdw ? body.ykfphwdw : '',
            sl: body.ykfphwsl ? body.ykfphwsl : '',
            jgfje: body.jgfje ? body.jgfje : '',
          });
        } else if (code == '900') {
          message.error(msg)
        } else if (code == '901') {
        } else {
          message.error(msg)
        }
      })
    }
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

const querySpdmXxCjFun = (obj: {}, form: any) => {
  querySpdmXxCj(obj).then((res: any) => {
    const { code, body, msg, desc } = res;
    if (code == '200') {
      form.setFieldsValue({
        ckspDm: body.ckspDm ? body.ckspDm : '',
        ckspmc: body.sbhgspmc ? body.sbhgspmc : '',
        hgjldwmc: body.hgjldwmc ? body.hgjldwmc : '',
      });
    } else if(code == '900') {
      message.info(msg)
    } else {
      message.error(desc)
    }
  })
}

export default Func;
