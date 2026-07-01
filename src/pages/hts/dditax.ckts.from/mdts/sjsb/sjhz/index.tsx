/**
 * title: 数据汇总
 * author: wxl
 */
import React, { useState, useEffect } from 'react';
import './sjhzStyle.less';
import { Spin, Button, message, Space, Input, Form, Select, Modal, InputNumber } from 'antd';
import { querySjhzSsqList, querySjhzcxData, deleteHzsjcxData, saveHzsjcxData, querySchzbCscs, mdtJcSjhfx, mdtSchzb } from '@/pages/hts/services/htsApi';
import ProCard from '@ant-design/pro-card';
import myUtil from '@/components/DDAssist/util';
import DDAlert from '@/pages/hts/components/DDAlert';
import CONSTANTS from '@/components/DDAssist/constants';
import DDBaseGrid from '@/components/DDBaseGrid';
import { useIntl } from 'umi';

const Index: React.FC<unknown> = () => {
  const [loading, setLoading] = useState(false);
  const [masker, setMasker] = useState(false);
  // 所属期列表
  const [ssqList, setSsqList] = useState([{ ssq: '', ytse1: 0, mdse: 0 }]);
  // 当前选择的所属期
  const [dqSsq, setDqSsq] = useState<String>('');
  // 所属期
  const [formSearch] = Form.useForm();
  // 表
  const [formData] = Form.useForm();
  // 弹窗
  const [formSchz] = Form.useForm();
  // 是否可修改
  const [changeEdid, setChangeEdit] = useState(true);
  // 数据检查异常疑点列表数据
  const [ycydList, setYcydList] = useState<any>([]);
  // 查询出来的原始数据
  const [oldData, setOldData] = useState<any>([]);
  // 数据检查异常疑点列表数据关闭打开
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  // 继续按钮显示隐藏
  const [continueBtn, setContinueBtn] = useState<boolean>(true);
  // 条件
  const [tjValues, setTjValues] = useState<any>({});
  // 设置千分位
  const inputProps = {};
  const intl = useIntl();
  inputProps.formatter = (value: any, info: any) => {
    if (info.userTyping) {
      if (info.input) {
        return info.input;
      } else {
        if (value) {// 部分浏览器会出现第一次输入info.userTyping为true但info.input中无值，若直接取value会造成光标直接移到最右面小数点后
          return value?.split('.')[0];
        }
        return '';
      }
    } else {
      if (value) {
        return myUtil.text.formatNum(value, '0,0.00');
      }
      return '';
    }
  }
  inputProps.parser = (value: any) => {
    return value.replace(/\$\s?|(,*)/g, '');
  }

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    showModelForm();  // 弹窗表单
    queryJljgtjcxSsq('first'); // 所属期列表
    setLoading(false);
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  // 显示弹窗
  const showModelForm = () => {
    setMasker(true);
    querySchzbCscs({}).then((res: any) => {
      setMasker(false);
      if (res.code == '200') {
        formSchz.setFieldsValue(res.body)
        DDAlert.open({
          title: '生成汇总',
          infoType: 'warning',
          modalType: 'form',
          closeStatus: false,
          content: <>
            <Form name="schz" form={formSchz} labelCol={{ span: 7 }} wrapperCol={{ span: 14 }} autoComplete="off" >
              <Form.Item label="所属期：" name="ssq" rules={[{ pattern: /^[1-9]\d{3}(0[1-9]|1[0-2])$/, message: '请输入正确的年月格式yyyyMM！' }]} >
                <Input />
              </Form.Item>
              <Form.Item label="不得抵扣累加：" name="mdtsbfbddkdjxsehj" rules={[{ pattern: /^(-)?\d+(\.\d+)?$/, message: '该项只能填写数字！' }]} >
                <InputNumber {...inputProps} />
              </Form.Item>
              <Form.Item label="期末留抵税额：" name="zzsnssbbqmldse" rules={[{ pattern: /^(-)?\d+(\.\d+)?$/, message: '该项只能填写数字！' }]} >
                <InputNumber {...inputProps} />
              </Form.Item>
            </Form>
          </>,
          okCallbackFn: (thisObj: any) => {
            thisObj.setState({ masker: true });
            formSchz.validateFields().then(values => {
              setTjValues(values);
              mdtJcSjhfx(values).then((res: any) => {
                DDAlert.close();
                if (res.code == '900') {
                  setModalVisible(true);
                  setYcydList(res.body)
                  const arr = res.body;
                  for (var i = 0; i < arr.length; i++) {
                    if (arr[i].sfkhlyd == 'N') {
                      setContinueBtn(false);
                      break;
                    } else {
                      setContinueBtn(true);
                    }
                  }
                } else if (res.code == '200') {
                  mdtSchzb(values).then((resHz: any) => {
                    if(resHz.code === '200') {
                      message.success('生成免抵退汇总成功！')
                      queryJljgtjcxSsq(values.ssq); // 所属期列表
                    } else {
                      message.error(resHz.msg)
                    }
                  })
                } else {
                  message.error(intl.formatMessage({ id: 'message_query_error' }))
                }
              })
            })
          }
        });
      } else {
        message.error(intl.formatMessage({ id: 'message_query_error' }))
      }
    })
  };

  // 列表内容格式化: 是否可忽略
  const renderColumnSfkhlyd = (text: any) => {
    if (text === 'N') {
      return <span>否</span>
    } else if (text === 'Y') {
      return <span>是</span>
    }
    return '';
  }

  // 配置项： 数据检查异常疑点列表
  const myColumns = [
    { title: '所属期', dataIndex: 'ssq', width: 70 },
    { title: '申报序号', dataIndex: 'sbxh', width: 80 },
    { title: '业务表名', dataIndex: 'bzdsmc', width: 300, ellipsis: true },
    { title: '是否可忽略', dataIndex: 'sfkhlyd', width: 100, render: renderColumnSfkhlyd },
    { title: '疑点描述 ', dataIndex: 'ydsm', ellipsis: true },
  ];

  // 表数据
  const getSjhzcxData = (value: any) => {
    if(value) {
      setMasker(true);
      const obj = { ssq: value }
      querySjhzcxData(obj).then((res: any) => {
        setMasker(false);
        if (res.code == '200') {
          formData.setFieldsValue(res.body);
          setOldData(res.body)
        }
      })
    } else {
      formData.resetFields();
      setOldData({})
    }
  }

  // 获得所属期列表
  const queryJljgtjcxSsq = (ssqFlag: any) => {
    setMasker(true);
    querySjhzSsqList({}).then((res: any) => {
      setMasker(false);
      if (res.code == '200') {
        setSsqList(res.body || []);
        let ssqValue = '';
        if(res.body&& res.body.length > 0) {
          ssqValue = ssqFlag === 'first' ? res.body[0].ssq : ssqFlag;
        } else {
          ssqValue = ''
        }
        formSearch.setFieldsValue({ ssq: ssqValue });
        setChangeEdit(true)
        getSjhzcxData(ssqValue);
        setDqSsq(ssqValue);
      }
    })
  };

  // 改变所属期
  const changeSsq = (value: any) => {
    setDqSsq(value);
    setChangeEdit(true);  // 变为不可修改
    getSjhzcxData(value);
  }

  // 保存（有问题）
  const handleSave = () => {
    const obj = formData.getFieldsValue();
    if(obj.bdmzdkseynsbce){
      // obj.bdmzdkseynsbce = obj?.bdmzdkseynsbce.replace(',','');
    }
    obj.ssq = formSearch.getFieldValue('ssq');
    saveHzsjcxData(obj).then((res: any) => {
      if (res.code == '200') {
        message.success(intl.formatMessage({ id: 'message_edit_success' }));
        setChangeEdit(true);
        getSjhzcxData(dqSsq)
      } else {
        message.error(res.msg);
      }
    })
  }

  // 删除当前显示页面的数据
  const deleteHzData = () => {
    DDAlert.open({
      title: '删除',
      info: '确定要删除选择的数据吗？',
      infoType: 'warning',
      modalType: 'confirm',
      okCallbackFn: () => {
        setMasker(true);
        const obj = formData.getFieldsValue();
        obj.ssq = formSearch.getFieldValue('ssq');
        deleteHzsjcxData(obj).then((res: any) => {
          setMasker(false);
          if (res.code == '200') {
            message.success(intl.formatMessage({ id: 'message_delete_success' }));
            queryJljgtjcxSsq('first'); // 所属期列表
          } else {
            message.error(intl.formatMessage({ id: 'message_delete_error' }));
          }
        })
      }
    })
  }

  // 计算
  // 纳税表不得抵扣累加
  const changeNsb = (value: number) => {
    const bgh = value;
    const bgq = oldData.mdtsbfbddkdjxsehj;
    const oldbnlj = oldData.bdmzdkseynsbce;
    getbnlj(bgh, bgq, oldbnlj, 'bdmzdkseynsbce');
  };

  const getbnlj = (bgq: any, bgh: any, oldbnlj: any, bnlj: any) => {
    // formData.setFieldsValue({ [bnlj]: myUtil.text.formatNum(oldbnlj + (bgh - bgq), '0,0.00') })
    formData.setFieldsValue({ [bnlj]: oldbnlj + (bgh - bgq) })
  }

  // 增值税纳税申报表期末留抵税额17
  const changeZzs = (value: any) => {
    ytse1Change(value);
  };
  // 应退税额18(如15&gt;017则为17,否则为15)
  const ytse1Change = (value: any) => {
    const mdtsehj = formData.getFieldValue('mdtsehj');
    const zzsnssbbqmldse = value;
    let ytse1 = null;
    if (mdtsehj > zzsnssbbqmldse) {
      ytse1 = zzsnssbbqmldse;
    } else {
      ytse1 = mdtsehj;
    }
    const bgh = ytse1;
    const bgq = oldData.ytse1;
    const oldbnlj = oldData.bnljytse;
    getbnlj(bgq, bgh, oldbnlj, 'bnljytse');
    // formData.setFieldsValue({ ytse1: myUtil.text.formatNum(bgh, '0,0.00') })
    formData.setFieldsValue({ ytse1: bgh})
    mdseChange();
  }
  // 应退税额19=15-18
  const mdseChange = () => {
    const mdtsehj = formData.getFieldValue('mdtsehj');
    const ytse1 = formData.getFieldValue('ytse1');
    const bgh = mdtsehj - ytse1;
    const bgq = oldData.mdse;
    const oldbnlj = oldData.bnljmdse;
    getbnlj(bgq, bgh, oldbnlj, 'bnljmdse');
    formData.setFieldsValue({ mdse: bgh})
  }

  // 继续按钮
  const handleContinue = () => {
    if(tjValues && tjValues.ssq) {
      mdtSchzb(tjValues).then((resHz: any) => {
        if(resHz.code === '200') {
          message.success('生成免抵退汇总成功！')
          queryJljgtjcxSsq(tjValues.ssq); // 所属期列表
          setModalVisible(false)
        } else {
          message.error(resHz.msg)
        }
      })
    }
  }

  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <ProCard split="horizontal" className="dd_layout_form_01">
        <ProCard style={{ height: myUtil.heightCalc.getCalc(['header', 'cardMargin', 'footerBtn', 'gridHeader',  '30px']), overflowY: 'auto' }}>
          <div className="print-form-hzb-wrap">
            <div className="pfhw-header">
              <Form layout="inline" form={formSearch} style={{ marginBottom: '15px' }} >
                <Form.Item name="ssq" label="所属期：">
                  <Select
                    style={{ width: '120px' }}
                    optionLabelProp="label"
                    onChange={changeSsq}
                    dropdownClassName="hzSelect-drop-down"
                  >
                    <>
                      <Select.Option disabled value="">
                        <div style={{ width: '60px', display: 'inline-block', textAlign: 'center' }}>所属期</div>
                        <div style={{ width: '140px', display: 'inline-block', textAlign: 'right' }}>应退税额</div>
                        <div style={{ width: '140px', display: 'inline-block', textAlign: 'right' }}>免抵税额</div>
                      </Select.Option>
                      {
                        ssqList.map(item => (
                          <Select.Option key={item.ssq} label={item.ssq} value={item.ssq}>
                            <div style={{ width: '60px', display: 'inline-block' }}>{item.ssq}</div>
                            <div style={{ width: '140px', display: 'inline-block', textAlign: 'right' }}>{myUtil.grid.formatNum(item.ytse1, '0,0.00')}</div>
                            <div style={{ width: '140px', display: 'inline-block', textAlign: 'right' }}>{myUtil.grid.formatNum(item.mdse, '0,0.00')}</div>
                          </Select.Option>
                        ))
                      }
                    </>
                  </Select>
                </Form.Item >
              </Form>
              <div className="pfhw-header-r">
                金额单位：元（列至角分）
              </div>
            </div>
            <Form form={formData}>
              <table className="print-table print-table-hzb">
                <tr>
                  <th colSpan={2} rowSpan={2} className="label text-center">
                    项目
                    <Form.Item className="form-item" name="uuid" style={{display: 'none'}}>
                      <Input type="hidden" />
                    </Form.Item>
                  </th>
                  <th colSpan={2} rowSpan={2} className="label text-center">栏次</th>
                  <th className="label text-center" style={{ width: '150px' }}>当期</th>
                  <th className="label text-center" style={{ width: '150px' }}>本年累计</th>
                  <th className="label text-center" style={{ width: '175px' }}>与增值税纳税申报表差额</th>
                </tr>
                <tr>
                  <th className="label text-center">(a)</th>
                  <th className="label text-center">(b)</th>
                  <th className="label text-center">(c)</th>
                </tr>
                <tr>
                  <td rowSpan={4} className="label-v text-center" width="40px">出口销售额</td>
                  <td className="label" width="270px">免抵退税出口销售额(美元)</td>
                  <td colSpan={2} className="label text-center">1=2+3</td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="ckxsemy">
                      <InputNumber {...inputProps} disabled />
                    </Form.Item>
                  </td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="bnljmdtckxsemy">
                      <InputNumber {...inputProps} disabled />
                    </Form.Item>
                  </td>
                  <td className="label text-center">— —</td>
                </tr>
                <tr>
                  <td className="label">其中：出口货物及修理修配服务销售额(美元)</td>
                  <td colSpan={2} className="label text-center">2</td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="ckhwxsemy">
                      <InputNumber {...inputProps} disabled lay-verify="number162" />
                    </Form.Item>
                  </td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="bnljckhwxsemy">
                      <InputNumber {...inputProps} max={999999999999.99} disabled />
                    </Form.Item>
                  </td>
                  <td className="label text-center">— —</td>
                </tr>
                <tr>
                  <td className="label" style={{ paddingLeft: '54px' }}>跨境销售服务及无形资产销售额(美元)</td>
                  <td colSpan={2} className="label text-center">3</td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="ysfwxsemy">
                      <InputNumber {...inputProps} max={999999999999.99} disabled />
                    </Form.Item>
                  </td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="bnljysfwxsemy">
                      <InputNumber {...inputProps} max={999999999999.99} disabled />
                    </Form.Item>
                  </td>
                  <td className="label text-center">— —</td>
                </tr>
                <tr>
                  <td className="label">免抵退税出口销售额（人民币）</td>
                  <td colSpan={2} className="label text-center">4</td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="ckxsermb">
                      <InputNumber {...inputProps} max={999999999999.99} disabled />
                    </Form.Item>
                  </td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="bnljmdtckxsermb">
                      <InputNumber {...inputProps} max={999999999999.99} disabled />
                    </Form.Item>
                  </td>
                  <td className="label text-center">— —</td>
                </tr>
                <tr>
                  <td rowSpan={6} className="label-v text-center">不得免征和抵扣税额</td>
                  <td className="label">免抵退税不得免征和抵扣税额</td>
                  <td colSpan={2} className="label text-center">5=6+7</td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="mdtsbdmzhdkse">
                      <InputNumber {...inputProps} bordered={false} max={999999999999.99} disabled />
                    </Form.Item>
                  </td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="bnljmdtsbdmzhdkse">
                      <InputNumber {...inputProps} bordered={false} max={999999999999.99} disabled />
                    </Form.Item>
                  </td>
                  <td className="label text-center">— —</td>
                </tr>
                <tr>
                  <td className="label">其中：出口货物及修理修配服务不得免征和抵扣税额</td>
                  <td colSpan={2} className="label text-center">6</td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="ckhwbdmzhdkse">
                      <InputNumber {...inputProps} bordered={false} max={999999999999.99} disabled />
                    </Form.Item>
                  </td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="bnljckhwbdmzhdkse">
                      <InputNumber {...inputProps} bordered={false} max={999999999999.99} disabled />
                    </Form.Item>
                  </td>
                  <td className="label text-center">— —</td>
                </tr>
                <tr>
                  <td className="label" style={{ paddingLeft: '54px' }}>跨境销售服务及无形资产不得免征和抵扣税额</td>
                  <td colSpan={2} className="label text-center">7</td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="ysfwbdmzhdkse">
                      <InputNumber {...inputProps} bordered={false} max={999999999999.99} disabled />
                    </Form.Item>
                  </td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="bnljysfwbdmzhdkse">
                      <InputNumber {...inputProps} bordered={false} max={999999999999.99} disabled />
                    </Form.Item>
                  </td>
                  <td className="label text-center">— —</td>
                </tr>
                <tr>
                  <td className="label">进料加工核销应调整不得免征和抵扣税额</td>
                  <td colSpan={2} className="label text-center">8</td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="jljghxytzbdmzhdkse">
                      <InputNumber {...inputProps} bordered={false} max={999999999999.99} disabled />
                    </Form.Item>
                  </td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="bnljjljghxytzbdmzhdkse">
                      <InputNumber {...inputProps} bordered={false} max={999999999999.99} disabled />
                    </Form.Item>
                  </td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="ytzbdmzhdkseyzzsnssbbce">
                      <InputNumber {...inputProps} bordered={false} max={999999999999.99} disabled />
                    </Form.Item>
                  </td>
                </tr>
                <tr>
                  <td className="label">纳税表不得抵扣累加</td>
                  <td colSpan={2} className="label text-center"></td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="mdtsbfbddkdjxsehj">
                      <InputNumber {...inputProps} max={999999999999.99} disabled={changeEdid} onChange={changeNsb} />
                    </Form.Item>
                  </td>
                  <td className="label text-center">— —</td>
                  <td className="label text-center">— —</td>
                </tr>
                <tr>
                  <td className="label">免抵退税不得免征和抵扣税额合计</td>
                  <td colSpan={2} className="label text-center">9=5+8</td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="mdtsbdmzhdksehj">
                      <InputNumber {...inputProps} bordered={false} max={999999999999.99} disabled />
                    </Form.Item>
                  </td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="bnljmdtsbdmzhdksehj">
                      <InputNumber {...inputProps} max={999999999999.99} disabled />
                    </Form.Item>
                  </td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="bdmzdkseynsbce" >
                      <InputNumber {...inputProps} bordered={false} max={999999999999.99} disabled={changeEdid} />
                    </Form.Item>
                  </td>
                </tr>
                <tr>
                  <td rowSpan={10} className="label-v text-center">应退税额和免抵税额</td>
                  <td className="label">免抵退税额</td>
                  <td colSpan={2} className="label text-center">10=11+12</td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="mdtse" >
                      <InputNumber {...inputProps} max={999999999999.99} disabled />
                    </Form.Item>
                  </td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="bnljmdtse" >
                      <InputNumber {...inputProps} max={999999999999.99} disabled />
                    </Form.Item>
                  </td>
                  <td className="label text-center">— —</td>
                </tr>
                <tr>
                  <td className="label">其中：出口货物及修理修配服务免抵退税额</td>
                  <td colSpan={2} className="label text-center">11</td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="ckhwmdtse" >
                      <InputNumber {...inputProps} max={999999999999.99} disabled />
                    </Form.Item>
                  </td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="bnljckhwmdtse">
                      <InputNumber {...inputProps} max={999999999999.99} disabled />
                    </Form.Item>
                  </td>
                  <td className="label text-center">— —</td>
                </tr>
                <tr>
                  <td className="label" style={{ paddingLeft: '54px' }}>跨境销售服务及无形资产免抵退税额</td>
                  <td colSpan={2} className="label text-center">12</td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="ysfwmdtse">
                      <InputNumber {...inputProps} max={999999999999.99} disabled />
                    </Form.Item>
                  </td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="bnljysfwmdtse" >
                      <InputNumber {...inputProps} max={999999999999.99} disabled />
                    </Form.Item>
                  </td>
                  <td className="label text-center">— —</td>
                </tr>
                <tr>
                  <td className="label">上期结转需冲减的免抵退税额</td>
                  <td colSpan={2} className="label text-center">13</td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="sqjzmdtse" >
                      <InputNumber {...inputProps} max={999999999999.99} disabled />
                    </Form.Item>
                  </td>
                  <td className="label text-center">— —</td>
                  <td className="label text-center">— —</td>
                </tr>
                <tr>
                  <td className="label">进料加工核销应调整免抵退税额</td>
                  <td colSpan={2} className="label text-center">14</td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="jljghxytzmdtse" >
                      <InputNumber {...inputProps} max={999999999999.99} disabled />
                    </Form.Item>
                  </td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="bnljjljghxytzmdtse">
                      <InputNumber {...inputProps} max={999999999999.99} disabled />
                    </Form.Item>
                  </td>
                  <td className="label text-center">— —</td>
                </tr>
                <tr>
                  <td className="label">免抵退税额合计</td>
                  <td colSpan={2} className="label text-center">15（如10-13+14&gt;0则为10-13+14,否则为0）</td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="mdtsehj">
                      <InputNumber {...inputProps} max={999999999999.99} disabled />
                    </Form.Item>
                  </td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="bnljmdtsehj">
                      <InputNumber {...inputProps} max={999999999999.99} disabled />
                    </Form.Item>
                  </td>
                  <td className="label text-center">— —</td>
                </tr>
                <tr>
                  <td className="label">结转下期需冲减的免抵退税额</td>
                  <td colSpan={2} className="label text-center">16=13-10-14+15</td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="jzxqmdtse">
                      <InputNumber {...inputProps} max={999999999999.99} disabled />
                    </Form.Item>
                  </td>
                  <td className="label text-center">— —</td>
                  <td className="label text-center">— —</td>
                </tr>
                <tr>
                  <td className="label">增值税纳税申报表期末留抵税额</td>
                  <td colSpan={2} className="label text-center">17</td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="zzsnssbbqmldse" >
                      <InputNumber {...inputProps} bordered={false} max={999999999999.99} disabled={changeEdid} onChange={changeZzs} />
                    </Form.Item>
                  </td>
                  <td className="label text-center">— —</td>
                  <td className="label text-center">— —</td>
                </tr>
                <tr>
                  <td className="label">应退税额</td>
                  <td colSpan={2} className="label text-center">18（如15&gt;017则为17，否则为15）</td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="ytse1">
                      <InputNumber {...inputProps} max={999999999999.99} disabled />
                    </Form.Item>
                  </td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="bnljytse">
                      <InputNumber {...inputProps} max={999999999999.99} disabled />
                    </Form.Item>
                  </td>
                  <td className="label text-center">— —</td>
                </tr>
                <tr>
                  <td className="label">免抵税额</td>
                  <td colSpan={2} className="label text-center">19=15-18</td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="mdse">
                      <InputNumber {...inputProps} max={999999999999.99} disabled />
                    </Form.Item>
                  </td>
                  <td className="Input-wrap">
                    <Form.Item className="form-item" name="bnljmdse">
                      <InputNumber {...inputProps} max={999999999999.99} disabled />
                    </Form.Item>
                  </td>
                  <td className="label text-center">— —</td>
                </tr>
                <tr>
                  <td className="label-v" style={{ borderBottom: '0px', textAlign: 'center' }} colSpan={7}>
                    声明:此表是根据国家税收法律法规及相关规定填写的，本人（单位）对填报内容（及附带资料）的真实性、可靠性、完整性负责。
                  </td>
                </tr>
                <tr>
                  <td className="label" style={{ borderTop: '0px', textAlign: 'right' }} colSpan={7}>纳税人（签章）：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日</td>
                </tr>
                <tr>
                  <td className="label" style={{ borderBottom: '0px' }} colSpan={4}>
                    经办人：
                  </td>
                  <td className="label" style={{ borderBottom: '0px' }} colSpan={3}>
                    受理人：
                  </td>
                </tr>
                <tr>
                  <td className="label" style={{ borderBottom: '0px', borderTop: '0px' }} colSpan={4}>
                    经办人身份证号码：
                  </td>
                  <td className="label" style={{ borderBottom: '0px', borderTop: '0px' }} colSpan={3}>
                    受理税务机关（章）：
                  </td>
                </tr>
                <tr>
                  <td className="label" style={{ borderBottom: '0px', borderTop: '0px' }} colSpan={4}>
                    代理机构签章：
                  </td>
                  <td className="label" style={{ borderBottom: '0px', borderTop: '0px' }} colSpan={3}>
                    受理日期：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日
                  </td>
                </tr>
                <tr>
                  <td className="label" style={{ borderTop: '0px' }} colSpan={4}>
                    代理机构统一社会信用代码：
                  </td>
                  <td className="label" style={{ borderTop: '0px' }} colSpan={3}>
                  </td>
                </tr>
              </table>
            </Form>
          </div>
        </ProCard>
        <ProCard className="ddlf01_footer">
          <Space>
            <Button type="primary" onClick={showModelForm}>重新生成汇总表</Button>
            {changeEdid ? <Button onClick={() => setChangeEdit(false)}>修改</Button> : <Button onClick={() => { setChangeEdit(true); getSjhzcxData(dqSsq) }}>取消修改</Button>}
            {changeEdid ? <Button disabled>保存</Button> : <Button type="primary" onClick={() => { handleSave() }}>保存</Button>}
            <Button onClick={deleteHzData}>删除</Button>
          </Space>
        </ProCard>
      </ProCard>
      <Modal
        title="数据检查异常疑点列表"
        destroyOnHidden={true}
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X4}
        wrapClassName="standard-modal-1"
        footer={
          <>
            {continueBtn?<Button onClick={handleContinue}type="primary">继续</Button>:<></>}
            <Button onClick={() => setModalVisible(false)}>关闭</Button>
          </>
        }
        onCancel={() => setModalVisible(false)}
        mask={{ closable: false }}
      >
        <DDBaseGrid
          userDataSource={ycydList}
          components={true}
          columns={myColumns}
          pagination={false}
          scroll={{ x: '0px' }}

        />
      </Modal >
    </Spin>
  )
};

export default Index;
