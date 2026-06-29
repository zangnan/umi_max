/**
 * title: 发票开具管理-主页面
 * author: yxy
 */
import cktsUtil from '@/pages/hts/cktsUtil';
import React, { useState, useRef, useImperativeHandle } from 'react'; 
import lzfpConfig from './lzfpConfig';// 蓝字发票
import hzfpConfig from './hzfpConfig';// 红字发票
import zffpConfig from './zffpConfig';// 作废发票
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import zxkpFunc from './zxkpFunc';
import myUtil from '@/components/DDAssist/util';
import { Form, message, Radio, Space, Spin, Alert } from 'antd';
import { history, useAccess } from 'umi';
import DrmbkjInvoice from '../../drmbkj/drmbkjInvoice';
import { fphc, sdpfphc, sdpfphc2, fpztsx, fpztsxZx, sfczdlzfp, checkDlt2, djcsjkptj, ddtjkp2 } from '@/pages/hts/services/htsApi';
import DDAlert from '@/pages/hts/commonModule/DDAlert';
import { intl as intl2 } from '@/components/DDAssist/util';
import qxUtil from '@/pages/hts/common/qxUtil';
import { cloneDeep } from 'lodash';
import TabSfyz from '../../../pzgl/sdppzgl/djdlpz/tab_sfyz';
import TabKprz from '../../../pzgl/sdppzgl/djdlpz/tab_kprz';


export interface BdjgProps {
  onRef?: any;
}
const Fpkjgl: React.FC<BdjgProps> = ({
  onRef,
}) => {

  const drmbkjInvoiceRef: any = useRef();
  const refSmrz: any = useRef();
  const refKprz: any = useRef();

  const timerRef: any = useRef(null);

  // 检查定时器是否活跃
  const isTimerActive = () => {
    return timerRef.current !== null;
  };



  zxkpFunc.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(drmbkjInvoiceRef);
    return otherRef;
  };

  const [paramSdp, setParamSdp] = useState<any>({});  // 数电票接口入参
  const [hcUnitRef, setUnitRef] = useState<any>();
  const [masker, setMasker] = useState(false);                                  // loading标志
  const [paramHckp, setParamHckp] = useState<any>([]);  // 数电票红冲接口入参
  const [paramhzkp, setParamHzkp] = useState<any>([]);  // 更新状态入参
  const [checkBtn, setCheckBtn] = useState<any>('hc');  // hc 红冲 gx 更新
  const [gxUnitRef, setGxUnitRef] = useState<any>();
  const [tjParam, setTjParam] = useState<any>([]);
  const [kptj, setKptj] = useState<any>([]);
  const [czbz, setCzbz] = useState<any>("N");





  let bz: any = ''
  if (history.location.query) {
    bz = history.location.query?.bz;
  }



  // 开票
  const kpSuccess = async (obj: any, ref: any, flag: any) => {
    const unitRef = ref ? ref : hcUnitRef;
    if (flag === '1') {
      setMasker(true);
      await checkDlt2({}).then(async (res: any) => {
        setMasker(false);
        const { code, body } = res;
        if (code == "200") {
          const dl = body?.dlbz;
          const rz = body?.rzbz;
          if (dl == 'Y' && rz == 'Y') {
            tzHc("200", obj, unitRef);
          } else if (dl != 'Y') {
            tzHc("2004", obj, unitRef);
          } else if (dl == "Y" && rz != 'Y') {
            tzHc("2005", obj, unitRef);
          }
        } else {
          message.error(res?.msg);
        }
      });
    }
  }

  const tzHc = (code: any, obj: any, unitRef: any) => {
    if (code == '200') {
      unitRef.current!.setMasker(true);
      sdpfphc2(obj ? obj : paramSdp).then((res: any) => {
        unitRef.current!.setMasker(false);
        setMasker(false);
        const { code, body, desc, msg } = res;
        if (code === '200') {
          // 清空选中并设置按钮可用状态
          unitRef.current!.reload2();
          message.success('发票红冲申请成功!');
        } else if (code === '900') {
          // 业务校验
          message.info(msg)
        } else if (code === '0') {
          message.error('系统异常，请联系技术支持。');
        } else {
          message.error(desc);
        }
      });
    } else if (code == '2004') {
      refKprz.current!.showModal();
      if (isTimerActive()) {
        clearInterval(timerRef.current);
      }
      timerRef.current = setInterval(async function () {
        const bool = refKprz.current!.getMoVis();
        if (!bool) {
          if (isTimerActive()) {
            clearInterval(timerRef.current);// 停止定时器
          }
          // 刷新页面
          await checkDlt2({}).then(async (res: any) => {
            const { code, body, msg } = res;
            if (code == '200') {
              const dl = body?.dlbz == 'Y' ? true : false;
              //已登錄
              if (dl && body?.rzbz == "Y") {
                tzHc("200", obj, unitRef);
              }
              if (dl && body?.rzbz == "U") {
                tzHc("2005", obj, unitRef);
              }
              if (dl && body?.rzbz == "N") {
                tzHc("2005", obj, unitRef);
              }
            } else {
              message.error(msg);
            }
          });
        }
      }, 1000);
    } else if (code == '2005') {
      refSmrz.current!.showModal();
      if (isTimerActive()) {
        clearInterval(timerRef.current);
      }
      timerRef.current = setInterval(async function () {
        const bool = refSmrz.current!.getMoVis();
        if (!bool) {
          if (isTimerActive()) {
            clearInterval(timerRef.current);
          } // 停止定时器
          await checkDlt2({}).then(async (res: any) => {
            const { code, body, msg } = res;
            if (code == '200') {
              const dl = body?.dlbz == 'Y' ? true : false;
              //已登錄
              if (dl && body?.rzbz != "N") {
                tzHc("200", obj, unitRef);
              }
            } else {
              message.error(msg);
            }
          });
        }
      }, 1000);
    }

  }




  // 发票红冲
  zxkpFunc.handleFphc = (param: any) => {
    const { selectionRowKeys, selectionRows, unitRef } = param;
    if (selectionRowKeys.length > 1) {
      message.info(intl2.formatMessage({ id: 'message_one_selected' }));
      return;
    }
    if (!selectionRowKeys || selectionRowKeys.length === 0) {
      message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
      return;
    }
    if (selectionRows[0].fpkjztDm != '2') {
      message.info('请选择“开票失败”的数据进行操作！');
      return;
    }
    Promise.all([myUtil.code.getCodeFromServerT1('code_dm_zxsb_hcyy:01'), myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ:01')]).then(() => {
    }).catch(() => {
      message.error('获取码表失败');
    }).finally(() => {
      // 在线开票 数电票
      const temp = myUtil.code.getCode('code_dm_zxsb_hcyy:01');
      DDAlert.open({
        title: '重新开票',
        infoType: 'info',
        closeStatus: false,
        isFormContent: true,
        modalType: 'form',
        content: <>
          <Form.Item label="红冲原因：" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} name='hcyy' rules={[{ required: true, message: '请选择红冲原因' }]}>
            <Radio.Group>
              <Space direction="vertical" style={{ marginTop: '6px ' }}>
                {temp.map((item: any) => (<Radio value={item.code}>{item.name}</Radio>))}
              </Space>
            </Radio.Group>
          </Form.Item>
        </>,
        okCallbackFn: function (thisObj: any) {
          DDAlert.getForms().validateFields().then((values: any) => {
            const hcyy = values.hcyy
            if (selectionRows[0]?.kpfsDm === '2' && selectionRows[0].fpzlDm1 === '5') {
              // 数电票和在线开票
              // 校验登录状态
              setUnitRef(unitRef);
              DDAlert.close();
              setParamSdp({ fpsqduuid: selectionRows[0].lzfpsqduuid, hdid: selectionRows[0].xxfhuuid, hcyy })
              setCheckBtn('hc')
              if(qxUtil.getQxz(paramLq)){
                tzHc("200", { fpsqduuid: selectionRows[0].lzfpsqduuid, hdid: selectionRows[0].xxfhuuid, hcyy }, unitRef);
              }
              kpSuccess({ fpsqduuid: selectionRows[0].lzfpsqduuid, hdid: selectionRows[0].xxfhuuid, hcyy }, unitRef, '1');
            } else {
              thisObj.setState({ masker: true });
              fphc({ fpsqduuid: selectionRows[0].lzfpsqduuid, hdid: selectionRows[0].xxfhuuid, hcyy }).then((response) => {
                thisObj.setState({ masker: false });
                DDAlert.close();
                if (response.code === '200') {
                  // 清空选中并设置按钮可用状态
                  unitRef.current!.reload2();
                  message.success('重新开票申请成功！');
                } else if (response.code === '900') {
                  message.error(response.msg);
                } else {
                  message.error(response.desc);
                }
              })
            }
          })
        }
      })
    })
  }


  // 蓝票 重新开票 （数电票）
  zxkpFunc.handleCxkpLz =  (param: any) => {
    const { selectionRowKeys, unitRef, selectionRows, unit_key, gridRef } = param;
    unitRef.current!.setMasker(true);
    if (!selectionRowKeys || selectionRowKeys.length === 0) {
      unitRef.current!.setMasker(false);
      message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
      return;
    }
    let flag = false;
    for (let i = 0; i < selectionRows.length; i++) {
      if (selectionRows[i].fpkjztDm != '2') {
        unitRef.current!.setMasker(false);
        message.info('请选择发票状态为“开票失败”的数据进行操作!');
        return;
      }
      if (selectionRows[i].fpzlDm1 == '5') {
        // 存在数电票，就验证是否已登录
        flag = true;
      }
    }
    unitRef.current!.setMasker(false);
    if (qxUtil.getQxz(paramLq)) {
      tz('200', selectionRowKeys, selectionRows, unitRef);
    } else {
      if (flag) {
        unitRef.current!.setMasker(true);
        checkDlt2({}).then(async (res: any) => {
          unitRef.current!.setMasker(false);
          const { code, body } = res;
          if (code == "200") {
            // const rtnCode = body.rtnCode;
            const dlbz = body?.dlbz;
            const rzbz = body?.rzbz;
            if (dlbz === 'Y' && rzbz === 'Y') {
              tz('200', selectionRowKeys, selectionRows, unitRef);
            } else if (dlbz != 'Y') {
              tz('2004', selectionRowKeys, selectionRows, unitRef);
            } else if (dlbz == 'Y' && rzbz != 'Y') {
              tz('2005', selectionRowKeys, selectionRows, unitRef);
            }
          } else {
            message.error(res?.msg);
          }
        });
      } else {
        const fpsqduuids: any = [];
        if (selectionRowKeys && selectionRowKeys.length > 0) {
          selectionRows.forEach((row: any) => {
            fpsqduuids.push(row.fpsqduuid);
          });
        }

        const obj = {
          cxlx: "5",
          fpsqduuids: fpsqduuids,
        }
        const kptj2 = {
          fpsqduuids: fpsqduuids,
        };
        setTjParam(obj);
        setKptj(kptj2);
        setUnitRef(unitRef);
        zxkpFunc.open(obj, kptj2, unitRef);
      }
    }
  }






  const tz = (rtnCode: any, selectionRowKeys: any, selectionRows: any, unitRef: any) => {
    if (rtnCode === '2004') {
      unitRef?.current?.setMasker(true);
      refKprz.current!.showModal();
      if (isTimerActive()) {
        clearInterval(timerRef.current);
      }
      timerRef.current = setInterval(async function () {
        const bool = refKprz.current!.getMoVis();
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
              const rz = body?.rzbz == 'Y' ? true : false;
              //已登錄
              if (dl) {
                tz("2005", selectionRowKeys, selectionRows, unitRef);
              }
            } else {
              message.error(msg);
            }
          });
        }
      }, 1000);
    } else if (rtnCode === '2005') {
      unitRef?.current?.setMasker(true);
      refSmrz.current!.showModal();
      if (isTimerActive()) {
        clearInterval(timerRef.current);
      }
      timerRef.current = setInterval(async function () {
        const bool = refSmrz.current!.getMoVis();
        const xzbz = refSmrz?.current?.getXzbz();
        if (!xzbz) {
          unitRef?.current?.setMasker(false);
          if (bool) {
            if (isTimerActive()) {
              clearInterval(timerRef.current);// 停止定时器
            }
          }
        }
        if (!bool) {
          if (isTimerActive()) {
            clearInterval(timerRef.current);// 停止定时器
          }
          unitRef?.current?.setMasker(true);
          await checkDlt2({}).then(async (res: any) => {
            unitRef?.current?.setMasker(false);
            const { code, body, msg } = res;
            if (code == '200') {
              const dl = body?.dlbz == 'Y' ? true : false;
              const rz = body?.rzbz == 'Y' ? true : false;
              //已登錄
              if (dl && body?.rzbz != "N") {
                tz("200", selectionRowKeys, selectionRows, unitRef);
              }
            } else {
              message.error(msg);
            }
          });
        }

      }, 1000);
    } else if ("200" == rtnCode) {
      const fpsqduuids: any = [];
      if (selectionRowKeys && selectionRowKeys.length > 0) {
        selectionRows.forEach((row: any) => {
          fpsqduuids.push(row.fpsqduuid);
        });
      }
      const obj = {
        cxlx: "5",
        fpsqduuids: fpsqduuids,
      }
      const kptj2 = {
        fpsqduuids: fpsqduuids,
      };
      setTjParam(obj);
      setKptj(kptj2);
      setUnitRef(unitRef);
      zxkpFunc.open(obj, kptj2, unitRef);
    }
  }

  zxkpFunc.open = (obj: any, kptj: any, unitRef: any) => {
    unitRef?.current?.setMasker(true);
    djcsjkptj(kptj).then((res1: any) => {
      unitRef?.current?.setMasker(false);
      if (res1.code != '200') {
        message.info(res1.msg);
        return;
      }
      const pchres = res1.body.pch;
      DDAlert.open({
        title: '重新开票',
        info: '确定重新开票吗？',
        modalType: 'confirm',
        okText: '确定',
        content: [
          pchres ? '批次号' + res1.body.pch : "",
          '单据号' + res1.body.fpsqdzs + '张',
          '金额合计' + myUtil.text.formatNum(res1.body.kpje, '0,0.00') + '元',
          '税额合计' + myUtil.text.formatNum(res1.body.sehj, '0,0.00') + '元'
        ],
        okCallbackFn: function () {
          unitRef?.current?.setMasker(true);
          if (res1.body.pch) {
            obj.pch = res1.body.pch;
          }
          ddtjkp2(obj).then((res2: any) => {
            unitRef?.current?.setMasker(false);
            if (res2.code === '200') {
              message.success('重新开票申请成功！');
              unitRef?.current?.reload2();
            } else {
              message.error(res2.msg);
            }
          });
        }
      });
    });
  }


  // 红票 重新开票 (旧)
  zxkpFunc.handleFpkjHz = (param: any) => {
    const { selectionRowKeys, unitRef, selectionRows, unit_key, gridRef } = param;
    if (selectionRowKeys.length > 1) {
      message.info(intl2.formatMessage({ id: 'message_one_selected' }));
      return;
    }
    if (!selectionRowKeys || selectionRowKeys.length === 0) {
      message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
      return;
    }
    if (selectionRows[0].fpkjztDm != '2') {
      message.info('请选择“开票失败”的数据进行操作！');
      return;
    }
    unitRef.current!.setMasker(true);
    fphc({ fpsqduuid: selectionRows[0].lzfpsqduuid, hcyy: selectionRows[0].hcyy }).then((response) => {
      unitRef.current!.setMasker(false);
      if (response.code === '200') {
        // 清空选中并设置按钮可用状态
        unitRef.current!.reload2();
        DDAlert.open({
          title: '发票红冲',
          info: '发票红冲申请成功',
          infoType: 'success',
          modalType: 'info',
          okText: '确定',
          content: '可通过点击“更新状态”按钮更新发票状态。发票红冲成功后，可对原数据执行发票撤回的操作，进行重新开票。',
          okCallbackFn: function () {
          }
        });
      } else if (response.code === '900') {
        message.error(response.msg);
      } else {
        message.error(response.desc);
      }
    })

  }


  let myConfig = cloneDeep(lzfpConfig);

  // 获取发票配置-开票方式，根据开票方式展示不同列表
  const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ:01');
  if (history?.location?.pathname?.indexOf('/ckfpkj/fpztgz') > -1) { 
    // 蓝字
    Promise.all([]).then(async () => {
      const res = await cktsUtil.code.getTsbz();
      if (res.code == '200' && res.body?.czbz == 'Y') {
        setCzbz("Y");
      }});

      myConfig = cloneDeep(lzfpConfig);
      // 导出开票
      if (temp && temp[0]?.fpkjfsDm == '1') {
        // 按钮
        myConfig.customer_toolbar = [];
        // // 查询
        // myConfig.unit_key = 'CX_CKFPKJ_FPGL_DCKP';
        // // 导出
        // myConfig.export_key = 'CX_CKFPKJ_FPGL_DCKP_KPZTGZ_LP_EXCEL';
        // myConfig.grid_columns[11].hidden = true;
      } else {
        myConfig.handle_columns = [
          { name: '修改', func: 'columnUpdate', display: 'gridBadzDzhc23Cz' },
          // { name: '下载发票PDF', func: 'printInvoice', display: 'gridBadzDzhc23Cz2' },
        ];
      }

      myConfig.grid_columns.forEach((item: any) => {
        if (item.dataIndex === 'fpkjztDm') {
          if (bz === 'gzt') {
            item.filter = {
              type: 'Select',
              codeTable: 'CODE_DM_ZXSB_FPKJZT:03',
              value: ["1"]
            };
          } else {
            item.filter = {
              type: 'Select',
              codeTable: 'CODE_DM_ZXSB_FPKJZT:03',
            };
          }
        }
      })
   
    
  } else if (history?.location?.pathname === '/hts/ckfpkj/ckfpkj/hzFpztgz') { // 红字发票
    // 红字发票
    myConfig = cloneDeep(hzfpConfig);

    // 导出开票
    if (temp && temp[0]?.fpkjfsDm == '1') {
      // 按钮
      myConfig.customer_toolbar = [];
      // // 条件
      // myConfig.gridParams = {
      //   initSearchModal: [
      //     { property: 'cxlx', value: "6", op: 'zdy' },
      //   ],
      // }
      // // 查询
      // myConfig.unit_key = 'CX_CKFPKJ_FPGL_DCKP';
      // // 导出
      // myConfig.export_key = 'CX_CKFPKJ_FPGL_DCKP_KPZTGZ_HP_EXCEL';
      // myConfig?.grid_columns?.forEach((item: any) => {
      //   if(item.dataIndex === 'lzfphm' || item.dataIndex === 'lzfpdm'){
      //     item.hidden = true;
      //   }
      // });
    }
    myConfig.grid_columns.forEach((item: any) => {
      if (item.dataIndex === 'fpkjztDm') {
        if (bz === 'gzt') {
          item.filter = {
            type: 'Select',
            codeTable: 'CODE_DM_ZXSB_FPKJZT:04',
            value: ["1"]
          };
        } else {
          item.filter = {
            type: 'Select',
            codeTable: 'CODE_DM_ZXSB_FPKJZT:04',
          };
        }
      }
    })
  } else if (history?.location?.pathname === '/hts/ckfpkj/ckfpkj/zfFpztgz') { // 作废发票
    // 作废发票
    myConfig = cloneDeep(zffpConfig);

    // 导出开票
    if (temp && temp[0]?.fpkjfsDm == '1') {
      // 按钮
      myConfig.customer_toolbar = [];
    }
  }

  const access = useAccess();

  const zyParam = {
    zycode: 'S_121005_000001',
    accessObj: access,
  }

  const paramLq = {
    qxCode: 'qx_szlq',
    accessObj: access,
  }
  if (qxUtil.getZy(zyParam)) {
    myConfig.grid_filter_quick[0].list = [
      { label: '蓝字发票', value: '1', },
      { label: '红字发票', value: '2' },
    ];
  }
  return <>
    <Spin tip="Loading..." spinning={masker} delay={100}>
      {czbz == 'Y' ? <Alert message="请尽快处理开票失败的数据并重新开票，以免影响其他发票的开具。" type="warning" showIcon closable banner={true} /> : <></>}
      <DDBunit2 config={myConfig} func={zxkpFunc} />
      <DrmbkjInvoice onRef={drmbkjInvoiceRef} />
      <TabSfyz onRef={refKprz} getdlFlag={() => { }} />
      <TabKprz onRef={refSmrz} getdlFlag={() => { }} />
    </Spin>
  </>
}

export default Fpkjgl;