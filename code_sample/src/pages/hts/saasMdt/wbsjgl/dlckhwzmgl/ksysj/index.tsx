// 代理出口货物证明-可使用数据
import React, {useRef} from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from "./dlzmKsyConfig";
import Func from "./dlzmKsyFunc";
import ScmxSaasMdt from '@/pages/hts/commonModule/scmx/scmxSaasMdt';
import CheckErrModel from '../../common/checkErrModel';
import { history, useAccess } from 'umi';
import qxUtil from '@/pages/common/qxUtil';

const Index: React.FC = () => {
  const access = useAccess(); // 权限
  const myConfig = {...config}
  myConfig.gridParams = {
    initSearchModal: [
      { property: 'cxlx', value: '3', op: 'zdy' },
    ]
  };

  if(history?.location?.pathname.indexOf('/26/2602') > -1){
    myConfig.costomer_toobar = [
      {
        name: '批量修改',
        type: 'dropdown',
        list: [
          { name: '出口发票号', func: 'ckfphPlxg' },
          { name: '出口商品代码', func: 'ckspdmPlxg' },
        ],
      },
    ];
  } else {
    let toobar =[]
    // eedit by yangzq 金四RPA返回的代理证明字段少，无法支撑生成明细，暂时屏蔽
    if (!qxUtil.getZy({ zycode: 'S_000001_000001', accessObj: access, })){
      toobar.push({ name: '生成明细报表', func: 'produceDetailsReport' });
    }
    toobar.push({
      name: '批量修改',
      type: 'dropdown',
      list: [
        { name: '出口发票号', func: 'ckfphPlxg' },
        { name: '出口商品代码', func: 'ckspdmPlxg' },
      ],
    });
    myConfig.costomer_toobar = toobar;
  }

  const scmxSaasRef: any = useRef();
  const errRefCkspDm: any = useRef();
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(scmxSaasRef);
    otherRef.push(errRefCkspDm);
    return otherRef;
  };

  return (
    <div>
      <DDBunit2 config={myConfig} func={Func} />
      <ScmxSaasMdt onRef={scmxSaasRef} />
      <CheckErrModel onRef={errRefCkspDm} />
    </div>
  );
}

export default Index;
