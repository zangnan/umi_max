import React, { useState, useEffect, useMemo } from 'react';
import { DatePicker, Row, Col, Card, Table, Button, Tag, Typography, Space, message, Empty } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Line, Pie, Column } from '@ant-design/plots';
import ProCard from '@ant-design/pro-card';
import { StatisticCard } from '@ant-design/pro-components';
import { ArrowUpOutlined, ArrowDownOutlined, TableOutlined, ExpandOutlined, CompressOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import {
  getOverview,
  getTrend,
  getByInterface,
  getByUser,
  getByStatusCode,
  getByIp,
  getPerformance,
  getHourly,
} from '@/services/apiAnalysis';

const { RangePicker } = DatePicker;
const { Text } = Typography;
const { Statistic } = StatisticCard;

// ==================== 类型定义 ====================

interface OverviewData {
  totalCalls?: number;
  dailyAvg?: number;
  avgResponseTime?: number;
  apiCount?: number;
  userCount?: number;
  errorRate?: number;
}

interface TrendData {
  volumeTrend?: { date: string; count: number }[];
  timeTrend?: { date: string; avgTime: number }[];
}

interface InterfaceData {
  interface: string;
  callCount: number;
  avgTime: number;
  maxTime: number;
  minTime: number;
  errorCount: number;
  errorRate: string;
  lastCallTime: string;
}

interface UserData {
  userId: string;
  callCount: number;
  avgTime: number;
  firstCallTime: string;
  lastCallTime: string;
  apiDistribution?: { interface: string; count: number }[];
}

interface StatusCodeData {
  distribution?: { statusCode: number; count: number }[];
  errorDetails?: {
    interface: string;
    statusCode: number;
    userId: string;
    ip: string;
    callTime: string;
    responseTime: number;
  }[];
}

interface IpData {
  ip: string;
  callCount: number;
  userCount: number;
  apiCount: number;
  apiDistribution?: { interface: string; count: number }[];
}

interface PerformanceData {
  slowInterfaces?: {
    interface: string;
    avgTime: number;
    maxTime: number;
    callCount: number;
  }[];
  timeDistribution?: { category: string; count: number }[];
}

interface HourlyData {
  hourlyDistribution?: { hour: number; count: number }[];
  peakHour?: { hour: number; count: number };
}

// ==================== 响应时间分布标签映射 ====================
// 注意：后端接口需返回 lt50ms 和 50-100ms 类别，当前后端返回 lt100ms 需要兼容处理
const timeCategoryMap: Record<string, string> = {
  lt50ms: '<50ms',
  '50-100ms': '50-100ms',
  lt100ms: '<100ms', // 兼容旧版后端
  '100-500ms': '100-500ms',
  '500ms-1s': '500ms-1s',
  gt1s: '>1s',
};

// ==================== 组件定义 ====================

const ApiAnalysisPage: React.FC = () => {
  // 日期筛选状态
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    dayjs().subtract(7, 'days'),
    dayjs(),
  ]);
  const [loading, setLoading] = useState(true);

  // 数据状态
  const [overviewData, setOverviewData] = useState<OverviewData>({});
  const [trendData, setTrendData] = useState<TrendData>({});
  const [interfaceData, setInterfaceData] = useState<InterfaceData[]>([]);
  const [userData, setUserData] = useState<UserData[]>([]);
  const [statusCodeData, setStatusCodeData] = useState<StatusCodeData>({});
  const [ipData, setIpData] = useState<IpData[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData>({});
  const [hourlyData, setHourlyData] = useState<HourlyData>({});

  // 展开/收起状态
  const [expandedCharts, setExpandedCharts] = useState<Record<string, boolean>>({
    interface: false,
    user: false,
    statusCode: false,
    ip: false,
    performance: false,
    hourly: false,
  });

  // 获取筛选参数
  const getParams = () => ({
    startDate: dateRange[0]?.format('YYYY-MM-DD'),
    endDate: dateRange[1]?.format('YYYY-MM-DD'),
  });

  // 加载所有数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = getParams();
        const [
          resOverview,
          resTrend,
          resInterface,
          resUser,
          resStatusCode,
          resIp,
          resPerformance,
          resHourly,
        ] = await Promise.all([
          getOverview(params),
          getTrend({ ...params, type: 'daily' }),
          getByInterface({ ...params, limit: 20 }),
          getByUser({ ...params, limit: 20 }),
          getByStatusCode(params),
          getByIp({ ...params, limit: 20 }),
          getPerformance({ ...params, limit: 10 }),
          getHourly(params),
        ]);

        if (resOverview.code === '200') setOverviewData(resOverview.body || {});
        if (resTrend.code === '200') setTrendData(resTrend.body || {});
        if (resInterface.code === '200') setInterfaceData(resInterface.body || []);
        if (resUser.code === '200') setUserData(resUser.body || []);
        if (resStatusCode.code === '200') setStatusCodeData(resStatusCode.body || {});
        if (resIp.code === '200') setIpData(resIp.body || []);
        if (resPerformance.code === '200') setPerformanceData(resPerformance.body || {});
        if (resHourly.code === '200') setHourlyData(resHourly.body || {});
      } catch (error) {
        console.error('Failed to fetch analysis data:', error);
        message.error('加载数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  // 切换展开/收起
  const toggleExpand = (key: string) => {
    setExpandedCharts((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // 日期变化处理
  const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates) {
      setDateRange(dates);
    }
  };

  // ==================== 图表配置 ====================

  // 调用量趋势图配置
  const volumeTrendConfig = useMemo(() => ({
    data: trendData.volumeTrend || [],
    xField: 'date',
    yField: 'count',
    smooth: true,
    height: 280,
    color: '#1890ff',
    point: { size: 2, shape: 'circle' },
    area: { style: { fill: 'l(270) 0:#ffffff 1:#1890ff20' } },
  }), [trendData.volumeTrend]);

  // 响应时间趋势图配置
  const timeTrendConfig = useMemo(() => ({
    data: trendData.timeTrend || [],
    xField: 'date',
    yField: 'avgTime',
    smooth: true,
    height: 280,
    color: '#52c41a',
    point: { size: 2, shape: 'circle' },
    area: { style: { fill: 'l(270) 0:#ffffff 1:#52c41a20' } },
  }), [trendData.timeTrend]);

  // 接口调用排行配置（条形图）
  const interfaceChartConfig = useMemo(() => {
    const chartData = interfaceData.slice(0, 10).map((item, index) => ({
      index: String(index + 1),
      name: item.interface,
      value: item.callCount,
    }));
    const maxValue = Math.max(...(chartData.map((item) => item.value) || [0]));
    return {
      data: chartData,
      xField: 'name',
      yField: 'value',
      color: '#1890ff',
      height: 280,
      label: {
        text: 'value',
        textAlign: (d: any) => (d.value > maxValue * 0.5 ? 'right' : 'start'),
        fill: (d: any) => (d.value > maxValue * 0.5 ? '#fff' : '#000'),
        dx: (d: any) => (d.value > maxValue * 0.5 ? -5 : 5),
      },
      coordinate: { transform: [{ type: 'transpose' }] },
      style: { maxWidth: 40 },
    };
  }, [interfaceData]);

  // 响应码分布配置
  const statusCodeConfig = useMemo(() => ({
    data: (statusCodeData.distribution || []).map((item) => ({
      type: item.statusCode.toString(),
      value: item.count,
    })),
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.6,
    height: 280,
    label: { text: 'value', position: 'outside' as const },
    legend: { position: 'bottom' as const },
    color: ['#52c41a', '#1890ff', '#faad14', '#ff4d4f', '#722ed1'],
  }), [statusCodeData.distribution]);

  // 用户调用排行配置（水平条形图）
  const userChartConfig = useMemo(() => {
    const maxValue = Math.max(...(userData.slice(0, 10).map((item) => item.callCount) || [0]));
    return {
      data: (userData.slice(0, 10) as any[]).map((item) => ({
        name: item.userId,
        value: item.callCount,
      })),
      xField: 'name',
      yField: 'value',
      color: '#13c2c2',
      height: 280,
      label: {
        text: 'value',
        textAlign: (d: any) => (d.value > maxValue * 0.5 ? 'right' : 'start'),
        fill: (d: any) => (d.value > maxValue * 0.5 ? '#fff' : '#000'),
        dx: (d: any) => (d.value > maxValue * 0.5 ? -5 : 5),
      },
      coordinate: { transform: [{ type: 'transpose' }] },
      style: { maxWidth: 40 },
    };
  }, [userData]);

  // IP调用排行配置（条形图）
  const ipChartConfig = useMemo(() => {
    const maxValue = Math.max(...(ipData.slice(0, 10).map((item) => item.callCount) || [0]));
    return {
      data: (ipData.slice(0, 10) as any[]).map((item) => ({
        name: item.ip,
        value: item.callCount,
      })),
      xField: 'name',
      yField: 'value',
      color: '#722ed1',
      height: 280,
      label: {
        text: 'value',
        textAlign: (d: any) => (d.value > maxValue * 0.5 ? 'right' : 'start'),
        fill: (d: any) => (d.value > maxValue * 0.5 ? '#fff' : '#000'),
        dx: (d: any) => (d.value > maxValue * 0.5 ? -5 : 5),
      },
      coordinate: { transform: [{ type: 'transpose' }] },
      style: { maxWidth: 40 },
    };
  }, [ipData]);

  // 响应时间分布配置（条形图）
  const timeDistConfig = useMemo(() => {
    const chartData = (performanceData.timeDistribution || []).map((item) => ({
      category: timeCategoryMap[item.category] || item.category,
      value: item.count,
    }));
    const maxValue = Math.max(...(chartData.map((item) => item.value) || [0]));
    return {
      data: chartData,
      xField: 'category',
      yField: 'value',
      color: '#fa8c16',
      height: 280,
      label: {
        text: 'value',
        textAlign: (d: any) => (d.value > maxValue * 0.5 ? 'right' : 'start'),
        fill: (d: any) => (d.value > maxValue * 0.5 ? '#fff' : '#000'),
        dx: (d: any) => (d.value > maxValue * 0.5 ? -5 : 5),
      },
      coordinate: { transform: [{ type: 'transpose' }] },
      style: { maxWidth: 40 },
    };
  }, [performanceData.timeDistribution]);

  // 24小时分布配置
  const hourlyConfig = useMemo(() => ({
    data: (hourlyData.hourlyDistribution || []).map((item) => ({
      hour: `${item.hour}:00`,
      value: item.count,
    })),
    xField: 'hour',
    yField: 'value',
    smooth: true,
    color: '#1890ff',
    height: 280,
    point: { size: 2, shape: 'circle' },
    area: { style: { fill: 'l(270) 0:#ffffff 1:#1890ff20' } },
  }), [hourlyData.hourlyDistribution]);

  // ==================== 表格列定义 ====================

  // 接口统计表格列
  const interfaceColumns: ColumnsType<InterfaceData> = [
    { title: '接口地址', dataIndex: 'interface', key: 'interface', ellipsis: true, width: 200 },
    { title: '调用次数', dataIndex: 'callCount', key: 'callCount', sorter: (a, b) => a.callCount - b.callCount },
    { title: '平均响应(ms)', dataIndex: 'avgTime', key: 'avgTime', sorter: (a, b) => a.avgTime - b.avgTime },
    { title: '最大响应(ms)', dataIndex: 'maxTime', key: 'maxTime' },
    { title: '最小响应(ms)', dataIndex: 'minTime', key: 'minTime' },
    { title: '错误次数', dataIndex: 'errorCount', key: 'errorCount', render: (val) => val > 0 ? <Tag color="red">{val}</Tag> : val },
    { title: '错误率(%)', dataIndex: 'errorRate', key: 'errorRate', render: (val) => parseFloat(val) > 5 ? <Tag color="orange">{val}%</Tag> : `${val}%` },
    { title: '最后调用', dataIndex: 'lastCallTime', key: 'lastCallTime', render: (val) => val ? dayjs(val).format('MM-DD HH:mm') : '-' },
  ];

  // 用户统计表格列
  const userColumns: ColumnsType<UserData> = [
    { title: '用户ID', dataIndex: 'userId', key: 'userId', ellipsis: true },
    { title: '调用次数', dataIndex: 'callCount', key: 'callCount', sorter: (a, b) => a.callCount - b.callCount },
    { title: '平均响应(ms)', dataIndex: 'avgTime', key: 'avgTime', sorter: (a, b) => a.avgTime - b.avgTime },
    { title: '首次访问', dataIndex: 'firstCallTime', key: 'firstCallTime', render: (val) => val ? dayjs(val).format('YYYY-MM-DD HH:mm') : '-' },
    { title: '最后访问', dataIndex: 'lastCallTime', key: 'lastCallTime', render: (val) => val ? dayjs(val).format('YYYY-MM-DD HH:mm') : '-' },
  ];

  // IP统计表格列
  const ipColumns: ColumnsType<IpData> = [
    { title: 'IP地址', dataIndex: 'ip', key: 'ip' },
    { title: '调用次数', dataIndex: 'callCount', key: 'callCount', sorter: (a, b) => a.callCount - b.callCount },
    { title: '用户数', dataIndex: 'userCount', key: 'userCount' },
    { title: '接口数', dataIndex: 'apiCount', key: 'apiCount' },
  ];

  // 慢接口表格列
  const slowInterfaceColumns: ColumnsType<PerformanceData['slowInterfaces']> = [
    { title: '排名', key: 'rank', width: 60, render: (_, __, index) => index + 1 },
    { title: '接口地址', dataIndex: 'interface', key: 'interface', ellipsis: true, width: 200 },
    { title: '平均响应(ms)', dataIndex: 'avgTime', key: 'avgTime', sorter: (a, b) => (a?.avgTime || 0) - (b?.avgTime || 0) },
    { title: '最大响应(ms)', dataIndex: 'maxTime', key: 'maxTime' },
    { title: '调用次数', dataIndex: 'callCount', key: 'callCount' },
  ];

  // 错误详情表格列
  const errorDetailColumns: ColumnsType<StatusCodeData['errorDetails']> = [
    { title: '接口', dataIndex: 'interface', key: 'interface', ellipsis: true, width: 150 },
    { title: '状态码', dataIndex: 'statusCode', key: 'statusCode', render: (val) => <Tag color={val >= 500 ? 'red' : 'orange'}>{val}</Tag> },
    { title: '用户', dataIndex: 'userId', key: 'userId' },
    { title: 'IP', dataIndex: 'ip', key: 'ip' },
    { title: '调用时间', dataIndex: 'callTime', key: 'callTime', render: (val) => val ? dayjs(val).format('MM-DD HH:mm:ss') : '-' },
    { title: '响应时间(ms)', dataIndex: 'responseTime', key: 'responseTime' },
  ];

  // ==================== 渲染 ====================

  return (
    <div style={{ padding: '16px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 页面标题和日期筛选 */}
      <ProCard style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle" wrap>
          <Col>
            <Text strong style={{ fontSize: 18 }}>API 日志分析监控大屏</Text>
          </Col>
          <Col>
            <Space>
              <Text>日期范围：</Text>
              <RangePicker
                value={dateRange}
                onChange={handleDateChange}
                allowClear={false}
                disabledDate={(current) => current && current > dayjs().endOf('day')}
              />
            </Space>
          </Col>
        </Row>
      </ProCard>

      {/* 核心指标卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={8} lg={4}>
          <StatisticCard statistic={{ title: '总调用次数', value: overviewData.totalCalls || 0, prefix: <ArrowUpOutlined /> }} />
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <StatisticCard statistic={{ title: '日均调用量', value: overviewData.dailyAvg || 0 }} />
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <StatisticCard statistic={{ title: '平均响应时间', value: overviewData.avgResponseTime || 0, suffix: 'ms' }} />
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <StatisticCard statistic={{ title: '接口数量', value: overviewData.apiCount || 0 }} />
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <StatisticCard statistic={{ title: '用户数', value: overviewData.userCount || 0 }} />
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <StatisticCard
            statistic={{
              title: '错误率',
              value: overviewData.errorRate || 0,
              suffix: '%',
              prefix: (overviewData.errorRate || 0) > 5 ? <ArrowUpOutlined style={{ color: '#ff4d4f' }} /> : null,
              styles: { content: (overviewData.errorRate || 0) > 5 ? { color: '#ff4d4f' } : undefined },
            }}
          />
        </Col>
      </Row>

      {/* 24小时分布 */}
      <ProCard title="24 小时调用量分布" style={{ marginBottom: 16 }} extra={
        <>
          {hourlyData.peakHour && <Text type="secondary">高峰时段: {hourlyData.peakHour.hour}:00 ({hourlyData.peakHour.count} 次)</Text>}
          <Button type="link" icon={<TableOutlined />} onClick={() => toggleExpand('hourly')} style={{ marginLeft: 16 }}>
            {expandedCharts.hourly ? '收起数据' : '查看数据'}
          </Button>
        </>
      } loading={loading}>
        {hourlyData.hourlyDistribution?.length ? (
          <>
            <Line {...hourlyConfig} />
            {expandedCharts.hourly && (
              <Table
                dataSource={hourlyData.hourlyDistribution}
                columns={[
                  { title: '时段', dataIndex: 'hour', key: 'hour' },
                  { title: '调用次数', dataIndex: 'count', key: 'count' },
                ]}
                pagination={false}
                size="small"
                style={{ marginTop: 16 }}
                rowKey="hour"
              />
            )}
          </>
        ) : <Empty description="暂无数据" />}
      </ProCard>

      {/* 趋势分析 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={12}>
          <ProCard title="调用量趋势" extra={<Button type="link" icon={<TableOutlined />} onClick={() => toggleExpand('volumeTrend')}>
            {expandedCharts.volumeTrend ? '收起数据' : '查看数据'}
          </Button>} loading={loading}>
            {trendData.volumeTrend?.length ? (
              <>
                <Line {...volumeTrendConfig} />
                {expandedCharts.volumeTrend && (
                  <Table
                    dataSource={trendData.volumeTrend}
                    columns={[{ title: '日期', dataIndex: 'date' }, { title: '调用次数', dataIndex: 'count' }]}
                    pagination={false}
                    size="small"
                    style={{ marginTop: 16 }}
                    rowKey="date"
                  />
                )}
              </>
            ) : <Empty description="暂无数据" />}
          </ProCard>
        </Col>
        <Col xs={24} lg={12}>
          <ProCard title="响应时间趋势" extra={<Button type="link" icon={<TableOutlined />} onClick={() => toggleExpand('timeTrend')}>
            {expandedCharts.timeTrend ? '收起数据' : '查看数据'}
          </Button>} loading={loading}>
            {trendData.timeTrend?.length ? (
              <>
                <Line {...timeTrendConfig} />
                {expandedCharts.timeTrend && (
                  <Table
                    dataSource={trendData.timeTrend}
                    columns={[{ title: '日期', dataIndex: 'date' }, { title: '平均响应时间(ms)', dataIndex: 'avgTime' }]}
                    pagination={false}
                    size="small"
                    style={{ marginTop: 16 }}
                    rowKey="date"
                  />
                )}
              </>
            ) : <Empty description="暂无数据" />}
          </ProCard>
        </Col>
      </Row>

      {/* 接口统计和响应码分布 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={12}>
          <ProCard title="TOP 接口调用排行" extra={<Button type="link" icon={<TableOutlined />} onClick={() => toggleExpand('interface')}>
            {expandedCharts.interface ? '收起数据' : '查看数据'}
          </Button>} loading={loading}>
            {interfaceData.length ? (
              <>
                <Column {...interfaceChartConfig} />
                {expandedCharts.interface && (
                  <Table
                    dataSource={interfaceData}
                    columns={interfaceColumns}
                    pagination={false}
                    size="small"
                    style={{ marginTop: 16 }}
                    rowKey="interface"
                  />
                )}
              </>
            ) : <Empty description="暂无数据" />}
          </ProCard>
        </Col>
        <Col xs={24} lg={12}>
          <ProCard title="响应码分布" extra={<Button type="link" icon={<TableOutlined />} onClick={() => toggleExpand('statusCode')}>
            {expandedCharts.statusCode ? '收起数据' : '查看数据'}
          </Button>} loading={loading}>
            {statusCodeData.distribution?.length ? (
              <>
                <Pie {...statusCodeConfig} />
                {expandedCharts.statusCode && (
                  <>
                    <Table
                      title={() => '错误详情'}
                      dataSource={statusCodeData.errorDetails?.slice(0, 10) || []}
                      columns={errorDetailColumns}
                      pagination={false}
                      size="small"
                      style={{ marginTop: 16 }}
                      rowKey={(record) => `${record.callTime}-${record.interface}`}
                    />
                  </>
                )}
              </>
            ) : <Empty description="暂无数据" />}
          </ProCard>
        </Col>
      </Row>

      {/* 用户统计和IP统计 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={12}>
          <ProCard title="TOP 用户调用排行" extra={<Button type="link" icon={<TableOutlined />} onClick={() => toggleExpand('user')}>
            {expandedCharts.user ? '收起数据' : '查看数据'}
          </Button>} loading={loading}>
            {userData.length ? (
              <>
                <Column {...userChartConfig} />
                {expandedCharts.user && (
                  <Table
                    dataSource={userData}
                    columns={userColumns}
                    pagination={false}
                    size="small"
                    style={{ marginTop: 16 }}
                    rowKey="userId"
                  />
                )}
              </>
            ) : <Empty description="暂无数据" />}
          </ProCard>
        </Col>
        <Col xs={24} lg={12}>
          <ProCard title="TOP IP 调用排行" extra={<Button type="link" icon={<TableOutlined />} onClick={() => toggleExpand('ip')}>
            {expandedCharts.ip ? '收起数据' : '查看数据'}
          </Button>} loading={loading}>
            {ipData.length ? (
              <>
                <Column {...ipChartConfig} />
                {expandedCharts.ip && (
                  <Table
                    dataSource={ipData}
                    columns={ipColumns}
                    pagination={false}
                    size="small"
                    style={{ marginTop: 16 }}
                    rowKey="ip"
                  />
                )}
              </>
            ) : <Empty description="暂无数据" />}
          </ProCard>
        </Col>
      </Row>

      {/* 性能分析和响应时间分布 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={12}>
          <ProCard title="慢接口 TOP 排行" extra={<Button type="link" icon={<TableOutlined />} onClick={() => toggleExpand('slowInterface')}>
            {expandedCharts.slowInterface ? '收起数据' : '查看数据'}
          </Button>} loading={loading}>
            {performanceData.slowInterfaces?.length ? (
              <>
                <Table
                  dataSource={performanceData.slowInterfaces}
                  columns={slowInterfaceColumns}
                  pagination={false}
                  size="small"
                  rowKey="interface"
                />
              </>
            ) : <Empty description="暂无数据" />}
          </ProCard>
        </Col>
        <Col xs={24} lg={12}>
          <ProCard title="响应时间分布" extra={<Button type="link" icon={<TableOutlined />} onClick={() => toggleExpand('timeDist')}>
            {expandedCharts.timeDist ? '收起详情' : '查看详情'}
          </Button>} loading={loading}>
            {performanceData.timeDistribution?.length ? (
              <>
                <Column {...timeDistConfig} />
                {expandedCharts.timeDist && (
                  <Table
                    dataSource={performanceData.timeDistribution}
                    columns={[
                      { title: '响应时间', dataIndex: 'category', key: 'category', render: (val) => timeCategoryMap[val] || val },
                      { title: '请求数量', dataIndex: 'count', key: 'count' },
                    ]}
                    pagination={false}
                    size="small"
                    style={{ marginTop: 16 }}
                    rowKey="category"
                  />
                )}
              </>
            ) : <Empty description="暂无数据" />}
          </ProCard>
        </Col>
      </Row>
    </div>
  );
};

export default ApiAnalysisPage;
