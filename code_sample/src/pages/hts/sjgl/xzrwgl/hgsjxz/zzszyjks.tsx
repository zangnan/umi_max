import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Space, Input, message, Checkbox, DatePicker, Radio, Tooltip, Spin, Row, Col, Upload, Badge, Card } from 'antd';
import { QuestionCircleOutlined, UploadOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { uploadScHgCkbgdCj2, queryKakPassword, saveKakPassword, hgsjxz, rwycgx } from '@/services/hts/api';
import myUtil from '@/pages/common/myUtil';
import cktsUtil from '@/pages/common/cktsUtil';
import khdgjUtil from '@/pages/hts/ckfp/khdgjUtil';
import './style.less';
import { useIntl } from 'umi';
import moment from 'moment';
import DDAlert from '@/components/DDAlert';
import IcList from '@/pages/hts/pzgl/icCard/common/icCardTsListGpt';
import cardStyle from '../sjxz/cardLess2.less';

export type ActionType = {
  reload: (resetPageIndex?: boolean) => void;
}
export interface Hgsjxzjy {
  chardIndex?: any,
  form?: any
}

const Hgsjxzjy: React.FC<Hgsjxzjy> = ({ chardIndex, form }) => {
  //下载按钮是否显示
  const [masker, setMasker] = useState(false);
  const intl = useIntl();
  const [jcbz, setJcbz] = useState('ND');
  const [jcMsg, setJcMsg] = useState('');
  const [bgdsxbz, setBgdsxbz] = useState(true);
  const [rqsxbz, setRqsxbz] = useState(false);
  const [value, setValue] = useState<any>();
  const [hackValue, setHackValue] = useState<any>();
  const [gxbz, setGxbz] = useState<any>();
  const [kakmima, setKakmima] = useState('');
  const refICList: any = useRef(); // 环境检测
  const [cardIndex, setCardIndex] = useState<any>('2');

  useEffect(() => {
    const promiseArr: any = [];
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

  const initKakmm = async (params: any) => {
    const result = await queryKakPassword(params);
    const { code, body } = result;
    if (code === '200') {
      form.setFieldsValue(body);
      setKakmima(body?.kakmm);
    }


  }


  // 表单布局
  const tailLayout = {
    wrapperCol: { offset: 9, span: 15 },
  };

  // const handlerXzfsChange = (e: any) => {
  //   if (e.target.value === '1') {
  //     setBgdsxbz(false);
  //     setRqsxbz(true);
  //     form.setFieldsValue({ sjgjsjDm: [], ndsj: '0', hgSxrq: [] });
  //   } else {
  //     setBgdsxbz(true);
  //     setRqsxbz(false);
  //     form.setFieldsValue({ bah: '', sjgjsjDm: ['010301', '010401'], ndsj: "1", hgSxrq: defaultRangeData(), });
  //   }
  // }
  // const defaultRangeData = async () => {
  //   return [moment(myUtil.date.getQZDateBeforeCurr(1).firstDay, 'YYYY-MM-DD'), moment(myUtil.date.getQZDateBeforeCurr(1).lastDay, 'YYYY-MM-DD')];
  // }

  //时间选取
  const handleSelectTime = (values: any, formatString: [string, string]) => {
    if (formatString[0] === myUtil.date.getPreviousMonthDates().firstDay && formatString[1] === myUtil.date.getPreviousMonthDates().lastDay) {
      form.setFieldsValue({ ndsj: '1' });
    } else if (formatString[0] === myUtil.date.getQZDateYfBeforeCurr(0).firstDay && formatString[1] === myUtil.date.getQZDateYfBeforeCurr(0).nowDay) {
      form.setFieldsValue({ ndsj: '2' });
    } else if (formatString[0] === myUtil.date.getFormattedAdjustedDate(-90) && formatString[1] === myUtil.date.getQZDateYfBeforeCurr(0).nowDay) {
      form.setFieldsValue({ ndsj: '3' });
    } else {
      form.setFieldsValue({ ndsj: '' });
    }
    setValue(values);
  }

  // 表单项目测试数据
  const itemList2 = [
    { value: '1', name: '上月' },
    { value: '2', name: '本月' },
    { value: '3', name: '近三月' },
  ];
  //radio change事件
  const handlerHgSxrqChange = (e: any) => {
    const value = e.target.value;
    if (value === '1') {
      form.setFieldsValue({ hgSxrq: [moment(myUtil.date.getPreviousMonthDates().firstDay, 'YYYY-MM-DD'), moment(myUtil.date.getPreviousMonthDates().lastDay, 'YYYY-MM-DD')] });
    }
    if (value === '2') {
      form.setFieldsValue({ hgSxrq: [moment(myUtil.date.getQZDateYfBeforeCurr(0).firstDay, 'YYYY-MM-DD'), moment(myUtil.date.getQZDateYfBeforeCurr(0).nowDay, 'YYYY-MM-DD')] });
    }
    if (value === '3') {
      form.setFieldsValue({ hgSxrq: [moment(myUtil.date.getFormattedAdjustedDate(-90), 'YYYY-MM-DD'), moment(myUtil.date.getQZDateYfBeforeCurr(0).nowDay, 'YYYY-MM-DD')] });
    }
  }

  const saveHjjc = (flag: any) => {
    refICList.current!.closeModal();
  }

  // 改变卡片
  const changeCard = (index: any) => {
    if (index != cardIndex) {
      setCardIndex(index);
      if (index === '1') {
        setBgdsxbz(false);
        setRqsxbz(true);
        form.setFieldsValue({ ndsj: '0', hgSxrq: [] });
      } else {
        setBgdsxbz(true);
        setRqsxbz(false);
        form.setFieldsValue({ bah: '', ndsj: "1", hgSxrq: [moment().startOf('month'), moment().endOf('month')], });
      }
    }
  }

  return (
    <Spin tip="客户端工具检查中，请稍候..." spinning={masker} delay={100}>
      <ProCard split="horizontal" className="dd_layout_form_01 dd_hgsjxzjy" >
        <ProCard style={{ height: myUtil.heightCalc.getCalc(['header', 'headerTab', 'cardMargin', 'footerBtn', '290px']), overflowY: 'auto' }}>
          {/* <div className='groupTit'>基础信息</div> */}
          <Form
            form={form}
            name="form"
          // labelCol={{ span: 10 }}
          // wrapperCol={{ span: 14 }}
          >
            <Row gutter={[20, 20]} >
              <Col className="gutter-row" span={8}>
                <Card
                  style={{ height: 188 }}
                  id='a1'
                  onClick={() => changeCard('1')}
                  className={cardIndex === '1' ? cardStyle.cardBox2 : cardStyle.cardBoxFFF3}
                  title="按报关单号下载"
                >
                  <Form.Item name="ndsj" hidden={true}></Form.Item>
                  <Form.Item name="bah" rules={[
                    () => ({
                      validator(_, value) {
                        if (value) {
                          if (value.length >= 9) {
                            const ss = value.substr(8, 1);
                            if (ss != '0' && ss != '1') {
                              return Promise.reject(new Error('报关单号不符合规则，请重新输入。'));
                            }
                          }
                          if (value.length != 18) {
                            return Promise.reject(new Error('报关单号必须为18位。'));
                          }
                          form.setFieldsValue({ bah: value.toUpperCase() });
                        } else {
                          if (!bgdsxbz) {
                            return Promise.reject(new Error('报关单号为必填项不能为空。'));
                          }
                        }
                        return Promise.resolve();
                      },
                    })
                  ]}>
                    <Input placeholder="请输入18位报关单号" style={{ width: 260 }} disabled={bgdsxbz} />
                  </Form.Item>
                </Card>
              </Col>
              <Col className="gutter-row" span={8}>
                <Card
                  style={{ height: 188 }}
                  id='a2'
                  onClick={() => changeCard('2')}
                  className={cardIndex === '2' ? cardStyle.cardBox2 : cardStyle.cardBoxFFF3}
                  title={<>按填发日期下载<Tooltip title="按照单一窗口的填发日期下载"> <span><QuestionCircleOutlined /></span></Tooltip></>}
                >
                  <Form.Item name='hgSxrq' key="4" rules={[
                    () => ({
                      validator(_, value) {
                        if (value.length === 2) {
                         // 检查是否跨年（开始年份不等于结束年份）
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
                  ]} initialValue={[moment().startOf('month'), moment()]}>
                    <DatePicker.RangePicker style={{ width: 260 }}
                      onChange={handleSelectTime}
                      allowClear={false}
                      format={myUtil.date.formatList()}
                      disabled={rqsxbz}
                    />
                  </Form.Item>
                  <Form.Item className={cardStyle.cardFormBox} name='ndsj' initialValue={'2'}>
                    <Radio.Group onChange={handlerHgSxrqChange} disabled={rqsxbz}>
                      {itemList2.map((item) => (
                        <Radio key={item.value} value={item.value}>{item.name}</Radio>
                      ))}
                    </Radio.Group>
                  </Form.Item>
                </Card>
              </Col>
            </Row>
            {/* <Col span={10}>
            <Form.Item name='xzfs' {...tailLayout}>
              <Radio.Group defaultValue={'2'} onChange={handlerXzfsChange}>
                <Space direction='vertical'>
                  <Radio key={'xzfs_abgd'} value={'1'}>
                      <Form.Item name="bah" rules={[
                      () => ({
                        validator(_, value) {
                          if (value) {
                            if(value.length >= 9){
                              const ss = value.substr(8,1);
                              if(ss != '0' && ss != '1'){
                                return Promise.reject(new Error('报关单号不符合规则，请重新输入。'));
                              }
                            }
                            if(value.length != 18){
                              return Promise.reject(new Error('报关单号必须为18位。'));
                            }
                            form.setFieldsValue({ bah: value.toUpperCase() });
                          } else {
                            if (!bgdsxbz) {
                              return Promise.reject(new Error('报关单号为必填项不能为空。'));
                            }
                          }
                          return Promise.resolve();
                        },
                      })
                    ]}>
                      <Input placeholder="请输入18位报关单号" style={{ width: 260 }} disabled={bgdsxbz} />
                    </Form.Item>
                  </Radio>
                  <Radio key={'xzfs_arq'} value={'2'}>
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
                    ]} initialValue={[moment().startOf('month'), moment().endOf('month')]}>
                    <DatePicker.RangePicker value={hackValue || value} style={{ width: 260 }}
                        onChange={handleSelectTime}
                        allowClear={false}
                        format={myUtil.date.formatList()}
                        disabled={rqsxbz}
                      />
                    </Form.Item>
                  </Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
            </Col> */}
          </Form>
        </ProCard>
      </ProCard>
      <IcList onRef={refICList} saveBtn={saveHjjc} />
    </Spin>
  );
};

export default Hgsjxzjy;
