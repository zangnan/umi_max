import React, { useState, useRef,useEffect } from 'react';
import { Button, Form, Space, Input, message, Checkbox, Tooltip, Spin, Popover, DatePicker, Row, Col } from 'antd';
import ProCard from '@ant-design/pro-card';
import DDAlert from '@/components/DDAlert';
import { history } from 'umi';
import { ycsbsjxz,checkDlt2,zxqjy,cjrw} from '@/services/hts/api';
import myUtil from '@/pages/common/myUtil';
import './style.less';
import { useIntl } from 'umi';
import moment from 'moment';
import TabSfyz from '../../../pzgl/sdppzgl/djdlpz/tab_sfyz';
import FpDDLogin from '@/components/FpDDLogin';


export type HgdzxzjyProps = {
  jxpcflag?: any;
}

const Hgdzxzjy: React.FC<HgdzxzjyProps> = ({
  jxpcflag
}) => {
  const refKprz: any = useRef();
  const refFpRz: any = useRef();

  const [form] = Form.useForm();
  //下载按钮是否显示
  const [masker, setMasker] = useState(false);
  const [rqName, setRqName] = useState('');
  const [param, setParam] = useState({});
  const intl = useIntl();

  useEffect(() => {
  }, [param]);

  const getCxtj = () => {
    const sbqyuuid = myUtil.sessionStore.getItem('userInfo')?.qxQys[0].sbqyuuid;
    const yhuuid1 = myUtil.sessionStore.getItem('userInfo')?.qxyh?.yhuuid1;
    const cxtjKey = yhuuid1 + sbqyuuid + 'jxfpjghsjfplx';
    const values: any = myUtil.localStore.getItem(cxtjKey) || {};
    return values;
  }

  const fplxOnChange = (values : any) => {
    const sbqyuuid = myUtil.sessionStore.getItem('userInfo')?.qxQys[0].sbqyuuid;
    const yhuuid1 = myUtil.sessionStore.getItem('userInfo')?.qxyh?.yhuuid1;
    const cxtjKey = yhuuid1 + sbqyuuid + 'jxfpjghsjfplx';
    myUtil.localStore.setItem(cxtjKey, {fplxs:values});
  }

  // 单证下载
  const downloadSj = async () => {
    const formValues =  await form.validateFields();
    const time1 = moment(formValues.ckrq[0]).format('yyyy-MM-DD')
    const time2 = moment(formValues.ckrq[1]).format('yyyy-MM-DD')
    const params = {};
    params.tjzdmc = '出口日期';
    if(history?.location?.pathname =='/02/0202/020202'){
      params.sqlx = 'DLZM';
      params.sjgjsjDm = '030501';
      params.tjzdmc = '出口日期';
    }else if(history?.location?.pathname =='/02/0202/020203'){
      params.sqlx = 'ZZFP';
      params.sjgjsjDm = '020001';
      params.tjzdmc = '开票日期';
    }else{
      params.sqlx = 'XFSP';
      params.sjgjsjDm = '020002';
      params.tjzdmc = '填发日期';
    }
    params.czfdm = '08';
    params.csz1 = moment(time1).startOf('day').format('x');
    params.csz2 = moment(time2).startOf('day').format('x');
    if(history?.location?.pathname =='/02/0202/020203' && myUtil.fpfw.xxjyGzByFwlxDm()){
    //增值税发票下载，并且是调用江苏接口.
    setMasker(true);
    await checkDlt2({jxbz :"Y"}).then(async (res: any) => {
      setMasker(false);
      const { code, body, msg } = res;
      if (code == '200') {
        const dl = body?.dlbz == 'Y' ? true : false;
        if (dl) {
          // 如果已登录，
          params.jxbz="Y";
          setParam(params);
          save2();
        } else {
          params.jxbz="Y";
          setParam(params);
          // 如果未登录，弹出登录
          logon('3');
        }
      } else {
        message.error(msg);
      }
    });
    }else{
      setMasker(true);
      await ycsbsjxz(params).then(async (response: any) => {
        const { desc, code } = response;
        // const { desc, code } = {code:'200',desc:''};
        if(code == '200'){
          setMasker(false);
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
        }else{
          setMasker(false);
          message.info(desc);
        }

      });
    }
  }


  const save2 =  async () => {
    setMasker(true);
    const formValues =  await form.validateFields();
    const time1 = moment(formValues.ckrq[0]).format('yyyy-MM-DD')
    const time2 = moment(formValues.ckrq[1]).format('yyyy-MM-DD')
    const params2 = {};
    params2.sqlx = 'ZZFP';
    params2.sjgjsjDm = '020001';
    params2.tjzdmc = '开票日期';
    params2.czfdm = '08';
    params2.csz1 = moment(time1).startOf('day').format('x');
    params2.csz2 = moment(time2).startOf('day').format('x');
    params2.jxbz="Y";
    if (jxpcflag) {
      params2.fplxs =formValues.fplxs;
    } else {
      params2.fplxs =['ZZSZYFP'];
    }
    await cjrw(params2).then(async (response: any) => {
      const { desc, code ,msg,body} = response;
      setMasker(false);
      if(code == '200'){
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
      }else{
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

  useEffect(() => {
    if(history?.location?.pathname =='/02/0202/020202'){
      setRqName('出口');
    }else if(history?.location?.pathname =='/02/0202/020203'){
      setRqName('开票');
      const val: any = getCxtj();
      if (val?.fplxs) {
        form.setFieldsValue({fplxs:val?.fplxs});
      } else {
        form.setFieldsValue({fplxs:['ZZSZYFP']});
      }
      form.setFieldsValue({ckrq:[moment().subtract(3, 'months').add(1, 'day'), moment()]});
    }else{
      setRqName('填发');
    }
  }, []);

  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <ProCard split="horizontal" className="dd_layout_form_01 dd_hgdzxzjy" >
        <ProCard style={{ height: myUtil.heightCalc.getCalc(['header', 'headerTab', 'cardMargin', 'footerBtn']), overflowY: 'auto' }}>
          <div className='groupTit'>数据下载</div>
          <Form form={form}  >
          <Row justify="center">
            <Col span={8}>
              <Form.Item  name="ckrq" rules={[{ required: true, message: '请输入'+rqName+'日期'},
                () => ({
                  validator(_, value) {
                    if (value?.length === 2 && myUtil.fpfw.xxjyGzByFwlxDm() && history?.location?.pathname =='/02/0202/020203') {
                      const diffMonths = value[1].diff(value[0], 'months', true);
                      if (Math.abs(diffMonths) > 3) {
                        return Promise.reject(new Error('时间范围不能超过3个月'));
                      }
                      return Promise.resolve();
                    }
                    return Promise.resolve();
                  },
                })
            ]}>
                <DatePicker.RangePicker placeholder={[rqName+'日期起',rqName+'日期止']} disabledDate={current => myUtil.fpfw.xxjyGzByFwlxDm() && history?.location?.pathname =='/02/0202/020203' && current && current > moment().endOf('day')}/>
              </Form.Item>
              {history?.location?.pathname == '/02/0202/020203' && jxpcflag?
                <Form.Item name="fplxs" rules={[{ required: true, message: '请选择发票类型' }]}>
                  <Checkbox.Group onChange={fplxOnChange} >
                    <Checkbox key="ZZSZYFP" value="ZZSZYFP">增值税专用发票</Checkbox>
                    <Checkbox key="ZZSPTFP" value="ZZSPTFP">增值税普通发票</Checkbox>
                  </Checkbox.Group>
                </Form.Item>:<></>}
              </Col>
            </Row>
          </Form>
        </ProCard>
        <ProCard className="ddlf01_footer">
          <Space>
            <Button type='primary' onClick={() => { downloadSj() }}>数据下载</Button>
          </Space>
        </ProCard>
      </ProCard>
      <TabSfyz onRef={refKprz} getdlFlag={save2} />
      <FpDDLogin onRef={refFpRz} getdlFlag={save2} />

    </Spin>
  );
};

export default Hgdzxzjy;
