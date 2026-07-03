import React, { useState, useRef } from 'react';
import { Button, Form, Space, Input, message, Checkbox, Spin, DatePicker, Row, Col } from 'antd';
import ProCard from '@ant-design/pro-card';
import DDAlert from '@/pages/hts/components/DDAlert';
import { history } from 'umi';
import { checkDlt2, cjrwSdbswj } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';
import { useIntl } from 'umi';
import moment from 'moment';
import TabSfyz from '../../../pzgl/sdppzgl/djdlpz/tab_sfyz';
import FpDDLogin from '@/pages/hts/components/FpDDLogin';


const Xxfpbswj: React.FC<unknown> = ({ }) => {
  const refKprz: any = useRef();
  const refFpRz: any = useRef();

  const [form] = Form.useForm();
  const [masker, setMasker] = useState(false);
  const intl = useIntl();

  // 销项发票板式文件下载
  const downloadSj = async () => {
    await form.validateFields();
    setMasker(true);
    await checkDlt2({ jxbz: 'Y' }).then(async (res: any) => {
      setMasker(false);
      const { code, body, msg } = res;
      if (code == '200') {
        const dl = body?.dlbz == 'Y' ? true : false;
        setMasker(false);
        if (dl) {
          save2();
        } else {
          // 如果未登录，弹出登录
          logon('3');
        }
      } else {
        message.error(msg);
      }
    });
  };

  const save2 = async () => {
    const formValues = await form.validateFields();
    const userInfo = myUtil.sessionStore.getItem('userInfo');
    const fpxzfwlxDm = userInfo?.xtCs?.fpxzfwlxDm;
    const param = {
      xztjlx: 2,
      sjgjsjDm: '020111',
      kprqQ: '',
      kprqZ: '',
      zxkpfwlxDm: fpxzfwlxDm,
      jhpzh: formValues?.jhpzh,
      fplxs: formValues?.fplxs
    };
    if (formValues?.ckrq) {
      param.kprqQ = moment(formValues.ckrq[0]).format('yyyy-MM-DD');
      param.kprqZ = moment(formValues.ckrq[1]).format('yyyy-MM-DD');
    }
    setMasker(true);
    await cjrwSdbswj(param).then(async (response: any) => {
      const { code, msg } = response;
      setMasker(false);
      if (code == '200') {
        DDAlert.open({
          title: intl.formatMessage({ id: 'message_jljghx_sjxz_sjxz_title' }),
          info: intl.formatMessage({ id: 'message_jljghx_sjxz_sjxz_info' }),
          infoType: 'success',
          content: [intl.formatMessage({ id: 'message_jljghx_sjxz_sjxz_content_xzrw' })],
          okText: '转任务管理',
          okCallbackFn: function () {
            history.push('/02/0201');
          },
        });
      } else {
        message.error(msg);
      }
    });
  };

  // 登录 /认证
  // flag 说明：
  // 1：用户直接点登录。
  // 2. 用户点认证,且有登录态，直接打开认证。
  // 3. 用户点认证，但是登录状态为未登录，要先打开登录页面
  const logon = async (flag: any) => {
    // 用户发起登录
    if (flag == '1' || flag == '3' || flag == '5') {
      if (myUtil.fpfw.fpfwlxDm() === '2') {
        refKprz.current!.showModal(flag);
      } else {
        refFpRz.current!.showModal(flag);
      }
      return;
    }
  };

  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <ProCard split="horizontal" className="dd_layout_form_01 dd_hgdzxzjy">
        <ProCard
          style={{
            height: myUtil.heightCalc.getCalc(['header', 'headerTab', 'cardMargin', 'footerBtn']),
            overflowY: 'auto',
          }}
        >
          <div className="groupTit">文件下载</div>
          <Form form={form} >
            <Row justify="center">
              <Col span={8}>
                <Form.Item
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  name="ckrq"
                  label="开票日期"
                  rules={[() => ({
                    validator(_, value) {
                      if (value) {
                        if (value?.length === 2 && myUtil.fpfw.xxjyGzByFwlxDm()) {
                          if (value[0].diff(value[1], 'month') > 2 || value[1].diff(value[0], 'month') > 2) {
                            return Promise.reject(new Error('时间范围不能超过3个月'));
                          }
                          return Promise.resolve();
                        }
                      } else {
                        const jhpzh = form.getFieldValue('jhpzh');
                        if (!jhpzh) {
                          return Promise.reject(new Error('开票日期与发票号码不能同时为空'));
                        }
                        return Promise.resolve();
                      }
                      return Promise.resolve();
                    },
                  }),
                  ]}
                >
                  <DatePicker.RangePicker placeholder={['开票日期起', '开票日期止']} style={{ width: 300 }} />
                </Form.Item>
                <Form.Item
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  name="jhpzh"
                  label="发票号码"
                  rules={[() => ({
                    validator(_, value) {
                      if (!value) {
                        const ckrqs = form.getFieldValue('ckrq');
                        if (!ckrqs) {
                          return Promise.reject(new Error('开票日期与发票号码不能同时为空'));
                        }
                        return Promise.resolve();
                      }
                      return Promise.resolve();
                    },
                  }),
                  ]}
                >
                  <Input placeholder="请输入数电票号码" style={{ width: 300 }} />
                </Form.Item>
                <Form.Item labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }} name="fplxs" initialValue={["ZZSZYFP", "ZZSPTFP"]} label="发票类型"
                  rules={[{ required: true, message: '请选择发票类型' }]}>
                  <Checkbox.Group>
                    <Checkbox key="ZZSZYFP" value="ZZSZYFP">增值税专用发票</Checkbox>
                    <Checkbox key="ZZSPTFP" value="ZZSPTFP">增值税普通发票</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <div
            style={{
              color: 'red',
              display: 'flex',
              justifyContent: 'center',
              marginLeft: -270,
              marginTop: 100,
            }}
          >
            说明：仅支持对数电票进行下载
          </div>
        </ProCard>
        <ProCard className="ddlf01_footer">
          <Space>
            <Button
              type="primary"
              onClick={() => {
                downloadSj();
              }}
            >
              文件下载
            </Button>
          </Space>
        </ProCard>
      </ProCard>
      <TabSfyz onRef={refKprz} getdlFlag={save2} />
      <FpDDLogin onRef={refFpRz} getdlFlag={save2} />

    </Spin>
  );
};

export default Xxfpbswj;
