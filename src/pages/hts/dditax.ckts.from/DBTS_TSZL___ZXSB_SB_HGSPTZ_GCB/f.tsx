/**
 * title: 海关出口商品代码、名称、退税率调整对应表录入
 * author:
 * relation: TSZL_ZXSB_SB_HGSPTZ_G、TSZL_ZXSB_SB_HGSPTZ_G
 */
import React from 'react';
import myUtil from '@/components/DDAssist/util';
import { querySpdmXxCj, queryBgdByBgdNo21, queryCkspTzqspm, queryDlzmByDlckhwzmhm } from '@/pages/hts/services/htsApi';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { message } from 'antd';
import moment from 'moment';

const Func: any = {
  refUnit: React.createRef(),
};

Func.validator = {
  // 所属期
  ssq01: (form: any) => {
    return DditCktsFormCommonFunc.validator.ssq01(form);
  },
  // 所属期
  ssq02: (form: any) => {
    return DditCktsFormCommonFunc.validator.ssq02(form);
  },
  // 申报批次
  sbpc02: (form: any) => {
    return DditCktsFormCommonFunc.validator.sbpc02(form);
  },
  // 申报序号
  sbxh02: (form: any) => {
    return DditCktsFormCommonFunc.validator.sbxh02(form);
  },
  // 调整后商品代码
  tzhckspDm01: (form: any) => {
    return DditCktsFormCommonFunc.validator.tzhckspDm01(form);
  },
  // 调整后退税率
  ggslqzfw01: (form: any) => {
    return DditCktsFormCommonFunc.validator.ggslqzfw01(form);
  },
  // 调整前（报关单上列明的）退税率
  setZero: (form: any) => {
    return DditCktsFormCommonFunc.validator.setZero(form);
  },
}

// 表单页面onChange事件
Func.eventOnChange = {
  // 出口报关单号
  ckbgdh: (param: any) => {
    // 该报关单号当期出口明细中不存在
    const { form } = param;
    const ssq = form?.getFieldsValue().ssq;
    const sbpc = form?.getFieldsValue().sbpc;
    const ckbgdh = form?.getFieldsValue().ckbgdh
    if(ckbgdh){
      // 走后台接口
      queryBgdByBgdNo21({ckbgdh}).then((res: any) => {
        const {body, code, msg} = res;
        const dlckhwzmhm = form?.getFieldsValue().dlckhwzmhm;
        const cktmsywlxdmjh = form?.getFieldsValue().cktmsywlxdmjh;
        if(code === '200'){
          if(body){
            form.setFieldsValue({
              ckrq1: body.ckrq1?moment(new Date(body.ckrq1)):'',
              ckspDm: body.ckspDm?body.ckspDm:'',
              sbhgspmc: body.hgspmc?body.hgspmc:''
            });
            const obj = {
              ckbgdh,
              ckrq1: body.ckrq1?moment(new Date(body.ckrq1)).format('YYYY-MM-DD'):'',
              ckspDm:  body.ckspDm?body.ckspDm:'',
              dlckhwzmhm: dlckhwzmhm?dlckhwzmhm:'',
              ywlx: cktmsywlxdmjh,
              sbpc,
              slType: "Y",
              ssq,
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
                    ckrq1: dlzmData.ckrq1?moment(new Date(dlzmData.ckrq1)).format('YYYY-MM-DD'):'',
                    ckspDm:  body.ckspDm?body.ckspDm:'',
                    dlckhwzmhm: ckbgdh?ckbgdh:'',
                    ywlx: cktmsywlxdmjh,
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
}

Func.eventOnFocus = {
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
  // 调整前（报关单上列明的）商品代码
  ckspDm: (param: any) => {
    // 出口日期不能为空.........等等等校验.......
    // 根据调整后商品代码带出名称, 校验是否为无效商品代码
    const { form } = param;
    const ckspDm = form.getFieldsValue().ckspDm
    const ssq = form.getFieldsValue().ssq;
    let ckrq1 = form.getFieldsValue().ckrq1;
    if(ckspDm) {
      if(ckrq1) {
        ckrq1 = moment(ckrq1).format('YYYY-MM-DD');
      } else  if (!ckrq1 && ssq) {
        ckrq1 = ssq.substr(0, 4) + '-' + ssq.substr(4, 6) + '-01';
      }
      const obj = {
        ckrq1,
        ckspDm,
      }
      queryCkspTzqspm(obj).then((res: any) => {
        if (res.code == '200') {
          form.setFieldsValue({
            sbhgspmc: res.body.ckspmc,
            tsl: myUtil.text.getNumVal(myUtil.text.formatNum(res.body.tsl, '0, 0.0000')),
          });
        } else if(res.code == '900') {
          message.info(res.msg)
          form.setFieldsValue({
           sbhgspmc: '',
            tsl: 0,
           ckspDm: '',
          });
        } else {
          form.setFieldsValue({
           sbhgspmc: '',
            tsl: 0,
           ckspDm: '',
          });
          message.error(res.desc)
        }
      })
    } else {
      form.setFieldsValue({
       sbhgspmc: '',
        tsl: 0,
       ckspDm: '',
      });
    }
  },
  // 调整后商品代码
  tzhckspDm: (param: any) => {
    DditCktsFormCommonFunc.eventOnChange.tzhckspDm(param);
  },
}

// 新建表单初始化
Func.initAddForm = (param: any) => {
  DditCktsFormCommonFunc.initAddForm(param);
}

// 改变调整前的商品名称 代码 出口日期 退税率
const querySpdmXxCjFun = (obj: {}, form: any) => {
  querySpdmXxCj(obj).then((res: any) => {
    const { body } = res;
    if (res.code == '200') {
      form.setFieldsValue({
        sbhgspmc: body?.sbspmc,
        tsl: body.tsl? myUtil.text.getNumVal(myUtil.text.formatNum(body.tsl, '0, 0.0000')) :'',
      });
    } else if(res.code == '900') {
      message.info(res.msg)
    } else {
      message.error(res.desc)
    }
  })
}


export default Func;