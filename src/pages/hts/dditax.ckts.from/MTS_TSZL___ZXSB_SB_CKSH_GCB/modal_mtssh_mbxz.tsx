
import cktsUtil from '@/pages/hts/cktsUtil';
import React, { useImperativeHandle, useState, useEffect } from 'react';
import { Button, Spin, Modal, Form, Radio, Space, Input, message, Row, Col} from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import myUtil from '@/components/DDAssist/util';
import { downloadTemplate } from '@/pages/hts/services/htsApi';
import { intl as intl2 } from '@/components/DDAssist/util';
import { queryCkshSbxx } from '@/pages/hts/services/htsApi';



export interface AbgdBjProps {
  onRef?: any;
}

const ModelMbxz: React.FC<AbgdBjProps> = ({
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [formMbxz] = Form.useForm();
  const [masker, setMasker] = useState<boolean>(false); //
  const [kybz, setKybz] = useState<boolean>(false);
  const [sbxx, setSbxx] = useState<any>({});

  useEffect(() => {
    formMbxz.setFieldsValue(sbxx);
  }, [sbxx]);

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

   //开启
  const showModal = (unitRef: any) => {
    formMbxz.setFieldsValue({xzlx: '1', ssq: '', sbpc: ''});
    setKybz(false);
    setModalVisible(true);
    initSbxx();
  };

  const initSbxx = async () => {
    const params = {
      ywKey: 'MTS'
    }
    await queryCkshSbxx(params).then((res: any) => {
      if (res.code === '200') {
        setSbxx(res?.body);
      }
    });
  }

  // 下载模板
  const handlerMbxz = () => {
    formMbxz.validateFields().then((values: any) => {
      const params: any = {
        key: 'SAAS_TSSB_MXCJ_CKSH_WM_MBDC',
        sfScsm: 'Y'
      }
      const xzlx = values.xzlx;
      if (xzlx === '2') {
        params.sfBhsj = 'N';
      } else {
        params.sfBhsj = 'Y';
      }
      const searchModel = [];
      if (xzlx === '1') {
        searchModel.push({property: 'ssq', value: values.ssq, op: 'zdy'});
        searchModel.push({property: 'sbpc', value: values.sbpc, op: 'zdy'});
        searchModel.push({property: 'ywKey', value: 'MTS', op: 'zdy'});
      }
      params.searchModel = searchModel;
      params.orderModel = [];
      setMasker(true);
      downloadTemplate(params).then(async (res) => {
        const {code, body, desc} = res;
        if (code === '200') {
          const { blob, fileName } = body;
          myUtil.file.downloadExcel(blob, fileName);
          setMasker(false);
          setModalVisible(false);
        } else {
          setMasker(false);
          message.error(desc);
        }
      });
    });
  }

  // 修改下载报关单类型
  const handlerxzlxChange = (e: any) => {
    const val = e?.target?.value;
    if (val === '2') {
      formMbxz.setFieldsValue({xzlx: val, ssq: '', sbpc: ''});
      setKybz(true);
    } else {
      setKybz(false);
    }
  }

  return (
      <Modal
        title="模板下载"
        destroyOnHidden={true}
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X1}
        mask={{ closable: false }}
        footer={
          <>
            <Button onClick={() => setModalVisible(false)}>取消</Button>
            <Button onClick={handlerMbxz} type="primary">确定</Button>
          </>
        }
        onCancel={() => setModalVisible(false)}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <Form
            form={formMbxz}
            name="form"
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
        >
          <Form.Item name="xzlx">
            <Radio.Group  onChange={handlerxzlxChange}>
              <Space direction="vertical">
                <br/>
                <Radio key={'mtsSh'} value={'1'}>下载指定所属期/批次模板<br/><br/>
                  <Row>
                    <Col span={12}>
                      <Form.Item label='所属期' name="ssq" rules= {[
                        () => ({
                          validator(_: any, value: any) {
                            const {xzlx} = formMbxz.getFieldsValue();
                            if (xzlx === '1') {
                              if (value === '' || value === undefined) {
                                return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_required' })));// '请输入所属期！'
                              } else if (!value.match(/^[1-9]\d{3}(0[1-9]|1[0-2])$/)) {
                                return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_d_yyyyMM' })));// '请输入正确的年月格式yyyyMM！'
                              }
                            }
                            return Promise.resolve();
                          },
                        })
                      ]} >
                        <Input placeholder="所属期" disabled={kybz} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item  label='批次' name="sbpc" rules= {[
                        () => ({
                          validator(_: any, value: any) {
                            const {xzlx} = formMbxz.getFieldsValue();
                            if (xzlx === '1') {
                              if (value === '' || value === undefined) {
                                return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_required' })));// '请输入申报批次！'
                              } else if (value && myUtil.text.getNumVal(value) <= 0) {
                                return Promise.reject(new Error('该项只能录入正数'));
                              } else if (!value.match(/^\d+$/)) {
                                return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_number' })));// '该项内容只能输入数字！'
                              } else if (value.length != 3) {
                                let message = cktsUtil.text.formatRepalce(intl2.formatMessage({ id: 'validator_v_eq' }), { len: 3 });
                                return Promise.reject(new Error(message));
                              }
                            }
                            return Promise.resolve();
                          },
                        })
                      ]}  >
                        <Input placeholder="批次" disabled={kybz} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Radio>
                <Radio key={'kmb'} value={'2'} >下载空模板<br/><br/></Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
        </Form>
        </Spin>
      </Modal>
  );
};

export default ModelMbxz;
