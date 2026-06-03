// 导航主页
import React from 'react';
import myUtil from '@/pages/common/myUtil';
import { Space, Tooltip } from 'antd';
import './style.less';
import { history } from 'umi';
import { CloudServerOutlined, ContainerOutlined, UserOutlined, RobotOutlined, ProjectOutlined, InteractionOutlined, FileProtectOutlined, HomeOutlined, SecurityScanOutlined, OneToOneOutlined, CreditCardOutlined, VerifiedOutlined, ScheduleOutlined, AreaChartOutlined, AuditOutlined, RadarChartOutlined, FormOutlined, LayoutOutlined, ProfileOutlined, FundOutlined, CheckSquareOutlined, SendOutlined, BarChartOutlined } from '@ant-design/icons';

const Index: React.FC<unknown> = () => {

  // 利用对象进行图标映射
  const iconMapping = {
    ContainerOutlined: <ContainerOutlined />,
    CloudServerOutlined: <CloudServerOutlined />,
    ProjectOutlined: <ProjectOutlined />,
    RobotOutlined: <RobotOutlined />,
    InteractionOutlined: <InteractionOutlined />,
    FileProtectOutlined: <FileProtectOutlined />,
    OneToOneOutlined: <OneToOneOutlined />,
    LayoutOutlined: <LayoutOutlined />,
    ProfileOutlined: <ProfileOutlined />,
    FundOutlined: <FundOutlined />,
    CheckSquareOutlined: <CheckSquareOutlined />,
    BarChartOutlined: <BarChartOutlined />,
    SendOutlined: <SendOutlined />,
    AuditOutlined: <AuditOutlined />,
    FormOutlined: <FormOutlined />,
    RadarChartOutlined: <RadarChartOutlined />,
    AreaChartOutlined: <AreaChartOutlined />,
    CreditCardOutlined: <CreditCardOutlined />,
    VerifiedOutlined: <VerifiedOutlined />,
    ScheduleOutlined: <ScheduleOutlined />,
    UserOutlined: <UserOutlined />,
    HomeOutlined: <HomeOutlined />,
    SecurityScanOutlined: <SecurityScanOutlined />,
  }

  const drawMenu = () => {
    const usermenu: any = myUtil.sessionStore.getItem('usermenu') || [];

    const jump = (route: any) => {
      history.push(route);
    }

    const item1: any = [];
    // 一级菜单
    usermenu.forEach((tmp1: any, index: number) => {
      // 未渲染/隐藏菜单不显示
      if (tmp1.menuRender === false || tmp1.hideInMenu === true || tmp1.redirect || !tmp1.name) {
        return;
      }
      // 二级菜单
      let item2: any = [];
      const menuL2 = tmp1.routes || [];
      menuL2.forEach((tmp2: any, index2: number) => {
        // 未渲染/隐藏菜单不显示
        if (tmp2.menuRender === false || tmp2.hideInMenu === true || tmp2.redirect || !tmp2.name) {
          return;
        }
        let path = tmp2.path;
        if (tmp2.routes) {
          path = tmp2.routes[0].path;
        }
        item2.push(
          <div key={index2.toString()} className="hws_menu" onClick={() => {jump(path)}}>
            <div className="hws_menu_title"><Tooltip title={tmp2.name}>{tmp2.name}</Tooltip></div>
            <div className="hws_menu_icon">{iconMapping[tmp2.icon]}</div>
          </div>
        );
      })
      item1.push(<div className="hws_group">
        <div className="hws_group_title">{tmp1.name}</div>
        <Space key={tmp1.name} size={[10, 10]} wrap className="hws_group_menus">{item2}</Space>
      </div>);
    });
    return item1;
  }

  return (
    <div className="hts_workspace_simple">
      { drawMenu() }
    </div>
  );
};
export default Index;