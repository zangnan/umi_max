import React, {useRef,} from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import unitConfig from './config';
import Func from './f';
import Add from './add';
import {useAccess} from 'umi';
import qxUtil from '@/pages/common/qxUtil';
import {cloneDeep} from 'lodash';


const Index: React.FC = () => {


  const qdConfig = cloneDeep(unitConfig);
  const qdFunc = {...Func};


  const addRef: any = useRef();
  const access = useAccess(); // 权限

  Func.access = access;

  const paramPtgly = {
    accessObj: access,
  }

  qdFunc.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(addRef);
    return otherRef;
  };

  let yhlx = qxUtil.getYhlx(paramPtgly);

  return (
    <>
      <DDBunit2 config={qdConfig} func={qdFunc}/>
      <Add onRef={addRef} yhlx={yhlx}/>
    </>
  );
}

export default Index;
