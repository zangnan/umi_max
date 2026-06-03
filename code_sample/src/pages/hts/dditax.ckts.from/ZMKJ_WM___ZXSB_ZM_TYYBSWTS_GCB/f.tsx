/**
 * title: 出口货物已补税/未退税证明
 * author: wx
 */
import React from 'react';
import myUtil from '@/pages/common/myUtil';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import moment from "moment/moment";
import {queryJldwXxBySpdm, queryBgdByBgdNo21, queryDlzmByDlckhwzmhm, checkYwlxForYbswts} from '@/services/hts/api';
import {message} from 'antd';


const Func: any = {
  unitRef: React.createRef(),
};

// 编辑表单初始化
Func.initEditForm = (param: any) => {
  const { form, myFormItems, setMyFormItems, handleModalVisible } = param;
  form.setFieldsValue({ czlx: '2' });
  const params: any = {
    form: form,
    myItems: myFormItems,
    setMyItems: setMyFormItems,
  }
  handleModalVisible(true);
  Func.eventOnChange.tyybswtstylxDm(params);
  Func.eventOnChange.tmsztbz(params);
  Func.eventOnChange.hggqkaDm(params);
};

// 新建表单初始化
Func.initAddForm = (param: any) => {
  const { form, myFormItems, setMyFormItems, handleModalVisible } = param;
  const params: any = {
    form: form,
    myItems: myFormItems,
    setMyItems: setMyFormItems,
  }
  Promise.all([handleModalVisible(true)]).then(() =>  {
    DditCktsFormCommonFunc.initAddForm(param);
  }).catch(() => {
  }).finally(() => {
    Func.eventOnChange.tmsztbz(params);
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
  // 出口货物报关单/代理出口货物证明号
  ckbgdh04: (form: any) => {
    // 出口报关单号/代理出口货物证明号码长度不得少于20位
    const validator =  (_rule: any, value: any) => {
      if (value.length < 20) {
        return Promise.reject(new Error('出口报关单号/代理出口货物证明号码长度不得少于20位!'));
      }
      return Promise.resolve();
    };
    return { validator };
  },
  // 税种
  sz01: (form: any) => {
    return DditCktsFormCommonFunc.validator.sz01(form);
  },
  // 原退（免）税额
  ysbmdtse: (form: any) => {
    const validator =  (_rule: any, value: any) => {
      const tmsztbz = form?.getFieldsValue().tmsztbz;
      if (!value && tmsztbz != '尚未申报退（免）税') {
        return Promise.reject('该项内容为必填项不能为空！');
      }
      return Promise.resolve();
    };
    return { validator };
  },
  // 进货凭证号码
  jhpzh: (form: any) => {
    const validator =  (_rule: any, value: any) => {
      const tmsztbz = form?.getFieldsValue().tmsztbz;
      if (!value && (tmsztbz == '已冲减退（免）税' || tmsztbz == '已缴回退（免）税')) {
        return Promise.reject('该项内容为必填项不能为空！');
      }
      return Promise.resolve();
    };
    return { validator };
  },
  // 进货凭证号码
  jhpzh03: (form: any) => {
    return DditCktsFormCommonFunc.validator.jhpzh03(form);
  },
  // 退运数量
  tysl01: (form: any) => {
    const validator =  (_rule: any, value: any) => {
      // 撤回原因为2 不得为空
      const tyybswtstylxDm  = form?.getFieldsValue().tyybswtstylxDm; // 业务类型
      if (tyybswtstylxDm == '1') {
        const tysl  = form?.getFieldsValue().tysl; // 退运数量
        if (tysl == 0) {
          return Promise.reject(new Error('该项不能为0！'));
        }
        if (!tysl) {
          return Promise.reject(new Error('该项内容为必填项不能为空！'));
        }
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
    const {form} = param;
    const ckbgdhOrDlckhwzmhm = form?.getFieldsValue().ckbgdh
    const ckbgdh = ckbgdhOrDlckhwzmhm && ckbgdhOrDlckhwzmhm.length == 21 ? ckbgdhOrDlckhwzmhm : '';
    const dlckhwzmhm = ckbgdhOrDlckhwzmhm && ckbgdhOrDlckhwzmhm.length != 21 ? ckbgdhOrDlckhwzmhm : '';
    const ckrq1 = form?.getFieldsValue().ckrq1;
    const ckspDm = form?.getFieldsValue().ckspDm;
    const obj = {
      ckbgdh: ckbgdh,
      ckrq1: ckrq1 ? moment(new Date(ckrq1)) : '',
      ckspDm: ckspDm ? ckspDm : '',
      dlckhwzmhm: dlckhwzmhm,
      slType: "N",
    }
    if (ckspDm) {
      querySpdmXxCjFun(obj, form)
    }
  }
}

// 改变调整前的商品名称 代码 出口日期 计量单位
const querySpdmXxCjFun = (obj: {}, form: any) => {
  queryJldwXxBySpdm(obj).then((res: any) => {
    const { code, body, msg, desc } = res;
    if (code == '200') {
      form.setFieldsValue({
        jldw: body?.hgjldwmc,
      });
    } else {
      form.setFieldsValue({
        ckspDm: '',
        jldw: '',
      });
      message.info(msg || desc);
    }
  })
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
  // 口岸代码
  hggqkaDm: (param: any) => {
    const { form, value } = param;
    const hggqkaDm = value ? value : form?.getFieldsValue().hggqkaDm; // 口岸代码名称
    const hggqkamc = myUtil.code.getCodeValByKey(hggqkaDm, 'code_dm_gy_hggqka', '01');
    if (hggqkamc) {
      form.setFieldsValue({ hggqkamc: hggqkamc });
    }
  },
  // 业务类型
  tyybswtstylxDm: (param: any) => {
    const { form, myItems, setMyItems } = param;
    const tyybswtstylxDm = form?.getFieldsValue().tyybswtstylxDm; // 业务处理方式
    const lableSpan: any = document.querySelector("#zmkj_wm_zxsb_zm_tyybswts_gcb_form .dditem_label_tysl span");
    const tyslItem = myItems.find((row: any) => {
      return (row.name === 'tysl');
    });
    // const inputEle: any = document.querySelector("#zmkj_wm_zxsb_zm_tyybswts_gcb_form_tysl");
    // 更改 退运数量的样式 并且在validate中校验 退税数量的 必填与否
    if (tyybswtstylxDm == '1') { // 退运数量 必填
      // 可编辑 必录
      tyslItem.disabled = false;
      lableSpan.classList.add('required');
    } else if (tyybswtstylxDm == '2' || tyybswtstylxDm == '3') { // 退运数量为空
      form.setFieldsValue({
        tysl: '', // 退运数量
      });
      // 只读 不必录
      tyslItem.disabled = true;
      lableSpan.classList.remove('required');
    } else {
      tyslItem.disabled = true;
      lableSpan.classList.add('required');
    }
    setMyItems([...myItems]);
  },
  // 退（免）税状态
  tmsztbz: (param: any) => {
    const { form, myItems, setMyItems } = param;
    const tmsztbz = form?.getFieldsValue().tmsztbz; // 退运已补税
    const jhpzhSpan: any = document.querySelector("#zmkj_wm_zxsb_zm_tyybswts_gcb_form .dditem_label_jhpzh span");
    const jhpzhItem = myItems.find((row: any) => {
      return (row.name === 'jhpzh');
    });
    if (tmsztbz != '已冲减退（免）税' && tmsztbz != '已缴回退（免）税') {
      // 设置默认值
      form.setFieldsValue({
        jhpzh: undefined,
      });
      jhpzhSpan.classList.remove('required');
      jhpzhItem.disabled = true;
    } else {
      jhpzhSpan.classList.add('required');
      jhpzhItem.disabled = false;
    }
    const lableSpan1: any = document.querySelector("#zmkj_wm_zxsb_zm_tyybswts_gcb_form .dditem_label_ysbmdtse span");
    const ysbmdtseItem = myItems.find((row: any) => {
      return (row.name === 'ysbmdtse');
    });
    if (tmsztbz == '尚未申报退（免）税') {
      // 设置默认值
      form.setFieldsValue({
        ysbmdtse: undefined, // 原退（免）税额
      });
      // 取消必录
      lableSpan1.classList.remove('required');
      // 设置只读
      ysbmdtseItem.disabled = true;
    } else {
      // 设置必录
      lableSpan1.classList.add('required');
      ysbmdtseItem.disabled = false;
    }
    setMyItems([...myItems]);
  },
  // 出口报关单号
  ckbgdh: (param: any) => {
    const { form } = param;
    const ckbgdh = form?.getFieldsValue().ckbgdh
    /*
     * 根据21位报关单号带出关键项数据 (出口日期、
     * 出口商品代码、出口商品名称、第一计量单位代码（法定单位）、
     * 成交数量、成交海关货币数字代码、成交总价、人民币离岸价、美元离岸价);
     */
    if (ckbgdh) { // 报关单不为空时
            if (ckbgdh.length == 21) {
              queryBgdByBgdNo21({ckbgdh:ckbgdh}).then((res: any) => {
                const { body, code, msg } = res;
                if(code === '200') {
                  if(res.body){
                    form.setFieldsValue({
                      ckrq1: body.ckrq1 ? moment(new Date(body.ckrq1)) : '',
                      ckspDm: body.ckspDm,
                    });
                    const obj = {
                      ckrq1: body.ckrq1 ? moment(new Date(body.ckrq1)):'',
                      ckspDm:  body.ckspDm ? body.ckspDm : '',
                      slType: "N",
                    }
                    querySpdmXxCjFun(obj, form)
                  }
                } else {
                  message.info(msg);
                  form.setFieldsValue({
                    ckrq1: undefined,
                    ckspDm: undefined,
                  });
                }
              })
            } else {
              queryDlzmByDlckhwzmhm({dlckhwzmhm : ckbgdh}).then((res: any) => {
                const { body, code, msg } = res;
                if(code === '200') {
                  if(res.body){
                    form.setFieldsValue({
                      ckrq1: body.ckrq1 ? moment(new Date(body.ckrq1)) : '',
                      ckspDm: body.ckspDm,
                    });
                    const obj = {
                      ckrq1: body.ckrq1 ? moment(new Date(body.ckrq1)):'',
                      ckspDm:  body.ckspDm ? body.ckspDm : '',
                      slType: "N",
                    }
                    querySpdmXxCjFun(obj, form)
                  }
                } else {
                  message.info(msg);
                  form.setFieldsValue({
                    ckrq1: undefined,
                    ckspDm: undefined,
                  });
                }
              })
            }
    }
  }
}

// 配置项：自定义工具栏 报关单生成明细
Func.bgdscmx = (param: any) => {
  DditCktsFormCommonFunc.bgdscmx(param);
}

// 表单保存前执行
Func.formBeforeSubmit = async (param: any) => {
  const {form} = param;
  const ckbgdh = form?.getFieldsValue().ckbgdh;
  const ssq = form?.getFieldsValue().ssq;
  const sbbh1 = form?.getFieldsValue().sbbh1;
  let checkFlag = true;
  await checkYwlxForYbswts({ssq: ssq, sbbh1: sbbh1, ckbgdh: ckbgdh}).then((res: any) => {
    const {code, msg} = res;
    if (code != '200') {
      message.info(msg);
      checkFlag = false;
    }
  });
  return checkFlag;
}

export default Func;
