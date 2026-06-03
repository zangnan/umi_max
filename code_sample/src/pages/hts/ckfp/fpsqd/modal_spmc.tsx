import React, { useImperativeHandle, useState } from 'react';
import { Space, Table, Input } from 'antd';
import pro from '@/pages/common/proConfig';
import { DrawerForm } from '@ant-design/pro-form';

export interface DDModalGridProps {
  onRef?: any;
  visible?: any;
  data?: any;
}

const allData = [
  { bm: 'A1111-01', hbbm: 'A1111-01', mc: '玉米', jc: '谷物', sm: '包括稻米、小麦', sl: '9%' },
  { bm: 'A1111-02', hbbm: 'A1111-02', mc: '玉米', jc: '谷物', sm: '包括稻米、小麦', sl: '9%' },
  { bm: 'A1111-03', hbbm: 'A1111-03', mc: '玉米', jc: '谷物', sm: '包括稻米、小麦', sl: '9%' },
];

const Spmc: React.FC<DDModalGridProps> = ({ onRef, visible = false }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);

  // 开启
  const showModal = () => {
    setModalVisible(true);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  const childColumns = [
    { title: '编码', dataIndex: 'bm' },
    { title: '合并编码', dataIndex: 'hbbm' },
    { title: '名称', dataIndex: 'mc' },
    { title: '简称', dataIndex: 'jc' },
    { title: '说明', dataIndex: 'sm' },
    { title: '税率', dataIndex: 'sl' },
  ];

  const inputCommonProps = {
    placeholder: '海关进出口商品编码',
    enterButton: "查询",
    onSearch: () => {
      onRef.current!.showModal();
      // onRef.current!.reload();
    }
  };
  return (
    <>
      <DrawerForm
        title="商品详情"
        visible={modalVisible}
        width={pro.c_modal_width_x2}
        onVisibleChange={setModalVisible}
      >
        <><Space style={{ marginBottom: 10 }}>海关进出口商品编码<Input.Search {...inputCommonProps} /></Space></>
        <Table
          dataSource={allData}
          columns={childColumns}
          pagination={false}
          size={'small'}
          bordered={true}
        />
      </DrawerForm>
    </>
  );
};

export default Spmc;
