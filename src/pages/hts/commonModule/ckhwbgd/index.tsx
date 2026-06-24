import cktsUtil from '@/pages/hts/cktsUtil';
import React, { useRef, useEffect } from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import config from './config';
import sjglConfig from './sjglConfig';
import sjgCkbgdConfig from './sjgCkbgdConfig';
import Func from './f';
import myUtil from '@/components/DDAssist/util';
import Scmx from '../scmx/scmx';
import Dy from './dy';
import DyGdw from './dyGdw';
import Hgbgd from './hgbgd';
import Yl from './Yl';
import Gdhq from '@/pages/hts/ckfp/bgdgl/modal_list';
import CheckCmcode from './sjjc/check_cmcode';
import CheckBicode from './sjjc/check_bicode';
import { history, useAccess } from 'umi';
import IcList from '@/pages/hts/pzgl/icCard/common/icCardTsList';
import IcListGpt from '@/pages/hts/pzgl/icCard/common/icCardTsListGpt';
import IcListYbt from '@/pages/hts/pzgl/icCard/common/icCardTsListYbt';
import Xxjc from './Xxjc';
import qxUtil from '@/pages/hts/common/qxUtil';
import { message } from 'antd';
import { cloneDeep } from 'lodash';
import { delTzsx } from '@/pages/hts/services/htsApi';
import Xj from '@/pages/hts/commonModule/xj/xj';
import moment from "moment";

const Index: React.FC = () => {
  const access = useAccess();

  const zyParam = {
    zycode: 'S_020301_000001',
    accessObj: access,
  }

  useEffect(() => {
    delTzsx({ cdDm: '020301' }).then(() => { });
  }, []);

  const refICList: any = useRef(); // 环境检测
  const refICListGpt: any = useRef(); // 关票通环境检测
  const refIcListYbt: any = useRef(); // 关票通环境检测

  let myconfig = cloneDeep(config);
  const qylx = cktsUtil.sys.enterpriseType();
  // 取企业类型，生产SC， 外贸WM
  if (qylx === 'WM') {
    myconfig.grid_columns[0].codeTable = ['CODE_WM_CS_ZXSB_LCSWSX', '01'];
    // myconfig.grid_columns2[5].codeTable = ['CODE_DM_ZXSB_BGDCLLX_WM', '01'];
    // myconfig.grid_columns2[5].filter.codeTable = ['CODE_DM_ZXSB_BGDCLLX_WM', '01'];
    // myconfig.grid_columns2[6].codeTable = ['CODE_DM_ZXSB_BGDCLLX_WM', '01'];
    // myconfig.grid_columns2[6].filter.codeTable = ['CODE_DM_ZXSB_BGDCLLX_WM', '01'];
  } else {
    myconfig.grid_columns[0].codeTable = ['CODE_SC_CS_ZXSB_LCSWSX', '01'];
    // myconfig.grid_columns2[5].codeTable = ['CODE_DM_ZXSB_BGDCLLX_SC', '01'];
    // myconfig.grid_columns2[5].filter.codeTable = ['CODE_DM_ZXSB_BGDCLLX_SC', '01'];
    // myconfig.grid_columns2[6].codeTable = ['CODE_DM_ZXSB_BGDCLLX_SC', '01'];
    // myconfig.grid_columns2[6].filter.codeTable = ['CODE_DM_ZXSB_BGDCLLX_SC', '01'];
  }

  const scmxPdRef: any = useRef();
  const hgbgdRef: any = useRef();
  const gdhqRef: any = useRef();
  const ylRef: any = useRef();
  const xjRef: any = useRef();

  const checkCmcodeRef: any = useRef();
  const checkBicodeRef: any = useRef();
  const dy: any = useRef();
  const xxjcRef: any = useRef();
  const dyGdw: any = useRef();

  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(scmxPdRef);
    otherRef.push(hgbgdRef);
    otherRef.push(gdhqRef);
    otherRef.push(checkCmcodeRef);
    otherRef.push(checkBicodeRef);
    otherRef.push(dy);
    otherRef.push(refICList);
    otherRef.push(refICListGpt);
    otherRef.push(xxjcRef);
    otherRef.push(dyGdw);
    otherRef.push(ylRef);
    otherRef.push(xjRef);
    otherRef.push(refIcListYbt);
    return otherRef;
  };

  if (history?.location?.pathname.indexOf('/qt/07/0705/070501') > -1) {
    // 资格备案-出口货物报关单管理
    // 外贸综合服务企业代办退税申报表
    myconfig.customer_toolbar = [
      // { name: '关单获取', key: 'gdhq', func: 'openGdhqModal' },
      { name: '报关单导入', key: '5B0E0D24C5540BE634F369AC77F0E230', func: 'sjdrFunc' },
      { name: '数据检查', key: '5B0E0D24C5540BE634F369AC77F0E2D4', func: 'shjcFunc' },
      { name: '更新信息', key: 'gxxx', func: 'gxxx' },
    ];
    // 配置项：工具栏
    myconfig.toolbar_default = {
      setting: true,                    // 是否显示设置按钮，默认关闭
      full: true,                       // 是否显示全屏按钮，默认关闭
      reload: true,                     // 是否显示刷新按钮，默认关闭
      delete: true,
      add: true,
      edit: true,
      upload: false,                    // 是否显示导入按钮，默认关闭
      ckts_download: true,              // 是否显示导出按钮，默认关闭
    };
  } else if (history?.location?.pathname.indexOf('/02/0203/020301') > -1) {
    //  // 数据管理-出口货物报关单
    myconfig = cloneDeep(sjglConfig); // 因数据列表变动比较大，将原有config复制一份将以下配置项重新覆盖
    myconfig.grid_columns = sjgCkbgdConfig.grid_columns;
    myconfig.filter_items = sjgCkbgdConfig.filter_items;
    myconfig.customer_toolbar = sjgCkbgdConfig.customer_toolbar;

    // Func.filterValidate = (param: any) => {
    //   const hgckhwbgdsbrq = param?.form.getFieldValue('hgckhwbgdsbrq');
    //   if (!hgckhwbgdsbrq || hgckhwbgdsbrq.length !== 2) {
    //     message.info('请输入筛选条件，申报日期必填！');
    //     return false;
    //   } else {
    //     const userInfo = myUtil.sessionStore.getItem('userInfo');
    //     const fpcxzdyffw = userInfo?.qypz?.QYPZGL_FPCXZDYFFW ? userInfo?.qypz?.QYPZGL_FPCXZDYFFW : 24;
    //     const hgckhwbgdsbrqQ = hgckhwbgdsbrq[0];
    //     const hgckhwbgdsbrqZ = hgckhwbgdsbrq[1];
    //     // 计算两个日期之间的月份差
    //     const date1 = new Date(hgckhwbgdsbrqQ);
    //     const date2 = new Date(hgckhwbgdsbrqZ);
    //     const monthsDiff = (date2.getFullYear() - date1.getFullYear()) * 12 + (date2.getMonth() - date1.getMonth());
    //     if (monthsDiff > fpcxzdyffw) {
    //       message.info('申报日期范围不能超过' + fpcxzdyffw + '个月！');
    //       return false;
    //     }
    //     return true;
    //   }
    // }

    // 如果不是单一窗口地区，则显示
    if (!qxUtil.getZy(zyParam)) {
      // 未确认需求，14版本暂时拿掉
      // myconfig.customer_toolbar.push({ name: '信息检测', key: '1', func: 'handleBgdXxjc' },);
      // myconfig.grid_columns.splice(6, 0, {
      //   title: '信息状态', dataIndex: 'czbz1', width: 120,
      //   render: { func: 'renderCkfpSjxzBgdXxzt' },
      //   filter: {
      //     type: 'Select',
      //     list: [
      //       { text: '信息齐全', value: 'Y' },
      //       { text: '信息不全', value: 'N' },
      //       { text: '未检测', value: 'U' }
      //     ],
      //   }
      // });


      //信息监测
      Func.handleBgdXxjc = (param: any) => {
        const { selectionRowKeys, selectionRows, unitRef, otherRef } = param;
        const pagination = unitRef.current.getPagination().total;
        if (pagination == 0) {
          message.info('当前无可操作的数据。');
          return;
        }
        if (pagination >= 500 && selectionRowKeys.length == 0) {
          message.info('当前选择的数据超过500条，检测时间可能会较长，建议减少数据条数后再进行信息检测。');
          return;
        }
        let info = "";
        if (selectionRowKeys.length > 0) {
          info = `确定对勾选的${selectionRowKeys.length}条数据进行信息检测的操作吗？`;
        }
        if (selectionRowKeys.length == 0) {
          info = `确定对当前筛选条件下的${selectionRowKeys.length}条数据进行信息检测的操作吗？`;
        }
        otherRef[8].current?.showModal(unitRef, info);
      }
    }



  } else {
    // 其他
    myconfig.customer_toolbar = [
      { name: '打印', key: '5B0E0D24C5540BE634F369AC77F0E2D1', func: 'dyFunc' },
      { name: '删除', key: 'sc', func: 'btnDelete' },
    ];
    // 配置项：工具栏
    myconfig.toolbar_default = {
      setting: true,                    // 是否显示设置按钮，默认关闭
      full: true,                       // 是否显示全屏按钮，默认关闭
      reload: true,                     // 是否显示刷新按钮，默认关闭
      delete: false,
      add: false,
      edit: false,
      upload: false,                    // 是否显示导入按钮，默认关闭
      ckts_download: true,              // 是否显示导出按钮，默认关闭
    };
  }
  return (
    <div>
      <DDBunit2 config={myconfig} func={Func} />
      <Scmx onRef={scmxPdRef} />
      <Hgbgd onRef={hgbgdRef} />
      <Gdhq onRef={gdhqRef} />
      <CheckCmcode onRef={checkCmcodeRef} />
      <CheckBicode onRef={checkBicodeRef} />
      <Dy onRef={dy} />
      <IcList onRef={refICList} />
      <IcListGpt onRef={refICListGpt} />
      <Xxjc onRef={xxjcRef} />
      <DyGdw onRef={dyGdw} />
      <Yl onRef={ylRef} />
      <Xj onRef={xjRef} />
      <IcListYbt onRef={refIcListYbt} />
    </div>
  );
}

export default Index;
