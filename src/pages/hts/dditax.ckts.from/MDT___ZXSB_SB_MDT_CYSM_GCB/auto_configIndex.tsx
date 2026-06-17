/**
 * title: 出口货物离岸价差异原因说明表
 * author: wx
 */
import React from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import config from './auto_config';
import Func from './f'
const index: React.FC<unknown> = () => {

  const myConfig = { ...config };
  // 导入
  myConfig.import_key = 'SAAS_TSSB_MXCJ_CYSM_DR';
  myConfig.toolbar_default.tssb_download = true;
  myConfig.toolbar_default.ckts_download = false;

  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>
};
export default index;