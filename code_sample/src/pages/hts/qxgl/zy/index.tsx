import React, { useRef, }  from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import unitConfig from './zyconfig';
import Func from './zyFunc';
import Add from './add';

const Index: React.FC = () => {

  const addRef: any = useRef();
  const config = {...unitConfig};
  const zyFunc = {...Func};


  zyFunc.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(addRef);
    return otherRef;
  };
  return (
    <>          
      <DDBunit2 config={config} func={zyFunc} />
      <Add onRef={addRef} />
    </>

  );
}

export default Index;
