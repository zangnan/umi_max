import React, { useRef } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import unitConfig from './dbthlConfig';
import func from './dbthlFunc';
import Hgbgd from '@/pages/hts/commonModule/ckhwbgd/Yl';
import DrawerListHl from '@/pages/hts/saasMdt/wbsjgl/common/modal_plbthl';

const Index: React.FC<{ data: any, mainref: any }> = ({
  data,
  mainref,
}) => {

  const hgbgdRef: any = useRef();
  const drawerRefHl: any = useRef();

  func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(hgbgdRef);
    otherRef.push(drawerRefHl);
    otherRef.push(mainref);
    return otherRef;
  };

  const myConfig = {...unitConfig};
  myConfig.gridParams = {
    initSearchModal: [
      { property: 'cxlx', value: '3', op: 'zdy' },
    ],
  }

  return <>
    <div key={data}>
      <DDBunit2 config={myConfig} func={func} />
      <Hgbgd onRef={hgbgdRef} />
      <DrawerListHl onRef={drawerRefHl} />
    </div>
  </>;
};

export default Index;