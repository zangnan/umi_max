/**
 * title: 境外收货人配置-编辑
 */
import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Modal, Button, Form, Spin, Input, Tooltip, message, Select } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import myUtil from '@/components/DDAssist/util';
import { saveOrUpdateJwshr, cxjslb, cxqxzlb, queryDmAdminDqSaas, getJwshrInfo, yhsq } from '@/pages/hts/services/htsApi';
import moment from 'moment';
import baseValidator from '@/components/DDAssist/field/baseValidator';

export interface BdjgProps {
  onRef?: any;
  yhlx?: any;
}

const ModalForm: React.FC<BdjgProps> = ({
  onRef, yhlx
}) => {
  const [yhlx2, setYhlx2] = useState<any>(yhlx);
  const [masker, setMasker] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectOption, setSelectOption] = useState<any>([]);
  const [selectJs, setSelectJs] = useState<any>([]);
  const [selectQxz, setSelectQxz] = useState<any>([]);
  const [name, setName] = useState<any>([]);
  const [yhsqCode2, setYhsqCode2] = useState<any>([]);
  const [initParam, setInitParam] = useState<any>({});
  const [queryDmAdminDq, setQueryDmAdminDq] = useState<any>([]);
  const [form] = Form.useForm();
  const [ssqd, setSsqd] = useState<any>(true);
  const [yhlxDmbyRows, setYhlxDmbyRows] = useState<string>();


  // 开启
  const showModal = async (param: any, jwshruuid: any,name:any) => {
    setName(name);

    // 初始化加载页面
    await getJwshrInfo({ "jwshruuid": jwshruuid }).then((res: any) => {
      const { code, msg, body } = res;
      if (code == '200') {
        form.setFieldsValue(body);
      } else {
        message.error(msg)
      }
    });

    setInitParam(param);
    setModalVisible(true);
    setMasker(false);

  };
  // 保存
  const save = () => {
    form.validateFields().then(values => {
      setMasker(true);
      const params = form.getFieldsValue(true);

      saveOrUpdateJwshr(params).then((res: any) => {
        const { code, msg } = res;
        setMasker(false);
        if (code == '200') {
          close();
          message.success("保存成功！");
        } else {
          message.error(msg)
        }
      });
    })
  };

  const close = () => {
    setModalVisible(false);
    setSsqd(true);
    form.resetFields();
    setYhlxDmbyRows('');
    initParam?.unitRef.current?.reload2();
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
      onCancel={() => close()}
      footer={(<>
        <Button onClick={() => close()} type="default">关闭</Button>
        <Button onClick={() => save()} type="primary">保存</Button>
      </>)}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <Form
          form={form}
          name="form"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item label="规范化境外收货人" name="gfhjwshrmc"  >
            <Input placeholder="规范化境外收货人" disabled />
          </Form.Item>
          <Form.Item label="境外收货人" name="jwshrmc"  >
            <Input placeholder="境外收货人"  disabled/>
          </Form.Item>
          <Form.Item label="境外收货人别名" name="jwshrbm" rules={[ baseValidator.range2({ min: 0, max: 75 })]} >
            <Input placeholder="请输入境外收货人别名" />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default ModalForm;
