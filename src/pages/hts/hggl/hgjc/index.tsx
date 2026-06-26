// 发票配置管理
import React, { useState, useEffect, } from 'react';
import ProCard from '@ant-design/pro-card';
import myUtil from '@/components/DDAssist/util';
import { Button, Divider, Col, Row, Typography, message, Space, Popover, Tag, Badge, Spin, Tooltip } from 'antd';
import importStyle from './style.less';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import Func from './Func';
import unitConfig from './config';
import { getSmzt, getCgtj, initSm, getZblx, getInitTj } from '@/pages/hts/services/htsApi';
// 复制
import { cloneDeep } from 'lodash';







const Index: React.FC = () => {
  // 企业tag颜色
  const color = ["blue"];
  // 企业信息
  const [userInfo, setUserInfo] = useState<any>();
  const [myConfig, setMyConfig] = useState<any>(unitConfig);
  // 企业扩展信息名称
  const [kzxxMcs, setKzxxMcs] = useState<any>([]);
  // 检测状态
  const [smztDm1, setSmztDm1] = useState<any>('1'); //1.待检测 2.检测中 3.检测完成 4 失败
  // 扫描id
  const [smid, setSmid] = useState<any>('');
  // 扫描结果
  const [smBody, setSmBody] = useState<any>();
  // masker
  const [masker, setMasker] = useState<boolean>(false);
  // 扫描结果统计
  const [smtjBody, setSmtjBody] = useState<any>();
  // 扫描结果统计指标代码
  const [zbdm, setZbdm] = useState<any>([]);
  const [uuid, setUuid] = useState<any>();


  useEffect(() => {
    setUuid(new Date().getTime());
    // 1.获取码表
    initCode();
    // 2.获取扫描状态
    const config = cloneDeep(unitConfig) ;
    if(myUtil.sessionStore.getItem('userInfo')?.qxQys[0].cktsqylxDm == 'SC'){
      config.export_key = 'CX_HGGL_TSQK_YDLBQUERY_SC_DC';
      config.grid_columns = [
        { title: '疑点编号', dataIndex: 'ydbh', fixed: 'left', width: 110, align: 'center', ellipsis: true, },
        { title: '疑点级别', dataIndex: 'ydjbmc', width: 100, },
        { title: '疑点内容', dataIndex: 'ydnr', width: 300, ellipsis: true, },

        { title: '申报序号', dataIndex: 'sbxh', width: 90, align: 'center' },
        {
          title: '申报年月', dataIndex: 'ssq', width: 90, align: 'center', filter: {
            type: 'Input',
          }
        },
        { title: '疑点对象', dataIndex: 'shdxmc', width: 140, ellipsis: true, },
        { title: '指标分类', dataIndex: 'ydzbflmc', width: 140, ellipsis: true, },
        /*{ title: '疑点说明', dataIndex: 'jktjsm', width: 650, ellipsis: true, },*/
      ];
    }
    setMyConfig(config);
    getsmzt();

  }, []);


  useEffect(() => {

  }, [myConfig]);


  // 获取码表
  const initCode = () => {
    const user = myUtil.sessionStore.getItem('userInfo');
    setUserInfo(user);
    Promise.all([myUtil.code.getCodeFromServerT1('code_dm_ckts_cktmsbakzlx:01')]).then(() => {
    }).catch(() => {
      message.error('获取码表失败');
    }).finally(() => {
      const tempCode = myUtil.code.getCode('code_dm_ckts_cktmsbakzlx:01');
      const kzxxDms = user.qxQys[0]?.kzxxDms;
      const names: any[] =[];
      kzxxDms?.map((code: any) => {
        const item = tempCode.find((item: { code: any; }) => item.code === code);
        if(item && item.name){
          names.push(item.name);
        }
      });
      setKzxxMcs(names);
      setMasker(true);
      getZblx({}).then((res: any) => {
        setMasker(false);
        if (res.code === '200') {
          setZbdm(res?.body);
        } else {
          message.error(res.msg);
        }
      });
    });
  }

  // 获取扫描状态
  const getsmzt = () => {
    setMasker(true);
    getSmzt({ ny: myUtil.date.getCurrentYearMonth() }).then((res2: any) => {
      setMasker(false);
      if (res2.code === '200') {
        setSmztDm1(res2?.body?.smztDm1);
        setSmid(res2?.body?.smid);
        setSmBody(res2?.body);
        if (res2?.body?.smztDm1 == '1') {
          // 未扫描
          setMasker(true);
          getInitTj({ ny: myUtil.date.getCurrentYearMonth() }).then((res: any) => {
            setMasker(false);
            if (res.code === '200') {
              setSmtjBody(res?.body);
            } else {
              message.error(res.msg);
            }
          });
        } else if (res2?.body?.smztDm1 == '2') {
          // 扫描中
          setMasker(true);
          setTimeout(() => setMasker(false), 2000);
          setTimeout(() => getsmzt(), 120000);
        } else if (res2?.body?.smztDm1 == '3') {
          // 扫描成功
          setMasker(true);
          getCgtj({ ny: myUtil.date.getCurrentYearMonth() }).then((res: any) => {
            setMasker(false);
            if (res.code === '200') {
              setSmtjBody(res?.body);
              queryList('ALL');
              setSmid(res?.body?.ydzs?.smid);
            } else {
              message.error(res.msg);
            }
          });
        } else if (res2?.body?.smztDm1 == '4') {
          // 扫描失败

        } else {

        }
      } else {
        message.error(res2.msg);
      }
    });
  }

  // 全面检测
  const qmjc = () => {
    setMasker(true);
    initSm({ ny: myUtil.date.getCurrentYearMonth(), smid: smid, smztDm1: smztDm1 }).then((res2: any) => {
      setMasker(false);
      if (res2.code === '200') {
        Func.unitRef.current!.reload2();
        getsmzt();
      } else {
        message.error(res2.msg);
      }
    });
  }


  // 检测中。。刷新按钮
  const zxzReload = () => {
    getsmzt();
  }


  // 列表查询
  const queryList = (param: any) => {
    const config = cloneDeep(unitConfig);
    if(myUtil.sessionStore.getItem('userInfo')?.qxQys[0].cktsqylxDm == 'SC'){
      config.export_key = 'CX_HGGL_TSQK_YDLBQUERY_SC_DC';
      config.grid_columns = [
        { title: '疑点编号', dataIndex: 'ydbh', fixed: 'left', width: 110, align: 'center', ellipsis: true, },
        { title: '疑点级别', dataIndex: 'ydjbmc', width: 100, },
        { title: '疑点内容', dataIndex: 'ydnr', width: 300, ellipsis: true, },

        { title: '申报序号', dataIndex: 'sbxh', width: 90, align: 'center' },
        {
          title: '申报年月', dataIndex: 'ssq', width: 90, align: 'center', filter: {
            type: 'Input',
          }
        },
        { title: '疑点对象', dataIndex: 'shdxmc', width: 140, ellipsis: true, },
        { title: '指标分类', dataIndex: 'ydzbflmc', width: 140, ellipsis: true, },
        /*{ title: '疑点说明', dataIndex: 'jktjsm', width: 650, ellipsis: true, },*/
      ];
    }
    const initSearchModal = [];
    initSearchModal.push({ type: 1, property: "ny", value: myUtil.date.getCurrentYearMonth(), op: "zdy" });
    if (param == 'ALL') {
    } else if (param == 'W') {
      initSearchModal.push({ type: 1, property: "ydjbDm", value: "W", op: "zdy" });
    } else if (param == 'E') {
      initSearchModal.push({ type: 1, property: "ydjbDm", value: "E", op: "zdy" });
    } else {
      initSearchModal.push({ type: 1, property: "ydzbflDm", value: param, op: "zdy" });
    }
    config.gridParams = {
      initSearchModal: initSearchModal,
    }
    setMyConfig(config);
  }



  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <ProCard style={{ marginBottom: 20 }}>
        <Row>
          <Col span={4}>
            <Space>
              <Popover placement="bottomLeft" title={
                <Typography.Title level={5}>{userInfo?.qxQys[0].nsrmc}</Typography.Title>
              } content={
                <div style={{ width: 400 }}>
                  <div>
                    <Tag style={{ marginBottom: 5 }} color={color[Math.floor(Math.random() * color.length)]}>{userInfo?.qxQys[0]?.qylb==='A'?'一类':userInfo?.qxQys[0].qylb==='B'?'二类':userInfo?.qxQys[0].qylb==='C'?'三类':'四类'}</Tag>
                    {kzxxMcs?.map((item: any) => (
                      <Tag style={{ marginBottom: 5 }} color={color[Math.floor(Math.random() * color.length)]}>{item}</Tag>
                    ))}
                  </div>
                  <p>企业海关代码：{userInfo?.qxQys[0].hgqyDm}</p>
                  <p>纳税人识别号：{userInfo?.qxQys[0].nsrsbh}</p>
                  <p>社会信用代码：{userInfo?.qxQys[0].shxydm}</p>
                  <p>企业类型：{userInfo?.qxQys[0].cktsqylxDm == 'WM' ? '外贸企业' : userInfo?.qxQys[0].cktsqylxDm == 'SC' ? '生产企业' : '其他企业'}</p>
                </div>

              } trigger="hover">
                <div className={importStyle.userinfo_icon} style={{ marginLeft: -10 }}></div>
              </Popover>
              <Typography.Title level={5} style={{ marginTop: 10 }}>{smztDm1 == '1' ? '本月尚未完成检测' : smztDm1 == '2' ? <>检测执行中<Button type="link" onClick={zxzReload}>刷新</Button></> : smztDm1 == '3' ? '本月已完成检测' : smztDm1 == '4' ?'检测失败':''}</Typography.Title>
            </Space>
          </Col>
          <Col span={20}>
            <Button type="primary" style={{ float: "right" }} onClick={qmjc} disabled={smztDm1 == '2'}>全面检测</Button>
            <Divider type="vertical" style={{ borderColor: 'black' }} dashed={true} className={importStyle.dditax_Divider_vertical} />
            <div style={smztDm1 == '1' ? { marginTop: -45, marginLeft: 30 } :{ marginTop: -35, marginLeft: 30 }}  >
              {smztDm1 == '1' ?
                <Space>
                  {userInfo?.qxQys[0].cktsqylxDm == 'SC' ? <>
                    <Typography.Title level={5} style={{ marginLeft: 50 }}>涉及出口明细：{smtjBody?.scTssb ? smtjBody?.scTssb : 0}条</Typography.Title>
                  </>
                    : <>
                      <Typography.Title level={5} style={{ marginLeft: 50 }}>待检测批次：{smtjBody?.djcpc ? smtjBody?.djcpc : 0}个</Typography.Title>
                      <Typography.Title level={5} style={{ marginLeft: 50 }}>涉及出口明细：{smtjBody?.wmTssb ? smtjBody?.wmTssb : 0}条</Typography.Title>
                      <Typography.Title level={5} style={{ marginLeft: 50 }}><>进货明细：{smtjBody?.wmTsjh ? smtjBody?.wmTsjh : 0}条</></Typography.Title>
                      {smtjBody?.dbTssb && smtjBody?.dbTssb != 0 ?
                        <Typography.Title level={5} style={{ marginLeft: 50 }}><>代办退税明细：{smtjBody?.dbTssb}条</></Typography.Title> : <></>
                      }
                    </>
                  }

                </Space>
                : smztDm1 == '3' ?
                  <div style={{ marginTop: -65 }}>
                    <Row gutter={[16, 16]} className={importStyle.custom_row}>
                      <Col span={5} className={importStyle.custom_col}>
                        <Space><Badge color="#f50" style={{ paddingBottom: 5, marginLeft: -15 }} /> <Typography.Title level={5} style={{ marginLeft: -10 }}>指标共计：{smtjBody?.ydzs?.fxzbgs}项 </Typography.Title></Space>
                      </Col>
                      <Col span={4} className={importStyle.custom_col}>
                        <Space><Typography.Title level={5} >未通过：{smtjBody?.ydzs?.mzzbgs}项</Typography.Title></Space>
                      </Col>
                      <Col span={4} className={importStyle.custom_col}>
                        <Space><Typography.Title level={5} ><Space>疑点总数：<Button type='link' onClick={() => queryList('ALL')} style={{ color: "#f50", marginLeft: -10 }}>{smtjBody?.ydzs?.sjzjydsl}</Button></Space></Typography.Title></Space>
                      </Col>
                      <Col span={4} className={importStyle.custom_col}>
                        <Space><Typography.Title level={5} ><Space>错误类：<Button type='link' onClick={() => queryList('E')} style={{ color: "#f50", marginLeft: -10 }}>{smtjBody?.ydzs?.sjzjcwlydsl}</Button></Space></Typography.Title></Space>
                      </Col>
                      <Col span={4} className={importStyle.custom_col}>
                        <Space><Typography.Title level={5} ><Space>警告类：<Button type='link' onClick={() => queryList('W')} style={{ color: "#f50", marginLeft: -10 }}>{smtjBody?.ydzs?.sjzjydsl - smtjBody?.ydzs?.sjzjcwlydsl}</Button></Space></Typography.Title></Space>
                      </Col>
                      <Col span={5} className={importStyle.custom_col}>
                        <Space><Badge color="#f50" style={{ paddingBottom: 5, marginLeft: -15 }} /> 关单对审：<Button type='link' style={{ color: "#f50" }} onClick={() => queryList('01')} >{smtjBody?.ydzs2?.[0]?.sl ?? 0}</Button></Space>
                      </Col>
                      <Col span={4} className={importStyle.custom_col}>
                        <Space>发票对审：<Button type='link' style={{ color: "#f50" }} onClick={() => queryList('02')} >{smtjBody?.ydzs2?.[1]?.sl ?? 0}</Button></Space>
                      </Col>
                      <Col span={4} className={importStyle.custom_col}>
                        <Space>申报数据：<Button type='link' style={{ color: "#f50" }} onClick={() => queryList('03')} >{smtjBody?.ydzs2?.[2]?.sl ?? 0}</Button></Space>
                      </Col>
                      <Col span={4} className={importStyle.custom_col}>
                        <Space>出口未申报：<Button type='link' style={{ color: "#f50" }} onClick={() => queryList('04')} >{smtjBody?.ydzs2?.[3]?.sl ?? 0}</Button></Space>
                      </Col>
                      <Col span={4} className={importStyle.custom_col}>
                        <Space>风险商品：<Button type='link' style={{ color: "#f50" }} onClick={() => queryList('05')} >{smtjBody?.ydzs2?.[4]?.sl ?? 0}</Button></Space>
                      </Col>
                      <Col span={5} className={importStyle.custom_col}>
                        <Space><Badge color="#f50" style={{ paddingBottom: 5, marginLeft: -15, }} /> 风险企业：<Button type='link' style={{ color: "#f50" }} onClick={() => queryList('06')} >{smtjBody?.ydzs2?.[5]?.sl ?? 0}</Button></Space>
                      </Col>
                      <Col span={4} className={importStyle.custom_col}>
                        <Space>实地核查：<Button type='link' style={{ color: "#f50" }} onClick={() => queryList('08')} >{smtjBody?.ydzs2?.[7]?.sl ?? 0}</Button></Space>
                      </Col>
                      <Col span={4} className={importStyle.custom_col}>
                        <Space>暂缓退税：<Button type='link' style={{ color: "#f50" }} onClick={() => queryList('09')} >{smtjBody?.ydzs2?.[8]?.sl ?? 0}</Button></Space>
                      </Col>
                      <Col span={4} className={importStyle.custom_col}>
                        <Space>应征税货物：<Button type='link' style={{ color: "#f50" }} onClick={() => queryList('10')} >{smtjBody?.ydzs2?.[9]?.sl ?? 0}</Button></Space>
                      </Col>
                      <Col span={7} className={importStyle.custom_col}>
                        <Space>风险口岸、国别、地区：<Button type='link' style={{ color: "#f50" }} onClick={() => queryList('07')} >{smtjBody?.ydzs2?.[6]?.sl ?? 0}</Button></Space>
                      </Col>
                    </Row>
                  </div>
                  : <>
                    <Tooltip title={smBody?.cwxx} placement="topLeft">
                      {smBody?.cwxx ? smBody?.cwxx : ''}
                    </Tooltip>
                  </>}
            </div>
          </Col>
        </Row>
      </ProCard>
      <DDBunit2 config={myConfig} func={Func} key={uuid}/>
    </Spin>
  );
};

export default Index;
