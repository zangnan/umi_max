/**
 * 关联关系
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
  const [myConfig, setMyconfig] = useState<any>(Config);

  const Func: any = {};

  // 开启
  const showModal = (param: any, type: any) => {
    const { record } = param;
    const c = { ...myConfig };
    const gridParams: any = {
      initSearchModal: [
        {op: 'al', property: 'uuid', value: record.uuid },
        {op: 'al', property: 'dzlx', value: record.dzlx }
      ],
    }
    c.gridParams = gridParams;
    setMyconfig(c);
    setModalVisible(true);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <Drawer
      title="关联关系"
      destroyOnHidden={true}
      className='dd_data_page_modal'
      visible={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X2}
      onClose={() => setModalVisible(false)}
      mask={{ closable: false }}
    >
      <DDBunit2 config={myConfig} func={Func} />
    </Drawer>
  );
}

export default Tjfp;
