/**
 * title: 出口报关单台账
 */
import dayjs from 'dayjs';
 import React, { useRef } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
 import config from './config';
 import Func from './f';
import myUtil from '@/components/DDAssist/util';
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
   myConfig.grid_filter_quick[0].defaultValue = myUtil.date.getDateYearAgoToNow(1).map((d: string) => dayjs(d));

   return <>
     <DDBunit2 config={config} func={Func} />
     <Fpmx onRef={fpmxRef} />
   </>;
 };
 
 export default Index;