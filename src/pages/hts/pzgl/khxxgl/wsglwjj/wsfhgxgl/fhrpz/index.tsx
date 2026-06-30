/**
 * title: 付汇人配置
 */
import React, { useRef } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import config from './config';
import Func from './f'
import ModalForm from './modal_form';
import DrawerBdjwshr from './drawer_bdjwshr';
import { cloneDeep } from 'lodash';
import DrawerXz from './drawer_xz';



const index: React.FC<unknown> = () => {

  const modalFormRef: any = useRef();
  const drawerBdjwshrRef: any = useRef();
  const drawerXzRef: any = useRef();


  // 改变默认配置项
  const myConfig = cloneDeep(config);

  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(modalFormRef);
    otherRef.push(drawerBdjwshrRef);
    otherRef.push(drawerXzRef);
    return otherRef;
  };


  return <>
    <DDBunit2 config={myConfig} func={Func} />
    <ModalForm onRef={modalFormRef} />
    <DrawerBdjwshr onRef={drawerBdjwshrRef} />
    <DrawerXz onRef={drawerXzRef} />
  </>
};

export default index;
