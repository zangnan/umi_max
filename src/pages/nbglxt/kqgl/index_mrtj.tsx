import React, { useEffect, useRef, useState } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import Func from './f';
import myUtil from '@/components/DDAssist/util';
import ModalSelMonth from './modal_sel_month';

const Unit2: React.FC<unknown> = () => {
  const [myConfig, setMyConfig] = useState<any>({});

  useEffect(() => {
    let extendConfig: any = { grid_scroll_x: '2700px' };
    let beforeSetConfig = (cc: any) => {
      cc.toolbar_default.delete_by_condition = true;
    }
    myUtil.module.initAutomaticPageDef({ module_key: 'nbgl_kqgl_mrtj', setMyConfig, extendConfig, beforeSetConfig });
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
    <ModalSelMonth onRef={modal1Ref} />
  </>;
};

export default Unit2;