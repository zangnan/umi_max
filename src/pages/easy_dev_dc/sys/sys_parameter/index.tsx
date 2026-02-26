import React, { useRef } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from './config';
import Func from './f';

const index: React.FC<unknown> = () => {

  return <>
    <DDBunit2 config={config} func={Func} />
  </>
};

export default index;