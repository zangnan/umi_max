import React, { useRef } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import unitConfig from './dqrspmConfig';
import func from './dqrspmFunc';
import DrawerListSpmtz from '@/pages/hts/saasMdt/wbsjgl/common/modal_spmb';

const Index: React.FC<{ data: any, mainref: any }> = ({
  data,
  mainref,
}) => {

  const drawerRefSpmtz: any = useRef();

  func.getOtherRef = () => {
    const otherRef = [];
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
      <DrawerListSpmtz onRef={drawerRefSpmtz} />
    </div>
  </>;
};

export default Index;