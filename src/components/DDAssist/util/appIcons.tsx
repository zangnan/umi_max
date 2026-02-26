/**
 * 图标映射模块
 * 提供 Ant Design 图标到组件的映射，支持动态按需加载
 */
import {
  QuestionCircleOutlined,
  BulbOutlined,
  CodeOutlined,
  MoneyCollectOutlined,
  SettingOutlined,
  AccountBookOutlined,
  LaptopOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  QuestionOutlined,
  CoffeeOutlined,
  GoldOutlined,
  SaveOutlined,
  GroupOutlined,
  ShopOutlined,
  DeploymentUnitOutlined,
  CalendarOutlined,
  BuildOutlined,
  BookOutlined,
  ContainerOutlined,
  CloudServerOutlined,
  ProjectOutlined,
  RobotOutlined,
  InteractionOutlined,
  FileProtectOutlined,
  UserOutlined,
  HomeOutlined,
  SecurityScanOutlined,
  OneToOneOutlined,
  CreditCardOutlined,
  VerifiedOutlined,
  ScheduleOutlined,
  AreaChartOutlined,
  AuditOutlined,
  RadarChartOutlined,
  FormOutlined,
  LayoutOutlined,
  ProfileOutlined,
  FundOutlined,
  CheckSquareOutlined,
  SendOutlined,
  BarChartOutlined,
} from '@ant-design/icons';

// 图标映射表
export const ICON_MAPPING: Record<string, React.ReactNode> = {
  BulbOutlined: <BulbOutlined />,
  CodeOutlined: <CodeOutlined />,
  MoneyCollectOutlined: <MoneyCollectOutlined />,
  SettingOutlined: <SettingOutlined />,
  QuestionOutlined: <QuestionOutlined />,
  CoffeeOutlined: <CoffeeOutlined />,
  DeploymentUnitOutlined: <DeploymentUnitOutlined />,
  GoldOutlined: <GoldOutlined />,
  SaveOutlined: <SaveOutlined />,
  ShopOutlined: <ShopOutlined />,
  GroupOutlined: <GroupOutlined />,
  OneToOneOutlined: <OneToOneOutlined />,
  BuildOutlined: <BuildOutlined />,
  BookOutlined: <BookOutlined />,
  CalendarOutlined: <CalendarOutlined />,
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
  ContainerOutlined: <ContainerOutlined />,
  CloudServerOutlined: <CloudServerOutlined />,
  ProjectOutlined: <ProjectOutlined />,
  RobotOutlined: <RobotOutlined />,
  InteractionOutlined: <InteractionOutlined />,
  FileProtectOutlined: <FileProtectOutlined />,
  UserOutlined: <UserOutlined />,
  HomeOutlined: <HomeOutlined />,
  SecurityScanOutlined: <SecurityScanOutlined />,
  DatabaseOutlined: <DatabaseOutlined />,
  AppstoreOutlined: <AppstoreOutlined />,
  LaptopOutlined: <LaptopOutlined />,
  AccountBookOutlined: <AccountBookOutlined />,
  QuestionCircleOutlined: <QuestionCircleOutlined />,
};

/**
 * 根据图标名称获取图标组件
 * @param iconName 图标名称
 * @returns 图标组件，未找到则返回 null
 */
export const getIcon = (iconName: string): React.ReactNode | null => {
  return ICON_MAPPING[iconName] || null;
};

/**
 * 批量转换菜单项的图标
 * @param menuItems 菜单项数组
 * @returns 转换后的菜单项数组
 */
export const transformMenuIcons = (menuItems: MenuItem[]): MenuItem[] => {
  return menuItems.map((item: any) => ({
    ...item,
    icon: item.icon ? getIcon(item.icon) : null,
    routes: item.routes ? transformMenuIcons(item.routes) : undefined,
  }));
};

// 类型定义
export interface MenuItem {
  path?: string;
  name?: string;
  icon?: string | React.ReactNode;
  id?: number | string;
  parentId?: number | string;
  component?: string;
  menu_type?: string;
  menu_component?: string;
  menu_path?: string;
  menu_name?: string;
  menu_id?: number | string;
  menu_parent_id?: number | string;
  menu_icon?: string;
  menu_hide?: number;
  menu_full_screen?: number;
  menu_index?: number;
  menu_redirect?: string;
  hideInMenu?: boolean | 'Y' | 'N';
  menuRender?: boolean;
  menuFullScreen?: 'Y' | 'N';
  parentKeys?: string | string[];
  routes?: MenuItem[];
  children?: MenuItem[];
  element?: React.ReactNode;
}

export type { ReactNode } from 'react';
