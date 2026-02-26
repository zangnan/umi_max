import React, { useState, useRef, useImperativeHandle } from 'react';
import { Switch, Radio, Form, Checkbox } from 'antd';
import DDStatisticsViewFun from './DDStatisticsViewFun';
import DDPivotTable from '../DDVTable/DDPivotTable';

export type DDStatisticsViewProps = {
  config?: any;
  onRef?: any;
  func?: any;
  searchModel?: any;
};

const DDStatisticsView: React.FC<DDStatisticsViewProps> = ({ config, onRef, func, searchModel = [] }) => {
  const refStatistic: any = useRef();
  const [formStatistics] = Form.useForm();
  const [statisticsConfig, setStatisticsConfig] = useState<any>(config);

  // 表单初始数据
  const initData = {
    rowHierarchyType: 'grid',
    showSubTotalsOnTop: true,
    showGrandTotalsOnTop: true,
    rowShowGrandTotals: true,
    rowShowSubTotals: true,
    columnShowGrandTotals: true,
    columnShowSubTotals: true,
    aggregationRules: DDStatisticsViewFun.defaultIndicatorMapForSelect(), // ['SUM'],
  };

  const chkAggregationRules = DDStatisticsViewFun.defaultIndicatorMap;

  // 导出
  const exportStaticticExcel = () => {
    refStatistic.current?.exportStaticticExcel();
  }

  // 刷新数据
  const refreshStaticticData = () => {
    refStatistic.current?.refresh();
  }

  // useImperativeHandle
  useImperativeHandle(onRef, () => {
    return {
      exportStaticticExcel,
      refreshStaticticData,
    };
  });

  return (<>
    <Form layout='inline' initialValues={initData} form={formStatistics} style={{margin: '12px 0 12px 0'}}>
      <Form.Item name="rowHierarchyType" label='展示方式'>
        <Radio.Group buttonStyle="solid" onChange={() => DDStatisticsViewFun.searchStatisticsData({formStatistics, statisticsConfig, setStatisticsConfig})}  size='small'>
          <Radio.Button value="grid">平铺</Radio.Button>
          <Radio.Button value="tree">树形</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item name="showSubTotalsOnTop" label='小计在上'>
        <Switch size='small' onChange={() => DDStatisticsViewFun.searchStatisticsData({formStatistics, statisticsConfig, setStatisticsConfig})}/>
      </Form.Item>
      <Form.Item name="showGrandTotalsOnTop" label='总计在上'>
        <Switch size='small' onChange={() => DDStatisticsViewFun.searchStatisticsData({formStatistics, statisticsConfig, setStatisticsConfig})}/>
      </Form.Item>
      <Form.Item name="rowShowGrandTotals" label='总计行'>
        <Switch size='small' onChange={() => DDStatisticsViewFun.searchStatisticsData({formStatistics, statisticsConfig, setStatisticsConfig})}/>
      </Form.Item>
      <Form.Item name="rowShowSubTotals" label='小计行'>
        <Switch size='small' onChange={() => DDStatisticsViewFun.searchStatisticsData({formStatistics, statisticsConfig, setStatisticsConfig})}/>
      </Form.Item>
      <Form.Item name="columnShowGrandTotals" label='总计列'>
        <Switch size='small' onChange={() => DDStatisticsViewFun.searchStatisticsData({formStatistics, statisticsConfig, setStatisticsConfig})}/>
      </Form.Item>
      <Form.Item name="columnShowSubTotals" label='小计列'>
        <Switch size='small' onChange={() => DDStatisticsViewFun.searchStatisticsData({formStatistics, statisticsConfig, setStatisticsConfig})}/>
      </Form.Item>
      <Form.Item name="aggregationRules" label='聚合方式'>
        <Checkbox.Group options={chkAggregationRules} onChange={() => DDStatisticsViewFun.searchStatisticsData({formStatistics, statisticsConfig, setStatisticsConfig})} />
      </Form.Item>
    </Form>
    <DDPivotTable config={statisticsConfig} onRef={refStatistic} func={func} searchModel={searchModel}/>
  </>);
};
export default DDStatisticsView;
