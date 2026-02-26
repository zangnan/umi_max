import React, { useRef, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { Segmented } from 'antd';
import { NotificationOutlined, ImportOutlined, PayCircleOutlined, ReconciliationOutlined, AppstoreOutlined, BarsOutlined, ProjectOutlined, CarryOutOutlined, } from '@ant-design/icons';
import myUtil from '@/components/DDAssist/util';
import dayjs from 'dayjs';
import { Row, Col, Button, Form, Space, Radio, Select, DatePicker, Calendar, } from 'antd';
import { StatisticCard } from '@ant-design/pro-components';
import type { Dayjs } from 'dayjs';
import type { CalendarMode } from 'antd/es/calendar/generateCalendar';
import { Line, Column, Pie } from '@ant-design/plots';
import { DualAxes } from '@ant-design/plots';
import { dataColumn1, dataColumn2, dataColumn3, dataLine1, dataLine2, dataDualAxes2, dataPie1, dataDualAxes, uvBillData, transformData } from './data';
import './style.less';
// import { Bar, MultiView } from '@ant-design/charts';

const Alert: React.FC<any> = ({}) => {
  // const [base64Img, setBase64Img] = useState<any>('');
  let chartPie11: any;
  // 图表 线图1
  const configLine1 = {
    ...myUtil.chartsAntD.configLine({
      data: dataLine1,
      valueFormat: '0,0.00',
      valueUnit: '万美元',
      axisXTitle: '出口日期',
      axisYTitle: '毛利率',
    }),
  };

  // 图表 线图2
  const configLine2 = {
    ...myUtil.chartsAntD.configLine({
      data: dataLine2,
      valueFormat: '0,0.00',
      valueUnit: '万美元',
      axisXTitle: '出口日期',
      axisYTitle: '毛利率',
    }),
    colorField: 'type',
    annotations: [
      {
        type: "lineY",
        yField: 1400,
        style: { stroke: "green", strokeOpacity: 1, lineWidth: 1, lineDash: [2, 2], },
      },
      {
        type: "lineY",
        yField: 600,
        style: { stroke: "green", strokeOpacity: 1, lineWidth: 1, lineDash: [2, 2], },
      },
      {
        type: 'text',
        data: ['2020.05', 1400],
        style: {
          text: '高位警戒线：' + 1400,
          fill: 'green',
          textBaseline: 'bottom',
          dy: -2,
        },
      },
      {
        type: 'text',
        data: ['2020.05', 600],
        style: {
          text: '低位警戒线：' + 600,
          fill: 'green',
          textBaseline: 'bottom',
          dy: -2,
        },
      },
      {
        type: "rangeY",
        data: [{ y: [600, 1400] }],
        yField: 'y',
        style: {
          fill: 'green',
          opacity: 0.2,
        },
      },
    ],
  };

  // 图表 饼图
  const configPie1 = {
    ...myUtil.chartsAntD.configPie({
      data: dataPie1,
      showTotal: true,
      valueUnit: '元',
    }),
  };

  // 图表 柱状图1
  const configColumn1 = {
    annotations: [
      // https://ant-design-charts.antgroup.com/options/plots/annotation/text#%E5%BC%80%E5%A7%8B%E4%BD%BF%E7%94%A8
      // https://ant-design-charts-next.antgroup.com/options/plots/annotation/text#%E5%BC%80%E5%A7%8B%E4%BD%BF%E7%94%A8
      {
        type: 'text',
        data: ['2020.05', 1200],
        style: {
          text: `委托报关行户数：500户`,
          fill: 'red',
        },
      },
      {
        type: 'text',
        data: ['2021.03', 600],
        shape: 'badge',
        style: {
          text: '800',
          dy: -1,
          markerSize: 24,
          markerFill: '#6395FA',
          markerFillOpacity: 0.55,
        },
        tooltip: false,
      },
      // https://ant-design-charts-next.antgroup.com/options/plots/annotation/line-y
      // https://ant-design-charts.antgroup.com/options/plots/annotation/line-y#%E5%BC%80%E5%A7%8B%E4%BD%BF%E7%94%A8
      {
        type: "lineY",
        yField: 1100,
        style: { stroke: "#F4664A", strokeOpacity: 1, lineWidth: 2, lineDash: [2, 2], },
      },
    ],
    ...myUtil.chartsAntD.configColumn({
      data: dataColumn1,
      valueFormat: '0,0.00',
      valueUnit: '万美元',
      axisXTitle: '出口年月',
      axisYTitle: '出口额',
      showLabel: true,
    }),
  };

  // 图表 柱状图2 分组
  const configColumn2 = {
    ...myUtil.chartsAntD.configColumn({
      data: dataColumn2,
      valueFormat: '0,0.00',
      valueUnit: '万美元',
      axisXTitle: '出口年月',
      axisYTitle: '出口额',
    }),
    colorField: 'type',
    group: true,
  };

  // 图表 柱状图3 分组堆叠
  const configColumn3 = {
    colorField: 'series',
    seriesField: 'type',
    stack: {
      groupBy: ['x', 'series'],
      series: false,
    },
    ...myUtil.chartsAntD.configColumn({
      data: dataColumn3,
      valueFormat: '0,0.00',
      valueUnit: '万美元',
      axisXTitle: '出口年月',
      axisYTitle: '出口额',
    }),
  };

  // 图表 双轴图1
  const configDualAxes1 = {
    ...myUtil.chartsAntD.configDualAxes({
      data: dataDualAxes,
      valueFormat: '0,0.00',
      children: [
        {
          type: 'line',
          yField: 'yValue',
          shapeField: 'smooth',
          axisYPosition: 'right',
          axisYTitle: 'Temperature (°C)',
          valueFormat: '0,0',
          valueUnit: 'A',
        },
        {
          type: 'interval',
          yField: 'yValue3',
          axisYTitle: '毛利率',
          valueFormat: '0,0.00',
          valueUnit: '万美元',
        },
        {
          type: 'line',
          yField: 'yValue2',
          shapeField: 'smooth',
          axisYPosition: 'right',
          axisYTitle: 'Precipitation (ml)',
          valueFormat: '0,0',
          valueUnit: 'B',
        },
      ],
    }),
  };

  // 图表 双轴图2
  const configDualAxes2 = {
    ...myUtil.chartsAntD.configDualAxes({
      xField: 'time',
      axisXTitle: '出口年月',
      children: [
        {
          data: uvBillData,
          type: 'interval',
          yField: 'value',
          axisYTitle: '支出',
          valueFormat: '0,0.00',
          valueUnit: 'A',
          colorField: 'type',
          group: true,
        },
        {
          data: transformData,
          type: 'line',
          yField: 'value',
          axisYTitle: '收益',
          valueFormat: '0,0.00',
          valueUnit: 'B',
          axisYPosition: 'right',
          colorField: 'type',
          scale: { series: { independent: true } },
        },
      ],
    }),
  };

  // 图表 双轴图3
  const configDualAxes3 = {
    ...myUtil.chartsAntD.configDualAxes({
      xField: 'xValue',
      axisXTitle: '出口年月',
      children: [
        {
          data: dataColumn3,
          type: 'interval',
          yField: 'yValue',
          // colorField: 'group',
          group: true,
          axisYTitle: '支出',
          valueFormat: '0,0.00',
          valueUnit: 'A',
          colorField: 'series',
          seriesField: 'type',
          stack: {
            groupBy: ['x', 'series'],
            series: false,
          },
        },
        {
          data: dataDualAxes2,
          type: 'line',
          yField: 'yValue',
          axisYTitle: '收益',
          axisYPosition: 'right',
          colorField: 'type',
          scale: { series: { independent: true } },
          valueFormat: '0,0.00',
          valueUnit: 'B',
        },
      ],
    }),

  };

  // 表单
  const form = (
    <Form layout="inline" initialValues={initData}>
      <Form.Item name="quickChoice">
        <Radio.Group buttonStyle="solid">
          <Radio.Button value="y1">近一年</Radio.Button>
          <Radio.Button value="y2">近二年</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item name="rangeTime" style={{ width: 220 }}>
        <DatePicker.RangePicker />
      </Form.Item>
      <Form.Item name="groupType" label="时间粒度">
        <Select style={{ width: 80 }}>
          <Select.Option value="6">月</Select.Option>
          <Select.Option value="7">季度</Select.Option>
          <Select.Option value="8">年</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" size="middle">查询</Button>
          <Button size="middle" onClick={() => {
            chartPie11?.downloadImage();
            // 获取 base64 数据
            // let imageBase64 = chartPie11?.toDataURL('image', 1);
            // console.info(imageBase64);
            // setBase64Img(imageBase64);
          }}>
            下载
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  // 表单初始数据
  const initData = {
    quickChoice: 'y1',
    groupType: '6',
    rangeTime: [dayjs(new Date()), dayjs(new Date())],
  };

  // 卡片样式
  const pCardStyle = {
    height: '400px',
  };

  // 卡片属性
  const pCardProp = {
    // headerBordered: true,
    // size: 'small',
  };

  // 卡片按钮
  const extraBtn2 = (<Segmented options={[
    { label: '列表', value: 'List', icon: <BarsOutlined /> },
    { label: '看板', value: 'Kanban', icon: <AppstoreOutlined /> },
  ]} />);

  const cardChartLine1 = (
    <ProCard title="图表示例-Line" extra={extraBtn2} style={pCardStyle} >
      <Line {...configLine1} />
    </ProCard>
  );

  const cardChartLine2 = (
    <ProCard title="图表示例-Line" extra={extraBtn2} style={pCardStyle} >
      <Line {...configLine2} />
    </ProCard>
  );

  const cardChartColumn1 = (
    <ProCard title="图表示例-Column" extra={extraBtn2} style={pCardStyle} >
      <Column {...configColumn1} />
    </ProCard>
  );

  const cardChartColumn2 = (
    <ProCard title="图表示例-Column 分组" extra={extraBtn2} style={pCardStyle} >
      <Column {...configColumn2} />
    </ProCard>
  );

  const cardChartColumn3 = (
    <ProCard title="图表示例-Column 分组堆叠" extra={extraBtn2} style={pCardStyle} >
      <Column {...configColumn3} />
    </ProCard>
  );

  const cardChartPie1 = (
    <ProCard title="图表示例-Pie" extra={extraBtn2} style={pCardStyle} >
      <Pie {...configPie1} />
    </ProCard>
  );

  const cardDualAxes1 = (
    <ProCard title="出口情况分析-DualAxes" extra={extraBtn2} style={pCardStyle} >
      <DualAxes {...configDualAxes1} />
    </ProCard>
  );

  const cardDualAxes2 = (
    <ProCard title={<>{form}</>} extra={extraBtn2} style={pCardStyle} >
      <DualAxes {...configDualAxes2} />
    </ProCard>
  );

  const cardDualAxes3 = (
    <ProCard title="出口情况分析-DualAxes" style={pCardStyle} extra={<Space orientation="horizontal">
      {form}
      {extraBtn2}
    </Space>}>
      <DualAxes {...configDualAxes3} onReady={(chartInstance) => (chartPie11 = chartInstance)}/>
    </ProCard>
  );

  // 配置列表列
  // const columns = [
  //   { title: '报关单号', dataIndex: 'ckbgdh', width: 220 },
  //   { title: '项号', dataIndex: 'xh4', width: 60 },
  //   { title: '银行账号', dataIndex: 'yhzh', width: 160 },
  //   { title: '商品代码', dataIndex: 'ckspDm', width: 95 },
  //   { title: '法定单位', dataIndex: 'dyjldwDm', width: 90 },
  //   { title: '第二单位', dataIndex: 'dejldwDm', width: 90 },
  // ];

  // const theme1 = {
  //   colors10: [ '#B8E1FF', '#9AC5FF', '#7DAAFF', '#5B8FF9', '#3D76DD', '#085EC0', '#0047A5', '#00318A', '#001D70', ],
  //   colors20: [ '#B8E1FF', '#9AC5FF', '#7DAAFF', '#5B8FF9', '#3D76DD', '#085EC0', '#0047A5', '#00318A', '#001D70', ],
  // };

  // const theme2 = {
  //   colors10: [ '#025DF4', '#DB6BCF', '#2498D1', '#BBBDE6', '#4045B2', '#21A97A', '#FF745A', '#007E99', '#FFA8A8', '#2391FF', ],
  //   colors20: [ '#025DF4', '#DB6BCF', '#2498D1', '#BBBDE6', '#4045B2', '#21A97A', '#FF745A', '#007E99', '#FFA8A8', '#2391FF', '#FFC328', '#A0DC2C', '#946DFF', '#626681', '#EB4185', '#CD8150', '#36BCCB', '#327039', '#803488', '#83BC99', ],
  // };

  // config4
  // const configMultiView1 = {
  //   padding: [10, 30, 20, 120],
  //   plots: [
  //     {
  //       type: 'bar',
  //       region: { start: { x: 0, y: 0 }, end: { x: 0.7, y: 1 } },
  //       options: {
  //         data: dataPie1,
  //         yField: 'group',
  //         xField: 'data',
  //         seriesField: 'group',
  //         theme: theme2,
  //         meta: {
  //           data: {
  //             alias: '进货额',
  //             formatter: function formatter(v: any) {
  //               return myUtil.text.formatNum(v, '0,0.00') + ' 万元';
  //             },
  //           },
  //         },
  //         label: {
  //           position: 'right',
  //           offset: 4,
  //         },
  //       },
  //     },
  //     {
  //       type: 'pie',
  //       region: { start: { x: 0.7, y: 0 }, end: { x: 1, y: 1 } },
  //       options: {
  //         appendPadding: 20,
  //         data: dataPie1,
  //         angleField: 'data',
  //         colorField: 'group',
  //         radius: 0.6,
  //         theme: theme1,
  //         tooltip: {
  //           formatter: (datum: any) => {
  //             return {
  //               name: '供货额',
  //               value: myUtil.text.formatNum(datum.data, '0,0.00') + ' 万元',
  //               title: datum.group,
  //             };
  //           },
  //           showContent: false,
  //         },
  //         label: {
  //           offset: '30%',
  //           content: '{percentage}',
  //         },
  //         interactions: [{ type: 'element-active' }],
  //       },
  //     },
  //   ],
  // };

  // const extraBtn1 = (
  //   <Space>
  //     <Button type="default">设置</Button>
  //     <Button type="default">刷新</Button>
  //   </Space>
  // );

  // const cardMultiView1 = (
  //   <ProCard title="前十供货企业-MultiView" extra={<>{formBtn}</>} style={pCardStyle} >
  //     <MultiView {...configMultiView1} />
  //   </ProCard>
  // );

  // const card6 = (
  //   <ProCard title={<>{form}</>} extra={extraBtn2} style={pCardStyle} >
  //     <Bar {...configColumn1} />
  //   </ProCard>
  // );

  const card11 = (
    <ProCard title="未开数据" {...pCardProp}>
      <StatisticCard statistic={{ title: '未开关单', value: '160张/278条', tip: '未开关单帮助文字' }} />
    </ProCard>
  );

  const card12 = (
    <ProCard title="发票申请单" {...pCardProp}>
      <StatisticCard
        statistic={{ title: '待开发票', value: 99, suffix: '张' }}
        chart={ <ProjectOutlined style={{ fontSize: '40px', color: '#0a6ed1' }} /> }
        chartPlacement="left"
      />
      <StatisticCard statistic={{ title: '待开金额', value: 74.79, suffix: '万元' }} chartPlacement="left" />
    </ProCard>
  );

  const card13 = (
    <ProCard title="已申请数据" {...pCardProp}>
      <StatisticCard
        statistic={{ title: '已开发票', value: 99, suffix: '张' }}
        chart={ <CarryOutOutlined style={{ fontSize: '40px', color: '#da9700' }} /> }
        chartPlacement="left"
      />
      <StatisticCard statistic={{ title: '已开金额', value: 5.9, suffix: '万元', }} chartPlacement="left" />
    </ProCard>
  );

  const card8 = (
    <ProCard title="已申请数据" {...pCardProp}>
      <StatisticCard.Group direction="row">
        <StatisticCard
          statistic={{
            title: '出口额',
            value: '14,596.00',
            tip: '说明文字...',
            suffix: '万美元',
            description: ( <StatisticCard.Statistic title="月同比" value="6.47%" trend="up" /> ),
            icon: ( <ImportOutlined style={{ fontSize: '40px', color: '#0066cc' }} /> ),
          }}
        />
        <StatisticCard
          statistic={{
            title: '退税额',
            value: '1,596.00',
            suffix: '万元',
            tip: '说明文字...',
            description: ( <StatisticCard.Statistic title="月同比" value="2.47%" trend="down" /> ),
            icon: ( <PayCircleOutlined style={{ fontSize: '40px', color: '#00b13f' }} /> ),
          }}
        />
        <StatisticCard
          statistic={{
            title: '进货金额',
            value: '4,596.00',
            suffix: '万元',
            tip: '说明文字...',
            description: ( <StatisticCard.Statistic title="月同比" value="3.46%" trend="up" /> ),
            icon: ( <ReconciliationOutlined style={{ fontSize: '40px', color: '#da0000' }} /> ),
          }}
        />
        <StatisticCard
          statistic={{
            title: '未办理',
            value: '396.00',
            suffix: '万元',
            tip: '说明文字...',
            icon: ( <NotificationOutlined style={{ fontSize: '40px', color: '#f38600' }} /> ),
          }}
        />
      </StatisticCard.Group>
    </ProCard>
  );

  const onPanelChange = (value: Dayjs, mode: CalendarMode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  const cardCalendar = (
    <ProCard title="退税日历" {...pCardProp}>
      <Calendar mode="year" onPanelChange={onPanelChange} />
    </ProCard>
  );

  let colConfig: any = { xs:24, sm:24, md:24, lg:24, xl:24, xxl:24 };

  return (
    <div className="workspace">
      {/* {base64Img && <img src={base64Img} width={'100%'}/>} */}
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
          <ProCard>{form}</ProCard>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={18}>
          <Row gutter={[20, 20]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={6} xxl={6}> {card11} </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={9} xxl={9}> {card12} </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={9} xxl={9}> {card13} </Col>
            <Col {...colConfig} >{cardChartColumn1}</Col>
            <Col {...colConfig} >{cardChartColumn2}</Col>
            <Col {...colConfig} >{cardChartColumn3}</Col>
            <Col {...colConfig} >{cardChartPie1}</Col>
            <Col {...colConfig} >{cardChartLine1}</Col>
            <Col {...colConfig} >{cardChartLine2}</Col>
            <Col {...colConfig} >{cardDualAxes1}</Col>
            <Col {...colConfig} >{cardDualAxes2}</Col>
            <Col {...colConfig} >{cardDualAxes3}</Col>
            <Col {...colConfig} >{card8}</Col>
            {/* <Col {...colConfig} >{card6}</Col> */}
            {/* <Col { ...colConfig} > {cardMultiView1} </Col> */}
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={6} xxl={6}>
          <Row gutter={[20, 20]}>
            <Col {...colConfig}>{cardCalendar}</Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Alert;
