/**
 * title: 外贸企业调整申报
 * author: wx
 */
import React, { useRef, }  from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import config from './auto_config';
import Func from './f'
import Cjsb from './cjsb'
import Hysbqk from './hysbqk'
import { cloneDeep } from 'lodash';
import Hwccj from "./hwccjModal";





const index: React.FC<unknown> = () => {

  const myConfig = cloneDeep(config);

  // 导入
  myConfig.import_key = 'SAAS_TSSB_MXCJ_TZSB_DR';
  myConfig.toolbar_default.tssb_download = true;
  myConfig.toolbar_default.ckts_download = false;
  myConfig.customer_toolbar = [
    /*{ name: '冲减申报', key: 'cjsb', func: 'handleCjsb'}*/
    {
      name: '红字冲减',
      type: 'dropdown',
      list: [
        {name: '明细冲减', key: 'cjsb', func: 'handleCjsb'},
        {name: '海外仓冲减', key: 'hwccj', func: 'hwccj'},
      ],
    },
  ];
  myConfig.grid_columns_tj.push({ title: '还原标志', dataIndex: 'hybz', width: 90,codeTable: 'code_static_yes_no:01' ,filter:{
    type: 'Select',
    codeTable: 'code_static_yes_no:01',
  }},)
  const cjsbRef: any = useRef();
  const hysbqkRef: any = useRef();
  const hwccjRef: any = useRef();    // 海外仓冲减
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(cjsbRef);
    otherRef.push(hysbqkRef);
    otherRef.push(hwccjRef);
    return otherRef;
  };

  myConfig.customer_toolbar_tj = [ { name: '还原申报情况', key: 'hysbqk', func: 'hysbqk' },];

  return <>
    <DDBunit2 config={myConfig} func={Func} />
    <Cjsb onRef={cjsbRef} />
    <Hysbqk onRef={hysbqkRef} />
    <Hwccj onRef={hwccjRef}/>
  </>
};
export default index;
