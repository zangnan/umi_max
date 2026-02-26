import React, { useEffect, useState } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import Func from './f';
import myUtil from '@/components/DDAssist/util';

const Unit2: React.FC<unknown> = () => {
  const [myConfig, setMyConfig] = useState<any>({});

  useEffect(() => {
    let extendConfig: any = { grid_scroll_x: '2700px' };
    myUtil.module.initAutomaticPageDef({ module_key: 'nbgl_ryxx_jbxx', setMyConfig, extendConfig });
  }, []);

  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>;
};

export default Unit2;