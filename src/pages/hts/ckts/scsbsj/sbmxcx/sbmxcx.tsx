// 已生成数据/申报明细
import React, { useState, useEffect, useImperativeHandle } from 'react';
import { Modal, Tabs } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import myUtil from '@/components/DDAssist/util';
import { history, useRouteData } from 'umi';

export interface GeneratedDataProps {
  visible?: any;
  onRef?: any;
  tabs?: any;
  tabData?: any;
}

const GeneratedData: React.FC<GeneratedDataProps> = ({
  visible = false,
  onRef,
  tabs = [],
  tabData,
}) => {
  const [ modalVisible, setModalVisible ] = useState<boolean>(visible);
  const [ activeKey, setActiveKey ] = useState('');
  const [ myTabs, setMyTabs ] = useState(tabs);
  const routeMatch = useRouteData();     // 获取当前路由的匹配信息

  // 开启
  const showModal = (param: any) => {
    setModalVisible(true);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // initMyTab
  const initMyTab = () => {
    const tabs: any[] = [];
    // 根据当前组件匹配路由获取Tab菜单信息
    // console.log(routeMatch)

    let [routePathname] = [...routeMatch.route.path.split('/')].reverse();
    if (routePathname === 'JLJG_MDTHX') {
      routePathname = '1105';
    }
    const menuObj = myUtil.menu.getMenuObjByName(routePathname) || [];
    menuObj && menuObj.routes?.forEach((item: any) => {
      if (!item.redirect) {
        tabs.push(item);
      }
    });
    setMyTabs(tabs)
    // console.log(location)
    // console.log(history?.location)
    // 当前地址匹配路由
    // let [locationPathname] = [...routeMatch.route.path.split('/')].reverse();
    // console.log(history?.location.pathname.split('/'))
    let [locationPathname] = [...history?.location.pathname.split('/')].reverse();
    // console.log(locationPathname)
    if (locationPathname === 'JLJG_MDTHX') {
      locationPathname = '110501';
    } else if(locationPathname === '2505' || locationPathname === '2506' || locationPathname === '2605' || locationPathname === '2606'|| locationPathname === '2705' || locationPathname === '2706') {
      locationPathname = locationPathname + '01';
    } else {
      locationPathname = locationPathname.replace('SBMXCX_', '');
    }
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
        <Tabs.TabPane tab={item.name} key={item.id} closable={index === 0 ? false : false}>
          { item.id === activeKey && React.cloneElement(tabData, {route: item})}
        </Tabs.TabPane>
      );
    })
    return tabArr;
  }

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

  return (
    <Modal
      title='已生成数据查询'
      visible={modalVisible}
      wrapClassName='standard-modal'
      footer={null}
      width={CONSTANTS.C_MODAL_WIDTH_X4}
      onCancel={() => setModalVisible(false)}
      destroyOnHidden
      mask={{ closable: false }}
    >
      <div className="template_tab2">
        <Tabs size="small" tabBarGutter={5} type="editable-card" hideAdd={true} activeKey={activeKey}
          onChange={onChange}
          renderTabBar={(props, DefaultTabBar) => {
            if (props.panes.length === 1) {
              return <></>
            } else {
              return <DefaultTabBar {...props} />
            }
          }}
        >
          { getTabs() }
        </Tabs>
      </div>
    </Modal>
  );
};

export default GeneratedData;
