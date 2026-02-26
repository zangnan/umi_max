import React, { useState, useImperativeHandle, Fragment } from 'react';
import { Modal, Form, Input } from 'antd';
import { itemType } from '../DDForm/data.d';
import DDBaseForm from '../DDForm/DDBaseForm';
import CONSTANTS from '../DDAssist/constants';

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

  // 表单项: 生成申报数据
  const getFormItems = () => {
    const formItems = [];
    formItems.push({ name: 'famc', type: itemType.Input, label: '方案名称' });
    formItems.push({ name: 'fams', type: itemType.TextArea, label: '方案描述' });
    return formItems;
  }

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
    labelcol: { span: 5 },
    wrappercol: { span: 19 },
  };

  return (
    <Fragment>
      <Modal
        title="另存为方案"
        centered
        destroyOnHidden
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X1}
        okText="保存"
        cancelText="关闭"
        zIndex={1001}
        onCancel={() => setModalVisible(false)}
        onOk={handleSave}
      >
        <Form {...layout} initialValues={{}} form={form}>
          <Form.Item label="方案名称" name='famc'>
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
