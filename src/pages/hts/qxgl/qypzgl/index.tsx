/**
 * title: 企业配置管理
 * author: lincb
 */
import React, {useRef } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import config from './config';
import Func from './f'
import ModalForm from './modal_form';
import Pzxx from './pzxx';

const index: React.FC<unknown> = () => {
  const modalFormRef: any = useRef();
  const pzxx: any = useRef();

  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(modalFormRef);
    otherRef.push(pzxx);
    return otherRef;
  };


  return <>
    <DDBunit2 config={config} func={Func} />
    <ModalForm onRef={modalFormRef} />
    <Pzxx onRef={pzxx} />
  </>
};

export default index;
