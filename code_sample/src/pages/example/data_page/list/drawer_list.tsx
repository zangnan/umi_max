import React, { useImperativeHandle, useState } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import pro from '@/pages/common/proConfig';
import { Drawer, Button, message } from 'antd';
import drawer_list_config from './drawer_list_config';
import Func from './f';

export interface BdjgProps {
  onRef?: any;
}

const DrawerList: React.FC<BdjgProps> = ({
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [myConfig, setMyconfig] = useState<any>(drawer_list_config);
  const [gridRef, setGridRef] = useState<any>();

  // 开启
  const showModal = (param: any) => {
    const c = { ...myConfig };
    c.grid_title = `报关单号：${param.record.ckbgdh}`;

    const gridParams: any = {
      initSearchModal: [
        { property: 'aaa', value: '11', op: 'al' },
        { property: 'bbb', value: '22', op: 'al' },
        { property: 'gdh', value: param.record.ckbgdh, op: 'al' },
      ],
    }
    c.gridParams = gridParams;

    setMyconfig(c);
    setModalVisible(true);
    setGridRef(param.gridRef);

  };

  // 测试
  const test = () => {
    message.info('测试');
    gridRef.current!.reload(); // 仅刷新列表数据
  }

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <Drawer
      title="DrawerList"
      visible={modalVisible}
      onClose={() => {setModalVisible(false)}}
      width={pro.c_modal_width_x3}
      destroyOnClose={true}
      className="dd_data_page_modal"
    >
      <DDBunit2 config={myConfig} func={Func} key='123'/>
      <Button onClick={() => {test()}}>测试</Button>
    </Drawer>
  );
};

export default DrawerList;
