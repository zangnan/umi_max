import React from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import FbFunc from './ffb';

export interface ZnpdmxfbProps {
  param?: any;
}

const Znpdmxfb: React.FC<ZnpdmxfbProps> = ({
  param,
}) => {
  return (
    <>
      <DDBunit2 config={param} func={FbFunc}/>
    </>
  );
};

export default Znpdmxfb;