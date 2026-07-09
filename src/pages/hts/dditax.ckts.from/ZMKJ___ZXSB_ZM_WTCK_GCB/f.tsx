/**
 * title: 跨境应税行为免退税申报明细
 * author: wx
 */
import React from 'react';
import myUtil from '@/components/DDAssist/util';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { checkStfnsrsbh, checkStfmc, queryBgdByBgdNo21, querySpdmXxCj, queryQywtf } from '@/pages/hts/services/htsApi';
import { message } from 'antd';
import moment from 'moment';
import { getCmCode } from '@/pages/hts/services/htsApi';

const Func: any = {
  refUnit: React.createRef(),
};

// 新建表单初始化
Func.initAddForm = (param: any) => {
  const {formItems, setFormItems} = param;
  const params = {
    setMyItems: setFormItems,
    myItems: formItems
  }
  getstfnsrsbh(params);
  DditCktsFormCommonFunc.initAddForm(param);
}

// 编辑表单初始化
Func.initEditForm = (param: any) => {
  const { form, handleModalVisible, formItems, setFormItems } = param;
  handleModalVisible(true);
  const params = {
    setMyItems: setFormItems,
    myItems: formItems,
  }
  getstfnsrsbh(params);
  const hbDm = form?.getFieldValue('hbzmDm'); // 出口额_币种
  if(hbDm) {
    const params = {
      value: hbDm,
      form,
    }
    Func.eventOnChange.hbDm(params);
  }
}

// 受托方统一社会信用代码/纳税人识别号
const getstfnsrsbh = (param: any) => {
  const {myItems, setMyItems} = param
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
      myItems[8].list = list;
      setMyItems([...myItems]);
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
        await checkStfnsrsbh(params).then((response) => {
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
        await checkStfmc(params).then((response) => {
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
  // 出口商品代码
  ckspdm01: (form: any) => {
    const validator = async (_rule: any, value: any) => {
      if (value && value.length != 10) {
        return Promise.reject('按报关单商品代码录入，不足10位的请在后面填0补位！');
      }
      return Promise.resolve();
    };
    return {validator};
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
  // 受托方统一社会信用代码/纳税人识别号
  stfnsrsbh: (param: any) => {
    const { form } = param;
    const stfnsrsbh = form?.getFieldValue('stfnsrsbh');
    const option = myUtil.code.getCode('url_gy_qywtf:01');
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
      dlckxyh: wtdlckhths,
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
              const ckbgdh = form?.getFieldValue('ckbgdh');
              // cksp_dm	出口商品代码
              const ckspDm = body.hgckspDm;
              // cjhghbszDm 成交币制代码
              const hbzmDm = body.cjhghbszDm;
              // cjzj 成交总价
              const cjzj = body.cjzj;
              if (hbzmDm) {
                form.setFieldsValue({
                  hbzmDm: hbzmDm,
                  rmblaj: Number(cjzj)
                });
                const cjbz = myUtil.code.getCodeValByKey(hbzmDm, 'code_dm_gy_hb:01');
                if (cjbz) {
                  form.setFieldsValue({ biname: cjbz });
                }
              }
              if (ckspDm) {
                form.setFieldsValue({
                  ckspDm: ckspDm, ckspmc: body.hgspmc, ckrq1: moment(new Date(body.ckrq1))
                });
                // const obj = {
                //   ckbgdh,
                //   ckrq1: body.ckrq1 ? moment(new Date(body.ckrq1)):'',
                //   ckspDm:  body.ckspDm ? body.ckspDm : '',
                //   dlckhwzmhm: dlckhwzmhm ? dlckhwzmhm : '',
                //   sbpc,
                //   slType: "Y",
                //   ssq,
                // }
                // querySpdmXxCjFun(obj, form);
              }
            }
          } else {
            message.info(msg)
          }
        })
			}
  },
  // 出口额_币种
  hbDm: (param: any) => {
    const { form, value } = param;
    if(value) {
      const biname = myUtil.code.getCodeValByKey(value, 'code_dm_gy_hb:01');
      if (biname) {
        form.setFieldsValue({ biname: biname });
      }
    } else {
      form.setFieldsValue({ biname: '' });
    }
  },
}

const querySpdmXxCjFun = (obj: {}, form: any) => {
  querySpdmXxCj(obj).then((res: any) => {
    const { code, body, msg, desc } = res;
    if (code == '200' && body) {
      form.setFieldsValue({
        ckspDm: body.ckspDm ? body.ckspDm : '',
        ckspmc: body.sbhgspmc ? body.sbhgspmc : '',
      });
    } else if(code == '900') {
      message.info(msg)
    } else {
      message.error(desc)
    }
  })
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
  const param = { ckspDm, ssq, ckrq1, cxType: '1' };
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

export default Func;
