// 出口发票开具-出口发票开具-发票作废（new）
import React from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import unitConfig from './zxzfConfig';
import func from './zxzfFunc';
import myUtil from '@/components/DDAssist/util';
import unitConfigDc from './dckpConfig';
import funcDc from './dckpFunc';

const Index: React.FC<unknown> = () => {
  let myConfig = {...unitConfig};
  let myFunc = {...func}
  const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ:01'); // 发票配置的码表
  const tempCode = temp[0];

  if(tempCode && tempCode?.fpkjfsDm === '2') {
    myConfig = {...unitConfig};
    myFunc = {...func};
  } else if(tempCode && tempCode?.fpkjfsDm === '1') {
    myConfig = {...unitConfigDc};
    myFunc = {...funcDc};
  }

  return <>
    <DDBunit2 config={myConfig} func={myFunc} />
  </>;
};

export default Index;
