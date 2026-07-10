import React from 'react';
import { queryPager, plxgckfph, downloadTemplate, importData } from '@/pages/hts/services/htsApi';
import DDAlert from '@/pages/hts/components/DDAlert';
import { Form, message, Upload, Button, Input, Tooltip } from 'antd';
import { ClockCircleOutlined, InboxOutlined } from '@ant-design/icons';
import myUtil, {intl } from '@/components/DDAssist/util';
import { intl as intl2 } from '@/components/DDAssist/util';
import baseValidator from '@/components/DDAssist/field/baseValidator';
import importStyle from './importStyle.less';

const { Dragger } = Upload;

const ckfpFunc: any = {
  refUnit: React.createRef(),
};

// 导入
ckfpFunc.btnPldr= (param: any) => {
  const { refUnit, otherRef  } = param;
  const gridData = refUnit.current?.getGridData();
  if(gridData.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_common_type_no_griddata' }));
    return;
  }
  const beforeUpload = (file: any) => {
    const isLt2M = file.size;
    if(isLt2M > 10485760) {
      message.info('上传文件不能超过10M。');
      return Upload.LIST_IGNORE;
    }
    if(!file.name.toUpperCase().endsWith(".XLS") && !file.name.toUpperCase().endsWith(".XLSX")) {
      message.info('上传文件必须是Excel文件。');
      return Upload.LIST_IGNORE;
    }
    return false;
  }
  DDAlert.open({
    title: '导入出口发票号',
    infoType: 'warning',
    modalType: 'form',
    closeStatus: false,
    isFormContent: true,
    width: 720,
    button: [
      <Button key={'excelmbxz'} onClick={() => ckfpFunc.downloadExcelMb('CX_SAAS_MDT_DLCKHWZMGL_1')}>Excel模板下载</Button>,
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
    </>,
    okCallbackFn: function (thisObj: any) {
      DDAlert.getForms().validateFields().then((values: any) => {
        if(values.file[0].originFileObj) {
          thisObj.setState({ masker: true });
          const formData = new FormData();
          formData.append('fileName', values.file[0].name);
          formData.append('file', values.file[0].originFileObj);
          formData.append('key', "IMPORT_SAAS_MDT_DLCKHWZMGL_1");
          importData(formData).then((response) => {
            const { code ,msg, body} = response;
            DDAlert.close();
            if (code === '200') {
              message.success('导入成功');
              // 刷新头部条数
              otherRef[1].current!.getDclsjBttj()
              setTimeout(() => {
                refUnit.current!.reload();
                thisObj.setState({ masker: false });
              },300)
            } else if (code === '900') {
              otherRef[0].current?.showModal(body.drycxx, 'dr', '系统消息', body.druuid);
              thisObj.setState({ masker: false });
            }else{
              thisObj.setState({ masker: false });
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
ckfpFunc.downloadExcelMb = (key: any) => {
  const obj = {
    sfBhsj: 'N',
    sfScsm: 'N',
    key,
  }
  downloadTemplate(obj).then((response: any) => {
    if (response.code === '200') {
      const { blob, fileName } = response.body;
      myUtil.file.downloadExcel(blob, fileName);
    } else {
      message.error(response.desc);
    }
  })
}

// 批量补录
ckfpFunc.btnPlbl = (param: any) => {
  const { refUnit, selectionRowKeys, gridRef, otherRef } = param;
  const gridData = refUnit.current?.getGridData();
  if(gridData.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_common_type_no_griddata' }));
    return;
  }
  const searchModel = refUnit.current?.getGridParams().searchModel || [];
  const headerSearchModel = gridRef.current?.getHeaderFilter() || [];
  const allSearchModel: any = searchModel.concat(headerSearchModel);
  allSearchModel.push({ property: 'cxlx', value: '1', op: 'zdy' });
  allSearchModel.push({ property: 'sfcxZj', value: "Y", op: 'zdy' });

  let uuids:any = [];
  DDAlert.open({
    title: '批量补录',
    infoType: 'warning',
    modalType: 'form',
    closeStatus: false,
    isFormContent: true,
     content: <>
      <Form.Item label="出口发票号" name="ckfph" rules={[{ required: true, message: '请输入出口发票号' }, validatorFlag.ckfph, baseValidator.range2({ min: 0, max: 30 })]}>
        <Input placeholder="请输入出口发票号" />
      </Form.Item>
    </>,
    okCallbackFn: function (thisObj: any) {
      DDAlert.getForms().validateFields().then((values: any) => {
        if(values) {
          if(selectionRowKeys.length === 0) {
            // 走获取全部uuid的接口
            const obj = {
              page: 1,
              pageSize: 999999,
              key: 'CX_SAAS_MDT_DLCKHWZMGL',
              searchModel: allSearchModel,
            }
            queryPager(obj).then((res: any) => {
              const {code, body, msg} = res;
              if(code === '200') {
                uuids = body.rows;
                const obj2 = {
                  uuids,
                  ywlx: 'dlckhwzm',
                  ckfph: values.ckfph
                }
                plxgckfphApi(obj2, refUnit, otherRef, thisObj)
              } else {
                message.error(msg)
              }
            })
          } else {
            uuids = selectionRowKeys;
            const obj2 = {
              uuids,
              ywlx: 'dlckhwzm',
              ckfph: values.ckfph
            }
            plxgckfphApi(obj2, refUnit, otherRef, thisObj)
          }
        }
      })
    }
  })
}

// 批量补录接口
const plxgckfphApi = (params: any, refUnit: any, otherRef: any, thisObj: any) => {
  thisObj.setState({ masker: true });
  plxgckfph(params).then((res: any)=> {
    const {code, msg} = res;
    if(code === '200') {
      message.success(intl.formatMessage({ id: 'message_common_batchedit_success' }));
      // refUnit.current!.handleReset();
      // 刷新头部条数
      otherRef[1].current!.getDclsjBttj()
      setTimeout(() => {
        refUnit.current!.reload();
        thisObj.setState({ masker: false });
        DDAlert.close();
      },300)
    } else {
      message.error(msg);
      thisObj.setState({ masker: false });
    }
  })
}


// 关单信息状态标志
ckfpFunc.columnsRender= {
};

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
};

export default ckfpFunc;
