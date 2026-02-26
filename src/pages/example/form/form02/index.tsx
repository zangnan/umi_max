import React, { useEffect } from 'react';
import { ProCard } from '@ant-design/pro-components';
import { Button, Form } from 'antd';
import DDBaseForm from '@/components/DDForm/DDBaseForm';
import formConfig from './config';
import { Typography } from 'antd';
import { FooterToolbar } from '@ant-design/pro-components';
import myUtil from '@/components/DDAssist/util';
import formUtil from '@/components/DDForm/formUtil';
import { testReturnCode200 } from '@/services/hts/api';

const TableList: React.FC<unknown> = () => {
  const [form] = Form.useForm();
  const Func: any = {};
  // 表单校验
  Func.validator = {
    // 自定义校验
    myValidator51: (form: any) => {
      const formId = form?.__INTERNAL__?.name;    // 表单id
      const test01 = form?.getFieldValue('test01');    // 表单其他项目
      console.info(formId);
      console.info(test01);
      const validator = async (_rule: any, value: any) => {
        if (value !== '111') {
          return Promise.reject(new Error('自定义校验error'));
        }
        return Promise.resolve();
      };
      return { validator };
    },

    // 自定义校验 后端
    myValidator52: (form: any) => {
      const formId = form?.__INTERNAL__?.name;    // 表单id
      const test01 = form?.getFieldValue('test01');    // 表单其他项目
      console.info(formId);
      console.info(test01);
      const validator = async (_rule: any, value: any) => {
        console.info(_rule);
        console.info(value);
        await testReturnCode500({}).then((response) => {
          if (response.code === '500') {
            return Promise.reject(new Error('error 测试后端校验'));
          }
          return Promise.resolve();
        }).catch((err) => {
          return Promise.reject(err);
        });
        return Promise.resolve();
      };
      return { validator };
    },

    // 自定义校验
    myValidator02: (form: any) => {
      const test91 = form?.getFieldValue('test91');    // 表单其他项目
      const validator = async (_rule: any, value: any) => {
        if (test91) {
          if (!value) {
            return Promise.reject(new Error('按需必录项目'));
          }
        }
        return Promise.resolve();
      };
      return { validator };
    },
  }

  // 表单事件：OnChange
  Func.eventOnChange = {
    test91: (param: any) => {
      const { event, form, myItems, setMyItems } = param;
      // 表单id、录入值
      const inputValue = event.target.value;
      // 获取其他项目值
      const test31 = form.getFieldValue('test31') || 0;
      // 表单赋值
      form.setFieldsValue({
        test01: 'onBlur测试数据',
        test11: myUtil.text.leadingZeroize(inputValue, 8),
        test13: test31,
      });
      // 按需必填字段
      myItems[1].rules = [{ type: 'base_required', message: '必录项可选提示信息' }];
      // 设置只读非只读
      myItems[15].disabled = true;
      setMyItems([...formUtil.init({ items: myItems || [] })]);
    },
    test94: (param: any) => {
      const { value, form, option } = param;
      console.info(value);
      console.info(form);
      console.info(option);
    },
    test95: (param: any) => {
      const { date, dateString, form } = param;
      console.info(date);
      console.info(dateString);
      console.info(form);
    },
    test83: (param: any) => {
      const { value, form } = param;
      form.setFieldsValue({
        test84: myUtil.code.getCodeValByKey(value, 'code_dm_ckts_cktmsywlx'),
      });
    },
  }

  // 表单事件：OnBlur
  Func.eventOnBlur = {
    test92: (param: any) => {
      console.info('表单事件OnBlur', param.event.target.value, param);
    }
  }

  // 表单事件：OnFocus
  Func.eventOnFocus = {
    test93: (param: any) => {
      console.info('表单事件OnFocus', param.event.target.value, param);
    }
  }

  const onReset = () => {
    form.resetFields();
  };

  const onSave = () => {
    form.validateFields().then(async (values: any) => {
      console.info(values)
    });
  };

  useEffect(() => {
    testReturnCode200({}).then((response1) => {
      form.setFieldsValue({
        test91: '哈哈哈哈2222',
        test92: '哈哈哈哈1111',
      });
    });
  }, []);

  return (<>
    <Typography.Title level={4}>表单 - 自定义事件及校验</Typography.Title>
    <ProCard>
      <DDBaseForm config={formConfig} form={form} initialValues={{}} func={Func}/>
      <FooterToolbar >
        <Button type='default' onClick={onReset}>重置</Button>
        <Button type='primary' onClick={onSave}>保存</Button>
      </FooterToolbar>
    </ProCard>
  </>);
};

export default TableList;
