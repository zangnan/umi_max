/**
 * title: 退税汇率管理
 */
import React, { useState, useEffect } from 'react';
import { Form, Button, Select, DatePicker, Spin, message, InputNumber, Input, Radio } from 'antd';
import { itemType } from '@/components/DDForm/data.d';
import DDBaseForm from '@/components/DDForm/DDBaseForm';
import { tshlglcx, tshlglwh, tshlxqgzcx, tshlxqgzwh } from '@/services/hts/api';
import ProCard from '@ant-design/pro-card';
import '../style.less';
import myUtil from '@/pages/common/myUtil';
import moment from 'moment';
import { useIntl } from 'umi';
import DDAlert from '@/components/DDAlert';
import DDAlert2 from '@/components/DDAlert';
import baseValidator from '@/pages/common/field/baseValidator';


const Index: React.FC<{ data: any }> = ({
  data
}) => {
  const [loading, setLoading] = useState(false);
  const [bzOptions, setbzOptions] = useState<any>([]); // 币种下拉
  const [formDayItem, setformItemDay] = useState([]);
  const [formDay] = Form.useForm(); // 每日汇率的表单
  const [formSearch] = Form.useForm();
  const [masker, setMasker] = useState(false);

  const [yhlDisabled, setYhlDisabled] = useState<boolean>(false); // 月汇率文本框选择出口日期时不可编辑
  const [oldHlData, setOldHlData] = useState<any>([]); // 查询时返回的汇率数据，方便保存时能够比较出修改的数据
  const intl = useIntl(); // 提示信息
  const [hlgzData, sethlgzData] = useState({});
  const [fphlxqgzmc, setfphlxqgzmc] = useState("");
  const [gzOptions, setgzOptions] = useState<any>([]); // 汇率规则下拉
  const [hllyDm, setHllyDm] = useState<any>('');

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const promise: any = [];
    promise.push(myUtil.code.getCodeFromServerT1('code_dm_gy_hb', '02'));
    promise.push(myUtil.code.getCodeFromServerT1('DM_ZXSB_FPHLXQGZ', '01'));
    Promise.all(promise).then(() => {
    }).catch(() => {
      message.error('获取码表失败');
    }).finally(() => {
      setbzOptions(myUtil.code.getCode('code_dm_gy_hb', '02'));
      setgzOptions(myUtil.code.getCode('DM_ZXSB_FPHLXQGZ', '01'));
      getHlgzData();
    });     // 获取币制列表

    formSearch.setFieldsValue({ hlny: moment(), hbzmDm: 'USD' })
    setLoading(false);
  };

  useEffect(() => {
    loadMoreData();
  }, [data]);

  useEffect(() => {
    const time = myUtil.date.getMonthFirstDay(new Date(myUtil.date.getDateBeforeCurr(0)).valueOf());
    const initData = { hlny: time, hbzmDm: 'USD' };
    getDayList(initData);
  }, [hlgzData]);


  // 获得汇率规则
  const getHlgzData = () => {
    tshlxqgzcx({}).then((res: any) => {
      const { code, body, desc } = res;
      if (code == '200') {
        const name = body.hllyDm == '01' ? '外汇管理局' : '中国银行';
        setHllyDm(body.hllyDm);
        if (body?.fphlxqgzDm) {
          sethlgzData({ fphlxqgzDm: body?.fphlxqgzDm, uuid: body?.uuid })
          setfphlxqgzmc(name + "  " + myUtil.code.getCodeValByKey(body?.fphlxqgzDm, 'DM_ZXSB_FPHLXQGZ', '01'))
        } else {
          sethlgzData({ fphlxqgzDm: '11', uuid: '' })
          setfphlxqgzmc(name + "  " + myUtil.code.getCodeValByKey('11', 'DM_ZXSB_FPHLXQGZ', '01'));
        }
      } else {
        message.error(desc);
      }
    })
  }

  const saveGx = (obj: any, gxbz: any) => {
    DDAlert2.close();
    // 保存汇率规则
    setMasker(true);
    obj.gxbz = gxbz;
    tshlxqgzwh(obj).then((res: any) => {
      const { code, desc } = res;
      setMasker(false);
      if (code == '200') {
        DDAlert2.close();
        message.success('汇率规则保存成功！');
        getHlgzData(); // 刷新汇率规则
        hlbzChange(); // 刷新汇率
      } else {
        message.error(desc);
      }
    })
  }


  const open = (obj: any) => {
    DDAlert2.open({
      title: '提示信息',
      infoType: 'warning',
      modalType: 'confirm',
      okText: '更新',
      info: `是否同步更新系统中未使用或部分使用的报关单数据？`,
      closeStatus: false,
      content: '',
      button: [
        <Button key='close' onClick={() => saveGx(obj, 'N')}>不更新</Button>,
      ],
      okCallbackFn: function (thisObj: any) {
        saveGx(obj, 'Y');
      }
    })
  }


  const open2 = () => {
    let formValue = formSearch.getFieldsValue();
    const hlny = formValue.hlny;
    if (hlny) {
      const fphlxqgzDm = hlgzData?.fphlxqgzDm ? hlgzData?.fphlxqgzDm : '11';
      if (!formValue.yhl && fphlxqgzDm != '11') {
        message.info('月汇率不能为0！');
        return
      }
      const tmp: any = hlny ? hlny.valueOf() : (new Date()).valueOf();
      formValue.hlny = moment(myUtil.date.getMonthFirstDay(tmp)).format('yyyyMM');
      // 获取所有表单数据
      const formDayValuse = formDay.getFieldsValue();
      // 获取对象的key值 也就是时间戳
      const keys = Object.keys(formDayValuse);
      const tzrqVoList: any = [];
      keys.map((key: any) => {
        // 比较最新时间戳和查询的是否一致，不一致放入到调整数据中
        if (oldHlData[key] != formDayValuse[key]) {
          tzrqVoList.push({ tzrq: key, rmbhl: formDayValuse[key] });
        }
      });
      if (tzrqVoList.length === 0) {
        message.info(intl.formatMessage({ id: 'message_ckfp_fppz_hlgl_save_check' }));
        return;
      }
      formValue.tzrqVoList = tzrqVoList;
      DDAlert2.open({
        title: '提示信息',
        infoType: 'warning',
        modalType: 'confirm',
        isShowcancelText: false,              // 取消按钮是否显示
        okText: '更新',
        info: `是否同步更新系统中未使用或部分使用的报关单数据？`,
        closeStatus: false,
        button: [
          <Button key='close' onClick={() => qx()}>取消</Button>,
          <Button key='close' onClick={() => saveForm(formValue, 'N')}>不更新</Button>,
        ],
        okCallbackFn: function (thisObj: any) {
          saveForm(formValue, 'Y');
        }
      })
    } else {
      message.info(intl.formatMessage({ id: 'message_ckfp_fppz_hlgl_hlny_check' }));
    }
  }


  const qx = () => {
    setMasker(false);
    DDAlert2.close();
  }

  // 打开汇率规则
  const openHlgz = () => {
    DDAlert.open({
      title: '汇率选取规则',
      infoType: 'warning',
      modalType: 'form',
      isFormContent: true,
      closeStatus: false,
      initFormContentValues: hlgzData,
      content: <>
        <Form.Item name="uuid" style={{ display: 'none' }}>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item name="hllyDm" label="汇率来源" rules={[{ required: true, message: '该项为必录' }]} initialValue={hllyDm} style={{ marginTop: '10px' }}>
          <Radio.Group style={{ marginTop: '5px' }}>
            <Radio key="hlly01" value={"01"}>外汇管理局</Radio>
            <Radio key="hlly02" value={"02"}>中国银行</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="fphlxqgzDm" label="汇率规则" rules={[{ required: true, message: '该项为必录' }]}>
          <Select placeholder="汇率规则" >
            {gzOptions.map((selectItem: any) => (
              <Select.Option key={selectItem.code} value={selectItem.code}>{selectItem.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      </>,
      cancelText: '关闭',
      okCallbackFn: function (thisObj: any) {
        DDAlert.getForms().validateFields().then((values: any) => {
          DDAlert.close();
          const obj = {
            fphlxqgzDm: values.fphlxqgzDm,
            uuid: values.uuid,
            hllyDm:values.hllyDm,
          }
          open(obj);
        });
      },
    });
  }

  // 汇率币种修改
  const hlbzChange = () => {
    const hlny = formSearch.getFieldValue('hlny');
    const tmp: any = hlny ? hlny.valueOf() : (new Date()).valueOf();
    const newHlny = myUtil.date.getMonthFirstDay(tmp);
    const hbzmDm = formSearch.getFieldValue('hbzmDm');
    getDayList({ hlny: newHlny, hbzmDm: hbzmDm });
  }

  // 保存表单数据
  const saveForm = async (formValue: any, gxbz: any) => {
    formValue.gxbz = gxbz;
    DDAlert2.close();
    setMasker(true)
    tshlglwh(formValue).then((response) => {
      const { code, desc, msg } = response;
      setMasker(false);
      if (code === '200') {
        getDayList({ hlny: formValue.hlny, hbzmDm: formValue.hbzmDm });
        message.success('保存成功！');
      } else {
        message.error(desc);
      }
    })

  }

  // 获得汇率form
  const getDayList = (obj: any) => {
    let formValue = formSearch.getFieldsValue();
    const param = {
      hbzmDm: formValue.hbzmDm,
      hlny: moment(formValue.hlny).format('yyyyMM'),
    }
    //处理保留五位小数
    const limitDecimals = (value: any) => {
      let f = parseFloat(value);
      f = Math.floor(value * 100000) / 100000;
      let s = f.toString();
      let rs = s.indexOf('.');
      // 如果是整数，加小数点
      if (rs < 0) {
        rs = s.length;
        s += '.';
      }
      if (s.length - rs != 6) {
        while (s.length <= rs + 5) {
          s += '0';
        }
      }
      return s;
    };
    let ts = 31;
    const formArry: any = [];
    setMasker(true);
    tshlglcx(param).then((res: any) => {
      const { code, body, msg } = res;
      setMasker(false);
      if (code == '200') {
        ts = body.hlglpzVo.length;
        const fphlxqgzDm = body.fphlxqgzDm ? body.fphlxqgzDm : '11';
        const hlglpzVoList = body.hlglpzVo;
        if (fphlxqgzDm === '11') {
          //  按出口日期当天汇率 月汇率为空
          formSearch.setFieldsValue({ yhl: ' ' });
          // 月汇率不可编辑
          formSearch.setFieldsValue({ yhlrq: '' });
          setYhlDisabled(true);
        } else if (fphlxqgzDm === "12") {
          // 按出口日期当月第一个工作日 取第一个关注日
          const gzrList = hlglpzVoList.filter((row: any) => row.gzrbz === 'Y');
          formSearch.setFieldsValue({ yhl: gzrList[0]?.rmbhl, yhlrq: gzrList[0]?.hlrq });
          setYhlDisabled(false);
        } else if (fphlxqgzDm === "13") {
          // 按出口日期当月第一天
          formSearch.setFieldsValue({ yhl: hlglpzVoList[0]?.rmbhl, yhlrq: hlglpzVoList[0]?.hlrq });
          setYhlDisabled(false);
        } else if (fphlxqgzDm === "14") {
          // 按出口日期当月最后一天
          formSearch.setFieldsValue({ yhl: hlglpzVoList[ts - 1]?.rmbhl, yhlrq: hlglpzVoList[ts - 1]?.hlrq });
          setYhlDisabled(false);
        }
        let formData: any = {};
        hlglpzVoList.forEach((hlglpzVo: any) => {
          Object.assign(formData, { [hlglpzVo.hlrq]: hlglpzVo?.rmbhl })
        });
        formDay.setFieldsValue(formData);
        setOldHlData(formData);
      } else if (code == '900') {
        message.info(msg)
      } else {
        formDay.setFieldsValue({});
      }
      //汇率年月
      const hln = formSearch.getFieldValue('hlny').format('YYYY');
      const hly = formSearch.getFieldValue('hlny').format('MM');
      //系统年月
      var myDate = new Date();
      const xtn = myDate.getFullYear();
      const xty = myDate.getMonth() + 1 < 10 ? '0' + (myDate.getMonth() + 1) : myDate.getMonth() + 1;
      const xtr = myDate.getDate();
      //1.当月
      if (xtn == hln && xty == hly) {
        for (let i = 1; i <= ts; i++) {
          const hhl = i + '号汇率';
          const hlDayName = body?.hlglpzVo[i - 1].hlrq;
          const boolean = i > parseInt(xtr) ? true : false;
          formArry.push({ name: hlDayName, type: itemType.InputNumber, label: hhl, disabled: boolean, format: '0,0.00000', onChange: hlChange });
        }
      } else {
        for (let i = 1; i <= ts; i++) {
          const hhl = i + '号汇率';
          const hlDayName = body?.hlglpzVo[i - 1].hlrq;
          formArry.push({ name: hlDayName, type: itemType.InputNumber, label: hhl, format: '0,0.00000', onChange: hlChange });

        }
      }
      setformItemDay(formArry);
    })
  };

  // 修改配置汇率时同步修改月汇率
  const hlChange = (param: any) => {
    if (param?.event <= 0) {
      const name = param?.item.name;
      param.form.setFieldsValue({ [name]: '' });
      return;
    }
    const yhlrq = formSearch.getFieldValue('yhlrq');
    const yhl = formDay.getFieldValue(yhlrq);
    formSearch.setFieldsValue({ yhl: yhl });
  }

  // 修改月汇率时同步修改对应汇率
  const yhlChange = (e: any) => {
    const yhlrq = formSearch.getFieldValue('yhlrq');
    formDay.setFieldsValue({ [yhlrq]: e });
  }

  //限制可选日期范围
  const disabledDate = (current: any) => {
    return current < moment(new Date('2017/01/01')) || current > moment().endOf('day')
  }

  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <div className="lay_wrap_hlgl" >
        <ProCard headerBordered title={<>
          <Form layout="inline" form={formSearch} colon={false} >
            <Form.Item label="汇率年月" name="hlny">
              <DatePicker picker="month" className="hlgl-form" allowClear={false} style={{ width: '100px' }} onChange={hlbzChange} disabledDate={disabledDate} />
            </Form.Item>
            <Form.Item name="yhlrq">
              <Input hidden />
            </Form.Item>
            <Form.Item label="币种" name="hbzmDm">
              <Select
                style={{ width: '150px' }}
                showSearch
                className="hlgl-form"
                optionLabelProp="value"
                filterOption={(input, option: any) =>
                  option.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.children[2].indexOf(input.toLowerCase()) >= 0
                }
                onChange={hlbzChange}
              >
                {
                  bzOptions.map((item: any) => (
                    <Select.Option key={item.code} label={item.name} value={item.code}>{item.code}-{item.name}</Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
            <Form.Item label="月汇率" name="yhl">
              <InputNumber className="hlgl-yhl" style={{ width: '100px' }} disabled={yhlDisabled} onChange={yhlChange} />
            </Form.Item>
            <Form.Item>
              <Button onClick={openHlgz} className="hlgl-btn">汇率选取规则：<a>{fphlxqgzmc}</a></Button>
              <Button onClick={open2} className="hlgl-btn" type="primary">保存</Button>
            </Form.Item>
          </Form>
        </>}>
          <div style={{ width: '92%' }}>
            <DDBaseForm items={formDayItem} form={formDay} layoutType='inline' />
          </div>
        </ProCard>
      </div>
    </Spin>
  );
};

export default Index;
