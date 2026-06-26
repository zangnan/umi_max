import { Tabs } from 'antd';
import React, { useState, useEffect} from 'react';
import Xxfpxz from './xxfpxz';
import Xxfpbswj from './xxfpbswj';
import { history } from 'umi';
import {pdCdqxBySbqyuuid } from '@/pages/hts/services/htsApi';


const Index: React.FC<unknown> = () => {

  const [xxczflag, setXxczflag] = useState<any>(true);
  const [activeKey, setActiveKey] = useState<string>('xxfpxz');

  useEffect(() => {
    querySfbhXxcd();
  }, [xxczflag]);

  const querySfbhXxcd = async () => {
    await pdCdqxBySbqyuuid({cdDms: ['0212']}).then(async (res: any) => {
      const {code,body} = res;
      if (code === '200') {
        if (!body?.isTrue) {
          setXxczflag(false);
          setActiveKey('xxfpbswj');
        }
      }
    }).finally(() => {
      const {query} = history.location;
      if(query && Object.keys(query).length > 0){
        setActiveKey('xxfpbswj');
      }
    });
  }
  const tabCallback = (key: any) => {
    setActiveKey(key)
  }
  return (
    <>
      <div>
        <Tabs activeKey={activeKey} onChange={tabCallback} className="dd_layout_tabs dd_layout_tabs_bzgl" >
          {xxczflag?
            <Tabs.TabPane tab="销项发票下载" key="xxfpxz" className="xxfpxz">
              <Xxfpxz />
            </Tabs.TabPane> : 
            <></>
          }
          <Tabs.TabPane tab="数电票版式文件" key="xxfpbswj" className="xxfpxz">
            <Xxfpbswj />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </>
  )
};

export default Index;
