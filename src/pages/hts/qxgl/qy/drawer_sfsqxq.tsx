/**
 * title: 企业管理-三方授权详情
 */
import React, {useImperativeHandle, useState} from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import {Drawer, Spin} from 'antd';
import Func from './f';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';

export interface BdjgProps {
  onRef?: any;
}

const DrawerForm: React.FC<BdjgProps> = ({
                                           onRef,
                                         }) => {
  const [masker, setMasker] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [myConfig, setMyconfig] = useState<any>();

  // 开启
  const showModal = (param: any, sbqyuuidDqlb: any) => {
    let configTmp: any = {
      module_type: 'QZ_type',
      pagination2: false,
      layout_type: 'modal',
      grid_api_grid_query: `/yw/dditSaas/qxqy/queryQySffwSqxxPager`,
      grid_selection_type: false,
      show_toolbar: false,
      grid_columns: [
        {title: '三方服务', dataIndex: 'sffwDm', width: 120, fixed: 'left', codeTable: 'CODE_DM_ZXSB_SFFW:01'},
        {title: '三方起始日期', dataIndex: 'tjrqqmc', width: 120},
        {title: '三方截止日期', dataIndex: 'tjrqzmc', width: 120},
        {
          title: '三方授权状态', dataIndex: 'sffwsqztDm', width: 100, codeTable: 'CODE_DM_ZXSB_SFFWSQZT:01', filter: {
            type: 'Select',
            codeTable: 'CODE_DM_ZXSB_SFFWSQZT:01',
          }
        },
      ],
      filter_items: [
        { name: 'sffwDm', type: 'Select', label: '三方服务', showSearch: true, codeTable: 'CODE_DM_ZXSB_SFFW:01' },
        { name: 'tjrqqmc', label: '三方起始日期', type: 'DatePicker', range: false },
        { name: 'tjrqzmc', label: '三方截止日期', type: 'DatePicker', range: false },
      ],
      gridParams: {
        initSearchModal: [
          {op: 'zdy', property: 'sbqyuuidDqlb', value: sbqyuuidDqlb},
        ],
      }
    };
    setMasker(false);
    setMyconfig(configTmp);
    setModalVisible(true);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <Drawer
      title="三方授权详情"
      className='dd_data_page_modal'
      open={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X3}
      destroyOnHidden={true}
      onClose={() => {
        setModalVisible(false)
      }}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <DDBunit2 config={myConfig} func={Func}/>
      </Spin>
    </Drawer>
  );
};

export default DrawerForm;
