// 出口发票开具-出口发票开具-发票红冲（new）
import cktsUtil from '@/pages/hts/cktsUtil';
import React, { useState, useRef } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import unitConfig from './zxhcConfig';
import func from './zxhcFunc';
import myUtil from '@/components/DDAssist/util';
import unitConfigDc from './dckpConfig';
import funcDc from './dckpFunc';
import { Form, message, Radio, Space, Spin } from 'antd';
import DDAlert from '@/pages/hts/components/DDAlert';
import { fphc, sdpfphc, sdphdtjkp, checkDlt2, sdpfphc2, sdpZtsxtb } from '@/pages/hts/services/htsApi';
import { history } from 'umi';
import TabSfyz from '../../../pzgl/sdppzgl/djdlpz/tab_sfyz';
import TabKprz from '../../../pzgl/sdppzgl/djdlpz/tab_kprz';
import { useAccess } from 'umi';
import qxUtil from '@/pages/hts/common/qxUtil';
import FpDDLogin from '@/pages/hts/components/FpDDLogin';


const Index: React.FC<unknown> = () => {
  const refSmrz: any = useRef();
  const refKprz: any = useRef();
  const refFprz: any = useRef();


  const access = useAccess(); // 权限
  const paramLq = {
    qxCode: 'qx_szlq',
    accessObj: access,
  }

  let myConfig = { ...unitConfig };
  let myFunc = { ...func }

  const [paramSdp, setParamSdp] = useState<any>({});  // 数电票接口入参
  const [hcUnitRef, setUnitRef] = useState<any>();
  const [masker, setMasker] = useState(false);                                  // loading标志
  const [paramHckp, setParamHckp] = useState<any>([]);  // 数电票红冲接口入参
  const [paramhzkp, setParamHzkp] = useState<any>([]);  // 更新状态入参
  const [checkBtn, setCheckBtn] = useState<any>('hc');  // hc 红冲 gx 更新
  const [gxUnitRef, setGxUnitRef] = useState<any>();

  const timerRef: any = useRef(null);

  // 检查定时器是否活跃
  const isTimerActive = () => {
    return timerRef.current !== null;
  };

  // 发票红冲
  func.handleFphc = (param: any) => {
    const { selectionRowKeys, selectionRows, refUnit } = param;
    if (!selectionRows || selectionRows.length === 0) {
      message.info('请选择一条“开票成功”或“作废失败”的数据进行操作。');
      return;
    }
    if (selectionRows.length > 1) {
      message.info('请选择一条“开票成功”或“作废失败”的数据进行操作。');
      return;
    }
    for (let i = 0; i < selectionRows.length; i++) {
      if (selectionRows[i].fpkjztDm !== '3' && selectionRows[i].fpkjztDm !== '5') {
        message.info('请选择一条“开票成功”或“作废失败”的数据进行操作。');
        return;
      }
      // 发票种类为增值税电子发票、跨月的增值税普通发票（开票日期和当前年月比对）才能红冲(没写完)
      if (selectionRows[i].khcbz != 'Y') {
        message.info('增值税电子普通发票和跨月的增值税普通票才能红冲！');
        return;
      }
      if (selectionRows[i].yhcbz == 'Y') {
        message.info('该数据已发起过红冲，无需重复操作。');
        return;
      }
    }

    Promise.all([myUtil.code.getCodeFromServerT1('code_dm_zxsb_hcyy:01'), myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ:01')]).then(() => {
    }).catch(() => {
      message.error('获取码表失败');
    }).finally(() => {
      const tempXx = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ:01');
      // 在线开票 数电票
      const temp = myUtil.code.getCode('code_dm_zxsb_hcyy:01');
      DDAlert.open({
        title: '发票红冲',
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
              // 数电票
              setUnitRef(refUnit);
              DDAlert.close();
              setParamSdp({ fpsqduuid: selectionRowKeys[0], hcyy })
              setCheckBtn('hc')
              if(qxUtil.getQxz(paramLq)){
                tz("200", { fpsqduuid: selectionRowKeys[0], hcyy }, refUnit);
              }else{
                kpSuccess({ fpsqduuid: selectionRowKeys[0], hcyy }, refUnit, '1');
              }
            } else {
              thisObj.setState({ masker: true });
              fphc({ fpsqduuid: selectionRowKeys[0], hcyy }).then((response) => {
                thisObj.setState({ masker: false });
                DDAlert.close();
                if (response.code === '200') {
                  // 清空选中并设置按钮可用状态
                  refUnit.current!.reload2();
                  message.success('发票红冲申请成功');
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



  // 开票
  const kpSuccess = async (obj: any, ref: any, flag: any) => {
    const refUnit = ref ? ref : hcUnitRef;
    if (flag === '1') {
      setMasker(true);
      refUnit.current!.setMasker(true);
      await checkDlt2({}).then(async (res: any) => {
        setMasker(false);
        refUnit.current!.setMasker(false);
        const { code, body } = res;
        if (code == "200") {
          const dl = body?.dlbz;
          const rz = body?.rzbz;
          if (dl === 'Y' && rz == 'Y') {
            tz("200", obj, refUnit);
          } else if (dl != 'Y') {
            tz("2004", obj, refUnit);
          } else if (dl === 'Y' && rz != 'Y') {
            tz("2005", obj, refUnit);
          }
        } else {
          message.error(res?.msg);
        }
      });
    } else {
      // 关闭的时候走的接口
      setMasker(true);
      sdphdtjkp({ data: paramHckp }).then((res: any) => {
        setMasker(false);
        const { code, body, desc, msg } = res;
        if (code === '200') {
          const rtnCode = body.rtnCode;
          if (rtnCode === '200') {
            // 清空选中并设置按钮可用状态
            refUnit.current!.reload2();
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
          } else if (rtnCode === '2004' || rtnCode === '2005') {
            // refSfyz.current!.showModal(); // 打开电子税务局身份验证
            DDAlert.open({
              title: '审核',
              info: '电子税务局登录失效',
              infoType: 'warning',
              modalType: 'info',
              okText: '去登录',
              content: '请点击下方“去登录”按钮，跳转至对应页面进行电子税务局登录身份认证。',
              okCallbackFn: function () {
                history.push({ pathname: '/hts/pzgl/dzswjpzgl' });
              }
            });
          }
        } else if (code === '900') {
          // 业务校验
          message.info(msg)
        } else if (code === '0') {
          message.error('系统异常，请联系技术支持。');
        } else {
          message.error(desc);
        }
      });
    }
  }

  const tz = (rtnCode: any, obj: any, refUnit: any) => {
    if (rtnCode == '200') {
      setMasker(true);
      refUnit.current!.setMasker(true);
      sdpfphc2(obj ? obj : paramSdp).then((res: any) => {
        setMasker(false);
        refUnit.current!.setMasker(false);
        const { code, body, desc, msg } = res;
        if (code === '200') {
          // 清空选中并设置按钮可用状态
          refUnit.current!.reload2();
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
    } else if (rtnCode == '2004') {
      if (cktsUtil.fpfw.fpfwlxDm() === '2') {
        refKprz.current!.showModal();
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
            const { code, body, msg } = res;
            if (code == '200') {
              const dl = body?.dlbz == 'Y' ? true : false;
              const rz = body?.rzbz;
              //已登錄
              if (dl && rz =='N') {
                tz("2005", obj, refUnit);
              }
              if(dl && rz =='Y'){
                tz("200", obj, refUnit);
              }
              if(dl && rz =='U'){
                tz("2005", obj, refUnit);
              }
            } else {
              message.error(msg);
            }
          });
        }
      }, 1000);
    } else if (rtnCode == '2005') {
      refSmrz.current!.showModal();
      if (isTimerActive()) {
        clearInterval(timerRef.current);
      }
      timerRef.current = setInterval(async function () {
        const bool = refSmrz.current!.getMoVis();
        if (!bool) {
          // 刷新页面
          if (isTimerActive()) {
            clearInterval(timerRef.current);// 停止定时器
          }
          await checkDlt2({}).then(async (res: any) => {
            const { code, body, msg } = res;
            if (code == '200') {
              const dl = body?.dlbz == 'Y' ? true : false;
              //已登錄
              if (dl && body?.rzbz != "N" ) {
                tz("200", obj, refUnit);
              }
            } else {
              message.error(msg);
            }
          });
        }
      }, 1000);
    }
  }

  const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ:01'); // 发票配置的码表
  const tempCode = temp[0];

  if (tempCode && tempCode?.fpkjfsDm === '2') {
    myConfig = { ...unitConfig };
    myFunc = { ...func };
  } else if (tempCode && tempCode?.fpkjfsDm === '1') {
    myConfig = { ...unitConfigDc };
    myFunc = { ...funcDc };
  }
  return <>
    <DDBunit2 config={myConfig} func={myFunc} />
    <TabSfyz onRef={refKprz} getdlFlag={() => { }} />
    <TabKprz onRef={refSmrz} getdlFlag={() => { }} />
    <FpDDLogin onRef={refFprz} getdlFlag={() => { }} />
  </>;
};

export default Index;
