// 出口报关单管理-不退税数据
import React, { useRef } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import config from './btssjConfig';
import Func from './btssjFunc';
import Hgbgd from "@/pages/hts/commonModule/ckhwbgd/Yl";
import ModalBt from './modal_ssjx';
import DrawerListHl from '@/pages/hts/saasMdt/wbsjgl/common/modal_plbthl';
import ModalCg from './modal_sscg';

import { cloneDeep } from 'lodash';

const Index: React.FC = () => {


  let myConfig = cloneDeep(config);


  myConfig.filter_items[5].defaultValue = 'N';

  myConfig.gridParams = {
    initSearchModal: [
      { property: 'cxlx', value: '8', op: 'zdy' },
    ]
  }



  const hgbgdRef: any = useRef();
  const drawerRefHl: any = useRef();
  const btRef: any = useRef();
  const cgRef: any = useRef();

  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(hgbgdRef);
    otherRef.push(drawerRefHl);
    otherRef.push(btRef);
    otherRef.push(cgRef);
    return otherRef;
  };

  return (
    <div>
      <DDBunit2 config={myConfig} func={Func} />
      <Hgbgd onRef={hgbgdRef} />
      <DrawerListHl onRef={drawerRefHl} />
      <ModalBt onRef={btRef} />
      <ModalCg onRef={cgRef} />
      {/* <ModalCgGdw onRef={cgRef2} /> */}
    </div>
  );
}

export default Index;
