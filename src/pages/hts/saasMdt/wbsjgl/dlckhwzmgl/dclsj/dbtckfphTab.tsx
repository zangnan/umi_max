import React, { useRef } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import unitConfig from './dbtckfphconfig';
import func from './dbtckfphFunc';
import CheckErrModel from '../../common/checkErrModel';

const Index: React.FC<{ data: any, mainref: any }> = ({
  data,
  mainref,
}) => {

  const errorMsgRef: any = useRef();

  func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(errorMsgRef);
    otherRef.push(mainref);
    return otherRef;
  };

  const myConfig = {...unitConfig};
  myConfig.gridParams = {
    initSearchModal: [
      { property: 'cxlx', value: '1', op: 'zdy' },
    ],
  }

  return <>
    <div key={data}>
      <DDBunit2 config={myConfig} func={func} />
      <CheckErrModel onRef={errorMsgRef} />
    </div>
  </>;
};

export default Index;