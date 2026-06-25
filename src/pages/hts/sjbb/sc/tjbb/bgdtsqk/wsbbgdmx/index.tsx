import dayjs from 'dayjs';
/**
 * title: 出口报关单台账
 */
 import React from 'react';
 import DDBunit2 from '@/components/DDBunit/DDBunit2';
 import config from './config';
 import Func from './f';
 import myUtil from '@/components/DDAssist/util';
 
 const Index: React.FC<unknown> = () => {
 
   // 设置日期
   const myConfig = { ...config }
   myConfig.grid_filter_quick[0].defaultValue = myUtil.date.getDateYearAgoToNow(1).map((d: string) => dayjs(d));

   return <>
     <DDBunit2 config={config} func={Func} />
   </>;
 };
 
 export default Index;