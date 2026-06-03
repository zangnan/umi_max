/**
 * 发票开具配置  外销商品管理 赋码
 */
import React, { useImperativeHandle, useState } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import pro from '@/pages/common/proConfig';
import { Drawer } from 'antd';
import config from './config';
import func from './func';
import { cloneDeep } from 'lodash';
import { history } from 'umi';

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

   let myconfig  = cloneDeep(config);
  // if(history?.location?.pathname.indexOf('/fpsqd') >-1){
  //   myconfig.grid_row_key = 'sphfwssflhbbm';
  // }else{
  //   myconfig.grid_row_key = 'uuid';
  // }
  
  return (
    <Drawer
      title="商品详情"
      visible={modalVisible}
      onClose={() => { setModalVisible(false) }}
      width={pro.c_modal_width_x3}
      destroyOnClose={true}
      className="dd_data_page_modal"
      maskClosable={false}
      zIndex={1001}
    >
      <DDBunit2 config={myconfig} func={func} />
    </Drawer>
  );
};

export default DrawerglFm;
