import { Tabs } from 'antd';
import React from 'react';
import Hgdzxzjy from './hgdzxzjy';


const Index: React.FC<unknown> = () => {
  return (
    <>
      <div>
        <Tabs defaultActiveKey="hgdzxzjy" className="dd_layout_tabs dd_layout_tabs_bzgl">
          <Tabs.TabPane tab="海关单证下载" key="hgdzxzjy" className="hgdzxzjy">
            <Hgdzxzjy />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </>
  )
};

export default Index;
