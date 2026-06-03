import React from 'react';
import {xfsfptzsx, importTemplate, xfsfppdfyl,} from '@/services/hts/api';
import DDAlert from '@/components/DDAlert';
import { Form, message, Upload, Button, Tooltip } from 'antd';
import { ClockCircleOutlined, InboxOutlined } from '@ant-design/icons';
import myUtil from '@/pages/common/myUtil';
import importStyle from './importStyle.less';
import tableStyle from './style.less';


const { Dragger } = Upload;
const Func: any = {
  unitRef: React.createRef(),
};

// 列表自定义渲染
Func.columnsRender = {
  renderJkshmYl: (param: any) => {
    const {record}  = param;
    return <a onClick={(e)=>{ e.stopPropagation();Func.openJkshmYl(param)}}>{record?.ssjkshm}</a>;
  }
}

Func.openJkshmYl = (param: any) => {
  const { otherRef, record, unitRef} = param;
  unitRef.current!.setMasker(true);
  xfsfppdfyl({ uuid: record?.uuid, ssjkshm: record?.ssjkshm }).then((res: any) => {
    unitRef.current!.setMasker(false);
    if (res.code == '200') {
      otherRef[0].current?.showModal(res?.body);
    } else {
      message.error(res.msg);
    }
  })
}

// 台账筛选
Func.importTzsx = async (param: any) => {
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
      <Button key={'excelmbxz'} onClick={() => Func.downloadExcel('SJGL_XFSFP_TZSX_PRINT_REPORT')}>Excel模板下载</Button>,
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
        <div style={{ marginLeft: '7px' }}>1. 请上传消费税票台账Excel，文件中“缴款书号码”长度应为12位或14位；</div>
        <div style={{ marginLeft: '7px' }}>2.  若多次上传，只保留最后一次上传的结果。</div>
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
          formData.append('cdDm', '020902');
          xfsfptzsx(formData).then((response: any) => {
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
                        <td width='30%'>{item.ssjkshm}</td>
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
                        <div style={{ marginTop: '10px' }}>本次导入台账中共{body?.drzs}张，导入成功{body?.cgzs}张，导入失败{body?.sbzs}张。</div>
                        <table className={tableStyle.errorTable}>
                          <tr style={{ backgroundColor: '#FAFAFA' }}>
                            <th>序号</th>
                            <th>失败缴款书号码</th>
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
                message.success(`本次导入台账中共${body?.drzs}张消费税发票，导入成功${body?.cgzs}张！`);
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
Func.downloadExcel = (param: string) => {
  importTemplate({ sfBhsj: "N", sfScsm: "N", key: param }).then((response) => {
    if (response.code === '200') {
      const { blob, fileName } = response.body;
      myUtil.file.downloadExcel(blob, fileName);
    } else {
      message.error(response.desc);
    }
  })
}

Func.xfsfpFuncDy = (param: any) => {
  const {otherRef,unitRef} = param;
  otherRef[1].current?.showModal(param,unitRef);
}
export default Func;


