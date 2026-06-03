/**
 * 关联关系
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
      destroyOnClose={true}
      className='dd_data_page_modal'
      visible={modalVisible}
      width={pro.c_modal_width_x2}
      onClose={() => setModalVisible(false)}
      maskClosable={false}
    >
      <DDBunit2 config={myConfig} func={Func} />
    </Drawer>
  );
}

export default Tjfp;
