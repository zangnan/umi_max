import React, { useContext, useState, useEffect, useRef } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import unitConfig from './auto_config';
import Func from './f';

const Unit2: React.FC<unknown> = () => {
const myConfig = { ...unitConfig };

return <>
  <DDBunit2 config={myConfig} func={Func} />
</>;
};

export default Unit2;

