/**
 * title: 备案单证 - 单证备案 - 资料采集
 */
import React, { useRef } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from './zlcjConfig';
import Func from './zlcjFunc';
import DrawerList from './drawerList';
import BadzZlyl from '../../badzcommon/badzZlyl';
import { history } from 'umi';
import myUtil from '@/pages/common/myUtil';

const DzbaZlcj: React.FC<unknown> = () => {
  const badzZlylRef: any = useRef();
  const drawerRef: any = useRef();
  const myconfig = { ...config };
  const qylx = myUtil.sys.enterpriseType();
  // 取企业类型，生产SC， 外贸WM
  if (qylx === 'WM') {
    myconfig.grid_columns[1].codeTable = ['CODE_WM_CS_ZXSB_LCSWSX', '01'];
    myconfig.grid_columns[1].filter = { type: 'Radio', codeTable: ['CODE_WM_CS_ZXSB_LCSWSX', '01'] };
    myconfig.grid_columns[3].hidden = false;
    myconfig.grid_columns[7].hidden = false;  // 进货凭证号
    myconfig.filter_items = [
      { name: 'ssq', label: '所属期', type: 'Input' },
      { name: 'sbpc', label: '批次', type: 'Input' },
      { name: 'bgdhgbh', label: '出口报关单号/代理出口证明号', type: 'Input' },
      { name: 'ckhth', label: '合同协议号', type: 'Input' },
    ];
  } else {
    myconfig.grid_columns[1].codeTable = ['CODE_SC_CS_ZXSB_LCSWSX', '01'];
    myconfig.grid_columns[1].filter = {};
    myconfig.grid_columns[3].hidden = true;
    myconfig.grid_columns[7].hidden = true;  // 进货凭证号
    myconfig.filter_items = [
      { name: 'ssq', label: '所属期', type: 'Input' },
      { name: 'bgdhgbh', label: '出口报关单号/代理出口证明号', type: 'Input' },
      { name: 'ckhth', label: '合同协议号', type: 'Input' },
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
    if(cs.lcswsxDm){
      // 初始查询条件
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
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(badzZlylRef);
    otherRef.push(drawerRef);
    return otherRef;
  };
  return <>
    <DDBunit2 config={myconfig} func={Func} />
    <BadzZlyl onRef={badzZlylRef} gnmk='dzbazlcj' />
    <DrawerList onRef={drawerRef} />
  </>;
};

export default DzbaZlcj;