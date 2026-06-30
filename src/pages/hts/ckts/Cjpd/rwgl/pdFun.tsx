import React from 'react';
import { message } from 'antd';
import { intl as intl2 } from '@/components/DDAssist/util';

const pdFun: any = {
  unitRef: React.createRef(),
};

/* 1、“筛选发票”交互界面，点击“添加”按钮时，“筛选发票”页面不关闭。（注意：重复添加一条发票时，不要增长）
      bgdpd:
            param:原存放数据数组
            param2:新添加的数据
*/
pdFun.bgdpd = (param: any, param2: any,value: any) => {
  const param3= [...param2];
  for(let i = 0; i < param3.length; i++){
    param3[i].jsje2 = param3[i].syje;
    if(value == 1){
      param3[i].ckjhsl =param3[i].fpsysl;
    }else{
      param3[i].ckjhsl =0;
    }
  }
  if (param.length == 0) {
    return param3;
  }
  param3.map((value: any) => {
    param.push(value);
  });
  let rtnParam: any = [];
  for (let i = 0; i < param.length - 1; i++) {
    for (let j = i + 1; j < param.length; j++) {
      if (param[i].uuid == param[j].uuid) {
        param.splice(j, 1)
        j--
      }
    }
  }
  rtnParam = [...param];
  return rtnParam;
};


/* 1、生成明细
      param:
            jcxx:基础信息
            ckxx:出口信息
            fpxx：发票信息
*/
pdFun.scmxCheck = (jcxx: any, ckxx: any,fpxx: any,jshuiSl: any) => {
  //校验①：发票数据不可为空；
  if(fpxx.length==0){
    message.info(intl2.formatMessage({ id: 'message_mts_no_data_fpsjnotnullPd' }));
    return false;
  }
  //校验②：报关单出口日期与申报年月年份应一致；
  const ssq = jcxx.ssq?.substr(0,4);
  const ckrq1 = ckxx?.ckrq1?.substr(0,4);
  if(ssq != ckrq1){
    message.info(intl2.formatMessage({ id: 'message_bgdpd_nf_checkPd' }));
    return false;
  }
  //校验④：发票数量与出口信息法定数量、成交数量、第二计量单位数量其一应相等；
  const cksl = ckxx.cksl; // 法定单位数量
  const cjsl1 = ckxx.sbsl1; // 成交数量
  const decksl = ckxx.decksl; // 第二单位数量
  let slType = '';
  if(cksl > 0 && cksl == jshuiSl) {
    slType = 'fp';
  } else if (cjsl1 > 0 && cjsl1 == jshuiSl) {
    slType = 'cj';
  } else if (decksl > 0 && decksl == jshuiSl) {
    slType = 'd2';
  } else {
    message.info(intl2.formatMessage({ id: 'message_bgdpd_sl_checkPd' }));
    return false;
  }

  //校验③：数量、金额必填、不能为0、数值型校验；
  for(let i=0;i<fpxx.length;i++){
    if(fpxx[i].sl==0 || fpxx[i].pdje == 0){
      message.info(intl2.formatMessage({ id: 'message_bgdpd_slorje_check' }));
      return false;
    }
  }
  return slType;
};
export default pdFun;
