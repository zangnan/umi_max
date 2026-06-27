import React from 'react';
// import fb18config from './fbconfig';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
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