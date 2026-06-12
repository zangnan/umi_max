import { Form } from 'antd';
import React, { useImperativeHandle } from 'react';
import myUtil from '@/components/DDAssist/util';

export type DDAlertContentFormProps = {
  formItems?: any,
  onRef?: any,
  initValue?: any,
}

const AlertContentForm: React.FC<DDAlertContentFormProps> = ({
  formItems,
  onRef,
  initValue,
}) => {
  const [form] = Form.useForm();
  const getFormData = () => {
    return form.getFieldsValue();
  }
  const validateFields = () => {
    return form.validateFields();
  }

  const forms = () => {
    return form;
  }
  useImperativeHandle(onRef, () => {
    return {
      getFormData,
      validateFields,
      forms,
    };
  });
  return (
    <>
      <Form {...myUtil.layout.formX1.layout}
          colon={false}
          className='dd_form_x1'
          form={form}
          name="alert-content-form"
          initialValues={initValue}
          autoComplete="off">
        {formItems}
      </Form>
    </>
  );
};
export default AlertContentForm;
