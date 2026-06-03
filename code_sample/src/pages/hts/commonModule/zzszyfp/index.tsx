import React, { useRef } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from './config';
import jxfpcxconfig from './jxfpcxconfig';
import Func from './f';
import Xj from '@/pages/hts/commonModule/xj/xj';
import Fpmx from './fpmx';
import Ck2nxMx from './ck2nxMx';
import Xxcl from './xxcl';
import Jhmx from '../jhmx/jhmx';
import { history } from 'umi';
import Fphq from './fphq/fphq';
import Yl from './Yl';
import Dy from './Dy';
import jxfpFpxxconfig from './fpconfig';
import jxfpHwxxconfig from './hwconfig';

const Index: React.FC = () => {
  let myconfig: any = {};
  const mtsPdRef: any = useRef();
  const jhmxPdRef: any = useRef();
  const ck2nxmxRef: any = useRef();
  const xxclRef: any = useRef();
  const fphqRef: any = useRef();
  const YlRef: any = useRef();
  const XjRef: any = useRef();
  const DyRef: any = useRef();


  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(mtsPdRef);
    otherRef.push(jhmxPdRef);
    otherRef.push(ck2nxmxRef);
    otherRef.push(xxclRef);
    otherRef.push(fphqRef);
    otherRef.push(YlRef);
    otherRef.push(XjRef);
    otherRef.push(DyRef);

    return otherRef;
  };
  let jxfpFlag = false;
  // （应该用不上了）
  if (history?.location?.pathname.indexOf('/04/0403/040301') > -1) {
    myconfig = { ...config };
    // 外贸综合服务企业代办退税申报表
    myconfig.costomer_toobar = [
      { name: '发票获取', key: 'fphq', func: 'fphq' },
      { name: '更新信息', key: 'gxxx', func: 'gxxx' },
      { name: '生成出口转内销证明', key: 'd5de47d21f844d56b19bb9450b547e01', func: 'scznxmx' },
    ];
  } else if (history?.location?.pathname.indexOf('/02/0206/JXFP_020601') > -1) {
    // 进项发票数据查询(商品信息)
    jxfpFlag = true;
    myconfig = {};
    myconfig = { ...jxfpHwxxconfig };
    // myconfig.grid_columns = jxfpcxconfig.grid_columns;
    // myconfig.filter_items = jxfpcxconfig.filter_items;
    // myconfig.costomer_toobar = jxfpcxconfig.costomer_toobar;
  } else if (history?.location?.pathname.indexOf('/02/0206/JXFP_020602') > -1) {
    // 进项发票数据查询(发票信息
    jxfpFlag = true;
    myconfig = {};
    myconfig = { ...jxfpFpxxconfig };
  } else {
    // 货物劳务及服务退税申报
    myconfig.costomer_toobar = [
      { name: '发票获取', key: 'fphq', func: 'fphq' },
      { name: '更新信息', key: 'gxxx', func: 'gxxx' },
      { name: '生成进货明细', key: 'd204e2e641d39e1ba1334dcef3d149db', func: 'scjhmx' },
      { name: '生成出口转内销证明', key: 'd5de47d21f844d56b19bb9450b547e0f', func: 'scznxmx' },
    ];
  }


  Func.fpdyFuncDy = (param: any) => {
    const {otherRef,unitRef} = param;
    otherRef[7].current?.showModal(param,unitRef);
  }

  return (
    <div>
      <DDBunit2 config={myconfig} func={Func} />
      <Fpmx onRef={mtsPdRef} />
      <Jhmx onRef={jhmxPdRef} />
      <Ck2nxMx onRef={ck2nxmxRef} />
      <Xxcl onRef={xxclRef} />
      <Fphq onRef={fphqRef} />
      <Yl onRef={YlRef} />
      <Xj onRef={XjRef} />
      <Dy onRef={DyRef} />
    </div>
  );
}

export default Index;
