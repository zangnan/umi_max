// 出口报关单管理-待处理数据
import React, { useEffect, useImperativeHandle, useRef }  from 'react';
import { Tabs } from 'antd';
import MonthData from './monthDataTabRz';
import SeasonData from './seasonDataTabRz';
import YearData from './yearDataTabRz';

const index: React.FC = () => {
  // const [sjValue, setSjValue] = useState<any>([]);

  const loadRef: any = useRef();
  useEffect(() => {
    //getDclsjBttj();
  }, []);

  useImperativeHandle(loadRef, () => {
    // return {
    //   getDclsjBttj,
    // };
  });

  // const getDclsjBttj = () => {
  //   dclsjBttj({ywlx: 'ckbgd'}).then((res:any)=>{
  //     const {code, body, msg} = res;
  //     if(code === '200') {
  //       setSjValue(body);
  //     } else {
  //       message.info(msg);
  //     }
  //   })
  // }

  return (
    <div>
      <Tabs defaultActiveKey="monthDataRz" destroyInactiveTabPane className="dd_layout_tabs dd_layout_tabs_bzgl">
        <Tabs.TabPane tab={<span>月度</span>} key="monthDataRz">
          <MonthData data="" mainref={loadRef} />
        </Tabs.TabPane>
        <Tabs.TabPane tab={<span>季度</span>} key="seasonDataRz">
          <SeasonData data="" mainref={loadRef}  /> 
        </Tabs.TabPane>
        <Tabs.TabPane tab={<span>年度</span>} key="yearDataRz">
          <YearData data="" mainref={loadRef} /> 
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default index;
