/**
 * title: 出口报关单台账
 */
import React from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from './config';
import Func from './f';
import moment from 'moment';
import myUtil from '@/pages/common/myUtil';

const Index: React.FC<unknown> = () => {

  // 设置日期
  const myConfig = { ...config }
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

  myConfig.grid_filter_quick[0].defaultValue = [timeQ, timeZ];
  myConfig.grid_filter_quick[0].allowClear = false;
  return <>
    <DDBunit2 config={config} func={Func} />
  </>;
};

export default Index;