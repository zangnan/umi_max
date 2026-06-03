import React, { useState, useImperativeHandle, Fragment } from 'react';
import { Modal, Form, Input } from 'antd';
import pro from '@/pages/common/proConfig';

export type SchemeFormProps = {
  visible?: any;
  onRef?: any;
  data?: any;
  saveScheme?: any;
}

const SchemeForm: React.FC<SchemeFormProps> = ({
  visible = false,
  onRef,
  saveScheme,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [form] = Form.useForm();

  // 初始化数据
  const initFormData = () => {
    setModalVisible(true);
  }

  // 开启
  const showModal = () => {
    initFormData();
  };

  // 关闭
  const closeModal = () => {
    setModalVisible(false);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
      closeModal,
    };
  });

  // 表单提交
  const handleSave = () => {
    form.validateFields().then((values: any) => {
      if (saveScheme) {
        saveScheme(values);
      }
    })
  }

  // 表单设置
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  };

  return (
    <Fragment>
      <Modal
        title="另存为方案"
        centered
        destroyOnClose
        visible={modalVisible}
        width={pro.c_modal_width_x1}
        okText="保存"
        cancelText="关闭"
        zIndex={1001}
        onCancel={() => setModalVisible(false)}
        onOk={handleSave}
      >
        <Form {...layout} initialValues={{}} form={form}>
          <Form.Item label="方案名称" name='famc' rules={[{ required: true, message: '请录入方案名称' }]}>
            <Input placeholder="方案名称" />
          </Form.Item>
          <Form.Item label="方案描述" name='fams'>
            <Input.TextArea placeholder="方案描述" autoSize={{ minRows: 4, maxRows: 6 }}/>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};
export default SchemeForm;
