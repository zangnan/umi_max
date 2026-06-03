import React, { useImperativeHandle, useState } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import pro from '@/pages/common/proConfig';
import { Drawer } from 'antd';
import drawer_list_config from '../ckbgdmx/config';
import Func from '../ckbgdmx/f';
import myUtil from '@/pages/common/myUtil';

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
  const showModal = (param: any, initSearchModal: any,searchModel:any) => {
    const c = { ...myConfig };

    const gridParams: any = {
      initSearchModal: initSearchModal,
    }
    c.gridParams = gridParams;
    const ckny = initSearchModal[0].value.substr(0,4)+'-'+initSearchModal[0].value.substr(4,6);
    const ckny1 = initSearchModal[1].value.substr(0,4)+'-'+initSearchModal[1].value.substr(4,6);

    const timeQ = myUtil.date.formatData(myUtil.date.getMonthFirstDay(ckny));
    const timeZ = myUtil.date.formatData(myUtil.date.getMonthLastDay(ckny1));
    c.grid_filter_quick[0].defaultValue = [timeQ, timeZ];
    c.layout_type = 'modal';
    const ckhth = param?.record?.ckhth;
    c.filter_items[1].defaultValue= ckhth ? ckhth : '';
    c.toolbar_default = {
      sjgxUpdateData: false,               // 是否显示更新台账数据，默认关闭
      ckts_download: true,                      // 是否显示导出，默认关闭
      setting: true,                      // 是否显示设置按钮，默认关闭
      full: true,                          // 是否显示全屏按钮，默认关闭
      reload: true,                        // 是否显示刷新按钮，默认关闭
    };

    setMyconfig(c);
    setModalVisible(true);
    setGridRef(param.gridRef);

  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <Drawer
      title="出口报关单明细表"
      visible={modalVisible}
      onClose={() => {setModalVisible(false)}}
      width={pro.c_modal_width_x3}
      destroyOnClose={true}
      className="dd_data_page_modal"
    >
      <DDBunit2 config={myConfig} func={Func} />
    </Drawer>
  );
};

export default DrawerList;
