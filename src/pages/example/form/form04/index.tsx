import React, { useState } from 'react';
import { ProCard } from '@ant-design/pro-components';
import { Button, Form } from 'antd';
import DDBaseForm from '@/components/DDForm/DDBaseForm';
import formConfig from './config';
import { Typography } from 'antd';
import { FooterToolbar } from '@ant-design/pro-components';
import { testReturnCode200 } from '@/services/hts/api';
import { cloneDeep } from 'lodash';

const TableList: React.FC<unknown> = () => {
  const [myConfig, setMyConfig] = useState<any>(formConfig);
  const [form] = Form.useForm();
  const Func: any = {};

  const onReset = () => {
    form.resetFields();
  };

  const onSave = () => {
    form.validateFields().then(async (values: any) => {
      console.info(values)
    });
  };

  const changeSelectContext = () => {
    testReturnCode200({}).then((response1) => {
      let tmpMyConfig = cloneDeep(myConfig);
      tmpMyConfig.form_items[0].label = 'aaa';
      tmpMyConfig.form_items[0].list = [
        { value: 'newa', name: '新A' },
        { value: 'newb', name: '新B' },
        { value: 'newc', name: '新C' },
      ];
      setMyConfig(tmpMyConfig);
      form.setFieldsValue({
        test1: 'newc',
      });
    });
  };

  return (<>
    <Typography.Title level={4}>表单 - 自定义事件及校验</Typography.Title>
    <ProCard>
      <DDBaseForm config={myConfig} form={form} initialValues={{}} func={Func}/>
      <FooterToolbar >
        <Button type='primary' onClick={changeSelectContext}>改变下拉框内容</Button>
        <Button type='default' onClick={onReset}>重置</Button>
        <Button type='primary' onClick={onSave}>保存</Button>
      </FooterToolbar>
    </ProCard>
  </>);
};

export default TableList;
