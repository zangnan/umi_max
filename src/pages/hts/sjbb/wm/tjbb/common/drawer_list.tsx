import dayjs from 'dayjs';
import React, { useImperativeHandle, useState } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import CONSTANTS from '@/components/DDAssist/constants';
import { Drawer } from 'antd';
import drawer_list_config from '../bgdtsqk/ckbgdmx/config';
import Func from '../bgdtsqk/ckbgdmx/f';
import myUtil from '@/components/DDAssist/util';
import moment from 'moment';
import { history } from 'umi';

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
  const showModal = (param: any, initSearchModal: any, unitKey: any) => {
    const c = { ...myConfig };
    const gridParams: any = {
      initSearchModal: initSearchModal,
    }
    c.gridParams = gridParams;
    c.layout_type = 'modal';
    if (history?.location?.pathname === '/hts/sjbb/wm/tjbb/ckqk/fyhz') {
      const timeQ = myUtil.date.getDateNYRBeforeCurr(0, dayjs(param.record.fzxmmc).startOf('month'));
      const timeZ = myUtil.date.getDateNYRBeforeCurr(0, dayjs(param.record.fzxmmc).endOf('month'))
      c.grid_filter_quick[0].defaultValue = [dayjs(timeQ), dayjs(timeZ)];
    } else {
      const searchModel = myUtil.localStore.getItem(unitKey) || [];
      const timeQ = myUtil.date.getDateNYRBeforeCurr(0, dayjs(searchModel[0].value).startOf('month'));
      const timeZ = myUtil.date.getDateNYRBeforeCurr(0, dayjs(searchModel[1].value).endOf('month'));
      c.grid_filter_quick[0].defaultValue = [dayjs(timeQ), dayjs(timeZ)];
    }
    c.grid_filter_quick[0].allowClear = false;
    c.filter_items = [
      { name: 'ckbgdh', label: '出口报关单号', type: 'Input'},
      { name: 'ckhth', label: '合同协议号', type: 'Input' },
      { name: 'jwshrmc', label: '境外收发货人', type: 'Input' },
      { name: 'jgfsDm', label: '监管方式名称', type: 'Select',mode: 'multiple',  showSearch: true, codeTable: 'CODE_DM_CKTS_HGJGFS:01' },
      { name: 'hggqkaDm', label: '出境口岸', type: 'Select', mode: 'multiple', showSearch: true, codeTable: 'CODE_DM_GY_HGGQKA:01' },
      { name: 'ydgdqszDm', label: '运抵国（地区）',mode: 'multiple',  type: 'Select', showSearch: true, codeTable: 'CODE_T_GBCODE_INFO:01' },
    ];
    if (history?.location?.pathname === '/hts/sjbb/wm/tjbb/ckqk/fgbckqk') { // 国别
      // c.filter_items.splice(5,1);
    } else if (history?.location?.pathname === '/hts/sjbb/wm/tjbb/ckqk/fkackqk') { // 口岸
      c.filter_items.splice(4,1);
    } else if (history?.location?.pathname === '/hts/sjbb/wm/tjbb/ckqk/fjgfsckqk') { // 监管方式
      c.filter_items.splice(3,1);
    } else if ( history?.location?.pathname === '/hts/sjbb/wm/tjbb/ckqk/htckqk') { // 合同出口情况
      c.filter_items.splice(1,1);
    } else if ( history?.location?.pathname === '/hts/sjbb/wm/tjbb/ckqk/fjwshrckqk') { // 境外收货人
      c.filter_items.splice(2,1);
    }

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
