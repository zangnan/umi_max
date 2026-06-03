import { Tabs } from 'antd';
import React from 'react';
import Hgdzxzjy from './hgdzxzjy';
import Zmsq from './zmsq';
import Qtsb from './qtsb';
import Jmsj from './jmsj';
import myUtil from '@/pages/common/myUtil';
import { useAccess, Access  } from 'umi';
import qxUtil from '@/pages/common/qxUtil';
import Hwc9810 from './hwc9810';


const Index: React.FC<unknown> = () => {
  const qylx = myUtil.sys.enterpriseType();
  // 权限管理差异化
  const access = useAccess(); // 权限
  // 金四地区标识
  const jsdz = qxUtil.getZy({ zycode: 'S_000001_000001', accessObj: access, })
  const paramQx = {
    qxCode: 'swfkxz_index',
    accessObj: access,
  }

  return (
    <>
      <div>
        <Access accessible={!qxUtil.getQxz(paramQx)} fallback={
          <Tabs defaultActiveKey="hgdzxzjy" className="dd_layout_tabs dd_layout_tabs_bzgl">
            <Tabs.TabPane tab="退（免）税申报" key="hgdzxzjy" className="hgdzxzjy">
              <Hgdzxzjy />
            </Tabs.TabPane>
            {qylx =='WM' ?<></>:<Tabs.TabPane tab="加贸数据" key="jmsj" className="jmsj">
                <Jmsj />
              </Tabs.TabPane>
            } 
          </Tabs>
        }>
          <Tabs defaultActiveKey="hgdzxzjy" className="dd_layout_tabs dd_layout_tabs_bzgl">
            <Tabs.TabPane tab="退（免）税申报" key="hgdzxzjy" className="hgdzxzjy">
              <Hgdzxzjy />
            </Tabs.TabPane>
            <Tabs.TabPane tab="证明申请" key="zmsq" className="zmsq">
              <Zmsq />
            </Tabs.TabPane>
            {jsdz ? <></> : <Tabs.TabPane tab="其他申报" key="qtsb" className="qtsb">
              <Qtsb />
            </Tabs.TabPane>}
            {qylx =='WM' ?<></>:<Tabs.TabPane tab="加贸数据" key="jmsj" className="jmsj">
                <Jmsj />
              </Tabs.TabPane>
            }
            <Tabs.TabPane tab="海外仓9810" key="hwc9810" className="hwc9810">
              <Hwc9810 />
            </Tabs.TabPane>
          </Tabs>
        </Access>
      </div>
    </>
  )
};

export default Index;
