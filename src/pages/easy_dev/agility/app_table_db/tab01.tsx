import React, { useState, useRef } from 'react';
import { Table } from 'antd';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import unitConfig from './auto_config';
import Func from './f';
import myUtil from '@/components/DDAssist/util';
import DDIT_TOOL_CONSTANTS from '@/components/DDBunit/excelConfig.v2.constants';
import DDExportNodeEnv from '@/components/DDExportNodeEnv';
import CONSTANTS from '@/components/DDAssist/constants';

const toCamel = myUtil.text.underscoreToCamel;
const CKEY = DDIT_TOOL_CONSTANTS.CONFIG_KEY;

const Unit2: React.FC<unknown> = () => {
  const [childTable, setChildTable] = useState<any>({});
	const myConfig = { ...unitConfig };

	const tableManagered: any = '1';
	const tableNameLabel: any = toCamel(CKEY.DICT_NAME);

	const initSearchModal: any = [
		{ property: 'tableType', value: "物理表", op: CONSTANTS.FILTER_CONDITION.include.condetionCode, type: "1" },
		{ property: 'tableManagered', value: tableManagered, op: CONSTANTS.FILTER_CONDITION.equal.condetionCode, type: "1" },
	];

	Func.initSearchModal = initSearchModal;
	Func.tabFlag = '1';

  const expandedRowRender = (record: any) => {
    let key = record[toCamel(CKEY.DICT_NAME)];
    return <Table columns={Func.expandedRowRendercolumns} dataSource={childTable[key] || []} pagination={false} scroll={{ y: 313 }}/>;
  };

	myConfig.gridParams = Func.getgridParams(initSearchModal, expandedRowRender, tableNameLabel, tableManagered, childTable, setChildTable);

	const ModalRef1: any = useRef();
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(ModalRef1);
    return otherRef;
  };

	return <>
		<DDBunit2 config={myConfig} func={Func} />
    <DDExportNodeEnv onRef={ModalRef1} settingDataColumn={Func.getExportColumns(myConfig)} />
	</>;
};

export default Unit2;
