/**
 * 外商付汇关系管理
 */
import React, { useState } from 'react';
import { Tabs } from 'antd';
import Fhrpz from './fhrpz/index'
import Jwshrpz from './jwshrpz/index'

const Index: React.FC<{ data: any }> = ({
  data,
}) => {

  const [activeKey, setActiveKey] = useState<string>('fhrpz'); // 当前活动tab

  const tabCallback = (key: any) => {
    
    Promise.all([])
      .finally(() => {
        setActiveKey(key);
      });
  };

  return (
    <div>
      <Tabs
              activeKey={activeKey}
              onChange={tabCallback}
              destroyInactiveTabPane
              className="dd_layout_tabs dd_layout_tabs_bzgl"
            >
        <Tabs.TabPane tab="付汇人配置" key="fhrpz" className="hlgl">
          <Fhrpz/>
        </Tabs.TabPane>
        <Tabs.TabPane tab="境外收货人配置" key="jwshrpz" className="hlgl" >
          <Jwshrpz/>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Index;
