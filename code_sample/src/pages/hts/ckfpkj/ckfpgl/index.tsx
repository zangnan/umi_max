/**
 * 发票概览
 */
import React, { useState, useEffect, useRef } from 'react';
import { Col, Row, DatePicker, Space, Radio, Spin, Empty, Alert, Button, message, } from 'antd';
import { BarChartOutlined, ExclamationCircleFilled, CheckCircleFilled, BarsOutlined, CloseCircleFilled } from '@ant-design/icons';
import DDBaseGrid from '@/components/DDBaseGrid';
import { DualAxes, MultiView } from '@ant-design/charts';
import { useAccess } from 'umi';
import ProCard from '@ant-design/pro-card';
import moment from 'moment';
import myUtil from '@/pages/common/myUtil';
import './style.less';
import { queryBgdwksj, queryFpsqdsj, queryQrkpsj, queryQjlskpsj, hqsdpxe, checkDlt2,sdgxrzzt } from '@/services/hts/api';
import TabSfyz from '../../pzgl/sdppzgl/djdlpz/tab_sfyz';
import TabKprz from '../../pzgl/sdppzgl/djdlpz/tab_kprz';
import qxUtil from '@/pages/common/qxUtil';
import FpDDLogin from '@/components/FpDDLogin';

const { RangePicker } = DatePicker;

export interface DDCard {
  dataTitle?: any;
}


const Index: React.FC<DDCard> = () => {

  const access = useAccess(); // 权限

  const paramLq = {
    qxCode: 'qx_szlq',
    accessObj: access,
  }
  const refSmrz: any = useRef();
  const refKprz: any = useRef();
  const refFpRz: any = useRef();
  const [visible, setVisible] = useState(false);
  const [bysxed, setBysxed] = useState<any>();
  const [kysyed, setKysyed] = useState<any>();
  const [masker, setMasker] = useState(false);
  const [cardObj, setCardObj] = useState<any>({}); // 顶部card信息
  const [clickBtn, changeClickBtn] = useState<any>('1'); // 左侧按钮切换 1：开票趋势；2：开票商品top10；3：开票客户top10。
  const [clickIcon, changeClickIcon] = useState<any>('1'); // 右侧按钮切换展示方式 1：图展示；2：表展示
  // 开票趋势
  const [kpqsBar, setKpqsBar] = useState<any>([]); // 开票趋势 柱状图数据
  const [kpqsLine, setKpqsLine] = useState<any>([]); // 开票趋势 线型图数据
  const [kpqsColumns, setKpqsColumns] = useState<any>([]); // 开票趋势 表格 列名
  const [kpqsData, setKpqsData] = useState<any>([]); // 开票趋势 表格 数据
  // 开票商品top10
  const [kpspBar, setKpspBar] = useState<any>([]); // 开票商品top10 饼图数据
  const [kpspColumns, setKpspColumns] = useState<any>([]); // 开票商品top10 表格 列名
  const [kpspData, setKpspData] = useState<any>([]); // 开票商品top10 表格 数据
  // 开票客户top10
  const [kpkhBar, setKpkhBar] = useState<any>([]); // 开票客户top10 柱状图数据
  const [kpkhLine, setKpkhLine] = useState<any>([]); // 开票客户top10 线型图数据
  const [kpkhColumns, setKpkhColumns] = useState<any>([]); // 开票客户top10 表格 列名
  const [kpkhData, setKpkhData] = useState<any>([]); // 开票客户top10 表格 数据
  const [dates, setDates] = useState<any>();
  const [hackValue, setHackValue] = useState<any>();
  const [value, setValue] = useState<any>();
  //图表中是否存在数据
  const [isThereData, setIsThereData] = useState(false);
  const [uuid, setUuid] = useState<any>(''); 

  // 开票商品饼状图颜色

  // 登录状态
  const [dlzt, setDlzt] = useState(false);
  // 认证状态
  const [rzzt, setRzzt] = useState<any>();

  const theme1 = {
    colors10: [
      '#B8E1FF',
      '#9AC5FF',
      '#7DAAFF',
      '#5B8FF9',
      '#3D76DD',
      '#085EC0',
      '#0047A5',
      '#00318A',
      '#001D70',
    ],
    colors20: [
      '#B8E1FF',
      '#9AC5FF',
      '#7DAAFF',
      '#5B8FF9',
      '#3D76DD',
      '#085EC0',
      '#0047A5',
      '#00318A',
      '#001D70',
    ],
  };

  // 开票趋势情况柱状、线性图
  const chart01 = {
    data: [kpqsBar, kpqsLine],
    xField: 'date',
    yField: ['fpsl', 'fpje'],
    meta: {
      fpsl: {
        alias: '开具张数（张）',
        formatter: function formatter(v: any) {
          return myUtil.text.formatNum(v, '0,000');
        },
      },
      fpje: {
        alias: '开票金额（元）',
        formatter: function formatter(v: any) {
          return myUtil.text.formatNum(v, '0,0.00');
        },
      },
    },
    legend: {
      itemName: {
        formatter: function formatter(text: any, item: { value: string }) {
          return item.value === 'value' ? '开具张数（张）' : text;
        },
      },
    },
    height: 350,
    geometryOptions: [
      { geometry: 'column', columnWidthRatio: 0.3 },
      {
        geometry: 'line',
        lineStyle: { lineWidth: 2 },
        seriesField: 'category',
      },
    ],
  };

  useEffect(() => {
    loadMoreData();
  }, []);


  // 开票商品饼状图
  const chart02 = {
    height: 370,
    padding: 'auto',
    plots: [
      {
        type: 'pie',
        region: { start: { x: -0.2, y: -0.2 }, end: { x: 1.1, y: 1.1 } },
        options: {
          appendPadding: 30,
          data: kpspBar,
          angleField: 'value',
          colorField: 'name',
          radius: 0.5,
          theme: theme1,
          tooltip: {
            formatter: (datum: any) => {
              return {
                name: '商品金额',
                value: myUtil.text.formatNum(datum.value, '0,0.00') + '元',
                title: datum.name,
              };
            },
            showContent: false,
          },
          label: {
            offset: '30%',
            content: '{name}:{value}元（占比：{percentage}）',
          },
          interactions: [{ type: 'element-active' }],
        },
      },
    ],
    legend: {
      layout: 'vertical',
      position: 'left',
      marker: {
        symbol: 'square'
      }
    }
  };

  // 开票客户TOP10柱状、线性图
  const chart03 = {
    data: [kpkhBar, kpkhLine],
    xField: 'date',
    yField: ['fpsl', 'fpje'],
    xAxis: {
      label: {
        rotate: 50
      },
    },
    meta: {
      fpsl: {
        alias: '开具张数（张）',
        formatter: function formatter(v: any) {
          return myUtil.text.formatNum(v, '0,000');
        },
      },
      fpje: {
        alias: '开票金额（元）',
        formatter: function formatter(v: any) {
          return myUtil.text.formatNum(v, '0,0.00');
        },
      },
    },
    legend: {
      itemName: {
        formatter: function formatter(text: any, item: { value: string }) {
          return item.value === 'value' ? '开具张数（张）' : text;
        },
      },
    },
    height: 350,
    geometryOptions: [
      { geometry: 'column', columnWidthRatio: 0.3 },
      {
        geometry: 'line',
        lineStyle: { lineWidth: 2 },
        seriesField: 'category',
      },
    ],
  };


  const loadMoreData = () => {
    if (masker) {
      return;
    }
    setMasker(true);
    const promiseArr = [];
    promiseArr.push(bgdwksj({}));
    promiseArr.push(fpsqdsj({}));
    promiseArr.push(qrkpsj({}));
    const tmpObj: any = {};
    Promise.all(promiseArr).then((res) => {
      res.forEach((item: any) => {
        for (let key in item) {
          tmpObj[key] = item[key];
        }
      })
      // 顶部card信息
      setCardObj(tmpObj);
    }).catch(() => {
    }).finally(async () => {
      setMasker(false);
      const time = myUtil.localStore.getItem('temp_ckfp_fpgl_time');
      if (time) {
        setValue([moment(time[0], 'YYYY-MM'), moment(time[1], 'YYYY-MM')]);
        const params: any = {
          kpyfqs: myUtil.date.getMonthFirstDay(time[0].valueOf()),
          kpyfjz: myUtil.date.getMonthLastDay(time[1].valueOf())
        }
        getFpkjqjtj(params);
      }
      loadKppz();
    });

  };






  // 未开票报关单信息
  const bgdwksj = async (params: any) => {
    const result = await queryBgdwksj(params);
    if (result.code === '200') {
      return result.body;
    } else {
      return { wkbgdsl: 0, wkbgdspsl: 0 };
    }
  }

  // 发票申请单待开信息
  const fpsqdsj = async (params: any) => {
    const result = await queryFpsqdsj(params);
    if (result.code === '200') {
      return result.body;
    } else {
      return { fpsqddkfpsl: 0, fpsqddkfpje: 0 };
    }
  }

  // 历史出口发票开具情况
  const qrkpsj = async (params: any) => {
    const result = await queryQrkpsj(params);
    if (result.code === '200') {
      return result.body;
    } else {
      return { yqrkpfpje: 0, yqrkpfpsl: 0 };
    }
  }

  // 获取发票开具区间统计数据
  const getFpkjqjtj = (params: any) => {
    const tjlxs: any = ['1', '2', '3'];
    const promiseArr: any = [];
    tjlxs.forEach((item: any) => {
      const temp = { ...params };
      temp.tjlx = item;
      promiseArr.push(qjlskpsj(temp));
    });
    setMasker(true);
    Promise.all(promiseArr).then((res) => {
      res.forEach((item: any, index: any) => {
        // 开票趋势
        if (index === 0) {
          if (item.length > 0) {
            const tmpkpqsBar: any = [];
            const tmpkpqsLine: any = [];
            const tmpkpqsColumns: any = [{ title: '开票月份', dataIndex: 'khmc', width: 130, fixed: 'left' }];
            const tmpkpqsData: any = [];
            const tmpzsObj: any = { khmc: '开具张数（张）' };
            const tmpjeObj: any = { khmc: '开具金额（元）' };
            item.forEach((item0: any, index0: any) => {
              tmpkpqsBar.push({ date: item0.kpyf, fpsl: item0.fpsl });
              tmpkpqsLine.push({ date: item0.kpyf, fpje: item0.fpje, category: '开票金额（元）' });
              tmpkpqsColumns.push({ title: item0.kpyf, dataIndex: 'dataIndex' + index0.toString(), width: 150, ellipsis: true, align: 'right' });
              tmpzsObj['dataIndex' + index0.toString()] = item0.fpsl;
              tmpjeObj['dataIndex' + index0.toString()] = myUtil.text.formatNum(item0.fpje, '0,0.00');
            });
            tmpkpqsData.push(tmpzsObj);
            tmpkpqsData.push(tmpjeObj);
            setKpqsBar(tmpkpqsBar);
            setKpqsLine(tmpkpqsLine);
            setKpqsColumns(tmpkpqsColumns);
            setKpqsData(tmpkpqsData);
            setIsThereData(true);
          } else {
            setKpqsBar([]);
            setKpqsLine([]);
            setKpqsColumns([]);
            setKpqsData([]);
            setIsThereData(false);
          }
        }
        // 开票商品top10
        if (index === 1) {
          if (item.length > 0) {
            const tmpkpspBar: any = [];
            const tmpkpspColumns: any = [{ title: '商品名称', dataIndex: 'khmc', width: 130, fixed: 'left' }];
            const tmpkpspData: any = [];
            const tmpfpjeObj: any = { khmc: '商品金额（元）' };
            item.forEach((item1: any, index1: any) => {
              tmpkpspBar.push({ name: item1.hwmc, value: item1.fpje });
              tmpkpspColumns.push({ title: item1.hwmc, dataIndex: 'dataIndex' + index1.toString(), width: 150, align: 'right' })
              tmpfpjeObj['dataIndex' + index1.toString()] = myUtil.text.formatNum(item1.fpje, '0,0.00');
            });
            tmpkpspData.push(tmpfpjeObj);
            setKpspBar(tmpkpspBar);
            setKpspColumns(tmpkpspColumns);
            setKpspData(tmpkpspData);
            setIsThereData(true);
          } else {
            setKpspBar([]);
            setKpspColumns([]);
            setKpspData([]);
            setIsThereData(false);
          }
        }
        // 开票客户top10
        if (index === 2) {
          if (item.length > 0) {
            const tmpkpkhBar: any = [];
            const tmpkpkhLine: any = [];
            const tmpkpkhColumns: any = [{ title: '客户名称', dataIndex: 'khmc', width: 130, fixed: 'left' }];
            const tmpkpkhData: any = [];
            const tmpzsObj: any = { khmc: '开具张数（张）' };
            const tmpjeObj: any = { khmc: '开具金额（元）' };
            item.forEach((item2: any, index2: any) => {
              tmpkpkhBar.push({ date: item2.khmc, fpsl: item2.fpsl });
              tmpkpkhLine.push({ date: item2.khmc, fpje: item2.fpje, category: '开票金额（元）' });
              tmpkpkhColumns.push({ title: item2.khmc, dataIndex: 'dataIndex' + index2.toString(), width: 150, align: 'right' });
              tmpzsObj['dataIndex' + index2.toString()] = item2.fpsl
              tmpjeObj['dataIndex' + index2.toString()] = myUtil.text.formatNum(item2.fpje, '0,0.00');
            });
            tmpkpkhData.push(tmpzsObj);
            tmpkpkhData.push(tmpjeObj);
            setKpkhBar(tmpkpkhBar);
            setKpkhLine(tmpkpkhLine);
            setKpkhColumns(tmpkpkhColumns);
            setKpkhData(tmpkpkhData);
            setIsThereData(true);
          } else {
            setKpkhBar([]);
            setKpkhLine([]);
            setKpkhColumns([]);
            setKpkhData([]);
            setIsThereData(false);
          }
        }
      })
    }).catch(() => {
    }).finally(() => {
      setMasker(false);
    });
  }

  // qjlskpsj
  const qjlskpsj = async (params: any) => {
    const result = await queryQjlskpsj(params);
    if (result.code === '200') {
      return result.body;
    } else {
      return [];
    }
  }

  // 更新状态
  const gxzt = async () => {
    await checkDlt2({}).then(async (res: any) => {
      const { code, body, msg } = res;
      setMasker(false);
      if (code == '200') {
        const dl = body?.dlbz;
        if ( dl == 'Y') {
          //用户点认证,且有登录态，直接打开认证。 
          await sdgxrzzt({uuid:uuid}).then(async (res: any) => {
            const { code, body, msg } = res;
            setMasker(false);
            if (code == '200') {
              const dl = body?.dlbz == 'Y' ? true : false;
              const rz = body?.rzbz;
              const jhbz = body?.jhbz == 'Y' ? true : false;
              if (dl) {
                gxed();
              }
              setDlzt(dl);
              setRzzt(rz);
              setUuid(body?.uuid);
            } else {
              message.error(msg);
            }
          });
        } else {
          logon('5');
        }
      } else {
        message.error(msg);
      }
    });

   
    
  }

  const rzGroup = () => {
    let t = <></>;
    if (rzzt == 'Y') {
      t = <div className="box-num-left-l">
        <span className="box-dw"><CheckCircleFilled />&nbsp;&nbsp;已认证</span>
      </div>;
    } else if (rzzt == 'N') {
      t = <div className="box-num-left-r">
        <span className="box-dw"><CloseCircleFilled />&nbsp;&nbsp;未认证</span>
      </div>
    } else {
      t = <div className="box-num-left-q">
        <span className="box-dw"><ExclamationCircleFilled />&nbsp;&nbsp;未知</span>
      </div>
    }
    return t;
  }





  const tileGroupZxkp = (d: any) => {
    const groups = <>
      <div className="header_card_wrap" style={{ marginBottom: "20px" }}>
        <div >
          <Alert
            style={{ height: "60px", marginBlock: "20px", marginTop: "0px" }}
            message="为保证您能顺畅的使用在线开票功能开具数电票，请先进行数电登录和数电扫脸认证。"
            type="info"
            showIcon
          />
        </div>
        <Row gutter={20}>
          <Col span={8}>
            <div className="ckts-box">
              <div className='box-title'>
                发票额度
              </div>
              <div className='box-title-right'>
                <Button type="link" onClick={gxed}> 更新额度 </Button>
              </div>
              <div className="box-content-left">
                <div className='box-ftitle-left'>可用发票额度</div>
                <div className="box-num-left">
                  <span className="box-dw">{kysyed}{kysyed ? "元" : ""}</span>
                </div>
              </div>
              <div className="box-content-right">
                <div className='box-ftitle'>发票总额度</div>
                <div className="box-num-right">
                  <span className="box-dw">{bysxed}{bysxed ? "元" : ""}</span>
                </div>
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div className="ckts-box">
              <div className='box-title'>
                数电登录
              </div>
              <div className='box-title-right'>
                <Button type="link" onClick={() => logon('1')} > 登录 </Button>
              </div>
              <div className="box-content-left">
                <div className='box-ftitle-left'>登录状态</div>
                {
                  dlzt ? <div className="box-num-left-l">
                    <span className="box-dw"><CheckCircleFilled />&nbsp;&nbsp;已登录</span>
                  </div>
                    : <div className="box-num-left-r">
                      <span className="box-dw"><CloseCircleFilled />&nbsp;&nbsp;未登录</span>
                    </div>
                }
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div className="ckts-box">
              <div className='box-title'>
                数电扫脸认证
              </div>
              <div className='box-title-right'>
                {
                  rzzt == 'U' ? <Button type="link" onClick={gxzt}> 更新状态 </Button> :
                    <Button type="link" onClick={rz}> 认证 </Button>
                }
              </div>
              <div className="box-content-left">
                <div className='box-ftitle-left'>认证状态</div>
                {rzGroup()}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>;
    return groups;
  };




  const tileGroup = (d: any) => {
    const groups = <>
      <div className="header_card_wrap" style={{ marginBottom: "20px" }}>
        <Row gutter={20}>
          <Col span={8}>
            <div className="ckts-box">
              <div className='box-title'>
                未开数据
              </div>
              <div className="box-content-left">
                <div className='box-ftitle-left'>未开关单</div>
                <div className="box-num-left">
                  {myUtil.text.formatNum(d.wkbgdsl, '0,0')}
                  <span className="box-dw">张</span>
                </div>
              </div>
              <div className="box-content-right">
                <div className='box-ftitle'>未开关单</div>
                <div className="box-num-right">
                  {myUtil.text.formatNum(d.wkbgdspsl, '0,0')}
                  <span className="box-dw">条</span>
                </div>
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div className="ckts-box">
              <div className='box-title'>
                发票申请单
              </div>
              <div className="box-content-left">
                <div className='box-ftitle-left'>待开金额</div>
                <div className="box-num-left-q">
                  {myUtil.text.formatNum(d.fpsqddkfpje, '0,0.00')}
                  <span className="box-dw">元</span>
                </div>
              </div>
              <div className="box-content-right">
                <div className='box-ftitle'>待开发票</div>
                <div className="box-num-right">
                  {myUtil.text.formatNum(d.fpsqddkfpsl, '0,0')}
                  <span className="box-dw">张</span>
                </div>
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div className="ckts-box">
              <div className='box-title'>
                已申请数据
              </div>
              <div className="box-content-left">
                <div className='box-ftitle-left'>已开金额</div>
                <div className="box-num-left-q">
                  {myUtil.text.formatNum(d.yqrkpfpje, '0,0.00')}
                  <span className="box-dw">元</span>
                </div>
              </div>
              <div className="box-content-right">
                <div className='box-ftitle'>已开发票</div>
                <div className="box-num-right">
                  {myUtil.text.formatNum(d.yqrkpfpsl, '0,0')}
                  <span className="box-dw">张</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>;
    return groups;
  };

  const leftButton = () => {
    const leftBtn: any = <>
      <Space>
        <RangePicker value={hackValue || value} style={{ width: 200 }} picker="month" onChange={changeTime} allowClear={false}
          onOpenChange={onOpenChange} onCalendarChange={val => setDates(val)} disabledDate={disabledDate} />
        <Radio.Group defaultValue="1" buttonStyle="solid" onChange={(e) => { changeClickBtn(e.target.value) }}>
          <Radio.Button value="1">开票趋势情况</Radio.Button>
          <Radio.Button value="2">开票商品TOP10情况</Radio.Button>
          <Radio.Button value="3">开票客户TOP10情况</Radio.Button>
        </Radio.Group>
      </Space>
    </>
    return leftBtn;
  };

  const rightButton = () => {
    const rightBtn = <>
      <Radio.Group defaultValue="1" buttonStyle="solid" onChange={(e) => { changeClickIcon(e.target.value) }}>
        <Radio.Button value="1"><BarChartOutlined /></Radio.Button>
        <Radio.Button value="2"><BarsOutlined /></Radio.Button>
      </Radio.Group>
    </>;
    return rightBtn;
  };

  const onOpenChange = (open: any) => {
    if (open) {
      setHackValue([]);
      setDates([]);
    } else {
      setHackValue(undefined);
    }
  }

  // 切换时间
  const changeTime = (e?: any) => {
    if (e) {
      setValue(e);
      myUtil.localStore.setItem('temp_ckfp_fpgl_time', [moment(e[0]), moment(e[1])]);
      const params: any = {
        kpyfqs: myUtil.date.getMonthFirstDay(e[0].valueOf()),
        kpyfjz: myUtil.date.getMonthLastDay(e[1].valueOf())
      }
      getFpkjqjtj(params);
    }
  };

  // 最大范围选择12个月
  const disabledDate = (current: any) => {
    if (!dates || dates.length === 0) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'month') > 10;
    const tooEarly = dates[1] && moment(dates[1]).diff(current, 'month') > 10;
    return tooEarly || tooLate;
  };

  const height = 'calc(100vh - 335px)';

  const getContent = () => {
    if (isThereData) {
      if (clickBtn === '1' && clickIcon === '1') {
        return <DualAxes {...chart01} style={{ height: height }} />
      } else if (clickBtn === '2' && clickIcon === '1') {
        return <MultiView {...chart02} style={{ height: height }} />
      } else if (clickBtn === '3' && clickIcon === '1') {
        return <DualAxes {...chart03} style={{ height: height }} />
      } else if (clickBtn === '1' && clickIcon === '2') {
        return <DDBaseGrid userDataSource={kpqsData} columns={kpqsColumns} pagination={false} key='1' />
      } else if (clickBtn === '2' && clickIcon === '2') {
        return <DDBaseGrid userDataSource={kpspData} columns={kpspColumns} pagination={false} key='2' />
      } else if (clickBtn === '3' && clickIcon === '2') {
        return <DDBaseGrid userDataSource={kpkhData} columns={kpkhColumns} pagination={false} key='3' />
      }
    } else {
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    }
    return <></>;
  }
  /**************************************************************************************************************************************************/


  // 初始化页面  
  const loadKppz = () => {
    Promise.all([myUtil.code.getCodeFromServerT1('CODE_CS_ZXSB_FPKJ_CSPZ', '01')]).then(() => {
    }).catch(() => {
      message.error('获取码表失败');
    }).finally(async () => {
      const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ', '01');
      if (temp[0]?.fpzlDm1 == '5' && temp[0]?.fpkjfsDm == '2') {
        setVisible(true);
        reloadZt();
      }
      setBysxed("--");
      setKysyed("--");
    });
  }

  // 刷新
  const reloadZt = async () => {
    await checkDlt2({}).then(async (res: any) => {
      const { code, body, msg } = res;
      if (code == '200') {
        const dl = body?.dlbz == 'Y' ? true : false;
        const rz = body?.rzbz;
        if (dl) {
          gxed();
        }
        setDlzt(dl);
        setRzzt(rz);
        setUuid(body?.uuid);
      } else {
        message.error(msg);
      }
    });
  }
  // 更新额度
  const gxed = async () => {
    await checkDlt2({}).then(async (res: any) => {
      const { code, body, msg } = res;
      setMasker(false);
      if (code == '200') {
        const dl = body?.dlbz;
        if ( dl == 'Y') {
          //用户点认证,且有登录态，直接打开认证。 
          const result = await hqsdpxe({});
          if (result.code === '200') {
            setBysxed(myUtil.text.formatNum(result.body.bysxed, '0,0.00'));
            setKysyed(myUtil.text.formatNum(result.body.kysyed, '0,0.00'));
          } else {
            setBysxed("--");
            setKysyed("--");
            message.error(result?.msg);
          }
        } else {
          logon('1');
        }
      } else {
        message.error(msg);
      }
    });


    
  }

  // 监控是否登录 crflag:1/2/3/4
  const getdlFlag = async (crflag: any) => {
    await checkDlt2({}).then(async (res: any) => {
      const { code, body, msg } = res;
      setMasker(false);
      if (code == '200') {
        const dl = body?.dlbz;
        if (crflag == '3' && dl == 'Y') {
          //用户点认证,且有登录态，直接打开认证。 
          logon('2');
        }if (crflag == '5' && dl == 'Y') {
          //用户点认证,且有登录态，直接打开认证。 
          await sdgxrzzt({uuid:uuid}).then(async (res: any) => {
            const { code, body, msg } = res;
            setMasker(false);
            if (code == '200') {
              const dl = body?.dlbz == 'Y' ? true : false;
              const rz = body?.rzbz;
              const jhbz = body?.jhbz == 'Y' ? true : false;
              if (jhbz) {
                gxed();
              }
              setDlzt(dl);
              setRzzt(rz);
              setUuid(body?.uuid);
            } else {
              message.error(msg);
            }
          });
        }else {
          //直接刷新页面状态
          reloadZt();
        }
      } else {
        message.error(msg);
      }
    });
  }



  // 登录 /认证  
  // flag 说明： 
  // 1：用户直接点登录。
  // 2. 用户点认证,且有登录态，直接打开认证。 
  // 3. 用户点认证，但是登录状态为未登录，要先打开登录页面 
  const logon = async (flag: any) => {
    // 用户发起登录
    if (flag == '1' || flag == '3' || flag == '5') {
      if (myUtil.fpfw.fpfwlxDm() === '2') {
        refKprz.current!.showModal(flag);
      } else {
        refFpRz.current!.showModal(flag);
      }
      return;
    }
    // 用户发起认证
    if (flag == '2') {
      refSmrz.current!.showModal(flag);
      return;
    }
  }


  const rz = async () => {
    // 先调用接口查询是否已登录
    await checkDlt2({}).then(async (res: any) => {
      const { code, body, msg } = res;
      if (code == '200') {
        const dl = body?.dlbz == 'Y' ? true : false;
        const rz = body?.rzbz;
        setDlzt(dl);
        setRzzt(rz);
        if (dl) {
          // 如果已登录，
          logon('2');
        } else {
          // 如果未登录，弹出登录
          logon('3');
        }
      } else {
        message.error(msg);
      }
    });
  }


  /**************************************************************************************************************************************************/

  return (
    <>
      <Spin tip="Loading..." spinning={masker} delay={100}>
        {visible && !qxUtil.getQxz(paramLq) ? tileGroupZxkp(cardObj) : <></>}
        {tileGroup(cardObj)}
        <ProCard title={leftButton()} headerBordered={true} extra={rightButton()}>
          <div style={{ height: '100%' }}>{getContent()}</div>
        </ProCard>
      </Spin>
      <TabSfyz onRef={refKprz} getdlFlag={getdlFlag} />
      <TabKprz onRef={refSmrz} getdlFlag={getdlFlag} />
      <FpDDLogin onRef={refFpRz} getdlFlag={getdlFlag} />

    </>
  );
};

export default Index;
