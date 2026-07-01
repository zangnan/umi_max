// 小计
import React, { useState, useImperativeHandle } from 'react';
import DDBaseGrid from '@/components/DDBaseGrid';
import { Modal } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';

export type SumProps = {
  visible?: any;
  onRef?: any;
}

const Sum: React.FC<SumProps> = ({
  visible = false,
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [gridData, setGridData] = useState<any>([]);

  // 开启
  const showModal = (param: any) => {
    setGridData(param?.gridData);
    setModalVisible(true);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 配置列表列
  const getColumns = () => {
    const cols = [
      { title: '统计项', dataIndex: 'name' },
      { title: '总和', dataIndex: 'sum', align: 'right', width: 180 },
      { title: '平均值', dataIndex: 'avg', align: 'right', width: 180 },
      { title: '最大值', dataIndex: 'max', align: 'right', width: 180 },
      { title: '最小值', dataIndex: 'min', align: 'right', width: 180 },
    ];
    return cols;
  };

  return (
    <Modal
      title='小计'
      centered
      destroyOnHidden
      open={modalVisible}
      wrapClassName='standard-modal'
      width={CONSTANTS.C_MODAL_WIDTH_X4}
      footer={null}
      onCancel={() => setModalVisible(false)}
    >
      <DDBaseGrid
        userDataSource={gridData}
        pagination={false}
        columns={getColumns()}
      />
    </Modal>
  );
};
export default Sum;
