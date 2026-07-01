import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Modal, Button, Form, Spin, Input, Switch, Row, Col, Space, DatePicker, message, Tooltip } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { plxg } from '@/pages/hts/services/htsApi';

export interface BdjgProps {
  onRef?: any;
  handleModal?: any;
}

const ModalList: React.FC<BdjgProps> = ({
  onRef,handleModal
}) => {
  const [masker, setMasker] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [checkList, setCheckList] = useState<any>();

  const [form] = Form.useForm();
  

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 开启
  const showModal = (checkList: any) => {
    setCheckList(checkList);
    const xgxm = [];
    xgxm.push({xmmc:"",xgnr:"",xmlx:"bz"});
    form.setFieldsValue({xgxm});
    setModalVisible(true);
  };

  const save = async () => {
    const values = await form.validateFields();
    const list :any= [];
    checkList.forEach(element  => {
      list.push(element.fpsqduuid);
    });
    const param = {"fpsqduuids": list,...values};
    setMasker(true);
    plxg(param).then((response) => {
      setMasker(false);
      const { code,  msg } = response;
      if (code === '200') {
        message.success('追加备注项成功！');
      } else {
        message.error(msg);
      }
    });
    setModalVisible(false);
    handleModal();
  };
  
  return (
    <Modal
      title="追加备注项"
      open={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X2}
      onCancel={() => setModalVisible(false)}
      footer={(<>
        <Button onClick={() => save()}  type="primary">保存</Button>
        <Button onClick={() => setModalVisible(false)} type="default">关闭</Button>
      </>)}
      mask={{ closable: false }}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} form={form}>
          <Form.List name="xgxm" >
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item key={field.name}  >
                    <Space align="baseline">
                      <Form.Item label="备注项名称" name={[field.name, 'xmmc']} rules={[{ required: true, message: '请输入备注项名称' }]}>
                        <Input placeholder="请输入备注项名称" />
                      </Form.Item>
                      <Form.Item label="备注项内容" name={[field.name, 'xgnr']} rules={[{ required: true, message: '请输入备注项内容' }]} >
                        <Input placeholder="请输入备注项内容" />
                      </Form.Item>
                      <Form.Item label="备注项内容" name={[field.name, 'xmlx']} initialValue={"bz"} hidden={true}>
                      </Form.Item>
                      <Button icon={<PlusOutlined />}  size="small" onClick={() => add()} />
                      <Button icon={<MinusOutlined />} disabled={index == 0 ? true : false} size="small" onClick={() => { remove(field.name);}} />
                    </Space>
                  </Form.Item>
                ))}
              </>
            )}
          </Form.List>
        </Form>
      </Spin>
    </Modal>
  );
};

export default ModalList;
