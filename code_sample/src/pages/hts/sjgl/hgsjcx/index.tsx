import unitConfig from './config';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import Func from './f';
import React from 'react';

const Jdcx: React.FC<unknown> = () => {
  return <>     
   <DDBunit2 config={unitConfig} func={Func}/>
  </>
};

export default Jdcx;