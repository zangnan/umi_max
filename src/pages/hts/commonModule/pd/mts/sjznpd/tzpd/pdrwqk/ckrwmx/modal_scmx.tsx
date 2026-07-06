import cktsUtil from '@/pages/hts/cktsUtil';
import React, { useImperativeHandle, useState } from 'react';
import { Button, Spin, Modal, Form, Checkbox, message, Input } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import myUtil from '@/components/DDAssist/util';
import { tssbTzpdScmx, queryCjGlh } from '@/pages/hts/services/htsApi';
import { intl as intl2 } from '@/components/DDAssist/util';
import baseValidator from '@/components/DDAssist/field/baseValidator';

export interface AbgdBjProps {
  onRef?: any;
  pduuid?: any;
  tzpdztDm?: any;
  closeScmx?: any;
}

const ModelScmx: React.FC<AbgdBjProps> = ({
                                            onRef,
                                            pduuid,
                                            tzpdztDm,
                                            closeScmx,
                                          }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [formScmx] = Form.useForm();
  const [masker, setMasker] = useState<boolean>(false);
  const [hhcblebal, setHhcblebal] = useState<any>('换汇成本（5-7）');

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 开启
  const showModal = (params: any) => {
    const { initValue } = params;
    setHhcblebal(initValue.hhcblebal);
    formScmx.setFieldsValue(initValue);
    setModalVisible(true);
  };

  const options = [
    { label: '合理范围', value: '1' },
    { label: '低于合理范围', value: '2' },
    { label: '高于合理范围', value: '3' },
  ];

  // 调用接口查询关联号
  const fetchGlh = async (ssq: string, sbpc: string) => {
    setMasker(true);
    try {
      const res = await queryCjGlh({ ssq, sbpc });
      if (res.code === '200' && res.body?.glh) {
        formScmx.setFieldsValue({ glh: res.body.glh });
      } else {
        message.error(res.desc || '查询关联号失败');
      }
    } catch (error) {
      message.error('接口调用失败');
    } finally {
      setMasker(false);
    }
  };

  // 申报年月变更处理
  const handleSsqChange = async (event: any) => {
    const ssq = event.target.value;
    const sbpc = formScmx.getFieldValue('sbpc');
    if (ssq && sbpc) {
      await fetchGlh(ssq, sbpc);
    }
  };

  // 申报批次变更处理
  const handleSbpcBlur = async (event: any) => {
    try {
      await formScmx.validateFields(['sbpc']);
      let sbpc = event.target.value;
      if (sbpc && Number(sbpc) === 0) {
        sbpc = '001';
      } else if (sbpc) {
        sbpc = myUtil.text.leadingZeroize(sbpc, 3);
      }
      formScmx.setFieldsValue({ sbpc });
      const ssq = formScmx.getFieldValue('ssq');
      if (ssq && sbpc) {
        await fetchGlh(ssq, sbpc);
      }
    } catch (error) {
      // 表单验证失败不做处理
    }
  };

  // 自动配单
  const handlerScmx = () => {
    formScmx.validateFields().then((values: any) => {
      const params = {
        pduuid: pduuid,
        tzpdztDm: tzpdztDm,
        ssq: values.ssq,
        sbpc: values.sbpc,
        hhcbbz: values.hhcbbz,
        glh: values.glh,
      };
      setMasker(true);
      tssbTzpdScmx(params).then(async (res) => {
        setMasker(false);
        const { code, desc } = res;
        if (code === '200') {
          setModalVisible(false);
          closeScmx();
        } else {
          message.error(desc);
        }
      });
    });
  };

  return (
    <Modal
      title="生成明细"
      destroyOnHidden={true}
      open={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X1}
      mask={{ closable: false }}
      footer={
        <>
          <Button onClick={() => setModalVisible(false)}>关闭</Button>
          <Button onClick={handlerScmx} type="primary">
            确定
          </Button>
        </>
      }
      onCancel={() => setModalVisible(false)}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <Form
          form={formScmx}
          name="form"
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 14 }}
        >
          <Form.Item
            name="ssq"
            label="申报年月"
            labelCol={{ span: 8 }}
            rules={[
              baseValidator.required(),
              () => ({
                validator(_, value) {
                  if (value) {
                    if (!value.match(/^[1-9]\d{3}(0[1-9]|1[0-2])$/)) {
                      return Promise.reject(
                        new Error(intl2.formatMessage({ id: 'validator_d_yyyyMM' }))
                      );
                    }
                    if (value.length !== 6) {
                      let message = cktsUtil.text.formatRepalce(
                        intl2.formatMessage({ id: 'validator_v_eq' }),
                        { len: 6 }
                      );
                      return Promise.reject(new Error(message));
                    }
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input
              placeholder="申报年月"
              onChange={handleSsqChange}
            />
          </Form.Item>
          <Form.Item
            name="sbpc"
            label="申报批次"
            labelCol={{ span: 8 }}
            rules={[
              baseValidator.required(),
              () => ({
                validator(_, value) {
                  if (value) {
                    if (!value.match(/^\d+$/)) {
                      return Promise.reject(
                        new Error(intl2.formatMessage({ id: 'validator_number' }))
                      );
                    }
                    if (value.length !== 3) {
                      let message = cktsUtil.text.formatRepalce(
                        intl2.formatMessage({ id: 'validator_v_eq' }),
                        { len: 3 }
                      );
                      return Promise.reject(new Error(message));
                    }
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input
              placeholder="申报批次"
              onBlur={handleSbpcBlur}
            />
          </Form.Item>
          <Form.Item
            name="glh"
            label="起始关联号"
            labelCol={{ span: 8 }}
            rules={[
              { required: true, message: '请输入起始关联号' },
              () => ({
                validator(_, value) {
                  if (value) {
                    if (!value.match(/^\d+$/)) {
                      return Promise.reject(
                        new Error(intl2.formatMessage({ id: 'validator_number' }))
                      );
                    }
                    const ssq = formScmx.getFieldValue('ssq');
                    const sbpc = formScmx.getFieldValue('sbpc');
                    if (ssq && sbpc && ssq + sbpc !== value.substr(0, 9)) {
                      return Promise.reject(
                        new Error(
                          '与关联号规则（申报年月+申报批次+8位流水号）不符，请确认后操作！'
                        )
                      );
                    }
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input placeholder="请输入起始关联号" />
          </Form.Item>

          <Form.Item
            label={hhcblebal}
            labelCol={{ span: 8 }}
            name="hhcbbz"
            rules={[
              () => ({
                validator(_, value) {
                  if (value.length === 0) {
                    return Promise.reject(new Error('勾选换汇成本'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Checkbox.Group
              options={options}
              style={{ width: '100%', display: 'grid', marginTop: '5px' }}
            />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default ModelScmx;
