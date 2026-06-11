import React, {useRef} from 'react';
import myUtil from '@/components/DDAssist/util';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import unitConfig from './myutil-and-useref.actual';
import Func from './myutil-and-useref.actualFun';

const Unit: React.FC<unknown> = () => {
  // 改变默认配置项
  const myConfig = { ...unitConfig };
  const userInfo = myUtil.sessionStore.getItem('userInfo');
  const mbxzRef: any = useRef();
  myConfig.gridParams = {
    initSearchModal: [
      { property: 'cdDm', value: '1', op: 'zdy' },
    ],
  };

  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>;
};
export default Unit;
