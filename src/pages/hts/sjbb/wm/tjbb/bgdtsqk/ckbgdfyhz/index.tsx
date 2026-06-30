/**
 * title: 出口报关单台账
 */
import dayjs from 'dayjs';
 import React, { useRef } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
 import config from './config';
 import Func from './f';
import myUtil from '@/components/DDAssist/util';
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

   myConfig.grid_filter_quick[0].defaultValue = myUtil.date.getDateYearAgoToNow(1).map((d: string) => dayjs(d));
   return <>
     <DDBunit2 config={config} func={Func} />
     <DrawerList onRef={drawerRef} />
   </>;
 };
 
 export default Index;