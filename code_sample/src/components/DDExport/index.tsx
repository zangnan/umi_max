import React, { useImperativeHandle, useState, memo } from 'react';
import {Button, Form, Checkbox, Radio, Space, Modal } from 'antd';
import FieldSetting from '@/components/DDExport/fieldSetting';
import pro from '@/pages/common/proConfig';

export interface DDExportProps {
  onRef?: any;
  visible?: any;
  data?: [];
}

const DDExport: React.FC<DDExportProps> = ({
  onRef,
  visible = false,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const refFieldSetting: any = React.createRef();

  // console.info('render DDExport ~~~')

  // 开启
  const showModal = () => {
    setModalVisible(true);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  // const options1 = [
  //   { label: '按照18位报关单表头数据导出', value: 'hgsxtzs' },
  //   { label: '按照21位报关单商品明细导出', value: 'sfdj' },
  // ];
  const options2 = [
    { label: '导出海关事项通知书', value: 'hgsxtzs' },
    { label: '导出随附单据', value: 'sfdj' },
  ];

  // 字段设置
  const handleSetField= () => {
    refFieldSetting.current!.showModal();
  };

  return (
    <>
    <Modal
      title="自定义导出"
      centered
      destroyOnClose
      visible={modalVisible}
      width={pro.c_modal_width_x1}
      onCancel={() => setModalVisible(false)}
      footer={(<>
        <Button onClick={handleSetField}type="default">字段设置</Button>
        <Button onClick={onFinish}type="primary">导出</Button>
        <Button onClick={() => setModalVisible(false)} type="default">关闭</Button>
      </>)}
    >
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <div style={{margin: "0 0 0 80px"}}>
          <Radio.Group>
            <Space direction="vertical">
              <Radio value={1}>按照18位报关单表头数据导出</Radio>
              <Radio value={2}>按照21位报关单商品明细导出</Radio>
            </Space>
          </Radio.Group>
        </div>
        <div style={{margin: "15px 0 15px 80px"}}>
          <Checkbox.Group options={options2} defaultValue={['hgsxtzs', 'sfdj']}/>
        </div>
        <div style={{margin: "0 0 0 80px"}}>
          <Radio.Group>
            <Space direction="horizontal">
              <Radio value={1}>按照EXCEL格式导出</Radio>
              <Radio value={2}>按照文本格式导出</Radio>
            </Space>
          </Radio.Group>
        </div>
      </Form>
      <FieldSetting onRef={refFieldSetting} />
    </Modal>
    </>
  );
};

export default memo(DDExport);