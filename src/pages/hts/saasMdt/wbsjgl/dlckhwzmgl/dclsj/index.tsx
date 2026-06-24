// 代理出口货物证明-待处理数据
import React, { useEffect, useState, useRef, useImperativeHandle }  from 'react';
import { Tabs, message } from 'antd';
import Dbtckfph from './dbtckfphTab'
import Dqrspm from './dqrspmTab';
import { FileSyncOutlined, FileProtectOutlined } from '@ant-design/icons';
import {dclsjBttj } from '@/pages/hts/services/htsApi';

const Index: React.FC = () => {

  const [sjValue, setSjValue] = useState<any>([]);
  const tjRef: any = useRef();

  useEffect(() => {
    getDclsjBttj();
  }, []);

  const getDclsjBttj = () => {
    dclsjBttj({ywlx: 'dlckhwzm'}).then((res:any)=>{
      const {code, body, msg} = res;
      if(code === '200') {
        setSjValue(body);
      } else {
        message.info(msg);
      }
    })
  }

  useImperativeHandle(tjRef, () => {
    return {
      getDclsjBttj,
    };
  });
  
  return (
    <div>
      <Tabs defaultActiveKey="dbtckfph" className="dd_layout_tabs dd_layout_tabs_bzgl">
        <Tabs.TabPane tab={<span><FileSyncOutlined />待补填出口发票号（{sjValue?.dbtckfph}条）</span>} key="dbtckfph">
          <Dbtckfph data="" mainref={tjRef} />
        </Tabs.TabPane>
        <Tabs.TabPane tab={<span><FileProtectOutlined />待确认商品码（{sjValue?.dqrspm}条）</span>} key="dqrspm">
          <Dqrspm data="" mainref={tjRef} /> 
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default Index;
