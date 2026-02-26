import React, { useState, useRef } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import unitConfig from './auto_config';
import unitConfig2 from '../app_dict_field/auto_config';
import Func from './f';
import { Table } from 'antd';
import { queryListNs } from '@/services/hts/apiNs'
import { cloneDeep } from 'lodash';
import myUtil from '@/components/DDAssist/util';
import DDIT_TOOL_CONSTANTS from '@/components/DDBunit/excelConfig.v2.constants';
import DDExportNodeEnv from '@/components/DDExportNodeEnv';

const toCamel = myUtil.text.underscoreToCamel;
const CKEY = DDIT_TOOL_CONSTANTS.CONFIG_KEY;

const Unit2: React.FC<unknown> = () => {
  const [childTable, setChildTable] = useState<any>({});
  const myConfig = { ...unitConfig };

  const expandedRowRender = (record: any) => {
    let key = record.dict_name;
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
      let key = record.dict_name;
      let searchModel = [
        { type: 1, property: 'dict_name', value: key, op: 'eq'}
      ];
      if (expanded && !childTable[key]) {
        queryListNs({page: 1, pageSize: 999999, searchModel: searchModel}, 'dict_field').then((response: any) => {
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

	const ModalRef1: any = useRef();
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(ModalRef1);
    return otherRef;
  };

	const getExportColumns = () => {
		const fieldColumns = [
			{ title: '物理表字段英文名', dataIndex: CKEY.DICT_FIELD_NAME, width: 180 },
			{ title: '物理表字段中文名', dataIndex: CKEY.DICT_FIELD_DESC, width: 180 },
			{ title: '数据元类型', dataIndex: CKEY.DICT_FIELD_TYPE, width: 180 },
			{ title: '键', dataIndex: CKEY.DICT_FIELD_KEY, width: 80 },
			{ title: '默认值', dataIndex: CKEY.DICT_FIELD_DEFAULT_VALUE, width: 80 },
			{ title: '非空', dataIndex: CKEY.DICT_FIELD_NOT_NULL, width: 80 },
		];
		let exportColumns: any = [...myConfig.grid_columns, ...fieldColumns];
		return exportColumns;
	};

  return <>
    <DDBunit2 config={myConfig} func={Func} />
    <DDExportNodeEnv onRef={ModalRef1} settingDataColumn={getExportColumns()} />
  </>;
};

export default Unit2;

