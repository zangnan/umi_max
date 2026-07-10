import React, { useImperativeHandle, useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Spin, Space, Radio, message, Select, InputNumber, Checkbox } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import myUtil from '@/components/DDAssist/util';
import businessValidator from '@/pages/hts/common/field/businessValidator';
import '@/pages/hts/commonModule/style.less';
import { hqSsSsq, hqSsPc, tszbqd, tszbcs, mtsTszbcsHqTszbyz } from '@/pages/hts/services/htsApi';
import baseValidator from '@/components/DDAssist/field/baseValidator';

export interface DDTsort {
  onRef?: any;
  visible?: any;
}

const Scmx: React.FC<DDTsort> = ({ onRef, visible = false }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [masker, setMasker] = useState(false);
  const [ssqList, setSsqList] = useState([]);
  const [sbpcList, setSbpcList] = useState([]);
  const [glhs, setGlhs] = useState([]);
  const [flag, setFlag] = useState(true);
  const [name, setName] = useState('开始测算');
  const [param, setParam] = useState<any>();
  const [csssq, setCsssq] = useState<any>();
  const [cssbpc, setCssbpc] = useState<any>();
  const [initialTszbyz, setInitialTszbyz] = useState<string>(''); // 存储初始化的退税指标阈值

  // 页面初始化时调用接口获取退税指标阈值
  useEffect(() => {
    if (modalVisible) {
      fetchInitialTszbyz();
    }
  }, [modalVisible]);

  // 调用接口获取初始化的退税指标阈值
  const fetchInitialTszbyz = async () => {
    try {
      setMasker(true);
      const response = await mtsTszbcsHqTszbyz({ ssq: csssq || (ssqList[0]?.ssq || '') });
      setMasker(false);
      if (response.code === '200') {
        const formattedValue = myUtil.text.formatNum(Number(response.body), '0,0.00');
        setInitialTszbyz(formattedValue);
        form.setFieldsValue({
          tszbyz: formattedValue,
          bgdcsbz: ["Y"] // 初始化时设置“整张关单拆分测算”为勾选
        });
      } else {
        message.error(response.msg || '获取退税指标阈值失败');
      }
    } catch (error) {
      setMasker(false);
      message.error('调用接口失败');
    }
  };

  // 开启
  const showModal = (param: any) => {
    setParam(param);
    setMasker(true);
    hqSsSsq({ "ywKey": "MTS" }).then((response: any) => {
      setMasker(false);
      const { code, msg, body } = response;
      if (code == '200' && body.length > 0) {
        setSsqList(body);
        setModalVisible(true);
        setMasker(true);
        hqSsPc({ "ssq": body[0].ssq }).then((response2: any) => {
          setMasker(false);
          setSbpcList(response2.body);
          form.setFieldsValue({
            cssx: '01',
            csssq: body[0].ssq,
            cssbpc: response2.body[0].sbpc,
            bgdcsbz: ["Y"] // 开启弹窗时也设置默认勾选
          });
          setCsssq(body[0].ssq); // 保存测算申报年月，用于后续接口调用
        });
      } else if (body.length == 0) {
        message.error('无需要操作的数据！');
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

  const cs = async () => {
    const p = await form.validateFields();
    p.tszbyz = Number(p.tszbyz.replaceAll(',', ''));
    setMasker(true);
    tszbcs(p).then((response2: any) => {
      if (response2.code == '200') {
        setGlhs(response2?.body?.glhs);
        setFlag(false);
        setName('重新测算');
        setCsssq(response2?.body?.csssq);
        setCssbpc(response2?.body?.cssbpc)
        form2.setFieldsValue(response2.body);
      } else {
        message.error(response2.msg);
      }
      setMasker(false);
    });
  }

  const save = async () => {
    const p = await form2.validateFields();
    tszbqd({ ssq: p.ssq, sbpc: p.sbpc, glhs: glhs, csssq: csssq, cssbpc: cssbpc, bgdcsbz: p.bgdcsbz }).then((response2: any) => {
      if (response2.code == '200') {
        message.success('数据调整成功！');
        param?.refUnit?.current!.reload();
        close();
      } else {
        message.error(response2.msg);
      }
    });
  }

  const close = () => {
    form.resetFields();
    form2.resetFields();
    setSsqList([]);
    setSbpcList([]);
    setGlhs([]);
    setFlag(true);
    setName('开始测算');
    setModalVisible(false);
    setCsssq('');
    setCssbpc('');
    setInitialTszbyz('');
  }

  const onblur2 = (param: any) => {
    const b1 = param?.target?.value?.replaceAll(',', '');
    var patt = /^\d+(\.\d+)?$/;
    if (Number(b1) >= 999999999999.99 || Number(b1) < 0) {
      form.setFieldsValue({ tszbyz: '' });
      return;
    }
    if (b1 && patt.exec(b1)) {
      const v = myUtil.text.formatNum(Number(b1), '0,0.00');
      form.setFieldsValue({ tszbyz: v });
    } else {
      form.setFieldsValue({ tszbyz: '' });
    }
  }

  const onchange = (param: any) => {
    setMasker(true);
    hqSsPc({ "ssq": param }).then((response2: any) => {
      setMasker(false);
      setSbpcList(response2.body);
      form.setFieldsValue({ cssbpc: response2.body[0].sbpc });
    });
  }

  return (
    <Modal
      title='退税指标测算'
      destroyOnHidden={true}
      open={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X3}
      wrapClassName='standard-modal-1'
      footer={<>
        {flag ? <></> : <Button onClick={save}>确定</Button>}
        <Button onClick={cs} type="primary">{name}</Button>
      </>}
      onCancel={() => close()}
      className={`${masker ? 'dd_modal_show_masker' : ''}`}
      mask={{ closable: false }}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <>根据退税指标指定申报年月批次下的数据进行额度测算，计算出满足额度的最大可退税额，超出额度外的数据可调整下次申报。</>
        <Form form={form}>
          <div style={{ backgroundColor: '#f1f4f7', margin: '0 0 20px 0', padding: '0 10px', lineHeight: "32px" }}>1、测算依据</div>
          <Space>
            <Form.Item label='退税指标阈值（元）' rules={[{ required: true, message: '该项为必录' },
              () => ({
                validator(_, value) {
                  if (value) {
                    if (myUtil.text.getNumVal(value) > 999999999999.99) {
                      return Promise.reject(new Error('最大数值不能超过999999999999.99!'));
                    }
                    if (myUtil.text.getNumVal(value) < 0) {
                      return Promise.reject(new Error('最小数值不能小于0!'));
                    }
                  }
                  return Promise.resolve();
                },
              })
            ]} name='tszbyz'>
              <Input placeholder="退税指标阈值（元）" onBlur={onblur2} />
            </Form.Item>
            <Form.Item label='测算申报年月' name='csssq' rules={[{ required: true, message: '该项为必录' }]}>
              <Select
                style={{ width: 120 }}
                onChange={onchange}
                options={ssqList.map((province: any) => ({ label: province.ssq, value: province.ssq }))}
              />
            </Form.Item>
            <Form.Item label='测算批次' name='cssbpc' rules={[{ required: true, message: '该项为必录' }]}>
              <Select
                style={{ width: 120 }}
                options={sbpcList.map((province: any) => ({ label: province.sbpc, value: province.sbpc }))}
              />
            </Form.Item>
          </Space>
          <Form.Item label='测算顺序' name='cssx'>
            <Radio.Group>
              <Radio value='01'>按出口日期升序</Radio>
              <Radio value='02'>按关联号升序</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name='bgdcsbz' style={{margin: '0 0 0 69px'}}>
            <Checkbox.Group>
              <Checkbox value={"Y"}>整张关单不拆分</Checkbox>
            </Checkbox.Group>
          </Form.Item>
          <div style={{ backgroundColor: '#f1f4f7', margin: '0 0 20px 0', padding: '0 10px', lineHeight: "32px" }}>2、测算结果</div>
        </Form>
        <Form form={form2}>
          <Space>
            <div style={{ marginBottom: 25 }}>&emsp;&emsp;本期参与测算：</div>
            <Form.Item colon={false} label='报关单（条）' name='bqcycsTs'>
              <Input disabled placeholder="报关单（条）" />
            </Form.Item>
            <Form.Item colon={false} label='可退税额（元）' name='bqcycsKtse'>
              <Input disabled placeholder="可退税额（元）" />
            </Form.Item>
          </Space>
          <Space>
            <div style={{ marginBottom: 25 }}>计划本次参与申报：</div>
            <Form.Item colon={false} label='报关单（条）' name="jhcssbTs">
              <Input disabled placeholder="报关单（条）" />
            </Form.Item>
            <Form.Item colon={false} label='可退税额（元）' name="jhcssbKtse">
              <Input disabled placeholder="可退税额（元）" />
            </Form.Item>
          </Space>
          <Form.Item label='  临界值关联号' name="ljzglh">
            <Input disabled style={{ width: 316 }} placeholder="临界值关联号" />
          </Form.Item>
          <div style={{ backgroundColor: '#f1f4f7', margin: '0 0 20px 0', padding: '0 10px', lineHeight: "32px" }}>3、 结转申报年月批次</div>
          <Space>
            <Form.Item label='申报年月' name="ssq" rules={[{ required: true, message: '' }, businessValidator.ssq(),]} >
              <Input disabled={flag} placeholder="申报年月" />
            </Form.Item>
            <Form.Item label='申报批次' name="sbpc" rules={[{ required: true, message: '' }, businessValidator.sbpc(form2)]} >
              <Input disabled={flag} placeholder="申报批次" />
            </Form.Item>
          </Space>
        </Form>
      </Spin>
    </Modal>
  );
}

export default Scmx;
