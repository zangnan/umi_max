/**
 * title: 视同自产进货明细清单
 * author: wx
 */
import React from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import config from './auto_config';
import Func from './f'
const index: React.FC<unknown> = () => {

  const myConfig = { ...config };
  // 导入
  myConfig.import_key = 'SAAS_TSSB_MXCJ_STZC_DR';
  config.toolbar_default.tssb_download = true;
  config.toolbar_default.ckts_download = false;
  
  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>
};
export default index;