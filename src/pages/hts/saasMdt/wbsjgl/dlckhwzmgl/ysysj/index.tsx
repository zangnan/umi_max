// 出口报关单管理-不退税数据
import React, {useRef}  from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import config from './ysysjConfig';
import Func from './ysysjFunc';
import ScmxSaasMdt from '@/pages/hts/commonModule/scmx/scmxSaasMdt';
import { history, useAccess } from 'umi';
import qxUtil from '@/pages/hts/common/qxUtil';

const Index: React.FC = () => {
  const access = useAccess(); // 权限
  const myConfig = {...config};
  myConfig.gridParams = {
    initSearchModal: [
      { property: 'cxlx', value: '4', op: 'zdy' },
    ]
  }
  
  if(history?.location?.pathname.indexOf('/26/2602') > -1){
    myConfig.costomer_toobar = [];
  } else {
    // eedit by yangzq 金四RPA返回的代理证明字段少，无法支撑生成明细，暂时屏蔽
    if (qxUtil.getZy({ zycode: 'S_000001_000001', accessObj: access, })) {
      myConfig.costomer_toobar = [];
    }else{
      myConfig.costomer_toobar = [
        { name: '生成明细报表', key: 'scmxbb', func: 'produceDetailsReport' },
      ];
    }
  }
  
  const scmxSaasRef: any = useRef();
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(scmxSaasRef);
    return otherRef;
  };

  return (
    <div>
      <DDBunit2 config={myConfig} func={Func} />
      <ScmxSaasMdt onRef={scmxSaasRef} />
    </div>
  );
}

export default Index;
