import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Form, InputNumber, message, Radio, Select, Space, Spin, Switch, Tooltip} from 'antd';
import { LoadingOutlined,  QuestionCircleOutlined} from '@ant-design/icons';
import cardStyle from './style.less';
import ProCard from '@ant-design/pro-card';
import {getShsjdsppPz, tyShsjppdsRw, saveShsjdsppPz} from '@/services/hts/api';

const Index: React.FC<{ data: any }> = ({
  data
}) => {
  //加载
  const [masker, setMasker] = useState(false);
  //遮罩开关
  const [visible, setVisible] = useState(true);
  const [zyuuid1, setZyuuid1] = useState<any>('');
  // 停用启用
  const [checked, setChecked] = useState(false);
  const [dsxzForm] = Form.useForm();

  useEffect(() => {
    //页面初始化查询
    initSerah();
  }, [data]);

  const initSerah = async () => {
    //初始化
    setVisible(true);
    setMasker(true);
    getShsjdsppPz({}).then((res: any) => {
      const { code, msg, body } = res;
      setMasker(false);
      if (code === '200') {
        if(body){
          setZyuuid1(body?.zyuuid1);
          dsxzForm.setFieldsValue(body);
        }
        setChecked(body?.qybz == 'Y');
        setVisible(body?.qybz != 'Y');
        // setTimeout(function() {
        //   setMasker(false);
        // }, 2000);
      } else {
        message.error(msg);
      }
    });
  }

  //停用启用
  const qykg = (param: any) => {
    if (param) {
      setVisible(false);
      setChecked(true);
    } else {
      setVisible(true);
      setChecked(false);
      if (zyuuid1) {
        tyShsjppdsRw({ zyuuid1: zyuuid1 }).then((res: any) => {
          const { code, msg } = res;
          if (code === '200') {
            setMasker(false);
            message.success("停用定时任务成功！");
          } else {
            message.error(msg);
            setMasker(false);
          }
        });
      }
    }
  }

  
  // **********************************************************************启用海关数据定时下载END************************************************************************************//



  const save = () => {
    // 滚动条
    window.scrollTo(0, document.body.scrollHeight);
    // 组织入参
    dsxzForm.validateFields().then((values: any) => {
      values.zyuuid1 = zyuuid1;
      values.qybz = checked ? 'Y' : 'N';
      values.qssk = 1;
      setMasker(true);
      saveShsjdsppPz(values).then((res) => {
        setMasker(false);
        const { code, body, msg } = res;
        if (code === '200') {
          setZyuuid1(body?.zyuuid1);
          message.success("保存定时任务成功！");
        } else {
          message.error(msg);
        }
      })
    });
  }

  const timeOnchang = (param: any) => {
    const value = param?.target?.value;
    if (value == '1') {
      dsxzForm.setFieldsValue({ xqts: 3 });
    } else if (value == '2') {
      dsxzForm.setFieldsValue({ xqts: 14 });
    } else {
      dsxzForm.setFieldsValue({ xqts: 60 });
    }
  }

  

  return <>
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <ProCard headerBordered={true} title="定时匹配开关" headStyle={{ backgroundColor: '#EEF3FC', paddingTop: '2px', paddingBottom: '2px' }} >
        <Switch checked={checked} onChange={qykg} /> 启用收汇数据定时匹配
      </ProCard>

      <Spin indicator={<LoadingOutlined style={{ fontSize: 0 }} spin />} spinning={visible}>

        <ProCard split="horizontal" className="dd_layout_form_01" style={{ backgroundColor: 'transparent' }}>
          <ProCard headerBordered={true} headStyle={{ backgroundColor: '#EEF3FC', paddingTop: '2px', paddingBottom: '2px' }} title="定时匹配配置" style={{ marginTop: '16px' }} >
            <Col className='gutter-row' span={10}>
              <Card
                style={{ height: 350 }}
                id='a23121231231'
                className={cardStyle.cardBox2}
                title={<>定时配置</>}
              >
                <Form form={dsxzForm} colon={false}>
                  <Form.Item className={cardStyle.cardFormBox} label="匹配频率" name='sjdwDm' initialValue={"1"} > 
                    <Radio.Group style={{ marginTop: '5px' }} defaultValue={"1"} onChange={timeOnchang}>
                      <Space direction="vertical">
                        <Radio key="111" value="1">
                          每日<Tooltip placement="topLeft" title={'按收汇水单或关系台账变更日期，匹配近3天收汇水单数据'}>&nbsp;<QuestionCircleOutlined /></Tooltip>
                        </Radio>
                        <br />
                        <Radio key="222" value="2">
                          每周<Tooltip placement="topLeft" title={'按收汇水单或关系台账变更日期，匹配近2周收汇水单数据'}>&nbsp;<QuestionCircleOutlined /></Tooltip>
                        </Radio>
                        <br />
                        <Radio key="333" value="3">
                          每月<Tooltip placement="topLeft" title={'按收汇水单或关系台账变更日期，匹配近60天收汇水单数据'}>&nbsp;<QuestionCircleOutlined /></Tooltip>
                        </Radio>
                      </Space>
                    </Radio.Group>
                  </Form.Item>
                  <div className={cardStyle.div1}>
                    <Form.Item className={cardStyle.cardFormBox2}  name='xqDm1' initialValue='1'>
                      <Select className={cardStyle.select}> 
                        <Select.Option value="2">一</Select.Option>
                        <Select.Option value="3">二</Select.Option>
                        <Select.Option value="4">三</Select.Option>
                        <Select.Option value="5">四</Select.Option>
                        <Select.Option value="6">五</Select.Option>
                        <Select.Option value="7">六</Select.Option>
                        <Select.Option value="1">日</Select.Option>
                      </Select>
                    </Form.Item>
                  </div>
                  <div className={cardStyle.div3}>
                    <Form.Item name="myt" initialValue={28}>
                      <InputNumber min={1} max={28} className={cardStyle.inputNum} precision={0} />
                    </Form.Item>
                  </div>
                  <Space wrap>
                    <Form.Item className={cardStyle.cardFormBox} name='xqts' initialValue={3} label="匹配范围：匹配近" >
                      <InputNumber min={1} max={60} className={cardStyle.inputNum} disabled={true} precision={0} />
                    </Form.Item>
                    <div style={{ marginTop: "-22px" }}>天数据</div>
                  </Space>
                </Form>
              </Card>
            </Col>
          </ProCard>
        </ProCard>
      </Spin>
      <div style={{ zIndex: 500, marginTop: "50%", position: "fixed", marginLeft: '40%', paddingBottom: "200px", bottom: 0, marginBottom: "-180px" }}>
        <Space>
          <Button type="primary" onClick={save} disabled={visible}>保存</Button>
        </Space>
      </div>
    </Spin>
  </>;
};

export default Index;
