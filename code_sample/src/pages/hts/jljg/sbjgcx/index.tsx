import { Tabs } from 'antd';
import React from 'react';
import Mdthx from './mdthx';
import Yhxtz from './yhxtz';
import Jljgtjcx from './jljgtjcx';
import { history } from 'umi';

const Index: React.FC = () => {
  let defaultAKey = 'jljgtjcx';
  if (history?.location?.pathname === '/hts/jljg/sbjgcx') {
    defaultAKey = 'jljgtjcx';
  }
  if (history?.location?.pathname === '/hts/jljg/sbjgcxHmdthxJ' || history?.location?.pathname === '/hts/jljg/sbjgcxHmdthxF') {
    defaultAKey = 'mdthx';
  }
  if (history?.location?.pathname === '/hts/jljg/sbjgcxHyhxtzJ' || history?.location?.pathname === '/hts/jljg/sbjgcxHyhxtzF') {
    defaultAKey = 'yhxtz';
  }

  return (
    <>
      <Tabs defaultActiveKey={defaultAKey} className="dd_layout_tabs dd_layout_tabs_bzgl">
        <Tabs.TabPane tab="进料加工业务统计查询" key="jljgtjcx" className="jljgtjcx">
          <Jljgtjcx />
        </Tabs.TabPane>
        <Tabs.TabPane tab="进料加工业务免抵退税核销表" key="mdthx" className="mdthx">
          <Mdthx />
        </Tabs.TabPane>
        <Tabs.TabPane tab="已核销手（账）册海关数据调整表" key="yhxtz" className="yhxtz">
          <Yhxtz />
        </Tabs.TabPane>
      </Tabs>
    </>
  )
};

export default Index;
