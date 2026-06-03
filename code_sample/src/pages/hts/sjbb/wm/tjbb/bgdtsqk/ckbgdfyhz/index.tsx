/**
 * title: 出口报关单台账
 */
 import React, { useRef } from 'react';
 import DDBunit2 from '@/components/DDBunit/DDBunit2';
 import config from './config';
 import Func from './f';
 import myUtil from '@/pages/common/myUtil';
 import DrawerList from './drawer_list';
 const Index: React.FC<unknown> = () => {
 
   // 设置日期
   const myConfig = { ...config }

   const drawerRef: any = useRef();
   Func.getOtherRef = () => {
     const otherRef = [];
     otherRef.push(drawerRef);
     return otherRef;
   };

   myConfig.grid_filter_quick[0].defaultValue = myUtil.date.getDateYearAgoToNow(1);
   return <>
     <DDBunit2 config={config} func={Func} />
     <DrawerList onRef={drawerRef} />
   </>;
 };
 
 export default Index;