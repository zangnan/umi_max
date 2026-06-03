/**
 * 下载条件-明细
 */
import React, { useImperativeHandle, useState } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import pro from '@/pages/common/proConfig';
import { Drawer, message } from 'antd';
import config from './modal_config';
import func from './modal_f';

export interface BdjgProps {
  onRef?: any;
}

const DrawerglFm: React.FC<BdjgProps> = ({
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [myConfig, setMyconfig] = useState<any>(config);

  // 开启
  const showModal = (param: any) => {
    const aConfig = { ...myConfig };
    const ckspDm = param?.record?.ckspDm;
    if(ckspDm) {
      const gridParams = {
        initSearchModal: [
          {property: "ckspDm",value:ckspDm,op:"zdy"}
        ],
      }
      aConfig.gridParams = gridParams;
      setMyconfig(aConfig);
      setModalVisible(true);
    } else {
      message.error('查看明细打开失败')
    }
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


  return (
    <Drawer
      title="查看明细"
      visible={modalVisible}
      onClose={() => { setModalVisible(false) }}
      width={pro.c_modal_width_x4}
      destroyOnClose={true}
      className="dd_data_page_modal"
      maskClosable={false}
    >
      <DDBunit2 config={myConfig} func={func} />
    </Drawer>
  );
};

export default DrawerglFm;
