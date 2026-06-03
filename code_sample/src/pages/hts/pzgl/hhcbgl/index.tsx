import React, { useState, useEffect } from 'react';
import { Button, Form, Space, Spin, InputNumber, message, Row } from 'antd';
import ProCard from '@ant-design/pro-card';
import styles from './style.less';
import myUtil from '@/pages/common/myUtil';
import { queryHhcb, updateHhcb } from '@/services/hts/api';

const Index: React.FC<unknown> = () => {
  const [form] = Form.useForm();
  //下载按钮是否显示
  const [masker, setMasker] = useState(false);


  useEffect(() => {
    init();
  }, []);

  const init = () => {
    setMasker(true);
    queryHhcb({}).then((response: any) => {
      setMasker(false);
      const { code, msg, body } = response;
      if (code === '200') {
        const hhcbhlxx = body[0].hhcbhlxx;
        const hhcbhlsx = body[0].hhcbhlsx;
        if(hhcbhlxx && hhcbhlsx){
          form.setFieldsValue({ hhcbhlxx: hhcbhlxx, hhcbhlsx: hhcbhlsx })
        }
      } else {
        message.error(msg);
      }
    });
  }


  const save = async () => {
    const data = await form.validateFields();
    if(data?.hhcbhlsx == 0 && data?.hhcbhlxx == 0){
      message.info("换汇成本上限及换汇成本下限不可同时为0！");
      return;
    }else{
      setMasker(true);
      updateHhcb(data).then((response: any) => {
      setMasker(false);
        const { code, msg } = response;
        if (code === '200') {
          message.success('保存成功！');
        } else {
          message.error(msg);
        }
      });
    }
  }


  return (
    <>
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <ProCard split="horizontal" className="dd_layout_form_01 dd_hgdzxzjy" >
          <ProCard style={{ height: myUtil.heightCalc.getCalc(['header', 'cardMargin', 'footerBtn']), overflowY: 'auto' }}>
            <div className={styles.groupTit}>换汇成本管理</div>
            <br />
            <div style={{ marginLeft: "30px" }}>
              <Form form={form} layout="inline" colon={false} >
                <Space>
                  <div>换汇成本合理范围：</div>
                  <Form.Item name="hhcbhlxx" label="换汇成本合理下限" initialValue={5}>
                    <InputNumber className={styles.hlgl} min={0} max={9999999999999999.999999}/>
                  </Form.Item>
                  <Form.Item name="hhcbhlsx" label="合理上限" initialValue={7}>
                    <InputNumber className={styles.hlgl} min={0} max={9999999999999999.999999}/>
                  </Form.Item>
                </Space>
              </Form>
            </div>
          </ProCard>
          <ProCard className="ddlf01_footer">
            <Space>
              <Button type='primary' onClick={save}>保存</Button>
            </Space>
          </ProCard>
        </ProCard>
      </Spin>
    </>
  )
};

export default Index;
