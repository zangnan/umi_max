import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import * as ReactVTable from '@visactor/react-vtable';
import { downloadExcel, exportVTableToExcel } from '@visactor/vtable-export';
import { getS2GridData } from '@/services/hts/api';
import myUtil from '../DDAssist/util';
import { Button } from 'antd';

export type DDPivotTableProps = {
  config?: any;
  onRef?: any;
  func?: any;
  searchModel?: any;
};

const DDPivotTable: React.FC<DDPivotTableProps> = ({ config, onRef, func, searchModel = [] }) => {
  const [ myRecords, setMyRecords ] = useState<any>([]);
  const [ myOption, setMyOption ] = useState<any>(config);
  const api_grid_query = config?.api_grid_query;
  const statisticRef: any = useRef();
  const [ tins, seTtins ] = useState<any>(null);

  const getData = () => {
    setMyOption(config);
    if (api_grid_query) {
      let searchModelTmp: any = [];
      if (config?.gridParams?.initSearchModal?.length > 0) {
        searchModelTmp = [...config?.gridParams?.initSearchModal];
      }
      if (searchModel?.searchModel?.length > 0) {
        searchModelTmp = [...searchModelTmp, ...searchModel?.searchModel];
      }
      getS2GridData(api_grid_query, {page: 1, pageSize: 999999, searchModel: searchModelTmp}).then((response: any) => {
        // debugger;
        let tmpData: any = []
        if (response?.body?.rows) {
          tmpData = response?.body?.rows;
        } else if (response?.body) {
          tmpData = response?.body;
        } else {
          tmpData = response;
        }
        // 处理数据 码表
        let columnsTmp: any = config.grid_columns || [];
        let columnsHasCodeTable: any = [];
        let colNeedFormat: any = [];
        for (let i = 0; i < columnsTmp.length; i++) {
          if (columnsTmp[i].codeTable) {
            columnsHasCodeTable.push(columnsTmp[i]);
          }
          // 处理render
          if (columnsTmp[i]?.render?.type === 'date'
              || columnsTmp[i]?.render?.type === 'number'
              || columnsTmp[i]?.render?.func
              // || columnsTmp[i]?.codeTable
          ) {
            colNeedFormat.push(columnsTmp[i]);
          }
        }
        if (columnsHasCodeTable.length > 0) {
          tmpData.map((tmp: any) => {
            Object.keys(tmp).forEach(key => { // 遍历行数据
              for (let n = 0; n < columnsHasCodeTable.length; n++) { // 遍历含有码表的列
                if (key === columnsHasCodeTable[n].dataIndex) {
                  tmp[key] = myUtil.code.getCodeValByKey(tmp[key], columnsHasCodeTable[n].codeTable);
                }
              }
            });
          })
        }
        // 处理render
        if (colNeedFormat.length > 0) {
          tmpData.map((tmp: any) => {
            Object.keys(tmp).forEach(key => { // 遍历行数据
              for (let n = 0; n < colNeedFormat.length; n++) { // 遍历需要处理的列
                if (key === colNeedFormat[n].dataIndex) {
                  if (colNeedFormat[n]?.render?.type === 'date') { // 日期格式化
                    tmp[key] = myUtil.date.formatDate(tmp[key], colNeedFormat[n]?.render?.format);
                  } else if (colNeedFormat[n]?.render?.type === 'number') { // 数值格式化
                    // tmp[key] = myUtil.text.formatNum(tmp[key], colNeedFormat[n]?.render?.format);
                  } else if (colNeedFormat[n]?.codeTable) { // 码表格式化
                    // tmp[key] = myUtil.code.getCodeValByKey(tmp[key], colNeedFormat[n].codeTable);
                  } else if (colNeedFormat[n]?.render?.func) {
                    tmp[key] = func.columnsRender[colNeedFormat[n]?.render?.func]({ record: tmp, });
                  }
                }
              }
            });
          })
        }
        setMyRecords(tmpData || []);
      })
    }
  }

  useEffect(() => {
    getData();
  }, [config]);

  // 导出
  const exportStaticticExcel = async () => {
    let optionForExport = {};
    downloadExcel(await exportVTableToExcel(tins, {...optionForExport}), 'export-csv');
  }

  // 刷新
  const refresh = async () => {
    getData();
  }

  // useImperativeHandle
  useImperativeHandle(onRef, () => {
    return {
      exportStaticticExcel,
      refresh,
    };
  });

  return (<>
    <div style={{height: 'calc(100vh - 175px)'}}>
      {/* <Button type="primary" onClick={() => exportStaticticExcel()} size='middle' >导出2</Button> */}
      {/* <Button type="primary" onClick={() => refresh()} size='middle' >刷新</Button> */}
      <ReactVTable.PivotTable option={myOption} records={myRecords} ref={statisticRef}
        onReady={(tableInstance, isFirst) => {
          seTtins(tableInstance);
        }}
      />
    </div>
  </>);
};

export default DDPivotTable;
