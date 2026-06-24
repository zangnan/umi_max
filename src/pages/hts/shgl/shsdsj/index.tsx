import React, { useRef } from 'react';
import config from './config';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import Func from './f';
import { cloneDeep } from 'lodash';
import ModelPp from './pp/index';
import ErrorMsgGrid from "./errormsg_grid";
import Preview from "./yl";

import DrawerHtfsXz from "./drawer_htfsxz";
import DrawerGdfsxz from "./drawer_gdfsxz";

import ModalPlbthl from "./modal_plbthl";


const Index: React.FC = () => {

  const refPp: any = useRef();
  const errorMsgRef: any = useRef();
  const previewRef: any = useRef();
  const drawerHtfsXzRef: any = useRef();
  const drawerGdfsXzRef: any = useRef();
  const modalRefPlbthl:any = useRef();

  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(refPp);
    // 导入模板数据异常页面
    otherRef.push(errorMsgRef);
    otherRef.push(previewRef);
    otherRef.push(drawerHtfsXzRef);
    otherRef.push(drawerGdfsXzRef);
    otherRef.push(modalRefPlbthl);
    return otherRef;
  };

  let myConfig = cloneDeep(config);

  return (
    <>
      <div>
        <DDBunit2 config={myConfig} func={Func} />
        <ModelPp onRef={refPp}/>
        <ErrorMsgGrid onRef={errorMsgRef} />
        <Preview onRef={previewRef} />
        <DrawerHtfsXz onRef={drawerHtfsXzRef} />
        <DrawerGdfsxz onRef={drawerGdfsXzRef} />
        <ModalPlbthl onRef={modalRefPlbthl} />
      </div>
    </>
  )
};

export default Index;
