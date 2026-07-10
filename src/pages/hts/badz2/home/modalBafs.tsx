/**
 * title: 备案单证目录
 */
import { Modal, Button, Form, Radio, Space, Tooltip, message } from 'antd';
import React, { useRef, useState, useImperativeHandle } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { saveOrUpdateBafs } from '@/pages/hts/services/htsApi';
import ModalBadzml from '../common/ml';
import { QuestionCircleOutlined } from '@ant-design/icons';
import '../style.less';


export type BadzylModal = {
  visible?: any;
  onRef?: any;
}

const BadzylModal: React.FC<BadzylModal> = ({
  visible = false,
  onRef,
}) => {
  const [form] = Form.useForm();

  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [mainParams, setMainParams] = useState<any>({});
  const [bafs, setBafs] = useState<any>('1');

  
  const modalBadzmlRef: any = useRef();

  // 开启
  const showModal = (param: any) => {
    const { record } = param;
    const bafs = record.dzbaBz === 'Y' ? '2' : '1';
    setBafs(bafs);
    form.setFieldsValue({ bafs: bafs, ppgzDm: record.ppgzDm })
    setMainParams(param);
    setModalVisible(true);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });
  // 关闭弹窗
  const closeModalVisible = () => {
    setModalVisible(false)
  }

  // 备案方式保存
  const bafsSave = () => {
    const { record, refUnit } = mainParams;
    const formValue = form.getFieldsValue();
    if (formValue.bafs === '2') { // 电子化备案
      const params = { ...record, bafs: formValue.bafs, ppgzDm: formValue.ppgzDm }
      saveOrUpdateBafs(params).then((response) => {
        const { code, desc } = response;
        if (code === '200') {
          closeModalVisible();
          refUnit.current!.reload();
          message.success('已切换为电子备案');
        } else {
          message.error(desc);
        }
      })
    } else if (formValue.bafs === '1') { // 纸质化备案
      modalBadzmlRef.current?.showModal(mainParams, '1');
      closeModalVisible();
    }
  }

  // 确认
  const confirm = () => {
    const { record } = mainParams;
    if (record.dzbaBz == 'Y' || record.zzbaBz == 'Y') {
      Modal.confirm({
        title: '确认要切换备案方式，且清空当前备案方式下的数据吗？',
        okText: '确认',
        cancelText: '取消',
        wrapClassName: 'modal-position',
        onOk() {
          if (record.dzbaBz == 'Y' && record.bawcbz == 'Y') {
            closeModalVisible();
            message.error('当前数据已装订成册，如需切换备案方式请先进行撤销备案操作！');
            return;
          }
          bafsSave();
        }
      });
    } else {
      bafsSave();
    }
  }
  return (
    <>
      <Modal
        title={`选择备案方式`}
        centered
        destroyOnHidden
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X1}
        zIndex={997}
        footer={
          <>
            <Button onClick={closeModalVisible} type="default">关闭</Button>
            <Button onClick={confirm} type="primary">确认</Button>
          </>
        }
        onCancel={closeModalVisible}
      >
        <Form
          name="form"
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ bafs: '1', ppgzDm: '01' }}
        >
          <Form.Item name="bafs" label="备案方式" tooltip="税务机关按规定进行单证备案核查时，你司需通过该服务平台上传备案单证电子凭证或影像资料。">
            <Radio.Group onChange={() => {
              setBafs(form.getFieldValue('bafs'));
              form.setFieldsValue({ ppgzDm: '01' })
            }}>
              <Radio value="1">纸质化备案</Radio>
              <Radio value="2">电子化备案</Radio>
            </Radio.Group>
          </Form.Item>
          {
            bafs === '2' ? 
            <Form.Item name="ppgzDm" label="匹配规则">
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value="01" style={{padding: '5px 0'}}>
                    <span style={{paddingRight: '12px'}}>按报关单匹配</span>
                  </Radio>
                  <Radio value="02">
                    <span style={{paddingRight: '12px'}}>按所属期批次匹配</span>
                  </Radio>
                </Space>
              </Radio.Group>
            </Form.Item> : <></>
          }
          <div className="bsxz_sm">
            <div>纸质化备案：</div>
            <div>（1）适用于自行选择纸质化备案方式的企业</div>
            <div>（2）适用于自行选择通过ERP等内部管理系统进行单证备案的大型企业</div>
          </div>
          <div className="bsxz_sm" style={{marginTop: '12px'}}>
            <div>电子化备案：</div>
            <div>适用自行选择电子单证备案的企业</div>
          </div>
        </Form>
      </Modal>
      <ModalBadzml onRef={modalBadzmlRef} type={'bafs'} />
    </>
  )
};

export default BadzylModal;
