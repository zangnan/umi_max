/**
 * 海外仓冲减
 */
import React, {useImperativeHandle, useState} from 'react';
import {Modal} from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import Hwccj from './hwccj';
import '@/pages/hts/commonModule/style.less';

export interface DDTsort {
  onRef?: any;
  visible?: any;
}

const HwccjModal: React.FC<DDTsort> = ({onRef, visible = false}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [initData, setInitData] = useState<any>([]);

  // 开启
  const showModal = (param: any) => {
    setInitData(param);
    setModalVisible(true);
  };

  // 关闭
  const closeModal = () => {
    setModalVisible(false);
    initData.unitRef.current?.reload2();
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <Modal
      title="海外仓冲减"
      destroyOnHidden={true}
      visible={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X4}
      footer={null}
      wrapClassName='standard-modal-1'
      onCancel={() => closeModal()}
      mask={{ closable: false }}
    >
      <Hwccj closeHwccj={closeModal}/>
    </Modal>
  );
}

export default HwccjModal;
