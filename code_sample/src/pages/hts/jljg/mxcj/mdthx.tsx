/**
 * title: 核销申报数据管理-免抵退核销表
 * creator: zxy
 */
import React from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import mdthxConfig from './mdthxconfig';
import Func from './f';
import { history } from 'umi';




const Mdthx: React.FC<unknown> = () => {

  const config = { ...mdthxConfig };

  if( history.location.pathname.indexOf('/jljg/ckts/scsbsj/JLJG_MDTHX') >-1){
    config.unit_key = 'JLJG_ZXSB_SB_JLJG_MDTHX_YSC';                                         // 业务单元key，对应后端接口
  }

  return <>
    <DDBunit2 config={config} func={Func} />
  </>;
};

export default Mdthx;
