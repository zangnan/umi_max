// 进项发票管理-已使用数据
import React, {useRef}  from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from '../ksysj/ksyConfig';
import Func from '../ksysj/ksyFunc';
import Fpmx from '../ksysj/fpmx';

const Index: React.FC = () => {

  const myConfig = {...config};
  myConfig.costomer_toobar = [];
  myConfig.gridParams = {
    initSearchModal: [
      { property: 'cxlx', value: '2', op: 'zdy' },
      { property: 'cdType', value: 'DBTS', op: 'zdy' },
    ]
  }
  myConfig.export_key = 'DC_SAAS_MTS_TSSB_JXFPGL_YSYSJCX';

  const mtsPdRef: any = useRef();
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(mtsPdRef);
    return otherRef;
  };

  return (
    <div>
      <DDBunit2 config={myConfig} func={Func} />
      <Fpmx onRef={mtsPdRef} />
    </div>
  );
}

export default Index;
