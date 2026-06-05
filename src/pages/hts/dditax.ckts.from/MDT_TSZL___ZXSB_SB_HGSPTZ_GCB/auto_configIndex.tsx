import React from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import unitConfig from './auto_config';
import Func from './auto_configFun';

const Unit: React.FC<unknown> = () => {
  return <>
    <DDBunit2 config={unitConfig} func={Func} />
  </>;
};
export default Unit;
