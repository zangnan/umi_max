/**
 * 报关单收汇情况查询
 */
import React, { useRef } from 'react';
import DrawerShpzfs from './drawer_shpzfs';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import bgdshqkconfig from './bgdshqkconfig';
import func from './bgdshqkFunc'


const Index: React.FC<{ data: any }> = ({
  data,
}) => {
  const drawerShpzfsRef: any = useRef();
  func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(drawerShpzfsRef);
    return otherRef;
  };

return <>
    <div key={data}>
      <DDBunit2 config={bgdshqkconfig} func={func} />
    </div>
  <DrawerShpzfs onRef={drawerShpzfsRef} />
  </>;
};

export default Index;

