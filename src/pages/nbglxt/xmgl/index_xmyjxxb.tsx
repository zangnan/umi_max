import React, { useEffect, useRef, useState } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import Func from './f';
import myUtil from '@/components/DDAssist/util';

const Unit2: React.FC<unknown> = () => {
  const [myConfig, setMyConfig] = useState<any>({});

  useEffect(() => {
    let extendConfig: any = {
      // grid_scroll_x: '2700px',
    };
    let beforeSetConfig = (cc: any) => {
    }
    myUtil.module.initAutomaticPageDef({ module_key: 'nbgl_xmgl_xmyjxxb', setMyConfig, extendConfig, beforeSetConfig });
  }, []);

  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>;
};

export default Unit2;