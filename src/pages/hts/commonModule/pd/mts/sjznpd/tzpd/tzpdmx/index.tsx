import React, { useRef } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import config from './config';
import Func from './f';
import ModalMbxz from './modal_mbxz';
import DrErrorModel from './errormsg_grid';
import ModalZdpd from './modal_zdpd';



const Tzpd: React.FC<unknown> = () => {

  const myConfig = {...config};

  // myConfig.api_form_delete = `/yw/bszx/mts/sjpp/tzpd/deleteTzpdMx`; // api 表单删除



  const mbxzRef: any = useRef();
  const errorMsgRef: any = useRef();
  const zdpdRef: any = useRef();

  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(mbxzRef);
    otherRef.push(errorMsgRef);
    otherRef.push(zdpdRef);
    return otherRef;
  };


  return (
    <>
    <DDBunit2 config={myConfig} func={Func} />
    <ModalMbxz onRef={mbxzRef} />
    <DrErrorModel onRef={errorMsgRef} />
    <ModalZdpd onRef={zdpdRef} />
  </>
  );
};
export default Tzpd;
