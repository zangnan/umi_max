import React from 'react';
import { message } from 'antd';
import { intl as intl2 } from '@/components/DDAssist/util';
import moment from 'moment';

const pdFun: any = {
  refUnit: React.createRef(),
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
  let rtnParam: any = [];
  if (param.length == 0) {
    rtnParam = [...param3];
    for(let i = 0; i<rtnParam.length;i++) {
      rtnParam[i]['ycksl'] = rtnParam[i].cksl;
      rtnParam[i]['ymylaj'] = rtnParam[i].mylaj;
      rtnParam[i]['yrmblaj'] = rtnParam[i].rmblaj;
      rtnParam[i].cksl = rtnParam[i].kycksl;
      rtnParam[i].mylaj = rtnParam[i].kymylaj;
      rtnParam[i].rmblaj = rtnParam[i].kyrmblaj;
    }
    return param3;
  }
  param3.map((value: any) => {
    param.push(value);
  });

  for (let i = 0; i < param.length - 1; i++) {
    for (let j = i + 1; j < param.length; j++) {
      if (param[i].uuid == param[j].uuid) {
        param.splice(j, 1)
        j--
      }
    }
  }
  rtnParam = [...param];
  for(let i = 0; i<rtnParam.length;i++) {
    rtnParam[i]['ycksl'] = rtnParam[i].cksl;
    rtnParam[i]['ymylaj'] = rtnParam[i].mylaj;
    rtnParam[i]['yrmblaj'] = rtnParam[i].rmblaj;
    rtnParam[i].cksl = rtnParam[i].kycksl;
    rtnParam[i].mylaj = rtnParam[i].kymylaj;
    rtnParam[i].rmblaj = rtnParam[i].kyrmblaj;
  }
  return rtnParam;
};

/* 1、生成明细
      param:
            jcxx:基础信息
            ckxx:出口信息
            fpxx：发票信息
*/
pdFun.scmxCheck = (jcxx: any, ckxx: any,fpxx: any) => {
  let flagSsq = true;
  let flagFp = '';
  let dwArry: any = [];
  //校验②：申报的出口日期与所属期不在同一年度
  const ssq = jcxx.ssq?.substr(0,4);
  const ckfph = jcxx?.ckfph;

  fpxx.forEach((item:any) => {
    const ckrq1 = moment(new Date(Number(item.ckrq1))).format('YYYY');
    if(ssq != ckrq1){
      flagSsq = false;
    }
    if((!ckfph || ckfph == '') && (item.ckhth == '' || !item.ckhth)){
      flagFp = item.ckbgdh;
    }
    dwArry.push(item.hgjldwmc)
  });
  if(!flagSsq) {
    message.info(intl2.formatMessage({ id: 'message_bgdpd_nf_checkPd' }));
    return false;
  }
  // 校验出口发票，出口合同号 -- bug 23479
  // if(flagFp) {
  //   message.info(`出口报关单号：${flagFp}出口合同号为空，请填写出口发票号！`)
  //   return false;
  // }

  // 选定的报关单需要保持单位一致！
  if(dwArry.length> 0) {
    let result = dwArry.every((item:any) => item === dwArry[0])
    if(!result){
      message.info(`选定的报关单需要保持单位一致！`)
      return false;
    }
  }


  return true;
};

export default pdFun;
