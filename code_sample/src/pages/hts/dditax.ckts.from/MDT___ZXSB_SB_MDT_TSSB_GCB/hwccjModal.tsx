/**
 * 海外仓冲减
 */
import React, {useImperativeHandle, useState} from 'react';
import {Modal} from 'antd';
import pro from '@/pages/common/proConfig';
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

  // 关闭
  const getKey = "MDT_ZXSB_SB_MDT_TSSB_HWCCJ";

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <Modal
      title="海外仓冲减"
      destroyOnClose={true}
      visible={modalVisible}
      width={pro.c_modal_width_x4}
      footer={null}
      wrapClassName='standard-modal-1'
      onCancel={() => closeModal()}
      maskClosable={false}
    >
      <Hwccj closeHwccj={closeModal} getKey={getKey}/>
    </Modal>
  );
}

export default HwccjModal;
