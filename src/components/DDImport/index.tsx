import React, { useImperativeHandle, useState, memo } from 'react';
import { Button, Form, Modal, Upload, message, Radio, Space, Spin, Tooltip, notification } from 'antd';
import CONSTANTS from '../DDAssist/constants';
import ErrorMsgGrid from './importError';
import { importExecl, downloadTemplate, automaticTemplate } from '@/services/hts/api';
import myUtil from '../DDAssist/util';
import importStyle from './importStyle.less';
import { ClockCircleOutlined, InboxOutlined } from '@ant-design/icons';

export interface DDImportProps {
  onRef?: any;
  visible?: any;
  data?: [];
}
const errorMsgRef: any = React.createRef();
const DDImport: React.FC<DDImportProps> = ({
  onRef,
  visible = false,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [refGrid, setRefGrid] = useState<any>(''); // 主表页面ref用于刷新
  const [masker, setMasker] = useState<any>(false);
  const [form] = Form.useForm();

  // 开启
  const showModal = (param: any) => {
    setRefGrid(param);
    form.resetFields();
    setModalVisible(true);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  const onFinish = (value: any) => {
    const { importFile, importMode } = value;
    const data = new FormData();
    data.append('file', importFile[0].originFileObj);
    data.append('fileName', importFile[0].name);
    data.append('importMode', importMode);
    data.append('unitKey', refGrid.unitKey);
    if(refGrid.key){
      data.append('key', refGrid.key);
    }
    // 导入的共同方法根据传key去判断
    setMasker(true);
    importExecl(refGrid.url, data).then((response) => {
      setMasker(false);
      const { code, body, desc, msg } = response;
      if (code === '200') {
        setModalVisible(false);
        refGrid.refGrid.current!.reload();
        message.success(msg);
      } else if (code === '900') {
        errorMsgRef.current!.showModal(body);
      } else {
        setModalVisible(false);
        notification.error({
          message: '导入失败',
          description: <>{JSON.stringify(msg || desc)}</>,
          placement: 'top',
          duration: null,
        });
        // message.error(desc);
      }
    }).catch(() => {
      message.error('导入失败，请重新上传文件。');
    }).finally(() => {
      setMasker(false);
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  // Excel模板下载
  const handleTemplateDownload = () => {
    const data = {
      // key: refGrid.key,
    }
    setMasker(true);
    // downloadTemplate(data).then((response) => {
    //   setMasker(false);
    //   if (response.code === '200') {
    //     const { blob, fileName } = response.body;
    //     myUtil.file.downloadExcel(blob, fileName);
    //   } else {
    //     message.error(response.desc);
    //   }
    // })
    automaticTemplate(refGrid.urlTemplate, data).then((response) => {
      setMasker(false);
      const { code, body, msg } = response;
      if (code === '200') {
        myUtil.file.downloadExcel(body?.blob, body?.fileName);
      } else {
        message.info(msg || '下载失败');
      }
      return;
    }).catch(() => {
    }).finally(() => {
    });
  };

  // handleImport
  const handleImport = () => {
    form.submit();
  }

  // beforeUpload
  const beforeUpload = (file: any) => {
    if(!file.name.toUpperCase().endsWith(".XLS") && !file.name.toUpperCase().endsWith(".XLSX")) {
      message.info('上传文件必须是Excel文件。');
      return Upload.LIST_IGNORE;
    } else {
      return false;
    }
  }

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <>
      <Modal
        title="导入Excel文件"
        destroyOnHidden
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X2}
        onCancel={() => setModalVisible(false)}
        footer={(<>
          <Button onClick={() => setModalVisible(false)} type="default">取消</Button>
          <Button onClick={handleTemplateDownload} type="default" >Excel模板下载</Button>
          <Button onClick={handleImport} type="primary">确定</Button>
        </>)}
        className={`${masker ? 'dd_modal_show_masker' : ''}`}
        mask={{ closable: false }}
      >
        <Spin description="Loading..." spinning={masker} key={'sjdrspin'} delay={100}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ importMode: refGrid.showType ? "1" : 1 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            form={form}
          >
            <Form.Item
                wrapperCol={{ span: 24 }}
                name="importFile"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[{ required: true, message: '请选择上传的文件' }]}>
              <Upload.Dragger
                maxCount={1}
                showUploadList={true}
                // accept=".xls, .xlsx"
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
                      <td width="20%" className={importStyle.textCenter}>{myUtil.text.formatNum(file.size, '0,0')}Bytes</td>
                      <td width="18%" className={importStyle.textCenter}><ClockCircleOutlined />待上传</td>
                      <td width="17%" className={importStyle.textCenter}><a onClick={()=>actions.remove()}>删除</a></td>
                    </tr>
                  </table>
                )}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击或将文件拖拽到此区域</p>
              </Upload.Dragger>
            </Form.Item>
            <Form.Item name="importMode">
              <Radio.Group>
                <Space orientation="horizontal">
                  <Radio key="1" value="1">覆盖并追加数据</Radio>
                  <Radio key="2" value="2">不覆盖只追加数据</Radio>
                  <Radio key="3" value="3">导入前清空数据</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
      <ErrorMsgGrid onRef={errorMsgRef} />
    </>
  );
};

export default memo(DDImport);
