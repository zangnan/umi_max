/**
 * title: 退税申报情况生产
 */
import dayjs from 'dayjs';
import React, { useRef, useEffect, useState }from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import { message, Spin} from 'antd';
import Sbbqd from './sbbqd';
import Xxym from './xxym';
import config from './config';
import configKjy from './configKjy';
import Func from './f';
import moment from 'moment';
import myUtil from '@/components/DDAssist/util';
import { checkSbsjtssfwl } from '@/pages/hts/services/htsApi';

const Index: React.FC<unknown> = () => {
  const [myConfig, setMyConfig] = React.useState<any>(null);
  const [masker, setMasker] = useState(false);

  // 添加私有页面或组件
  const sbbqd: any = useRef();
  const kjysxwsqyykmxb: any = useRef();
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(sbbqd);
    otherRef.push(kjysxwsqyykmxb);
    return otherRef;
  };

  useEffect(() => {
    // 获取购买方数据集合
    checkSbsjtssfwlData();
  }, [])

  const checkSbsjtssfwlData = () => {
    setMasker(true);
    checkSbsjtssfwl({}).then((response: any) => {
      const {code, desc, body} = response;
      setMasker(false);
      let configData = {...config}
      if(code === '200') {
        // let showDataIndex: any = [];
        // let hideDataIndex: any = [];
        if(body?.flag === 'N'){
          configData = configKjy;
          // let configGrid = configData.grid_columns;
          // hideDataIndex = ['ytsehj', 'lwytse' , 'mdsehj', 'lwmdse', 'kjysxwsbqk'];
          // configData.grid_columns = changeGridColumns(configGrid, hideDataIndex, true);
        } else {
          // let configGrid = configData.grid_columns;
          // showDataIndex = ['ytsehj', 'lwytse' , 'mdsehj', 'lwmdse', 'kjysxwsbqk'];
          // configData.grid_columns = changeGridColumns(configGrid, showDataIndex, false);
        }
        // 设置日期例如（20210801-当前日（20220729）。）
        let timeQ, timeZ;
        const time = new Date();
        const nowMonth = time.getMonth();
        let newMonth = (nowMonth + 1) < 10 ? '0' + (nowMonth + 2) : nowMonth + 2;
        if(newMonth === 13){
          timeQ = dayjs(myUtil.date.getYearBeforeCurr(0) + '-01-01');
        } else {
          timeQ = dayjs(myUtil.date.getYearBeforeCurr(1) + '-' + newMonth + '-01');
        }
        timeZ = dayjs(myUtil.date.accurateDate(new Date().getTime()));
        configData.grid_filter_quick[0].defaultValue = [dayjs(timeQ), dayjs(timeZ)];
        configData.grid_filter_quick[0].allowClear = false;
      } else {
        message.error(desc)
      }
      setMyConfig(configData)
    });
  }

  const DDBunit2Html = (obj: any) => {
    return <DDBunit2 config={obj} func={Func} key="mdtsb" />
  }

  // 显示隐藏列表字段
  // const changeGridColumns = (configGrid: any ,dataIndex: any, hidden: Boolean) => {
  //   configGrid.map((item: any) => {
  //     if (dataIndex.length > 0 && dataIndex.indexOf(item.dataIndex) > -1) {
  //       item.hidden = hidden;
  //     } else if(item.children && item.children.length>0) {
  //       changeGridColumns(item.children, dataIndex, hidden);
  //     }
  //   })
  //   return configGrid
  // }

  return (
    <>
      <Spin tip="Loading..." spinning={masker} delay={100}>
        {DDBunit2Html(myConfig)}
        <Sbbqd onRef={sbbqd} />
        <Xxym onRef={kjysxwsqyykmxb} />
      </Spin>
    </>
  );
};

export default Index;
