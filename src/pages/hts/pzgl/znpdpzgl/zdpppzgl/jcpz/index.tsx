/**
 * 配置管理-自动匹配配置管理-基础配置
 */
import React, { useState, useEffect } from 'react';
import { Form, Input, message, Radio, Space, Spin} from 'antd';
import { znpdJcsjcx, znpdJcsjsave } from '@/pages/hts/services/htsApi';
import '../../../style.less'
const Jcsz: React.FC<{ data?: any }> = ({
  data,
}) => {
  const [masker, setMasker] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    getJcxxData();
  }, []);

  const getJcxxData = () => {
    setMasker(true);
    znpdJcsjcx({}).then((res:any)=>{
      setMasker(false);
      const {code, body, desc} = res;
      if(code === '200') {
        form.setFieldsValue(body);
      } else {
        message.error(desc);
      }
    })
  }

  const onChange = (e:any) => {
    const values = form.getFieldsValue(true);
    saveChange(values, name);
  }
  
  const saveChange = (values:any, name: any) => {
    setMasker(true);
    znpdJcsjsave(values).then((res:any)=>{
      setMasker(false);
      const {code, desc} = res;
      if(code === '200') {
        message.success('保存成功')
      } else {
        message.error(desc);
      }
    })
  }


  return (
    <>
    <Spin tip="Loading..." spinning={masker} delay={100}>
    <Form className="znpdJcpz_wrap" form={form} key={data}>
        <Form.Item name="uuid" style={{display:'none'}}>
          <Input />
        </Form.Item>
        <Space size={[20, 20]} wrap className="tile_group">
          <div className="fpkjpz_titl">
            <div className="group_tile_c1">配单单位名称</div>
            <div className="title_main">
              <Form.Item name="pddwdzbz">
                <Radio.Group onChange={()=>onChange('pddwdzbz')}>
                  <Space direction="vertical" size={10}>
                    <Radio value='N'>不使用单位管理的对照关系配单</Radio>
                    <Radio value='Y'>使用单位管理的对照关系配单</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>
          <div className="fpkjpz_titl">
            <div className="group_tile_c1">配单商品名称</div>
            <div className="title_main">
              <Form.Item name="pddwdzhlkgbz">
                <Radio.Group onChange={()=>onChange('pddwdzhlkgbz')} >
                  <Space direction="vertical" size={10}>
                    <Radio value='Y'>忽略商品名称中的空格</Radio>
                    <Radio value='N'>不忽略商品名称中的空格</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>
        </Space>
      </Form>
    </Spin>
    </>
  );
};
export default Jcsz;
