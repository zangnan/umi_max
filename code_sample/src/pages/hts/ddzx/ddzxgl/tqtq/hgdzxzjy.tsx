import React, { useState,  } from 'react';
import { Button, Form, Space, Input, Spin, Row, Col ,message} from 'antd';
import ProCard from '@ant-design/pro-card';
import { tqdd, } from '@/services/hts/api';
import myUtil from '@/pages/common/myUtil';
import './style.less';
import { useIntl } from 'umi';

export type ActionType = {
  reload: (resetPageIndex?: boolean) => void;
}

const Hgdzxzjy: React.FC<unknown> = () => {
  const [form] = Form.useForm();
  //下载按钮是否显示
  const [masker, setMasker] = useState(false);



  // 单证下载
  const downloadSj = async () => {
    const formValues = await form.validateFields();
    setMasker(true);
    await tqdd(formValues).then((response2) => {
      setMasker(false);
      if (response2.code == '200') {
        message.success(`提取成功,共提取${response2?.body?.cgts}条数据!`);
        form.setFieldsValue({ckny:''});
      } else {
        message.error(response2.msg);
      }
    });
  }



  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <ProCard split="horizontal" className="dd_layout_form_01 dd_hgdzxzjy" >
        <ProCard style={{ height: myUtil.heightCalc.getCalc(['header', 'headerTab', 'cardMargin', 'footerBtn']), overflowY: 'auto' }}>
          <div className='groupTit'>订单提取</div>
          <Form form={form}  >
            <Row justify="center">
              <Col span={8}>
                <Form.Item name="ckny" rules={[{ required: true, message: '请输入提取出口年月' }, () => ({
                  validator(_, value) {
                    if (value) {
                      const temp1 = (!value.match(/^[1-9]\d{3}(0[1-9]|1[0-2])$/)); // YYYYMM
                      if (temp1) {
                        return Promise.reject(new Error('请输入正确的提取年月'));
                      } 
                      return Promise.resolve();
                    }
                    return Promise.resolve();
                  },
                })]}>
                  <Input placeholder='请输入提取出口年月' />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </ProCard>
        <ProCard className="ddlf01_footer">
          <Space>
            <Button type='primary' onClick={() => { downloadSj() }}>订单提取</Button>
          </Space>
        </ProCard>
      </ProCard>
    </Spin>
  );
};

export default Hgdzxzjy;
