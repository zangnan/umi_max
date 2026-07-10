import React, { useImperativeHandle, useState } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import CONSTANTS from '@/components/DDAssist/constants';
import { Drawer } from 'antd';
import Func from './f';
import hxmxconfig from './hxmxconfig';
import { cloneDeep } from 'lodash';
import myUtil from '@/components/DDAssist/util';
import moment from 'moment';



export interface BdjgProps {
  onRef?: any;
}

const DrawerList: React.FC<BdjgProps> = ({
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [param, setParam] = useState<any>();
  const [myconfig, setMyconfig] = useState<any>();
  const [title, setTitle] = useState<any>();


  // 开启
  const showModal = (param: any) => {
    setParam(param);
    setModalVisible(true);
    let c = cloneDeep(hxmxconfig);
    const gridParams: any = {
      initSearchModal: [
        { property: 'jljgszch', value: param?.record?.jljgszch, op: 'zdy' ,type: 1},
        //{ property: 'hxqsrq', value: moment(param?.record?.hxqsrq).format('YYYY-MM-DD'), op: 'zdy' ,type: 1},
        //{ property: 'hxjzrq', value: moment(param?.record?.hxjzrq).format('YYYY-MM-DD'), op: 'zdy' ,type: 1},

      ],
    }
    if (param?.record?.hxqsrq != null) {
      gridParams.initSearchModal.push({ property: 'hxqsrq', value: moment(param?.record?.hxqsrq).format('YYYY-MM-DD'), op: 'zdy' ,type: 1});
      gridParams.initSearchModal.push({ property: 'hxjzrq', value: moment(param?.record?.hxjzrq).format('YYYY-MM-DD'), op: 'zdy' ,type: 1});
    }
    gridParams.initSearchModal.push({property: 'ssq', value: param?.record?.ssq, op: 'zdy' ,type: 1});
    gridParams.initSearchModal.push({property: 'sbpc', value: param?.record?.sbpc, op: 'zdy' ,type: 1});
    c.gridParams = gridParams;
    const jljgszch :string = param?.record?.jljgszch
    if(jljgszch.startsWith('C')){
      setTitle(`手册号：${param?.record?.jljgszch} 实际分配率：${param?.record?.jljgsjfpl}`);
    }else{
      setTitle(`账册号：${param?.record?.jljgszch} 核销周期：${ myUtil.date.formatData(param?.record?.hxqsrq)} 至 ${myUtil.date.formatData(param?.record?.hxjzrq)} 实际分配率：${param?.record?.jljgsjfpl}`);
    }
    setMyconfig(c);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });


  const close = async () => {
    param?.refUnit.current?.reload();
    setModalVisible(false);
  }


  Func.handleCkmxtj = (param: any) => {
    const {otherRef} = param;
    const searchModel = param.refUnit.current.getGridParams().searchModel;
    // const initSearchModal = param.refUnit.current.getGridParams().initSearchModal;
    const initSearchModal = myconfig.gridParams.initSearchModal;
    const headerFilter = param.gridRef.current.getHeaderFilter();
    otherRef[3].current?.showModal(param, title, searchModel, initSearchModal, headerFilter);
  }

  return (
    <Drawer
      title={title}
      open={modalVisible}
      onClose={() => { close() }}
      width={CONSTANTS.C_MODAL_WIDTH_X4}
      destroyOnHidden={true}
      className="dd_data_page_modal"
    >
      <DDBunit2 config={myconfig} func={Func} />
    </Drawer>
  );
};

export default DrawerList;
