import dayjs from 'dayjs';
import React, { useImperativeHandle, useState } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import CONSTANTS from '@/components/DDAssist/constants';
import { Drawer } from 'antd';
import drawer_list_config from '../zzszyfpmx/config';
import Func from '../zzszyfpmx/f';
import myUtil from '@/components/DDAssist/util';
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
    const yyyy =  initSearchModal[0].value.substring(0,4);
    const mm =  initSearchModal[0].value.substring(4,6);
    const timeQ = myUtil.date.formatDate(myUtil.date.getMonthFirstDay(yyyy+'-'+mm));
    const yyyy1 =  initSearchModal[1].value.substring(0,4);
    const mm1 =  initSearchModal[1].value.substring(4,6);
    const timeZ = myUtil.date.formatDate(myUtil.date.getMonthLastDay(yyyy1+'-'+mm1));
    c.layout_type = 'modal';
    c.grid_filter_quick[0].defaultValue = [dayjs(timeQ), dayjs(timeZ)];

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
      title="增值税专用发票明细"
      open={modalVisible}
      onClose={() => {setModalVisible(false)}}
      width={CONSTANTS.C_MODAL_WIDTH_X3}
      destroyOnHidden={true}
      className="dd_data_page_modal"
    >
      <DDBunit2 config={myConfig} func={Func} />
    </Drawer>
  );
};

export default DrawerList;
