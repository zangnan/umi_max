import React, { useRef, } from 'react';
import unitConfig from './config';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import Func from './f';
import Add from './add';
import Pbcd from './pbcd';
import Glqd from './glqd';
import Gldq from './gldq';
import Glfw from './glfw';

import Zy from './zy';
import { useAccess } from 'umi';
import qxUtil from '@/pages/hts/common/qxUtil';

const Jdcx: React.FC<unknown> = () => {
  const access = useAccess(); // 权限
  const qxzConfig = { ...unitConfig };
  const qxzFunc = { ...Func }


  Func.access = access;

  const paramPtgly = {
    accessObj: access,
  }

  let yhlx = qxUtil.getYhlx(paramPtgly);
  qxzConfig.gridParams = {
    initSearchModal: [
      { type: 1, property: "qxlx", value: '1', op: "zdy" },
    ]
  };


  // 平台管理员
  if (yhlx == '09') {
    qxzConfig.customer_toolbar = [
      { name: '导出脚本', key: 'addqxz34', func: 'exportJb'},
      { name: '关联服务',func: 'glfw' },
      { name: '关联渠道', key: 'glqdqxzgl', func: 'glqd' },
      { name: '关联地区', key: 'gldqqxzgl', func: 'gldq'},
      { name: '关联菜单', key: 'pbcdqxzgl', func: 'pbcd'},
      { name: '关联资源', key: 'pbzyqxzgl', func: 'pbzy'},
      { name: '新建', key: 'addqxzgl', func: 'add'},
      { name: '修改', key: 'editqxzxg', func: 'edit'},
      { name: '删除', key: 'delqxzxg', func: 'del'},
    ];
  }
  if (yhlx == '13') {
    qxzConfig.customer_toolbar = [
    ];
  }
  if (yhlx == '14') {
    qxzConfig.customer_toolbar = [
      { name: '关联菜单', key: 'pbcdqxzgl', func: 'pbcd'},
      { name: '关联资源', key: 'pbzyqxzgl', func: 'pbzy'},
    ];
  }
  

  const addRef: any = useRef();
  const pbcdRef: any = useRef();
  const glqdRef: any = useRef();
  const gldqRef: any = useRef();
  const zyRef: any = useRef();
  const fwRef: any = useRef();


  qxzFunc.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(addRef);
    otherRef.push(pbcdRef);
    otherRef.push(glqdRef);
    otherRef.push(gldqRef);
    otherRef.push(zyRef);
    otherRef.push(fwRef);
    return otherRef;
  };


  return (
    <div>
      <DDBunit2 config={qxzConfig} func={qxzFunc} />
      <Add onRef={addRef} />
      <Pbcd onRef={pbcdRef} />
      <Glqd onRef={glqdRef} />
      <Gldq onRef={gldqRef} />
      <Zy onRef={zyRef} />
      <Glfw onRef={fwRef} />
    </div>
  )

};

export default Jdcx;