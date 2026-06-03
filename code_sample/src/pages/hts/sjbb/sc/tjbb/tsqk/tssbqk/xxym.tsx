// 申报清单
import React, { useImperativeHandle, useState } from 'react';
import { Drawer } from 'antd';
import pro from '@/pages/common/proConfig';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import Func from './f_xxym';

export interface DDModalGridProps {
  onRef?: any;
  visible?: any;
}
const sbbqd: React.FC<DDModalGridProps> = ({ onRef, visible = false }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [paramRef, setParamRef] = useState<any>();
  const [config, setConfig] = useState<any>();
  const [bdmc, setBdmc] = useState();
  // 开启
  const showModal = (param: any, bdmc: any, config: any) => {
    setModalVisible(true);
    setParamRef(param);
    setBdmc(bdmc);
    setConfig(config);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });


  return (
    <>
      <Drawer
        title={bdmc}
        visible={modalVisible}
        width={pro.c_modal_width_x4}
        key='scSbbqd2'
        onClose={() => { setModalVisible(false) }}
        className="dd_data_page_modal"
        destroyOnClose={true}
        maskClosable={false}
      >
        <DDBunit2 config={config} func={Func} />
      </Drawer>
    </>
  );
};

export default sbbqd;
