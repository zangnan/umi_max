import React, { useEffect, useRef, useState } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import myUtil from '@/components/DDAssist/util';
import CONSTANTS from '@/components/DDAssist/constants';
import ModalLz from './modal_lz';
import Func from './f';

const Unit2: React.FC<unknown> = () => {
  const [myConfig, setMyConfig] = useState<any>({});

  useEffect(() => {
    let extendConfig: any = {
      gridParams: {
        initSearchModal: [
          { property: 'lzztDm', value: '1,2,3,4', op: CONSTANTS.FILTER_CONDITION.in.condetionCode, type: '1', },
        ]
      }
    };
    myUtil.module.initAutomaticPageDef({ module_key: 'nbgl_yggl_lzgl', setMyConfig, extendConfig });
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
    <ModalLz onRef={modal1Ref} />
  </>;
};

export default Unit2;