// 生成进货
import React, { useImperativeHandle, useState } from 'react';
import { message, Modal, Radio, Form, Input, Spin, Button } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import '@/pages/hts/commonModule/style.less';
import baseValidator from '@/components/DDAssist/field/baseValidator';
import { xzHxgQxz, jyQxzSfcz } from '@/pages/hts/services/htsApi';

export interface DDTsort {
  onRef?: any;
  visible?: any;
}

const Add: React.FC<DDTsort> = ({ onRef, visible = false }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [form] = Form.useForm();
  const [masker, setMasker] = useState<boolean>(false);
  const [ediybz, setEdiybz] = useState<boolean>(false);
  const [title, setTitle] = useState('新增');
  const [mainRef, setMainRef] = useState<any>({}); //主页面的ref
  const [editFlag, setEditFlag] = useState<any>();


  // 开启
  const showModal = (param: any, flag: any) => {
    setMainRef(param);
    setEditFlag(flag);
    setModalVisible(true);
    // 表单初始化
    initForm(param, flag);
  };


  // useImperativeHandle
  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 表单初始化
  const initForm = (param: any, flag: any) => {
    if (flag == 'edit') {
      setTitle('编辑');
      setEdiybz(true);
      const { selectionRows } = param;
      if (selectionRows[0].dqbz1 === 'Y') {
        selectionRows[0].qxzbs = 'dqbz'
      } else if (selectionRows[0].qdbz3 === 'Y') {
        selectionRows[0].qxzbs = 'qdbz'
      } else {
        selectionRows[0].qxzbs = 'yhbz'
      }
      form.setFieldsValue(selectionRows[0]);
    }
  };

  const close = () => {
    form.resetFields();
    setEdiybz(false);
    setModalVisible(false);
    setMainRef({});
    mainRef.unitRef.current!.reload2();
  }

  const save = async () => {
    const formValues = await form.validateFields();
    const qxzbs = formValues.qxzbs;
    formValues.dqbz1 = 'N';
    formValues.qdbz3 = 'N';
    formValues.yhbz = 'N';
    formValues.qybz2 = 'N';
    if (qxzbs == 'dqbz') {
      formValues.dqbz1 = 'Y'
    } else if (qxzbs == 'qdbz') {
      formValues.qdbz3 = 'Y'
    } else if (qxzbs == 'qybz2') {
      formValues.qybz2 = 'Y'
    } else {
      formValues.yhbz = 'Y'
    }
    setMasker(true);
    await xzHxgQxz(formValues).then((response: any) => {
      setMasker(false);
      if (response.code === '200') {
        // 清空选中并设置按钮可用状态
        message.success('操作成功！');
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
      visible={modalVisible}
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
          <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="权限组代码" name="qxzDm"
            rules={
              editFlag == 'edit' ? [] :
                [{ required: true, message: '请输入权限组代码' },
                baseValidator.number(),
                baseValidator.len(6),
                () => ({
                  async validator(_, value) {
                    if (value.length == 6) {
                      setMasker(true);
                      await jyQxzSfcz({ "qxzDm": value }).then((response: any) => {
                        setMasker(false);
                        if (response.code === '200') {
                          return Promise.resolve();
                        } else {
                          return Promise.reject(new Error(response.msg));
                        }
                      })
                    }
                    return Promise.resolve();
                  },
                })
                ]
            }
          >
            <Input placeholder="请输入权限组代码" maxLength={6} disabled={ediybz} />
          </Form.Item>
          <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="权限组名称" name="qxzmc"
            rules={[{ required: true, message: '请输入权限组名称' },]}>
            <Input placeholder="权限组名称" maxLength={500} />
          </Form.Item>
          <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="权限组描述" name="qxzms">
            <Input.TextArea placeholder="权限组描述" maxLength={1000} autoSize={{ minRows: 5, maxRows: 12 }} />
          </Form.Item>
          <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="权限组标识" name="qxzbs"
            rules={[{ required: true, message: '请选择权限组标识' },]} initialValue={'dqbz'}>
            <Radio.Group disabled={ediybz}>
              <Radio key='dqbz' value='dqbz'>地区标志</Radio>
              <Radio key='qdbz' value='qdbz'>渠道标志</Radio>
              <Radio key='yhbz' value='yhbz'>用户标志</Radio>
              <Radio key='qybz2' value='qybz2'>企业标志</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="有效标志" name="yxbz"
            rules={[{ required: true, message: '请选择有效标志' },]} initialValue={'Y'}>
            <Radio.Group>
              <Radio key='Y' value='Y'>是</Radio>
              <Radio key='N' value='N'>否</Radio>
            </Radio.Group>
          </Form.Item>
          
        </Form>
      </Spin>
    </Modal>
  );
}

export default Add;