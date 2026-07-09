/**
 * title: 外贸综合服务企业代办退税申报表
 * author: wx
 */
import React from 'react';
import myUtil from '@/components/DDAssist/util';
import { querySpdmXxCj, queryBgdByBgdNo21, queryFpWzxx, queryDlzmByDlckhwzmhm, checkYwlxSpdm } from '@/pages/hts/services/htsApi';
import { message } from 'antd';
import moment from 'moment';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';

const Func: any = {
  refUnit: React.createRef(),
};

// 新建表单初始化
Func.initAddForm = (param: any) => {
  DditCktsFormCommonFunc.initAddForm(param);
  const {formItems,setFormItems} = param;
  const lableSpan1: any = document.querySelector("#dbts_zxsb_sb_db_tssb_gcb_form .dditem_label_hzcjyyDm span");
  if(lableSpan1){
    lableSpan1.classList.remove('required');
    const tmpMyItems: any = [];
    formItems.map((item: any) => {
      if (item.name === 'hzcjyyDm') {
        item.disabled = true;
      }
      tmpMyItems.push(item);
    });
    setFormItems([...tmpMyItems]);
  }
  
}
// 编辑表单初始化
Func.initEditForm = (param: any) => {
  const { handleModalVisible,formItems, setFormItems, form ,unitref,unitKey} = param;
  const params: any = {
    form: form,
    myItems: formItems,
    setMyItems: setFormItems,
    otherParam :{
       otherRef: unitref,
       unitKey:unitKey,
    },
  }
handleModalVisible(true);
DditCktsFormCommonFunc.eventOnChange.cktmsywlxdmjh(params);
}

// 表单保存
Func.formBeforeSubmit = async (param: any) => {
  const {form} = param;
  const ckrq1 = myUtil.grid.formatDate(form?.getFieldsValue().ckrq1, 'YYYY');
  const ssq = form?.getFieldsValue().ssq.substring(0,4);
  if(ckrq1 != ssq) {
    message.info('出口日期与申报年月不在同一年度！')
    form.setFieldsValue({
      ckrq1: '',
    });
    return false;
  }
  // 检查商品码和业务类型匹配，是否为结构物和列名原材料
  let checkFlag = true;
  const cktmsywlxdmjh = form?.getFieldValue('cktmsywlxdmjh'); // 业务类型
  const ckspDm = form?.getFieldValue('ckspDm');
  const ckrqNyr = form?.getFieldValue('ckrq1'); // 出口日期
  if (ckspDm && cktmsywlxdmjh && cktmsywlxdmjh.length > 0) {
    await checkYwlxSpdm({
      ckspDm: ckspDm,
      ckrq1: moment(ckrqNyr).format('YYYY-MM-DD'),
      ywlx: form.getFieldValue('cktmsywlxdmjh').join(',')
    }).then((res) => {
      const { code, msg } = res;
      if (code != '200') {
        message.error(msg);
        checkFlag = false;
      }
    });
  }
  return checkFlag;
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
  // 委托纳税人识别号
  wtdbtsscqynsrsbh02: (form: any) => {
    const validator =  (_rule: any, value: any) => {
			// 委托纳税人识别号应为15位或20位
      const wtdbtsscqynsrsbh = form?.getFieldValue('wtdbtsscqynsrsbh');
			if (wtdbtsscqynsrsbh.length != 15 && wtdbtsscqynsrsbh.length != 18) {
        return Promise.reject(new Error('委托纳税人识别号应为15位或18位，请确认后填报！'));
			}
      return Promise.resolve();
    };
    return { validator };
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
  // 国内启运方式
  gnqyfsDm01: (form: any) => {
    return DditCktsFormCommonFunc.validator.gnqyfsDm01(form);
  },
  // 海关总署认证企业类型
  hgzsrzqylxDm01: (form: any) => {
    return DditCktsFormCommonFunc.validator.hgzsrzqylxDm01(form);
  },
  hzcjyyDm01: (form: any) => {
    return DditCktsFormCommonFunc.validator.hzcjyyDm01(form);
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
  // 委托纳税人识别号
  wtdbtsscqynsrsbh: (param: any) => {
    // 委托纳税人识别号
    const { event, form } = param;
    const inputValue = event.target.value;
    // 字母转大写
    form.setFieldsValue({
      wtdbtsscqynsrsbh: inputValue.toUpperCase(),
    });
  },
  // 出口商品代码
  ckspDm: (param: any) => {
    // 委托纳税人识别号
    const { form } = param;
    const ckspDm = form.getFieldValue('ckspDm');
    const ckbgdh = form.getFieldValue('ckbgdh');
    const ssq = form.getFieldValue('ssq');
    const ckrq1 = form.getFieldValue('ckrq1');
    const sbpc = form.getFieldValue('sbpc');
		// 如果商品代码为空则直接清空商品名称和计量单位
		if (!ckspDm) {
			setCkspxx(form, {});
			return;
		}
    const obj = {
      ckbgdh,
      ckrq1: ckrq1 ? moment(new Date(ckrq1)).format('YYYY-MM-DD'):'',
      ckspDm:  ckspDm ? ckspDm : '',
      slType: "Y",
      ssq,
      sbpc,
    }
    querySpdmXxCjFun(obj, form);
  },
  // 计税金额
  jsje: (param: any) => {
    const { form } = param;
    setZssl(form);
  },
  // 征税率
  zssl: (param: any) => {
    const { form } = param;
    setZssl(form);
  },
  // 退税率
  tsl: (param: any) => {
    const { form } = param;
    setZssl(form);
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
    if(ckbgdh){
      // 走后台接口
      queryBgdByBgdNo21({ckbgdh}).then((res: any) => {
        const {body, code, msg} = res;
        const ssq = form?.getFieldsValue().ssq;
        const sbpc = form?.getFieldsValue().sbpc;
        const dlckhwzmhm = form?.getFieldsValue().dlckhwzmhm;
        if(code === '200'){
          if(body){
            form.setFieldsValue({
              ckrq1: body.ckrq1 ? moment(new Date(body.ckrq1)) : '',
              cksl: body.cksl ? myUtil.text.getNumVal(body.cksl) : '',
              mylaj: body.mylaj ? myUtil.text.getNumVal(body.mylaj) : '',
              ckspDm: body.ckspDm ? body.ckspDm : ''
            });
            const ssq = form?.getFieldsValue().ssq;
            const ywlx = form?.getFieldsValue().cktmsywlxdmjh;
            const obj = {
              ckbgdh,
              ckrq1: body.ckrq1?moment(new Date(body.ckrq1)).format('YYYY-MM-DD'):'',
              ckspDm:  body.ckspDm ? body.ckspDm : '',
              dlckhwzmhm: dlckhwzmhm ? dlckhwzmhm : '',
              sbpc,
              slType: "Y",
              ssq,
              ywlx
            }
            querySpdmXxCjFun(obj, form)
          } else {
            queryDlzmByDlckhwzmhm({ckbgdh}).then((res02: any) => {
              const dlzmData = res02.body;
              if(res02.code === '200') {
                if(res02.body){
                  form.setFieldsValue({
                    ckrq1: dlzmData.ckrq1?moment(new Date(dlzmData.ckrq1)):'',
                    ckspDm: dlzmData.ckspDm?dlzmData.ckspDm:'',
                    sbhgspmc: dlzmData.hgspmc?dlzmData.hgspmc:'',
                  });
                  const obj = {
                    ckbgdh,
                    ckrq1: dlzmData.ckrq1?moment(new Date(dlzmData.ckrq1)):'',
                    ckspDm:  body.ckspDm?body.ckspDm:'',
                    dlckhwzmhm: dlckhwzmhm?dlckhwzmhm:'',
                    sbpc,
                    slType: "Y",
                    ssq,
                  }
                  querySpdmXxCjFun(obj, form)
                }
              }
            })
          }
        } else {
          message.info(msg)
        }
      })
    }
  },
  // 出口日期
  ckrq1: (param: any) => {
    const { form } = param;
    const ckrq1 = myUtil.grid.formatDate(form?.getFieldsValue().ckrq1, 'YYYY');
    const ssq = form?.getFieldsValue().ssq.substring(0,4);
    if(ckrq1 != ssq) {
      message.info('出口日期与申报年月不在同一年度！')
      form.setFieldsValue({
        ckrq1: '',
      });
    } else {
      getSpdmSl(form);
    }
  },
  // 代办退税专用发票号码
  dbtswspzhm: (param: any) => {
    const { form } = param;
    // 计算：给根据代办退税专用发票号码查询发票信息 以及 申报代办退税税额
    // 代办退税专用发票号码
    let dbtswspzhm = form?.getFieldsValue().dbtswspzhm
    // 发票代码10位
    let fpDm;
    // 发票号码8位
    let fphm;
    if (dbtswspzhm && dbtswspzhm.length == 18) {
      fpDm = dbtswspzhm.substring(0, 10);
      fphm = dbtswspzhm.substring(10, 18);
    } else if (dbtswspzhm && dbtswspzhm.length == 20) {
      // edit by yangzq 20211103 数电票改造
      fpDm = '';
      fphm = dbtswspzhm;
    }
    if (fpDm && fphm) {
      queryFpWzxx({ fpDm, fphm }).then((res) => {
        const { code, body } = res;
        if (code === '200' && body) {
        }
        if (res && res.code == '200' && body) {
          // 计税金额
          if (body.jsje) {
            form.setFieldsValue({
              jsje: body.jsje ? myUtil.text.getNumVal(myUtil.text.formatNum(body.jsje, '0,0.00')) : '', // 计税金额
            });
          }
          // 开票日期
          if (body.kprq) {
            form.setFieldsValue({
              kprq: moment(new Date(body.kprq)),
            });
          }
          let tsl = myUtil.text.getNumVal(form?.getFieldsValue().tsl)
          let jsje = myUtil.text.getNumVal(form?.getFieldsValue().jsje)
          let tse = DditCktsFormCommonFunc.util.getComboResult1({
            param1: jsje,
            param2: tsl
          });
          form.setFieldsValue({
            tse: tse ? myUtil.text.getNumVal(myUtil.text.formatNum(tse, '0,0.00')) : '',
          });
          // 行号
          form.setFieldsValue({
            hh: body.hh ? body.hh : '',
          });
          // 跟商品
          getSpdmSl(form);
        }
      })
    }
  },
  // 开票日期
  kprq: (param: any) => {
    const { form } = param;
    getSpdmSl(form);
  },
  // 货物类型代码
  dbtsywlxDm: (param: any) => {
    const { form, value } = param;
    const dbtsywlxmc = myUtil.code.getCodeValByKey(value, 'code_dm_ckts_dbtsywlx:01');
    if (dbtsywlxmc) {
      form.setFieldsValue({ dbtsywlxmc: dbtsywlxmc });
    }
  },
  // 申报商品代码
  sbspDm2: (param: any) => {
    DditCktsFormCommonFunc.eventOnChange.sbspDm2(param);
  },
  // 业务类型代码（原tableSelect）
  cktmsywlxdmjh: (param: any) => {
    DditCktsFormCommonFunc.eventOnChange.cktmsywlxdmjh(param);
  }
}

// 设置商品信息
const setCkspxx = (form: any, obj: any, eleName?: any) => {
  form.setFieldsValue({
    ckspDm: obj.ckspDm || '',
    hgspmc: obj.hgspmc || '',
    hgjldwmc: obj.hgjldwmc || '',
    zssl: myUtil.text.getNumVal(myUtil.text.formatNum(obj.zssl, '0,0.00')) || '',
    tsl: myUtil.text.getNumVal(myUtil.text.formatNum(obj.tsl, '0,0.00')) || '',
  });
}

// 设置征税税率
const setZssl = (form: any) => {
  // 代办退税申报明细
  // 取得计税金额，征税率，退税率，计算税额（公式：计税金额*征税率/100），并赋值给税额控件，计算退税额（公式：计税金额*退税率/100），并赋值给退税额控件
  // 计税金额
  const jsje = myUtil.text.getNumVal(form.getFieldValue('jsje'));
  // 征税率
  // const zssl = myUtil.text.getNumVal(form.getFieldValue('zssl'));
  // 退税率
  const tsl = myUtil.text.getNumVal(form.getFieldValue('tsl'));
  const tse = DditCktsFormCommonFunc.util.getComboResult1({
    param1: jsje,
    param2: tsl
  });
  form.setFieldsValue({
    tse: myUtil.text.getNumVal(myUtil.text.formatNum(tse, '0,0.00')) || '',
  });
}

// 改变调整前的商品名称 代码 出口日期 退税率
const querySpdmXxCjFun = (obj: {}, form: any) => {
  querySpdmXxCj(obj).then((res: any) => {
    const { code, body, msg, desc } = res;
    if (code == '200') {
      const jsje = myUtil.text.getNumVal(form?.getFieldsValue().jsje);
      let tse:any;
      if(jsje) {
        let tsl = myUtil.text.getNumVal(body.tsl)
        tse = DditCktsFormCommonFunc.util.getComboResult1({
          param1: jsje,
          param2: tsl
        });
      }
      form.setFieldsValue({
        ckspDm: body?.ckspDm,
        hgspmc: body?.sbhgspmc,
        hgjldwmc: body?.hgjldwmc,
        tsl: body.tsl ? myUtil.text.getNumVal(body.tsl) : '',
        zssl: body.zssl ? myUtil.text.getNumVal(body.zssl) : '',
        tse: tse ? myUtil.text.getNumVal(myUtil.text.formatNum(tse, '0,0.00')) : '',
      });
    } else {
      message.info(msg || desc)
    }
  })
}

/**
 * @method getSpdmSl
 * @desc 获取商品代码税率
 */
const getSpdmSl = (form: any) => {
  let ckspDm = form?.getFieldsValue().ckspDm
  const sbspDm = form?.getFieldsValue().sbspDm;
  const ckbgdh = form?.getFieldsValue().ckbgdh;
  const sbpc = form?.getFieldsValue().sbpc;
  const ssq = form?.getFieldsValue().ssq;
  if (sbspDm) {
    ckspDm = sbspDm;
  }
  const ckrq1 = myUtil.grid.formatDate(form?.getFieldsValue().ckrq1, 'YYYY-MM-DD');
  const kprq = myUtil.grid.formatDate(form?.getFieldsValue().kprq, 'YYYY-MM-DD');
  if (!ckrq1 || !kprq) {
    return;
  }
  querySpdmXxCj({
    ckspDm,
    ckrq1,
    kprq,
    slType: "Y",
    ckbgdh,
    sbpc,
    ssq,
  }).then((res) => {
    const { code, body, msg } = res;
    if (code != '200' || !body) {
      if (sbspDm) {
        message.info(msg);
        form.setFieldsValue({
          sbspDm: '',
          sbspmc: '',
        });
      } else {
        if (res.desc != '') {
          message.info(res.desc);
        } else {
          message.info('此商品码不存在，请确认后填报！');
        }
        form.setFieldsValue({
          ckspDm: '',
          sbhgspmc: '',
        });
      }
      return;
    }
    // 如果是申报商品代码 只修改退税率
    if (sbspDm) {
      // 设置退税率
      form.setFieldsValue({
        tsl: res.body.tsl ? myUtil.text.getNumVal(myUtil.text.formatNum(res.body.tsl, '0,0.00')) : '',
      });
    } else {
      // 设置退税率
      form.setFieldsValue({
        tsl: res.body.tsl ? myUtil.text.getNumVal(myUtil.text.formatNum(res.body.tsl, '0,0.00')) : '',
        zssl: res.body.zssl ? myUtil.text.getNumVal(myUtil.text.formatNum(res.body.zssl, '0,0.00')) : '',
      });
    }
  });
}
export default Func;
