/**
 * title: 代办退税备案
 * author: wxl
 */
import React from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from './config';
import Func from './f'
const index: React.FC<unknown> = () => {

  const myConfig = { ...config };
  myConfig.gridParams = {
    initSearchModal: [
      { property: 'dbtsbalcztDm', values: ['1','2'], op: 'ain' },
    ],
  }
  return <>
    <DDBunit2 config={myConfig} func={Func} />
  </>
};
export default index;