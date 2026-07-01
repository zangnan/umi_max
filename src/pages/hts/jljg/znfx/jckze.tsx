/**
 * title: 智能分析-进（出）口总额
 * creator: yxy
 */
import React, { useImperativeHandle, useState } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import jckzeConfig from './jckzeconfig';
import ZnfxJckzeFunc from './fjckze';
import CONSTANTS from '@/components/DDAssist/constants';
import { Drawer } from 'antd';

export interface JckgdProps {
  onRef?: any;
}

const ModalJckgd: React.FC<JckgdProps> = ({
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [myConfig, setMyconfig] = useState<any>(jckzeConfig);
  const [title, setTitle] = useState<any>('');
  // 开启
  const showModal = (jckbz: any, hgsjbz: any, param: any) => {
    const c = { ...myConfig };
    const gridParams: any = {
      initSearchModal: [
        { property: 'bah', value: param.bah, op: 'dd' },
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
    setTitle(til);
    setModalVisible(true);
  };

  // useEffect(() => {
  // }, []);

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <>
      <Drawer
        title={title}
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X3}
        onClose={() => { setModalVisible(false) }}
        className="dd_data_page_modal"
        destroyOnHidden={true}
        mask={{ closable: false }}
      >
        <DDBunit2 config={myConfig} func={ZnfxJckzeFunc} />
      </Drawer>
    </>
  );
};

export default ModalJckgd;
