/**
 * title: 企业管理
 * author: wx
 */
import React, {useRef} from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import config from './config';
import Func from './f'
import ModalForm from './modal_form';
import DrawerBdyh from './drawer_bdyh';
import qxUtil from '@/pages/hts/common/qxUtil';
import {useAccess} from 'umi';
import {cloneDeep} from 'lodash';
import DrawerQyyg from './drawer_qyyg';
import DrawerApi from './drawer_api';
import Drawerqyhy from './drawer_qyhy';
import DrawerCxsc from './drawer_cxsc';
import {message} from 'antd';
import { intl as intl2 } from '@/components/DDAssist/util';
import ModalForm2 from './modal_sq';
import ModalSffwsq from './modal_sffwsq';
import Sfsqxq from './drawer_sfsqxq';


const index: React.FC<unknown> = () => {
  const myConfig = cloneDeep(config);

  const access = useAccess(); // 权限
  Func.access = access;
  const paramPtgly = {
    accessObj: access,
  }
  let yhlx = qxUtil.getYhlx(paramPtgly);

  if (yhlx === '11') {
    // 企业管理员
    // 配置项：自定义工具栏
    myConfig.customer_toolbar = [
      { name: '关联用户', func: 'bdyh' },
      { name: '新建', func: 'addQy' },
      { name: '修改', func: 'editQy' },
      { name: '删除', func: 'deleteQy' },
    ];
    if(qxUtil.getQyygbz(paramPtgly) == 'Y'){
      myConfig.customer_toolbar.push({ name: '企业移管', func: 'qyyg' });
    }
  } else if (yhlx === '13') {
    myConfig.grid_columns.push({ title: '授权状态', dataIndex: 'sqztDm', width: 140, codeTable: 'code_static_yh_sqdm:02',  filter: {
      type: 'Select',
      codeTable: 'code_static_yh_sqdm:02'
    },});
    myConfig.filter_items.push({ label: '授权日期', name: 'yxq', isLabel: true, type: 'DatePicker', range: true, format: 'YYYY-MM-DD' },);
    myConfig.grid_columns.push({ title: '授权日期起', dataIndex: 'yxqq', width: 140, ellipsis: true , render: { type: 'date', format: 'yyyy-MM-DD' }},);
    myConfig.grid_columns.push({ title: '授权日期止', dataIndex: 'yxqz', width: 140, ellipsis: true , render: { type: 'date', format: 'yyyy-MM-DD' }},);
    myConfig.grid_columns.push({ title: '授权剩余时间', dataIndex: 'sqyxqSyts', width: 140, align:'right', render: { func: 'renderSysj' }},);
    myConfig.grid_columns.push( { title: '操作', dataIndex: 'cz', width: 100, render: { func: 'renderCz' }, align: 'center', fixed: 'right' },);
    // 运营管理员
    myConfig.customer_toolbar = [
      { name: '企业移管', func: 'qyyg' },
      { name: '授权', func: 'yhsq' },
      { name: '三方授权', func: 'sffwsq' },
      { name: '同步三方服务时间', func: 'tbsffwsj' },
      { name: '导出', func: 'sffwxxdc' },
    ];
  } else if (yhlx === '15') {
    myConfig.grid_columns.push({ title: '授权状态', dataIndex: 'sqztDm', width: 140, codeTable: 'code_static_yh_sqdm:02',  filter: {
        type: 'Select',
        codeTable: 'code_static_yh_sqdm:02'
      },});
    myConfig.filter_items.push({ label: '授权日期', name: 'yxq', isLabel: true, type: 'DatePicker', range: true, format: 'YYYY-MM-DD' },);
    myConfig.grid_columns.push({ title: '授权日期起', dataIndex: 'yxqq', width: 140, ellipsis: true , render: { type: 'date', format: 'yyyy-MM-DD' }},);
    myConfig.grid_columns.push({ title: '授权日期止', dataIndex: 'yxqz', width: 140, ellipsis: true , render: { type: 'date', format: 'yyyy-MM-DD' }},);
    myConfig.grid_columns.push({ title: '授权剩余时间', dataIndex: 'sqyxqSyts', width: 140, align:'right', render: { func: 'renderSysj' }},);
    // 运营管理员
    myConfig.customer_toolbar = [
      { name: '授权', func: 'yhsq' },
    ];
  }
  else if (yhlx == '09') {
    // 平台管理员
    myConfig.customer_toolbar = [
      { name: '关联API服务', func: 'glApiFw' },
      { name: '企业还原', func: 'qyhy' },
    ];
  }
  if(yhlx != "13" && yhlx != 15){
    myConfig.grid_columns.push( { title: '操作', dataIndex: 'yxbz', width: 80, render: { func: 'renderYxbz' }, align: 'center', fixed: 'right' },);
  }

  // 打开弹窗-新建企业
  Func.addQy = (param: any) => {
    let yhuuid1 = qxUtil.getYhuuid1(paramPtgly);
    const flag = '新建';
    const { unitRef } = param;
    const otherRef = unitRef.current?.getOtherRefs();
    if (otherRef && otherRef[0]) {
      otherRef[0].current?.showModal(param, [], flag,yhuuid1,yhlx);
    } else if (param.otherRef && param.otherRef[0]) {
      param.otherRef[0].current?.showModal(param, [], flag,yhuuid1,yhlx);
    }
  };

  Func.qyyg = (param: any) => {
    const { otherRef, selectionRows, selectionRowKeys } = param;
    let yhuuid1 = qxUtil.getYhuuid1(paramPtgly);
    let yhlx = qxUtil.getYhlx(paramPtgly);
    // 选择数据条数判断
    if (!selectionRows || selectionRows.length === 0) {
      message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
      return;
    }
    if (selectionRows.length > 1) {
      message.info(intl2.formatMessage({ id: 'message_one_selected' }));
      return;
    }
    otherRef[2].current?.showModal(param, selectionRowKeys,yhuuid1,yhlx);
  }
  // 打开弹窗-修改企业
  Func.editQy = (param: any) => {
    let yhuuid1 = qxUtil.getYhuuid1(paramPtgly);
    const flag = '修改';
    const { selectionRows, unitRef } = param;
    // 选择数据条数判断
    if (!selectionRows || selectionRows.length === 0) {
      message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
      return;
    }
    if (selectionRows.length > 1) {
      message.info(intl2.formatMessage({ id: 'message_one_selected' }));
      return;
    }
    const otherRef = unitRef.current?.getOtherRefs();
    if (otherRef && otherRef[0]) {
      otherRef[0].current?.showModal(param, selectionRows[0], flag,yhuuid1,yhlx);
    } else if (param.otherRef && param.otherRef[0]) {
      param.otherRef[0].current?.showModal(param, selectionRows[0], flag,yhuuid1,yhlx);
    }
  };

  const modalRef: any = useRef();
  const DrawerBdyhRef: any = useRef();
  const drawerQyygRef: any = useRef();
  const drawerApiRef: any = useRef();
  const drawerCxscRef: any = useRef();
  const modalFormRef: any = useRef();
  const drawerQyhyRef: any = useRef();
  const SfsqxqRef: any = useRef();
  const SffwsqRef: any = useRef();

  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(modalRef);
    otherRef.push(DrawerBdyhRef);
    otherRef.push(drawerQyygRef);
    otherRef.push(drawerApiRef);
    otherRef.push(drawerCxscRef);
    otherRef.push(modalFormRef);
    otherRef.push(drawerQyhyRef);
    otherRef.push(SfsqxqRef);
    otherRef.push(SffwsqRef);
    return otherRef;
  };

  return <>
    <DDBunit2 config={myConfig} func={Func} />
    <ModalForm onRef={modalRef} />
    <DrawerBdyh onRef={DrawerBdyhRef} />
    <DrawerQyyg onRef={drawerQyygRef} />
    <DrawerApi onRef={drawerApiRef} />
    <DrawerCxsc onRef={drawerCxscRef} />
    <ModalForm2 onRef={modalFormRef} yhlx={yhlx} />
    <Drawerqyhy onRef={drawerQyhyRef} />
    <Sfsqxq onRef={SfsqxqRef} />
    <ModalSffwsq onRef={SffwsqRef} />
  </>
};

export default index;
