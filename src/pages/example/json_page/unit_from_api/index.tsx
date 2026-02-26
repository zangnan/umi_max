import React, { useEffect, useRef, useState } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import Func from './f';
import Modal1 from './modal1';
import myUtil from '@/components/DDAssist/util';

const Unit2: React.FC<unknown> = () => {
  const [myConfig, setMyConfig] = useState<any>({});

  useEffect(() => {
    myUtil.module.initAutomaticPageDef({ module_key: 'test_app_mts_tsjh', setMyConfig });
  }, []);

  // 添加私有页面或组件
  const modal1Ref: any = useRef();
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(modal1Ref);
    return otherRef;
  };

  return <>
    <DDBunit2 config={myConfig} func={Func} />
    <Modal1 onRef={modal1Ref} />
  </>;
};

export default Unit2;