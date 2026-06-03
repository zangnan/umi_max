import { Tabs } from 'antd';
import React from 'react';
import Ckxsht from './ckxsht';
import Ghht from './ghht';
import Wmzhfwht from './wmzhfwht';




const Index: React.FC<unknown> = () => {
  return (
    <>
      <div>
        <Tabs defaultActiveKey="ckxsht" destroyInactiveTabPane className="dd_layout_tabs dd_layout_tabs_bzgl">
          <Tabs.TabPane tab="出口销售合同" key="ckxsht" className="ckxsht">
            <Ckxsht />
          </Tabs.TabPane>
          <Tabs.TabPane tab="购货合同" key="ghht" className="ghht">
            <Ghht />
          </Tabs.TabPane>
          <Tabs.TabPane tab="外贸综合服务合同" key="wmzhfwht" className="wmzhfwht">
            <Wmzhfwht />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </>
  )
};

export default Index;
