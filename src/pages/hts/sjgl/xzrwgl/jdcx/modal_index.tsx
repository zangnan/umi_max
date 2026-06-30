/**
 * 下载条件-明细
 */
import React, { useImperativeHandle, useState } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import CONSTANTS from '@/components/DDAssist/constants';
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
    const zrwuuid = param?.record?.zrwuuid;
    if(zrwuuid) {
      const gridParams = {
        initSearchModal: [
          {property: "zrwuuid",value:zrwuuid,op:"zdy"}
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
      width={CONSTANTS.C_MODAL_WIDTH_X3}
      destroyOnHidden={true}
      className="dd_data_page_modal"
      mask={{ closable: false }}
    >
      <DDBunit2 config={myConfig} func={func} />
    </Drawer>
  );
};

export default DrawerglFm;
