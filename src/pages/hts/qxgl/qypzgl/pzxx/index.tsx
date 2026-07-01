/**
 * 商品信息
 */
import React, { useState, useImperativeHandle } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import CONSTANTS from '@/components/DDAssist/constants';
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
      destroyOnHidden={true}
      className='dd_data_page_modal'
      open={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X3}
      onClose={() => setModalVisible(false)}
      mask={{ closable: false }}
      zIndex={1000}
    >
      <DDBunit2 config={Config} func={Func} />
    </Drawer>
  );
}

export default Tjfp;
