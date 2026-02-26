import {
  ApartmentOutlined,
  CalendarOutlined,
  ClusterOutlined,
  CodeOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  FileWordOutlined,
  HomeOutlined,
  PieChartOutlined,
  ScheduleOutlined,
  WindowsOutlined,
} from '@ant-design/icons';
import { Menu, Space, Typography } from 'antd';
import React from 'react';
import type { UtilDocData } from '../../types';
import styles from './Sidebar.less';

const { Text } = Typography;

interface SidebarProps {
  data: UtilDocData;
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  text: <FileTextOutlined />,
  date: <CalendarOutlined />,
  localStore: <DatabaseOutlined />,
  sessionStore: <ScheduleOutlined />,
  array: <ApartmentOutlined />,
  tree: <ClusterOutlined />,
  word: <FileWordOutlined />,
  chartsAntD: <PieChartOutlined />,
  modal: <WindowsOutlined />,
  code: <CodeOutlined />,
};

const Sidebar: React.FC<SidebarProps> = ({
  data,
  activeModule,
  onModuleChange,
}) => {
  const menuItems = [
    {
      key: 'intro',
      icon: <HomeOutlined />,
      label: '介绍',
    },
    ...data.modules.map((module) => ({
      key: module.type,
      icon: iconMap[module.type],
      label: (
        <Space>
          <span>{module.name}</span>
          <Text type="secondary" className={styles.methodCount}>
            {module.methods.length}
          </Text>
        </Space>
      ),
    })),
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <Text strong className={styles.title}>
          {data.title}
        </Text>
        <Text type="secondary" className={styles.version}>
          v{data.version}
        </Text>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[activeModule]}
        items={menuItems}
        onClick={({ key }) => onModuleChange(key)}
        className={styles.menu}
      />
      <div className={styles.footer}>
        <Text type="secondary">更新于 {data.lastUpdated}</Text>
      </div>
    </aside>
  );
};

export default Sidebar;
