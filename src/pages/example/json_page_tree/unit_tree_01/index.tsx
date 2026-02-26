import React from 'react';
import DDBunitTree from '@/components/DDBunit/DDBunitTree';
import unitConfig from './config';
import Func from './f';

const index: React.FC<unknown> = () => {
  return <DDBunitTree config={unitConfig} func={Func} />
};

export default index;
