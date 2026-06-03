import React, { useRef } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import unitConfig from './config';
import func from './func'
import { cloneDeep } from 'lodash';
import ModalBadzml from '../common/ml';
import ZdppBgd from '../common/zdpp/zdppBgd';


const Index: React.FC<unknown> = () => {

  const modalBadzmlRef: any = useRef();
  const zdppBgdRef: any = useRef();

  let myConfig = cloneDeep(unitConfig);

  func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(modalBadzmlRef);
    otherRef.push(zdppBgdRef);
    return otherRef;
  };
  return <>
    <DDBunit2 config={myConfig} func={func} />
    <ModalBadzml onRef={modalBadzmlRef} type={'zdcc'}  />
    <ZdppBgd onRef={zdppBgdRef} />
  </>;
};

export default Index;
