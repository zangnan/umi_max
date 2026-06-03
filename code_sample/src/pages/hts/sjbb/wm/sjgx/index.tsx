
import React, { useRef } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from './config';
import Func from './f'
import DDSjgxUpdateData from '@/pages/hts/commonModule/sjgx/DDSjgxUpdateData';

const index: React.FC<unknown> = () => {
  // 添加私有页面或组件
  const refUpdateData: any = useRef();
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(refUpdateData);
    return otherRef;
  };

  return <>
    <DDBunit2 config={config} func={Func} />
    <DDSjgxUpdateData onRef={refUpdateData} />
  </>
};
export default index;