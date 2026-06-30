import React, { useRef } from 'react';
import Func from './f';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import Yl from "@/pages/hts/commonModule/zzszyfp/Yl";
import { history } from 'umi';
import fpConfig from './fpxxConfig';
import spConfig from './spxxConfig';


const Index: React.FC<unknown> = () => {
  const YlRef: any = useRef();

  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(YlRef);
    return otherRef;
  };
  let myconfig: any = {};

  // 发票信息w
  if (history?.location?.pathname.indexOf('/02/0212') > -1) {
    myconfig = { ...fpConfig };
  } else {
    // 商品信息
    myconfig = { ...spConfig };
  }

  return (
    <div>
      <DDBunit2 config={myconfig} func={Func} />
      <Yl onRef={YlRef} />
    </div>
  )
};

export default Index;
