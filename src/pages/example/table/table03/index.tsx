import React, { useState, useEffect } from 'react';
import DDBaseGrid from '@/components/DDBaseGrid';
import ProCard from '@ant-design/pro-card';
import tableConfig from './config';
import { Typography } from 'antd';
import { getGridData } from '@/services/hts/api';

const TableList: React.FC<unknown> = () => {
  const [gridData, setGridData] = useState<any>([]);

  // 获取数据
  const getData = () => {
    getGridData(`${API_URL_EXAMPLE}/hx/ty/crud/queryPager2`, {}).then((response: any) => {
      setGridData(response?.body || []);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (<>
    <Typography.Title level={4}>传入数据 & 前端分页</Typography.Title>
    <ProCard>
      <DDBaseGrid config={tableConfig} userDataSource={gridData} />
    </ProCard>
    <Typography.Title level={4}>传入数据 & 无分页</Typography.Title>
    <ProCard>
      <DDBaseGrid config={tableConfig} userDataSource={gridData} pagination={false} />
    </ProCard>
  </>);
};

export default TableList;
