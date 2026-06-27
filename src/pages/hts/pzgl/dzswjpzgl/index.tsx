/**
 * title: 退税汇率管理
 */
import React, { useState, useEffect } from 'react';
import { Form, Spin, message, Tabs } from 'antd';
import { cxsddlxx, saveDjdlInfo, checkDlt2 } from '@/pages/hts/services/htsApi';
import TabSfyz from './tab_sfyz';
import TabKprz from './tab_kprz';

const Index: React.FC<{ data: any }> = ({
  data
}) => {
  const [loading, setLoading] = useState(false);
  const [masker, setMasker] = useState(false);
  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState<string>('1'); // 当前活动tab
  const [flag, setFlag] = useState(false); // 是否可以来回切

  useEffect(() => {
    loadMoreData();
  }, [data]);



  const loadMoreData = async () => {
    await checkDlt2({}).then(async (res: any) => {
      const {code,body} = res;
      if(code == "200"){
        const dlbz = body?.dlbz;
        const rzbz = body?.rzbz;
        if(dlbz === 'Y' ) {
        // 已登录
        setActiveKey('2');
        setFlag(true);
        } else if(dlbz != 'Y'){
        // 未登录
        setActiveKey('1');
        } 
      }else{
        message.error(res?.msg);
      }
    });

    setTimeout(function () {
      const inputEle1: any = document.querySelector("#dzswjdlpz01_mm");
      inputEle1?.removeAttribute('readonly');
    }, 500);
    
    
  };




  const tabCallback = (key: any) => {
    if (key === activeKey) {
      return;
    }
    if (key === '1') {
      setActiveKey(key)
    }
    if (key === '2' && flag) {
      setActiveKey(key)
    }
  }

  const gotoActiveKey = () => {
    setFlag(true)
    setActiveKey('2')
  }

  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <Tabs activeKey={activeKey} onChange={tabCallback} className="dd_layout_tabs dd_layout_tabs_bzgl">
        <Tabs.TabPane tab="账号登录" key="1">
          <TabSfyz gotoActiveKey={gotoActiveKey} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="身份认证" key="2" disabled={!flag}>
          <TabKprz />
        </Tabs.TabPane>
      </Tabs>
    </Spin>
  );
};

export default Index;
