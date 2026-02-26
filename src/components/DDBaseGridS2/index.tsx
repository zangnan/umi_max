import React, { useState, useEffect, memo } from 'react';
import { SheetComponent } from '@antv/s2-react';
// import '@antv/s2-react/dist/style.min.css';
import { getS2GridData } from '@/services/hts/api';
import { Button } from 'antd';
import tableUtilS2 from './tableUtilS2';
import { getTheme, CustomColCell, CustomDataCell } from './defaultConfig';
import myUtil from '../DDAssist/util';
// import { getTheme, CustomColCell } from './defaultConfig';

export type DDBaseGridS2Props = {
  config: any;
};

const DDBaseGridS2: React.FC<DDBaseGridS2Props> = ({ config }) => {
  const [columnsObj] = useState<any>(tableUtilS2.initColumn(config?.grid_columns || []));
  const [myColumns] = useState<any>(columnsObj.column);
  const [dataCfg, setDataCfg] = useState<any>();
  const [sheetType, setSheetType] = useState<any>(config?.sheet_type || ''); // table or ''
  const [sheetTypeTable, setSheetTypeTable] = useState<any>(config?.sheet_type_table || {});
  const [s2Option, setS2Option] = useState<any>({});
  const [showPagination, setShowPagination] = useState<any>(config?.grid_pagination !== undefined ? config?.grid_pagination : true);
  const [pagination, setPagination] = useState<any>({
    current: 1,
    pageSize: 20,
  });
  const [sortParams, setSortParams] = React.useState([]);
  const api_grid_query = config?.api_grid_query;
  const grid_show_serial_number = config?.grid_show_serial_number !== undefined ? config?.grid_show_serial_number : false;

  const header =  {
    title: '出口进货明细',
    description: '出口进货明细出口进货明细',
    export: { open: true },
    advancedSort: {
      open: true,
      sortParams,
      onSortConfirm: (ruleValues: any, sortParams: any) => {
        setDataCfg({ ...dataCfg, sortParams });
        setSortParams(sortParams);
      },
    },
    switcher: { open: true },
    extra: (
      <Button size={'small'} style={{ verticalAlign: 'top' }}>自定义按钮</Button>
    ),
  };

  // 获取数据
  const setGridData = () => {
    let fieldsTmp: any;
    if (sheetType === 'table') {
      fieldsTmp = {
        columns: myColumns,
      };
    } else {
      fieldsTmp = {
        rows: sheetTypeTable.rows,
        columns: sheetTypeTable.columns,
        values: sheetTypeTable.values,
        valueInCols: true
      }
    }
    const dataCfg: any = {
      fields: fieldsTmp,
      meta: myColumns,
    };
    if (api_grid_query) {
      getS2GridData(api_grid_query, {page: 1, pageSize: 999999, searchModel: []}).then((response) => {
        let tmpData: any = []
        if (response?.body?.rows) {
          tmpData = response?.body?.rows;
        } else if (response?.body) {
          tmpData = response?.body
        } else {
          tmpData = response
        }
        // debugger;
        tmpData = myUtil.grid.formatGridData(tmpData, myColumns);
        // debugger;
        getS2Options();
        setDataCfg({
          ...dataCfg,
          data: tmpData,
        });
      })
    }
  }

  const getS2Options: any = () => {
    let colCount = columnsObj?.colCount; // 冻结列的数量，从左侧开始计数
    let trailingColCount = columnsObj?.trailingColCount; // 冻结列的数量，从右侧开始计数
    if (colCount > 0 && grid_show_serial_number) {
      colCount = colCount + 1;
    }
    let opt: any = {
      height: 600,
      seriesNumber: {
        enable: grid_show_serial_number,
        text: '序号'
      },
      pagination,
      frozen: {
        colCount,
        trailingColCount,
      },
      // style: {
      //   colCell: {
      //     width: (colNode: any) => {
      //       return colNode.extra?.width || 80;
      //     },
      //   },
      // },
      // colCell: (node: any, spreadsheet: any, headerConfig: any) => {
      //   return new CustomColCell(node, spreadsheet, headerConfig);
      // },
      // dataCell: (viewMeta: any) => {
      //   return new CustomDataCell(viewMeta, viewMeta?.spreadsheet);
      // },
    };
    setS2Option(opt);
    return opt;
  };

  const themeCfg: any = {
    theme: getTheme('light'), // dark light
  };

  useEffect(() => {
    setGridData();
  }, [config]);

  const tableEle: any = <div className='dd-table'>
    <SheetComponent
      sheetType={sheetType}
      dataCfg={dataCfg}
      options={s2Option}
      themeCfg={themeCfg}
      adaptive={true}
      // showPagination={showPagination}
      // showPagination={{
      //   onChange: (current, pageSize) => {
      //     console.log(current, pageSize);
      //   },
      //   onShowSizeChange: (current, pageSize) => {
      //     console.log(current, pageSize);
      //   },
      // }}
      // adaptive={{ width: true, height: true }}
      // header={header}
    />
  </div>;

  const getResult: any = () => {
    return tableEle;
  }

  return getResult();
};
export default memo(DDBaseGridS2);