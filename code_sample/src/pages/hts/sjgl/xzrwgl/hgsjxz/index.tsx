import { Tabs } from 'antd';
import React from 'react';
import Jckbgd from './jckbgd';
import Jgszch from './jgszch';
import Badzzl from './badzzl';




const Index: React.FC<unknown> = () => {
  return (
    <>
      <div>
        <Tabs defaultActiveKey="hgdzxzjy" className="dd_layout_tabs dd_layout_tabs_bzgl">
          <Tabs.TabPane tab="进出口报关单" key="hgdzxzjy" className="hgdzxzjy">
            <Jckbgd />
          </Tabs.TabPane>
          <Tabs.TabPane tab="加工贸易手账册" key="jgmyszc" className="jgmyszc">
            <Jgszch />
          </Tabs.TabPane>
          {/* <Tabs.TabPane tab="备案单证资料" key="badzzl" className="badzzl">
            <Badzzl />
          </Tabs.TabPane> */}
        </Tabs>
      </div>
    </>
  )
};

export default Index;
