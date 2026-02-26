import React, { useContext, useState, useEffect, useRef } from 'react';
import DDBaseGrid from '@/components/DDBaseGrid';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import unitConfig from './auto_config';
import unitConfig2 from '../app_dict/auto_config';
import unitConfig2Fun from '../app_dict/f';
import Func from './f';
import { cloneDeep } from 'lodash';
import myUtil from '@/components/DDAssist/util';
import DDIT_TOOL_CONSTANTS from '@/components/DDBunit/excelConfig.v2.constants';
import { retrieveDictPager } from '@/services/hts/api';

const toCamel = myUtil.text.underscoreToCamel;
const CKEY = DDIT_TOOL_CONSTANTS.CONFIG_KEY;

const Unit2: React.FC<unknown> = () => {
  const [childTable, setChildTable] = useState<any>({});
  const myConfig = { ...unitConfig };

  const expandedRowRender = (record: any) => {
    let key = record[toCamel(CKEY.DICT_NAME)];
    const columns: any = unitConfig2.grid_columns;
    return <DDBaseGrid config={{ grid_columns: columns }} func={unitConfig2Fun} userDataSource={childTable[key] || []} pagination={false} scroll={{ y: 313 }}/>;
  };

  myConfig.gridParams = {
    expandable: {
      columnWidth: 35,
      size: 'small',
      expandedRowRender,
    },
    onExpand: (expanded: any, record: any) => {
      let key = record[toCamel(CKEY.DICT_NAME)];
      let searchModel = [
        { type: 1, property: toCamel(CKEY.DICT_NAME), value: key, op: 'eq'}
      ];
      if (expanded && !childTable[key]) {
        retrieveDictPager({page: 1, pageSize: 999999, searchModel: searchModel}).then((response: any) => {
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

