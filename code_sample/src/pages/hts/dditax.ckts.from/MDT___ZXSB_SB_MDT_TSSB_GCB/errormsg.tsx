import myUtil from '@/pages/common/myUtil';
import React, { useImperativeHandle, useState } from 'react';
import { Modal, Button, Table, message } from 'antd';
import { commonDrwtdc } from '@/services/hts/api';
import pro from '@/pages/common/proConfig';

export interface DDModalGridProps {
  onRef?: any;
  visible?: any;
  data?: any;
}

const ErrorMsgGrid: React.FC<DDModalGridProps> = ({
  onRef,
  visible = false,
  data = {},
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);// Modal是否可以显示
  const [modalData, setModalData] = useState<any>(data);// Modal是否可以显示
  const [key, setKey] = useState<any>('');// Modal是否可以显示
  // 开启
  const showModal = (param: any, param1: any) => {
    setModalVisible(true);
    setModalData(param);
    setKey(param1);
  };
  // 导出错误信息
  const exportErrorMessage = (param: string) => {
    commonDrwtdc({ key: param }).then((response) => {
      if (response.code === '200') {
        const { blob, fileName } = response.body;
        myUtil.file.downloadExcel(blob, fileName);
        setModalVisible(false);
      } else {
        message.error(response.desc);
      }
    })
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 配置项：列表列
  const myColumns = [
    {
      title: '序号', dataIndex: 'index', width: 60, render: (_text: any, _record: any, index: number) => (
        <span key={index.toString()}>{index + 1}</span>)
    },
    { title: '失败原因', dataIndex: 'sbyy', width: 200 },
  ];

  return (
    <>
      <Modal
        title='系统消息'
        destroyOnClose={true}
        visible={modalVisible}
        width={pro.c_modal_width_x4}
        wrapClassName='standard-modal-1'
        footer={(<>
          <Button onClick={() => setModalVisible(false)} >关闭</Button>
          <Button onClick={() => exportErrorMessage(key)} >导出异常信息</Button>
        </>)}
        onCancel={() => setModalVisible(false)}
      >
        <>
          <Table
            rowKey='uuid'
            dataSource={modalData.drycxx}
            columns={myColumns}
            pagination={false}
            size={'small'}
            bordered={true}
          />
        </>
      </Modal>
    </>
  );
};

export default ErrorMsgGrid;
