/**
 * title: 出口报关单台账
 */
import React, { useState, useEffect, useRef } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from './config';
import configsb from './configsb';
import configkj from './configkj';
import Func from './f';
import { history } from 'umi';

import moment from 'moment';
import myUtil from '@/pages/common/myUtil';
const Index: React.FC<unknown> = () => {


  let myConfig;
  if (history?.location?.pathname === '/hts/sjbb/sc/tjbb/tsqk/zbblmxcx') {
    myConfig = { ...config };
  }else if(history?.location?.pathname === '/hts/sjbb/sc/tjbb/tsqk/zbblmxcxsb'){
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