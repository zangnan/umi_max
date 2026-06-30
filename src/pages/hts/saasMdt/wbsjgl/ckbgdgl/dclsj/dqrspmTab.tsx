import React, { useRef } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import unitConfig from './dqrspmConfig';
import func from './dqrspmFunc';
import Hgbgd from '@/pages/hts/commonModule/ckhwbgd/Yl';
import DrawerListSpmtz from '@/pages/hts/saasMdt/wbsjgl/common/modal_spmb';

const Index: React.FC<{ data: any, mainref: any }> = ({
  data,
  mainref,
}) => {

  const hgbgdRef: any = useRef();
  const drawerRefSpmtz: any = useRef();

  func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(hgbgdRef);
    otherRef.push(drawerRefSpmtz);
    otherRef.push(mainref);
    return otherRef;
  };

  const myConfig = {...unitConfig};
  myConfig.gridParams = {
    initSearchModal: [
      { property: 'cxlx', value: '2', op: 'zdy' },
    ],
  }

  return <>
    <div key={data}>
      <DDBunit2 config={myConfig} func={func} />
      <Hgbgd onRef={hgbgdRef} />
      <DrawerListSpmtz onRef={drawerRefSpmtz} />
    </div>
  </>;
};

export default Index;