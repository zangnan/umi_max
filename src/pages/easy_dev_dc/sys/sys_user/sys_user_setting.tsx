import React, { useEffect } from 'react';
import DDBaseForm from '@/components/DDForm/DDBaseForm';
import { Form, Button } from 'antd';
import ProCard from '@ant-design/pro-card';
import { useModel } from 'umi';
import { saveOrUpdate } from '@/services/hts/api';
import myUtil from '@/components/DDAssist/util';

const UserSetting: React.FC<unknown> = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [ form1 ] = Form.useForm();
  const [ form2 ] = Form.useForm();
  const Func: any = {};

  // 表单校验
  Func.validator = {
    // 自定义校验
    validatorPasswordConfirm: () => {
      const validator = async (_rule: any, value: any) => {
        const password = form2.getFieldValue('password_new')
        if (password === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('请输入相同的密码！'));
      };
      return { validator };
    },
  };

  // 表单项 用户信息
  const formConfig1 = {
    form_layout_type: 'vertical',
    form_label_input_layout: 'horizontal',
    form_items:[
      { name: 'loginName', type: 'Input', label: '登录账号', disabled: 'disabled' },
      { name: 'userName', type: 'Input', label: ' 姓名', rules: [
        { type: 'base_required' },
        { type: 'base_string', range: 40 },
      ] },
      { name: 'phone', type: 'Input', label: '手机', rules: [
        { type: 'base_required' },
        { type: 'base_type_phone' },
      ]},
    ]
  };

  // 表单项 设置密码
  const formConfig2 = {
    form_layout_type: 'vertical',
    form_label_input_layout: 'horizontal',
    form_items:[
      { name: 'password_new', type: 'Password', label: '密码', rules: [
        { type: 'base_required' },
        { type: 'base_string', range: [6, 20]},
      ] },
      { name: 'password_new_confirm', type: 'Password', label: '确认密码', rules: [
        { type: 'base_required' },
        { func: 'validatorPasswordConfirm' }
      ] },
    ]
  };

  // init
  const fetchUserInfo = async () => {
    let form1InitValue: any = {
      loginName: currentUser.body.loginName,
      userName: currentUser.body.userName,
      phone: currentUser.body.phone,
    }
    form1.setFieldsValue(form1InitValue);
  };

  useEffect(() => {
    fetchUserInfo();
  });

  // 保存用户信息
  const handleSave0 = () => {
    form1.validateFields().then(values => {
      let formParam: any = {
        phone: values.phone,
        login_name: values.userName,
        user_id: currentUser.body.userId,
        key: 'm_sys_user',
        formType: 'edit',
      };
      saveOrUpdate(formParam).then((res: any) => {
        myUtil.modal.responseInfo(res);
      });
    })
  }

  // 保存密码
  const handleSave1 = () => {
    // params.password = Base64.encode(password);
    form2.validateFields().then(values => {
      let formParam: any = {
        password: values.password_new,
        user_id: currentUser.body.userId,
        key: 'm_sys_user',
        formType: 'edit',
      };
      saveOrUpdate(formParam).then((res: any) => {
        myUtil.modal.responseInfo(res);
      });
    })
  }

  return (
    <ProCard split="horizontal">
      <ProCard title="更新用户信息">
        <div style={{ width: 700 }}>
          <DDBaseForm config={formConfig1} form={form1} layoutType="vertical" labelInputLayout="horizontal" />
          <div>
            <Button onClick={handleSave0} size='middle' type='primary'>保存用户信息</Button>
          </div>
        </div>
      </ProCard>
      <ProCard title="更新密码">
        <div style={{ width: 700 }}>
          <DDBaseForm config={formConfig2} form={form2} func={Func} layoutType="vertical" labelInputLayout="horizontal" />
          <div>
            <Button onClick={handleSave1} size='middle' type='primary'>保存密码</Button>
          </div>
        </div>
      </ProCard>
    </ProCard>
  );
};

export default UserSetting;
