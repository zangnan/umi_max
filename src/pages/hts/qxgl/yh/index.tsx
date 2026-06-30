/**
 * title: 用户管理
 * author: wx
 */
import React, { useRef } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import config from './config';
import Func from './f'
import ModalForm from './modal_form';
import ModalBdjs from './modal_bdjs';
import DrawerBdqy from './drawer_bdqy';
import { useAccess } from 'umi';
import qxUtil from '@/pages/hts/common/qxUtil';
import { cloneDeep } from 'lodash';
import DrawerQyyg from './drawer_qyyg';
import DrawerXz from './drawer_xz';
import DrawerSc from './drawer_sc';
import DrawerYhhy from './drawer_yhhy';



const index: React.FC<unknown> = () => {
  const access = useAccess(); // 权限

  const modalFormRef: any = useRef();
  const modalBdjsRef: any = useRef();
  const DrawerBdqyRef: any = useRef();
  const drawerQyygRef: any = useRef();
  const drawerXzRef: any = useRef();
  const drawerScRef: any = useRef();
  const drawerYhhyRef: any = useRef();


  // 改变默认配置项
  const myConfig = cloneDeep(config);

  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(modalFormRef);
    otherRef.push(modalBdjsRef);
    otherRef.push(DrawerBdqyRef);
    otherRef.push(drawerQyygRef);
    otherRef.push(drawerXzRef);
    otherRef.push(drawerScRef);
    otherRef.push(drawerYhhyRef);


    return otherRef;
  };

  // 配置项：自定义工具栏
  myConfig.customer_toolbar = [
    { name: '新建', func: 'addYh' },
    { name: '修改', func: 'editYh' },
    { name: '删除', func: 'del' },
  ];

  Func.access = access;

  const paramPtgly = {
    accessObj: access,
  }
  let yhlx = qxUtil.getYhlx(paramPtgly);
  // 平台管理员
  if (yhlx == '09') {
    myConfig.grid_columns.push({ title: '用户来源', dataIndex: 'qdDm', width: 140, ellipsis: true , codeTable: 'CODE_QX_QD:01' },);
    myConfig.filter_items.push({ name: 'qdDm', label: '用户来源', type: 'Select', codeTable: 'CODE_QX_QD:03'  });
    myConfig.customer_toolbar.push({ name: '用户还原', func: 'yhhy' },);
  }
  // 运营管理员
  else if (yhlx == '13' || yhlx == '15') {
    // “用户授权（正式版、试用版）”、授权日期起、授权日期止
    myConfig.grid_columns.push({ title: '用户版本', dataIndex: 'qxzDm', width: 140, codeTable: 'code_dm_zxsb_qxz:02' },);
    myConfig.grid_columns.push({ title: '用户来源', dataIndex: 'qdDm', width: 140, codeTable: 'CODE_QX_QD:01'},);
    myConfig.filter_items.push({ label: '用户来源', name: 'qdDm',  type: 'Select', codeTable: 'CODE_QX_QD:03' },);

  } else if (yhlx == '11') {
    // 企业管理员
    myConfig.customer_toolbar.push({ name: '关联企业', func: 'bdqy' },);
  }
  myConfig.grid_columns.push({ title: '操作', dataIndex: 'yxbz', width: 80, render: { func: 'renderYxbz' }, align: 'center', fixed: 'right' },);

  for(let i = 0; i< myConfig.filter_items.length;i++){
    if(myConfig.filter_items[i].name == 'qdDm'){
      myConfig.filter_items[i].defaultValue = 'SAAS_DDIT';
    }
  }

  return <>
    <DDBunit2 config={myConfig} func={Func} />
    <ModalForm onRef={modalFormRef} yhlx={yhlx} />
    <ModalBdjs onRef={modalBdjsRef} />
    <DrawerBdqy onRef={DrawerBdqyRef} />
    <DrawerQyyg onRef={drawerQyygRef} />
    <DrawerXz onRef={drawerXzRef} />
    <DrawerSc onRef={drawerScRef} />
    <DrawerYhhy onRef={drawerYhhyRef} />
  </>
};

export default index;
