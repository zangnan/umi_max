import React, { useEffect } from 'react';
import { ProCard } from '@ant-design/pro-components';
import { Button, Form } from 'antd';
import DDBaseForm from '@/components/DDForm/DDBaseForm';
import formConfig from './config';
import { Typography } from 'antd';
import { FooterToolbar } from '@ant-design/pro-components';
import dayjs from "dayjs";

const TableList: React.FC<unknown> = () => {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      ckbgdh: '123456789012345678901',
      ckrq1: dayjs(new Date(1579072395000)),
      fj1: [
        { uid: '10001', name: 'test_app_exc1.xlsx' },
        { uid: '10002', name: 'test_app.xlsx' },
      ],
      markdownEditor: {
        mdContent: '# 欢迎使用Markdown编辑器\n\n输入内容后右侧将实时预览'
      }
    });
  }, []);

  const onReset = () => {
    form.resetFields();
  };

  const onSave = () => {
    form.validateFields().then(async (values: any) => {
      values.richTextEditor = values.richTextEditor?.toHTML();
      console.info(values);
    });
  };

  return (<>
    <Typography.Title level={4}>表单 - 简单示例</Typography.Title>
    <ProCard>
      <DDBaseForm config={formConfig} form={form} initialValues={{}}/>
      <FooterToolbar >
        <Button type='default' onClick={onReset}>重置</Button>
        <Button type='primary' onClick={onSave}>保存</Button>
      </FooterToolbar>
    </ProCard>
  </>);
};

export default TableList;
