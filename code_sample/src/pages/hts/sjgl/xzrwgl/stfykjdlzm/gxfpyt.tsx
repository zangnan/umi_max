import React, { useState, useRef, useEffect } from 'react';
import {Button, Form, Space, Input, message, Spin, DatePicker, Row, Radio, Checkbox} from 'antd';
import ProCard from '@ant-design/pro-card';
import DDAlert from '@/components/DDAlert';
import { history } from 'umi';
import { checkDlt2,  cjrwFpztgx } from '@/services/hts/api';
import myUtil from '@/pages/common/myUtil';
import './style.less';
import { useIntl } from 'umi';
import moment from 'moment';
import TabSfyz from '../../../pzgl/sdppzgl/djdlpz/tab_sfyz';
import FpDDLogin from '@/components/FpDDLogin';


export type ActionType = {
  reload: (resetPageIndex?: boolean) => void;
};

const Gxfpyt: React.FC<unknown> = () => {
  const refKprz: any = useRef();
  const refFpRz: any = useRef();
  const [form] = Form.useForm();

  //下载按钮是否显示
  const [masker, setMasker] = useState(false);
  const [param, setParam] = useState({});
  const [xztjlx, setXztjlx] = useState(1);
  const [rzxzBz, setRzxzBz] = useState(true);

  const intl = useIntl();

  useEffect(() => {
    setXztjlx(1);
    setRzxzBz(true);
    form.setFieldsValue({rzxfzzszyfpbz: 'N'});
  }, []);

  useEffect(() => {}, [param]);

  // 单证下载
  const downloadSj = async () => {
    await form.validateFields();
    //增值税发票下载，并且是调用江苏接口.
    setMasker(true);
    await checkDlt2({ jxbz: 'Y' }).then(async (res: any) => {
      setMasker(false);
      const { code, body, msg } = res;
      if (code == '200') {
        const dl = body?.dlbz == 'Y' ? true : false;
        if (dl) {
          // 如果已登录，
          param.jxbz = 'Y';
          setParam(param);
          setMasker(false);
          save2();
        } else {
          param.jxbz = 'Y';
          setParam(param);
          // 如果未登录，弹出登录
          logon('3');
          setMasker(false);
        }
      } else {
        message.error(msg);
      }
    });
  };

  const save2 = async () => {
    const formValues = await form.validateFields();
    const param = {
      xztjlx: xztjlx,
      sjgjsjDm: '020003',
      kprqQ: '',
      kprqZ: '',
      rzxfzzszyfpbz: '',
      jhpzh: '',
    };
    if (xztjlx == 1) {
      param.kprqQ = moment(formValues.kprq[0]).format('yyyy-MM-DD');
      param.kprqZ = moment(formValues.kprq[1]).format('yyyy-MM-DD');
      param.rzxfzzszyfpbz = formValues.rzxfzzszyfpbz
    } else {
      param.jhpzh = formValues?.jhpzh;
    }
    setMasker(true);
    await cjrwFpztgx(param).then(async (response: any) => {
      const { code, msg} = response;
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


  const changeXztjlx = (param: any) => {
    const value = param?.target?.value;
    form.resetFields();
    setXztjlx(value);
  };

  const handlerRzBz = (e : any) => {
    setRzxzBz(e.target.checked);
    form.setFieldsValue({rzxfzzszyfpbz: e.target.checked? 'N': ''});
  }

  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <ProCard split="horizontal" className="dd_layout_form_01 dd_hgdzxzjy">
        <ProCard
          style={{
            height: myUtil.heightCalc.getCalc(['header', 'headerTab', 'cardMargin', 'footerBtn']),
            overflowY: 'auto',
          }}
        >
          <div className="groupTit">更新用途</div>
          <Form form={form}  initialValues={{kprq:[moment().subtract(3, 'months').add(1, 'day'), moment()]}}>
              <Row justify="center">
              <Form.Item name="e1">
              <Radio.Group defaultValue={xztjlx} onChange={changeXztjlx}>
                <Space direction="vertical">
                  <Radio value={1}>
                    <Form.Item
                      name="kprq"
                      label="按开票日期更新"
                      rules={
                        xztjlx == 1
                          ? [
                              () => ({
                                validator(_, value) {
                                  if (value) {
                                    if ( value.length === 2 ) {
                                      const diffMonths = value[1].diff(value[0], 'months', true);
                                      if (Math.abs(diffMonths) > 3) {
                                        return Promise.reject(new Error('时间范围不能超过3个月'));
                                      }
                                      return Promise.resolve();
                                    }
                                  } else {
                                    return Promise.reject(new Error('请输入开票日期'));
                                  }
                                  return Promise.resolve();
                                },
                              }),
                            ]
                          : []
                      }
                    >
                      <DatePicker.RangePicker
                        placeholder={['开票日期起', '开票日期止']}
                        style={{ width: 300 }}
                        disabled={xztjlx == 1 ? false : true}
                      />
                    </Form.Item>
                    <Form.Item name="rzxfzzszyfpbz" label={null} >
                        <Checkbox checked={rzxzBz} disabled={xztjlx=== 1? false: true}  value="N" onChange={handlerRzBz} >仅未认证</Checkbox>
                    </Form.Item>
                  </Radio>
                  <Radio value={2}>
                    <Form.Item
                      name="jhpzh"
                      label="按发票号码更新"
                      rules={
                        xztjlx == 2
                          ? [
                              () => ({
                                validator(_, value) {
                                  if (value) {
                                    return Promise.resolve();
                                  } else {
                                    return Promise.reject(new Error('请输入发票代码+号码代码'));
                                  }
                                },
                              }),
                            ]
                          : []
                      }
                    >
                      <Input
                        placeholder="请输入发票代码+号码代码"
                        style={{ width: 300 }}
                        disabled={xztjlx == 2 ? false : true}
                      />
                    </Form.Item>
                  </Radio>
                </Space>
              </Radio.Group>
              </Form.Item>
            </Row>
          </Form>
          <div
            style={{
              color: 'red',
              display: 'flex',
              justifyContent: 'center',
              marginLeft: -168,
              marginTop: 100,
            }}
          >
            说明：仅支持对增值税专用发票进行用途更新
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
              更新用途
            </Button>
          </Space>
        </ProCard>
      </ProCard>
      <TabSfyz onRef={refKprz} getdlFlag={save2} />
      <FpDDLogin onRef={refFpRz} getdlFlag={save2} />
    </Spin>
  );
};

export default Gxfpyt;
