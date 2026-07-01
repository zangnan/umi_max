import React, { useState, useImperativeHandle, Fragment } from 'react';
import { Modal, message, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadFlzl, checkFileGrid } from '@/pages/hts/services/htsApi';
import CONSTANTS from '@/components/DDAssist/constants';

export interface zlscModalProps {
  visible?: any;
  onRef?: any;
  beforeUpload?: any;
}

const ZlscModal: React.FC<zlscModalProps> = ({
  visible = false,
  onRef,
  beforeUpload,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [uploading, setUploading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [record, setRecord] = useState<any>({});

  // 开启
  const showModal = (param: any) => {
    setRecord(param);
    setModalVisible(true);
  };

  // 上传
  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('fileName', file);
      formData.append('file-name-suffix', file.name);
    });
    formData.append('lcswsxDm', record.lcswsxDm || '');
    formData.append('flzlDm', record.flzlDm || '');
    formData.append('flzldlDm', record.flzldlDm || '');
    formData.append('sbwjuuid', record.sbwjuuid || '');
    formData.append('sjsbuuid', record.sjsbuuid || '');
    formData.append('sbflzluuid', record.sbflzluuid || '');
    formData.append('uuid', record.mxbuuid || '');
    formData.append('bzuuid', record.bzuuid || '');
    formData.append('bzmxbuuid', record.bzmxbuuid || '');
    formData.append('flzlmc', record.flzlmc || '');
    setUploading(true);
    checkFileGrid(formData).then((response1) => {
      // 1.附件中文件类型检查
      if (response1.code === '200') {
        return uploadFlzl(formData);
      }
      throw new Error(response1.msg);
    }).then((response2) => {
      // 2.文件上传
      const { code, msg, body } = response2;
      if (code === '200') {
        message.info(body);
      } else {
        message.error(msg);
      }
      setUploading(false);
      setFileList([]);
      // 刷新附列资料弹窗列表
      if (beforeUpload) {
        beforeUpload();
      }
      setModalVisible(false);
    }).catch(error => {
      message.error(error.message);
      setUploading(false);
    })
  };

  // 上传组件参数
  const props = {
    onRemove: (file: any) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file: any) => {
      const fileName = file.name;
      const fileExt = fileName.substr(fileName.lastIndexOf('.')).toLowerCase();// 获得文件后缀名
      if (fileExt !== '.zip') {
        message.info('请上传zip格式的文件！');
        return false;
      }
      let fileSize = file.size;
      fileSize = Math.round(fileSize * 100 / (1024 * 1024)) / 100; // 单位为MB
      if (fileSize > 5) {
        message.info('文件最大为5MB，请重新选择！');
        return false;
      }
      setFileList([file]);
      return false;
    },
    fileList,
  };

  // 上传组件元素
  const uploadEle = (
    <Fragment>
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>选择文件</Button>
      </Upload>
    </Fragment>
  );

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <Modal
      title='上传'
      open={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X1}
      onCancel={() => setModalVisible(false)}
      destroyOnHidden
      footer={(
        <Fragment>
            <Button onClick={handleUpload} disabled={fileList.length === 0} loading={uploading} type="primary">
              {uploading ? '上传中' : '开始上传'}
            </Button>
            <Button onClick={() => setModalVisible(false)} >关闭</Button>
        </Fragment>
      )}
    >
      <div>
        {uploadEle}
      </div>
    </Modal>
  );
};

export default ZlscModal;
