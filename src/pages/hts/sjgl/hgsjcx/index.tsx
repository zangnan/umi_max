import unitConfig from './config';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import Func from './f';
import React from 'react';

const Jdcx: React.FC<unknown> = () => {
  return <>     
   <DDBunit2 config={unitConfig} func={Func}/>
  </>
};

export default Jdcx;