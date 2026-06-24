/**
 * 滚动配单
 */
import React, {useImperativeHandle, useState } from 'react';
import { Button, Spin, Modal, Form, DatePicker } from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';

export interface ModalGdppProps {
  onRef?: any;
  visible?: any;
  gridRef?: any;
  gdPp?: any;
  topData?: any;
}

const ModalGdpp: React.FC<ModalGdppProps> = ({
  onRef,
  gdPp,
  topData,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [formGdpp] = Form.useForm();
  const [masker, setMasker] = useState<boolean>(false); //
  const [ppbzDm, setPpbzDm] = useState<any>('');
  useImperativeHandle(onRef, () => {
    return {
      showModal,
      gxMasker,
      closeTc,
    };
  });

   //开启
  const showModal = (params: any) => {
    setPpbzDm(params.ppbzDm);
    formGdpp.setFieldsValue({'ckrq1': null});
    setModalVisible(true);
  };
  // 设置蒙版
  const gxMasker =(flag: any) => {
    setMasker(flag);
  }

  // 关闭弹窗
  const closeTc =() => {
    setModalVisible(false)
  }



  // 自动配单
  const handlerGdpp = () => {
    formGdpp.validateFields().then((values: any) => {
      const ckrq1 = moment(values.ckrq1).format('yyyy-MM-DD');
      const params = {
        ckrq1: ckrq1,
        shgzDm: '2',
        shpzh: topData?.shpzh,
        shbzDm: topData?.shbzDm,
        fhr: topData?.fhr,
        ppbzDm: ppbzDm
      };
      gdPp(params);
    });
  }

  return (
      <Modal
        title="滚动匹配"
        destroyOnHidden={true}
        visible={modalVisible}
        width={400}
        mask={{ closable: false }}
        footer={
          <>
            <Button onClick={() => setModalVisible(false)}>取消</Button>
            <Button onClick={handlerGdpp} type="primary">确定</Button>
          </>
        }
        onCancel={() => setModalVisible(false)}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
            <Form
                form={formGdpp}
                name="form"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
              <Form.Item name="ckrq1" label="出口日期起"  labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }} rules={[{ required: true, message: '请输入出口日期起'}]}>
                  <DatePicker locale={locale} style={{ width: 180 }}  placeholder='出口日期起' />
                </Form.Item>
            </Form>
        </Spin>
      </Modal>
  );
};

export default ModalGdpp;
