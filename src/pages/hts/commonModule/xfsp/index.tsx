import unitConfig from './config';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import Func from './f';
import Yl from './Yl';
import Dy from "./Dy";
import React, {useRef} from "react";

const Jdcx: React.FC<unknown> = () => {

  const ylRef: any = useRef();
  const dyRef: any = useRef();
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(ylRef);
    otherRef.push(dyRef);
    return otherRef;
  };

  return <>
    <DDBunit2 config={unitConfig} func={Func} />
    <Yl onRef={ylRef} />
    <Dy onRef={dyRef} />
  </>
};

export default Jdcx;
