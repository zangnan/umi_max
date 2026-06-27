/**
 * title: 智能配单配置管理-自动匹配配置管理
 */
import React from 'react';
import { Tabs } from 'antd';
import Jcpz from './jcpz/index';
import Dwgl from './dwgl/index';

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
        <Tabs.TabPane tab="基础配置" key="jcpz" className="zdpdJcpz">
          <Jcpz data="jcpz" />
        </Tabs.TabPane>
        <Tabs.TabPane tab="单位管理" key="dwgl" className="zdpdDwgl" >
          <Dwgl data="dwgl" />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default Index;