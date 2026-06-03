/**
 * title: 出口报关单台账
 */
 import React from 'react';
 import DDBunit2 from '@/components/DDBunit/DDBunit2';
 import config from './config';
 import Func from './f';
 import myUtil from '@/pages/common/myUtil';
 
 const Index: React.FC<unknown> = () => {
 
   // 设置日期
   const myConfig = { ...config }
   myConfig.grid_filter_quick[0].defaultValue = myUtil.date.getDateYearAgoToNow(1);

   return <>
     <DDBunit2 config={config} func={Func} />
   </>;
 };
 
 export default Index;