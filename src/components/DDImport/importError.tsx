import React, { useImperativeHandle, useState } from 'react';
import { Modal, Button, Table, message, Spin } from 'antd';
import CONSTANTS from '../DDAssist/constants';
import {commonDrwtdc } from '@/services/hts/api';
import myUtil from '../DDAssist/util';

export interface DDModalGridProps {
  onRef?: any;
  visible?: any;
}

const ErrorMsgGrid: React.FC<DDModalGridProps> = ({
  onRef,
  visible = false,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);// Modal是否可以显示
  const [data, setData] = useState<any>({});
  const [masker, setMasker] = useState<any>(false);
  const [buttenHidden, setButtenHidden] = useState<any>(false);

// 配置项：列表列
const error_grid_columns = [
  { title: '序号', dataIndex: 'xh', width: 60, },
  { title: '失败原因', dataIndex: 'sbyy', width: 200 },
];
  // 开启
  const showModal = (param: any,flag :any) => {
    //新增flag入参，'N' 为不显示导出按钮 ，不传或者传入其他，继续显示
    if ('N' === flag) {
      setButtenHidden(true);
    }
    setData(param);
    setModalVisible(true);
  };

  const dccwxx = () => {
    const params = {key: data.druuid};
    setMasker(true);
    commonDrwtdc(params).then((response) => {
      setMasker(false);
      if (response.code === '200') {
        const {blob, fileName} = response.body;
        myUtil.file.downloadExcel(blob, fileName);
      } else {
        message.error(response.desc);
      }
    });
  }

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <>
      <Modal
        title='导出Excel模板'
        destroyOnHidden={true}
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X4}
        wrapClassName='standard-modal-1'
        footer={(<>
          <Button onClick={() => setModalVisible(false)}>关闭</Button>
          <Button onClick={dccwxx} type="primary" hidden={buttenHidden} >导出数据</Button>
        </>)}
        onCancel={() => setModalVisible(false)}
        className={`${masker ? 'dd_modal_show_masker' : ''}`}
        mask={{ closable: false }}
      >
        <Spin description="Loading..." spinning={masker} delay={100}>
          <Table
            dataSource={data.drycxx}
            columns={error_grid_columns}
            pagination={false}
            size={'small'}
            bordered={true}
          />
        </Spin>
      </Modal>
    </>
  );
};

export default ErrorMsgGrid;