import React from 'react';
import {
  checkBgd,
  uploadScHgCkbgdCj2,
  getBgdInfoHgck,
  checkCkbgdh,
  querySpdmXxCj,
  updateBgdCzbz,
  cxxj,
  bgdpdfyl,
  queryPagerXzrw,
  bgdscDelete,
  queryKak,
  hgsjxz,
  xzrwjy,
  drJ4HgCkbgd,
  bgdtzsx,
  importTemplate,
  btssjZts,
  bgdzbts,
  batchSetBgd,
  sjglCkbgdcxCjbzxj
} from '@/services/hts/api';
import DDAlert from '@/components/DDAlert';
import {Form, message, Upload, Button, Radio, Badge, Tooltip, Select, Input, Table, Checkbox} from 'antd';
import { ClockCircleOutlined, InboxOutlined } from '@ant-design/icons';
import moment from 'moment';
import myUtil from '@/pages/common/myUtil';
import importStyle from './importStyle.less';
import { intl as intl2 } from '@/pages/common/myUtil';
import khdgjUtil from '@/pages/hts/ckfp/khdgjUtil';
import TextArea from "antd/lib/input/TextArea";
import { history } from 'umi';
import tableStyle from './style.less';
import baseValidator from '@/pages/common/field/baseValidator';
import businessValidator from "@/pages/common/field/businessValidator";
import pro from "@/pages/common/proConfig";

const { Dragger } = Upload;

const ckbgdFunc: any = {
  unitRef: React.createRef(),
};

// 编辑表单初始化
ckbgdFunc.initEditForm = (param: any) => {
  const { formValue, handleModalVisible } = param;
  const sybz = formValue.sybz;
  if (sybz === 'Y') {
    message.info('已勾选的报关单中存在已使用情况，无法修改！');
    handleModalVisible(false)
  } else {
    handleModalVisible(true)
  }
}

// 批量删除前调用
ckbgdFunc.beforeDelete = (param: any) => {
  const { selectionRows } = param;
  for (let i = 0; i < selectionRows.length; i++) {
    const sybz = selectionRows[i].sybz;
    if (sybz == 'Y') {
      message.info('已勾选的报关单中存在已使用情况，无法删除，请确认后操作！');
      return false;
    }
  }
  return true;
}

ckbgdFunc.shjcFunc = (param: any, checkFlag: any = 'N') => {
  function funcCheckBgd(params: any) {
    unitRef.current!.setMasker(true);
    checkBgd(params).then(async (res) => {
      unitRef.current!.setMasker(false);
      const { body, code, desc } = res;
      if (code !== '200') {
        message.error(desc);
      } else {
        // 根据响应的结果判断是给出提示信息还是弹出维护页面
        const resData = JSON.parse(body);
        if ('N' == resData.msgKey) {
          message.success(resData.msgInfo);
          unitRef.current!.reload2();
        } else {
          if ('Y' == resData.errTypeHl) {
            const gridDataHl = JSON.parse(resData.gridDataHl);
            otherRef[4].current?.showModal(param, gridDataHl);
            return;
          } else if ('Y' == resData.errTypeSp) {
            const gridDataSp = JSON.parse(resData.gridDataSp);
            otherRef[3].current?.showModal(param, gridDataSp);
            return;
          } else if ('Y' == resData.msgLjDateKey) {
            message.error(resData.msgInfo);
          } else if ('Y' == resData.errTypeRe) {
            message.error(resData.gridDataRe);
            // 原系统代码
            // layui.myUtil.msgMore({
            //   msg: resData.gridDataRe,
            //   type: 'error'
            // });
          } else {
            message.error(resData.msgInfo);
          }
        }
      }
    })
  }

  const { otherRef, unitRef } = param;
  let params: any = {};
  let msg = '';
  let info = '';
  const selectionRowKeys = param?.selectionRowKeys;
  const searchModel = param?.unitRef?.current?.getGridParams()?.searchModel;
  params.bgdNoEterArray = null;
  if (selectionRowKeys == null || selectionRowKeys.length == 0) {
    // 未勾选
    searchModel.forEach((item: any) => {
      if (item.op === 'dydy') {
        params[item.property + 'Qs'] = moment(item.value).format('YYYY-MM-DD')
      } else if (item.op === 'xydy') {
        params[item.property + 'Jz'] = moment(item.value).format('YYYY-MM-DD')
        params['rangeDate' + item.property] = params[item.property + 'Qs'] + ' - ' + params[item.property + 'Jz'];
        delete params[item.property + 'Qs'];
        delete params[item.property + 'Jz'];
      } else {
        params[item.property] = item.value;
      }
    });
    info = '确认对当前筛选条件下所有数据进行数据检查操作？'
  } else {
    //勾选
    params.uuids = selectionRowKeys;
    info = '确认对当前勾选数据进行数据检查操作？';
    msg = '温馨提示：若未勾选数据，将会对当前筛选条件下的所有报关单数据，进行数据检查。';
  }
  // checkFlag用于记录本次数据已进行过一次数据检查
  if (checkFlag != 'Y') {
    DDAlert.open({
      title: '系统提示',
      info: info,
      infoType: 'warning',
      content: msg,
      closeStatus: true,
      okCallbackFn: function () {
        funcCheckBgd(params);
      },
    });
  } else {
    funcCheckBgd(params);
  }

}
const downloadGj = async (thisObj: any) => {
  thisObj.setState({ masker: true });
  let a = document.createElement('a');//创建一个a标签元素
  a.style.display = 'none';//设置元素不可见
  a.href = 'https://dditpublic.oss-cn-beijing.aliyuncs.com/SAASTOOLS_UPGRADE/SAASTOOLS2023_20230908/%E5%AE%A2%E6%88%B7%E7%AB%AF%E5%B7%A5%E5%85%B7.zip'; //设置下载地址
  document.body.appendChild(a);//加入
  a.click(); //触发点击,下载
  document.body.removeChild(a);//释放
  thisObj.setState({ masker: false });
}

ckbgdFunc.sjdrFunc = (param: any) => {



  const beforeUpload = (file: any) => {
    if (!file.name.toUpperCase().endsWith(".XML")) {
      message.info('上传文件必须是XML文件。');
      return Upload.LIST_IGNORE;
    }
    return false;
  }

  const { unitRef, otherRef } = param;
  DDAlert.open({
    title: '报关单导入',
    infoType: 'warning',
    modalType: 'form',
    closeStatus: false,
    isFormContent: true,
    width: 720,
    content: <>
      <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} label="文件选择" name="file" valuePropName="fileList" rules={[{ required: true, message: '请选择上传的文件' }]} getValueFromEvent={(e: any) => { if (Array.isArray(e)) { return e; } return e && e.fileList; }}>
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
      <div>从电子口岸下载的XML文件，需要通过客户端工具（
        <Button key={'xz'} type="link" onClick={() => downloadGj(DDAlert)}>下载</Button>
        ）解密后，进行关单导入。</div>
    </>,
    okCallbackFn: function (thisObj: any) {
      DDAlert.getForms().validateFields().then((values: any) => {
        if (values.file[0].originFileObj) {
          thisObj.setState({ masker: true });
          const formData = new FormData();
          formData.append('fileName', values.file[0].originFileObj);
          formData.append('file-name-suffix', values.file[0].name);
          uploadScHgCkbgdCj2(formData).then((response) => {
            const { code, desc, msg } = response;
            DDAlert.close();
            if (code === '200') {
              message.success(desc);
              unitRef.current!.reload2();
            } else if (code === '900') {
              message.error(msg);
            } else {
              message.error(desc);
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
// 配置项：更新信息
ckbgdFunc.gxxx = (param: any) => {
  const { selectionRows, unitRef } = param;
  let params: any = {};
  if (selectionRows.length > 0) { // 如果有选择数据就 更新选择数据
    let bgdNoEterArray: any = [];
    selectionRows.forEach((item: any) => {
      if (item.sybz != 'Y') {
        bgdNoEterArray.push(item.ckbgdh + '0' + item.xh4);
      }
    });
    params.bgdNoEterArray = bgdNoEterArray;
  } else { // 没有选择数据按照筛选条件检查数据
    const searchModel = unitRef.current?.getGridParams().searchModel;
    searchModel.forEach((item: any) => {
      params[item.property] = item.value;
    });
  }
  unitRef.current!.setMasker(true);
  updateBgdCzbz(params).then((res) => {
    unitRef.current!.setMasker(false);
    const { code, body } = res;
    if (code === '200') {
      message.success(body);
      unitRef.current!.reload2();
    } else {
      message.info(body.rtnMsg);
    }
  })
}


// 删除
ckbgdFunc.btnDelete = (param: any) => {
  const { selectionRowKeys, unitRef } = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
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
        bgdscDelete({ uuids: selectionRowKeys }).then((response) => {
          DDAlert.close();
          const { code, desc } = response;
          if (code === '200') {
            message.success(intl2.formatMessage({ id: 'message_delete_success' }));
            unitRef.current!.reload2();
          } else {
            message.error(desc);
          }
        })
      },
    });
  }
}


// ckbgdFunc.addbgdmx= (param: any,event:any) => {
//   const { unitRef, record, otherRef } = param;
//   otherRef[0].current?.showModal(unitRef, record,'add');
// }

// ckbgdFunc.editbgdmx= (param: any,event:any) => {
//   const { unitRef, record, otherRef,selectionRowKeys } = param;
//   if(selectionRowKeys.length == 0){
//     message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
//     return;
//   }
//   if(selectionRowKeys.length > 1){
//     message.info(intl2.formatMessage({ id: 'message_one_selected' }));
//     return;
//   }
//   otherRef[0].current?.showModal(unitRef, record,'edit');
// }

// 台账筛选
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
      <Button key={'excelmbxz'} onClick={() => ckbgdFunc.downloadExcel('SJGL_CKBGD_TZSX_PRINT_REPORT')}>Excel模板下载</Button>,
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
        <div style={{ marginLeft: '7px' }}>1. 请上传报关单台账Excel，文件中“报关单号”应为18位；</div>
        <div style={{ marginLeft: '7px' }}>2.  若多次上传，只保留最后一次上传的结果。</div>
      </div>
    </>,
    okCallbackFn: function (thisObj: any) {
      DDAlert.getForms().validateFields().then((values: any) => {
        if (values.file[0].originFileObj) {
          thisObj.setState({ masker: true });
          const formData = new FormData();
          formData.append('file', values.file[0].originFileObj);
          formData.append('fileName', values.file[0].name);
          formData.append('cdDm', '020301');
          bgdtzsx(formData).then((response: any) => {
            const { code, msg, body } = response;
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
                        <td width='30%'>{item.bgdhgbh}</td>
                        <td width='60%'>
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
                    width: 720,
                    closeStatus: false,
                    isFormContent: true,
                    content:
                      <>
                        <div style={{ marginTop: '10px' }}>本次导入台账中共{body?.drzs}张报关单，导入成功{body?.cgzs}张，导入失败{body?.sbzs}张。</div>
                        <table className={tableStyle.errorTable}>
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
                DDAlert.close();
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
ckbgdFunc.downloadExcel = (param: string) => {
  importTemplate({ sfBhsj: "N", sfScsm: "N", key: param }).then((response) => {
    if (response.code === '200') {
      const { blob, fileName } = response.body;
      myUtil.file.downloadExcel(blob, fileName);
    } else {
      message.error(response.desc);
    }
  })
}

// 表单校验
ckbgdFunc.validator = {
  // 所属期
  bgdhOnBlur: (form: any) => {
    const validator = async (_rule: any, value: any) => {
      const gridParams = { "uuid": form.getFieldValue('uuid'), "ckbgdh": form.getFieldValue('ckbgdh') };
      await checkCkbgdh(gridParams).then((res: any) => {
        const { code, msg } = res;
        if (code != '200') {
          return Promise.reject(new Error(msg));
        } else {
          return Promise.resolve();
        }
      })
      return Promise.resolve();
    }
    return { validator }
  },

}
// 表单事件：OnBlur
ckbgdFunc.eventOnBlur = {
  spdmOnblur: (form: any) => {
    const ckrq1 = moment(form?.form?.getFieldValue('ckrq1')).format('YYYY-MM-DD')
    const obj = { "ckspDm": form?.form?.getFieldValue('ckspDm'), "ssq": "", "ckrq1": ckrq1, "slType": "Y", "ckbgdh": "" };
    querySpdmXxCj(obj).then((res: any) => {
      const { code, msg, body } = res;
      if (code == '200') {
        form?.form?.setFieldsValue({
          ckspmc: body?.sbspmc,
          hgspmc: body?.sbspmc,
          sbjldwmc: body?.sbjldwmc
        });
      } else if (code == '900') {
        message.info(res.msg)
      } else {
        message.error(res.desc)
      }
    })

  }
}

ckbgdFunc.bgdscmx = (param: any, event: any) => {
  let flag = false;
  if (param.selectionRows.length > 0) {
    for (let i = 0; i < param.selectionRows.length; i++) {
      if (param.selectionRows[i].sybz == 'Y') {
        flag = true;
      }
      if (param.selectionRows[i].cytgbz != 'Y') {
        message.info('您勾选的数据中存在“未检查”的数据，请“数据检查”！');
        return;
      }
    }
  }
  if (flag) {
    DDAlert.open({
      title: '系统提示',
      info: '勾选数据中存在已使用数据，是否继续？',
      infoType: 'info',
      cancelText: '取消',
      isShowcancelText: false,
      okCallbackFn: function () {
        DDAlert.close();
        queryPagerXzrw({
          page: 1,
          pageSize: 9999,
          searchModel: [
            { property: 'sjgjsjDm', value: '010101', op: 'dd' }
          ]
        }).then((res) => {
          ckbgdFunc.openBgd(param);
        })
      },
    });
  } else {
    ckbgdFunc.openBgd(param);
  }

}

ckbgdFunc.openBgd = (param: any) => {
  const qylx = myUtil.sys.enterpriseType();
  let tsKey = '';
  if (qylx === 'WM') {
    tsKey = 'MTS_ZXSB_SB_MTS_TSSB_G';
  } else {
    tsKey = 'MDT_ZXSB_SB_MDT_TSSB_G';
  }
  const { otherRef } = param;
  DDAlert.open({
    title: '报关单生成明细',
    infoType: 'warning',
    modalType: 'form',
    closeStatus: false,
    isFormContent: true,
    content: <>
      <Form.Item label="业务名称" name="skr" initialValue={tsKey} >
        <Radio.Group id="ckhwtmsjsffDm" name="unit_key" >
          <Radio value={tsKey}>退税申报</Radio>
          <Radio value='ZMKJ_ZXSB_ZM_DLCK_G'>代理出口</Radio>
          <Radio value='ZGBA_ZXSB_BA_BMDLCKBA_G'>边贸代理</Radio>
        </Radio.Group>
      </Form.Item>
    </>,
    okCallbackFn: function (thisObj: any) {
      const unit_key = DDAlert.getContentFormData();
      param.unit_key = unit_key.skr;
      param.isuuids = true; // 打开生成出口明细弹窗时是否添加uuid为默认筛选条件，从本页面进入时添加
      otherRef[0].current?.showModal(param);
      DDAlert.close();
    },
  });
}


ckbgdFunc.openCkbgdh = (param: any, ckbgd: any) => {
  const { otherRef } = param;
  ckbgd = ckbgd.substring(0, 18);
  getBgdInfoHgck({ ckbgdh: ckbgd }).then((res: any) => {
    if (res.code == '200') {
      otherRef[1].current?.showModal(param, ckbgd, res?.body);
    }
  })
}

ckbgdFunc.openCkbgdh2 = (param: any, ckbgd: any) => {
  const { otherRef, record, unitRef} = param;
  unitRef.current!.setMasker(true);
  bgdpdfyl({ uuid: record?.uuid, bgdhgbh: record?.ckbgdh }).then((res: any) => {
    unitRef.current!.setMasker(false);
    if (res.code == '200') {
      otherRef[10].current?.showModal(res?.body, { uuid: record?.uuid, bgdhgbh: record?.ckbgdh });
    } else {
      message.error(res.msg);
    }
  })
}

// 关单获取
ckbgdFunc.openGdhqModal = (param: any) => {
  const otherRef = param.unitRef.current?.getOtherRefs();
  if (otherRef && otherRef[2]) {
    otherRef[2].current?.showModal(param);
  } else if (param.otherRef && param.otherRef[2]) {
    param.otherRef[2].current?.showModal(param);
  }
};

// 打印
ckbgdFunc.dyFunc = (param: any) => {
  const otherRef = param.unitRef.current?.getOtherRefs();
  otherRef[5].current?.showModal(param);
}

// 打印-固德威-单一窗口
ckbgdFunc.dyGdwFuncDy = (param: any) => {
  const otherRef = param.unitRef.current?.getOtherRefs();
  otherRef[9].current?.showModal(param, 'dy');
}

// 打印-固德威-电子打印
ckbgdFunc.dyGdwFuncDz = (param: any) => {
  const otherRef = param.unitRef.current?.getOtherRefs();
  otherRef[9].current?.showModal(param, 'dz');
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
  if(selectionRowKeys.length != 0){
    obj.searchModel.push({
      "type": 1,
      "property": "uuids",
      "value": selectionRowKeys,
      "op": "zdy"
  })
  }
  unitRef.current!.setMasker(true);
  cxxj(obj).then((res: any) => {
    unitRef.current!.setMasker(false);
    if (res.code == '200') {
      otherRef[11].current?.showModal({gridData:res?.body?.rows});
    }else{
      message.error(res.msg);
    }
  })
}

ckbgdFunc.cjbzXj = (param: any) => {
  const {gridRef, unitRef, selectionRowKeys} = param;
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
  if(selectionRowKeys.length != 0){
    obj.searchModel.push({
      "type": 1,
      "property": "uuids",
      "value": selectionRowKeys,
      "op": "zdy"
    })
  }
  unitRef.current!.setMasker(true);
  sjglCkbgdcxCjbzxj(obj).then((res: any) => {
    unitRef.current!.setMasker(false);
    if (res.code == '200') {
      DDAlert.open({
        title: '成交币制小计',
        okText: '关闭',
        closeStatus: false,
        isFormContent: false,
        isTableContent: true,
        tableData: res?.body,                    // content为table时 Data
        tableColumns: [{
          title: '成交币制',
          dataIndex: 'cjhghbzmDm',
          key: 'cjhghbzmDm',
        }, {
          title: '报关单张数',
          dataIndex: 'bgdzs',
          key: 'bgdzs',
          align: 'right'
        }, {
          title: '报关单条数',
          dataIndex: 'bgdts',
          key: 'bgdts',
          align: 'right'
        }, {
          title: '成交金额合计',
          dataIndex: 'sumCjzj',
          key: 'sumCjzj',
          align: 'right'
        }],
        width: pro.c_modal_width_x4,
        okCallbackFn: function (thisObj: any) {
          DDAlert.close();
        },
      });
    } else {
      message.error(res.msg);
    }
  })
}

ckbgdFunc.sjxz = async (parma: any) => {
  await hgsjxz(parma).then(async (res) => {
    const { body, code, msg } = res;
    if ('200' == code) {
      DDAlert.open({
        title: '系统提示',
        info: '创建任务成功，是否跳转任务管理？',
        infoType: 'question',
        modalType: 'confirm',
        okCallbackFn: function (thisObj: any) {
          history.push({ pathname: '/02/0201' });
        },
      });
    } else {
      message.error(msg);
    }
  });
}

// 批量修改---是否退税
ckbgdFunc.btnSetSfts = async (param: any) => {
  const { selectionRowKeys, unitRef } = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  } else {
    DDAlert.open({
      title: '退税类型',
      infoType: 'info',
      modalType: 'form',
      closeStatus: false,
      isFormContent: true,
      content: <>
        <Form.Item name="bgdcllxDm" initialValue={'4'} label="选择退税类型" rules={[{ required: true, message: '请选择退税类型' }]} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
          <Radio.Group >
            <Radio value="4">免税</Radio>
            <Radio value="5">征税</Radio>
            <Radio value="0">退税</Radio>
          </Radio.Group>
        </Form.Item>
      </>,
      okCallbackFn: function (thisObj: any) {
        DDAlert.getForms().validateFields().then((values: any) => {
          const bgdcllxDm = values.bgdcllxDm;
          thisObj.setState({ masker: true });
          if ("4" == bgdcllxDm || "5" == bgdcllxDm) {
            bgdzbts({uuids: selectionRowKeys, bgdcllxDm: bgdcllxDm}).then((response: any) => {
              DDAlert.close();
              thisObj.setState({ masker: false });
              const { code, msg } = response;
              if (code === '200') {
                message.success('操作成功！');
                unitRef.current!.reload2();
              } else {
                message.error(msg);
              }
            })
          } else {
            btssjZts({ uuids: selectionRowKeys }).then((response: any) => {
              DDAlert.close();
              thisObj.setState({ masker: false });
              const { code, msg } = response;
              if (code === '200') {
                message.success('操作成功！');
                unitRef.current!.reload2();
              } else {
                message.error(msg);
              }
            })
          }
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
          batchSetBgd({ szlx: 'ywbh', uuids: selectionRowKeys, ywbh: values.ywbh }).then((response: any) => {
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
          batchSetBgd({ szlx: 'bq', uuids: selectionRowKeys, bqsm: values.bqsm }).then((response: any) => {
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

// 同步结关状态（报关单）
ckbgdFunc.handleBgdTbjgzt = async (param: any) => {
  const { unitRef, otherRef } = param;
  const bgdsjly = myUtil.sys.bgdsjlyType();
  let params = {
    sjgjsjDms: ['070000'],
    icCardPsw: '',
    fgcfsjbz: "Y",
    sftstxbz: "N",
    bgdlx: "",
    csz1: "",
    csz2: "",
    czfdm: "04",
    gxckfphbz: "N",
    tjzdmc: "-"
  };
  const kakxx: any = [];
  queryKak({}).then((res: any) => {
    const { code, msg, body } = res;
    if (code === '200') {
      for (let i = 0; i < body.length; i++) {
        if (body[i].sdbz == 'N') {
          const op = { value: '', label: '' };
          op.label = body[i].kakbm;
          op.value = body[i].kakuuid;
          kakxx.push(op);
        }
      }
      DDAlert.open({
        title: '同步结关状态',
        infoType: 'info',
        closeStatus: false,
        isFormContent: true,
        modalType: 'form',
        content: <>
          <Form.Item name="kakuuid" label="海关IC卡" rules={[{ required: true, message: '请选择口岸卡!' }]}>
            <Select
              style={{ width: 230 }}
              options={kakxx}
            >
            </Select>
          </Form.Item>
        </>,
        okCallbackFn: function (thisObj: any) {
          const param = params;
          DDAlert.getForms().validateFields().then(async (values: any) => {
            thisObj.setState({ masker: true });
            await xzrwjy(param).then(async (res) => {
              thisObj.setState({ masker: false });
              const { body, code, msg } = res;
              if ('200' == code) {
                if ('6' === bgdsjly) {
                  otherRef[12].current?.showModal(param, values.kakuuid);
                  DDAlert.close();
                } else {
                  thisObj.setState({ masker: true });
                  await khdgjUtil.checkIsExistTask(values.kakuuid).then(async (res: any) => {
                    thisObj.setState({ masker: false });
                    if (res == 'Y') {
                      params.kakuuid = values.kakuuid;
                      ckbgdFunc.sjxz(params);
                      DDAlert.close();
                    } else if (res == 'E') {
                      // message.error('客户端工具连接失败。');
                      // return;
                      DDAlert.close();
                      DDAlert.open({
                        title: '提示信息',
                        info: `客户端工具运行异常，建议尝试以下解决方案：`,
                        infoType: 'warning',
                        okText: '下载工具',
                        closeStatus: false,
                        content: <>
                          <div style={{ height: '105', lineHeight: '35px' }}>
                            <div>（1）若已下载最新版本客户端工具，请运行启动客户端工具；</div>
                            <div>（2）若未下载最新版本客户端工具，请下载工具；</div>
                            <div>（3）请确保当前电脑可以登录国际贸易单一窗口</div>
                          </div>
                        </>,
                        button: [
                          <Button key='close' onClick={() => DDAlert.close()}>关闭</Button>,
                          // <Button type="primary" key={'excelmbxz'} onClick={() => ckbgdFunc.downloadKhdgj(thisObj)}>下载IC卡客户端控件</Button>,
                        ],
                        okCallbackFn: async function (thisObj: any) {
                          thisObj.setState({ customerBtnLoading: true });
                          let a = document.createElement('a');//创建一个a标签元素
                          a.style.display = 'none';//设置元素不可见
                          a.href = 'https://dditpublic.oss-cn-beijing.aliyuncs.com/SAASTOOLS_UPGRADE/SAASTOOLS2023_20230908/%E5%AE%A2%E6%88%B7%E7%AB%AF%E5%B7%A5%E5%85%B7.zip'; //设置下载地址
                          document.body.appendChild(a);//加入
                          a.click(); //触发点击,下载
                          document.body.removeChild(a);//释放
                          thisObj.setState({ customerBtnLoading: false });
                        }
                      });
                    }
                    else {
                      // 打开环境监测页面
                      const bgdsjly = myUtil.sys.bgdsjlyType();
                      // if(bgdsjly === '4'){
                      //   otherRef[7].current!.showModal({ param }, values.kakuuid);
                      // } else {
                      //   otherRef[6].current!.showModal({ param }, values.kakuuid);
                      // }
                      otherRef[6].current!.showModal({ param }, values.kakuuid);
                      DDAlert.close();
                    }
                  }).catch((err: any) => {
                    message.error(err);
                  }).finally(() => {
                    thisObj.setState({ masker: false });
                  });
                }
              } else {
                message.error(msg);
              }
            }).catch((err: any) => {
              message.error(err);
            }).finally(() => {
              thisObj.setState({ masker: false });
            });
          })
        },
      });
    } else {
      message.error(msg);
    }
  });
  // ckbgdFunc.downloadKhdgj = async (thisObj: any) => {
  //   thisObj.setState({ masker: true });
  //   const params = {
  //     accessClientId: 'dditSaas',
  //     staticFilexx: 'hgickkj.exe',
  //   }
  //   await cktsUtil.downloadFileCkts('/yw/bszx/wbsj/bgd/khdgjXzGet/', params)
  //   thisObj.setState({ masker: false });
  // }
    // 下载驱动（在线）
    ckbgdFunc.downloadKhdgj = async (thisObj: any) => {
      thisObj.setState({ masker: true });
      let a = document.createElement('a');//创建一个a标签元素
      a.style.display = 'none';//设置元素不可见
      a.href = 'https://dditpublic.oss-cn-beijing.aliyuncs.com/SAASTOOLS_UPGRADE/SAASTOOLS2023_20230908/%E5%AE%A2%E6%88%B7%E7%AB%AF%E5%B7%A5%E5%85%B7.zip'; //设置下载地址
      document.body.appendChild(a);//加入
      a.click(); //触发点击,下载
      document.body.removeChild(a);//释放
      thisObj.setState({ masker: false });
    }
}

// 缺失检查（报关单）
ckbgdFunc.handleBgdQsjc = async (param: any) => {
  const { otherRef } = param;
  let params = {
    sjgjsjDms: ['010106'],
    icCardPsw: '',
    fgcfsjbz: "Y",
    sftstxbz: "N",
    bgdlx: "",
    csz1: "",
    csz2: "",
    czfdm: "04",
    gxckfphbz: "N",
    tjzdmc: "出口年月"
  };
  const kakxx: any = [];
  queryKak({}).then((res: any) => {
    const { code, msg, body } = res;
    if (code === '200') {
      for (let i = 0; i < body.length; i++) {
        if (body[i].sdbz == 'N') {
          const op = { value: '', label: '' };
          op.label = body[i].kakbm;
          op.value = body[i].kakuuid;
          kakxx.push(op);
        }
      }
      DDAlert.open({
        title: '缺失检查',
        infoType: 'info',
        closeStatus: false,
        isFormContent: true,
        modalType: 'form',
        content: <>
          <Form.Item name="kakuuid" label="海关IC卡" rules={[{ required: true, message: '请选择口岸卡!' }]}>
            <Select
              style={{ width: 220 }}
              options={kakxx}
            >
            </Select>
          </Form.Item>
          <Form.Item label="出口年月" name="ckny" rules={[{required: true, message: ''}, businessValidator.ssq()]}>
            <Input placeholder="请输入出口年月" />
          </Form.Item>
          <>
            <div>说明：对系统已存在的数据与电子口岸的数据进行比对，检查数据是否缺失，报关状态是否更新。</div>
          </>
        </>,
        okCallbackFn: function (thisObj: any) {
          const param = params;
          DDAlert.getForms().validateFields().then(async (values: any) => {
            params['csz1'] = values.ckny;
            thisObj.setState({ masker: true });
            await xzrwjy(param).then(async (res) => {
              const { code, msg } = res;
              if ('200' == code) {
                await khdgjUtil.checkIsExistTask(values.kakuuid).then(async (res: any) => {
                  if (res == 'Y') {
                    params['kakuuid'] = values.kakuuid;
                    ckbgdFunc.sjxz(params);
                    DDAlert.close();
                  } else if (res == 'E') {
                    DDAlert.close();
                    DDAlert.open({
                      title: '提示信息',
                      info: `客户端工具运行异常，建议尝试以下解决方案：`,
                      infoType: 'warning',
                      okText: '下载工具',
                      closeStatus: false,
                      content: <>
                        <div style={{ height: '105', lineHeight: '35px' }}>
                          <div>（1）若已下载最新版本客户端工具，请运行启动客户端工具；</div>
                          <div>（2）若未下载最新版本客户端工具，请下载工具；</div>
                          <div>（3）请确保当前电脑可以登录国际贸易单一窗口</div>
                        </div>
                      </>,
                      button: [
                        <Button key='close' onClick={() => DDAlert.close()}>关闭</Button>,
                        // <Button type="primary" key={'excelmbxz'} onClick={() => ckbgdFunc.downloadKhdgj(thisObj)}>下载IC卡客户端控件</Button>,
                      ],
                      okCallbackFn: async function (thisObj: any) {
                        thisObj.setState({ customerBtnLoading: true });
                        let a = document.createElement('a');//创建一个a标签元素
                        a.style.display = 'none';//设置元素不可见
                        a.href = 'https://dditpublic.oss-cn-beijing.aliyuncs.com/SAASTOOLS_UPGRADE/SAASTOOLS2023_20230908/%E5%AE%A2%E6%88%B7%E7%AB%AF%E5%B7%A5%E5%85%B7.zip'; //设置下载地址
                        document.body.appendChild(a);//加入
                        a.click(); //触发点击,下载
                        document.body.removeChild(a);//释放
                        thisObj.setState({ customerBtnLoading: false });
                      }
                    });
                  } else {
                    // 打开环境监测页面
                    otherRef[6].current!.showModal({ param }, values.kakuuid);
                    DDAlert.close();
                  }
                })
              } else {
                message.error(msg);
              }
            });
            thisObj.setState({ masker: false });
          })
        },
      });
    } else {
      message.error(msg);
    }
  });
}

// 备案单证检查（报关单）
ckbgdFunc.handleBgdBadzqsjc = async (param: any) => {
  const {} = param;
  let badzlxMr = ['010301', '020101', '020103'];
  const badzlxLs = myUtil.localStore.getItem('SJGL_HGSJCX_CKHWBGD_BADZQSJC_BADZLX');
  if (badzlxLs) {
    badzlxMr = badzlxLs;
  }
  DDAlert.open({
    title: '备案单证检查',
    infoType: 'info',
    closeStatus: false,
    isFormContent: true,
    modalType: 'form',
    width: 650,
    content: <>
      <Form.Item label="出口年月" name="ckny" rules={[{required: true, message: ''}, businessValidator.ssq()]}>
        <Input placeholder="请输入出口年月" />
      </Form.Item>
      <Form.Item label="单证类型" name='badzlx' rules={[{required: true, message: '请选择单证类型'},]} initialValue={badzlxMr}>
        <Checkbox.Group options={[
          {label: '委托报关协议', value: '010301'},
          {label: '出口报关单', value: '020101'},
          {label: '无纸化放行通知书', value: '020103'},
        ]}/>
      </Form.Item>
      <>
        <div>说明：仅支持比对报关状态为已结关的报关单数据。</div>
      </>
    </>,
    okCallbackFn: function (thisObj: any) {
      const params =  {
        sjgjsjDms: ['010112'], // 备案单证检查
        icCardPsw: '',
        fgcfsjbz: "Y",
        sftstxbz: "N",
        bgdlx: "",
        csz1: "",
        csz2: "",
        czfdm: "04",
        gxckfphbz: "N",
        tjzdmc: "出口年月"
      };
      DDAlert.getForms().validateFields().then(async (values: any) => {
        params['csz1'] = values.ckny;
        params['badzlx'] = values?.badzlx ? values?.badzlx : [];
        myUtil.localStore.setItem('SJGL_HGSJCX_CKHWBGD_BADZQSJC_BADZLX', params['badzlx']);
        thisObj.setState({ masker: true });
        xzrwjy(params).then(async (res) => {
          const { code, msg } = res;
          if ('200' == code) {
            DDAlert.close();
            ckbgdFunc.sjxz(params);
            thisObj.setState({ masker: false });
          } else {
            thisObj.setState({ masker: false });
            message.error(msg);
          }
        });
      })
    },
  });
}

// 报关单导入
ckbgdFunc.importWj = async (param: any) => {
  const { unitRef } = param;
  const beforeUpload = (file: any) => {
    const isLt2M = file.size;
    if (isLt2M > 10485760) {
      message.info('上传文件不能超过10M。');
      return Upload.LIST_IGNORE;
    }
    if (!file.name.toUpperCase().endsWith(".XML")) {
      message.info('请上传XML文件。');
      return Upload.LIST_IGNORE;
    }
    return false;
  }
  DDAlert.open({
    title: '报关单导入',
    infoType: 'warning',
    modalType: 'form',
    closeStatus: false,
    isFormContent: true,
    width: 720,
    content: <>
      <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} label="文件选择" name="file" valuePropName="fileList" rules={[{ required: true, message: '请选择上传的文件' }]} getValueFromEvent={(e: any) => { if (Array.isArray(e)) { return e; } return e && e.fileList; }}>
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
      <div>从电子口岸下载的XML文件，需要通过客户端工具（
        <Button key={'xz'} type="link" onClick={() => downloadGj(DDAlert)}>下载</Button>
        ）解密后，进行关单导入。</div>
    </>,
    okCallbackFn: function (thisObj: any) {
      DDAlert.getForms().validateFields().then((values: any) => {
        if (values.file[0].originFileObj) {
          thisObj.setState({ masker: true });
          const formData = new FormData();
          formData.append('fileName', values.file[0].originFileObj);
          formData.append('file-name-suffix', values.file[0].name);
          drJ4HgCkbgd(formData).then((response: any) => {
            const { code, msg, body } = response;
            thisObj.setState({ masker: false });
            DDAlert.close();
            if (code === '200') {
              message.success(body?.msgInfo);
              unitRef.current!.reload2();
            } else if (code === '900') {
              message.error(msg);
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
// 列表自定义渲染
ckbgdFunc.columnsRender = {
  // 开票状态
  renderCkfpSjxzBgdKpzt: (param: any) => {
    let col: any = <></>;
    if (param.text === '2') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="default" />{'未开票'}
        </span>
      );
    } else {
      col = (
        <span className="dd_grid_icon">
          <Badge status="success" />{'已开票'}
        </span>
      )
    }
    return col;
  },
  // 信息状态
  renderCkfpSjxzBgdXxzt: (param: any) => {
    let col: any = <></>;
    if (param.text === 'Y') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="success" />{'信息齐全'}
        </span>
      );
    } else if (param.text === 'N') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="error" />{'信息不齐'}
        </span>
      )
    } else {
      col = (
        <span className="dd_grid_icon">
          <Badge status="default" />{'未检测'}
        </span>
      )
    }
    return col;
  },
  renderBgdscmxbgdhSjgl: (param: any) => {
    return <a onClick={(e) => { e.stopPropagation(); ckbgdFunc.openCkbgdh2(param, param?.text) }}>{param?.text}</a>;
  },
  renderBgdscmx18bgdh: (param: any) => {
    const syzt = param?.record.sybz; // Y=已使用 为绿色
    // const gdxx = param?.record.czbz1; // 关单信息 N=不存在; Y=存在
    const ckbgdh = param?.text;
    const html = [];
    html.push(syzt === 'Y' ? <Badge status="success" key={param?.record.uuid.toString() + 'success1'} /> : <Badge status="error" key={param?.record.uuid.toString() + 'error1'} />);
    // html.push(gdxx === 'Y' ? <Badge status="success" key={param?.record.uuid.toString() + 'success2'} /> : <Badge status="error" key={param?.record.uuid.toString() + 'error2'} />);
    html.push(<a onClick={(e) => { e.stopPropagation(); ckbgdFunc.openCkbgdh2(param, ckbgdh) }}>{ckbgdh}</a>);
    // 列表列tooltip
    const tip = () => {
      const info = [];
      info.push(
        syzt === 'N' ? (
          <div>使用状态：<Badge status="error" key={param?.record.uuid.toString() + 'error3'} />未使用</div>
        ) : (
          <div>使用状态：{<Badge status="success" key={param?.record.uuid.toString() + 'success3'} />}已使用</div>
        ),
      );
      // info.push(
      //   gdxx === 'Y' ? <div>关单信息：<Badge status="success" key={param?.record.uuid.toString() + 'success4'} />存在</div> : <div>关单信息：<Badge status="error" key={param?.record.uuid.toString() + 'error4'} />不存在</div>,
      // );
      return info;
    };
    const html2 = <Tooltip title={() => tip()}>{html}</Tooltip>;
    return html2;
  },
}
export default ckbgdFunc;
