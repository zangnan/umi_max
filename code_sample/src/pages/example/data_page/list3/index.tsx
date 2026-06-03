/**
 * title: 数据封装页面：列表
 * creator: zn
 */
import React from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import unitConfig from './config';
import Func from './f';

const Bgd: React.FC<unknown> = () => {

  return <>
    <DDBunit2 config={unitConfig} func={Func} />
  </>;
};

export default Bgd;