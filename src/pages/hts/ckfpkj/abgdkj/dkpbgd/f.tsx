import cktsUtil from '@/pages/hts/cktsUtil';
import React from 'react';
import { history } from 'umi';
import { message, Form, Radio, List, Space, DatePicker, Switch, Upload, Button, Tooltip } from 'antd';
import DDAlert from '@/pages/hts/components/DDAlert';
import { intl as intl2 } from '@/components/DDAssist/util';
import myUtil from '@/components/DDAssist/util';
import CONSTANTS from '@/components/DDAssist/constants';
import importStyle from './style.less';

import { baseDelete, tbbgdsjcl, queryParams, ssflbmcx, gmfxxcx, hlxxcx, zbkpztsz, tjkpxx, kbjkpbgdcx, xbgdkhxx, getCode, importTemplate, kptzdr } from '@/pages/hts/services/htsApi';
import { ClockCircleOutlined, InboxOutlined, WarningOutlined, StopOutlined, CheckOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

const abgdkjFunc: any = {
  refUnit: React.createRef(),
};

// 编辑开票btnBjkp
abgdkjFunc.btnBjkp = (param: any) => {
  const { selectionRows, otherRef, refUnit } = param;
  if (history?.location?.pathname === '/hts/ckfpkj/abgdkj21') {
    message.info(intl2.formatMessage({ id: 'message_ckfp_abgdkj_bjkp_18bgd' }));
    return;
  }
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  } else {
    const tempRows = selectionRows.filter((row: any) => {
      return (row.ckfpkjsjztDm != "1" || row.zbkpbz === 'Y');
    })
    if (tempRows.length != 0) {
      const tempMessage = cktsUtil.text.formatRepalce(intl2.formatMessage({ id: 'message_ckfp_abgdkj_bjkp_scfpscd' }), { gnmc: '编辑开票' })
      message.info(tempMessage);
      return;
    }
    refUnit.current!.setMasker(true);
    kbjkpbgdcx(getParam(selectionRows)).then((response: any) => {
      refUnit.current!.setMasker(false);
      const { code, body, desc } = response;
      if (code === '200') {
        otherRef[4].current!.showModal({ data: body, ref: refUnit });
      } else {
        message.error(desc)
      }
    })

  }
};

//获取报关单
abgdkjFunc.abgdkjHqbgd = (param: any) => {
  const { refUnit, access ,otherRef} = param;
  let sbrqFlag = true;
  // 顺络电子不显示按申报日期获取
  if (access?.isNsrsbh){
    sbrqFlag = false;
  }
  otherRef[5].current!.showModal(sbrqFlag,refUnit,access);

  // DDAlert.open({
  //   title: '获取报关单',
  //   infoType: 'warning',
  //   modalType: 'form',
  //   isFormContent: true,
  //   closeStatus: false,
  //   initFormContentValues: { tblx: '1' },
  //   content: <>
  //     <Form.Item name="tblx" wrapperCol={{ offset: 5, span: 14 }} rules={[{ required: true, message: '请选择获取方式' }]}>
  //       <Radio.Group onChange={onChangeHqbgd}>
  //         <Space direction="vertical">
  //           <Radio value='1'>根据出口日期获取</Radio>
  //           <Form.Item name="ckrq" wrapperCol={{ offset: 0, span: 14 }}>
  //             <DatePicker.RangePicker locale={locale} format={myUtil.date.formatList()} />
  //           </Form.Item>
  //           <Radio style= {{display : sbrqFlag ? 'block':'none'}} value='3'>根据申报日期获取</Radio>
  //           <Form.Item name="hgckhwbgdsbrq" style = {{display : sbrqFlag ? 'block':'none'}} wrapperCol={{ offset: 0, span: 14 }}>
  //             <DatePicker.RangePicker locale={locale} format={myUtil.date.formatList()} />
  //           </Form.Item>
  //           <Radio value='4'>根据下载日期获取</Radio>
  //           <Form.Item name="ckbgdxzrq" wrapperCol={{ offset: 0, span: 14 }}>
  //             <DatePicker.RangePicker locale={locale} format={myUtil.date.formatList()} />
  //           </Form.Item>
  //           <Radio value='2'>根据报关单号获取</Radio>
  //           <Form.Item name="ckbgd" wrapperCol={{ offset: 0, span: 14 }}>
  //             <Input />
  //           </Form.Item>
  //         </Space>
  //       </Radio.Group>
  //     </Form.Item>
  //   </>,
  //   okCallbackFn: function (thisObj: any) {
  //     DDAlert.getForms().validateFields().then((values: any) => {
  //       const tblx = values.tblx;
  //       let param: any = { tblx: tblx };
  //       if (tblx === '1') {
  //         if (values.ckrq && values.ckrq.length > 0) {
  //           param.ckrq1Q = new Date(values.ckrq[0].format('YYYY/MM/DD')).getTime();
  //           param.ckrq1Z = myUtil.date.accurateDate(values.ckrq[1].format('YYYY/MM/DD'), '2');
  //         } else {
  //           message.info(intl2.formatMessage({ id: 'message_ckfp_abgdkj_hqbgd_check1' }));
  //           return;
  //         }
  //       } else if (tblx === '3') {
  //         if (values.hgckhwbgdsbrq && values.hgckhwbgdsbrq.length > 0) {
  //           param.hgckhwbgdsbrqQ = new Date(values.hgckhwbgdsbrq[0].format('YYYY/MM/DD')).getTime();
  //           param.hgckhwbgdsbrqZ = myUtil.date.accurateDate(values.hgckhwbgdsbrq[1].format('YYYY/MM/DD'), '2');
  //         } else {
  //           message.info(intl2.formatMessage({ id: 'message_ckfp_abgdkj_hgckhwbgdsbrq_check1' }));
  //           return;
  //         }
  //       } else if (tblx === '2') {
  //         if (values.ckbgd) {
  //           param.bgdhgbh = values.ckbgd;
  //         } else {
  //           message.info(intl2.formatMessage({ id: 'message_ckfp_abgdkj_hqbgd_check2' }));
  //           return;
  //         }
  //       } else if (tblx === '4') {
  //         if (values.ckbgdxzrq && values.ckbgdxzrq.length > 0) {
  //           param.ckbgdxzrqQ = new Date(values.ckbgdxzrq[0].format('YYYY/MM/DD')).getTime();
  //           param.ckbgdxzrqZ = myUtil.date.accurateDate(values.ckbgdxzrq[1].format('YYYY/MM/DD'), '2');
  //         } else {
  //           message.info(intl2.formatMessage({ id: 'message_ckfp_abgdkj_ckbgdxzrq_check1' }));
  //           return;
  //         }

  //       }
  //       thisObj.setState({ masker: true });
  //       tbbgdsjtj(param).then((response: any) => {
  //         DDAlert.close();
  //         const { code, body, desc ,msg} = response;
  //         if (code === '200') {
  //           openAckrqhq(body, param, refUnit, access);
  //         } else {
  //           if (code === '300' && body.gdykpbz === 'Y') {
  //             message.info(intl2.formatMessage({ id: 'message_ckfp_abgdkj_hqbgd_error' }));
  //           } else {
  //             message.error(msg)
  //           }
  //         }
  //       })
  //     });
  //   },
  // });
}

// 待开票台账导入
abgdkjFunc.dkptzdr = async (param: any) => {
  const { refUnit } = param;
  const beforeUpload = (file: any) => {
    const isLt2M = file.size;
    if (isLt2M > 10485760) {
      message.info('上传文件不能超过10M。');
      return Upload.LIST_IGNORE;
    }
    if (!file.name.toUpperCase().endsWith(".XLS") && !file.name.toUpperCase().endsWith(".XLSX")) {
      message.info('请上传Excel文件。');
      return Upload.LIST_IGNORE;
    }
    return false;
  }
  DDAlert.open({
    title: '待开票台账导入',
    infoType: 'warning',
    modalType: 'form',
    closeStatus: false,
    isFormContent: true,
    button: [
      <Button key={'excelmbxz'} onClick={() => abgdkjFunc.downloadExcel('CKFPKJ_CKBGD_TZSX_PRINT_REPORT')}>Excel模板下载</Button>,
    ],
    width: 720,
    content: <>
      <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} label="导入Excel文件" name="file" valuePropName="fileList" rules={[{ required: true, message: '请选择上传的文件' }]} getValueFromEvent={(e: any) => { if (Array.isArray(e)) { return e; } return e && e.fileList; }}>
        <Dragger
          maxCount={1}
          showUploadList={true}
          beforeUpload={beforeUpload}
          itemRender={(originNode, file, currFileList, actions: { download: any, preview: any, remove: any }) => (
            <table className={importStyle.importTable}>
              <tr>
                <th>文件名</th>
                <th>文件大小</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
              <tr>
                <td width='45%' className={importStyle.textCenter}>
                  <Tooltip title={file.name}>
                    <div className={importStyle.textName}>{file.name}</div>
                  </Tooltip>
                </td>
                <td width="20%" className={importStyle.textCenter}>{myUtil.text.formatNum(file.size ? (file.size / 1024) : 0, '0,0')}KB</td>
                <td width="18%" className={importStyle.textCenter}><ClockCircleOutlined />&nbsp;待上传</td>
                <td width="17%" className={importStyle.textCenter}><a onClick={() => actions.remove()}>删除</a></td>
              </tr>
            </table>
          )}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或将文件拖拽到此区域</p>
        </Dragger>

      </Form.Item>
      <div style={{ color: "#E51C23" }}>
        <p>导入说明：</p>
        <div style={{ marginLeft: '7px' }}>请上传报关单台账Excel，文件中“报关单号”应为18位；</div>
      </div>
    </>,
    okCallbackFn: function (thisObj: any) {
      DDAlert.getForms().validateFields().then((values: any) => {
        if (values.file[0].originFileObj) {
          thisObj.setState({ masker: true });
          DDAlert.close();
          const formData = new FormData();
          formData.append('file', values.file[0].originFileObj);
          formData.append('fileName', values.file[0].name);
          formData.append('cdDm', '1203');
          kptzdr(formData).then((response: any) => {
            const { code, msg, body } = response;
            thisObj.setState({ masker: false });
            if (code === '200') {
              // 台账数据筛选 赋值
              refUnit.current?.addQueryModel("Y", 'tzsxbz');
              if (body?.sbzs != 0) {
                // 业务校验
                const sbyyList = body?.sbmx || [];
                const textAreaValues: any = []
                if (sbyyList.length > 0) {
                  sbyyList.forEach((item: any, index: any) => {
                    textAreaValues.push(
                      <tr>
                        <td width='10%' style={{ textAlign: 'center' }}>{index + 1}</td>
                        <td width='30%'>{item.bgdhgbh}</td>
                        <td width='60%'>
                          <Tooltip title={item.sbyy}>
                            <div className={importStyle.errorTableText}>{item.sbyy}</div>
                          </Tooltip>
                        </td>
                      </tr>
                    )
                  })
                  DDAlert.open({
                    title: '待开票台账导入',
                    modalType: 'form',
                    width: 720,
                    closeStatus: false,
                    isFormContent: true,
                    content:
                      <>
                        <div style={{ marginTop: '10px' }}>本次导入台账中共{body?.drzs}张报关单，导入成功{body?.cgzs}张，导入失败{body?.sbzs}张。</div>
                        <table className={importStyle.errorTable}>
                          <tr style={{ backgroundColor: '#FAFAFA' }}>
                            <th>序号</th>
                            <th>失败报关单号</th>
                            <th>失败原因</th>
                          </tr>
                          {textAreaValues}
                        </table>
                      </>,
                    okCallbackFn: function () {
                      DDAlert.close();
                    },
                  });
                }
              } else {
                message.success(`本次导入台账中共${body?.drzs}张报关单，导入成功${body?.cgzs}张！`);
              }
            } else {
              message.error(msg);
            }
          }).catch(() => {
            message.error('导入失败，请重新上传文件。');
          }).finally(() => {
            thisObj.setState({ masker: false });
          });
        } else {
          message.info('文件传输失败，请重试！')
        }
      });
    },
  });
}

// 下载excel模板
abgdkjFunc.downloadExcel = (param: string) => {
  importTemplate({ sfBhsj: "N", sfScsm: "N", key: param }).then((response) => {
    if (response.code === '200') {
      const { blob, fileName } = response.body;
      myUtil.file.downloadExcel(blob, fileName);
    } else {
      message.error(response.desc);
    }
  })
}
// 获取报关单弹窗点击单选后根据单选赋值
const onChangeHqbgd = (e: any) => {
  if (e.target.value === '2') {
    DDAlert.getForms().setFieldsValue({ ckrq: [], hgckhwbgdsbrq: [], ckbgdxzrq: [] });
  } else if (e.target.value === '3') {
    DDAlert.getForms().setFieldsValue({ ckrq: [], ckbgd: '', ckbgdxzrq: []  });
  } else if (e.target.value === '1') {
    DDAlert.getForms().setFieldsValue({ ckbgd: '', hgckhwbgdsbrq: [], ckbgdxzrq: [] });
  } else if (e.target.value === '4') {
    DDAlert.getForms().setFieldsValue({ ckrq: [], ckbgd: '', hgckhwbgdsbrq: [] });
  }
}

// 弹出统计条数，点击确定后调用接口处理数据
const openAckrqhq = (param: any, param1: any, refUnit: any, access: any) => {
  const tmpMessage = intl2.formatMessage({ id: access.isNsrsbh ? 'message_ckfp_abgdkj_hqbgd_ackrq_sl_success' : 'message_ckfp_abgdkj_hqbgd_ackrq_success' });
  const infoMessage = cktsUtil.text.formatRepalce(tmpMessage, param)
  DDAlert.open({
    title: intl2.formatMessage({ id: 'message_ckfp_abgdkj_hqbgd_ackrq_title' }),
    info: infoMessage,
    infoType: 'warning',
    modalType: 'confirm',
    okText: '确定',
    closeStatus: false,
    isFormContent: false,
    okCallbackFn: function (thisObj: any) {
      thisObj.setState({ masker: true });
      // 获取数据对应的数据处理
      tbbgdsjcl(param1).then((response: any) => {
        const { code, desc } = response;
        if (code === '200') {
          queryParams({ key: 'GFCX_CS_ZXSB_FPKJ_KHGLPZ', searchModel: [{ property: 'qybz', value: 'Y', op: 'rl' }], }).then((response) => {
            const { code, body } = response;
            DDAlert.close();
            if (code === '200') {
              const temp: any = [];
              body.forEach((item: any) => {
                temp.push(Object.assign(item, { code: item.khuuid, name: item.ghfnsrmc }));
              })
              myUtil.code.saveCodeToLocalTable('CODE_CKFP_ABGDKJ_GMFMC',temp,'01');
              refUnit.current?.reload();
              message.success(intl2.formatMessage({ id: 'message_ckfp_abgdkj_hqbgd_success' }));
            }
          });
        } else {
          DDAlert.close();
          message.error(desc)
        }
      })
    },
    content: '',
  });
}
// 生产发票申请单
abgdkjFunc.btnScfpspd = (param: any) => {
  Promise.all([myUtil.code.getCodeFromServerT1('CODE_CS_ZXSB_FPKJ_CSPZ:01')]).then(() => {
  }).catch(() => {
    message.error('获取码表失败');
  }).finally(async () => {
    const { selectionRows, otherRef, refUnit, access, unit_key, gridRef } = param;
    const bgdhs: any = [];
    if (selectionRows && selectionRows.length > 0) {
      const tempRows = selectionRows.filter((row: any) => {
        return (row.ckfpkjsjztDm != "1" || row.zbkpbz === 'Y');
      })
      if (tempRows.length != 0) {
        const tempMessage = intl2.formatMessage({ id: 'message_ckfp_abgdkj_bjkp_scfpscd_info' });
        message.info(tempMessage);
        return;
      }

      // 18位报关单取报关单号/统一编号,21位时取隐藏列 21报关单号
      selectionRows.forEach((row: any) => { // 18位时有报关单号取报关单号，没有取统一编号
        bgdhs.push(row.bgdhgbh);
      });
      // const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ:01');
      // if(temp && temp[0].fpzlDm1 === '5'){
      //   var qdfpissckpResp = await qdfpissckp({bgdhs:bgdhs});
      //   if(qdfpissckpResp && qdfpissckpResp.code === '900'){
      //     refUnit.current!.setMasker(false);
      //     const tempMessage = intl2.formatMessage({ id: 'message_ckfp_abgdkj_bjkp_qdfpissckp' });
      //     message.info(tempMessage);
      //     return;
      //   }
      // }
    }
    const gridData = refUnit.current?.getGridData();
    const searchModel = refUnit.current?.getGridParams().searchModel || [];
    const headerSearchModel = param.refGrid.current?.getHeaderFilter() || [];
    const allSearchModel: any = searchModel.concat(headerSearchModel);
    if(gridData.length === 0) {
      message.info(intl2.formatMessage({ id: 'message_common_type_no_griddata' }));
      return;
    }
    const params:any = getParam(selectionRows, access);
    params.key = unit_key;
    params.cxtj = allSearchModel;
    refUnit?.current?.setMasker(true);
    tjkpxx(params).then((response) => {
      const { code, body, msg } = response;
      refUnit?.current?.setMasker(false);
      if (code === '200') {
        otherRef[3]?.current?.showModal(selectionRows, body, refUnit, params);
      } else {
        message.error(msg);
      }
    });
  })
};

// 批量设置中方法使用的组装参数方法
function getParam(selectionRows: any, access?: any) {
  let bgdlx = '1';
  if (history?.location?.pathname === '/hts/ckfpkj/abgdkj21') {
    bgdlx = '2';
  }
  // 顺络
  if (access?.isNsrsbh) {
    bgdlx = '2'
  }
  const bgdhs: any = [];
  if(selectionRows && selectionRows.length > 0) {
    // 18位报关单取报关单号/统一编号,21位时取隐藏列 21报关单号
    selectionRows.forEach((row: any) => { // 18位时有报关单号取报关单号，没有取统一编号
      bgdhs.push(bgdlx === '1' ? (row.bgdhgbh || row.bgdtybh) : row.ckbgdh);
    });
  }
  return { bgdlx, bgdhs }
}

// 设置税收分类编码
abgdkjFunc.btnSetSsflbm = (param: any) => {
  const { selectionRows, otherRef, refUnit, gridRef, unit_key } = param;
  const gridData = refUnit.current?.getGridData()
  if(gridData && gridData.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_common_type_no_griddata' }));
    return;
  }
  if(selectionRows.length == 0){
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  // if(selectionRows.length >50){
  //   message.info('每次勾选50条记录！'); 
  //   return;
  // }
  const tempParam:any = getParam(selectionRows);
  const searchModel = refUnit.current?.getGridParams().searchModel || [];
  const headerSearchModel = param.refGrid.current?.getHeaderFilter() || [];
  const allSearchModel: any = searchModel.concat(headerSearchModel);
  tempParam.key = unit_key;
  tempParam.cxtj = allSearchModel;
  myUtil.sessionStore.setItem('tmp_ckfp_setssflbm');
  myUtil.sessionStore.setItem('tmp_ckfp_setssflbm_tableSource');
  refUnit.current!.setMasker(true);
  ssflbmcx(tempParam).then((response: any) => {
    refUnit.current!.setMasker(false);
    const { code, body, desc } = response;
    if (code === '200' && body.length > 0) {
      getCode({codeStoreKey:'CODE_CS_ZXSB_FPKJ_CSPZ',codeViewKey:'01'}).then((resCode:any)=> {
        if(resCode.code === "200") {
          const temp = resCode.body;
          myUtil.code.saveCodeToLocalTable('CODE_CS_ZXSB_FPKJ_CSPZ', resCode.body, '01');
          const szwxtssflbmbz = temp[0]?.szwxtssflbmbz;
          if(szwxtssflbmbz === 'Y') {
            myUtil.sessionStore.setItem('szwxtssflbmbz', true);
          } else {
            myUtil.sessionStore.setItem('szwxtssflbmbz', false);
          }
          if (body.length > 50) {
            otherRef[6].current!.showModal({ data: body, ref: refUnit, ssflTemp: tempParam});
          } else {
            otherRef[0].current!.showModal({ data: body, ref: refUnit, fphwxxxqgzDm: temp[0]?.fphwxxxqgzDm, ssflTemp: tempParam ,temp:temp[0]});
          }
        } else {
          message.error('获取码表失败');
        }
      })
    } else if(code === '300') {
      message.info(intl2.formatMessage({ id: 'message_common_type_no_griddata' }));
    } else if(code === '900') {
      message.info(desc);  
    } else { 
      message.error(desc);
    }
  })
  
};

// 设置购买方
abgdkjFunc.btnSetGmf = (param: any) => {
  const { selectionRows, otherRef, refUnit, gridRef, unit_key } = param;
  const gridData = refUnit.current?.getGridData()
  if(gridData.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_common_type_no_griddata' }));
    return;
  }
  if(selectionRows.length == 0){
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  // if(selectionRows.length >50){
  //   message.info('每次勾选50条记录！'); 
  //   return;
  // }
  const searchModel = refUnit.current?.getGridParams().searchModel || [];
  const headerSearchModel = param.refGrid.current?.getHeaderFilter() || [];
  const allSearchModel: any = searchModel.concat(headerSearchModel);

  refUnit.current!.setMasker(true);
  let tempParam:any = getParam(selectionRows);
  tempParam.key = unit_key;
  tempParam.cxtj = allSearchModel;
  tempParam.bgdwd = 'N';
  gmfxxcx(tempParam).then((response: any) => {
    refUnit.current!.setMasker(false);
    const { code, body, desc } = response;
    if (code === '200' && body?.dataList.length > 0) {
      // Promise.all([myUtil.code.getCodeFromServerT1('CODE_CS_ZXSB_FPKJ_CSPZ:01')]).then(() => {
      // }).catch(() => {
      //   message.error('获取码表失败');
      // }).finally(() => {
      //   const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ:01');
      //   otherRef[1].current!.showModal(body, refUnit, tempParam,{szwxtgmfbz: temp[0]?.szwxtgmfbz});
      // });
      getCode({codeStoreKey:'CODE_CS_ZXSB_FPKJ_CSPZ',codeViewKey:'01'}).then((resCode:any)=> {
        if(resCode.code === '200') {
          const temp = resCode.body;
          myUtil.code.saveCodeToLocalTable('CODE_CS_ZXSB_FPKJ_CSPZ', resCode.body, '01');
          if(temp[0]?.szwxtgmfbz === 'Y') {
            myUtil.sessionStore.setItem('szwxtgmfbz', true);
          } else {
            myUtil.sessionStore.setItem('szwxtgmfbz', false);
          }
          if (body?.dataList.length > 50) {
            otherRef[7].current!.showModal({ref: refUnit, gmfTemp: tempParam});
          } else {
            otherRef[1].current!.showModal(body, refUnit, tempParam,{szwxtgmfbz: temp[0]?.szwxtgmfbz});
          }
        } else {
          message.error('获取码表失败');
        }
      })
    } else if(code === '300') {
      message.info(intl2.formatMessage({ id: 'message_common_type_no_griddata' }));
    } else if(code === '900'){
      message.info(desc);
    } else {
      message.error(desc);
    }
  })
};

// 设置汇率
abgdkjFunc.btnSetHl = (param: any) => {
  const { selectionRows, otherRef, refUnit } = param;
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  } else {
    refUnit.current!.setMasker(true);
    hlxxcx(getParam(selectionRows)).then((response: any) => {
      refUnit.current!.setMasker(false);
      const { code, body, desc } = response;
      if (code === '200') {
        otherRef[2].current!.showModal(body, refUnit);
      } else {
        message.error(desc);
      }
    })
  }
};

// 暂不开票
abgdkjFunc.zbkp = (param: any) => {
  const { selectionRows, refUnit } = param;
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  } else {
    DDAlert.open({
      title: '暂不开票设置',
      infoType: 'warning',
      modalType: 'form',
      closeStatus: false,
      isFormContent: true,
      initFormContentValues: { zbkpbz: 'Y' },
      content: <>
        <Form.Item name="zbkpbz" wrapperCol={{ offset: 5, span: 14 }} >
          <Radio.Group >
            <Radio value="Y">设置暂不开票</Radio>
            <Radio value="N">取消暂不开票</Radio>
          </Radio.Group>
        </Form.Item>
      </>,
      okCallbackFn: function (thisObj: any) {
        DDAlert.getForms().validateFields().then((values: any) => {
          thisObj.setState({ masker: true });
          zbkpztsz(Object.assign(getParam(selectionRows), values)).then((response: any) => {
            DDAlert.close();
            const { code, desc, msg } = response;
            if (code === '200') {
              if (values.zbkpbz === 'Y') {
                message.info(intl2.formatMessage({ id: 'message_ckfp_abgdkj_setzbkp_success' }));
              } else {
                message.info(intl2.formatMessage({ id: 'message_ckfp_abgdkj_cancelzbkp_success' }));
              }
              refUnit.current?.reload();
            } else {
              message.error(desc);
            }
          })
        });
      },
    });
  }
};

// 根据单据号打开详情
abgdkjFunc.openBjkp = (bgdhORtybh: any, param: any) => {
  const { refUnit } = param;
  const otherRef = refUnit.current?.getOtherRefs();
  if (otherRef[4]) {
    otherRef[4].current?.showModal();
  }
};

// 配置项：快捷筛选
abgdkjFunc.handleOnChangeBgd = (param: any) => {
  const ckrq :any = ['','']; 
  const hgckhwbgdsbrq1 :any = ['','']; 
  const searchModel =  param.otherParam.refUnit.current.getGridParams().searchModel;
  const p = {};
  for(let i=0;i< searchModel?.length;i++){
    const property = searchModel[i].property;
    if('bgdhgbh' == property || 'ckhth' == property ||'jgfsDm' == property){
      const values  = searchModel[i].values ?searchModel[i].values:searchModel[i].value;
      p[property] = values;
    }
    if('ckrq1' == property){
      const op = searchModel[i].op;
      const values  = searchModel[i].values ?searchModel[i].values:searchModel[i].value;
      if("dydy" == op){
        ckrq[0] = values;
      }else{
        ckrq[1] = values;
      }
      p.ckrq1 = ckrq;
    }
    if('hgckhwbgdsbrq' == property){ 
      const op = searchModel[i].op;
      const values  = searchModel[i].values ?searchModel[i].values:searchModel[i].value;
      if("dydy" == op){
        hgckhwbgdsbrq1[0] = values;
      }else{
        hgckhwbgdsbrq1[1] = values;
      }
      p.hgckhwbgdsbrq = hgckhwbgdsbrq1;

    }
    
  }
  
  const { value } = param;
  if (value == '2') {
    history.push({ pathname: '/hts/ckfpkj/abgdkj21', query: p } )
  } else {
    history.push({ pathname: '/hts/ckfpkj/abgdkj', query: p } )

  }
};

// 行编辑购买方名称选中对应方法
abgdkjFunc.selectChangeGmfmc = (params: any) => {
  const { record, values, reload, refUnit } = params;
  if (values.khuuid != record.khuuid) {
    const bgdhgbhs: any = [].concat((record.bgdhgbh || record.bgdtybh));
    xbgdkhxx({ bgdhgbhs, khuuid: values.khuuid }).then((response) => {
      const { code, desc } = response;
      if (code === '200') {
        reload();
        message.success(intl2.formatMessage({ id: 'message_ckfp_abgdkj_setgmf_success' }));
      } else {
        message.error(desc);
      }
    });
  }
};

// 删除失败后自定义提示信息
abgdkjFunc.afterDeletionFailure = (params: any) => {
  const { body } = params;
  DDAlert.open({
    title: '删除',
    infoType: 'warning',
    info: '以下18位报关单存在部分开票的情况，无法删除，请选择未开票的报关单进行操作。',
    okText: '确定',
    closeStatus: false,
    isFormContent: false,
    width: CONSTANTS.C_MODAL_WIDTH_X2,
    content: <>
      <List
        size="small"
        split={false}
        locale={{emptyText: '暂无数据'}}
        dataSource={body?.bgdhgbhs}
        renderItem={(item: any) => <List.Item>{item}</List.Item>}
      />
    </>,
    okCallbackFn: function (thisObj: any) {
      DDAlert.close();
    },
  });
};

// 列表自定义渲染
abgdkjFunc.columnsRender = {
  // 数据状态
  renderAbgdkjSjzt: (param: any) => {
    const { text, record } = param;
      let col: any = <></>;
      if (record.zbkpbz === 'Y') {
        col = <span className="dd_grid_icon"><StopOutlined />暂不开票</span>;
      } else if (text === '1') {
        col = <span className="dd_grid_icon"><CheckOutlined />可以开具发票 </span>;
      } else if (text === '2') {
        col = <span className="dd_grid_icon"> <WarningOutlined />缺少购买方信息</span>;
      } else if (text === '3') {
        col = <span className="dd_grid_icon"> <WarningOutlined />缺少税收分类编码</span>;
      } else if (text === '4') {
        col = <span className="dd_grid_icon"><WarningOutlined />缺少购买方信息...</span>;
      }
      return col;
  },
  // 报关单号/统一编号
  renderAgdhgbh: (param: any) => {
    const { record } = param;
    let col: any = <></>;
    if (record.bgdhgbh) {
      col = <span>{record.bgdhgbh}</span>;
    } else if (record.bgdtybh) {
      col = <span>{record.bgdtybh}</span>;
    }
    return col;
  },
}

// 顺络删除
abgdkjFunc.slDelete = (params: any) => {
  const { selectionRows, refUnit, unit_key } = params;
  if (selectionRows?.length <= 0) {
    message.info(intl2.formatMessage({ id: 'message_delete_unselected' }));
    return;
  }
  DDAlert.open({
    title: '系统提示',
    info: intl2.formatMessage({ id: 'message_inquiry_delete' }),
    infoType: 'question',
    modalType: 'confirm',
    closeStatus: false,
    okCallbackFn: function (thisObj: any) {
      thisObj.setState({ masker: true });
      const data: any = {
        key: unit_key || '',
      };
      let bgdhgbhValues: any = [];
      selectionRows.forEach((item: any) => {
        bgdhgbhValues.push(item.bgdhgbh || item.bgdtybh)
      })
      data['bgdhgbhs'] = bgdhgbhValues;
      baseDelete({ data: data, url: `/yw/fpzs/bgdkp/scbgdsj` }).then((response) => {
        DDAlert.close();
        const { code, body, desc } = response;
        if (code === '200') {
          message.success(intl2.formatMessage({ id: 'message_delete_success' }));
          refUnit.current?.reload();
        } else {
          message.success(desc);
          // if (func.afterDeletionFailure) {
          //   func.afterDeletionFailure({
          //     refUnit,
          //     gridRef: refDDBaseGrid,
          //     body
          //   });
          // } else{
          //   message.error(intl.formatMessage({ id: 'message_delete_error' }));
          // }
        }
      })
    },
  });
};

  // EXCEL下载
// abgdkjFunc.downloadExcel =  async (record: any) => {
//   const {unit_key,selectionRowKeys,refUnit} = record;
//    let url = `/hx/ty/report/excelExportGet/${unit_key}_EXCEL/`;
//    let params = {};
//    const searchModel = refUnit.current.getGridParams().searchModel
//    if(selectionRowKeys && selectionRowKeys.length>0){
//     params = {bgdtybhs: selectionRowKeys};
//    }else{
//     params = {searchModel:searchModel};
//    }
//    refUnit.current!.setMasker(true);
//    await cktsUtil.downloadFileCkts(url, params);
//    refUnit.current!.setMasker(false);
//   };

// 表单事件：OnChange
abgdkjFunc.eventOnChange = {
  // 行编辑购买方名称选中对应方法
  selectChangeGmfmc:(params: any) => {
    abgdkjFunc.selectChangeGmfmc(params);
  },
}

export default abgdkjFunc;
