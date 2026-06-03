import React, { useRef } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from './config';
import Func from './f';
import myUtil from '@/pages/common/myUtil';
import DyBadzViewer from "@/pages/hts/badz/badzcommon/dyBadzViewer";
import BadzZlyl from '../../badzcommon/badzZlyl';
import { history } from 'umi';


const Index: React.FC<unknown> = () => {
  const dyRef: any = useRef();
  const badzZlylRef: any = useRef();
  const myConfig = { ...config }
  const qylx = myUtil.sys.enterpriseType();
  // 取企业类型，生产SC， 外贸WM
  if (qylx === 'WM') {
    myConfig.grid_columns[0].codeTable = ['CODE_WM_CS_ZXSB_LCSWSX', '01'];
    myConfig.grid_columns[0].filter = { type: 'Radio', codeTable: ['CODE_WM_CS_ZXSB_LCSWSX', '01'] };
    myConfig.grid_columns[2].hidden = false;
    myConfig.filter_items = [
      { name: 'ssq', label: '所属期', type: 'Input' },
      { name: 'sbpc', label: '批次', type: 'Input' },
      { name: 'bgdhgbh', label: '出口报关单号/代理证明号', type: 'Input' },
    ];
  } else {
    myConfig.grid_columns[0].codeTable = ['CODE_SC_CS_ZXSB_LCSWSX', '01'];
    myConfig.grid_columns[0].filter = {};
    myConfig.grid_columns[2].hidden = true;
    myConfig.filter_items = [
      { name: 'ssq', label: '所属期', type: 'Input' },
      { name: 'bgdhgbh', label: '出口报关单号/代理证明号', type: 'Input' },
    ];
  }

  if (history.location.search) {
    const search = history.location.search.replace('?', '');
    const csArr: any = search.split('&');
    const cs: any = {};
    csArr.forEach((item: any) => {
      const tmp: any = item.split('=');
      cs[tmp[0]] = tmp[1];
    });
    for (let i = 0; i < myConfig.filter_items.length; i++) {
      if (cs.hasOwnProperty(myConfig.filter_items[i].name)) {
        myConfig.filter_items[i].defaultValue = cs[myConfig.filter_items[i].name];
      }
    }
    if (cs.lcswsxDm) {
      // 初始查询条件
      myConfig.gridParams = {
        initSearchModal: [
          { property: 'lcswsxDm', value: cs.lcswsxDm, op: 'al' },
        ],
      }
    }

  } else {
    for (let i = 0; i < myConfig.filter_items.length; i++) {
      delete myConfig.filter_items[i].defaultValue;
    }
  }

  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(dyRef);
    otherRef.push(badzZlylRef);
    return otherRef;
  };

  return (
    <>
      <DDBunit2 config={myConfig} func={Func} key="abg" />
      <DyBadzViewer onRef={dyRef} />
      <BadzZlyl onRef={badzZlylRef} gnmk='zlgdylckxq' />
    </>
  );
};

export default Index;
