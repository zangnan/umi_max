/**
 * 商品信息
 */
import React, { useState, useImperativeHandle } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import pro from '@/pages/common/proConfig';
import { Drawer } from 'antd';
import Config from './config';

export interface ZzsfpSxProps {
  onRef?: any;
  visible?: any;
}

const Tjfp: React.FC<ZzsfpSxProps> = ({ onRef, visible = false }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);

  const Func: any = {};

  // 开启
  const showModal = (param: any, unitRef: any, sbqyuuid:any) => {
    Config.gridParams = {
      initSearchModal: [
        {property: 'sbqyuuid', value: sbqyuuid, op: 'zdy'},
      ]
    }
    setModalVisible(true);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <Drawer
      title="商品信息"
      destroyOnClose={true}
      className='dd_data_page_modal'
      visible={modalVisible}
      width={pro.c_modal_width_x3}
      onClose={() => setModalVisible(false)}
      maskClosable={false}
      zIndex={1000}
    >
      <DDBunit2 config={Config} func={Func} />
    </Drawer>
  );
}

export default Tjfp;
