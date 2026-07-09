// 生成进货
import React, {useImperativeHandle, useState} from 'react';
import { Button, Form, Input, message, Modal, Spin} from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import '@/pages/hts/commonModule/style.less';
import {saveCdfz } from '@/pages/hts/services/htsApi';
import baseValidator from '@/components/DDAssist/field/baseValidator';

export interface DDTsort {
  onRef?: any;
  visible?: any;
}

const Add: React.FC<DDTsort> = ({onRef, visible = false}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [form] = Form.useForm();
  const [masker, setMasker] = useState<boolean>(false);
  const [ediybz, setEdiybz] = useState<boolean>(false);
  const [title, setTitle] = useState('新增');
  const [mainRef, setMainRef] = useState<any>({}); //主页面的ref

  // 开启
  const showModal = (param: any, flag: any) => {
    //
    setMainRef(param);
    setModalVisible(true);
    // 表单初始化
    initForm(param, flag);
    initSelect();
  };

  // useImperativeHandle
  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 表单初始化
  const initSelect = async () => {
    setEdiybz(true);
  };


  // 表单初始化
  const initForm = (param: any, flag: any) => {
    if (flag == 'edit') {
      setTitle('编辑');
      const {selectionRows} = param;
      //登录验证标志
      form.setFieldsValue(selectionRows[0]);
    }
  };

  const close = () => {
    form.resetFields();
    setModalVisible(false);
  }

  const save = async () => {
    const formValues = await form.validateFields();
    const data = {
      "fzuuid": formValues.fzuuid,
      "fzmc": formValues.fzmc,
    };
    setMasker(true);
    await saveCdfz(data).then((response: any) => {
      setMasker(false);
      if (response.code === '200') {
        message.success('保存成功！');
        mainRef?.refUnit.current!.reload2();
        close();
      } else {
        message.error(response.msg);
      }
    })
  }

  return (
    <Modal
      title={title}
      destroyOnHidden={true}
      open={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X2}
      footer={<>
        <Button onClick={() => close()}>取消</Button>
        <Button onClick={save} type="primary">确定</Button>
      </>}
      onCancel={() => close()}
      mask={{ closable: false }}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <Form form={form}>
          <Form.Item labelCol={{span: 6}} wrapperCol={{span: 14}}
                     rules={[{message: '分组UUID'}, baseValidator.range2({min: 0, max: 32})]} label="分组UUID" name="fzuuid">
            <Input disabled={ediybz}/>
          </Form.Item>
          <Form.Item labelCol={{span: 6}} wrapperCol={{span: 14}}
                     rules={[{required: true, message: '分组名称'}, baseValidator.range2({min: 0, max: 30})]} label="分组名称" name="fzmc">
            <Input/>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}

export default Add;
