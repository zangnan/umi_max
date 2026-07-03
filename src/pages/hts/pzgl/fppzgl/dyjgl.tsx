/**
 * 发票开具配置  销售方配置
 */
import { intl } from '@/components/DDAssist/util';
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Space, message, Spin, Switch, Radio } from 'antd';
import ProCard from '@ant-design/pro-card';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import myUtil from '@/components/DDAssist/util';
import { dyjcx, dyjglwh } from '@/pages/hts/services/htsApi';
import { cloneDeep } from 'lodash';

const Xsfpz: React.FC<{ data?: any }> = ({
  data,
}) => {

  const [form] = Form.useForm();
  const [masker, setMasker] = useState<boolean>(false); // 蒙板
  const [dyjIds, setDyjIds] = useState<any>([]); // 打印机ids
  // const intl = useIntl(); // 提示信息

  useEffect(() => {
    getDyjList();
  }, [data]);

  const getDyjList = () => {
    setMasker(true);
    dyjcx({}).then((response) => {
      const { code, body, desc } = response;
      setMasker(false);
      if (code === '200') {
        let temp: any = [];
        if (!body || body?.dyjList.length < 1) {
          temp = {dyjList: [{ mrbz: 'Y' }]};
        } else {
          temp = { ...body };
        }
        const dyjList = temp.dyjList;
        let ids: any = [];
        dyjList?.forEach((item: any) => {
          ids.push(item.id);
          if (item.mrbz === 'Y') {
            item.mrbz = true;
          } else {
            item.mrbz = false;
          }
        });
        setDyjIds(ids.join(','));
        temp.dyjList = dyjList;
        form.setFieldsValue(temp);
        //存入缓存方便进行初始配置校验
        myUtil.sessionStore.setItem('dyjglStore', temp);
      } else {
        message.error(desc);
      }
    })
  }
  // 表单保存方法
  const onSave = async () => {
    let formValues = await form.validateFields();
    const dyjList = cloneDeep(formValues.dyjList);
    dyjList.forEach((item: any, index: any) => {
      if (item.mrbz === true) {
        item.mrbz = 'Y';
      } else {
        item.mrbz = 'N';
      }
      item.xh = index + 1;
    });
    const temp = dyjList.filter((item: any) => item.mrbz === 'Y');
    if (temp.length != 1) {
      message.info(intl.formatMessage({ id: 'message_ckfp_fppz_dyjgl_check' }));
      return;
    }
    setMasker(true);
    dyjglwh({ dyjList: dyjList, ids: dyjIds }).then((response) => {
      const { code, desc } = response;
      setMasker(false);
      if (code === '200') {
        getDyjList();
        message.success(intl.formatMessage({ id: 'message_ckfp_fppz_common_save_success' }));
        //存入缓存方便进行初始配置校验
        myUtil.sessionStore.setItem('dyjglStore', { ...formValues });
      } else {
        message.error(desc);
      }
    })
  };

  const reset = () => {
    form.resetFields();
  }
  //开启关闭开户行及账户时，校验只能开启一项
  const changeSwitch = (e: any, i: any) => {
    const value = e.target.checked;
    const temp = form.getFieldValue("dyjList");
    if ((temp.length === 1 || temp.length > 2) && !value) {
      temp[i].mrbz = true;
      message.info(intl.formatMessage({ id: 'message_ckfp_fppz_khgl_check' }));
      return
    }
    const tempArr: any = [];
    temp.forEach((item: any, index: any) => {
      if (item === undefined) {
        item = {
          mrbz: false,
        }
      }
      if (value) {
        if (index === i) {
          item.mrbz = true;
        } else {
          item.mrbz = false;
        }
      } else if (!value) {
        if (index === i) {
          item.mrbz = false;
        } else {
          item.mrbz = true;
        }
      }
      tempArr.push(item)
    });
    form.setFieldsValue({
      dyjList: tempArr,
    });
  }
  const removeQybzSwitch = (qybzIndex: any) => {
    let tempSign = false;
    const temp = form.getFieldValue("dyjList");
    const tempArr: any = [];
    temp.forEach((item: any, index: any) => {
      if (item === undefined) {
        item = {
          mrbz: false,
        }
      }
      if (item.mrbz) {
        tempSign = true
      }
      tempArr.push(item)
    });
    if (!tempSign) {
      tempArr[0].mrbz = true
    }
    form.setFieldsValue({
      dyjList: tempArr,
    });
  }
  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <ProCard split="horizontal" className="dd_layout_form_01 dd_xsfpz_wraf">
        <ProCard style={{ height: myUtil.heightCalc.getCalc(['header', 'headerTab', 'cardMargin', 'footerBtn']), overflowY: 'auto' }}>
          <Form labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} form={form} initialValues={{dyjList: [{ mrbz: true }]}}>
            <Form.List name="dyjList">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Form.Item key={field.name} label="打印机名称" wrapperCol={{ span: 18 }}>
                      <Space align="baseline">
                        <Form.Item name={[field.name, 'printName']} noStyle rules={[{ required: true, message: '请输入打印机名称' }, { type: 'string', max: 50, message: '最大长度不能超过50' }]}>
                          <Input placeholder="例：Canon iR2520 UFRIILT" />
                        </Form.Item>
                        <Form.Item name={[field.name, 'mrbz']} noStyle valuePropName="checked">
                          <Radio onChange={(checked: any) => changeSwitch(checked, index)}>默认</Radio>
                          {/* <Switch checkedChildren="开启" unCheckedChildren="关闭" onChange={(checked: any) => changeSwitch(checked, index)} /> */}
                        </Form.Item>
                        <Button icon={<PlusOutlined />} size="small" onClick={() => add()} />
                        <Button icon={<MinusOutlined />} disabled={fields.length > 1 ? false : true} size="small" onClick={() => { remove(field.name); removeQybzSwitch(field.name) }} />
                      </Space>
                    </Form.Item>
                  ))}
                </>
              )}
            </Form.List>
          </Form>
        </ProCard>
        <ProCard className="ddlf01_footer">
          <Space>
            {/* <Button type='default' onClick={reset}>重置</Button> */}
            <Button type='primary' onClick={onSave}>保存</Button>
          </Space>
        </ProCard>
      </ProCard>
    </Spin>
  );
};

export default Xsfpz;