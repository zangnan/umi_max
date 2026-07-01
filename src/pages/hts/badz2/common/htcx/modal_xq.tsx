/**
 * title: 备案单证目录
 */
import { Modal, Button } from 'antd';
import React, { useState, useImperativeHandle } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { CloseOutlined } from '@ant-design/icons';
import '../../style.less';

import ModalXqIndex from './modal_xq_index';


export type BadzylModal = {
  visible?: any;
  onRef?: any;
  mainParams: any
}

const BadzylModal: React.FC<BadzylModal> = ({
  visible = false,
  onRef,
  mainParams
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [activeKey, setActiveKey] = useState<string>('ckxsht');
  const [xqOnRef, setXqOnRef] = useState<any>({});

  // 开启
  const showModal = (param: any) => {
    const { unit_key } = param;
    setActiveKey(unit_key)
    setXqOnRef(param);
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
        title={`匹配备案单证`}
        centered
        destroyOnHidden
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X4}
        wrapClassName='standard-modal-1'
        zIndex={999}
        mask={{ closable: false }}
        footer={
          <>
            <Button onClick={closeModalVisible} icon={<CloseOutlined />} type="default">关闭</Button>
          </>
        }
        onCancel={closeModalVisible}
      >
        <ModalXqIndex mainParams={mainParams} xqOnRef={xqOnRef} type={'save'} tabActive={activeKey} />
      </Modal>
    </>
  )
};

export default BadzylModal;
