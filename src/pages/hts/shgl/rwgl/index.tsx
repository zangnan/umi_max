import React, { useRef } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import config from './config';
import Func from './f';
import MxMoadl  from './rwmx';

export type ShrwglProps = {
  data?: any;
}

const Shrwgl: React.FC<ShrwglProps> = ({
  data,
}) => {
  const myConfig = {...config};
  const refCkmx: any = useRef(); // 环境检测

  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(refCkmx);
    return otherRef;
  };
  return (
    <>
    <DDBunit2 config={myConfig} func={Func} />
    <MxMoadl onRef={refCkmx}/>
  </>
  );
};
export default Shrwgl;
