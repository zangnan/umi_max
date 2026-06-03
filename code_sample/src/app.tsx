import { PageLoading } from '@ant-design/pro-layout';
import { history, Link } from 'umi';
import { Form, Select, Space, Menu, Dropdown  } from 'antd';
import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import type { RequestOptionsInit, ResponseError } from 'umi-request';
import { LeftOutlined } from '@ant-design/icons';
import { message, Radio } from 'antd';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import {tshlxqgzcx, kppzCheck, tshlxqgzwh, getQyhlpz} from '@/services/hts/api';
import EventEmitter from '@/utils/eventEmitter';
import myUtil from '@/pages/common/myUtil';
import cjpzUtil from '@/pages/common/cjpzUtil';
import RightContent from '@/components/RightContent';
import DDAlert from '@/components/DDAlert';
// import HeaderMenu from '@/components/DDHeaderFloatMenu/header_menu';
import routes from '../config/routes';
import { fetchMenuData, queryBadzCsh, initXtzy, enterpriseAuthorization } from '@/services/hts/api';
import { QuestionOutlined, CoffeeOutlined, GoldOutlined, SaveOutlined, GroupOutlined, ShopOutlined, DeploymentUnitOutlined, ExclamationCircleFilled, CalendarOutlined, BuildOutlined, BookOutlined, ContainerOutlined, CloudServerOutlined, ProjectOutlined, RobotOutlined, InteractionOutlined, FileProtectOutlined, UserOutlined, HomeOutlined, SecurityScanOutlined, OneToOneOutlined, CreditCardOutlined, VerifiedOutlined, ScheduleOutlined, AreaChartOutlined, AuditOutlined, RadarChartOutlined, FormOutlined, LayoutOutlined, ProfileOutlined, FundOutlined, CheckSquareOutlined, SendOutlined, BarChartOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { trim } from 'lodash';
import { createRef } from 'react';
import pro from '@/pages/common/proConfig';
import DDLogin from './components/DDLogin';
import qxUtil from '@/pages/common/qxUtil';

export const layoutActionRef = createRef<{ reload: () => void }>(
);

const loginPath = '/user/login';
const workplace = '/hts/workplace';
const errorPath = '/error';

let menuRedirect = 'A00';
let lastMenuRedirect = '';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg: any = await queryCurrentUser();
      myUtil.sessionStore.setItem('userInfo', msg?.body);
      return msg?.body;
    } catch (error) {
      const jcfs = history?.location?.query?.jcfs;
      // 项目集成 直接跳转，否则重定向到 login
      if (history?.location.query?.type === 'zxsb_saas_menu_wb'
        || history?.location.query?.type === 'hts_saas_menu_wb'
        || jcfs
      ) {
        EventEmitter.emit('routerChange', location);
      } else {
        history.push(loginPath);
      }
    }
    return undefined;
  };
  // 主题设置
  myUtil.theme.init();
  // 重置企业类型
  myUtil.sessionStore.clear('userInfo');
  // 重置菜单信息
  myUtil.sessionStore.clear('usermenu');
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath && history.location.pathname.indexOf(errorPath) == -1) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }
  return {
    fetchUserInfo,
    settings: {},
  };
}
// 利用对象进行图标映射
const iconMapping = {
  QuestionOutlined: <QuestionOutlined />,
  CoffeeOutlined: <CoffeeOutlined />,
  DeploymentUnitOutlined: <DeploymentUnitOutlined />,
  GoldOutlined: <GoldOutlined />,
  SaveOutlined: <SaveOutlined />,
  ShopOutlined: <ShopOutlined />,
  GroupOutlined: <GroupOutlined />,
  OneToOneOutlined: <OneToOneOutlined />,
  BuildOutlined: <BuildOutlined />,
  BookOutlined: <BookOutlined />,
  CalendarOutlined: <CalendarOutlined />,
  LayoutOutlined: <LayoutOutlined />,
  ProfileOutlined: <ProfileOutlined />,
  FundOutlined: <FundOutlined />,
  CheckSquareOutlined: <CheckSquareOutlined />,
  BarChartOutlined: <BarChartOutlined />,
  SendOutlined: <SendOutlined />,
  AuditOutlined: <AuditOutlined />,
  FormOutlined: <FormOutlined />,
  RadarChartOutlined: <RadarChartOutlined />,
  AreaChartOutlined: <AreaChartOutlined />,
  CreditCardOutlined: <CreditCardOutlined />,
  VerifiedOutlined: <VerifiedOutlined />,
  ScheduleOutlined: <ScheduleOutlined />,
  ContainerOutlined: <ContainerOutlined />,
  CloudServerOutlined: <CloudServerOutlined />,
  ProjectOutlined: <ProjectOutlined />,
  RobotOutlined: <RobotOutlined />,
  InteractionOutlined: <InteractionOutlined />,
  FileProtectOutlined: <FileProtectOutlined />,
  UserOutlined: <UserOutlined />,
  HomeOutlined: <HomeOutlined />,
  SecurityScanOutlined: <SecurityScanOutlined />,
  UnorderedListOutlined: <UnorderedListOutlined />
}


// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  let currentTheme = myUtil.localStore.getItem('theme');
  if (!currentTheme?.skin) {
    currentTheme = pro.default_theme;
  }
  let cc = {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    logo: () => (<>
      <span className="dd_return_workspace"><LeftOutlined /></span>
      <span className="dd-logo" />
    </>),
    // headerContentRender: () => (<HeaderMenu data={menuData} />),
    menuHeaderRender: undefined,
    menuItemRender: (itemProps: MenuDataItem, defaultDom: React.ReactNode, props: BaseMenuProps) => {
      // console.log(itemProps)
      // if (itemProps.isUrl || !itemProps.path) {
      //   return defaultDom;
      // }
      if (itemProps.dropMenu && itemProps.dropMenu.length > 0) {
        return <Dropdown overlay={
          <Menu style={{backgroundColor: '#32465A'}} className='dd-header-drop-menu'>
            {
              itemProps.dropMenu.map((item: any) => {
                return <Menu.Item ><span className='dd-header-drop-menu-margin' style={{color: '#ffffff !important'}} title={item.name}><Link className='link-a' to={item.path}>{item.name}</Link></span></Menu.Item>
              })
            }
          </Menu>
        }>
          <a className='dd-header-drop-menu-margin'>{defaultDom}</a>
        </Dropdown>
      }
      return <span className='dd-header-drop-menu-margin' title={itemProps.name}><Link to={itemProps.path}>{defaultDom}</Link></span>;
    },
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    onPageChange: async () => {
      const { location } = history;
      const userInfo = myUtil.sessionStore.getItem('userInfo');

      const yhlxDm = userInfo?.qxyh?.yhlxDm;
      // 判断是否需要授权，此判断大于其他判断
      if (location?.pathname.indexOf('/authorization') > -1) {
        history.push({ pathname: '/authorization', query: location.query });
      } else {
        if (location?.pathname.indexOf('/hts/routeHome') > -1 && (yhlxDm == '09' || yhlxDm == '11' || yhlxDm == '13' || yhlxDm == '14' || yhlxDm == '15')) {
          if (yhlxDm == '14') {
            history.push('/hts/qxgl/cd');
          } else if (yhlxDm == '15') {
            history.push('/hts/qxgl/qy');
          } else {
            history.push('/hts/qxgl/yh');
          }
        }
        if (location?.pathname.indexOf('/user/login') < 0 && location?.pathname.indexOf('error') < 0) {
          //汇率配置监测
          // 1.先获取本地码表。规则 DM_ZXSB_FPHLXQGZ + qyuuid
          let temp = '';
          let qyuuid = '';
          if (yhlxDm != '09' && yhlxDm != '11' && yhlxDm != '13' && yhlxDm != '14' && yhlxDm != '15') {
            qyuuid = userInfo?.qxQys[0].sbqyuuid;
            temp = myUtil.sessionStore.getItem('hlpzbs-' + qyuuid);
          }
          if (!trim(temp) && (yhlxDm != '09' && yhlxDm != '11' && yhlxDm != '13' && yhlxDm != '14' && yhlxDm != '15')) {
            if (!userInfo?.qxzDms?.includes('020004')) { // 深圳集成不显示此配置弹窗
              // 先调用配置接口获取yckrqfphlxqgzDm和wckrqfphlxqgzDm，再调用汇率规则查询接口获取fphlxqgzDm，三个字段任意为空弹出配置弹窗
              Promise.all([myUtil.code.getCodeFromServerT2('CODE_CS_ZXSB_FPKJ_CSPZ', '01')]).then(() => {
              }).catch(() => {
                message.error('获取码表失败');
              }).finally(() => {
                // debugger;
                // const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ', '01');
                // let yckrqfphlxqgzDm: any;
                // let wckrqfphlxqgzDm: any;
                // if (temp) {
                //   yckrqfphlxqgzDm = temp[0]?.fphlxqgzDm;
                //   wckrqfphlxqgzDm = temp[0]?.wckrqfphlxqgzDm;
                // }
                getQyhlpz({}).then(async (res: any) => {
                  const { code, body, desc } = res;
                  if (code == '200') {
                    let getDm;
                    const isTscd = body['isTscd'];
                    const isFpcd = body['isFpcd'];
                    const tshlxqgzDm = body['tshlxqgzDm'];
                    const fphlxqgzDm = body['fphlxqgzDm'];
                    const hlpzbs = trim(tshlxqgzDm) ? trim(tshlxqgzDm) : trim(fphlxqgzDm);
                    if ('Y' === isTscd || 'Y' === isFpcd) {
                      if (('Y' === isTscd && trim(tshlxqgzDm)) || ('Y' === isFpcd && trim(fphlxqgzDm))) {
                        //不空,把返回值放入緩存
                        myUtil.sessionStore.setItem('hlpzbs-' + qyuuid, hlpzbs);
                      } else {
                        getDm = await myUtil.code.getCodeFromServerT1('DM_ZXSB_FPHLXQGZ', '01');
                        DDAlert.open({
                          title: '系统提示',
                          info: '欢迎使用！为保证您能顺利使用平台办理业务，请先完成退税汇率配置。',
                          infoType: 'warning',
                          closeStatus: false,
                          closable: false,
                          isFormContent: true,
                          keyboard: false,
                          width: '600px',
                          content: <>
                            <div style={{ padding: '20px' }}>
                              <Space align="start">
                                <ExclamationCircleFilled style={{ color: '#FAAD15', fontSize: '22px', marginRight: '5px' }} />
                                <div style={{fontSize: '16px', fontWeight: 'bold', display: 'inline-block'}}>
                                  {'Y' === isTscd && 'Y' === isFpcd ? <>欢迎使用慧退税！为保证您能顺利使用平台办理业务，请先完成退税汇率和出口发票开具的开票汇率配置。</> :
                                    'Y' === isTscd ? <>欢迎使用慧退税！为保证您能顺利使用平台办理业务，请先完成退税汇率配置。</> :
                                      'Y' === isFpcd ? <>欢迎使用慧退税！为保证您能顺利使用平台办理业务，请先完成出口发票开具的开票汇率配置。</> : <></>}
                                </div>
                              </Space>
                              {'Y' === isTscd ?
                                <>
                                  <div style={{
                                    margin: '0 -20px 20px -20px',
                                    padding: '0 10px',
                                    fontWeight: 'normal',
                                    fontSize: '14px',
                                    lineHeight: '32px',
                                    backgroundColor: '#f1f4f7'
                                  }}>选择退税汇率规则
                                  </div>
                                  <Form.Item name="hllyDm" label="退税汇率来源" rules={[{required: true, message: '该项为必录'}]} initialValue={'01'} style={{marginTop: '10px'}}>
                                    <Radio.Group style={{marginTop: '5px'}}>
                                      <Radio key="hlly01" value={"01"}>外汇管理局</Radio>
                                      <Radio key="hlly02" value={"02"}>中国银行</Radio>
                                    </Radio.Group>
                                  </Form.Item>
                                  <Form.Item name="fphlxqgzDm" label="退税汇率选取规则" rules={[{required: true, message: '该项为必录'}]} initialValue={'11'}
                                             style={{marginTop: '10px'}}>
                                    <Select placeholder="请选择">
                                      {getDm.map((item: any) => (
                                        <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                                      ))}
                                    </Select>
                                  </Form.Item>
                                </> : <></>
                              }
                              {'Y' === isFpcd ?
                                <>
                                  <div style={{
                                    margin: '0 -20px 20px -20px',
                                    padding: '0 10px',
                                    fontWeight: 'normal',
                                    fontSize: '14px',
                                    lineHeight: '32px',
                                    backgroundColor: '#f1f4f7'
                                  }}>选择出口发票开具关单开票汇率规则
                                  </div>
                                  <Form.Item name="kphllyDm" label="开票汇率来源" rules={[{required: true, message: '该项为必录'}]} initialValue={'01'} style={{marginTop: '10px'}}>
                                    <Radio.Group style={{marginTop: '5px'}}>
                                      <Radio key="hlly01" value={"01"}>外汇管理局</Radio>
                                      <Radio key="hlly02" value={"02"}>中国银行</Radio>
                                    </Radio.Group>
                                  </Form.Item>
                                  <Form.Item name="yckrqfphlxqgzDm" label="有出口日期汇率规则" rules={[{required: true, message: '该项为必录'}]} initialValue={'11'}
                                             style={{marginTop: '10px'}}>
                                    <Select placeholder="请选择">
                                      <Select.Option value='11'>按出口日期当天汇率</Select.Option>
                                      <Select.Option value='12'>按出口日期当月第一个工作日</Select.Option>
                                      <Select.Option value='13'>按出口日期当月第一天</Select.Option>
                                      <Select.Option value='14'>按出口日期当月最后一天</Select.Option>
                                    </Select>
                                  </Form.Item>
                                  <Form.Item name="wckrqfphlxqgzDm" label="无出口日期汇率规则" rules={[{required: true, message: '该项为必录'}]} initialValue={'21'}
                                             style={{marginTop: '10px'}}>
                                    <Select placeholder="请选择">
                                      <Select.Option value='21'>按申报日期当天汇率</Select.Option>
                                      <Select.Option value='22'>按申报日期当月第一个工作日</Select.Option>
                                      <Select.Option value='23'>按申报日期当月第一天</Select.Option>
                                      <Select.Option value='24'>按申报日期当月最后一天</Select.Option>
                                    </Select>
                                  </Form.Item>
                                </> : <></>
                              }
                            </div>
                          </>,
                          okCallbackFn: async function () {
                            const params = await DDAlert.getContentFormData();
                            // 保存汇率规则
                            params.uuid = body.uuid;
                            initXtzy(params).then((res: any) => {
                              const {code, desc} = res;
                              if (code == '200') {
                                myUtil.sessionStore.setItem('hlpzbs-' + qyuuid, hlpzbs)
                                myUtil.code.delCodeToLocalTable('CODE_CS_ZXSB_FPKJ_CSPZ', '01');
                                DDAlert.close();
                                message.success('汇率规则保存成功！');
                              } else {
                                message.error(desc);
                              }
                            })
                          },
                        });
                      }
                    } /*else {
                      if (trim(body?.fphlxqgzDm)) {
                        //不空,把返回值放入緩存
                        myUtil.sessionStore.setItem('hlpzbs-' + qyuuid, body?.fphlxqgzDm)
                      } else {
                        getDm = await myUtil.code.getCodeFromServerT1('DM_ZXSB_FPHLXQGZ', '01');
                        DDAlert.open({
                          title: '系统提示',
                          info: '欢迎使用！为保证您能顺利使用平台办理业务，请先完成退税汇率配置。',
                          infoType: 'warning',
                          closeStatus: false,
                          closable: false,
                          isFormContent: true,
                          width: '600px',
                          content: <>
                            <div style={{padding: '20px'}}>
                              <Space align="start">
                                <ExclamationCircleFilled style={{color: '#FAAD15', fontSize: '22px', marginRight: '5px'}}/>
                                <div style={{fontSize: '16px', fontWeight: 'bold', display: 'inline-block'}}>欢迎使用慧退税！为保证您能顺利使用平台办理业务，请先完成退税汇率配置。
                                </div>
                              </Space>
                              <Form.Item name="hllyDm" label="汇率来源" rules={[{ required: true, message: '该项为必录' }]} initialValue={'01'} style={{ marginTop: '10px' }}>
                                <Radio.Group style={{ marginTop: '5px' }}>
                                  <Radio key="hlly01" value={"01"}>外汇管理局</Radio>
                                  <Radio key="hlly02" value={"02"}>中国银行</Radio>
                                </Radio.Group>
                              </Form.Item>
                              <Form.Item name="fphlxqgzDm" label="汇率选取规则" rules={[{ required: true, message: '该项为必录' }]} initialValue={'11'} style={{ marginTop: '10px' }}>
                                <Radio.Group style={{ marginTop: '5px' }}>
                                  {getDm.map((item: any) => (
                                    <Radio key={item.code} value={item.code}>{item.name}</Radio>
                                  ))}
                                </Radio.Group>
                              </Form.Item>
                            </div>
                          </>,
                          okCallbackFn: async function () {
                            const fphlxqgzDm = await DDAlert.getContentFormData();
                            // 保存汇率规则
                            fphlxqgzDm.uuid = body.uuid;
                            tshlxqgzwh(fphlxqgzDm).then((res: any) => {
                              const { code, desc } = res;
                              if (code == '200') {
                                myUtil.sessionStore.setItem('hlpzbs-' + qyuuid, fphlxqgzDm?.fphlxqgzDm)
                                DDAlert.close();
                                message.success('汇率规则保存成功！');
                              } else {
                                message.error(desc);
                              }
                            })
                          },
                        });
                      }

                    }*/
                  } else {
                    message.error(desc);
                  }
                })
              });
            }
          }
        }
        // 发票模块跳转，初始化判断v1
        if ((location?.pathname.indexOf('/hts/ckfp/') > -1 || location?.pathname.indexOf('/hts/ckfpkj/') > -1) && location?.pathname.indexOf('/hts/pzgl/fppzgl') < 0) {
          await myUtil.code.getCodeFromServerT1('CODE_CS_ZXSB_FPKJ_CSPZ', '01');
          kppzCheck({}).then(async (res: any) => {
            const { code, body, desc } = res;
            if (body && code == '900') {
              let fpConfigPath = '/hts/pzgl/fppzgl';
              DDAlert.open({
                title: '系统提示',
                okText: '跳转',
                info: '没有配置开票设置！',
                infoType: 'warning',
                content: '系统检测出您尚未进行开票设置，请到配置管理“发票配置”中进行相关项目的配置。',
                closeStatus: false,
                okCallbackFn: function () {
                  DDAlert.close();
                  history.push({ pathname: fpConfigPath, query: { xh: body.xh } });
                },
              });
            }
          });
        }
        // 备案单证跳转，初始化判断
        if (location?.pathname.indexOf('hts/badz') > -1) {
          const qyuuid = userInfo?.qxQys[0].qyuuid;
          const badzcshqyuuid = localStorage.getItem('badzcshqyuuid');
          if (badzcshqyuuid != qyuuid) {
            queryBadzCsh({}).then((res: any) => {
              const { code, msg } = res;
              if (code != '200') {
                message.info(msg);
                history.push(workplace);
              } else {
                localStorage.setItem('badzcshqyuuid', qyuuid);
              }
            })
          }
        }

        // 如果 电子税务局登录 页面没有 则 跳转到 现有菜单第一位
        if (!myUtil.menu.getMenuObjByPath('/hts/pzgl/dzswjpzgl') && location?.pathname.indexOf('/hts/pzgl/dzswjpzgl') > -1) {
          const children = myUtil.menu.getMenuObjByPath('/hts/pzgl')
          history.push(children.routes[0]?.path);
        }
      }
      const jcfs = history?.location?.query?.jcfs;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath && location.pathname.indexOf(errorPath) == -1) {
        // 项目集成 直接跳转，否则重定向到 login
        if (history?.location.query?.type === 'zxsb_saas_menu_wb'
          || history?.location.query?.type === 'hts_saas_menu_wb'
          || jcfs
        ) {
          EventEmitter.emit('routerChange', location);
        } else {
          history.push(loginPath);
        }
      } else {
        EventEmitter.emit('routerChange', location);
      }
      // 手动触发重新加载菜单
      if (!location?.pathname || location?.pathname.indexOf('/hts/routeHome') > -1 || (jcfs && location?.pathname.indexOf('/hts/workplace') > -1)) { // 首页工作台时变为A00
        menuRedirect = 'A00';
      } else if (location?.pathname.indexOf('/jsxj') > -1) {
        if (location?.pathname.indexOf('/jsxj2') > -1) {
          menuRedirect = 'A03'; // 集成江苏2.0菜单使用A03
        } else {
          menuRedirect = 'A02'; // 集成江苏1.0菜单使用A02，目前只有深圳企业使用
        }
      } else {
        menuRedirect = 'A01';
        // 09：系统管理员、11：企业管理员
        // 如果是管理员需要处理权限相关菜单逻辑
        if (location?.pathname.indexOf('/hts/qxgl') > -1 && (yhlxDm == '09' || yhlxDm == '11' || yhlxDm == '13' || yhlxDm == '14' || yhlxDm == '15')) {
          menuRedirect = 'A99';
        }
      }
      // 如果切换了菜单类型则重新渲染
      if (lastMenuRedirect != menuRedirect) {
        layoutActionRef?.current?.reload();
      }
      const k1 = window.localStorage.getItem('sqyxqSytsFlag');
      const k2 = myUtil.date.formatData(Date.now());
      // 添加提示到期提示
      if (Number(userInfo?.qxQys[0]?.sqyxqSyts) < 30 && k1 != k2) {
        message.open({
          type: 'warning',
          content: `授权即将超期，有效期剩余${userInfo?.qxQys[0]?.sqyxqSyts}天，请及时联系运营管理员续期！`,
          duration: 6,
        });
        window.localStorage.setItem('sqyxqSytsFlag', myUtil.date.formatData(Date.now()));
      }
      const k3 = window.localStorage.getItem('sqyxqSqztDm');
      // 添加提示
      if (userInfo?.qxQys[0]?.sqztDm == '02' && k3 != k2) {
        message.open({
          type: 'warning',
          content: `您当前的版本为试用版，如需转为正式版请联系运营管理员！`,
          duration: 6,
        });
        window.localStorage.setItem('sqyxqSqztDm', myUtil.date.formatData(Date.now()));
      }
    },
    links: [],
    siderWidth: currentTheme.skin === 'theme06' ? 232 : 200,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
  // 菜单
  let menuData: any;
  if (!LOCAL_MENU) {
    cc.actionRef = layoutActionRef,
      cc.menu = {
        // 每当 initialState?.currentUser?.userid 发生修改时重新执行 request
        params: {
          yddh: initialState?.currentUser?.qxyh?.yddh,
          sbqyuuid: initialState?.currentUser?.qxQys[0]?.sbqyuuid,
        },
        request: async (params, defaultMenuData) => {
          let body: any = [];
          if (myUtil.sessionStore.getItem('usermenu')) {
            body = myUtil.sessionStore.getItem('usermenu');
          } else {
            const res = await fetchMenuData({});
            body = res?.body;
          }
          // if ((menuRedirect === 'A00' && (lastMenuRedirect === 'A01' || lastMenuRedirect === 'A02')) ||
          // (menuRedirect === 'A01' && lastMenuRedirect === 'A00') ||
          // (menuRedirect === 'A02' && lastMenuRedirect === 'A00')
          // ) {
          //   body = myUtil.sessionStore.getItem('usermenu') || await fetchMenuData({})?.body;
          // } else {
          //   const res = await fetchMenuData({});
          //   body = res?.body;
          // }
          lastMenuRedirect = menuRedirect;
          // 获取树结构数据每个routes第一行的path
          function firstPath(data: any): any {
            let redirectPath;
            if (data[0].routes && data[0].routes.length > 0) {
              redirectPath = firstPath(data[0].routes);
            } else {
              redirectPath = data[0].path
            }
            return redirectPath;
          }
          // 递归树结构
          function treeData(data: any) {
            data.forEach((item: any) => {
              if (item.routes && item.routes.length > 0) {
                treeData(item.routes);
                if (!item.hideInMenu) { // 拼接redirect
                  const redirectPath = firstPath(item.routes);
                  item.routes.push({ path: item.path, redirect: redirectPath })
                }
              }
            });
          }
          treeData(body);
          // 根据菜单重定向类型获取不同分组的菜单
          if (menuRedirect !== 'A00') {
            menuData = body.filter((item: any) => item.id === menuRedirect)[0]?.routes || [];
          } else {
            menuData = body;
          }
          myUtil.sessionStore.setItem('usermenu', body);
          // 项目集成并且initialState?.currentUser不为空时跳转页面
          const qdDm: any = history?.location?.query?.qdDm;
          const jcfs: any = history?.location?.query?.jcfs;
          const jumpUrl: any = history?.location?.query?.jumpUrl;
          let hstqysqbz: any = history?.location?.query?.hstqysqbz;
          const query: any = history?.location?.query;
          if (jcfs && initialState?.currentUser) {
            // 主题设置
            if (qdDm === 'SAAS_API_SZGPS') {
              myUtil.theme.init('theme05');
            }
            const userInfo = myUtil.sessionStore.getItem('userInfo');
            if (hstqysqbz === 'N' && userInfo?.qxzDms?.includes('020004')) {
              DDAlert.open({
                title: '系统提示',
                info: [
                  '为给您提供更便捷的服务，我们提供了“出口发票开具”及“协同开票管理”功能，该类功能需要将您的企业名称、纳税人识别号等基础数据信息传递给第三方，由我们与第三方共同为您提供服务。',
                  '点击“同意”开始接受此项服务，点击“不同意”将无法使用该功能。'
                ],
                okText: '同意',
                cancelText: '不同意',
                infoType: 'warning',
                modalType: 'confirm',
                closeStatus: false,
                okCallbackFn: function (thisObj: any) {
                  thisObj.setState({ masker: true });
                  enterpriseAuthorization({}).then((res: any) => {
                    DDAlert.close();
                    const { code, msg } = res;
                    if (code != '200') {
                      message.error(msg);
                      history.push({ pathname: '/error', query: { status: '401', ERR: '当前无法使用该功能', isBack: 'Y' } });
                    } else {
                      hstqysqbz = 'Y'
                      history.push({ pathname: jumpUrl, query: { ...query, hstqysqbz } });
                    }
                  })
                },
                cancelCallbackFn: function () {
                  history.push({ pathname: '/error', query: { status: '401', ERR: '当前无法使用该功能', isBack: 'Y' } });
                }
              })
            } else {
              history.push({ pathname: jumpUrl, query: query });
            }
          }
          menuData.forEach((item: any) => {
            item.icon = iconMapping[item.icon];
            let menuL2: any = item.routes || [];
            menuL2.forEach((itemL2: any) => {
              itemL2.icon = iconMapping[itemL2.icon];
            });
          });
          return menuData;
        },
      }
  } else {
    menuData = routes;
  }
  if (menuData?.length > 0) {
    myUtil.sessionStore.setItem('usermenu', menuData);
  }

  return cc
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/** 异常处理程序
 * @see https://beta-pro.ant.design/docs/request-cn
 */
const errorHandler = (error: ResponseError) => {
  const { response } = error;
  const msg = history?.location.query?.ERR || '';
  const jcfs = history?.location.query?.jcfs || '';

  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    if (history.location.pathname.indexOf('Login') == -1) {
      if (status == 300 || status == 404 || status == 401) {
        history.push({ pathname: '/errort', query: { status: status.toString(), ERR: msg, jcfs: jcfs } });
      } else {
        history.push({ pathname: '/error', query: { status: status.toString(), ERR: msg, jcfs: jcfs } });
      }
    }
    // notification.error({
    //   message: `请求错误 ${status}: ${url}`,
    //   description: errorText,
    // });
  }
  if (!response) {
    // notification.error({
    //   description: '您的网络发生异常，无法连接服务器',
    //   message: '网络异常',
    // });
  }
  throw error;
};

// 请求前拦截器
const requestInterceptors = async (url: string, options: RequestOptionsInit) => {
  // const dditSaasJcToken = localStorage.getItem('dditSaasJcToken');
  let authHeader: any = {
    accessClientId: 'dditSaas',    // saas 使用
    ftype: 'fa',                   // saas 使用
  };

  if (history?.location.query?.type === 'zxsb_saas_menu_wb') {// 从layUI项目集成 替换authHeader为原申报接口 并存储token
    authHeader = {
      ftype: 'fa',                   // saas 使用
      accessClientId: '1',           // 原申报接口 使用
    };
    const accessToken: any = history?.location?.query?.key;
    localStorage.setItem('accessToken', accessToken);
  }
  if (history?.location.query?.jcfs === 'menu_ym' || history?.location.query?.jcfs === 'menu_cd') {
    authHeader = {
      ftype: 'fa',
      accessClientId: history?.location?.query.clientId,
      accessToken: history?.location?.query?.ACCESS_TOKEN
    }
    const accessToken: any = history?.location?.query?.ACCESS_TOKEN;
    localStorage.setItem('accessToken', accessToken);
    const jcfs: any = history?.location?.query?.jcfs;
    localStorage.setItem('jcfs', jcfs);
  }
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken && url.indexOf('/hx/qx/token/oauth') === -1) {
    authHeader.accessToken = accessToken;
  }

  // 金四登录接口
  if (url.indexOf('simulationLoginBymm') > -1 ||
    url.indexOf('simulationLoginBysm') > -1 ||
    url.indexOf('simulationLoginPhoneNum') > -1 ||
    url.indexOf('simulationLoginPhoneNumGet') > -1 ||
    url.indexOf('simulationLoginSelectRole') > -1 ||
    url.indexOf('simulationLoginProcessQuery') > -1 ||
    url.indexOf('simulationLoginStateQueryDzswjxt') > -1
  ) {
    authHeader.accessToken = options?.headers?.accessToken;
    authHeader.Accept = 'application/json';
  }

  let reVal = cjpzUtil.bdcj.formatApiParam(url, options);                // 原申报接口 使用
  options = reVal.options;                                                  // 原申报接口 使用
  url = reVal.url
  // 接口shfkdr2统一处理参数
  myUtil.shfkdr2.getshfkdr2CdDm(options, url);
  // 判断该接口是否需要登录(权限组为金四rpa，并且url包换在dzswjdlzt方法中)
  if (myUtil.sessionStore.getItem('userInfo')?.qxzDms?.includes('010005') && myUtil.shfkdr2.dzswjdlzt(url)) {
    var protocol = window.location.protocol; // 获取页面使用的协议
    if(protocol === "http:"){
      window.localStorage.setItem("dzswj_URL_logger", url);
      window.localStorage.setItem("dzswj_qxzDms_logger", myUtil.sessionStore.getItem('userInfo')?.qxzDms);
    }
    // 1、调用金四获取token接口
    const result = await myUtil.shfkdr2.getJ4RpaToken();
    if(protocol === "http:"){
      window.localStorage.setItem("dzswj_result_logger", result);
    }
    // 接口出现错误返回电子税务局登录失败
    if (result?.code != '200') {
      url = `${API_URL_BASE}/yw/tssb/j4rpa/qddy`;
    } else {
      // 获取token成功调用电子税务局登录状态查询
      const rel = await myUtil.shfkdr2.getdzswjdlztNew(result.body.token);
      if(protocol === "http:"){
        window.localStorage.setItem("dzswj_rel_logger", rel);
      }
      // 接口出现错误，返回电子税务局登录失败
      if (rel?.code != '200') {
        url = `${API_URL_BASE}/yw/tssb/j4rpa/qddy`;
      } else {
        const active = rel.body.active;
        if(protocol === "http:"){
          window.localStorage.setItem("dzswj_active_logger", active);
        }
        // 电子税务局登录态失效，打开登录界面
        if (!active) {
          const flag: any = await reaquestSuspender();
          // 返回电子税务局登录失败
          if(protocol === "http:"){
            window.localStorage.setItem("dzswj_flag_logger", flag);
          }
          if (!flag) {
            url = `${API_URL_BASE}/yw/tssb/j4rpa/qddy`;
          }
        }
      }
    }
    // 原方法getdzswjdlzt逻辑有问题废弃
    // let rel = await myUtil.shfkdr2.getdzswjdlzt();
    // if (!rel) {
    //   const flag: any = await reaquestSuspender();
    //   if (!flag) {
    //     url = `${API_URL_BASE}/yw/tssb/j4rpa/qddy`;
    //   }
    // }
  }
  if (url.indexOf('token/logout') > -1) {
    authHeader.accessToken = options?.headers?.accessToken;
  }
  // 当前仅用于测试 end
  return {
    url: `${url}`,
    options: {
      ...options,
      interceptors: true,
      headers: authHeader
    }
  };
}


function reaquestSuspender() {
  return new Promise((resolve) => {
    DDLogin.open({
      cancelCallbackFn: function () {
        resolve(false);
      },
      okCallbackFn: function () {
        resolve(true);
      },
    });
  });
}

// 请求后拦截器
const responseInterceptors = async (response: Response, options: RequestOptionsInit) => {
  const responseClone = response.clone();
  const { headers } = responseClone;
  const accessToken = headers.get('accessToken');
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
  }
  // 集成页面根据集成方式显示或隐藏菜单
  const jcfs = localStorage.getItem('jcfs');
  const divRoot: any = document.querySelector("body");
  if (jcfs && jcfs === 'menu_ym') {
    divRoot.classList.add("jc-fullscreen");
  } else if (jcfs && jcfs === 'menu_cd') {
    divRoot.classList.remove("jc-fullscreen");
  }
  return response;
};

// https://umijs.org/zh-CN/plugins/plugin-request
export const request: RequestConfig = {
  timeout: 1800000,
  errorHandler,                                   // 后端抛出异常处理程序
  requestInterceptors: [requestInterceptors],     // 请求前拦截器
  responseInterceptors: [responseInterceptors],   // 请求后拦截器
};
