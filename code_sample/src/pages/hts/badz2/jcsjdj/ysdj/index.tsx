import { Tabs } from 'antd';
import React from 'react';
import Tyd from './tyd';
import Ysfp from './ysfp';




const Index: React.FC<unknown> = () => {
  return (
    <>
      <div>
        <Tabs defaultActiveKey="tyd" destroyInactiveTabPane className="dd_layout_tabs dd_layout_tabs_bzgl">
          <Tabs.TabPane tab="提运单" key="tyd" className="tyd">
            <Tyd />
          </Tabs.TabPane>
          <Tabs.TabPane tab="运输发票" key="ysfp" className="ysfp">
            <Ysfp />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </>
  )
};

export default Index;
