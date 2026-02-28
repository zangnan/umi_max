import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Modal, Form, Spin } from 'antd';
import { dd2mrtj, createkq, createJb, exportkq, scjxry, scgzxx, exportGz1, scgjj, exportSb } from '@/services/hts/api';
import DDBaseForm from '@/components/DDForm/DDBaseForm';
import myUtil from '@/components/DDAssist/util';
import Func from './f';

export interface BdjgProps {
  onRef?: any;
}

const DrawerList: React.FC<BdjgProps> = ({
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [initParam, setInitParam] = useState<any>({});
  const [form] = Form.useForm();
  const [masker, setMasker] = useState<any>(false);

  // 开启
  const showModal = (param: any) => {
    setInitParam(param);
    setModalVisible(true);
  };

  // 请求响应
  const handleResponse = ({response, isBlob, title}: any) => {
    if (isBlob) {
      myUtil.file.downloadFile(response, title, 'application/vnd.ms-excel');
    } else {
      let { code, msg } = response;
      myUtil.modal.responseInfo({code, msg});
      setMasker(false);
      if (code === '200') {
        initParam.refGrid?.current?.reload();
        setModalVisible(false);
      }
    }
  }

  // 生成
  const formSubmit = () => {
    form.validateFields().then(values => {
      setMasker(true);
      let formParam: any = {
        nbglTjlx: '2', // 按月
        nbglTjnhy: values.analysisDate?.format('YYYY-M'),
      }
      let formParam2: any = {
        ny: values.analysisDate?.format('YYYY-M'),
      }
      if (initParam.type === '1') {       // 考勤管理 - 生成每日考勤
        formParam = { ...formParam, key: 'nbgl_yggl_mrtj', }
        dd2mrtj(formParam).then((response: any) => { handleResponse({response}); })
      } else if (initParam.type === '2') { // 考勤管理 - 生成考勤汇总
        formParam = { ...formParam, key: 'nbgl_yggl_lzgl', }
        createkq(formParam).then((response: any) => { handleResponse({response}); })
      } else if (initParam.type === '3') { // 考勤管理 - 生成加班汇总
        formParam = { ...formParam, key: 'nbgl_yggl_lzgl', }
        createJb(formParam).then((response: any) => { handleResponse({response}); })
      } else if (initParam.type === '4') { // 考勤管理 - 生成考勤汇总 导出
        formParam = { ...formParam, key: 'nbgl_yggl_lzgl', responseType: 'blob', }
        exportkq(formParam).then((response: any) => { handleResponse({response, isBlob: 1, title: '考勤汇总'}); })
      } else if (initParam.type === '11') { // 薪资管理 生成计薪人员信息
        scjxry(formParam2).then((response: any) => { handleResponse({response}); })
      } else if (initParam.type === '12') { // 薪资管理 生成工资数据
        scgzxx(formParam2).then((response: any) => { handleResponse({response}); })
      } else if (initParam.type === '13') { // 薪资管理 导出工资数据
        formParam2 = { ...formParam2, key: 'nbgl_exportGz', responseType: 'blob', }
        exportGz1(formParam2).then((response: any) => { handleResponse({response, isBlob: 1, title: '工资汇总'}); })
      } else if (initParam.type === '21') { // 薪资管理 生成社保数据
        scgjj(formParam2).then((response: any) => { handleResponse({response}); })
      } else if (initParam.type === '22') { // 薪资管理 导出社保公积金
        formParam2 = { ...formParam2, key: 'nbgl_yggl_sb', responseType: 'blob', }
        exportSb(formParam2).then((response: any) => { handleResponse({response, isBlob: 1, title: '社保公积金'}); })
      }
    })
  }

  // 表单配置
  const formConfig = {
    form_layout_type: 'vertical',
    form_label_input_layout: 'horizontal',
    form_items: [
      { label: '统计日期', type: 'DatePicker', name: 'analysisDate', format: 'YYYY-MM', picker: 'month', rules: [
        { type: 'base_required' },
      ] },
    ],
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <Modal
      title="选择时间"
      open={modalVisible}
      onCancel={() => setModalVisible(false)}
      width={CONSTANTS.C_MODAL_WIDTH_X1}
      destroyOnHidden={true}
      mask={{ closable: false }}
      okText="生成"
      cancelText="关闭"
      onOk={() => formSubmit()}
    >
      <Spin description="Loading..." spinning={masker} delay={100}>
        <DDBaseForm config={formConfig} form={form} initialValues={{}} func={Func}/>
      </Spin>
    </Modal>
  );
};

export default DrawerList;
