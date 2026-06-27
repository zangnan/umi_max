import { Tabs } from 'antd';
import React from 'react';
import Wtbgxy from './wtbgxy';
import Dlbgfwffp from './dlbgfwffp';




const Index: React.FC<unknown> = () => {
  return (
    <>
      <div>
        <Tabs defaultActiveKey="wtbgxy" destroyInactiveTabPane className="dd_layout_tabs dd_layout_tabs_bzgl">
          <Tabs.TabPane tab="委托报关协议" key="wtbgxy" className="wtbgxy">
            <Wtbgxy />
          </Tabs.TabPane>
          <Tabs.TabPane tab="代理报关服务费发票" key="dlbgfwffp" className="dlbgfwffp">
            <Dlbgfwffp />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </>
  )
};

export default Index;
