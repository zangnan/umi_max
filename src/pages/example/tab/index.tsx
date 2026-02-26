import React from 'react';
import ProCard from '@ant-design/pro-card';
import DDTopTab from '@/components/DDTopTab';
import EgTssb from './eg_tssb';

const TableList: React.FC<unknown> = () => {
  const tabPane1 = <>
    <ProCard title="下载数据" tabs={{
        tabPosition: 'top',
        items: [
          { label: '出口报关单', key: 'tab1', children: '内容一' },
          { label: '加工贸易手账册', key: 'tab2', children: '内容二' },
          { label: '备案单证资料', key: 'tab3', children: '内容三' },
          { label: '配置页面', key: 'tab3', children: '内容四' },
        ],
      }}
    />
  </>;
  const tabPane2 = <>tabPane2</>;
  const tabPane3 = <>tabPane3</>;
  const tabPane4 = <EgTssb />;

  const tabs: any = [
    { tab: '进料加工业务统计查询', tabPane: tabPane1 },
    { tab: '进料加工业务免抵退税核销表', tabPane: tabPane2 },
    { tab: '已核销手（账）册海关数据调整表', tabPane: tabPane3 },
    { tab: '配置页面', tabPane: tabPane4 },
  ]

  return (<DDTopTab tabs={tabs} />);
};

export default TableList;
