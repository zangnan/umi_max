import React from 'react';
import DDBaseGrid from '@/components/DDBaseGrid';
import ProCard from '@ant-design/pro-card';
import tableConfig from './config';
import { Typography } from 'antd';

const TableList: React.FC<unknown> = () => {
  return (<>
    <Typography.Title level={4}>后端分页 - 简单示例</Typography.Title>
    <ProCard>
      <DDBaseGrid config={tableConfig} />
    </ProCard>
    </>);
};

export default TableList;
