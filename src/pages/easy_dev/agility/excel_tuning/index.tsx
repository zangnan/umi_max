import React, { useRef } from 'react';
import { Tabs, Button } from 'antd';
import { FooterToolbar } from '@ant-design/pro-components';
import ProCard from '@ant-design/pro-card';

import Module from './module';
import Table from './table';
import Dict from './dict';

const Index: React.FC<unknown> = () => {
  const moduleRef: any = useRef();
  const tableRef: any = useRef();
  const dictRef: any = useRef();

  const onSave = () => {
    const moduleData = moduleRef.current?.getData();
    const tableData = tableRef.current?.getData();
    const dictData = dictRef.current?.getData();
    const allData = {
      module: moduleData,
      table: tableData,
      dict: dictData
    }
    console.log('allData', allData);
  };


  const items: any = [
    { key: '1', label: '模块', forceRender: true, children: <Module onRef={moduleRef} /> },
    { key: '2', label: '表', forceRender: true, children: <Table onRef={tableRef} /> },
    { key: '3', label: '字典', forceRender: true, children: <Dict onRef={dictRef} /> }
  ]

  return (
    <>
      <ProCard split="horizontal">
        <ProCard className="dd-grid-wrap">
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="模块" key="1" forceRender>
              <Module onRef={moduleRef} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="表" key="2" forceRender>
              <Table onRef={tableRef} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="字典" key="3" forceRender>
              <Dict onRef={dictRef} />
            </Tabs.TabPane>
          </Tabs>
        </ProCard>
      </ProCard>
      <FooterToolbar >
        <Button type='primary' onClick={onSave}>保存</Button>
      </FooterToolbar>
    </>
  );
};

export default Index;