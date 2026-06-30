import cktsUtil from '@/pages/hts/cktsUtil';
import React, { useEffect, useState, useRef } from 'react';
import { Spin, Row, Col, Button, Tag, Tooltip, Avatar, message, Modal, Select, Input, List, Carousel, TreeSelect } from 'antd';
import ProCard from '@ant-design/pro-card';
import myUtil from '@/components/DDAssist/util';
import {
  getKjcdApi, queryKpzKjcd, saveKjcd, queryKpzcddm, bgdAndDlckzmTj, dclsjAndKsysjTj, queryDkckfpbgdCount, queryDhtckfpCount, queryDsbsjCount, queryDwcdzbaCount, fetchMenuData, queryNxfpkjWfmspCount, queryNxfpkjWhczpCount, queryNxfpkjHzqrdCount, getXhsjzrData } from '@/pages/hts/services/htsApi';
import { QuestionOutlined, CoffeeOutlined, GoldOutlined, SaveOutlined, GroupOutlined, ShopOutlined, DeploymentUnitOutlined, CalendarOutlined, BuildOutlined, BookOutlined, ContainerOutlined, CloudServerOutlined, ProjectOutlined, RobotOutlined, InteractionOutlined, FileProtectOutlined, UserOutlined, HomeOutlined, SecurityScanOutlined, OneToOneOutlined, CreditCardOutlined, VerifiedOutlined, ScheduleOutlined, AreaChartOutlined, AuditOutlined, RadarChartOutlined, FormOutlined, LayoutOutlined, ProfileOutlined, FundOutlined, CheckSquareOutlined, SendOutlined, BarChartOutlined, RightOutlined, PieChartOutlined, LineChartOutlined, DotChartOutlined, DiffOutlined, CopyOutlined, SnippetsOutlined, RightCircleFilled, LeftCircleFilled, LeftOutlined, QuestionCircleOutlined, FileZipOutlined, MergeCellsOutlined, PaperClipOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Indextable from './index_table';
import CONSTANTS from '@/components/DDAssist/constants';
import './style.less';
import { history } from 'umi';
import { TreeNodeProps } from 'rc-tree-select/lib/TreeNode';
import UrlhtmlShow from '@/pages/hts/components/UrlhtmlShow';
import DDAlert from '@/pages/hts/components/DDAlert';

const { TreeNode } = TreeSelect;

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

const Workbench: React.FC<unknown> = () => {

  const [masker, setMasker] = useState(false);
  const [masker2, setMasker2] = useState(false);
  const [userData, setUserData] = useState<any>({}); // 用户信息 数据
  const [iconData, setIconData] = useState<any>([]); // 快捷菜单 数据
  const [createModalVisible, handleModalVisible] = useState<boolean>(false); // 快捷菜单 打开
  const [cdList, setCdList] = React.useState<any>([]); // 菜单 列表
  const [checkCdList, setCheckCdList]= React.useState<any>([]); // 菜单 选中的菜单列表
  const [checkYwlx, setCheckYwlx] = useState<any>(''); // 快捷菜单 业务类型
  const [valueKjInput, setValueKjInput] = useState<any>(''); // 快捷菜单 查询
  const [showlist1, setShowlist1] = useState<boolean>(false); // 出口退税申报 显示
  const [cktsData, setCktsData] = useState<any>({}); // 出口退税申报值-免抵退，免退税

  const [dckfpNum, setDckfpNum] = useState<any>(0); // 出口退税申报值-待开出口发票报关单
  const [dhtckfpNum, setDhtckfpNum] = useState<any>(0); // 出口退税申报值-待开出口发票报关单
  const [dsbsjTstjNum, setDsbsjTstjNum] = useState<any>(0); // 出口退税申报值-待申报数据
  const [dzbaNum, setDzbaNum] = useState<any>(0); // 出口退税申报值-待完成单证备案
  const [usermenu, setArryUsermenu] = useState<any>([]); // 菜单-出口退税管理
  const [usermenuFp, setArryUsermenuFp] = useState<any>([]); // 菜单-发票管理
  const [ywTreeData, setYwTreeData] = useState<any>([]); // 业务类型
  const [nxfpkjWfmspts, setNxfpkjWfmspts] = useState<any>(0); // 内销-未赋码商品
  const [nxfpkjWhczpts, setNxfpkjWhczpts] = useState<any>(0); // 内销-未红冲专票
  // const [nxfpkjHzqrdts, setNxfpkjHzqrdts] = useState<any>(0); // 内销-红字确认单（全电）
  const [fppzCode, setFppzCode] = useState<any>({}); // 发票配置码表

  const qylx = cktsUtil.sys.enterpriseType();

  useEffect(() => {
    Promise.all([myUtil.code.getCodeFromServerT1('code_dm_ckts_cktmsbakzlx:01'), myUtil.code.getCodeFromServerT1('CODE_CS_ZXSB_FPKJ_CSPZ:01')]).then(() =>  {
    }).catch(() => {
      message.error('获取码表失败');
    }).finally(() => {
      getUserInfo(); // 得到用户信息
      const tempCode = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ:01');
      const fppz = tempCode[0];
      setFppzCode(fppz);
    });
    // 判断这个地址在菜单里面有没有
    getKjcdData();  // 得到快捷菜单数据
    getQueryKpzcddm();  // 快捷菜单业务类型
    getCktsData(); // 出口退税申报模块数据
    getNsfpkjData(); // 内销发票开具数据
    getUsetmenu(); // 获得菜单
  }, []);

  const getUsetmenu = async () => {
    let usermenu = myUtil.sessionStore.getItem('usermenu') || [];
    if (usermenu && usermenu.length > 0) {
      usermenu = myUtil.sessionStore.getItem('usermenu') || [];
    } else {
      const res = await fetchMenuData({});
      usermenu = res?.body;
    }
    if (usermenu) {
      const menuList = usermenu[1]?.routes || [];
      const arryUsermenu:any = [];
      for(let i=0; i<menuList.length; i++){
        if(menuList[i]?.id != '00' && menuList[i]?.name) {
          let lastPath = menuList[i]?.path;
          if(menuList[i].routes && menuList[i].routes.length > 0){
            lastPath = await getLastMenuPath(menuList[i].routes);
          }
          // 分组菜单不展示
          if (menuList[i]?.dropMenu) {
            continue;
          }
          const obj = {
            name: menuList[i]?.name,
            path: lastPath,
            id: menuList[i]?.id,
            icon: menuList[i]?.icon,
          }
          arryUsermenu.push(obj)
        }
      }
      setArryUsermenu(arryUsermenu)

      const menuListFp = usermenu[2]?.routes || [];
      const arryUsermenuFp:any = [];
      for(let i=0; i<menuListFp.length; i++){
        if(menuListFp[i]?.id && menuListFp[i]?.name) {
          let lastPath = menuListFp[i]?.path;
          if(menuListFp[i].routes && menuListFp[i].routes.length > 0){
            lastPath = await getLastMenuPath(menuListFp[i].routes);
          }
          const obj = {
            name: menuListFp[i]?.name,
            path: lastPath,
            id: menuListFp[i]?.id,
            icon: menuListFp[i]?.icon,
          }
          if( menuListFp[i]?.name === '销项管理' && cktsUtil.menu.getMenuObjByPath('/jsxj/fpkj/zpdkp')) {
            obj.path = '/jsxj/fpkj/zpdkp';
          }
          arryUsermenuFp.push(obj)
        }
      }
      setArryUsermenuFp(arryUsermenuFp)
    }
  }

  const getLastMenuPath: any = async (data: any) => {
    if (data[0].routes && data[0].routes.length > 0) {
      return getLastMenuPath(data[0].routes);
    } else {
      return data[0].path;
    }
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
        tgshzlBz: qxQys?.tgshzlBz,
        qylb: qxQys?.qylb==='A'?'一类':qxQys.qylb==='B'?'二类':qxQys.qylb==='C'?'三类':'四类',
      }
      setUserData(obj);
    }
  }

  // 出口退税模块数据
  const getCktsData = () => {
    const obj = {
      ckDclsjNum: 0, // 待处理报关单
      dlDclsjNum:0, // 待处理代理证明
      ckKsysNum: 0, // 可使用报关单
      dlKsysNum: 0, // 可使用代理证明
      dlJxfpNum: 0, // 可使用进项发票
    }
    // 待开出口发票报关单
    setMasker(true);
    queryDkckfpbgdCount({}).then((res:any)=>{
      setMasker(false);
      const {code, body, msg} = res;
      if(code === '200') {
        setDckfpNum(body?.dkckfpbgdTjts)
      } else {
        message.error(msg)
      }
    })
    // 待回填出口发票
    setMasker(true);
    queryDhtckfpCount({}).then((res:any)=>{
      setMasker(false);
      const {code, body, msg} = res;
      if(code === '200') {
        // obj.dhtckfpNum = body?.dhtckfpTjts;
        setDhtckfpNum(body?.dhtckfpTjts)
      } else {
        message.error(msg)
      }
    })
    if(qylx === 'SC') {
      // 退税申报（免退抵税）-首页-条数统计接口 - 生产
      setMasker(true);
      bgdAndDlckzmTj({}).then((res:any)=>{
        setMasker(false);
        const {code, body, msg} = res;
        if(code === '200' && body) {
          obj.ckDclsjNum = body.ckbgd?.dclsj; // 待处理报关单
          obj.dlDclsjNum = body.dlckhwzm?.dclsj; // 待处理代理证明
          obj.ckKsysNum = body.ckbgd?.ksysj; // 可使用报关单
          obj.dlKsysNum = body.dlckhwzm?.ksysj; // 可使用代理证明
          setCktsData(obj)
        } else {
          message.error(msg)
        }
      })
    } else {
      // 退税申报（免退税）-首页-条数统计接口 - 外贸
      setMasker(true);
      dclsjAndKsysjTj({}).then((res:any)=>{
        setMasker(false);
        const {code, body, msg} = res;
        if(code === '200' && body) {
          obj.ckDclsjNum = body.dclsj?.ckbgd; // 待处理报关单
          obj.dlDclsjNum = body.dclsj?.dlckhwzm; // 待处理代理证明
          obj.ckKsysNum = body.ksysj?.ckbgd; // 可使用报关单
          obj.dlKsysNum = body.ksysj?.dlckhwzm; // 可使用代理证明
          obj.dlJxfpNum = body.ksysj?.jxfp; // 可使用进项发票
          setCktsData(obj)
        } else {
          message.error(msg)
        }
      })
    }
    // 待申报数据
    setMasker(true);
    queryDsbsjCount({}).then((res:any)=>{
      setMasker(false);
      const {code, body, msg} = res;
      if(code === '200') {
        setDsbsjTstjNum(body?.dsbsjTstj)
      } else {
        message.error(msg)
      }
    })
    // 待完成单证备案
    setMasker(true);
    queryDwcdzbaCount({}).then((res:any)=>{
      setMasker(false);
      const {code, body, msg} = res;
      if(code === '200') {
        const dz: any = {};
        dz.ssqNum = body?.wgdSsqSbpcts; // 所属期（批次）个数
        dz.wgdsjtsNum = body?.wgdsjts; // 待完成备案数据条数
        setDzbaNum(dz)
      } else {
        message.error(msg)
      }
    })
  }

  // 内销发票开具
  const getNsfpkjData = () => {
    // 内销-未赋码商品
    // setMasker(true);
    // queryNxfpkjWfmspCount({}).then((res:any)=>{
    //   setMasker(false);
    //   const {code, body, msg} = res;
    //   if(code === '200') {
    //     setNxfpkjWfmspts(body.nxfpkjWfmspts)
    //   } else {
    //     message.error(msg)
    //   }
    // })
    // 内销-未红冲专票
    // setMasker(true);
    // queryNxfpkjWhczpCount({}).then((res:any)=>{
    //   setMasker(false);
    //   const {code, body, msg} = res;
    //   if(code === '200') {
    //     setNxfpkjWhczpts(body.nxfpkjWhczpts)
    //   } else {
    //     message.error(msg)
    //   }
    // })
    // 内销-红字确认单（全电）
    // setMasker(true);
    // queryNxfpkjHzqrdCount({}).then((res:any)=>{
    //   setMasker(false);
    //   const {code, body, msg} = res;
    //   if(code === '200') {
    //     setNxfpkjHzqrdts(body.nxfpkjHzqrdts)
    //   } else {
    //     message.error(msg)
    //   }
    // })
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
          const text = myUtil.code.getCodeValByKey(item, 'code_dm_ckts_cktmsbakzlx:01')
          if(text) {
            arrHtml.push(<Tag style={style} key={item}>{text}</Tag>)
          }
        });
      }
    } else {
      if(tgshzlBz === 'Y') {
        arrHtml.push(
          <Tooltip title='收汇' color='rgba(50, 70, 90, 0.88)' placement="bottomLeft">
            <Tag className="col-tab-bq">收汇</Tag>
          </Tooltip>
        )
      }
      if(data && data.length > 0){
        data.forEach((item: any) => {
          const text = myUtil.code.getCodeValByKey(item, 'code_dm_ckts_cktmsbakzlx:01');
          if(text) {
            arrHtml.push(
              <Tooltip title={text} color='rgba(50, 70, 90, 0.88)' placement="bottomLeft">
                <Tag className="col-tab-bq" key={item}>{text}</Tag>
              </Tooltip>
            )
          }
        });
      }
    }
    return arrHtml;
  }

  const searchData = (num: any) => {
    if(showlist1) {
      setShowlist1(false)
    } else {
      setShowlist1(true);
    }
  }

  // 去配单
  const gotoPd = (num: any) => {
    if(num === 1) {
      //出口发票开具-报关单管理，筛选状态为“未开票”
      history.push({ pathname: '/hts/ckfp/bgdgl', query: { bz: 'gzt' } } )
    } else if(num === 2){
      // 出口发票开具-发票管理
      // （1）导出开票“已导出”和“待开票”；
      // （2）在线开票“待开票”和“开票中”。
      history.push({ pathname: '/hts/ckfp/fpkjgl', query: { bz: 'gzt' } } )
    } else if(num === 3 && qylx === 'WM') {
      // 退税申报-外部数据管理-报关单管理-待处理数据页面
      history.push('/26/2602/260201/26020101');
    } else if(num === 3 && qylx === 'SC') {
      // 退税申报-外部数据管理-报关单管理-待处理数据页面
      history.push('/25/2502/250201/25020101');
    } else if(num === 4 && qylx === 'WM') {
      // 退税申报-外部数据管理-代理出口货物证明管理-待处理数据页面
      history.push('/26/2602/260202/26020201');
    } else if(num === 4 && qylx === 'SC') {
      //退税申报-外部数据管理-代理出口货物证明管理-待处理数据页面
      history.push('/25/2502/250202/25020201');
    } else if(num === 5) {
      //免抵退，退税申报-外部数据管理-报关单管理-可使用数据页面
      history.push('/25/2502/250201/25020103');
    } else if(num === 6) {
      // 免退税，退税申报-数据匹配-报关单逐项配单
      history.push('/26/2604/260401');
    } else if(num === 7) {
      // 免抵退，退税申报-外部数据管理-代理出口货物证明管理-可使用数据页面
      history.push('/25/2502/250202/25020202');
    } else if(num === 8) {
      // 免退税，退税申报-数据匹配-代理出口货物证明配单
      history.push('/26/2604/260404');
    } else if(num === 9) {
      // 免退税，退税申报-数据匹配-发票逐项配单
      history.push('/26/2604/260402');
    } else if(num === 10 && qylx === 'SC') {
      // 免抵退， 跳转至退税申报-退税申报页面
      history.push('/25/2505');
    } else if(num === 10 && qylx === 'WM') {
      // 免退税， 跳转至退税申报-退税申报页面
      history.push('/26/2605');
    } else if(num === 11) {
      // 备案单证-单证备案-单证备案页面
      history.push('/hts/badz/dzba/dzba');
    } else if(num === 12) {
      // 免退税，退税申报-外部数据管理-报关单管理-可使用数据页面
      history.push('/26/2602/260201/26020103')
    } else if(num === 13) {
      // 免退税，退税申报-外部数据管理-进项发票管理-可使用数据页面
      history.push('/26/2602/260203/26020301')
    } else if(num === 14) {
      // 免退税，退税申报-外部数据管理-代理出口货物证明管理-可使用数据页面
      history.push('/26/2602/260202/26020202')
    } else if(num === 15) {
      // 开票审核
      // history.push('/jsxj/kpsz/spda')
      history.push('/jsxj2/xxgl/jcsz/kpsz/spda')
    } else if(num === 16) {
      // 订单查询
      history.push('/jsxj/fpkj/fpch/zpch')
    } else if(num === 17) {
      // 异常订单
      // history.push('')
      alert('开发中')
    } else if(num === 18) {
      //出口发票开具2.0-报关单管理，筛选状态为“未开票”
      history.push({ pathname: '/hts/ckfpkj/bgdgl', query: { bz: 'gzt' } } )
    } else if(num === 19) {
      //出口发票开具2.0-开票状态跟踪，筛选发票状态为“开票中”
      history.push({ pathname: '/hts/ckfpkj/ckfpkj/fpztgz', query: { bz: 'gzt' } } )
    } else if(num === 20) {
      //出口发票开具2.0-导出开票：税控票
      history.push('/hts/ckfpkj/ckfpkj/skpkj')
    }  else if(num === 20) {
      //出口发票开具2.0-导出开票：数电票
      history.push('/hts/ckfpkj/ckfpkj/sdpkj')
    }
  }

  // 快捷菜单业务类型
  const getQueryKpzcddm = () => {
    queryKpzcddm({}).then((res: any) => {
      const {code, body} = res;
      if(code == '200' && body?.length > 0) {
        let val = body[0].id;
        if(body[0].routes){
          val = body[0].routes[0].id;
        }
        setCheckYwlx(val);
        setYwTreeData(body)
      }
    })
  }


  // 快捷菜单
  const getKjcdData = () => {
    getKjcdApi({}).then((res: any)=>{
      const {code, body} = res;
      if(code == '200') {
        setIconData(body);
      }
    })
  }

  // 获取快捷菜单列表
  const getKjcdList = (param: any, data: any) => {
    const obj = {
      gjdcdDm: param.ywlx,
      cdmc: param.text,
    }
    setMasker2(true);
    queryKpzKjcd(obj).then((res: any) => {
      setMasker2(false);
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

  // 打开快捷菜单
  const changeIcon = () => {
    handleModalVisible(true)
    const obj = {
      ywlx: checkYwlx, // 默认数据
      text: ''
    }
    setValueKjInput('');
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
    // if(arr02.length > 7) {
    //   message.info('最多选八个快捷菜单！')
    // } else {
      arr.forEach((item: any, index: any) => {
        if(item.cdDm === id) {
          arr02.push(item)
          arr.splice(index, 1);
        }
      });
      setCdList(arr);
      setCheckCdList(arr02)
    // }
  }

  // 点击按钮去左侧
  const clickKjRight = (obj: any) => {
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
          <Tooltip title={item.cdmcqc} placement="topLeft">
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
          <Tooltip title={item.cdmcqc} placement="topLeft">
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

  const getIcon:any = (id:any) => {
    const icon = myUtil.menu.getMenuObjById(id)?.icon;
    const pid = myUtil.menu.getMenuObjById(id)?.pid;
    if(icon) {
      return icon;
    } else if(pid) {
      return getIcon(pid);
    } else {
      return '';
    }
  }

  // 快捷菜单
  const getContentKjcd = () => {
    const colHtml1: any = [];
    const colHtml2: any = [];
    const iconData1 = iconData.slice(0,4);
    let iconData2:any;
    if(iconData.length > 4) {
      iconData2 = iconData.slice(4,8);
      iconData2.forEach((item: any) => {
        if(!item.tbys) {
          const pid = myUtil.menu.getMenuObjById(item.cdDm)?.pid;
          const icon = getIcon(pid);
          item.tbys = icon ? icon : 'QuestionOutlined';
        }
        const icon = iconMapping[item.tbys];
        colHtml2.push(
          <Col span={6}>
            <div onClick={()=>gotoHref(item.cdlj)}>
              <Avatar className="kjcd-avatar" size={90} icon={icon} key={item.cdDm} />
              <Tooltip title={item.cdmc}><div className='kjcd-icon-name'>{item.cdmc}</div></Tooltip>
            </div>
          </Col>
        )
      });
    }
    if(iconData1.length === 0) {
      colHtml1.push(
        <Col span={6}>
          <div onClick={changeIcon}>
            <Avatar className="kjcd-avatar" size={90} icon={<PlusCircleOutlined style={{color:"#4490DB"}} />} key='aa' />
            <div style={{marginTop: '13px'}}>添加</div>
          </div>
        </Col>
        )
    } else {
      iconData1.forEach((item: any) => {
        if(!item.tbys) {
          const pid = myUtil.menu.getMenuObjById(item.cdDm)?.pid;
          const icon = getIcon(pid);
          item.tbys = icon ? icon : 'QuestionOutlined';
        }
        const icon = iconMapping[item.tbys];
        colHtml1.push(
          <Col span={6}>
            <div onClick={()=>gotoHref(item.cdlj)}>
              <Avatar className="kjcd-avatar" size={90} icon={icon} key={item.cdDm} />
              <Tooltip title={item.cdmc}><div className='kjcd-icon-name'>{item.cdmc}</div></Tooltip>
            </div>
          </Col>
          )
      });
    }

    const myRef = useRef(null);
    return <ProCard
      title={<div className="col-pro-title">快捷菜单</div>}
      extra={<Button type="link" style={{marginTop: '2px'}} onClick={changeIcon}>编辑</Button>}
      size="small"
    >
      <div className='carousel-content'>
        <Row>
          <Col span={2}>
          {iconData.length > 4 ?
            <div className="carousel-btnLeft" onClick={() => { myRef?.current?.prev?.() }}><LeftOutlined style={{cursor:'pointer'}} /></div>
            : <></>
          }
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
            : <></>
          }
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

  const getUserHtml = () => {
    const html = [];
    html.push(
      <ProCard className='userinfo-content'>
        <div className="box-delta"><div>{userData.qylb}</div></div>
        <div style={{margin: '-7px -20px 0 -20px'}}>
          <Row>
            <Col xs={1} sm={1} md={1} lg={2} xl={5} xxl={5}>
              <div className='userinfo-icon'></div>
            </Col>
            <Col xs={23} sm={23} md={23} lg={22} xl={19} xxl={19} style={{paddingRight:'20px'}}>
              <Col span={24}><div className='userinfo-title'>{userData.nsrmc}</div></Col>
              <Col span={24}>
                <div>
                  {/* { userData.kzxxDms?.length > 0 || userData.tgshzlBz === "Y" ?
                    <Tooltip title={htmlBq(1, userData.kzxxDms, userData.tgshzlBz)} color='rgba(50, 70, 90, 0.88)' overlayInnerStyle={{minWidth: '400px'}} placement="bottomLeft"> */}
                      <div className="toolBq-class2" style={{cursor: 'pointer'}}>{htmlBq(2, userData?.kzxxDms, userData?.tgshzlBz)}</div>
                    {/* </Tooltip> : <></>
                  } */}
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
              {/* <div className="toolBq-class">
                <span className="user-title-info">分类管理类别：</span>
                <span className="user-text-info">
                  {userData.qylb}
                </span>
              </div> */}
            </Col>
          </Row>
        </div>
      </ProCard>
    )
    return html;
  }

  // 办理进度列表
  const getTableHtml = () => {
    const html = [];
    html.push(<Indextable type='1' />)
    return html;
  }

  // 出口退税申报
  const getCktssbHtml = () => {
    const html = []
    html.push(
      // <div className={showlist1?'cktssb-box-all':'cktssb-box'}>
      <div className='cktssb-box-all'>
        <Row gutter={[20, 20]}>
          <Col span={20} style={{marginTop:'-5px',marginBottom:'-5px'}}>
            <div className="col-pro-title" style={{marginLeft:'20px'}}>出口退税申报</div>
          </Col>
          <Col span={4} style={{marginTop:'-5px',marginBottom:'-5px'}}>
            {/* <div style={{float:'right', marginRight:'10px'}}>
              <Button type="link" onClick={()=>searchData(1)}>更多</Button>
            </div> */}
          </Col>
          <UrlhtmlShow url='/hts/ckfp/bgdgl'>
            <Col span={8}>
              <div className="ckts-box">
                <div className='box-title'>
                  待开出口发票报关单
                  <a onClick={()=>gotoPd(1)} className="box-btn">去开票</a>
                </div>
                <div className="box-content-left">
                  <CopyOutlined className='box-icon' />
                </div>
                <div className="box-num" onClick={()=>gotoPd(1)}>{myUtil.text.formatNum(dckfpNum, '0,0')}<span className="box-dw">条</span></div>
              </div>
            </Col>
          </UrlhtmlShow>
          <UrlhtmlShow url='/hts/ckfpkj/bgdgl'>
            <Col span={8}>
              <div className="ckts-box">
                <div className='box-title'>
                  待开出口发票报关单
                  <a onClick={()=>gotoPd(18)} className="box-btn">去开票</a>
                </div>
                <div className="box-content-left">
                  <CopyOutlined className='box-icon' />
                </div>
                <div className="box-num" onClick={()=>gotoPd(18)}>{myUtil.text.formatNum(dckfpNum, '0,0')}<span className="box-dw">条</span></div>
              </div>
            </Col>
          </UrlhtmlShow>
          <UrlhtmlShow url='/hts/ckfp/fpkjgl'>
            <Col span={8}>
              <div className="ckts-box">
                <div className='box-title'>
                  待回填出口发票
                  <a onClick={()=>gotoPd(2)} className="box-btn">去回填</a>
                </div>
                <div className="box-content-left">
                  <SnippetsOutlined className='box-icon' />
                </div>
                <div className="box-num" onClick={()=>gotoPd(2)}>{myUtil.text.formatNum(dhtckfpNum, '0,0')}<span className="box-dw">条</span></div>
              </div>
            </Col>
          </UrlhtmlShow>
          {
            // 在线开票
            fppzCode?.fpkjfsDm === '2' ?
            <UrlhtmlShow url='/hts/ckfpkj/ckfpkj/fpztgz'>
                <Col span={8}>
                <div className="ckts-box">
                  <div className='box-title'>
                    待回填出口发票
                    <a onClick={()=>gotoPd(19)} className="box-btn">去回填</a>
                  </div>
                  <div className="box-content-left">
                    <SnippetsOutlined className='box-icon' />
                  </div>
                  <div className="box-num" onClick={()=>gotoPd(19)}>{myUtil.text.formatNum(dhtckfpNum, '0,0')}<span className="box-dw">条</span></div>
                </div>
              </Col>
            </UrlhtmlShow>
            // 导出开票+税控票
          : fppzCode?.fpkjfsDm === '1' && fppzCode?.fpzlDm1 === '3' || fppzCode?.fpkjfsDm === '1' && fppzCode?.fpzlDm1 === '4' ?
            <UrlhtmlShow url='/hts/ckfpkj/ckfpkj/skpkj'>
              <Col span={8}>
                <div className="ckts-box">
                  <div className='box-title'>
                    待回填出口发票
                    <a onClick={()=>gotoPd(20)} className="box-btn">去回填</a>
                  </div>
                  <div className="box-content-left">
                    <SnippetsOutlined className='box-icon' />
                  </div>
                  <div className="box-num" onClick={()=>gotoPd(20)}>{myUtil.text.formatNum(dhtckfpNum, '0,0')}<span className="box-dw">条</span></div>
                </div>
              </Col>
            </UrlhtmlShow>
            :
            // 导出开票+数控票
            fppzCode?.fpkjfsDm === '1' && fppzCode?.fpzlDm1 === '5' ?
            <UrlhtmlShow url='/hts/ckfpkj/ckfpkj/sdpkj'>
              <Col span={8}>
                <div className="ckts-box">
                  <div className='box-title'>
                    待回填出口发票
                    <a onClick={()=>gotoPd(2)} className="box-btn">去回填</a>
                  </div>
                  <div className="box-content-left">
                    <SnippetsOutlined className='box-icon' />
                  </div>
                  <div className="box-num" onClick={()=>gotoPd(2)}>{myUtil.text.formatNum(dhtckfpNum, '0,0')}<span className="box-dw">条</span></div>
                </div>
              </Col>
            </UrlhtmlShow> : <></>
          }
          <UrlhtmlShow url={['/26/2602/260201/26020101','/25/2502/250201/25020101']}>
            <Col span={8}>
              <div className="ckts-box">
                <div className='box-title'>
                  待处理报关单
                  <a type="link" onClick={()=>gotoPd(3)} className="box-btn">去处理</a>
                </div>
                <div className="box-content-left">
                  <BarChartOutlined className='box-icon' />
                </div>
                <div className="box-num" onClick={()=>gotoPd(3)}>{myUtil.text.formatNum(cktsData.ckDclsjNum, '0,0')}<span className="box-dw">条</span></div>
              </div>
            </Col>
          </UrlhtmlShow>
          {qylx === 'SC' ?
            <UrlhtmlShow url='/25/2502/250201/25020103'>
              <Col span={8}>
                <div className="ckts-box">
                  <div className='box-title'>
                    可使用报关单
                    <Tooltip title='外部数据管理-出口报关单管理中，可使用数据的条数之和'>
                      <QuestionCircleOutlined style={{marginLeft:'5px'}} />
                    </Tooltip>
                    <a onClick={()=>gotoPd(5)} className="box-btn">去使用</a>
                  </div>
                  <div className="box-content-left">
                    <AreaChartOutlined className='box-icon' />
                  </div>
                  <div className="box-num" onClick={()=>gotoPd(5)}>{myUtil.text.formatNum(cktsData.ckKsysNum, '0,0')}<span className="box-dw">条</span></div>
                </div>
              </Col>
            </UrlhtmlShow>:
            <UrlhtmlShow url={['/26/2604/260401','/26/2602/260201/26020103']}>
              <Col span={8}>
              <div className="ckts-box">
                <div className='box-title'>
                  可使用报关单
                  <Tooltip title='外部数据管理-出口报关单管理中，可使用数据的条数之和'>
                      <QuestionCircleOutlined style={{marginLeft:'5px'}} />
                  </Tooltip>
                  <UrlhtmlShow url='/26/2604/260401'><a onClick={()=>gotoPd(6)} className="box-btn">去配单</a></UrlhtmlShow>
                </div>
                <div className="box-content-left">
                  <AreaChartOutlined className='box-icon' />
                </div>
                <UrlhtmlShow url='/26/2602/260201/26020103'>
                  <div className="box-num" onClick={()=>gotoPd(12)}>{myUtil.text.formatNum(cktsData.ckKsysNum, '0,0')}<span className="box-dw">条</span></div>
                </UrlhtmlShow>
              </div>
              </Col>
            </UrlhtmlShow>
          }
          <UrlhtmlShow url={['/26/2602/260202/26020201','/25/2502/250202/25020201']}>
            <Col span={8}>
              <div className="ckts-box">
                <div className='box-title'>
                  待处理代理证明
                  <a onClick={()=>gotoPd(4)} className="box-btn">去处理</a>
                </div>
                <div className="box-content-left">
                  <PieChartOutlined className='box-icon' />
                </div>
                <div className="box-num" onClick={()=>gotoPd(4)}>{myUtil.text.formatNum(cktsData.dlDclsjNum, '0,0')}<span className="box-dw">条</span></div>
              </div>
            </Col>
          </UrlhtmlShow>
          {qylx === 'SC' ?
            <UrlhtmlShow url='/25/2502/250202/25020202'>
              <Col span={8}>
                <div className="ckts-box">
                  <div className='box-title'>
                    可使用代理证明
                    <Tooltip title='外部数据管理-代理出口货物证明管理中，可使用数据的条数之和'>
                      <QuestionCircleOutlined style={{marginLeft:'5px'}} />
                    </Tooltip>
                    <a onClick={()=>gotoPd(7)} className="box-btn">去使用</a>
                  </div>
                  <div className="box-content-left">
                    <DotChartOutlined className='box-icon' />
                  </div>
                  <div className="box-num" onClick={()=>gotoPd(7)} >{myUtil.text.formatNum(cktsData.dlKsysNum, '0,0')}<span className="box-dw">条</span></div>
                </div>
              </Col>
            </UrlhtmlShow> :
            <UrlhtmlShow url={['/26/2604/260404','/26/2602/260202/26020202']}>
              <Col span={8}>
                <div className="ckts-box">
                  <div className='box-title'>
                    可使用代理证明
                    <Tooltip title='外部数据管理-代理出口货物证明管理中，可使用数据的条数之和'>
                      <QuestionCircleOutlined style={{marginLeft:'5px'}} />
                    </Tooltip>
                    <UrlhtmlShow url='/26/2604/260404'>
                      <a onClick={()=>gotoPd(8)} className="box-btn">去配单</a>
                    </UrlhtmlShow>
                  </div>
                  <div className="box-content-left">
                    <DotChartOutlined className='box-icon' />
                  </div>
                  <UrlhtmlShow url='/26/2602/260202/26020202'>
                    <div className="box-num" onClick={()=>gotoPd(14)}>{myUtil.text.formatNum(cktsData.dlKsysNum, '0,0')}<span className="box-dw">条</span></div>
                  </UrlhtmlShow>
                </div>
              </Col>
            </UrlhtmlShow>
          }
          { qylx === 'WM' ?
            <UrlhtmlShow url={['/26/2604/260402','/26/2602/260203/26020301']}>
              <Col span={8}>
                <div className="ckts-box">
                  <div className='box-title'>
                    可使用进项发票
                    <Tooltip title='外部数据管理-进项发票管理中，可使用数据的条数之和'>
                      <QuestionCircleOutlined style={{marginLeft:'5px'}} />
                    </Tooltip>
                    <UrlhtmlShow url='/26/2604/260402'>
                      <a onClick={()=>gotoPd(9)} className="box-btn">去配单</a>
                    </UrlhtmlShow>
                  </div>
                  <div className="box-content-left">
                    <LineChartOutlined className='box-icon' />
                  </div>
                  <UrlhtmlShow url='/26/2602/260203/26020301'>
                    <div className="box-num" onClick={()=>gotoPd(13)}>{myUtil.text.formatNum(cktsData.dlJxfpNum, '0,0')}<span className="box-dw">条</span></div>
                  </UrlhtmlShow>
                </div>
              </Col>
            </UrlhtmlShow> : <></>
          }
          <UrlhtmlShow url={['/25/2505','/26/2605']}>
            <Col span={8}>
              <div className="ckts-box">
                <div className='box-title'>
                  待申报数据
                  <Tooltip title={qylx==="SC"?'出口明细采集表明细条数之和':'出口明细和进货明细采集表明细条数之和'}>
                    <QuestionCircleOutlined style={{marginLeft:'5px'}} />
                  </Tooltip>
                  <a onClick={()=>gotoPd(10)} className="box-btn">去申报</a>
                </div>
                <div className="box-content-left">
                  <DiffOutlined className='box-icon' />
                </div>
                <div className="box-num" onClick={()=>gotoPd(10)}>{myUtil.text.formatNum(dsbsjTstjNum, '0,0')}<span className="box-dw">条</span></div>
              </div>
            </Col>
          </UrlhtmlShow>
          <UrlhtmlShow url='/hts/badz/dzba/dzba'>
            <Col span={8}>
              <div className="ckts-box">
                <div className='box-title'>
                  待完成单证备案
                  <Tooltip title={qylx==="SC"?'未完成归档所属期个数和报关单条数':'未完成归档所属期批次个数和报关单条数'}>
                    <QuestionCircleOutlined style={{marginLeft:'5px'}} />
                  </Tooltip>
                  <a onClick={()=>gotoPd(11)} className="box-btn">去备案</a>
                </div>
                <div className="box-content-left">
                  <div className='box-ftitle-left'>{qylx==="SC"?'所属期个数':'所属期批次个数'}</div>
                  <div className="box-num-left" onClick={()=>gotoPd(11)}>
                    {myUtil.text.formatNum(dzbaNum.ssqNum, '0,0')}
                    <span className="box-dw">个</span>
                  </div>
                </div>
                <div className="box-content-right">
                  <div className='box-ftitle'>数据条数</div>
                  <div className="box-num-right" onClick={()=>gotoPd(11)}>
                    {myUtil.text.formatNum(dzbaNum.wgdsjtsNum, '0,0')}
                    <span className="box-dw">条</span>
                  </div>
                </div>
              </div>
            </Col>
          </UrlhtmlShow>
        </Row>
      </div>
    )
    return html;
  }

  // 内销发票开具
  const getNxfpkhtml = () => {
    const html = []
    html.push(
      <div className='cktssb-box-all'>
        <Row gutter={[20, 20]}>
          <Col span={24} style={{marginBottom:'-5px',marginTop:'-5px'}}>
            <div className="col-pro-title" style={{marginLeft:'20px'}}>内销发票开具</div>
          </Col>
          {/* <UrlhtmlShow url='/jsxj/kpsz/spda'> */}
          <UrlhtmlShow url='/jsxj2/xxgl/jcsz/kpsz/spda'>
            <Col span={8}>
              <div className="ckts-box">
                <div className='box-title'>
                  未赋码商品
                  <a onClick={()=>gotoPd(15)} className="box-btn">去赋码</a>
                </div>
                <div className="box-content-left">
                  <FileZipOutlined className='box-icon' />
                </div>
                <div className="box-num" onClick={()=>gotoPd(15)}>{myUtil.text.formatNum(nxfpkjWfmspts, '0,0')}<span className="box-dw">条</span></div>
              </div>
            </Col>
          </UrlhtmlShow>
          <UrlhtmlShow url='/jsxj/fpkj/fpch/zpch'>
            <Col span={8}>
              <div className="ckts-box">
                <div className='box-title'>
                  未红冲专票
                  <a onClick={()=>gotoPd(16)} className="box-btn">去冲红</a>
                </div>
                <div className="box-content-left">
                  <MergeCellsOutlined className='box-icon' />
                </div>
                <div className="box-num" onClick={()=>gotoPd(16)}>{myUtil.text.formatNum(nxfpkjWhczpts, '0,0')}<span className="box-dw">条</span></div>
              </div>
            </Col>
          </UrlhtmlShow>
          {/* <Col span={8}>
            <div className="ckts-box">
              <div className='box-title'>
                红字确认单（全电）
                <a type="link" onClick={()=>gotoPd(17)} className="box-btn">去确认</a>
              </div>
              <div className="box-content-left">
                <PaperClipOutlined className='box-icon' />
              </div>
              <div className="box-num" onClick={()=>gotoPd(17)}>{myUtil.text.formatNum(nxfpkjHzqrdts, '0,0')}<span className="box-dw">条</span></div>
            </div>
          </Col> */}
        </Row>
      </div>
    )
    return html;
  }

  // 出口退税管理
  const getCktsglHtml = () => {
    const html:any = [];
    usermenu.forEach((item: any) => {
      const icon = iconMapping[item.icon];
      html.push(
        <Col span={12}>
          <div className='cktsgl-text' onClick={()=>gotoHref(item.path)}>
            {/* <div className='cktsgl-drop'></div> */}
            <div className='cktsgl-circle'><Avatar className="cdgl-avatar" size={25} icon={icon} key={item.cdDm} /></div>
            <div className='cktsgl-name'><span>{item.name}</span></div>
          </div>
        </Col>
      )
    })
    return <ProCard
      title={<div className="col-pro-title">出口退税管理</div>}
      size="small"
    >
      <div className='cktsgl-box'>
        <Row gutter={[20, 20]}>{html}</Row>
      </div>
    </ProCard>;
  }

  // 发票管理
  const getFpglHtml = () => {
    const html:any = [];
    usermenuFp.forEach((item: any) => {
      const icon = iconMapping[item.icon];
      html.push(
        <Col span={12}>
          <div className='cktsgl-text' onClick={()=>gotoHref(item.path)}>
            {/* <div className='cktsgl-circle'><div className='cktsgl-drop'></div></div> */}
            <div className='cktsgl-circle'><Avatar className="cdgl-avatar" size={25} icon={icon} key={item.id} /></div>
            <div className='cktsgl-name'><span>{item.name}</span></div>
          </div>
        </Col>
      )
    })
    return <ProCard
      title={<div className="col-pro-title">发票管理</div>}
      size="small"
    >
      <div className='cktsgl-box'>
        <Row gutter={[20, 20]}>{html}</Row>
      </div>
    </ProCard>;
  }

  // 快捷菜单管理
  const getContentKjcd02 = () => {
    const html:any = [];
    if(iconData.length === 0) {
      html.push(
        <Col span={12}>
        <div onClick={changeIcon}>
          <div className='cktsgl-circle'><Avatar className="cdgl-avatar" size={25} icon={<PlusCircleOutlined style={{color:"#4490DB"}} />} key="aa" /></div>
          <div className='cktsgl-name'><span>添加</span></div>
        </div>
      </Col>
      )
    } else {
      iconData.forEach((item: any) => {
        if(!item.tbys) {
          const pid = myUtil.menu.getMenuObjById(item.cdDm)?.pid;
          const icon = getIcon(pid);
          item.tbys = icon ? icon : 'QuestionOutlined';
        }
        const icon = iconMapping[item.tbys];
        html.push(
          <Col span={12}>
            <div className='cktsgl-text' onClick={()=>gotoHref(item.cdlj)}>
              <div className='cktsgl-circle'><Avatar className="cdgl-avatar" size={25} icon={icon} key={item.cdDm} /></div>
              <div className='cktsgl-name'><Tooltip title={item.cdmc}><span>{item.cdmc}</span></Tooltip></div>
            </div>
          </Col>
        )
      })
    }
    return <ProCard
      title={<div className="col-pro-title">快捷菜单</div>}
      extra={<Button type="link" style={{marginTop: '2px'}} onClick={changeIcon}>编辑</Button>}
      size="small"
    >
      <div className='cktsgl-box'>
        <Row gutter={[20, 20]}>{html}</Row>
      </div>
    </ProCard>;
  }

  const renderTreeNodes = (data: any) =>
    data.map((item: JSX.IntrinsicAttributes & TreeNodeProps & { routes?: React.ReactNode & any; }) => {
    if (item.routes && item.routes.length > 0) {
      item.disabled = true;
      return (
        <TreeNode key={item.id} title={item.name} value={item.id} disabled={item.disabled}>
          {renderTreeNodes(item.routes)}
        </TreeNode>
      );
    }
    return <TreeNode {...item} key={item.id} title={item.name} value={item.id} />;
  });

  return (
    // <Spin tip="Loading...">
    <div>
      <div className="hts_workbench">
        <Row gutter={[20, 20]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={16} xxl={16}>
            <Row gutter={[20, 20]}>
              <UrlhtmlShow url={['/25/2501','/26/2601','/25/2505','/26/2605','/25/2506','/26/2606','/hts/badz/dzba/dzba','/jsxj/ydgl/kpsh','/jsxj/ydgl/ycdd']}>
                <Col span={24}>
                  {getTableHtml()}
                </Col>
              </UrlhtmlShow>
              <UrlhtmlShow url={['/hts/ckfp/bgdgl','/hts/ckfp/fpkjgl','/26/2602/260201/26020101','/25/2502/250201/25020101','/25/2502/250201/25020103',
                '/26/2604/260401','/26/2602/260201/26020103','/2/260/260202/26020201','/25/2502/250202/25020201','/25/2502/250202/25020202','/26/2604/260404',
                '/26/2602/260202/26020202','/26/2604/260402','/26/2602/260203/26020301','/25/2505','/26/2605','/hts/badz/dzba/dzba']}>
                <Col span={24}>
                  <Spin tip="Loading..." spinning={masker} delay={200}>
                    {getCktssbHtml()}
                  </Spin>
                </Col>
              </UrlhtmlShow>
              <UrlhtmlShow url={['/jsxj2/xxgl/jcsz/kpsz/spda','/jsxj/fpkj/fpch/zpch']}>
              {/* <UrlhtmlShow url={['/jsxj/kpsz/spda','/jsxj/fpkj/fpch/zpch']}> */}
                <Col span={24}>
                  {getNxfpkhtml()}
                </Col>
              </UrlhtmlShow>
              {/* <Col span={24}>
                {getContentKjcd()}
              </Col> */}
            </Row>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={8} xxl={8}>
            <Row gutter={[20, 20]}>
              <Col span={24}>
                {getUserHtml()}
              </Col>
              {/* 快捷菜单 */}
              <Col span={24}>
                <Spin tip="Loading..." spinning={usermenu.length > 0 ? false : true} delay={200}>
                  {getContentKjcd02()}
                </Spin>
              </Col>
              {
                usermenu.length === 0 ?
                <></> :
                <Col span={24}>
                  <Spin tip="Loading..." spinning={usermenu.length > 0 ? false : true} delay={200}>
                    {getCktsglHtml()}
                  </Spin>
                </Col>
              }
              {
                usermenuFp.length === 0 ?
                <></> :
                <Col span={24}>
                  <Spin tip="Loading..." spinning={usermenuFp.length > 0 ? false : true} delay={200}>
                    {getFpglHtml()}
                  </Spin>
                </Col>
              }
            </Row>
          </Col>
        </Row>
      </div>
      <Modal
        title='快捷菜单编辑'
        visible={createModalVisible}
        wrapClassName='standard-modal-1'
        width={CONSTANTS.C_MODAL_WIDTH_X3}
        okText="保存"
        cancelText="关闭"
        onCancel={() => handleModalVisible(false)}
        onOk={handleSave}
        destroyOnHidden
        mask={{ closable: false }}
      >
        <Spin tip="Loading..." spinning={masker2} delay={200}>
          <div className="workplace-kjcd" style={{padding: '0'}}>
            <Row gutter={[20, 16]}>
              <Col span={14}>
                <div className="kjcd-box" style={{}}>
                  <ProCard
                    title={<div className="col-pro-title-cd"><div className="kjcd-blue"></div>业务功能选择</div>}
                    size="small"
                  >
                    <div>
                      <Row gutter={[20, 16]}>
                        <Col span={11}>
                          业务类型：
                          <TreeSelect showSearch defaultValue={checkYwlx} treeNodeFilterProp={'title'} virtual={false} treeDefaultExpandAll={true} dropdownMatchSelectWidth={220} style={{ width: '65%' }} onChange={handleChangeYw}>
                            {renderTreeNodes(ywTreeData)}
                          </TreeSelect>
                            {/* <Select defaultValue={checkYwlx} style={{width: '65%'}} onChange={handleChangeYw}>

                              {
                                ywlxList?.map((item: any,keys: any) => (
                                  <Select.Option key={item.gjdcdDm} label={item.cdmc} value={item.gjdcdDm}>{item.cdmc}</Select.Option>
                                ))
                              }
                            </Select> */}
                        </Col>
                        <Col span={13}>
                          业务名称：
                          <Input placeholder="业务名称" value={valueKjInput} onChange={changeKjInput} style={{width: '42%'}}  />
                          <Button type="primary" onClick={searchKjcd} style={{float: 'right'}}>查询</Button>
                        </Col>
                      </Row>
                    </div>
                    <div className="quick_menu_edit_left" style={{}}>
                      {getKjcdContent(1)}
                    </div>
                  </ProCard>
                </div>
              </Col>
              <Col span={10}>
                <div className="kjcd-box">
                  <ProCard
                    title={<div className="col-pro-title-cd"><div className="kjcd-blue"></div>已选常用功能</div>}
                    size="small"
                  >
                    <div className="quick_menu_edit_right" style={{}}>
                      {getKjcdContent(2)}
                    </div>
                  </ProCard>
                </div>
              </Col>
            </Row>
          </div>
        </Spin>
      </Modal>
    </div>
    // </Spin>
  );
};
export default Workbench;
