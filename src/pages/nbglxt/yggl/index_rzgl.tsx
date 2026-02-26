import React, { useEffect, useRef, useState } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import ModalLdht from './modal_ldht';
import Func from './f';
import DDImportNodeEnv from '@/components/DDImportNodeEnv';
import myUtil from '@/components/DDAssist/util';

const Unit2: React.FC<unknown> = () => {
  const [myConfig, setMyConfig] = useState<any>({});

  useEffect(() => {
    myUtil.module.initAutomaticPageDef({ module_key: 'nbgl_yggl_rzgl', setMyConfig });
  }, []);

  // 添加私有页面或组件
  const modal1Ref: any = useRef();
  const ModalRef: any = useRef();
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(modal1Ref);
    otherRef.push(ModalRef);
    return otherRef;
  };

  // 导入简历
  const importJbxx = (param: any) => {
    Func.importResume(param, '9');
  }

  return <>
    <DDBunit2 config={myConfig} func={Func} />
    <ModalLdht onRef={modal1Ref} />
    <DDImportNodeEnv onRef={ModalRef} showRules={false} doSubmit={(param: any) => importJbxx(param)} />
  </>;
};

export default Unit2;