/**
 * 参照文件模板 - 模拟源 auto_config.tsx 同目录的 index.tsx
 * 含 UnitUtil.getLcswsxDm(config.unit_constant) 调用 —— 工具会重写为
 *   cktsUtil.getLcswsxDm(myConfig.unit_constant) 并在生成文件顶部加 import cktsUtil
 */
import React from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import unitConfig from './cktsUtil-rewrite';
import UnitUtil from '@/components/DDBunit/unit_util';

const Index: React.FC<unknown> = () => {
  const myConfig = { ...unitConfig };
  myConfig.gridParams = {
    initSearchModal: [
      { property: 'lcswsxDm', value: UnitUtil.getLcswsxDm(config.unit_constant), op: 'al' },
    ],
  };

  return <>
    <DDBunit2 config={myConfig} />
  </>;
};
export default Index;
