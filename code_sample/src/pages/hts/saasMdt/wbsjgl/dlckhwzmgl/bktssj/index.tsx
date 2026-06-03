// 出口报关单管理-代理出口-不退税数据
import React  from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from './bktssjConfig';
import Func from './bktssjFunc';

const Index: React.FC = () => {

  const myConfig = {...config};
  myConfig.gridParams = {
    initSearchModal: [
      { property: 'cxlx', value: '5', op: 'zdy' },
    ]
  }
  

  return (
    <div>
      <DDBunit2 config={myConfig} func={Func} />
    </div>
  );
}

export default Index;
