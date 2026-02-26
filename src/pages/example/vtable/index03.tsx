import React, { useState, useEffect } from 'react';
import * as ReactVTable from '@visactor/react-vtable';
import * as VTable from '@visactor/vtable';
import { getReportGridData } from '@/services/hts/api';
import ProCard from '@ant-design/pro-card';

const headerStyle1 = { textStick: true };
const headerStyle2 = { fontWeight: 'normal' };
const headerStyle3 = {
  ...headerStyle1,
  // textAlign: 'right',
  bgColor: (arg: any) => {
    if (arg.dataValue === '行总计') {
      return '#d53701';
    }
    return '#ECF1F5';
  }
};
const headerStyle4 = {
  ...headerStyle1,
  bgColor: (arg: any) => {
    if (arg.dataValue === '行小计') {
      return '#a1e6f1';
    }
    return '#ECF1F5';
  }
};
const style1 = {
  padding: [8, 8, 8, 8],
  color: (args: any) => {
    if (args.dataValue >= 0) return 'black';
    return 'red';
  },
  bgColor: (arg: any) => {
    const rowHeaderPaths = arg.cellHeaderPaths.rowHeaderPaths;
    const colHeaderPaths = arg.cellHeaderPaths.colHeaderPaths;
    // console.info(arg);
    if (rowHeaderPaths?.[1]?.value === '行小计') {
      return '#ba54ba';
    } else if (rowHeaderPaths?.[0]?.value === '行总计') {
      return '#ff9900';
    }
    if (colHeaderPaths?.[0]?.value === '列总计') {
      return '#ba54ba';
    }
    return undefined;
  }
};
const format1 = (rec: any) => {
  return '$' + Number(rec).toFixed(2);
};
const sumNumberFormat = VTable.DataStatistics.numberFormat({
  prefix: 'SUM '
});
const countNumberFormat = VTable.DataStatistics.numberFormat({
  digitsAfterDecimal: 0,
  thousandsSep: '',
  suffix: ' orders'
});

const TableList: React.FC<unknown> = () => {
  const [ myRecords, setMyRecords ] = useState<any>([]);
  const [ myOption ] = useState<any>({
    rows: [
      { dimensionKey: 'Category', title: '大类', headerStyle: headerStyle3, width: 'auto' },
      { dimensionKey: 'Sub-Category', title: '子类', headerStyle: headerStyle4, width: 'auto' }
    ],
    columns: [
      { dimensionKey: 'Region', title: 'Region', headerStyle: headerStyle1, width: 'auto' },
      { dimensionKey: 'Segment', title: 'Segment', headerStyle: headerStyle1, width: 'auto' }
    ],
    indicators: [
      { indicatorKey: 'QuantityMin', title: '数量【最小】', width: 'auto', showSort: false, headerStyle: headerStyle2, style: style1 },
      { indicatorKey: 'QuantityMax', title: '数量【最大】', width: 'auto', showSort: false, headerStyle: headerStyle2, style: style1 },
      { indicatorKey: 'QuantityAvg', title: '数量【平均】', width: 'auto', showSort: false, headerStyle: headerStyle2, style: style1 },
      { indicatorKey: 'QuantitySum', title: '数量【合计】', width: 'auto', showSort: false, headerStyle: headerStyle2, style: style1 },
      { indicatorKey: 'QuantityCount', title: '数量【计数】', width: 'auto', showSort: false, headerStyle: headerStyle2, style: style1 },
      { indicatorKey: 'Sales', title: '销售额', width: 'auto', showSort: false, headerStyle: headerStyle2, format: format1, style: style1 },
      { indicatorKey: 'Profit', title: '利润', width: 'auto', showSort: false, headerStyle: headerStyle2, format: format1, style: style1 }
    ],
    corner: {
      titleOnDimension: 'row',
      headerStyle: headerStyle1,
    },
    dataConfig: {
      totals: {
        row: { showGrandTotals: true, showSubTotals: true, subTotalsDimensions: ['Category'], grandTotalLabel: '行总计', subTotalLabel: '行小计' },
        column: { showGrandTotals: true, showSubTotals: true, subTotalsDimensions: ['Region'], grandTotalLabel: '列总计', subTotalLabel: '列小计' },
      },
      aggregationRules: [
        // 做聚合计算的依据，如销售额如果没有配置则默认按聚合sum计算结果显示单元格内容
        // indicatorKey 指标名称  |   field 指标依据字段   |   aggregationType 计算类型 SUM MIN MAX AVG COUNT NONE
        { indicatorKey: 'QuantityMin', field: 'Quantity', aggregationType: 'MIN', formatFun: countNumberFormat },
        { indicatorKey: 'QuantityMax', field: 'Quantity', aggregationType: 'MAX', formatFun: sumNumberFormat },
        { indicatorKey: 'QuantityAvg', field: 'Quantity', aggregationType: 'AVG', formatFun: sumNumberFormat },
        { indicatorKey: 'QuantitySum', field: 'Quantity', aggregationType: 'SUM', formatFun: countNumberFormat },
        { indicatorKey: 'QuantityCount', field: 'Quantity', aggregationType: 'COUNT', formatFun: countNumberFormat },
        // { indicatorKey: 'OrderCount', field: 'Sales', aggregationType: VTable.TYPES.AggregationType.COUNT, formatFun: countNumberFormat },
        // { indicatorKey: 'AverageOrderSales', field: 'Sales', aggregationType: VTable.TYPES.AggregationType.AVG, formatFun: sumNumberFormat },
      ]
    },
    widthMode: 'standard',
    heightMode: 'autoHeight',
  });

  useEffect(() => {
    getReportGridData(`${API_URL_EXAMPLE}/example/vtable03`, {}).then((response) => {
      setMyRecords(response);
    })
  }, []);

  return (<>
    <ProCard style={{height: 'calc(100vh - 150px)'}}>
      <ReactVTable.PivotTable option={myOption} records={myRecords}
        // height={500}
      />
    </ProCard>
  </>);
};

export default TableList;
