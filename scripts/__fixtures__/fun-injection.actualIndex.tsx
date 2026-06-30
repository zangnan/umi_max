import React from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import unitConfig from './fun-injection.actual';
import Func from './fun-injection.actualFun';

const Unit: React.FC<unknown> = () => {
  return <>
    <DDBunit2 config={unitConfig} func={Func} />
  </>;
};
export default Unit;
