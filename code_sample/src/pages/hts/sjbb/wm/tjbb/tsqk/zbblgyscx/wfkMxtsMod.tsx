import React, { useImperativeHandle, useState } from 'react';
import pro from '@/pages/common/proConfig';
import { Drawer } from 'antd';
import Func from '../wfkmxcx/f';
import wfk_ckmx01 from '../wfkmxcx/config';
import wfk_jhmx02 from '../wfkmxcx/configJh';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import myUtil from '@/pages/common/myUtil';
import moment from 'moment';

export interface BdjgProps {
  onRef?: any;
}

const DrawerList: React.FC<BdjgProps> = ({
  onRef,
}) => {
  const [modalVisibleWm, setModalVisibleWm] = useState<boolean>(false);
  const [myConfig, setMyconfig] = useState<any>(wfk_ckmx01);
  const [myTitle, setMyTitle] = useState<any>('');
  // 开启
  const showModal = (param: any, flag: any) => {
    setModalVisibleWm(true)
    let c = { gridParams: {}, grid_columns: [] };
    const gridParams = {
      initSearchModal : [
        { property: 'ghfnsrsbh1', value: param.record.ghfnsrsbh1, op: 'zdy' },
      ]
    };
    if (flag === 'CKMX') {
      let tmpToolbarDefault = {...wfk_ckmx01.toolbar_default};
      tmpToolbarDefault.sjgxUpdateData = false;
      let tempFilterItems = [...wfk_ckmx01.filter_items];
      for (let i = tempFilterItems.length - 1; i >= 0; i--) {
        if (tempFilterItems[i]?.name === 'sbrq') {
          tempFilterItems[i].defaultValue = [moment(myUtil.date.formatDate(param.record.sbrq1,'YYYY-MM-DD')), moment(myUtil.date.formatDate(param.record.sbrq1,'YYYY-MM-DD'))];
          tempFilterItems[i].allowClear = false;
        }
        if (tempFilterItems[i]?.name === 'ssq') {
          tempFilterItems[i].defaultValue = param.record.ssq;
        }
        if (tempFilterItems[i]?.name === 'sbpc') {
          tempFilterItems[i].defaultValue = param.record.sbpc;
        }
      }
      let grid_columns = [...wfk_ckmx01.grid_columns];
      c = { ...wfk_ckmx01, ...{filter_items: tempFilterItems, grid_columns: grid_columns, toolbar_default: tmpToolbarDefault ,grid_filter_quick: []} };
      setMyTitle('外贸企业出口退税出口明细申报表')
    } else if (flag === 'JHMX') {
      let tmpToolbarDefault = {...wfk_ckmx01.toolbar_default};
      tmpToolbarDefault.sjgxUpdateData = false;
      let tempFilterItems = [...wfk_jhmx02.filter_items];
      for (let i = tempFilterItems.length - 1; i >= 0; i--) {
        if (tempFilterItems[i]?.name === 'sbrq') {
          tempFilterItems[i].defaultValue = [moment(myUtil.date.formatDate(param.record.sbrq1,'YYYY-MM-DD')), moment(myUtil.date.formatDate(param.record.sbrq1,'YYYY-MM-DD'))];
          tempFilterItems[i].allowClear = false;
        }
        if (tempFilterItems[i]?.name === 'ssq') {
          tempFilterItems[i].defaultValue = param.record.ssq;
        }
        if (tempFilterItems[i]?.name === 'sbpc') {
          tempFilterItems[i].defaultValue = param.record.sbpc;
        }
      }
      let grid_columns = [...wfk_jhmx02.grid_columns];
      
      c = { ...wfk_jhmx02, ...{ filter_items: tempFilterItems, grid_columns: grid_columns, toolbar_default: tmpToolbarDefault,grid_filter_quick: []  } };
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
