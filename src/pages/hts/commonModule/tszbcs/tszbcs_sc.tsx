/**
 * 按报关单生成明细：外贸、生产、证明开具
 */
import React, { useImperativeHandle, useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Spin, InputNumber, Space, Radio, message, Select, Checkbox } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import myUtil from '@/components/DDAssist/util';

import businessValidator from '@/pages/hts/common/field/businessValidator';
import '@/pages/hts/commonModule/style.less';
import { hqSsSsq, hqSsPc, tszbqd, tszbqdMdt, tszbcsMdt, mdtTszbcsHqTszbyz } from '@/pages/hts/services/htsApi';
import baseValidator from '@/components/DDAssist/field/baseValidator';
import DDAlert from '@/pages/hts/components/DDAlert';
import Func from "@/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB/f";

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
  const [uuids, setUuids] = useState<any>();

  // 统一组件宽度
  const componentWidth = 160;

  // 页面初始化时调用接口获取退税指标相关值
  useEffect(() => {
    if (modalVisible && ssqList.length > 0) {
      fetchInitialTszbValues();
    }
  }, [modalVisible, ssqList]);

  // 调用接口获取初始化的退税指标相关值
  const fetchInitialTszbValues = async () => {
    try {
      setMasker(true);
      // 使用当前选中的测算所属期作为参数，默认取第一个
      const currentSsq = form.getFieldValue('csssq') || ssqList[0]?.ssq;
      const response = await mdtTszbcsHqTszbyz({ ssq: currentSsq });

      setMasker(false);
      // 接口成功时处理：将字段名调整为ytse1、mdse（对应退税额阈值、免抵额阈值）
      if (response.code === '200') {
        const { ytse1, mdse, mdtsehj } = response.body;
        form.setFieldsValue({
          ytse1: myUtil.text.formatNum(Number(ytse1), '0,0.00'), // 退税额阈值 -> ytse1
          mdse: myUtil.text.formatNum(Number(mdse), '0,0.00'),   // 免抵额阈值 -> mdse
          mdtsehj: myUtil.text.formatNum(Number(mdtsehj), '0,0.00'), // 免抵退税额合计保持不变
          bgdcsbz: ["Y"], // 默认勾选“整张关单不拆分”
        });
      } else {
        message.error(response.msg || '获取退税指标相关值失败');
      }
    } catch (error) {
      setMasker(false);
      message.error('调用接口失败');
    }
  };

  // 开启弹窗
  const showModal = (param: any) => {
    setParam(param);
    setMasker(true);
    hqSsSsq({ "ywKey": "MDT" }).then((response: any) => {
      setMasker(false);
      const { code, msg, body } = response;
      if (code == '200' && body.length > 0) {
        setSsqList(body);
        setModalVisible(true);
        // 初始化表单时使用新字段名ytse1、mdse
        form.setFieldsValue({ cssx: '01', csssq: body[0].ssq, bgdcsbz: ["Y"] });
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

  // 测算逻辑：调整参数为ytse1、mdse传递给后端
  const cs = async () => {
    const p = await form.validateFields();
    // 去除千分位分隔符并转为数字，字段名对应调整
    p.ytse1 = Number(p.ytse1.replaceAll(',', '')); // 退税额阈值参数
    p.mdse = Number(p.mdse.replaceAll(',', ''));   // 免抵额阈值参数
    p.mdtsehj = Number(p.mdtsehj.replaceAll(',', '')); // 免抵退税额合计保持不变
    setMasker(true);
    // 调用后端接口时，参数已自动包含ytse1、mdse（原tszbyz、mdeByz）
    tszbcsMdt(p).then((response2: any) => {
      if (response2.code == '200') {
        setMasker(false);
        setFlag(false);
        setName('重新测算');
        setCsssq(response2?.body?.csssq);
        form2.setFieldsValue(response2.body);
        setUuids(response2?.body?.uuids);
      } else {
        message.error(response2.msg);
        setMasker(false);
      }
    });
  }

  const save = async () => {
    const p = await form2.validateFields();
    DDAlert.open({
      title: '系统提示',
      info: '注意：相同关联号对应的出口明细和进货明细将会一并修改！',
      infoType: 'question',
      modalType: 'confirm',
      okCallbackFn: function () {
        DDAlert.close();
        tszbqdMdt({ ssq: p.ssq, csssq: csssq, uuids: uuids }).then((response2: any) => {
          if (response2.code == '200') {
            message.success('数据调整成功！');
            param?.refUnit?.current!.reload2();
            close();
          } else {
            message.error(response2.msg);
          }
        });
      },
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
    setUuids('');
  }

  // 输入框失焦处理：适配新字段名
  const onblur = (fieldName: string) => (param: any) => {
    const b1 = param?.target?.value?.replaceAll(',', '');
    var patt = /^\d+(\.\d+)?$/;
    if (Number(b1) >= 999999999999.99 || Number(b1) < 0) {
      form.setFieldsValue({ [fieldName]: '' });
      return;
    }
    if (b1 && patt.exec(b1)) {
      const v = myUtil.text.formatNum(Number(b1), '0,0.00');
      form.setFieldsValue({ [fieldName]: v });
    } else {
      form.setFieldsValue({ [fieldName]: '' });
    }

    if (fieldName == 'ytse1' || fieldName == 'mdse') {
      const newValue = Number(form.getFieldsValue().ytse1?.replaceAll(',', '')) + Number(form.getFieldsValue().mdse?.replaceAll(',', ''));
      form.setFieldsValue({ 'mdtsehj': myUtil.text.formatNum(newValue, '0,0.00') });
    }
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
        <>根据退税指标指定所属期下的数据进行额度测算，计算出满足额度的最大可免抵退税额，超出额度外的数据可调整下次申报。
          <br />
          <span style={{ color: 'red' }}>温馨提示：为确保数据准确性，请先获取依职权反馈。</span>
        </>
        <Form form={form} >
          <div style={{ backgroundColor: '#f1f4f7', margin: '0 0 20px 0', padding: '0 10px', lineHeight: "32px" }}>1、测算依据</div>
          <Space direction="vertical">
            <Space>
              {/* 退税额阈值：字段名从tszbyz改为ytse1 */}
              <Form.Item label='退税额阈值（元）&emsp;&emsp;' rules={[{ required: true, message: '该项为必录' }, () => ({
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
              })]} name='ytse1' >
                <Input
                  onBlur={onblur('ytse1')}
                  placeholder="退税额阈值（元）"
                  style={{ width: componentWidth }}
                />
              </Form.Item>
              {/* 免抵额阈值：字段名从mdeByz改为mdse */}
              <Form.Item label='免抵额阈值（元）' rules={[{ required: true, message: '该项为必录' }, () => ({
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
              })]} name='mdse' >
                <Input
                  onBlur={onblur('mdse')}
                  placeholder="免抵额阈值（元）"
                  style={{ width: componentWidth }}
                />
              </Form.Item>
            </Space>
            <Space>
              {/* 免抵退税额合计保持不变 */}
              <Form.Item label='免抵退税额合计（元）' rules={[{ required: true, message: '该项为必录' }, () => ({
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
              })]} name='mdtsehj' >
                <Input disabled
                       onBlur={onblur('mdtsehj')}
                       placeholder="免抵退税额合计（元）"
                       style={{ width: componentWidth }}
                />
              </Form.Item>
              <Form.Item label='测算所属期&emsp;&emsp;&emsp;' name='csssq' rules={[{ required: true, message: '该项为必录' }]}>
                <Select
                  style={{ width: componentWidth }}
                  options={ssqList.map((province: any) => ({ label: province.ssq, value: province.ssq }))}
                />
              </Form.Item>
            </Space>
            <Form.Item label='测算顺序' name='cssx' >
              <Radio.Group>
                <Radio value='01'>按出口日期升序</Radio>
                <Radio value='02'>按申报序号升序</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name='bgdcsbz' style={{margin: '0 0 0 69px'}}>
              <Checkbox.Group>
                <Checkbox value={"Y"}>整张关单不拆分</Checkbox>
              </Checkbox.Group>
            </Form.Item>
          </Space>
          <div style={{ backgroundColor: '#f1f4f7', margin: '0 0 20px 0', padding: '0 10px', lineHeight: "32px" }}>2、测算结果</div>
        </Form>
        <Form form={form2}>
          <Space>
            <Form.Item colon={false} label='&emsp;&emsp;&emsp;&emsp;&emsp; 结转免抵退税额：（元）' name='jzMdtse'>
              <Input
                disabled
                placeholder="结转免抵退税额（元）"
                style={{ width: componentWidth }}
              />
            </Form.Item>
            <Form.Item colon={false} label='应调免抵退税额：（元）' name='ytMdtse'>
              <Input
                disabled
                placeholder="应调免抵退税额（元）"
                style={{ width: componentWidth }}
              />
            </Form.Item>
          </Space>
          <Space>
            <div style={{ marginBottom: 25 }}>&emsp;&emsp;本期参与测算：</div>
            <Form.Item colon={false} label='报关单（条）' name='bqcycsTs'>
              <Input
                disabled
                placeholder="报关单（条）"
                style={{ width: componentWidth }}
              />
            </Form.Item>
            <Form.Item colon={false} label='&emsp;&emsp;免抵退税额：（元）' name='bqcycsKtse'>
              <Input
                disabled
                placeholder="免抵退税额（元）"
                style={{ width: componentWidth }}
              />
            </Form.Item>
          </Space>
          <Space>
            <div style={{ marginBottom: 25 }}>计划本次参与申报：</div>
            <Form.Item colon={false} label='报关单（条）' name="jhcssbTs">
              <Input
                disabled
                placeholder="报关单（条）"
                style={{ width: componentWidth }}
              />
            </Form.Item>
            <Form.Item colon={false} label='&emsp;&emsp;免抵退税额：（元）' name="jhcssbKtse">
              <Input
                placeholder="免抵退税额（元）"
                disabled
                style={{ width: componentWidth }}
              />
            </Form.Item>
          </Space>
          <div style={{ backgroundColor: '#f1f4f7', margin: '0 0 20px 0', padding: '0 10px', lineHeight: "32px" }}>3、 结转所属期</div>
          <Space>
            <Form.Item label='所属期' name="ssq" rules={[{ required: true, message: '' }, businessValidator.ssq()]} >
              <Input
                disabled={flag}
                placeholder="所属期"
                style={{ width: componentWidth }}
              />
            </Form.Item>
          </Space>
        </Form>
      </Spin>
    </Modal>
  );
}

export default Scmx;
