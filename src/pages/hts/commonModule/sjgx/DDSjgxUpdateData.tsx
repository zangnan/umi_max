/**
 * 更新报表
 */
import React, { useImperativeHandle, useState, memo } from 'react';
import { Form, Checkbox, DatePicker, Button, Modal, Radio, message, Spin } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import { InfoCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { updateDataTz } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';
import { history, useRouteData } from 'umi';
import style from './style.less';
import DDAlert from '@/pages/hts/components/DDAlert';

export interface DDTzUpdateDataProps {
  onRef?: any;
  visible?: any;
  data?: any;
}

const DDTzUpdateData: React.FC<DDTzUpdateDataProps> = ({ onRef, visible = false }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [loading, setLoading] = useState(false);
  const [mainPageParam, setMainPageParam] = useState<any>({});
  const [datesCknyCkbgd, setDatesCknyCkbgd] = useState<any>([]);
  const [datesCknyCkfp, setDatesCknyCkfp] = useState<any>([]);
  const [datesSbnyTssbmx, setDatesCknyCktsmx] = useState<any>([]);
  const [form] = Form.useForm();
  const [pageFlag, setPageFlag] = useState<boolean>(false);
  const routeMatch = useRouteData();     // 获取当前路由的匹配信息

  // console.info('render DDTzUpdateData ~~~')

  // 开启
  const showModal = (param: any) => {
    setMainPageParam(param);
    setModalVisible(true);
    const now = new Date();
    const initTime = myUtil.localStore.getItem('TZ_GXTZSJ');
    let obj = {};
    if (initTime) {
      obj = {
        ckbgd: true,
        ckfp: true,
        tssbmx: true,
        cknyCkbgdQuick: getFormLable(initTime.ckbgdmx[0], initTime.ckbgdmx[1]),
        cknyCkfpQuick: getFormLable(initTime.zzsmx[0], initTime.zzsmx[1]),
        sbnyTssbmxQuick: getFormLable(initTime.tssbmx[0], initTime.tssbmx[1]),
        cknyCkbgd: [moment(initTime.ckbgdmx[0]), moment(initTime.ckbgdmx[1])],
        cknyCkfp: [moment(initTime.zzsmx[0]), moment(initTime.zzsmx[1])],
        sbnyTssbmx: [moment(initTime.tssbmx[0]), moment(initTime.tssbmx[1])],
      }
    } else {
      obj = {
        ckbgd: true,
        ckfp: true,
        tssbmx: true,
        cknyCkbgdQuick: 1,
        cknyCkfpQuick: 1,
        sbnyTssbmxQuick: 1,
        cknyCkbgd: [moment(now).subtract(2, 'months'), moment(now)],
        cknyCkfp: [moment(now).subtract(2, 'months'), moment(now)],
        sbnyTssbmx: [moment(now).subtract(2, 'months'), moment(now)],
      }
    }
    form.setFieldsValue(obj);
    console.log(routeMatch)
    if (routeMatch?.path?.indexOf('/sjbb/sc/') > -1) {
      setPageFlag(false)
    } else {
      setPageFlag(true)
    }
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
      const { ckbgd, ckfp, tssbmx, cknyCkbgd, cknyCkfp, sbnyTssbmx } = values;
      let param: any = {};

      if (routeMatch?.path?.indexOf('/sjbb/sc/') > -1) {
        if (!(ckbgd || tssbmx)) {
          message.info('出口报关单明细、退税申报明细至少选择一种。');
          return;
        }
        let params: any = [];
        if (ckbgd) {
          params.push({ tzlxDm: "21", csz1: cknyCkbgd[0].valueOf(), csz2: cknyCkbgd[1].valueOf() })
        }
        if (tssbmx) {
          params.push({ tzlxDm: "41", csz1: sbnyTssbmx[0].valueOf(), csz2: sbnyTssbmx[1].valueOf() })
        }
        param = {
          key: 'ZXSB_TZ_RW_ADD',
          params
        }
      } else {
        if (!(ckbgd || ckfp|| tssbmx)) {
          message.info('出口报关单明细、增值税专用发票明细、退税申报明细至少选择一种。');
          return;
        }
        let params: any = [];
        if (ckbgd) {
          params.push({ tzlxDm: "11", csz1: cknyCkbgd[0].valueOf(), csz2: cknyCkbgd[1].valueOf() })
          // params.push({ tzlxDm: "11", csz1: moment(cknyCkbgd[0].valueOf()).format("YYYY-MM"), csz2: moment(cknyCkbgd[1].valueOf()).format("YYYY-MM") })
        }
        if (ckfp) {
          // params.push({ tzlxDm: "12", csz1: moment(cknyCkfp[0].valueOf()).format("YYYY-MM"), csz2: moment(cknyCkfp[1].valueOf()).format("YYYY-MM") })
          params.push({ tzlxDm: "12", csz1: cknyCkfp[0].valueOf(), csz2: cknyCkfp[1].valueOf() })
        }
        if (tssbmx) {
          params.push({ tzlxDm: "31", csz1: sbnyTssbmx[0].valueOf(), csz2: sbnyTssbmx[1].valueOf() })
        }
        param = {
          key: 'ZXSB_TZ_RW_ADD',
          params,
        }
      }

      setLoading(true);
      updateDataTz(param).then((response) => {
        setLoading(false);
        const searchModel = {
          ckbgdmx: cknyCkbgd ? [cknyCkbgd[0].valueOf(), cknyCkbgd[1].valueOf()] : [],
          zzsmx: cknyCkfp ? [cknyCkfp[0].valueOf(), cknyCkfp[1].valueOf()] : [],
          tssbmx: sbnyTssbmx ? [sbnyTssbmx[0].valueOf(), sbnyTssbmx[1].valueOf()] : [],
        }
        myUtil.localStore.setItem('TZ_GXTZSJ', searchModel);
        const { code, desc } = response;
        if (code === '200') {
          setModalVisible(false);
          DDAlert.open({
            title: '更新报表',
            okText: '任务进度查询',
            cancelText: '关闭',
            modalType: 'confirm',
            infoType: 'info',
            info: '报表数据正在更新，可通过报表更新任务查询执行进度。',
            okCallbackFn: function () {
              const { location } = history;
              // 当前页面进度查询页面
              console.log(location)
              if (location.pathname === '/hts/sjbb/sc/sjgx' || location.pathname === '/hts/sjbb/wm/sjgx') {
                const { gridRef } = mainPageParam;
                gridRef.current?.reload();
              } else if (location.pathname.indexOf('/sc/') > -1) {
                history.push('/hts/sjbb/sc/sjgx');
              } else if (location.pathname.indexOf('/wm/') > -1) {
                history.push('/hts/sjbb/wm/sjgx');
              }
              DDAlert.close();
            },
            cancelCallbackFn: function () {
              const { location } = history;
              // 当前页面进度查询页面
              if (location.pathname === '/hts/sjbb/sc/sjgx' || location.pathname === '/hts/sjbb/wm/sjgx') {
                const { gridRef } = mainPageParam;
                gridRef.current?.reload();
              }
            }
          });
        } else {
          message.error(desc);
        }
      })
    })
  };

  // 最大范围选择12个月
  const disabledDate = (current: any, label: any) => {
    let tmpData: any;
    if (label === 'cknyCkbgd') {
      tmpData = datesCknyCkbgd;
    } else if (label === 'cknyCkfp') {
      tmpData = datesCknyCkfp;
    } else if (label === 'sbnyTssbmx') {
      tmpData = datesSbnyTssbmx;
    }
    if (!tmpData || tmpData.length === 0) {
      return false;
    }
    const tooLate = tmpData[0] && current.diff(tmpData[0], 'month') > 10;
    const tooEarly = tmpData[1] && moment(tmpData[1]).diff(current, 'month') > 10;
    return tooEarly || tooLate;
  };

  // 表单初始值
  const getInitialValues = () => {
    const now = new Date();
    return {
      ckbgd: true,
      ckfp: true,
      tssbmx: true,
      cknyCkbgdQuick: 1,
      cknyCkfpQuick: 1,
      sbnyTssbmxQuick: 1,
      cknyCkbgd: [moment(now).subtract(2, 'months'), moment(now)],
      cknyCkfp: [moment(now).subtract(2, 'months'), moment(now)],
      sbnyTssbmx: [moment(now).subtract(2, 'months'), moment(now)],
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

  // 判断初始化日期
  const getFormLable = (value1?: any, value2?: any) => {
    const now = new Date();
    const timeNow = moment(now).format("YYYY-MM");
    const timeStart = moment(value1);
    const timeEnd = moment(value2);
    const timeDiff = moment(value2).diff(value1, 'month');  // 两个月份差值
    const lastTimeDqStart = moment(now).startOf("year").format("YYYY-MM"); // 当前年开始时间
    const lastTimeStart = moment(now).subtract(1, 'years').startOf("year").format("YYYY-MM"); // 当前时间上一年开始
    const lastTimeEnd = moment(now).subtract(1, 'years').endOf("year").format("YYYY-MM"); // 当前时间上一年结束
    let flag;
    if (timeDiff == 2 && timeNow == timeEnd.format("YYYY-MM")) {
      // 最近3个月
      flag = 1
    } else if (lastTimeDqStart == timeStart.format("YYYY-MM") && timeNow == timeEnd.format("YYYY-MM")) {
      // 本年
      flag = 2;
    } else if (timeDiff == 11 && lastTimeStart == timeStart.format("YYYY-MM") && lastTimeEnd == timeEnd.format("YYYY-MM")) {
      flag = 3;
    }
    return flag;
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
        form.setFieldsValue({ [label]: 1 });
      } else if (lastTimeDqStart == timeStart.format("YYYY-MM") && timeNow == timeEnd.format("YYYY-MM")) {
        // 本年
        form.setFieldsValue({ [label]: 2 });
      } else if (timeDiff == 11 && lastTimeStart == timeStart.format("YYYY-MM") && lastTimeEnd == timeEnd.format("YYYY-MM")) {
        form.setFieldsValue({ [label]: 3 });
      } else {
        form.setFieldsValue({ [label]: '' });
      }
    } else {
      form.setFieldsValue({ [label]: '' });
    }
    if (label == 'cknyCkbgdQuick') {
      setDatesCknyCkbgd(value);
    } else if (label == 'cknyCkfpQuick') {
      setDatesCknyCkfp(value);
    } else if (label == 'sbnyTssbmxQuick') {
      setDatesCknyCktsmx(value);
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
            <InfoCircleOutlined />
            {pageFlag ? '重复年月批次数据会被覆盖' : '重复年月数据会被覆盖'}
          </span>
          <Button onClick={() => setModalVisible(false)}>取消</Button>
          <Button onClick={updateData} type="primary">确定</Button>
        </>}
        onCancel={() => setModalVisible(false)}
      >
        <Spin tip="Loading..." spinning={loading} delay={100}>
          <Form colon={false} form={form} {...myUtil.layout.formX1.layout} className="dd_form_x1" initialValues={getInitialValues()}>
            <Form.Item name="ckbgd" valuePropName="checked" {...myUtil.layout.formX1.tailLayout} >
              <Checkbox>出口报关单明细</Checkbox>
            </Form.Item>
            <Form.Item name="cknyCkbgd" label="出口年月" rules={[
              () => ({
                validator(_, value) {
                  if (value.length === 2) {
                    if (value[0].diff(value[1], 'month') > 11 || value[1].diff(value[0], 'month') > 11) {
                      return Promise.reject(new Error('时间范围不能超过12个月'));
                    }
                    return Promise.resolve();
                  }
                  return Promise.resolve();
                },
              })
            ]}>
              <DatePicker.RangePicker picker="month"
                onChange={(val: any) => changeTimeData(val, 'cknyCkbgdQuick')}
                allowClear={false}
              // onCalendarChange={(val: any) => changeTimeData(val, 'cknyCkbgdQuick', 'cknyCkbgd')}
              // disabledDate={(current) => disabledDate(current, 'cknyCkbgd')}
              />
            </Form.Item>
            <Form.Item name="cknyCkbgdQuick" {...myUtil.layout.formX1.tailLayout} >
              <Radio.Group onChange={() => changeTime('cknyCkbgd')}>
                <Radio value={1}>三个月</Radio>
                <Radio value={2}>本年</Radio>
                <Radio value={3}>上年</Radio>
              </Radio.Group>
            </Form.Item>
            {routeMatch?.path?.indexOf('/sjbb/sc/') > -1 ? <></> :
              <>
                <Form.Item name="ckfp" valuePropName="checked" {...myUtil.layout.formX1.tailLayout} >
                  <Checkbox>增值税专用发票明细</Checkbox>
                </Form.Item>
                <Form.Item name="cknyCkfp" label="开票年月" rules={[
                  () => ({
                    validator(_, value) {
                      if (value.length === 2) {
                        if (value[0].diff(value[1], 'month') > 11 || value[1].diff(value[0], 'month') > 11) {
                          return Promise.reject(new Error('时间范围不能超过12个月'));
                        }
                        return Promise.resolve();
                      }
                      return Promise.resolve();
                    },
                  })
                ]}>
                  <DatePicker.RangePicker picker="month"
                    onChange={(val: any) => changeTimeData(val, 'cknyCkfpQuick')}
                    allowClear={false}
                  // onCalendarChange={(val: any) => changeTimeData(val, 'cknyCkfpQuick')}
                  // disabledDate={(current) => disabledDate(current, 'cknyCkfp')}
                  />
                </Form.Item>
                <Form.Item name="cknyCkfpQuick" {...myUtil.layout.formX1.tailLayout} >
                  <Radio.Group onChange={() => changeTime('cknyCkfp')}>
                    <Radio value={1}>三个月</Radio>
                    <Radio value={2}>本年</Radio>
                    <Radio value={3}>上年</Radio>
                  </Radio.Group>
                </Form.Item>            </>
            }
            <Form.Item name="tssbmx" valuePropName="checked" {...myUtil.layout.formX1.tailLayout} >
              <Checkbox>退税申报明细</Checkbox>
            </Form.Item>
            <Form.Item name="sbnyTssbmx" label="申报年月" rules={[
              () => ({
                validator(_, value) {
                  if (value.length === 2) {
                    if (value[0].diff(value[1], 'month') > 11 || value[1].diff(value[0], 'month') > 11) {
                      return Promise.reject(new Error('时间范围不能超过12个月'));
                    }
                    return Promise.resolve();
                  }
                  return Promise.resolve();
                },
              })
            ]}>
              <DatePicker.RangePicker picker="month"
                onChange={(val: any) => changeTimeData(val, 'sbnyTssbmxQuick')}
                allowClear={false}
              />
            </Form.Item>
            <Form.Item name="sbnyTssbmxQuick" {...myUtil.layout.formX1.tailLayout} >
              <Radio.Group onChange={() => changeTime('sbnyTssbmx')}>
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
