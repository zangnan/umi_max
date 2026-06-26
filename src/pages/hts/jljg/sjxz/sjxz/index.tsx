import { Tabs } from 'antd';
import React from 'react';
import Swfkjsxzjy from './swfkjsxzjy';
import Hgsjxzjy from './hgsjxzjy';


const Index: React.FC<unknown> = () => {
  return (
    <>
      <div>
        <Tabs defaultActiveKey="hgsjxzjy" className="dd_layout_tabs dd_layout_tabs_bzgl">
          <Tabs.TabPane tab="海关数据下载" key="hgsjxzjy" className="hgsjxzjy">
            <Hgsjxzjy />
          </Tabs.TabPane>
          <Tabs.TabPane tab="税务反馈数据下载" key="swfkjsxzjy" className="swfkjsxzjy">
            <Swfkjsxzjy />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </>
  )
};

export default Index;
