// 序号重排
import React, { useState, useImperativeHandle } from 'react';
import { message, Modal, Form, Spin } from 'antd';
import { itemType } from '@/components/DDForm/data.d';
import { xhcp } from '@/services/hts/api';
import DDBaseForm from '@/components/DDForm/DDBaseForm';
import baseValidator from '@/pages/common/field/baseValidator';
import myUtil from '@/pages/common/myUtil';
import pro from '@/pages/common/proConfig';

export type OrderProps = {
  onRef?: any;
}

const Order: React.FC<OrderProps> = ({
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [orderType, setOrderType] = useState<any>();
  const [unitRef, setUnitRef] = useState<any>();
  const [formData, setFormData] = useState<any>({});
  const [orderForm] = Form.useForm();
  const [masker, setMasker] = useState<boolean>(false);
  // 开启
  const showModal = (param: any) => {
    setOrderType(param.type);
    setUnitRef(param.unitRef);
    initFormData(param);
    setModalVisible(true);
  };

  // 申报批次 Blur
  const onBlurSbpc = (e: any) => {
    orderForm.setFieldsValue({
      sbpc: myUtil.text.leadingZeroize(e.event.target.value, 3)
  });
  }

  // 起始序号 Blur
  const onBlurStartNo = (e: any) => {
    let startNo = e.event.target.value;
    if (!startNo) {
      return;
    }
    orderForm.validateFields(['startNo']).then(() => {
      if(startNo == 0) {
        startNo = '00000001'
      } else {
        startNo = myUtil.text.leadingZeroize(startNo, 8);
      }
      orderForm.setFieldsValue({
        startNo
      });
    })
  }

  // 表单项: 生成申报数据
  const getFormItems = () => {
    const formItems = [];
    if (orderType === 3 || orderType === 4 || orderType === 5) {
      formItems.push({ name: 'ssq', type: itemType.Input, label: '所属期', validator: [
        baseValidator.required(),
        baseValidator.yyyyMM(),
      ] });
    }
    if (orderType === 3 || orderType === 5) {
      formItems.push({ name: 'sbpc', type: itemType.Input, label: '申报批次', onBlur: onBlurSbpc, validator: [
        baseValidator.required(),
      ] });
    }
    if (orderType == 5) {
      formItems.push({label: '起始序号', name: 'startNo', type: itemType.Hidden});
    } else {
      formItems.push({
        name: 'startNo', type: itemType.Input, label: '起始序号', onBlur: onBlurStartNo, validator: [
          baseValidator.required(),
          baseValidator.number(),
        ]
      });
    }
    formItems.push({ label: 'lcswsxDm', name: 'lcswsxDm', type: itemType.Hidden });
    formItems.push({ label: 'dataGroupRule', name: 'dataGroupRule', type: itemType.Hidden });
    formItems.push({ label: 'ywCxBz', name: 'ywCxBz', type: itemType.Hidden });
    return formItems;
  }

  // 初始化表单数据
  const initFormData = (param: any) => {
    let sortTypeName = '';
    let dataGroupRule = '';
    if (param?.type == '1') {
      dataGroupRule = 'G_SB_YM';
      sortTypeName = '所属期';
    } else if (param?.type == '2') {
      dataGroupRule = 'G_SQ_DATE';
      sortTypeName = '申请日期';
    } else if (param?.type == '3') {
      dataGroupRule = 'G_SB_PC';
      sortTypeName = '所属期，批次'
    } else if (param?.type == '4') {
      dataGroupRule = 'G_SB_YM';
    } else if (param?.type == '5') {
      dataGroupRule = 'G_SB_PC_BH';
      sortTypeName = '所属期，批次，编号'
    }
    orderForm.setFieldsValue({
      dataGroupRule,
      lcswsxDm: param?.lcswsxDm,
      sbpc: param?.sbpc,
      ssq: param?.ssq,
      startNo: param?.type == '5' ? '01' : '00000001',
      ywCxBz: param?.ywCxBz,
      sortTypeName,
    });
    // setFormData({
    //   dataGroupRule,
    //   lcswsxDm: param?.lcswsxDm,
    //   sbpc: param?.sbpc,
    //   ssq: param?.ssq,
    //   startNo: '00000001',
    //   ywCxBz: param?.ywCxBz,
    //   sortTypeName,
    // });
  }

  // useImperativeHandle
  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 保存
  const handleSave = () => {
    orderForm.validateFields().then(values => {
      const param = {
        ...values,
      };
      setMasker(true);
      xhcp(param).then((response) => {
        setMasker(false);
        const { code, desc } = response;
        if (code === '200') {
          message.success('序号重排成功');
          unitRef.current!.reload2();;
          close();
        } else {
          message.error(desc);
        }
      })
    })
  }

  const close = () => {
    setModalVisible(false);
    orderForm.resetFields();
  }


  return (
    <Modal
      title='序号重排'
      centered
      destroyOnClose
      visible={modalVisible}
      width={pro.c_modal_width_x1}
      okText="保存"
      cancelText="关闭"
      onOk={handleSave}
      onCancel={() => close()}
      className={`${masker ? 'dd_modal_show_masker' : ''}`}
      maskClosable={false}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <DDBaseForm items={getFormItems()} form={orderForm} initialValues={formData} layoutType='vertical' />
      </Spin>
    </Modal>
  );
};
export default Order;
