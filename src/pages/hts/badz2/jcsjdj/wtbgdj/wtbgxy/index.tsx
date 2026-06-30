import React, { useRef } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import unitConfig from './config';
import func from './func'
import { cloneDeep } from 'lodash';
import DrawerGlgx from '../../../common/glgx';
import Preview from '../../../common/preview';


const Index: React.FC<unknown> = () => {

  const drawerGlgxRef: any = useRef();
  const previewRef: any = useRef();

  let myConfig = cloneDeep(unitConfig);

  func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(drawerGlgxRef);
    otherRef.push(previewRef);

    return otherRef;
  };

  return <>
    <DDBunit2 config={myConfig} func={func} />
    <DrawerGlgx onRef={drawerGlgxRef} />
    <Preview onRef={previewRef} />
  </>;
};

export default Index;
