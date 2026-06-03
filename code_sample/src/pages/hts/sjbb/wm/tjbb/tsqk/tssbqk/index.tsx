/**
 * title: 外贸退税申报情况
 */
import React, { useRef, useEffect, useState } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from './config';
import configXfs from './configXfs';
import Func from './f';
import DrawerList from './sbbqdMod';
import myUtil from '@/pages/common/myUtil';
import moment from 'moment';
import {message, Spin} from 'antd';
import { checkXfssfwl } from '@/services/hts/api';


const Bgd: React.FC<unknown> = () => {
  const [myConfig, setMyConfig] = React.useState<any>(null);
  const [masker, setMasker] = useState(false);

  // 添加私有页面或组件
  const drawerRef: any = useRef();
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(drawerRef);
    return otherRef;
  };

  useEffect(() => {
    // 获取购买方数据集合
    checkSbsjtssfwlData();
  }, [])

  const checkSbsjtssfwlData = () => {
    setMasker(true);
    checkXfssfwl({}).then((response: any) => {
      const {code, desc, body} = response;
      setMasker(false);
      let configData = {...config}
      if(code === '200') {
        if(body?.flag === 'N'){
          configData = {...configXfs};
        }
      } else {
        message.error(desc)
      }
      // 设置日期例如（20210801-当前日（20220729）。）
      let timeQ, timeZ;
      const time = new Date();
      const nowMonth = time.getMonth();
      let newMonth = (nowMonth + 1) < 10 ? '0' + (nowMonth + 2) : nowMonth + 2;
      if(newMonth === 13){
        timeQ = moment(myUtil.date.getYearBeforeCurr(0) + '-01-01');
      } else {
        timeQ = moment(myUtil.date.getYearBeforeCurr(1) + '-' + newMonth + '-01');
      }
      timeZ = moment(myUtil.date.accurateDate(new Date().getTime()));
      configData.grid_filter_quick[0].defaultValue = [timeQ, timeZ];
      configData.grid_filter_quick[0].allowClear = false;
      setMyConfig(configData)
    });
  }

  const DDBunit2Html = (obj: any) => {
    return <DDBunit2 config={obj} func={Func} key="wmTssbqk" />
  }

  return <>
    <Spin tip="Loading..." spinning={masker} delay={100}>
      {DDBunit2Html(myConfig)}
      <DrawerList onRef={drawerRef} />
    </Spin>
  </>;
};

export default Bgd;