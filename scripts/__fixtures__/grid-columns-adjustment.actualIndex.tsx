import React from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import unitConfig from './grid-columns-adjustment.actual';
import Func from './grid-columns-adjustment.actualFun';

const Unit: React.FC<unknown> = () => {
  // 改变默认配置项
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
  };

  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>;
};
export default Unit;
