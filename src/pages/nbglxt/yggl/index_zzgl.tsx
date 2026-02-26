import React, { useEffect, useRef, useState } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import myUtil from '@/components/DDAssist/util';
import CONSTANTS from '@/components/DDAssist/constants';
import ModalZz from './modal_zz';
import Func from './f';

const Unit2: React.FC<unknown> = () => {
  const [myConfig, setMyConfig] = useState<any>({});

  useEffect(() => {
    let extendConfig: any = {
      gridParams: {
        initSearchModal: [
          { property: 'rzztDm', value: '3', op: CONSTANTS.FILTER_CONDITION.equal.condetionCode, type: '1', },  // 已入职， rzztDm === 3
          { property: 'zzztDm', value: '3', op: CONSTANTS.FILTER_CONDITION.notEqual.condetionCode, type: '1', }, // 未转正  zzztDm !== 3
          { property: 'lzztDm', value: '3', op: CONSTANTS.FILTER_CONDITION.notEqual.condetionCode, type: '1', }, // 非离职  lzztDm !== 3
        ]
      }
    };
    myUtil.module.initAutomaticPageDef({ module_key: 'nbgl_yggl_zzgl', setMyConfig, extendConfig });
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
    <ModalZz onRef={modal1Ref} />
  </>;
};

export default Unit2;