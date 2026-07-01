/**
 * 更新报表
 */
import React, {memo, useImperativeHandle, useState} from 'react';
import { Button, DatePicker, Form, message, Modal, Radio, Spin} from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import {InfoCircleOutlined} from '@ant-design/icons';
import moment from 'moment';
import {addForWmckbgdtsqk } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';
import {history} from 'umi';
import style from './style.less';
import DDAlert from '@/pages/hts/components/DDAlert';
import locale from "antd/es/date-picker/locale/zh_CN";

export interface DDTzUpdateDataProps {
  onRef?: any;
  visible?: any;
  data?: any;
}

const DDTzUpdateData: React.FC<DDTzUpdateDataProps> = ({onRef, visible = false}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // 开启
  const showModal = (param: any) => {
    setModalVisible(true);
    const now = new Date();
    let obj = {};
    obj = {
      cknyQuick: 2,
      ckny: [moment(now.getFullYear() + '01', 'YYYYMM'), moment(now)],
    }
    form.setFieldsValue(obj);
  };

  // useImperativeHandle
  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 更新
  const updateData = () => {
    form.validateFields().then(values => {
      const {ckny} = values;
      let param: any = {};
      param['csz1'] = ckny[0].format('YYYYMM');
      param['csz2'] = ckny[1].format('YYYYMM');
      setLoading(true);
      addForWmckbgdtsqk(param).then((res) => {
        setLoading(false);
        const {code, msg} = res;
        if ('200' == code) {
          setModalVisible(false);
          DDAlert.open({
            title: '更新报表',
            infoType: 'info',
            modalType: 'confirm',
            info: '报表数据正在更新，可通过报表更新任务查询执行进度。',
            closable: false,
            okText: '任务进度查询',
            isShowcancelText: true,
            okCallbackFn: function (thisObj: any) {
              DDAlert.close();
              history.push('/hts/sjbb/wm/sjgx');
            },
          });
        } else {
          message.error(msg);
        }
      });
    })
  };

  // 表单初始值
  const getInitialValues = () => {
    const now = new Date();
    return {
      cknyQuick: 2,
      ckny: [moment(now.getFullYear() + '01', 'YYYYMM'),
        moment(now)],
    }
  }

  // 重置图表: 点击按钮
  const changeTime = (label?: any) => {
    const now = new Date();
    let timeFlag = form.getFieldValue(label + 'Quick');
    let timeStart;
    let timeEnd;
    if (timeFlag === 1) {
      // 最近3个月
      timeStart = moment(now).subtract(2, 'months');
      timeEnd = moment(now);
    } else if (timeFlag === 2) {
      // 本年
      timeStart = moment().startOf('year');
      timeEnd = moment(now);
    } else if (timeFlag === 3) {
      // 上年
      timeStart = moment(now).subtract(1, 'years').startOf("year");
      timeEnd = moment(now).subtract(1, 'years').endOf("year");
    }
    let formVal = {};
    formVal[label] = [timeStart, timeEnd];
    form.setFieldsValue(formVal);
  }

  // 修改日期
  const changeTimeData = (value?: any, label?: any) => {
    const now = new Date();
    const timeNow = moment(now).format("YYYY-MM");
    if (value) {
      const timeStart = moment(value[0]);
      const timeEnd = moment(value[1]);
      const timeDiff = moment(value[1]).diff(value[0], 'month');  // 两个月份差值
      const lastTimeDqStart = moment(now).startOf("year").format("YYYY-MM"); // 当前年开始时间
      const lastTimeStart = moment(now).subtract(1, 'years').startOf("year").format("YYYY-MM"); // 当前时间上一年开始
      const lastTimeEnd = moment(now).subtract(1, 'years').endOf("year").format("YYYY-MM"); // 当前时间上一年结束
      if (timeDiff == 2 && timeNow == timeEnd.format("YYYY-MM")) {
        // 最近3个月
        form.setFieldsValue({[label]: 1});
      } else if (lastTimeDqStart == timeStart.format("YYYY-MM") && timeNow == timeEnd.format("YYYY-MM")) {
        // 本年
        form.setFieldsValue({[label]: 2});
      } else if (timeDiff == 11 && lastTimeStart == timeStart.format("YYYY-MM") && lastTimeEnd == timeEnd.format("YYYY-MM")) {
        form.setFieldsValue({[label]: 3});
      } else {
        form.setFieldsValue({[label]: ''});
      }
    } else {
      form.setFieldsValue({[label]: ''});
    }
  }

  return (
    <>
      <Modal
        title="更新报表"
        destroyOnHidden={true}
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X1}
        className={`${loading ? 'dd_modal_show_masker' : ''}`}
        footer={<>
          <span className={style.update_info}>
            <InfoCircleOutlined/>
            {'重复年月批次数据会被覆盖'}
          </span>
          <Button onClick={() => setModalVisible(false)}>取消</Button>
          <Button onClick={updateData} type="primary">确定</Button>
        </>}
        onCancel={() => setModalVisible(false)}
      >
        <Spin tip="Loading..." spinning={loading} delay={100}>
          <Form colon={false} form={form} {...myUtil.layout.formX1.layout} className="dd_form_x1" initialValues={getInitialValues()}>
            <div style={{marginBottom: 10}}>出口报关单退税申报明细</div>
            <Form.Item name="ckny" label="出口年月" rules={[{required: true, message: '请输入出口年月'},
              () => ({
                validator(_, value) {
                  if (value) {
                    if (value.length === 2) {
                      const year1 = moment(value[0], 'YYYY').format("YYYY");
                      const year2 = moment(value[1], 'YYYY').format("YYYY");
                      if (year1 != year2) {
                        return Promise.reject(new Error('出口年月不支持跨年'));
                      }
                      return Promise.resolve();
                    }
                  }
                  return Promise.resolve();
                },
              })
            ]}>
              <DatePicker.RangePicker locale={locale} picker="month" onChange={(val: any) => changeTimeData(val, 'cknyQuick')} allowClear={false}/>
            </Form.Item>
            <Form.Item name="cknyQuick" {...myUtil.layout.formX1.tailLayout} >
              <Radio.Group onChange={() => changeTime('ckny')}>
                <Radio value={1}>三个月</Radio>
                <Radio value={2}>本年</Radio>
                <Radio value={3}>上年</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
}

export default memo(DDTzUpdateData);
