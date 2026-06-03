/**
 * 发票开具配置  其他商品管理
 */
import React, { useImperativeHandle, useState } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import pro from '@/pages/common/proConfig';
import { Drawer } from 'antd';
import drawerqtspConfig from './drawerqtspconfig';
import drawerqtspFunc from './drawerqtspfunc';

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

  drawerqtspFunc.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(paramData);
    otherRef.push(onRef);
    return otherRef;
  };

  return (
    <Drawer
      title="商品详情"
      visible={modalVisible}
      onClose={() => { setModalVisible(false) }}
      width={pro.c_modal_width_x3}
      destroyOnClose={true}
      className="dd_data_page_modal"
      maskClosable={false}
    >
      <DDBunit2 config={drawerqtspConfig} func={drawerqtspFunc} />
    </Drawer>
  );
};

export default DrawerglFm;