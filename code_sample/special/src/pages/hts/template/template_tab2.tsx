/**
 * titel: Tab
 */
import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { history, useRouteData, useLocation, Outlet } from 'umi';
import myUtil from '@/components/DDAssist/util';
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
  const routeMatch = useRouteData();     // 获取当前路由的匹配信息
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
    const [routePathname] = [...routeMatch.route.path.split('/')].reverse();
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
  // antd v6 items API：每个 item 的 children 是该 tab 的内容（用 <Outlet /> 替代原 React.cloneElement）
  const tabItems = (myTabs || []).map((item: any, index: number) => ({
    key: item.id,
    label: item.name,
    closable: index === 0 ? false : false,
    className: `template_tab2_header_${item.id}`,
    children: item.id === activeKey ? <Outlet /> : <div style={{ display: 'none' }} />,
  }));

  return (
    <div className="template_tab2">
      <Tabs size="small" tabBarGutter={5} type="editable-card" hideAdd={true} activeKey={activeKey}
        onChange={onChange}
        onEdit={onEdit}
        items={tabItems}
        renderTabBar={(props, DefaultTabBar) => {
          if ((myTabs || []).length <= 1) {
            return <></>;
          } else {
            return <DefaultTabBar {...props} />;
          }
        }}
      />
    </div>
  );
};

export default TemplateTab;
