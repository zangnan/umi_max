
import dayjs from 'dayjs';
import React, { useRef } from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import config from './config';
import Func from '../../common/f'
import DrawerList from '../../common/drawer_list';
import myUtil from '@/components/DDAssist/util';

const index: React.FC<unknown> = () => {
  let myConfig = { ...config };
  myConfig.grid_filter_quick[0].defaultValue = myUtil.date.getDateYearAgoToNow(1).map((d: string) => dayjs(d));

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