/**
 * title: 代办退税应退税款明细
 * author: wx
 */
import React from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import config from './auto_config';
import Func from './f'
const index: React.FC<unknown> = () => {

  const myConfig = { ...config };
  myConfig.module_key = 'DBTS_ZXSB_SB_DB_DBTSYTSKMX_F'; // 业务单元key，对应后端接口
  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>
};
export default index;