/**
 * title: 核销申报数据管理-已核销调整表
 * creator: zxy
 */
import React from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import yhxtzConfig from './yhxtzconfig';
import Func from './fyhxtz';

const Yhxtz: React.FC<unknown> = () => {
  const config = { ...yhxtzConfig };
  return <>
    <DDBunit2 config={config} func={Func}/>
  </>
};

export default Yhxtz;