import React from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
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