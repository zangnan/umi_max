import React from 'react';
import cktsUtil from '@/pages/hts/cktsUtil';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import unitConfig from './auto_config';
import Func from './auto_configFun';

const Unit: React.FC<unknown> = () => {
  // 改变默认配置项
  const myConfig = { ...unitConfig };
  // 导入
  myConfig.import_key = 'SAAS_TSSB_MXCJ_HGSPTZ_SC_DR';
  myConfig.toolbar_default.tssb_download = true;
  myConfig.toolbar_default.ckts_download = false;
  myConfig.gridParams = {
    initSearchModal: [
      { property: 'lcswsxDm', value: cktsUtil.getLcswsxDm(myConfig.unit_constant), op: 'al' },
    ],
  };

  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>;
};
export default Unit;
