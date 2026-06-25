import dayjs from 'dayjs';
/**
 * title: 生产-出口报关单明细
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
   myConfig.filter_items[1].defaultValue='';

   return <>
     <DDBunit2 config={myConfig} func={Func} />
   </>;
 };
 
 export default Index;