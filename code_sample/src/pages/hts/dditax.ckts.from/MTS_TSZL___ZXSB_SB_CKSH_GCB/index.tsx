/**
 * title: 出口收汇
 * author:
 */
import React , { useRef } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import UnitUtil from '@/components/DDBunit/unit_util';
import config from './auto_config';
import Func from './f';
import ModalMbxz from './modal_mtssh_mbxz';
import DDImport from '@/components/DDImport';
import ModalShtq from './modal_mtssh_shtq';
import { cloneDeep } from 'lodash';
import myUtil from '@/pages/common/myUtil';


const Index: React.FC<unknown> = () => {

  // const myConfig = { ...config };
  const myConfig = cloneDeep(config);
  // 补充悬浮
  const dataIndex = ['stshqkckhth', 'stshqkjzclzl', 'fhr'];
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
  myConfig.gridParams = {
    initSearchModal: [
      { property: 'lcswsxDm', value: UnitUtil.getLcswsxDm(config.unit_constant), op: 'al' },
    ],
  }
  myConfig.toolbar_default.tssb_download = true;
  myConfig.toolbar_default.ckts_download = false;
  // 导入
  myConfig.import_key = 'SAAS_TSSB_MXCJ_CKSH_WM_DR';

  if (myUtil.menu.getMenuObjByPath('/hts/shgl/shsdsj')) {
    myConfig.costomer_toobar =  [
      { name: '收汇提取', key: 'mtsShTq', func: 'mtsShTq' },
      { name: '模板下载', key: 'mtsShMbxz', func: 'mtsShMbxz' },
      { name: '导入', key: 'mtsShDr', func: 'mtsShDr' },
      ];
  } else {
    myConfig.costomer_toobar =  [
      { name: '模板下载', key: 'mtsShMbxz', func: 'mtsShMbxz' },
      { name: '导入', key: 'mtsShDr', func: 'mtsShDr' },
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

export default Index;