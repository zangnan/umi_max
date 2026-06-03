/**
 * title: 发票开具管理-主页面
 * author: yxy
 */
import React, { useState } from 'react';
import lzfpConfig from './lzfpConfig';// 蓝字发票
import hzfpConfig from './hzfpConfig';// 红字发票
import zffpConfig from './zffpConfig';// 作废发票
import dckpConfig from './dckpConfig'; // 导出开票
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import zxkpFunc from './zxkpFunc';
import dckpFunc from './dckpFunc';
import myUtil from '@/pages/common/myUtil';
import { Form, message, Radio, Space, Spin } from 'antd';
import { history } from 'umi';
import SfyzModal from '../common/modal_sfyz'
import KprzModal from '../common/modal_kprz'
import { fphc, sdpfphc, sdphdtjkp, fpztsx, fpztsxZx, sdpZtsxtb } from '@/services/hts/api';
import DDAlert from '@/components/DDAlert';

const refSfyz: any = React.createRef();
const refKprz: any = React.createRef();

const Fpkjgl: React.FC<unknown> = () => {

  const [paramSdp, setParamSdp] = useState<any>({});  // 数电票接口入参
  const [hcUnitRef, setUnitRef] = useState<any>();  
  const [masker, setMasker] = useState(false);                                  // loading标志
  const [paramHckp, setParamHckp] = useState<any>([]);  // 数电票红冲接口入参
  const [paramhzkp, setParamHzkp] = useState<any>([]);  // 更新状态入参
  const [checkBtn, setCheckBtn] = useState<any>('hc');  // hc 红冲 gx 更新
  const [gxUnitRef, setGxUnitRef] = useState<any>();  

  let bz:any = ''
  if(history.location.query) {
    bz = history.location.query?.bz;
  }

  // 开票
  const kpSuccess = (obj:any, ref:any, flag: any) => {
    const unitRef = ref?ref:hcUnitRef;
    if(flag === '1') {
      setMasker(true);
      sdpfphc(obj?obj:paramSdp).then((res: any) => {
        setMasker(false);
        const {code, body, desc, msg} = res;
        if(code === '200') {
          const rtnCode = body.rtnCode;
          if(rtnCode === '200') {
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
          } else if(rtnCode === '2004'){
            refSfyz.current!.showModal(); // 打开电子税务局身份验证
            setParamHckp(body?.data)
          } else if(rtnCode === '2005') {
            refKprz.current!.showModal(); // 打开二维码身份验证
            setParamHckp(body?.data)
          }
        } else if(code === '900') {
          // 业务校验
          message.info(msg)
        } else if(code === '0'){
          message.error('系统异常，请联系技术支持。');
        } else {
          message.error(desc);
        }
      });
    } else {
      // 关闭的时候走的接口
      setMasker(true);
      sdphdtjkp({data:paramHckp}).then((res: any) => {
        setMasker(false);
        const {code, body, desc, msg} = res;
        if(code === '200') {
          const rtnCode = body.rtnCode;
          if(rtnCode === '200') {
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
          } else if(rtnCode === '2004'){
            refSfyz.current!.showModal(); // 打开电子税务局身份验证
          } else if(rtnCode === '2005') {
            refKprz.current!.showModal(); // 打开二维码身份验证
          }
        } else if(code === '900') {
          // 业务校验
          message.info(msg)
        } else if(code === '0'){
          message.error('系统异常，请联系技术支持。');
        } else {
          message.error(desc);
        }
      });
    }
  }

  // 发票红冲
  zxkpFunc.handleFphc = (param: any) => {
    const { selectionRowKeys, selectionRows, unitRef } = param;
    if (!selectionRows || selectionRows.length === 0) {
      // message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
      message.info('请选择一条“开票成功”或“作废失败”的数据进行操作。');
      return;
    }
    if (selectionRows.length > 1) {
      // message.info(intl2.formatMessage({ id: 'message_one_selected' }));
      message.info('请选择一条“开票成功”或“作废失败”的数据进行操作。');
      return;
    }
    for (let i = 0; i < selectionRows.length; i++) {
      if (selectionRows[i].fpkjztDm !== '3' && selectionRows[i].fpkjztDm !== '5') {
        message.info('请选择一条“开票成功”或“作废失败”的数据进行操作。');
        return;
      }
      // 发票种类为增值税电子发票、跨月的增值税普通发票（开票日期和当前年月比对）才能红冲(没写完)
      if(selectionRows[i].khcbz != 'Y') {
        message.info('增值税电子普通发票和跨月的增值税普通票才能红冲！');
        return;
      }
      if(selectionRows[i].yhcbz == 'Y') {
        message.info('该数据已发起过红冲，无需重复操作。');
        return;
      }
      
      // 发起红冲的发票，在红冲成功之前，发票状态仍是“开票成功”或“作废失败”， (没做)
      // 若再次发起红冲，阻断提示：该数据已发起过红冲，无需重复操作。
    }

    Promise.all([myUtil.code.getCodeFromServerT1('code_dm_zxsb_hcyy', '01'), myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ', '01')]).then(() => {
    }).catch(() => {
      message.error('获取码表失败');
    }).finally(() => {
      const tempXx = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ', '01');
      // 在线开票 数电票
      const temp = myUtil.code.getCode('code_dm_zxsb_hcyy', '01');
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
            if(tempXx && tempXx[0]?.fpkjfsDm === '2' && tempXx[0].fpzlDm1 === '5') {
              // 数电票和在线开票
              setUnitRef(unitRef);
              DDAlert.close();
              setParamSdp({fpsqduuid: selectionRowKeys[0], hcyy})
              setCheckBtn('hc')
              kpSuccess({fpsqduuid: selectionRowKeys[0], hcyy}, unitRef, '1');
            } else {
              thisObj.setState({ masker: true });
              fphc({ fpsqduuid: selectionRowKeys[0], hcyy }).then((response) => {
                thisObj.setState({ masker: false });
                DDAlert.close();
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
          })
        }
      })
    })
  }

  // 蓝字 更新状态
  zxkpFunc.handleUpdate = (param: any) => {
    const { unitRef } = param;
    setCheckBtn('gx')
    setGxUnitRef(unitRef)
    lzkpSuccess(unitRef, '1');         // 判断电子税务局 是否要登录
  }

  const lzkpSuccess = (ref:any, flag: any) => {
    const unitRef = ref?ref:gxUnitRef;
    unitRef.current?.setMasker(true);
    if(flag === '1') {
      fpztsxZx({}).then((res01:any)=>{
        unitRef.current?.setMasker(false);
        if(res01.code === '200') {
          const rtnCode = res01?.body?.rtnCode;
          const rtnData = res01?.body;
          if(rtnCode === '200') {
            unitRef.current!.reload2();
            message.success(res01?.desc)
          } else if(rtnCode === '2004'){
            const param = {
              data: rtnData?.data,
              sellerid: rtnData?.sellerid,
              lrrqq: rtnData?.lrrqq,
              lrrqz: rtnData?.lrrqz, 
            }
            setParamHzkp(param); // 更新状态入参
            refSfyz.current!.showModal(); // 打开电子税务局身份验证
          } else if(rtnCode === '2005') {
            const param = {
              data: rtnData?.data,
              sellerid: rtnData?.sellerid,
              lrrqq: rtnData?.lrrqq,
              lrrqz: rtnData?.lrrqz, 
            }
            setParamHzkp(param); // 更新状态入参
            refKprz.current!.showModal(); // 打开二维码身份验证
          }
        } else if(res01.code === '900') {
          message.info(res01?.msg)
        } else {
          message.error(res01?.msg)
        }
      })
    } else {
      unitRef.current?.setMasker(true);
      sdpZtsxtb(paramhzkp).then((res02:any)=> {
        unitRef.current?.setMasker(false);
        if(res02.code === '200') {
          const rtnCode = res02?.body?.rtnCode;
          if(rtnCode === '200') {
            // 清空选中并设置按钮可用状态
            unitRef.current!.reload2();
            message.success(res02?.msg)
          } else if(rtnCode === '2004'){
            refSfyz.current!.showModal(); // 打开电子税务局身份验证
          } else if(rtnCode === '2005') {
            refKprz.current!.showModal(); // 打开二维码身份验证
          }
        } else if(res02.code === '900') {
          message.info(res02?.msg)
        } else {
          message.error(res02?.msg)
        }
      })
    }
  }

  // 获取发票配置-开票方式，根据开票方式展示不同列表
  const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ', '01');
  if(temp && temp[0]?.fpkjfsDm == '2') { // 在线开票
    let myConfig = { ...lzfpConfig }; // 默认蓝字发票
    if(bz === 'gzt') {
      myConfig.grid_columns[11] = { title: '发票状态', dataIndex: 'fpkjztDm', width: 150,render: { func: 'renderFpkjglSjzt' },ellipsis: true ,
        filter: {
          type: 'Select',
          codeTable: ['CODE_DM_ZXSB_FPKJZT', '01'],
          value: ["1"]
        },
      };
    } else {
      myConfig.grid_columns[11] = { title: '发票状态', dataIndex: 'fpkjztDm', width: 150,render: { func: 'renderFpkjglSjzt' },ellipsis: true ,
        filter: {
          type: 'Select',
          codeTable: ['CODE_DM_ZXSB_FPKJZT', '01'],
        },
      };
    }
    if (history?.location?.pathname === '/hts/ckfp/hzfp') { // 红字发票
      myConfig = { ...hzfpConfig }; // 红字发票
      if(bz === 'gzt') {
        myConfig.grid_columns[13] = { title: '发票状态', dataIndex: 'fpkjztDm', width: 150, render: { func: 'renderFpkjglSjzt' }, ellipsis: true,
          filter: {
            type: 'Select',
            codeTable: ['CODE_DM_ZXSB_FPKJZT', '02'],
            value: ["1"]
          },
        };
      } else {
        myConfig.grid_columns[13] = { title: '发票状态', dataIndex: 'fpkjztDm', width: 150, render: { func: 'renderFpkjglSjzt' }, ellipsis: true,
          filter: {
            type: 'Select',
            codeTable: ['CODE_DM_ZXSB_FPKJZT', '02'],
          },
        };
      }
    } else if (history?.location?.pathname === '/hts/ckfp/zffp') { // 作废发票
      myConfig = { ...zffpConfig }; // 作废发票
      // if(bz === 'gzt') {
      //   myConfig.grid_columns[13] = {
      //     title: '发票状态', dataIndex: 'fpkjztDm', width: 150,
      //   };
      // } else {
      //   myConfig.grid_columns[13] = {
      //     title: '发票状态', dataIndex: 'fpkjztDm', width: 150,
      //   };
      // }
    }
    

      // 切换
    const sfyzCloseModel = () => {
      if(refSfyz) {
        refSfyz.current!.closeModal(); // 关闭电子税务局身份验证
      } 
      if(refKprz) {
        refKprz.current!.closeModal(); // 关闭二维码身份验证
      }
      if(checkBtn === 'hc') {
        kpSuccess(paramSdp, hcUnitRef, '2');
      } else {
        lzkpSuccess(gxUnitRef, '2');
      }
    }

    // 二次二维码
    const openSfyzModal = () => {
      refKprz.current!.closeModal(); // 关闭二维码身份验证
      refSfyz.current!.showModal(); // 打开电子税务局身份验证
    }

    return  <Spin tip="Loading..." spinning={masker} delay={100}>
        <DDBunit2 config={myConfig} func={zxkpFunc} />;
        <SfyzModal onRef={refSfyz} handleColseModal={sfyzCloseModel} />
        <KprzModal onRef={refKprz} handleOtherModal={openSfyzModal} handleColseModal={sfyzCloseModel}/>
    </Spin>
  } else if (temp && temp[0]?.fpkjfsDm == '1') { // 导出开票
    const myConfigDckp = {...dckpConfig}
    if(temp && temp[0].fpzlDm1 == '5') {
      myConfigDckp.costomer_toobar = [
        { name: '下载开票文件', func: 'handleDownLoadKpwj' },
        { name: '发票开具文件回填', func: 'handleFpkjht' },
        { name: '取消开票', func: 'handleThzwkpzt' },
        {
          name: '发票红冲', type: 'dropdown', list: [
            { name: '设置红冲标志', func: 'handleSzhcbz' },
            { name: '取消红冲标志', func: 'handleQxhcbz' },
          ]
        },
        {
          name: '发票作废', type: 'dropdown', list: [
            { name: '设置作废标志', func: 'handleSzzfbz' },
            { name: '取消作废标志', func: 'handleQxzfbz' },
          ]
        },
        { name: '导出开票结果', func: 'exportKpjg' },
      ];
    }
    if(bz === 'gzt') {
      myConfigDckp.grid_columns[15] = { title: '数据状态', dataIndex: 'fpzt', width: 120, render: { func: 'renderFpkjglSjzt', }, fixed: 'right', filter: {
          type: 'Select',
          list: [
            { text: '待开票', value: 'DKP' },
            { text: '已下载', value: 'YDC' },
            { text: '已开票', value: 'YKP' },
            { text: '作废', value: 'ZF' },
            { text: '红冲', value: 'HC' },
          ],
          value: ['DKP', 'YDC']
        } 
      };
    } else {
      myConfigDckp.grid_columns[15] = { title: '数据状态', dataIndex: 'fpzt', width: 120, render: { func: 'renderFpkjglSjzt', }, fixed: 'right', filter: {
          type: 'Select',
          list: [
            { text: '待开票', value: 'DKP' },
            { text: '已下载', value: 'YDC' },
            { text: '已开票', value: 'YKP' },
            { text: '作废', value: 'ZF' },
            { text: '红冲', value: 'HC' },
          ],
        } 
      };
    }
    return <DDBunit2 config={myConfigDckp} func={dckpFunc} />;
  } else {
    history.push('/hts/pzgl/fppzgl');
    message.error('请配置开票方式');
    return <></>;
  }
};

export default Fpkjgl;