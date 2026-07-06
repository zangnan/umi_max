import { intl } from '@/components/DDAssist/util';
import unitConfig from './config';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import Func from './f';
import React from 'react';


const Jdcx: React.FC<unknown> = () => {
  Func.intl = intl;

  return <DDBunit2 config={unitConfig} func={Func}/>;
};

export default Jdcx;