import React, { useImperativeHandle, useState } from 'react';
import { Modal, Button, Table, message, Spin } from 'antd';
import pro from '@/pages/common/proConfig';
import {commonDrwtdc } from '@/services/hts/api';
import myUtil from '@/pages/common/myUtil';


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
  const [buttenHidden, setButtenHidden] = useState<any>('');

// 配置项：列表列
const error_grid_columns = [
  {
    title: '序号', dataIndex: 'xh', width: 20,
  },
  { title: '报关单号', dataIndex: 'ckbgdh', width: 100 },
];
  // 开启
  const showModal = (param: any,flag :any) => {
    //新增flag入参，'N' 为不显示导出按钮 ，不传或者传入其他，继续显示 
    if ('N' == flag) { 
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
        title='系统消息'
        destroyOnClose={true}
        visible={modalVisible}
        width={pro.c_modal_width_x2}
        wrapClassName='standard-modal-1'
        footer={(<>
          <Button onClick={() => setModalVisible(false)}>关闭</Button>
          <Button onClick={dccwxx} type="primary" hidden={buttenHidden} >导出数据</Button>
        </>)}
        onCancel={() => setModalVisible(false)}
        className={`${masker ? 'dd_modal_show_masker' : ''}`}
        maskClosable={false}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <>{data.msg}
            <Table
              dataSource={data.bgdlist}
              columns={error_grid_columns}
              pagination={false}
              size={'small'}
              bordered={true}
            />
          </>
        </Spin>
      </Modal>
    </>
  );
};

export default ErrorMsgGrid;