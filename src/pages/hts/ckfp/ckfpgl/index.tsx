/**
 * 发票概览
 */
import React, { useState, useEffect } from 'react';
import { Col, Row, DatePicker, Space, Radio, Spin, Empty } from 'antd';
import { BarChartOutlined, PieChartOutlined, LineChartOutlined, BarsOutlined } from '@ant-design/icons';
import DDBaseGrid from '@/components/DDBaseGrid';
import { DualAxes, MultiView } from '@ant-design/charts';
import ProCard from '@ant-design/pro-card';
import moment from 'moment';
import myUtil from '@/components/DDAssist/util';
import './style.less';
import { queryBgdwksj, queryFpsqdsj, queryQrkpsj, queryQjlskpsj } from '@/pages/hts/services/htsApi';


const { RangePicker } = DatePicker;

export interface DDCard {
  dataTitle?: any;
}

const Index: React.FC<DDCard> = () => {
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

  // 开票商品饼状图颜色
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
        alias: '开票金额（万元）',
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
                value: myUtil.text.formatNum(datum.value, '0,0.00') + '万元',
                title: datum.name,
              };
            },
            showContent: false,
          },
          label: {
            offset: '30%',
            content: '{name}:{value}万元（占比：{percentage}）',
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
        alias: '开票金额（万元）',
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
    }).finally(() => {
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
    });

  };

  useEffect(() => {
    loadMoreData();
  }, []);

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
            const tmpjeObj: any = { khmc: '开具金额（万元）' };
            item.forEach((item0: any, index0: any) => {
              tmpkpqsBar.push({ date: item0.kpyf, fpsl: item0.fpsl });
              tmpkpqsLine.push({ date: item0.kpyf, fpje: item0.fpje, category: '开票金额（万元）' });
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
            const tmpfpjeObj: any = { khmc: '商品金额（万元）' };
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
            const tmpjeObj: any = { khmc: '开具金额（万元）' };
            item.forEach((item2: any, index2: any) => {
              tmpkpkhBar.push({ date: item2.khmc, fpsl: item2.fpsl });
              tmpkpkhLine.push({ date: item2.khmc, fpje: item2.fpje, category: '开票金额（万元）' });
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
            {/* <ProCard bordered>
              <div className="header_card_wrap_group">
                <div className="header_card_title">未开数据</div>
                <div className="header_card_content">
                  <div className="hcc_icon hcc_icon1"><BarChartOutlined /></div>
                  <div className="hcc_desc">未开关单：{myUtil.text.formatNum(d.wkbgdsl, '0,0')}张/{myUtil.text.formatNum(d.wkbgdspsl, '0,0')}条</div>
                </div>
              </div>
            </ProCard> */}
          </Col>
          <Col span={8}>
            {/* <ProCard bordered>
              <div className="header_card_wrap_group">
                <div className="header_card_title">发票申请单</div>
                <div className="header_card_content">
                  <div className="hcc_icon hcc_icon2"><PieChartOutlined /></div>
                  <div className="hcc_desc">待开发票：{myUtil.text.formatNum(d.fpsqddkfpsl, '0,0')}张</div>
                  <div className="hcc_desc">待开金额：{myUtil.text.formatNum(d.fpsqddkfpje, '0,0.00')}万元</div>
                </div>
              </div>
            </ProCard> */}

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
            {/* <ProCard bordered>
              <div className="header_card_wrap_group">
                <div className="header_card_title">已申请数据</div>
                <div className="header_card_content">
                  <div className="hcc_icon hcc_icon3"><LineChartOutlined /></div>
                  <div className="hcc_desc">已开发票：{myUtil.text.formatNum(d.yqrkpfpsl, '0,0')}张</div>
                  <div className="hcc_desc">已开金额：{myUtil.text.formatNum(d.yqrkpfpje, '0,0.00')}万元</div>
                </div>
              </div>
            </ProCard> */}
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

  return (
    <>
      <Spin tip="Loading..." spinning={masker} delay={100}>
        {tileGroup(cardObj)}
        <ProCard title={leftButton()} headerBordered={true} extra={rightButton()}>
          <div style={{ height: '100%' }}>{getContent()}</div>
        </ProCard>
      </Spin>
    </>
  );
};

export default Index;
