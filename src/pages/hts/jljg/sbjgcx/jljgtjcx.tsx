/**
 * title: 进料加工核销汇总
 * creator: wxl
 */
import React, { useState, useEffect } from 'react';
import { Spin, Select, Form } from 'antd';
import { queryJljgtjcxSsqList, queryYhxHz } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';
import { useRouteData } from 'umi';
import './style.less';

const Index: React.FC<unknown> = () => {
  const [loading, setLoading] = useState(false);
  const [masker, setMasker] = useState(false);
  // 所属期列表
  const [ssqList, setSsqList] = useState([{ ssq: '' }]);
  // 进料加工业务免抵退核销表
  const [mdthxData, setMdthxData] = useState({ ytzmdtse: '', mdtsbdmzhdkse: '', rmblaj: '', jsjkzz: '', jsckzz: '', zhsjfpl: '', sbts: '', scts: '', zcts: '' });
  // 已核销手（账）册海关数据调整表
  const [yhxtzData, setYhxtzData] = useState({ sbts: '', jkbgdts: '', ckbgdts: '' });
  // 年度计划分配率
  const [ndjhfplData, setNdjhfplData] = useState({ ssq: '', sndyhxszcsjfpl: '' });
  const [form] = Form.useForm();

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    // 查询所属期列表
    queryJljgtjcxSsq();
    // getNdjhList();
    setLoading(false);
  };

  // 获得所属期列表
  const queryJljgtjcxSsq = () => {
    setMasker(true);
    queryJljgtjcxSsqList({}).then((res: any) => {
      if (res.code == '200') {
        setSsqList(res.body);
        if (res.body && res.body.length > 0) {
          form.setFieldsValue({ ssq: res.body[0].ssq });
          queryJljgtjcxNdjh(res.body[0]);
        }
      }
      setMasker(false);
    })
  };

  // 获得年度计划数据
  const queryJljgtjcxNdjh = (param: any) => {
    setMasker(true);
    queryYhxHz(param).then((res: any) => {
      setMasker(false);
      if (res.code == '200') {
        if (res.body.mdthx && res.body.mdthx.length > 0) {
          setMdthxData(res.body.mdthx[0]);
        }
        if (res.body.yhxtz && res.body.yhxtz.length > 0) {
          setYhxtzData(res.body.yhxtz[0]);
        }
        if (res.body.ndjhfpl && res.body.ndjhfpl.length > 0) {
          setNdjhfplData(res.body.ndjhfpl[0]);
        }
      }
    });
  }

  useEffect(() => {
    loadMoreData();
  }, []);

  const gridStyleLeft: any = {
    width: '30%',
    textAlign: 'left',
    height: '30px',
    lineHeight: '1px',
    boxShadow: '#333333 0px 0px 0px 0px, #333333 1px 0px 0px 0px, #333333 0px 0px 0px 0px inset, #333333 0px 1px 0px 0px inset',
  };

  const gridStyleRight: any = {
    width: '20%',
    textAlign: 'left',
    height: '30px',
    lineHeight: '1px',
    boxShadow: '#333333 1px 0px 0px 0px, #333333 0px 1px 0px 0px, #333333 0px 0px 0px 0px, #333333 0px 0px 0px 0px inset, #333333 0px 1px 0px 0px inset',
  };

  const gridStyleRight02: any = {
    width: '20%',
    textAlign: 'left',
    height: '30px',
    lineHeight: '1px',
    boxShadow: '#333333 0px 0px 0px 0px, #333333 0px 2px 0px 0px, #333333 0px 0px 0px 0px, #333333 0px 0px 0px 0px inset, #333333 0px 1px 0px 0px inset',
  };

  const gridStyleLeft01: any = {
    width: '30%',
    textAlign: 'left',
    height: '30px',
    lineHeight: '1px',
    boxShadow: '1px 0 0 0 #333333, 0 2px 0 0 #333333, 1px 1px 0 0 #333333, 1px 0 0 0 #333333 inset, 0 1px 0 0 #333333 inset',
  }

  // 改变所属期
  const changeSsq = (value: any) => {
    queryJljgtjcxNdjh({ ssq: value });
  }

  const routeMatch = useRouteData();
  const [routePathname] = [...routeMatch.route.path.split('/')].reverse();
  let heightCalcList = ['header', 'headerTab', 'cardMargin'];
  if (routePathname.indexOf('CXTJ_') > -1) { // 数据管理中无tab组件高度
    heightCalcList = ['header', 'cardMargin'];
  }

  return (
    <Spin tip="Loading..." spinning={masker} delay={100} className="jljgPage">
      <div className="lay_wrap_jljgtjcx" style={{ overflowX: 'auto',
          height: myUtil.heightCalc.getCalc(heightCalcList) }}>
        <h1 style={{ marginTop: '10px', textAlign: 'center' }}>进料加工核销汇总</h1>
        <div style={{ margin: '20px auto', maxWidth: '860px', padding: '0 20px' }}>
          <Form form={form}>
            <Form.Item label="所属期/申报批次" name="ssq">
              <Select
                style={{ width: '150px' }}
                className="hlgl-form"
                optionLabelProp="label"
                onChange={changeSsq}
              >
                {
                  ssqList.map(item => (
                    <Select.Option key={item.ssq} label={item.ssq} value={item.ssq}>{item.ssq}</Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Form>
          <table className="jljg-table">
            <tbody>
            <tr>
              <th colSpan={4} className="tableTitle">进料加工业务免抵退核销表</th>
            </tr>
            <tr>
              <td className="label-name">应调整免抵退税额</td>
              <td className="label-text">{myUtil.grid.formatNum(mdthxData.ytzmdtse, '0,0.00')}元</td>
              <td className="label-name">应调整不得免征和抵扣税额</td>
              <td className="label-text">{myUtil.grid.formatNum(mdthxData.mdtsbdmzhdkse, '0,0.00')}元</td>
            </tr>
            <tr>
              <td className="label-name">综合实际分配率</td>
              <td className="label-text">{myUtil.grid.formatNum(mdthxData.zhsjfpl, '0,0.00000')}%</td>
              <td className="label-name">已申报出口额</td>
              <td className="label-text">{myUtil.grid.formatNum(mdthxData.rmblaj, '0,0.00')}元</td>
            </tr>
            <tr>
              <td className="label-name" width="40px">进口总额</td>
              <td className="label-text">{myUtil.grid.formatNum(mdthxData.jsjkzz, '0,0.00')}美元</td>
              <td className="label-name">出口总额</td>
              <td className="label-text">{myUtil.grid.formatNum(mdthxData.jsckzz, '0,0.00')}美元</td>
            </tr>
            <tr>
              <td className="label-name">核销申报记录</td>
              <td className="label-text">{mdthxData.sbts && mdthxData.sbts != null ? mdthxData.sbts: 0}条</td>
              <td className="label-name"></td>
              <td className="label-text"></td>
            </tr>
            <tr>
              <td className="label-name">其中：手册</td>
              <td className="label-text">{mdthxData.scts && mdthxData.scts != null ? mdthxData.scts: 0}条</td>
              <td className="label-name">账册</td>
              <td className="label-text">{mdthxData.zcts && mdthxData.zcts != null ? mdthxData.zcts: 0}条</td>
            </tr>
            <tr>
              <th colSpan={4} className="tableTitle">已核销手（账）册海关数据调整表</th>
            </tr>
            <tr>
              <td className="label-name">核销申报记录</td>
              <td className="label-text">{yhxtzData.sbts && yhxtzData.sbts != null ? yhxtzData.sbts: 0}条</td>
              <td className="label-name"></td>
              <td className="label-text"></td>
            </tr>
            <tr>
              <td className="label-name">其中：进口关单</td>
              <td className="label-text">{yhxtzData.jkbgdts && yhxtzData.jkbgdts != null ? yhxtzData.jkbgdts: 0}条</td>
              <td className="label-name">出口关单</td>
              <td className="label-text">{yhxtzData.ckbgdts && yhxtzData.ckbgdts != null ? yhxtzData.ckbgdts: 0}条</td>
            </tr>
            <tr>
              <th colSpan={4} className="tableTitle">年度计划分配率</th>
            </tr>
            <tr>
              <td className="label-name">所属期</td>
              <td className="label-text">{ndjhfplData.ssq}</td>
              <td className="label-name">分配率</td>
              <td className="label-text">{myUtil.grid.formatNum(ndjhfplData.sndyhxszcsjfpl, '0,0.00000')}%</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Spin>
  );
};

export default Index;
