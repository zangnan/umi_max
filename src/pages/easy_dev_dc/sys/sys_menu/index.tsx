import React, { useEffect, useState } from 'react';
import DDBunitTree from '@/components/DDBunit/DDBunitTree';
import Func from './f';
import myUtil from '@/components/DDAssist/util';

const Index: React.FC<unknown> = () => {
  const [myConfig, setMyConfig] = useState<any>({});

  useEffect(() => {
    myUtil.module.initAutomaticPageDef({ module_key: 'm_sys_menu', setMyConfig, module_type: 'tree' });
  }, []);

  return <>
    <DDBunitTree config={myConfig} func={Func} />
  </>;
};

export default Index;