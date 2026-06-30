import React, { useState } from 'react';
import { Button, Form, Space, message, DatePicker, Radio, Spin } from 'antd';
import ProCard from '@ant-design/pro-card';
import moment from 'moment';
import { history } from 'umi';
import DDAlert from '@/pages/hts/components/DDAlert';
import { xzrw } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';
import { useIntl } from 'umi';

export type ActionType = {
  reload: (resetPageIndex?: boolean) => void;
}

const Swfkjsxzjy: React.FC<unknown> = () => {
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;
  const [masker, setMasker] = useState(false);
  const [hackValue, setHackValue] = useState<any>();
  const [value, setValue] = useState<any>();
  const [dates, setDates] = useState<any>();
  const intl = useIntl();

  // 表单项目测试数据
  const itemList2 = [
    { value: '1', name: '一年' },
    { value: '2', name: '两年' },
    { value: '3', name: '三年' },
  ];
  // 数据下载
  const downloadSj = async () => {
    const formVals = await form.validateFields();
    setMasker(true);
    const data = {
      sjgjsjDm: '030300',
      tjzdmc: '反馈年度',
      czfDm: '08',
      csz1: (formVals.SjSxrq[0]).valueOf(),
      csz2: (formVals.SjSxrq[1]).valueOf(),
    };

    xzrw(data).then((response: any) => {
      setMasker(false);
      const { code } = response;
      if (code === '200') {
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
    })
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
      setDates([]);
    } else {
      setHackValue(undefined);
    }
  }

  const defaultRangeData = () => {
    return [moment(myUtil.date.getYearBeforeCurr(1), 'YYYY'), moment(myUtil.date.getYearBeforeCurr(1), 'YYYY')];
  }

  //时间选取
  const handleSelectTime = (values: any, formatString: [string, string]) => {
    if (formatString[0] == myUtil.date.getYearBeforeCurr(1) && formatString[1] == myUtil.date.getYearBeforeCurr(1)) {
      form.setFieldsValue({ ndsj: '1' });
    } else if (formatString[0] == myUtil.date.getYearBeforeCurr(2) && formatString[1] == myUtil.date.getYearBeforeCurr(1)) {
      form.setFieldsValue({ ndsj: '2' });
    } else if (formatString[0] == myUtil.date.getYearBeforeCurr(3) && formatString[1] == myUtil.date.getYearBeforeCurr(1)) {
      form.setFieldsValue({ ndsj: '3' });
    } else {
      form.setFieldsValue({ ndsj: '' });
    }
    setValue(values);
  }
  //itemList2值保存
  const handlerSjSxrqChange = (e: any) => {
    const value = e.target.value;
    if (value === '1') {
      form.setFieldsValue({ SjSxrq: [moment(myUtil.date.getYearBeforeCurr(1), 'YYYY'), moment(myUtil.date.getYearBeforeCurr(1), 'YYYY')] });
    }
    if (value === '2') {
      form.setFieldsValue({ SjSxrq: [moment(myUtil.date.getYearBeforeCurr(2), 'YYYY'), moment(myUtil.date.getYearBeforeCurr(1), 'YYYY')] });
    }
    if (value === '3') {
      form.setFieldsValue({ SjSxrq: [moment(myUtil.date.getYearBeforeCurr(3), 'YYYY'), moment(myUtil.date.getYearBeforeCurr(1), 'YYYY')] });
    }
  }
  // 环境检测
  // const hjjc = () => {
  //   const param = {
  //     sjgjsjDm: '030300',
  //   }
  //   setMasker(true);
  //   khdHjjc(param).then((response: any) => {
  //     const { code, desc } = response;
  //     setMasker(false);
  //     if (code === '200') {
  //       const succMessage = intl.formatMessage({ id: 'message_jljghx_sjxz_hjjc_success' });
  //       message.success({
  //         content: succMessage,
  //       });
  //       setHjjcBz(true);
  //     } else {
  //       message.error({
  //         content: desc,
  //       });
  //     }
  //   });
  // };

  // 表单布局
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  };

  // 表单布局
  const tailLayout = {
    wrapperCol: { offset: 5, span: 19 },
  };

  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <ProCard split="horizontal" className="dd_layout_form_01 dd_hgsjxzjy">
        <ProCard style={{ height: myUtil.heightCalc.getCalc(['header', 'headerTab', 'cardMargin', 'footerBtn']), overflowY: 'auto' }}>
          <Form {...layout} form={form}
            initialValues={{ SjSxrq: defaultRangeData() }}
          >
            <div className='groupTit'>加工贸易审核结果</div>
            <Form.Item {...tailLayout} name='SjSxrq' rules={[
              () => ({
                validator(_, value) {
                  if (value.length === 2) {
                    if (value[0].diff(value[1], 'years') > 4 || value[1].diff(value[0], 'years') > 4) {
                      return Promise.reject(new Error('加工贸易审核结果最大下载时间范围是5年'));
                    }
                    if (value[0].diff(moment('2014', 'YYYY'), 'years') < 0) {
                      return Promise.reject(new Error('数据下载时间范围开始时间不能小于2014'));
                    }
                    return Promise.resolve();
                  }
                  return Promise.resolve();
                },
              })
            ]}>
              <RangePicker picker="year" style={{ width: 260 }}
                onChange={handleSelectTime}
                // onCalendarChange={val => setDates(val)}
                // disabledDate={disabledDate}
                allowClear={false}
                // onOpenChange={onOpenChange}
                format={myUtil.date.formatList('YYYY')}
              />
            </Form.Item>
            <Form.Item {...tailLayout} name='ndsj'>
              <Radio.Group defaultValue={'1'} onChange={handlerSjSxrqChange}>
                {itemList2.map((item) => (
                  <Radio key={item.value} value={item.value}>{item.name}</Radio>
                ))}
              </Radio.Group>
            </Form.Item>
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

export default Swfkjsxzjy;
