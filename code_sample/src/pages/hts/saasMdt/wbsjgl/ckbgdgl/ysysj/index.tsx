// 出口报关单管理-不退税数据
import React, {useRef}  from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from './ysysjConfig';
import Func from './ysysjFunc';
import Hgbgd from "@/pages/hts/commonModule/ckhwbgd/Yl";
import ScmxSaasMdt from '@/pages/hts/commonModule/scmx/scmxSaasMdt';
import { history } from 'umi';

const Index: React.FC = () => {

  const myConfig = {...config};

  myConfig.gridParams = {
    initSearchModal: [
      { property: 'cxlx', value: '7', op: 'zdy' },
    ]
  };

  if(history?.location?.pathname.indexOf('/26/2602') > -1 || history?.location?.pathname.indexOf('/27/2702') > -1){
    myConfig.costomer_toobar = [];
  } else {
    myConfig.costomer_toobar = [
      { name: '生成明细报表', key: 'scmxbb', func: 'produceDetailsReport' },
    ];
  }

  if(history?.location?.pathname.indexOf('/25/2502') > -1){
    myConfig.gridParams = {
      initSearchModal: [
        { property: 'cxlx', value: '7', op: 'zdy' },
        { property: 'bgdcllxDm', value: '1', op: 'zdy' },
      ]
    };

  }
  if(history?.location?.pathname.indexOf('/26/2602') > -1){
    myConfig.gridParams = {
      initSearchModal: [
        { property: 'cxlx', value: '7', op: 'zdy' },
        { property: 'bgdcllxDm', value: '1', op: 'zdy' },
      ]
    };

  }
  if(history?.location?.pathname.indexOf('/27/2702') > -1){
    myConfig.gridParams = {
      initSearchModal: [
        { property: 'cxlx', value: '7', op: 'zdy' },
        { property: 'bgdcllxDm', value: '6', op: 'zdy' },
      ]
    };

  }
  const scmxSaasRef: any = useRef();
  const hgbgdRef: any = useRef();
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(hgbgdRef);
    otherRef.push(scmxSaasRef);
    return otherRef;
  };

  return (
    <div>
      <DDBunit2 config={myConfig} func={Func} />
      <ScmxSaasMdt onRef={scmxSaasRef} />
      <Hgbgd onRef={hgbgdRef} />
    </div>
  );
}

export default Index;
