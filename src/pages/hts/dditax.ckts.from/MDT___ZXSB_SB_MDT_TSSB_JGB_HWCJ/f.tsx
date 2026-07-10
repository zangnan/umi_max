// 货物冲减
import { Form, message, Upload, Button, Tooltip, Input, Radio, Select} from 'antd';
import React from 'react';
import DDAlert from '@/pages/hts/components/DDAlert';
import { mdtYsbToCj, importTemplate, bgdtzsx } from '@/pages/hts/services/htsApi';
import baseValidator from '@/components/DDAssist/field/baseValidator';
const { Dragger } = Upload;
import importStyle from './importStyle.less';
import myUtil from '@/components/DDAssist/util';
import { ClockCircleOutlined, InboxOutlined } from '@ant-design/icons';
import tableStyle from './style.less';

const Func: any = {
  refUnit: React.createRef(),
};

// 配置项：自定义工具栏 冲减出口
Func.cjck = (param: any) => {
  const { selectionRowKeys, refUnit } = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info('请选择要操作的数据！');
    return;
  } else {
    Promise.all([myUtil.code.getCodeFromServerT1('code_dm_ckts_hzcjyy:01')]).then(() => {
    }).catch(() => {
      message.error('获取“红冲原因”码表失败');
    }).finally(() => {
      const hcyy = myUtil.code.getCode('code_dm_ckts_hzcjyy:01');
      DDAlert.open({
        title: '冲减出口',
        infoType: 'info',
        closeStatus: false,
        isFormContent: true,
        modalType: 'form',
        content: <>
          <Form.Item label="所属期" name="ssq" rules={[
            {required: true, message: '该项内容为必填项不能为空！'},
            baseValidator.yyyyMM(),
          ]}>
            <Input/>
          </Form.Item>
          <Form.Item label="红冲原因：" name='hzcjyyDm' rules={[{required: true, message: '该项内容为必填项不能为空'}]}>
            <Select placeholder="请选择">
              {hcyy.map((item: any) => (
                <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </>,
        okCallbackFn: async function (thisObj: any) {
          let contentFormData = await DDAlert.getValidateFormData();
          thisObj.setState({ masker: true });
          let apiParam = {
            ssq: contentFormData.ssq,
            hzcjyyDm: contentFormData.hzcjyyDm,
            uuids: selectionRowKeys
          };
          mdtYsbToCj(apiParam).then((response: any) => {
            thisObj.setState({ masker: false });
            const { code, body, desc } = response;
            refUnit.current?.setMasker(false);
            if (code === '200') {
              DDAlert.close();
              message.info(body);
              // refUnit.current?.reload(); // 刷新并清空SelectionRows、SelectionRowKeys
              if (Func.closeHwcj) {
                Func.closeHwcj();
              }
            } else {
              message.error(desc);
            }
          })
        },
      });
    });
  }
}

// 台账筛选
Func.importTzsx = async (param: any) => {
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
    title: '台账筛选',
    infoType: 'warning',
    modalType: 'form',
    closeStatus: false,
    isFormContent: true,
    button: [
      <Button key={'excelmbxz'} onClick={() => Func.downloadExcel('SJGL_CKBGD_TZSX_PRINT_REPORT')}>Excel模板下载</Button>,
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
          formData.append('cdDm', '020999');
          bgdtzsx(formData).then((response: any) => {
            const { code, msg, body } = response;
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

export default Func;
