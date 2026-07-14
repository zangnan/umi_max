/**
 * title: 出口报关单台账
 */
import dayjs from 'dayjs';
import React, { useState, useEffect, useRef } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import config from './config';
import configsb from './configsb';
import configkj from './configkj';
import Func from './f';
import { history } from 'umi';

import moment from 'moment';
import myUtil from '@/components/DDAssist/util';
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
    timeQ = dayjs(myUtil.date.getYearBeforeCurr(0) + '-01-01');
  } else {
    timeQ = dayjs(myUtil.date.getYearBeforeCurr(1) + '-' + newMonth + '-01');
  }
  timeZ = dayjs(myUtil.date.accurateDate(new Date().getTime()));


  myConfig.filter_items[0].defaultValue = [dayjs(timeQ), dayjs(timeZ)];
  myConfig.filter_items[0].allowClear = false;

  return <DDBunit2 config={myConfig} func={Func} />
  
};

export default Index;