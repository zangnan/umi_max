import React, { useEffect, useRef, useState } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import Func from './f';
import myUtil from '@/components/DDAssist/util';
import DDImportNodeEnv from '@/components/DDImportNodeEnv';

const Unit2: React.FC<unknown> = () => {
  const [myConfig, setMyConfig] = useState<any>({});

  useEffect(() => {
    let extendConfig: any = {
      // grid_scroll_x: '2700px',
    };
    let beforeSetConfig = (cc: any) => {
    }
    myUtil.module.initAutomaticPageDef({ module_key: 'nbgl_xmgl_xmgzrwxxb', setMyConfig, extendConfig, beforeSetConfig });
  }, []);


  // 添加私有页面或组件
  const modal1Ref: any = useRef();
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(modal1Ref);
    return otherRef;
  };

  // 导入项目人月统计
  const doSubmit = (param: any) => {
    Func.importXmgl(param, 1);
  }

  return <>
    <DDBunit2 config={myConfig} func={Func} />
    <DDImportNodeEnv onRef={modal1Ref} showRules={false} doSubmit={(param: any) => doSubmit(param)} />
  </>;
};

export default Unit2;