/**
 * 参照文件模板 - 模拟源 auto_config.tsx 同目录的 index.tsx
 * 含 myConfig.grid_columns / grid_columns_tj forEach（ellipsis + width 调整）
 * + initSearchModal（literal value）—— 模拟 TSSB_GCB 模式
 */
import React from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import unitConfig from './grid-columns-adjustment';

const Index: React.FC<unknown> = () => {
  const myConfig = { ...unitConfig };
  // 补充悬浮
  const dataIndex = ['cktmsywlxdmjh'];
  myConfig.grid_columns.forEach((item: any) => {
    if (dataIndex.length > 0 && dataIndex.indexOf(item.dataIndex) > -1) {
      item.ellipsis = true;
    }
    if (item.dataIndex === 'dlckhwzmhm') {
      item.width = 180;
    }
  })
  myConfig.grid_columns_tj.forEach((item: any) => {
    if (dataIndex.length > 0 && dataIndex.indexOf(item.dataIndex) > -1) {
      item.ellipsis = true;
    }
    if (item.dataIndex === 'dlckhwzmhm') {
      item.width = 180;
    }
  })
  myConfig.gridParams = {
    initSearchModal: [
      { property: 'cdDm', value: '25030101', op: 'zdy' },
    ],
  }

  return <>
    <DDBunit2 config={myConfig} />
  </>;
};
export default Index;
