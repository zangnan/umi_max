/**
 * title: pdf预览
 */
import React, { useState, useImperativeHandle } from 'react';
import { Modal, Button } from 'antd';
import pro from '@/pages/common/proConfig';
import { CloseOutlined} from '@ant-design/icons';


export type CreateDataProps = {
  visible?: any;
  onRef?: any;
}

const CreateData: React.FC<CreateDataProps> = ({
  visible = false,
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [src, setSrc] = useState<any>();
  const [title, setTitle] = useState<any>();


  // 开启
  const showModal = (src: any, name: any) => {
    setSrc(src);
    setTitle(name);
    setModalVisible(true);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <Modal
      title={title}
      destroyOnClose
      visible={modalVisible}
      wrapClassName='standard-modal-1'
      width={pro.c_modal_width_x4}
      cancelText="关闭"
      footer={
          <Button onClick={() => setModalVisible(false)} icon={<CloseOutlined />} type="default">关闭</Button>
      }
      closable={false}
      onCancel={() => setModalVisible(false)}
    >
      <iframe src={src} width='100%' height='99%'></iframe>
    </Modal>
  );
};
export default CreateData;
