/**
 * 台账配单明细-自动配单
 */
import React, { useImperativeHandle, useState } from 'react';
import { Button, Spin, Modal, Form, Checkbox, message, Input } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import myUtil from '@/components/DDAssist/util';
import { tssbTzpdScmx } from '@/pages/hts/services/htsApi';
import { intl as intl2 } from '@/components/DDAssist/util';
import baseValidator from '@/components/DDAssist/field/baseValidator';




export interface AbgdBjProps {
  onRef?: any;
  pduuid?:any;
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
  const [masker, setMasker] = useState<boolean>(false); //
  const [hhcblebal, setHhcblebal] = useState<any>('换汇成本（5-7）');

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

   //开启
  const showModal = (params: any) => {
    const {initValue} = params;
    setHhcblebal(initValue.hhcblebal);
    formScmx.setFieldsValue(initValue);
    setModalVisible(true);
  };

  const options = [
    { label: '合理范围', value: '1' },
    { label: '低于合理范围', value: '2' },
    { label: '高于合理范围', value: '3' },
  ];

  // 自动配单
  const handlerScmx = () => {
    formScmx.validateFields().then((values: any) => {
      const params = {
        pduuid: pduuid,
        tzpdztDm: tzpdztDm,
        ssq: values.ssq,
        sbpc: values.sbpc,
        hhcbbz: values.hhcbbz,
        glh: values.glh
      }
      setMasker(true);
      tssbTzpdScmx(params).then(async (res) => {
        setMasker(false);
        const {code, desc} = res;
        if (code === '200') {
          setModalVisible(true);
          closeScmx();
        } else {
          message.error(desc);
        }
      });
    });
  }

  return (
      <Modal
        title="生成明细"
        destroyOnHidden={true}
        visible={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X1}
        mask={{ closable: false }}
        footer={
          <>
            <Button onClick={() => setModalVisible(false)}>关闭</Button>
            <Button onClick={handlerScmx} type="primary">确定</Button>
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
            <Form.Item name="ssq" label="申报年月" labelCol={{ span: 8 }}  rules={[baseValidator.required(),() => ({
              validator(_, value) {
                if (value) {
                  if (!value.match(/^[1-9]\d{3}(0[1-9]|1[0-2])$/)) {
                    return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_d_yyyyMM' })));
                  }
                  if (value.length != 6) {
                    let message = myUtil.text.formatRepalce(intl2.formatMessage({ id: 'validator_v_eq' }), { len: 6 });
                    return Promise.reject(new Error(message));
                  }
                }
                return Promise.resolve();
              }})]}>
              <Input placeholder="申报年月" onChange={(event: any) => {
              const ssq = event.target.value;
              const sbpc = formScmx?.getFieldsValue().sbpc;
              const glh = formScmx?.getFieldsValue().glh;
              if (ssq && sbpc) {
                if (glh) {
                  formScmx.setFieldsValue({ glh: ssq + sbpc + glh.substring(glh.length - 8, glh.length) });
                } else {
                  formScmx.setFieldsValue({ glh: ssq + sbpc + '00000001' });
                }
              }
            }}/>
            </Form.Item>
            <Form.Item name="sbpc" label="申报批次" labelCol={{ span: 8 }}  rules={[baseValidator.required(),() => ({
              validator(_, value) {
                if (value) {
                  if (!value.match(/^\d+$/)) {
                    return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_number' })));
                  }
                  if (value.length != 3) {
                    let message = myUtil.text.formatRepalce(intl2.formatMessage({ id: 'validator_v_eq' }), { len: 3 });
                    return Promise.reject(new Error(message));
                  }
                }
              return Promise.resolve();
              }})]}>
              <Input placeholder="申报批次" onBlur={async (event: any) => {
              try {
                await formScmx.validateFields(['sbpc'])
                let sbpc = event.target.value;
                if (sbpc && Number(sbpc) === 0) {
                  sbpc = '001';
                } else if (sbpc) {
                  sbpc = myUtil.text.leadingZeroize(sbpc, 3);
                }
                formScmx.setFieldsValue({ sbpc: sbpc });
                const ssq = formScmx?.getFieldsValue().ssq;
                const glh = formScmx?.getFieldsValue().glh;
                if (ssq && sbpc) {
                  if (glh) {
                    formScmx.setFieldsValue({ glh: ssq + sbpc + glh.substring(glh.length - 8, glh.length) });
                  } else {
                    formScmx.setFieldsValue({ glh: ssq + sbpc + '00000001' });
                  }
                }
              } catch (error) {
              }
            }}/>
            </Form.Item>
            <Form.Item name="glh" label="起始关联号" labelCol={{ span: 8 }} rules={[{ required: true, message: '请输入起始关联号' },
          () => ({
            validator(_, value) {
              if (value) {
                if (!value.match(/^\d+$/)) {
                  return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_number' })));
                }
                const ssq = formScmx?.getFieldsValue().ssq
                const sbpc = formScmx?.getFieldsValue().sbpc;
                if (ssq && sbpc && (ssq +sbpc != value.substr(0,9))) {
                  return Promise.reject(new Error("与关联号规则（申报年月+申报批次+8位流水号）不符，请确认后操作！"));
                }
              }
              return Promise.resolve();
            }
          })
          ]}>
            <Input placeholder="请输入起始关联号" />
          </Form.Item>

            <Form.Item label={hhcblebal} labelCol={{ span: 8 }}  name='hhcbbz'
              rules={[
                  () => ({
                    validator(_, value) {
                      if (value.length === 0) {
                          return Promise.reject(new Error('勾选换汇成本'));
                      }
                      return Promise.resolve();
                    },
                  })
                ]}
                >
              <Checkbox.Group options={options} style={{ width: '100%',display: 'grid',marginTop:'5px' }}/>
              </Form.Item>
          </Form>
        </Spin>
      </Modal>
  );
};

export default ModelScmx;
