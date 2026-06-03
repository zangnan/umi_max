import { Tabs } from 'antd';
import React from 'react';
import Dkpbgd from './dkpbgd';
import Tzcx from './tzcx'; 




const Index: React.FC<unknown> = () => {
  return (
    <>
      <div>
        <Tabs defaultActiveKey="dkpbgd" destroyInactiveTabPane className="dd_layout_tabs dd_layout_tabs_bzgl">
          <Tabs.TabPane tab="待开票报关单" key="dkpbgd" className="dkpbgd">
            <Dkpbgd />
          </Tabs.TabPane>
          <Tabs.TabPane tab="台账查询" key="tzcx" className="tzcx">
            <Tzcx />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </>
  )
};

export default Index;
