/**
 * title: 智能分析-分析状态
 * author: yxy
 */
import React, { useImperativeHandle, useState, useEffect } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import bdjgConfig from './bdjgconfig';
import ZnfxBdjgFunc from './fbdjg';
import CONSTANTS from '@/components/DDAssist/constants';
import { Drawer } from 'antd';

export interface BdjgProps {
  onRef?: any;
}

const ModalBdjg: React.FC<BdjgProps> = ({
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [myConfig, setMyconfig] = useState<any>(bdjgConfig);
  const [title, setTitle] = useState<any>('');// 主页面传递的数据
  // 开启
  const showModal = (param: any) => {
    const c = { ...myConfig };
    const gridParams: any = {
      initSearchModal: [
        { property: 'zbuuid', value: param.zbuuid, op: 'dd' },
      ],
    }
    c.gridParams = gridParams;

    setMyconfig(c);
    let til = '';
    if (param.bah.startsWith('C')) {
      til = `手册号：${param.bah}  核销周期：${param.hxzqxs}`;
    } else {
      til = `账册号：${param.bah}  核销周期：${param.hxzqxs}`;
    }
    setTitle(til)
    setModalVisible(true);
  };

  useEffect(() => {
  }, []);

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <>
      <Drawer
        title={title}
        visible={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X3}
        onClose={() => { setModalVisible(false) }}
        className="dd_data_page_modal"
        destroyOnHidden={true}
        mask={{ closable: false }}
      >
        <DDBunit2 config={myConfig} func={ZnfxBdjgFunc} />
      </Drawer>
    </>
  );
};

export default ModalBdjg;
