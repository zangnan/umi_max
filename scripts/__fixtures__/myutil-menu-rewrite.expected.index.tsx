import React from 'react';
import cktsUtil from '@/pages/hts/cktsUtil';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import unitConfig from './myutil-menu-rewrite.actual';
import Func from './myutil-menu-rewrite.actualFun';

const Unit: React.FC<unknown> = () => {
  // 改变默认配置项
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
    <DDBunit2 config={myConfig} func={Func} />
  </>;
};
export default Unit;
