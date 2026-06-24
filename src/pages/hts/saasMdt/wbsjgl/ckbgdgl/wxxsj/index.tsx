// 出口报关单管理-无信息数据
import React, { useRef }  from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import config from './wxxsjConfig';
import Func from './wxxsjFunc';
import ScmxSaasMdt from '@/pages/hts/commonModule/scmx/scmxSaasMdt';
import Hgbgd from "@/pages/hts/commonModule/ckhwbgd/Yl";
import DrawerListHl from '@/pages/hts/saasMdt/wbsjgl/common/modal_plbthl';
import CheckErrModel from '../../common/checkErrModel';
import ScxxcxDialog from './scxxcxDialog'
import { history, useAccess } from 'umi';
import qxUtil from '@/pages/hts/common/qxUtil';
import IcList from '@/pages/hts/pzgl/icCard/common/icCardTsList';

const Index: React.FC = () => {
  const access = useAccess();

  const scmxSaasRef: any = useRef();
  const hgbgdRef: any = useRef();
  const drawerRefHl: any = useRef();
  const errRefCkspDm: any = useRef();
  const scmxcxRef: any = useRef();
  const refICList: any = useRef(); // 环境检测

  const myConfig = {...config};
  myConfig.gridParams = {
    initSearchModal: [
      { property: 'cxlx', value: '5', op: 'zdy' },
    ]
  }
  if(history?.location?.pathname.indexOf('/26/2602') > -1 || history?.location?.pathname.indexOf('/27/2702') > -1){
    // 配置项：自定义工具栏
    myConfig.customer_toolbar = [
      { name: '更新信息状态', key: 'gxxxzt', func: 'updateInfoState' },
      { name: '重新发往税务总局', key: 'cxfwswzj', func: 'sendWxxbgdToSwzj' },
      {
        name: '批量修改', key: 'plxg', type: 'dropdown',
        list: [
          { name: '出口发票号', func: 'btnPlxgCkfph' },
          { name: '出口商品代码', func: 'btnPlxgCkspdm' },
          { name: '汇率', func: 'btnPlxgHl' },
          { name: '运费折算数量', func: 'btnPlxgYfzssl' }
        ],
      },
      { name: '生成信息查询', key: 'scxxcx', func: 'produceInfoQuery' },
      { name: '转不退税', func: 'btnZbts' },
    ];
  }else {
    // 配置项：自定义工具栏
    myConfig.customer_toolbar = [
      { name: '更新信息状态', key: 'gxxxzt', func: 'updateInfoState' },
      { name: '重新发往税务总局', key: 'cxfwswzj', func: 'sendWxxbgdToSwzj' },
      {
        name: '批量修改', key: 'plxg', type: 'dropdown',
        list: [
          { name: '出口发票号', func: 'btnPlxgCkfph' },
          { name: '出口商品代码', func: 'btnPlxgCkspdm' },
          { name: '汇率', func: 'btnPlxgHl' },
          { name: '运费折算数量', func: 'btnPlxgYfzssl' }
        ],
      },
      { name: '生成信息查询', key: 'scxxcx', func: 'produceInfoQuery' },
      { name: '生成明细报表', key: 'scmxbb', func: 'produceDetailsReport' },
      { name: '转不退税', func: 'btnZbts' },
    ];
  }


  let myYwKey: any = '';
  if(history?.location?.pathname.indexOf('/25/2502')) {
    myYwKey = 'MDT';
  } else if(history?.location?.pathname.indexOf('/26/2602')) {
    myYwKey = 'MTS';
  } else {
    myYwKey = 'DBTS';
  }
  // 单一窗口隐藏更新信息状态按钮
  const paramQx = {
    btncode: 'common_001',
    accessObj: access,
    ywKey: myYwKey,
  }
  if(qxUtil.getBtnQxz(paramQx)) {
    myConfig.customer_toolbar.shift();
  }

  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(hgbgdRef);
    otherRef.push(scmxSaasRef);
    otherRef.push(drawerRefHl);
    otherRef.push(errRefCkspDm);
    otherRef.push(scmxcxRef);
    otherRef.push(refICList);
    return otherRef;
  };

  return (
    <div>
      <DDBunit2 config={myConfig} func={Func}/>
      <Hgbgd onRef={hgbgdRef} />
      <ScmxSaasMdt onRef={scmxSaasRef} />
      <DrawerListHl onRef={drawerRefHl} />
      <CheckErrModel onRef={errRefCkspDm} />
      <ScxxcxDialog onRef={scmxcxRef}/>
      <IcList onRef={refICList} />
    </div>
  );
}

export default Index;
