/**
 * title: 用户管理-绑定角色
 * author: wx
 */
import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Modal, Button, Form, Spin, Input, Select, message } from 'antd';
import { getGridData, yhBdJs } from '@/pages/hts/services/htsApi';

export interface BdjgProps {
  onRef?: any;
}

const ModalForm: React.FC<BdjgProps> = ({
  onRef,
}) => {
  const [masker, setMasker] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectOption, setSelectOption] = useState<any>([]);
  const [initParam, setInitParam] = useState<any>({});
  const [selectionRowKeys, setSelectionRowKeys] = useState<any>({});
  const [form] = Form.useForm();

  // 开启
  const showModal = (param: any, selectionRowKeys: any) => {
    const data ={
      adQuery: [],
      page: 1,
      pageSize: 99999,
      searchModel: []
    }
    form.resetFields();
    getGridData(`/yw/dditSaas/qxjs/queryJsPager`, data).then((res) => {
      const { code, msg, body } = res;
      if (code == '200') {
        setSelectionRowKeys(selectionRowKeys);
        setInitParam(param);
        setModalVisible(true);
        if(body && body?.rows.length> 0){
          setSelectOption(body?.rows);
        } else {
          setSelectOption([]);
        }
      } else {
        message.error(msg);
      }
    })

  };
  // 保存
  const save = () => {
    form.validateFields().then(values => {
      setMasker(true);
      const params = {
        yhuuid1s: selectionRowKeys,
        jsDm: values.jsDm?values.jsDm:'',
      }
      yhBdJs(params).then((res: any) => {
        setMasker(false);
        const { code, msg } = res;
        if (code == '200') {
          initParam?.unitRef.current?.reload2();
          message.success("绑定角色成功！");
          setModalVisible(false);
        } else {
          message.error(msg)
        }
      })
    })
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <Modal
      title="绑定角色"
      visible={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X1}
      onCancel={() => setModalVisible(false)}
      footer={(<>
        <Button onClick={() => save()} type="primary">保存</Button>
        <Button onClick={() => setModalVisible(false)} type="default">关闭</Button>
      </>)}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <Form
          form={form}
          name="form"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item name="jsDm" label="角色名称">
            <Select placeholder="请选择角色名称">
              {selectOption.map((item: any) => (
                <Select.Option key={item.jsDm} value={item.jsDm}>{item.jsmc}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default ModalForm;
