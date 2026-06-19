/**
 * title: 出口货物收汇情况表
 * author: wx
 */
import React , { useRef } from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import config from './auto_config';
import Func from './f'
import cktsUtil from '@/pages/hts/cktsUtil';
import ModalMbxz from './modal_mdtsh_mbxz';
import DDImport from '@/components/DDImport';
import ModalShtq from './modal_mdtsh_shtq';
import { cloneDeep } from 'lodash';
import myUtil from '@/components/DDAssist/util';

const index: React.FC<unknown> = () => {

  // const myConfig = { ...config };
  const myConfig = cloneDeep(config);

  myConfig.gridParams = {
    initSearchModal: [
      { property: 'lcswsxDm', value: cktsUtil.getLcswsxDm(myConfig.unit_constant), op: 'al' },
    ],
  }
  // 补充悬浮
  const dataIndex = ['stshqkckhth', 'stshqkjzclzl', 'fhr', 'pzhm2'];
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

  myConfig.form_items.forEach((item: any) => {
    // “出口收汇币种代码”、 “出口销售币种代码”添加onChange事件
    if (item.name === "ckshhbzmDm" || item.name === 'cjhbzmDm') {
      item.eventOnChange = "hbhlDm";
    }
  })

  myConfig.toolbar_default.tssb_download = true;
  myConfig.toolbar_default.ckts_download = false;
  // 导入
  myConfig.import_key = 'SAAS_TSSB_MXCJ_CKSH_SC_DR';
  if (cktsUtil.menu.getMenuObjByPath('/hts/shgl/shsdsj')) {
    myConfig.costomer_toobar =  [
      { name: '收汇提取', key: 'mdtShTq', func: 'mdtShTq' },
      { name: '模板下载', key: 'mdtShMbxz', func: 'mdtShMbxz' },
      { name: '导入', key: 'mdtShDr', func: 'mdtShDr' },
      ];
  } else {
    myConfig.costomer_toobar =  [
      { name: '模板下载', key: 'mdtShMbxz', func: 'mdtShMbxz' },
      { name: '导入', key: 'mdtShDr', func: 'mdtShDr' },
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