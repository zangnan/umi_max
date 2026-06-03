// 图表主页
import React, { useEffect, useState, useRef } from 'react';
import './style.less';
import { Spin, Row, Col, Button, Tag, Tooltip, Avatar, message, Modal, Select, Input, List, Carousel } from 'antd';
import ProCard from '@ant-design/pro-card';
import { RightCircleFilled, LeftCircleFilled, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { QuestionOutlined, CoffeeOutlined, GoldOutlined, SaveOutlined, GroupOutlined, ShopOutlined, DeploymentUnitOutlined, CalendarOutlined, BuildOutlined, BookOutlined, ContainerOutlined, CloudServerOutlined, ProjectOutlined, RobotOutlined, InteractionOutlined, FileProtectOutlined, UserOutlined, HomeOutlined, SecurityScanOutlined, OneToOneOutlined, CreditCardOutlined, VerifiedOutlined, ScheduleOutlined, AreaChartOutlined, AuditOutlined, RadarChartOutlined, FormOutlined, LayoutOutlined, ProfileOutlined, FundOutlined, CheckSquareOutlined, SendOutlined, BarChartOutlined } from '@ant-design/icons';
import myUtil from '@/pages/common/myUtil';
import { getKjcdApi, queryKpzKjcd, saveKjcd, queryKpzcddm, getXhsjzrData } from '@/services/hts/api';
import CompanyModal from '@/pages/user/Login/companyModal';
import pro from '@/pages/common/proConfig';
import { history,useAccess } from 'umi';
import ColumnCharts from './column';
import ColumnWmtseCharts from './column_wmtse';
import ColumnScMdtseCharts from './column_scmdtse';
import Step1  from './index_step1';
import PieCharts from './pie'
import qxUtil from '@/pages/common/qxUtil';
import DDAlert from "@/components/DDAlert";

const Index: React.FC<unknown> = () => {
  const refCompanyModal: any = useRef();

  const [masker, setMasker] = useState(false);
  const [masker2, setMasker2] = useState(false);
  const [userData, setUserData] = useState<any>({}); // 用户信息 数据
  const [iconData, setIconData] = useState<any>([]); // 快捷菜单 数据
  const [createModalVisible, handleModalVisible] = useState<boolean>(false); // 快捷菜单 打开
  const [cdList, setCdList] = React.useState<any>([]); // 菜单 列表
  const [checkCdList, setCheckCdList]= React.useState<any>([]); // 菜单 选中的菜单列表
  const [checkYwlx, setCheckYwlx] = useState<any>('02');   // 快捷菜单 业务类型
  const [valueKjInput, setValueKjInput] = useState<any>('');   // 快捷菜单 查询
  const [ywlxList, setYwlxList] = useState<any>([]);;   // 右侧列选择
  const access = useAccess();

  const zyParam = {
    zycode: 'S_000001_000001',
    accessObj: access,
  }
  // 利用对象进行图标映射
  const iconMapping = {
    QuestionOutlined: <QuestionOutlined style={{color:"#4490DB"}} />,
    CoffeeOutlined: <CoffeeOutlined style={{color:"#4490DB"}} />,
    DeploymentUnitOutlined: <DeploymentUnitOutlined style={{color:"#4490DB"}} />,
    GoldOutlined: <GoldOutlined style={{color:"#4490DB"}} />,
    SaveOutlined: <SaveOutlined style={{color:"#4490DB"}} />,
    ShopOutlined: <ShopOutlined style={{color:"#4490DB"}} />,
    GroupOutlined: <GroupOutlined style={{color:"#4490DB"}} />,
    OneToOneOutlined: <OneToOneOutlined style={{color:"#4490DB"}} />,
    BuildOutlined: <BuildOutlined style={{color:"#4490DB"}} />,
    BookOutlined: <BookOutlined style={{color:"#4490DB"}} />,
    CalendarOutlined: <CalendarOutlined style={{color:"#4490DB"}} />,
    LayoutOutlined: <LayoutOutlined style={{color:"#4490DB"}} />,
    ProfileOutlined: <ProfileOutlined style={{color:"#4490DB"}} />,
    FundOutlined: <FundOutlined style={{color:"#4490DB"}} />,
    CheckSquareOutlined: <CheckSquareOutlined style={{color:"#4490DB"}} />,
    BarChartOutlined: <BarChartOutlined style={{color:"#4490DB"}} />,
    SendOutlined: <SendOutlined style={{color:"#4490DB"}} />,
    AuditOutlined: <AuditOutlined style={{color:"#4490DB"}} />,
    FormOutlined: <FormOutlined style={{color:"#4490DB"}} />,
    RadarChartOutlined: <RadarChartOutlined style={{color:"#4490DB"}} />,
    AreaChartOutlined: <AreaChartOutlined style={{color:"#4490DB"}} />,
    CreditCardOutlined: <CreditCardOutlined style={{color:"#4490DB"}} />,
    VerifiedOutlined: <VerifiedOutlined style={{color:"#4490DB"}} />,
    ScheduleOutlined: <ScheduleOutlined style={{color:"#4490DB"}} />,
    ContainerOutlined: <ContainerOutlined style={{color:"#4490DB"}} />,
    CloudServerOutlined: <CloudServerOutlined style={{color:"#4490DB"}} />,
    ProjectOutlined: <ProjectOutlined style={{color:"#4490DB"}} />,
    RobotOutlined: <RobotOutlined style={{color:"#4490DB"}} />,
    InteractionOutlined: <InteractionOutlined style={{color:"#4490DB"}} />,
    FileProtectOutlined: <FileProtectOutlined style={{color:"#4490DB"}} />,
    UserOutlined: <UserOutlined style={{color:"#4490DB"}} />,
    HomeOutlined: <HomeOutlined style={{color:"#4490DB"}} />,
    SecurityScanOutlined: <SecurityScanOutlined style={{color:"#4490DB"}} />,
  }

  useEffect(() => {
    Promise.all([myUtil.code.getCodeFromServerT1('code_dm_ckts_cktmsbakzlx', '01')]).then(() =>  {
    }).catch(() => {
      message.error('获取码表失败');
    }).finally(() => {
      getUserInfo(); // 得到用户信息
    });

    getKjcdData();  // 得到快捷菜单数据
    getQueryKpzcddm(); // 快捷菜单业务类型
    xhsjzrDDAlert(); // 新户数据准入弹窗
  }, []);

  // 出口退税管理
  const xhsjzrDDAlert = () => {
    // 新户数据准入跳转
    getXhsjzrData({}).then(async (res: any) => {
      const { code, body } = res;
      if (code == '200') {
        if (!body.sjzruuid) {
          DDAlert.open({
            title: '系统提示',
            info: [
              '欢迎使用本系统！',
              '首次使用需先完成「新户数据准入」，',
              '确保审核结果反馈、出口报关单、进项发票等数据正常同步。'
            ],
            okText: '确定',
            cancelText: '取消',
            infoType: 'warning',
            modalType: 'confirm',
            closeStatus: false,
            okCallbackFn: function (thisObj: any) {
              history.push('/02/0220');
              DDAlert.close();
            },
            cancelCallbackFn: function () {
              DDAlert.close();
            }
          })
        }
      }
    })
  }

  const getQueryKpzcddm = () => {
    queryKpzcddm({}).then((res: any) => {
      const {code, body} = res;
      if(code == '200') {
        setYwlxList(body)
      }
    })
  }

  // 用户信息
  const getUserInfo = () => {
    const userInfo = myUtil.sessionStore.getItem('userInfo');
    if(userInfo && userInfo?.qxQys[0]) {
      const qxQys = userInfo?.qxQys[0];
      const obj = {
        hgqyDm: qxQys?.hgqyDm,
        nsrmc: qxQys?.nsrmc,
        nsrsbh: qxQys?.nsrsbh,
        shxydm: qxQys?.shxydm,
        cktsqylxDm: qxQys?.cktsqylxDm === 'SC' || qxQys?.cktsqylxDm === 'sc' ? '生产企业' : qxQys?.cktsqylxDm === 'WM' || qxQys?.cktsqylxDm === 'wm' ? '外贸企业' : '',
        kzxxDms: qxQys?.kzxxDms,
        tgshzlBz: qxQys?.tgshzlBz
      }
      setUserData(obj);
    }
  }

  // 快捷菜单
  const getKjcdData = () => {
    getKjcdApi({}).then((res: any)=>{
      const {code, body} = res;
      if(code == '200') {
        setIconData(body);
        // setCheckCdList(body);
      }
    })
  }

  // 打开快捷菜单
  const changeIcon = () => {
    handleModalVisible(true)
    const obj = {
      ywlx: '02', // 默认数据
      text: ''
    }
    setValueKjInput('');
    setCheckYwlx('02');
    setCdList([]);
    // 得到右侧数据
    getKjcdApi({}).then((res: any)=>{
      const {code, body} = res;
      if(code == '200') {
        setCheckCdList(body);
        getKjcdList(obj, body); // 得到左侧数据
      }
    })
  }

  // 获取快捷菜单列表
  const getKjcdList = (param: any, data: any) => {
    const obj = {
      gjdcdDm: param.ywlx,
      cdmc: param.text,
    }
    setMasker2(true)
    queryKpzKjcd(obj).then((res: any) => {
      setMasker2(false)
      const {code, body} = res;
      if(code === '200') {
        const arr: any = body;
        const checkList = checkCdList.length > 0? checkCdList : data;
        if(checkList.length > 0) {
          for(let i=0; i< checkList.length; i++) {
            for(let j=0; j< arr.length; j++) {
              if(checkList[i].cdDm === arr[j].cdDm) {
                arr.splice(j, 1);
                j = j - 1;
              }
            }
          }
        }
        setCdList(arr);
      }
    })
  }

  // 切换企业
  const selectCompany = () =>{
    // 切换企业的条件  暂定
    if(myUtil.localStore.getItem('qxQysSaas')?.length > 0) {
      refCompanyModal.current?.showModal({});
    }
  }


  // 快捷菜单
  const getContent = () => {
    const colHtml1: any = [];
    const colHtml2: any = [];
    const iconData1 = iconData.slice(0,4);
    let iconData2:any;
    if(iconData.length > 4) {
      iconData2 = iconData.slice(4,8);

      iconData2.forEach((item: any) => {
        const icon = iconMapping[item.tbys];
        colHtml2.push(
          <Col span={6}>
            <div onClick={()=>gotoHref(item.cdlj)}>
              <Avatar className="kjcd-avatar" size={90} icon={icon} key={item.cdDm} />
              <div style={{marginTop: '5px'}}>{item.cdmc}</div>
            </div>
          </Col>
        )
      });
    }
    iconData1.forEach((item: any) => {
      const icon = iconMapping[item.tbys];
      colHtml1.push(
        <Col span={6}>
          <div onClick={()=>gotoHref(item.cdlj)}>
            <Avatar className="kjcd-avatar" size={90} icon={icon} key={item.cdDm} />
            <div style={{marginTop: '13px'}}>{item.cdmc}</div>
          </div>
        </Col>
        )
    });
    const myRef = useRef(null);
    return <ProCard
      title={<div className="col-pro-title">快捷菜单</div>}
      extra={<Button type="link"  style={{marginTop: '2px'}} onClick={changeIcon}>编辑</Button>}
      size="small"
    >
      <div className='carousel-content'>
        <Row>
          <Col span={2}>
            {iconData.length > 4 ?
              <div className="carousel-btnLeft" onClick={() => { myRef?.current?.prev?.() }}><LeftOutlined style={{cursor:'pointer'}} /></div>
              : <></>}
          </Col>
          <Col span={20}>
            {iconData.length > 4 ?
              <Carousel ref={myRef}>
                <div className='carousel-box'><Row gutter={[20,20]}>{colHtml1}</Row></div>
                <div className='carousel-box'><Row gutter={[20,20]}>{colHtml2}</Row></div>
              </Carousel> :
              <Carousel ref={myRef}>
                <div className='carousel-box'><Row gutter={[20,20]}>{colHtml1}</Row></div>
              </Carousel>
            }
          </Col>
          <Col span={2}>
            {iconData.length > 4 ?
              <div className="carousel-btnRight" onClick={() => { myRef?.current?.next?.() }}><RightOutlined style={{cursor:'pointer'}} /></div>
              : <></>}
          </Col>
        </Row>
      </div>
    </ProCard>
  }

  // 跳转
  const gotoHref = (path: any) => {
    if(path) {
      history.push(path);
    }
  }

  // 标签
  const htmlBq = (flag: any, data: any, tgshzlBz: any) => {
    const arrHtml: any = [];
    if(flag === 1) {
      const style = {
        padding: '3px 7px',
        border: '1px solid #fff',
        backgroundColor: 'transparent',
        marginTop: '5px',
        marginBottom: '5px',
        borderRadius: '4px',
        marginRight: '8px',
        color: '#fff',
      }
      if(tgshzlBz === 'Y') {
        arrHtml.push(<Tag style={style}>收汇</Tag>)
      }
      if(data.length > 0){
        data.forEach((item: any) => {
          const text = myUtil.code.getCodeValByKey(item, 'code_dm_ckts_cktmsbakzlx', '01')
          if(text) {
            arrHtml.push(<Tag style={style} key={item}>{text}</Tag>)
          }
        });
      }
    } else {
      if(tgshzlBz === 'Y') {
        arrHtml.push(<Tag className="col-tab-bq">收汇</Tag>)
      }
      if(data.length > 0){
        data.forEach((item: any) => {
          const text = myUtil.code.getCodeValByKey(item, 'code_dm_ckts_cktmsbakzlx', '01');
          if(text) {
            arrHtml.push(<Tag className="col-tab-bq" key={item}>{text}</Tag>)
          }
        });
      }
    }
    return arrHtml;
  }

  // 快捷菜单保存
  const handleSave = () => {
    const checkKey: any = [];
    checkCdList.forEach((item: any) => {
      checkKey.push(item.cdDm)
    });
    const obj = {
      cdDms: checkKey,
    }
    saveKjcd(obj).then((res: any) => {
      const {code} = res;
      if(code == '200') {
        message.success('快捷菜单更新成功！');
        handleModalVisible(false);
        getKjcdData();
      }
    })
  }

  // 点击按钮去右侧
  const clickKjLeft = (id: any) => {
    const arr = [...cdList];
    const arr02 = [...checkCdList];
    if(arr02.length > 7) {
      message.info('最多选八个快捷菜单！')
    } else {
      arr.forEach((item: any, index: any) => {
        if(item.cdDm === id) {
          arr02.push(item)
          arr.splice(index, 1);
        }
      });
      setCdList(arr);
      setCheckCdList(arr02)
    }
  }

  // 点击按钮去左侧
  const clickKjRight  = (obj: any) => {
    const arr = [...checkCdList];
    const arr02 = [...cdList];
    arr.forEach((item: any, index: any) => {
      if(item.cdDm === obj.cdDm) {
        arr.splice(index, 1);
        if(obj.gjdcdDm === checkYwlx) {
          arr02.push(item)
        }
      }
    });
    setCheckCdList(arr);
    setCdList(arr02);
  }

  // 快捷菜单
  const getKjcdContent = (flag: any) => {
    if(flag == 1) {
      const html: any = [];
      html.push(<List
        size="small"
        bordered
        dataSource={cdList}
        itemLayout='vertical'
        renderItem={(item: any) => 
        <List.Item key={item.cdDm}>
          <Tooltip title={item.cdmc} placement="topLeft">
            <div className="kjcd-tool-div">{item.cdmc}</div>
          </Tooltip>
          <a style={{float: 'right', marginTop: '-21px'}} onClick={()=>clickKjLeft(item.cdDm)}><RightCircleFilled style={{fontSize: '22px'}} /></a>
        </List.Item>}
      />)
      return html
    } else {
      const html: any = [];
      html.push(<List
        size="small"
        bordered
        dataSource={checkCdList}
        itemLayout='vertical'
        renderItem={(item: any) => 
        <List.Item key={item.cdDm}>
          <Tooltip title={item.cdmc} placement="topLeft">
            <div className="kjcd-tool-div">{item.cdmc}</div>
          </Tooltip>
          <a style={{float: 'right', marginTop: '-21px'}} onClick={()=>clickKjRight(item)}><LeftCircleFilled style={{fontSize: '22px'}} /></a>
        </List.Item>}
      />)
      return html
    }
  }

  // 业务类型
  const handleChangeYw = (value: string) => {
    setCheckYwlx(value)
    const obj = {
      ywlx: value,
      text: valueKjInput
    }
    getKjcdList(obj, [])
  };

  // 输入框快捷菜单查询值
  const changeKjInput = (e: any) => {
    setValueKjInput(e.target.value)
  }

  // 点击查询按钮
  const searchKjcd = () => {
    const obj = {
      ywlx: checkYwlx,
      text: valueKjInput
    }
    getKjcdList(obj, [])
  }

  // 企业信息
  const getUserHtml = () => {
    const html = [];
    html.push(
      <ProCard className='userinfo-content'>
        <div style={{margin: '-7px -20px 0 -20px'}}>
          <Row>
            <Col xs={1} sm={1} md={1} lg={2} xl={5} xxl={5}>
              <div className='userinfo-icon'></div>
            </Col>
            <Col xs={23} sm={23} md={23} lg={22} xl={19} xxl={19} style={{paddingRight:'20px'}}>
              <Col span={22}>
                <div className='userinfo-title'>{userData.nsrmc}</div>
              </Col>
              <Col span={2}>
                { myUtil.localStore.getItem('qxQysSaas')?.length > 0 ?
                  <Button type="link" onClick={selectCompany}>切换企业</Button> : <></>
                }
              </Col>
              <Col span={24}>
                <div>
                  { userData.kzxxDms?.length > 0 || userData.tgshzlBz === "Y" ?
                    <Tooltip title={htmlBq(1, userData.kzxxDms, userData.tgshzlBz)} color='rgba(50, 70, 90, 0.88)' overlayInnerStyle={{minWidth: '400px'}} placement="bottomLeft">
                      <div className="toolBq-class" style={{cursor: 'pointer'}}>{htmlBq(2, userData.kzxxDms, userData.tgshzlBz)}</div>
                    </Tooltip> : <></>
                  }
                </div>
              </Col>
            </Col>
          </Row>
        </div>
        <div className="userinfo-box">
          <Row>
            <Col xs={1} sm={1} md={1} lg={2} xl={5} xxl={4}>
            </Col>
            <Col xs={23} sm={23} md={23} lg={22} xl={19} xxl={20}>
              <div className="toolBq-class">
                <span className="user-title-info">海关代码：</span>
                <span className="user-text-info">{userData.hgqyDm}</span>
              </div>
              <div className="toolBq-class">
                <span className="user-title-info">纳税人识别号：</span>
                <span className="user-text-info">{userData.nsrsbh}</span>
              </div>
              <div className="toolBq-class">
                <span className="user-title-info">社会信用代码：</span>
                <span className="user-text-info">{userData.shxydm}</span>
              </div>
              <div className="toolBq-class">
                <span className="user-title-info">企业类型：</span>
                <span className="user-text-info">{userData.cktsqylxDm}</span>
              </div>
            </Col>
          </Row>
        </div>
      </ProCard>
    )
    return html;
  }

  return (
    <Spin tip="Loading..." spinning={masker} delay={200}>
      <div className="hts_workspace_chart">
        <div style={{maxWidth: "1366px", minWidth: '1280px'}} className="pro_chart">
          <Row gutter={[20, 20]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={16} xxl={16}>
              <Row gutter={[20, 20]}>
                { qxUtil.getZy(zyParam) ?<></>:
                  <Col span={24}>
                    <Step1 type='1' />
                  </Col>
                }
                <Col span={24}>
                  <ColumnCharts />
                </Col>
                <Col span={24}>
                  {userData.cktsqylxDm == '生产企业' ? <ColumnScMdtseCharts/> : <ColumnWmtseCharts/>}
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={8} xxl={8}>
              <Row gutter={[20, 20]}>
                {/* <Col span={24}>
                  {getUserHtml()}
                </Col> */}
                <Col span={24}>
                  <PieCharts />
                </Col>
                <Col span={24}>
                  <Step1 type='3' />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
      <CompanyModal onRef={refCompanyModal} />
      <Modal
        title='快捷菜单编辑'
        visible={createModalVisible}
        wrapClassName='standard-modal-1'
        width={pro.c_modal_width_x3}
        okText="保存"
        cancelText="关闭"
        onCancel={() => handleModalVisible(false)}
        onOk={handleSave}
        destroyOnClose
        maskClosable={false}
      >
        <Spin tip="Loading..." spinning={masker2} delay={200}>
          <div className="workplace-kjcd" style={{padding: '10px'}}>
            <Row gutter={[20, 16]}>
              <Col span={14}>
                <div className="kjcd-box" style={{}}>
                  <ProCard
                    title={<div className="col-pro-title"><div className="kjcd-blue"></div>业务功能选择</div>}
                    size="small"
                  >
                    <div>
                      <Row gutter={[20, 16]}>
                        <Col span={11}>
                          业务类型：
                          <Select defaultValue={checkYwlx} style={{width: '65%'}} onChange={handleChangeYw}>
                            {
                              ywlxList?.map((item: any,keys: any) => (
                                <Select.Option key={item.gjdcdDm} label={item.cdmc} value={item.gjdcdDm}>{item.cdmc}</Select.Option>
                              ))
                            }
                          </Select>
                        </Col>
                        <Col span={13}>
                          业务名称：
                          <Input placeholder="业务名称" value={valueKjInput} onChange={changeKjInput} style={{width: '42%'}}  />
                          <Button type="primary" onClick={searchKjcd} style={{float: 'right'}}>查询</Button>
                        </Col>
                      </Row>
                    </div>
                    <div style={{paddingTop: '20px', overflowY: 'auto', height: `${document.documentElement.clientHeight - 250}px`}}>
                      {getKjcdContent(1)}
                    </div>
                  </ProCard>
                </div>
              </Col>
              <Col span={10}>
                <div className="kjcd-box">
                  <ProCard
                    title={<div className="col-pro-title"><div className="kjcd-blue"></div>已选常用功能</div>}
                    size="small"
                  >
                    <div style={{overflowY: 'auto', height: `${document.documentElement.clientHeight - 220}px`}}>
                      {getKjcdContent(2)}
                    </div>
                  </ProCard>
                </div>
              </Col>
            </Row>
          </div>
        </Spin>
      </Modal>
    </Spin>
  );
};
export default Index;
