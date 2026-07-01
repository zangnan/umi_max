
import React, { useImperativeHandle, useState, useEffect , useRef} from 'react';
import { Button, Spin, Modal, Form, Input, message, Row, Col} from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import myUtil, { intl as intl2 } from '@/components/DDAssist/util';
import { queryCkshSbxx, ckhwshQkTqsh } from '@/pages/hts/services/htsApi';
import ModalShtqjg from './modal_mdtsh_shtqjg';

export interface AbgdBjProps {
  onRef?: any;
}

const ModelShtq: React.FC<AbgdBjProps> = ({
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [formShtq] = Form.useForm();
  const [tqMasker, setTqMasker] = useState<boolean>(false); //
  const [sbxx, setSbxx] = useState<any>({});
  const refTqshJg: any = useRef();
  const [mainParams, setMainParams] = useState<any>();

  useEffect(() => {
    formShtq.setFieldsValue(sbxx);
  }, [sbxx]);

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

   //开启
  const showModal = (params: any) => {
    formShtq.setFieldsValue({xzlx: '1', ssq: '', sbpc: ''});
    setModalVisible(true);
    setMainParams(params);
    initSbxx();
  };

  const initSbxx = async () => {
    const params = {
      ywKey: 'MDT'
    }
    await queryCkshSbxx(params).then((res: any) => {
      if (res.code === '200') {
        setSbxx(res?.body);
      }
    });
  }

  const tqJgTitle = (ckbgdts: any, tqCgts: any, shts: any) => {
    return <>
    <span style={{fontSize: '14px', color: '#32363a'}}>提取完成，成功查询报关单
      <span style={{fontSize: '14px', color: 'green', fontWeight: 'bold'}}>{myUtil.text.formatNum(ckbgdts, '0,0')}</span>
    </span>
    <span style={{fontSize: '14px', color: '#32363a'}}>条，提取成功报关单
      <span style={{fontSize: '14px', color: 'green', fontWeight: 'bold'}}>{myUtil.text.formatNum(tqCgts, '0,0')}</span>
    </span>
    <span style={{fontSize: '14px', color: '#32363a'}}>条，收汇情况表
      <span style={{fontSize: '14px', color: 'green', fontWeight: 'bold'}}>{myUtil.text.formatNum(shts, '0,0')}</span>
    </span>
    <span style={{fontSize: '14px', color: '#32363a'}}>。
    </span>
    </>
  }

  // 提取收汇
  const handlerTqsh = () => {
    formShtq.validateFields().then((values: any) => {
      const obj = {
        ywKey : 'MDT',
        ssq : values.ssq,
        sbpc: values.sbpc,
      }
      setTqMasker(true);
      ckhwshQkTqsh(obj).then(async (res) => {
        setTqMasker(false);
        const {code, body, desc} = res;
        if (code === '200') {
          refTqshJg?.current?.showModal(body, mainParams);
        } else {
          setTqMasker(false);
          message.error(desc);
        }
      });
    });
  }

  return (
    <>
      <Modal
        title="提取收汇"
        destroyOnHidden={true}
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X1}
        mask={{ closable: false }}
        footer={
          <>
            <Button onClick={() => setModalVisible(false)}>取消</Button>
            <Button onClick={handlerTqsh} type="primary">确定</Button>
          </>
        }
        onCancel={() => setModalVisible(false)}
      >
        <Spin tip="Loading..." spinning={tqMasker} delay={100}>
          <Form
            form={formShtq}
            name="form"
            // labelCol={{ span: 0 }}
            // wrapperCol={{ span: 24 }}
        >
          <Row>
                    <Col span={12}>
                      <Form.Item label='所属期' name="ssq" rules= {[{ required: true, },
                        () => ({
                          validator(_: any, value: any) {
                            if (value === '' || value === undefined) {
                              return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_required' })));// '请输入所属期！'
                            } else if (!value.match(/^[1-9]\d{3}(0[1-9]|1[0-2])$/)) {
                              return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_d_yyyyMM' })));// '请输入正确的年月格式yyyyMM！'
                            }
                            return Promise.resolve();
                          },
                        })
                      ]} >
                        <Input placeholder="申报年月" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <div style={{color: "red"}}>温馨提示：重复提取相同出口报关单号会进行覆盖。</div>
        </Form>
        </Spin>
        <ModalShtqjg onRef={refTqshJg} gb={setModalVisible}/>
      </Modal>
      </>
  );
};

export default ModelShtq;
