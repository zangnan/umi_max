/**
 * 参照文件模板 - 模拟源 auto_config.tsx 同目录的 index.tsx
 * 含 cktsUtil.menu.getMenuObjByPath(...) 调用 —— 工具会重写为
 *   cktsUtil.menu.getMenuObjByPath(...) 并在生成文件顶部加 import cktsUtil
 */
import React from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import unitConfig from './myutil-menu-rewrite';

const Index: React.FC<unknown> = () => {
  const myConfig = { ...unitConfig };
  if (cktsUtil.menu.getMenuObjByPath('/hts/shgl/shsdsj')) {
    myConfig.costomer_toobar = [
      { name: '菜单A', key: 'A', func: 'A' },
    ];
  } else {
    myConfig.costomer_toobar = [
      { name: '菜单B', key: 'B', func: 'B' },
    ];
  }
  return <>
    <DDBunit2 config={myConfig} />
  </>;
};
export default Index;
