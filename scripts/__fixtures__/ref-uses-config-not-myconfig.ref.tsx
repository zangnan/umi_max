import React from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from './auto_config';
import Func from './f';

const index: React.FC<unknown> = () => {
  const myConfig = { ...config };
  // 导入
  myConfig.import_key = 'TEST_IMPORT';
  config.toolbar_default.tssb_download = true;
  config.toolbar_default.ckts_download = false;

  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>;
};
export default index;
