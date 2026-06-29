/**
 * titel: icon_nav
 */
import React from 'react';
import { Row, Col } from 'antd';
import ProCard from '@ant-design/pro-card';
import myUtil from '@/components/DDAssist/util';
import './style.less';
export type TemplateIconNavProps = {
  onHandleRoute?: any;
  route?: any;
}

const TemplateIconNav: React.FC<TemplateIconNavProps> = ({
  onHandleRoute,
  route,
}) => {

  // 路由跳转
  const handleRoute = (item: any) => {
    if (onHandleRoute) {
      onHandleRoute(item);
    }
  };

  // 获取导航菜单
  const getNav = () => {
    const navId = route.navId;
    const getNavMenu = () => {
			let targetMenus = [];
			let menuArr = myUtil.menu.getMenuArr();
			for (var i = 0; i < menuArr.length; i++) {
				if (menuArr[i] && menuArr[i].nav && menuArr[i].nav && menuArr[i].pid == navId) {
					targetMenus.push(menuArr[i]);
				}
			}
			return targetMenus;
		};
		// 获取菜单
		const navMenu = getNavMenu();
    // 菜单分组
    let groups: any[] = [];
		let tempTitle = '';
    for (let m = 0; m < navMenu.length; m++) {
      let currentGroupTitle = navMenu[m].nav.split('#')[1];
      if (tempTitle != currentGroupTitle) {
        tempTitle = currentGroupTitle;
        groups.push([]);
      }
      groups[groups.length - 1].push({
        ...navMenu[m],
        icon: navMenu[m].nav ? navMenu[m].nav.split('#')[2]: 'iconshouyedatubiao_lailiaojiagongmianshuizhengming'
      });
    }
    const groupsFormat = [];
    // 菜单分组后格式化
    for (let n = 0; n < groups.length; n++) {
      groupsFormat.push({
        groupTitle: groups[n][0].name,
        nav: groups[n],
      })
    }
    return groupsFormat;
  }

  // initTabs
  const initTabs = () => {
    const groupsFormat = getNav();
    let iconArr: any = [];
    groupsFormat.forEach((group: any, index1: any) => {
      const { groupTitle, nav } = group;
      const groupNav: any = [];
      nav.forEach((item: any, index2: any) => {
        groupNav.push(
          <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={6} key={index2}>
            <div onClick={() => handleRoute(item)} className="menu-content">
              <span className="menu-img" >
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref={`#${ item.icon.replace('icon', 'iconSAAS_') }`}></use>
                </svg>
              </span>
              <span className="menu-txt" >{ item.name }</span>
            </div>
          </Col>
        );
      });
      iconArr.push(
        <ProCard size="small" title={groupTitle} bordered={false} headerBordered={true} style={{ marginBottom: 8 }} key={index1}>
          <Row>{ groupNav }</Row>
        </ProCard>
      );
    })
    return <>
      <div className="icon-nav-wrap">
        { iconArr }
      </div>
    </>
  }

  return initTabs();
};

export default TemplateIconNav;