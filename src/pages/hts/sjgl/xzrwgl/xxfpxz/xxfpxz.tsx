import React, { useState, useRef } from 'react';
import { Button, Form, Space, message, Checkbox, Spin, DatePicker, Row, Col } from 'antd';
import ProCard from '@ant-design/pro-card';
import DDAlert from '@/pages/hts/components/DDAlert';
import { history } from 'umi';
import { checkDlt2, cjrw } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';
import { useIntl } from 'umi';
import moment from 'moment';
import TabSfyz from '../../../pzgl/sdppzgl/djdlpz/tab_sfyz';
import FpDDLogin from '@/pages/hts/components/FpDDLogin';

const Xxfpxz: React.FC<unknown> = () => {
  const refKprz: any = useRef();
  const refFpRz: any = useRef();
  const [form] = Form.useForm();
  const [masker, setMasker] = useState(false);
  const intl = useIntl();

  /**
   * 销项发票数据下载
   */
  const downloadXxfp = async () => {
    const formValues = await form.validateFields();
    //增值税发票下载，并且是调用江苏接口.
    setMasker(true);
    await checkDlt2({ jxbz: "Y" }).then(async (res: any) => {
      setMasker(false);
      const { code, body, msg } = res;
      if (code == '200') {
        const dl = body?.dlbz == 'Y' ? true : false;
        if (dl) {
          save2();
        } else {
          logon('3');
        }
      } else {
        message.error(msg);
      }
    });
  }

  /**
   * 获取下载参数
   * @param formValues form表单参数
   * @returns 
   */
  const getParams = (formValues: any) => {
    const time1 = moment(formValues.ckrq[0]).format('yyyy-MM-DD');
    const time2 = moment(formValues.ckrq[1]).format('yyyy-MM-DD');
    const userInfo = myUtil.sessionStore.getItem('userInfo');
    const fpxzfwlxDm = userInfo?.xtCs?.fpxzfwlxDm;
    const params = { zxkpfwlxDm: fpxzfwlxDm, sqlx: 'JXFP', tjzdmc: '开票日期', sjgjsjDm: '020101', czfdm: '08', fplxs: formValues.fplxs, csz1: moment(time1).startOf('day').format('x'), csz2: moment(time2).startOf('day').format('x') };
    return params;
  }

  const save2 = async () => {
    const formValues = await form.validateFields();
    const params = getParams(formValues)
    setMasker(true);
    await cjrw(params).then(async (response: any) => {
      const { code, msg } = response;
      setMasker(false);
      if (code == '200') {
        DDAlert.open({
          title: intl.formatMessage({ id: 'message_jljghx_sjxz_sjxz_title' }),
          info: intl.formatMessage({ id: 'message_jljghx_sjxz_sjxz_info' }),
          infoType: 'success',
          content: [
            intl.formatMessage({ id: 'message_jljghx_sjxz_sjxz_content_xzrw' }),
          ],
          okText: '转任务管理',
          okCallbackFn: function () {
            history.push('/02/0201');
          }
        });
      } else {
        message.error(msg);
      }
    });
  }

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
  }

  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <ProCard split="horizontal" className="dd_layout_form_01 dd_hgdzxzjy" >
        <ProCard style={{ height: myUtil.heightCalc.getCalc(['header', 'headerTab', 'cardMargin', 'footerBtn']), overflowY: 'auto' }}>
          <div className='groupTit'>数据下载</div>
          <Form form={form}  >
            <Row justify="center">
              <Col span={8}>
                <Form.Item name="ckrq" rules={[{ required: true, message: '请输入开票日期' },
                () => ({
                  validator(_, value) {
                    if (value?.length === 2 && myUtil.fpfw.xxjyGzByFwlxDm()) {
                      if (value[0].diff(value[1], 'month') > 2 || value[1].diff(value[0], 'month') > 2) {
                        return Promise.reject(new Error('时间范围不能超过3个月'));
                      }
                      return Promise.resolve();
                    }
                    return Promise.resolve();
                  },
                })
                ]}>
                  <DatePicker.RangePicker placeholder={['开票日期起', '开票日期止']} disabledDate={current => myUtil.sessionStore.getItem('userInfo')?.xtCs?.fpxzfwlxDm == '2' && current && current > moment().endOf('day')} />
                </Form.Item>
                <Form.Item name="fplxs" rules={[{ required: true, message: '请选择发票类型' }]} initialValue={["ZZSZYFP", "ZZSPTFP"]}>
                  <Checkbox.Group>
                    <Checkbox key="ZZSZYFP" value="ZZSZYFP">增值税专用发票</Checkbox>
                    <Checkbox key="ZZSPTFP" value="ZZSPTFP">增值税普通发票</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </ProCard>
        <ProCard className="ddlf01_footer">
          <Space>
            <Button type='primary' onClick={() => { downloadXxfp() }}>数据下载</Button>
          </Space>
        </ProCard>
      </ProCard>
      <TabSfyz onRef={refKprz} getdlFlag={save2} />
      <FpDDLogin onRef={refFpRz} getdlFlag={save2} />
    </Spin>
  );
};

export default Xxfpxz;
