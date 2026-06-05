import React from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import unitConfig from './monthDataConfig';
import Func from './monthDataFun';

const Unit: React.FC<unknown> = () => {
  // 改变默认配置项
  const myConfig = { ...unitConfig };
  myConfig.gridParams = {
    initSearchModal: [ { property: 'tjqlxDm', value: '1', op: 'zdy' } ],
  };

  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>;
};
export default Unit;
