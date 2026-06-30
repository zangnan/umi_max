/**
 * title: 后端服务
 * author: lincb
 */
import React, { useEffect, useState, useRef } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import config from './config';
import Func from './f'
import Add from './add';
import ModalForm from './modal_form';

const index: React.FC<unknown> = () => {
  const addRef: any = useRef();
  const modalFormRef: any = useRef();


  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(addRef);
    otherRef.push(modalFormRef);
    return otherRef;
  };


  return <>
    <DDBunit2 config={config} func={Func} />
    <Add onRef={addRef} />
    <ModalForm onRef={modalFormRef} />
  </>
};

export default index;