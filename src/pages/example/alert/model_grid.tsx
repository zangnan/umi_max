import React, { useImperativeHandle, useState } from 'react';
import { Modal, Button } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from './config';

export interface DDModalGridProps {
  onRef?: any;
  visible?: any;
  data?: any;
}

const ModalGrid: React.FC<DDModalGridProps> = ({
  onRef,
  visible = false,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);

  // 开启
  const showModal = () => {
    setModalVisible(true);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <>
      <Modal
        title='弹窗列表'
        destroyOnHidden={true}
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X4}
        wrapClassName='standard-modal-1'
        className="dd_modal_bg"
        footer={(<>
          <Button onClick={() => setModalVisible(false)} >取消</Button>
          <Button onClick={() => setModalVisible(false)} type="primary">确定</Button>
        </>)}
        onCancel={() => setModalVisible(false)}
      >
        <DDBunit2 config={config} />
      </Modal>
    </>
  );
};

export default ModalGrid;