import React, { useRef } from 'react';
import fpConfig from './fpConfig';
import Func from './fpFunc';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import MtsPd from './mtsPd';

const MdtBgdIndx: React.FC<unknown> = () => {

  const mtsPdRef: any = useRef();

  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(mtsPdRef);
    return otherRef;
  };
  const myConfig = {...fpConfig};
  myConfig.gridParams = {
    initSearchModal: [
      {property: "fpsbztDms", value: ['1'], op: "al"},
      {property: "notInFpcllxDm", value: ["2", "3", "4", "5"], op: "al"},
    ],
  }
  myConfig.page_id = 'MTS_SJPP_FPZXPD';

  return (
    <>
      <DDBunit2 config={myConfig} func={Func} />
      <MtsPd onRef={mtsPdRef} />
    </>
  );
};
export default MdtBgdIndx;
