import React, { useRef } from 'react';
import bgdConfig from './bgdConfig';
import Func from './bgdFunc';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import MtsPd from './mtsPd';
import { history } from 'umi';
import Zdpd from './zdpd/index';
import Fpjejyjg from './fpjejyjg';


const MdtBgdIndx: React.FC<unknown> = () => {

  const mtsPdRef: any = useRef();
  const zdPdRef: any = useRef();
  const fpjejyjgRef: any = useRef();

  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(mtsPdRef);
    otherRef.push(zdPdRef);
    otherRef.push(fpjejyjgRef);
    return otherRef;
  };
  const myConfig = {...bgdConfig};
  if(history?.location?.pathname.indexOf('/27/2704/270401') > -1) { // 外贸-代办退税-按报关单配单
    myConfig.gridParams = {
      initSearchModal: [
        {property: "sybz", value: "N", op: "al"},
        {property: "cytgbz", value: "Y", op: "al"},
        {property: "bgdcllxDms", value: ["4","5"], op: "al"},
        {property: "cdType", value: "BGDZXPD", op: "zdy"}
      ],
    }
    myConfig.page_id = 'DBTS_SJPP_BGDZXPD';
  } else if(history?.location?.pathname.indexOf('/26/2604/260401') > -1){ // 外贸-免退税-按报关单配单
    myConfig.gridParams = {
      initSearchModal: [
        {property: "sybz", value: "N", op: "al"},
        {property: "cytgbz", value: "Y", op: "al"},
        {property: "bgdcllxDms", value: ["4","5"], op: "al"},
        {property: "cdType", value: "BGDZXPD", op: "zdy"}
      ],
    }
    myConfig.page_id = 'MTS_SJPP_BGDZXPD';
  }


  return (
    <>
      <DDBunit2 config={myConfig} func={Func} />
      <MtsPd onRef={mtsPdRef} />
      <Zdpd onRef={zdPdRef} />
      <Fpjejyjg onRef={fpjejyjgRef} />
    </>
  );
};
export default MdtBgdIndx;
