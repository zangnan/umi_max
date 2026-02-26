import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Modal, Button, message } from 'antd';
import { testReturnCode200 } from '@/services/hts/api';

export interface BdjgProps {
  onRef?: any;
}

const DrawerList: React.FC<BdjgProps> = ({
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // 开启
  const showModal = (param: any) => {
    setModalVisible(true);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  const showAlert1 = () => {
    message.info('11111');
    let apiParam = {
      aaa: 111,
      bbb: '222',
    };
    testReturnCode200(apiParam).then((response1: any) => {
      message.info(response1.code)
		});
  }

  return (
    <Modal
      title="DrawerList"
      open={modalVisible}
      onCancel={() => setModalVisible(false)}
      width={CONSTANTS.C_MODAL_WIDTH_X3}
      destroyOnHidden={true}
      className="dd_modal_bg"
    >
      <Button onClick={showAlert1}>测试列表刷新</Button>
    </Modal>
  );
};

export default DrawerList;
