import React from 'react';
import { Tabs } from 'antd';
import Jcsz from './jcsz';
import Gdkppz from '@/pages/hts/badz/badzsz/zlsxsz/index';

const Index: React.FC = () => {

  //初始化数据
  let defaultActiveKey = 'jesz';
  const activeKey = location.search.substr(1);
  if (activeKey) {
    defaultActiveKey = activeKey;
  }

  return (
    <div>
      <Tabs defaultActiveKey={defaultActiveKey} className="dd_layout_tabs dd_layout_tabs_bzgl">
        <Tabs.TabPane tab="基础设置" key="jesz" >
          <Jcsz />
        </Tabs.TabPane>
        <Tabs.TabPane tab="资料设置" key="zlsxsz" >
          <Gdkppz />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default Index;
