/**
 * title: 付汇人配置-新增/修改付汇人
 */
import React, {useImperativeHandle, useState} from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Button, Form, Input, message, Modal, Select, Spin, Tooltip} from 'antd';
import {QuestionCircleOutlined} from '@ant-design/icons';
import myUtil from '@/components/DDAssist/util';
import {getFhrInfo, saveOrUpdateFhr } from '@/pages/hts/services/htsApi';
import baseValidator from '@/components/DDAssist/field/baseValidator';

export interface BdjgProps {
  onRef?: any;
  yhlx?: any;
}

const ModalForm: React.FC<BdjgProps> = ({
                                          onRef, yhlx
                                        }) => {
  const [masker, setMasker] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectOption, setSelectOption] = useState<any>([]);
  const [name, setName] = useState<any>([]);
  const [initParam, setInitParam] = useState<any>({});
  const [form] = Form.useForm();
  const [ppbzselectOption, setPpbzSelectOption] = useState<any>([]);

  // 开启
  const showModal = async (param: any, record: any, name: any) => {
    setName(name);
    const tmpCodeTable: any = await myUtil.code.getCodeFromServerT1('CODE_DM_ZXSB_SHGZ:01');
    setSelectOption(tmpCodeTable);

    const ppbzCodeTable: any = await myUtil.code.getCodeFromServerT1('CODE_DM_ZXSB_PPBZ:01');
    setPpbzSelectOption(ppbzCodeTable);

    // 初始化加载页面
    if (record?.fhr) {
      await getFhrInfo({"fhruuid": record?.fhruuid}).then((res: any) => {
        const {code, msg, body} = res;
        if (code == '200') {
          form.setFieldsValue(body);
        } else {
          message.error(msg)
        }
      });
    } else {
      form.resetFields();
    }
    setInitParam(param);
    setModalVisible(true);
    setMasker(false);

  };
  // 保存
  const save = () => {
    form.validateFields().then(values => {
      setMasker(true);
      const params = form.getFieldsValue(true);

      saveOrUpdateFhr(params).then((res: any) => {
        const {code, msg} = res;
        setMasker(false);
        if (code == '200') {
          close();
          message.success("保存成功！");
        } else {
          message.error(msg)
        }
      });
    })
  };

  const close = () => {
    setModalVisible(false);
    form.resetFields();
    initParam?.refUnit.current?.reload2();
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });
  const fxTitleTooltip = ['作为收汇水单与报关单匹配的关键逻辑：', <br/>, '1. 合同收汇：根据报关单合同号与收汇水单关联的业务号进行匹配；',
    <br/>, '2. 关单收汇：根据报关单号与收汇水单关联的业务号进行匹配；', <br/>, '3. 滚动收汇：根据相同境外收货人的报关单按出口日期顺序滚动匹配。']

  return (
    <Modal
      title={name}
      open={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X1}
      onCancel={() => close()}
      footer={(<>
        <Button onClick={() => close()} type="default">关闭</Button>
        <Button onClick={() => save()} type="primary">保存</Button>
      </>)}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <Form
          form={form}
          name="form"
          labelCol={{span: 6}}
          wrapperCol={{span: 16}}
        >
          <Form.Item label="付汇人" name="fhr" rules={[{required: true, message: '付汇人不允许为空'}, baseValidator.range2({min: 0, max: 75})]}>
            <Input placeholder="请输入付汇人"/>
          </Form.Item>
          <Form.Item label="付汇人别名" name="fhrbm" rules={[baseValidator.range2({min: 0, max: 75})]}>
            <Input placeholder="请输入付汇人别名"/>
          </Form.Item>
          <Form.Item name="shgzDm" rules={[{required: true, message: '付汇方式不允许为空'}, baseValidator.range2({min: 0, max: 75})]}
                     label={<Tooltip title={fxTitleTooltip}>
                       付汇方式<QuestionCircleOutlined/>
                     </Tooltip>}>
            <Select placeholder="请选择付汇方式">
              {selectOption.map((item: any) => (
                <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="ppbzDm" rules={[{required: true, message: '匹配币制不允许为空'}, baseValidator.range2({min: 0, max: 75})]} label="匹配币制">
            <Select placeholder="请选匹配币制">
              {ppbzselectOption.map((item: any) => (
                <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default ModalForm;
