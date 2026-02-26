import React, { useEffect, useRef, useState } from 'react';
import DDBunitTree from '@/components/DDBunit/DDBunitTree';
import Func from './f';
import myUtil from '@/components/DDAssist/util';

const index: React.FC<unknown> = () => {
  const [myConfig, setMyConfig] = useState<any>({});

  useEffect(() => {
    let beforeSetConfig = (cc: any) => {
      let tmpCol = cc?.form?.form_items?.find((tmp: any) => { return tmp.name === 'menuOrder' }) || {};
      tmpCol.order = 'asc';
    }
    myUtil.module.initAutomaticPageDef({ module_key: 'm_sys_menu', setMyConfig, module_type: 'tree', beforeSetConfig});
  }, []);

  return <>
    <DDBunitTree config={myConfig} func={Func} />
  </>;
};

export default index;