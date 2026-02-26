import React, { useEffect } from 'react';
import { Typography, Card } from 'antd';
import DDDescriptions from '@/components/DDForm/DDDescriptions';
import formConfig from './config';

const TableList: React.FC<unknown> = () => {
  useEffect(() => {
  }, []);

  return (<>
    <Typography.Title level={4}>表单 - 简单示例</Typography.Title>
    <Card>
      <DDDescriptions config={formConfig}/>
    </Card>
  </>);
};

export default TableList;
