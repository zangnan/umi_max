/**
 * title: 企业管理-三方服务授权
 */
import React, {useImperativeHandle, useState} from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Button, DatePicker, Form, message, Modal, Select, Spin} from 'antd';
import myUtil from '@/components/DDAssist/util';
import {getUrlCode, sffwsqForQxqygl } from '@/pages/hts/services/htsApi';
import moment from "moment";

export interface BdjgProps {
  onRef?: any;
}

const ModalForm: React.FC<BdjgProps> = ({
                                          onRef
                                        }) => {
  const [masker, setMasker] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [initParam, setInitParam] = useState<any>({});
  const [form] = Form.useForm();
  const [selectSffw, setSffw] = useState<any>([]);
  const [selectSfsqzt, setSelectSfsqztDm] = useState<any>([]);
  const [sbqyuuidDqlb, setSbqyuuidDqlb] = useState<any>([]);

  const fetchData = async () => {
    const tempCode = await myUtil.code.getCodeFromServerT1('CODE_DM_ZXSB_SFFWSQZT:01');
    setSelectSfsqztDm(tempCode);
  };

  // 开启
  const showModal = async (param: any, record: any, name: any) => {
    setSbqyuuidDqlb(record.sbqyuuidDqlb);
    fetchData();
    getUrlCode('/yw/dditSaas/qxqy/querySffwBySbqyuuidForQxqygl', {sbqyuuidDqlb: record.sbqyuuidDqlb}).then((res: any) => {
      const {code, msg, body} = res;
      if (code == '200') {
        setSffw(body);
        setInitParam(param);
        setModalVisible(true);
        setMasker(false);
        // 每次开启还原初始值
        form.setFieldsValue({
          sffwDm: '',
          sqztDm: '',
          yxqq: moment(),
          yxqz: ''
        });
      } else {
        message.error(msg);
      }
    });
  };

  // 保存
  const save = () => {
    form.validateFields().then(values => {
      setMasker(true);
      const params = {
        ...values,
        yxqq: values.yxqq ? values.yxqq.format('YYYY-MM-DD') : undefined,
        yxqz: values.yxqz ? values.yxqz.format('YYYY-MM-DD') : undefined
      };
      params['sbqyuuidDqlb'] = sbqyuuidDqlb;
      sffwsqForQxqygl(params).then((res: any) => {
        const {code, msg} = res;
        setMasker(false);
        if (code == '200') {
          message.success("操作成功！");
          close();
          initParam?.unitRef.current?.reload2();
        } else {
          message.error(msg)
        }
      });
    })
  };

  const close = () => {
    setModalVisible(false);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <Modal
      title={'三方授权'}
      open={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X1}
      destroyOnHidden={true}
      onCancel={() => close()}
      footer={(<>
        <Button onClick={() => save()} type="primary">保存</Button>
        <Button onClick={() => close()} type="default">关闭</Button>
      </>)}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <Form
          form={form}
          name="form"
          labelCol={{span: 6}}
          wrapperCol={{span: 16}}
        >
          <Form.Item label="三方服务" name="sffwDm" rules={[{required: true, message: '请选择三方服务'}]}>
            <Select placeholder="请选择">
              {selectSffw.map((item: any) => {
                return <Select.Option value={item.code}>{item.name}</Select.Option>
              })}
            </Select>
          </Form.Item>

          <Form.Item label="授权状态" name="sqztDm" rules={[{required: true, message: '请选择授权状态'}]}>
            <Select placeholder="请选择">
              {selectSfsqzt.map((item: any) => {
                return <Select.Option value={item.code}>{item.name}</Select.Option>
              })}
            </Select>
          </Form.Item>

          <Form.Item name="yxqq" label="有效期起" rules={[{required: true, message: '请输入授权有效期起'}]}>
            <DatePicker format={myUtil.date.formatList()}/>
          </Form.Item>

          <Form.Item name="yxqz" label="有效期止" rules={[{required: true, message: '请输入授权有效期止'}]}>
            <DatePicker format={myUtil.date.formatList()}/>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default ModalForm;
