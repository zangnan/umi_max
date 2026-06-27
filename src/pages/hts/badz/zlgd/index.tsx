/**
 * title: 备案单证 - 资料归档
 */
import cktsUtil from '@/pages/hts/cktsUtil';
import React, { useRef } from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import config from './zlgdConfig';
import Func from './zlgdFunc';
import BadzZlyl from '../badzcommon/badzZlyl';
import { history } from 'umi';
import myUtil from '@/components/DDAssist/util';

const DzbaZlcj: React.FC<unknown> = () => {

  const myconfig = { ...config };
  const qylx = cktsUtil.sys.enterpriseType();
  // 取企业类型，生产SC， 外贸WM
  if (qylx === 'WM') {
    myconfig.grid_columns[0].codeTable = ['CODE_WM_CS_ZXSB_LCSWSX', '01'];
    myconfig.grid_columns[0].filter = { type: 'Radio', codeTable: 'CODE_WM_CS_ZXSB_LCSWSX:01' };
    myconfig.grid_columns[2].hidden = false;
    myconfig.grid_columns[7].hidden = false;
    myconfig.filter_items = [
      { name: 'ssq', label: '所属期', type: 'Input' },
      { name: 'sbpc', label: '批次', type: 'Input' },
      { name: 'bgdhgbh', label: '出口报关单号/代理证明号', type: 'Input' },
    ];
  } else {
    myconfig.grid_columns[0].codeTable = ['CODE_SC_CS_ZXSB_LCSWSX', '01'];
    myconfig.grid_columns[0].filter = {};
    myconfig.grid_columns[2].hidden = true;
    myconfig.grid_columns[7].hidden = true;
    myconfig.filter_items = [
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
    for (let i = 0; i < myconfig.filter_items.length; i++) {
      if (cs.hasOwnProperty(myconfig.filter_items[i].name)) {
        myconfig.filter_items[i].defaultValue = cs[myconfig.filter_items[i].name];
      }
    }
     // 初始查询条件
    if(cs.lcswsxDm){
      myconfig.gridParams = {
        initSearchModal: [
       { property: 'lcswsxDm', value: cs.lcswsxDm, op: 'al' },
      ],
      }
    }
  } else {
    for (let i = 0; i < myconfig.filter_items.length; i++) {
      delete myconfig.filter_items[i].defaultValue;
    }
  }

  const badzZlylRef: any = useRef();
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(badzZlylRef);
    return otherRef;
  }
  return <>
    <DDBunit2 config={myconfig} func={Func} />
    <BadzZlyl onRef={badzZlylRef} gnmk='zlgdylckxq' />
  </>;
};

export default DzbaZlcj;