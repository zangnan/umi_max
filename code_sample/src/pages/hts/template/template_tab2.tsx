/**
 * titel: Tab
 */
import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { history, useRouteMatch, useLocation } from 'umi';
import myUtil from '@/pages/common/myUtil';
import './style.less';

export type TemplateTabProps = {
  tabs?: any;
  children?: any;
}
const TemplateTab: React.FC<TemplateTabProps> = ({
  children,
  tabs = [],
}) => {
  const [ activeKey, setActiveKey ] = useState('');
  const [ myTabs, setMyTabs ] = useState(tabs);
  const routeMatch = useRouteMatch();     // 获取当前路由的匹配信息
  const location = useLocation();         // 获取 location 对象

  // 切换tab
  const onChange = (key: any) => {
    setActiveKey(key);
    myTabs.forEach((tab: any, i: number) => {
      if (tab.id === key) {
        history.push(tab.path);
        return false;
      }
      return true;
    });
  };

  // onEdit
  const onEdit = (key: any) => {
    // const lableSpan1: any = document.querySelector(`.template_tab2_header_${key}`);
    // lableSpan1.style.display='none';
  };

  // 增加tab
  const add = (item: any) => {
    const { id, path } = item;
    setActiveKey(id);
    history.push(path);
    // const lableSpan1: any = document.querySelector(`.template_tab2_header_${item.id}`);
    // lableSpan1.style.display='inline-flex';
  };

  // initMyTab
  const initMyTab = () => {
    const tabs: any[] = [];
    // 根据当前组件匹配路由获取Tab菜单信息
    const [routePathname] = [...routeMatch.path.split('/')].reverse();
    const menuObj = myUtil.menu.getMenuObjByName(routePathname) || [];
    menuObj && menuObj.routes.forEach((item: any) => {
      tabs.push(item);
    });
    setMyTabs(tabs);
    // 当前地址匹配路由
    const [locationPathname] = [...location.pathname.split('/')].reverse();
    setActiveKey(locationPathname);
  }

  // useEffect
  useEffect(() => {
    initMyTab();
  }, [location]);

  // 初始化
  const getTabs = () => {
    let tabArr: any = [];
    myTabs && myTabs.length > 0 && myTabs.forEach((item: any, index: any) => {
      tabArr.push(
        <Tabs.TabPane tab={item.name} key={item.id} closable={index === 0 ? false : false} className={`template_tab2_header_${item.id}`}>
          { item.id === activeKey && React.cloneElement(children, {route: item, onHandleRoute: add})}
        </Tabs.TabPane>
      );
    })
    return tabArr;
  }

  return (
    <div className="template_tab2">
      <Tabs size="small" tabBarGutter={5} type="editable-card" hideAdd={true} activeKey={activeKey}
        onChange={onChange}
        onEdit={onEdit}
        renderTabBar={(props, DefaultTabBar) => {
          if (props?.panes?.length === 1) {
            return <></>
          } else {
            return <DefaultTabBar {...props} />
          }
        }}
      >
        { getTabs() }
      </Tabs>
    </div>
  )};

export default TemplateTab;
