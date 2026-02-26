import React from 'react';
import { Tabs } from 'antd';
import './style.less';

const DDTopTab: React.FC<any> = ({
  tabs = [],
  defaultActiveKey,
}) => {

  const getActiveKey = () => {
    let key: any = defaultActiveKey;
    tabs?.forEach((item: any, index: any) => {
      const tmpKey = item.key ? item.key : `top_tab_${index}`;
      if (!defaultActiveKey && index === 0) {
        key = tmpKey;
      }
    });
    return key;
  }

  const initTabs = () => {
    const activeKey = getActiveKey();
    const tmpTabPane: any = [];
    tabs?.forEach((item: any, index: any) => {
      const tmpKey = item.key ? item.key : `top_tab_${index}`;
      tmpTabPane.push(<>
        <Tabs.TabPane tab={item.tab} key={tmpKey}>
          {item.tabPane}
        </Tabs.TabPane>
      </>);
    });
    return <>
      <Tabs defaultActiveKey={activeKey} className="dd_layout_tabs">
        { tmpTabPane }
      </Tabs>
    </>
  }

  return initTabs();
};
export default DDTopTab;
