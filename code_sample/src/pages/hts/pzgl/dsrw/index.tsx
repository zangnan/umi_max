import React, {useEffect, useRef, useState} from 'react';
import {Button, Card, Checkbox, Col, Form, Input, InputNumber, message, Radio, Row, Select, Space, Spin, Switch, Tooltip} from 'antd';
import {LoadingOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import cardStyle from './cardLess2.less';
import ProCard from '@ant-design/pro-card';
import {getBgdZdxzPz, getXtSzxx, queryKak, saveBgdZdxzPz, sendTestMail, tyBgdZdxzPz} from '@/services/hts/api';
import {history} from 'umi';
import baseValidator from '@/pages/common/field/baseValidator';
import IcList from '@/pages/hts/pzgl/icCard/common/icCardTsListBadz';
import khdgjUtil from '@/pages/hts/ckfp/khdgjUtil';
import myUtil from '@/pages/common/myUtil';


const Index: React.FC<{ data: any }> = ({
  data
}) => {
  //加载
  const [masker, setMasker] = useState(false);
  //遮罩开关
  const [visible, setVisible] = useState(true);
  const [pdata, setPdata] = useState<any>([]);
  const [kakSelect, setKakSelect] = useState<any>([]);
  const [disabled, setDisabled] = useState(true);
  const [zyuuid1, setZyuuid1] = useState<any>('');
  //勾选标志，报关单下载用。是否勾选更新发票号
  // 口岸卡卡号
  const [dzkaickkh, setDzkaickkh] = useState('');
  const [checked, setChecked] = useState(false);

  const [wthbxyDis, setWthbxyDis] = useState(false);

  const [zdtbjgztpl, setZdtbjgztpl] = useState('每日');
  const [zdtbjgzttsDisabled, setZdtbjgzttsDisabled] = useState(true);

  const [yjform] = Form.useForm();
  const [dsxzForm] = Form.useForm();
  const [jksForm] = Form.useForm();
  const [dzForm] = Form.useForm();

  const refICList: any = useRef(); // 环境检测


  useEffect(() => {
    //查询口岸卡
    queryKakxx({"sdbz": "N"});

    //页面初始化查询
    initSerah();
  }, [data]);

  // **********************************************************************IC卡************************************************************************************//
  // 新增-跳转到口岸卡管理页面
  const add = () => {
    history.push({
      pathname: '/hts/pzgl/icCard/icCardgl',
      query: {flag: '1'}
    });
  }

  //查询口岸卡
  const queryKakxx = async (param: any) => {
    setMasker(true);
    queryKak(param).then((res: any) => {
      const {code, msg, body} = res;
      const kakxx: any = [];
      if (code === '200') {
        setPdata(body);
        for (let i = 0; i < body.length; i++) {
          if (body[i].sdbz == 'N') {
            const op = {value: '', label: ''};
            op.label = body[i].kakbm;
            op.value = body[i].kakuuid;
            kakxx.push(op);
          }
        }
        setKakSelect(kakxx);
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
        tyBgdZdxzPz({zyuuid1: zyuuid1}).then((res: any) => {
          const {code, msg} = res;
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

  const initSerah = async () => {
    //初始化
    setVisible(true);
    setMasker(true);
    getBgdZdxzPz({}).then((res: any) => {
      const {code, msg, body} = res;
      if (code === '200') {
        if (body) {
          setZyuuid1(body?.zyuuid1);
          const str = body?.kxsjcszjson;
          const obj = JSON.parse(str);
          body.badzlx = obj?.badzlx;
          body.bgdlx = obj?.bgdlx;
          body.zdtbjgzt = obj?.zdtbjgzt;
          body.zdtbjgztts = obj?.zdtbjgztts;
          if (body.zdtbjgzt == 'Y') {
            setZdtbjgzttsDisabled(false);
          } else {
            setZdtbjgzttsDisabled(true);
          }
          body.bgdsjlx = 'ZGTQBGD';
          body.gxckfphbz = obj?.gxckfphbz == "Y" ? "01" : "";
          yjform.setFieldsValue(body);
          dsxzForm.setFieldsValue(body);
          jksForm.setFieldsValue(body);
          if (!body?.zdtbjgzt) {
            jksForm.setFieldsValue({'zdtbjgzt': []});
          }
          if (!body?.zdtbjgztts) {
            jksForm.setFieldsValue({'zdtbjgztts': 15});
          }
          dzForm.setFieldsValue(body);
          setDzkaickkh(body?.dzkaickkh);
        } else {
          jksForm.setFieldsValue({'zdtbjgztts': 15});
        }
        setChecked(body?.qybz == 'Y');
        setVisible(body?.qybz != 'Y');

        setTimeout(function () {
          setMasker(false);
        }, 2000);
      } else {
        message.error(msg);
        setMasker(false);
      }
    });
  }
  // **********************************************************************启用海关数据定时下载END************************************************************************************//


  const save = async () => {
    // 滚动条
    window.scrollTo(0, document.body.scrollHeight);
    // 组织入参
    await yjform.validateFields();
    await dsxzForm.validateFields();
    await jksForm.validateFields();
    await dzForm.validateFields();
    const curShowModal = refICList.current!.showModal;
    const data = pdata.filter((p: any) => p.kakuuid === yjform?.getFieldValue('kakuuid'));
    data[0].dzkaickkh = dzkaickkh;
    curShowModal(data);
  }

  const timeOnchang = (param: any) => {
    const value = param?.target?.value;
    if (value == '1') {
      setDisabled(true);
      setZdtbjgztpl('每日');
      dsxzForm.setFieldsValue({xqts: 7});
    } else if (value == '2') {
      setDisabled(true);
      setZdtbjgztpl('每周');
      dsxzForm.setFieldsValue({xqts: 14});
    } else {
      setDisabled(false);
      setZdtbjgztpl('每月');
      dsxzForm.setFieldsValue({xqts: 60});
    }
  }

  const zdtbjgztOnchang = (param: any) => {
    if (param && param.includes('Y')) {
      setZdtbjgzttsDisabled(false);
    } else {
      setZdtbjgzttsDisabled(true);
    }
  }

  const testMail = async () => {
    const p1 = await yjform.validateFields();
    const dzxx = [];
    dzxx.push(p1.dzxx);
    setMasker(true);
    sendTestMail({dzxxs: dzxx}).then((res: any) => {
      setMasker(false);
      const {code, msg,} = res;
      if (code === '200') {
        message.success('邮箱地址测试完成！');
      } else {
        message.error(msg);
        yjform.setFieldsValue({dzxx: ""});
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
      bgdlx: p2?.bgdlx,
      bgdsjlx : 'ZGTQBGD',
      gxckfphbz: p3.gxckfphbz[0] ? "Y" : "N",
      zdtbjgzt: p3.zdtbjgzt[0] ? "Y" : "N",
      zdtbjgztts: p3.zdtbjgzt[0] ? p3.zdtbjgztts : 0,
      badzlx: p4.badzlx,
    }
    const jsonParam = {
      zyuuid1: zyuuid1,
      sjdwDm: p2.sjdwDm,
      xqDm1: p2.xqDm1,
      xqts: p2.xqts,
      qssk: 3,
      zyxzlxDm: '1',
      qybz: 'Y',
      kakuuid: p1?.kakuuid,
      dzxxs: [p1?.dzxx],
      dzkaickkh: dzkaickkh ? dzkaickkh : "1111",
      kxsjcszjson: kxsjcszjson,
      myt: p2.myt
    };
    // 获取cron表达式
    getXtSzxx(jsonParam).then((res: any) => {
      setMasker(false);
      const {code, msg, body} = res;
      if (code === '200') {
        const userInfo = myUtil.sessionStore.getItem('userInfo');
        const p = {
          yhjq: kakxx.yhjq,
          hgqydm: userInfo?.qxQys[0]?.hgqyDm,
          nsrsbh: userInfo?.qxQys[0]?.shxydm,
          nsrmc: userInfo?.qxQys[0]?.nsrmc,
          swcode: userInfo?.qxQys[0]?.ssdq1,
          channelId: body?.channelId,
          yptYhm: body?.yptYhm,
          yptMm: body?.yptMm,
          fwqsj: body?.time,
          dsbds: body?.zxjhbds,
          xzfs: userInfo?.qxQys[0]?.bgdsjlyDm === '6' ? 'YBT' : userInfo?.qxQys[0]?.bgdsjlyDm === '3' ? 'LTKHDGJ' : 'GPT'
        };
        setMasker(true);
        const res = khdgjUtil.szDsxzRw(p);
        setMasker(false);
        res.code = '200'
        if (res.code == '200') {
          // 调用后端接口
          setMasker(true);
          saveBgdZdxzPz(jsonParam).then((res2: any) => {
            setMasker(false);
            if (res2.code == '200') {
              message.success("创建定时任务成功！");
            } else {
              message.error(res2.msg);
            }
          });
        } else {
          message.error(res.msg);
        }
      } else {
        message.error(msg);
      }
    });
  }

  const onChange = (param: any) => {
    if (param?.indexOf("CKBGD") == -1) {
      setWthbxyDis(true);
    } else {
      setWthbxyDis(false);
    }

  }

  return <>
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <ProCard headerBordered={true} title="基础调度&通知" headStyle={{backgroundColor: '#EEF3FC', paddingTop: '2px', paddingBottom: '2px'}}>
        <Form form={yjform} style={{float: "left"}}>
          <Form.Item labelCol={{span: 6}} wrapperCol={{span: 14}} label="定时下载总开关">
            <Switch checked={checked} onChange={qykg}/>
          </Form.Item>
          <div style={{marginTop: "-55px", marginLeft: "452px"}}>
            <Button/>
          </div>
          <Form.Item labelCol={{span: 6}} wrapperCol={{span: 14}} style={{marginTop: '5px'}} name="kakuuid" label="海关IC卡" rules={[{required: true, message: '请选择口岸卡!'}]}>
            <Select style={{width: "300px"}} options={kakSelect} notFoundContent="暂无数据" disabled={visible}/>
          </Form.Item>
          <div style={{marginTop: "-55px", marginLeft: "452px"}}>
            <Button onClick={add} style={{width: "120px"}} disabled={visible}>新增IC卡</Button>
          </div>
          <Form.Item labelCol={{span: 6}} wrapperCol={{span: 14}} style={{marginTop: '10px'}} rules={[baseValidator.email(),]} label="消息通知邮箱" name="dzxx">
            <Input maxLength={50} style={{width: "300px"}} disabled={visible}/>
          </Form.Item>
          <div style={{marginTop: "-55px", marginLeft: "452px"}}>
            <Button onClick={testMail} style={{width: "120px"}} disabled={visible}>发送测试邮件</Button>
          </div>
        </Form>
      </ProCard>

      <Spin indicator={<LoadingOutlined style={{fontSize: 0}} spin/>} spinning={visible}>
        <ProCard split="horizontal" className="dd_layout_form_01" style={{backgroundColor: 'transparent'}}>
          <ProCard headerBordered={true} headStyle={{backgroundColor: '#EEF3FC', paddingTop: '2px', paddingBottom: '2px'}} title="任务策略" style={{marginTop: '16px'}}>
            <Row gutter={[20, 20]}>
              <Col className='gutter-row' span={12}>
                <Card
                  style={{height: 350}}
                  id='a23121231231'
                  className={cardStyle.cardBox2}
                  title=""
                >
                  <Form form={dsxzForm} colon={false} layout="vertical">
                    <div className={cardStyle.sectionTitle}>下载报关单类型</div>
                    <Form.Item name='bgdlx' initialValue={['CKBGD']} label="报关单类型：" rules={[{required: true, message: '请选择报关单类型!'}]}>
                      <Checkbox.Group onChange={onChange}>
                        <Checkbox key={'CKBGD'} value="CKBGD">出口报关单</Checkbox>
                        <Checkbox key={'JKBGD'} value="JKBGD">进口报关单</Checkbox>
                      </Checkbox.Group>
                    </Form.Item>
                    <div className={cardStyle.sectionTitle}>下载频率&数据范围</div>
                    <Form.Item label="下载频率：" name='sjdwDm' initialValue={"1"} rules={[{required: true, message: '请选择下载频率!'}]}>
                      <Radio.Group defaultValue={"1"} onChange={timeOnchang}>
                        <Space direction="horizontal">
                          <Radio key="111" value="1">
                            每日<Tooltip placement="topLeft" title={'选择每日下载时，系统可支持数据范围近7天数据'}>&nbsp;<QuestionCircleOutlined/></Tooltip>
                          </Radio>
                          <Radio key="222" value="2">
                            每周<Tooltip placement="topLeft" title={'选择每周下载时，系统可支持数据范围近2周数据'}>&nbsp;<QuestionCircleOutlined/></Tooltip>
                          </Radio>
                          <Form.Item name='xqDm1' initialValue='1' noStyle>
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
                          <Radio key="333" value="3">
                            每月<Tooltip placement="topLeft" title={'选择每月下载时，系统可支持数据范围近60天数据'}>&nbsp;<QuestionCircleOutlined/></Tooltip>
                          </Radio>
                          <Form.Item name="myt" initialValue={28} noStyle>
                            <InputNumber min={1} max={28} className={cardStyle.inputNum} precision={0}/>
                          </Form.Item>
                        </Space>
                      </Radio.Group>
                    </Form.Item>
                    <Form.Item label="下载范围：">
                      <Space size={0}>
                        <span style={{ lineHeight: '32px', marginRight: 8 }}>下载近</span>
                        <Form.Item name='xqts' initialValue={7} rules={[{required: true, message: '请选择下载范围!'}]} noStyle>
                          <InputNumber min={1} max={60} disabled={disabled} precision={0} className={cardStyle.inputNum}/>
                        </Form.Item>
                        <span style={{ lineHeight: '32px', marginLeft: 8 }}>天数据</span>
                      </Space>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
              <Col className='gutter-row' span={12}>
                <Card
                  style={{height: 350}}
                  id='qwdwdqwdqdwqa2'
                  className={cardStyle.cardBox2}
                  title=""
                >
                  <Form form={jksForm} colon={false} layout="vertical">
                    <div className={cardStyle.sectionTitle}>数据增强处理</div>
                    <Form.Item name='gxckfphbz' initialValue={['01']} label="">
                      <Checkbox.Group>
                        <Checkbox value="01">将出口合同号更新为出口发票号
                          <div style={{color: 'rgb(153, 153, 153)', marginTop: '0px', marginLeft: '-24px'}}>
                            仅对出口报关单生效
                          </div>
                        </Checkbox>
                      </Checkbox.Group>
                    </Form.Item>
                    <Form.Item name='zdtbjgzt' initialValue={[]} label="">
                      <Checkbox.Group onChange={zdtbjgztOnchang}>
                        <Checkbox value="Y">自动同步结关状态
                          <div style={{color: 'rgb(153, 153, 153)', marginTop: '0px', marginLeft: '-24px'}}>
                            开启后系统将根据下方智能规则自动同步未结关数据
                          </div>
                        </Checkbox>
                      </Checkbox.Group>
                    </Form.Item>
                    <div className={cardStyle.sectionTitle}>数据增强处理</div>
                    <div style={{
                      marginTop: '5px',
                      maxHeight: '110px',
                      overflowY: 'auto',
                      wordBreak: 'break-all',
                      overflowWrap: 'break-word',
                      whiteSpace: 'normal',
                      fontSize: '12px'
                    }}>
                      <div>同步频率：结关状态同步将按照【{zdtbjgztpl}】的频率自动执行，与报关单下载任务频率保持一致。</div>
                      <div style={{lineHeight: '32px', wordBreak: 'break-all'}}>
                        <span>范围计算：在下载报关单数据范围的基础上 → 额外向前追溯 </span>
                        <Form.Item name='zdtbjgztts' rules={[{required: true, message: '请选择下载范围!'}]} noStyle>
                          <InputNumber min={7} max={120} disabled={zdtbjgzttsDisabled} precision={0} className={cardStyle.inputNum}/>
                        </Form.Item>
                        <span> 天的未结关报关单数据。</span>
                      </div>
                    </div>
                  </Form>
                </Card>
              </Col>
            </Row>

            {myUtil.menu.getMenuObjByPath('/hts/badz2') ? <>
              <Row gutter={[20, 20]} style={{marginTop: '16px'}}>
                <Col className='gutter-row' span={24}>
                  <Card
                    style={{height: 150}}
                    id='qwwqdqdwqdqwdwqd'
                    className={cardStyle.cardBox2}
                    title=""
                  >
                    <Form form={dzForm}>
                      <div className={cardStyle.sectionTitle}>备案单证资料<Tooltip placement="topLeft"
                                                                                   title={'说明：仅支持以下条件的数据下载单证资料，获取的出口报关单状态为已结关。'}>&nbsp;
                        <QuestionCircleOutlined/></Tooltip></div>
                      <Form.Item name='badzlx' label="备案单证资料类型" noStyle>
                        <Checkbox.Group disabled={wthbxyDis} style={{width: '100%'}}>
                          <Row style={{marginTop: '5px'}}>
                            <Col span={6}>
                              <Checkbox key={'WTBGXY'} value="WTBGXY">委托报关协议(电子)</Checkbox>
                            </Col>
                            <Col span={6}>
                              <Checkbox key={'BGDPDF'} value="BGDPDF">出口报关单</Checkbox>
                            </Col>
                            <Col span={6}>
                              <Checkbox key={'WZHFXTZS'} value="WZHFXTZS">无纸化放行通知书</Checkbox>
                            </Col>
                            <Col span={6}>
                              <Checkbox key={'SFDJ'} value="SFDJ">随附单据</Checkbox>
                            </Col>
                          </Row>
                        </Checkbox.Group>
                      </Form.Item>
                      <div style={{color: 'rgb(153, 153, 153)', marginTop: '10px', marginLeft: '0px'}}>
                        <div>可多选，下载报关单时一并拉取所选单证</div>
                      </div>
                    </Form>
                  </Card>
                </Col>
              </Row>
            </> : <></>
            }
          </ProCard>
        </ProCard>
      </Spin>
      <div style={{zIndex: 500, marginTop: "50%", position: "fixed", marginLeft: '40%', paddingBottom: "200px", bottom: 0, marginBottom: "-180px"}}>
        <Space>
          <Button type="primary" onClick={save} disabled={visible}>保存</Button>
        </Space>
      </div>
    </Spin>
    <IcList onRef={refICList} saveBtn={saveHjjc} setDzkaickkh={setDzkaickkh}/>
  </>;
};

export default Index;
