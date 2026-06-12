import React from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import unitConfig from './ref-uses-config-not-myconfig.actual';
import Func from './ref-uses-config-not-myconfig.actualFun';

const Unit: React.FC<unknown> = () => {
  // 改变默认配置项
  const myConfig = { ...unitConfig };
  // 导入
  myConfig.import_key = 'TEST_IMPORT';
  myConfig.toolbar_default.tssb_download = true;
  myConfig.toolbar_default.ckts_download = false;

  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>;
};
export default Unit;
