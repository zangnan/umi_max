/**
 * title: 出口货物收汇情况表
 * author: wx
 */
import React , { useRef } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from './auto_config';
import Func from './f'
import UnitUtil from '@/components/DDBunit/unit_util';
import ModalMbxz from './modal_dbtssh_mbxz';
import DDImport from '@/components/DDImport';
import ModalShtq from './modal_dbtssh_shtq';
import { cloneDeep } from 'lodash';
import myUtil from '@/pages/common/myUtil';


const index: React.FC<unknown> = () => {

  // const myConfig = { ...config };
  const myConfig = cloneDeep(config);
  myConfig.gridParams = {
    initSearchModal: [
      { property: 'lcswsxDm', value: UnitUtil.getLcswsxDm(config.unit_constant), op: 'al' },
    ],
  }

  const dataIndex = ['pzhm2', 'fhr'];
  myConfig.grid_columns.forEach((item: any) => {
    if (dataIndex.length > 0 && dataIndex.indexOf(item.dataIndex) > -1) {
      item.ellipsis = true;
    }
  })
  myConfig.grid_columns_tj.forEach((item: any) => {
    if (dataIndex.length > 0 && dataIndex.indexOf(item.dataIndex) > -1) {
      item.ellipsis = true;
    }
  })

  // 导入
  myConfig.import_key = 'SAAS_TSSB_MXCJ_CKSH_WM_DR';
  // 配置项：工具栏
  myConfig.toolbar_default.tssb_download = true;
  myConfig.toolbar_default.ckts_download = false;

  if (myUtil.menu.getMenuObjByPath('/hts/shgl/shsdsj')) {
    myConfig.costomer_toobar =  [
      { name: '收汇提取', key: 'dbtsShTq', func: 'dbtsShTq' },
      { name: '模板下载', key: 'dbtsShMbxz', func: 'dbtsShMbxz' },
      { name: '导入', key: 'dbtsShDr', func: 'dbtsShDr' },
      ];
  } else {
    myConfig.costomer_toobar =  [
      { name: '模板下载', key: 'dbtsShMbxz', func: 'dbtsShMbxz' },
      { name: '导入', key: 'dbtsShDr', func: 'dbtsShDr' },
      ];
  }

  const mbxzRef: any = useRef();
  const refDDImport: any = useRef();
  const shtqRef: any = useRef();



  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(mbxzRef);
    otherRef.push(refDDImport);
    otherRef.push(shtqRef);
    return otherRef;
  };
  return <>
    <DDBunit2 config={myConfig} func={Func} />
    <ModalMbxz onRef={mbxzRef} />
    <DDImport onRef={refDDImport} />
    <ModalShtq onRef={shtqRef} />

  </>
};
export default index;