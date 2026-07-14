/**
 * title: 出口报关单台账
 */
import dayjs from 'dayjs';
import React, { useRef, useEffect } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import config from './config';
import Func from './f';
import moment from 'moment';
import myUtil from '@/components/DDAssist/util';
import DrawerList from './mxtsMod';
import WfkList from './wfkMxtsMod';

const Index: React.FC<unknown> = () => {

  const [myConfig, setMyConfig] = React.useState<any>(null);

  const drawerRef: any = useRef();
  const wfkRef: any = useRef();

  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(drawerRef);
    otherRef.push(wfkRef);
    return otherRef;
  };

  useEffect(() => {
    let configData = { ...config }
    let timeQ, timeZ;
    const time = new Date();
    const nowMonth = time.getMonth();
    let newMonth = (nowMonth + 1) < 10 ? '0' + (nowMonth + 2) : nowMonth + 2;
    if (newMonth === 13) {
      timeQ = dayjs(myUtil.date.getYearBeforeCurr(0) + '-01-01');
    } else {
      timeQ = dayjs(myUtil.date.getYearBeforeCurr(1) + '-' + newMonth + '-01');
    }
    timeZ = dayjs(myUtil.date.accurateDate(new Date().getTime()));
    configData.grid_filter_quick[0].defaultValue = [dayjs(timeQ), dayjs(timeZ)];
    configData.grid_filter_quick[0].allowClear = false;
    setMyConfig(configData)
  }, [])

  const DDBunit2Html = (obj: any) => {
    return <DDBunit2 config={obj} func={Func} key="wmzbblgyscx" />
  }

  return <>
    {DDBunit2Html(myConfig)}
    <DrawerList onRef={drawerRef} />
    <WfkList onRef={wfkRef} />
  </>;
};

export default Index;