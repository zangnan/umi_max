import React from 'react';
// import fb18config from './fbconfig';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import FbFunc from './ffb';

export interface HwqdProps {
  param?: any;
}

const Hwqd: React.FC<HwqdProps> = ({
  param,
}) => {
  return (
    <>
      <DDBunit2 config={param} func={FbFunc}/>
    </>
  );
};

export default Hwqd;