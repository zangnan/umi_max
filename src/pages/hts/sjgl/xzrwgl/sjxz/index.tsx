import cktsUtil from '@/pages/hts/cktsUtil';
import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Tabs, Form, Spin, message, Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import cardStyle from './cardLess2.less';
import ProCard from '@ant-design/pro-card';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { queryKak, hgsjxz, xzrwjy } from '@/pages/hts/services/htsApi';
import { history } from 'umi';
import Ckbgd from '../hgsjxz/ckbgd';
import Jkbgd from '../hgsjxz/jkbgd';
import Zzszyjks from '../hgsjxz/zzszyjks';
import Jgszch from '../hgsjxz/jgszch';
import Badzzl from '../hgsjxz/badzzl';
import DDAlert from '@/pages/hts/commonModule/DDAlert';
import IcList from '@/pages/hts/pzgl/icCard/common/icCardTsList';
import IcListGpt from '@/pages/hts/pzgl/icCard/common/icCardTsListGpt';
import IcListYbt from '@/pages/hts/pzgl/icCard/common/icCardTsListYbt';
import myUtil from '@/components/DDAssist/util';
import khdgjUtil from '@/pages/hts/ckfp/khdgjUtil';

const Index: React.FC<{ data: any }> = ({
  data
}) => {
  const qylx = cktsUtil.sys.enterpriseType();

  const [masker, setMasker] = useState(false);
  const [pdata, setPdata] = useState<any>();
  const [chardIndex, setCardIndex] = useState<any>('');
  const [expand, setExpand] = useState(false);
  const [searchHeight, setSearchHeight] = useState('140px');
  const [tab, setTab] = useState('hgdzxzjy');
  //勾选标志，报关单下载用。是否勾选更新发票号

  const refICList: any = useRef(); // 环境检测
  const refICListGpt: any = useRef(); // 关票通环境检测
  const refICListYbt: any = useRef();

  const [bgdForm] = Form.useForm();
  const [jmscForm] = Form.useForm();
  const [baForm] = Form.useForm();
  const [jksForm] = Form.useForm();

  const bgdsjly = cktsUtil.sys.bgdsjlyType();

  useEffect(() => {
    queryKakxx({ "sdbz": "N" });
  }, [data]);

  //查询口岸卡
  const queryKakxx = (param: any) => {
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
  // 新增-跳转到口岸卡管理页面
  const add = () => {
    history.push({
      pathname: '/hts/pzgl/icCard/icCardgl',
      query: { flag: '1' }
    });
  }

  // 改变卡片
  const changeCard = (index: any) => {
    setCardIndex(index);
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
            className={chardIndex === item.kakuuid ? cardStyle.cardBox2 : cardStyle.cardBoxFFF2}
          >
            <Card.Meta
              avatar={<div className={cardStyle.cardAvatar2}></div>}
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

  const tabChange = (param: any) => {
    setTab(param);
  }


  // 下载驱动（在线）
  const downloadDriver = async () => {
    setMasker(true)
    let a = document.createElement('a');//创建一个a标签元素
    a.style.display = 'none';//设置元素不可见
    a.href = 'https://dditpublic.oss-cn-beijing.aliyuncs.com/SAASTOOLS_UPGRADE/SAASTOOLS2023_20230908/%E5%AE%A2%E6%88%B7%E7%AB%AF%E5%B7%A5%E5%85%B7.zip'; //设置下载地址
    document.body.appendChild(a);//加入
    a.click(); //触发点击,下载
    document.body.removeChild(a);//释放
    setMasker(false)
  }


  // 申请下载
  const sqxzBtn = async () => {
    if (chardIndex == '') {
      message.info('请选择口岸卡！');
      return;
    }
    const param: any = {};
    const curShowModal = refICList.current!.showModal;
    const curShowModalGpt = refICListGpt.current!.showModal;
    const curShowModalYbt = refICListYbt.current!.showModal;

    if (tab == 'hgdzxzjy') {
      //出口报关单
      const formValues = await bgdForm.validateFields();
      let sjgjsjDm = '';
      let tjzdmc = '';
      param.gxckfphbz = formValues?.gxckfphbz;
      if (formValues?.ndsj == '0') {
        sjgjsjDm = formValues?.bah?.substr(8, 1) == '1' ? '010201' : '010101';
        tjzdmc = '报关单号';
        param.czfdm = '01';
        param.csz1 = formValues?.bah;
        param.sjgjsjDms = [sjgjsjDm];
      } else if (formValues?.ndsj == '9') {
        sjgjsjDm = '010101';
        tjzdmc = '按报关单号批量下载：涉及报关单' + formValues?.plscbgdBgdzs + '份';
        param.csz1 = '020201_CKHWBGDXZ';
        const userInfo = myUtil.sessionStore.getItem('userInfo');
        param.csz2 = userInfo?.qxyh?.yhuuid1;
        param.czfdm = '04';
        param.sjgjsjDms = [sjgjsjDm];
      } else {
        tjzdmc = '开始日期';
        param.czfdm = '08';
        const time1 = moment(formValues.hgSxrq[0]).format('yyyy-MM-DD');
        const time2 = moment(formValues.hgSxrq[1]).format('yyyy-MM-DD');
        param.csz1 = moment(time1).startOf('day').format('x');
        param.csz2 = moment(time2).startOf('day').format('x');
        param.bgdlx = formValues?.ndsj2;
        param.bgdsjlx = formValues?.ndsj3 ? formValues?.ndsj3 : ['YBBGD', 'ZGTQBGD'];
        if (formValues?.ndsj2.includes('YJGJK')) {
          param.sjgjsjDms = ['010201'];
        }
        if (formValues?.ndsj2?.includes('WJGCK') || formValues?.ndsj2?.includes('YJGCK')) {
          param.sjgjsjDms = ['010101'];
        }
      }
      param.tjzdmc = tjzdmc;
      const cs: any = {
        param: param
      }
      if (bgdsjly === '6') {
        curShowModalYbt(cs, chardIndex);
      } else {
        setMasker(true);
        khdgjUtil.checkIsExistTaskBgd(chardIndex).then(async (res: any) => {
          setMasker(false);
          if (res == 'N') {
            setMasker(true);
            await xzrwjy(param).then(async (res) => {
              setMasker(false);
              const {code, msg } = res;
              if ('200' == code) {
                // 判断关票通 数据来源
                if (bgdsjly === '4') {
                  curShowModalGpt(cs, chardIndex);
                } else {
                  curShowModal(cs, chardIndex);
                }
              } else {
                message.error(msg);
              }
            });
          } else if (res == 'E') {
            // message.error('客户端工具连接失败。');
            // return;
            DDAlert.open({
              title: '提示信息',
              info: `客户端工具运行异常，建议尝试以下解决方案：`,
              infoType: 'warning',
              okText: '下载工具',
              closeStatus: false,
              content: <>
                <div style={{ height: '105', lineHeight: '35px' }}>
                  <div>（1）若已下载最新版本客户端工具，请运行启动客户端工具；</div>
                  <div>（2）若未下载最新版本客户端工具，请下载工具；</div>
                  {bgdsjly != '4' ? <div>（3）请确保当前电脑可以登录国际贸易单一窗口</div> : <></>}
                </div>
              </>,
              button: [
                <Button key='close' onClick={() => DDAlert.close()}>关闭</Button>,
                // bgdsjly != '4' ? <Button type="primary" key={'excelmbxz'} onClick={() => downloadDriver()}>下载IC卡客户端控件</Button> : <></>,
              ],
              okCallbackFn: async function (thisObj: any) {
                thisObj.setState({ customerBtnLoading: true });
                downloadDriver();
                thisObj.setState({ customerBtnLoading: false });
              }
            });
          } else {
            //有下载中的任务
            sjxz(param);
          }
        })
      }
    } else if (tab == 'jkbgd') {
      //进口报关单
      const formValues = await bgdForm.validateFields();
      let sjgjsjDm = '';
      let tjzdmc = '';
      if (formValues?.ndsj == '0') {
        sjgjsjDm = '010201';
        tjzdmc = '报关单号';
        param.czfdm = '01';
        param.csz1 = formValues?.bah;
        param.sjgjsjDms = [sjgjsjDm];
      } else {
        tjzdmc = '开始日期';
        param.czfdm = '08';
        const time1 = moment(formValues.hgSxrq[0]).format('yyyy-MM-DD');
        const time2 = moment(formValues.hgSxrq[1]).format('yyyy-MM-DD');
        param.csz1 = moment(time1).startOf('day').format('x');
        param.csz2 = moment(time2).startOf('day').format('x');
        param.sjgjsjDms = ['010201'];
      }
      param.tjzdmc = tjzdmc;
      const cs: any = {
        param: param
      }
      if (bgdsjly === '6') {
        curShowModalYbt(cs, chardIndex);
      } else {
        setMasker(true);
        khdgjUtil.checkIsExistTaskBgd(chardIndex).then(async (res: any) => {
          setMasker(false);
          if (res == 'N') {
            setMasker(true);
            await xzrwjy(param).then(async (res) => {
              setMasker(false);
              const { body, code, msg } = res;
              if ('200' == code) {
                // 判断关票通 数据来源
                if (bgdsjly === '4') {
                  curShowModalGpt(cs, chardIndex);
                } else {
                  curShowModal(cs, chardIndex);
                }
              } else {
                message.error(msg);
              }
            });
          } else if (res == 'E') {
            // message.error('客户端工具连接失败。');
            // return;
            DDAlert.open({
              title: '提示信息',
              info: `客户端工具运行异常，建议尝试以下解决方案：`,
              infoType: 'warning',
              okText: '下载工具',
              closeStatus: false,
              content: <>
                <div style={{ height: '105', lineHeight: '35px' }}>
                  <div>（1）若已下载最新版本客户端工具，请运行启动客户端工具；</div>
                  <div>（2）若未下载最新版本客户端工具，请下载工具；</div>
                  {bgdsjly != '4' ? <div>（3）请确保当前电脑可以登录国际贸易单一窗口</div> : <></>}
                </div>
              </>,
              button: [
                <Button key='close' onClick={() => DDAlert.close()}>关闭</Button>,
                // bgdsjly != '4' ? <Button type="primary" key={'excelmbxz'} onClick={() => downloadDriver()}>下载IC卡客户端控件</Button> : <></>,
              ],
              okCallbackFn: async function (thisObj: any) {
                thisObj.setState({ customerBtnLoading: true });
                downloadDriver();
                thisObj.setState({ customerBtnLoading: false });
              }
            });
          } else {
            //有下载中的任务
            sjxz(param);
          }
        })
      }
    } else if (tab == 'jgmyszc') {
      //加工贸易手账册
      // const formValues = await jmscForm.validateFields();
      setMasker(true);
      await jmscForm.validateFields().then(values => {
        setMasker(false);
        const param = {};
        let tjzdmc = '';
        if (values?.ndsj == '0') {
          // sjgjsjDm = values.sjgjsjDm;
          tjzdmc = '贸易加工手册号';
          param.czfdm = '01';
          param.csz1 = values?.bah;
          if (values?.bah.toUpperCase().startsWith('C')) {
            param.sjgjsjDms = ['010300'];
          } else {
            param.sjgjsjDms = ['010400'];
          }
        } else {
          tjzdmc = '开始日期';
          param.czfdm = '08';
          const time1 = moment(values.hgSxrq[0]).format('yyyy-MM-DD');
          const time2 = moment(values.hgSxrq[1]).format('yyyy-MM-DD');
          param.csz1 = moment(time1).startOf('day').format('x');
          param.csz2 = moment(time2).startOf('day').format('x');
          param.sjgjsjDms = [values.sjgjsjDm];
        }
        param.tjzdmc = tjzdmc;
        const cs: any = {
          param: param
        }
        setMasker(true);
        khdgjUtil.checkIsExistTask(chardIndex).then(async (res: any) => {
          setMasker(false);
          if (res == 'N') {
            await xzrwjy(param).then(async (res) => {
              const { body, code, msg } = res;
              if ('200' == code) {
                curShowModal(cs, chardIndex);
              } else {
                message.error(msg);
              }
            });
          }
          else if (res == 'E') {
            // message.error('客户端工具连接失败。');
            // return;
            DDAlert.open({
              title: '提示信息',
              info: `客户端工具运行异常，建议尝试以下解决方案：`,
              infoType: 'warning',
              okText: '下载工具',
              closeStatus: false,
              content: <>
                <div style={{ height: '105', lineHeight: '35px' }}>
                  <div>（1）若已下载最新版本客户端工具，请运行启动客户端工具；</div>
                  <div>（2）若未下载最新版本客户端工具，请下载工具；</div>
                  {bgdsjly != '4' ? <div>（3）请确保当前电脑可以登录国际贸易单一窗口</div> : <></>}
                </div>
              </>,
              button: [
                <Button key='close' onClick={() => DDAlert.close()}>关闭</Button>,
                // bgdsjly != '4' ? <Button type="primary" key={'excelmbxz'} onClick={() => downloadDriver()}>下载IC卡客户端控件</Button> : <></>,
              ],
              okCallbackFn: async function (thisObj: any) {
                thisObj.setState({ customerBtnLoading: true });
                downloadDriver()
                thisObj.setState({ customerBtnLoading: false });
              }
            });
          }
          else {
            //有下载中的任务
            sjxz(param);
          }
        });
      })

    } else if (tab == 'zzszyjks') {
      //增值税专用缴款书
      // const formValues = await jksForm.validateFields();
      await jksForm.validateFields().then(formValues => {
        let tjzdmc = '';
        if (formValues?.ndsj == '0') {
          tjzdmc = '报关单号';
          param.czfdm = '01';
          param.csz1 = formValues?.bah;
          param.sjgjsjDms = ['080000'];
        } else {
          tjzdmc = '税单填发日期';
          param.czfdm = '08';
          const time1 = moment(formValues.hgSxrq[0]).format('yyyy-MM-DD');
          const time2 = moment(formValues.hgSxrq[1]).format('yyyy-MM-DD');
          param.csz1 = moment(time1).startOf('day').format('x');
          param.csz2 = moment(time2).startOf('day').format('x');
          param.bgdlx = formValues?.ndsj2;
          param.sjgjsjDms = ['080000'];
        }
        param.tjzdmc = tjzdmc;
        const cs: any = {
          param: param
        }
        setMasker(true);
        khdgjUtil.checkIsExistTask(chardIndex).then(async (res: any) => {
          setMasker(false);
          if (res == 'N') {
            await xzrwjy(param).then(async (res) => {
              const { body, code, msg } = res;
              if ('200' == code) {
                curShowModal(cs, chardIndex);
              } else {
                message.error(msg);
              }
            });
          } else if (res == 'E') {
            // message.error('客户端工具连接失败。');
            // return;
            DDAlert.open({
              title: '提示信息',
              info: `客户端工具运行异常，建议尝试以下解决方案：`,
              infoType: 'warning',
              okText: '下载工具',
              closeStatus: false,
              content: <>
                <div style={{ height: '105', lineHeight: '35px' }}>
                  <div>（1）若已下载最新版本客户端工具，请运行启动客户端工具；</div>
                  <div>（2）若未下载最新版本客户端工具，请下载工具；</div>
                  {bgdsjly != '4' ? <div>（3）请确保当前电脑可以登录国际贸易单一窗口</div> : <></>}
                </div>
              </>,
              button: [
                <Button key='close' onClick={() => DDAlert.close()}>关闭</Button>,
                // bgdsjly != '4' ? <Button type="primary" key={'excelmbxz'} onClick={() => downloadDriver()}>下载IC卡客户端控件</Button> : <></>,
              ],
              okCallbackFn: async function (thisObj: any) {
                thisObj.setState({ customerBtnLoading: true });
                downloadDriver()
                thisObj.setState({ customerBtnLoading: false });
              }
            });
          } else {
            //有下载中的任务
            sjxz(param);
          }
        })
      });
    } else {
      //备案单证资料
      // const formValues = await baForm.validateFields();
          param.sjgjsjDms = ['040000'];
        await baForm.validateFields().then(formValues => {
          param.xzld = formValues?.xzld;
        if(formValues?.xzld == 'ssq'){
          param.czfdm = '04';
          param.tjzdmc = qylx==='SC'?'所属期':'所属期批次';
          param.csz1 = formValues?.ssq;
          param.badzlx = formValues?.badzlx ? formValues?.badzlx :[];
        }else if(formValues?.xzld == 'czrq'){
          param.czfdm = '08';
          param.tjzdmc = '出口日期起止';
          param.csz1 = moment(formValues.hgSxrq[0]).format('yyyy-MM-DD');
          param.csz2 = moment(formValues.hgSxrq[1]).format('yyyy-MM-DD');
          param.badzlx = formValues?.badzlx ? formValues?.badzlx :[];
        }else if(formValues?.xzld == 'bgdhgbh'){
          param.czfdm = '01';
          param.tjzdmc = '报关单号';
          param.csz1 = formValues.ckbgdh;
          param.badzlx = formValues?.badzlx ? formValues?.badzlx :[];
        }else if(formValues?.xzld == 'plscbgdhgbh'){
          param.czfdm = '04';
          param.tjzdmc = '按报关单号批量下载：涉及报关单' + formValues?.plscbgdBgdzs + '份';
          param.csz1 = '020201_BADZXZ';
          const userInfo = myUtil.sessionStore.getItem('userInfo');
          param.csz2 = userInfo?.qxyh?.yhuuid1;
          param.badzlx = formValues?.badzlx ? formValues?.badzlx :[];
        }
        const cs: any = {
          param: param
        }
        if (bgdsjly === '6') {
          curShowModalYbt(cs, chardIndex);
        } else {
          setMasker(true);
          khdgjUtil.checkIsExistTask(chardIndex).then(async (res: any) => {
            setMasker(false);
            if (res == 'N') {
              await xzrwjy(param).then(async (res) => {
                const { body, code, msg } = res;
                if ('200' == code) {
                  curShowModal(cs, chardIndex);
                } else {
                  message.error(msg);
                }
              });
            }
            else if (res == 'E') {
              // message.error('客户端工具连接失败。');
              // return;
              DDAlert.open({
                title: '提示信息',
                info: `客户端工具运行异常，建议尝试以下解决方案：`,
                infoType: 'warning',
                okText: '下载工具',
                closeStatus: false,
                content: <>
                  <div style={{ height: '105', lineHeight: '35px' }}>
                    <div>（1）若已下载最新版本客户端工具，请运行启动客户端工具；</div>
                    <div>（2）若未下载最新版本客户端工具，请下载工具；</div>
                    {bgdsjly != '4' ? <div>（3）请确保当前电脑可以登录国际贸易单一窗口</div> : <></>}
                  </div>
                </>,
                button: [
                  <Button key='close' onClick={() => DDAlert.close()}>关闭</Button>,
                  // bgdsjly != '4' ? <Button type="primary" key={'excelmbxz'} onClick={() => downloadDriver()}>下载IC卡客户端控件</Button> : <></>,
                ],
                okCallbackFn: async function (thisObj: any) {
                  thisObj.setState({ customerBtnLoading: true });
                  downloadDriver()
                  thisObj.setState({ customerBtnLoading: false });
                }
              });
            }
            else {
              //有下载中的任务
              sjxz(param);
            }
          });
        }
      });

    }

  }
  const sjxz = async (parma: any) => {
    parma.kakuuid = chardIndex;
    await hgsjxz(parma).then(async (res) => {
      const { body, code, msg } = res;
      if ('200' == code) {
        DDAlert.open({
          title: '系统提示',
          info: '创建任务成功，是否跳转任务管理？',
          infoType: 'question',
          modalType: 'confirm',
          okCallbackFn: function (thisObj: any) {
            history.push({ pathname: '/02/0201' });
          },
        });
      } else {
        message.error(msg);
      }
    });
  }


  const saveHjjc = (flag: any) => {
    // 确认关闭
    refICList.current!.closeModal();
  }

  const saveHjjcGpt = () => {
    // 确认关闭
    refICListGpt.current!.closeModal();
  }

  const saveHjjcYbt = () => {
    // 确认关闭
    refICListYbt.current!.closeModal();
  }

  return <>
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <ProCard split="horizontal" className="dd_layout_form_01" style={{ height: myUtil.heightCalc.getCalc(['header', 'footerBtn', 'cardMargin']), backgroundColor: 'transparent' }}>
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
        <ProCard headerBordered={true} headStyle={{ backgroundColor: '#EEF3FC', paddingTop: '2px', paddingBottom: '2px' }} title="下载数据" style={{ marginTop: '16px' }} >
          <Tabs defaultActiveKey="hgdzxzjy" style={{ marginTop: '-20px', marginBottom: '-20px' }} onChange={tabChange}>
            <Tabs.TabPane tab="出口报关单" key="hgdzxzjy" className="hgdzxzjy">
              <Ckbgd chardIndex={chardIndex} form={bgdForm} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="进口报关单" key="jkbgd" className="jkbgd">
              <Jkbgd chardIndex={chardIndex} form={bgdForm} />
            </Tabs.TabPane>
            {cktsUtil.sys.enterpriseType() == 'SC' ?
              <Tabs.TabPane tab="加工贸易手账册" key="jgmyszc" className="jgmyszc">
                <Jgszch chardIndex={chardIndex} form={jmscForm} />
              </Tabs.TabPane> : <></>
            }
            {
              cktsUtil.menu.getMenuObjByPath('/hts/badz2') ? <>
                <Tabs.TabPane tab="备案单证资料" key="badzzl" className="badzzl">
                  <Badzzl chardIndex={chardIndex} form={baForm} />
                </Tabs.TabPane>
              </>:<></>
            }
            <Tabs.TabPane tab="增值税专用缴款书" key="zzszyjks" className="zzszyjks">
              <Zzszyjks chardIndex={chardIndex} form={jksForm} />
            </Tabs.TabPane>
          </Tabs>
        </ProCard>
        <ProCard className="ddlf01_footer">
          <Space>
            <Button type="primary" onClick={() => { sqxzBtn() }} >数据下载</Button>
          </Space>
        </ProCard>
      </ProCard>
      <IcList onRef={refICList} saveBtn={saveHjjc} />
      <IcListGpt onRef={refICListGpt} saveBtn={saveHjjcGpt} />
      <IcListYbt onRef={refICListYbt} saveBtn={saveHjjcYbt} />
    </Spin>
  </>;
};

export default Index;
