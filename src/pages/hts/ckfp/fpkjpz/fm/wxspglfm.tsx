/**
 * 发票开具配置  外销商品管理 赋码
 */
import React, { useImperativeHandle, useState } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import CONSTANTS from '@/components/DDAssist/constants';
import { Drawer } from 'antd';
import config from './config';
import func from './func';

export interface BdjgProps {
  onRef?: any;
}

const DrawerglFm: React.FC<BdjgProps> = ({
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [paramData, setParamData] = useState<any>("");

  // 开启
  const showModal = (param: any) => {
    setParamData(param);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  }

  useImperativeHandle(onRef, () => {
    return {
      showModal,
      closeModal
    };
  });

  func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(paramData);
    otherRef.push(onRef);
    return otherRef;
  };

  return (
    <Drawer
      title="商品详情"
      open={modalVisible}
      onClose={() => { setModalVisible(false) }}
      width={CONSTANTS.C_MODAL_WIDTH_X3}
      destroyOnHidden={true}
      className="dd_data_page_modal"
      mask={{ closable: false }}
      zIndex={1001}
    >
      <DDBunit2 config={config} func={func} />
    </Drawer>
  );
};

export default DrawerglFm;
