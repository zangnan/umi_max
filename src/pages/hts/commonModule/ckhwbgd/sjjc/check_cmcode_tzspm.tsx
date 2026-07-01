/**
 * 数据检查 调整商品信息
 */
import cktsUtil from '@/pages/hts/cktsUtil';
import React, { useImperativeHandle, useState } from 'react';
import DDBaseForm from '@/components/DDForm/DDBaseForm';
import CONSTANTS from '@/components/DDAssist/constants';
import { itemType } from '@/components/DDForm/data.d';
import { Modal, Form, message, Spin } from 'antd';
import baseValidator from '@/components/DDAssist/field/baseValidator';
import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';
import { bgdCktsSbSptz, queryCjCsh } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';

export interface TzspmProps {
  onRef?: any;
}

const ModalTzspm: React.FC<TzspmProps> = ({
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [mainRef, setMainRef] = useState<any>();
  const [recordIndex, setRecordIndex] = useState<any>();
  const [masker, setMasker] = useState<boolean>(false);
  const [form] = Form.useForm();

  // 开启
  const showModal = (param: any) => {
    const { onRef, record, index } = param;
    setMainRef(onRef);
    setRecordIndex(index);
    initFormData(record);
    setModalVisible(true);
  }

  // 申报批次 Blur
  const onBlurSbpc = (param: any) => {
    // 申报批次自动补零
    DditCktsFormCommonFunc.eventOnBlur.sbpc(param);
  }

  // 调整后商品代码
  const onBlurTzhckspDm = (param: any) => {
    DditCktsFormCommonFunc.eventOnChange.tzhckspDm(param);
  }

  // 表单项: 生成申报数据
  const getFormItems = () => {
    // 获取企业类型(WM:外贸，SC:生产，QT:其他)
    const qylx = cktsUtil.sys.enterpriseType();
    const formItems = [];
    formItems.push({ name: 'groupTitle1', type: itemType.GroupTitle, label: '基本信息' });
    formItems.push({ name: 'ssq', type: itemType.Input, label: '所属期', rules: [{ type: 'base_required' }], validator: [
      baseValidator.required(),
      baseValidator.yyyyMM(),
    ] });
    if (qylx != 'SC') {
      formItems.push({ name: 'sbpc', type: itemType.Input, label: '申报批次', onBlur: onBlurSbpc, rules: [{ type: 'base_required' }], validator: [
        baseValidator.required(),
        DditCktsFormCommonFunc.validator.sbpc02(form),
      ] });
    }
    formItems.push({ name: 'ckrq1', type: itemType.DatePicker, label: '申报日期', format: 'yyyy-MM-DD', rules: [{ type: 'base_required' }], validator: [
      baseValidator.required(),
      baseValidator.yyyyMMdd()
    ] });
    formItems.push({ name: 'groupTitle2', type: itemType.GroupTitle, label: '商品信息' });
    formItems.push({ name: 'tzhckspDm', type: itemType.Input, label: '调整后商品代码', onBlur: onBlurTzhckspDm, rules: [{ type: 'base_required' }], validator: [
      baseValidator.required(),
      baseValidator.range2({ min: 0, max: 12 })
    ] });
    formItems.push({ name: 'tzhhgspmc', type: itemType.Input, label: '调整后商品名称', disabled: true });
    formItems.push({ name: 'tzhtsl', type: itemType.InputNumber, label: '调整后退税率', format: '0,0.0000', rules: [{ type: 'base_required' }], validator: [
      baseValidator.required(),
      baseValidator.numRange(['+', '-']),
      baseValidator.numRange(['+', '0']),
    ] });
    formItems.push({ label: 'uuid', name: 'uuid', type: itemType.Hidden });
    formItems.push({ label: 'lcswsxDm', name: 'lcswsxDm', type: itemType.Hidden });
    formItems.push({ label: 'sbxh', name: 'sbxh', type: itemType.Hidden });
    formItems.push({ label: 'bgdNoEterArray', name: 'bgdNoEterArray', type: itemType.Hidden });
    return formItems;
  }

  // 初始化表单数据
  const initFormData = (record: any) => {
    let params: any = {
      tableKey: 'TSZL_ZXSB_SB_HGSPTZ_G',
    };
    setMasker(true);
    queryCjCsh(params).then((response) => {
      setMasker(false);
      const { code, body } = response;
      if (code === '200') {
        form.setFieldsValue({
          uuid: record.sbId,
          bgdNoEterArray: record.bgdNo,
          ssq: body.ssq,
          sbpc: body.sbpc,
          sbxh: body.sbxh,
        });
        // 获取企业类型(WM:外贸，SC:生产，QT:其他)
        const qylx = cktsUtil.sys.enterpriseType();
        if ('SC' == qylx) {
          form.setFieldsValue({ lcswsxDm: 'LCSXA081038001' });
        } else {
          form.setFieldsValue({ lcswsxDm: 'LCSXA081039001' });
        }
      }
    })
  }

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 保存
  const handleSave = () => {
    form.validateFields().then(values => {
      const param = {
        ...values,
      };
      bgdCktsSbSptz(param).then((res) => {
        const { code, msg, body } = res;
        if (code !== '200') {
          message.error(msg);
        } else {
          message.success(body);
          const record = {
            ckspDm: values.tzhckspDm,
            tsl:values.tzhtsl
          }
          mainRef.current!.CallbackFmFunc({record, index: recordIndex});
          setModalVisible(false)
        }
      })
    })
  }

  return (
    <Modal
      title="请填写信息"
      centered
      destroyOnHidden
      open={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X4}
      okText="保存"
      cancelText="关闭"
      onOk={handleSave}
      onCancel={() => setModalVisible(false)}
      zIndex={1001}
    >
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <DDBaseForm items={getFormItems()} form={form} initialValues={{}} />
    </Spin>
    </Modal>
  );
};

export default ModalTzspm;