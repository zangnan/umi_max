/**
 * title: 备案单证 - 单证备案 - 单证备案
 */
import React, { useRef } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from './dzbaConfig';
import Func from './dzbaFunc';
import Hqsbsj from './hqsbsj';
import myUtil from '@/pages/common/myUtil';

export type dzbaProps = {
  ywKey?: any;
}
const DzbaDzba: React.FC<dzbaProps> = ({
  ywKey = 'MTS',
}) => {
  const xhshotRef: any = useRef();
  const myconfig = { ...config };
  const qylx = myUtil.sys.enterpriseType();
  // 取企业类型，生产SC， 外贸WM
  if (qylx === 'WM') {
    myconfig.grid_columns[0].codeTable = ['CODE_WM_CS_ZXSB_LCSWSX', '01'];
    myconfig.grid_columns[0].filter = { type: 'Radio', codeTable: ['CODE_WM_CS_ZXSB_LCSWSX', '01'] };
    myconfig.grid_columns[2].hidden = false;
    myconfig.grid_filter_quick = [
      { name: 'ssq', label: '所属期', type: 'Input' },
      { name: 'sbpc', label: '批次', type: 'Input', searchButton: true },
    ];
  } else {
    myconfig.grid_columns[0].codeTable = ['CODE_SC_CS_ZXSB_LCSWSX', '01'];
    myconfig.grid_columns[0].filter = {},
    myconfig.grid_columns[2].hidden = true;
    myconfig.grid_filter_quick = [
      { name: 'ssq', label: '所属期', type: 'Input', searchButton: true },
    ];
  }
  // if (!cktsUtil.moduleType(myYwKey, 'SBPC')) { // 是否有申报批次
  //   for (var i = 0; i < myconfig.grid_columns.length; i++) {
  //     if (myconfig.grid_columns[i].dataIndex === 'sbpc') {
  //       // 当没有批次的时候需要移除批次这一列
  //       myconfig.grid_columns.splice(i, 1)
  //     }
  //   }
  // }
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(xhshotRef);
    return otherRef;
  };
  return <>
    <DDBunit2 config={myconfig} func={Func} />
    <Hqsbsj onRef={xhshotRef} />
  </>;
};

export default DzbaDzba;