/**
 * 下载条件-明细
 */
import React, {useImperativeHandle, useRef, useState} from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import CONSTANTS from '@/components/DDAssist/constants';
import {Drawer, message} from 'antd';
import config from './bgdbadzqsjc_mxck_config';
import func from './bgdbadzqsjc_mxck_f';
import IcList from '@/pages/hts/pzgl/icCard/common/icCardTsList';

export interface BdjgProps {
  onRef?: any;
}

const DrawerglFm: React.FC<BdjgProps> = ({
                                           onRef,
                                         }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [myConfig, setMyconfig] = useState<any>(config);
  const [badzlx, setBadzlx] = useState<any>(config);
  const [zrwuuid, setZrwuuid] = useState<any>(config);
  const [zymUnitRef, setZymUnitRef] = useState<any>(config);

  // 开启
  const showModal = (param: any) => {
    const aConfig = {...myConfig};
    const zrwid = param?.record?.zrwuuid;
    const srcs = param?.record?.srcs;
    const parsedSrcs = JSON.parse(srcs);
    setBadzlx(parsedSrcs?.badzlx);
    setZrwuuid(zrwid);
    setZymUnitRef(param?.unitRef);
    if (zrwuuid) {
      const gridParams = {
        initSearchModal: [
          {property: "zrwuuid", value: zrwid, op: "zdy"}
        ],
      }
      aConfig.gridParams = gridParams;
      setMyconfig(aConfig);
      setModalVisible(true);
    } else {
      message.error('查看明细打开失败')
    }
  };

  const refICList: any = useRef(); // 环境检测
  func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(refICList);
    return otherRef;
  };

  const closeModal = () => {
    debugger;
    zymUnitRef?.current!.reload2();
    setModalVisible(false);
  }

  useImperativeHandle(onRef, () => {
    return {
      showModal,
      closeModal
    };
  });

  func.getBadzlx = () => {
    return badzlx;
  }

  func.getZrwuuid = () => {
    return zrwuuid;
  }

  const saveHjjc = (flag: any) => {
    // 确认关闭
    refICList.current!.closeModal();
  }

  return (
    <Drawer
      title="明细查看"
      visible={modalVisible}
      onClose={() => {
        debugger;
        zymUnitRef?.current!.reload2();
        setModalVisible(false)
      }}
      width={CONSTANTS.C_MODAL_WIDTH_X3}
      destroyOnHidden={true}
      className="dd_data_page_modal"
      mask={{ closable: false }}
    >
      <DDBunit2 config={myConfig} func={func}/>
      <IcList onRef={refICList} saveBtn={saveHjjc}/>
    </Drawer>
  );
};

export default DrawerglFm;
