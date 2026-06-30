/**
 * 商品信息
 */
import React, { useState, useImperativeHandle } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import CONSTANTS from '@/components/DDAssist/constants';
import { Drawer } from 'antd';
import Config from './config';

export interface ZzsfpSxProps {
  onRef?: any;
  visible?: any;
}

const Tjfp: React.FC<ZzsfpSxProps> = ({ onRef, visible = false }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [myConfig, setMyconfig] = useState<any>(Config);

  const Func: any = {};

  // 开启
  const showModal = (param: any, type: any) => {
    const { record } = param;
    const c = { ...myConfig };
    const gridParams: any = {
      initSearchModal: [
        {op: 'al', property: 'zbuuid', value: record.uuid },
      ],
    }
    c.gridParams = gridParams;
    if (type === 'ckxsht') { // 出口销售合同
      c.api_grid_query = `/yw/badze/ckxsht/queryCkxshtSpxxPage`;
      c.grid_columns = [
        { title: '商品名称', dataIndex: 'spmc', width: 140, ellipsis: true },
        { title: '单位', dataIndex: 'jldwmc', width: 70, ellipsis: true },
        { title: '数量', dataIndex: 'sl', width: 145, align: 'right', render: { type: 'number', format: '0,0.00000' } }
      ]
    } else if (type === 'ghht') { // 购货合同
      c.api_grid_query = `/yw/badze/ghht/queryGhhtSpxxPage`;
      c.grid_columns = [
        { title: '商品名称', dataIndex: 'spmc', width: 140, ellipsis: true },
        { title: '单位', dataIndex: 'jldwmc', width: 70, ellipsis: true },
        { title: '数量', dataIndex: 'sl', width: 145, align: 'right', render: { type: 'number', format: '0,0.00000' } }
      ]
    } else if (type === 'tyd') { // 提运单
      c.api_grid_query = `/yw/badze/tyd/queryTydSpxxPage`;
      c.grid_columns = [
        { title: '商品名称', dataIndex: 'spmc', width: 140, ellipsis: true },
        { title: '单位', dataIndex: 'dw', width: 100 },
        { title: '数量', dataIndex: 'sl', width: 145, align: 'right', render: { type: 'number', format: '0,0.00000' } }
      ]
    } else if (type === 'ysfp') { // 运输发票
      c.api_grid_query = `/yw/badze/ysfp/queryYsfpSpxxPage`;
      c.grid_columns = [
        { title: '货物或应税劳务、服务名称', dataIndex: 'hwhyslwfwmc', width: 140, ellipsis: true }
      ]
    } else if (type === 'dlbgfwffp') { // 代理报关服务费发票
      c.api_grid_query = `/yw/badze/dlbgfwfp/queryDlbgfwfpSpxxPage`;
      c.grid_columns = [
        { title: '货物或应税劳务、服务名称', dataIndex: 'spmc', width: 140, ellipsis: true }
      ]
    }
    setMyconfig(c);
    setModalVisible(true);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <Drawer
      title="商品信息"
      destroyOnHidden={true}
      className='dd_data_page_modal'
      visible={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X2}
      onClose={() => setModalVisible(false)}
      mask={{ closable: false }}
      zIndex={1000}
    >
      <DDBunit2 config={myConfig} func={Func} />
    </Drawer>
  );
}

export default Tjfp;
