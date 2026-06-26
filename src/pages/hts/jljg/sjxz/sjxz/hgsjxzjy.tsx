import React, { useState, useEffect } from 'react';
import { Button, Form, Space, Input, message, Checkbox, DatePicker, Radio, Tooltip, Spin, Popover, Image } from 'antd';
import moment from 'moment';
import ProCard from '@ant-design/pro-card';
import DDAlert from '@/pages/hts/commonModule/DDAlert';
import { history } from 'umi';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { xzrw, queryEwmtp, queryKakPassword, saveKakPassword } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';
import cktsUtil from '@/pages/hts/cktsUtil';
import khdgjUtil from '@/pages/hts/ckfp/khdgjUtil';
import './style.less';
import { useIntl } from 'umi';

export type ActionType = {
  reload: (resetPageIndex?: boolean) => void;
}

const Hgsjxzjy: React.FC<unknown> = () => {
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;
  //下载按钮是否显示
  const [dates, setDates] = useState<any>();
  const [masker, setMasker] = useState(false);
  // const [hjjcBz, setHjjcBz] = useState(false);
  const [hackValue, setHackValue] = useState<any>();
  const [value, setValue] = useState<any>();
  const intl = useIntl();

  const [bgdsxbz, setBgdsxbz] = useState(true);
  const [rqsxbz, setRqsxbz] = useState(false);

  const [imgSrc, setImgSrc] = useState<any>('error');
  const [txtil, setTxtil] = useState<any>(<span>系统异常</span>);

  const checkPptions = [
    { label: '加工贸易手册', value: '010301' },
    { label: '加工贸易账册', value: '010401' },
  ];
  // 表单项目测试数据
  const itemList2 = [
    { value: '1', name: '一年' },
    { value: '2', name: '两年' },
    { value: '3', name: '三年' },
  ];

  //radio change事件
  const handlerHgSxrqChange = (e: any) => {
    const value = e.target.value;
    if (value === '1') {
      form.setFieldsValue({ hgSxrq: [moment(myUtil.date.getQZDateBeforeCurr(1).firstDay, 'YYYY-MM-DD'), moment(myUtil.date.getQZDateBeforeCurr(1).lastDay, 'YYYY-MM-DD')] });
    }
    if (value === '2') {
      form.setFieldsValue({ hgSxrq: [moment(myUtil.date.getQZDateBeforeCurr(2).firstDay, 'YYYY-MM-DD'), moment(myUtil.date.getQZDateBeforeCurr(1).lastDay, 'YYYY-MM-DD')] });
    }
    if (value === '3') {
      form.setFieldsValue({ hgSxrq: [moment(myUtil.date.getQZDateBeforeCurr(3).firstDay, 'YYYY-MM-DD'), moment(myUtil.date.getQZDateBeforeCurr(1).lastDay, 'YYYY-MM-DD')] });
    }
  }
  // 数据下载
  const downloadSj = () => {
    form.validateFields().then(values => {
      const sjgjsjDm = values.sjgjsjDm;
      const xzfs = values.xzfs;
      if (sjgjsjDm.length <= 0) {
        sjgjsjDm.push('010301')
      }
      // 保存口岸卡密码
      saveKakPassword({ kakmm: values.kakmm, uuid: values.uuid }).then(async (res) => {
        const { body, code } = res;
        setMasker(false);
        if (code === '200') {
          setMasker(true);
          const { jcbz, msg } = await khdgjUtil.khdgjJc({ icCardPsw: body.kakmm, yhjq: body.yhjq });
          setMasker(false);
          if (jcbz == 'Y') {
            setMasker(true);
            const promiseArr = [];
            for (let i = 0; i < sjgjsjDm.length; i++) {
              const data: any = {
                sjgjsjDm: sjgjsjDm[i],
                tjzdmc: '申请日期',
                fgcfsjbz: values.fgcfsjbz ? 'Y' : 'N',
                sftstxbz: values.sftstxbz ? 'Y' : 'N'
              };
              if (xzfs === '1') {
                data.czfDm = '01';
                data.csz1 = values.bah;
              } else {
                data.czfDm = '08';
                data.csz1 = (values.hgSxrq[0]).valueOf();
                data.csz2 = (values.hgSxrq[1]).valueOf();
              }
              promiseArr.push(hgzxrw(data));
            }
            Promise.all(promiseArr).then((res) => {
              setMasker(false);
              if (res.length > 0 && !myUtil.array.isContiner(res, 'N')) {
                DDAlert.open({
                  title: intl.formatMessage({ id: 'message_jljghx_sjxz_sjxz_title' }),
                  info: intl.formatMessage({ id: 'message_jljghx_sjxz_sjxz_info' }),
                  infoType: 'success',
                  content: [
                    intl.formatMessage({ id: 'message_jljghx_sjxz_sjxz_content' }),
                  ],
                  okText: '转进度查询',
                  okCallbackFn: function () {
                    history.push('/hts/jljg/sjxz/jdcx');
                  }
                });
              } else {
                message.error({
                  content: intl.formatMessage({ id: 'message_jljghx_sjxz_sjxz_error' }),
                });
              }
            }).catch(() => {
              message.error({
                content: intl.formatMessage({ id: 'message_jljghx_sjxz_sjxz_error' }),
              });
            }).finally(() => {
              if (masker) {
                setMasker(false);
              }
            });
          } else {
            message.info(msg);
            setMasker(false);
          }
        } else if (code === '900') {
          message.info(res.msg);
        } else {
          message.error(res.msg);
        }
      })
    });
  }

  // 创建下载任务
  const hgzxrw = async (params: any) => {
    const result = await xzrw(params);
    if (result.code === '200') {
      // 调用客户端工具任务下载接口
      return khdgjUtil.khdgjGdxz(result.body);
    } else {
      return 'N';
    }
  }

  //时间选取
  const handleSelectTime = (values: any, formatString: [string, string]) => {
    if (formatString[0] === myUtil.date.getQZDateBeforeCurr(1).firstDay && formatString[1] === myUtil.date.getQZDateBeforeCurr(1).lastDay) {
      form.setFieldsValue({ ndsj: '1' });
    } else if (formatString[0] === myUtil.date.getQZDateBeforeCurr(2).firstDay && formatString[1] === myUtil.date.getQZDateBeforeCurr(1).lastDay) {
      form.setFieldsValue({ ndsj: '2' });
    } else if (formatString[0] === myUtil.date.getQZDateBeforeCurr(3).firstDay && formatString[1] === myUtil.date.getQZDateBeforeCurr(1).lastDay) {
      form.setFieldsValue({ ndsj: '3' });
    } else {
      form.setFieldsValue({ ndsj: '' });
    }
    setValue(values);
  }

  // 最大范围选择5年
  const disabledDate = (current: any) => {
    if (!dates || dates.length === 0) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'years') > 4;
    const tooEarly = dates[1] && dates[1].diff(current, 'years') > 4;
    return tooEarly || tooLate;
  };

  const onOpenChange = (open: any) => {
    if (open) {
      setHackValue([]);
      setValue([]);
      setDates([]);
      // form.setFieldsValue({ hgSxrq: [] });
    } else {
      setHackValue(undefined);
    }
  }

  const defaultRangeData = async () => {
    return [moment(myUtil.date.getQZDateBeforeCurr(1).firstDay, 'YYYY-MM-DD'), moment(myUtil.date.getQZDateBeforeCurr(1).lastDay, 'YYYY-MM-DD')];
  }
  // 驱动下载
  const downloadQd = async () => {
    setMasker(true)
    let a=document.createElement('a') ;//创建一个a标签元素
    a.style.display='none'  ;//设置元素不可见
    a.href='https://dditpublic.oss-cn-beijing.aliyuncs.com/SAASTOOLS_UPGRADE/SAASTOOLS2023_20230908/%E5%AE%A2%E6%88%B7%E7%AB%AF%E5%B7%A5%E5%85%B7.zip'; //设置下载地址
    document.body.appendChild(a)  ;//加入
    a.click(); //触发点击,下载
    document.body.removeChild(a) ;//释放 
    setMasker(false)
  }

  const initKakmm = async (params: any) => {
    const result = await queryKakPassword(params);
    const { code, body } = result;
    if (code === '200') {
      form.setFieldsValue(body);
    }
  }

  // 查询二维码
  const initEwm = async (params: any) => {
    const result = await queryEwmtp(params);
    const { code, body } = result;
    if (code === '200') {
      setImgSrc(body);
      setTxtil(<span>温馨提示：数据下载成功后将通过<br key={'1'} />“慧税云服务”微信公众号向您推送提醒</span>);
    } else if (code === '450') {
      setTxtil(<span>当前用户已绑定成功，无需再次绑定</span>);
    } else if (code === '460') {
      setTxtil(<span>云端未查询到企业注册信息，无法绑定</span>);
    }
  }

  // 表单布局
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  };

  // 表单布局
  const tailLayout = {
    wrapperCol: { offset: 5, span: 19 },
  };

  // 表单初始值
  const getInitialValues = () => {
    return {
      xzfs: "2",
      bah: "",
      sjgjsjDm: ['010301', '010401'],
      hgSxrq: defaultRangeData(),
      fgcfsjbz: false,
      sftstxbz: false,
      ndsj: "1"
    };
  }

  const handlerXzfsChange = (e: any) => {
    if (e.target.value === '1') {
      setBgdsxbz(false);
      setRqsxbz(true);
      form.setFieldsValue({ sjgjsjDm: [], ndsj: '0', hgSxrq: [] });
    } else {
      setBgdsxbz(true);
      setRqsxbz(false);
      form.setFieldsValue({ bah: '', sjgjsjDm: ['010301', '010401'], ndsj: "1", hgSxrq: defaultRangeData(), });
    }
  }

  useEffect(() => {
    const promiseArr: any = [];
    promiseArr.push(initKakmm({}));
    // promiseArr.push(initEwm({}));
    setMasker(true);
    Promise.all(promiseArr).then().catch(() => {
    }).finally(() => {
      setMasker(false);
    });
  }, []);

  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <ProCard split="horizontal" className="dd_layout_form_01 dd_hgsjxzjy" >
        <ProCard style={{ height: myUtil.heightCalc.getCalc(['header', 'headerTab', 'cardMargin', 'footerBtn']), overflowY: 'auto' }}>
          <Form {...layout} form={form} initialValues={getInitialValues()} >
            <Form.Item className="form-item" name="yhjq" style={{ display: 'none' }}>
              <Input type="hidden" />
            </Form.Item>
            <Form.Item name="uuid" style={{ display: 'none' }}>
              <Input type="hidden" />
            </Form.Item>
            <div className='groupTit'>基础信息</div>
            <Form.Item label="口岸卡密码">
              <Space>
                <Form.Item name="kakmm" noStyle rules={[{ required: true, message: '请录入口岸卡密码！' }]} >
                  <Input.Password placeholder="口岸卡密码" style={{ width: 285 }} maxLength={8} />
                </Form.Item>
                <Tooltip title="电子口岸卡密码">
                  <QuestionCircleOutlined />
                </Tooltip>
                <Button onClick={() => downloadQd()} type='link' style={{ marginLeft: 8 }}>驱动下载</Button>
              </Space>
            </Form.Item>
            <div className='groupTit'>数据下载</div>
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
                    ]}>
                      <Checkbox.Group key={'sjxzSjgjsjDm'} options={checkPptions} disabled={rqsxbz} />
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
                    ]}>
                      <RangePicker value={hackValue || value} style={{ width: 260 }}
                        onChange={handleSelectTime}
                        // onCalendarChange={val => setDates(val)}
                        // disabledDate={disabledDate}
                        allowClear={false}
                        // onOpenChange={onOpenChange}
                        format={myUtil.date.formatList()}
                        disabled={rqsxbz}
                      />
                    </Form.Item>
                    <Form.Item name='ndsj'>
                      <Radio.Group onChange={handlerHgSxrqChange} disabled={rqsxbz}>
                        {itemList2.map((item) => (
                          <Radio key={item.value} value={item.value}>{item.name}</Radio>
                        ))}
                      </Radio.Group>
                    </Form.Item>
                  </Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
            {/* <Form.Item name='fgcfsjbz' valuePropName="checked" {...tailLayout}>
              <Checkbox key={'sjxzSffg'} defaultChecked={false}>覆盖重复数据</Checkbox>
            </Form.Item>
            <Form.Item name='sftstxbz' valuePropName="checked" {...tailLayout}>
              <Checkbox key={'sjxzTstx'} defaultChecked={false}>是否推送提醒
                <Popover placement="right" content={<>
                  <Image
                    width={245}
                    src={imgSrc}
                    preview={false}
                    fallback="data:image/png;base64,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"
                  />
                </>} title={txtil}> <QuestionCircleOutlined />
                </Popover>
              </Checkbox>
            </Form.Item> */}
          </Form>
        </ProCard>
        <ProCard className="ddlf01_footer">
          <Space>
            {/* <Button type='primary' htmlType="submit" onClick={hjjc}>环境检测</Button> */}
            <Button type='primary' onClick={() => { downloadSj() }}>数据下载</Button>
          </Space>
        </ProCard>
      </ProCard>
    </Spin>
  );
};

export default Hgsjxzjy;
