import React, { useRef }  from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import DDBunit3 from './comm/Zdylb3';
import unitConfig from './config';
import hwslconfig from './hwslconfig';
import func from './func'
import { Tabs } from 'antd';
import './style.less';
import XzMoadl from './modal_index';

const Index: React.FC<unknown> = () => {

  unitConfig.gridParams = {
    initSearchModal: [
      { property: 'mrCkspDm', value: "99", op: 'zdy' },
    ],
  }
  const refXz: any = useRef(); // 环境检测

  func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(refXz);
    return otherRef;
  };

  return <>
    <Tabs defaultActiveKey="hwsl" className="dd_layout_tabs dd_layout_tabs_bzgl">
      <Tabs.TabPane tab="货物税率" key="hwsl" className="hwsl">
       <DDBunit3 config={hwslconfig} func={func} />
       <XzMoadl onRef={refXz} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="应税服务税率" key="ysfwsl" className="ysfwsl">
        <DDBunit2 config={unitConfig} func={func} />
      </Tabs.TabPane>
    </Tabs>
  </>;
};

export default Index;
