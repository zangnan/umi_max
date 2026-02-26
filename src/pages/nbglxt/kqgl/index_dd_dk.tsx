import React, { useEffect, useRef, useState } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import Func from './f';
import DDImportNodeEnv from '@/components/DDImportNodeEnv';
import myUtil from '@/components/DDAssist/util';

const Unit2: React.FC<unknown> = () => {
  const [myConfig, setMyConfig] = useState<any>({});

  useEffect(() => {
    let extendConfig: any = { grid_scroll_x: '2700px' };
    let beforeSetConfig = (cc: any) => {
      cc.toolbar_default.delete_by_condition = true;
    }
    myUtil.module.initAutomaticPageDef({ module_key: 'nbgl_kqgl_dd_dk', setMyConfig, extendConfig, beforeSetConfig });
  }, []);

  // 添加私有页面或组件
  const ModalRef: any = useRef();
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(ModalRef);
    return otherRef;
  };

  // 导入钉钉考勤
  const doSubmit = (param: any) => {
    Func.importDDkq(param);
  }

  return <>
    <DDBunit2 config={myConfig} func={Func} />
    <DDImportNodeEnv onRef={ModalRef} showRules={false} doSubmit={(param: any) => doSubmit(param)} />
  </>;
};

export default Unit2;