import React, { useImperativeHandle, useState } from 'react';
import pro from '@/pages/common/proConfig';
import { Drawer } from 'antd';
import Func from '../tssbqk/f';
import sjbb_sbqd_ckmx01 from '../tssbqk/sjbb_sbqd_ckmx01';
import sjbb_sbqd_jhmx02 from '../tssbqk/sjbb_sbqd_jhmx02';
import DDBunit2 from '@/components/DDBunit/DDBunit2';

export interface BdjgProps {
  onRef?: any;
}

const DrawerList: React.FC<BdjgProps> = ({
  onRef,
}) => {
  const [modalVisibleWm, setModalVisibleWm] = useState<boolean>(false);
  const [myConfig, setMyconfig] = useState<any>(sjbb_sbqd_ckmx01);
  const [myTitle, setMyTitle] = useState<any>('');
  // 开启
  const showModal = (param: any, flag: any) => {
    setModalVisibleWm(true)
    let c = { gridParams: {}, grid_columns: [] };
    const gridParams = {
      initSearchModal: [
        { property: 'ssq', value: param.record.ssq, op: 'zdy' },
        { property: 'sbpc', value: param.record.sbpc, op: 'zdy' },
        { property: 'ghfnsrsbh1', value: param.record.ghfnsrsbh1, op: 'zdy' },
        { property: 'xzly', value: 'zbblgysqk', op: 'zdy' },
      ],
    }
    if (flag === 'CKMX') {
      let grid_columns = [...sjbb_sbqd_ckmx01.grid_columns];
      for (let i = grid_columns.length - 1; i >= 0; i--) {
        if (grid_columns[i]?.dataIndex === 'shbz') {
          grid_columns[i] = { title: '审核标志', dataIndex: 'shbz', width: 100, render: { func: 'renderTzShbz' } };
        }
      }
      c = { ...sjbb_sbqd_ckmx01, ...{ grid_columns: grid_columns } };
      setMyTitle('外贸企业出口退税出口明细申报表')
    } else if (flag === 'JHMX') {
      let tempFilterItems = [...sjbb_sbqd_jhmx02.filter_items];
      for (let i = tempFilterItems.length - 1; i >= 0; i--) {
        if (tempFilterItems[i]?.name === 'ghfnsrsbh1') {
          tempFilterItems.splice(i, 1);
        }
      }
      let grid_columns = [...sjbb_sbqd_jhmx02.grid_columns];
      for (let i = grid_columns.length - 1; i >= 0; i--) {
        if (grid_columns[i]?.dataIndex === 'shbz') {
          grid_columns[i] = { title: '审核标志', dataIndex: 'shbz', width: 100, render: { func: 'renderTzShbz' } };
        }
      }
      c = { ...sjbb_sbqd_jhmx02, ...{ filter_items: tempFilterItems, grid_columns: grid_columns } };
      setMyTitle('外贸企业出口退税进货明细申报表')
    }
    c.gridParams = gridParams;
    setMyconfig(c);
  };
  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <>
      <Drawer
        title={myTitle}
        visible={modalVisibleWm}
        onClose={() => { setModalVisibleWm(false) }}
        width={pro.c_modal_width_x4}
        destroyOnClose={true}
        className="dd_data_page_modal"
        key='sbqd'
        maskClosable={false}
      >
        <DDBunit2 config={myConfig} func={Func} key='wmqysbb' />
      </Drawer>
    </>
  );
};

export default DrawerList;
