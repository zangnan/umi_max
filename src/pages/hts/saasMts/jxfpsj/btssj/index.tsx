// 进项发票管理-已使用数据
import React, {useRef}  from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import config from '../ksysj/ksyConfig';
import Func from '../ksysj/ksyFunc';
import Fpmx from '../ksysj/fpmx';

const Index: React.FC = () => {

  const myConfig = {...config};
  myConfig.customer_toolbar = [{
    name: '批量修改',
    type: 'dropdown',
    key: 'jxfpplxg',
    list: [
      { name: '是否退税', func: 'btnSetSfts' },
      { name: '业务编号', func: 'btnSetYwbh' },
      { name: '标签', func: 'btnSetBq' },
    ],
  },];
  myConfig.gridParams = {
    initSearchModal: [
      { property: 'cxlx', value: '3', op: 'zdy' },
    ]
  }
  myConfig.export_key = 'DC_SAAS_MTS_TSSB_JXFPGL_BTSSJCX';

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
