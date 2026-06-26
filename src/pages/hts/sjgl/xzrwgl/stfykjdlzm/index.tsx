import cktsUtil from '@/pages/hts/cktsUtil';
import { Tabs } from 'antd';
import React, { useState } from 'react';
import Hgdzxzjy from './hgdzxzjy';
import Sdp from './sdp';
import Gxfpyt from './gxfpyt';
import { history } from 'umi';
import myUtil from '@/components/DDAssist/util';


const Index: React.FC<unknown> = () => {
  let name = '';
  let flag = false;
  if(history?.location?.pathname =='/02/0202/020202'){
    name='受托方已开具代理证明下载'
  }else if(history?.location?.pathname =='/02/0202/020203'){
    name='进项发票下载'
    flag = true;
  }else{
    name='消费税票下载'
  }
  let def = "hgdzxzjy";
  const { query } = history.location;
  if(query && Object.keys(query).length > 0){
    def = "sdp";
  }
  const [activeKey, setActiveKey] = useState<string>(def);
  const tabCallback = (key: any) => {
    setActiveKey(key)
  }
  // 是否包含进行票池菜单
  let jxpcflag = false;
  if(cktsUtil.menu.getMenuObjByPath('/02/0210')) {
    jxpcflag = true;
  }
  return (
    <>
      <div>
        <Tabs activeKey={activeKey} onChange={tabCallback} className="dd_layout_tabs dd_layout_tabs_bzgl" >
          <Tabs.TabPane tab={name} key="hgdzxzjy" className="hgdzxzjy">
            <Hgdzxzjy jxpcflag={jxpcflag}/>
          </Tabs.TabPane>
          {flag?<Tabs.TabPane tab="数电票版式文件" key="sdp" className="hgdzxzjy">
              <Sdp jxpcflag={jxpcflag} />
          </Tabs.TabPane>:<></>}
          {flag && jxpcflag?<Tabs.TabPane tab="更新发票用途" key="gxfpyt" className="hgdzxzjy">
              <Gxfpyt />
          </Tabs.TabPane>:<></>}
        </Tabs>
      </div>
    </>
  )
};

export default Index;
