/**
 * 参照文件模板 - 模拟源 auto_config.tsx 同目录的 index.tsx
 * 含 initSearchModal 段（literal value），工具会把它原样注入到生成的 auto_configIndex.tsx
 */
import React from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import unitConfig from './index-from-reference';

const Index: React.FC<unknown> = () => {
  const myConfig = { ...unitConfig };
  myConfig.gridParams = {
    initSearchModal: [
      { property: 'tjqlxDm', value: '1', op: 'zdy' },
    ],
  };

  return <>
    <DDBunit2 config={myConfig} />
  </>;
};
export default Index;
