// 消费税发票管理-已使用数据
import React from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from '../ksysj/config';
import Func from '../ksysj/f';

const Index: React.FC = () => {

  const myConfig = {...config};
  myConfig.gridParams = {
    initSearchModal: [
      { property: 'ksybz', value: 'N', op: 'zdy' },
    ]
  }
  
  return (
    <div>
      <DDBunit2 config={myConfig} func={Func} />
    </div>
  );
}

export default Index;
