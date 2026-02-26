import Spreadsheet from 'react-spreadsheet';
import { useState, useEffect, useImperativeHandle } from 'react';

import myUtil from '@/components/DDAssist/util';
import DDIT_TOOL_CONSTANTS from '@/components/DDBunit/excelConfig.v2.constants';
import { retrieveTablePager } from '@/services/hts/api';

const toCamel = myUtil.text.underscoreToCamel;
const CKEY = DDIT_TOOL_CONSTANTS.CONFIG_KEY;

export interface Props {
  onRef?: any;
}

const Index: React.FC<Props> = ({
  onRef
}) => {
  const [dataItem, setDataItem] = useState([]);

  useEffect(() => {
    let searchModel = [
      { type: 1, property: 'dictName', value: 's_tsjh', op: 'alike'}
    ];
    // retrieveTablePager({page: 1, pageSize: 999999, searchModel: searchModel}).then((response) => {
    retrieveTablePager({page: 1, pageSize: 999999, searchModel: []}).then((response) => {
      if (response?.code === '200' && response?.body?.rowCount > 0) {
        const tmpData: any = [];
        const childTableRows = response.body.rows || [];
        childTableRows.forEach((item: any) => {
          tmpData.push(
            [
              { value: item['tableName'], name: 'tableName' },
              { value: item['tableDesc'], name: 'tableDesc' },
              { value: item['tableType'], name: 'tableType' },
              { value: item['tableAlias'], name: 'tableAlias' },
              { value: item['dictName'], name: 'dictName' },
              { value: item['dictDesc'], name: 'dictDesc' },
              { value: item['dbOrder'], name: 'dbOrder' },
              { value: item['dbCleanFlag'], name: 'dbCleanFlag' },
            ]
          );
        });
        setDataItem(tmpData);
      }
    });
  }, []);
  const columnLabels = [
    '物理表名称',
    '物理表含义',
    '逻辑表类型',
    '别名',
    '数据字典名',
    '数据字典含义',
    '缺省数据查询顺序',
    '清空标志',
  ];

  const onChange = (data: any) => {
    setDataItem(data);
  }

  const getData = () => {
    const arr: any = []
    dataItem.forEach((item: any) => {
      let obj: any = {}
      item.forEach((itemValue: any) => {
        obj = { ...obj, [itemValue.name]: itemValue.value }
      })
      arr.push(obj);
    });
    return arr;
  }

  useImperativeHandle(onRef, () => {
    return {
      getData,
    };
  });

  return (
    <>
      <div style={{overflowX: 'auto', overflowY: 'auto', height: '500px'}}>
        <Spreadsheet
          data={dataItem}
          columnLabels={columnLabels}
          onChange={onChange}
        />
      </div>
    </>
  );
};

export default Index;