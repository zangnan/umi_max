/**
 * title: 境外收货人管理
 */
import React, { useRef } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import config from './config';
import Func from './f'
import ModalForm from './modal_form';
import DrawerBdfhr from './drawer_bdfhr';
import DrawerBdfhrxz from './drawer_fhrxz';

import DrawerBdjwshrxz from './drawer_jwshrxz';
import { cloneDeep } from 'lodash';


const index: React.FC<unknown> = () => {
  const myConfig = cloneDeep(config);

  const modalRef: any = useRef();
  const drawerBdfhrRef: any = useRef();
  const drawerBdfhrxzRef: any = useRef();
  const drawerBdjwshrxzRef: any = useRef();


  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(modalRef);
    otherRef.push(drawerBdfhrRef);
    otherRef.push(drawerBdfhrxzRef);
    otherRef.push(drawerBdjwshrxzRef);
    return otherRef;
  };

  return <>
    <DDBunit2 config={myConfig} func={Func} />
    <ModalForm onRef={modalRef} />
    <DrawerBdfhr onRef={drawerBdfhrRef} />
    <DrawerBdfhrxz onRef={drawerBdfhrxzRef} />
    <DrawerBdjwshrxz onRef={drawerBdjwshrxzRef} />
  </>
};

export default index;
