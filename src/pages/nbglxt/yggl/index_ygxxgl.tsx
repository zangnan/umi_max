import React, { useEffect, useRef, useState } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import Func from './f';
import DDImportNodeEnv from '@/components/DDImportNodeEnv';
import myUtil from '@/components/DDAssist/util';

const Unit2: React.FC<unknown> = () => {
  const [myConfig, setMyConfig] = useState<any>({});

  useEffect(() => {
    myUtil.module.initAutomaticPageDef({ module_key: 'nbgl_yggl', setMyConfig });
  }, []);

  // 添加私有页面或组件
  const ModalRef: any = useRef();
  const ModalRef2: any = useRef();
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(ModalRef);
    otherRef.push(ModalRef2);
    return otherRef;
  };

  // 导入历史数据
  const importJbxx = (param: any) => {
    Func.doImportHisData(param);
  }

  // 批量初始化简历信息
  const importResmueBatch = (param: any) => {
    Func.doImportResumeBatch(param);
  }

  return <>
    <DDBunit2 config={myConfig} func={Func} />
    <DDImportNodeEnv onRef={ModalRef} showRules={false} doSubmit={(param: any) => importJbxx(param)} />
    <DDImportNodeEnv onRef={ModalRef2} showRules={false} doSubmit={(param: any) => importResmueBatch(param)} multiple={true}/>
  </>;
};

export default Unit2;