import unitConfig from './config';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import Func from './f';
import React from 'react';
import { useIntl } from 'umi';


const Jdcx: React.FC<unknown> = () => {
  Func.intl = useIntl();

  return <DDBunit2 config={unitConfig} func={Func}/>;
};

export default Jdcx;