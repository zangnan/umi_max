/**
 * 参照文件模板 - 模拟源 auto_config.tsx 同目录的 index.tsx
 * 含 cktsUtil.getLcswsxDm(myConfig.unit_constant) 调用 —— 工具会重写为
 *   cktsUtil.getLcswsxDm(myConfig.unit_constant) 并在生成文件顶部加 import cktsUtil
 */
import React from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import unitConfig from './cktsUtil-rewrite';
import cktsUtil from '@/pages/hts/cktsUtil';

const Index: React.FC<unknown> = () => {
  const myConfig = { ...unitConfig };
  myConfig.gridParams = {
    initSearchModal: [
      { property: 'lcswsxDm', value: cktsUtil.getLcswsxDm(myConfig.unit_constant), op: 'al' },
    ],
  };

  return <>
    <DDBunit2 config={myConfig} />
  </>;
};
export default Index;
