/**
 * title: 出口报关单台账
 */
 import React, { useRef } from 'react';
 import DDBunit2 from '@/components/DDBunit/DDBunit2';
 import config from './config';
 import Func from './f';
 import myUtil from '@/pages/common/myUtil';
 import Fpmx from './drawer_list';


 const Index: React.FC<unknown> = () => {

  const fpmxRef: any = useRef();

  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(fpmxRef);
    return otherRef;
  };

   // 设置日期
   const myConfig = { ...config }
   myConfig.grid_filter_quick[0].defaultValue = myUtil.date.getDateYearAgoToNow(1);

   return <>
     <DDBunit2 config={config} func={Func} />
     <Fpmx onRef={fpmxRef} />
   </>;
 };
 
 export default Index;