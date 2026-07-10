import { Upload, message, Form, Radio, Button, Tooltip, Space } from 'antd';
import DDAlert from '@/pages/hts/components/DDAlert';
import { xsfpzcx, fpsqdmxcx, fpsqdqrkp, queryDjbh, drmbkjSc, fpsqdsjdr, importTemplate, qrkpjy, kpddxz, ddtjkp, commonDrwtdc, skxxcx } from '@/pages/hts/services/htsApi';
import { ClockCircleOutlined, InboxOutlined, WarningOutlined } from '@ant-design/icons';
import myUtil, { intl as intl2 } from '@/components/DDAssist/util';
import React from 'react';
import { history } from 'umi';
import './style.less';
import importStyle from './importStyle.less';

const { Dragger } = Upload;

const drmbkjFunc: any = {
  // 加载时蒙板使用
  refUnit: React.createRef(),
};

const beforeUpload = (file: any) => {
  if (!file.name.toUpperCase().endsWith(".XLS") && !file.name.toUpperCase().endsWith(".XLSX")) {
    message.info('上传文件必须是Excel文件。');
    return Upload.LIST_IGNORE;
  } else {
    return false;
  }
}

// 导入Excel模板
drmbkjFunc.excelImport = (param: any) => {
  const { refUnit, otherRef } = param;
  DDAlert.open({
    title: '导入Excel文件',
    infoType: 'warning',
    modalType: 'form',
    closeStatus: false,
    isFormContent: true,
    width: 720,
    initFormContentValues: { drgz: 1 },
    button: [
      <Button key={'excelmbxz'} onClick={() => drmbkjFunc.downloadExcel('CKFP_FPKJ_DRMBKJ_EXCEL')}>Excel模板下载</Button>,
    ],
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
      <Form.Item name="drgz" wrapperCol={{ offset: 8, span: 16 }} rules={[{ required: true, message: '请选择导入规则' }]}>
        <Radio.Group >
          <Radio key={'1'} value={1}>追加</Radio>
          <Radio key={'2'} value={2}>清空原有数据</Radio>
        </Radio.Group>
      </Form.Item>
    </>,
    okCallbackFn: function (thisObj: any) {
      DDAlert.getForms().validateFields().then((values: any) => {
        thisObj.setState({ masker: true });
        const formData = new FormData();
        formData.append('drgz', values.drgz);
        formData.append('file', values.file[0].originFileObj);
        fpsqdsjdr(formData).then((response) => {
          const { code, body, desc } = response;
          DDAlert.close();
          if (code === '200') {
            message.success(desc);
            refUnit.current!.reload();
          } else if (code === '900') {
            otherRef[0].current!.showModal(body, 'ZXSB_SB_DRMBKJ');
          } else {
            message.error(desc);
          }
        }).catch(() => {
          message.error('导入失败，请重新上传文件。');
        }).finally(() => {
          thisObj.setState({ masker: false });
        });
      });
    },
  });
}


// 下载excel模板
drmbkjFunc.downloadExcel = (param: string) => {
  importTemplate({ key: param }).then((response) => {
    if (response.code === '200') {
      const { blob, fileName } = response.body;
      myUtil.file.downloadExcel(blob, fileName);
    } else {
      message.error(response.desc);
    }
  })
}

// 确认开票数据
drmbkjFunc.qrdrsj = (param: any) => {
  const { selectionRowKeys, refUnit, selectionRows, unit_key, gridRef } = param;
  // 在线开票新增必勾选。最多5条
  Promise.all([myUtil.code.getCodeFromServerT1('CODE_CS_ZXSB_FPKJ_CSPZ:01')]).then(() => {
  }).catch(() => {
    message.error('获取码表失败');
    return;
  }).finally(() => {
    const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ:01');
    if (temp[0].fpkjfsDm === '2' && selectionRowKeys.length == 0) {
      message.info("开票方式为“在线开票”必须勾选数据进行操作！");
      return;
    }
    if (temp[0].fpkjfsDm === '2' && selectionRowKeys.length > 5) {
      message.info("开票方式为“在线开票”最多勾选5条数据！");
      return;
    }
    let infos = '确定对当前筛选条件下的数据进行确认开票的操作吗？';
    if (selectionRowKeys.length > 0) {
      infos = '确定对勾选数据进行确认开票的操作吗？';
    }
    const zbuuids: any = [];
    const djbhs: any = [];
    if (selectionRowKeys && selectionRowKeys.length > 0) {
      selectionRows.forEach((row: any) => {
        zbuuids.push(row.zbuuid);
        djbhs.push(row.djbh);
      });
    }
    const gridData = refUnit.current?.getGridData()
    const searchModel = refUnit.current?.getGridParams().searchModel || [];
    const headerSearchModel = gridRef.current?.getHeaderFilter() || [];
    const allSearchModel: any = searchModel.concat(headerSearchModel);
    if (gridData.length === 0) {
      message.info(intl2.formatMessage({ id: 'message_common_type_no_griddata' }));
      return;
    }
    const obj = {
      zbuuids,
      djbhs,
      key: unit_key,
      cxtj: allSearchModel,
      flag: '02'
    }
    if (temp[0].fpkjfsDm === '2') {
      // 在线开票
      DDAlert.open({
        title: '确认开票',
        info: `${infos}`,
        modalType: 'confirm',
        infoType: 'warning',
        isFormContent: false,
        okCallbackFn: function (thisObj: any) {
          DDAlert.close();
          refUnit.current!.setMasker(true);
          qrkpjy(obj).then((res: any) => {
            refUnit.current!.setMasker(false);
            const { code, desc, msg } = res;
            if (code === '200') {
              if (temp[0].fpzlDm1 === '5') {
                refUnit.current!.setMasker(true);
                skxxcx().then((res1: any) => {
                  refUnit.current!.setMasker(false);
                  if (res1.code === '200') {
                    refUnit.current!.reload();
                    const zcbz = res1.body.zcbz;
                    if (zcbz === '2') {
                      // 查询是否完成注册 若未成功 尚未注册页
                      const kpParams = {
                        cxtj: allSearchModel,
                        djbhs,
                        zbuuids,
                        qbxzbz: zbuuids.length > 0 ? 'N' : 'Y'
                      };
                      const chFlag = {
                        refUnit,
                        kpParams
                      }
                      drmbkjFunc.qrkpModal(chFlag);
                    } else {
                      message.info('数电票在线开票注册审核中，请明天再试。')
                    }
                  } else {
                    message.error(res1.desc);
                  }
                })
              } else {
                // 开票订单新增
                refUnit.current!.setMasker(true);
                kpddxz(obj).then((response: any) => {
                  refUnit.current!.setMasker(false);
                  const { code, body, desc, msg } = response;
                  if (code === '200') {
                    // 确认开票
                    refUnit.current!.setMasker(true);
                    ddtjkp(obj).then((resddtjkp: any) => {
                      refUnit.current!.setMasker(false);
                      const { code, desc } = resddtjkp;
                      if (code === '200') {
                        // 将数据转到“发票管理”界面
                        refUnit.current!.setMasker(true);
                        fpsqdqrkp(obj).then((responseKp) => {
                          refUnit.current!.setMasker(false);
                          const { code, body, desc } = responseKp;
                          if (code === '200') {
                            refUnit.current!.reload();
                            DDAlert.open({
                              title: '确认开票数据',
                              info: '成功确认开票数据',
                              modalType: 'confirm',
                              okText: '跳转',
                              content: [
                                '发票单据号' + body.qrkpZsms + '张',
                                '金额总计' + myUtil.text.formatNum(body.hjjems, '0,0.00') + '元'
                              ],
                              okCallbackFn: function () {
                                history.push('/hts/ckfp/fpkjgl');
                              }
                            });
                          } else if (code === '300') {
                            refUnit.current!.setMasker(false);
                            message.info(intl2.formatMessage({ id: 'message_common_type_no_griddata' }));
                          } else if (code === '900') {
                            refUnit.current!.setMasker(false);
                            message.info(desc);
                          } else {
                            refUnit.current!.setMasker(false);
                            message.error(desc);
                            return;
                          }
                        })
                      } else if (code === '900') {
                        refUnit.current!.reload();
                        if (Array.isArray(resddtjkp?.msg)) {
                          openYwjyModal(resddtjkp?.msg, '', false);
                        } else {
                          message.info(resddtjkp?.desc);
                        }
                      } else {
                        message.error(Array.isArray(desc) ? desc[0].msg : desc)
                      }
                    })
                  } else if (code === '900') {
                    refUnit.current!.setMasker(false);
                    refUnit.current!.reload();
                    const sbyyList = msg;
                    const textAreaValues: any = []
                    sbyyList.forEach((item: any, index: any) => {
                      textAreaValues.push(
                        <tr>
                          <td width='20%' className='fpsqd_qrkp_textCenter'>{index + 1}</td>
                          <td width='35%' className='fpsqd_qrkp_textCenter'>{item.djbh}</td>
                          <td width='45%' className='fpsqd_qrkp_textCenter'>
                            <Tooltip title={item.msg}>
                              <div className='fpsqd_qrkp_textName'>{item.msg}</div>
                            </Tooltip>
                          </td>
                        </tr>
                      )
                    })
                    // 导出
                    const handleDownload = (id: any) => {
                      const params = { key: id };
                      refUnit.current!.setMasker(true);
                      commonDrwtdc(params).then((response) => {
                        refUnit.current!.setMasker(false);
                        if (response.code === '200') {
                          const { blob, fileName } = response.body;
                          myUtil.file.downloadExcel(blob, fileName);
                        } else {
                          message.error(response.desc);
                        }
                      });
                    }
                    DDAlert.open({
                      title: '确认开票',
                      infoType: 'warning',
                      modalType: 'info',
                      info: '以下单据号无法确认开票，请调整数据后重新操作。',
                      width: '600px',
                      button: [
                        <Button key={"dc"} onClick={() => handleDownload('DC_HX_DC_DRWTDC')}>导出</Button>,
                      ],
                      content:
                        <table className="fpsqd_qrkp_kpsb">
                          <tr style={{ backgroundColor: '#FAFAFA' }}>
                            <th>序号</th>
                            <th>单据号</th>
                            <th>失败原因</th>
                          </tr>
                          {textAreaValues}
                        </table>,
                      okCallbackFn: function () {
                        DDAlert.close();
                      },
                    });
                  } else {
                    refUnit.current!.setMasker(false);
                    message.error(desc)
                  }
                })
              }
            } else if (code === '900') {
              refUnit.current!.setMasker(false);
              const cwxx = msg?.jyxx?.cwxx;
              const dm = msg?.jyxx?.dm;
              DDAlert.open({
                title: '确认开票',
                info: cwxx,
                infoType: 'warning',
                modalType: 'confirm',
                okText: '去配置',
                content: [],
                okCallbackFn: function () {
                  if (dm === '01') {
                    history.push({ pathname: '/hts/pzgl/fppzgl', query: { xh: '1' } });
                  } else if (dm === '02') {
                    history.push({ pathname: '/hts/pzgl/fppzgl', query: { xh: '3' } });
                  } else if (dm === '03') {
                    history.push({ pathname: '/hts/pzgl/fppzgl', query: { xh: '4' } });
                  }
                }
              });
            } else {
              refUnit.current!.setMasker(false);
              message.error(desc);
            }
          })
        }
      })
    } else {
      DDAlert.open({
        title: '确认开票',
        info: `${infos}`,
        modalType: 'confirm',
        infoType: 'warning',
        isFormContent: false,
        okCallbackFn: function (thisObj: any) {
          thisObj.setState({ masker: true });
          fpsqdqrkp(obj).then((response) => {
            const { code, body, desc } = response;
            if (code === '200') {
              DDAlert.close();
              refUnit.current!.reload();
              DDAlert.open({
                title: '确认开票数据',
                info: '成功确认开票数据',
                modalType: 'confirm',
                okText: '跳转',
                content: [
                  '发票单据号' + body.qrkpZsms + '张',
                  '金额总计' + myUtil.text.formatNum(body.hjjems, '0,0.00') + '元'
                ],
                okCallbackFn: function () {
                  history.push('/hts/ckfp/fpkjgl');
                }
              });
            } else if (code === '300') {
              message.info(intl2.formatMessage({ id: 'message_common_type_no_griddata' }));
            } else if (code === '900') {
              message.info(desc);
            } else {
              message.error(desc);
              return;
            }
          })
        }
      });
    }
  });
}


// 业务校验900
const openYwjyModal = (data: any, ts: any, isDc: any) => {
  const textAreaValues: any = []
  data.forEach((item: any, index: any) => {
    textAreaValues.push(
      <tr>
        <td width='20%' className='fpsqd_qrkp_textCenter'>{index + 1}</td>
        <td width='35%' className='fpsqd_qrkp_textCenter'>{item.djbh}</td>
        <td width='45%' className='fpsqd_qrkp_textCenter'>
          <Tooltip title={item?.msg ? item?.msg : item?.sbyy}>
            <div className='fpsqd_qrkp_textName'>{item?.msg ? item?.msg : item?.sbyy}</div>
          </Tooltip>
        </td>
      </tr>
    )
  })
  const infoText = ts ? `已成功${ts}条数据，以下单据号无法确认开票，请调整数据后重新操作。` : '以下单据号无法确认开票，请调整数据后重新操作。'
  const btnArry: any = [];
  if (isDc) {
    btnArry.push(<Button key={"dc"} onClick={() => handleDownload('DC_HX_DC_DRWTDC')}>导出</Button>)
  }
  DDAlert.open({
    title: '确认开票',
    infoType: 'warning',
    modalType: 'info',
    info: infoText,
    width: '600px',
    button: isDc,
    content:
      <table className="fpsqd_qrkp_kpsb">
        <tr style={{ backgroundColor: '#FAFAFA' }}>
          <th>序号</th>
          <th>单据号</th>
          <th>失败原因</th>
        </tr>
        {textAreaValues}
      </table>,
    okCallbackFn: function () {
      DDAlert.close();
    },
  });
}


// 手动采集开具
drmbkjFunc.sdcjkj = (param: any) => {
  const { otherRef, refUnit } = param;
  refUnit.current!.setMasker(true);
  xsfpzcx({}).then((response) => {
    const { code, body } = response;
    if (code === '200') {
      const temp = { xhfnsrmc: body.xsfNsrmc, xhfnsrsbh: body.shxydm, xhfdzdh: body.dz + body.dhhm, skr: body.skr, fhrxm: body.fhr1, kpr: body.kpr }
      // 账户信息配置
      const zhpzList = body.xsfzhpzVoList.filter((item: any) => item.qybz === 'Y');
      const fpsqdxx = Object.assign(temp, { xhfkhhjzh: zhpzList[0]?.yhzhmc + zhpzList[0]?.yhzh });
      queryDjbh({}).then((response) => {
        const { code, body } = response;
        refUnit.current!.setMasker(false);
        if (code === '200') {
          otherRef[1].current!.setDjh(body);
          otherRef[1].current!.showModal({ fpsqdxx, hw: [{ uuid: myUtil.text.uuid(32) }] }, false, refUnit);
        }
      })
    }
  })
}

// 根据单据号打开详情
drmbkjFunc.openFp = (djh: any, param: any) => {
  const { refUnit, record } = param;
  const otherRef = refUnit.current?.getOtherRefs();
  refUnit.current!.setMasker(true);
  fpsqdmxcx({ zbuuid: record.zbuuid }).then((response) => {
    const { code, body } = response;
    refUnit.current!.setMasker(false);
    if (code === '200') {
      const hw: any = [...body.hwxxList]
      hw.forEach((item: any) => {
        item.uuid = myUtil.text.uuid(32);
        // je是未税金额，dj是未税单价 需要保存返回后台 
        item.wsje = item.je;
        item.wsdj = item.dj;
        // jshj是含税金额,hsdj是含税单价
        item.je = item.jshj;
        item.dj = item.hsdj;
      })
      otherRef[1].current!.showModal({ fpsqdxx: body.fpsqdxx, hw, sbyy1: record?.sbyy1 }, true, refUnit);
      otherRef[1].current!.setDjh(djh);
    }
  })
}

// 删除
drmbkjFunc.deleteFpsqd = (param: any) => {
  const { selectionRows, refUnit } = param;
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  } else {
    DDAlert.open({
      title: '系统提示',
      info: '确定要删除选择的数据吗？',
      infoType: 'question',
      modalType: 'confirm',
      okCallbackFn: function (thisObj: any) {
        thisObj.setState({ masker: true });
        const zbuuids: any = [];
        selectionRows.forEach((row: any) => {
          zbuuids.push(row.zbuuid)
        });
        drmbkjSc({ zbuuids }).then((response) => {
          DDAlert.close();
          const { code, desc } = response;
          if (code === '200') {
            message.success(intl2.formatMessage({ id: 'message_delete_success' }));
            refUnit.current!.reload();
          } else {
            message.error(desc);
          }
        })
      },
    });
  }
}

// 列表自定义渲染
drmbkjFunc.columnsRender = {
  // 导入模板开具数据类型
  renderSjlx: (param: any) => {
    let reVal = '';
    if (param.text === '1') {
      reVal = '人工采集';
    } else if (param.text === '2') {
      reVal = '外部导入';
    }
    return reVal;
  },
  // 单据号
  renderDjh: (param: any) => {
    const { record } = param;
    const sbyy1 = record?.sbyy1;
    return (
      <>
        <Button type="link" onClick={(event: any) => { event.stopPropagation(); drmbkjFunc.openFp(param.text, param) }}>
          {param.text}
        </Button>
        {sbyy1 ? <Tooltip title={sbyy1}> <span style={{ marginLeft: '5px' }}>
          <WarningOutlined style={{ color: '#ef8724', cursor: "pointer" }} />
        </span></Tooltip> : <></>}
      </>
    );
  },
}

export default drmbkjFunc;
