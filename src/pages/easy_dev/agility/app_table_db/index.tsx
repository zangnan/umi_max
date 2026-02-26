import React from 'react';
import { Tabs } from 'antd';
import ProCard from '@ant-design/pro-card';
import Tab01 from './tab01';
import Tab02 from './tab02';

const Unit2: React.FC<unknown> = () => {
  return <>
    <div >
      <ProCard className="dd-grid-wrap">
        <Tabs destroyOnHidden={true} items={[
          { key: '1', label: '物理表（字典管理）', children: <Tab01 />, },
          { key: '2', label: '物理表（非字典管理）', children: <Tab02 />, }
        ]}>
        </Tabs>
      </ProCard>
    </div>
  </>;
};

export default Unit2;

