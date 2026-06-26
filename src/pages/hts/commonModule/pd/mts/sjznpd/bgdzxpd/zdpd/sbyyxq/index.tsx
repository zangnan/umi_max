/**
 * 按报关单智能配单 --- 自动配单 -- 失败详情
 */
import React, { useState, useImperativeHandle } from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import CONSTANTS from '@/components/DDAssist/constants';
import { Drawer, message } from 'antd';
import Config from './config';
import { cloneDeep } from 'lodash';
import myUtil from '@/components/DDAssist/util';
import { exportPager } from '@/pages/hts/services/htsApi';

export interface ZzsfpSxProps {
  onRef?: any;
  visible?: any;
}

const Index: React.FC<ZzsfpSxProps> = ({ onRef, visible = false }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [queryParam, setQueryParam] = useState<any>();
  let myConfig = cloneDeep(Config);
  const Func: any = {
    unitRef: React.createRef(),
  };

  Func.download = async () => {
    const data: any = {
      key: 'CX_SAAS_ZDPD_PDJG_CKXQ',
      searchModel: queryParam.searchModel,
      orderModel: []
    };
    exportPager(data).then((response) => {
      const { code, body, desc } = response;
      if (code === '200') {
        const { blob, fileName } = body;
        myUtil.file.downloadExcel(blob, fileName);
      } else {
        message.error(desc);
      }
    })
  }
  // 开启
  const showModal = (param: any) => {
    setModalVisible(true);
    setQueryParam(param);
  };
  myConfig.gridParams = {
    initSearchModal: queryParam?.searchModel,
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <Drawer
      title="失败原因"
      destroyOnHidden={true}
      className='dd_data_page_modal'
      visible={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X4}
      onClose={() => setModalVisible(false)}
      mask={{ closable: false }}
    >
      <DDBunit2 config={myConfig} func={Func} />
    </Drawer>
  );
}

export default Index;
