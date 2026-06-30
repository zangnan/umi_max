import React from 'react';
import { getBgdInfoHgck, plxgckfph, plxgckspDm, plxgYfzssl, queryPager, bgdtzsx, importTemplate, bgdpdfyl } from '@/pages/hts/services/htsApi';
import DDAlert from '@/pages/hts/components/DDAlert';
import {Form, Input, message, InputNumber, Upload, Button} from 'antd';
import { intl, intl as intl2 } from '@/components/DDAssist/util';
import baseValidator from '@/components/DDAssist/field/baseValidator';
import Tooltip from "antd/es/tooltip";
import myUtil from '@/components/DDAssist/util';
import importStyle from './importStyle.less';
import { ClockCircleOutlined, InboxOutlined } from '@ant-design/icons';
import CkbgdFunc from "../../common/CkbgdFunc";

const { Dragger } = Upload;

const bgdKsyFunc: any = {
  unitRef: React.createRef(),
};

// 关单信息状态标志
bgdKsyFunc.columnsRender= {
  renderBgdscmx18bgdh: (param: any) => {
    const ckbgdh = param?.text;
    const html = <a onClick={(e)=>{ e.stopPropagation();bgdKsyFunc.openCkbgdh2(param, ckbgdh)}}>{ckbgdh}</a>;
    const html2 = <Tooltip title={ckbgdh}>{html}</Tooltip>;
    return html2;
  },
};

bgdKsyFunc.openCkbgdh = (param: any, ckbgd: any) => {
  const {otherRef } = param;
  ckbgd = ckbgd.substring(0, 18);
  getBgdInfoHgck({ckbgdh: ckbgd}).then((res: any) => {
    if (res.code == '200') {
      otherRef[0].current?.showModal(param, ckbgd, res?.body);
    }
  })
};

bgdKsyFunc.openCkbgdh2 = (param: any, ckbgd: any) => {
  const { otherRef, record, unitRef} = param;
  unitRef.current!.setMasker(true);
  bgdpdfyl({ uuid: record?.uuid, bgdhgbh: record?.bgdhgbh }).then((res: any) => {
    unitRef.current!.setMasker(false);
    if (res.code == '200') {
      otherRef[0].current?.showModal(res?.body, { uuid: record?.uuid, bgdhgbh: record?.bgdhgbh });
    } else {
      message.error(res.msg);
    }
  })
}

// 生成明细报表
bgdKsyFunc.produceDetailsReport = (param: any) => {
  const { unitRef } = param;
  const gridData = unitRef.current?.getGridData();
  if (gridData.length === 0) {
    message.info(intl.formatMessage({ id: 'message_common_type_no_griddata' }));
    return;
  }
  const otherRef = param.unitRef.current?.getOtherRefs();
  if (otherRef) {
    otherRef[2].current?.showModal(param, '6');
  }
};

// 批量修改出口发票号
bgdKsyFunc.ckfphPlxg = (param: any) => {
  const {unitRef, selectionRowKeys, gridRef} = param;
  const gridData = unitRef.current?.getGridData();
  if (gridData.length === 0) {
    message.info(intl2.formatMessage({id: 'message_common_type_no_griddata'}));
    return;
  }
  const searchModel = unitRef.current?.getGridParams().searchModel || [];
  const headerSearchModel = gridRef.current?.getHeaderFilter() || [];
  const allSearchModel: any = searchModel.concat(headerSearchModel);
  allSearchModel.push({property: 'cxlx', value: '6', op: 'zdy'});
  allSearchModel.push({ property: 'sfcxZj', value: "Y", op: 'zdy' });
  allSearchModel.push({ property: 'cdDm', value: "25020103", op: 'zdy' });
  let uuids: any = [];
  DDAlert.open({
    title: '批量修改',
    infoType: 'warning',
    modalType: 'form',
    closeStatus: false,
    isFormContent: true,
    content: <>
      <Form.Item label="出口发票号" name="ckfph" rules={[{required: true, message: '请输入出口发票号'}, validatorFlag.ckfph, baseValidator.range2({ min: 0, max: 30 })]}>
        <Input placeholder="请输入出口发票号" />
      </Form.Item>
    </>,
    okCallbackFn: function (thisObj: any) {
      DDAlert.getForms().validateFields().then((values: any) => {
        if (values) {
          if (selectionRowKeys.length === 0) {
            // 走获取全部uuid的接口
            const obj = {
              page: 1,
              pageSize: 999999,
              key: 'WBSJ_CKBGD_QUERY_PAGE',
              searchModel: allSearchModel,
            }
            queryPager(obj).then((res: any) => {
              const {code, body, msg} = res;
              if (code === '200') {
                uuids = body.rows;
                const obj2 = {
                  uuids,
                  ywlx: 'ckbgd',
                  ckfph: values.ckfph
                }
                plxgckfphApi(obj2, unitRef)
              } else {
                message.error(msg)
              }
            })
          } else {
            uuids = selectionRowKeys;
            const obj2 = {
              uuids,
              ywlx: 'ckbgd',
              ckfph: values.ckfph
            }
            plxgckfphApi(obj2, unitRef)
          }
        }
      })
    }
  })
}

// 批量修改出口发票号接口
const plxgckfphApi = (params: any, unitRef: any) => {
  plxgckfph(params).then((res: any) => {
    const {code, msg} = res;
    if (code === '200') {
      message.success(intl.formatMessage({ id: 'message_common_batchedit_success' }));
      unitRef.current!.reload2();
      unitRef.current?.setSelectionRowKeys([]);
      unitRef.current?.setSelectionRows([]);
      DDAlert.close();
    } else {
      message.error(msg)
    }
  })
};

// 批量修改出口商品代码
bgdKsyFunc.ckspdmPlxg = (param: any) => {
  const { unitRef, selectionRowKeys } = param;
  if (selectionRowKeys.length === 0) {
    message.info(intl.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  DDAlert.open({
    title: '批量修改',
    closeStatus: false,
    isFormContent: true,
    infoType: 'form',
    modalType: 'form',
    content:
      <>
        <Form.Item label="出口商品代码" name="ckspDm" rules={[{ required: true, message: '请输入出口商品代码' }, baseValidator.number()]} >
          <Input placeholder="请输入出口商品代码" style={{ width: 230 }}></Input>
        </Form.Item>
      </>,
    //#region 回调方法
    okCallbackFn: function () {
      DDAlert.getForms().validateFields().then((values: any) => {
        const obj = {
          uuids: selectionRowKeys,
          ckspDm: values.ckspDm,
          ywlx: "ckbgd",
        }
        plxgckspDm(obj).then((res: any) => {
          const { code, msg, body } = res;
          if (code === '200') {
            DDAlert.close();
            message.success(body)
            unitRef.current!.reload2();
            unitRef.current?.setSelectionRowKeys([]);
            unitRef.current?.setSelectionRows([]);
          } else if (code === '900') {
            if (body === '' || body === null) {
              message.error(msg);
            } else {
              //#region  失败展示页面
              const otherRef = param.unitRef.current?.getOtherRefs();
              if (otherRef) {
                otherRef[3].current?.showModal(body, 'ckspDm', '批量修改');
              }
              //#endregion
            }
          }
        })
      })
    }
    //#endregion
  })
}

// 批量修改运费折算数量
bgdKsyFunc.yfzsslPlxg = (param: any) => {
  const {unitRef, selectionRowKeys, gridRef} = param;
  const gridData = unitRef.current?.getGridData();
  if (gridData.length === 0) {
    message.info(intl2.formatMessage({id: 'message_common_type_no_griddata'}));
    return;
  }
  const searchModel = unitRef.current?.getGridParams().searchModel || [];
  const headerSearchModel = gridRef.current?.getHeaderFilter() || [];
  const allSearchModel: any = searchModel.concat(headerSearchModel);
  allSearchModel.push({property: 'cxlx', value: '6', op: 'zdy'});
  allSearchModel.push({property: 'sfcxZj', value: "Y", op: 'zdy'});
  allSearchModel.push({property: 'cdDm', value: "25020103", op: 'zdy'});
  let uuids: any = [];
  DDAlert.open({
    title: '批量修改',
    infoType: 'warning',
    modalType: 'form',
    closeStatus: false,
    isFormContent: true,
    content: <>
      <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="运费折算数量（吨）" name="yfzssl" rules={[{required: true, message: '请输入运费折算数量（吨）'}, baseValidator.numberFloat()]}>
        <InputNumber placeholder="请输入运费折算数量（吨）" min={0.00001} max={9999999999.99999} formatter={(value: any, info: any)=>{return inputNumperFormatter(value, info, '0,0.00000')}}></InputNumber>
      </Form.Item>
    </>,
    okCallbackFn: function (thisObj: any) {
      DDAlert.getForms().validateFields().then((values: any) => {
        if (values) {
          if (selectionRowKeys.length === 0) {
            // 走获取全部uuid的接口
            const obj = {
              page: 1,
              pageSize: 999999,
              key: 'WBSJ_CKBGD_QUERY_PAGE',
              searchModel: allSearchModel,
            }
            queryPager(obj).then((res: any) => {
              const {code, body, msg} = res;
              if (code === '200') {
                uuids = body.rows;
                values.yfzssl = Number(myUtil.text.formatNum(values.yfzssl, '0.00000'));
                const obj2 = {
                  uuids,
                  yfzssl: values.yfzssl
                }
                plxgyfzsslApi(obj2, unitRef, thisObj)
              } else {
                message.error(msg)
              }
            })
          } else {
            uuids = selectionRowKeys;
            values.yfzssl = Number(myUtil.text.formatNum(values.yfzssl, '0.00000'));
            const obj2 = {
              uuids,
              yfzssl: values.yfzssl
            }
            plxgyfzsslApi(obj2, unitRef, thisObj)
          }
        }
      })
    }
  })
}

// 批量修改运费折算数量接口
const plxgyfzsslApi = (params: any, unitRef: any, thisObj: any) => {
  thisObj.setState({ masker: true });
  plxgYfzssl(params).then((res: any) => {
    thisObj.setState({ masker: false });
    const {code, msg} = res;
    if (code === '200') {
      message.success(intl.formatMessage({ id: 'message_common_batchedit_success' }));
      unitRef.current!.reload2();
      unitRef.current?.setSelectionRowKeys([]);
      unitRef.current?.setSelectionRows([]);
      DDAlert.close();
    } else {
      message.error(msg)
    }
  })
};

// 批量修改汇率
bgdKsyFunc.btnPlXgHl = (param: any) => {
  const { unitRef, selectionRowKeys, otherRef } = param;
  if (selectionRowKeys.length === 0) {
    message.info(intl.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  const obj2 = {
    searchModel: [
      { property: 'uuids', values: selectionRowKeys, op: 'zdy' },
      { property: 'xgbz', values: 'ksy', op: 'zdy' },
    ],
    key: 'WBSJ_CKBGD_PLXGHLABZ_QUERY_PAGER'
  }
  otherRef[1].current?.showModal(unitRef, selectionRowKeys, null, obj2);
};

// 转不退税
bgdKsyFunc.btnZbts = (param: any) => {
  CkbgdFunc.btnZbts(param, null);
  /*const { unitRef, selectionRowKeys } = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  DDAlert.open({
    title: '转不退税',
    info: '确定对勾选数据进行转不退税操作吗？',
    modalType: 'confirm',
    infoType: 'question',
    okCallbackFn: function (thisObj: any) {
      thisObj.setState({ masker: true });
      const data = { uuids: selectionRowKeys };
      bgdzbts(data).then((response: any) => {
        thisObj.setState({ masker: false });
        const { code, msg } = response;
        if (code === '200') {
          message.success('转不退税成功！');
          close();
          unitRef.current!.reload2();
        } else {
          message.error(msg);
        }
      })
    }
  })*/
}


// 台账筛选
bgdKsyFunc.importTzsx = async (param: any) => {
  const { unitRef } = param;
  const beforeUpload = (file: any) => {
    const isLt2M = file.size;
    if(isLt2M > 10485760) {
      message.info('上传文件不能超过10M。');
      return Upload.LIST_IGNORE;
    }
    if(!file.name.toUpperCase().endsWith(".XLS") && !file.name.toUpperCase().endsWith(".XLSX") ) {
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
      <Button key={'excelmbxz'} onClick={() => bgdKsyFunc.downloadExcel('SJGL_CKBGD_TZSX_PRINT_REPORT')}>Excel模板下载</Button>,
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
                <td width="20%" className={importStyle.textCenter}>{myUtil.text.formatNum(file.size?(file.size/1024):0, '0,0')}KB</td>
                <td width="18%" className={importStyle.textCenter}><ClockCircleOutlined />&nbsp;待上传</td>
                <td width="17%" className={importStyle.textCenter}><a onClick={()=>actions.remove()}>删除</a></td>
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
      <div style={{color:"#E51C23"}}>
        <p>导入说明：</p>
        <div style={{marginLeft:'7px'}}>1. 请上传报关单台账Excel，文件中“报关单号”应为18位；</div>
        <div style={{marginLeft:'7px'}}>2.  若多次上传，只保留最后一次上传的结果。</div>
      </div>
    </>,
    okCallbackFn: function (thisObj: any) {
      DDAlert.getForms().validateFields().then((values: any) => {
        if(values.file[0].originFileObj) {
          thisObj.setState({ masker: true });
          const formData = new FormData();
          formData.append('file', values.file[0].originFileObj);
          formData.append('fileName', values.file[0].name);
          formData.append('cdDm', '25020103');
          bgdtzsx(formData).then((response: any) => {
            const { code, msg, body} = response;
            if (code === '200') {
              // 台账数据筛选 赋值
              unitRef.current?.addQueryModel("Y", 'tzsxbz');
              if(body?.sbzs != 0) {
                // 业务校验
               const sbyyList = body?.sbmx || [];
               const textAreaValues: any = []
               if(sbyyList.length > 0) {
                 sbyyList.forEach((item: any, index: any) => {
                   textAreaValues.push(
                   <tr>
                     <td width='10%' style={{textAlign: 'center'}}>{index + 1}</td>
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
                   title: '台账筛选',
                   modalType: 'form',
                   width: 720,
                   closeStatus: false,
                   isFormContent: true,
                   content:
                   <>
                     <div style={{marginTop:'10px'}}>本次导入台账中共{body?.drzs}张报关单，导入成功{body?.cgzs}张，导入失败{body?.sbzs}张。</div>
                     <table className={importStyle.errorTable}>
                       <tr style={{backgroundColor: '#FAFAFA'}}>
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
            } else{
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
bgdKsyFunc.downloadExcel = (param: string) => {
  importTemplate({sfBhsj:"N",sfScsm:"N", key: param }).then((response) => {
    if (response.code === '200') {
      const { blob, fileName } = response.body;
      myUtil.file.downloadExcel(blob, fileName);
    } else {
      message.error(response.desc);
    }
  })
}

// 校验
const validatorFlag = {
  ckfph: (form: any) => {
    const validator = async (_rule: any, value: any) => {
      if (value && /[\u4E00-\u9FA5]/g.test(value) || value && /\s/.test(value)) {
        return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_english_number_symbol' })));
      } else {
        return Promise.resolve();
      }
    }
    return { validator };
  },
}

const inputNumperFormatter = (value: any, info: any, format: any) => {
  if (info.userTyping) {
    if (info.input) {
      return info.input;
    } else {
      if (value) {
        return value;
      }
      return '';
    }
  } else {
    if (value) {
      return myUtil.text.formatNum(value, format);
    }
    return '';
  }
}

export default bgdKsyFunc;
