import React, { useState, useEffect } from 'react';
import * as ReactVTable from '@visactor/react-vtable';
import { getReportGridData } from '@/services/hts/api';

const headerStyle1 = { textStick: true };
const headerStyle2 = { fontWeight: 'normal' };
const style1 = {
  padding: [16, 28, 16, 28],
  color: (args: any) => {
    if (args.dataValue >= 0) return 'black';
    return 'red';
  }
};
const format1 = (rec: any) => {
  return '$' + Number(rec).toFixed(2);
};

const TableList: React.FC<unknown> = () => {

  const [ myRecords, setMyRecords ] = useState<any>([]);
  const [ myOption ] = useState<any>({
    rows: [
      { dimensionKey: 'City', title: '城市', headerStyle: headerStyle1, width: 'auto' }
    ],
    columns: [
      { dimensionKey: 'Category', title: 'Category', headerStyle: headerStyle1, width: 'auto' }
    ],
    indicators: [
      { indicatorKey: 'Quantity', title: '数量', width: 'auto', showSort: false, headerStyle: headerStyle2, style: style1, },
      { indicatorKey: 'Sales', title: '销售额', width: 'auto', showSort: false, headerStyle: headerStyle2, style: style1, format: format1, },
      { indicatorKey: 'Profit', title: '利润', width: 'auto', showSort: false, headerStyle: headerStyle2, style: style1, format: format1, }
    ],
    corner: {
      titleOnDimension: 'row',
      headerStyle: headerStyle1,
    },
    dataConfig: {
      sortRules: [
        {
          sortField: 'Category',
          sortBy: ['Office Supplies', 'Technology', 'Furniture']
        }
      ],
      totals: {
        row: {
          showGrandTotals: true,
          // showSubTotals: true,
          // subTotalsDimensions: ['Category'],
          grandTotalLabel: '行总计',
          // subTotalLabel: '行小计',
          // showGrandTotalsOnTop: true //汇总值显示在上
        },
        column: {
          showGrandTotals: true,
          // showSubTotals: true,
          // subTotalsDimensions: ['City'],
          grandTotalLabel: '列总计',
          // subTotalLabel: '列小计',
        }
        // row: {
        //   subTotalsDimensions: ['City'],
        // },
        // column: {
        //   subTotalsDimensions: ['Category'],
        // }
      }
    },
    widthMode: 'standard', // 'standard' | 'adaptive' | 'autoWidth'
    // heightMode: 'standard', // 'standard' | 'adaptive' | 'autoHeight'
  });

  useEffect(() => {
    getReportGridData(`${API_URL_EXAMPLE}/example/vtable02`, {}).then((response) => {
      setMyRecords(response);
    })
  }, []);

  return (<>
    <ReactVTable.PivotTable option={myOption} records={myRecords} height={500} />
  </>);
};

export default TableList;
