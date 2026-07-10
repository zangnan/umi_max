/**
 * title: 用户管理-新增/修改用户
 * author: wx
 */
import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Modal, Button, Form, Spin, Input, Radio, message, } from 'antd';
import myUtil from '@/components/DDAssist/util';
import { saveOrUpdateQxfw, cxjslb, checkFwDm } from '@/pages/hts/services/htsApi';

export interface BdjgProps {
  onRef?: any;
}

const ModalForm: React.FC<BdjgProps> = ({
  onRef,
}) => {
  const [masker, setMasker] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectOption, setSelectOption] = useState<any>([]);
  const [selectJs, setSelectJs] = useState<any>([]);
  const [flag, setFlag] = useState<any>();
  const [name, setName] = useState<any>([]);
  const [initParam, setInitParam] = useState<any>({});
  const [form] = Form.useForm();

  // 开启
  const showModal = async (param: any, flag: any) => {
    setInitParam(param);
    setModalVisible(true);
    if ("edit" == flag) {
      setFlag(true);
      setName("编辑");
      const { selectionRows } = param;
      form.setFieldsValue(selectionRows[0]);
    } else {
      setFlag(false);
      setName("新建");
    }
  };
  // 保存
  const save = () => {
    form.validateFields().then(values => {
      let param = { ...values };
      param.yxbz = param.yxbz == undefined ? "Y" : param.yxbz;
      setMasker(true);
      if(name == '编辑'){
        setMasker(true);
        saveOrUpdateQxfw(param).then((res2: any) => {
          const { code, msg } = res2;
          setMasker(false);
          if (code == '200') {
            close();
            message.success("保存成功！");
          } else {
            message.error(msg)
          }
        })
      }else{
        checkFwDm(param).then((res: any) => {
          const { code, msg } = res;
          setMasker(false);
          if (code == '200') {
            setMasker(true);
            saveOrUpdateQxfw(param).then((res2: any) => {
              const { code, msg } = res2;
              setMasker(false);
              if (code == '200') {
                close();
                message.success("保存成功！");
              } else {
                message.error(msg)
              }
            })
          } else {
            message.error(msg)
          }
        });
      }
      

    })
  };

  const close = () => {
    setModalVisible(false);
    form.setFieldsValue({});
    initParam?.refUnit.current?.reload();
  };


  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <Modal
      title={name}
      open={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X1}
      onCancel={() => setModalVisible(false)}
      footer={(<>
        <Button onClick={() => save()} type="primary">保存</Button>
        <Button onClick={() => close()} type="default">关闭</Button>
      </>)}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <Form
          form={form}
          name="form"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item name="fwDm" label="服务代码" rules={[{ required: true, message: '请录入服务代码' }]} >
            <Input placeholder="请录入服务代码" maxLength={10} disabled={flag} />
          </Form.Item>
          <Form.Item name="fwmc" label="服务名称" >
            <Input.TextArea placeholder="请录入服务名称" maxLength={50} showCount autoSize={{ minRows: 4, maxRows: 12 }} />
          </Form.Item>
          <Form.Item name="fwms" label="服务描述" >
            <Input.TextArea placeholder="服务描述" maxLength={50} showCount autoSize={{ minRows: 4, maxRows: 12 }} />
          </Form.Item>
          <Form.Item name="yxbz" label="有效标志" >
            <Radio.Group defaultValue={'Y'} >
              <Radio value='Y'>是</Radio>
              <Radio value='N'>否</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default ModalForm;
