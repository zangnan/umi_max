/**
 * 台账配单明细-自动配单
 */
import React, { useImperativeHandle, useState } from 'react';
import { Button, Spin, Modal, Form, message, Radio } from 'antd';
import { myxzszClfs } from '@/pages/hts/services/htsApi';
import DDAlert from '@/pages/hts/components/DDAlert';

export interface ModalClfsProps {
  onRef?: any;
  visible?: any;
  gridRef?: any;
}

const ModelClfs: React.FC<ModalClfsProps> = ({
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [masker, setMasker] = useState<boolean>(false); //
  const [params, setParams] = useState<any>(); //

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

   //开启
  const showModal = (param: any) => {
    form.setFieldsValue({bgdcllxDm:'4'});
    setParams(param)
    setModalVisible(true);
  };

  const bcClfs = () => {
    form.validateFields().then((values: any) => {
      if (values?.bgdcllxDm === '0') {
        const tempSelectRows = params?.selectionRows.filter((item: any) => item?.jgfstslxDm === '0');
        if (tempSelectRows?.length > 0) {
          message.error('当前选择包含不退税监管方式，不支持选择退税，请选择征税或免税。');
          return ;
        }
      }
      DDAlert.open({
        title: '提示信息',
        infoType: 'warning',
        modalType: 'confirm',
        okText: '更新',
        info: `是否同步更新系统中未使用的报关单数据？`,
        closeStatus: false,
        content: '',
        button: [
          <Button key='close' onClick={() => saveGx(values, 'N')}>不更新</Button>,
        ],
        okCallbackFn: function () {
          saveGx(values, 'Y');
        }
      })
    });
  }

  const saveGx = (obj: any, gxbz: any) => {
    DDAlert.close();
    setMasker(true);
    obj.gxbz = gxbz;
    obj.jgfsDms = params?.selectionRowKeys;
    myxzszClfs(obj).then((res: any) => {
      setMasker(false);
      const { code, msg } = res;
      if (code === '200') {
        message.success('处理方式保存成功！');
        setModalVisible(false);
        params?.refUnit.current!.reload();
      } else {
        message.error(msg);
      }
    });
  }

  


  return (
      <Modal
        title="处理方式"
        destroyOnHidden={true}
        open={modalVisible}
        width={550}
        mask={{ closable: false }}
        footer={
          <>
            <Button onClick={() => setModalVisible(false)}>取消</Button>
            <Button onClick={bcClfs} type="primary">确定</Button>
          </>
        }
        onCancel={() => setModalVisible(false)}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          
          <div className="body">
              <Form
                form={form}
                name="form"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 17 }}
              >
                <Form.Item name="bgdcllxDm" label="选择处理方式" rules={[{required: true, message: '该项为必录'}]} style={{marginTop: '10px'}}>
                <Radio.Group style={{marginTop: '5px'}}>
                  <Radio key="bgdcllxDm5" value={"4"}>免税</Radio>
                  <Radio key="bgdcllxDm4" value={"5"}>征税</Radio>
                  <Radio key="bgdcllxDm0" value={"0"}>退税</Radio>
                </Radio.Group>
            </Form.Item>
            </Form>
          </div>
        </Spin>
      </Modal>
  );
};

export default ModelClfs;
