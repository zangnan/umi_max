import React, { useImperativeHandle, useState } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import CONSTANTS from '@/components/DDAssist/constants';
import { Drawer, Button, message } from 'antd';
import drawer_list_config from './drawer_list_config';
import Func from './drawer_list_fun';

export interface BdjgProps {
  onRef?: any;
}

const DrawerList: React.FC<BdjgProps> = ({
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [myConfig, setMyconfig] = useState<any>(drawer_list_config);
  const [refGrid, setRefGrid] = useState<any>();
  const [initParam, setInitParam] = useState<any>();

  // 开启
  const showModal = (param: any) => {
    const c = { ...myConfig };
    c.grid_title = `报关单号：${param?.record?.ckbgdh}`;

    const gridParams: any = {
      initSearchModal: [
        { property: 'aaa', value: '11', op: 'al' },
        { property: 'bbb', value: '22', op: 'al' },
        { property: 'gdh', value: param?.record?.ckbgdh, op: 'al' },
      ],
    }
    c.gridParams = gridParams;

    setMyconfig(c);
    setModalVisible(true);
    setRefGrid(param.refGrid);
    setInitParam(param);

  };

  // 测试列表刷新
  const test = () => {
    message.info('测试列表刷新');
    refGrid?.current?.reload(); // 仅刷新列表数据
  }

  // 测试表单回显设置
  const test2 = () => {
    message.info('测试表单回显设置');
    console.info(initParam);
    initParam?.form?.setFieldsValue({
      valFromModal: '99',
    });
  }

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <Drawer
      title="DrawerList"
      open={modalVisible}
      onClose={() => {setModalVisible(false)}}
      size={CONSTANTS.C_MODAL_WIDTH_X3}
      destroyOnHidden={true}
      className="dd_modal_bg"
    >
      <DDBunit2 config={myConfig} func={Func} />
      <Button onClick={() => {test()}}>测试列表刷新</Button>
      <Button onClick={() => {test2()}}>测试表单回显设置</Button>
    </Drawer>
  );
};

export default DrawerList;
