/**
 * title: 智能分析-已申报出口额
 * desc: 智能分析-价贸的已申报出口额
 * creator: yxy
 */
import React, { useImperativeHandle, useState, useEffect } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import ysbckeConfig from '../sjxz/jmfksjcx/ckmxconfig';
import ZnfxYsbckeFunc from '../sjxz/jmfksjcx/func';
import CONSTANTS from '@/components/DDAssist/constants';
import { Drawer } from 'antd';

export interface JckgdProps {
  onRef?: any;
}

const ModalJckgd: React.FC<JckgdProps> = ({
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [myConfig, setMyconfig] = useState<any>(ysbckeConfig);
  const [title, setTitle] = useState<any>('');
  // 开启
  const showModal = (param: any) => {
    const c = { ...myConfig };
    const gridParams: any = {
      initSearchModal: [
        { property: 'bah', value: param.bah, op: 'dd' },
      ],
    }
    c.gridParams = gridParams;
    const filterItems = [];
    for (let i = 1; i < ysbckeConfig.filter_items.length - 1; i++) {
      filterItems.push(ysbckeConfig.filter_items[i]);
    }
    c.filter_items = filterItems;
    const gridColumns = [];
    for (let i = 1; i < ysbckeConfig.grid_columns.length; i++) {
      if (ysbckeConfig.grid_columns[i].dataIndex != 'jljgszch') {
        gridColumns.push(ysbckeConfig.grid_columns[i]);
      }
    }
    c.grid_columns = gridColumns;
    c.layout_type = 'modal';
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
        <DDBunit2 config={myConfig} func={ZnfxYsbckeFunc} />
      </Drawer>
    </>
  );
};

export default ModalJckgd;
