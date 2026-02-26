import React from 'react';
import DDBaseGridS2 from '@/components/DDBaseGridS2';
import ProCard from '@ant-design/pro-card';
import config from './antvs203Config';
import { Typography } from 'antd';

const TableList: React.FC<unknown> = () => {
  return (<>
    <Typography.Title level={4}>S2后端分页 - 简单示例</Typography.Title>
    <ProCard>
      <DDBaseGridS2 config={config} />
    </ProCard>
    </>);
};

export default TableList;
