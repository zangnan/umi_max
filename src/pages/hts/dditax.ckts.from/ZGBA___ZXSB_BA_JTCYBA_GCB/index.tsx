/**
 * title: 集团公司成员企业备案
 */
import React from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import config from './auto_config';
import Func from './f'
const index: React.FC<unknown> = () => {

  const myConfig = { ...config };
  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>
};
export default index;