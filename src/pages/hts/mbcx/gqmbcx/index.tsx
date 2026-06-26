import React from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import unitConfig from './config';
import func from './func'

const Index: React.FC<unknown> = () => {

  const myConfig = { ...unitConfig };
  myConfig.gridParams = {
    initSearchModal: [
      { property: 'yxbz', value: "Y", op: 'al' },
    ],
  }

  return <>
    <DDBunit2 config={myConfig} func={func} />
  </>;
};

export default Index;
