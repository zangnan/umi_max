/**
 * 备案单证   单证管理
 */
import React, { useRef } from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import dzglConfig from './dzglConfig';
import dzglFunc from './dzglFunc'
import DzglImport from '../badzcommon/dzglImport';
import DzglSmy from '../badzcommon/dzglSmy';
import DzglYl from '../badzcommon/dzglyL';
import myUtil from '@/components/DDAssist/util';

const BadzDzgl: React.FC<unknown> = () => {

  const dzlgImportRef: any = useRef();
  const dzlgSmyRef: any = useRef();


  const dzglYl: any = useRef();
  dzglFunc.getOtherRef = () => {
    const otherRef = [];
    // 上传单证 导入
    otherRef.push(dzlgImportRef);
    // 上传单证 扫描仪
    otherRef.push(dzlgSmyRef);
    //归档用
    otherRef.push(dzglYl);
    return otherRef;
  };
  const userInfo = myUtil.sessionStore.getItem('userInfo');
  const qyuuid = userInfo?.qxQys[0].qyuuid;
  dzglConfig.filter_items[0].treeTable=['TREE_BADZ_CS_ZXSB_BADZLX_ALL', qyuuid];
  return <>
    <DDBunit2 config={dzglConfig} func={dzglFunc} />
    <DzglImport onRef={dzlgImportRef} gnmk='badzdzgl' />
    <DzglSmy onRef={dzlgSmyRef} gnmk='badzdzgl' />
    <DzglYl onRef={dzglYl} gnmk='zlgd' />
  </>
};
export default BadzDzgl;