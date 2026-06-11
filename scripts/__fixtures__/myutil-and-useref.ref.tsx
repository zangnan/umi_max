/**
 * 参照文件模板 - 模拟源 auto_config.tsx 同目录的 index.tsx
 * 含 myUtil. 调用（触发 import myUtil 注入）
 * + useRef() 调用（触发 React 行合并 {useRef} 注入）
 */
import React from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import unitConfig from './myutil-and-useref';

const Index: React.FC<unknown> = () => {
  const myConfig = { ...unitConfig };
  const userInfo = myUtil.sessionStore.getItem('userInfo');
  const mbxzRef: any = useRef();
  myConfig.gridParams = {
    initSearchModal: [
      { property: 'cdDm', value: '1', op: 'zdy' },
    ],
  };
  return <>
    <DDBunit2 config={myConfig} />
  </>;
};
export default Index;
