import React, { useEffect, useRef, useState } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import Func from './f';
import DrawerRole from './drawer_role';
import myUtil from '@/components/DDAssist/util';

const index: React.FC<unknown> = () => {
  const [myConfig, setMyConfig] = useState<any>({});

  useEffect(() => {
    myUtil.module.initAutomaticPageDef({ module_key: 'm_sys_user', setMyConfig });
  }, []);

  const drawerRef: any = useRef();
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(drawerRef);
    return otherRef;
  };

  return <>
    <DDBunit2 config={myConfig} func={Func} />
    <DrawerRole onRef={drawerRef}/>
  </>;
};

export default index;