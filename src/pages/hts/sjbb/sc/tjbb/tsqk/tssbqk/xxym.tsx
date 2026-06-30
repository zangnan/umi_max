// 申报清单
import React, { useImperativeHandle, useState } from 'react';
import { Drawer } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
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
        width={CONSTANTS.C_MODAL_WIDTH_X4}
        key='scSbbqd2'
        onClose={() => { setModalVisible(false) }}
        className="dd_data_page_modal"
        destroyOnHidden={true}
        mask={{ closable: false }}
      >
        <DDBunit2 config={config} func={Func} />
      </Drawer>
    </>
  );
};

export default sbbqd;
