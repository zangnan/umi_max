// 发票配置管理
import React, { useState, useEffect } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import Func from './Func';
import config from './config';
import { Button, Divider, Col, Row, Typography, message, Space, Popover, Tag, Badge, Spin, Tooltip } from 'antd';
import ProCard from '@ant-design/pro-card';
import myUtil from '@/components/DDAssist/util';
import { cloneDeep } from 'lodash';
import importStyle from './style.less';
import unitConfig from '../hgjc/config';
import myFunc from '../hgjc/Func';
import { getSmzt, getCgtj, initSm, getZblx, getInitTj } from '@/pages/hts/services/htsApi';
import DDBaseGrid from '@/components/DDBaseGrid';



const Index: React.FC = () => {
  const [masker, setMasker] = useState<boolean>(false);
  const [flag, setFlag] = useState<boolean>(true);

  // 扫描结果统计
  const [smtjBody, setSmtjBody] = useState<any>();
  // 子列表config
  const [myConfig, setMyConfig] = useState<any>();
  const [ny, setNy] = useState<any>();
  const [ydzs, setYdzs] = useState<any>();
  const [ydlx, setYdlx] = useState<any>('');
  const [data, setData] = useState<any>('');


  useEffect(() => {
    const t = cloneDeep(unitConfig);
    if(myUtil.sessionStore.getItem('userInfo')?.qxQys[0].cktsqylxDm == 'SC'){
      t.export_key = 'CX_HGGL_TSQK_YDLBQUERY_SC_DC';
      t.grid_columns = [
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
       /* { title: '疑点说明', dataIndex: 'jktjsm', width: 650, ellipsis: true, },*/
      ];
    }
    t.customer_toolbar = [];
    // 配置项：工具栏
    t.toolbar_default.tssb_download = false;
    setMyConfig(t);
  }, []);


  Func.renderBadzYdzs = (param: any, param2: any) => {
    const { record } = param;
    setNy(record?.ny);
    setMasker(true);
    if(param2 == 'Z'){
      setYdzs(record.sjzjydsl);
    }else if(param2 == 'E'){
      setYdzs(record.sjzjcwlydsl);
    }else{
      setYdzs(record.sjzjjglydsl);
    }
    setYdlx(param2);
    getCgtj({ ny: record?.ny, smid: record?.smid,ydjbDm: param2=='Z'?"":param2}).then((res: any) => {
      setMasker(false);
      if (res.code === '200') {
        setSmtjBody(res?.body);
        setFlag(false);
        queryList(param2, record?.smid);
      } else {
        message.error(res.msg);
      }
    });
  }

  // 列表查询
  const queryList = (param: any, smid: any) => {
    const config = cloneDeep(myConfig);
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
       /* { title: '疑点说明', dataIndex: 'jktjsm', width: 650, ellipsis: true, },*/
      ];
    }
    config.toolbar_default.tssb_download = false;
    config.customer_toolbar = [];
    const initSearchModal = [];
    initSearchModal.push({ type: 1, property: "smid", value: smid, op: "zdy" });
    if (param == 'E') {
      initSearchModal.push({ type: 1, property: "ydjbDm", value: 'E', op: "zdy" });
    } else if (param == 'W') {
      initSearchModal.push({ type: 1, property: "ydjbDm", value: 'W', op: "zdy" });
    } else if (param == 'Z') {
    } else {
      initSearchModal.push({ type: 1, property: "ydzbflDm", value: param, op: "zdy" });
    }
    config.gridParams = { // 默认查询参数
      initSearchModal: initSearchModal,
    }
    setMyConfig(config);
  }


   // 列表查询
   const queryList2 = (param: any,param2:any, ny: any) => {
    const config = cloneDeep(myConfig);
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
    var timestamp1 = new Date().getTime();

    config.abs = timestamp1;
    config.customer_toolbar = [];
    const initSearchModal = [];
    initSearchModal.push({ type: 1, property: "ny", value: ny, op: "zdy" });
    initSearchModal.push({ type: 1, property: "ydzbflDm", value: param2, op: "zdy" });
    if (param == 'E') {
      initSearchModal.push({ type: 1, property: "ydjbDm", value: 'E', op: "zdy" });
    } else if (param == 'W') {
      initSearchModal.push({ type: 1, property: "ydjbDm", value: 'W', op: "zdy" });
    } else if (param == 'Z') {
      initSearchModal.push({ type: 1, property: "ydjbDm", value: '', op: "zdy" });
    }
    config.gridParams = { // 默认查询参数
      initSearchModal: initSearchModal,
    }
    setMyConfig(config);
  }











  return (<>
    <DDBunit2 config={config} func={Func} />
    <div hidden={flag}>
      <Spin tip="Loading..." spinning={masker} delay={100} >
        <ProCard style={{ marginTop: 20, marginBottom: -10 }}>
          <Row>
            <Col span={4}>
              <Popover placement="bottomLeft" trigger="hover">
                <Space>
                  <Typography.Title level={4} >疑点总数：{ydzs}</Typography.Title>
                </Space>
              </Popover>
            </Col>
            <Col span={20}>
              <Row gutter={[16, 16]} className={importStyle.custom_row}>
                <Col span={5} className={importStyle.custom_col}>
                  <Space><Badge color="#f50" style={{ paddingBottom: 5, marginLeft: -15 }} /> 关单对审：<Button type='link' style={{ color: "#f50" }} onClick={() => queryList2(ydlx,'01', ny)} >{smtjBody?.ydzs2[0].sl}</Button></Space>
                </Col>
                <Col span={4} className={importStyle.custom_col}>
                  <Space>发票对审：<Button type='link' style={{ color: "#f50" }} onClick={() => queryList2(ydlx,'02', ny)} >{smtjBody?.ydzs2[1].sl}</Button></Space>
                </Col>
                <Col span={4} className={importStyle.custom_col}>
                  <Space>申报数据：<Button type='link' style={{ color: "#f50" }} onClick={() => queryList2(ydlx,'03', ny)} >{smtjBody?.ydzs2[2].sl}</Button></Space>
                </Col>
                <Col span={4} className={importStyle.custom_col}>
                  <Space>出口未申报：<Button type='link' style={{ color: "#f50" }} onClick={() => queryList2(ydlx,'04', ny)} >{smtjBody?.ydzs2[3].sl}</Button></Space>
                </Col>
                <Col span={4} className={importStyle.custom_col}>
                  <Space>风险商品：<Button type='link' style={{ color: "#f50" }} onClick={() => queryList2(ydlx,'05', ny)} >{smtjBody?.ydzs2[4].sl}</Button></Space>
                </Col>
                <Col span={5} className={importStyle.custom_col}>
                  <Space><Badge color="#f50" style={{ paddingBottom: 5, marginLeft: -15, }} /> 风险企业：<Button type='link' style={{ color: "#f50" }} onClick={() => queryList2(ydlx,'06', ny)} >{smtjBody?.ydzs2[5].sl}</Button></Space>
                </Col>
                <Col span={4} className={importStyle.custom_col}>
                  <Space>实地核查：<Button type='link' style={{ color: "#f50" }} onClick={() => queryList2(ydlx,'08', ny)} >{smtjBody?.ydzs2[7].sl}</Button></Space>
                </Col>
                <Col span={4} className={importStyle.custom_col}>
                  <Space>暂缓退税：<Button type='link' style={{ color: "#f50" }} onClick={() => queryList2(ydlx,'09', ny)} >{smtjBody?.ydzs2[8].sl}</Button></Space>
                </Col>
                <Col span={4} className={importStyle.custom_col}>
                  <Space>应征税货物：<Button type='link' style={{ color: "#f50" }} onClick={() => queryList2(ydlx,'10', ny)} >{smtjBody?.ydzs2[9].sl}</Button></Space>
                </Col>
                <Col span={7} className={importStyle.custom_col}>
                  <Space>风险口岸、国别、地区：<Button type='link' style={{ color: "#f50" }} onClick={() => queryList2(ydlx,'07', ny)} >{smtjBody?.ydzs2[6].sl}</Button></Space>
                </Col>
              </Row>
            </Col>
          </Row>
        </ProCard>
        <DDBunit2 config={myConfig} func={myFunc} />
        {/* <Spin tip="Loading..." spinning={masker} delay={100}>
          <DDBaseGrid
            userDataSource={data}
            columns={unitConfig.grid_columns}
            showSerialNumber
            rowKey='ywbd'
            pagination={false}
          />
      </Spin> */}

      </Spin>
    </div>
  </>
  );
};

export default Index;
