/**
 * title: 角色管理-新增/修改角色
 * author: wx
 */
import React, {useImperativeHandle, useState} from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Button, Form, Input, message, Modal, Radio, Select, Spin} from 'antd';
import {getPzxx, savePzxx } from '@/pages/hts/services/htsApi';

export interface BdjgProps {
  onRef?: any;
}

const ModalForm: React.FC<BdjgProps> = ({
                                          onRef,
                                        }) => {
  const [masker, setMasker] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [initParam, setInitParam] = useState<any>({});
  const [unitRef, setUnitRef] = useState<any>();
  const [xtpzList, setXtpzList] = useState<[]>();
  const [xtpzSelect, setXtpzSelect] = useState<[]>();

  const [form] = Form.useForm();

  // 开启
  const showModal = async (param: any, unitRef: any) => {
    setInitParam(param);
    setUnitRef(unitRef);
    const css: any = [];
    await getPzxx({sbqyuuid: param.sbqyuuidDqlb}).then((response: any) => {
      const {code, msg, body} = response;
      if (code === '200') {
        setModalVisible(true);
        for (let i = 0; i < body.length; i++) {
          const op = {value: '', label: ''};
          op.label = body[i].csmc;
          op.value = body[i].csbm1;
          css.push(op);
        }
        setXtpzList(body);
        setXtpzSelect(css);
      } else {
        message.error(msg);
      }
    });
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  const close = () => {
    form.resetFields();
    setModalVisible(false);
  };

  const save = async () => {
    const v = await form.validateFields();
    v['sbqyuuid'] = initParam.sbqyuuidDqlb;
    await savePzxx(v).then((response: any) => {
      setMasker(false);
      if (response.code === '200') {
        close();
        unitRef?.current?.reload2();
        message.success('保存成功！');
      } else {
        message.error(response.msg);
      }
    })
  }

  const onChange = (e: any, flag: any) => {
    const pzx = xtpzList?.filter((item: any) => {
      return item['csbm1'] == e;
    })[0];
    // @ts-ignore
    form.setFieldsValue({cssz: pzx['cssz'], yxbz: pzx['yxbz']});
  }

  return (
    <>
      <Modal
        title='配置'
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X1}
        onCancel={() => close()}
        footer={(<>
          <Button onClick={() => save()} type="primary">保存</Button>
        </>)}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <Form
            form={form}
            name="form"
            labelCol={{span: 6}}
            wrapperCol={{span: 18}}
          >
            <Form.Item name="csbm1" label="参数" rules={[{required: true, message: '请选择参数!'}]}>
              <Select onChange={onChange} options={xtpzSelect}></Select>
            </Form.Item>
            <Form.Item name="cssz" label="参数值" rules={[{required: true, message: '请录入参数值'}]}>
              <Input placeholder="请录入参数值"/>
            </Form.Item>
            <Form.Item name="yxbz" label="有效标志" rules={[{required: true, message: '请选择有效标志数'}]}>
              <Radio.Group>
                <Radio key={"yxbzY"} value="Y">是</Radio>
                <Radio key={"yxbzN"} value="N">否</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};

export default ModalForm;
