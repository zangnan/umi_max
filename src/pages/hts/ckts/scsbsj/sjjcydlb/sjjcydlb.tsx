// 数据检查异常疑点列表
import React, { useState, useImperativeHandle, Fragment } from 'react';
import DDBaseGrid from '@/components/DDBaseGrid';
import { Modal, Tag } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';

export type ExceptionGridProps = {
  data?: any;
  visible?: any;
  onRef?: any;
  ywKey?: any;
  onContinue?: any;
}

const ExceptionGrid: React.FC<ExceptionGridProps> = ({
  data,
  visible = false,
  onRef,
  ywKey,
  onContinue,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [params, setParams] = useState<any>({});

  // 开启
  const showModal = (params: any) => {
    setParams(params)
    setModalVisible(true);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 列表内容格式化: 是否可忽略
  const renderColumnSfkhlyd = (text: any) => {
    if (text === 'N') {
      return <Tag color="red">否</Tag>
    }
    if (text === 'Y') {
      return <Tag color="blue">是</Tag>
    }
    return <Tag color="cyan">{text}</Tag>;
  }

  // 配置列表列 操作列
  const getColumns = () => {
    const myColumns = [];
    myColumns.push({ title: '所属期', dataIndex: 'ssq', width: 75, align: 'center'  });
    if (ywKey === 'MDT') {
      myColumns.push({ title: '申报序号', dataIndex: 'sbxh', width: 90, align: 'center'  });
    } else if (ywKey === 'MTS') {
      myColumns.push({ title: '批次', dataIndex: 'sbpc', width: 60, align: 'center'  });
      myColumns.push({ title: '关联号', dataIndex: 'glh', width: 150, align: 'center'  });
    }
    myColumns.push();
    myColumns.push({ title: '业务表名', dataIndex: 'bzdsmc', width: 160  });
    myColumns.push({ title: '是否可忽略', dataIndex: 'sfkhlyd', width: 100, align: 'center', render: renderColumnSfkhlyd });
    myColumns.push({ title: '疑点描述', dataIndex: 'ydsm' });
    return myColumns;
  }

  // 继续按钮状态
  const setBtnProps = () => {
    for (let i = 0; i < data.length; i+=1) {
      if (data[i].sfkhlyd === 'N') { // 是否可忽略疑点
        return true;
      }
    }
    return false;
  }

  // 生成申报数据 3.2 跳转生成申报数据页面
  const popupCreateData = () => {
    setModalVisible(false);
    if (onContinue) {
      onContinue(params);
    }
  }

  return (
    <Fragment>
      <Modal
        title="数据检查异常疑点列表"
        centered
        destroyOnHidden
        open={modalVisible}
        wrapClassName='standard-modal-1'
        width={CONSTANTS.C_MODAL_WIDTH_X4}
        okText="继续"
        cancelText="关闭"
        okButtonProps={{disabled: setBtnProps()}}
        onCancel={() => setModalVisible(false)}
        onOk={popupCreateData}
      >
        <DDBaseGrid
          userDataSource = {data}
          columns={getColumns()}
          showSerialNumber
          scroll = { {x: 'max-content', y: window.innerHeight - 55 - 53 - 48 - 30 }}
          searchModel={{}}
          pagination={false}
        />
      </Modal>
    </Fragment>
  );
};
export default ExceptionGrid;
