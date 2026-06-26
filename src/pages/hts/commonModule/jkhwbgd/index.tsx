import React, { useRef }  from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import config from './config';
import Func from './f';
import Dy from './dy';
import Hgbgd from './jkhgbgd';

const Index: React.FC = () => {
  const myconfig = { ...config };

  const dy: any = useRef();
  const hgbgdRef: any = useRef();

    Func.getOtherRef = () => {
      const otherRef = [];
      otherRef.push(dy);
      otherRef.push(hgbgdRef);
      return otherRef;
    };

  return (
    <div>
      <DDBunit2 config={myconfig} func={Func} />
      <Dy onRef={dy} />
      <Hgbgd onRef={hgbgdRef} />
    </div>
  );
}

export default Index;
