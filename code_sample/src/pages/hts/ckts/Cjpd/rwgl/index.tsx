import React, { useRef } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from './config';
import Func from './f';
import GeneratedData from '@/pages/hts/commonModule/pd/mts/sjznpd/tzpd/pdrwqk/ckrwmx/rwmxcx';
import XqMoadl from '@/pages/hts/commonModule/pd/mts/sjznpd/tzpd/pdrwqk/rwxq/rwxq';
import CjpdMoadl  from './Cjpd/index';
import CjpdRwxq  from './Cjpd/rwxq';


export type PdrwProps = {
  children?: any;
}

const Tzpd: React.FC<PdrwProps> = ({
  children,
}) => {

  const myConfig = {...config};
  const refGeneratedData: any = useRef(); 
  const refRwxq: any = useRef();
  const refCjpdMoadlRef: any = useRef();
  const refCjpdRwxqRef: any = useRef();

  
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(refGeneratedData);
    otherRef.push(refRwxq);
    otherRef.push(refCjpdMoadlRef);
    otherRef.push(refCjpdRwxqRef);

    return otherRef;
  };

  

  return (
    <>
    <DDBunit2 config={myConfig} func={Func} />
    <GeneratedData onRef={refGeneratedData}/>
    <XqMoadl onRef={refRwxq} />
    <CjpdMoadl onRef={refCjpdMoadlRef} />
    <CjpdRwxq onRef={refCjpdRwxqRef} />


    
  </>
  );
};
export default Tzpd;
