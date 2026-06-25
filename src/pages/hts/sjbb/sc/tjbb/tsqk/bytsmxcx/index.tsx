/**
 * title: 出口报关单台账
 */
import React from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import config from './config';
import configsb from './configsb';
import configkj from './configkj';
import Func from './f';
import { history } from 'umi';
import moment from 'moment';
import myUtil from '@/components/DDAssist/util';


const Index: React.FC<unknown> = () => {


  let myConfig;
  if (history?.location?.pathname === '/hts/sjbb/sc/tjbb/tsqk/bytsmxcx') {
    myConfig = { ...config };
  } else if (history?.location?.pathname === '/hts/sjbb/sc/tjbb/tsqk/bytsmxcxsb') {
    myConfig = { ...configsb };
  } else {
    myConfig = { ...configkj };
  }

  // 设置日期例如（20210801-当前日（20220729）。）
  let timeQ, timeZ;
  const time = new Date();
  const nowMonth = time.getMonth();
  let newMonth = (nowMonth + 1) < 10 ? '0' + (nowMonth + 2) : nowMonth + 2;
  if (newMonth === 13) {
    timeQ = moment(myUtil.date.getYearBeforeCurr(0) + '-01-01');
  } else {
    timeQ = moment(myUtil.date.getYearBeforeCurr(1) + '-' + newMonth + '-01');
  }
  timeZ = moment(myUtil.date.accurateDate(new Date().getTime()));


  myConfig.filter_items[0].defaultValue = [timeQ, timeZ];
  myConfig.filter_items[0].allowClear = false;

  return <DDBunit2 config={myConfig} func={Func} />

};

export default Index;