import React from 'react';
import myUtil from '@/components/DDAssist/util';
import { Button, Form, message, Space, Table, Tooltip, Upload} from 'antd';
import {queryPager, checkShpzhWxy, downloadTemplate, getShhl, hqFhfs, importTemplate, shsdsjDelete, shsdsjdr, shglppqjy, shglSdplzdpp, initShsdPpsj } from '@/pages/hts/services/htsApi';
import DDAlert from '@/pages/hts/components/DDAlert';
import {ClockCircleOutlined, InboxOutlined} from '@ant-design/icons';
import importStyle from './importStyle.less';
import moment from 'moment';
import { intl as intl2 } from '@/components/DDAssist/util';
import { history } from 'umi';

const { Dragger } = Upload;

const Func: any = {
  // 加载时蒙板使用
  unitRef: React.createRef(),
};
Func.columnsRender = {
  // 合同份数
  renderHtfs:(param: any) => {
    let html;
    if (param.text == 0 || !param.text) {
      html = <>0</>
    } else {
      html = <Button type="link" onClick={() => Func.htfs(param)}>{param.text}</Button>;
    }
    return html;
  },

  // 关单份数
  renderGdfs:(param: any) => {
    let html;
    if (param.text == 0 || !param.text) {
      html = <>0</>
    } else {
      html = <Button type="link" onClick={() => Func.gdfs(param)}>{param.text}</Button>;
    }
    return html;
  },
}

// 合同份数下钻
Func.htfs = (param: any) => {
  const {otherRef} = param;
    otherRef[3].current?.showModal(param);
}

Func.gdfs = (param: any) => {
  const {otherRef} = param;
    otherRef[4].current?.showModal(param);
}

Func.validator = {
  // 收汇凭证号唯一性
  shpzhWxy: (form: any) => {
    const validator = async (_rule: any) => {
      const formValue = form?.getFieldsValue();
      if (formValue.shpzh) {
        const obj = {
          shpzh: formValue?.shpzh,
          uuid: formValue?.uuid
        };
        await checkShpzhWxy(obj).then((res: any)=> {
          if (res.code === '900') {
            return Promise.reject(new Error(res.msg));
          }
          return Promise.resolve();
        }).catch((err) => {
          return Promise.reject(err);
        });
      }
      return Promise.resolve();
    };
    return { validator };
  },
  shgzJy: (form: any) => {
    const validator = async (_rule: any) => {
      const formValue = form?.getFieldsValue();
      if (formValue.shgzDm === '1') {
        const dyhtxxArr = formValue?.dyhtxxArr;
        if (!dyhtxxArr || dyhtxxArr.length <= 0) {
          return Promise.reject(new Error('请采集对应业务信息'));
        }
      }
      return Promise.resolve();
    };
    return { validator };
  },
  // 对应合同信息校验
  dyhtxxJy: (form: any) => {
    const validator = async (_rule: any) => {
      const formValue = form?.getFieldsValue();
      const dyhtxxArr = formValue?.dyhtxxArr;
      const fieldName = 'ckhth';
      const ckhthVal = dyhtxxArr?.some((item: any) => item != undefined && (item[fieldName] === '' || item[fieldName] === null || item[fieldName] === undefined));
      if (ckhthVal) {
        return Promise.reject(new Error('请录入业务号'));
      }
      return Promise.resolve();
    };
    return { validator };
  },
  // 修改时，收汇金额不能小于已匹配金额
  ckshjeJy: (form: any) => {
    const validator = async (_rule: any) => {
      const formValue = form?.getFieldsValue();
      const yzje1Val = formValue?.yzje1;
      if (formValue?.uuid && yzje1Val > 0) {
        const ckshjeVal = formValue?.ckshje;
        if (ckshjeVal < yzje1Val) {
          return Promise.reject(new Error('收汇金额小于已匹配金额' + myUtil.text.formatNum(Number(yzje1Val), '0,0.00') ));
        }
        return Promise.resolve();
      }
      return Promise.resolve();
    };
    return { validator };
  }
}

Func.eventOnBlur = {
  fhrOnblur: (param: any) => {
    const {form} = param;
    const fhr = form.getFieldValue('fhr');
    const obj = {
      fhr: fhr
    };
    hqFhfs(obj).then((res: any) => {
      const { code, msg, body } = res;
      if (code === '200') {
        form.setFieldsValue({
          shgzDm: body?.shgzDm,
          ppbzDm: body?.ppbzDm
        });
      } else {
        message.error(res.msg);
      }
    });
  },
  shbzDmOnblur: (param: any) => {
    const { form, event, value, item } = param;
    const inputValue = event?.target?.value || value;
    const option = myUtil.code.getCode('url_gy_hbhl:01');
    const tempRows = option.filter((row: any) => {
      return (row.hbzmDm === inputValue);
    });
    if (tempRows && tempRows.length < 1) {
      if(inputValue){
        message.info('不存在该选项');
      }
      form.resetFields([[item.name]]);
      return;
    }
    form.setFieldsValue({
      shbzmc: tempRows[0].hbmc,
    });
    let ckshrq = form.getFieldValue('ckshrq');
    if (ckshrq) {
      ckshrq = moment(ckshrq).format('yyyy-MM-DD');
      const obj = {
        shbzDm: inputValue,
        ckshrq: ckshrq
      };
      getShhl(obj).then((res: any) => {
        const {code, msg, body} = res;
        if (code === '200') {
          form.setFieldsValue({
            shbzhl: body?.rmbhl
          });
          const ckshje = form.getFieldValue('ckshje');
          if (ckshje) {
            form.setFieldsValue({
              ckshjermb: myUtil.text.formatNum(Number(body?.rmbhl * ckshje / 100), '0.00')
            });
          }
        } else {
          message.error(res.msg);
        }
      });
    }
  },
  getShhl: (param: any) => {
    const {form} = param;
    const shbzDm = form.getFieldValue('shbzDm');
    let ckshrq = form.getFieldValue('ckshrq');
    if (shbzDm && ckshrq) {
      ckshrq = moment(ckshrq).format('yyyy-MM-DD');
      const obj = {
        shbzDm: shbzDm,
        ckshrq: ckshrq
      };
      getShhl(obj).then((res: any) => {
        const {code, msg, body} = res;
        if (code === '200') {
          form.setFieldsValue({
            shbzhl: body?.rmbhl
          });
          const ckshje = form.getFieldValue('ckshje');
          if (ckshje) {
            form.setFieldsValue({
              ckshjermb: myUtil.text.formatNum(Number(body?.rmbhl * ckshje / 100), '0.00')
            });
          }
        } else {
          message.error(res.msg);
        }
      });
    }
  },
  shjeOrShhlOnblur: (param: any) => {
    const {form} = param;
    const shbzhl = form.getFieldValue('shbzhl');
    const ckshje = form.getFieldValue('ckshje');
    if (shbzhl && ckshje) {
        form.setFieldsValue({
          ckshjermb: myUtil.text.formatNum(Number(shbzhl * ckshje / 100), '0.00')
        });
    }
  }
}

// 修改初始化校验
Func.initEditForm = (param: any) => {
  const { handleModalVisible, unitRef, formItems, setFormItems } = param;
  const selectionRows = unitRef.current.getSelectionRows();
  const ppztDm = selectionRows[0]?.ppztDm;
  if (ppztDm === '1') {
    message.info('收汇水单已被匹配，若需修改请先删除已匹配的报关单');
    return ;
  } 
  const disableNames = Func.getDisableLabelName();
  const tmpFormItems = [...formItems];
  // 部分匹配，不允许修改水单主题信息
  if (ppztDm === '2') {
    tmpFormItems.map(item => {
      if (disableNames.includes(item.name)) {
        item.disabled = true;
      }
    })
  }
  if (ppztDm === '0') {
    tmpFormItems.map(item => {
      if (disableNames.includes(item.name)) {
        delete item.disabled;
      }
    })
  }
  setFormItems([...tmpFormItems]);
  handleModalVisible(true);
  // if (selectionRows[0]?.sbje > 0) {
  //   message.info('该收汇水单已被提取收汇申报明细数据，无法修改。');
  //   return ;
  // }
  // if (selectionRows[0]?.ppztDm != '0') {
  //   message.info('收汇水单已被匹配，若需修改请先删除已匹配的报关单');
  //   return ;
  // }
  // handleModalVisible(true);
}

// 匹配
Func.handleColumnsPp = (param: any, e: any) => {
  const { otherRef, unitRef } = param;
  e.stopPropagation();
  unitRef.current!.setMasker(true);
  shglppqjy({}).then((res: any) => {
    unitRef.current!.setMasker(false);
    const {code, body, msg} = res;
    if (code === '200') {
      if (body?.jybz == 'Y') {
        unitRef.current!.setMasker(true);
        initShsdPpsj({shpzh: param?.record?.shpzh}).then((res1: any) => {
          unitRef.current!.setMasker(false);
          if (res1?.code === '200') {
            otherRef[0].current?.showModal(param, res1?.body?.rwuuid1); 
          } else {
            message.error(res1?.msg);
          }
        });
      } else {
        message.error(body?.jyxx);
      }
    } else {
      message.error(msg);
    }
  });
}

// 预览
Func.handleColumnsScfj = (param: any) => {
  const { otherRef, record, unitRef } = param;
  if (otherRef && otherRef[2]) {
    otherRef[2].current?.showModal(record?.shdzuuid, '08', unitRef, true);
  }
}

Func.scfjDisplay = (param: any) => {
  return param?.shdzsl == 0;
}

// 导入Excel模板
Func.shsdsjImport = (param: any) => {
  const { unitRef, otherRef } = param;
  DDAlert.open({
    title: '导入Excel文件',
    infoType: 'warning',
    modalType: 'form',
    closeStatus: false,
    isFormContent: true,
    width: 720,
    initFormContentValues: { drgz: 1 },
    button: [
      <Button key={'excelmbxz'} onClick={() => Func.downloadExcel('SHGL_SHSDSJ_SHSDSJDR_EXCEL')}>Excel模板下载</Button>,
    ],
    content: <>
      <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} label="导入Excel文件" name="file" valuePropName="fileList" rules={[{ required: true, message: '请选择上传的文件' }]} getValueFromEvent={(e: any) => { if (Array.isArray(e)) { return e; } return e && e.fileList; }}>
        <Dragger
          maxCount={1}
          showUploadList={true}
          beforeUpload={beforeUpload}
          itemRender={(_originNode, file, _currFileList, actions: { download: any, preview: any, remove: any }) => (
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
        thisObj.setState({ masker: true });
        const formData = new FormData();
        formData.append('drgz', values.drgz);
        formData.append('file', values.file[0].originFileObj);
        shsdsjdr(formData).then((response) => {
          const { code, body, desc } = response;
          DDAlert.close();
          // code === '201' ? 'large' : 'small'
          if (code == '200' || code == '201') {
            unitRef.current!.reload2();
            DDAlert.open({
              title: '系统提示',
              info: '数据导入成功，共导入' + body?.drsl + '条数据，跳过' + body?.tgsl + '条 。',
              infoType: 'warning',
              modalType: 'confirm',
              width: code === '201' ? '1200px' : '',
              okText: '确定',
              button: [
                code == '201' ? <Button key={'excelmbxz'} onClick={() => Func.downloadTemplate('CX_SHGL_SHSDSJ_SHSDSJCX_SJDRYCXX_DC')}>导出</Button> : <></>,
              ],
              content: code == '201' ? <>
                <Space style={{ marginBottom: 10 }}>同时系统检测到如下数据存在如下风险，为确保收汇水单可以匹配报关单，请尽快完善 ：</Space>
                <Table
                  dataSource={body?.ycList}
                  columns={[
                    { title: '收汇凭证号', dataIndex: 'shpzh', width: 120, ellipsis: true, },
                    { title: '收汇日期', dataIndex: 'ckshrq', width: 60, ellipsis: true, },
                    { title: '付汇人', dataIndex: 'fhr', width: 100, ellipsis: true, },
                    { title: '异常原因', dataIndex: 'ycyy', width: 240, ellipsis: true, },
                  ]}
                  pagination={false}
                  size={code === '201' ? 'large' : 'small'}
                  bordered={true}
                />
              </> : <></>,
            });
          } else if (code === '900') {
            otherRef[1].current!.showModal(body, body?.druuid);
          } else {
            message.error(desc);
          }
        }).catch((err) => {
          message.error('导入失败，请重新上传文件。');
          console.log(err);
        }).finally(() => {
          thisObj.setState({ masker: false });
        });
      });
    },
  });
}

const beforeUpload = (file: any) => {
  if (!file.name.toUpperCase().endsWith(".XLS") && !file.name.toUpperCase().endsWith(".XLSX")) {
    message.info('上传文件必须是Excel文件。');
    return Upload.LIST_IGNORE;
  } else {
    return false;
  }
}

// 下载excel模板
Func.downloadExcel = (param: string) => {
  importTemplate({ key: param }).then((response) => {
    if (response.code === '200') {
      const { blob, fileName } = response.body;
      myUtil.file.downloadExcel(blob, fileName);
    } else {
      message.error(response.desc);
    }
  })
}

Func.downloadTemplate = (param: any) => {
  const obj = {
    sfBhsj: 'Y',
    sfScsm: 'Y',
    key:param,
    searchModel: []
  }
  downloadTemplate(obj).then((response: any) => {
    // thisObj.setState({masker: false});
    // DDAlert.close();
    if (response.code === '200') {
      const {blob, fileName} = response.body;
      myUtil.file.downloadExcel(blob, fileName);
    } else {
      message.error(response.desc);
    }
  })
}

Func.shsdsjBatchDelete = (param: any) => {
  const { gridRef, selectionRows, unitRef } = param;
  if (!selectionRows || selectionRows.length === 0) {
    const unSelectedMessage = Func.intl.formatMessage({ id: 'message_delete_unselected' });
    message.info(unSelectedMessage);
    return;
  } else {
    const shpzhs: any = [];
    let num = 0;
    for (let i = 0; i < selectionRows.length; i++) {
      if (selectionRows[i].sbje > 0) {
        num = num + 1;
      } else {
        shpzhs.push(selectionRows[i].shpzh);
      }
    }
    if (num > 0) {
      message.warning('勾选的收汇水单对应的报关单已被提取收汇申报明细数据，无法删除。');
      return;
    }
    DDAlert.open({
      title: '删除',
      info: '删除数据将自动解除与报关单的匹配关系，是否继续？',
      infoType: 'question',
      modalType: 'confirm',
      closeStatus: true,
      content: '',
      isFormContent: false,
      okCallbackFn: function () {
        const data = {
          uuids: shpzhs
        };
        unitRef.current!.setMasker(true);
        shsdsjDelete(data).then((response: any) => {
          unitRef.current!.setMasker(false);
          const { code, desc } = response;
          if (code === '200') {
            unitRef.current?.setSelectionRowKeys([]);
            unitRef.current?.setSelectionRows([]);
            gridRef.current?.reload();
            message.success('删除成功！');
          } else {
            message.error(desc);
            return;
          }
        })
      }
    });
  }
}

Func.beforeDelete = (params: any) => {
  const {selectionRows} = params;
  if (!selectionRows || selectionRows.length === 0) {
    const unSelectedMessage = Func.intl.formatMessage({ id: 'message_delete_unselected' });
    message.info(unSelectedMessage);
    return false;
  } else {
    let num = 0;
    for (let i = 0; i < selectionRows.length; i++) {
      if (selectionRows[i].sbje > 0) {
        num = num + 1;
      }
    }
    if (num > 0) {
      message.warning('勾选的收汇水单对应的报关单已被提取收汇申报明细数据，无法删除。');
      return false;
    }
    return true;
  }
}

// 批量补填
Func.btnPlbtHl = (param: any) => {
  const { unitRef, selectionRowKeys, gridRef, otherRef } = param;
  const gridData = unitRef.current?.getGridData();
  if(gridData.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_common_type_no_griddata' }));
    return;
  }
  const searchModel = unitRef.current?.getGridParams().searchModel || [];
  const headerSearchModel = gridRef.current?.getHeaderFilter() || [];
  const allSearchModel: any = searchModel.concat(headerSearchModel);
  allSearchModel.push({ property: 'sfcxZj', value: "Y", op: 'zdy' });
  allSearchModel.push({ property: 'cxlx', value: "whhl", op: 'zdy' });
  let uuids:any = [];
  if(selectionRowKeys.length === 0) {
    const obj = {
      key: 'CX_SHGL_SHSDSJ_SHSDSJCX',
      page: 1,
      pageSize: 999999,
      searchModel: allSearchModel,
    }
    queryPager(obj).then((res: any)=> {
      const {code, body, msg} = res;
      if(code === '200') {
        uuids = body.rows;
        allSearchModel.push({ property: 'uuids', values: body?.rows, op: 'zdy' });
        let removedArr = allSearchModel.filter((x: any) => x.property !== "sfcxZj" );
        const obj2 = {
          searchModel: removedArr,
          key: 'CX_SHGL_SHSDSJ_SHSDSJCX_DBTHL',
        }
        otherRef[5].current?.showModal(unitRef, uuids, otherRef[2], obj2);
      } else {
        message.info(msg);
      }
    })
  } else {
    allSearchModel.push({ property: 'uuids', values: selectionRowKeys, op: 'zdy' });
    let removedArr = allSearchModel.filter((x: any) => x.property !== "sfcxZj" );
    const obj2 = {
      searchModel: removedArr,
      key: 'CX_SHGL_SHSDSJ_SHSDSJCX_DBTHL',
    }
    otherRef[5].current?.showModal(unitRef, selectionRowKeys, otherRef[2], obj2);
  }
}

Func.getDisableLabelName = () => {
  const disableNames = [
    'shpzh', 'ckshrq', 'fhr', 
    'ppbzDm', 'shbzDm',  
    'ckshje', 'shbzhl',  'sjjsje', 'sxf',
    'jwskrshzh','jwskrshyxmc','jnzfrfhyhmc',
    'jnzfrfhzh','fhgjdq',
    'bz', 'wjnrStr'];
    return disableNames;
}

Func.initAddForm = (param: any) => {
  const { handleModalVisible, formItems, setFormItems } = param;

  const disableNames = Func.getDisableLabelName();
  const tmpFormItems = [...formItems];
  tmpFormItems.map(item => {
    if (disableNames.includes(item.name)) {
      delete item.disabled;
    }
  });
  setFormItems([...tmpFormItems]);
  handleModalVisible(true);
}

// 批量自动匹配
Func.btnPlzdpp = (param: any) => {
  const { unitRef, selectionRows, gridRef, otherRef } = param;
  const gridData = unitRef.current?.getGridData();
  if(gridData.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_common_type_no_griddata' }));
    return;
  }
  const uuids: any = [];
  if (!selectionRows || selectionRows.length <= 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  } else {
    const yppRows = selectionRows.filter((item: any) => item?.ppztDm === '1');
    if (yppRows.length > 0) {
      message.info('选择的数据包含已匹配的水单，请重新选择');
      return;
    }
    selectionRows.map((item: any) => {
      if (item?.ppztDm != '1') {
        uuids.push(item?.uuid);
      }
    });
  }
  DDAlert.open({
    title: '系统提示',
    info: '确认对所选收汇水单自动匹配吗',
    infoType: 'question',
    modalType: 'confirm',
    closeStatus: false,
    content: '',
    isFormContent: false,
    okCallbackFn: function (thisObj: any) {
      thisObj.setState({ masker: true });
      shglppqjy({}).then((res: any) => {
        DDAlert.close();
        const {code, body, msg} = res;
        if (code === '200') {
          if (body?.jybz == 'Y') {
            const obj: any = {
              uuids: uuids
            };
            unitRef.current!.setMasker(true);
            shglSdplzdpp(obj).then((res2: any) => {
              unitRef.current!.setMasker(false);
              const {code, msg} = res2;
              if (code === '200') {
                DDAlert.open({
                  title: '任务情况',
                  info: '启动任务成功',
                  infoType: 'success',
                  content: [
                    '可在任务管理菜单里查询任务情况',
                  ],
                  okText: '转任务管理',
                  okCallbackFn: function () {
                    history.push('/hts/shgl/rwgl');
                  }
                });		
              } else {
                message.error(msg);
              }
            });
          } else {
            message.error(body?.jyxx);
          }
        } else {
          message.error(msg);
        }
      });      
    }
  });
}
export default Func;
