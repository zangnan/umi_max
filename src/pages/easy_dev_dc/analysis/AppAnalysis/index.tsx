import React, { useState, useEffect, useMemo } from 'react';
import { DatePicker, Row, Col, Table, Button, Tag, Typography, Space, message, Empty } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TimeRangePickerProps } from 'antd';
import { Line, Pie, Column } from '@ant-design/plots';
import ProCard from '@ant-design/pro-card';
import { StatisticCard } from '@ant-design/pro-components';
import { ArrowUpOutlined, TableOutlined, WarningOutlined, InfoCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import {
  getOverview,
  getLevelDistribution,
  getTrend,
  getErrorCodes,
  getByIp,
  getByUrl,
  getHourlyDistribution,
  getWeeklyDistribution,
} from '@/services/apiAppLog';

const { RangePicker } = DatePicker;
const { Text } = Typography;
const { Statistic } = StatisticCard;

// ==================== 日期快捷选项 ====================
const datePresets: TimeRangePickerProps['presets'] = [
  { label: '今天', value: [dayjs().startOf('day'), dayjs()] },
  { label: '最近7天', value: [dayjs().subtract(7, 'days'), dayjs()] },
  { label: '最近14天', value: [dayjs().subtract(14, 'days'), dayjs()] },
  { label: '最近30天', value: [dayjs().subtract(30, 'days'), dayjs()] },
  { label: '最近90天', value: [dayjs().subtract(90, 'days'), dayjs()] },
];

// ==================== 类型定义 ====================

interface OverviewData {
  totalCount?: number;
  todayCount?: number;
  errorCount?: number;
  warnCount?: number;
  infoCount?: number;
  errorRate?: number;
  trendData?: { date: string; total: number; error: number; warn: number }[];
}

interface LevelDistributionData {
  level: string;
  count: number;
  percentage: number;
}

interface TrendData {
  trend?: { time: string; total: number; info: number; warn: number; error: number }[];
}

interface ErrorCodeData {
  errorCode: string;
  count: number;
  firstTime: string;
  lastTime: string;
}

interface IpData {
  ip: string;
  totalCount: number;
  errorCount: number;
  warnCount: number;
  firstTime: string;
}

interface UrlData {
  url: string;
  totalCount: number;
  errorCount: number;
  warnCount: number;
}

interface HourlyData {
  hourlyDistribution?: { hour: number; total: number; error: number; warn: number }[];
  peakHour?: { hour: number; count: number };
}

interface WeeklyData {
  distribution?: { dayOfWeek: number; dayName: string; total: number; error: number; warn: number }[];
}

// ==================== 组件定义 ====================

const AppAnalysisPage: React.FC = () => {
  // 日期筛选状态
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    dayjs().subtract(7, 'days'),
    dayjs(),
  ]);
  const [loading, setLoading] = useState(true);

  // 数据状态
  const [overviewData, setOverviewData] = useState<OverviewData>({});
  const [levelDistributionData, setLevelDistributionData] = useState<LevelDistributionData[]>([]);
  const [trendData, setTrendData] = useState<TrendData>({});
  const [errorCodesData, setErrorCodesData] = useState<ErrorCodeData[]>([]);
  const [ipData, setIpData] = useState<IpData[]>([]);
  const [urlData, setUrlData] = useState<UrlData[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyData>({});
  const [weeklyData, setWeeklyData] = useState<WeeklyData>({});

  // 展开/收起状态
  const [expandedCharts, setExpandedCharts] = useState<Record<string, boolean>>({
    overview: false,
    levelDistribution: false,
    trend: false,
    errorCodes: false,
    ip: false,
    url: false,
    hourly: false,
    weekly: false,
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
          resLevelDistribution,
          resTrend,
          resErrorCodes,
          resIp,
          resUrl,
          resHourly,
          resWeekly,
        ] = await Promise.all([
          getOverview(params),
          getLevelDistribution(params),
          getTrend({ ...params, type: 'daily' }),
          getErrorCodes({ ...params, limit: 10 }),
          getByIp({ ...params, limit: 10 }),
          getByUrl({ ...params, limit: 10 }),
          getHourlyDistribution(params),
          getWeeklyDistribution(params),
        ]);

        if (resOverview.code === '200') setOverviewData(resOverview.body || {});
        if (resLevelDistribution.code === '200') setLevelDistributionData(resLevelDistribution.body || []);
        if (resTrend.code === '200') setTrendData(resTrend.body || {});
        if (resErrorCodes.code === '200') setErrorCodesData(resErrorCodes.body || []);
        if (resIp.code === '200') setIpData(resIp.body || []);
        if (resUrl.code === '200') setUrlData(resUrl.body || []);
        if (resHourly.code === '200') setHourlyData(resHourly.body || {});
        if (resWeekly.code === '200') setWeeklyData(resWeekly.body || {});
      } catch (error) {
        console.error('Failed to fetch app log analysis data:', error);
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

  // 近7天趋势迷你折线图配置
  const trendMiniConfig = useMemo(() => ({
    data: overviewData.trendData || [],
    xField: 'date',
    yField: 'total',
    smooth: true,
    height: 100,
    color: '#1890ff',
    point: { size: 1 },
    line: { size: 1 },
  }), [overviewData.trendData]);

  // 级别分布饼图配置
  const levelPieConfig = useMemo(() => ({
    data: levelDistributionData.map((item) => ({
      type: item.level,
      value: item.count,
    })),
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.6,
    height: 280,
    label: { text: 'value', position: 'outside' as const },
    legend: { position: 'bottom' as const },
    color: ['#52c41a', '#faad14', '#ff4d4f'],
  }), [levelDistributionData]);

  // 日志趋势图配置
  const trendConfig = useMemo(() => ({
    data: trendData.trend || [],
    xField: 'time',
    yField: 'total',
    smooth: true,
    height: 280,
    color: '#1890ff',
    point: { size: 2, shape: 'circle' },
    area: { style: { fill: 'l(270) 0:#ffffff 1:#1890ff20' } },
  }), [trendData.trend]);

  // 错误码 TOP10 配置
  const errorCodesConfig = useMemo(() => {
    const chartData = errorCodesData.slice(0, 10).map((item, index) => ({
      index: String(index + 1),
      name: item.errorCode,
      value: item.count,
    }));
    const maxValue = Math.max(...(chartData.map((item) => item.value) || [0]));
    return {
      data: chartData,
      xField: 'name',
      yField: 'value',
      color: '#ff4d4f',
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
  }, [errorCodesData]);

  // IP 分布配置（过滤 errorCount 为 0 的数据）
  const ipChartConfig = useMemo(() => {
    const filteredData = ipData.filter((item) => item.errorCount > 0);
    const chartData = filteredData.slice(0, 10).map((item) => ({
      name: item.ip,
      value: item.errorCount,
    }));
    const maxValue = Math.max(...(chartData.map((item) => item.value) || [0]));
    return {
      data: chartData,
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

  // URL 分布配置
  // URL 分布配置（过滤 errorCount 为 0 的数据）
  const urlChartConfig = useMemo(() => {
    // const chartData = urlData.slice(0, 10).map((item) => ({
    //   name: item.url.length > 30 ? item.url.substring(0, 30) + '...' : item.url,
    //   value: item.totalCount,
    // }));
    const filteredData = urlData.filter((item) => item.errorCount > 0);
    const chartData = filteredData.map((item) => ({
      name: item.url,
      value: item.errorCount,
    }));
    const maxValue = Math.max(...(chartData.map((item) => item.value) || [0]));
    return {
      data: chartData,
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
  }, [urlData]);

  // 24小时分布配置
  const hourlyConfig = useMemo(() => ({
    data: (hourlyData.hourlyDistribution || []).map((item) => ({
      hour: `${item.hour}:00`,
      value: item.total,
      error: item.error,
      warn: item.warn,
    })),
    xField: 'hour',
    yField: 'value',
    color: '#1890ff',
    height: 280,
    label: false,
  }), [hourlyData.hourlyDistribution]);

  // 星期分布配置
  const weeklyConfig = useMemo(() => ({
    data: (weeklyData.distribution || []).map((item) => ({
      day: item.dayName,
      value: item.total,
      error: item.error,
      warn: item.warn,
    })),
    xField: 'day',
    yField: 'value',
    color: '#fa8c16',
    height: 280,
    label: false,
  }), [weeklyData.distribution]);

  // ==================== 表格列定义 ====================

  // 错误码表格列
  const errorCodeColumns: ColumnsType<ErrorCodeData> = [
    { title: '错误码', dataIndex: 'errorCode', key: 'errorCode' },
    { title: '出现次数', dataIndex: 'count', key: 'count', sorter: (a, b) => a.count - b.count },
    { title: '首次出现', dataIndex: 'firstTime', key: 'firstTime', render: (val) => val ? dayjs(val).format('MM-DD HH:mm') : '-' },
    { title: '最后出现', dataIndex: 'lastTime', key: 'lastTime', render: (val) => val ? dayjs(val).format('MM-DD HH:mm') : '-' },
  ];

  // IP 统计表格列
  const ipColumns: ColumnsType<IpData> = [
    { title: 'IP地址', dataIndex: 'ip', key: 'ip' },
    { title: '日志总量', dataIndex: 'totalCount', key: 'totalCount', sorter: (a, b) => a.totalCount - b.totalCount },
    { title: 'ERROR 数', dataIndex: 'errorCount', key: 'errorCount', render: (val) => val > 0 ? <Tag color="red">{val}</Tag> : val },
    { title: 'WARN 数', dataIndex: 'warnCount', key: 'warnCount', render: (val) => val > 0 ? <Tag color="orange">{val}</Tag> : val },
    { title: '首次日志', dataIndex: 'firstTime', key: 'firstTime', render: (val) => val ? dayjs(val).format('MM-DD HH:mm') : '-' },
  ];

  // URL 统计表格列
  const urlColumns: ColumnsType<UrlData> = [
    { title: '请求URL', dataIndex: 'url', key: 'url', ellipsis: true, width: 250 },
    { title: '日志总量', dataIndex: 'totalCount', key: 'totalCount', sorter: (a, b) => a.totalCount - b.totalCount },
    { title: 'ERROR 数', dataIndex: 'errorCount', key: 'errorCount', render: (val) => val > 0 ? <Tag color="red">{val}</Tag> : val },
    { title: 'WARN 数', dataIndex: 'warnCount', key: 'warnCount', render: (val) => val > 0 ? <Tag color="orange">{val}</Tag> : val },
  ];

  // 24小时分布表格列
  const hourlyColumns = [
    { title: '时段', dataIndex: 'hour', key: 'hour' },
    { title: '总量', dataIndex: 'total', key: 'total' },
    { title: 'ERROR', dataIndex: 'error', key: 'error' },
    { title: 'WARN', dataIndex: 'warn', key: 'warn' },
  ];

  // 星期分布表格列
  const weeklyColumns = [
    { title: '星期', dataIndex: 'dayName', key: 'dayName' },
    { title: '总量', dataIndex: 'total', key: 'total' },
    { title: 'ERROR', dataIndex: 'error', key: 'error' },
    { title: 'WARN', dataIndex: 'warn', key: 'warn' },
  ];

  // ==================== 渲染 ====================

  return (
    <div style={{ padding: '16px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 页面标题和日期筛选 */}
      <ProCard style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle" wrap>
          <Col>
            <Text strong style={{ fontSize: 18 }}>应用日志分析监控大屏</Text>
          </Col>
          <Col>
            <Space>
              <Text>日期范围：</Text>
              <RangePicker
                value={dateRange}
                onChange={handleDateChange}
                allowClear={false}
                presets={datePresets}
                disabledDate={(current) => current && current > dayjs().endOf('day')}
              />
            </Space>
          </Col>
        </Row>
      </ProCard>

      {/* 核心指标卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={8} lg={4}>
          <StatisticCard
            statistic={{
              title: 'ERROR',
              value: overviewData.errorCount || 0,
              prefix: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
              styles: { content: { color: '#ff4d4f' } },
            }}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <StatisticCard
            statistic={{
              title: 'WARN',
              value: overviewData.warnCount || 0,
              prefix: <WarningOutlined style={{ color: '#faad14' }} />,
              styles: { content: { color: '#faad14' } },
            }}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <StatisticCard
            statistic={{
              title: 'INFO',
              value: overviewData.infoCount || 0,
              prefix: <InfoCircleOutlined style={{ color: '#52c41a' }} />,
              styles: { content: { color: '#52c41a' } },
            }}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <StatisticCard
            statistic={{
              title: '日志总量',
              value: overviewData.totalCount || 0,
            }}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
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

      {/* 日志级别分布和趋势分析 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={12}>
          <ProCard
            title="日志级别分布"
            extra={
              <Button type="link" icon={<TableOutlined />} onClick={() => toggleExpand('levelDistribution')}>
                {expandedCharts.levelDistribution ? '收起数据' : '查看数据'}
              </Button>
            }
            loading={loading}
          >
            {levelDistributionData.length ? (
              <>
                <Pie {...levelPieConfig} />
                {expandedCharts.levelDistribution && (
                  <Table
                    dataSource={levelDistributionData}
                    columns={[
                      { title: '级别', dataIndex: 'level', key: 'level' },
                      { title: '数量', dataIndex: 'count', key: 'count' },
                      { title: '占比(%)', dataIndex: 'percentage', key: 'percentage' },
                    ]}
                    pagination={false}
                    size="small"
                    style={{ marginTop: 16 }}
                    rowKey="level"
                  />
                )}
              </>
            ) : <Empty description="暂无数据" />}
          </ProCard>
        </Col>
        <Col xs={24} lg={12}>
          <ProCard
            title="日志趋势分析"
            extra={
              <Button type="link" icon={<TableOutlined />} onClick={() => toggleExpand('trend')}>
                {expandedCharts.trend ? '收起数据' : '查看数据'}
              </Button>
            }
            loading={loading}
          >
            {trendData.trend?.length ? (
              <>
                <Line {...trendConfig} />
                {expandedCharts.trend && (
                  <Table
                    dataSource={trendData.trend}
                    columns={[
                      { title: '时间', dataIndex: 'time', key: 'time' },
                      { title: '总量', dataIndex: 'total', key: 'total' },
                      { title: 'INFO', dataIndex: 'info', key: 'info' },
                      { title: 'WARN', dataIndex: 'warn', key: 'warn' },
                      { title: 'ERROR', dataIndex: 'error', key: 'error' },
                    ]}
                    pagination={false}
                    size="small"
                    style={{ marginTop: 16 }}
                    rowKey="time"
                  />
                )}
              </>
            ) : <Empty description="暂无数据" />}
          </ProCard>
        </Col>
      </Row>

      {/* 错误分析 - ERROR 错误码 TOP10 */}
      <ProCard
        title="ERROR 错误码 TOP10"
        style={{ marginBottom: 16 }}
        extra={
          <Button type="link" icon={<TableOutlined />} onClick={() => toggleExpand('errorCodes')}>
            {expandedCharts.errorCodes ? '收起数据' : '查看数据'}
          </Button>
        }
        loading={loading}
      >
        {errorCodesData.length ? (
          <>
            <Column {...errorCodesConfig} />
            {expandedCharts.errorCodes && (
              <Table
                dataSource={errorCodesData}
                columns={errorCodeColumns}
                pagination={false}
                size="small"
                style={{ marginTop: 16 }}
                rowKey="errorCode"
              />
            )}
          </>
        ) : <Empty description="暂无数据" />}
      </ProCard>

      {/* 来源分布 - IP 和 URL */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={12}>
          <ProCard
            title="ERROR TOP IP 来源分布"
            extra={
              <Button type="link" icon={<TableOutlined />} onClick={() => toggleExpand('ip')}>
                {expandedCharts.ip ? '收起数据' : '查看数据'}
              </Button>
            }
            loading={loading}
          >
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
        <Col xs={24} lg={12}>
          <ProCard
            title="ERROR TOP 请求 URL 分布"
            extra={
              <Button type="link" icon={<TableOutlined />} onClick={() => toggleExpand('url')}>
                {expandedCharts.url ? '收起数据' : '查看数据'}
              </Button>
            }
            loading={loading}
          >
            {urlData.length ? (
              <>
                <Column {...urlChartConfig} />
                {expandedCharts.url && (
                  <Table
                    dataSource={urlData}
                    columns={urlColumns}
                    pagination={false}
                    size="small"
                    style={{ marginTop: 16 }}
                    rowKey="url"
                  />
                )}
              </>
            ) : <Empty description="暂无数据" />}
          </ProCard>
        </Col>
      </Row>

      {/* 时间维度分析 - 24小时和星期分布 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={12}>
          <ProCard
            title="24小时分布"
            extra={
              <>
                {hourlyData.peakHour && (
                  <Text type="secondary" style={{ marginRight: 8 }}>
                    高峰时段: {hourlyData.peakHour.hour}:00 ({hourlyData.peakHour.count} 次)
                  </Text>
                )}
                <Button type="link" icon={<TableOutlined />} onClick={() => toggleExpand('hourly')}>
                  {expandedCharts.hourly ? '收起数据' : '查看数据'}
                </Button>
              </>
            }
            loading={loading}
          >
            {hourlyData.hourlyDistribution?.length ? (
              <>
                <Column {...hourlyConfig} />
                {expandedCharts.hourly && (
                  <Table
                    dataSource={hourlyData.hourlyDistribution}
                    columns={hourlyColumns}
                    pagination={false}
                    size="small"
                    style={{ marginTop: 16 }}
                    rowKey="hour"
                  />
                )}
              </>
            ) : <Empty description="暂无数据" />}
          </ProCard>
        </Col>
        <Col xs={24} lg={12}>
          <ProCard
            title="星期分布"
            extra={
              <Button type="link" icon={<TableOutlined />} onClick={() => toggleExpand('weekly')}>
                {expandedCharts.weekly ? '收起数据' : '查看数据'}
              </Button>
            }
            loading={loading}
          >
            {weeklyData.distribution?.length ? (
              <>
                <Column {...weeklyConfig} />
                {expandedCharts.weekly && (
                  <Table
                    dataSource={weeklyData.distribution}
                    columns={weeklyColumns}
                    pagination={false}
                    size="small"
                    style={{ marginTop: 16 }}
                    rowKey="dayOfWeek"
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

export default AppAnalysisPage;
