// 发票配置管理
import React, { useState, useEffect } from 'react';
import { Form, Tabs, message } from 'antd';
import Jcpz from './jcpz';
import Sxpz from './sxpz';
import Jnhyd from './jnhyd';
import Dwgl from '@/pages/hts/pzgl/znpdpzgl/zdpppzgl/dwgl/index';

import {  cxsxx } from '@/pages/hts/services/htsApi';


const Index: React.FC = () => {

  const [activeKey, setActiveKey] = useState<string>('jldwgl'); // 当前活动tab
  const [dwglData, setDwglData] = useState<any>({}); // 备注管理
  const [zlbsx, setZlbsx] = useState<any>([]);

  const [form] = Form.useForm();



  useEffect(() => {
    setDwglData(new Date());
    cxsxx({ "cxlx": "02" }).then((res2: any) => {
      if (res2.code === '200') {
        setZlbsx(res2.body);
        setActiveKey('jldwgl');
      } else {
        message.error(res2.msg);
      }
    });
  }, []);

  const tabCallback = (key: any) => {
    form.resetFields();
    cxsxx({ "cxlx": "02" }).then((res2: any) => {
      if (res2.code === '200') {
        setZlbsx(res2.body);
        setActiveKey(key);
      } else {
        message.error(res2.msg);
      }
    });
  };



  return (
    <div>
      <Tabs
        activeKey={activeKey}
        onChange={tabCallback}
        destroyInactiveTabPane
        className="dd_layout_tabs dd_layout_tabs_bzgl"
      >
        {/* <Tabs.TabPane tab="发票备注筛选" key="sxpz" className="gdkppz">
          <Sxpz setActiveKey={setActiveKey}/>
        </Tabs.TabPane> */}
        <Tabs.TabPane tab="计量单位转换" key="jldwgl" className="gdkppz">
          <Dwgl data="dwgl" />
        </Tabs.TabPane>
        <Tabs.TabPane tab="境内货源地" key="jnhyd" className="gdkppz">
          <Jnhyd data="dwgl" />
        </Tabs.TabPane>
        <Tabs.TabPane tab="匹配规则" key="jcpz" className="gdkppz">
          <Jcpz zlbsx = {zlbsx} form={form}/>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Index;
