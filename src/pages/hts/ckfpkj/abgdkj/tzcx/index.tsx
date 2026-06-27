import React from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import config from './config';
import Func from './f'
import { cloneDeep } from 'lodash';

const index: React.FC<unknown> = () => {

  const myConfig = cloneDeep(config);

  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>
};
export default index;