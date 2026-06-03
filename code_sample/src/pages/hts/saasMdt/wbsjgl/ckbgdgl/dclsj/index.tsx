// 出口报关单管理-待处理数据
import React, { useEffect, useState, useImperativeHandle, useRef }  from 'react';
import { Tabs, message } from 'antd';
import Dbtckfph from './dbtckfphTab';
import Dqrspm from './dqrspmTab';
import Dbthl from './dbthlTab';
import Dqryf from './dqryfTab';
import { FileSyncOutlined, FileProtectOutlined, FileTextOutlined, ExceptionOutlined } from '@ant-design/icons';
import {dclsjBttj } from '@/services/hts/api';

const Index: React.FC = () => {

  const [sjValue, setSjValue] = useState<any>([]);

  const tjRef: any = useRef();

  useEffect(() => {
    getDclsjBttj();
  }, []);

  useImperativeHandle(tjRef, () => {
    return {
      getDclsjBttj,
    };
  });

  const getDclsjBttj = () => {
    dclsjBttj({ywlx: 'ckbgd'}).then((res:any)=>{
      const {code, body, msg} = res;
      if(code === '200') {
        setSjValue(body);
      } else {
        message.info(msg);
      }
    })
  }

  return (
    <div>
      <Tabs defaultActiveKey="dbtckfph" className="dd_layout_tabs dd_layout_tabs_bzgl">
        <Tabs.TabPane tab={<span><FileSyncOutlined />待补填出口发票号（{sjValue?.dbtckfph}条）</span>} key="dbtckfph">
          <Dbtckfph data="" mainref={tjRef} />
        </Tabs.TabPane>
        <Tabs.TabPane tab={<span><FileProtectOutlined />待确认商品码（{sjValue?.dqrspm}条）</span>} key="dqrspm">
          <Dqrspm data="" mainref={tjRef}  /> 
        </Tabs.TabPane>
        <Tabs.TabPane tab={<span><FileTextOutlined />待补填汇率（{sjValue?.dbthl}条）</span>} key="dbthl">
          <Dbthl data="" mainref={tjRef} /> 
        </Tabs.TabPane>
        <Tabs.TabPane tab={<span><ExceptionOutlined />待确认运费（{sjValue?.dqryf}条）</span>} key="dqryf">
          <Dqryf data="" mainref={tjRef} /> 
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default Index;
