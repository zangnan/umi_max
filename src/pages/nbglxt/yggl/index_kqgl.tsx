import React, { useEffect, useRef, useState } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import Func from '../yggl/f';
import DDImportNodeEnv from '@/components/DDImportNodeEnv';
import myUtil from '@/components/DDAssist/util';

const Unit2: React.FC<unknown> = () => {
  const [myConfig, setMyConfig] = useState<any>({});

  useEffect(() => {
    myUtil.module.initAutomaticPageDef({ module_key: 'nbgl_ryxx_jbxx', setMyConfig });
  }, []);

  // 添加私有页面或组件
  const ModalRef: any = useRef();
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(ModalRef);
    return otherRef;
  };

  // 导入简历
  const importJbxx = (param: any) => {
    Func.importResume(param, '01');
  }

  return <>
    <DDBunit2 config={myConfig} func={Func} />
    <DDImportNodeEnv onRef={ModalRef} showRules={false} doSubmit={(param: any) => importJbxx(param)} />
  </>;
};

export default Unit2;