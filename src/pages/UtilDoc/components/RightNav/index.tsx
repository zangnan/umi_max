import { Anchor, Typography } from 'antd';
import React from 'react';
import type { UtilDocData } from '../../types';
import styles from './RightNav.less';

const { Text } = Typography;

interface RightNavProps {
  data: UtilDocData;
  activeModule: string;
}

const RightNav: React.FC<RightNavProps> = ({ data, activeModule }) => {
  const moduleData = data.modules.find((m) => m.type === activeModule);

  // 介绍页面不显示右侧导航
  if (activeModule === 'intro' || !moduleData) {
    return null;
  }

  // 构建 Anchor items
  const anchorItems = moduleData.methods.map((method) => ({
    key: method.name,
    href: `#method-${method.name}`,
    title: method.cnName,
  }));

  return (
    <aside className={styles.rightNav}>
      <div className={styles.header}>
        <Text strong>本页目录</Text>
      </div>
      <Anchor items={anchorItems} className={styles.anchorList} affix={false} />
    </aside>
  );
};

export default RightNav;
