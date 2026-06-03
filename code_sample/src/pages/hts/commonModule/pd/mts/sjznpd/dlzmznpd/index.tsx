import React, { useRef } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from './config';
import Func from './f';
import Dlzmpd from './dlzmpd';
import Fpjejyjg from '../bgdzxpd/fpjejyjg';

const Dlzmznpd: React.FC<unknown> = () => {

  const myConfig = {...config};

  myConfig.gridParams = {
    initSearchModal: [
      {property: "pdFlag", value: "Y", op: "al"},
    ],
  }

  const dlzmpdRef: any = useRef();
  const fpjejyjgRef: any = useRef();

  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(dlzmpdRef);
    otherRef.push(fpjejyjgRef);
    return otherRef;
  };

  return (
    <>
    <DDBunit2 config={myConfig} func={Func} />
    <Dlzmpd onRef={dlzmpdRef} />
    <Fpjejyjg onRef={fpjejyjgRef} />
  </>
  );
};
export default Dlzmznpd;
