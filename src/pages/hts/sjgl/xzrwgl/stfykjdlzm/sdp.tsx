import { intl } from '@/components/DDAssist/util';
import React, { useState, useRef, useEffect } from 'react';
import { Button, Form, Space, Input, message, Checkbox, Tooltip, Spin, Select, DatePicker, Row, Col, Radio, } from 'antd';
import ProCard from '@ant-design/pro-card';
import DDAlert from '@/pages/hts/components/DDAlert';
import { history } from 'umi';
import { ycsbsjxz, checkDlt2, zxqjy, cjrwSdbswj } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';
import './style.less';
import moment from 'moment';
import TabSfyz from '../../../pzgl/sdppzgl/djdlpz/tab_sfyz';
import FpDDLogin from '@/pages/hts/components/FpDDLogin';

export type SdpProps = {
  jxpcflag?: any;
};

const Sdp: React.FC<SdpProps> = ({
  jxpcflag
}) => {
  const refKprz: any = useRef();
  const refFpRz: any = useRef();

  const [form] = Form.useForm();
  const [fpForm] = Form.useForm();
  const [ssqForm] = Form.useForm();



  //下载按钮是否显示
  const [masker, setMasker] = useState(false);
  const [param, setParam] = useState({});
  const [tzflag, setTzflag] = useState(false);

  //1：所属期批次下载；2：按开票日期下载；3：按发票号码代码下载
  const [xztjlx, setXztjlx] = useState(2);
  //1：按疑点代码（全部）2：按疑点代码（指定）3：按出口报关单号 4：按出口发票号 5：全部数据
  const [sjfwlx, setSjfwlx] = useState<any>('1');

  // const intl = useIntl();

  useEffect(() => {
    const { query } = history.location;
    const sjfwlx = query?.sjfwlx;
    const sjfwnr = query?.sjfwnr;
    const ssqpc = query?.ssqpc;
    const max = query?.max;
    const min = query?.min;
    if (query && (sjfwlx || sjfwnr || ssqpc)) {
      ssqForm.setFieldsValue({ sjfwlx: sjfwlx });
      ssqForm.setFieldsValue({ sjfwnr: sjfwnr });
      ssqForm.setFieldsValue({ ssqpc: ssqpc });
      setXztjlx(1);
      setSjfwlx(sjfwlx);
      setTzflag(true);
    } else if(query && (max || min )){
      setXztjlx(2);
      fpForm.setFieldsValue({e1:2,ckrq:[moment().subtract(3, 'months').add(1, 'day'), moment()]});
      const val: any = getCxtj();
      if (val?.fplxs) {
        fpForm.setFieldsValue({fplxs:val?.fplxs});
      } else {
        fpForm.setFieldsValue({fplxs:['ZZSZYFP']});
      }
    } else {
      ssqForm.setFieldsValue({ sjfwlx: '', ssqpc: '', sjfwnr: '' });
      ssqForm.setFieldsValue({ sjfwlx: sjfwlx });
      fpForm.setFieldsValue({ jhpzh: '', xhfnsrsbh: '' });
      setXztjlx(2);
      fpForm.setFieldsValue({e1:2,ckrq:[moment().subtract(3, 'months').add(1, 'day'), moment()]});
      const val: any = getCxtj();
      if (val?.fplxs) {
        fpForm.setFieldsValue({fplxs:val?.fplxs});
      } else {
        fpForm.setFieldsValue({fplxs:['ZZSZYFP']});
      }
    }
  }, []);

  useEffect(() => {}, [param]);

  const getCxtj = () => {
    const sbqyuuid = myUtil.sessionStore.getItem('userInfo')?.qxQys[0].sbqyuuid;
    const yhuuid1 = myUtil.sessionStore.getItem('userInfo')?.qxyh?.yhuuid1;
    const cxtjKey = yhuuid1 + sbqyuuid + 'jxfpsdpbswjfplx';
    const values: any = myUtil.localStore.getItem(cxtjKey) || {};
    return values;
  }

  const fplxOnChange = (values : any) => {
    const sbqyuuid = myUtil.sessionStore.getItem('userInfo')?.qxQys[0].sbqyuuid;
    const yhuuid1 = myUtil.sessionStore.getItem('userInfo')?.qxyh?.yhuuid1;
    const cxtjKey = yhuuid1 + sbqyuuid + 'jxfpsdpbswjfplx';
    myUtil.localStore.setItem(cxtjKey, {fplxs:values});
  }

  // 单证下载
  const downloadSj = async () => {
    const checkForm = xztjlx === 1 ? ssqForm : fpForm;
    await checkForm.validateFields();
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
    const fpformValues = await fpForm.validateFields();
    const ssqFormValues = await ssqForm.validateFields();

    const param = {
      xztjlx: xztjlx,
      sjgjsjDm: '020011',
      ywKey: '',
      sjfwlx: '',
      ssq: '',
      sbpc: '',
      sjfwnr: '',
      kprqQ: '',
      kprqZ: '',
      jhpzh: '',
      xhfnsrsbh: '',
      fplxs: ['ZZSZYFP']
    };
    if (xztjlx == 1) {
      //1：所属期批次下载；
      param.ywKey = 'MTS';
      param.sjfwlx = sjfwlx;
      if (ssqFormValues?.ssqpc?.length == 9) {
        ssqFormValues?.ssqpc.substring(6);
        param.ssq = ssqFormValues?.ssqpc.substring(0, 6);
        param.sbpc = ssqFormValues?.ssqpc.substring(6);
      } else {
        param.ssq = ssqFormValues?.ssqpc;
      }
      if (ssqFormValues.sjfwlx == '2' || ssqFormValues.sjfwlx == '3' || ssqFormValues.sjfwlx == '4') {
        param.sjfwnr = ssqFormValues?.sjfwnr;
      }
    } else if (xztjlx == 2) {
      if (fpformValues?.ckrq) {
        param.kprqQ = moment(fpformValues.ckrq[0]).format('yyyy-MM-DD');
        param.kprqZ = moment(fpformValues.ckrq[1]).format('yyyy-MM-DD');
      }
      if (fpformValues?.jhpzh) {
        param.jhpzh = fpformValues?.jhpzh;
      }
      if (fpformValues?.xhfnsrsbh) {
        param.xhfnsrsbh = fpformValues?.xhfnsrsbh;
      }
      if (jxpcflag) {
        param.fplxs = fpformValues?.fplxs;
      }
    }
    setMasker(true);
    await cjrwSdbswj(param).then(async (response: any) => {
      const { desc, code, msg, body } = response;
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

  const handleChange = (param: any) => {
    setSjfwlx(param);
  };
  const changeXztjlx = (param: any) => {
    const value = param?.target?.value;
    form.resetFields();
    fpForm.resetFields();
    ssqForm.resetFields();
    setXztjlx(value);
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
              <Form.Item name="e1">
                <Radio.Group defaultValue={xztjlx} onChange={changeXztjlx} disabled={tzflag}>
                  <Space direction="vertical">
                    <Radio value={2} >按发票下载
                      <Row style={{ height: 10}}></Row>
                      <Form form={fpForm}>
                        <Form.Item
                          labelCol={{ span: 6 }}
                          wrapperCol={{ span: 18 }}
                          name="ckrq"
                          label="开票日期"
                          rules={
                            xztjlx == 2 ? [
                              () => ({
                                validator(_, value) {
                                  if (value) {
                                    if (value?.length === 2 && myUtil.fpfw.xxjyGzByFwlxDm() && history?.location?.pathname =='/02/0202/020203') {
                                      const diffMonths = value[1].diff(value[0], 'months', true);
                                      if (Math.abs(diffMonths) > 3) {
                                        return Promise.reject(new Error('时间范围不能超过3个月'));
                                      }
                                      return Promise.resolve();
                                    }
                                  } else {
                                    const jhpzh = fpForm.getFieldValue('jhpzh');
                                    if (!jhpzh) {
                                      return Promise.reject(new Error('开票日期与发票号码不能同时为空'));
                                    }
                                    return Promise.resolve();
                                  }
                                  return Promise.resolve();
                                },
                              }),
                            ]
                          : []
                          }
                        >
                          <DatePicker.RangePicker placeholder={['开票日期起', '开票日期止']} style={{ width: 300 }} disabled={!tzflag && xztjlx == 2 ? false : true}/>
                        </Form.Item>
                        <Form.Item
                          labelCol={{ span: 6 }}
                          wrapperCol={{ span: 18 }}
                          name="jhpzh"
                          label="发票号码"
                          rules={
                            xztjlx == 2
                            ? [
                                () => ({
                                  validator(_, value) {
                                    if (!value) {
                                      const ckrqs = fpForm.getFieldValue('ckrq');
                                      if(!ckrqs){
                                        return Promise.reject(new Error('开票日期与发票号码不能同时为空'));
                                      }
                                      return Promise.resolve();
                                    }
                                    return Promise.resolve();
                                  },
                                }),
                              ]
                            : []
                          }
                        >
                          <Input placeholder="请输入数电票号码" style={{ width: 300 }} disabled={!tzflag && xztjlx == 2 ? false : true} />
                        </Form.Item>
                        <Form.Item
                          labelCol={{ span: 6 }}
                          wrapperCol={{ span: 18 }}
                          name="xhfnsrsbh"
                          label="供应商税号"
                        >
                          <Input placeholder="请输入供应商税号" style={{ width: 300 }} disabled={!tzflag && xztjlx == 2 ? false : true} />
                        </Form.Item>
                        {jxpcflag?
                          <Form.Item labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }} name="fplxs"  label="发票类型"
                            rules={
                            xztjlx == 2 ? [{ required: true, message: '请选择发票类型' }] : []
                            }>
                            <Checkbox.Group onChange={fplxOnChange} >
                              <Checkbox key="ZZSZYFP" value="ZZSZYFP">增值税专用发票</Checkbox>
                              <Checkbox key="ZZSPTFP" value="ZZSPTFP">增值税普通发票</Checkbox>
                            </Checkbox.Group>
                          </Form.Item>:<></>
                        }
                    </Form>
                  </Radio>
                  <Radio value={1}>按所属期批次下载
                    <Row style={{ height: 10}}></Row>
                    <Form form={ssqForm}>
                      <Form.Item
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        name="ssqpc"
                        label="所属期批次"
                        rules={
                          xztjlx == 1
                          ? [
                              () => ({
                                validator(_, value) {
                                  if (value) {
                                    const temp1 = !value.match(/^[1-9]\d{3}(0[1-9]|1[0-2])$/); // YYYYMM
                                    const temp2 = !value.match(/^[1-9]\d{3}(0[1-9]|1[0-2])\d{3}$/); // YYYYMM001
                                    if (value.length != 9 && value.length != 6) {
                                      return Promise.reject(
                                        new Error('请输入正确的所属期批次格式'),
                                      );
                                    } else {
                                      if (temp2 && temp1) {
                                        return Promise.reject(
                                          new Error('请输入正确的所属期批次格式'),
                                        );
                                      } else {
                                        return Promise.resolve();
                                      }
                                    }
                                  } else {
                                    return Promise.reject(new Error('请输入所属期批次'));
                                  }
                                },
                              }),
                            ]
                          : []
                        }
                      >
                        <Input placeholder="请输入6位所属期/9位所属期批次"  disabled={ !tzflag && xztjlx == 1 ? false : true}/>
                      </Form.Item>
                      <Space wrap>
                        <Form.Item name="sjfwlx" wrapperCol={{ span: 6 }} initialValue={'1'}>
                          <Select
                            defaultValue={'1'}
                            disabled={!tzflag && xztjlx == 1 ? false : true}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onChange={handleChange}
                            style={{ width: 168 }}
                            options={[
                              { value: '1', label: '按疑点代码（全部）' },
                              { value: '2', label: '按疑点代码（指定）' },
                              { value: '3', label: '按出口报关单号' },
                              { value: '4', label: '按出口发票号' },
                            ]}
                          />
                        </Form.Item>
                        <Form.Item
                          name="sjfwnr"
                          wrapperCol={{ span: 18 }}
                          rules={
                            sjfwlx == '4' || sjfwlx == '2' || sjfwlx == '3'
                              ? [
                                  { required: true, message: '请按选择输入对应内容！' },
                                  { type: 'string', max: 900, message: '最大长度不能超过900位' },
                                ]
                              : []
                          }
                        >
                          <Input
                            style={{ width: 218 }}
                            disabled={
                              (xztjlx == 1 && (sjfwlx == '2' || sjfwlx == '3' || sjfwlx == '4')) && !tzflag
                                ? false
                                : true
                            }
                          />
                        </Form.Item>
                      </Space>
                    </Form>
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

export default Sdp;
