/**
 * 报关单智能配单-- 自动配单 -- 生成明细
 */
import React, { useImperativeHandle, useState, memo } from 'react';
import { Button, Form, Modal, message, Input, Spin } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import { queryCjCsh, queryCjGlh, checkMtsTssbGlh, checkSsqPcYsb, pdjgScmx } from '@/pages/hts/services/htsApi';
import baseValidator from '@/components/DDAssist/field/baseValidator';
import myUtil from '@/components/DDAssist/util';

export interface ModalScmxProps {
  onRef?: any;
  visible?: any;
  reloadBgd?: any
}
const ModalScmx: React.FC<ModalScmxProps> = ({
  onRef,
  visible = false,
  reloadBgd
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [queryBgdParam, setQueryBgdParam] = useState<any>([]);
  const [bgdRowKeys, setBgdRowKeys] = useState<any>([]);
  const [mainParams, setMainParams] = useState<any>({});

  const [masker, setMasker] = useState<any>(false);
  const [form] = Form.useForm();

  // 开启
  const showModal = (params: any, queryBgdParam: any, bgdRowKeys: any) => {
    setMainParams(params);
    setQueryBgdParam(queryBgdParam);
    setBgdRowKeys(bgdRowKeys);
    form.resetFields();
    const getSsqAndSbpcParam: any = {
      lcswsxDm: '',
      tableKey: 'MTS_ZXSB_SB_MTS_TSSB_G',
    };
    queryCjCsh(getSsqAndSbpcParam).then((response) => {
      const { code, body } = response;
      if (code === '200') {
        const getGlhParam: any = {
          ssq: body?.ssq || '',
          sbpc: body?.sbpc || '',
        };
        queryCjGlh(getGlhParam).then((response) => {
          setModalVisible(true);
          const { code, body: glhBody } = response;
          if (code === '200') {
            form.setFieldsValue({
              ssq: body.ssq,
              sbpc: body.sbpc,
              glh: glhBody.glh,
            });
          }
        })
      }
    })
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });


  // 确认
  const save = () => {
    const formValue =  form?.getFieldsValue();
    form.validateFields().then((values: any) => {
      const param = {
        ssq: formValue.ssq,
        sbpc: formValue.sbpc,
        glh: formValue.glh,
        tzsxbz: mainParams?.zdpdResult?.tzsxbz,
        cdDm: mainParams?.zdpdResult?.cdDm
      }
  
      for (let i = 0; i < queryBgdParam?.length; i++) {
        param[queryBgdParam[i].property] = queryBgdParam[i].value;
      }
      if (bgdRowKeys && bgdRowKeys.length > 0) {
        param['uuids'] = bgdRowKeys;
      }
      setMasker(true);
      pdjgScmx(param).then((response: any) => {
        const { msg } = response;
        setMasker(false);
        if (response.code == '200') {
          message.success('生成明细成功！');
          mainParams?.otherRef[1].current?.closeModalVisible();
          mainParams?.refUnit.current!.reload2();
          setModalVisible(false);
        } else {
          message.error(msg);
        }
      })
    });  
  }

  // 申报批次
  const sbpcValidator = () => {
    // 请求后端验证所属期是否已申报
    const validator = async (_rule: any, value: any) => {
      if (value) {
        const unitKey = 'MTS_ZXSB_SB_MTS_TSSB_G';
        const ssq = form?.getFieldValue('ssq');
        const sbpc = form?.getFieldValue('sbpc');
        await checkSsqPcYsb({
          ssq: ssq,
          sbpc: sbpc,
          tableKey: unitKey
        }).then((response) => {
          if (response.code === '900') {
            return Promise.reject(new Error(response.msg));
          }
          return Promise.resolve();
        }).catch((err) => {
          return Promise.reject(err);
        });
        return Promise.resolve();
      }
      return Promise.resolve();
    };
    return { validator };
  }
  // 关联号
  const glhValidator = () => {
    // 请求后端验证所属期是否已申报
    const validator = async (_rule: any, value: any) => {
      if (value) {
        const ssq = form?.getFieldValue('ssq');
        const sbpc = form?.getFieldValue('sbpc');
        const params = {
          ssq,
          sbpc,
          glh: value,
        }
        await checkMtsTssbGlh(params).then((res) => {
          if (res.code !== '200') {
            return Promise.reject(new Error(res.msg));
          }
          return Promise.resolve();
        }).catch((err) => {
          return Promise.reject(err);
        });
        return Promise.resolve();
      }
      return Promise.resolve();
    }
    return { validator };
  }

  // 申报年月change事件
  const ssqChange = () => {
    const ssq = form?.getFieldValue('ssq');
    const sbpc = form?.getFieldValue('sbpc');
    const glh = form?.getFieldValue('glh');
    // 赋值关联号
    // 外贸企业出口退税出口明细申报
    if (ssq && sbpc) {
      queryCjGlh({ssq,sbpc}).then((response) => {
        setModalVisible(true);
        const { code, body: glhBody } = response;
        if (code === '200') {
          var glhV = ssq + sbpc + '00000001';
          if (glhBody.glh) {
            glhV = glhBody.glh;
          }
          form.setFieldsValue({
            ssq: ssq,
            sbpc: sbpc,
            glh: glhV,
          });
        }
      });
      // if (glh) {
      //   form.setFieldsValue({ glh: ssq + sbpc + glh.substring(glh.length - 8, glh.length) });
      // } else {
      //   form.setFieldsValue({ glh: ssq + sbpc + '00000001' });
      // }
    }
  }
  // 申报批次change事件
  const sbpcChange = () => {
    let ssq = form?.getFieldsValue().ssq;
    let sbpc = form?.getFieldsValue().sbpc;
    let glh = form?.getFieldsValue().glh;
    if (sbpc && Number(sbpc) === 0) {
      sbpc = '';
    } else if (sbpc) {
      sbpc = myUtil.text.leadingZeroize(sbpc, 3);
    }
    form.setFieldsValue({
      sbpc: sbpc,
    });
    if (ssq && sbpc) {
      queryCjGlh({ssq,sbpc}).then((response) => {
        setModalVisible(true);
        const { code, body: glhBody } = response;
        if (code === '200') {
          var glhV = ssq + sbpc + '00000001';
          if (glhBody.glh) {
            glhV = glhBody.glh;
          }
          form.setFieldsValue({
            ssq: ssq,
            sbpc: sbpc,
            glh: glhV,
          });
        }
      });
      // if (glh) {
      //   form.setFieldsValue({ glh: ssq + sbpc + glh.substring(glh.length - 8, glh.length) });
      // } else {
      //   form.setFieldsValue({ glh: ssq + sbpc + '00000001' });
      // }
    }
  }

  return (
    <>
      <Modal
        title="生成明细"
        destroyOnHidden
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X1}
        onCancel={() => setModalVisible(false)}
        footer={(<>
          <Button onClick={() => setModalVisible(false)} type="default">取消</Button>
          <Button onClick={save} type="primary">确定</Button>
        </>)}
        className={`${masker ? 'dd_modal_show_masker' : ''}`}
        mask={{ closable: false }}
      >
        <Spin tip="Loading..." spinning={masker} key={'modalScmx'} delay={100}>
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            form={form}
          >
            <Form.Item label="申报年月" name="ssq" rules={[{ required: true, message: '请输入申报年月' }, baseValidator.yyyyMM(), baseValidator.range2({ min: 0, max: 6 })]}>
              <Input placeholder='请输入申报年月' size='small' onChange={ssqChange} />
            </Form.Item>
            <Form.Item label="申报批次" name="sbpc" rules={[{ required: true, message: '请输入申报批次' }, sbpcValidator(), baseValidator.number()]}>
              <Input placeholder='请输入申报批次' size='small' maxLength={3} onBlur={sbpcChange}/>
            </Form.Item>
            <Form.Item label="起始关联号" name="glh" rules={[{ required: true, message: '请输入起始关联号' }, glhValidator(), baseValidator.number(), baseValidator.range2({ min: 0, max: 17 })]}>
              <Input placeholder='请输入起始关联号' size='small' />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};

export default memo(ModalScmx);

