import React, { useContext, useState, useEffect, useRef } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import unitConfig from './auto_config';
import Func from './f';
import unitConfig2 from '../app_module_field/auto_config';
import { Table } from 'antd';
import { queryListNs } from '@/services/hts/apiNs'
import { cloneDeep } from 'lodash';

const Unit2: React.FC<unknown> = () => {
const myConfig = { ...unitConfig };
const [childTable, setChildTable] = useState<any>({});

const expandedRowRender = (record: any) => {
  let key = record.module_key;
  const columns: any = unitConfig2.grid_columns;
  return <Table columns={columns} dataSource={childTable[key] || []} pagination={false} scroll={{ y: 313 }}/>;
};

  myConfig.gridParams = {
    expandable: {
      columnWidth: 35,
      size: 'small',
      expandedRowRender,
    },
    onExpand: (expanded: any, record: any) => {
    console.info(expanded);
    console.info(record);
    let key = record.module_key;
    let searchModel = [
      { type: 1, property: 'module_key', value: key, op: 'eq'}
    ];
    if (expanded && !childTable[key]) {
      queryListNs({page: 1, pageSize: 999999, searchModel: searchModel}, 'app_module_field').then((response) => {
      if (response?.code === '200' && response?.body?.rowCount > 0) {
        let childTableRows = response.body.rows || [];
        let childTableTmp: any = cloneDeep(childTable);
        childTableTmp[key] = childTableRows;
        setChildTable(childTableTmp);
      }
      });
    }
  }
  };

return <>
	<DDBunit2 config={myConfig} func={Func} />
</>;
};

export default Unit2;

