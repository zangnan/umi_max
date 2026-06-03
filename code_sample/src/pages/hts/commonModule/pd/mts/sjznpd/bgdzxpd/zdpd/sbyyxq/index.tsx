/**
 * 按报关单智能配单 --- 自动配单 -- 失败详情
 */
import React, { useState, useImperativeHandle } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import pro from '@/pages/common/proConfig';
import { Drawer, message } from 'antd';
import Config from './config';
import { cloneDeep } from 'lodash';
import myUtil from '@/pages/common/myUtil';
import { exportPager } from '@/services/hts/api';

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
      destroyOnClose={true}
      className='dd_data_page_modal'
      visible={modalVisible}
      width={pro.c_modal_width_x4}
      onClose={() => setModalVisible(false)}
      maskClosable={false}
    >
      <DDBunit2 config={myConfig} func={Func} />
    </Drawer>
  );
}

export default Index;
