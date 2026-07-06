// 出口发票开具-出口发票开具-数电票开具（new）
import cktsUtil from '@/pages/hts/cktsUtil';
import React, { useEffect, useRef, useState } from 'react';
import { Tabs, message } from 'antd';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import unitConfig from './zxkpConfig';
import func from './zxkpFunc';
import unitConfigDc from './dckpConfig';
import funcDc from './dckpFunc';
import myUtil from '@/components/DDAssist/util';
import { djcsjkptj, scjc, ddtjkp2, checkDlt2 } from '@/pages/hts/services/htsApi';
import { intl as intl2 } from '@/components/DDAssist/util';
import DDAlert from '@/pages/hts/components/DDAlert';
import TabSfyz from '../../../pzgl/sdppzgl/djdlpz/tab_sfyz';
import TabKprz from '../../../pzgl/sdppzgl/djdlpz/tab_kprz';
import { useAccess } from 'umi';
import qxUtil from '@/pages/hts/common/qxUtil';
import FpDDLogin from '@/pages/hts/components/FpDDLogin';


const Index: React.FC<unknown> = () => {

  const drmbkjInvoiceRef: any = useRef();
  const refSmrz: any = useRef();
  const refKprz: any = useRef();  // hst2
  const refFprz: any = useRef();
  const access = useAccess(); // 权限
  const paramLq = {
    qxCode: 'qx_szlq',
    accessObj: access,
  }

  func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(drmbkjInvoiceRef);
    return otherRef;
  };

  const myConfig = { ...unitConfig };
  const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ:01'); // 发票配置的码表
  const tempCode = temp[0];
  const timerRef: any = useRef(null);

  // 检查定时器是否活跃
  const isTimerActive = () => {
    return timerRef.current !== null;
  };

  // 配置项：自定义工具栏
  myConfig.customer_toolbar = [
    { name: '提交开票', func: 'handleTjkp' },
    { name: '发票撤回', func: 'handleFpch' },
  ];
  // 检查状态隐藏、修改标志隐藏、失败原因隐藏
  myConfig.grid_columns.forEach((item: any) => {
    if (item.dataIndex === 'jczt' || item.dataIndex === 'xgbz' || item.dataIndex === 'sbyy1') {
      item.hidden = true;
    }
  })
  myConfig.gridParams = {
    initSearchModal: [
      { property: 'cxlx', value: "1", op: 'zdy' },
    ],
  }
  // 导出
  myConfig.export_key = 'CX_CKFPKJ_FPGL_ZXKP_SDPDKP_EXCEL';



  // 提交开票（登录态验证）
  func.handleTjkp = async (param: any) => {
    const { selectionRowKeys, unitRef, selectionRows, unit_key, gridRef } = param;
    const fpsqduuids: any = [];
    if (selectionRowKeys && selectionRowKeys.length > 0) {
      selectionRows.forEach((row: any) => {
        fpsqduuids.push(row.fpsqduuid);
      });
    }
    const gridData = unitRef.current?.getGridData();
    const searchModel = unitRef.current.getGridParams().searchModel || [];
    const headerSearchModel = gridRef.current?.getHeaderFilter() || [];
    const allSearchModel: any = searchModel.concat(headerSearchModel);
    if (gridData.length === 0) {
      message.info(intl2.formatMessage({ id: 'message_common_type_no_griddata' }));
      return;
    }
    const obj = {
      cxlx: "1",
      fpsqduuids: fpsqduuids,
    }
    allSearchModel.forEach(element => {
      obj[element.property] = element.value == undefined ? element.values : element.value;
    });
    const kptj = {
      cxlx: '1',
      cxtj: allSearchModel,
      fpsqduuids: fpsqduuids,
    };
    tjTjkp(kptj, obj, unitRef);
  }



  const tjTjkp =  (kptj: any, obj: any, unitRef: any) => {
    if (qxUtil.getQxz(paramLq)) {
      kp(kptj, obj, unitRef);
    } else {
      unitRef.current!.setMasker(true);
      checkDlt2({}).then( (res: any) => {
        unitRef.current!.setMasker(false);
        const { code, body } = res;
        if (code == "200") {
          const dlbz = body?.dlbz;
          const rzbz = body?.rzbz;
          if (body?.jhbz != 'Y') {
            message.error('操作失败，请联系管理员!');
          } else {
            if (dlbz === 'Y' && rzbz === 'Y') {
              kp(kptj, obj, unitRef);
            } else if (dlbz != 'Y') {
              tz('2004', kptj, obj, unitRef);
            } else if (dlbz == 'Y' && rzbz != 'Y') {
              tz('2005', kptj, obj, unitRef);
            }
          }
        } else {
          message.error(res?.msg);
        }
      });
    }
  }


  const kp = (kptj: any , obj: any, unitRef: any) => {
    unitRef?.current?.setMasker(true);
    djcsjkptj(kptj).then((res1: any) => {
      unitRef.current!.setMasker(false);
      if (res1.code != '200') {
        message.info(res1.msg);
        return;
      }
      let m = "确定提交开票吗？";
      if (res1?.body?.cyebz == 'Y') {
        m = "本次提交开票的发票总金额超过可用发票额度，可能导致发票开具失败，确定继续提交开票吗?";
      }
      DDAlert.open({
        title: '提交开票',
        info: m,
        modalType: 'confirm',
        okText: '确定',
        content: [
          '批次号' + res1.body.pch,
          '单据号' + res1.body.fpsqdzs + '张',
          '含税金额合计' + myUtil.text.formatNum(res1.body.kpje, '0,0.00') + '元',
          '不含税金额合计' + myUtil.text.formatNum(res1.body.kpjews, '0,0.00') + '元',
          '税额合计' + myUtil.text.formatNum(res1.body.sehj, '0,0.00') + '元'
        ],
        okCallbackFn:  function () {
          obj.pch = res1.body.pch;
          unitRef?.current?.setMasker(true);
          ddtjkp2(obj).then((res2: any) => {
            unitRef?.current?.setMasker(false);
            if (res2.code === '200') {
              message.success(res2.msg);
              unitRef?.current?.reload2();
            } else {
              message.error(res2.msg);
            }
          });
        }
      });
    });
  }

  const tz = (rtnCode: any, kptj: any, obj: any, unitRef: any) => {
    if (rtnCode === '2004') {
      unitRef?.current?.setMasker(true);
      if (cktsUtil.fpfw.fpfwlxDm() === '2') {
        refKprz?.current?.showModal();
      } else {
        refFprz?.current?.showModal();
      }
      if (isTimerActive()) {
        clearInterval(timerRef.current);
      }
      timerRef.current = setInterval(async function () {
        const bool = cktsUtil.fpfw.fpfwlxDm() === '2' ? refKprz?.current?.getMoVis() : refFprz?.current?.getMoVis();
        if (!bool) {
          if (isTimerActive()) {
            clearInterval(timerRef.current);// 停止定时器
          }
          // 刷新页面
          await checkDlt2({}).then(async (res: any) => {
            unitRef?.current?.setMasker(false);
            const { code, body, msg } = res;
            if (code == '200') {
              const dl = body?.dlbz == 'Y' ? true : false;
              const rz = body?.rzbz;
              //已登錄
              if (dl && rz == 'N') {
                tz("2005", kptj, obj, unitRef);
              }
              if (dl && rz == 'Y') {
                kp(kptj, obj, unitRef);
              }
              if (dl && rz == 'U') {
                tz("2005", kptj, obj, unitRef);
              }
            } else {
              message.error(msg);
            }
          });
        }
      }, 1000);
    } else {
      unitRef?.current?.setMasker(true);
      refSmrz?.current?.showModal();
      if (isTimerActive()) {
        clearInterval(timerRef.current);
      }
      timerRef.current = setInterval(async function () {
        const gbbz = refSmrz?.current?.getXzbz();
        const bool = refSmrz?.current?.getMoVis();
        if (!gbbz) {
          unitRef?.current?.setMasker(false);
          if (bool) {
            if (isTimerActive()) {
              clearInterval(timerRef.current);
            }
          }
        }
        if (!bool) {
          if (isTimerActive()) {
            clearInterval(timerRef.current);
          }
          unitRef?.current?.setMasker(true);
          await checkDlt2({}).then(async (res: any) => {
            unitRef?.current?.setMasker(false);
            const { code, body, msg } = res;
            if (code == '200') {
              const dl = body?.dlbz == 'Y' ? true : false;
              const rz = body?.rzbz;
              //已登錄
              if (dl && rz != 'N') {
                kp(kptj, obj, unitRef);
              }
            } else {
              message.error(msg);
            }
          });
        }
      }, 1000);
    }
  }



  const getdlFlag = () => {

  }

  // 上传检查
  func.handleScjc = (param: any) => {
    const { selectionRowKeys, unitRef, selectionRows, unit_key, gridRef } = param;
    if (!selectionRowKeys || selectionRowKeys.length === 0) {
      message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
      return;
    }
    const fpsqduuids: any = [];
    if (selectionRowKeys && selectionRowKeys.length > 0) {
      selectionRows.forEach((row: any) => {
        fpsqduuids.push(row.fpsqduuid);
      });
    }
    unitRef.current!.setMasker(true);
    djcsjkptj({ fpsqduuids }).then((res1: any) => {
      unitRef.current!.setMasker(false);
      if (res1.code != '200') {
        message.info(res1.msg);
        return;
      }
      DDAlert.open({
        title: '确认上传检查',
        info: '确认继续上传检查吗？',
        modalType: 'confirm',
        okText: '确认',
        content: [
          '发票单据号' + res1.body.fpsqdzs + '张',
          '金额合计' + myUtil.text.formatNum(res1.body.kpje, '0,0.00') + '元',
          '税额合计' + myUtil.text.formatNum(res1.body.sehj, '0,0.00') + '元'
        ],
        okCallbackFn: function () {
          //调用上传检查
          scjc({ fpsqduuids, flag: "03" }).then((res: any) => {
            if (res.code != '200') {
              message.error(res.msg);
            } else {
              message.info('上传检查申请成功！');
            }
          });
        }
      });
    });
  }



  if (tempCode && tempCode?.fpkjfsDm === '2') {
    return (
      <div>
        <DDBunit2 config={myConfig} func={func} />
        <TabSfyz onRef={refKprz} getdlFlag={() => { }} />
        <TabKprz onRef={refSmrz} getdlFlag={() => { }} />
        <FpDDLogin onRef={refFprz} getdlFlag={() => { }} />

      </div>
    );
  } else {
    return (
      <div>
        <DDBunit2 config={unitConfigDc} func={funcDc} />
      </div>
    )
  }
}

export default Index;
