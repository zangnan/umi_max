import React, { useRef } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import unitConfig from './dqryfConfig';
import func from './dqryfFunc';
import Hgbgd from '@/pages/hts/commonModule/ckhwbgd/Yl';
import CheckErrModel from '../../common/checkErrModel';

const Index: React.FC<{ data: any, mainref: any }> = ({
  data,
  mainref,
}) => {

  const hgbgdRef: any = useRef();
  const errRef: any = useRef();

  func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(hgbgdRef);
    otherRef.push(mainref);
    otherRef.push(errRef);
    return otherRef;
  };

  const myConfig = {...unitConfig};
  myConfig.gridParams = {
    initSearchModal: [
      { property: 'cxlx', value: '4', op: 'zdy' },
    ],
  }

  return <>
    <div key={data}>
      <DDBunit2 config={myConfig} func={func} />
      <Hgbgd onRef={hgbgdRef} />
      <CheckErrModel onRef={errRef} />
    </div>
  </>;
};

export default Index;