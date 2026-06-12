import React, {useRef} from 'react';
import cktsUtil from '@/pages/hts/cktsUtil';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import unitConfig from './auto_config';
import Func from './auto_configFun';

const Unit: React.FC<unknown> = () => {
  // 改变默认配置项
  const myConfig = { ...unitConfig };
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

  if (cktsUtil.menu.getMenuObjByPath('/hts/shgl/shsdsj')) {
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
  myConfig.gridParams = {
    initSearchModal: [
      { property: 'lcswsxDm', value: cktsUtil.getLcswsxDm(myConfig.unit_constant), op: 'al' },
    ],
  };

  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>;
};
export default Unit;
