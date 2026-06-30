import cktsUtil from '@/pages/hts/cktsUtil';
import React, { useRef } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import config from './config';
import Func from './f';
import DyBadzViewer from "@/pages/hts/badz/badzcommon/dyBadzViewer";
import myUtil from '@/components/DDAssist/util';

const Index: React.FC<unknown> = () => {
  const dyRef: any = useRef();
  const myConfig = { ...config }
  const qylx = cktsUtil.sys.enterpriseType();
  // 取企业类型，生产SC， 外贸WM
  if (qylx === 'WM') {
    myConfig.grid_columns[0].codeTable = ['CODE_WM_CS_ZXSB_LCSWSX', '01'];
    myConfig.grid_columns[0].filter = { type: 'Radio', codeTable: 'CODE_WM_CS_ZXSB_LCSWSX:01' };
    myConfig.grid_columns[2].hidden = false;
    myConfig.grid_filter_quick = [
      { label: '所属期', name: 'ssq', type: 'Input' },
      { label: '批次', name: 'sbpc', type: 'Input', searchButton: true },
    ];
  } else {
    myConfig.grid_columns[0].codeTable = ['CODE_SC_CS_ZXSB_LCSWSX', '01'];
    myConfig.grid_columns[0].filter = {};
    myConfig.grid_columns[2].hidden = true;
    myConfig.grid_filter_quick = [
      { label: '所属期', name: 'ssq', type: 'Input', searchButton: true },
    ];
  }

  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(dyRef);
    return otherRef;
  };
  return (
    <>
      <DDBunit2 config={myConfig} func={Func} key="assqpcdy" />
      <DyBadzViewer onRef={dyRef} />
    </>
  );
};

export default Index;
