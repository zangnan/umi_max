/**
 * title: 备案单证目录
 */
import { Modal, Button } from 'antd';
import React, { useState, useImperativeHandle } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { CloseOutlined } from '@ant-design/icons';
import '../../style.less';

import Htcx from '../htcx';


export type BadzylModal = {
  visible?: any;
  onRef?: any;
  mainParams?: any;
}

const BadzylModal: React.FC<BadzylModal> = ({
  visible = false,
  onRef,
  mainParams: introductionParams
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [mainParams, setMainParams] = useState<any>({});
  const [ckbgdh, setCkbgdh] = useState<any>(null);

  // 开启
  const showModal = (param: any, ckbgdh?: any) => {
    if (ckbgdh) {
      setCkbgdh(ckbgdh);
    }
    setMainParams(introductionParams || param);
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
        destroyOnHidden
        visible={modalVisible}
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
        <Htcx mainParams={mainParams} type={'search'} ckbgdh={ckbgdh} />
      </Modal>
    </>
  )
};

export default BadzylModal;
