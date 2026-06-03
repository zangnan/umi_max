/**
 * title: 跨境应税行为免退税申报明细
 * author: wx
 */
import React from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from './auto_config';
import Func from './f'
const index: React.FC<unknown> = () => {

  const myConfig = { ...config };
  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>
};
export default index;