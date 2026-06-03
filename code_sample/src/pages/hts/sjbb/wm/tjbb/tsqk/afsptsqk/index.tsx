/**
 * title: 出口报关单台账
 */
import React, { useState, useEffect, useRef } from 'react';
import { message, Spin } from 'antd';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from './config';
import configXfs from './config2';
import Func from './f';
import moment from 'moment';
import myUtil from '@/pages/common/myUtil';
import { checkXfssfwl } from '@/services/hts/api';

const Index: React.FC<unknown> = () => {
  const [myConfig, setMyConfig] = React.useState<any>(null);
  const [masker, setMasker] = useState(false);
 
  useEffect(() => {
    checkXfssfwlData();
  }, [])

  const checkXfssfwlData = () => {
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
    return <DDBunit2 config={obj} func={Func} key="wmAfspt" />
  }

  return <>
    <Spin tip="Loading..." spinning={masker} delay={100}>
      {DDBunit2Html(myConfig)}
    </Spin>
  </>;
};

export default Index;