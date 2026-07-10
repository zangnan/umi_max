import React, { useImperativeHandle, useState } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import CONSTANTS from '@/components/DDAssist/constants';
import { Drawer } from 'antd';
import Func from './mxFunc';
import myUtil from '@/components/DDAssist/util';
import tjconfig from './tjconfig';

import { cloneDeep } from 'lodash';


export interface BdjgProps {
  onRef?: any;
}

const DrawerList: React.FC<BdjgProps> = ({
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [param, setParam] = useState<any>();
  const [myconfig, setMyconfig] = useState<any>();
  const [title, setTitle] = useState<any>();


  // 开启
  const showModal = (param: any, title: any, searchModel: any, initSearchModal: any, headerFilter: any) => {
    setParam(param);
    setModalVisible(true);
    setTitle(title);
    let c = cloneDeep(tjconfig);
    const gridParams: any = {
      initSearchModal: [...searchModel, ...initSearchModal, ...headerFilter],
    }
    gridParams.initSearchModal.map((item: any) => {
      item.op = 'zdy';
    })
    c.gridParams = gridParams;
    setMyconfig(c);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });


  const close = async () => {
    param?.refUnit.current?.reload();
    setModalVisible(false);
  }

  return (
    <Drawer
      title={title}
      open={modalVisible}
      onClose={() => { close() }}
      width={CONSTANTS.C_MODAL_WIDTH_X3}
      destroyOnHidden={true}
      className="dd_data_page_modal"
    > 
      <DDBunit2 config={myconfig} func={Func} />
    </Drawer>
  );
};

export default DrawerList;
