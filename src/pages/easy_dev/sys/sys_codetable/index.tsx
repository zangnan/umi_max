import React, { useEffect, useState } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import Func from './f';
import myUtil from '@/components/DDAssist/util';

const index: React.FC<unknown> = () => {
  const [myConfig, setMyConfig] = useState<any>({});

  useEffect(() => {
    myUtil.module.initAutomaticPageDef({ module_key: 'm_sys_code', setMyConfig });
  }, []);

  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>;
};

export default index;