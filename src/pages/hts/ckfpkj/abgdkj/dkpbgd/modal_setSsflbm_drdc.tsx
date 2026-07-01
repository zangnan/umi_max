import React, { useImperativeHandle, useState } from 'react';
import { Button, Form, Modal, Upload, message, Spin, Tooltip } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import {ClockCircleOutlined, InboxOutlined } from '@ant-design/icons';
import {exportssflbm, importssflbm } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';
import importStyle from './importStyle.less';
import DDBaseGrid from '@/components/DDBaseGrid';

const { Dragger } = Upload;

export interface DDImportProps {
  onRef?: any;
  visible?: any;
}
const ModalSsflbmDrDc: React.FC<DDImportProps> = ({
  onRef,
  visible = false,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);

  const [masker, setMasker] = useState<any>(false);
  const [cxData, setCxData] = useState<any>({}); // 
  const [mainRef, setMainRef] = useState<any>([]); //主列表Ref
  const [form] = Form.useForm();
  const [modalVisibleExport, setModalVisibleExport] = useState<boolean>(false);
  const [errList, setErrListt] = useState<any>([]);

  // 开启
  const showModal = (param: any) => {
    setCxData(param?.ssflTemp);
    setMainRef(param?.ref);
    form.resetFields();
    setModalVisible(true);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  const onFinish = (value: any) => {
    const { importFile} = value;
    const data = new FormData();
    data.append('file', importFile[0].originFileObj);
    data.append('fileName', importFile[0].name);
    data.append('bgdlx', cxData?.bgdlx);
    data.append('bgdhs', cxData?.bgdhs);
    data.append('importMode', '1');
    data.append('bcFlag', 'Y');
    setMasker(true);
    importssflbm(data).then(async (response) => {
      setMasker(false);
      const { code, body, desc } = response;
      if (code === '200') {
        message.success("导入成功");
        setModalVisible(false);
        mainRef.current!.reload2();
      } else if (code === '900') {
        message.error(desc);
        setModalVisibleExport(true);
        setErrListt(body.drycxx);
      } else {
        message.error(desc);
      }
    });
  };

  const onclose=async ()=>{
    setErrListt([]);
    setModalVisible(false);
    setCxData({});
    setMainRef(null);
    setModalVisibleExport(false);
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  // 字段设置
  const handleExcelXz = () => {
    setMasker(true);
    exportssflbm(cxData).then((response) => {
      const { code, body, desc } = response;
      if (code === '200') {
        const { blob, fileName } = body;
        message.success('导出成功！');
        myUtil.file.downloadExcel(blob, fileName);
      } else {
        message.error(desc);
      }
      setMasker(false);
    });
  };

  const errColumns = [
    { title: '序号', dataIndex: 'xh', width: 70 },
    { title: '失败原因', dataIndex: 'sbyy', width: 300 },
  ]

  const save = () => {
    form.submit();
  }

  const beforeUpload = (file: any) => {
    const isLt2M = file.size;
    if(isLt2M > 20971520) {
      message.info('上传文件不能超过20M。');
      return Upload.LIST_IGNORE;
    }
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
        title="税收分类编码导入"
        destroyOnHidden
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X2}
        onCancel={onclose}
        footer={(<>
          <Button onClick={onclose} type="default">取消</Button>
          <Button onClick={handleExcelXz} type="default" >导出</Button>
          <Button onClick={save} type="primary">确定</Button>
        </>)}
        className={`${masker ? 'dd_modal_show_masker' : ''}`}
        mask={{ closable: false }}
      >
        <Spin tip="Loading..." spinning={masker} key={'sjdrspin'} delay={100}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            form={form}
          >
            <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} label="导入Excel文件" name="importFile" valuePropName="fileList" getValueFromEvent={normFile}
              rules={[{ required: true, message: '请选择上传的文件' }]}>
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
            <div style={{ color: "#E51C23" ,marginTop: '10px'}}>
              <p>导入说明：</p>
              <div style={{ marginLeft: '7px' }}>1. 请先点击下方【导出】按钮，对导出数据修改后进行导入；</div>
              <div style={{ marginLeft: '7px' }}>2. 导入数据时仅更新当前筛选的数据。</div>
            </div>
          </Form>
        </Spin>
      </Modal>
      <Modal
        title="数据检查异常疑点列表"
        destroyOnHidden={true}
        visible={modalVisibleExport}
        width={CONSTANTS.C_MODAL_WIDTH_X4}
        wrapClassName="standard-modal-1"
        footer={
          <>
            <Button onClick={() => setModalVisibleExport(false)}>关闭</Button>
          </>
        }
        onCancel={() => setModalVisibleExport(false)}
        mask={{ closable: false }}
      >
        <DDBaseGrid
          userDataSource={errList}
          components={true}
          columns={errColumns}
          pagination={false}
          scroll={{ x: '0px' }}
        />
      </Modal >
    </>
  );
};

export default ModalSsflbmDrDc;

