/**
 * title: 角色管理-新增/修改角色
 * author: wx
 */
import React, { useImperativeHandle, useState } from 'react';
import pro from '@/pages/common/proConfig';
import { Modal, Button, Form, Spin, Input, Checkbox, message, Select } from 'antd';
import { saveOrUpdateJs } from '@/services/hts/api';
import baseValidator from '@/pages/common/field/baseValidator';
import { useAccess } from 'umi';
import qxUtil from '@/pages/common/qxUtil';
import myUtil from '@/pages/common/myUtil';

export interface BdjgProps {
  onRef?: any;
}

const ModalForm: React.FC<BdjgProps> = ({
  onRef,
}) => {
  const [masker, setMasker] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [initParam, setInitParam] = useState<any>({});
  const [form] = Form.useForm();
  const [name, setName] = useState();
  const [yhlx, setYhlx] = useState<any>();
  const [selectOption, setSelectOption] = useState<any>();

  const access = useAccess(); // 权限
  const paramPtgly = {
    accessObj: access,
  }

  // 开启
  const showModal = async (param: any, record: any, flag: any) => {
    setYhlx(qxUtil.getYhlx(paramPtgly));
    setName(flag);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
    setInitParam(param);
    setModalVisible(true);
    const tmpCodeTable: any = await myUtil.code.getCodeFromServerT1('CODE_QX_JS', '01');
    setSelectOption(tmpCodeTable);

  };
  // 保存
  const save = () => {
    form.validateFields().then(values => {
      setMasker(true);
      const params = {
        jsDm: form.getFieldValue('jsDm') || '',
        jsmc: form.getFieldValue('jsmc').trim(),
        jsms: form.getFieldValue('jsms').trim(),
      }
      if(name != "修改" && yhlx != '13'){
        params.jcCd = form.getFieldValue('jcCd') ? 'Y' : 'N'
      }
      if(name != "修改"){
        params.jcjsDm = form.getFieldValue('jcjsDm')
      }

      saveOrUpdateJs(params).then((res: any) => {
        const { code, msg } = res;
        setMasker(false);
        if (code == '200') {
          close();
          message.success("保存成功！");
          // initParam?.gridRef?.current!.reload();
          initParam?.unitRef.current?.reload2();
        } else {
          message.error(msg)
        }
      })
    })
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });
  const formItemLayout = {
    labelCol: {
      xs: { span: 6 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 16 },
      sm: { span: 16 },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 16,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 6,
      },
    },
  };


  const close = () => { 
   setModalVisible(false);
  form.resetFields();
   setInitParam({});
  }


  return (
    <Modal
      title={name}
      visible={modalVisible}
      width={pro.c_modal_width_x1}
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
          {...formItemLayout}
        >
          <Form.Item name="jsmc" label="角色名称" rules={[{ required: true, message: '请录入角色名称' }, baseValidator.empty]}>
            <Input placeholder="请录入角色名称" maxLength={200} />
          </Form.Item>
          <Form.Item name="jsms" label="角色描述" rules={[{ required: true, message: '请录入角色描述' }, baseValidator.empty]}>
            <Input placeholder="请录入角色描述" maxLength={250} />
          </Form.Item>
          {
            yhlx == "13" || name == '修改' ? <></> :
              <Form.Item name="jcCd" valuePropName="checked" {...tailFormItemLayout} >
                <Checkbox value="Y">继承当前用户菜单</Checkbox>
              </Form.Item>
          }
          {
            yhlx == "13" && name != '修改'?
              <Form.Item name="jcjsDm" label="继承角色">
                <Select placeholder="请选择继承角色">
                  {selectOption?.map((item: any) => (
                    <Select.Option key={item.code} value={item.code} >{item.name}</Select.Option>
                  ))}
                </Select> 
              </Form.Item> : <></>
          }
        </Form>
      </Spin>
    </Modal>
  );
};

export default ModalForm;
