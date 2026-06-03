/**
 * 发票开具配置  销售方配置
 */
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Space, message, Spin, Switch } from 'antd';
import ProCard from '@ant-design/pro-card';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import myUtil from '@/pages/common/myUtil';
import { xsfpzcx, xsfpzwh } from '@/services/hts/api';
import { useIntl } from 'umi';

const Xsfpz: React.FC<{ data?: any }> = ({
  data,
}) => {

  const [form] = Form.useForm();
  const [masker, setMasker] = useState<boolean>(false); // 蒙板
  const intl = useIntl(); // 提示信息

  useEffect(() => {
    setMasker(true);
    xsfpzcx({}).then((response) => {
      const { code, body, desc } = response;
      setMasker(false);
      if (code === '200') {
        let temp = { ...body };
        const xsfzhpzVoList = temp.xsfzhpzVoList;
        xsfzhpzVoList?.forEach((item: any) => {
          if (item.qybz === 'Y') {
            item.qybz = true;
          } else {
            item.qybz = false;
          }
        });
        temp.xsfzhpzVoList = xsfzhpzVoList;
        form.setFieldsValue(temp);
        //存入缓存方便进行初始配置校验
        myUtil.sessionStore.setItem('xsfpzStore', temp);
      } else {
        message.error(desc);
      }
    })
  }, [data]);

  // 表单保存方法
  const onSave = async () => {
    let formValues = await form.validateFields();
    const xsfzhpzVoList = formValues.xsfzhpzVoList;
    xsfzhpzVoList.forEach((item: any, index: any) => {
      if (item.qybz === true) {
        item.qybz = 'Y';
      } else {
        item.qybz = 'N';
      }
      item.xh = index + 1;
    });
    const temp = xsfzhpzVoList.filter((item: any) => item.qybz === 'Y');
    if (temp.length != 1) {
      message.info(intl.formatMessage({ id: 'message_ckfp_fppz_khgl_check' }));
      return;
    }
    formValues.xsfzhpzVoList = xsfzhpzVoList;
    console.info(formValues);
    setMasker(true);
    xsfpzwh(formValues).then((response) => {
      const { code, desc } = response;
      setMasker(false);
      if (code === '200') {
        message.success(intl.formatMessage({ id: 'message_ckfp_fppz_common_save_success' }));
        //存入缓存方便进行初始配置校验
        myUtil.sessionStore.setItem('xsfpzStore', { ...formValues });
      } else {
        message.error(desc);
      }
    })
  };

  const reset = () => {
    form.resetFields();
  }
  //开启关闭开户行及账户时，校验只能开启一项
  const changeSwitch = (checked: any, param: any) => {
    const temp = form.getFieldValue("xsfzhpzVoList");
    if ((temp.length === 1 || temp.length > 2) && !checked) {
      temp[param].qybz = true;
      message.info(intl.formatMessage({ id: 'message_ckfp_fppz_khgl_check' }));
      return
    }
    const tempArr: any = [];
    temp.forEach((item: any, index: any) => {
      if (item === undefined) {
        item = {
          qybz: false,
        }
      }
      if (checked) {
        if (index === param) {
          item.qybz = true;
        } else {
          item.qybz = false;
        }
      } else if (!checked) {
        if (index === param) {
          item.qybz = false;
        } else {
          item.qybz = true;
        }
      }
      tempArr.push(item)
    });
    form.setFieldsValue({
      xsfzhpzVoList: tempArr,
    });
  }
  const removeQybzSwitch = (qybzIndex: any) => {
    let tempSign = false;
    const temp = form.getFieldValue("xsfzhpzVoList");
    const tempArr: any = [];
    temp.forEach((item: any, index: any) => {
      if (item === undefined) {
        item = {
          qybz: false,
        }
      }
      if (item.qybz) {
        tempSign = true
      }
      tempArr.push(item)
    });
    if (!tempSign) {
      tempArr[0].qybz = true
    }
    form.setFieldsValue({
      xsfzhpzVoList: tempArr,
    });
  }
  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <ProCard split="horizontal" className="dd_layout_form_01 dd_xsfpz_wraf">
        <ProCard style={{ height: myUtil.heightCalc.getCalc(['header', 'headerTab', 'cardMargin', 'footerBtn']), overflowY: 'auto' }}>
          <Form labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} form={form}>
            <Form.Item label="社会信用代码" name='shxydm'>
              <Input placeholder="请输入社会信用代码" disabled={true} />
            </Form.Item>
            <Form.Item label="纳税人名称" name="xsfNsrmc" rules={[{ required: true, message: '请输入纳税人名称' }]}><Input name="xsfNsrmc" placeholder="请输入纳税人名称" /></Form.Item>
            <Form.Item label="地址" name="dz" rules={[{ required: true, message: '请输入地址' }]}><Input name="dz" placeholder="请输入地址" /></Form.Item>
            <Form.Item label="电话" name="dhhm" rules={[{ required: true, message: '请输入电话' }, { pattern: /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/, message: '请输入正确的电话' }]}><Input name="dhhm" placeholder="请输入电话,例:13412341234或0411-1234567" /></Form.Item>
            <Form.Item label="开票人" name="kpr" rules={[{ required: true, message: '请输入开票人' }]}><Input name="kpr" placeholder="请输入开票人" /></Form.Item>
            <Form.Item label="收款人" name="skr" rules={[{ required: true, message: '请输入收款人' }]}><Input name="skr" placeholder="请输入收款人" /></Form.Item>
            <Form.Item label="复核人" name="fhr1" rules={[{ required: true, message: '请输入复核人' }]}><Input name="fhr1" placeholder="请输入复核人" /></Form.Item>
            <Form.List name="xsfzhpzVoList" >
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Form.Item key={field.name} label="开户行及账号" wrapperCol={{ span: 18 }}>
                      <Space align="baseline">
                        <Form.Item name={[field.name, 'yhzhmc']} noStyle rules={[{ required: true, message: '请输入开户行名称' }]}>
                          <Input placeholder="请输入开户行名称" />
                        </Form.Item>
                        <Form.Item name={[field.name, 'yhzh']} noStyle rules={[{ required: true, message: '请输入开户行账号' }]}>
                          <Input placeholder="请输入开户行账号" />
                        </Form.Item>
                        <Form.Item name={[field.name, 'qybz']} noStyle valuePropName="checked">
                          <Switch checkedChildren="开启" unCheckedChildren="关闭" onChange={(checked: any) => changeSwitch(checked, index)} />
                        </Form.Item>
                        <Button icon={<PlusOutlined />} disabled={fields.length < 3 ? false : true} size="small" onClick={() => add()} />
                        <Button icon={<MinusOutlined />} disabled={fields.length > 1 ? false : true} size="small" onClick={() => { remove(field.name); removeQybzSwitch(field.name) }} />
                        {/* <Form.Item name={[field.name, 'qybz']} noStyle>
                            <Radio value='Y'>启用</Radio> */}
                        {/* {fields.length === 1 ? <><Radio checked>启用</Radio></> : <><Radio >启用</Radio></>} */}
                        {/* </Form.Item> */}
                        {/* {
                            fields.length < 3 ? <><Button icon={<PlusOutlined />} size="small" onClick={() => add()} /></> :
                              <><Button icon={<PlusOutlined />} disabled={} size="small" onClick={() => add()} /></>
                          } */}
                        {/* {
                            fields.length > 1 ? <><Button icon={<MinusOutlined />} size="small" onClick={() => remove(field.name)} /></> :
                              <><Button icon={<MinusOutlined />} disabled size="small" onClick={() => remove(field.name)} /></>
                          } */}
                      </Space>
                    </Form.Item>
                  ))}
                </>
              )}
            </Form.List>
          </Form>
        </ProCard >
        <ProCard className="ddlf01_footer">
          <Space>
            {/* <Button type='default' onClick={reset}>重置</Button> */}
            <Button type='primary' onClick={onSave}>保存</Button>
          </Space>
        </ProCard>
      </ProCard >
    </Spin >
  );
};

export default Xsfpz;