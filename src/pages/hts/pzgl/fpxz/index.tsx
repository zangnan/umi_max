
import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Radio, Form, Switch, Spin, message, Button, Space, DatePicker, Input, InputNumber, Tooltip, Checkbox, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import cardStyle from './cardLess2.less';
import ProCard from '@ant-design/pro-card';
import { DownOutlined, UpOutlined, LoadingOutlined } from '@ant-design/icons';
import { queryKak, getBgdZdxzPz, tyBgdZdxzPz, sendTestMail, getXtSzxx, saveBgdZdxzPz } from '@/pages/hts/services/htsApi';
import { history } from 'umi';
import { QuestionCircleOutlined } from '@ant-design/icons';
import baseValidator from '@/components/DDAssist/field/baseValidator';
import IcList from '@/pages/hts/pzgl/icCard/common/icCardTsListBadz';
import khdgjUtil from '@/pages/hts/ckfp/khdgjUtil';
import myUtil from '@/components/DDAssist/util';


const Index: React.FC<{ data: any }> = ({
  data
}) => {
  //加载
  const [masker, setMasker] = useState(false);
  //遮罩开关
  const [visible, setVisible] = useState(true);
  const [pdata, setPdata] = useState<any>([]);
  const [chardIndex, setCardIndex] = useState<any>('');
  const [expand, setExpand] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [zyuuid1, setZyuuid1] = useState<any>('');
  const [searchHeight, setSearchHeight] = useState('140px');
  //勾选标志，报关单下载用。是否勾选更新发票号
  // 口岸卡卡号
  const [dzkaickkh, setDzkaickkh] = useState('');
  const [checked, setChecked] = useState(false);

  

  const [yjform] = Form.useForm();
  const [dsxzForm] = Form.useForm();
  const [jksForm] = Form.useForm();
  const [dzForm] = Form.useForm();

  const refICList: any = useRef(); // 环境检测


  useEffect(() => {
    //查询口岸卡
    queryKakxx({ "sdbz": "N" });

    //页面初始化查询
    initSerah();
  }, [data]);

  // **********************************************************************IC卡************************************************************************************//
  // 点击更多
  const toggle = () => {
    setExpand(!expand);
    if (expand === false) {
      setSearchHeight('auto');
    } else {
      setSearchHeight('140px');
    }
  }
  const glIcClick = () => {
    history.push({ pathname: '/hts/pzgl/icCard/icCardgl' });
  }

  const cardHtml = (data: any) => {
    const html: any = [];
    if (data && data.length > 0) {
      data?.map((item: any, index: number) => {
        html.push(<Col className="gutter-row" span={6}  >
          <Card
            style={{ height: 140 }}
            id={item.kakuuid}
            onClick={() => changeCard(item.kakuuid)}
            className={chardIndex === item.kakuuid ? cardStyle.cardBox3 : cardStyle.cardBoxFFF2}
          >
            <Card.Meta
              avatar={<div className={cardStyle.cardAvatar3}></div>}
              title={item.kakbm}
              description={<>
                <div>{item.kaklxDm == '1' ? '操作员卡' : '法人卡'}</div>
              </>}
            />
          </Card>
        </Col>)
      })
    } else {
      html.push(<></>)
    }
    return html;
  }

  // 改变卡片
  const changeCard = (index: any) => {
    setCardIndex(index);
  }

  // 新增-跳转到口岸卡管理页面
  const add = () => {
    history.push({
      pathname: '/hts/pzgl/icCard/icCardgl',
      query: { flag: '1' }
    });
  }

  //查询口岸卡
  const queryKakxx = async (param: any) => {
    setMasker(true);
    queryKak(param).then((res: any) => {
      const { code, msg, body } = res;
      if (code === '200') {
        setPdata(body);
        setMasker(false);
      } else {
        message.error(msg);
        setMasker(false);
      }
      setMasker(false);
    });
  }
  // **********************************************************************IC卡END************************************************************************************//


  // **********************************************************************启用海关数据定时下载************************************************************************************//
  //查询口岸卡
  const qykg = (param: any) => {
    if (param) {
      setVisible(false);
      setChecked(true);
    } else {
      setVisible(true);
      setChecked(false);
      if (zyuuid1) {
        tyBgdZdxzPz({ zyuuid1: zyuuid1 }).then((res: any) => {
          const { code, msg, body } = res;
          if (code === '200') {
            setZyuuid1(body?.zyuuid1);
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

  const initSerah = async () => {
    //初始化
    setVisible(true);
    setMasker(true);
    getBgdZdxzPz({}).then((res: any) => {
      const { code, msg, body } = res;
      if (code === '200') {
        setZyuuid1(body?.zyuuid1);
        setMasker(false);
        var str = body.kxsjcszjson;
        var obj = JSON.parse(str);
        body.badzlx = obj?.badzlx;
        body.bgdlx = obj?.bgdlx;
        body.gxckfphbz = obj?.gxckfphbz == "Y"?"01":"";
        yjform.setFieldsValue(body);
        dsxzForm.setFieldsValue(body);
        jksForm.setFieldsValue(body);
        dzForm.setFieldsValue(body);
        setChecked(body?.qybz == 'Y'?true:false);
        setVisible(body?.qybz == 'Y'?false:true);

        setDzkaickkh(body?.dzkaickkh);
      } else {
        message.error(msg);
        setMasker(false);
      }
    });
  }
  // **********************************************************************启用海关数据定时下载END************************************************************************************//



  const save = async () => {
    if (chardIndex == '') {
      message.info('请选择口岸卡！');
      return;
    }
    // 滚动条
    window.scrollTo(0, document.body.scrollHeight);
    // 组织入参
    const p1 = await yjform.validateFields();
    const p2 = await dsxzForm.validateFields();
    const p3 = await jksForm.validateFields();
    const p4 = await dzForm.validateFields();
    const curShowModal = refICList.current!.showModal;
    const data = pdata.filter((p: any) => p.kakuuid === chardIndex);
    data[0].dzkaickkh = dzkaickkh;
    curShowModal(data);
  }

  const timeOnchang = (param: any) => {
    const value = param?.target?.value;
    if (value == '1') {
      setDisabled(true);
      dsxzForm.setFieldsValue({ xqts: 5 });
    } else if (value == '2') {
      setDisabled(true);
      dsxzForm.setFieldsValue({ xqts: 14 });
    } else {
      setDisabled(false);
      dsxzForm.setFieldsValue({ xqts: 60 });
    }
  }

  const testMail = async () => {
    const p1 = await yjform.validateFields();
    const dzxx = [];
    dzxx.push(p1.dzxx);
    setMasker(true);
    sendTestMail({ dzxxs: dzxx }).then((res: any) => {
      setMasker(false);
      const { code, msg, } = res;
      if (code === '200') {
        message.success('邮箱地址测试完成！');
      } else {
        message.error(msg);
        yjform.setFieldsValue({ dzxx: "" });
      }
    });
  }

  const saveHjjc = async (kakxx: any) => {
    setMasker(true);
    // 组织入参
    const p1 = await yjform.validateFields();
    const p2 = await dsxzForm.validateFields();
    const p3 = await jksForm.validateFields();
    const p4 = await dzForm.validateFields();
    const kxsjcszjson = {
      bgdlx: p3?.bgdlx,
      gxckfphbz: p3.gxckfphbz[0] ? "Y" : "N",
      badzlx: [p4.badzlx],
    }
    const jsonParam = {
      zyuuid1: zyuuid1,
      sjdwDm: p2.sjdwDm,
      xqDm1: p2.xqDm1,
      xqts: p2.xqts,
      qssk:3,
      zyxzlxDm: '1',
      qybz: 'Y',
      kakuuid: chardIndex,
      dzxxs: [p1?.dzxx],
      dzkaickkh: kakxx.icCardId?kakxx.icCardId:"1111",
      kxsjcszjson: kxsjcszjson,
      myt: p2.myt
    };
    // 获取cron表达式
    getXtSzxx(jsonParam).then((res: any) => {
      setMasker(false);
      const { code, msg, body } = res;
      if (code === '200') {
        const userInfo = myUtil.sessionStore.getItem('userInfo');
        const p = {
          yhjq:kakxx.yhjq,
          hgqydm:userInfo?.qxQys[0]?.hgqyDm,
          nsrsbh:userInfo?.qxQys[0]?.shxydm,
          swcode:userInfo?.qxQys[0]?.ssdq1,
          fwqsj:body?.time,
          dsbds:body?.zxjhbds,
        };
        setMasker(true);
        const res = khdgjUtil.szDsxzRw(p);
        setMasker(false);
        res.code = '200'
        if(res.code == '200'){
          // 调用后端接口
          setMasker(true);
          saveBgdZdxzPz(jsonParam).then((res2: any) => {
            setMasker(false);
            if(res2.code == '200'){
              message.success("创建定时任务成功！");
            }else{
              message.error(res2.msg);
            }
          });
        }else{
          message.error(res.msg);
        }
      } else {
        message.error(msg);
      }
    });
  }

  return <>
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <ProCard headerBordered={true} title="定时下载开关" headStyle={{ backgroundColor: '#EEF3FC', paddingTop: '2px', paddingBottom: '2px' }} >
        <Switch checked={checked} onChange={qykg} /> 启用海关数据定时下载
      </ProCard>

      <Spin indicator={<LoadingOutlined style={{ fontSize: 0 }} spin />} spinning={visible}>

        <ProCard split="horizontal" className="dd_layout_form_01" style={{ backgroundColor: 'transparent' }}>
          <ProCard headerBordered={true} title="选择海关IC卡" headStyle={{ backgroundColor: '#EEF3FC', paddingTop: '2px', paddingBottom: '2px' }} extra={
            <Button type="link" onClick={() => glIcClick()}>管理IC卡</Button>
          }>
            <div style={{ height: searchHeight, overflow: 'hidden' }}>
              <Row gutter={[20, 20]} >
                {cardHtml(pdata)}
                <Col className="gutter-row" span={6}>
                  <Card style={{ height: 140, textAlign: 'center', color: '#0854A0' }} >
                    <PlusOutlined style={{ fontSize: '64px' }} onClick={() => { add() }} />
                    <div style={{ fontSize: '18px', color: '#0854A0' }}>新增</div>
                  </Card>
                </Col>
              </Row>
            </div>
            <div style={{ height: pdata?.length > 4 ? '10px' : '0', marginTop: '12px' }}>
              <a style={{ fontSize: 14, display: pdata?.length > 4 ? 'inline' : 'none' }} onClick={toggle}>
                {expand ? <UpOutlined /> : <DownOutlined />} 查看更多
              </a>
            </div>
          </ProCard>

          <ProCard headerBordered={true} headStyle={{ backgroundColor: '#EEF3FC', paddingTop: '2px', paddingBottom: '2px' }} title="消息提醒配置" style={{ marginTop: '16px' }} >
            <Form form={yjform} style={{ float: "left" }}>
              <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}
                rules={[{type: 'email'},]} label="消息通知邮箱" name="dzxx" >
                <Input maxLength={50} style={{ width: "300px" }} />
              </Form.Item>
              <div style={{ marginTop: "-55px", marginLeft: "452px" }}>
                <Button onClick={testMail}>发送测试邮件</Button>
              </div>
            </Form>
          </ProCard>

          <ProCard headerBordered={true} headStyle={{ backgroundColor: '#EEF3FC', paddingTop: '2px', paddingBottom: '2px' }} title="定时下载配置" style={{ marginTop: '16px' }} >
            <Col className='gutter-row' span={8}>
              <Card
                style={{ height: 350 }}
                id='a23121231231'
                className={cardStyle.cardBox2}
                title={<>定时配置</>}
              >
                <Form form={dsxzForm} colon={false}>
                  <Form.Item className={cardStyle.cardFormBox} label="下载频率" name='sjdwDm' initialValue={"1"} >
                    <Radio.Group style={{ marginTop: '5px' }} defaultValue={"1"} onChange={timeOnchang}>
                      <Space direction="vertical">
                        <Radio key="111" value="1">
                          每日<Tooltip placement="topLeft" title={'选择每日下载时，系统可支持数据范围近5天数据'}>&nbsp;<QuestionCircleOutlined /></Tooltip>
                        </Radio>
                        <br />
                        <Radio key="222" value="2">
                          每周<Tooltip placement="topLeft" title={'选择每周下载时，系统可支持数据范围近2周数据'}>&nbsp;<QuestionCircleOutlined /></Tooltip>
                        </Radio>
                        <br />
                        <Radio key="333" value="3">
                          每月<Tooltip placement="topLeft" title={'选择每月下载时，系统可支持数据范围近60天数据'}>&nbsp;<QuestionCircleOutlined /></Tooltip>
                        </Radio>
                      </Space>
                    </Radio.Group>
                  </Form.Item>
                  <div className={cardStyle.div1}>
                    <Form.Item className={cardStyle.cardFormBox2} name='xqDm1' initialValue='1'>
                      <Select className={cardStyle.select}>
                        <Select.Option value="1">一</Select.Option>
                        <Select.Option value="2">二</Select.Option>
                        <Select.Option value="3">三</Select.Option>
                        <Select.Option value="4">四</Select.Option>
                        <Select.Option value="5">五</Select.Option>
                        <Select.Option value="6">六</Select.Option>
                        <Select.Option value="7">日</Select.Option>
                      </Select>
                    </Form.Item>
                  </div>
                  <div className={cardStyle.div3}>
                    <Form.Item name="myt" initialValue={28}>
                      <InputNumber min={1} max={28} className={cardStyle.inputNum} precision={0} />
                    </Form.Item>
                  </div>
                  <Space wrap>
                    <Form.Item className={cardStyle.cardFormBox} name='xqts' initialValue={5} label="下载范围：下载近" >
                      <InputNumber min={1} max={60} className={cardStyle.inputNum} disabled={disabled} precision={0} />
                    </Form.Item>
                    <div style={{ marginTop: "-22px" }}>天数据</div>
                  </Space>
                </Form>
              </Card>
            </Col>
          </ProCard>
          <ProCard headerBordered={true} headStyle={{ backgroundColor: '#EEF3FC', paddingTop: '2px', paddingBottom: '2px' }} title="下载数据类型" style={{ marginTop: '16px' }} >
            <Row gutter={[20, 20]} >
              <Col className='gutter-row' span={8}>
                <Card
                  style={{ height: 280 }}
                  id='qwdwdqwdqdwqa2'
                  className={cardStyle.cardBox2}
                  title={<>报关单数据</>}
                >
                  <Form form={jksForm}>
                    <Form.Item className={cardStyle.cardFormBox} name='bgdlx'  label="报关单类型" rules={[{ required: true, message: '请选择报关单类型!' }]}>
                      <Checkbox.Group>
                        <Checkbox key={'CKBGD'} value="CKBGD">出口报关单</Checkbox>
                        <Checkbox key={'ZGTQBGD'} value="ZGTQBGD">提前转关报关单</Checkbox>
                        <Checkbox key={'JKBGD'} value="JKBGD">进口报关单</Checkbox>
                      </Checkbox.Group>
                    </Form.Item>
                    <Form.Item className={cardStyle.cardFormBox} name='gxckfphbz' label="出口发票号" >
                      <Checkbox.Group>
                        <Checkbox value="01">将出口合同号更新为出口发票号</Checkbox>
                      </Checkbox.Group>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
              <Col className='gutter-row' span={8}>
                <Card
                  style={{ height: 280 }}
                  id='qwwqdqdwqdqwdwqd'
                  className={cardStyle.cardBox2}
                  title={<>备案单证资料</>}
                >
                  <Form form={dzForm}>
                    <Form.Item className={cardStyle.cardFormBox} name='badzlx' label="备案单证资料类型" >
                      <Checkbox.Group>
                        <Checkbox value="WTBGXY">委托报关协议</Checkbox>
                      </Checkbox.Group>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
            </Row>
          </ProCard>
        </ProCard>
      </Spin>
      <div style={{ zIndex: 500, marginTop: "50%", position: "fixed", marginLeft: '40%', paddingBottom: "200px", bottom: 0, marginBottom: "-180px" }}>
        <Space>
          <Button type="primary" onClick={save} disabled={visible}>保存</Button>
        </Space>
      </div>
    </Spin>
    <IcList onRef={refICList} saveBtn={saveHjjc} />
  </>;
};

export default Index;