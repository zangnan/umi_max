
import React, { useRef } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from './config';
import Func from '../../common/f'
import DrawerList from '../../common/drawer_list';
import myUtil from '@/pages/common/myUtil';

const index: React.FC<unknown> = () => {
  let myConfig = { ...config };
  myConfig.grid_filter_quick[0].defaultValue = myUtil.date.getDateYearAgoToNow(1);

  const drawerRef: any = useRef();
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(drawerRef);
    return otherRef;
  };

  return <>
    <DDBunit2 config={myConfig} func={Func} />
    <DrawerList onRef={drawerRef} />
  </>
};
export default index;