/**
 * 数据检查 报关单详情
 */
import React, { useImperativeHandle, useState } from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import CONSTANTS from '@/components/DDAssist/constants';
import { Drawer } from 'antd';

export interface BgdxqProps {
  onRef?: any;
}

const DrawerBgdxq: React.FC<BgdxqProps> = ({
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [myConfig, setMyConfig] = useState<any>();

  // 开启
  const showModal = (bgdNoEterArray: any) => {
    getMyConfig(bgdNoEterArray);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  }

  useImperativeHandle(onRef, () => {
    return {
      showModal,
      closeModal
    };
  });

  // 出口报关单信息配置
  const getMyConfig = (bgdNoEterArray: any) => {
    const myConfig: any = {
      grid_api_grid_query: `/yw/bszx/wbsj/bgd/queryBgd21Page`,
      grid_selection_type: false,
      show_toolbar: false,
      layout_type: 'modal',
      grid_scroll_y: '450px',
      grid_row_key: 'uuid',
      grid_columns: [
        { title: '商品编码', dataIndex: 'ckspDm', width: 100 },
        { title: '商品名称', dataIndex: 'hgspmc', width: 120, ellipsis: true, },
        { title: '报关单号', dataIndex: 'ckbgdh', width: 180 },
        { title: '出口日期', dataIndex: 'ckrq1', render: { type: 'date', format: 'yyyy-MM-DD' }, width: 120 },
      ],
      gridParams: {
        initSearchModal: [
          { property: 'ckbgdhArr', value: bgdNoEterArray.split(';'), op: 'al' },
        ],
      }
    }
    setMyConfig(myConfig);
  };
  // 共同方法集合
  const Func = {
  }

  return (
    <Drawer
      title="报关单详情"
      visible={modalVisible}
      onClose={() => { setModalVisible(false) }}
      width={CONSTANTS.C_MODAL_WIDTH_X3}
      destroyOnHidden={true}
      className="dd_data_page_modal"
      zIndex={1001}
    >
      <DDBunit2 config={myConfig} func={Func} />
    </Drawer>
  );
};

export default DrawerBgdxq;