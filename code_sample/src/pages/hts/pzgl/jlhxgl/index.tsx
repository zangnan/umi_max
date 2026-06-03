/**
 * 发票开具配置  基础开票配置
 */
import React, { useEffect, useState } from 'react';
import { Form, message, Radio, Space, Spin } from 'antd';
import '../style.less';
import { useAccess, Access } from 'umi';
import {jlhxpzcx ,jlhxpzwh} from '@/services/hts/api';

const Index: React.FC<{ data?: any, funcRef?: any }> = ({
  data,
  funcRef
}) => {
  const [form] = Form.useForm();
  const [masker, setMasker] = useState<any>(false);



  const onChangeCyfxgzDm = (values: any) => {
    const jmbgdjshlDm = form.getFieldValue('jmbgdjshlDm');
    const data = {"params":{"jmcyfxldDm":values.target.value,"jmbgdjshlDm":jmbgdjshlDm},"ctbs":"jmcyfxldDm"};
    jlhxpzwh(data).then((res:any)=>{
      setMasker(false);
      const {code, msg} = res;
      if(code === '200') {
        message.success("保存成功");
      } else {
        message.error(msg)
      }
    });

  };

  const onChangeBgdjshlgzDm = (values: any) => {
    const jmcyfxldDm = form.getFieldValue('jmcyfxldDm');
    const data = {"params":{"jmcyfxldDm":jmcyfxldDm,"jmbgdjshlDm":values.target.value},"ctbs":"jmbgdjshlDm"};
    jlhxpzwh(data).then((res:any)=>{
      setMasker(false);
      const {code, msg} = res;
      if(code === '200') {
        message.success("保存成功");
      } else {
        message.error(msg)
      }
    });

  }


  useEffect(() => {
    setMasker(true);
    jlhxpzcx({}).then((res:any)=>{
      setMasker(false);
      const {code, body, msg} = res;
      if(code === '200') {
        form.setFieldsValue(body);
      } else {
        message.error(msg)
      }
    })
  }, [data]);



  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <Form className="jckppz_wrap" form={form} key={data}>
        <Space size={[20, 20]} wrap className="tile_group">
        <div className="fpkjpz_titl">
            <div className="group_tile_c1">差异分析规则</div>
            <div className="title_main">
              <Form.Item name="jmcyfxldDm">
                <Radio.Group onChange={onChangeCyfxgzDm}>
                  <Space direction="vertical" size={10}>
                    <Radio value='1'> 按21位报关单分析</Radio>
                    <Radio value='2'> 按18位报关单总金额分析</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>
          <div className="fpkjpz_titl">
            <div className="group_tile_c1">报关单计算汇率规则</div>
            <div className="title_main">
              <Form.Item name="jmbgdjshlDm">
                <Radio.Group  onChange={onChangeBgdjshlgzDm}>
                  <Space direction="vertical" size={10}>
                    <Radio value='1'>海关汇率</Radio>
                    <Radio value='2'>退税汇率</Radio>
                  </Space> 
                </Radio.Group>
              </Form.Item>
            </div>
          </div>
        </Space>
      </Form>
    </Spin>
  );
};

export default Index;
