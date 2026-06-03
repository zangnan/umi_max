/**
 * title: 备案单证目录
 */
import { Modal, Button } from 'antd';
import React, { useState, useImperativeHandle } from 'react';
import pro from '@/pages/common/proConfig';
import { CloseOutlined } from '@ant-design/icons';
import '../../style.less';

import ModalBgd from '../../sjpp/ppBgd';


export type BadzylModal = {
  visible?: any;
  onRef?: any;
}

const BadzylModal: React.FC<BadzylModal> = ({
  visible = false,
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [mainParams, setMainParams] = useState<any>({});

  // 开启
  const showModal = (param: any) => {
    setMainParams(param);
    setModalVisible(true);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  const closeModalVisible = () => {
    setModalVisible(false)
  }

  return (
    <>
      <Modal
        title={`备案单证预览`}
        centered
        destroyOnClose
        visible={modalVisible}
        width={pro.c_modal_width_x4}
        wrapClassName='standard-modal-1'
        zIndex={999}
        maskClosable={false}
        footer={
          <>
            <Button onClick={closeModalVisible} icon={<CloseOutlined />} type="default">关闭</Button>
          </>
        }
        onCancel={closeModalVisible}
      >
        <ModalBgd mainParams={mainParams} type={'xq'} />
      </Modal>
    </>
  )
};

export default BadzylModal;
