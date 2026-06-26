import cktsUtil from '@/pages/hts/cktsUtil';
import React from 'react';
import { Form, message, Upload, Button, Radio, Tooltip, Select } from 'antd';
import { yzfPtFpxxCx, batchSetJxfp, importTemplate, zzsfptzsx, fpyl, cxxj2 } from '@/pages/hts/services/htsApi';
import myUtil, { intl as intl2 } from '@/components/DDAssist/util';
import DDAlert from '@/pages/hts/commonModule/DDAlert';
import TextArea from "antd/lib/input/TextArea";
import importStyle from '../ckhwbgd/importStyle.less';
import tableStyle from '../ckhwbgd/style.less';
import { ClockCircleOutlined, InboxOutlined } from '@ant-design/icons';
import baseValidator from '@/components/DDAssist/field/baseValidator';
import { history } from 'umi';

const { Dragger } = Upload;

const ckbgdFunc: any = {
  unitRef: React.createRef(),
};

ckbgdFunc.openfp=async (param:any)=>{
  const {record,unitRef,otherRef}  = param;
  unitRef.current?.setMasker(true);
  await fpyl({uuid:record?.uuid,jhpzh: record?.jhpzh}).then(async (response) => {
    unitRef.current?.setMasker(false);
    if(response.code == '200'){
      otherRef[5].current?.showModal(response.body);
    }else{
      message.error(response.msg);
    }
  });
}


// 关单信息状态标志
ckbgdFunc.columnsRender = {
  renderBgdscmxbgdhSjgl :(param: any) => {
    const {record}  = param;
    if(record.sfyfj == 'Y' || record.fpzlDm1 != '6'){
      return <a onClick={(e)=>{ e.stopPropagation();ckbgdFunc.openfp(param)}}>{record?.fphm}</a>;
    } else if( record.fpzlDm1 == '6' && record.fpDm?.trim() && record.fphm?.trim() && record.sdfphm?.trim()  ){
      return <a onClick={(e)=>{ e.stopPropagation();ckbgdFunc.openfp(param)}}>{record?.fphm}</a>;
    }
    else{
      return <>{record?.fphm}</>
    }
    // return <a onClick={(e)=>{ e.stopPropagation();jkbgdFunc.openJkbgdh(param, param?.text)}}>{param?.text}</a>;
  },
  // renderSczt: (param: any) => {
  //   const fpsbztDm = param?.record.fpsbztDm;
  //   let html;
  //   if (fpsbztDm === '1') {
  //     html = <div><Badge status="success" key='4b6301296ff74efe87bb470492aa1056' /> {param?.record.fphm}</div>;
  //   } else if(fpsbztDm === '2') {
  //     html = <div><Badge status="warning" key='7db908ceb5d94a698a6bcb8357602cb5' />{param?.record.fphm}</div>
  //   } else {
  //     html = <div><Badge status="error" key='433e42f2a4fe42dba98312b47ddf562f' />{param?.record.fphm}</div>
  //   }
  //   // 列表列tooltip
  //   const tip = () => {
  //     const htmlTip = [];
  //     if (fpsbztDm === '1') {
  //       htmlTip.push(<div>生成状态：<Badge status="success" key={param?.record.fphm + param?.record.fpDm} />已生成</div>);
  //     } else if(fpsbztDm === '2') {
  //       htmlTip.push(<div>生成状态：<Badge status="warning" key={param?.record.fphm + param?.record.fpDm} />部分生成</div>);
  //     } else {
  //       htmlTip.push(<div>生成状态：<Badge status="error" key={param?.record.fphm + param?.record.fpDm} />未生成</div>);
  //     }
  //     return htmlTip;
  //   };
  //   const html2 = <Tooltip title={() => tip()}>{html}</Tooltip>;
  //   return html2;
  // },
  fpzt: (param: any) => {
    const rzzt = param?.record.rzxfzzszyfpbz; // 认证发票状态
    const jhzt = param?.record.jhxfzzszyfpbz; // 稽核发票状态
    let rzrtn = '';
    let jhrtn = '';
    if (rzzt == 'Y') {
      rzrtn = '已认证';
    } else {
      rzrtn = '未认证';
    }
    if (jhzt == 'Y') {
      jhrtn = '已稽核';
    } else {
      jhrtn = '未稽核';
    }
    const html = <div>{rzrtn}/{jhrtn} </div>;
    return html;
  },
  // 生成类型
  renderFpcllxDm: (param: any) => {
    const text = param?.record.fpcllxDm;
    let reVal = '';
    if (text === '1') {
      reVal = '出口退税';
    } else if (text === '2') {
      reVal = '应抵扣数据';
    } else if (text === '3') {
      reVal = '出口转内销';
    } else if (text === '4') {
      reVal = '代办退税';
    } else {
      reVal = '-';
    }
    return reVal;
  }


};


// 操作列配单
ckbgdFunc.handleColumnCkfp = (param: any, event: any) => {
  const { unitRef, record, otherRef } = param;
  event.stopPropagation();
  otherRef[0].current?.showModal(unitRef, record);
}

ckbgdFunc.xj = (param: any) => {
  const { otherRef ,gridRef,unitRef,selectionRowKeys} = param;
  const gridData  = param.unitRef.current.getGridData();
  if (gridData.length === 0) {
    message.info('当前筛选条件下无数据，请确认！');
    return;
  }
  const searchModel = unitRef.current?.getGridParams().searchModel || [];
  const headerSearchModel = gridRef.current?.getHeaderFilter() || [];
  const initSearchModel = unitRef.current.getGridParams().initSearchModal || [];
  let allSearchModel: any = searchModel.concat([...headerSearchModel,...initSearchModel]);
  const obj = {searchModel:allSearchModel};
  const xjlx = param?.unit_key === 'CX_SAAS_SJGL_JXFPSJCX_ZZSFPDZSJCX_FPXX' ? 'FPXX' : 'SPXX'
  if(selectionRowKeys.length != 0){
    obj.searchModel.push({
      "type": 1,
      "property": xjlx === 'FPXX' ? "jhpzhs" : "uuids",
      "value": selectionRowKeys,
      "op": "zdy"
  })
  }
  obj.searchModel.push({
    "type": 1,
    "property": "xjlx",
    "value": xjlx,
    "op": "zdy"
})
  unitRef.current!.setMasker(true);
  cxxj2(obj).then((res: any) => {
    unitRef.current!.setMasker(false);
    if (res.code == '200') {
      otherRef[6].current?.showModal({gridData:res?.body?.rows});
    }else{
      message.error(res.msg);
    }
  })
}


// 生成进货明细
ckbgdFunc.scjhmx = (param: any) => {
  const { otherRef } = param;
  param.unit_key = 'MTS_ZXSB_SB_MTS_TSJH_G';
  otherRef[1].current?.showModal(param);
}
// 生成转内销明细
ckbgdFunc.scznxmx = (param: any) => {
  const { otherRef } = param;
  param.unit_key = 'ZMKJ_ZXSB_ZM_CKHWZNX_G';
  otherRef[2].current?.showModal(param);
}


// 出口货物转内销信息列表处理
ckbgdFunc.scxxcl = (param: any, formValues: any, selectRowKeys: any, Func: any) => {
  const { otherRef } = param;
  otherRef[3].current?.showModal(param, formValues, selectRowKeys, Func, 'fpscmx');
}

// 配置项：发票获取
ckbgdFunc.fphq = (param: any) => {
  // 获取企业类型(WM:外贸，SC:生产，QT:其他)
  const qylx = cktsUtil.sys.enterpriseType();
  if ('WM' == qylx) {
    const { otherRef } = param;
    if (otherRef && otherRef[4]) {
      otherRef[4].current?.showModal(param, '020001');
    }
  } else {
    const { otherRef } = param;
    if (otherRef && otherRef[4]) {
      otherRef[4].current?.showModal(param);
    }
  }
}

// 配置项：更新信息
ckbgdFunc.gxxx = (param: any) => {
  const { selectionRows, unitRef } = param;
  let params: any = {};
  if (selectionRows.length > 0) { // 如果有选择数据就 更新选择数据
    let uuidList: any = [];
    selectionRows.forEach((item: any) => {
      if (item.sybz != 'Y') {
        uuidList.push(item.fpDm + item.fphm);
      }
    });
    params.uuidList = uuidList;
  } else { // 没有选择数据按照筛选条件检查数据
    const searchModel = unitRef.current?.getGridParams().searchModel;
    searchModel.forEach((item: any) => {
      params[item.property] = item.value;
    });
  }
  unitRef.current!.setMasker(true);
  yzfPtFpxxCx(params).then((res) => {
    unitRef.current!.setMasker(false);
    const { code, desc } = res;
    if (code === '200') {
      unitRef.current!.reload2();
      message.success(desc);
    } else {
      message.info(desc);
    }
  })
}

// 批量修改---是否退税
ckbgdFunc.btnSetSfts = async (param: any) => {
  const { selectionRowKeys, unitRef } = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  } else {
    DDAlert.open({
      title: '是否退税',
      infoType: 'info',
      modalType: 'form',
      closeStatus: false,
      isFormContent: true,
      content: <>
        <Form.Item name="tsbz" initialValue={'Y'} label="选择是否退税" rules={[{ required: true, message: '请选择是否退税' }]} labelCol={{ span: 11 }} wrapperCol={{ span: 11 }}>
          <Radio.Group >
            <Radio value="Y">是</Radio>
            <Radio value="N">否</Radio>
          </Radio.Group>
        </Form.Item>
      </>,
      okCallbackFn: function (thisObj: any) {
        DDAlert.getForms().validateFields().then((values: any) => {
          thisObj.setState({ masker: true });
          batchSetJxfp({ szlx: 'sfts', uuids: selectionRowKeys, tsbz: values.tsbz }).then((response: any) => {
            DDAlert.close();
            thisObj.setState({ masker: false });
            const { code, msg } = response;
            if (code === '200') {
              message.success('设置是否退税成功');
              unitRef.current!.reload2();
            } else {
              message.error(msg);
            }
          })
        });
      },
    });
  }
}
// 批量修改---业务编号
ckbgdFunc.btnSetYwbh = async (param: any) => {
  const { selectionRowKeys, unitRef } = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  } else {
    DDAlert.open({
      title: '业务编号',
      infoType: 'info',
      closeStatus: false,
      isFormContent: true,
      modalType: 'form',
      content: <>
        <Form.Item label="业务编号" labelCol={{ span: 4 }} name='ywbh' rules={[{ required: true, message: '业务编号为必填项' }, baseValidator.range2({ min: 0, max: 60 })]}>
          <TextArea autoSize={{ minRows: 6, maxRows: 14 }} placeholder="请您输入业务编号的内容" rows={14} style={{ width: 397 }} />
        </Form.Item>
      </>,
      okCallbackFn: function (thisObj: any) {
        DDAlert.getForms().validateFields().then((values: any) => {
          thisObj.setState({ masker: true });
          batchSetJxfp({ szlx: 'ywbh', uuids: selectionRowKeys, ywbh: values.ywbh }).then((response: any) => {
            DDAlert.close();
            thisObj.setState({ masker: false });
            const { code, msg } = response;
            if (code === '200') {
              message.success('设置业务编号成功');
              unitRef.current!.reload2();
            } else {
              message.error(msg);
            }
          })
        });
      },
    });
  }
}

// 批量修改---设置发票用途
ckbgdFunc.btnSetFpyt = async (param: any) => {
  const { selectionRowKeys, unitRef } = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  } else {
    Promise.all([myUtil.code.getCodeFromServerT1('CODE_DM_CKTS_FPCLLX:01')]).then(() => {
    }).catch(() => {
      message.error('获取码表失败');
    }).finally(() => {
      const options = myUtil.code.getSelectOption('CODE_DM_CKTS_FPCLLX', '01');
      DDAlert.open({
        title: '发票用途',
        infoType: 'info',
        closeStatus: false,
        isFormContent: true,
        modalType: 'form',
        content: <>
          <Form.Item label="发票用途" labelCol={{ span: 8 }} name='fpcllxDm' rules={[{ required: true, message: '发票用途为必填项' }]}>
            <Select
              style={{ width: 160 }}
              fieldNames={{
                value: 'value',
                label: 'name'
              }}
              options={options}
            >
            </Select>
          </Form.Item>
        </>,
        okCallbackFn: function (thisObj: any) {
          DDAlert.getForms().validateFields().then((values: any) => {
            thisObj.setState({ masker: true });
            batchSetJxfp({ szlx: 'fpyt', uuids: selectionRowKeys, fpcllxDm: values.fpcllxDm }).then((response: any) => {
              DDAlert.close();
              thisObj.setState({ masker: false });
              const { code, msg } = response;
              if (code === '200') {
                message.success('设置发票用途');
                unitRef.current!.reload2();
              } else {
                message.error(msg);
              }
            })
          });
        },
      });
    })
  }
}


// 批量修改---设置标签
ckbgdFunc.btnSetBq = async (param: any) => {
  const { selectionRowKeys, unitRef } = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  } else {
    DDAlert.open({
      title: '标签',
      infoType: 'info',
      closeStatus: false,
      isFormContent: true,
      modalType: 'form',
      content: <>
        <Form.Item label="标签" labelCol={{ span: 4 }} name='bqsm' rules={[baseValidator.range2({ min: 0, max: 1500 })]}>
          <TextArea autoSize={{ minRows: 6, maxRows: 14 }} placeholder="请您输入标签的内容" rows={14} style={{ width: 397 }} />
        </Form.Item>
      </>,
      okCallbackFn: function (thisObj: any) {
        DDAlert.getForms().validateFields().then((values: any) => {
          thisObj.setState({ masker: true });
          batchSetJxfp({ szlx: 'bq', uuids: selectionRowKeys, bqsm: values.bqsm }).then((response: any) => {
            DDAlert.close();
            thisObj.setState({ masker: false });
            const { code, msg } = response;
            if (code === '200') {
              message.success('设置标签成功');
              unitRef.current!.reload2();
            } else {
              message.error(msg);
            }
          })
        });
      },
    });
  }
}

ckbgdFunc.importTzsx = async (param: any) => {
  const { unitRef } = param;
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
    title: '台账筛选',
    infoType: 'warning',
    modalType: 'form',
    closeStatus: false,
    isFormContent: true,
    button: [
      <Button key={'excelmbxz'} onClick={() => ckbgdFunc.downloadExcel('SJGL_JXFP_TZSX_PRINT_REPORT')}>Excel模板下载</Button>,
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
    </>,
    okCallbackFn: function (thisObj: any) {
      DDAlert.getForms().validateFields().then((values: any) => {
        if (values.file[0].originFileObj) {
          thisObj.setState({ masker: true });
          DDAlert.close();
          const formData = new FormData();
          formData.append('file', values.file[0].originFileObj);
          formData.append('fileName', values.file[0].name);
          if (param?.unit_key === 'CX_SAAS_SJGL_JXFPSJCX_ZZSFPDZSJCX_FPXX') {
            formData.append('cdDm', 'JXFP_020602');
          } else {
            formData.append('cdDm', 'JXFP_020601');
          }
          zzsfptzsx(formData).then((response: any) => {
            const { code, msg, body } = response;
            thisObj.setState({ masker: false });
            if (code === '200') {
              // 台账数据筛选 赋值
              unitRef.current?.addQueryModel("Y", 'tzsxbz');
              if (body?.sbzs != 0) {
                // 业务校验
                const sbyyList = body?.sbmx || [];
                const textAreaValues: any = []
                if (sbyyList.length > 0) {
                  sbyyList.forEach((item: any, index: any) => {
                    textAreaValues.push(
                      <tr>
                        <td width='10%' style={{ textAlign: 'center' }}>{index + 1}</td>
                        <td width='30%'>{item.fphm}</td>
                        <td width='20%'>{item.fpDm}</td>
                        <td width='40%'>
                          <Tooltip title={item.sbyy}>
                            <div className={tableStyle.errorTableText}>{item.sbyy}</div>
                          </Tooltip>
                        </td>
                      </tr>
                    )
                  })
                  DDAlert.open({
                    title: '台账筛选',
                    modalType: 'form',
                    width: 780,
                    closeStatus: false,
                    isFormContent: true,
                    content:
                      <>
                        <div style={{ marginTop: '10px' }}>本次导入台账中共{body?.drzs}张进项发票，导入成功{body?.cgzs}张，导入失败{body?.sbzs}张。</div>
                        <table className={tableStyle.errorTable}>
                          <tr style={{ backgroundColor: '#FAFAFA' }}>
                            <th>序号</th>
                            <th>失败发票号码</th>
                            <th>失败发票代码</th>
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
                message.success(`本次导入台账中共${body?.drzs}张，导入成功${body?.cgzs}张！`);
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
ckbgdFunc.downloadExcel = (key: any) => {
  const obj = {
    sfBhsj: 'N',
    sfScsm: 'N',
    key,
  }
  importTemplate(obj).then((response: any) => {
    if (response.code === '200') {
      const { blob, fileName } = response.body;
      myUtil.file.downloadExcel(blob, fileName);
    } else {
      message.error(response.desc);
    }
  })
}
ckbgdFunc.re = (param: any) => {
}

// 查询类型（发票、商品切换）
ckbgdFunc.handleOnChangeCxlx = (param: any) => {
  const p = {};
  const { value } = param;
  if (value == '1') {
    history.push({ pathname: '/02/0206/JXFP_020601', query: p } )
  } else {
    history.push({ pathname: '/02/0206/JXFP_020602', query: p } )
  }
}

ckbgdFunc.filterValidate = (param: any) => {
  const kprq = param?.form.getFieldValue('kprq');
  if (!kprq || kprq.length !== 2) {
    message.info('请输入筛选条件，开票日期必填！');
    return false;
  } else {
    const userInfo = myUtil.sessionStore.getItem('userInfo');
    const fpcxzdyffw = userInfo?.qypz?.QYPZGL_FPCXZDYFFW ? userInfo?.qypz?.QYPZGL_FPCXZDYFFW : 24;
    const kprqQ = kprq[0];
    const kprqZ = kprq[1];

    // 计算两个日期之间的月份差
    const date1 = new Date(kprqQ);
    const date2 = new Date(kprqZ);
    const monthsDiff = (date2.getFullYear() - date1.getFullYear()) * 12 + (date2.getMonth() - date1.getMonth());

    if (monthsDiff > fpcxzdyffw) {
      message.info('开票日期范围不能超过' + fpcxzdyffw + '个月！');
      return false;
    }
    return true;
  }
}


export default ckbgdFunc;
