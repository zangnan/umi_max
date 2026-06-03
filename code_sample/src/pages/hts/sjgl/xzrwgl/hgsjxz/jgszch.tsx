import React, { useState, useEffect } from 'react';
import { Button, Form, Space, Input, message, Checkbox, DatePicker, Radio, Tooltip, Spin, Row, Col, Card } from 'antd';
import ProCard from '@ant-design/pro-card';
import DDAlert from '@/components/DDAlert';
import { history } from 'umi';
import { xzrw, queryKakPassword, saveKakPassword, rwycgx, hgsjxz } from '@/services/hts/api';
import myUtil from '@/pages/common/myUtil';
import './style.less';
import { useIntl } from 'umi';
import moment from 'moment';
import cardStyle from '../sjxz/cardLess2.less';
import { QuestionCircleOutlined } from '@ant-design/icons';

export interface Hgsjxzjy {
  chardIndex?: any,
  form?: any
}
const Hgsjxzjy: React.FC<Hgsjxzjy> = ({ chardIndex, form }) => {
  // const [form] = Form.useForm();
  //下载按钮是否显示
  const [masker, setMasker] = useState(false);
  const intl = useIntl();
  const [jcbz, setJcbz] = useState('ND');
  const [jcMsg, setJcMsg] = useState('');
  const [value, setValue] = useState<any>();
  const [kakmima, setKakmima] = useState('');
  const [bgdsxbz, setBgdsxbz] = useState(true);
  const [rqsxbz, setRqsxbz] = useState(false);
  const [cardIndex, setCardIndex] = useState<any>('2');

  useEffect(() => {
    const promiseArr: any = [];
    form.setFieldsValue({ ndsj: '2', sjxzfs: '01' });

    promiseArr.push(initKakmm({}));
    promiseArr.push(initEwm());
    setMasker(true);
    Promise.all(promiseArr).then().catch(() => {
    }).finally(() => {
      setMasker(false);
    });
  }, []);

  const initEwm = () => {
    const userInfo = myUtil.sessionStore.getItem('userInfo');
    const qyuuid = userInfo?.qxQys[0].qyuuid;
    const hgkak = myUtil.sessionStore.getItem('hgkak');
    if (hgkak) {
      //比对是否为当前企业
      if (qyuuid == hgkak.qyuuid) {
        //再比对时间,30min内，设置为true
        var dt1 = (new Date()).valueOf();
        var dt2 = hgkak.date;
        var num = (dt1 - dt2) / 1000;
        //有效
        if (num < 1800) {
          setJcbz('Y');
        }
      } else {
        // 不相等清空标志
        myUtil.sessionStore.clear('hgkak');
      }
    }
  }


  //radio change事件
  const handlerHgSxrqChange = (e: any) => {
    const value = e.target.value;
    if (value === '1') {
      form.setFieldsValue({ hgSxrq: [moment(myUtil.date.getFormattedAdjustedDate(-90), 'YYYY-MM-DD'), moment(myUtil.date.getQZDateYfBeforeCurr(0).nowDay, 'YYYY-MM-DD')] });
    }
    if (value === '2') {
      form.setFieldsValue({ hgSxrq: [moment(myUtil.date.getFormattedAdjustedDate(-180), 'YYYY-MM-DD'), moment(myUtil.date.getQZDateYfBeforeCurr(0).nowDay, 'YYYY-MM-DD')] });
    }
    if (value === '3') {
      form.setFieldsValue({ hgSxrq: [moment(myUtil.date.getYearBeforeCurr(1) + '-01-01', 'YYYY-MM-DD'), moment(myUtil.date.getYearBeforeCurr(1) + '-12-31', 'YYYY-MM-DD')] });
    }
  }
  const initKakmm = async (params: any) => {
    const result = await queryKakPassword(params);
    const { code, body } = result;
    if (code === '200') {
      form.setFieldsValue(body);
      setKakmima(body?.kakmm);
    }
  }



  const checkPptions = [
    { label: '加工贸易手册', value: '010300' },
    { label: '加工贸易账册', value: '010400' },
  ];

  // const handlerXzfsChange = (e: any) => {
  //   if (e.target.value === '1') {
  //     setBgdsxbz(false);
  //     setRqsxbz(true);
  //     form.setFieldsValue({ sjgjsjDm: [], ndsj: '0', hgSxrq: [] });
  //   } else {
  //     setBgdsxbz(true);
  //     setRqsxbz(false);
  //     form.setFieldsValue({ bah: '', sjgjsjDm: ['010300', '010400'], ndsj: "1", hgSxrq: [moment(myUtil.date.getQZDateBeforeCurr(1).firstDay, 'YYYY-MM-DD'), moment()], });
  //   }
  // }

  // const defaultRangeData = async () => {
  //   return [moment(myUtil.date.getQZDateBeforeCurr(1).firstDay, 'YYYY-MM-DD'), moment()];
  // }

  //时间选取
  const handleSelectTime = (values: any, formatString: [string, string]) => {
    if (formatString[0] === myUtil.date.getFormattedAdjustedDate(-90) && formatString[1] === myUtil.date.getQZDateYfBeforeCurr(0).nowDay) {
      form.setFieldsValue({ ndsj: '1' });
    } else if (formatString[0] === myUtil.date.getFormattedAdjustedDate(-180) && formatString[1] === myUtil.date.getQZDateYfBeforeCurr(0).nowDay) {
      form.setFieldsValue({ ndsj: '2' });
    } else if (formatString[0] === myUtil.date.getYearBeforeCurr(1) + '-01-01' && formatString[1] === myUtil.date.getYearBeforeCurr(1) + '-12-31') {
      form.setFieldsValue({ ndsj: '3' });
    } else {
      form.setFieldsValue({ ndsj: '' });
    }
    setValue(values);
  }

  // 表单项目测试数据
  const itemList2 = [
    { value: '1', name: '三个月' },
    { value: '2', name: '六个月' },
    { value: '3', name: '上一年' },
  ];

  // 表单项目测试数据
  const xzList = [
    { value: '01', name: '快速下载', tooltipContent: '仅下载税务核销时必要的海关数据，可节省部分下载时间' },
    { value: '02', name: '全量下载', tooltipContent: '下载所有核注清单和报关单数据，下载时间相对较长' },
  ];
  // 表单布局
  // const tailLayout = {
  //   wrapperCol: { offset: 9, span: 15 },
  // };

  // const mima = async (e:any) => {
  //   const mm = e.target.value;
  //   if(kakmima == mm){
  //     setJcbz('ND');
  //   }else{
  //     setJcbz('N');
  //   }
  // };

  // 改变卡片
  const changeCard = (index: any) => {
    if (index != cardIndex) {
      setCardIndex(index);
      if (index === '1') {
        setBgdsxbz(false);
        setRqsxbz(true);
        form.setFieldsValue({ sjgjsjDm: [], ndsj: '0', hgSxrq: [] });
      } else {
        setBgdsxbz(true);
        setRqsxbz(false);
        form.setFieldsValue({ bah: '', sjgjsjDm: '010300', ndsj: "2", hgSxrq: [moment(myUtil.date.getFormattedAdjustedDate(-180), 'YYYY-MM-DD'), moment(myUtil.date.getQZDateYfBeforeCurr(0).nowDay, 'YYYY-MM-DD')], });
      }
    }
  }

  return (
    <Spin tip="客户端工具检查中，请稍候..." spinning={masker} delay={100}>
      <ProCard split="horizontal" className="dd_layout_form_01 dd_hgsjxzjy" >
        <ProCard style={{ height: myUtil.heightCalc.getCalc(['header', 'headerTab', 'cardMargin', 'footerBtn', '290px']), overflowY: 'auto' }}>
          <Form
            form={form}
            name="form"
            className={cardStyle.cardForm}
          // labelCol={{ span: 10 }}
          // wrapperCol={{ span: 14 }}
          >
            <Row gutter={[20, 20]} >
              <Col className="gutter-row" span={8}>
                <Card
                  style={{ height: 235 }}
                  id='a1'
                  onClick={() => changeCard('1')}
                  className={cardIndex === '1' ? cardStyle.cardBox2 : cardStyle.cardBoxFFF3}
                  title="按手册号下载"
                >
                  <Form.Item name="bah"
                    rules={[
                      () => ({
                        validator (_, value) {
                          if (value) {
                            form.setFieldsValue({ bah: value.toUpperCase() });
                            if (!(value.toUpperCase().startsWith('B') || value.toUpperCase().startsWith('C'))) {
                              return Promise.reject(new Error('仅支持下载单个加工贸易手册号，请重新输入！'));
                            }
                          } else {
                            if (!bgdsxbz) {
                              return Promise.reject(new Error('加工贸易手册号为必填项不能为空！！'));
                            }
                          }
                          return Promise.resolve();
                        },
                      })
                    ]}
                  >
                    <Input placeholder="请输入加工贸易手册号" style={{ width: 260 }} disabled={bgdsxbz} />
                  </Form.Item>
                </Card>
              </Col>
              <Col className="gutter-row" span={8}>
                <Card
                  style={{ height: 235 }}
                  id='a2'
                  onClick={() => changeCard('2')}
                  className={cardIndex === '2' ? cardStyle.cardBox2 : cardStyle.cardBoxFFF3}
                  title={<>按录入日期下载<Tooltip title="按照单一窗口的录入日期下载"> <span><QuestionCircleOutlined /></span></Tooltip></>}
                >
                  <Form.Item className={cardStyle.cardFormBox} name='sjgjsjDm' rules={[
                    () => ({
                      validator (_, value) {
                        if (bgdsxbz) {
                          if (value.length <= 0) {
                            return Promise.reject(new Error('加工贸易手册和加工贸易账册至少选中一项！'));
                          }
                        }
                        return Promise.resolve();
                      },
                    })
                  ]} initialValue={'010300'}>
                    <Radio.Group key={'sjxzSjgjsjDm'} options={checkPptions} disabled={rqsxbz} />
                  </Form.Item>
                  <Form.Item className={cardStyle.cardFormBox} name='hgSxrq' key="4" rules={[
                    () => ({
                      validator (_, value) {
                        if (value.length === 2) {
                          if (value[0].year() !== value[1].year()) {
                            return Promise.reject(new Error('不允许跨年选择'));
                          }
                          if (value[0].diff(moment('2014-01-01', 'YYYY-MM-DD'), 'days') < 0) {
                            return Promise.reject(new Error('数据下载时间范围开始时间不能小于2014-01-01'));
                          }
                          return Promise.resolve();
                        }
                        return Promise.resolve();
                      },
                    })
                  ]} initialValue={[moment(myUtil.date.getFormattedAdjustedDate(-180), 'YYYY-MM-DD'), moment(myUtil.date.getQZDateYfBeforeCurr(0).nowDay, 'YYYY-MM-DD')]}>
                    <DatePicker.RangePicker value={value} style={{ width: 260 }}
                      onChange={handleSelectTime}
                      // onCalendarChange={val => setDates(val)}
                      // disabledDate={disabledDate}
                      allowClear={false}
                      // onOpenChange={onOpenChange}
                      format={myUtil.date.formatList()}
                      disabled={rqsxbz}
                    />
                  </Form.Item>
                  <Form.Item className={cardStyle.cardFormBox} name='ndsj' >
                    <Radio.Group onChange={handlerHgSxrqChange} >
                      {itemList2.map((item) => (
                        <Radio key={item.value} value={item.value}>{item.name}</Radio>
                      ))}
                    </Radio.Group>
                  </Form.Item>
                </Card>
              </Col>
              {/* <Col className='gutter-row' span={8}>
                <Card
                    style={{ height: 188 }}
                    id='a3'
                    // onClick={() => changeCard('3')}
                    className={cardStyle.cardBox2}
                  >
                  <Form.Item name='sjxzfs'>
                    <Radio.Group>
                      {xzList.map((item) => (
                        <>
                          <Radio key={item.value} value={item.value}>
                            {item.name}&nbsp;
                            <Tooltip title={item.tooltipContent}>
                              <QuestionCircleOutlined />
                            </Tooltip>
                          </Radio>
                          
                        </>
                      ))}
                    </Radio.Group>
                  </Form.Item>
                </Card>
              </Col> */}
            </Row>
            {/* 
            <Col span={10}>
              <Form.Item name='xzfs' {...tailLayout}>
                <Radio.Group defaultValue={'2'} onChange={handlerXzfsChange}>
                  <Space direction='vertical'>
                    <Radio key={'xzfs_abgd'} value={'1'}>
                      <Form.Item name="bah" rules={[
                        () => ({
                          validator(_, value) {
                            if (value) {
                              form.setFieldsValue({ bah: value.toUpperCase() });
                              if (!(value.toUpperCase().startsWith('B') || value.toUpperCase().startsWith('C'))) {
                                return Promise.reject(new Error('仅支持下载单个加工贸易手册号，请重新输入！'));
                              }
                            } else {
                              if (!bgdsxbz) {
                                return Promise.reject(new Error('加工贸易手册号为必填项不能为空！！'));
                              }
                            }
                            return Promise.resolve();
                          },
                        })
                      ]}>
                        <Input placeholder="请输入加工贸易手册号" style={{ width: 260 }} disabled={bgdsxbz} />
                      </Form.Item>
                    </Radio>
                    <Radio key={'xzfs_arq'} value={'2'}>
                      <Form.Item name='sjgjsjDm' rules={[
                        () => ({
                          validator(_, value) {
                            if (bgdsxbz) {
                              if (value.length <= 0) {
                                return Promise.reject(new Error('加工贸易手册和加工贸易账册至少选中一项！'));
                              }
                            }
                            return Promise.resolve();
                          },
                        })
                      ]} initialValue={'010300'}>
                        <Radio.Group key={'sjxzSjgjsjDm'} options={checkPptions} disabled={rqsxbz} />
                      </Form.Item>
                      <Form.Item name='hgSxrq' key="4" rules={[
                        () => ({
                          validator(_, value) {
                            if (value.length === 2) {
                              if (value[0].diff(value[1], 'years') > 4 || value[1].diff(value[0], 'years') > 4) {
                                return Promise.reject(new Error('数据下载最大下载时间范围是5年'));
                              }
                              if (value[0].diff(moment('2014-01-01', 'YYYY-MM-DD'), 'days') < 0) {
                                return Promise.reject(new Error('数据下载时间范围开始时间不能小于2014-01-01'));
                              }
                              return Promise.resolve();
                            }
                            return Promise.resolve();
                          },
                        })
                      ]} initialValue={[moment(myUtil.date.getQZDateBeforeCurr(1).firstDay, 'YYYY-MM-DD'), moment(myUtil.date.getQZDateBeforeCurr(1).lastDay, 'YYYY-MM-DD')]}>
                        <DatePicker.RangePicker value={hackValue || value} style={{ width: 260 }}
                          onChange={handleSelectTime}
                          // onCalendarChange={val => setDates(val)}
                          // disabledDate={disabledDate}
                          allowClear={false}
                          // onOpenChange={onOpenChange}
                          format={myUtil.date.formatList()}
                          disabled={rqsxbz}
                        />
                      </Form.Item>
                      <Form.Item name='ndsj' >
                        <Radio.Group onChange={handlerHgSxrqChange} >
                          {itemList2.map((item) => (
                            <Radio key={item.value} value={item.value}>{item.name}</Radio>
                          ))}
                        </Radio.Group>
                      </Form.Item>
                    </Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </Col> */}
          </Form>

        </ProCard>
        {/* <ProCard className="ddlf01_footer">
          <Space>
            <Button type='primary' onClick={() => { sqxzBtn() }}>数据下载</Button>
          </Space>
        </ProCard>*/}
      </ProCard>
    </Spin>
  );
};

export default Hgsjxzjy;
